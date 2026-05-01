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
  /** A/B/C grade — steuert Pitch-Tonalitaet und ob Web-Defekt-Karte angefragt wird. */
  leadGrade: "A" | "B" | "C" | "Unknown";
  /** Wenn true und Website bekannt ist, fragt das Prompt zusaetzlich
   * eine strukturierte Web-Defekt-Karte ab. Default: true fuer B/C. */
  includeWebDefects?: boolean;
  /** Wenn true: kompakter Lite-Prompt fuer Bulk-Mode (kein Wettbewerber-
   * Snapshot, keine Web-Defekt-Karte, kuerzere Reviews). Spart 30-40% Tokens. */
  bulkMode?: boolean;
}

export interface LeadCompetitorSuggestion {
  name: string;
  city?: string;
  website?: string;
  hasModernSite?: boolean;
  note?: string;
}

export interface LeadWebDefectsSuggestion {
  ssl?: boolean;
  mobileFriendly?: boolean;
  cms?: string;
  lastUpdate?: string;
  pageSpeed?: "schnell" | "ok" | "langsam";
  cookieBanner?: boolean;
  impressumOk?: boolean;
  hasOnlineBooking?: boolean;
  domainAge?: string;
  notes?: string;
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
  /** Pitch suggestion. Bei A: "Why-Website"-Pitch (Branchen-Probleme).
   *  Bei B/C: "Schwachstellen-Pitch" zur bestehenden Website. */
  pitchSuggestion?: string;
  /** Inhaber:in / Geschaeftsfuehrung. */
  ownerName?: string;
  /** Verfuegt das Unternehmen ueber ein erkennbares Online-Buchungs-Tool? */
  hasOnlineBooking?: boolean;
  /** 3 Kernaussagen aus negativen Bewertungen (kurze Bullets). */
  reviewIssues?: string[];
  /** 1-3 lokale Wettbewerber. */
  competitors?: LeadCompetitorSuggestion[];
  /** Strukturierte Web-Defekt-Karte. Nur bei B/C + Website. */
  webDefects?: LeadWebDefectsSuggestion;
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
  const isA = input.leadGrade === "A";
  const isBOrC =
    input.leadGrade === "B" ||
    input.leadGrade === "C" ||
    input.leadGrade === "Unknown";
  const includeDefects =
    !input.bulkMode &&
    isBOrC &&
    (input.includeWebDefects ?? true) &&
    !!input.knownWebsite;
  const includeCompetitors = !input.bulkMode;

  const known: string[] = [];
  if (input.knownPhone) known.push(`Telefon (bekannt): ${input.knownPhone}`);
  if (input.knownWebsite) known.push(`Website (bekannt): ${input.knownWebsite}`);
  if (input.serviceArea) known.push(`Bereich: ${input.serviceArea}`);

  // Pitch-Anweisung je nach Grade
  const pitchInstruction = isA
    ? `Dieses Lead ist als A eingestuft (hochwertige Branche / hoher Conversion-Wert). Formuliere einen ueberzeugenden, deutschen Pitch (max. 3 saetze), der **konkret erklaert WARUM dieses Unternehmen eine professionelle Website braucht**. Nutze branchenspezifische Argumente: welches Problem in dieser Branche wird durch eine moderne Website geloest? (z.B. Termine ausserhalb Geschaeftszeit verloren, Kunden-Vertrauen vor Erstkontakt, Konkurrenz hat bereits Online-Buchung, Google-Sichtbarkeit, etc.). Mach es kurz, konkret, ohne Floskeln.`
    : `Dieses Lead ist als ${input.leadGrade}-Lead eingestuft. Wenn eine Website existiert: formuliere einen kurzen Pitch (max. 2 saetze), der die konkrete Schwachstelle der bestehenden Seite adressiert. Wenn keine Website existiert: argumentiere kurz warum eine Website jetzt entscheidend ist.`;

