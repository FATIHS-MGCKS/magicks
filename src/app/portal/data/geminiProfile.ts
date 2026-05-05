/**
 * Gemini-backed deep business-profile research for the Pitch-Prompt builder.
 *
 * This is the *deep* counterpart to the schlanke Auto-Check in
 * [gemini.ts](./gemini.ts). Where the Auto-Check returns around 10 compact
 * fields for lead triage, this call fuellt ein 40-Feld-Schema aus, das
 * anschliessend in die grossen Pitch-Prompt-Templates eingesetzt wird.
 *
 * Strategy mirrors gemini.ts:
 *   1. `google_search` tool → Live-Grounding statt Training-Cutoff.
 *   2. JSON inside ```json fenced block → robust gegen Prose.
 *   3. Grounding-Quellen werden eingesammelt und am Profil gespeichert,
 *      damit der Nutzer im Review-Schritt Fakten verifizieren kann.
 *
 * Der Prompt weist Gemini explizit an, subjektive Felder (Theme, Farben,
 * CTAs, Section-Focus, Tone-of-Voice, Visual-Mood, Image-Style,
 * Positioning) nur mit konservativen Default-Vorschlaegen zu fuellen —
 * die finale Entscheidung liegt beim Nutzer im Hybrid-Editor.
 */

import type {
  BusinessProfile,
  BusinessProfileSource,
  PreferredTheme,
} from "./types";
import { PREFERRED_THEMES } from "./types";
import type { GeminiModel } from "./gemini";
import { GeminiError } from "./gemini";

export interface BusinessProfileResearchInput {
  companyName: string;
  city: string;
  industry?: string;
  serviceArea?: string;
  knownPhone?: string;
  knownWebsite?: string;
  knownEmail?: string;
  knownAddress?: string;
  leadGrade: "A" | "B" | "C" | "Unknown";
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

/** Shape of the raw JSON we expect from Gemini. Every field optional /
 * nullable — we defensively map to the strict BusinessProfile after. */
interface RawProfile {
  business_name?: string | null;
  business_branch?: string | null;
  sub_branch?: string | null;
  website_url?: string | null;
  has_website?: boolean | string | null;
  google_business_profile_url?: string | null;
  google_business_category?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  opening_hours?: string | null;
  google_rating?: string | number | null;
  google_review_count?: string | number | null;
  review_source?: string | null;
  review_verification_status?: string | null;
  review_highlights?: string[] | null;
  business_photos_available?: boolean | string | null;
  main_services?: string[] | null;
  secondary_services?: string[] | null;
  inferred_services?: string[] | null;
  target_customers?: string[] | null;
  unique_selling_points?: string[] | null;
  current_website_problems?: string[] | null;
  no_website_opportunity?: string | null;
  design_opportunities?: string[] | null;
  competitor_reference_websites?: string[] | null;
  recommended_positioning?: string | null;
  recommended_website_goal?: string | null;
  desired_style?: string | null;
  preferred_theme?: string | null;
  brand_colors?: string[] | null;
  visual_mood?: string | null;
  image_style?: string | null;
  tone_of_voice?: string | null;
  primary_cta?: string | null;
  secondary_ctas?: string[] | null;
  section_focus?: string[] | null;
  special_notes?: string[] | null;
}

function str(value: string | number | null | undefined): string {
  if (value == null) return "";
  const t = String(value).trim();
  if (t.length === 0) return "";
  if (t.toLowerCase() === "null") return "";
  return t;
}

function boolean(
  value: boolean | string | number | null | undefined,
): boolean {
  if (value === true) return true;
  if (value === false) return false;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (v === "true" || v === "ja" || v === "yes" || v === "1") return true;
    if (v === "false" || v === "nein" || v === "no" || v === "0") return false;
  }
  if (typeof value === "number") return value !== 0;
  return false;
}

function cleanList(values: string[] | null | undefined, max = 10): string[] {
  if (!Array.isArray(values)) return [];
  const out: string[] = [];
  for (const v of values) {
    const t = str(v as unknown as string);
    if (t.length === 0) continue;
    if (out.includes(t)) continue;
    out.push(t);
    if (out.length >= max) break;
  }
  return out;
}

