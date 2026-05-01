/**
 * Portal entity definitions.
 *
 * All entities carry a stable string `id` (UUID v4 via crypto.randomUUID),
 * an ISO-8601 `createdAt`, and an ISO-8601 `updatedAt`. Cross-entity
 * references are by id (not nested objects) so the store can stay
 * normalized and JSON export/import round-trips cleanly.
 *
 * The shapes are deliberately verbose: every CSV column we care about
 * gets a typed field, and unrecognised columns are preserved on
 * `rawMetadata` so nothing imported is ever lost.
 */

export type LeadGrade = "A" | "B" | "C" | "Unknown";

export type LeadPriority = "Hot" | "High" | "Medium" | "Low" | "Archive";

/** German lifecycle the brief specifies for the Lead.status field. */
export type LeadStatus =
  | "Neu"
  | "Zu prüfen"
  | "Geprüft"
  | "Kontaktiert"
  | "Interessiert"
  | "Follow-up"
  | "Angebot angefragt"
  | "Kunde geworden"
  | "Kein Interesse"
  | "Archiviert";

export const LEAD_STATUSES: readonly LeadStatus[] = [
  "Neu",
  "Zu prüfen",
  "Geprüft",
  "Kontaktiert",
  "Interessiert",
  "Follow-up",
  "Angebot angefragt",
  "Kunde geworden",
  "Kein Interesse",
  "Archiviert",
];

/** Brief explicitly enumerates these website-check buckets. */
export type WebsiteCheckBucket =
  | "Keine Website gefunden"
  | "Website gefunden"
  | "Nur Facebook/Instagram"
  | "Nur Linktree/Profilseite"
  | "Website schwach"
  | "Website gut"
  | "Nicht passend"
  | "Unbekannt";

export const WEBSITE_CHECK_BUCKETS: readonly WebsiteCheckBucket[] = [
  "Keine Website gefunden",
  "Website gefunden",
  "Nur Facebook/Instagram",
  "Nur Linktree/Profilseite",
  "Website schwach",
  "Website gut",
  "Nicht passend",
  "Unbekannt",
];

export type GoogleCheckStatus =
  | "Nicht geprüft"
  | "Geprüft"
  | "Nicht separat/systematisch geprüft";

export const GOOGLE_CHECK_STATUSES: readonly GoogleCheckStatus[] = [
  "Nicht geprüft",
  "Geprüft",
  "Nicht separat/systematisch geprüft",
];

/** Activity timeline entry — kept on the lead document directly. */
export type ActivityChannel =
  | "Anruf"
  | "Nicht erreicht"
  | "WhatsApp"
  | "E-Mail"
  | "Instagram DM"
  | "Gespräch"
  | "Angebot gewünscht"
  | "Notiz";

export const ACTIVITY_CHANNELS: readonly ActivityChannel[] = [
  "Anruf",
  "Nicht erreicht",
  "WhatsApp",
  "E-Mail",
  "Instagram DM",
  "Gespräch",
  "Angebot gewünscht",
  "Notiz",
];

export interface Activity {
  id: string;
  channel: ActivityChannel;
  note?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  companyName: string;
  city: string;
  distanceFromKassel?: string;
  industry?: string;
  /** Optional secondary classification (e.g. "Friseur · Salon"). */
  serviceArea?: string;
  phone?: string;
  email?: string;
  website?: string;
  /** Verified business address from Google. */
  address?: string;
  /** "08:00–18:00 Mo–Fr" or similar free-text. */
  openingHours?: string;
  /** Aggregated Google rating (e.g. 4.6). */
  googleRating?: number;
  /** Number of Google reviews backing the rating. */
  googleReviewCount?: number;
  /** Social media URLs detected by Auto-Check. */
  social?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
  };
  /** ISO timestamp of the last successful Auto-Check enrichment. */
  enrichedAt?: string;
  /** Auto-Check pitch suggestion produced by Gemini. Tonalitaet variiert je
   * Lead-Grade: A bekommt einen "Why-Website"-Pitch (Branchen-Probleme),
   * B/C bekommt einen "Schwachstellen-Pitch" zur bestehenden Website. */
  pitchSuggestion?: string;
  /** Inhaber:in / Geschaeftsfuehrung — fuer persoenliche Telefon-Ansprache. */
  ownerName?: string;
  /** Hat das Unternehmen ein erkennbares Online-Buchungs-/Termin-Tool? */
  hasOnlineBooking?: boolean;
  /** 3 Kernaussagen aus negativen Google-Bewertungen (z.B. "Termin schwer
   * zu bekommen", "keine Online-Buchung"). Pitch-Hooks. */
  reviewIssues?: string[];
  /** 1-3 lokale Wettbewerber als Vergleichsargument im Verkaufsgespraech. */
  competitors?: LeadCompetitor[];
  /** Strukturierte Web-Defekt-Karte. Wird nur fuer B/C-Leads MIT Website
   * gefuellt — A-Leads und Leads ohne Website lassen es leer. */
  webDefects?: LeadWebDefects;
  ratingSignal?: string;
  websiteCheck?: string;
  websiteCheckBucket?: WebsiteCheckBucket;
  googleCheckStatus?: GoogleCheckStatus | string;
  /** Verbatim Lead_Status string from the CSV (e.g. "A · Sehr gut"). */
  leadStatusRaw?: string;
  leadGrade: LeadGrade;
  leadScore: number;
  priority: LeadPriority;
  sourceUrl?: string;
  researchNote?: string;
  assessment?: string;
  campaignId: string;
  status: LeadStatus;
  nextBestStep: string;
  nextFollowUpAt?: string;
  activities: Activity[];
  /** Any unknown CSV columns we couldn't auto-map. */
  rawMetadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface LeadCompetitor {
  name: string;
  city?: string;
  website?: string;
  hasModernSite?: boolean;
  note?: string;
}

