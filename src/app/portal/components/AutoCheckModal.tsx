/**
 * Auto-Check modal for lead enrichment via Gemini.
 *
 * Flow:
 *   1. Mount triggers a Gemini call (with Google grounding) using the
 *      personal API key from PortalSettings.
 *   2. Render a per-field comparison ("Aktuell" vs "Vorschlag") with
 *      a checkbox per field. Conservative default: nothing is checked
 *      unless the field is currently empty AND the suggestion is non-empty.
 *   3. For B/C leads with an existing website, surface the pitch
 *      suggestion in its own card.
 *   4. Apply only checked fields when the user clicks "Übernehmen",
 *      then log an activity entry summarising the changes.
 */

import { useEffect, useMemo, useState } from "react";
import {
  runLeadEnrichment,
  type LeadEnrichmentResult,
  GeminiError,
} from "../data/gemini";
import type { Lead, WebsiteCheckBucket } from "../data/types";
import { portalStore } from "../hooks/useStore";

/**
 * Map a free-text website check (either Gemini's suggestion or the
 * existing `websiteCheck` string) to one of the enum buckets used by
 * the Lead-Detail dropdown. Order matters: most specific first so
 * "Nur Facebook/Instagram" wins over a generic "Keine Website".
 */
function mapWebsiteCheckToBucket(text: string): WebsiteCheckBucket | undefined {
  const t = text.toLowerCase();
  if (t.includes("nur facebook") || t.includes("nur instagram")) {
    return "Nur Facebook/Instagram";
  }
  if (t.includes("linktree") || t.includes("profilseite")) {
    return "Nur Linktree/Profilseite";
  }
  if (
    t.includes("keine website") ||
    t.includes("keine webseite") ||
    t.includes("keine eigene website") ||
    t.includes("nicht gefunden")
  ) {
    return "Keine Website gefunden";
  }
  if (t.includes("nicht passend")) return "Nicht passend";
  if (t.includes("schwach") || t.includes("baukasten") || t.includes("site123")) {
    return "Website schwach";
  }
  if (t.includes("website gut") || t.includes("modern") || t.includes("solide")) {
    return "Website gut";
  }
  if (t.includes("website gefunden") || t.includes("vorhanden")) {
    return "Website gefunden";
  }
  return undefined;
}

interface AutoCheckModalProps {
  lead: Lead;
  onClose: () => void;
}

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; result: LeadEnrichmentResult };

interface FieldRow {
  key: string;
  label: string;
  current?: string;
  suggested?: string;
  /** When true the apply button writes this onto the Lead. */
  default: boolean;
}