function theme(value: string | null | undefined): PreferredTheme {
  const t = str(value).toLowerCase();
  if (t.includes("dark") || t.includes("dunkel")) return "Dark Mode";
  if (t.includes("light") || t.includes("hell")) return "Light Mode";
  if (PREFERRED_THEMES.includes(value as PreferredTheme)) {
    return value as PreferredTheme;
  }
  return "Auto";
}

function dedupeSources(sources: GeminiSource[]): BusinessProfileSource[] {
  const seen = new Set<string>();
  const out: BusinessProfileSource[] = [];
  for (const s of sources) {
    if (!s.uri || seen.has(s.uri)) continue;
    seen.add(s.uri);
    out.push({ uri: s.uri, title: s.title });
  }
  return out;
}

function parseJsonBlock(text: string): RawProfile {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const first = candidate.indexOf("{");
  const last = candidate.lastIndexOf("}");
  if (first < 0 || last < first) {
    throw new GeminiError("Antwort enthält kein JSON-Objekt.");
  }
  const raw = candidate.slice(first, last + 1);
  try {
    return JSON.parse(raw) as RawProfile;
  } catch (err) {
    throw new GeminiError("JSON konnte nicht geparst werden.", err);
  }
}

function buildPrompt(input: BusinessProfileResearchInput): string {
  const known: string[] = [];
  if (input.knownPhone) known.push(`Telefon (bekannt): ${input.knownPhone}`);
  if (input.knownEmail) known.push(`E-Mail (bekannt): ${input.knownEmail}`);
  if (input.knownWebsite) known.push(`Website (bekannt): ${input.knownWebsite}`);
  if (input.knownAddress) known.push(`Adresse (bekannt): ${input.knownAddress}`);
  if (input.serviceArea) known.push(`Bereich: ${input.serviceArea}`);

  return [
    `Du bist Senior-Research-Analyst fuer ein deutsches Premium-Webdesign-Studio (MAGICKS, Kassel).`,
    `Recherchiere mit Google-Suche Live-Daten zum folgenden Unternehmen und liefere ein VOLLSTAENDIGES Business-Profil im exakt vorgegebenen JSON-Schema.`,
    `Dieses Profil wird anschliessend in einen Pitch-Prompt eingesetzt, der ein modernes Website-Konzept generiert — Qualitaet und Fakten zaehlen mehr als Geschwindigkeit.`,
    ``,
    `**Unternehmen:** ${input.companyName}`,
    `**Stadt:** ${input.city}`,
    input.industry ? `**Branche (CSV):** ${input.industry}` : ``,
    `**Lead-Grade:** ${input.leadGrade}`,
    known.length > 0 ? `**Bereits bekannt:**\n${known.join("\n")}` : ``,
    ``,
    `**Recherche-Aufgabe:**`,
    `1. Identifiziere das Unternehmen eindeutig (Google Business, offizielle Website, Impressum).`,
    `2. Ermittle Branche, Unterbranche, Google-Business-Kategorie.`,
    `3. Sammle Standort-Daten (Adresse, Region, Land), Kontaktdaten (Telefon, E-Mail), Oeffnungszeiten.`,
    `4. Pruefe Google-Bewertungen: Durchschnitt, Anzahl, 3-5 Kernaussagen aus Reviews (review_highlights — neutral zitiert, kurz).`,
    `5. Bestimme, ob eine eigene Website existiert ("has_website"). Wenn ja: URL sauber ohne Tracking-Parameter.`,
    `6. Identifiziere Hauptleistungen (main_services), sekundaere Leistungen (secondary_services) und abgeleitete zusaetzliche Services, die branchentypisch sinnvoll waeren (inferred_services).`,
    `7. Beschreibe die Zielkunden (target_customers) konkret (z.B. "Berufstaetige 25-45", "Anwohner Altbau-Viertel", "Touristen").`,
    `8. Formuliere 3-5 Unique Selling Points (unique_selling_points) — was unterscheidet das Unternehmen konkret?`,
    `9. Falls Website vorhanden: liste 3-7 current_website_problems (SSL, mobile, veraltet, schwache CTAs, Design, Ladezeit, SEO, Bildqualitaet). Falls keine Website vorhanden: fuelle no_website_opportunity (ein kurzer Absatz).`,
    `10. Notiere 3-6 design_opportunities (visuelle / strukturelle Chancen, z.B. "Editorial-Bildwelt", "Online-Buchung", "Regionale Storytelling-Section").`,
    `11. Liefere 2-4 competitor_reference_websites (konkrete lokale oder nationale Wettbewerber-URLs, die als visuelle Referenz dienen koennen).`,
    `12. Schlage eine recommended_positioning vor (1-2 saetze Positionierungs-Claim) und ein recommended_website_goal (z.B. "Mehr qualifizierte Terminanfragen via Online-Buchung").`,
    `13. Subjektive Design-Empfehlungen (konservativ, am Branchen-Charakter orientiert):`,
    `    - desired_style (z.B. "Editorial Minimal", "Warm & Handgemacht", "Clean & Technisch")`,
    `    - preferred_theme (einer von: "Light Mode", "Dark Mode", "Auto")`,
    `    - brand_colors: 2-4 Hex-Codes (falls nicht klar erkennbar: Branchentypisch konservativ vorschlagen)`,
    `    - visual_mood (1 satz, z.B. "Ruhig, konzentriert, handwerklich")`,
    `    - image_style (z.B. "Naturalistische Portraits + Detailaufnahmen")`,
    `    - tone_of_voice (z.B. "Persoenlich, direkt, ohne Marketing-Floskeln")`,
    `14. primary_cta (ein konkreter Call-to-Action-Text) + 2-3 secondary_ctas.`,
    `15. section_focus: 4-7 Website-Sektionen in Reihenfolge (z.B. "Hero mit Markenclaim", "Leistungen", "Team", "Online-Termin", "FAQ", "Kontakt").`,
    `16. special_notes: 0-5 kurze Besonderheiten, die im Prompt helfen (z.B. "Saisongeschaeft", "zertifizierter Meisterbetrieb", "Barrierefreier Zugang").`,
    ``,
    `**Wichtig fuer Genauigkeit:**`,
    `- Bei Unsicherheit leeres Feld / null. Nichts erfinden.`,
    `- Alle Texte auf DEUTSCH (ausser Eigennamen, URLs, Hex-Codes).`,
    `- Arrays bleiben Arrays — auch wenn leer.`,
    `- Hex-Farben im Format "#RRGGBB".`,
    ``,
    `**Antwortformat — STRIKT dieser JSON-Block, ohne weiteren Text drum herum:**`,
    "```json",
    `{`,
    `  "business_name": "...",`,
    `  "business_branch": "...",`,
    `  "sub_branch": "...",`,
    `  "website_url": "https://..." | "",`,
    `  "has_website": true | false,`,
    `  "google_business_profile_url": "https://g.page/..." | "",`,
    `  "google_business_category": "...",`,
    `  "city": "...",`,
    `  "region": "...",`,
    `  "country": "Deutschland",`,
    `  "address": "...",`,
    `  "phone": "+49 ...",`,
    `  "email": "...",`,
    `  "opening_hours": "Mo-Fr 9-18 Uhr, Sa 9-14 Uhr",`,
    `  "google_rating": "4.6",`,
    `  "google_review_count": "218",`,
    `  "review_source": "Google",`,
    `  "review_verification_status": "verifiziert" | "unbestaetigt" | "",`,
    `  "review_highlights": ["...", "...", "..."],`,
    `  "business_photos_available": true | false,`,
    `  "main_services": ["...", "..."],`,
    `  "secondary_services": ["...", "..."],`,
    `  "inferred_services": ["...", "..."],`,
    `  "target_customers": ["...", "..."],`,
    `  "unique_selling_points": ["...", "...", "..."],`,
    `  "current_website_problems": ["...", "..."],`,
    `  "no_website_opportunity": "...",`,
    `  "design_opportunities": ["...", "..."],`,
    `  "competitor_reference_websites": ["https://...", "https://..."],`,
    `  "recommended_positioning": "...",`,
    `  "recommended_website_goal": "...",`,
    `  "desired_style": "...",`,
    `  "preferred_theme": "Light Mode" | "Dark Mode" | "Auto",`,
    `  "brand_colors": ["#A47148", "#0F0F0F", "#F4EFE6"],`,
    `  "visual_mood": "...",`,
    `  "image_style": "...",`,
    `  "tone_of_voice": "...",`,
    `  "primary_cta": "...",`,
    `  "secondary_ctas": ["...", "..."],`,
    `  "section_focus": ["Hero", "Leistungen", "..."],`,
    `  "special_notes": ["...", "..."]`,
    `}`,
    "```",
  ]
    .filter(Boolean)
    .join("\n");
}

