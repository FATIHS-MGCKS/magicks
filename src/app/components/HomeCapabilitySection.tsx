import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { stagger, transition } from "../motion";
import { SectionEyebrow } from "./SectionEyebrow";

const items = [
  {
    title: "Automationen",
    text: "Wiederkehrende Schritte entlasten — mit nachvollziehbaren Regeln statt undurchsichtiger Blackbox.",
  },
  {
    title: "KI sinnvoll einsetzen",
    text: "Wo es Mehrwert bringt: Assistenz, Klassifikation, Übersetzung — immer mit klarer Verantwortung im Prozess.",
  },
  {
    title: "Systeme verbinden",
    text: "Schnittstellen und Datenflüsse so planen, dass Teams nicht zwischen Tools springen müssen.",
  },
];

const h2 =
  "font-instrument max-w-2xl text-[1.38rem] tracking-[-0.03em] text-white sm:text-[1.62rem] md:text-[1.75rem]";

export function HomeCapabilitySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="section-y relative overflow-hidden bg-[#0A0A0A] px-5" aria-labelledby="capability-heading">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_80%_20%,rgba(99,102,241,0.05),transparent_55%)]" aria-hidden />

      <div className="relative layout-max">
        <motion.div
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={transition}
        >
          <p className="mb-1">
            <SectionEyebrow>Modernisierung</SectionEyebrow>
          </p>
          <h2 id="capability-heading" className={h2}>
            Automation &amp; KI — <em className="italic text-white/45">ruhig integriert</em>
          </h2>
          <p className="font-ui mt-3 max-w-xl text-[14px] leading-[1.65] text-white/46 md:text-[0.9375rem]">
            Technik ist Mittel zum Zweck. Wir integrieren Automation und KI dort, wo sie Abläufe entlasten und Qualität
            stabilisieren — ohne Show-Effekte.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3 md:gap-3">
          {items.map((item, i) => (
            <motion.article
              key={item.title}
              className="card-surface card-surface-interactive rounded-xl p-4 md:p-5"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...transition, delay: stagger * (i + 1) }}
            >
              <h3 className="font-ui text-[14px] font-semibold text-white">{item.title}</h3>
              <p className="font-ui mt-2 text-[13px] leading-[1.65] text-white/46 md:text-[14px]">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
