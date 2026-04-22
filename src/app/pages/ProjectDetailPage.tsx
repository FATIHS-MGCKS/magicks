import { useLayoutEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import { ChapterMarker } from "../components/home/ChapterMarker";
import { SectionTransition } from "../components/service/SectionTransition";
import {
  type Project,
  type ProjectCaseSection,
  type ProjectImage,
  projectBySlug,
  projectSeoDescription,
  projectSeoTitle,
} from "../data/projects";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { registerGsap } from "../lib/gsap";
import { SEO } from "../seo/SEO";

/* ------------------------------------------------------------------
 * /projekte/:slug — bespoke editorial case study template.
 *
 * Design intent: reads as a real project write-up, not a portfolio
 * item. The structural rhythm is adapted from the MAGICKS studio
 * sheet (WebdesignKasselPage / LandingPagesKasselPage) and pulls
 * its content from the project's `case[]` free-form sections, plus
 * a few structural blocks (meta strip, gallery, services ledger,
 * related links, closing CTA).
 *
 * Image-friendly:
 *   - Cover renders in the hero when present, else a staged empty
 *     plate (no broken images, no cheesy icons).
 *   - Gallery section always renders a composed grid. Real images
 *     take priority; any remaining slots render staged empty plates
 *     so the section reads as intentional today. When MAGICKS adds
 *     gallery entries later, the empty plates disappear automatically.
 *
 * Motion: restrained. Scroll reveals + a short hero fade — no word
 * choreography. Quiet confidence per the brief.
 * ------------------------------------------------------------------ */

/* Minimum number of structural slots in the gallery so the section
 * always feels composed. Real images are rendered first; remaining
 * slots render empty plates ready for manual enrichment. */
const GALLERY_MIN_SLOTS = 5;

/* Cinematic default span sequence for the gallery grid. Produces a
 *   12  →  6 + 6  →  8 + 4
 * rhythm — a full-width hero plate, a balanced pair, and a
 * wide+accent combo. Reads as an editorial spread instead of a
 * uniform grid. Overrideable per-image via `ProjectImage.span`. */
const CINEMATIC_SPANS = [12, 6, 6, 8, 4] as const;

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectBySlug(slug) : undefined;

  if (!project) {
    return <ProjectNotFound />;
  }

  return <ProjectDetail project={project} />;
}

/* ------------------------------------------------------------------
 * ProjectDetail — renders a full case study page.
 * ------------------------------------------------------------------ */

