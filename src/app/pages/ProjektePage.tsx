import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { stagger, transition } from "../motion";
import { PROJECTS } from "../data/projects";
import { SectionEyebrow } from "../components/SectionEyebrow";

const h1 = "font-instrument text-[1.75rem] leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.1rem] md:text-[2.4rem]";

export default function ProjektePage() {
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, margin: "-40px" });

  useEffect(() => {
    document.title = "Projekte — MAGICKS";
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
            <SectionEyebrow>Projekte</SectionEyebrow>
          </p>
          <h1 className={h1}>
            Ausgewählte Arbeit. <em className="italic text-white/52">Mit Absicht kuratiert.</em>
          </h1>
          <p className="font-ui mt-5 text-[15px] leading-[1.7] text-white/48 md:text-[1rem]">
            Keine Endlos-Galerie — sondern Beispiele, die zeigen, wie wir denken: Ausgangslage, Lösung, Wirkung. Jedes
            Projekt ist anders; die gemeinsame Linie ist Klarheit und technische Qualität.
          </p>
        </motion.header>

        <div className="mt-12 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-2 md:gap-5">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>

        <motion.p
          className="font-ui mt-12 text-center text-[14px] text-white/40 md:mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={transition}
        >
          <Link
            to="/kontakt"
            className="font-medium text-white/55 underline-offset-4 magicks-duration-hover magicks-ease-out transition-colors hover:text-cyan-200/75"
          >
            Projekt besprechen →
          </Link>
        </motion.p>
      </div>
    </main>
  );
}

function ProjectCard({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...transition, delay: stagger * (index + 1) }}
    >
      <Link
        to={`/projekte/${project.slug}`}
        className="group card-surface card-surface-interactive block overflow-hidden rounded-xl no-underline"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={project.image}
            alt=""
            className="h-full w-full object-cover brightness-[0.7] saturate-[0.88] magicks-duration-media magicks-ease-out transition-[transform,filter] group-hover:scale-[1.02] group-hover:brightness-[0.76]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/25 to-transparent" />
          <span className="font-ui absolute left-3 top-3 rounded-full border border-white/[0.1] bg-black/40 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/70 backdrop-blur-sm">
            {project.category}
          </span>
        </div>
        <div className="p-4 md:p-5">
          <h2 className="font-instrument text-[1.1rem] leading-snug text-white md:text-[1.18rem]">{project.title}</h2>
          <p className="font-ui mt-2 text-[13px] leading-[1.6] text-white/46 md:text-[14px]">{project.teaser}</p>
          <p className="font-ui mt-3 text-[12px] font-medium uppercase tracking-[0.12em] text-cyan-200/45">Fallstudie →</p>
        </div>
      </Link>
    </motion.article>
  );
}
