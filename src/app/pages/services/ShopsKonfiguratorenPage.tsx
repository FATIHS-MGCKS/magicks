import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ChapterMarker } from "../../components/home/ChapterMarker";
import { ContextualCrossLink } from "../../components/service/ContextualCrossLink";
import { SectionTransition } from "../../components/service/SectionTransition";
import { RouteSEO } from "../../seo/RouteSEO";

/* ------------------------------------------------------------------
 * /shops-produktkonfiguratoren — bespoke editorial landing page.
 *
 * Emphasis: product presentation, sales-oriented clarity, decision flow.
 * Visual language: more kinetic than the Websites sister page, with a
 * distinguishing "variant matrix" motif that references configurator logic.
 *
 * Sections:
 *   · Hero                — chapter folio, serif H1, CTA, meta triad, VariantMatrix, vertical credit
 *   · Statement 01        — "Wenn digital verkauft wird, reicht Standard nicht."
 *   · Audience            — "Für Unternehmen, die digital besser verkaufen wollen"
 *   · Includes            — 6-item editorial grid (shop-specific framing)
 *   · Approach            — "Wie wir Shops und Konfiguratoren denken"
 *   · Negation            — "Was du nicht bekommst" — big hanging declarations
 *   · Ceremonial Pull     — "Shops, die führen..." (own moment, hairline gates)
 *   · Cross-link          — /web-software
 *   · Final CTA           — serif headline + session ledger + white pill
 * ------------------------------------------------------------------ */

const INCLUDES: { sku: string; title: string; body: string }[] = [
  {
    sku: "SH-01",
    title: "Shops mit Klarheit",
    body:
      "Wir entwickeln Shops, die Produkte strukturiert präsentieren, Nutzer sicher führen und hochwertig wirken.",
  },
  {
    sku: "CONF-02",
    title: "Produktkonfiguratoren mit echter Funktion",
    body:
      "Interaktive Konfiguratoren, die Auswahl, Varianten und Individualisierung verständlich und sauber abbilden.",
  },
  {
    sku: "UX-03",
    title: "UX mit Verkaufsfokus",
    body:
      "Wir denken in Nutzerführung, Orientierung, Reduktion von Reibung und klaren Entscheidungen.",
  },
  {
    sku: "DEV-04",
    title: "Technische Umsetzung",
    body:
      "Moderne, performante und responsive Entwicklung mit Fokus auf Stabilität und sauberem Verhalten im Alltag.",
  },
  {
    sku: "INT-05",
    title: "Integrationen",
    body:
      "Schnittstellen zu CRM, Anfrageprozessen, Zahlungslogik, Tracking, ERP oder anderen Systemen, wenn sie Teil des Prozesses sind.",
  },
  {
    sku: "PRES-06",
    title: "Digitale Produktpräsentation",
    body:
      "Wir gestalten Erlebnisse, die Produkte hochwertig, verständlich und überzeugend transportieren.",
  },
];

const AUDIENCE: string[] = [
  "einen modernen Onlineshop mit Anspruch brauchst",
  "erklärungsbedürftige Produkte digital besser darstellen willst",
  "Varianten, Optionen oder individuelle Zusammenstellungen abbilden musst",
  "einen Produktkonfigurator für Vertrieb oder Anfrageprozess brauchst",
  "Nutzerführung, Vertrauen und Conversion gezielt verbessern willst",
];

/* ------------------------------------------------------------------
 * VariantMatrix — 4×3 grid of "V01–V12" variant cells, one highlighted.
 * A quiet typographic signal that this page is about configurable logic
 * and decision flow, not just a flat product page.
 * ------------------------------------------------------------------ */
