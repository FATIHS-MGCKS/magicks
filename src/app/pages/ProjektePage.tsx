import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { ChapterMarker } from "../components/home/ChapterMarker";
import { SectionTransition } from "../components/service/SectionTransition";
import { featuredProjects, type Project } from "../data/projects";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { registerGsap } from "../lib/gsap";
import { RouteSEO } from "../seo/RouteSEO";

/* ------------------------------------------------------------------
 * /projekte — bespoke editorial projects overview.
 *
 * Design intent: a curated studio sheet, not a card grid.
 *
 * Signature composition:
 *   - Editorial hero with focal axis (Ausgangslage → Konzept → Wirkung).
 *   - Credo section that defines the curation policy before the work
 *     is shown (the opposite of a "click-heavy thumbnail wall").
 *   - A single large featured split per project — cover plate left,
 *     typographic identity right. This composition scales cleanly:
 *     the first entry is always the large split; subsequent entries
 *     fall into a compact editorial row list (see `CompactRow`).
 *   - A "so messen wir Projekte" register strip under the listing,
 *     which doubles as the studio's stance on what counts as work.
 *   - Closing cartouche + pill CTA mirroring the rest of the studio
 *     sheets so the whole site feels like one document.
 *
 * Motion policy: restrained. Scroll reveals only — no word-by-word
 * headline timelines here. The overview page should breathe, not
 * perform.
 * ------------------------------------------------------------------ */

/* =======  VERBATIM COPY  =======
 * Brief-provided copy kept as module-level constants so the editorial
 * layout can be audited against the brief at a glance. */

const HERO_EYEBROW = "Studio · Arbeit · MMXXVI";
// H1 copy from brief: "Ausgewählte Projekte von MAGICKS Studio."
// Rendered inline to allow an italic pivot on "Projekte".
const HERO_LEAD_1 =
  "Nicht jede digitale Lösung sieht gleich aus. Und nicht jedes Projekt braucht denselben Weg.";
const HERO_LEAD_2 =
  "Hier zeigen wir ausgewählte Arbeiten, digitale Konzepte und Umsetzungen, bei denen Design, Technik, Nutzerführung und Wirkung sauber zusammenspielen.";

const CREDO_HEADLINE_A = "Keine Sammlung schöner Screens.";
const CREDO_HEADLINE_B = "Sondern digitale Arbeiten mit Substanz.";
const CREDO_P1_A = "Wir zeigen hier keine beliebige Galerie.";
const CREDO_P1_B =
  "Sondern Projekte, bei denen Gestaltung, technische Umsetzung und digitale Logik wirklich zusammengehören.";
const CREDO_TRIPTYCH = [
  "Mal steht ein klarer Markenauftritt im Fokus.",
  "Mal SEO, Nutzerführung oder Conversion.",
  "Mal ein Shop, ein Konfigurator oder eine individuellere digitale Lösung.",
];

const MESSBAR_HEADLINE = "Woran wir Projekte messen";
const MESSBAR_P1_A = "Nicht nur daran, wie etwas aussieht.";
const MESSBAR_P1_B =
  "Sondern daran, ob es klar führt, technisch sauber funktioniert und für das Unternehmen im Alltag wirklich einen Unterschied macht.";
const MESSBAR_P2 =
  "Deshalb denken wir Projekte nicht nur visuell, sondern immer auch in Struktur, Nutzerführung, Performance, Sichtbarkeit und digitaler Wirkung.";

const FINAL_CTA_HEADLINE = "Bereit für ein Projekt, das nicht wie Standard endet?";
const FINAL_CTA_BODY =
  "Wenn du einen digitalen Auftritt oder eine Lösung willst, die hochwertig wirkt und sauber funktioniert, dann lass uns sprechen.";

/** Focal-axis stops — three editorial studio beats for the hero gutter. */
const FOCAL_STOPS: { label: string; tone: "outline" | "filled" }[] = [
  { label: "Ausgangslage", tone: "outline" },
  { label: "Konzept", tone: "filled" },
  { label: "Wirkung", tone: "outline" },
];