function mapProfile(raw: RawProfile): Omit<
  BusinessProfile,
  "researchedAt" | "sources"
> {
  return {
    business_name: str(raw.business_name),
    business_branch: str(raw.business_branch),
    sub_branch: str(raw.sub_branch),
    website_url: str(raw.website_url),
    has_website: boolean(raw.has_website),
    google_business_profile_url: str(raw.google_business_profile_url),
    google_business_category: str(raw.google_business_category),
    city: str(raw.city),
    region: str(raw.region),
    country: str(raw.country),
    address: str(raw.address),
    phone: str(raw.phone),
    email: str(raw.email),
    opening_hours: str(raw.opening_hours),
    google_rating: str(raw.google_rating),
    google_review_count: str(raw.google_review_count),
    review_source: str(raw.review_source),
    review_verification_status: str(raw.review_verification_status),
    review_highlights: cleanList(raw.review_highlights, 6),
    business_photos_available: boolean(raw.business_photos_available),
    main_services: cleanList(raw.main_services, 8),
    secondary_services: cleanList(raw.secondary_services, 8),
    inferred_services: cleanList(raw.inferred_services, 8),
    target_customers: cleanList(raw.target_customers, 8),
    unique_selling_points: cleanList(raw.unique_selling_points, 8),
    current_website_problems: cleanList(raw.current_website_problems, 8),
    no_website_opportunity: str(raw.no_website_opportunity),
    design_opportunities: cleanList(raw.design_opportunities, 8),
    competitor_reference_websites: cleanList(raw.competitor_reference_websites, 6),
    recommended_positioning: str(raw.recommended_positioning),
    recommended_website_goal: str(raw.recommended_website_goal),
    desired_style: str(raw.desired_style),
    preferred_theme: theme(raw.preferred_theme),
    brand_colors: cleanList(raw.brand_colors, 6),
    visual_mood: str(raw.visual_mood),
    image_style: str(raw.image_style),
    tone_of_voice: str(raw.tone_of_voice),
    primary_cta: str(raw.primary_cta),
    secondary_ctas: cleanList(raw.secondary_ctas, 5),
    section_focus: cleanList(raw.section_focus, 10),
    special_notes: cleanList(raw.special_notes, 6),
  };
}

