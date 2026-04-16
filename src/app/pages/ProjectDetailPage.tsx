import { motion, useInView } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { transition } from "../motion";
import { projectBySlug } from "../data/projects";
import { SectionEyebrow } from "../components/SectionEyebrow";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectBySlug(slug) : undefined;
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-30px" });

  useEffect(() => {
    document.title = project ? `${project.title} — MAGICKS` : "Projekt — MAGICKS";
  }, [project]);

  if (!project) {
    return (
      <main className="px-5 pb-20 pt-[6rem]">
        <div className="layout-max text-center">
          <h1 className="font-instrument text-xl text-white">Projekt nicht gefunden</h1>
          <Link to="/projekte" className="font-ui mt-4 inline-block text-sm text-cyan-200/70 no-underline">
            Zur Projektübersicht
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-20 pt-[5.25rem] md:pt-[5.75rem]">
      <motion.header
        ref={heroRef}
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: 12 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={transition}
      >
        <div className="relative h-[min(52vh,420px)] w-full md:h-[min(48vh,480px)]">
          <img
            src={project.image}
            alt=""
            className="h-full w-full object-cover brightness-[0.65] saturate-[0.88]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/55 to-[#0A0A0A]/20" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-8">
            <div className="layout-max">
              <p className="mb-2">
                <SectionEyebrow>{project.category}</SectionEyebrow>
              </p>
              <h1 className="font-instrument max-w-3xl text-[1.58rem] leading-[1.12] tracking-[-0.03em] text-white sm:text-[1.95rem] md:text-[2.2rem]">
                {project.title}
              </h1>
              <p className="font-ui mt-3 max-w-2xl text-[15px] leading-[1.65] text-white/55 md:text-[1rem]">{project.teaser}</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="layout-max px-5">
        <article className="mx-auto max-w-3xl">
          <BodySection title="Ausgangslage" delay={0.05}>
            <p className="font-ui text-[15px] leading-[1.75] text-white/52 md:text-[1rem]">{project.ausgangslage}</p>
          </BodySection>

          <BodySection title="Was entwickelt wurde" delay={0.08}>
            <p className="font-ui text-[15px] leading-[1.75] text-white/52 md:text-[1rem]">{project.entwicklung}</p>
          </BodySection>

          <BodySection title="Fokus / Scope" delay={0.1}>
            <ul className="font-ui space-y-2 text-[15px] leading-[1.65] text-white/48 md:text-[1rem]">
              {project.fokus.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-cyan-200/45" aria-hidden>
                    ·
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </BodySection>

          <BodySection title="Kurz zum Problem & zur Lösung" delay={0.12}>
            <dl className="space-y-4">
              <div>
                <dt className="font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-white/28">Problem</dt>
                <dd className="font-ui mt-1 text-[15px] leading-[1.7] text-white/48">{project.problem}</dd>
              </div>
              <div>
                <dt className="font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-white/28">Lösung</dt>
                <dd className="font-ui mt-1 text-[15px] leading-[1.7] text-white/48">{project.solution}</dd>
              </div>
            </dl>
          </BodySection>

          <BodySection title="Ergebnis / Wirkung" delay={0.14}>
            <p className="font-ui text-[15px] leading-[1.75] text-white/52 md:text-[1rem]">{project.ergebnis}</p>
            <div className="mt-6 flex flex-wrap gap-6 border-t border-white/[0.06] pt-6">
              {project.metrics.map((m) => (
                <div key={m.label}>
                  <p className="font-instrument text-xl text-white tabular-nums md:text-2xl">{m.value}</p>
                  <p className="font-ui text-[11px] uppercase tracking-[0.12em] text-white/34">{m.label}</p>
                </div>
              ))}
            </div>
          </BodySection>

          <div className="mt-12 flex flex-wrap gap-3 border-t border-white/[0.06] pt-10">
            <Link
              to="/projekte"
              className="font-ui magicks-duration-hover magicks-ease-out text-[14px] text-white/50 no-underline transition-colors hover:text-white"
            >
              ← Alle Projekte
            </Link>
            <Link
              to="/kontakt"
              className="font-ui liquid-glass cta-core-glow inline-block rounded-full px-5 py-2 text-[13px] font-semibold text-white no-underline"
            >
              Unverbindlich anfragen
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}

function BodySection({ title, children, delay }: { title: string; children: ReactNode; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.section
      ref={ref}
      className="mt-10 md:mt-12"
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...transition, delay }}
    >
      <h2 className="font-instrument text-[1.15rem] tracking-[-0.02em] text-white md:text-[1.28rem]">{title}</h2>
      <div className="mt-3">{children}</div>
    </motion.section>
  );
}
