/**
 * Gemini-backed lead enrichment.
 *
 * We call the Gemini REST endpoint directly from the browser using the
 * owner's personal API key (stored in PortalSettings.geminiApiKey).
 * The portal is single-user behind RLS, so shipping the key to the
 * client is acceptable here — the alternative would be a server-side
 * proxy, which we deliberately don't run.
 *
 * Strategy:
 *   1. We enable the `google_search` tool so Gemini grounds its
 *      answer in live web results instead of stale training data.
 *   2. We instruct the model to respond with strict JSON inside a
 *      ```json fenced block. We strip the fence and JSON.parse it.
 *      Gemini ignores `responseSchema` when grounding tools are
 *      active, so prompt-driven JSON is the most reliable path on
 *      gemini-2.5-flash today.
 *   3. We collect grounded source URLs from `groundingMetadata` so
 *      the user can verify any suggested change before applying it.
 */

export type GeminiModel =
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite"
  | "gemini-2.5-pro";

export const GEMINI_MODELS: { value: GeminiModel; label: string; hint: string }[] = [
  {
    value: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    hint: "Empfohlen — gute Recherche, schnell, günstig.",
  },
  {
    value: "gemini-2.5-flash-lite",
    label: "Gemini 2.5 Flash Lite",
    hint: "Sehr schnell, etwas weniger gründlich.",
  },
  {
    value: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    hint: "Tiefste Recherche, langsamer und teurer.",
  },
];

export const DEFAULT_GEMINI_MODEL: GeminiModel = "gemini-2.5-flash";

export interface LeadEnrichmentInput {
  companyName: string;
  city: string;
  industry?: string;
  serviceArea?: string;
  knownPhone?: string;
  knownWebsite?: string;
  /** A/B/C grade — used to decide whether to ask for a pitch suggestion. */
  leadGrade: "A" | "B" | "C" | "Unknown";
}

export interface LeadEnrichmentResult {
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  openingHours?: string;
  googleRating?: number;
  googleReviewCount?: number;
  social: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
  };
  /** Plain-text bucket suitable for Lead.websiteCheck. */
  websiteCheck?: string;
  /** Free-text rating signal e.g. "4,6 ★ (218 Bewertungen)". */
  ratingSignal?: string;
  /** Pitch suggestion (only requested for B/C leads with an existing website). */
  pitchSuggestion?: string;
  /** Confidence note in case Gemini was unsure or partial. */
  notes?: string;
  /** Distinct source URLs returned by Google grounding. */
  sources: { uri: string; title?: string }[];
}

interface GeminiSource {
  uri: string;
  title?: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    groundingMetadata?: {
      groundingChunks?: Array<{
        web?: { uri?: string; title?: string };
      }>;
      webSearchQueries?: string[];
    };
  }>;
  promptFeedback?: { blockReason?: string };
  error?: { message?: string; status?: string };
}

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export class GeminiError extends Error {
  readonly cause?: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "GeminiError";
    this.cause = cause;
  }
}

function buildPrompt(input: LeadEnrichmentInput): string {
  const wantsPitch =
    input.leadGrade === "B" || input.leadGrade === "C" || input.leadGrade === "Unknown";

  const known: string[] = [];
  if (input.knownPhone) known.push(`Telefon (bekannt): ${input.knownPhone}`);
  if (input.knownWebsite) known.push(`Website (bekannt): ${input.knownWebsite}`);
  if (input.serviceArea) known.push(`Bereich: ${input.serviceArea}`);

  return [
    `Du bist Recherche-Assistent für ein deutsches Webdesign-Studio (MAGICKS, Kassel).`,
    `Recherchiere mit Hilfe der Google-Suche Live-Daten zu folgendem Unternehmen und liefere präzise, verifizierbare Fakten:`,
    ``,
    `**Unternehmen:** ${input.companyName}`,
    `**Stadt:** ${input.city}`,
    input.industry ? `**Branche:** ${input.industry}` : ``,
    known.length > 0 ? `**Bereits bekannt:**\n${known.join("\n")}` : ``,
    ``,
    `**Aufgabe:**`,
    `Verifiziere oder ergänze die offizielle Website, Telefonnummer, E-Mail-Adresse, Geschäftsadresse, Öffnungszeiten, Google-Bewertung (Rating + Anzahl Reviews), sowie Social-Media-Profile (Instagram, Facebook, TikTok, LinkedIn, YouTube).`,
    `Bewerte zusätzlich kurz die Qualität der Website (wenn vorhanden): aktuelles Design, mobile Optimierung, SSL, Geschwindigkeit, Conversion-Elemente.`,
    wantsPitch
      ? `Da dieses Lead als ${input.leadGrade}-Lead eingestuft ist, formuliere wenn eine Website existiert einen kurzen, deutschen Pitch-Vorschlag (max. 2 Sätze) der konkret die Schwachstelle der bestehenden Seite adressiert.`
      : `Kein Pitch-Vorschlag erwünscht.`,
    ``,
    `**Antwortformat — STRIKT diesen JSON-Block, ohne weiteren Text drum herum:**`,
    "```json",
    `{`,
    `  "website": "https://...",                  // null wenn nicht gefunden`,
    `  "phone": "+49 ...",                         // null wenn nicht gefunden`,
    `  "email": "...",                             // null wenn nicht gefunden`,
    `  "address": "Straße Nr, PLZ Stadt",         // null wenn nicht gefunden`,
    `  "openingHours": "Mo–Fr 9–18 Uhr",          // null wenn nicht gefunden`,
    `  "googleRating": 4.6,                        // null wenn nicht gefunden`,
    `  "googleReviewCount": 218,                   // null wenn nicht gefunden`,
    `  "social": {`,
    `    "instagram": "https://instagram.com/...",  // null wenn nicht gefunden`,
    `    "facebook":  "https://facebook.com/...",`,
    `    "tiktok":    null,`,
    `    "linkedin":  null,`,
    `    "youtube":   null`,
    `  },`,
    `  "websiteCheck": "Website schwach – kein SSL, nicht mobil optimiert" oder "Website gut", oder "Keine Website gefunden" oder "Nur Facebook/Instagram"`,
    `  "ratingSignal": "4,6 ★ (218 Google-Bewertungen)" oder null,`,
    wantsPitch
      ? `  "pitchSuggestion": "...",                  // 1–2 Sätze, oder null wenn keine Website`
      : `  "pitchSuggestion": null,`,
    `  "notes": "Ggf. Hinweise zur Sicherheit der Daten, oder null"`,
    `}`,
    "```",
    ``,
    "Wichtig: Nur Werte zurückgeben, die tatsächlich in den Suchergebnissen auftauchen. Bei Unsicherheit `null` setzen statt zu raten.",
  ]
    .filter(Boolean)
    .join("\n");
}