export async function runBusinessProfileResearch(
  apiKey: string,
  model: GeminiModel,
  input: BusinessProfileResearchInput,
  signal?: AbortSignal,
): Promise<BusinessProfile> {
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
      temperature: 0.3,
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

  const profile = mapProfile(raw);

  // Gemini laesst den Firmennamen gelegentlich leer, wenn es das Unternehmen
  // nicht eindeutig identifizieren konnte. Fallback auf Input, damit die
  // Prompt-Substitution sauber bleibt.
  if (!profile.business_name) profile.business_name = input.companyName;
  if (!profile.city) profile.city = input.city;
  if (!profile.country) profile.country = "Deutschland";

  return {
    ...profile,
    researchedAt: new Date().toISOString(),
    sources,
  };
}

/** Leeres Profil als sichere Basis fuer manuelles Ausfuellen / Reset. */
export function emptyBusinessProfile(
  seed: Partial<BusinessProfile> = {},
): BusinessProfile {
  return {
    business_name: "",
    business_branch: "",
    sub_branch: "",
    website_url: "",
    has_website: false,
    google_business_profile_url: "",
    google_business_category: "",
    city: "",
    region: "",
    country: "Deutschland",
    address: "",
    phone: "",
    email: "",
    opening_hours: "",
    google_rating: "",
    google_review_count: "",
    review_source: "",
    review_verification_status: "",
    review_highlights: [],
    business_photos_available: false,
    main_services: [],
    secondary_services: [],
    inferred_services: [],
    target_customers: [],
    unique_selling_points: [],
    current_website_problems: [],
    no_website_opportunity: "",
    design_opportunities: [],
    competitor_reference_websites: [],
    recommended_positioning: "",
    recommended_website_goal: "",
    desired_style: "",
    preferred_theme: "Auto",
    brand_colors: [],
    visual_mood: "",
    image_style: "",
    tone_of_voice: "",
    primary_cta: "",
    secondary_ctas: [],
    section_focus: [],
    special_notes: [],
    ...seed,
  };
}
