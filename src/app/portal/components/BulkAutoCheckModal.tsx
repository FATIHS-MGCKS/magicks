/**
 * Bulk-Auto-Check fuer alle ungecheckten Leads.
 *
 * Verhalten:
 *   - Sequentiell, mit 2.5s Pause zwischen den Calls (rate-limit-safe).
 *   - Pro Lead: alle Felder, fuer die Gemini einen Wert geliefert hat,
 *     werden auf den Lead geschrieben (ueberschreibt). Felder ohne
 *     Vorschlag bleiben unangetastet.
 *   - Pause/Resume und Stop sind moeglich.
 *   - Fehler je Lead: Lead skip + Fehlerzeile, weiterer Lauf.
 *   - Schliessen ohne Stop bricht NICHT ab — laeuft im Hintergrund weiter
 *     (deshalb explizit "Stop" Button).
 */

import { useEffect, useRef, useState } from "react";
import {
  buildBulkPatchFromEnrichment,
  GeminiError,
  runLeadEnrichment,
  type GeminiModel,
} from "../data/gemini";
import { portalStore } from "../hooks/useStore";
import type { Lead } from "../data/types";

interface BulkAutoCheckModalProps {
  /** Leads die als ungecheckt gelten (enrichedAt leer). */
  candidates: Lead[];
  apiKey: string;
  model: GeminiModel;
  onClose: () => void;
}

type Phase = "idle" | "running" | "paused" | "done" | "stopped";

interface RowState {
  leadId: string;
  status: "pending" | "running" | "ok" | "error" | "skipped";
  message?: string;
  changedCount?: number;
}

const DELAY_MS = 2500;

