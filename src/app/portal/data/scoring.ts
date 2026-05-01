/**
 * Deterministic lead scoring + next-best-step.
 *
 * Implements the rules from the brief verbatim. Pure functions so the
 * exact same numbers fall out for any given lead — re-runs after a
 * websiteCheck/googleCheckStatus update flow back into priority and
 * the next-action label without any state surprises.
 */
import type {
  Lead,
  LeadGrade,
  LeadPriority,
  LeadStatus,
} from "./types";

const containsAny = (haystack: string | undefined, needles: string[]): boolean => {
  if (!haystack) return false;
  const lower = haystack.toLowerCase();
  return needles.some((n) => lower.includes(n.toLowerCase()));
};

export function computeLeadGrade(leadStatusRaw: string | undefined): LeadGrade {
  if (!leadStatusRaw) return "Unknown";
  const trimmed = leadStatusRaw.trim().toUpperCase();
  if (trimmed.startsWith("A")) return "A";
  if (trimmed.startsWith("B")) return "B";
  if (trimmed.startsWith("C")) return "C";
  return "Unknown";
}

export interface ScoringInput {
  leadStatusRaw?: string;
  websiteCheck?: string;
  ratingSignal?: string;
  phone?: string;
  googleCheckStatus?: string;
  assessment?: string;
}

export function computeLeadScore(input: ScoringInput): number {
  let score = 0;

  const grade = computeLeadGrade(input.leadStatusRaw);
  if (grade === "A") score += 40;
  else if (grade === "B") score += 25;
  else if (grade === "C") score += 10;

  // Website-check signals.
  if (containsAny(input.websiteCheck, ["Website hinzufügen", "Website hinzufuegen"])) {
    score += 25;
  }
  if (containsAny(input.websiteCheck, ["keine eigene Website"])) {
    score += 25;
  }
  if (
    containsAny(input.websiteCheck, [
      "Linktree",
      "Instagram",
      "Facebook",
      "Profilseite",
      "Baukasten",
      "SITE123",
    ])
  ) {
    score += 20;
  }

  // Rating signal — explicit rating presence or the word "Bewertung".
  if (
    containsAny(input.ratingSignal, ["Bewertung"]) ||
    /\d[.,]\d/.test(input.ratingSignal ?? "")
  ) {
    score += 20;
  }

  if (input.phone && input.phone.replace(/[^0-9]/g, "").length >= 6) {
    score += 10;
  }

  if (
    !input.googleCheckStatus ||
    containsAny(input.googleCheckStatus, ["Nicht separat", "Nicht systematisch", "Nicht geprüft"])
  ) {
    score += 5;
  }

  if (
    containsAny(input.websiteCheck, [
      "nicht SSL",
      "nicht SSL-zertifiziert",
      "mobil nicht optimiert",
      "lädt langsam",
      "laedt langsam",
    ])
  ) {
    score += 15;
  }

  if (
    containsAny(input.assessment, ["Reputationsrisiko"]) ||
    containsAny(input.leadStatusRaw, ["Reputationsrisiko"])
  ) {
    score -= 5;
  }

  return score;
}

export function priorityFromScore(score: number): LeadPriority {
  if (score >= 80) return "Hot";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  if (score >= 20) return "Low";
  return "Archive";
}

export interface NextStepInput {
  websiteCheck?: string;
  googleCheckStatus?: string;
  status: LeadStatus;
  nextFollowUpAt?: string;
}

export function computeNextBestStep(input: NextStepInput): string {
  const googleEmpty =
    !input.googleCheckStatus ||
    /^\s*$/.test(input.googleCheckStatus) ||
    containsAny(input.googleCheckStatus, ["Nicht geprüft"]);
  if (googleEmpty) return "Google/Website prüfen";

  const noWebsite =
    containsAny(input.websiteCheck, [
      "Keine Website",
      "keine eigene Website",
      "Website hinzufügen",
      "Website hinzufuegen",
    ]);
  if (noWebsite) return "Anrufen";

  const websiteWeak = containsAny(input.websiteCheck, [
    "schwach",
    "nicht SSL",
    "nicht SSL-zertifiziert",
    "lädt langsam",
    "laedt langsam",
    "mobil nicht optimiert",
    "Linktree",
    "Profilseite",
    "Baukasten",
    "SITE123",
  ]);
  if (websiteWeak) return "Website-Audit anbieten";

  if (input.status === "Interessiert") return "Angebot vorbereiten";

  if (input.nextFollowUpAt) {
    const due = new Date(input.nextFollowUpAt).getTime();
    if (Number.isFinite(due) && due <= Date.now()) return "Follow-up durchführen";
  }

  return "Lead prüfen";
}

/** Recomputes derived fields on a Lead in place and returns a new object. */
export function recomputeLead<T extends Lead>(lead: T): T {
  const leadGrade = computeLeadGrade(lead.leadStatusRaw);
  const leadScore = computeLeadScore({
    leadStatusRaw: lead.leadStatusRaw,
    websiteCheck: lead.websiteCheck,
    ratingSignal: lead.ratingSignal,
    phone: lead.phone,
    googleCheckStatus: lead.googleCheckStatus,
    assessment: lead.assessment,
  });
  const priority = priorityFromScore(leadScore);
  const nextBestStep = computeNextBestStep({
    websiteCheck: lead.websiteCheck,
    googleCheckStatus: lead.googleCheckStatus,
    status: lead.status,
    nextFollowUpAt: lead.nextFollowUpAt,
  });
  return { ...lead, leadGrade, leadScore, priority, nextBestStep };
}