  // JSON-Schema je nach Modus
  const schemaLines: string[] = [
    "{",
    `  "website": "https://..." | null,`,
    `  "phone": "+49 ..." | null,`,
    `  "email": "..." | null,`,
    `  "address": "Strasse Nr, PLZ Stadt" | null,`,
    `  "openingHours": "Mo-Fr 9-18 Uhr" | null,`,
    `  "googleRating": 4.6 | null,`,
    `  "googleReviewCount": 218 | null,`,
    `  "social": {`,
    `    "instagram": "https://instagram.com/..." | null,`,
    `    "facebook":  "https://facebook.com/..." | null,`,
    `    "tiktok":    null,`,
    `    "linkedin":  null,`,
    `    "youtube":   null`,
    `  },`,
    `  "websiteCheck": "Website schwach – kein SSL, nicht mobil optimiert" | "Website gut" | "Keine Website gefunden" | "Nur Facebook/Instagram",`,
    `  "ratingSignal": "4,6 Sterne (218 Google-Bewertungen)" | null,`,
    `  "ownerName": "Vorname Nachname (Inhaber:in)" | null,`,
    `  "hasOnlineBooking": true | false | null,`,
    `  "reviewIssues": ["Termin schwer zu bekommen", "keine Online-Buchung", "Personal unfreundlich"] | [] | null,`,
  ];

  if (includeCompetitors) {
    schemaLines.push(
      `  "competitors": [`,
      `    { "name": "...", "city": "...", "website": "https://...", "hasModernSite": true|false, "note": "Online-Buchung vorhanden" } ` +
        `// 1-3 lokale Wettbewerber aus derselben Stadt + Branche`,
      `  ] | [],`,
    );
  } else {
    schemaLines.push(`  "competitors": [],`);
  }

  if (includeDefects) {
    schemaLines.push(
      `  "webDefects": {`,
      `    "ssl": true | false | null,`,
      `    "mobileFriendly": true | false | null,`,
      `    "cms": "WordPress" | "Wix" | "Jimdo" | "Squarespace" | "eigen" | "unbekannt" | null,`,
      `    "lastUpdate": "Copyright 2017" | "Blog letzter Eintrag 2021" | null,`,
      `    "pageSpeed": "schnell" | "ok" | "langsam" | null,`,
      `    "cookieBanner": true | false | null,`,
      `    "impressumOk": true | false | null,`,
      `    "hasOnlineBooking": true | false | null,`,
      `    "domainAge": "Domain seit 2009 registriert" | null,`,
      `    "notes": "Stichpunktartige Zusatzhinweise" | null`,
      `  },`,
    );
  } else {
    schemaLines.push(`  "webDefects": null,`);
  }

  schemaLines.push(
    `  "pitchSuggestion": "..." | null,`,
    `  "notes": "Ggf. Hinweis zur Datenqualitaet" | null`,
    "}",
  );

  const tasks: string[] = [
    "Verifiziere oder ergaenze: offizielle Website, Telefon, E-Mail, Geschaeftsadresse, Oeffnungszeiten, Google-Bewertung (Rating + Anzahl), Social-Media-Profile (Instagram, Facebook, TikTok, LinkedIn, YouTube).",
    "Suche zusaetzlich den Inhaber/Geschaeftsfuehrer-Namen (Impressum, Google Business, IHK, LinkedIn).",
    "Stelle fest, ob die Firma eine erkennbare Online-Buchung / Termin-Tool anbietet.",
    "Sammle 3 Kernaussagen aus negativen Google-Bewertungen (kurze Bullets, KEINE Bewertung des Scores). Wenn keine negativen Reviews vorhanden, leeres Array.",
  ];

  if (includeCompetitors) {
    tasks.push(
      "Identifiziere 1-3 lokale Wettbewerber in derselben Stadt + Branche. Notiere fuer jeden, ob sie eine moderne Website haben.",
    );
  }

