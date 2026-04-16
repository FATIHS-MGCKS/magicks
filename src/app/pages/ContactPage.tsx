import { Check } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { transition, transitionFast } from "../motion";
import { ContactForm } from "../components/ContactForm";
import { SectionEyebrow } from "../components/SectionEyebrow";

const TRUST = [
  "Antwort in der Regel innerhalb von 24 Stunden",
  "Einschätzung statt Verkaufsgespräch",
];

export default function ContactPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    document.title = "Kontakt — MAGICKS";
  }, []);

  return (
    <main className="relative overflow-hidden px-5 pb-20 pt-[5.5rem] md:pt-[6.25rem]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_100%,rgba(59,130,246,0.07),transparent_58%)]"
        aria-hidden
      />

      <div ref={ref} className="relative layout-max">
        <motion.header
          className="max-w-2xl"
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={transition}
        >
          <p className="mb-2">
            <SectionEyebrow>Kontakt</SectionEyebrow>
          </p>
          <h1 className="font-instrument text-[1.75rem] leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.1rem] md:text-[2.4rem]">
            Unverbindlich <em className="italic text-white/52">anfragen</em>
          </h1>
          <p className="font-ui mt-4 text-[15px] leading-[1.7] text-white/48 md:text-[1rem]">
            Kurz beschreiben, was Sie vorhaben — wir melden uns mit einer klaren Einschätzung. Kein Druck, kein
            Standard-Pitch.
          </p>
        </motion.header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...transitionFast, delay: 0.08 }}
          >
            <ContactForm compactEyebrow submitLabel="Nachricht senden" />
            <p className="font-ui mt-4 text-center text-[12px] text-white/34">hello@magicks.studio</p>
          </motion.div>

          <motion.aside
            className="space-y-5 lg:pt-1"
            initial={{ opacity: 0, x: 8 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ ...transitionFast, delay: 0.12 }}
          >
            <ul className="space-y-2.5">
              {TRUST.map((line) => (
                <li key={line} className="font-ui flex items-start gap-2 text-[13px] leading-snug text-white/48">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-200/80">
                    <Check className="h-2.5 w-2.5" strokeWidth={1.25} aria-hidden />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            <p className="font-ui text-[13px] leading-relaxed text-white/36">
              Pflichtfelder: Name, E-Mail, Kurzbeschreibung. Budget hilft bei der Einordnung, ist aber optional.
            </p>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}