interface RawEnrichment {
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  openingHours?: string | null;
  googleRating?: number | string | null;
  googleReviewCount?: number | string | null;
  social?: Record<string, string | null | undefined> | null;
  websiteCheck?: string | null;
  ratingSignal?: string | null;
  pitchSuggestion?: string | null;
  notes?: string | null;
}

function trim(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const t = value.trim();
  return t.length > 0 && t.toLowerCase() !== "null" ? t : undefined;
}

function num(value: number | string | null | undefined): number | undefined {
  if (value == null) return undefined;
  const n = typeof value === "number" ? value : parseFloat(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

function parseJsonBlock(text: string): RawEnrichment {
  // Try fenced block first.
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  // Find the first `{` … last `}` to be tolerant of stray prose.
  const first = candidate.indexOf("{");
  const last = candidate.lastIndexOf("}");
  if (first < 0 || last < first) {
    throw new GeminiError("Antwort enthält kein JSON-Objekt.");
  }
  const raw = candidate.slice(first, last + 1);
  try {
    return JSON.parse(raw) as RawEnrichment;
  } catch (err) {
    throw new GeminiError("JSON konnte nicht geparst werden.", err);
  }
}

function dedupeSources(sources: GeminiSource[]): GeminiSource[] {
  const seen = new Set<string>();
  const out: GeminiSource[] = [];
  for (const s of sources) {
    if (!s.uri || seen.has(s.uri)) continue;
    seen.add(s.uri);
    out.push(s);
  }
  return out;
}

export async function runLeadEnrichment(
  apiKey: string,
  model: GeminiModel,
  input: LeadEnrichmentInput,
  signal?: AbortSignal,
): Promise<LeadEnrichmentResult> {
  if (!apiKey) throw new GeminiError("Kein Gemini-API-Key konfiguriert.");

  const url = `${BASE_URL}/${model}:generateContent`;
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: buildPrompt(input) }],
      },
    ],
    tools: [{ google_search: {} }],
    generationConfig: {
      temperature: 0.2,
    },
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    throw new GeminiError("Netzwerkfehler beim Aufruf der Gemini-API.", err);
  }

  let payload: GeminiResponse | null = null;
  try {
    payload = (await res.json()) as GeminiResponse;
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const msg =
      payload?.error?.message ?? `Gemini-API antwortete mit HTTP ${res.status}.`;
    throw new GeminiError(msg);
  }

  if (payload?.promptFeedback?.blockReason) {
    throw new GeminiError(
      `Anfrage wurde von Gemini blockiert: ${payload.promptFeedback.blockReason}`,
    );
  }

  const candidate = payload?.candidates?.[0];
  const text = candidate?.content?.parts?.map((p) => p.text ?? "").join("\n") ?? "";
  if (text.trim().length === 0) {
    throw new GeminiError("Leere Antwort von Gemini.");
  }

  const raw = parseJsonBlock(text);
  const sources = dedupeSources(
    (candidate?.groundingMetadata?.groundingChunks ?? [])
      .map((c) => c.web)
      .filter((w): w is { uri: string; title?: string } => Boolean(w?.uri))
      .map((w) => ({ uri: w.uri, title: w.title })),
  );

  return {
    website: trim(raw.website ?? undefined),
    phone: trim(raw.phone ?? undefined),
    email: trim(raw.email ?? undefined),
    address: trim(raw.address ?? undefined),
    openingHours: trim(raw.openingHours ?? undefined),
    googleRating: num(raw.googleRating),
    googleReviewCount: num(raw.googleReviewCount),
    social: {
      instagram: trim(raw.social?.instagram ?? undefined),
      facebook: trim(raw.social?.facebook ?? undefined),
      tiktok: trim(raw.social?.tiktok ?? undefined),
      linkedin: trim(raw.social?.linkedin ?? undefined),
      youtube: trim(raw.social?.youtube ?? undefined),
    },
    websiteCheck: trim(raw.websiteCheck ?? undefined),
    ratingSignal: trim(raw.ratingSignal ?? undefined),
    pitchSuggestion: trim(raw.pitchSuggestion ?? undefined),
    notes: trim(raw.notes ?? undefined),
    sources,
  };
}

/** Quick sanity check — used by the Settings "Verbindung testen" button. */
export async function verifyGeminiKey(
  apiKey: string,
  model: GeminiModel,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!apiKey) return { ok: false, error: "Kein Key angegeben." };
  try {
    const url = `${BASE_URL}/${model}:generateContent`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: "Say OK." }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 10 },
      }),
    });
    if (res.ok) return { ok: true };
    const j = (await res.json().catch(() => null)) as GeminiResponse | null;
    return {
      ok: false,
      error: j?.error?.message ?? `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Netzwerkfehler",
    };
  }
}
