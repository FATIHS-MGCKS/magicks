import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { stagger, transition } from "../motion";
import { SectionEyebrow } from "./SectionEyebrow";

const pillars = [
  {
    title: "Sichtbare Qualität",
    text: "Markenauftritte, die modern wirken — ohne laute Effekthascherei.",
  },
  {
    title: "Digitale Lösungen",
    text: "Websites, Konfiguratoren, Software: umsetzbar, wartbar, messbar nutzbar.",
  },
  {
    title: "Operative Relevanz",
    text: "Was wir bauen, soll im Alltag funktionieren — nicht nur auf der Startseite.",
  },
];

const h2 =
  "font-instrument max-w-2xl text-[1.38rem] leading-[1.12] tracking-[-0.03em] text-white sm:text-[1.62rem] md:text-[1.75rem]";

export function HomePositionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      className="section-y relative overflow-hidden bg-[#0A0A0A] px-5"
      aria-labelledby="position-heading"
    >
      <div className="pointer-events-none absolute inset-0 section-gradient opacity-45" aria-hidden />

      <div className="relative layout-max">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={transition}
          >
            <p className="mb-1.5">
              <SectionEyebrow>Positionierung</SectionEyebrow>
            </p>
            <h2 id="position-heading" className={h2}>
              Mehr als schöne Websites. <em className="italic text-white/48">Sinnvolle digitale Präsenz.</em>
            </h2>
            <p className="font-ui mt-4 max-w-xl text-[14px] leading-[1.7] text-white/48 md:text-[0.9375rem]">
              MAGICKS entwickelt digitale Markenauftritte und digitale Lösungen für Unternehmen, die moderner auftreten,
              klarer kommunizieren und im Betrieb digital weiterkommen wollen — mit Ruhe, Präzision und technischer
              Substanz.
            </p>
            <p className="font-ui mt-3 max-w-xl text-[14px] leading-[1.7] text-white/42 md:text-[0.9375rem]">
              Design, Umsetzung und Business-Nutzen bleiben dabei auf einer Linie.
            </p>
            <p className="font-ui mt-6">
              <Link
                to="/leistungen"
                className="text-[13px] font-medium text-white/55 underline-offset-4 magicks-duration-hover magicks-ease-out transition-colors hover:text-cyan-200/75"
              >
                Leistungen im Überblick →
              </Link>
            </p>
          </motion.div>

          <div className="space-y-2.5">
            {pillars.map((p, i) => (
              <motion.article
                key={p.title}
                className="card-surface rounded-xl border-white/[0.06] p-4 md:p-5"
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...transition, delay: stagger * (i + 1) }}
              >
                <h3 className="font-ui text-[14px] font-semibold text-white">{p.title}</h3>
                <p className="font-ui mt-2 text-[13px] leading-[1.65] text-white/46 md:text-[14px]">{p.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