/** Dimensions MAGICKS measures projects against.
 *
 * `label` items mirror the order from the brief's closing paragraph:
 *   "Struktur, Nutzerführung, Performance, Sichtbarkeit und digitaler Wirkung."
 * The short italic `note` is editorial gloss — a one-beat clarification of
 * what each dimension means in practice. Treated as structural ornament,
 * not added content. */
const MESSBAR_ITEMS = [
  { num: "01", label: "Struktur", note: "Architektur der Inhalte" },
  { num: "02", label: "Nutzerführung", note: "Weg zum nächsten Schritt" },
  { num: "03", label: "Performance", note: "Technisch saubere Basis" },
  { num: "04", label: "Sichtbarkeit", note: "Auffindbar bleiben" },
  { num: "05", label: "Digitale Wirkung", note: "Im Alltag spürbar" },
];

/* =======  PAGE  ======= */

export default function ProjektePage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const projects = featuredProjects();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>("[data-pj-reveal]");
      const heroAxisRule = root.querySelector<HTMLElement>("[data-pj-axis-rule]");
      const heroAxisStops = gsap.utils.toArray<HTMLElement>("[data-pj-axis-stop]");

      if (reduced) {
        gsap.set([...reveals, heroAxisRule, ...heroAxisStops], {
          opacity: 1,
          y: 0,
          scaleY: 1,
        });
        return;
      }

      // Scroll-triggered reveals — calm, editorial, no overlap with
      // the hero entrance.
      reveals.forEach((el) => {
        gsap.set(el, { opacity: 0, y: 22 });
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 84%", once: true },
        });
      });

      // Hero intro — focal axis draws in once, subtle.
      if (heroAxisRule) {
        gsap.set(heroAxisRule, { scaleY: 0, transformOrigin: "top center" });
        gsap.to(heroAxisRule, {
          scaleY: 1,
          duration: 1.1,
          ease: "power2.inOut",
          delay: 0.4,
        });
      }
      if (heroAxisStops.length) {
        gsap.set(heroAxisStops, { opacity: 0, scale: 0.5 });
        gsap.to(heroAxisStops, {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.4)",
          stagger: 0.1,
          delay: 1.1,
        });
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const [featured, ...rest] = projects;

  return (
    <>
      <RouteSEO path="/projekte" />

      <main
        ref={rootRef}
        className="relative bg-[#0A0A0A] pb-0 pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.5rem]"
      >
        {/* =========================================================
           § 00 — HERO
        ========================================================= */}
        <section
          data-pj-hero
          className="relative overflow-hidden px-5 pb-28 sm:px-8 sm:pb-32 md:px-12 md:pb-40 lg:px-16 lg:pb-48"
        >
          {/* Grain plate */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 118px)",
              maskImage:
                "radial-gradient(ellipse 64% 68% at 38% 48%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 64% 68% at 38% 48%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            {/* Top masthead */}
            <div className="mb-10 flex flex-col gap-5 sm:mb-14 md:mb-16">
              <div className="flex items-start justify-between gap-6">
                <div data-pj-reveal>
                  <ChapterMarker num="01" label="Arbeit" />
                </div>
                <div
                  data-pj-reveal
                  aria-hidden
                  className="font-mono hidden items-center gap-3 whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/42 sm:flex sm:text-[10px]"
                >
                  <span className="tabular-nums text-white/32">F · 01</span>
                  <span aria-hidden className="h-px w-5 bg-white/24" />
                  <span>Studio · Arbeit · MMXXVI</span>
                </div>
              </div>

              {/* Studio dateline — three-part edition masthead:
                  Name · Vol. · Location. Reads like a printed issue. */}
              <div
                data-pj-reveal
                className="flex items-center gap-4 sm:gap-5"
              >
                <span aria-hidden className="h-px w-10 bg-white/24 sm:w-14" />
                <span className="font-mono flex items-center gap-3 whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.4em] text-white/54 sm:gap-4 sm:text-[10px] md:text-[10.5px]">
                  <span className="text-white/72">Ausgewählte Arbeiten</span>
                  <span aria-hidden className="h-px w-4 bg-white/28 sm:w-5" />
                  <span className="tabular-nums">Vol. 01</span>
                  <span aria-hidden className="hidden h-px w-4 bg-white/28 sm:inline-block sm:w-5" />
                  <span className="hidden text-white/40 sm:inline">
                    Studio · Kassel · MMXXVI
                  </span>
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/12" />
              </div>
            </div>

            <div className="relative">
              {/* Focal axis gutter (desktop only) */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-0 top-[0.4rem] hidden h-[min(26rem,80%)] md:-left-8 md:block lg:-left-12"
              >
                <span
                  data-pj-axis-rule
                  className="absolute left-[5.5px] top-0 block h-full w-px bg-white/16"
                />
                <div className="absolute inset-0 flex flex-col justify-between">
                  {FOCAL_STOPS.map((stop) => (
                    <span
                      key={stop.label}
                      data-pj-axis-stop
                      className="font-mono relative flex items-center gap-3 text-[9px] font-medium uppercase leading-none tracking-[0.38em] text-white/48 sm:text-[9.5px]"
                    >
                      {stop.tone === "filled" ? (
                        <span
                          aria-hidden
                          className="relative block h-[11px] w-[11px] rounded-full bg-white shadow-[0_0_0_3px_rgba(10,10,10,1)]"
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="relative block h-[11px] w-[11px] rounded-full border border-white/62 bg-[#0A0A0A] shadow-[0_0_0_3px_rgba(10,10,10,1)]"
                        />
                      )}
                      <span className="tabular-nums">{stop.label}</span>
                    </span>
                  ))}
                </div>
              </div>

              <p
                data-pj-reveal
                className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/52 sm:mb-10 sm:text-[10.5px]"
              >
                {HERO_EYEBROW}
              </p>

              <h1
                data-pj-reveal
                className="font-instrument max-w-[60rem] text-[2.2rem] leading-[1.0] tracking-[-0.034em] text-white sm:text-[2.95rem] md:text-[3.8rem] lg:text-[4.45rem] xl:text-[4.95rem]"
              >
                Ausgewählte <em className="italic text-white/68">Projekte</em>{" "}
                von MAGICKS Studio.
              </h1>

              <div className="mt-10 max-w-[46rem] sm:mt-12 md:mt-14">
                <p
                  data-pj-reveal
                  className="font-instrument text-[1.28rem] italic leading-[1.38] tracking-[-0.01em] text-white/86 sm:text-[1.48rem] md:text-[1.62rem]"
                >
                  {HERO_LEAD_1}
                </p>
                <p
                  data-pj-reveal
                  className="font-ui mt-5 text-[15px] leading-[1.72] text-white/64 md:text-[16px]"
                >
                  {HERO_LEAD_2}
                </p>
              </div>

              {/* Primary CTA — understated underline link */}
              <div
                data-pj-reveal
                className="mt-12 inline-flex items-baseline gap-3 sm:mt-14 md:mt-16"
              >
                <Link
                  to="/kontakt"
                  className="group relative inline-flex items-baseline gap-3 text-[15px] font-medium tracking-[-0.005em] text-white no-underline sm:text-[16px] md:text-[17px]"
                  aria-label="Projekt anfragen"
                >
                  <span className="relative pb-3">
                    <span className="font-ui">Projekt anfragen</span>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 block h-px bg-white/32"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-white transition-transform duration-[820ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                  </span>
                  <span
                    aria-hidden
                    className="font-instrument text-[1.05em] italic text-white/85 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[3px] group-hover:translate-x-[3px]"
                  >
                    ↗
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 00  Hero" to="§ 01  Kuration" />

        {/* =========================================================
           § 01 — CREDO
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#080809] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.2]"
            style={{
              background:
                "radial-gradient(ellipse 58% 44% at 50% 50%, rgba(255,255,255,0.028), transparent 64%)",
            }}
          />
          <div className="relative layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-pj-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                    § 01 — Kuration
                  </p>
                  <ChapterMarker num="01" label="Credo" />
                  <span
                    aria-hidden
                    className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]"
                  >
                    Substanz · Auswahl · Linie
                  </span>
                </div>
              </div>

              <div>
                <h2
                  data-pj-reveal
                  className="font-instrument max-w-[58rem] text-[2.25rem] leading-[1.02] tracking-[-0.032em] text-white sm:text-[2.95rem] md:text-[3.7rem] lg:text-[4.3rem] xl:text-[4.75rem]"
                >
                  <span className="block">{CREDO_HEADLINE_A}</span>
                  <em className="mt-2 block italic text-white/62 sm:mt-3 md:mt-4">
                    {CREDO_HEADLINE_B}
                  </em>
                </h2>

                <div className="mt-10 max-w-[44rem] space-y-5 md:mt-14 md:space-y-6">
                  <p
                    data-pj-reveal
                    className="font-instrument text-[1.24rem] italic leading-[1.38] tracking-[-0.01em] text-white/88 sm:text-[1.36rem] md:text-[1.48rem]"
                  >
                    {CREDO_P1_A}
                  </p>
                  <p
                    data-pj-reveal
                    className="font-ui text-[15.5px] leading-[1.72] text-white/68 md:text-[16.5px]"
                  >
                    {CREDO_P1_B}
                  </p>
                </div>

                {/* Triptych — three typographic "Mal..." beats.
                    Each reads as a mode the studio actually works in. */}
                <ul className="mt-14 grid grid-cols-1 border-t border-white/[0.08] md:mt-16 md:grid-cols-3 md:border-y">
                  {CREDO_TRIPTYCH.map((line, i) => (
                    <li
                      key={line}
                      data-pj-reveal
                      className={`flex flex-col gap-4 border-b border-white/[0.08] py-7 md:border-b-0 md:py-9 ${
                        i > 0 ? "md:border-l md:border-white/[0.08] md:pl-8 lg:pl-10" : ""
                      }`}
                    >
                      <span className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.38em] text-white/42 md:text-[10.5px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-instrument max-w-[19rem] text-[1.14rem] italic leading-[1.34] tracking-[-0.01em] text-white/92 md:text-[1.22rem]">
                        {line}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 01  Credo" to="§ 02  Auswahl" tone="darker" />

        {/* =========================================================
           § 02 — PROJEKTE (featured + rest)
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="relative layout-max">
            <div
              data-pj-reveal
              className="mb-14 flex items-center gap-5 sm:mb-20"
            >
              <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
                § 02 — Auswahl · {String(projects.length).padStart(2, "0")}{" "}
                {projects.length === 1 ? "Arbeit" : "Arbeiten"}
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/12" />
            </div>

            {featured ? (
              <FeaturedProjectSplit
                project={featured}
                index={0}
                total={projects.length}
              />
            ) : null}

            {rest.length > 0 ? (
              <ul className="mt-16 grid grid-cols-1 gap-0 border-t border-white/[0.08] md:mt-24">
                {rest.map((p, i) => (
                  <CompactProjectRow key={p.slug} project={p} index={i + 2} />
                ))}
              </ul>
            ) : (
              // Premium "Nächste Ausgabe" plate — frames the single-
              // entry state as intentional curation, not scarcity.
              // When more projects arrive, this block is automatically
              // replaced by the compact list above.
              <div
                data-pj-reveal
                className="relative mt-20 overflow-hidden border border-white/[0.09] bg-[#07070A] md:mt-28"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.22]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, rgba(255,255,255,0.014) 0 1px, transparent 1px 118px)",
                    maskImage:
                      "radial-gradient(ellipse 72% 64% at 50% 50%, black, transparent)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 72% 64% at 50% 50%, black, transparent)",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 46% 40% at 50% 50%, rgba(255,255,255,0.042), transparent 62%)",
                  }}
                />

                {/* Top plate rail */}
                <div className="relative flex items-center justify-between gap-4 border-b border-white/[0.08] px-6 py-4 sm:px-8 md:px-12 md:py-5">
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/56 sm:text-[10.5px]">
                    Nächste Ausgabe
                  </span>
                  <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/38 sm:text-[10px]">
                    Vol. 02 · in Arbeit
                  </span>
                </div>

                <div className="relative flex flex-col gap-10 px-6 py-12 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-14 md:px-14 md:py-16 lg:px-20 lg:py-20">
                  <div className="max-w-[40rem]">
                    <p className="font-instrument text-[1.35rem] italic leading-[1.3] tracking-[-0.014em] text-white/90 sm:text-[1.55rem] md:text-[1.78rem] lg:text-[1.92rem]">
                      Weitere Arbeiten folgen —{" "}
                      <em className="not-italic text-white/58">
                        mit Absicht kuratiert, nicht gesammelt.
                      </em>
                    </p>
                  </div>

                  <div className="flex items-center gap-5 md:flex-col md:items-end md:gap-3">
                    {/* Diamond marker — MAGICKS signature. */}
                    <div
                      aria-hidden
                      className="relative flex h-[18px] w-[18px] items-center justify-center"
                    >
                      <span className="absolute inset-0 block rotate-45 border border-white/64 bg-[#07070A]" />
                      <span className="absolute h-[6px] w-[6px] rotate-45 bg-white/84" />
                    </div>
                    <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/52 sm:text-[10.5px]">
                      Studio · Kassel · MMXXVI
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <SectionTransition from="§ 02  Auswahl" to="§ 03  Messbar" />

        {/* =========================================================
           § 03 — WORAN WIR PROJEKTE MESSEN
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-pj-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                    § 03 — Messbar
                  </p>
                  <ChapterMarker num="03" label="Maßstab" />
                </div>
              </div>

              <div>
                <h2
                  data-pj-reveal
                  className="font-instrument max-w-[52rem] text-[2rem] leading-[1.05] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]"
                >
                  {MESSBAR_HEADLINE}
                </h2>

                <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-2 md:gap-16">
                  <div className="max-w-[32rem] space-y-5">
                    <p
                      data-pj-reveal
                      className="font-instrument text-[1.22rem] italic leading-[1.4] tracking-[-0.012em] text-white/88 sm:text-[1.32rem] md:text-[1.44rem]"
                    >
                      {MESSBAR_P1_A}
                    </p>
                    <p
                      data-pj-reveal
                      className="font-ui text-[15.5px] leading-[1.72] text-white/66 md:text-[16.5px]"
                    >
                      {MESSBAR_P1_B}
                    </p>
                  </div>
                  <div className="max-w-[34rem]">
                    <p
                      data-pj-reveal
                      className="font-ui text-[15.5px] leading-[1.72] text-white/66 md:text-[16.5px]"
                    >
                      {MESSBAR_P2}
                    </p>
                  </div>
                </div>

                {/* Dimensions register — 5 editorial cells with
                    italic serif label + monospace micro-gloss.
                    Reads as a printed register, not a tag strip. */}
                <div
                  data-pj-reveal
                  className="mt-14 border-y border-white/[0.08] md:mt-16"
                >
                  {/* Register rail */}
                  <div className="flex items-center justify-between gap-4 py-3 md:py-4">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/42 sm:text-[10px]">
                      Dimensionen · Studio-Register
                    </span>
                    <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[10px]">
                      {String(MESSBAR_ITEMS.length).padStart(2, "0")} Positionen
                    </span>
                  </div>

                  <ul className="grid grid-cols-2 gap-0 border-t border-white/[0.08] md:grid-cols-5">
                    {MESSBAR_ITEMS.map((item, i) => (
                      <li
                        key={item.num}
                        className={`flex flex-col gap-4 px-4 py-7 md:px-6 md:py-9 lg:px-8 ${
                          i < MESSBAR_ITEMS.length - 2
                            ? "border-b border-white/[0.06] md:border-b-0"
                            : i === MESSBAR_ITEMS.length - 2
                            ? "border-b border-white/[0.06] md:border-b-0 md:border-r md:border-white/[0.08]"
                            : ""
                        } ${
                          i % 2 === 0
                            ? "border-r border-white/[0.06] md:border-r md:border-white/[0.08]"
                            : "md:border-r md:border-white/[0.08]"
                        } ${
                          i === MESSBAR_ITEMS.length - 1 ? "md:border-r-0" : ""
                        }`}
                      >
                        <span className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.38em] text-white/46 md:text-[10.5px]">
                          {item.num}
                        </span>
                        <span className="font-instrument text-[1.14rem] italic leading-[1.14] tracking-[-0.014em] text-white md:text-[1.28rem] lg:text-[1.36rem]">
                          {item.label}
                        </span>
                        <span aria-hidden className="h-px w-8 bg-white/18" />
                        <span className="font-mono text-[9.5px] font-medium uppercase leading-[1.5] tracking-[0.22em] text-white/44 md:text-[10px]">
                          {item.note}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                "radial-gradient(circle at center, rgba(255,255,255,0.042) 0%, rgba(255,255,255,0.014) 32%, transparent 62%)",
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
                data-pj-reveal
                className="font-mono mb-6 text-[9.5px] font-medium uppercase leading-none tracking-[0.46em] text-white/42 sm:mb-8 sm:text-[10px]"
              >
                Studio · Projekt · MMXXVI
              </p>

              <div
                data-pj-reveal
                className="mb-12 inline-flex sm:mb-16"
              >
                <ChapterMarker num="END" label="Projekt" align="center" variant="end" />
              </div>

              <h2
                data-pj-reveal
                className="font-instrument text-[2.2rem] leading-[1.02] tracking-[-0.036em] text-white sm:text-[3rem] md:text-[3.95rem] lg:text-[4.75rem] xl:text-[5.3rem]"
              >
                {FINAL_CTA_HEADLINE}
              </h2>

              <p
                data-pj-reveal
                className="font-ui mx-auto mt-12 max-w-[46rem] text-[15.5px] leading-[1.72] text-white/66 md:mt-14 md:text-[17px]"
              >
                {FINAL_CTA_BODY}
              </p>

              <div
                data-pj-reveal
                className="mt-14 flex justify-center sm:mt-16 md:mt-20"
              >
                <Link
                  to="/kontakt"
                  className="group relative inline-flex items-center gap-3 rounded-full border border-white/22 bg-white py-4 pl-8 pr-3 text-[15px] font-medium tracking-wide text-[#0A0A0A] no-underline shadow-[0_34px_80px_-32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.45)] magicks-duration-hover magicks-ease-out transition-[transform,box-shadow] hover:-translate-y-[2px] hover:shadow-[0_44px_90px_-28px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.55)] active:translate-y-0 active:scale-[0.985] md:text-[16px]"
                >
                  <span>Lass uns über dein Projekt sprechen</span>
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
            </div>

            {/* Closing ledger */}
            <div
              data-pj-reveal
              className="mt-24 border-t border-white/[0.06] pt-7 sm:mt-28"
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-0">
                {[
                  { k: "§ End", v: "Studio · Arbeit" },
                  { k: "Studio", v: "Kassel · Nordhessen" },
                  { k: "Maßstab", v: "Struktur · Wirkung" },
                  { k: "Edition", v: "Magicks · MMXXVI" },
                ].map((item, i) => (
                  <div
                    key={item.k}
                    className={`flex flex-col gap-2 ${
                      i > 0 ? "sm:border-l sm:border-white/[0.08] sm:pl-5 md:pl-7" : ""
                    }`}
                  >
                    <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/36 sm:text-[9.5px]">
                      {item.k}
                    </span>
                    <span className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.28em] text-white/68 sm:text-[10.5px]">
                      {item.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/* ------------------------------------------------------------------
 * FeaturedProjectSplit — the large editorial split composition used
 * for the first project on the overview page.
 * ------------------------------------------------------------------ */

function FeaturedProjectSplit({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const folio = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  return (
    <article
      data-pj-reveal
      className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.22fr)_minmax(0,1fr)] md:gap-14 lg:gap-20"
    >
      <Link
        to={`/projekte/${project.slug}`}
        className="group relative block overflow-hidden rounded-[2px] no-underline"
        aria-label={`${project.title} – Fallstudie lesen`}
      >
        <CoverPlate cover={project.cover} title={project.title} folio={folio} />
      </Link>

      <div className="flex flex-col justify-between gap-12 md:py-1">
        <div>
          {/* Plate header — dossier frame with live tell pinned right. */}
          <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.1] pb-5">
            <span className="font-mono tabular-nums text-[10.5px] font-medium uppercase leading-none tracking-[0.4em] text-white/64 sm:text-[11px]">
              Plate · {folio} &nbsp;/&nbsp; {totalLabel}
            </span>
            {project.publicUrl ? (
              <a
                href={project.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/live font-mono inline-flex items-center gap-2 text-[10px] font-medium uppercase leading-none tracking-[0.32em] text-white/56 no-underline transition-colors duration-[420ms] hover:text-white/88 sm:text-[10.5px]"
                aria-label={`${project.title} live öffnen`}
              >
                <span
                  aria-hidden
                  className="h-[5px] w-[5px] rounded-full bg-white/78 tick-breathing"
                />
                <span>Live</span>
                <span aria-hidden className="text-white/70">↗</span>
              </a>
            ) : (
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/44 sm:text-[10.5px]">
                {project.category}
              </span>
            )}
          </div>

          {/* Category · Industry · Year — single editorial register line. */}
          <p className="font-mono mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/52 sm:text-[10.5px]">
            <span className="text-white/72">{project.category}</span>
            {project.industry ? (
              <>
                <span aria-hidden className="text-white/28">·</span>
                <span>{project.industry}</span>
              </>
            ) : null}
            {project.year ? (
              <>
                <span aria-hidden className="text-white/28">·</span>
                <span className="tabular-nums text-white/44">{project.year}</span>
              </>
            ) : null}
          </p>

          {/* H3 — scaled up for cinematic presence. */}
          <h3 className="font-instrument mt-5 text-[2.1rem] leading-[1.02] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.05rem] lg:text-[3.55rem] xl:text-[3.85rem]">
            {project.title}
          </h3>

          <p className="font-instrument mt-8 max-w-[38rem] text-[1.18rem] italic leading-[1.4] tracking-[-0.01em] text-white/88 md:mt-10 md:text-[1.32rem]">
            {project.intro}
          </p>

          {/* Umfang — editorial register line, not chips.
              Reads as a delivered-scope ledger. */}
          {project.services && project.services.length > 0 ? (
            <div className="mt-10 border-t border-white/[0.06] pt-5 md:mt-12">
              <p className="font-mono mb-3 text-[9.5px] font-medium uppercase leading-none tracking-[0.4em] text-white/42 sm:text-[10px]">
                Umfang
              </p>
              <p className="font-instrument text-[1.02rem] italic leading-[1.5] tracking-[-0.008em] text-white/80 md:text-[1.12rem]">
                {project.services.map((s, i) => (
                  <span key={s}>
                    {i > 0 ? (
                      <span
                        aria-hidden
                        className="mx-[0.75em] not-italic text-white/26"
                      >
                        ·
                      </span>
                    ) : null}
                    {s}
                  </span>
                ))}
              </p>
            </div>
          ) : null}
        </div>

        {/* Primary CTA bar — confident Fallstudie link, plate folio right. */}
        <div className="flex items-center gap-4 border-t border-white/[0.08] pt-7">
          <Link
            to={`/projekte/${project.slug}`}
            className="group relative inline-flex items-baseline gap-3 text-[15px] font-medium tracking-[-0.005em] text-white no-underline sm:text-[16px] md:text-[17px]"
            aria-label={`Fallstudie: ${project.title}`}
          >
            <span className="relative pb-2">
              <span className="font-ui">Fallstudie lesen</span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 block h-px bg-white/42"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-white transition-transform duration-[820ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </span>
            <span
              aria-hidden
              className="font-instrument text-[1.05em] italic text-white/84 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[3px] group-hover:translate-x-[3px]"
            >
              ↗
            </span>
          </Link>
          <span aria-hidden className="h-px flex-1 bg-white/[0.06]" />
          <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/36 sm:text-[10px]">
            F · {folio}
          </span>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------
 * CompactProjectRow — horizontal editorial row for projects beyond
 * the featured slot. Kept thin so the overview scales to many
 * entries without becoming a card wall.
 * ------------------------------------------------------------------ */

function CompactProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <li data-pj-reveal className="border-b border-white/[0.08]">
      <Link
        to={`/projekte/${project.slug}`}
        className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 py-8 no-underline md:grid-cols-[auto_minmax(0,1.5fr)_minmax(0,2fr)_auto] md:gap-10 md:py-10"
      >
        <span className="font-mono tabular-nums hidden text-[10.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/42 md:inline">
          {String(index).padStart(2, "0")}
        </span>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/44 md:text-[10.5px]">
            {project.category}
            {project.industry ? <> &nbsp;·&nbsp; {project.industry}</> : null}
          </span>
          <h3 className="font-instrument text-[1.35rem] leading-[1.1] tracking-[-0.02em] text-white md:text-[1.58rem] lg:text-[1.75rem]">
            {project.title}
          </h3>
        </div>
        <p className="font-ui hidden max-w-[34rem] text-[14.5px] leading-[1.65] text-white/62 md:block">
          {project.teaser}
        </p>
        <span
          aria-hidden
          className="font-instrument text-[1.25rem] italic text-white/72 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[3px] group-hover:translate-x-[3px] md:text-[1.45rem]"
        >
          ↗
        </span>
      </Link>
    </li>
  );
}

/* ------------------------------------------------------------------
 * CoverPlate — shared cover composition for the featured split.
 *
 * If a cover image is present it is displayed with a restrained
 * gradient vignette. If not, a premium empty-state plate renders —
 * hairline framed, textured, and labelled so the overview slot never
 * looks like a broken image card. Swapping in a real image later is
 * a pure data change.
 * ------------------------------------------------------------------ */

function CoverPlate({
  cover,
  title,
  folio,
}: {
  cover?: Project["cover"];
  title: string;
  folio: string;
}) {
  if (cover) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/[0.08] bg-[#08080A] md:aspect-[5/4]">
        <img
          src={cover.src}
          alt={cover.alt}
          className="h-full w-full object-cover brightness-[0.82] saturate-[0.9] magicks-duration-media magicks-ease-out transition-[transform,filter] group-hover:scale-[1.015] group-hover:brightness-[0.9]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/55 via-transparent to-transparent" />
        <CoverCaption folio={folio} label={title} />
      </div>
    );
  }

  // Premium empty-state plate — no broken images, no cheesy icons.
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden border border-white/[0.08] bg-[#08080A] md:aspect-[5/4]"
      role="img"
      aria-label={`${title} — Bildmaterial folgt`}
    >
      {/* Grain rail */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.24]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.014) 0 1px, transparent 1px 96px), repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0 1px, transparent 1px 96px)",
          maskImage:
            "radial-gradient(ellipse 70% 62% at 50% 50%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 62% at 50% 50%, black, transparent)",
        }}
      />
      {/* Center halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 42% 36% at 50% 46%, rgba(255,255,255,0.06), transparent 62%)",
        }}
      />
      {/* Hairline inset frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-6 border border-white/[0.07] md:inset-9"
      />
      {/* Center diamond marker */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 flex h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      >
        <span className="absolute inset-0 block rotate-45 border border-white/60 bg-[#08080A]" />
        <span className="absolute h-[6px] w-[6px] rotate-45 bg-white/82" />
      </div>
      <CoverCaption folio={folio} label={title} empty />
    </div>
  );
}

function CoverCaption({
  folio,
  label,
  empty = false,
}: {
  folio: string;
  label: string;
  empty?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-end justify-between gap-5 md:inset-x-9 md:bottom-9">
      <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/46 md:text-[10px]">
        Projekt · {folio}
      </span>
      <span
        className={`font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] md:text-[10px] ${
          empty ? "text-white/34" : "text-white/54"
        }`}
      >
        {empty ? `${label} · Bildmaterial folgt` : label}
      </span>
    </div>
  );
}
