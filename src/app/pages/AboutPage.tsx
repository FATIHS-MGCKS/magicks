import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { transition } from "../motion";
import { SectionEyebrow } from "../components/SectionEyebrow";

const h1 = "font-instrument text-[1.75rem] leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.1rem] md:text-[2.4rem]";
const h2 = "font-instrument text-[1.22rem] tracking-[-0.03em] text-white md:text-[1.32rem]";

export default function AboutPage() {
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, margin: "-40px" });

  useEffect(() => {
    document.title = "Über MAGICKS";
  }, []);

  return (
    <main className="px-5 pb-20 pt-[5.5rem] md:pt-[6.25rem]">
      <div className="layout-max">
        <motion.header
          ref={introRef}
          className="max-w-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={introInView ? { opacity: 1, y: 0 } : {}}
          transition={transition}
        >
          <p className="mb-2">
            <SectionEyebrow>Über MAGICKS</SectionEyebrow>
          </p>
          <h1 className={h1}>
            Studio für digitale Marken <em className="italic text-white/52">&amp; Lösungen</em>
          </h1>
          <p className="font-ui mt-5 text-[15px] leading-[1.75] text-white/48 md:text-[1rem]">
            MAGICKS verbindet gestalterische Präzision mit technischer Umsetzung — für Unternehmen, die moderner auftreten
            und digital ernsthafter arbeiten wollen. Kein Lautstärke-Wettbewerb: Klarheit, Tempo und Substanz.
          </p>
        </motion.header>

        <div className="mt-14 max-w-2xl space-y-12 md:mt-16 md:space-y-14">
          <AboutBlock title="Haltung" delay={0.05}>
            <p className="font-ui text-[15px] leading-[1.75] text-white/50 md:text-[1rem]">
              Wir denken in Systemen: Was heute gut aussieht, muss morgen noch wartbar und erweiterbar sein. Design und
              Entwicklung sind bei uns keine getrennten Welten — sie bedingen einander.
            </p>
          </AboutBlock>
          <AboutBlock title="Qualitätsmaßstab" delay={0.08}>
            <p className="font-ui text-[15px] leading-[1.75] text-white/50 md:text-[1rem]">
              Oberflächen sind nur der sichtbare Teil. Darunter liegen Struktur, Performance und die Frage, ob ein Produkt
              im Alltag trägt. Daran messen wir unsere Arbeit.
            </p>
          </AboutBlock>
          <AboutBlock title="Arbeitsweise" delay={0.1}>
            <p className="font-ui text-[15px] leading-[1.75] text-white/50 md:text-[1rem]">
              Enge Zusammenarbeit, transparente Zwischenstände, Entscheidungen mit Begründung. Sie wissen jederzeit, wo
              das Projekt steht — und warum.
            </p>
          </AboutBlock>
          <AboutBlock title="Warum dieses Spektrum?" delay={0.12}>
            <p className="font-ui text-[15px] leading-[1.75] text-white/50 md:text-[1rem]">
              Websites, Konfiguratoren, Software und Automation hängen in der Praxis zusammen. MAGICKS bündelt dieses
              Verständnis — damit Sie nicht zwischen mehreren Anbietern für zusammenhängende Themen hin- und herreichen
              müssen.
            </p>
          </AboutBlock>
        </div>

        <motion.div
          className="mt-14 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 md:mt-16 md:p-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={transition}
        >
          <h2 className={h2}>Studio &amp; Einsatz</h2>
          <p className="font-ui mt-3 text-[15px] leading-[1.7] text-white/46 md:text-[1rem]">
            Kassel &amp; Nordhessen — bundesweit remote im Einsatz, wenn es zum Projekt passt.
          </p>
          <Link
            to="/kontakt"
            className="font-ui mt-6 inline-block rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[#0A0A0A] no-underline magicks-duration-hover magicks-ease-out transition-opacity hover:opacity-90"
          >
            Kennenlernen vereinbaren
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

function AboutBlock({ title, children, delay }: { title: string; children: React.ReactNode; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...transition, delay }}
    >
      <h2 className={h2}>{title}</h2>
      <div className="mt-3">{children}</div>
    </motion.section>
  );
}
