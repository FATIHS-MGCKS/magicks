/**
 * BusinessProfileModal — tiefe Gemini-Recherche + Pitch-Prompt-Bau pro Lead.
 *
 * Vier Phasen:
 *   1. idle     — Intro + "Recherche starten" (Bestaetigung falls ueberschrieben wird)
 *   2. running  — Progress + Abort
 *   3. review   — Hybrid-Editor: strukturiertes Formular fuer 8-10 subjektive
 *                 Felder oben, Raw-JSON-Editor darunter, Template-Toggle,
 *                 Quellen-Anzeige. "Speichern" persistiert am Lead,
 *                 "Prompt generieren" geht in die prompt-Phase.
 *   4. prompt   — grosse read-only Textarea mit fertigem Prompt,
 *                 "In Zwischenablage kopieren" (triggert Activity-Log),
 *                 "Zurueck zum Editor".
 *
 * Persistenz: jede akzeptierte Aenderung geht ueber
 * `portalStore.setLeadBusinessProfile` und damit in den Supabase-Snapshot.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  runBusinessProfileResearch,
  emptyBusinessProfile,
} from "../data/geminiProfile";
import { GeminiError, type GeminiModel } from "../data/gemini";
import {
  buildPitchPrompt,
  PITCH_PROMPT_MODES,
  suggestPitchPromptMode,
  type PitchPromptMode,
} from "../data/pitchPrompts";
import {
  PREFERRED_THEMES,
  type BusinessProfile,
  type Lead,
  type PreferredTheme,
} from "../data/types";
import { formatDateTime, formatRelative } from "./format";
import { portalStore } from "../hooks/useStore";

type Phase =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "error"; message: string }
  | { kind: "review"; profile: BusinessProfile; dirty: boolean }
  | { kind: "prompt"; profile: BusinessProfile; mode: PitchPromptMode; text: string };

interface BusinessProfileModalProps {
  lead: Lead;
  onClose: () => void;
}

export function BusinessProfileModal({ lead, onClose }: BusinessProfileModalProps) {
  const settings = portalStore.getSettings();
  const geminiReady = !!settings.geminiApiKey;
  const model = (settings.geminiModel as GeminiModel | undefined) ?? "gemini-2.5-flash";

  const [phase, setPhase] = useState<Phase>(() =>
    lead.businessProfile
      ? { kind: "review", profile: lead.businessProfile, dirty: false }
      : { kind: "idle" },
  );
  const [templateMode, setTemplateMode] = useState<PitchPromptMode>(() =>
    lead.businessProfile
      ? suggestPitchPromptMode(lead.businessProfile)
      : lead.website
        ? "redesign"
        : "new",
  );

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const runResearch = async () => {
    if (!geminiReady) {
      setPhase({
        kind: "error",
        message:
          "Kein Gemini-API-Key konfiguriert. Bitte unter Einstellungen → KI-Recherche eintragen.",
      });
      return;
    }
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setPhase({ kind: "running" });
    try {
      const result = await runBusinessProfileResearch(
        settings.geminiApiKey!,
        model,
        {
          companyName: lead.companyName,
          city: lead.city,
          industry: lead.industry,
          serviceArea: lead.serviceArea,
          knownPhone: lead.phone,
          knownWebsite: lead.website,
          knownEmail: lead.email,
          knownAddress: lead.address,
          leadGrade: lead.leadGrade,
        },
        ctrl.signal,
      );
      setTemplateMode(suggestPitchPromptMode(result));
      setPhase({ kind: "review", profile: result, dirty: true });
    } catch (err) {
      if (ctrl.signal.aborted) {
        setPhase(
          lead.businessProfile
            ? { kind: "review", profile: lead.businessProfile, dirty: false }
            : { kind: "idle" },
        );
        return;
      }
      const message =
        err instanceof GeminiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Unbekannter Fehler bei der Gemini-Recherche.";
      setPhase({ kind: "error", message });
    } finally {
      abortRef.current = null;
    }
  };

  const abort = () => {
    abortRef.current?.abort();
  };

  const handleSave = (profile: BusinessProfile) => {
    portalStore.setLeadBusinessProfile(lead.id, profile);
    setPhase({ kind: "review", profile, dirty: false });
  };

  const handleGeneratePrompt = (profile: BusinessProfile, mode: PitchPromptMode) => {
    portalStore.setLeadBusinessProfile(lead.id, profile);
    const text = buildPitchPrompt(profile, mode);
    setPhase({ kind: "prompt", profile, mode, text });
  };

  const handleCopyPrompt = async (mode: PitchPromptMode, text: string) => {
    let ok = false;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-1000px";
        ta.style.top = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    const label = mode === "redesign" ? "Redesign" : "Website-Konzept";
    portalStore.addLeadActivity(
      lead.id,
      "Notiz",
      `Pitch-Prompt (${label}) erzeugt und in Zwischenablage kopiert.`,
    );
    return ok;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center bg-black/70 p-4 sm:p-8">
      <div className="my-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0F0F11] shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-6 py-4">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-white/40">
              Business-Profil · Gemini
            </div>
            <h2 className="mt-0.5 font-instrument text-2xl text-white">
              {lead.companyName}
            </h2>
            <div className="mt-0.5 text-[12px] text-white/45">
              {lead.city}
              {lead.industry ? ` · ${lead.industry}` : ""} · Grade {lead.leadGrade}
              {lead.businessProfile?.researchedAt ? (
                <>
                  {" · zuletzt recherchiert "}
                  <span title={formatDateTime(lead.businessProfile.researchedAt)}>
                    {formatRelative(lead.businessProfile.researchedAt)}
                  </span>
                </>
              ) : null}
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

        <div className="max-h-[78vh] overflow-y-auto">
          {phase.kind === "idle" ? (
            <IdlePhase
              hasProfile={!!lead.businessProfile}
              geminiReady={geminiReady}
              onStart={runResearch}
            />
          ) : null}

          {phase.kind === "running" ? (
            <RunningPhase onAbort={abort} />
          ) : null}

          {phase.kind === "error" ? (
            <ErrorPhase
              message={phase.message}
              onRetry={runResearch}
              hasProfile={!!lead.businessProfile}
              onBack={() =>
                setPhase(
                  lead.businessProfile
                    ? { kind: "review", profile: lead.businessProfile, dirty: false }
                    : { kind: "idle" },
                )
              }
            />
          ) : null}

          {phase.kind === "review" ? (
            <ReviewPhase
              key={phase.profile.researchedAt ?? "manual"}
              profile={phase.profile}
              dirty={phase.dirty}
              mode={templateMode}
              onChangeMode={setTemplateMode}
              onReresearch={runResearch}
              onSave={handleSave}
              onGenerate={(p) => handleGeneratePrompt(p, templateMode)}
              onMarkDirty={() =>
                setPhase({ kind: "review", profile: phase.profile, dirty: true })
              }
              onProfileChange={(next) =>
                setPhase({ kind: "review", profile: next, dirty: true })
              }
            />
          ) : null}

          {phase.kind === "prompt" ? (
            <PromptPhase
              profile={phase.profile}
              mode={phase.mode}
              text={phase.text}
              onBack={() =>
                setPhase({ kind: "review", profile: phase.profile, dirty: false })
              }
              onCopy={() => handleCopyPrompt(phase.mode, phase.text)}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Idle / Running / Error phases
// ---------------------------------------------------------------------------

function IdlePhase({
  hasProfile,
  geminiReady,
  onStart,
}: {
  hasProfile: boolean;
  geminiReady: boolean;
  onStart: () => void;
}) {
  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-xl text-center">
        <h3 className="font-instrument text-2xl text-white">
          Tiefes Business-Profil recherchieren
        </h3>
        <p className="mt-3 text-[13.5px] leading-[1.6] text-white/65">
          Gemini durchsucht Google Live-Daten und fuellt ein 40-Feld-Schema
          mit Branche, Services, Zielkunden, Bewertungen, Design-Chancen,
          Positionierung und Branding-Hinweisen. Das Ergebnis kannst du vor
          dem Prompt-Bau Feld fuer Feld nachjustieren.
        </p>
        {!geminiReady ? (
          <div className="mt-6 rounded-md border border-amber-400/25 bg-amber-400/[0.06] px-4 py-3 text-[12.5px] text-amber-100">
            Kein Gemini-API-Key konfiguriert. Bitte unter Einstellungen → KI-Recherche eintragen.
          </div>
        ) : null}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={!geminiReady}
            onClick={onStart}
            className="rounded-md border border-white/15 bg-white/95 px-4 py-2 text-[13px] font-medium text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {hasProfile ? "Neu recherchieren" : "Recherche starten"}
          </button>
        </div>
        {hasProfile ? (
          <p className="mt-3 text-[11.5px] text-white/40">
            Eine neue Recherche ueberschreibt das aktuell gespeicherte Profil erst beim Speichern — du kannst das Ergebnis vorher vergleichen.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function RunningPhase({ onAbort }: { onAbort: () => void }) {
  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center">
          <span
            aria-hidden
            className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/80"
          />
        </div>
        <h3 className="mt-4 font-instrument text-xl text-white">
          Gemini recherchiert…
        </h3>
        <p className="mt-2 text-[13px] text-white/55">
          Live-Google-Suche + 40-Feld-Schema. Das kann ca. 20-40 Sekunden dauern.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={onAbort}
            className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/70 hover:text-white"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorPhase({
  message,
  onRetry,
  hasProfile,
  onBack,
}: {
  message: string;
  onRetry: () => void;
  hasProfile: boolean;
  onBack: () => void;
}) {
  return (
    <div className="px-6 py-8">
      <div className="rounded-md border border-rose-400/25 bg-rose-400/[0.06] p-4 text-[13px] text-rose-100">
        <div className="mb-1 font-medium text-rose-50">
          Recherche fehlgeschlagen
        </div>
        <div>{message}</div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black transition hover:bg-white"
        >
          Erneut versuchen
        </button>
        {hasProfile ? (
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/65 hover:text-white"
          >
            Zurück zum gespeicherten Profil
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Review phase: hybrid editor
// ---------------------------------------------------------------------------

interface ReviewPhaseProps {
  profile: BusinessProfile;
  dirty: boolean;
  mode: PitchPromptMode;
  onChangeMode: (mode: PitchPromptMode) => void;
  onReresearch: () => void;
  onSave: (profile: BusinessProfile) => void;
  onGenerate: (profile: BusinessProfile) => void;
  onMarkDirty: () => void;
  onProfileChange: (next: BusinessProfile) => void;
}

function ReviewPhase({
  profile,
  dirty,
  mode,
  onChangeMode,
  onReresearch,
  onSave,
  onGenerate,
  onProfileChange,
}: ReviewPhaseProps) {
  const [rawOpen, setRawOpen] = useState(false);
  const [rawText, setRawText] = useState<string>(() =>
    JSON.stringify(stripMeta(profile), null, 2),
  );
  const [rawError, setRawError] = useState<string | null>(null);

  useEffect(() => {
    setRawText(JSON.stringify(stripMeta(profile), null, 2));
    setRawError(null);
  }, [profile]);

  const update = <K extends keyof BusinessProfile>(
    key: K,
    value: BusinessProfile[K],
  ) => {
    onProfileChange({ ...profile, [key]: value });
  };

  const commitRaw = () => {
    try {
      const parsed = JSON.parse(rawText) as Partial<BusinessProfile>;
      const merged: BusinessProfile = {
        ...emptyBusinessProfile(profile),
        ...parsed,
        researchedAt: profile.researchedAt,
        sources: profile.sources,
      };
      onProfileChange(merged);
      setRawError(null);
    } catch (err) {
      setRawError(
        err instanceof Error ? err.message : "JSON konnte nicht geparst werden.",
      );
    }
  };

  return (
    <div className="px-6 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-3">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-white/40">
            Hybrid-Editor
          </div>
          <div className="text-[12.5px] text-white/65">
            Subjektive Felder oben direkt editieren, alles weitere im Raw-JSON.
            {dirty ? (
              <span className="ml-2 rounded bg-amber-300/[0.14] px-1.5 py-0.5 text-[10.5px] uppercase tracking-[0.14em] text-amber-200/90">
                ungespeichert
              </span>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onReresearch}
          className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/65 hover:text-white"
        >
          Neu recherchieren
        </button>
      </div>

      {profile.sources && profile.sources.length > 0 ? (
        <details className="mt-4 rounded-md border border-white/[0.06] bg-white/[0.015] open:bg-white/[0.025]">
          <summary className="cursor-pointer list-none px-3 py-2 text-[11.5px] text-white/65 hover:text-white [&::-webkit-details-marker]:hidden">
            Quellen · {profile.sources.length}
          </summary>
          <ul className="space-y-1.5 px-3 pb-3 text-[11.5px] text-white/70">
            {profile.sources.map((s) => (
              <li key={s.uri} className="truncate">
                <a
                  href={s.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 underline decoration-white/20 hover:text-white"
                >
                  {s.title || s.uri}
                </a>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {/* Strukturierte Karten fuer die subjektiven Felder ---------------- */}
      <div className="mt-4 grid gap-4">
        <Card title="Theme & Stil">
          <div className="grid gap-3 md:grid-cols-2">
            <LabeledField label="Preferred Theme">
              <div className="flex gap-1.5">
                {PREFERRED_THEMES.map((t) => (
                  <ToggleChip
                    key={t}
                    active={profile.preferred_theme === t}
                    onClick={() => update("preferred_theme", t as PreferredTheme)}
                  >
                    {t}
                  </ToggleChip>
                ))}
              </div>
            </LabeledField>
            <LabeledField label="Desired Style">
              <TextInput
                value={profile.desired_style}
                onChange={(v) => update("desired_style", v)}
                placeholder='z. B. "Editorial Minimal"'
              />
            </LabeledField>
            <LabeledField label="Tone of Voice">
              <TextInput
                value={profile.tone_of_voice}
                onChange={(v) => update("tone_of_voice", v)}
                placeholder='z. B. "Persoenlich, direkt, ohne Floskeln"'
              />
            </LabeledField>
            <LabeledField label="Visual Mood">
              <TextInput
                value={profile.visual_mood}
                onChange={(v) => update("visual_mood", v)}
                placeholder='z. B. "Ruhig, konzentriert, handwerklich"'
              />
            </LabeledField>
            <LabeledField label="Image Style" className="md:col-span-2">
              <TextInput
                value={profile.image_style}
                onChange={(v) => update("image_style", v)}
                placeholder='z. B. "Naturalistische Portraits + Detailaufnahmen"'
              />
            </LabeledField>
          </div>
        </Card>

        <Card title="Brand Colors">
          <ChipList
            values={profile.brand_colors}
            onChange={(v) => update("brand_colors", v)}
            placeholder="#RRGGBB"
            mono
            swatch
          />
        </Card>

        <Card title="CTAs & Section Focus">
          <div className="grid gap-3">
            <LabeledField label="Primary CTA">
              <TextInput
                value={profile.primary_cta}
                onChange={(v) => update("primary_cta", v)}
                placeholder='z. B. "Jetzt Termin buchen"'
              />
            </LabeledField>
            <LabeledField label="Secondary CTAs">
              <ChipList
                values={profile.secondary_ctas}
                onChange={(v) => update("secondary_ctas", v)}
                placeholder="z. B. Leistungen ansehen"
              />
            </LabeledField>
            <LabeledField label="Section Focus">
              <ChipList
                values={profile.section_focus}
                onChange={(v) => update("section_focus", v)}
                placeholder="z. B. Hero · Leistungen · Team · Kontakt"
              />
            </LabeledField>
          </div>
        </Card>

        <Card title="Positionierung & Ziel">
          <div className="grid gap-3">
            <LabeledField label="Recommended Positioning">
              <TextArea
                value={profile.recommended_positioning}
                onChange={(v) => update("recommended_positioning", v)}
                rows={2}
              />
            </LabeledField>
            <LabeledField label="Recommended Website Goal">
              <TextArea
                value={profile.recommended_website_goal}
                onChange={(v) => update("recommended_website_goal", v)}
                rows={2}
              />
            </LabeledField>
          </div>
        </Card>

        <Card title="Raw JSON (alle 40 Felder)">
          <button
            type="button"
            onClick={() => setRawOpen((v) => !v)}
            className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[12px] text-white/75 hover:text-white"
          >
            {rawOpen ? "Raw-Editor schliessen" : "Raw-Editor oeffnen"}
          </button>
          {rawOpen ? (
            <div className="mt-3">
              <textarea
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  setRawError(null);
                }}
                onBlur={commitRaw}
                spellCheck={false}
                className="block h-72 w-full resize-y rounded-md border border-white/10 bg-black/40 p-3 font-mono text-[12px] leading-[1.5] text-white/85 outline-none focus:border-white/30"
              />
              {rawError ? (
                <div className="mt-2 rounded-md border border-rose-400/25 bg-rose-400/[0.06] px-3 py-1.5 text-[11.5px] text-rose-100">
                  {rawError}
                </div>
              ) : (
                <div className="mt-1.5 text-[11px] text-white/40">
                  Aenderungen greifen beim Verlassen des Feldes (JSON wird validiert).
                </div>
              )}
            </div>
          ) : null}
        </Card>
      </div>

      {/* Footer: Template-Toggle + Speichern + Prompt generieren -------- */}
      <div className="sticky bottom-0 -mx-6 mt-6 border-t border-white/[0.07] bg-[#0F0F11]/95 px-6 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10.5px] uppercase tracking-[0.14em] text-white/45">
              Template
            </span>
            <div className="flex gap-1.5">
              {PITCH_PROMPT_MODES.map((m) => (
                <ToggleChip
                  key={m.value}
                  active={mode === m.value}
                  onClick={() => onChangeMode(m.value)}
                  title={m.hint}
                >
                  {m.label}
                </ToggleChip>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onSave(profile)}
              disabled={!dirty}
              className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/70 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Profil speichern
            </button>
            <button
              type="button"
              onClick={() => onGenerate(profile)}
              className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black transition hover:bg-white"
            >
              Prompt generieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Prompt phase: read-only textarea + copy
// ---------------------------------------------------------------------------

function PromptPhase({
  mode,
  text,
  onBack,
  onCopy,
}: {
  profile: BusinessProfile;
  mode: PitchPromptMode;
  text: string;
  onBack: () => void;
  onCopy: () => Promise<boolean>;
}) {
  const [copied, setCopied] = useState<"idle" | "ok" | "error">("idle");
  const label = useMemo(
    () => PITCH_PROMPT_MODES.find((m) => m.value === mode)?.label ?? "Prompt",
    [mode],
  );

  const handleCopy = async () => {
    const ok = await onCopy();
    setCopied(ok ? "ok" : "error");
    if (ok) {
      window.setTimeout(() => setCopied("idle"), 2500);
    }
  };

  return (
    <div className="px-6 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-3">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-white/40">
            Prompt · {label}
          </div>
          <div className="text-[12.5px] text-white/55">
            Der fertige Prompt. Kopiere ihn und fuehre ihn im gewuenschten
            LLM (ChatGPT / Gemini / Claude) aus.
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/65 hover:text-white"
          >
            Zurück zum Editor
          </button>
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="rounded-md border border-white/15 bg-white/95 px-3 py-1.5 text-[12.5px] font-medium text-black transition hover:bg-white"
          >
            {copied === "ok"
              ? "Kopiert ✓"
              : copied === "error"
                ? "Kopieren fehlgeschlagen"
                : "In Zwischenablage kopieren"}
          </button>
        </div>
      </div>

      <textarea
        value={text}
        readOnly
        spellCheck={false}
        className="mt-4 block h-[60vh] w-full resize-y rounded-md border border-white/10 bg-black/40 p-4 font-mono text-[12px] leading-[1.55] text-white/85 outline-none"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small presentational helpers (kept local to the modal file)
// ---------------------------------------------------------------------------

function stripMeta(profile: BusinessProfile): Omit<
  BusinessProfile,
  "researchedAt" | "sources"
> {
  // Clone without researchedAt / sources so the raw editor stays focused
  // on the editable 40-field schema.
  const clone: Partial<BusinessProfile> = { ...profile };
  delete clone.researchedAt;
  delete clone.sources;
  return clone as Omit<BusinessProfile, "researchedAt" | "sources">;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4">
      <h3 className="mb-3 text-[10.5px] font-medium uppercase tracking-[0.16em] text-white/55">
        {title}
      </h3>
      {children}
    </section>
  );
}

function LabeledField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1 ${className ?? ""}`}>
      <span className="text-[10.5px] uppercase tracking-[0.14em] text-white/45">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-white outline-none transition focus:border-white/30"
    />
  );
}

function TextArea({
  value,
  onChange,
  rows,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows ?? 2}
      className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-white outline-none transition focus:border-white/30"
    />
  );
}

function ToggleChip({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-md border px-2.5 py-1 text-[11.5px] transition ${
        active
          ? "border-white/25 bg-white/[0.08] text-white"
          : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function ChipList({
  values,
  onChange,
  placeholder,
  mono,
  swatch,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  mono?: boolean;
  swatch?: boolean;
}) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const t = raw.trim();
    if (t.length === 0) return;
    if (values.includes(t)) return;
    onChange([...values, t]);
  };

  const remove = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <ul className="flex flex-wrap gap-1.5">
        {values.map((v, i) => (
          <li
            key={`${v}-${i}`}
            className={`group inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.035] px-2 py-1 text-[11.5px] text-white/85 ${
              mono ? "font-mono" : ""
            }`}
          >
            {swatch && /^#[0-9a-fA-F]{3,8}$/.test(v) ? (
              <span
                aria-hidden
                className="inline-block h-3 w-3 rounded-sm border border-white/20"
                style={{ backgroundColor: v }}
              />
            ) : null}
            <span>{v}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-white/40 opacity-0 transition group-hover:opacity-100 hover:text-white/80"
              aria-label={`Entfernen: ${v}`}
            >
              ×
            </button>
          </li>
        ))}
        <li className="inline-flex items-center">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                add(draft);
                setDraft("");
              } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
                remove(values.length - 1);
              }
            }}
            onBlur={() => {
              if (draft.trim()) {
                add(draft);
                setDraft("");
              }
            }}
            placeholder={placeholder}
            className={`min-w-[10rem] rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 text-[12px] text-white outline-none transition focus:border-white/30 ${
              mono ? "font-mono" : ""
            }`}
          />
        </li>
      </ul>
      <div className="mt-1.5 text-[10.5px] text-white/35">
        Enter oder Komma zum Hinzufuegen. Backspace entfernt den letzten Chip.
      </div>
    </div>
  );
}
