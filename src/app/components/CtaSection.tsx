import { Check } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { transition, transitionFast } from "../motion";
import { SectionEyebrow } from "./SectionEyebrow";
import { ContactForm } from "./ContactForm";

const TRUST = ["Antwort in der Regel innerhalb von 24 Stunden", "Klare Einschätzung statt Verkaufsgespräch"];

const PLACEHOLDER_TESTIMONIALS = [
  { quote: "Technisch sauber umgesetzt — ohne endloses Hin und Her.", attribution: "Geschäftsführung, B2B" },
  { quote: "Struktur und Klarheit haben uns mehr qualifizierte Anfragen gebracht.", attribution: "Marketing Lead" },
  { quote: "Professionell, ruhig, ohne Agentur-Theater.", attribution: "Operations, Mittelstand" },
];

export function CtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      id="kontakt"
      ref={ref}
      className="section-y relative overflow-hidden bg-[#0A0A0A] px-5"
      aria-labelledby="cta-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_100%,rgba(59,130,246,0.08),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)",
        }}
        aria-hidden
      />

      <div className="relative z-10 layout-max">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-12">
          <div>
            <motion.h2
              id="cta-heading"
              className="font-instrument text-[1.38rem] leading-[1.12] tracking-[-0.03em] text-white sm:text-[1.62rem] md:text-[1.75rem]"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={transition}
            >
              Projekt <em className="italic text-white/52">besprechen</em>
            </motion.h2>

            <motion.p
              className="font-ui mt-3 max-w-xl text-[14px] leading-[1.65] text-white/48 md:text-[0.875rem]"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...transitionFast, delay: 0.08 }}
            >
              Kurz beschreiben, was Sie vorhaben — wir melden uns mit einer ehrlichen Einschätzung. Alternativ erreichen
              Sie uns auch direkt auf der{" "}
              <Link to="/kontakt" className="text-white/55 underline-offset-4 magicks-duration-hover magicks-ease-out transition-colors hover:text-cyan-200/75">
                Kontaktseite
              </Link>
              .
            </motion.p>

            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...transitionFast, delay: 0.12 }}
            >
              <ContactForm submitLabel="Unverbindlich anfragen" />
            </motion.div>

            <motion.p
              className="font-ui mt-4 text-center text-[12px] text-white/34"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ ...transitionFast, delay: 0.22 }}
            >
              hello@magicks.studio
            </motion.p>
          </div>

          <aside className="space-y-6 lg:pt-1">
            <motion.ul
              className="space-y-2.5"
              initial={{ opacity: 0, x: 8 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ ...transitionFast, delay: 0.14 }}
            >
              {TRUST.map((line) => (
                <li key={line} className="font-ui flex items-start gap-2 text-[13px] leading-snug text-white/48">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-200/80">
                    <Check className="h-2.5 w-2.5" strokeWidth={1.25} aria-hidden />
                  </span>
                  {line}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ ...transitionFast, delay: 0.24 }}
            >
              <p className="mb-2">
                <SectionEyebrow variant="compact">Stimmen</SectionEyebrow>
              </p>
              <div className="space-y-2">
                {PLACEHOLDER_TESTIMONIALS.map((t) => (
                  <figure key={t.quote} className="card-surface rounded-lg border-white/[0.05] p-3">
                    <blockquote className="font-ui text-[12px] italic leading-relaxed text-white/42">„{t.quote}“</blockquote>
                    <figcaption className="font-ui mt-2 text-[11px] text-white/26">{t.attribution}</figcaption>
                  </figure>
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </section>
  );
}