function VariantMatrix() {
  // The highlighted cell represents the "currently selected variant" —
  // a visual hook that hints at configurator logic without showing UI chrome.
  const selected = 5; // V06
  return (
    <div aria-hidden className="w-full max-w-[40rem]">
      <div className="grid grid-cols-4 gap-[1px] bg-white/[0.05]">
        {Array.from({ length: 12 }).map((_, i) => {
          const isSelected = i === selected;
          const isAnchor = i % 4 === 0;
          let cellClass =
            "relative flex h-[54px] items-center justify-center bg-[#0A0A0A] px-3 sm:h-[64px]";
          if (isSelected) {
            cellClass =
              "relative flex h-[54px] items-center justify-center bg-white/[0.055] px-3 sm:h-[64px]";
          }
          return (
            <div key={i} data-ss-cell className={cellClass}>
              <span
                className={`font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] sm:text-[10.5px] ${
                  isSelected
                    ? "text-white"
                    : isAnchor
                      ? "text-white/46"
                      : "text-white/28"
                }`}
              >
                V{String(i + 1).padStart(2, "0")}
              </span>

              {isSelected ? (
                <>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 border border-white/30"
                  />
                  <span
                    aria-hidden
                    className="tick-breathing pointer-events-none absolute left-1 top-1 h-1 w-1 rounded-full bg-white"
                  />
                </>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="font-mono mt-3 flex items-start justify-between text-[9px] font-medium uppercase leading-none tracking-[0.28em] text-white/30 sm:text-[9.5px]">
        <span>Variante 01</span>
        <span className="text-white/46">Ausgewählt · V06</span>
        <span>Variante 12</span>
      </div>
    </div>
  );
}

export default function ShopsKonfiguratorenPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      // ——— Hero intro timeline ———
      const heroChapter = root.querySelector<HTMLElement>("[data-ss-chapter]");
      const heroLineA = gsap.utils.toArray<HTMLElement>("[data-ss-h1a]");
      const heroLineB = gsap.utils.toArray<HTMLElement>("[data-ss-h1b]");
      const heroH1 = root.querySelector<HTMLElement>("[data-ss-h1]");
      const heroLead = root.querySelector<HTMLElement>("[data-ss-lead]");
      const heroCta = root.querySelector<HTMLElement>("[data-ss-cta]");
      const heroCtaRule = root.querySelector<HTMLElement>("[data-ss-cta-rule]");
      const heroMeta = gsap.utils.toArray<HTMLElement>("[data-ss-meta]");
      const heroCells = gsap.utils.toArray<HTMLElement>("[data-ss-cell]");
      const heroMatrix = root.querySelector<HTMLElement>("[data-ss-matrix]");
      const heroSpec = root.querySelector<HTMLElement>("[data-ss-spec]");
      const heroCredit = root.querySelector<HTMLElement>("[data-ss-credit]");
      const heroSection = root.querySelector<HTMLElement>("[data-ss-hero]");
      const heroCopy = root.querySelector<HTMLElement>("[data-ss-herocopy]");

      // ——— Scroll-reveal groups ———
      const reveals = gsap.utils.toArray<HTMLElement>("[data-ss-reveal]");
      const pullLines = gsap.utils.toArray<HTMLElement>("[data-ss-pull]");
      const pullHeading = root.querySelector<HTMLElement>("[data-ss-pullheading]");
      const finalLineA = gsap.utils.toArray<HTMLElement>("[data-ss-finala]");
      const finalLineB = gsap.utils.toArray<HTMLElement>("[data-ss-finalb]");
      const finalRule = root.querySelector<HTMLElement>("[data-ss-finalrule]");
      const finalLedger = gsap.utils.toArray<HTMLElement>("[data-ss-finalledger]");
      const finalCta = root.querySelector<HTMLElement>("[data-ss-finalcta]");

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
            ...heroCells,
            heroMatrix,
            heroSpec,
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
          { opacity: 1, y: 0, yPercent: 0, scaleX: 1, scaleY: 1, letterSpacing: "normal" },
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
      gsap.set(heroMatrix, { opacity: 0 });
      gsap.set(heroCells, { opacity: 0, scale: 0.94 });
      gsap.set(heroSpec, { opacity: 0, x: 16 });
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
          { letterSpacing: "-0.038em", duration: 1.6, ease: "power2.out" },
          0.45,
        )
        .to(heroLead, { opacity: 1, y: 0, duration: 1.0 }, 1.05)
        .to(heroCta, { opacity: 1, y: 0, duration: 0.95 }, 1.4)
        .to(heroCtaRule, { scaleX: 1, duration: 1.15, ease: "power2.inOut" }, 1.5)
        .to(heroMeta, { opacity: 1, y: 0, duration: 0.85, stagger: 0.09 }, 1.65)
        .to(heroMatrix, { opacity: 1, duration: 1.15 }, 1.75)
        .to(
          heroCells,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            // slower, more deliberate — premium restraint
            stagger: { amount: 0.9, from: "start" },
            ease: "power2.out",
          },
          1.8,
        )
        .to(heroSpec, { opacity: 1, x: 0, duration: 1.15, ease: "power3.out" }, 2.0)
        .to(heroCredit, { opacity: 1, y: 0, duration: 1.0 }, 2.25);

      // ——— Hero camera push — subtle scroll-linked drift ———
      if (heroCopy && heroSection) {
        gsap.to(heroCopy, {
          yPercent: -8,
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
        gsap.set(el, { opacity: 0, y: 24 });
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
            duration: 1.4,
            ease: "power4.out",
            // slower, more deliberate — premium restraint
            stagger: 0.15,
          });
        if (pullHeading) {
          tl.to(
            pullHeading,
            { letterSpacing: "-0.038em", duration: 1.7, ease: "power2.out" },
            0.15,
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
      <RouteSEO path="/shops-produktkonfiguratoren" />

      <main
        ref={rootRef}
        className="relative bg-[#0A0A0A] pb-0 pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.5rem]"
      >
        {/* =========================================================
           HERO
        ========================================================= */}
        <section
          data-ss-hero
          className="relative overflow-hidden px-5 pb-28 sm:px-8 sm:pb-32 md:px-12 md:pb-44 lg:px-16 lg:pb-52"
        >
          {/* Subtle specimen grid — quieter than Websites page */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px)",
              backgroundSize: "100% 56px",
              maskImage:
                "radial-gradient(ellipse 58% 68% at 72% 58%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 58% 68% at 72% 58%, black, transparent)",
            }}
          />

          {/* Vertical editorial credit — left-edge, fades on scroll */}
          <div
            data-ss-credit
            aria-hidden
            className="pointer-events-none absolute bottom-14 left-5 z-10 hidden md:block lg:bottom-16 lg:left-8"
          >
            <span className="hero-vertical-credit">
              MAGICKS &nbsp;·&nbsp; LEISTUNG 03 &nbsp;·&nbsp; SHOPS &amp; KONFIGURATOREN &nbsp;·&nbsp; SPECIMEN MMXXVI
            </span>
          </div>

          <div className="relative layout-max">
            <div data-ss-herocopy>
              <div data-ss-chapter className="mb-10 sm:mb-14">
                <ChapterMarker num="03" label="Leistungen / Shops & Konfiguratoren" />
              </div>

              {/* H1 */}
              <h1
                data-ss-h1
                className="font-instrument max-w-[62rem] text-[2.4rem] leading-[0.98] tracking-[-0.038em] text-white sm:text-[3.1rem] md:text-[4.1rem] lg:text-[4.8rem] xl:text-[5.6rem]"
              >
                <span className="block">
                  {["Shops", "&", "Produktkonfiguratoren,"].map((w, i) => (
                    <span
                      key={`a-${i}`}
                      className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-ss-h1a className="inline-block will-change-[transform,opacity]">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/62 sm:mt-2">
                  {["die", "verkaufen", "und", "führen."].map((w, i) => (
                    <span
                      key={`b-${i}`}
                      className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-ss-h1b className="inline-block will-change-[transform,opacity]">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>

              {/* Intro */}
              <div data-ss-lead className="mt-10 max-w-[46rem] sm:mt-12 md:mt-14">
                <p className="font-instrument text-[1.3rem] italic leading-[1.35] tracking-[-0.01em] text-white/82 sm:text-[1.5rem] md:text-[1.65rem]">
                  Ein guter Shop muss mehr können als Produkte anzeigen.
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/58 md:text-[16px] md:leading-[1.72]">
                  Er muss Nutzer klar führen, Vertrauen aufbauen, Entscheidungen leichter machen
                  und aus Interesse konkrete Anfragen oder Käufe erzeugen.
                </p>
                <p className="font-ui mt-5 text-[15px] leading-[1.72] text-white/58 md:text-[16px] md:leading-[1.72]">
                  Genau dafür entwickeln wir Shops und Produktkonfiguratoren, die hochwertig
                  aussehen, sauber funktionieren und{" "}
                  <em className="italic text-white/86">
                    im echten Verkaufsprozess einen Unterschied machen.
                  </em>
                </p>
              </div>

              {/* CTA */}
              <div
                data-ss-cta
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
                      data-ss-cta-rule
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

              {/* Meta triad */}
              <div className="mt-14 flex flex-wrap items-center gap-x-7 gap-y-3 sm:mt-18 md:mt-20">
                {["Shop", "Konfigurator", "Abschluss"].map((m, i) => (
                  <span
                    key={m}
                    data-ss-meta
                    className="font-mono flex items-center gap-3 text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/52 sm:text-[10.5px]"
                  >
                    <span className="tabular-nums text-white/34">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {m}
                  </span>
                ))}
              </div>

              {/*
               * Matrix + Specimen plate — the hero's distinguishing moment.
               * The matrix reads as configurator logic; the specimen plate
               * reads as a premium catalog card. Together they establish
               * the page's "product catalog" voice.
               */}
              <div className="mt-16 grid gap-8 sm:mt-20 md:mt-24 md:gap-10 lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)] lg:items-end lg:gap-14 xl:gap-20">
                <div data-ss-matrix className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/38 sm:text-[10.5px]">
                      Varianten · Entscheidungsraum
                    </span>
                    <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 sm:text-[10.5px]">
                      12 Optionen · 1 gewählt
                    </span>
                  </div>
                  <VariantMatrix />
                </div>

                {/* Specimen plate — premium catalog spec card */}
                <aside
                  data-ss-spec
                  className="relative flex flex-col gap-5 border-t border-white/[0.08] pt-6 md:pt-7 lg:border-0 lg:border-l lg:border-white/[0.1] lg:pl-8 lg:pt-0 xl:pl-12"
                >
                  {/* Plate header */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/46">
                      § Specimen
                    </span>
                    <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/34">
                      Plate 03
                    </span>
                  </div>

                  {/* Product name + edition */}
                  <div className="flex flex-col gap-1.5">
                    <span className="font-instrument text-[1.25rem] italic leading-[1.1] tracking-[-0.01em] text-white md:text-[1.4rem]">
                      MGX · Shops
                    </span>
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/42">
                      Edition MMXXVI
                    </span>
                  </div>

                  {/* Spec ledger */}
                  <div className="flex flex-col gap-3.5 border-t border-white/[0.08] pt-4">
                    <div className="font-mono flex items-baseline justify-between gap-3 text-[10px] leading-none tracking-[0.3em] sm:text-[10.5px]">
                      <span className="uppercase text-white/34">Auswahl</span>
                      <span className="tabular-nums text-white/74">V06 / 12</span>
                    </div>
                    <div className="font-mono flex items-baseline justify-between gap-3 text-[10px] leading-none tracking-[0.3em] sm:text-[10.5px]">
                      <span className="uppercase text-white/34">Zustand</span>
                      <span className="uppercase text-white/74">Aktuell</span>
                    </div>
                    <div className="font-mono flex items-baseline justify-between gap-3 text-[10px] leading-none tracking-[0.3em] sm:text-[10.5px]">
                      <span className="uppercase text-white/34">Modus</span>
                      <span className="uppercase text-white/74">Katalog</span>
                    </div>
                  </div>

                  {/* Corner accent — catalog tab */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-0 hidden h-2 w-2 border-r border-t border-white/22 lg:block"
                  />
                </aside>
              </div>
            </div>
          </div>

          {/* Specimen readout — lower right editorial trivia */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-6 right-5 hidden items-center gap-4 md:right-12 md:flex lg:right-16 lg:bottom-10"
          >
            <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/34">
              SKU · Leistung 03
            </span>
            <span aria-hidden className="h-px w-10 bg-white/18" />
            <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.26em] text-white/34">
              SHOP — CONFIG — FLOW
            </span>
          </div>
        </section>

        {/* Transition → § 01 Vertrieb */}
        <SectionTransition from="§ Hero — Leistungen 03" to="§ 01  Vertrieb" />

        {/* =========================================================
           STATEMENT 01 — "Wenn digital verkauft wird, reicht Standard nicht."
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20 lg:gap-24">
              <div data-ss-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 01 — Vertrieb
                </p>
                <h2 className="font-instrument text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]">
                  Wenn digital verkauft wird,{" "}
                  <em className="italic text-white/58">reicht Standard nicht.</em>
                </h2>

                {/* Forward cross-ref */}
                <div data-ss-reveal className="mt-10 flex items-center gap-4 md:mt-14">
                  <span aria-hidden className="h-px w-10 bg-white/22 md:w-14" />
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    → Siehe § 04 Herangehen
                  </span>
                </div>
              </div>

              <div data-ss-reveal className="md:pt-3">
                <p className="font-ui text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Ein Shop oder Konfigurator ist kein nettes Extra. Er ist Teil deines Vertriebs,
                  Teil deiner Nutzerführung und oft der Moment, in dem aus Aufmerksamkeit{" "}
                  <em className="italic text-white/88">eine echte Entscheidung wird.</em>
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Deshalb bauen wir keine Lösungen, die einfach nur modern aussehen. Wir entwickeln
                  digitale Verkaufserlebnisse, die strukturiert führen, technisch sauber laufen und
                  Produkte{" "}
                  <em className="italic text-white/86">
                    verständlich, hochwertig und überzeugend erlebbar
                  </em>{" "}
                  machen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → § 02 Zielbild */}
        <SectionTransition from="§ 01  Vertrieb" to="§ 02  Zielbild" />

        {/* =========================================================
           AUDIENCE — "Für Unternehmen, die digital besser verkaufen wollen"
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-ss-reveal className="md:pt-2">
                <ChapterMarker num="02" label="Zielbild" />
              </div>

              <div>
                <h2
                  data-ss-reveal
                  className="font-instrument max-w-[48rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Für Unternehmen, die digital{" "}
                  <em className="italic text-white/58">besser verkaufen wollen</em>.
                </h2>

                <p
                  data-ss-reveal
                  className="font-ui mt-8 max-w-xl text-[15px] leading-[1.7] text-white/56 md:mt-10 md:text-[15.5px]"
                >
                  Diese Leistung ist für Unternehmen, die Produkte oder Leistungen nicht einfach
                  nur online zeigen, sondern digital überzeugend präsentieren und sauber zum
                  Abschluss führen wollen.
                </p>

                <p
                  data-ss-reveal
                  className="font-instrument mt-10 text-[1.18rem] italic leading-[1.4] tracking-[-0.01em] text-white/72 md:text-[1.32rem]"
                >
                  Zum Beispiel, wenn du:
                </p>

                {/*
                 * Audience declarations — each line carries a "V0X" variant code,
                 * echoing the hero matrix, and a trailing decision-flow glyph.
                 * Reads left-to-right as: option · case · consequence.
                 * Distinct from the Websites / Web-Software pages.
                 */}
                <ul className="mt-10 space-y-7 md:mt-14 md:space-y-9">
                  {AUDIENCE.map((item, i) => (
                    <li
                      key={item}
                      data-ss-reveal
                      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-5 md:gap-x-9"
                    >
                      <span
                        aria-hidden
                        className="font-mono relative inline-flex translate-y-[-0.38rem] items-center gap-2 text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/46 md:text-[10.5px]"
                      >
                        <span className="tabular-nums">V{String(i + 1).padStart(2, "0")}</span>
                        <span aria-hidden className="h-px w-6 bg-white/22 md:w-8" />
                      </span>
                      <p className="font-instrument text-[1.35rem] leading-[1.32] tracking-[-0.012em] text-white/90 md:text-[1.6rem] lg:text-[1.78rem] xl:text-[1.9rem]">
                        {item}
                      </p>
                      <span
                        aria-hidden
                        className="font-instrument hidden translate-y-[-0.1rem] text-[1.2rem] italic leading-none text-white/28 sm:inline md:text-[1.5rem]"
                      >
                        →
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
           INCLUDES — "Was wir für dich umsetzen"
           Rendered as a catalog register — SKU · Position · Description.
           Each row carries a product-SKU prefix, echoing the catalog voice.
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-ss-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    § 03 — Umfang
                  </p>
                  <span
                    aria-hidden
                    className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]"
                  >
                    Register · 06 Positionen
                  </span>
                </div>
              </div>

              <div>
                <h2
                  data-ss-reveal
                  className="font-instrument max-w-[48rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Was wir für dich <em className="italic text-white/58">umsetzen</em>.
                </h2>

                {/* Register column headers — catalog vocabulary */}
                <div
                  data-ss-reveal
                  className="font-mono mt-14 hidden grid-cols-[minmax(110px,max-content)_minmax(0,1fr)_minmax(0,1.1fr)] items-baseline gap-x-12 border-b border-white/[0.08] pb-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/38 md:mt-20 md:grid"
                >
                  <span>SKU</span>
                  <span>Position</span>
                  <span>Beschreibung</span>
                </div>

                {/* 6-row register — bordered, SKU · title · body */}
                <ol className="divide-y divide-white/[0.07] border-b border-white/[0.07] md:border-t-0">
                  {INCLUDES.map((item) => (
                    <li
                      key={item.title}
                      data-ss-reveal
                      className="flex flex-col gap-3 py-8 md:grid md:grid-cols-[minmax(110px,max-content)_minmax(0,1fr)_minmax(0,1.1fr)] md:items-baseline md:gap-x-12 md:py-10"
                    >
                      <span className="font-mono text-[10.5px] font-medium leading-none tracking-[0.3em] text-white/54 md:pt-[0.55rem] md:text-[11.5px]">
                        {item.sku}
                      </span>
                      <h3 className="font-instrument text-[1.4rem] leading-[1.2] tracking-[-0.018em] text-white md:text-[1.5rem] lg:text-[1.65rem]">
                        {item.title}
                      </h3>
                      <p className="font-ui max-w-md text-[14px] leading-[1.65] text-white/56 md:text-[14.5px]">
                        {item.body}
                      </p>
                    </li>
                  ))}
                </ol>

                {/* Register footer — edition signature */}
                <div
                  data-ss-reveal
                  className="font-mono mt-6 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:mt-8"
                >
                  <span>Edition · Shops & Konfiguratoren</span>
                  <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                  <span className="tabular-nums">Plate 03 · MMXXVI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → § 04 Herangehen */}
        <SectionTransition from="§ 03  Umfang" to="§ 04  Herangehen" />

        {/* =========================================================
           APPROACH — "Wie wir Shops und Konfiguratoren denken"
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-20 lg:gap-28">
              <div data-ss-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 04 — Herangehen
                </p>
                <h2 className="font-instrument text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]">
                  Wie wir Shops und Konfiguratoren{" "}
                  <em className="italic text-white/58">denken</em>.
                </h2>
              </div>

              <div data-ss-reveal className="md:pt-3">
                <p className="font-ui text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Wir starten nicht bei hübschen Oberflächen, sondern bei Nutzerweg, Produktlogik
                  und Abschlussmoment.
                </p>

                {/* Quiet triplet — three italic-serif questions with dot dividers */}
                <div className="mt-10 flex flex-col gap-4 border-l border-white/[0.12] pl-6 md:mt-12 md:pl-8">
                  <p className="font-instrument text-[1.2rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 md:text-[1.4rem] lg:text-[1.55rem]">
                    Was muss verständlich sein?
                  </p>
                  <p className="font-instrument text-[1.2rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 md:text-[1.4rem] lg:text-[1.55rem]">
                    Wo entstehen Fragen?
                  </p>
                  <p className="font-instrument text-[1.2rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 md:text-[1.4rem] lg:text-[1.55rem]">
                    Wo springt ein Nutzer ab — und wie führen wir besser?
                  </p>
                </div>

                <p className="font-ui mt-10 text-[15px] leading-[1.72] text-white/60 md:text-[16px] md:leading-[1.72]">
                  Darauf bauen wir das Design und die technische Struktur. So entstehen Shops und
                  Konfiguratoren, die nicht nur gut aussehen, sondern{" "}
                  <em className="italic text-white/88">im echten Prozess wirken</em> — im Verkauf,
                  in der Anfrage oder in der Produktentscheidung.
                </p>
              </div>
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
              <div data-ss-reveal className="md:pt-2">
                <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 05 — Absage
                </p>
              </div>

              <div>
                <h2
                  data-ss-reveal
                  className="font-instrument max-w-[48rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Was du von uns{" "}
                  <em className="italic text-white/58">nicht bekommst</em>.
                </h2>

                {/* Three anti-lines — display declarations w/ hanging em-dash */}
                <ul className="mt-14 space-y-8 md:mt-20 md:space-y-10">
                  {[
                    "Keinen beliebigen Standardshop.",
                    "Keinen Konfigurator, der nur technisch existiert, aber niemanden sauber führt.",
                    "Keine Lösung, die gut aussieht und im Alltag unnötig Reibung erzeugt.",
                  ].map((line) => (
                    <li
                      key={line}
                      data-ss-reveal
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 md:gap-x-9"
                    >
                      <span
                        aria-hidden
                        className="font-instrument text-[1.6rem] italic leading-none text-white/38 md:text-[2rem] lg:text-[2.25rem]"
                      >
                        —
                      </span>
                      <p className="font-instrument text-[1.4rem] leading-[1.3] tracking-[-0.016em] text-white/78 md:text-[1.9rem] lg:text-[2.2rem] xl:text-[2.4rem]">
                        {line}
                      </p>
                    </li>
                  ))}
                </ul>

                <p
                  data-ss-reveal
                  className="font-ui mt-16 max-w-[42rem] text-[15.5px] leading-[1.72] text-white/62 md:mt-20 md:text-[16.5px]"
                >
                  Was du bekommst, ist ein digitales Verkaufserlebnis mit{" "}
                  <em className="italic text-white/92">Klarheit, Anspruch und Funktion.</em>
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
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.28]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px)",
              backgroundSize: "100% 48px",
              maskImage:
                "radial-gradient(ellipse 68% 58% at 50% 50%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 68% 58% at 50% 50%, black, transparent)",
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

              <h3
                data-ss-pullheading
                className="font-instrument text-[2.6rem] leading-[1.0] tracking-[-0.038em] text-white sm:text-[3.6rem] md:text-[4.7rem] lg:text-[5.6rem] xl:text-[6.2rem]"
              >
                <span className="block overflow-hidden">
                  <span data-ss-pull className="inline-block">
                    Shops, die führen.
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span data-ss-pull className="inline-block italic text-white/64">
                    Konfiguratoren, die verständlich machen.
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span data-ss-pull className="inline-block">
                    Umsetzung, die verkauft.
                  </span>
                </span>
              </h3>

              <div className="mt-16 flex items-center gap-5 sm:mt-20">
                <span aria-hidden className="h-px flex-1 bg-white/12" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                  Edition · Positionierung 03
                </span>
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
           CONTEXTUAL CROSS-LINK → /web-software
           Phrased as a "Nebenkollektion" reference — reinforces the
           catalog vocabulary without feeling like a bolt-on block.
        ========================================================= */}
        <section className="relative px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16 lg:py-28">
          <div className="layout-max">
            <div data-ss-reveal>
              <ContextualCrossLink
                eyebrow="Nebenkollektion"
                folio="Plate 04 · Web-Software"
                lead="Wenn dein Projekt über einen klassischen Shop hinausgeht und eher in Richtung Plattform, Portal oder individuelle Anwendung geht, schau dir auch unsere Web-Software an."
                linkLabel="Web-Software ansehen"
                to="/web-software"
              />
            </div>
          </div>
        </section>

        {/* =========================================================
           FINAL CTA
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#070708] px-5 pb-32 pt-32 sm:px-8 sm:pb-40 sm:pt-40 md:px-12 md:pb-48 md:pt-48 lg:px-16 lg:pt-56">
          <div aria-hidden className="section-top-rule" />

          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[44%] aspect-square w-[120vw] max-w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.016) 30%, transparent 62%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.26]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 72% 62% at 50% 46%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[68rem] text-center">
              <div className="mb-14 inline-flex sm:mb-20">
                <ChapterMarker num="END" label="Projekt" align="center" variant="end" />
              </div>

              <h2 className="font-instrument text-[2.6rem] leading-[0.95] tracking-[-0.04em] text-white sm:text-[3.6rem] md:text-[5rem] lg:text-[6.2rem] xl:text-[7rem]">
                <span className="block">
                  {[
                    "Bereit",
                    "für",
                    "einen",
                    "Shop",
                    "oder",
                    "Konfigurator,",
                  ].map((w, i) => (
                    <span
                      key={`fa-${i}`}
                      className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-ss-finala className="inline-block">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/76 sm:mt-2">
                  {["der", "mehr", "kann", "als", "nur", "gut", "aussehen?"].map((w, i) => (
                    <span
                      key={`fb-${i}`}
                      className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-ss-finalb className="inline-block">
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
                    data-ss-finalrule
                    className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  />
                </div>
                <span aria-hidden className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40">
                  ·
                </span>
              </div>

              <p className="font-ui mx-auto mt-10 max-w-[40rem] text-[15px] leading-[1.72] text-white/60 md:mt-12 md:text-[16.5px]">
                Wir entwickeln digitale Verkaufslösungen, die Produkte stark präsentieren, Nutzer
                klar führen und technisch sauber funktionieren.
              </p>

              {/* Ledger block — session metadata specific to shops/configurators */}
              <div className="mt-14 grid items-center gap-10 text-left sm:mt-18 sm:grid-cols-[auto_1fr] sm:gap-14 md:gap-20">
                <div data-ss-finalcta className="flex justify-center sm:justify-start">
                  <Link
                    to="/kontakt"
                    className="group relative inline-flex items-center gap-3 rounded-full border border-white/22 bg-white py-4 pl-8 pr-3 text-[15px] font-medium tracking-wide text-[#0A0A0A] no-underline shadow-[0_34px_80px_-32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.45)] magicks-duration-hover magicks-ease-out transition-[transform,box-shadow] hover:-translate-y-[2px] hover:shadow-[0_44px_90px_-28px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.55)] active:translate-y-0 active:scale-[0.985] md:text-[16px]"
                  >
                    <span>Lass uns über dein Projekt sprechen</span>
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
                  <div data-ss-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Projekt
                    </span>
                    <span className="font-instrument text-[1.2rem] italic leading-[1.3] text-white/90 sm:text-[1.4rem] md:text-[1.5rem]">
                      Shop · Konfigurator · Plattform
                    </span>
                  </div>

                  <div data-ss-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Umfang
                    </span>
                    <span className="font-ui text-[13.5px] leading-[1.5] text-white/62 sm:text-[14.5px]">
                      Varianten, Integrationen und Abschlussmomente — klar geplant.
                    </span>
                  </div>

                  <div data-ss-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Direkt
                    </span>
                    <a
                      href="mailto:hello@magicks.studio"
                      className="font-instrument text-[1.1rem] italic text-white no-underline magicks-duration-hover magicks-ease-out transition-colors hover:text-white/82 sm:text-[1.25rem] md:text-[1.35rem]"
                    >
                      hello@magicks.studio
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/*
             * Catalog strip — tear-off edition signature, 4 fields divided
             * by hairline rules. Echoes the back-cover of a print catalog.
             */}
            <div className="mt-24 border-t border-white/[0.06] pt-7 sm:mt-28">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-0">
                {[
                  { k: "§ End", v: "Leistungen 03" },
                  { k: "Plate", v: "03 · Shops" },
                  { k: "SKU", v: "MGX-SHP-03" },
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
