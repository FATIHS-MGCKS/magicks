import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ChapterMarker } from "../../components/home/ChapterMarker";
import { ContextualCrossLink } from "../../components/service/ContextualCrossLink";
import { EditorialAnchor } from "../../components/service/EditorialAnchor";
import { SectionTransition } from "../../components/service/SectionTransition";
import { RouteSEO } from "../../seo/RouteSEO";

/* ------------------------------------------------------------------
 * /web-software — bespoke editorial landing page.
 *
 * Emphasis: system architecture, structure, calm confidence.
 * Visual language: more architectural than sales-oriented. The hero motif
 * is a 4-module "system schema" — hairline nodes connected with thin
 * dotted connectors. More restraint, more structural rhythm.
 *
 * Sections:
 *   · Hero                — chapter folio, serif H1, CTA, meta triad, SystemSchema, vertical credit
 *   · Statement 01        — "Wenn Standard-Tools nicht mehr reichen"
 *   · Audience            — "Für Unternehmen mit echten digitalen Prozessen"
 *   · Includes            — 6-item taxonomy (labeled kind/role per cell)
 *   · Approach            — "Wie wir an Web-Software rangehen"
 *   · Negation            — "Was du nicht bekommst"
 *   · Ceremonial Pull     — "Web-Software mit Klarheit..."
 *   · Cross-links         — /ki-automationen-integrationen AND /shops-produktkonfiguratoren
 *   · Final CTA           — serif headline + session ledger + white pill
 * ------------------------------------------------------------------ */

const INCLUDES: { mod: string; kind: string; title: string; body: string }[] = [
  {
    mod: "MOD-01",
    kind: "Interface",
    title: "Portale & Plattformen",
    body:
      "Individuelle Web-Lösungen für Kunden, Mitarbeiter, Partner oder interne Abläufe.",
  },
  {
    mod: "MOD-02",
    kind: "Daten",
    title: "Dashboards & Übersichten",
    body:
      "Strukturiert aufgebaute Interfaces für Daten, Status, KPIs oder operative Prozesse.",
  },
  {
    mod: "MOD-03",
    kind: "Werkzeug",
    title: "Interne Tools",
    body:
      "Anwendungen, die Teams entlasten, Abläufe vereinfachen und manuelle Schritte reduzieren.",
  },
  {
    mod: "MOD-04",
    kind: "System",
    title: "Prozesslogik & Struktur",
    body:
      "Wir denken nicht nur in Screens, sondern in Rollen, Abläufen, Zuständen und sinnvollen Systemen.",
  },
  {
    mod: "MOD-05",
    kind: "Verbindung",
    title: "Integrationen",
    body:
      "Anbindungen an bestehende Tools, APIs, Datenquellen oder andere digitale Systeme.",
  },
  {
    mod: "MOD-06",
    kind: "Basis",
    title: "Skalierbare Umsetzung",
    body:
      "Technisch sauber aufgebaut, damit die Lösung nicht nur heute funktioniert, sondern mitwachsen kann.",
  },
];

/**
 * Each audience case maps to an architectural "zone" — the part of the
 * system where that scenario lives. Turns an ordinary list into a
 * routing table that reinforces the page's system vocabulary.
 */
const AUDIENCE: { text: string; zone: string }[] = [
  { text: "interne Abläufe digitalisieren willst", zone: "Prozess" },
  { text: "ein Portal für Kunden, Teams oder Partner brauchst", zone: "Interface" },
  { text: "Daten, Status oder Prozesse in Dashboards sichtbar machen willst", zone: "Daten" },
  { text: "mehrere Systeme sinnvoll verbinden musst", zone: "Verbindung" },
  { text: "eine individuelle Anwendung brauchst, die genau zu deinem Workflow passt", zone: "Rolle" },
];

/* ------------------------------------------------------------------
 * SystemSchema — four modular nodes connected by hairline lines.
 * The visual signal of this page: a blueprint, not a product catalog.
 *
 * Each module carries a tree-numbered sub-index (01.01, 02.01 …) —
 * reading as a real system document with nested addressing. The
 * connectors step directionally left-to-right with a mid-arrow glyph
 * suggesting information flow rather than decoration.
 *
 * Modules: Rolle · Daten · Prozess · Interface.
 * ------------------------------------------------------------------ */