export interface LeadWebDefects {
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

export interface Campaign {
  id: string;
  name: string;
  industry?: string;
  region?: string;
  source?: string;
  notes?: string;
  importedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  companyName: string;
  contactName?: string;
  phone?: string;
  email?: string;
  website?: string;
  city?: string;
  address?: string;
  industry?: string;
  sourceLeadId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectType =
  | "Website"
  | "Relaunch"
  | "SEO"
  | "Branding"
  | "Automatisierung"
  | "Portal/Software"
  | "Sonstiges";

export const PROJECT_TYPES: readonly ProjectType[] = [
  "Website",
  "Relaunch",
  "SEO",
  "Branding",
  "Automatisierung",
  "Portal/Software",
  "Sonstiges",
];

export type ProjectStatus =
  | "Anfrage"
  | "Angebot in Vorbereitung"
  | "Angebot gesendet"
  | "Angenommen"
  | "In Umsetzung"
  | "Review"
  | "Abgeschlossen"
  | "Pausiert"
  | "Abgelehnt";

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  "Anfrage",
  "Angebot in Vorbereitung",
  "Angebot gesendet",
  "Angenommen",
  "In Umsetzung",
  "Review",
  "Abgeschlossen",
  "Pausiert",
  "Abgelehnt",
];

export interface Project {
  id: string;
  name: string;
  customerId?: string;
  sourceLeadId?: string;
  projectType: ProjectType;
  status: ProjectStatus;
  estimatedValue?: number;
  startDate?: string;
  deadline?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = "Offen" | "Erledigt" | "Verschoben";
export const TASK_STATUSES: readonly TaskStatus[] = [
  "Offen",
  "Erledigt",
  "Verschoben",
];

export type TaskPriority = "High" | "Medium" | "Low";
export const TASK_PRIORITIES: readonly TaskPriority[] = [
  "High",
  "Medium",
  "Low",
];

export interface Task {
  id: string;
  title: string;
  description?: string;
  relatedLeadId?: string;
  relatedCustomerId?: string;
  relatedProjectId?: string;
  dueDate?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface PortalSettings {
  defaultRegion: string;
  defaultSource: string;
  /**
   * Schema version of the persisted store. Used by the in-place
   * migration helper inside `store.ts` so older saved data can be
   * reshaped without a forced wipe when we evolve fields.
   */
  schemaVersion: number;
  updatedAt: string;
  /**
   * Personal Gemini API key used for the Auto-Check feature on the
   * lead detail page. Stored in the same Supabase row as the rest of
   * portal_state — RLS already restricts access to the owner email.
   */
  geminiApiKey?: string;
  /** Default Gemini model used by Auto-Check. Falls back to gemini-2.5-flash. */
  geminiModel?: string;
}

/** Top-level snapshot used for JSON export/import (settings backup). */
export interface PortalSnapshot {
  schemaVersion: number;
  exportedAt: string;
  leads: Lead[];
  campaigns: Campaign[];
  customers: Customer[];
  projects: Project[];
  tasks: Task[];
  settings: PortalSettings;
}

export const PORTAL_SCHEMA_VERSION = 1;