function ProjectDetail({ project }: { project: Project }) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const seoTitle = projectSeoTitle(project);
  const seoDescription = projectSeoDescription(project);
  const seoImage = project.seo?.ogImage ?? project.cover?.src;

  // Pre-compute the gallery slot list — real images, padded with
  // empty plates up to GALLERY_MIN_SLOTS so the section always reads
  // as intentional.
  const gallerySlots = useMemo<(ProjectImage | null)[]>(() => {
    const real = project.gallery ?? [];
    const count = Math.max(real.length, GALLERY_MIN_SLOTS);
    return Array.from({ length: count }, (_, i) => real[i] ?? null);
  }, [project.gallery]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>("[data-cs-reveal]");
      const heroCover = root.querySelector<HTMLElement>("[data-cs-cover]");

      if (reduced) {
        gsap.set([...reveals, heroCover], { opacity: 1, y: 0, scale: 1 });
        return;
      }

      // Hero cover — gentle scale + fade.
      if (heroCover) {
        gsap.set(heroCover, { opacity: 0, scale: 1.015 });
        gsap.to(heroCover, {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: "power2.out",
          delay: 0.12,
        });
      }

      // Section reveals.
      reveals.forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 22 });
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: "power3.out",
          delay: i < 4 ? 0.08 * i : 0,
          scrollTrigger: { trigger: el, start: "top 84%", once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <SEO
        path={`/projekte/${project.slug}`}
        title={seoTitle}
        description={seoDescription}
        ogImage={seoImage}
      />

      <main
        ref={rootRef}
        className="relative bg-[#0A0A0A] pb-0 pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.5rem]"
      >
        {/* =========================================================
           § 00 — HERO · TYPOGRAPHIC MASTHEAD
        ========================================================= */}
        <section className="relative overflow-hidden px-5 pb-16 sm:px-8 sm:pb-20 md:px-12 md:pb-24 lg:px-16 lg:pb-28">
          <div className="relative layout-max">
            {/* Top masthead */}
            <div className="mb-10 flex flex-col gap-5 sm:mb-14 md:mb-16">
              <div className="flex items-start justify-between gap-6">
                <div data-cs-reveal>
                  <ChapterMarker num="REFERENZ" label={project.category} />
                </div>
                <div
                  data-cs-reveal
                  aria-hidden
                  className="font-mono hidden items-center gap-3 whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/42 sm:flex sm:text-[10px]"
                >
                  <span className="tabular-nums text-white/32">F · 01</span>
                  <span aria-hidden className="h-px w-5 bg-white/24" />
                  <span>Projektakte · Renova</span>
                </div>
              </div>

              <div
                data-cs-reveal
                className="flex items-center gap-4 sm:gap-5"
              >
                <span aria-hidden className="h-px w-10 bg-white/24 sm:w-14" />
                <span className="font-mono flex items-center gap-3 whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/52 sm:gap-4 sm:text-[10px] md:text-[10.5px]">
                  <Link
                    to="/projekte"
                    className="text-white/56 no-underline transition-colors hover:text-white/88"
                  >
                    Projekte
                  </Link>
                  <span aria-hidden className="h-px w-4 bg-white/28 sm:w-5" />
                  <span className="text-white/48">Referenz</span>
                  <span aria-hidden className="h-px w-4 bg-white/28 sm:w-5" />
                  <span className="text-white/36">{project.title}</span>
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/12" />
              </div>
            </div>

            {/* Identity block — purely typographic. Max-width limits
                measure so the H1 reads as a masthead, not a banner. */}
            <div className="max-w-[62rem]">
              <p
                data-cs-reveal
                className="font-mono mb-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/54 sm:mb-9 sm:text-[10.5px]"
              >
                <span className="text-white/72">{project.category}</span>
                {project.industry ? (
                  <>
                    <span aria-hidden className="text-white/28">·</span>
                    <span>{project.industry}</span>
                  </>
                ) : null}
                <span aria-hidden className="text-white/28">·</span>
                <span className="text-white/44">Projekt 01</span>
              </p>

              <h1
                data-cs-reveal
                className="font-instrument text-[2.35rem] leading-[1.0] tracking-[-0.036em] text-white sm:text-[3.1rem] md:text-[3.95rem] lg:text-[4.65rem] xl:text-[5.2rem]"
              >
                {project.title}
              </h1>

              <p
                data-cs-reveal
                className="font-instrument mt-10 max-w-[42rem] text-[1.28rem] italic leading-[1.38] tracking-[-0.012em] text-white/90 sm:text-[1.44rem] md:mt-12 md:text-[1.58rem]"
              >
                {project.intro}
              </p>

              {project.supportingIntro ? (
                <p
                  data-cs-reveal
                  className="font-ui mt-7 max-w-[42rem] border-t border-white/[0.08] pt-6 text-[14.5px] leading-[1.72] text-white/62 md:mt-9 md:text-[15.5px]"
                >
                  {project.supportingIntro}
                </p>
              ) : null}

              {/* CTA row — outline pill (CTA-escalation step 1 of 2)
                  + visible domain tell as a parallel trust signal. */}
              <div
                data-cs-reveal
                className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 sm:mt-14 md:mt-16"
              >
                <Link
                  to="/kontakt"
                  className="group relative inline-flex items-center gap-3 rounded-full border border-white/28 bg-white/[0.02] py-3 pl-7 pr-3 text-[14.5px] font-medium tracking-wide text-white no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] magicks-duration-hover magicks-ease-out transition-[transform,border-color,background-color,box-shadow] hover:-translate-y-[1px] hover:border-white/48 hover:bg-white/[0.05] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] active:translate-y-0 active:scale-[0.985] md:text-[15.5px]"
                  aria-label="Projekt anfragen"
                >
                  <span className="font-ui">Projekt anfragen</span>
                  <span
                    aria-hidden
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0A0A0A] magicks-duration-hover magicks-ease-out transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
                  >
                    <svg
                      viewBox="0 0 14 14"
                      width="11"
                      height="11"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    >
                      <path
                        d="M3 11 L11 3 M5 3 H11 V9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>

                {project.publicUrl ? (
                  <a
                    href={project.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/live inline-flex items-center gap-3 no-underline"
                    aria-label={`${project.title} live öffnen`}
                  >
                    <span
                      aria-hidden
                      className="h-[6px] w-[6px] rounded-full bg-white/84 tick-breathing"
                    />
                    <span className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/66 transition-colors duration-[420ms] group-hover/live:text-white/92 sm:text-[11px]">
                      Live
                    </span>
                    <span
                      aria-hidden
                      className="h-px w-4 bg-white/24 sm:w-5"
                    />
                    <span className="font-mono tabular-nums text-[11px] font-medium uppercase leading-none tracking-[0.14em] text-white/82 transition-colors duration-[420ms] group-hover/live:text-white sm:text-[11.5px] md:text-[12px]">
                      {prettyUrl(project.publicUrl)}
                    </span>
                    <span
                      aria-hidden
                      className="font-instrument text-[1.05rem] italic text-white/76 transition-transform duration-[480ms] group-hover/live:-translate-y-[2px] group-hover/live:translate-x-[2px] md:text-[1.12rem]"
                    >
                      ↗
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
           § 00b — FULL-BLEED COVER PLATE
           Cinematic masthead shot (or premium staged plate) with
           the live URL embedded in the caption bar. Sits between
           typographic identity and the meta strip so the page reads
           as: NAME · IMAGE · INDEX.
        ========================================================= */}
        <section className="relative px-5 pb-16 sm:px-8 sm:pb-20 md:px-12 md:pb-24 lg:px-16 lg:pb-28">
          <div data-cs-cover className="layout-max">
            <HeroCoverWide
              cover={project.cover}
              title={project.title}
              publicUrl={project.publicUrl}
            />
          </div>
        </section>

        {/* =========================================================
           § 00c — PROJECT META STRIP
        ========================================================= */}
        <section className="relative px-5 pb-20 sm:px-8 sm:pb-28 md:px-12 md:pb-32 lg:px-16 lg:pb-40">
          <div data-cs-reveal className="layout-max">
            {/* Rail label */}
            <div className="flex items-center justify-between gap-4 border-t border-white/[0.08] py-4 md:py-5">
              <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10px]">
                Projektakte · Register
              </span>
              <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/34 sm:text-[10px]">
                04 Einträge
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-x-0 gap-y-6 border-t border-white/[0.08] py-7 sm:grid-cols-4 sm:gap-y-0">
              <MetaCell k="Kategorie" v={project.category} first />
              <MetaCell k="Branche" v={project.industry ?? "—"} />
              <MetaCell k="Jahr" v={project.year ?? "MMXXVI"} />
              <MetaCell
                k="Live"
                v={
                  project.publicUrl ? (
                    <a
                      href={project.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono tabular-nums text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-white/86 no-underline transition-colors hover:text-white sm:text-[11px]"
                    >
                      {prettyUrl(project.publicUrl)} ↗
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
            </dl>
            <div aria-hidden className="border-b border-white/[0.08]" />
          </div>
        </section>

        <SectionTransition
          from="§ 00  Hero"
          to="§ 01  Projektziel"
          tone="darker"
        />

        {/* =========================================================
           CASE SECTIONS (from project.case[])
        ========================================================= */}
        {project.case.map((section, i) => (
          <CaseSection
            key={`${section.title}-${i}`}
            section={section}
            index={i}
            totalBefore={i}
          />
        ))}

        {/* =========================================================
           § — PROJEKT-EINBLICKE (gallery)
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#080809] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              background:
                "radial-gradient(ellipse 60% 44% at 50% 50%, rgba(255,255,255,0.026), transparent 64%)",
            }}
          />

          <div className="relative layout-max">
            <div
              data-cs-reveal
              className="mb-12 flex items-center gap-5 sm:mb-16"
            >
              <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
                § {String(project.case.length + 1).padStart(2, "0")} — Projekt-Einblicke
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/12" />
              <span className="font-mono tabular-nums hidden whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/36 sm:inline sm:text-[10px]">
                {String(gallerySlots.length).padStart(2, "0")} Plates
              </span>
            </div>

            <div className="max-w-[58rem]">
              <h2
                data-cs-reveal
                className="font-instrument text-[2rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.65rem] xl:text-[3.95rem]"
              >
                Projekt-Einblicke
              </h2>
              <p
                data-cs-reveal
                className="font-instrument mt-7 max-w-[42rem] text-[1.18rem] italic leading-[1.42] tracking-[-0.01em] text-white/76 sm:text-[1.3rem] md:mt-9 md:text-[1.4rem]"
              >
                Seitenansichten, Kompositionen, Details —{" "}
                <em className="not-italic text-white/50">
                  ein ruhiger Blick in die Gestaltung.
                </em>
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-12 md:mt-20 md:gap-7 lg:gap-8">
              {gallerySlots.map((slot, i) => (
                <GalleryTile
                  key={i}
                  slot={slot}
                  index={i}
                  projectTitle={project.title}
                />
              ))}
            </div>
          </div>
        </section>

        <SectionTransition
          from="§ Projekt-Einblicke"
          to="§ Leistung im Überblick"
        />

        {/* =========================================================
           § — LEISTUNG IM ÜBERBLICK
        ========================================================= */}
        {project.services && project.services.length > 0 ? (
          <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
            <div className="layout-max">
              <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
                <div data-cs-reveal className="md:pt-2">
                  <div className="flex flex-col gap-4">
                    <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                      § {String(project.case.length + 2).padStart(2, "0")} — Leistung
                    </p>
                    <ChapterMarker num="LP" label="Umfang" />
                    <span
                      aria-hidden
                      className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]"
                    >
                      {String(project.services.length).padStart(2, "0")}{" "}
                      Positionen
                    </span>
                  </div>
                </div>

                <div>
                  <h2
                    data-cs-reveal
                    className="font-instrument max-w-[52rem] text-[2rem] leading-[1.05] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]"
                  >
                    Leistung im Überblick
                  </h2>

                  <ol
                    data-cs-reveal
                    className="mt-12 grid grid-cols-1 border-y border-white/[0.08] md:mt-16 md:grid-cols-2"
                  >
                    {project.services.map((service, i) => {
                      const isLeftCol = i % 2 === 0;
                      const isInLastRow =
                        i >= project.services!.length - (project.services!.length % 2 === 0 ? 2 : 1);
                      return (
                        <li
                          key={service}
                          className={`grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 py-6 sm:gap-x-7 md:py-8 ${
                            i < project.services!.length - 1
                              ? "border-b border-white/[0.08] md:border-b-0"
                              : ""
                          } ${
                            !isInLastRow
                              ? "md:border-b md:border-white/[0.08]"
                              : ""
                          } ${
                            isLeftCol
                              ? "md:border-r md:border-white/[0.08] md:pr-8 lg:pr-10"
                              : "md:pl-8 lg:pl-10"
                          }`}
                        >
                          <span className="font-mono tabular-nums pt-[0.24rem] text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/52 md:text-[11.5px]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <p className="font-instrument max-w-[24rem] text-[1.22rem] leading-[1.3] tracking-[-0.012em] text-white/94 sm:text-[1.38rem] md:text-[1.52rem]">
                            {service}
                          </p>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* =========================================================
           § — PASSENDE LEISTUNGEN (related links)
        ========================================================= */}
        {project.relatedServices && project.relatedServices.length > 0 ? (
          <section className="relative overflow-hidden bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
            <div className="relative layout-max">
              <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
                <div data-cs-reveal className="md:pt-2">
                  <div className="flex flex-col gap-4">
                    <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                      § {String(project.case.length + 3).padStart(2, "0")} —
                      Anschluss
                    </p>
                    <ChapterMarker num="LK" label="Passend" />
                  </div>
                </div>

                <div>
                  <h2
                    data-cs-reveal
                    className="font-instrument max-w-[52rem] text-[2rem] leading-[1.04] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]"
                  >
                    Passende Leistungen
                  </h2>

                  <p
                    data-cs-reveal
                    className="font-ui mt-7 max-w-[44rem] text-[15.5px] leading-[1.72] text-white/66 md:mt-9 md:text-[16.5px]"
                  >
                    Dieses Projekt knüpft an mehrere Leistungen des Studios an
                    — von der Website-Umsetzung bis zur regionalen
                    Sichtbarkeit.
                  </p>
                </div>
              </div>

              <ul
                data-cs-reveal
                className="mt-16 grid grid-cols-1 border-y border-white/[0.08] md:mt-20 md:grid-cols-2"
              >
                {project.relatedServices.map((link, i) => {
                  const isInBottomRow =
                    i >= project.relatedServices!.length - 2;
                  const isLeftColumn = i % 2 === 0;
                  const classes = [
                    i !== project.relatedServices!.length - 1
                      ? "border-b border-white/[0.08]"
                      : "",
                    isInBottomRow ? "md:border-b-0" : "",
                    isLeftColumn ? "md:border-r md:border-white/[0.08]" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <li key={link.to} className={classes}>
                      <Link
                        to={link.to}
                        className="group/rl relative block px-0 py-9 md:px-5 md:py-12 lg:px-7 lg:py-14"
                      >
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[620ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/rl:opacity-100 group-focus-visible/rl:opacity-100"
                          style={{
                            background:
                              "radial-gradient(ellipse 65% 90% at 28% 60%, rgba(255,255,255,0.035), transparent 70%)",
                          }}
                        />
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-white/62 transition-transform duration-[760ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/rl:scale-x-100 group-focus-visible/rl:scale-x-100"
                        />

                        <div className="relative flex items-baseline justify-between gap-5">
                          <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.38em] text-white/46 md:text-[10.5px]">
                            {link.eyebrow ?? "Verwandt"}
                          </span>
                          <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/36 md:text-[10px]">
                            LK-{String.fromCharCode(65 + i)}
                          </span>
                        </div>

                        <div className="relative mt-6 flex items-baseline justify-between gap-6 md:mt-8">
                          <h3 className="font-instrument text-[1.7rem] leading-[1.06] tracking-[-0.024em] text-white transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/rl:translate-x-[2px] sm:text-[2.05rem] md:text-[2.35rem] lg:text-[2.6rem]">
                            {link.label}
                          </h3>
                          <span
                            aria-hidden
                            className="font-instrument flex-shrink-0 text-[1.25rem] italic text-white/72 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/rl:-translate-y-[3px] group-hover/rl:translate-x-[3px] md:text-[1.45rem]"
                          >
                            ↗
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        ) : null}

        {/* =========================================================
           § END — FINAL CTA
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#070708] px-5 pb-32 pt-32 sm:px-8 sm:pb-40 sm:pt-40 md:px-12 md:pb-48 md:pt-48 lg:px-16 lg:pt-56">
          <div aria-hidden className="section-top-rule" />

          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[44%] aspect-square w-[116vw] max-w-[1160px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.014) 32%, transparent 62%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 118px)",
              maskImage:
                "radial-gradient(ellipse 72% 60% at 50% 46%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 72% 60% at 50% 46%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[72rem] text-center">
              <p
                data-cs-reveal
                className="font-mono mb-6 text-[9.5px] font-medium uppercase leading-none tracking-[0.46em] text-white/42 sm:mb-8 sm:text-[10px]"
              >
                Projektakte · Ende
              </p>

              <div data-cs-reveal className="mb-12 inline-flex sm:mb-16">
                <ChapterMarker
                  num="END"
                  label="Projekt"
                  align="center"
                  variant="end"
                />
              </div>

              <h2
                data-cs-reveal
                className="font-instrument text-[2.15rem] leading-[1.02] tracking-[-0.036em] text-white sm:text-[2.95rem] md:text-[3.85rem] lg:text-[4.6rem] xl:text-[5.15rem]"
              >
                Du willst einen Auftritt, der sichtbar wird{" "}
                <em className="italic text-white/72">
                  und dabei hochwertig bleibt?
                </em>
              </h2>

              <p
                data-cs-reveal
                className="font-ui mx-auto mt-12 max-w-[46rem] text-[15.5px] leading-[1.72] text-white/66 md:mt-14 md:text-[17px]"
              >
                Wir entwickeln Websites und digitale Auftritte, die klar wirken,
                technisch sauber funktionieren und eine starke Grundlage für
                Sichtbarkeit schaffen.
              </p>

              <div
                data-cs-reveal
                className="mt-14 flex justify-center sm:mt-16 md:mt-20"
              >
                <Link
                  to="/kontakt"
                  className="group relative inline-flex items-center gap-3 rounded-full border border-white/22 bg-white py-4 pl-8 pr-3 text-[15px] font-medium tracking-wide text-[#0A0A0A] no-underline shadow-[0_34px_80px_-32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.45)] magicks-duration-hover magicks-ease-out transition-[transform,box-shadow] hover:-translate-y-[2px] hover:shadow-[0_44px_90px_-28px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.55)] active:translate-y-0 active:scale-[0.985] md:text-[16px]"
                >
                  <span>Projekt anfragen</span>
                  <span
                    aria-hidden
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A0A0A] text-white magicks-duration-hover magicks-ease-out transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
                  >
                    <svg
                      viewBox="0 0 14 14"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    >
                      <path
                        d="M3 11 L11 3 M5 3 H11 V9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </div>

              {/* Back to all projects */}
              <div
                data-cs-reveal
                className="mt-16 flex items-center justify-center gap-5 sm:mt-20"
              >
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
                <Link
                  to="/projekte"
                  className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/54 no-underline transition-colors hover:text-white/82 sm:text-[10.5px]"
                >
                  ← Alle Projekte
                </Link>
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              </div>
            </div>

            {/* Closing cartouche */}
            <div
              data-cs-reveal
              className="mt-20 border-t border-white/[0.06] pt-7 sm:mt-24"
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-0">
                <MetaCell k="§ End" v={project.title} first />
                <MetaCell
                  k="Studio"
                  v="Kassel · Nordhessen"
                />
                <MetaCell
                  k="Live"
                  v={project.publicUrl ? prettyUrl(project.publicUrl) : "—"}
                />
                <MetaCell k="Edition" v="Magicks · MMXXVI" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/* ------------------------------------------------------------------
 * CaseSection — renders a single entry of project.case[].
 *
 * Variants:
 *   default  → two-column register with folio rail
 *   plate    → full-width hairline-bordered list plate
 *   centered → ceremonial centered block
 * ------------------------------------------------------------------ */

function CaseSection({
  section,
  index,
}: {
  section: ProjectCaseSection;
  index: number;
  totalBefore: number;
}) {
  const folio = section.folio ?? String(index + 1).padStart(2, "0");
  const eyebrow = section.eyebrow ?? section.title;
  const paragraphs = Array.isArray(section.body)
    ? section.body
    : section.body
    ? [section.body]
    : [];
  const hasItems = section.items && section.items.length > 0;

  const bg = index % 2 === 0 ? "bg-[#09090A]" : "bg-transparent";

  const variant = section.variant ?? (hasItems && !paragraphs.length ? "plate" : "default");

  return (
    <section className={`relative ${bg} px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16`}>
      <div className="layout-max">
        {variant === "centered" ? (
          <CaseSectionCentered
            folio={folio}
            eyebrow={eyebrow}
            title={section.title}
            titleItalic={section.titleItalic}
            paragraphs={paragraphs}
            items={section.items}
          />
        ) : variant === "plate" ? (
          <CaseSectionPlate
            folio={folio}
            eyebrow={eyebrow}
            title={section.title}
            titleItalic={section.titleItalic}
            paragraphs={paragraphs}
            items={section.items ?? []}
          />
        ) : (
          <CaseSectionDefault
            folio={folio}
            eyebrow={eyebrow}
            title={section.title}
            titleItalic={section.titleItalic}
            paragraphs={paragraphs}
            items={section.items}
          />
        )}
      </div>
    </section>
  );
}

function CaseSectionDefault({
  folio,
  eyebrow,
  title,
  titleItalic,
  paragraphs,
  items,
}: {
  folio: string;
  eyebrow: string;
  title: string;
  titleItalic?: string;
  paragraphs: string[];
  items?: string[];
}) {
  return (
    <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
      <div data-cs-reveal className="md:pt-2">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
            § {folio} — {eyebrow}
          </p>
          <ChapterMarker num={folio} label={eyebrow} />
        </div>
      </div>

      <div>
        <h2
          data-cs-reveal
          className="font-instrument max-w-[52rem] text-[2rem] leading-[1.04] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]"
        >
          {title}
          {titleItalic ? (
            <> — <em className="italic text-white/62">{titleItalic}</em></>
          ) : null}
        </h2>

        {paragraphs.length > 0 ? (
          <div className="mt-10 max-w-[44rem] space-y-5 md:mt-14 md:space-y-6">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                data-cs-reveal
                className={
                  i === 0
                    ? "font-instrument text-[1.24rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 sm:text-[1.34rem] md:text-[1.46rem]"
                    : "font-ui text-[15.5px] leading-[1.72] text-white/68 md:text-[16.5px]"
                }
              >
                {p}
              </p>
            ))}
          </div>
        ) : null}

        {items && items.length > 0 ? (
          <ul className="mt-10 grid grid-cols-1 border-t border-white/[0.08] md:grid-cols-2">
            {items.map((item, i) => {
              const isLastOdd = items.length % 2 === 1 && i === items.length - 1;
              return (
                <li
                  key={item}
                  data-cs-reveal
                  className={`flex items-baseline gap-5 border-b border-white/[0.08] py-5 md:py-6 ${
                    i % 2 === 0 && !isLastOdd
                      ? "md:border-r md:border-white/[0.08] md:pr-8 lg:pr-10"
                      : "md:pl-8 lg:pl-10"
                  }`}
                >
                  <span className="font-mono tabular-nums shrink-0 text-[10px] font-medium leading-none tracking-[0.3em] text-white/44 md:text-[10.5px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-instrument text-[1.1rem] italic leading-[1.3] tracking-[-0.01em] text-white/90 md:text-[1.22rem]">
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function CaseSectionPlate({
  folio,
  eyebrow,
  title,
  paragraphs,
  items,
}: {
  folio: string;
  eyebrow: string;
  title: string;
  titleItalic?: string;
  paragraphs: string[];
  items: string[];
}) {
  return (
    <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
      <div data-cs-reveal className="md:pt-2">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
            § {folio} — {eyebrow}
          </p>
          <ChapterMarker num={folio} label={eyebrow} />
          <span
            aria-hidden
            className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]"
          >
            {String(items.length).padStart(2, "0")} Punkte
          </span>
        </div>
      </div>

      <div>
        <h2
          data-cs-reveal
          className="font-instrument max-w-[52rem] text-[2rem] leading-[1.05] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]"
        >
          {title}
        </h2>

        {paragraphs.length > 0 ? (
          <div className="mt-10 max-w-[44rem] space-y-5 md:mt-12">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                data-cs-reveal
                className="font-ui text-[15.5px] leading-[1.72] text-white/66 md:text-[16.5px]"
              >
                {p}
              </p>
            ))}
          </div>
        ) : null}

        {/* Editorial plate — 2-col register with hairline dividers,
            numbered folios, italic serif items. Designed to feel like
            a printed index, never like a plain bullet dump. */}
        <div
          data-cs-reveal
          className="mt-12 border-y border-white/[0.08] md:mt-16"
        >
          <div className="flex items-center justify-between gap-4 py-3 md:py-4">
            <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/40 sm:text-[10px]">
              Register · Fokus
            </span>
            <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[10px]">
              {String(items.length).padStart(2, "0")} Einträge
            </span>
          </div>
          <ul className="grid grid-cols-1 border-t border-white/[0.08] md:grid-cols-2">
            {items.map((item, i) => {
              const last = i === items.length - 1;
              const lastOfCol =
                i === items.length - 1 ||
                (items.length % 2 === 0 && i === items.length - 2);
              return (
                <li
                  key={item}
                  className={`grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 py-6 md:py-7 ${
                    !last ? "border-b border-white/[0.08] md:border-b-0" : ""
                  } ${
                    !lastOfCol ? "md:border-b md:border-white/[0.08]" : ""
                  } ${
                    i % 2 === 0
                      ? "md:border-r md:border-white/[0.08] md:pr-8 lg:pr-10"
                      : "md:pl-8 lg:pl-10"
                  }`}
                >
                  <span className="font-mono tabular-nums pt-[0.2rem] text-[10px] font-medium leading-none tracking-[0.28em] text-white/44 md:text-[10.5px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-instrument text-[1.14rem] italic leading-[1.3] tracking-[-0.012em] text-white/94 md:text-[1.32rem] lg:text-[1.4rem]">
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function CaseSectionCentered({
  folio,
  eyebrow,
  title,
  titleItalic,
  paragraphs,
  items,
}: {
  folio: string;
  eyebrow: string;
  title: string;
  titleItalic?: string;
  paragraphs: string[];
  items?: string[];
}) {
  return (
    <div className="mx-auto max-w-[72rem] text-center">
      <div
        data-cs-reveal
        className="mb-12 flex items-center gap-5 sm:mb-16"
      >
        <span aria-hidden className="h-px flex-1 bg-white/12" />
        <span className="font-mono whitespace-nowrap text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
          § {folio} — {eyebrow}
        </span>
        <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
      </div>

      <h2
        data-cs-reveal
        className="font-instrument mx-auto max-w-[56rem] text-[2.15rem] leading-[1.04] tracking-[-0.032em] text-white sm:text-[2.85rem] md:text-[3.5rem] lg:text-[4.1rem] xl:text-[4.55rem]"
      >
        {title}
        {titleItalic ? (
          <> — <em className="italic text-white/66">{titleItalic}</em></>
        ) : null}
      </h2>

      {paragraphs.length > 0 ? (
        <div className="mx-auto mt-14 max-w-[44rem] space-y-6 sm:mt-16">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              data-cs-reveal
              className={
                i === 0
                  ? "font-instrument text-[1.26rem] italic leading-[1.42] tracking-[-0.012em] text-white/88 sm:text-[1.38rem] md:text-[1.52rem]"
                  : "font-ui text-[15.5px] leading-[1.72] text-white/72 md:text-[16.5px]"
              }
            >
              {p}
            </p>
          ))}
        </div>
      ) : null}

      {items && items.length > 0 ? (
        <ul className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {items.map((item, i) => (
            <li
              key={item}
              data-cs-reveal
              className="font-mono flex items-center gap-3 text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/62 md:text-[10.5px]"
            >
              <span className="tabular-nums text-white/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------
 * HeroCoverWide — cinematic full-width masthead plate that sits
 * between the typographic hero and the meta strip.
 *
 * Aspect is intentionally wide (21:9 on large viewports, 16:9 on md,
 * 4:3 on mobile) so it reads as a magazine-cover moment rather than
 * a thumbnail. When a cover image is present it renders full-bleed
 * with a gradient foot; otherwise a premium staged plate renders in
 * the same footprint, with the live URL baked into the caption so
 * the trust signal stays present even without imagery.
 * ------------------------------------------------------------------ */

function HeroCoverWide({
  cover,
  title,
  publicUrl,
}: {
  cover?: ProjectImage;
  title: string;
  publicUrl?: string;
}) {
  const urlLabel = publicUrl ? prettyUrl(publicUrl) : null;

  if (cover) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/[0.08] bg-[#08080A] sm:aspect-[3/2] md:aspect-[16/9] lg:aspect-[21/9]">
        <img
          src={cover.src}
          alt={cover.alt}
          className="h-full w-full object-cover brightness-[0.88] saturate-[0.94]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 via-transparent to-transparent"
        />
        <HeroCoverCaption folio="F · 01" label={title} live={urlLabel} />
      </div>
    );
  }

  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden border border-white/[0.08] bg-[#08080A] sm:aspect-[3/2] md:aspect-[16/9] lg:aspect-[21/9]"
      role="img"
      aria-label={`${title} — Bildmaterial folgt`}
    >
      {/* Grain rails */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.24]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.014) 0 1px, transparent 1px 118px), repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0 1px, transparent 1px 118px)",
          maskImage:
            "radial-gradient(ellipse 70% 66% at 50% 50%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 66% at 50% 50%, black, transparent)",
        }}
      />
      {/* Central halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 46% 46% at 50% 46%, rgba(255,255,255,0.06), transparent 62%)",
        }}
      />
      {/* Inset frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-7 border border-white/[0.07] md:inset-12 lg:inset-16"
      />
      {/* Diamond marker */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 flex h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      >
        <span className="absolute inset-0 block rotate-45 border border-white/62 bg-[#08080A]" />
        <span className="absolute h-[8px] w-[8px] rotate-45 bg-white/84" />
      </div>

      <HeroCoverCaption
        folio="F · 01"
        label={`${title} · Bildmaterial folgt`}
        live={urlLabel}
        empty
      />
    </div>
  );
}

function HeroCoverCaption({
  folio,
  label,
  live,
  empty = false,
}: {
  folio: string;
  label: string;
  live: string | null;
  empty?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-7 bottom-7 flex items-end justify-between gap-5 md:inset-x-12 md:bottom-10 lg:inset-x-16 lg:bottom-12">
      <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/48 md:text-[10px]">
        {folio}
      </span>
      <div className="flex flex-col items-end gap-2 text-right">
        <span
          className={`font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] md:text-[10px] ${
            empty ? "text-white/36" : "text-white/60"
          }`}
        >
          {label}
        </span>
        {live ? (
          <span className="font-mono tabular-nums hidden text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-white/64 md:inline-block md:text-[10.5px]">
            {live}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * GalleryTile — a single plate in the detail gallery grid.
 * Renders a real image when `slot` is populated, else a premium
 * empty-state plate with an index folio.
 * ------------------------------------------------------------------ */

function GalleryTile({
  slot,
  index,
  projectTitle,
}: {
  slot: ProjectImage | null;
  index: number;
  projectTitle: string;
}) {
  // Cinematic opening sequence for the first 5 slots; repeating 6+6
  // pairs thereafter so extra gallery entries stay editorial.
  const defaultSpan =
    index < CINEMATIC_SPANS.length ? CINEMATIC_SPANS[index] : index % 2 === 0 ? 6 : 6;
  const span = slot?.span ?? defaultSpan;

  // Aspect defaults tuned to span — wide for hero/detail plates,
  // standard for pair plates, tall for accent plates.
  const defaultAspect: ProjectImage["aspect"] =
    span === 12 ? "21/9" : span === 8 ? "3/2" : span === 4 ? "3/4" : "4/3";
  const aspectClass = aspectToClass(slot?.aspect ?? defaultAspect);

  const colSpan =
    span === 12
      ? "sm:col-span-12"
      : span === 8
      ? "sm:col-span-8"
      : span === 6
      ? "sm:col-span-6"
      : "sm:col-span-4";

  // Editorial "plate kind" label based on span — frames each empty
  // plate so the grid stays composed even without imagery.
  const kindLabel =
    span === 12
      ? "Hero · Ansicht"
      : span === 8
      ? "Detail · Komposition"
      : span === 4
      ? "Akzent · Fragment"
      : "Ansicht · Paar";

  return (
    <figure
      data-cs-reveal
      className={`relative ${colSpan} col-span-1`}
    >
      {slot ? (
        <div
          className={`relative w-full overflow-hidden border border-white/[0.08] bg-[#08080A] ${aspectClass}`}
        >
          <img
            src={slot.src}
            alt={slot.alt}
            className="h-full w-full object-cover brightness-[0.9] saturate-[0.94]"
            loading="lazy"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 via-transparent to-transparent"
          />
          <GalleryTileCaption index={index} label={slot.caption ?? slot.alt} />
        </div>
      ) : (
        <div
          className={`relative w-full overflow-hidden border border-white/[0.08] bg-[#08080A] ${aspectClass}`}
          role="img"
          aria-label={`${projectTitle} — Bild ${index + 1} folgt`}
        >
          {/* Grain rails */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.014) 0 1px, transparent 1px 84px), repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0 1px, transparent 1px 84px)",
              maskImage:
                "radial-gradient(ellipse 72% 64% at 50% 50%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 72% 64% at 50% 50%, black, transparent)",
            }}
          />
          {/* Central halo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 42% 42% at 50% 46%, rgba(255,255,255,0.048), transparent 62%)",
            }}
          />
          {/* Inset frame */}
          <div
            aria-hidden
            className={`pointer-events-none absolute border border-white/[0.06] ${
              span >= 8 ? "inset-6 md:inset-10" : "inset-5 md:inset-7"
            }`}
          />
          {/* Center diamond marker */}
          <div
            aria-hidden
            className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center ${
              span >= 8 ? "h-[18px] w-[18px]" : "h-[14px] w-[14px]"
            }`}
          >
            <span className="absolute inset-0 block rotate-45 border border-white/60 bg-[#08080A]" />
            <span
              className={`absolute rotate-45 bg-white/80 ${
                span >= 8 ? "h-[6px] w-[6px]" : "h-[5px] w-[5px]"
              }`}
            />
          </div>
          {/* Plate-kind top label (only on larger plates) */}
          {span >= 8 ? (
            <span className="font-mono pointer-events-none absolute left-6 top-6 text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 md:left-10 md:top-10 md:text-[10px]">
              {kindLabel}
            </span>
          ) : null}
          <GalleryTileCaption
            index={index}
            label="Bildmaterial folgt"
            empty
          />
        </div>
      )}

      {slot?.caption ? (
        <figcaption className="font-mono mt-3 text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/46 md:text-[10.5px]">
          {slot.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function GalleryTileCaption({
  index,
  label,
  empty = false,
}: {
  index: number;
  label: string;
  empty?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between gap-5 md:inset-x-7 md:bottom-7">
      <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/46 md:text-[10px]">
        Plate · {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className={`font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] md:text-[10px] ${
          empty ? "text-white/34" : "text-white/52"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function aspectToClass(aspect: ProjectImage["aspect"]): string {
  switch (aspect) {
    case "16/9":
      return "aspect-[16/9]";
    case "21/9":
      return "aspect-[21/9]";
    case "4/3":
      return "aspect-[4/3]";
    case "3/2":
      return "aspect-[3/2]";
    case "1/1":
      return "aspect-square";
    case "9/16":
      return "aspect-[9/16]";
    case "3/4":
      return "aspect-[3/4]";
    default:
      return "aspect-[4/3]";
  }
}

/* ------------------------------------------------------------------
 * MetaCell — shared meta strip cell for project meta rows.
 * ------------------------------------------------------------------ */

function MetaCell({
  k,
  v,
  first = false,
}: {
  k: string;
  v: React.ReactNode;
  first?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-2 ${
        !first ? "sm:border-l sm:border-white/[0.08] sm:pl-5 md:pl-7" : ""
      }`}
    >
      <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/36 sm:text-[9.5px]">
        {k}
      </span>
      {typeof v === "string" ? (
        <span className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.28em] text-white/68 sm:text-[10.5px]">
          {v}
        </span>
      ) : (
        v
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
 * prettyUrl — strips the protocol from a URL for display.
 * ------------------------------------------------------------------ */

function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/* ------------------------------------------------------------------
 * ProjectNotFound — graceful fallback for unknown slugs.
 * noindex so crawlers don't record it.
 * ------------------------------------------------------------------ */

function ProjectNotFound() {
  return (
    <>
      <SEO
        path="/projekte"
        title="Projekt nicht gefunden – MAGICKS Studio"
        description="Das angefragte Projekt existiert nicht mehr oder wurde umbenannt. Zur Projektübersicht von MAGICKS Studio."
        robots="noindex, follow"
      />
      <main className="relative bg-[#0A0A0A] pb-32 pt-[8.5rem]">
        <div className="layout-max px-5 text-center md:px-12">
          <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46">
            § 00 — Nicht gefunden
          </p>
          <h1 className="font-instrument mt-6 text-[1.9rem] leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.3rem] md:text-[2.7rem]">
            Dieses Projekt existiert{" "}
            <em className="italic text-white/62">nicht mehr</em> oder wurde
            umbenannt.
          </h1>
          <p className="font-ui mx-auto mt-6 max-w-[36rem] text-[15px] leading-[1.72] text-white/62 md:text-[16px]">
            Alle veröffentlichten Arbeiten findest du in der aktuellen
            Studio-Auswahl.
          </p>
          <div className="mt-10 flex items-center justify-center gap-5">
            <Link
              to="/projekte"
              className="font-ui text-[15px] font-medium text-white no-underline underline-offset-4 transition-[letter-spacing,opacity] hover:tracking-[0.004em]"
            >
              ← Zur Projektübersicht
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