function SystemSchema() {
  const modules: { label: string; kind: string; sub: string }[] = [
    { label: "Rolle", kind: "01", sub: "01.01" },
    { label: "Daten", kind: "02", sub: "02.01" },
    { label: "Prozess", kind: "03", sub: "03.01" },
    { label: "Interface", kind: "04", sub: "04.01" },
  ];

  return (
    <div aria-hidden className="w-full max-w-[44rem]">
      <div className="flex items-stretch gap-2 sm:gap-3">
        {modules.map((m, i) => (
          <div key={m.label} className="flex flex-1 items-stretch">
            <div
              data-ws-module
              className="relative flex flex-1 flex-col justify-between gap-4 border border-white/[0.14] bg-[#0A0A0A] px-3 py-3 sm:px-4 sm:py-4"
            >
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[9.5px]">
                  § {m.kind}
                </span>
                <span className="font-instrument text-[0.98rem] leading-none tracking-[-0.01em] text-white/92 sm:text-[1.1rem] md:text-[1.18rem]">
                  {m.label}
                </span>
              </div>

              {/* Sub-index — reads like a nested address in a system document */}
              <span className="font-mono tabular-nums text-[8.5px] font-medium uppercase leading-none tracking-[0.3em] text-white/30 sm:text-[9px]">
                {m.sub}
              </span>

              {/* Node corner hints */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 h-1 w-1 border-l border-t border-white/30"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-0 right-0 h-1 w-1 border-b border-r border-white/30"
              />
            </div>

            {/*
             * Connector — hairline with a directional chevron at midpoint.
             * Chevron is svg so it can animate consistently and stays crisp.
             */}
            {i < modules.length - 1 ? (
              <div
                data-ws-connector
                aria-hidden
                className="relative flex h-auto flex-shrink-0 items-center self-center"
                style={{ width: "clamp(20px, 3.6vw, 44px)" }}
              >
                <span className="block h-px w-full bg-white/22" />
                <span className="absolute right-0 top-1/2 flex h-3 w-3 -translate-y-1/2 items-center justify-center">
                  <svg
                    viewBox="0 0 10 10"
                    width="10"
                    height="10"
                    fill="none"
                    stroke="currentColor"
                    className="text-white/46"
                    strokeWidth="1.2"
                  >
                    <path d="M3 2 L7 5 L3 8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="font-mono mt-3 flex items-start justify-between text-[9px] font-medium uppercase leading-none tracking-[0.28em] text-white/30 sm:text-[9.5px]">
        <span>Eingang</span>
        <span className="text-white/44">Systemarchitektur · 4 Module</span>
        <span>Ausgabe</span>
      </div>
    </div>
  );
}

export default function WebSoftwarePage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      // ——— Hero ———
      const heroChapter = root.querySelector<HTMLElement>("[data-ws-chapter]");
      const heroLineA = gsap.utils.toArray<HTMLElement>("[data-ws-h1a]");
      const heroLineB = gsap.utils.toArray<HTMLElement>("[data-ws-h1b]");
      const heroH1 = root.querySelector<HTMLElement>("[data-ws-h1]");
      const heroLead = root.querySelector<HTMLElement>("[data-ws-lead]");
      const heroCta = root.querySelector<HTMLElement>("[data-ws-cta]");
      const heroCtaRule = root.querySelector<HTMLElement>("[data-ws-cta-rule]");
      const heroMeta = gsap.utils.toArray<HTMLElement>("[data-ws-meta]");
      const heroModules = gsap.utils.toArray<HTMLElement>("[data-ws-module]");
      const heroConnectors = gsap.utils.toArray<HTMLElement>("[data-ws-connector]");
      const heroSchema = root.querySelector<HTMLElement>("[data-ws-schema]");
      const heroCredit = root.querySelector<HTMLElement>("[data-ws-credit]");
      const heroSection = root.querySelector<HTMLElement>("[data-ws-hero]");
      const heroCopy = root.querySelector<HTMLElement>("[data-ws-herocopy]");

      // ——— Scroll reveals ———
      const reveals = gsap.utils.toArray<HTMLElement>("[data-ws-reveal]");
      const pullLines = gsap.utils.toArray<HTMLElement>("[data-ws-pull]");
      const pullHeading = root.querySelector<HTMLElement>("[data-ws-pullheading]");
      const finalLineA = gsap.utils.toArray<HTMLElement>("[data-ws-finala]");
      const finalLineB = gsap.utils.toArray<HTMLElement>("[data-ws-finalb]");
      const finalRule = root.querySelector<HTMLElement>("[data-ws-finalrule]");
      const finalLedger = gsap.utils.toArray<HTMLElement>("[data-ws-finalledger]");
      const finalCta = root.querySelector<HTMLElement>("[data-ws-finalcta]");

      if (reduced) {
        gsap.set(
          [
            heroChapter,
            ...heroLineA,
            ...heroLineB,
            heroLead,
            heroCta,
            heroCtaRule,
            ...heroMeta,
            ...heroModules,
            ...heroConnectors,
            heroSchema,
            heroCredit,
            ...reveals,
            ...pullLines,
            pullHeading,
            ...finalLineA,
            ...finalLineB,
            finalRule,
            ...finalLedger,
            finalCta,
          ],
          { opacity: 1, y: 0, yPercent: 0, scaleX: 1, letterSpacing: "normal" },
        );
        return;
      }

      // ——— Hero choreography ———
      gsap.set(heroChapter, { opacity: 0, y: 12 });
      gsap.set([...heroLineA, ...heroLineB], { yPercent: 118, opacity: 0 });
      if (heroH1) gsap.set(heroH1, { letterSpacing: "0.008em" });
      gsap.set(heroLead, { opacity: 0, y: 16 });
      gsap.set(heroCta, { opacity: 0, y: 14 });
      gsap.set(heroCtaRule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(heroMeta, { opacity: 0, y: 8 });
      gsap.set(heroSchema, { opacity: 0 });
      gsap.set(heroModules, { opacity: 0, y: 10 });
      gsap.set(heroConnectors, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(heroCredit, { opacity: 0, y: 8 });

      gsap
        .timeline({ delay: 0.15, defaults: { ease: "power3.out" } })
        .to(heroChapter, { opacity: 1, y: 0, duration: 0.9 }, 0)
        .to(
          heroLineA,
          { yPercent: 0, opacity: 1, duration: 1.25, stagger: 0.08, ease: "power4.out" },
          0.3,
        )
        .to(
          heroLineB,
          { yPercent: 0, opacity: 1, duration: 1.35, stagger: 0.08, ease: "power4.out" },
          0.62,
        )
        .to(
          heroH1,
          { letterSpacing: "-0.038em", duration: 1.65, ease: "power2.out" },
          0.45,
        )
        .to(heroLead, { opacity: 1, y: 0, duration: 1.0 }, 1.05)
        .to(heroCta, { opacity: 1, y: 0, duration: 0.95 }, 1.4)
        .to(heroCtaRule, { scaleX: 1, duration: 1.15, ease: "power2.inOut" }, 1.5)
        .to(heroMeta, { opacity: 1, y: 0, duration: 0.85, stagger: 0.09 }, 1.65)
        .to(heroSchema, { opacity: 1, duration: 1.15 }, 1.78)
        // Modules + connectors arrive left-to-right in an architectural sweep
        // (slower, more deliberate — mature restraint)
        .to(
          heroModules,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.17,
            ease: "power3.out",
          },
          1.85,
        )
        .to(
          heroConnectors,
          {
            scaleX: 1,
            duration: 0.75,
            stagger: 0.17,
            ease: "power2.inOut",
          },
          2.02,
        )
        .to(heroCredit, { opacity: 1, y: 0, duration: 1.0 }, 2.45);

      // ——— Hero camera push — very subtle scroll-linked drift ———
      if (heroCopy && heroSection) {
        gsap.to(heroCopy, {
          yPercent: -7,
          opacity: 0.42,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      if (heroCredit && heroSection) {
        gsap.to(heroCredit, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroSection,
            start: "center top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // ——— Generic scroll reveals ———
      reveals.forEach((el) => {
        gsap.set(el, { opacity: 0, y: 22 });
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        });
      });

      // ——— Ceremonial pull statement ———
      if (pullLines.length) {
        gsap.set(pullLines, { yPercent: 110, opacity: 0 });
        if (pullHeading) gsap.set(pullHeading, { letterSpacing: "0.008em" });
        const tl = gsap
          .timeline({
            scrollTrigger: { trigger: pullLines[0], start: "top 78%", once: true },
          })
          .to(pullLines, {
            yPercent: 0,
            opacity: 1,
            duration: 1.5,
            ease: "power4.out",
            // slower than Shops — mature, architectural restraint
            stagger: 0.17,
          });
        if (pullHeading) {
          tl.to(
            pullHeading,
            { letterSpacing: "-0.038em", duration: 1.8, ease: "power2.out" },
            0.2,
          );
        }
      }

      // ——— Final CTA choreography ———
      if (finalLineA.length || finalLineB.length) {
        gsap.set([...finalLineA, ...finalLineB], { yPercent: 118, opacity: 0 });
        gsap.set(finalRule, { scaleX: 0, transformOrigin: "center" });
        gsap.set(finalLedger, { opacity: 0, y: 14 });
        gsap.set(finalCta, { opacity: 0, y: 18, scale: 0.96 });
        const trigger =
          (finalLineA[0] as HTMLElement | undefined)?.closest("section") ?? finalLineA[0];
        gsap
          .timeline({
            scrollTrigger: { trigger, start: "top 72%", once: true },
            defaults: { ease: "power4.out" },
          })
          .to(finalLineA, { yPercent: 0, opacity: 1, duration: 1.15, stagger: 0.07 }, 0)
          .to(finalLineB, { yPercent: 0, opacity: 1, duration: 1.25, stagger: 0.07 }, 0.25)
          .to(finalRule, { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, 0.7)
          .to(finalCta, { opacity: 1, y: 0, scale: 1, duration: 0.95, ease: "back.out(1.2)" }, 0.95)
          .to(finalLedger, { opacity: 1, y: 0, duration: 0.95, stagger: 0.1 }, 1.1);
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/web-software" />

      <main
        ref={rootRef}
        className="relative bg-[#0A0A0A] pb-0 pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.5rem]"
      >
        {/* =========================================================
           HERO — architectural blueprint energy
        ========================================================= */}
        <section
          data-ws-hero
          className="relative overflow-hidden px-5 pb-28 sm:px-8 sm:pb-32 md:px-12 md:pb-44 lg:px-16 lg:pb-52"
        >
          {/* Subtle blueprint grid — distinguishing from Shops page's horizontal lines */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.36]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.011) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.011) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage:
                "radial-gradient(ellipse 58% 68% at 26% 56%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 58% 68% at 26% 56%, black, transparent)",
            }}
          />

          {/* Vertical editorial credit — left edge, fades on scroll */}
          <div
            data-ws-credit
            aria-hidden
            className="pointer-events-none absolute bottom-14 left-5 z-10 hidden md:block lg:bottom-16 lg:left-8"
          >
            <span className="hero-vertical-credit">
              MAGICKS &nbsp;·&nbsp; LEISTUNG 04 &nbsp;·&nbsp; WEB-SOFTWARE &nbsp;·&nbsp; BLUEPRINT MMXXVI
            </span>
          </div>

          <div className="relative layout-max">
            <div data-ws-herocopy>
              <div data-ws-chapter className="mb-10 sm:mb-14">
                <ChapterMarker num="04" label="Leistungen / Web-Software" />
              </div>

              {/* H1 */}
              <h1
                data-ws-h1
                className="font-instrument max-w-[58rem] text-[2.4rem] leading-[0.98] tracking-[-0.038em] text-white sm:text-[3.1rem] md:text-[4rem] lg:text-[4.7rem] xl:text-[5.3rem]"
              >
                <span className="block">
                  {["Web-Software,", "die", "Prozesse"].map((w, i) => (
                    <span
                      key={`a-${i}`}
                      className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-ws-h1a className="inline-block will-change-[transform,opacity]">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/64 sm:mt-2">
                  {["digital", "wirklich", "weiterbringt."].map((w, i) => (
                    <span
                      key={`b-${i}`}
                      className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-ws-h1b className="inline-block will-change-[transform,opacity]">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>

              {/* Intro */}
              <div data-ws-lead className="mt-10 max-w-[46rem] sm:mt-12 md:mt-14">
                <p className="font-instrument text-[1.3rem] italic leading-[1.35] tracking-[-0.01em] text-white/82 sm:text-[1.5rem] md:text-[1.65rem]">
                  Nicht jede digitale Lösung ist eine klassische Website.
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/58 md:text-[16px] md:leading-[1.72]">
                  Manche Projekte brauchen mehr: Portale, Dashboards, interne Tools oder
                  individuelle Anwendungen, die Prozesse abbilden, Teams entlasten und mit dem
                  Unternehmen mitwachsen.
                </p>
                <p className="font-ui mt-5 text-[15px] leading-[1.72] text-white/58 md:text-[16px] md:leading-[1.72]">
                  Genau dafür entwickeln wir Web-Software, die{" "}
                  <em className="italic text-white/86">
                    technisch sauber geplant, hochwertig umgesetzt
                  </em>{" "}
                  und im Alltag wirklich nutzbar ist.
                </p>
              </div>

              {/* CTA */}
              <div
                data-ws-cta
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
                      data-ws-cta-rule
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left bg-white/32"
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

              {/* Meta triad — mobile stacks as ledger column. */}
              <div className="mt-12 flex flex-col gap-2 sm:mt-18 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-3 md:mt-20">
                {["Struktur", "System", "Prozess"].map((m, i) => (
                  <span
                    key={m}
                    data-ws-meta
                    className="font-mono flex items-center gap-3 text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/52 sm:text-[10.5px]"
                  >
                    <span className="tabular-nums text-white/34">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {m}
                  </span>
                ))}
              </div>

              {/* System Schema — blueprint motif, draws in left-to-right */}
              <div
                data-ws-schema
                className="mt-16 flex flex-col gap-3 sm:mt-20 md:mt-24"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/38 sm:text-[10.5px]">
                    Systemarchitektur · Schema
                  </span>
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 sm:text-[10.5px]">
                    4 Module · 1 Fluss
                  </span>
                </div>
                <SystemSchema />
              </div>
            </div>
          </div>

          {/* Specimen readout — blueprint vocabulary */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-6 right-5 hidden items-center gap-4 md:right-12 md:flex lg:right-16 lg:bottom-10"
          >
            <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/34">
              Blueprint · Leistung 04
            </span>
            <span aria-hidden className="h-px w-10 bg-white/18" />
            <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.26em] text-white/34">
              ROLLE — DATEN — PROZESS — INTERFACE
            </span>
          </div>
        </section>

        {/* Transition → § 01 Grenze */}
        <SectionTransition from="§ Hero — Leistungen 04" to="§ 01  Grenze" />

        {/* =========================================================
           STATEMENT 01 — "Wenn Standard-Tools nicht mehr reichen"
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20 lg:gap-24">
              <div data-ws-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 01 — Grenze
                </p>
                <h2 className="font-instrument text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]">
                  Wenn Standard-Tools{" "}
                  <em className="italic text-white/58">nicht mehr reichen.</em>
                </h2>

                {/* Forward cross-ref */}
                <div data-ws-reveal className="mt-10 flex items-center gap-4 md:mt-14">
                  <span aria-hidden className="h-px w-10 bg-white/22 md:w-14" />
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    → Siehe § 04 Herangehen
                  </span>
                </div>
              </div>

              <div data-ws-reveal className="md:pt-3">
                <p className="font-ui text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Viele Prozesse lassen sich mit Standardsoftware nur bis zu einem gewissen Punkt
                  sauber abbilden. Irgendwann wird es{" "}
                  <em className="italic text-white/88">
                    unübersichtlich, ineffizient oder zu abhängig von Workarounds.
                  </em>
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Dann braucht es keine weitere Notlösung, sondern eine digitale Lösung, die zum
                  Unternehmen passt. Wir entwickeln Web-Software, die Abläufe sinnvoll
                  digitalisiert, Informationen strukturiert zugänglich macht und Teams spürbar
                  entlastet.
                </p>
              </div>
            </div>

            {/* First editorial anchor — a calm, architectural portal scene.
                Aligned left to read as "system-first" rather than "sales-
                front": pairs with the § 01 Grenze argument about structure
                over standard tools. */}
            <div className="mt-20 sm:mt-24 md:mt-28">
              <EditorialAnchor
                src="/media/services/web-software/hero-portal.webp"
                alt="Monitor auf einem dunklen Studiotisch zeigt ein internes Einsatzplanungs-Portal: links Seitennavigation mit Dashboard, Ressourcen, Einsätze, Berichte; Mittelteil eine Wochenplanung für Kalenderwoche 18 mit Teammitgliedern als Zeilen; rechts ein Detail-Panel zu einem ausgewählten Einsatz mit Status-Zeitleiste."
                folio="Mod. 01"
                context="Plattform"
                leftCaption="Einsatzplanung · Portal"
                rightCaption="Kalenderwoche 18"
                aspect="16/9"
                align="left"
                maxWidth="48rem"
                revealAttr="data-ws-reveal"
              />
            </div>
          </div>
        </section>

        {/* Transition → § 02 Zielbild */}
        <SectionTransition from="§ 01  Grenze" to="§ 02  Zielbild" />

        {/* =========================================================
           AUDIENCE — "Für Unternehmen mit echten digitalen Prozessen"
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-ws-reveal className="md:pt-2">
                <ChapterMarker num="02" label="Zielbild" />
              </div>

              <div>
                <h2
                  data-ws-reveal
                  className="font-instrument max-w-[48rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Für Unternehmen mit echten{" "}
                  <em className="italic text-white/58">digitalen Prozessen</em>.
                </h2>

                <p
                  data-ws-reveal
                  className="font-ui mt-8 max-w-xl text-[15px] leading-[1.7] text-white/56 md:mt-10 md:text-[15.5px]"
                >
                  Diese Leistung ist für Unternehmen, die mehr brauchen als Marketingseiten oder
                  einfache Frontends.
                </p>

                <p
                  data-ws-reveal
                  className="font-instrument mt-10 text-[1.18rem] italic leading-[1.4] tracking-[-0.01em] text-white/72 md:text-[1.32rem]"
                >
                  Zum Beispiel, wenn du:
                </p>

                {/*
                 * Routing table — each audience case is tagged with the
                 * architectural zone where it lives. Reads as a real
                 * system document: numbered case · scenario · zone.
                 */}
                <ul className="mt-10 space-y-0 border-t border-white/[0.07] md:mt-14">
                  {AUDIENCE.map((item, i) => (
                    <li
                      key={item.text}
                      data-ws-reveal
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 gap-y-2 border-b border-white/[0.07] py-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-9 md:py-8"
                    >
                      <span className="font-mono text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/44 md:text-[11.5px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-instrument text-[1.2rem] leading-[1.32] tracking-[-0.01em] text-white/90 md:text-[1.45rem] lg:text-[1.6rem]">
                        {item.text}
                      </p>
                      <span
                        aria-hidden
                        className="font-mono col-span-2 inline-flex items-center gap-2 text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/38 md:col-span-1 md:text-[10px]"
                      >
                        <span aria-hidden className="h-px w-6 bg-white/22 md:w-8" />
                        <span className="text-white/30">→</span>
                        <span>Zone</span>
                        <span className="text-white/60">· {item.zone}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → § 03 Umfang */}
        <SectionTransition from="§ 02  Zielbild" to="§ 03  Umfang" />

        {/* =========================================================
           INCLUDES — "Was wir für dich umsetzen" (kind-labeled taxonomy)
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-ws-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    § 03 — Umfang
                  </p>
                  <span
                    aria-hidden
                    className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]"
                  >
                    Register · 06 Module
                  </span>
                </div>
              </div>

              <div>
                <h2
                  data-ws-reveal
                  className="font-instrument max-w-[48rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Was wir für dich <em className="italic text-white/58">umsetzen</em>.
                </h2>

                {/*
                 * Module register — each row is a taxonomy entry
                 * addressed by module ID (MOD-NN) and zone-kind chip.
                 * Reads as a system inventory, not a product list.
                 */}
                <ol className="mt-14 grid gap-x-14 gap-y-0 border-t border-white/[0.06] md:mt-20 md:grid-cols-2">
                  {INCLUDES.map((item) => (
                    <li
                      key={item.title}
                      data-ws-reveal
                      className="relative grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 border-b border-white/[0.06] py-8 sm:gap-x-8 md:py-10"
                    >
                      <span className="font-mono pt-[0.4rem] text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/52 md:text-[11.5px]">
                        {item.mod}
                      </span>
                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/50 md:text-[10.5px]">
                            {item.kind}
                          </span>
                          <span aria-hidden className="h-px w-3 bg-white/18 md:w-5" />
                          <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/28 md:text-[9.5px]">
                            v01
                          </span>
                        </div>
                        <h3 className="font-instrument text-[1.3rem] leading-[1.18] tracking-[-0.016em] text-white md:text-[1.5rem] lg:text-[1.65rem]">
                          {item.title}
                        </h3>
                        <p className="font-ui mt-3 max-w-md text-[14px] leading-[1.65] text-white/54 md:text-[14.5px]">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                {/* Register footer — blueprint signature */}
                <div
                  data-ws-reveal
                  className="font-mono mt-6 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:mt-8"
                >
                  <span>Register · Module</span>
                  <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                  <span className="tabular-nums">Blueprint 04 · MMXXVI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → § 04 Herangehen */}
        <SectionTransition from="§ 03  Umfang" to="§ 04  Herangehen" />

        {/* =========================================================
           APPROACH — "Wie wir an Web-Software rangehen"
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-20 lg:gap-28">
              <div data-ws-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 04 — Herangehen
                </p>
                <h2 className="font-instrument text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]">
                  Wie wir an Web-Software{" "}
                  <em className="italic text-white/58">rangehen</em>.
                </h2>
              </div>

              <div data-ws-reveal className="md:pt-3">
                <p className="font-ui text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Wir starten nicht mit Oberfläche, sondern mit Struktur.
                </p>

                {/* Three architectural questions — hairline bordered left */}
                <div className="mt-10 flex flex-col gap-4 border-l border-white/[0.12] pl-6 md:mt-12 md:pl-8">
                  <p className="font-instrument text-[1.2rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 md:text-[1.4rem] lg:text-[1.55rem]">
                    Welche Rollen gibt es?
                  </p>
                  <p className="font-instrument text-[1.2rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 md:text-[1.4rem] lg:text-[1.55rem]">
                    Welche Abläufe sind wirklich relevant?
                  </p>
                  <p className="font-instrument text-[1.2rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 md:text-[1.4rem] lg:text-[1.55rem]">
                    Welche Informationen müssen sichtbar, bearbeitbar oder automatisiert sein?
                  </p>
                </div>

                <p className="font-ui mt-10 text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Auf dieser Basis entwickeln wir eine Lösung, die{" "}
                  <em className="italic text-white/88">
                    klar aufgebaut, verständlich bedienbar und technisch belastbar
                  </em>{" "}
                  ist.
                </p>
                <p className="font-ui mt-5 text-[15px] leading-[1.72] text-white/60 md:text-[16px] md:leading-[1.72]">
                  So entsteht Web-Software, die nicht unnötig kompliziert wirkt, aber intern genau
                  die Tiefe hat, die sie braucht.
                </p>
              </div>
            </div>

            {/* Second editorial anchor — an interface-plate crop showing
                real operational structure (status workflow, filter chips,
                assignment rows). A view into the "internal depth" the
                paragraph above refers to — not a marketing shot. */}
            <div className="mt-20 sm:mt-24 md:mt-28">
              <EditorialAnchor
                src="/media/services/web-software/detail-workflow.webp"
                alt="Enger UI-Ausschnitt einer Web-Software: links ein Status-Workflow mit vier Schritten von ‚Eingereicht‘ bis ‚Archiviert‘, Mitte eine Filterleiste mit Chips ‚Alle‘, ‚Meine‘, ‚Überfällig‘, ‚Heute fällig‘ mit Zählern, rechts eine Datentabelle mit vier Zeilen mit Aufträgen, Zuständigen und Status-Chips."
                folio="Mod. 02"
                context="Ablauf-Logik"
                leftCaption="Status · Filter · Tabelle"
                rightCaption="Freigabe-Workflow"
                aspect="16/9"
                align="right"
                maxWidth="48rem"
                revealAttr="data-ws-reveal"
              />
            </div>
          </div>
        </section>

        {/* Transition → § 05 Absage */}
        <SectionTransition from="§ 04  Herangehen" to="§ 05  Absage" />

        {/* =========================================================
           NEGATION — "Was du nicht bekommst"
        ========================================================= */}
        <section className="relative overflow-hidden px-5 py-32 sm:px-8 sm:py-40 md:px-12 md:py-52 lg:px-16 lg:py-56">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.55]"
            style={{
              background:
                "radial-gradient(ellipse 55% 42% at 50% 50%, rgba(255,255,255,0.032), transparent 62%)",
            }}
          />

          <div className="relative layout-max">
            <div className="grid gap-16 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-ws-reveal className="md:pt-2">
                <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 05 — Absage
                </p>
              </div>

              <div>
                <h2
                  data-ws-reveal
                  className="font-instrument max-w-[48rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Was du von uns{" "}
                  <em className="italic text-white/58">nicht bekommst</em>.
                </h2>

                {/* Three anti-lines — calm, slightly smaller than shops page */}
                <ul className="mt-14 space-y-8 md:mt-20 md:space-y-10">
                  {[
                    "Kein überladenes Tool ohne klare Logik.",
                    "Keine Oberfläche, die hübsch aussieht, aber Prozesse nicht sauber trägt.",
                    "Keine halbfertige Sonderlösung, die später nur Probleme macht.",
                  ].map((line) => (
                    <li
                      key={line}
                      data-ws-reveal
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 md:gap-x-9"
                    >
                      <span
                        aria-hidden
                        className="font-instrument text-[1.55rem] italic leading-none text-white/38 md:text-[1.95rem] lg:text-[2.15rem]"
                      >
                        —
                      </span>
                      <p className="font-instrument text-[1.35rem] leading-[1.3] tracking-[-0.014em] text-white/80 md:text-[1.8rem] lg:text-[2.1rem] xl:text-[2.25rem]">
                        {line}
                      </p>
                    </li>
                  ))}
                </ul>

                <p
                  data-ws-reveal
                  className="font-ui mt-16 max-w-[42rem] text-[15.5px] leading-[1.72] text-white/62 md:mt-20 md:text-[16.5px]"
                >
                  Was du bekommst, ist eine Web-Anwendung mit{" "}
                  <em className="italic text-white/92">
                    Struktur, Anspruch und echter Alltagstauglichkeit.
                  </em>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → Positionierung (darker) */}
        <SectionTransition from="§ 05  Absage" to="§ Positionierung" tone="darker" />

        {/* =========================================================
           CEREMONIAL PULL-STATEMENT
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#070708] px-5 py-36 sm:px-8 sm:py-44 md:px-12 md:py-56 lg:px-16 lg:py-64">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.85]"
            style={{
              background:
                "radial-gradient(ellipse 62% 48% at 50% 50%, rgba(255,255,255,0.045), transparent 62%)",
            }}
          />
          {/* Architectural blueprint background — dots instead of horizontal lines, differentiates from shops */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage:
                "radial-gradient(ellipse 66% 56% at 50% 50%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 66% 56% at 50% 50%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[74rem]">
              <div className="mb-16 flex items-center gap-5 sm:mb-20">
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
                  § Positionierung
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/12" />
              </div>

              {/*
               * Pull-statement as a three-axis declaration — quiet A/B/C
               * coordinate labels sit in the left gutter, threading the
               * page's architectural vocabulary into the ceremonial moment.
               */}
              <div className="relative">
                {/* Coordinate column — desktop only */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-8 top-0 hidden h-full flex-col justify-between py-[0.4em] md:-left-10 md:flex lg:-left-14"
                >
                  {["A", "B", "C"].map((letter) => (
                    <span
                      key={letter}
                      className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 sm:text-[10px]"
                    >
                      {letter}
                    </span>
                  ))}
                </div>

                <h3
                  data-ws-pullheading
                  className="font-instrument text-[2.6rem] leading-[1.0] tracking-[-0.038em] text-white sm:text-[3.6rem] md:text-[4.7rem] lg:text-[5.4rem] xl:text-[6rem]"
                >
                  <span className="block overflow-hidden">
                    <span data-ws-pull className="inline-block">
                      Web-Software mit Klarheit.
                    </span>
                  </span>
                  <span className="block overflow-hidden">
                    <span data-ws-pull className="inline-block italic text-white/64">
                      Systeme mit Struktur.
                    </span>
                  </span>
                  <span className="block overflow-hidden">
                    <span data-ws-pull className="inline-block">
                      Digitale Lösungen, die mitwachsen.
                    </span>
                  </span>
                </h3>
              </div>

              <div className="mt-16 flex items-center gap-5 sm:mt-20">
                <span aria-hidden className="h-px flex-1 bg-white/12" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                  Edition · Positionierung 04
                </span>
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              </div>
            </div>
          </div>
        </section>

        {/*
         * ========================================================
         * CONTEXTUAL CROSS-LINKS — two stacked gates, tighter rhythm.
         *
         * First gate: "Fortlauf" (architectural continuation) toward
         * the natural next discipline. Second gate: "Seitenachse"
         * (lateral axis) toward the sister product-oriented discipline.
         * Reads as two chapters in one book rather than two unrelated
         * suggestions.
         * ========================================================
         */}
        <section className="relative px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16 lg:py-28">
          <div className="layout-max space-y-14 sm:space-y-16 md:space-y-20">
            <div data-ws-reveal>
              <ContextualCrossLink
                eyebrow="Fortlauf"
                folio="KI-Automationen & Integrationen"
                lead="Wenn Prozesse nicht nur digitalisiert, sondern auch intelligent automatisiert werden sollen, schau dir unsere KI-Automationen & Integrationen an."
                linkLabel="KI-Automationen ansehen"
                to="/ki-automationen-integrationen"
              />
            </div>

            <div data-ws-reveal>
              <ContextualCrossLink
                eyebrow="Seitenachse"
                folio="Shops & Konfiguratoren"
                lead="Wenn dein Projekt stärker auf Verkauf, Produktdarstellung oder Nutzerentscheidung einzahlt, wirf auch einen Blick auf Shops & Produktkonfiguratoren."
                linkLabel="Shops & Konfiguratoren ansehen"
                to="/shops-produktkonfiguratoren"
              />
            </div>
          </div>
        </section>

        {/* =========================================================
           FINAL CTA — architectural plan-view composition

           Corner crop marks + A/B/C/D labels sit just inside the page
           bounds, reading as a blueprint plate title. Together with the
           dotted grid they shift the final moment toward planning, not
           advertising — distinct from the Shops page's catalog strip.
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#070708] px-5 pb-32 pt-32 sm:px-8 sm:pb-40 sm:pt-40 md:px-12 md:pb-48 md:pt-48 lg:px-16 lg:pt-56">
          <div aria-hidden className="section-top-rule" />

          {/* Corner crop marks — blueprint plate signage */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-5 hidden md:inset-8 md:block lg:inset-10"
          >
            {/* NW */}
            <span className="absolute left-0 top-0 block h-3 w-3 border-l border-t border-white/28" />
            <span className="font-mono absolute left-5 top-1 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              A · NW
            </span>
            {/* NE */}
            <span className="absolute right-0 top-0 block h-3 w-3 border-r border-t border-white/28" />
            <span className="font-mono absolute right-5 top-1 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              B · NE
            </span>
            {/* SW */}
            <span className="absolute bottom-0 left-0 block h-3 w-3 border-b border-l border-white/28" />
            <span className="font-mono absolute bottom-1 left-5 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              C · SW
            </span>
            {/* SE */}
            <span className="absolute bottom-0 right-0 block h-3 w-3 border-b border-r border-white/28" />
            <span className="font-mono absolute bottom-1 right-5 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              D · SE
            </span>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[46%] aspect-square w-[118vw] max-w-[1180px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.048) 0%, rgba(255,255,255,0.016) 32%, transparent 62%)",
            }}
          />
          {/* Blueprint dotted grid — reinforces architectural tone */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(ellipse 72% 62% at 50% 46%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[66rem] text-center">
              <div className="mb-14 inline-flex sm:mb-20">
                <ChapterMarker num="END" label="Projekt" align="center" variant="end" />
              </div>

              <h2 className="font-instrument text-[2.5rem] leading-[0.97] tracking-[-0.038em] text-white sm:text-[3.4rem] md:text-[4.7rem] lg:text-[5.8rem] xl:text-[6.6rem]">
                <span className="block">
                  {["Bereit", "für", "eine", "Web-Lösung,"].map((w, i) => (
                    <span
                      key={`fa-${i}`}
                      className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-ws-finala className="inline-block">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/76 sm:mt-2">
                  {["die", "mehr", "kann", "als", "nur", "Oberfläche?"].map((w, i) => (
                    <span
                      key={`fb-${i}`}
                      className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-ws-finalb className="inline-block">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              </h2>

              {/* Editorial rule — draws in from center */}
              <div className="mx-auto mt-12 flex w-full max-w-[42rem] items-center gap-4 sm:mt-16">
                <span aria-hidden className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40">
                  ·
                </span>
                <div aria-hidden className="relative h-px flex-1">
                  <span
                    data-ws-finalrule
                    className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  />
                </div>
                <span aria-hidden className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40">
                  ·
                </span>
              </div>

              <p className="font-ui mx-auto mt-10 max-w-[40rem] text-[15px] leading-[1.72] text-white/60 md:mt-12 md:text-[16.5px]">
                Wir entwickeln Web-Software, die Prozesse sinnvoll digitalisiert, Teams entlastet
                und technisch sauber mit deinem Unternehmen mitwächst.
              </p>

              {/* Ledger block — architecture-flavored session metadata */}
              <div className="mt-14 grid items-center gap-10 text-left sm:mt-18 sm:grid-cols-[auto_1fr] sm:gap-14 md:gap-20">
                <div data-ws-finalcta className="flex justify-center sm:justify-start">
                  <Link
                    to="/kontakt"
                    className="group relative inline-flex items-center gap-3 rounded-full border border-white/22 bg-white py-4 pl-8 pr-3 text-[15px] font-medium tracking-wide text-[#0A0A0A] no-underline shadow-[0_34px_80px_-32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.45)] magicks-duration-hover magicks-ease-out transition-[transform,box-shadow] hover:-translate-y-[2px] hover:shadow-[0_44px_90px_-28px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.55)] active:translate-y-0 active:scale-[0.985] md:text-[16px]"
                  >
                    <span>Projekt besprechen</span>
                    <span
                      aria-hidden
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A0A0A] text-white magicks-duration-hover magicks-ease-out transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
                    >
                      <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4">
                        <path d="M3 11 L11 3 M5 3 H11 V9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                </div>

                <div className="flex flex-col gap-4 border-l border-white/[0.08] pl-6 sm:pl-10 md:pl-12">
                  <div data-ws-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Projekt
                    </span>
                    <span className="font-instrument text-[1.2rem] italic leading-[1.3] text-white/90 sm:text-[1.4rem] md:text-[1.5rem]">
                      Portal · Dashboard · Plattform
                    </span>
                  </div>

                  <div data-ws-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Architektur
                    </span>
                    <span className="font-ui text-[13.5px] leading-[1.5] text-white/62 sm:text-[14.5px]">
                      Rollen, Abläufe und Datenflüsse — geplant, bevor gebaut wird.
                    </span>
                  </div>

                  <div data-ws-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Direkt
                    </span>
                    <a
                      href="mailto:hello@magicks.de"
                      className="font-instrument text-[1.1rem] italic text-white no-underline magicks-duration-hover magicks-ease-out transition-colors hover:text-white/82 sm:text-[1.25rem] md:text-[1.35rem]"
                    >
                      hello@magicks.de
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/*
             * Title block — architectural plate signature, 4 fields,
             * mirroring the Shops catalog strip in structure but reading
             * as a blueprint cartouche rather than a product back-cover.
             */}
            <div className="mt-24 border-t border-white/[0.06] pt-7 sm:mt-28">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-0">
                {[
                  { k: "§ End", v: "Leistungen 04" },
                  { k: "Blueprint", v: "04 · Web-Software" },
                  { k: "Scope", v: "Portal · Plattform · Tool" },
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
