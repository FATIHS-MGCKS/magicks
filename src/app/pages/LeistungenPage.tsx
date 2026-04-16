import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { stagger, transition } from "../motion";
import { SectionEyebrow } from "../components/SectionEyebrow";

const clusters = [
  {
    id: "marken",
    eyebrow: "Cluster 01",
    title: "Digitale Markenauftritte",
    lead: "Sichtbarkeit und Vertrauen — mit klarer Struktur und hochwertiger Umsetzung.",
    items: ["Websites", "Landingpages", "Relaunches", "Markengetragene Oberflächen"],
    note: "Ideal, wenn Außenwirkung, Anfragenqualität und Modernität im Vordergrund stehen.",
  },
  {
    id: "loesungen",
    eyebrow: "Cluster 02",
    title: "Digitale Lösungen",
    lead: "Produkte und Prozesse digital führbar machen — vom ersten Klick bis zur Übergabe ins Team.",
    items: ["Shops", "Produktkonfiguratoren", "Dashboards", "Web Software"],
    note: "Ideal, wenn Komplexität reduziert, Daten sauber übergeben und Teams entlastet werden sollen.",
  },
  {
    id: "automation",
    eyebrow: "Cluster 03",
    title: "Automationen & KI",
    lead: "Abläufe stabilisieren und Tempo gewinnen — mit nachvollziehbaren Regeln und sinnvollen Integrationspunkten.",
    items: ["Prozessautomationen", "KI-Integration", "Schnittstellen & Orchestrierung"],
    note: "Ideal, wenn wiederkehrende Arbeit weg soll, ohne die Kontrolle zu verlieren.",
  },
];

const h1 = "font-instrument text-[1.75rem] leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.1rem] md:text-[2.4rem]";
const h2 = "font-instrument text-[1.32rem] tracking-[-0.03em] text-white sm:text-[1.52rem] md:text-[1.65rem]";

export default function LeistungenPage() {
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, margin: "-40px" });

  useEffect(() => {
    document.title = "Leistungen — MAGICKS";
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
            <SectionEyebrow>Leistungen</SectionEyebrow>
          </p>
          <h1 className={h1}>Klar gegliedert. <em className="italic text-white/52">Business-nah umgesetzt.</em></h1>
          <p className="font-ui mt-5 text-[15px] leading-[1.7] text-white/48 md:text-[1rem]">
            Drei Schwerpunkte — statt einer endlosen Feature-Liste. So bleibt erkennbar, wofür MAGICKS steht: digitale
            Markenauftritte, digitale Lösungen und die sinnvolle Einbindung von Automation und KI.
          </p>
        </motion.header>

        <div className="mt-14 space-y-16 md:mt-16 md:space-y-20">
          {clusters.map((c, i) => (
            <ClusterBlock key={c.id} cluster={c} index={i} />
          ))}
        </div>

        <motion.footer
          className="mt-16 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 md:mt-20 md:p-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={transition}
        >
          <h2 className={`${h2} max-w-xl`}>Ablauf</h2>
          <p className="font-ui mt-3 max-w-xl text-[14px] leading-[1.7] text-white/46 md:text-[0.9375rem]">
            Wir arbeiten strukturiert: Verständnis schaffen, Konzept und Design schärfen, sauber entwickeln, Systeme
            verbinden — und gemeinsam skalieren, wenn es passt.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/#prozess"
              className="font-ui magicks-duration-hover magicks-ease-out rounded-full border border-white/[0.12] px-4 py-2 text-[13px] font-semibold text-white/88 no-underline transition-colors hover:border-cyan-400/25 hover:text-white"
            >
              Prozess auf der Startseite
            </Link>
            <Link
              to="/kontakt"
              className="font-ui liquid-glass cta-core-glow inline-block rounded-full px-4 py-2 text-[13px] font-semibold text-white no-underline"
            >
              Unverbindlich anfragen
            </Link>
          </div>
        </motion.footer>
      </div>
    </main>
  );
}

function ClusterBlock({
  cluster,
  index,
}: {
  cluster: (typeof clusters)[number];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.article
      ref={ref}
      id={cluster.id}
      className="scroll-mt-28"
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...transition, delay: stagger * 0.35 * index }}
    >
      <p className="mb-2">
        <SectionEyebrow>{cluster.eyebrow}</SectionEyebrow>
      </p>
      <h2 className={h2}>{cluster.title}</h2>
      <p className="font-ui mt-3 max-w-xl text-[14px] leading-[1.7] text-white/48 md:text-[0.9375rem]">{cluster.lead}</p>
      <ul className="font-ui mt-5 grid gap-2 sm:grid-cols-2">
        {cluster.items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-[13px] text-white/62 md:text-[14px]"
          >
            <span className="h-1 w-1 shrink-0 rounded-full bg-cyan-300/40" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
      <p className="font-ui mt-4 max-w-xl text-[13px] leading-[1.65] text-white/38 md:text-[14px]">{cluster.note}</p>
    </motion.article>
  );
}