export function BulkAutoCheckModal({
  candidates,
  apiKey,
  model,
  onClose,
}: BulkAutoCheckModalProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [index, setIndex] = useState(0);
  const [rows, setRows] = useState<RowState[]>(() =>
    candidates.map((l) => ({ leadId: l.id, status: "pending" })),
  );

  const phaseRef = useRef<Phase>(phase);
  phaseRef.current = phase;
  const indexRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const updateRow = (leadId: string, patch: Partial<RowState>) => {
    setRows((prev) =>
      prev.map((r) => (r.leadId === leadId ? { ...r, ...patch } : r)),
    );
  };

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      const t = setTimeout(resolve, ms);
      const check = () => {
        if (phaseRef.current === "stopped") {
          clearTimeout(t);
          resolve();
        } else if (phaseRef.current === "paused") {
          // wait until resumed or stopped
          setTimeout(check, 200);
        }
      };
      setTimeout(check, 50);
    });

  /** Run loop. Re-entrant safe via phaseRef checks. */
  const runLoop = async () => {
    for (let i = indexRef.current; i < candidates.length; i += 1) {
      // Pause-Loop
      while (phaseRef.current === "paused") {
        await sleep(150);
      }
      if (phaseRef.current === "stopped") return;

      indexRef.current = i;
      setIndex(i);

      const lead = candidates[i];
      updateRow(lead.id, { status: "running" });

      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const result = await runLeadEnrichment(
          apiKey,
          model,
          {
            companyName: lead.companyName,
            city: lead.city,
            industry: lead.industry,
            serviceArea: lead.serviceArea,
            knownPhone: lead.phone,
            knownWebsite: lead.website,
            leadGrade: lead.leadGrade,
            bulkMode: true,
          },
          ctrl.signal,
        );

        const { patch, changedFields } = buildBulkPatchFromEnrichment(
          result,
          lead.leadGrade,
        );

        // Apply
        portalStore.updateLead(lead.id, patch as Partial<Lead>);
        if (changedFields.length > 0) {
          portalStore.addLeadActivity(
            lead.id,
            "Notiz",
            `Bulk-Auto-Check (Gemini) übernommen: ${changedFields.join(", ")}.`,
          );
        } else {
          portalStore.addLeadActivity(
            lead.id,
            "Notiz",
            "Bulk-Auto-Check (Gemini) ausgeführt — keine zusätzlichen Felder.",
          );
        }

        updateRow(lead.id, {
          status: "ok",
          changedCount: changedFields.length,
        });
      } catch (err) {
        if (ctrl.signal.aborted && phaseRef.current === "stopped") {
          updateRow(lead.id, {
            status: "skipped",
            message: "Abbruch durch Nutzer.",
          });
          return;
        }
        const msg =
          err instanceof GeminiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Unbekannter Fehler.";
        updateRow(lead.id, { status: "error", message: msg });
      } finally {
        abortRef.current = null;
      }

      // Pause zwischen Calls
      if (i < candidates.length - 1) {
        await sleep(DELAY_MS);
      }
      if (phaseRef.current === "stopped") return;
    }
    setPhase("done");
  };

  const start = () => {
    if (phase === "running" || phase === "done" || phase === "stopped") return;
    setPhase("running");
    void runLoop();
  };

  const pause = () => {
    if (phase === "running") setPhase("paused");
  };

  const resume = () => {
    if (phase === "paused") setPhase("running");
  };

  const stop = () => {
    setPhase("stopped");
    abortRef.current?.abort();
  };

  // Auto-cleanup wenn Modal unmountet
  useEffect(() => {
    return () => {
      // Wir brechen den aktuellen Call ab, lassen aber bereits
      // gespeicherte Felder bestehen. Wer das Modal schliesst und
      // wieder oeffnet startet von vorne — die enrichedAt-Filter
      // ueberspringen erfolgreiche Leads automatisch.
      abortRef.current?.abort();
      phaseRef.current = "stopped";
    };
  }, []);

  const okCount = rows.filter((r) => r.status === "ok").length;
  const errCount = rows.filter((r) => r.status === "error").length;
  const total = candidates.length;
  const progress = total === 0 ? 0 : Math.round(((index + (phase === "done" ? 1 : 0)) / total) * 100);

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/70 p-4 sm:p-8">
      <div className="my-auto flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0F0F11] shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-6 py-4">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-white/40">
              Auto-Check Alle · Gemini · Bulk
            </div>
            <h2 className="mt-0.5 font-instrument text-2xl text-white">
              {total} ungecheckte Leads
            </h2>
            <div className="mt-0.5 text-[12px] text-white/45">
              Sequentiell mit {DELAY_MS / 1000} s Pause zwischen den Calls.
              Schliessen pausiert/stoppt den Lauf nicht — dafuer den Stop-Button
              nutzen.
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

        {/* Steuerleiste + Progress */}
        <div className="border-b border-white/[0.06] px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {phase === "idle" ? (
                <button
                  type="button"
                  onClick={start}
                  disabled={total === 0}
                  className="rounded-md border border-amber-300/30 bg-amber-300/[0.12] px-3 py-1.5 text-[12.5px] font-medium text-amber-100 transition hover:bg-amber-300/[0.2] disabled:opacity-40"
                >
                  Lauf starten
                </button>
              ) : null}
              {phase === "running" ? (
                <button
                  type="button"
                  onClick={pause}
                  className="rounded-md border border-white/15 bg-white/[0.05] px-3 py-1.5 text-[12.5px] text-white/85 hover:bg-white/[0.10]"
                >
                  Pause
                </button>
              ) : null}
              {phase === "paused" ? (
                <button
                  type="button"
                  onClick={resume}
                  className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black hover:bg-white"
                >
                  Fortsetzen
                </button>
              ) : null}
              {(phase === "running" || phase === "paused") ? (
                <button
                  type="button"
                  onClick={stop}
                  className="rounded-md border border-rose-400/30 bg-rose-400/[0.08] px-3 py-1.5 text-[12.5px] text-rose-200 hover:bg-rose-400/[0.16]"
                >
                  Stop
                </button>
              ) : null}
              {phase === "done" ? (
                <span className="rounded-md border border-emerald-400/25 bg-emerald-400/[0.08] px-3 py-1.5 text-[12.5px] text-emerald-200">
                  Lauf abgeschlossen
                </span>
              ) : null}
              {phase === "stopped" ? (
                <span className="rounded-md border border-rose-400/25 bg-rose-400/[0.08] px-3 py-1.5 text-[12.5px] text-rose-200">
                  Gestoppt
                </span>
              ) : null}
            </div>
            <div className="text-[11.5px] text-white/55">
              {okCount} erfolgreich · {errCount} Fehler · {total - okCount - errCount} offen
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full bg-amber-300/70 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Lead-Liste */}
        <div className="flex-1 overflow-y-auto px-6 py-3">
          <ul className="divide-y divide-white/[0.05]">
            {candidates.map((lead, i) => {
              const row = rows[i];
              const isCurrent = i === index && phase === "running";
              return (
                <li
                  key={lead.id}
                  className={`flex items-start justify-between gap-3 py-2.5 ${
                    isCurrent ? "bg-amber-300/[0.04] -mx-2 px-2 rounded" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <div className="truncate text-[13px] text-white">
                      {lead.companyName}
                    </div>
                    <div className="text-[11.5px] text-white/45">
                      {lead.city}
                      {lead.industry ? ` · ${lead.industry}` : ""} · Grade {lead.leadGrade}
                    </div>
                    {row?.message ? (
                      <div className="mt-0.5 text-[11.5px] text-rose-300/85">
                        {row.message}
                      </div>
                    ) : null}
                  </div>
                  <RowStatus row={row} />
                </li>
              );
            })}
          </ul>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-white/[0.07] bg-white/[0.015] px-6 py-3">
          <div className="text-[11.5px] text-white/45">
            Modell: <span className="text-white/75">{model}</span>
          </div>
          <div className="text-[11.5px] text-white/45">
            {phase === "running"
              ? `läuft – ${index + 1} / ${total}`
              : phase === "paused"
                ? "pausiert"
                : phase === "done"
                  ? "fertig"
                  : phase === "stopped"
                    ? "gestoppt"
                    : "bereit"}
          </div>
        </footer>
      </div>
    </div>
  );
}

function RowStatus({ row }: { row?: RowState }) {
  if (!row) return null;
  if (row.status === "pending")
    return <span className="text-[11px] text-white/35">offen</span>;
  if (row.status === "running")
    return <span className="text-[11px] text-amber-200/85">…</span>;
  if (row.status === "ok")
    return (
      <span className="text-[11px] text-emerald-300/85">
        {row.changedCount ?? 0} Felder
      </span>
    );
  if (row.status === "skipped")
    return <span className="text-[11px] text-white/35">übersprungen</span>;
  return <span className="text-[11px] text-rose-300/85">Fehler</span>;
}