  if (includeDefects) {
    tasks.push(
      "Da eine Website existiert und das Lead B/C ist: erstelle eine strukturierte Web-Defekt-Karte (SSL, Mobile, CMS, letztes Update, Speed-Eindruck, Cookie-Banner, Impressum, Online-Buchung, Domain-Alter).",
    );
  } else if (isA) {
    tasks.push(
      "Web-Defekt-Karte fuer A-Leads NICHT noetig (leerer Wert).",
    );
  } else {
    tasks.push(
      "Web-Defekt-Karte nur wenn explizit B/C + Website vorhanden — sonst leer lassen.",
    );
  }

  tasks.push(pitchInstruction);

  return [
    `Du bist Recherche-Assistent fuer ein deutsches Webdesign-Studio (MAGICKS, Kassel).`,
    `Recherchiere mit Google-Suche Live-Daten zum folgenden Unternehmen und liefere praezise, verifizierbare Fakten.`,
    ``,
    `**Unternehmen:** ${input.companyName}`,
    `**Stadt:** ${input.city}`,
    input.industry ? `**Branche:** ${input.industry}` : ``,
    `**Lead-Grade:** ${input.leadGrade}`,
    known.length > 0 ? `**Bereits bekannt:**\n${known.join("\n")}` : ``,
    ``,
    `**Aufgabe:**`,
    ...tasks.map((t, i) => `${i + 1}. ${t}`),
    ``,
    `**Antwortformat — STRIKT dieser JSON-Block, ohne weiteren Text drum herum:**`,
    "```json",
    ...schemaLines,
    "```",
    ``,
    "Wichtig: Nur Werte zurueckgeben, die tatsaechlich in den Suchergebnissen auftauchen. Bei Unsicherheit `null` setzen statt zu raten. Wettbewerber-Liste auf 1-3 echte lokale Konkurrenten begrenzen — keine Ketten.",
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
  ownerName?: string | null;
  hasOnlineBooking?: boolean | null;
  reviewIssues?: string[] | null;
  competitors?: Array<{
    name?: string | null;
    city?: string | null;
    website?: string | null;
    hasModernSite?: boolean | null;
    note?: string | null;
  }> | null;
  webDefects?: {
    ssl?: boolean | null;
    mobileFriendly?: boolean | null;
    cms?: string | null;
    lastUpdate?: string | null;
    pageSpeed?: string | null;
    cookieBanner?: boolean | null;
    impressumOk?: boolean | null;
    hasOnlineBooking?: boolean | null;
    domainAge?: string | null;
    notes?: string | null;
  } | null;
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

function bool(value: boolean | null | undefined): boolean | undefined {
  if (value === true || value === false) return value;
  return undefined;
}

function pageSpeed(
  value: string | null | undefined,
): "schnell" | "ok" | "langsam" | undefined {
  if (!value) return undefined;
  const v = value.toLowerCase().trim();
  if (v === "schnell" || v === "ok" || v === "langsam") return v;
  return undefined;
}

function cleanList(values: string[] | null | undefined): string[] | undefined {
  if (!Array.isArray(values)) return undefined;
  const cleaned = values
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter((v) => v.length > 0 && v.toLowerCase() !== "null")
    .slice(0, 5);
  return cleaned.length > 0 ? cleaned : undefined;
}

function mapCompetitors(
  raw: RawEnrichment["competitors"],
): LeadCompetitorSuggestion[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: LeadCompetitorSuggestion[] = [];
  for (const r of raw.slice(0, 3)) {
    const name = trim(r?.name);
    if (!name) continue;
    out.push({
      name,
      city: trim(r?.city),
      website: trim(r?.website),
      hasModernSite: bool(r?.hasModernSite),
      note: trim(r?.note),
    });
  }
  return out.length > 0 ? out : undefined;
}

function mapWebDefects(
  raw: RawEnrichment["webDefects"],
): LeadWebDefectsSuggestion | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const out: LeadWebDefectsSuggestion = {
    ssl: bool(raw.ssl),
    mobileFriendly: bool(raw.mobileFriendly),
    cms: trim(raw.cms),
    lastUpdate: trim(raw.lastUpdate),
    pageSpeed: pageSpeed(raw.pageSpeed),
    cookieBanner: bool(raw.cookieBanner),
    impressumOk: bool(raw.impressumOk),
    hasOnlineBooking: bool(raw.hasOnlineBooking),
    domainAge: trim(raw.domainAge),
    notes: trim(raw.notes),
  };
  // Wenn nichts substanzielles drin ist → undefined zurueck
  const hasContent = Object.values(out).some((v) => v !== undefined);
  return hasContent ? out : undefined;
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
    ownerName: trim(raw.ownerName ?? undefined),
    hasOnlineBooking: bool(raw.hasOnlineBooking),
    reviewIssues: cleanList(raw.reviewIssues),
    competitors: mapCompetitors(raw.competitors),
    webDefects: mapWebDefects(raw.webDefects),
    notes: trim(raw.notes ?? undefined),
    sources,
  };
}

