import {
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------
 * ProjectIntakeForm — MAGICKS Studio's primary /kontakt intake surface.
 *
 * Design register:
 *   · No framed card. Fields sit directly on the page, separated by
 *     hairlines. Labels are mono uppercase, inputs are flat, focus
 *     thickens the hairline from white/14 to white.
 *   · Projektart renders as a custom chip-radio register (not a native
 *     <select>) so it integrates with the editorial typography.
 *   · On submit, hands off to the user's mail client via `mailto:` and
 *     transitions into an honest "handoff" confirmation state — no
 *     fake success. When a real backend is added, replace the single
 *     `submitAnfrage()` function and delete the handoff-fallback copy;
 *     nothing else on the page needs to change.
 * ------------------------------------------------------------------ */

export const PROJECT_KIND_OPTIONS = [
  { value: "website",         label: "Website / Landing Page",        hint: "Auftritt · Konversion" },
  { value: "shop",            label: "Shop / Produktkonfigurator",    hint: "Produkt · Entscheidung" },
  { value: "3d-konfigurator", label: "3D-Produktkonfigurator",         hint: "Visualisierung · Vertrieb" },
  { value: "web-software",    label: "Web-Software",                   hint: "System · Prozess" },
  { value: "ki-automation",   label: "KI-Automation / Integration",    hint: "Fluss · Entlastung" },
  { value: "offen",           label: "Noch offen / Beratung",          hint: "Richtung · Sparring" },
] as const;

type ProjectKindValue = (typeof PROJECT_KIND_OPTIONS)[number]["value"];

type FormState = {
  name: string;
  email: string;
  company: string;
  projectKind: ProjectKindValue | "";
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type SubmitStatus = "idle" | "handoff" | "error";

const INITIAL: FormState = {
  name: "",
  email: "",
  company: "",
  projectKind: "",
  message: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Swap this single function for a real backend call later. */
function submitAnfrage(data: FormState): void {
  const kindLabel =
    PROJECT_KIND_OPTIONS.find((o) => o.value === data.projectKind)?.label ??
    "Noch offen / Beratung";

  const subject = `Anfrage MAGICKS — ${data.company.trim() || data.name.trim() || "Projekt"}`;

  const bodyLines = [
    `Name: ${data.name.trim()}`,
    data.company.trim() ? `Unternehmen: ${data.company.trim()}` : "",
    `E-Mail: ${data.email.trim()}`,
    `Projektart: ${kindLabel}`,
    "",
    "Nachricht:",
    data.message.trim(),
  ].filter(Boolean);

  const href =
    `mailto:hello@magicks.studio` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(bodyLines.join("\n"))}`;

  window.location.href = href;
}

function validate(data: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Ein kurzer Name reicht.";
  if (!EMAIL_RE.test(data.email.trim())) errors.email = "Bitte eine gültige E-Mail-Adresse.";
  if (!data.projectKind) errors.projectKind = "Wähle die Richtung, die am ehesten passt.";
  if (data.message.trim().length < 10) errors.message = "Ein, zwei Sätze zum Vorhaben reichen schon.";
  return errors;
}

export function ProjectIntakeForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [data, setData] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const onChange =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const onProjectKind = (value: ProjectKindValue) => {
    setData((prev) => ({ ...prev, projectKind: value }));
    if (errors.projectKind) setErrors((prev) => ({ ...prev, projectKind: undefined }));
  };

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const v = validate(data);
      setErrors(v);

      if (Object.keys(v).length > 0) {
        // Focus the first invalid field for a11y.
        const firstErrorKey = (Object.keys(v) as Array<keyof FormState>)[0];
        const el = formRef.current?.querySelector<HTMLElement>(
          `[data-field="${firstErrorKey}"]`,
        );
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      try {
        submitAnfrage(data);
        setStatus("handoff");
      } catch {
        setStatus("error");
      }
    },
    [data],
  );

  const resetAndRewrite = () => {
    setStatus("idle");
    setErrors({});
    setData(INITIAL);
  };

  /* -------- Handoff state -------- */
  if (status === "handoff" || status === "error") {
    return (
      <div
        aria-live="polite"
        className="relative mx-auto max-w-[56rem] border-t border-b border-white/[0.12] px-1 py-14 text-center sm:py-16 md:py-20"
      >
        <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.48em] text-white/44 sm:text-[10.5px]">
          § Status · {status === "handoff" ? "Übergabe an Mail-Programm" : "Übergabe unterbrochen"}
        </p>

        <p className="font-instrument mt-8 text-[2rem] italic leading-[1.06] tracking-[-0.025em] text-white sm:mt-10 sm:text-[2.55rem] md:text-[3rem]">
          {status === "handoff" ? "Danke — der Rest läuft jetzt per Mail." : "Da ist etwas schiefgegangen."}
        </p>

        <p className="font-ui mx-auto mt-6 max-w-[36rem] text-[15px] leading-[1.7] text-white/68 md:text-[16px]">
          {status === "handoff"
            ? "Dein Mail-Programm wurde geöffnet und die Anfrage ist vorbereitet. Wenn sich nichts geöffnet hat, schick uns deine Nachricht einfach direkt an die Studio-Adresse."
            : "Bitte schick uns deine Nachricht direkt an die Studio-Adresse — wir melden uns auf demselben Weg zurück."}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          <a
            href="mailto:hello@magicks.studio"
            className="font-instrument text-[1.2rem] italic tracking-[-0.01em] text-white no-underline transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:text-white/82 sm:text-[1.3rem] md:text-[1.4rem]"
          >
            hello@magicks.studio
          </a>

          <span aria-hidden className="hidden h-3 w-px bg-white/22 sm:inline-block" />

          <button
            type="button"
            onClick={resetAndRewrite}
            className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/56 no-underline transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:text-white"
          >
            ↺ Neue Anfrage beginnen
          </button>
        </div>
      </div>
    );
  }

  /* -------- Idle (form) state -------- */
  return (
    <form
      ref={formRef}
      id="anfrage"
      onSubmit={onSubmit}
      noValidate
      aria-describedby={`${uid}-hint`}
      className="relative"
    >
      {/* Opening hairline — the section already carries the folio above,
          so the form opens with a pure rule rather than a repeated label. */}
      <span aria-hidden className="block h-px w-full bg-white/[0.14]" />

      {/* Fields */}
      <div className="grid grid-cols-1 gap-x-12 gap-y-0 sm:grid-cols-2">
        <Field
          id={`${uid}-name`}
          label="Name"
          number="01"
          required
          error={errors.name}
        >
          <input
            id={`${uid}-name`}
            data-field="name"
            name="name"
            type="text"
            autoComplete="name"
            value={data.name}
            onChange={onChange("name")}
            className={inputClass}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
          />
        </Field>

        <Field
          id={`${uid}-email`}
          label="E-Mail"
          number="02"
          required
          error={errors.email}
        >
          <input
            id={`${uid}-email`}
            data-field="email"
            name="email"
            type="email"
            autoComplete="email"
            value={data.email}
            onChange={onChange("email")}
            className={inputClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-err` : undefined}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field
            id={`${uid}-company`}
            label="Unternehmen"
            number="03"
            hint="optional"
          >
            <input
              id={`${uid}-company`}
              data-field="company"
              name="company"
              type="text"
              autoComplete="organization"
              value={data.company}
              onChange={onChange("company")}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <FieldGroup
            label="Projektart"
            number="04"
            required
            error={errors.projectKind}
            errorId={`${uid}-kind-err`}
          >
            <div
              role="radiogroup"
              aria-label="Projektart"
              aria-invalid={Boolean(errors.projectKind)}
              aria-describedby={errors.projectKind ? `${uid}-kind-err` : undefined}
              className="flex flex-wrap gap-2.5 pt-4 sm:gap-3 sm:pt-5"
            >
              {PROJECT_KIND_OPTIONS.map((opt, i) => {
                const active = data.projectKind === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    data-field={i === 0 ? "projectKind" : undefined}
                    onClick={() => onProjectKind(opt.value)}
                    className={[
                      "group relative inline-flex items-baseline gap-2 rounded-full border px-4 py-[0.55rem] text-[13px] font-medium outline-none transition-[color,border-color,background-color] duration-[520ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] sm:px-5 sm:py-[0.65rem] sm:text-[13.5px] md:text-[14px]",
                      active
                        ? "border-white/85 bg-white/10 text-white"
                        : "border-white/[0.14] bg-transparent text-white/68 hover:border-white/34 hover:text-white focus-visible:border-white/34 focus-visible:text-white",
                    ].join(" ")}
                  >
                    <span className="font-ui">{opt.label}</span>
                    {/* Mono hint — hidden on narrow viewports where the chips
                        need to stay compact. From sm+ it rejoins as the editorial
                        co-label (e.g. "· Auftritt · Konversion"). */}
                    <span
                      aria-hidden
                      className={[
                        "font-mono hidden text-[9.5px] font-medium uppercase leading-none tracking-[0.3em] transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] sm:inline",
                        active ? "text-white/60" : "text-white/34 group-hover:text-white/50",
                      ].join(" ")}
                    >
                      · {opt.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </FieldGroup>
        </div>

        <div className="sm:col-span-2">
          <Field
            id={`${uid}-message`}
            label="Nachricht"
            number="05"
            required
            hint="Ein, zwei Sätze zum Projekt reichen zum Start."
            error={errors.message}
          >
            <textarea
              id={`${uid}-message`}
              data-field="message"
              name="message"
              value={data.message}
              onChange={onChange("message")}
              rows={5}
              className={`${inputClass} min-h-[9.5rem] resize-y py-4`}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? `${uid}-message-err` : undefined}
            />
          </Field>
        </div>
      </div>

      {/* Submit rail — mirrors /ueber-uns § Einladung CTA pattern */}
      <div className="mt-14 border-t border-white/[0.14] pt-6 sm:mt-16 md:mt-20 md:pt-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/50 sm:text-[10.5px]">
              § Anfrage · hello@magicks.studio
            </span>
            <span id={`${uid}-hint`} className="font-ui text-[12.5px] leading-[1.55] text-white/46 sm:text-[13px]">
              Kein Druck, keine Agenturschleife — erste Einschätzung in der Regel innerhalb von 24 Stunden.
            </span>
          </div>

          {/* Full-width on narrow viewports for a confident tap target,
              natural width from sm+ so it doesn't look like a web form
              submit button on larger screens. */}
          <button
            type="submit"
            className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-9 py-[1.05rem] text-[15.5px] font-semibold text-[#0A0A0A] no-underline shadow-[0_34px_80px_-32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.45)] transition-[transform,box-shadow] duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:shadow-[0_44px_90px_-28px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.55)] sm:w-auto sm:gap-3.5 sm:self-auto sm:px-10 sm:py-[1.2rem] sm:text-[16px] md:px-11 md:text-[16.5px]"
          >
            <span>Nachricht senden</span>
            <span
              aria-hidden
              className="font-instrument text-[1.1em] italic transition-transform duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px] group-hover:translate-x-[3px]"
            >
              →
            </span>
          </button>
        </div>

        {/* Footnote — privacy + honest handoff reassurance */}
        <div className="mt-7 flex flex-col items-start gap-3 text-[12px] text-white/38 sm:mt-9 sm:flex-row sm:items-center sm:gap-6">
          <span className="font-mono uppercase leading-none tracking-[0.32em]">
            · Kein Newsletter · Keine Weitergabe ·
          </span>
          <span className="hidden h-3 w-px bg-white/14 sm:inline-block" />
          <span className="font-ui text-[12.5px] leading-[1.55]">
            Mit dem Absenden stimmst du unseren{" "}
            <Link
              to="/datenschutz"
              className="underline decoration-white/22 underline-offset-[3px] transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:text-white hover:decoration-white/60"
            >
              Datenschutzhinweisen
            </Link>{" "}
            zu.
          </span>
        </div>
      </div>
    </form>
  );
}

/* ================================================================
   Subcomponents — editorial field abstractions. Not exported; they
   only exist to encode the hairline + label vocabulary once.
   ================================================================ */

const inputClass =
  "font-instrument peer block w-full appearance-none border-0 border-b border-white/[0.14] bg-transparent py-4 text-[1.15rem] leading-[1.3] tracking-[-0.01em] text-white outline-none transition-[border-color,color] duration-[520ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] placeholder:text-white/30 focus:border-white/85 sm:text-[1.22rem] md:text-[1.28rem]";

type FieldProps = {
  id: string;
  label: string;
  number: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
};

/**
 * Field — a single label + input + (optional) hint / error row.
 * Hairline sits under the input via `border-b` on the input itself;
 * no chrome wrapping. Error text renders as italic serif micro-phrase.
 */
function Field({ id, label, number, required, hint, error, children }: FieldProps) {
  return (
    <div className="relative py-7 sm:py-8">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label
          htmlFor={id}
          className="flex items-baseline gap-2 text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/56 sm:text-[10.5px]"
        >
          <span className="font-mono text-white/34">{number}</span>
          <span className="font-mono">{label}</span>
          {required && (
            <span aria-hidden className="font-mono text-white/34">
              *
            </span>
          )}
        </label>
        {hint && !error && (
          <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/36 sm:text-[10px]">
            {hint}
          </span>
        )}
      </div>
      {children}
      {error && (
        <p
          id={`${id}-err`}
          className="font-instrument mt-3 flex items-baseline gap-2 text-[13.5px] italic leading-[1.45] text-white/78 sm:text-[14px]"
        >
          <span aria-hidden className="font-mono text-[9.5px] not-italic uppercase tracking-[0.32em] text-white/46">
            Hinweis
          </span>
          {error}
        </p>
      )}
    </div>
  );
}

type FieldGroupProps = {
  label: string;
  number: string;
  required?: boolean;
  error?: string;
  errorId?: string;
  children: ReactNode;
};

/** Non-input field group — for the Projektart chip-radio cluster. */
function FieldGroup({ label, number, required, error, errorId, children }: FieldGroupProps) {
  return (
    <div className="relative border-t border-white/[0.08] py-7 sm:py-8">
      <div className="mb-1 flex items-baseline gap-4">
        <span
          className="flex items-baseline gap-2 text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/56 sm:text-[10.5px]"
        >
          <span className="font-mono text-white/34">{number}</span>
          <span className="font-mono">{label}</span>
          {required && (
            <span aria-hidden className="font-mono text-white/34">
              *
            </span>
          )}
        </span>
      </div>
      {children}
      {error && (
        <p
          id={errorId}
          className="font-instrument mt-4 flex items-baseline gap-2 text-[13.5px] italic leading-[1.45] text-white/78 sm:text-[14px]"
        >
          <span aria-hidden className="font-mono text-[9.5px] not-italic uppercase tracking-[0.32em] text-white/46">
            Hinweis
          </span>
          {error}
        </p>
      )}
    </div>
  );
}
