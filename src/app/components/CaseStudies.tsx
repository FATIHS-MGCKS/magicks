import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { stagger, transition } from "../motion";
import { PROJECTS } from "../data/projects";
import { SectionEyebrow } from "./SectionEyebrow";

const h2 =
  "font-instrument max-w-2xl text-[1.38rem] tracking-[-0.03em] text-white sm:text-[1.62rem] md:text-[1.75rem]";

function CaseImage({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (err) {
    return <div className="h-full w-full bg-gradient-to-br from-white/[0.05] to-transparent" role="img" aria-label={alt} />;
  }
  return (
    <img
      src={src}
      alt=""
      className="h-full w-full object-cover brightness-[0.68] saturate-[0.85] magicks-duration-media magicks-ease-out transition-[transform,filter,brightness] group-hover:scale-[1.015] group-hover:brightness-[0.74]"
      onError={() => setErr(true)}
    />
  );
}

export function CaseStudies() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-45px" });
  const studies = PROJECTS;

  return (
    <section id="arbeiten" ref={ref} className="section-y bg-[#0A0A0A] px-5" aria-labelledby="cases-heading">
      <div className="layout-max">
        <motion.div
          className="mb-6 md:mb-7"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={transition}
        >
          <p className="mb-1">
            <SectionEyebrow>Projekte</SectionEyebrow>
          </p>
          <h2 id="cases-heading" className={h2}>
            Ausgewählte Arbeit. <em className="italic text-white/45">Kuratiert.</em>
          </h2>
          <p className="font-ui mt-2 max-w-xl text-[14px] leading-[1.65] text-white/42 md:text-[0.875rem]">
            <Link
              to="/projekte"
              className="text-white/48 underline-offset-4 magicks-duration-hover magicks-ease-out transition-colors hover:text-cyan-200/75"
            >
              Alle Projekte →
            </Link>
          </p>
        </motion.div>

        <div className="flex flex-col gap-3 md:gap-3.5">
          {studies.map((study, i) => (
            <motion.article
              key={study.slug}
              className="group card-surface card-surface-interactive overflow-hidden rounded-xl md:grid md:grid-cols-[1fr_1.05fr]"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...transition, delay: stagger * (i + 1) }}
            >
              <Link to={`/projekte/${study.slug}`} className="contents no-underline">
                <div className="relative min-h-[150px] overflow-hidden md:min-h-[190px]">
                  <CaseImage src={study.image} alt={study.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/88 via-[#0A0A0A]/18 to-transparent md:bg-gradient-to-r" />
                  <span className="font-ui absolute left-3 top-3 rounded-full border border-white/[0.1] bg-black/45 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-white/65 backdrop-blur-sm">
                    {study.category}
                  </span>
                </div>
                <div className="flex flex-col justify-center p-4 md:p-5">
                  <h3 className="font-instrument text-[1rem] leading-snug text-white md:text-[1.1rem]">{study.title}</h3>
                  <dl className="font-ui mt-3 space-y-2 text-[14px]">
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/28">Ausgangslage</dt>
                      <dd className="mt-0.5 leading-[1.55] text-white/48">{study.problem}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/28">Lösung</dt>
                      <dd className="mt-0.5 leading-[1.55] text-white/48">{study.solution}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 border-t border-white/[0.06] pt-4">
                    <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-white/28">Wirkung</p>
                    <div className="mt-2.5 flex flex-wrap gap-5">
                      {study.metrics.map((m) => (
                        <div key={m.label}>
                          <p className="font-instrument text-lg text-white tabular-nums md:text-xl">{m.value}</p>
                          <p className="font-ui text-[11px] uppercase tracking-[0.12em] text-white/34">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="font-ui mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-cyan-200/40">Fallstudie lesen →</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
