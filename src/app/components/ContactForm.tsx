import { ArrowRight } from "lucide-react";
import { useCallback, useState } from "react";
import { SectionEyebrow } from "./SectionEyebrow";

const BUDGET_OPTIONS = [
  { value: "", label: "Budget (optional)" },
  { value: "unter-5k", label: "Unter 5.000 €" },
  { value: "5k-15k", label: "5.000 – 15.000 €" },
  { value: "15k-40k", label: "15.000 – 40.000 €" },
  { value: "40k-plus", label: "Über 40.000 €" },
  { value: "offen", label: "Noch offen / in Klärung" },
];

const inputClass =
  "font-ui w-full rounded-lg border border-white/[0.08] bg-[#111111]/70 px-3.5 py-3 text-[15px] text-white outline-none magicks-duration-hover magicks-ease-out transition-[border-color,box-shadow] placeholder:text-white/32 focus:border-cyan-400/25 focus:shadow-[0_0_0_1px_rgba(34,211,238,0.08)] md:text-[1rem]";

type ContactFormProps = {
  /** When true, omits the inner eyebrow row */
  compactEyebrow?: boolean;
  submitLabel?: string;
  className?: string;
};

export function ContactForm({
  compactEyebrow = false,
  submitLabel = "Unverbindlich anfragen",
  className = "",
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState("");
  const [budget, setBudget] = useState("");

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const budgetLabel = BUDGET_OPTIONS.find((o) => o.value === budget)?.label ?? "";
      const body = [
        `Name: ${name}`,
        `Unternehmen: ${company}`,
        `E-Mail: ${email}`,
        budget ? `Budget: ${budgetLabel}` : "",
        "",
        "Projekt / Ziel:",
        project,
      ]
        .filter(Boolean)
        .join("\n");

      if (!email.trim()) return;

      window.location.href = `mailto:hello@magicks.studio?subject=${encodeURIComponent("Anfrage MAGICKS — " + (company || name))}&body=${encodeURIComponent(body)}`;
    },
    [name, company, email, project, budget],
  );

  return (
    <form className={`font-ui liquid-glass cta-core-glow space-y-3 rounded-xl p-4 sm:p-5 ${className}`.trim()} onSubmit={onSubmit}>
      {!compactEyebrow && (
        <p className="flex justify-center text-center">
          <SectionEyebrow variant="compact">Unverbindlich</SectionEyebrow>
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/34">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label htmlFor="contact-company" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/34">
            Unternehmen
          </label>
          <input
            id="contact-company"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={inputClass}
            autoComplete="organization"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/34">
          E-Mail
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label htmlFor="contact-project" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/34">
          Kurzbeschreibung
        </label>
        <textarea
          id="contact-project"
          name="project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          rows={4}
          className={`${inputClass} min-h-[100px] resize-y`}
          required
          placeholder="Ziel, Zeitrahmen, relevante Links …"
        />
      </div>

      <div>
        <label htmlFor="contact-budget" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/34">
          Budget <span className="font-normal text-white/26">(optional)</span>
        </label>
        <select
          id="contact-budget"
          name="budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className={`${inputClass} cursor-pointer appearance-none bg-[#111111]/80`}
        >
          {BUDGET_OPTIONS.map((o) => (
            <option key={o.value || "empty"} value={o.value} className="bg-[#111111]">
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="font-ui flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3.5 text-[15px] font-semibold tracking-wide text-[#0A0A0A] shadow-[0_0_32px_-6px_rgba(99,102,241,0.25)] magicks-duration-hover magicks-ease-out transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-[0_0_40px_-4px_rgba(34,211,238,0.2)] md:text-[1rem]"
      >
        {submitLabel}
        <ArrowRight className="h-4 w-4" strokeWidth={1.25} aria-hidden />
      </button>
    </form>
  );
}