export function AutoCheckModal({ lead, onClose }: AutoCheckModalProps) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [picks, setPicks] = useState<Record<string, boolean>>({});
  const [acceptPitch, setAcceptPitch] = useState(false);
  const [applying, setApplying] = useState(false);
  const settings = portalStore.getSettings();

  // ----- Run enrichment on mount -----
  useEffect(() => {
    const apiKey = settings.geminiApiKey;
    if (!apiKey) {
      setState({
        kind: "error",
        message:
          "Kein Gemini-API-Key konfiguriert. Bitte unter Einstellungen → KI-Recherche eintragen.",
      });
      return;
    }
    const ctrl = new AbortController();
    setState({ kind: "loading" });
    (async () => {
      try {
        const result = await runLeadEnrichment(
          apiKey,
          (settings.geminiModel as
            | "gemini-2.5-flash"
            | "gemini-2.5-flash-lite"
            | "gemini-2.5-pro"
            | undefined) ?? "gemini-2.5-flash",
          {
            companyName: lead.companyName,
            city: lead.city,
            industry: lead.industry,
            serviceArea: lead.serviceArea,
            knownPhone: lead.phone,
            knownWebsite: lead.website,
            leadGrade: lead.leadGrade,
          },
          ctrl.signal,
        );
        setState({ kind: "ready", result });
      } catch (err) {
        if (ctrl.signal.aborted) return;
        const message =
          err instanceof GeminiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Unbekannter Fehler.";
        setState({ kind: "error", message });
      }
    })();
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead.id]);

  // ----- Build comparison rows once ready -----
  const rows: FieldRow[] = useMemo(() => {
    if (state.kind !== "ready") return [];
    const r = state.result;
    const ratingText =
      r.googleRating != null
        ? `${r.googleRating.toString().replace(".", ",")} ★${
            r.googleReviewCount ? ` (${r.googleReviewCount} Bewertungen)` : ""
          }`
        : undefined;

    const list: FieldRow[] = [
      {
        key: "website",
        label: "Website",
        current: lead.website,
        suggested: r.website,
        default: !lead.website && !!r.website,
      },
      {
        key: "phone",
        label: "Telefon",
        current: lead.phone,
        suggested: r.phone,
        default: !lead.phone && !!r.phone,
      },
      {
        key: "email",
        label: "E-Mail",
        current: lead.email,
        suggested: r.email,
        default: !lead.email && !!r.email,
      },
      {
        key: "address",
        label: "Adresse",
        current: lead.address,
        suggested: r.address,
        default: !lead.address && !!r.address,
      },
      {
        key: "openingHours",
        label: "Öffnungszeiten",
        current: lead.openingHours,
        suggested: r.openingHours,
        default: !lead.openingHours && !!r.openingHours,
      },
      {
        key: "ratingSignal",
        label: "Google-Bewertung",
        current: lead.ratingSignal,
        suggested: r.ratingSignal ?? ratingText,
        default: !lead.ratingSignal && !!(r.ratingSignal ?? ratingText),
      },
      {
        key: "websiteCheck",
        label: "Web-Check",
        current: lead.websiteCheck,
        suggested: r.websiteCheck,
        default: !lead.websiteCheck && !!r.websiteCheck,
      },
      {
        key: "social.instagram",
        label: "Instagram",
        current: lead.social?.instagram,
        suggested: r.social.instagram,
        default: !lead.social?.instagram && !!r.social.instagram,
      },
      {
        key: "social.facebook",
        label: "Facebook",
        current: lead.social?.facebook,
        suggested: r.social.facebook,
        default: !lead.social?.facebook && !!r.social.facebook,
      },
      {
        key: "social.tiktok",
        label: "TikTok",
        current: lead.social?.tiktok,
        suggested: r.social.tiktok,
        default: !lead.social?.tiktok && !!r.social.tiktok,
      },
      {
        key: "social.linkedin",
        label: "LinkedIn",
        current: lead.social?.linkedin,
        suggested: r.social.linkedin,
        default: !lead.social?.linkedin && !!r.social.linkedin,
      },
      {
        key: "social.youtube",
        label: "YouTube",
        current: lead.social?.youtube,
        suggested: r.social.youtube,
        default: !lead.social?.youtube && !!r.social.youtube,
      },
    ];
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Initialise picks once, when result first lands.
  useEffect(() => {
    if (state.kind !== "ready") return;
    const initial: Record<string, boolean> = {};
    for (const r of rows) initial[r.key] = r.default;
    setPicks(initial);
    setAcceptPitch(false);
  }, [state, rows]);

  const visibleRows = rows.filter(
    (r) => r.suggested && r.suggested.trim().length > 0,
  );
  const acceptedCount = Object.values(picks).filter(Boolean).length;
  const showPitch =
    state.kind === "ready" &&
    !!state.result.pitchSuggestion &&
    (lead.leadGrade === "B" ||
      lead.leadGrade === "C" ||
      lead.leadGrade === "Unknown");

  const onApply = async () => {
    if (state.kind !== "ready") return;
    setApplying(true);
    try {
      const r = state.result;
      const patch: Partial<Lead> = {};
      const social = { ...(lead.social ?? {}) };
      const changes: string[] = [];

      const setIf = (key: string, label: string, value: string | undefined) => {
        if (!picks[key] || !value) return;
        switch (key) {
          case "website":
            patch.website = value;
            break;
          case "phone":
            patch.phone = value;
            break;
          case "email":
            patch.email = value;
            break;
          case "address":
            patch.address = value;
            break;
          case "openingHours":
            patch.openingHours = value;
            break;
          case "ratingSignal":
            patch.ratingSignal = value;
            break;
          case "websiteCheck": {
            patch.websiteCheck = value;
            const bucket = mapWebsiteCheckToBucket(value);
            if (bucket) {
              patch.websiteCheckBucket = bucket;
              // If Gemini explicitly says no website exists, also clear
              // any stale URL on the lead so the UI is consistent and
              // the next-best-step recompute reacts correctly.
              if (bucket === "Keine Website gefunden") {
                patch.website = undefined;
              }
            }
            break;
          }
          case "social.instagram":
            social.instagram = value;
            break;
          case "social.facebook":
            social.facebook = value;
            break;
          case "social.tiktok":
            social.tiktok = value;
            break;
          case "social.linkedin":
            social.linkedin = value;
            break;
          case "social.youtube":
            social.youtube = value;
            break;
        }
        changes.push(label);
      };

      for (const row of rows) setIf(row.key, row.label, row.suggested);

      // If the user accepted a fresh website URL but did NOT explicitly
      // accept a websiteCheck bucket, default the bucket to
      // "Website gefunden" — but only when the existing bucket is still
      // empty/Unbekannt, so we never overwrite a deliberate manual choice.
      if (
        picks.website &&
        !picks.websiteCheck &&
        patch.website &&
        (!lead.websiteCheckBucket || lead.websiteCheckBucket === "Unbekannt")
      ) {
        patch.websiteCheckBucket = "Website gefunden";
      }

      if (
        Object.keys(social).length > 0 &&
        Object.values(social).some(Boolean)
      ) {
        patch.social = social;
      }

      // Numeric fields if rating row was accepted
      if (picks.ratingSignal) {
        if (r.googleRating != null) patch.googleRating = r.googleRating;
        if (r.googleReviewCount != null)
          patch.googleReviewCount = r.googleReviewCount;
      }

      if (showPitch && acceptPitch && r.pitchSuggestion) {
        patch.pitchSuggestion = r.pitchSuggestion;
        changes.push("Pitch-Vorschlag");
      }

      patch.enrichedAt = new Date().toISOString();
      // Mark Google as checked once an enrichment has been accepted.
      if (changes.length > 0 && lead.googleCheckStatus !== "Geprüft") {
        patch.googleCheckStatus = "Geprüft";
      }

      portalStore.updateLead(lead.id, patch);

      if (changes.length > 0) {
        portalStore.addLeadActivity(
          lead.id,
          "Notiz",
          `Auto-Check (Gemini) übernommen: ${changes.join(", ")}.`,
        );
      } else {
        portalStore.addLeadActivity(
          lead.id,
          "Notiz",
          "Auto-Check (Gemini) ausgeführt — keine Felder übernommen.",
        );
      }
      onClose();
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/70 p-4 sm:p-8">
      <div className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0F0F11] shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-6 py-4">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-white/40">
              Auto-Check · Gemini
            </div>
            <h2 className="mt-0.5 font-instrument text-2xl text-white">
              {lead.companyName}
            </h2>
            <div className="mt-0.5 text-[12px] text-white/45">
              {lead.city}
              {lead.industry ? ` · ${lead.industry}` : ""} · Grade{" "}
              {lead.leadGrade}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[12px] text-white/65 hover:text-white"
          >
            Schließen
          </button>
        </header>

        <div className="max-h-[70vh] overflow-y-auto">
          {state.kind === "loading" ? (
            <div className="flex items-center justify-center px-6 py-16 text-[13px] text-white/55">
              <Spinner /> &nbsp; Gemini recherchiert mit Google-Suche…
            </div>
          ) : null}

          {state.kind === "error" ? (
            <div className="px-6 py-8">
              <div className="rounded-md border border-rose-400/25 bg-rose-400/[0.06] p-4 text-[13px] text-rose-100">
                <div className="mb-1 font-medium text-rose-50">
                  Auto-Check fehlgeschlagen
                </div>
                <div>{state.message}</div>
              </div>
            </div>
          ) : null}

          {state.kind === "ready" ? (
            <>
              {/* Comparison table */}
              <section className="px-6 pt-5">
                <div className="mb-2 grid grid-cols-[28px_120px_minmax(0,1fr)_minmax(0,1fr)] gap-3 text-[10.5px] uppercase tracking-[0.14em] text-white/35">
                  <span></span>
                  <span>Feld</span>
                  <span>Aktuell</span>
                  <span>Vorschlag</span>
                </div>
                {visibleRows.length === 0 ? (
                  <div className="rounded-md border border-white/[0.06] bg-white/[0.015] p-4 text-[13px] text-white/55">
                    Gemini hat keine zusätzlichen Felder gefunden, die nicht
                    bereits am Lead hinterlegt sind.
                  </div>
                ) : (
                  <ul className="divide-y divide-white/[0.05] rounded-md border border-white/[0.06] bg-white/[0.015]">
                    {visibleRows.map((row) => {
                      const isUrl =
                        row.suggested?.startsWith("http://") ||
                        row.suggested?.startsWith("https://");
                      return (
                        <li
                          key={row.key}
                          className="grid grid-cols-[28px_120px_minmax(0,1fr)_minmax(0,1fr)] items-start gap-3 px-3 py-2.5"
                        >
                          <input
                            type="checkbox"
                            checked={!!picks[row.key]}
                            onChange={(e) =>
                              setPicks((p) => ({
                                ...p,
                                [row.key]: e.target.checked,
                              }))
                            }
                            className="mt-1 h-4 w-4 cursor-pointer accent-white"
                          />
                          <span className="text-[12px] text-white/65">
                            {row.label}
                          </span>
                          <span className="break-words text-[12.5px] text-white/45">
                            {row.current ?? "—"}
                          </span>
                          <span className="break-words text-[12.5px] text-white">
                            {isUrl ? (
                              <a
                                href={row.suggested}
                                target="_blank"
                                rel="noreferrer"
                                className="underline decoration-white/30 underline-offset-2 hover:text-white/85"
                              >
                                {row.suggested}
                              </a>
                            ) : (
                              row.suggested
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              {/* Pitch suggestion (B/C only) */}
              {showPitch ? (
                <section className="mt-4 px-6">
                  <div className="rounded-md border border-amber-300/20 bg-amber-300/[0.04] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[10.5px] uppercase tracking-[0.16em] text-amber-200/70">
                          Pitch-Vorschlag · für {lead.leadGrade}-Lead
                        </div>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-amber-50">
                          {state.result.pitchSuggestion}
                        </p>
                      </div>
                      <label className="flex shrink-0 items-center gap-2 text-[11.5px] text-amber-100/80">
                        <input
                          type="checkbox"
                          checked={acceptPitch}
                          onChange={(e) => setAcceptPitch(e.target.checked)}
                          className="h-4 w-4 cursor-pointer accent-amber-300"
                        />
                        speichern
                      </label>
                    </div>
                  </div>
                </section>
              ) : null}

              {/* Notes */}
              {state.result.notes ? (
                <section className="mt-4 px-6">
                  <div className="rounded-md border border-white/[0.06] bg-white/[0.015] p-3 text-[12px] leading-relaxed text-white/55">
                    <span className="text-[10.5px] uppercase tracking-[0.14em] text-white/40">
                      Hinweis Gemini
                    </span>
                    <div className="mt-1">{state.result.notes}</div>
                  </div>
                </section>
              ) : null}

              {/* Sources */}
              {state.result.sources.length > 0 ? (
                <section className="mt-4 px-6 pb-2">
                  <div className="text-[10.5px] uppercase tracking-[0.14em] text-white/40">
                    Quellen ({state.result.sources.length})
                  </div>
                  <ul className="mt-2 space-y-1">
                    {state.result.sources.slice(0, 8).map((s, i) => (
                      <li key={`${s.uri}-${i}`} className="truncate text-[12px]">
                        <a
                          href={s.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="text-white/70 underline decoration-white/20 underline-offset-2 hover:text-white"
                        >
                          {s.title || s.uri}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </>
          ) : null}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-white/[0.07] bg-white/[0.015] px-6 py-3">
          <div className="text-[11.5px] text-white/45">
            {state.kind === "ready"
              ? `${acceptedCount} Feld${acceptedCount === 1 ? "" : "er"} ausgewählt${
                  showPitch && acceptPitch ? " · inkl. Pitch" : ""
                }`
              : ""}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/65 hover:text-white"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={() => void onApply()}
              disabled={
                state.kind !== "ready" ||
                applying ||
                (acceptedCount === 0 && !(showPitch && acceptPitch))
              }
              className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {applying ? "Übernehme…" : "Ausgewählte übernehmen"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/80"
    />
  );
}