/**
 * Aggressives Apply fuer Bulk-Mode: alle Felder, fuer die Gemini einen
 * Wert geliefert hat, werden auf den Lead geschrieben (ueberschreibt
 * bestehende Werte). Felder ohne Vorschlag bleiben unangetastet —
 * leere Antworten loeschen also nichts.
 *
 * Wird auch zum Berechnen der "changed fields"-Liste genutzt, die in
 * die Activity-Timeline geht.
 */
export function buildBulkPatchFromEnrichment(
  result: LeadEnrichmentResult,
  leadGrade: "A" | "B" | "C" | "Unknown",
): { patch: Record<string, unknown>; changedFields: string[] } {
  const patch: Record<string, unknown> = {};
  const changed: string[] = [];

  const set = (label: string, key: string, value: unknown) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string" && value.trim().length === 0) return;
    if (Array.isArray(value) && value.length === 0) return;
    patch[key] = value;
    changed.push(label);
  };

  set("Website", "website", result.website);
  set("Telefon", "phone", result.phone);
  set("E-Mail", "email", result.email);
  set("Adresse", "address", result.address);
  set("Oeffnungszeiten", "openingHours", result.openingHours);
  set("Bewertung", "googleRating", result.googleRating);
  set("Bewertungs-Anzahl", "googleReviewCount", result.googleReviewCount);
  set("Bewertungssignal", "ratingSignal", result.ratingSignal);
  set("Web-Check", "websiteCheck", result.websiteCheck);
  set("Inhaber", "ownerName", result.ownerName);
  set("Online-Buchung", "hasOnlineBooking", result.hasOnlineBooking);
  set("Review-Themen", "reviewIssues", result.reviewIssues);
  set("Wettbewerber", "competitors", result.competitors);
  set("Web-Defekte", "webDefects", result.webDefects);

  // Pitch wird immer akzeptiert (kein Risk weil rein additiv).
  set("Pitch-Vorschlag", "pitchSuggestion", result.pitchSuggestion);

  // Social: nur die Eintraege uebernehmen, die Gemini gefunden hat.
  const social: Record<string, string> = {};
  for (const k of ["instagram", "facebook", "tiktok", "linkedin", "youtube"] as const) {
    const v = result.social[k];
    if (v && v.trim().length > 0) social[k] = v.trim();
  }
  if (Object.keys(social).length > 0) {
    patch.social = social;
    changed.push("Social Media");
  }

  // Wenn websiteCheck = "Keine Website gefunden" → website leer setzen
  if (
    typeof result.websiteCheck === "string" &&
    /keine\s+(website|webseite)\s+gefunden/i.test(result.websiteCheck)
  ) {
    patch.website = undefined;
  }

  // Vermeiden: A-Leads bekommen keine webDefects.
  if (leadGrade === "A") delete patch.webDefects;

  patch.enrichedAt = new Date().toISOString();
  patch.googleCheckStatus = "Geprüft";
  return { patch, changedFields: changed };
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
