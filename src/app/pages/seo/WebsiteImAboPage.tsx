import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ChapterMarker } from "../../components/home/ChapterMarker";
import { ContextualCrossLink } from "../../components/service/ContextualCrossLink";
import { SectionTransition } from "../../components/service/SectionTransition";
import { RouteSEO } from "../../seo/RouteSEO";

/* ------------------------------------------------------------------
 * /website-im-abo — bespoke editorial landing page.
 *
 * Emphasis: planability, lower entry barrier, calm confidence.
 * Visual language: still premium + dark, but noticeably softer + rhythmic.
 *
 * Distinguishing motif: a subtle "monthly cadence" rhythm (12 tick marks
 * representing an annual cadence, with a breathing current-month anchor),
 * and a centered "heart" pull-quote that replaces the declarative three-line
 * statement used on the sister page.
 *
 * Sections:
 *   · Hero                — chapter folio, serif H1, lead, CTA, breathing cadence, vertical credit
 *   · Statement 01        — "Nicht billig. Planbar." + forward cross-ref
 *   · Audience            — "Für wen sich das Modell lohnt"
 *   · Includes            — 6-item editorial row grid
 *   · Heart pull-quote    — "Weil gute Websites nicht an der Zahlungsform scheitern sollten."
 *   · Negation            — "Was unser Modell nicht ist"
 *   · Triad               — "Monatlich / Professionell / Betreut"
 *   · Cross-link          — /websites-landingpages
 *   · Final CTA           — calmer ledger + white pill
 * ------------------------------------------------------------------ */

const INCLUDES: { title: string; body: string }[] = [
  {
    title: "Konzept & Struktur",
    body: "Wir definieren die Basis für einen klaren und überzeugenden Auftritt.",
  },
  {
    title: "Individuelles Design",
    body:
      "Keine sichtbare Baukastenoptik, sondern eine Seite, die sauber gestaltet ist und zu deinem Unternehmen passt.",
  },
  {
    title: "Technische Umsetzung",
    body: "Responsive, schnell und modern aufgebaut.",
  },
  {
    title: "SEO-Basis & Seitenstruktur",
    body:
      "Saubere Überschriftenlogik, Meta-Grundlagen und technische Basis — damit die Seite von Anfang an gut auffindbar bleibt.",
  },
  {
    title: "Text- und Bildpflege",
    body:
      "Kleinere Texte, Bildwechsel oder Bereichsanpassungen werden im Modell mitbetreut, ohne jedes Mal ein eigenes Projekt zu werden.",
  },
  {
    title: "Hosting & Wartung",
    body: "Die technische Betreuung kann direkt mitgedacht werden.",
  },
  {
    title: "Laufende kleine Optimierungen",
    body:
      "Inhalte, Sektionen oder kleine Verbesserungen werden Schritt für Schritt nachgeschärft, ohne den Auftritt zu überladen.",
  },
  {
    title: "Support & Weiterentwicklung",
    body:
      "Die Website bleibt nicht einfach liegen, sondern kann mit deinem Unternehmen weitergeführt werden.",
  },
];

const AUDIENCE: string[] = [
  "nicht alles auf einmal zahlen willst",
  "planbare monatliche Kosten bevorzugst",
  "schnell online gehen willst",
  "eine professionelle Website mit Betreuung suchst",
  "keine Lust hast, Hosting, Wartung und kleine Änderungen separat zu organisieren",
];

const TRIAD: { eyebrow: string; title: string; body: string }[] = [
  {
    eyebrow: "Monatlich",
    title: "Monatlich zahlen.",
    body:
      "Planbare Kosten statt großer Einmalinvestition — vom ersten Monat an und für jeden weiteren.",
  },
  {
    eyebrow: "Professionell",
    title: "Professionell auftreten.",
    body:
      "Individuelles Design, saubere Technik, klare Markenwirkung. Kein Baukasten, kein Standard.",
  },
  {
    eyebrow: "Betreut",
    title: "Sauber betreut bleiben.",
    body:
      "Hosting, Wartung, kleine Anpassungen — laufend im Modell enthalten, nichts bleibt liegen.",
  },
];

/** Monthly cadence strip — 12 hairline ticks + mono month labels, with a
 *  breathing "current month" anchor to signal continuous support. */
function MonthlyCadence() {
  return (
    <div aria-hidden className="w-full max-w-[38rem]">
      <div className="flex items-end gap-[0.35rem]">
        {Array.from({ length: 12 }).map((_, i) => {
          const isAnchor = i === 0 || i === 6 || i === 11;
          const isCurrent = i === 3;
          let emphasis: string;
          if (isCurrent) {
            emphasis = "h-[26px] bg-white/82 tick-breathing";
          } else if (isAnchor) {
            emphasis = "h-[22px] bg-white/44";
          } else if (i % 3 === 0) {
            emphasis = "h-[14px] bg-white/22";
          } else {
            emphasis = "h-[10px] bg-white/12";
          }
          return (
            <span
              key={i}
              data-wa-tick
              className={`block w-px flex-1 ${emphasis} origin-bottom`}
            />
          );
        })}
      </div>
      <div className="font-mono mt-3 flex items-start justify-between text-[9px] font-medium uppercase leading-none tracking-[0.28em] text-white/30 sm:text-[9.5px]">
        <span>M01</span>
        <span className="text-white/38">M06</span>
        <span>M12</span>
      </div>
    </div>
  );
}

export default function WebsiteImAboPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      // ——— Hero ———
      const heroChapter = root.querySelector<HTMLElement>("[data-wa-chapter]");
      const heroLineA = gsap.utils.toArray<HTMLElement>("[data-wa-h1a]");
      const heroLineB = gsap.utils.toArray<HTMLElement>("[data-wa-h1b]");
      const heroH1 = root.querySelector<HTMLElement>("[data-wa-h1]");
      const heroLead = root.querySelector<HTMLElement>("[data-wa-lead]");
      const heroCta = root.querySelector<HTMLElement>("[data-wa-cta]");
      const heroCtaRule = root.querySelector<HTMLElement>("[data-wa-cta-rule]");
      const heroMeta = gsap.utils.toArray<HTMLElement>("[data-wa-meta]");
      const heroTicks = gsap.utils.toArray<HTMLElement>("[data-wa-tick]");
      const heroCadence = root.querySelector<HTMLElement>("[data-wa-cadence]");
      const heroCredit = root.querySelector<HTMLElement>("[data-wa-credit]");
      const heroSection = root.querySelector<HTMLElement>("[data-wa-hero]");
      const heroCopy = root.querySelector<HTMLElement>("[data-wa-herocopy]");

      // ——— Scroll reveals ———
      const reveals = gsap.utils.toArray<HTMLElement>("[data-wa-reveal]");
      const heartLines = gsap.utils.toArray<HTMLElement>("[data-wa-heart]");
      const heartHeading = root.querySelector<HTMLElement>("[data-wa-heartheading]");
      const finalLineA = gsap.utils.toArray<HTMLElement>("[data-wa-finala]");
      const finalLineB = gsap.utils.toArray<HTMLElement>("[data-wa-finalb]");
      const finalRule = root.querySelector<HTMLElement>("[data-wa-finalrule]");
      const finalLedger = gsap.utils.toArray<HTMLElement>("[data-wa-finalledger]");
      const finalCta = root.querySelector<HTMLElement>("[data-wa-finalcta]");

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
            ...heroTicks,
            heroCadence,
            heroCredit,
            ...reveals,
            ...heartLines,
            heartHeading,
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

      // Hero setup
      gsap.set(heroChapter, { opacity: 0, y: 12 });
      gsap.set([...heroLineA, ...heroLineB], { yPercent: 118, opacity: 0 });
      if (heroH1) gsap.set(heroH1, { letterSpacing: "0.006em" });
      gsap.set(heroLead, { opacity: 0, y: 16 });
      gsap.set(heroCta, { opacity: 0, y: 14 });
      gsap.set(heroCtaRule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(heroMeta, { opacity: 0, y: 8 });
      gsap.set(heroCadence, { opacity: 0 });
      gsap.set(heroTicks, { scaleY: 0, transformOrigin: "bottom center", opacity: 0.4 });
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
          0.6,
        )
        .to(
          heroH1,
          {
            letterSpacing: "-0.038em",
            duration: 1.6,
            ease: "power2.out",
          },
          0.45,
        )
        .to(heroLead, { opacity: 1, y: 0, duration: 1.0 }, 1.0)
        .to(heroCta, { opacity: 1, y: 0, duration: 0.95 }, 1.35)
        .to(heroCtaRule, { scaleX: 1, duration: 1.15, ease: "power2.inOut" }, 1.45)
        .to(heroMeta, { opacity: 1, y: 0, duration: 0.85, stagger: 0.08 }, 1.6)
        .to(heroCadence, { opacity: 1, duration: 1.1 }, 1.7)
        .to(
          heroTicks,
          {
            scaleY: 1,
            opacity: 1,
            duration: 0.7,
            stagger: 0.035,
            ease: "power2.out",
          },
          1.75,
        )
        .to(heroCredit, { opacity: 1, y: 0, duration: 1.0 }, 2.0);

      // ——— Hero camera push — very subtle scroll-linked drift on copy ———
      if (heroCopy && heroSection) {
        gsap.to(heroCopy, {
          yPercent: -6,
          opacity: 0.46,
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

      // ——— Generic scroll-triggered reveals ———
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

      // ——— Heart pull-quote — slow ceremonial reveal + letter-spacing settle ———
      if (heartLines.length) {
        gsap.set(heartLines, { yPercent: 108, opacity: 0 });
        if (heartHeading) gsap.set(heartHeading, { letterSpacing: "0.006em" });
        const tl = gsap
          .timeline({
            scrollTrigger: { trigger: heartLines[0], start: "top 78%", once: true },
          })
          .to(heartLines, {
            yPercent: 0,
            opacity: 1,
            duration: 1.5,
            ease: "expo.out",
            stagger: 0.14,
          });
        if (heartHeading) {
          tl.to(
            heartHeading,
            { letterSpacing: "-0.032em", duration: 1.8, ease: "power2.out" },
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
          .to(finalLineB, { yPercent: 0, opacity: 1, duration: 1.25, stagger: 0.07 }, 0.22)
          .to(finalRule, { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, 0.7)
          .to(finalCta, { opacity: 1, y: 0, scale: 1, duration: 0.95, ease: "back.out(1.2)" }, 0.95)
          .to(finalLedger, { opacity: 1, y: 0, duration: 0.95, stagger: 0.1 }, 1.1);
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/website-im-abo" />

      <main
        ref={rootRef}
        className="relative bg-[#0A0A0A] pb-0 pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.5rem]"
      >
        {/* =========================================================
           HERO
        ========================================================= */}
        <section
          data-wa-hero
          className="relative overflow-hidden px-5 pb-28 sm:px-8 sm:pb-32 md:px-12 md:pb-44 lg:px-16 lg:pb-52"
        >
          {/* Softer halo — warmer near-black glow centered behind the H1 */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[18%] top-[40%] aspect-square w-[78vw] max-w-[720px] -translate-y-1/2 rounded-full opacity-[0.7]"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.034) 0%, rgba(255,255,255,0.01) 36%, transparent 64%)",
            }}
          />

          {/* Vertical editorial credit — pinned to the left edge, fades on scroll */}
          <div
            data-wa-credit
            aria-hidden
            className="pointer-events-none absolute bottom-14 left-5 z-10 hidden md:block lg:bottom-16 lg:left-8"
          >
            <span className="hero-vertical-credit">
              MAGICKS &nbsp;·&nbsp; MODELL &nbsp;·&nbsp; ABO &nbsp;·&nbsp; EDITION MMXXVI
            </span>
          </div>

          <div className="relative layout-max">
            <div data-wa-herocopy>
              <div data-wa-chapter className="mb-10 sm:mb-14">
                <ChapterMarker num="Modell" label="Website · Abo" />
              </div>

              {/* H1 — two-line mask-reveal with letter-spacing settle */}
              <h1
                data-wa-h1
                className="font-instrument max-w-[58rem] text-[2.4rem] leading-[0.98] tracking-[-0.038em] text-white sm:text-[3.1rem] md:text-[4.1rem] lg:text-[4.7rem] xl:text-[5.3rem]"
              >
                <span className="block">
                  {["Professionelle", "Website"].map((w, i) => (
                    <span
                      key={`a-${i}`}
                      className="mr-[0.22em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-wa-h1a className="inline-block will-change-[transform,opacity]">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/64 sm:mt-2">
                  {["statt", "hoher", "Einmalzahlung."].map((w, i) => (
                    <span
                      key={`b-${i}`}
                      className="mr-[0.22em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-wa-h1b className="inline-block will-change-[transform,opacity]">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>

              <div data-wa-lead className="mt-10 max-w-[44rem] sm:mt-12 md:mt-14">
                <p className="font-ui text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Nicht jedes Unternehmen will oder kann direkt einen großen Betrag für eine neue
                  Website investieren.
                </p>
                <p className="font-ui mt-5 text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Deshalb gibt es bei MAGICKS Studio auch eine Lösung, die planbar bleibt: eine{" "}
                  <em className="italic text-white/90">professionelle Website im Abo</em> —
                  monatlich, klar kalkulierbar und trotzdem mit Anspruch umgesetzt.
                </p>
              </div>

              {/* CTA */}
              <div
                data-wa-cta
                className="mt-12 inline-flex items-baseline gap-3 sm:mt-14 md:mt-16"
              >
                <Link
                  to="/kontakt"
                  className="group relative inline-flex items-baseline gap-3 text-[15px] font-medium tracking-[-0.005em] text-white no-underline sm:text-[16px] md:text-[17px]"
                  aria-label="Modell anfragen"
                >
                  <span className="relative pb-3">
                    <span className="font-ui">Modell anfragen</span>
                    <span
                      data-wa-cta-rule
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

              {/* Meta triad — monthly rhythm triangulated. Mobile column stack. */}
              <div className="mt-12 flex flex-col gap-2 sm:mt-18 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-3 md:mt-20">
                {["Monatlich", "Planbar", "Betreut"].map((m, i) => (
                  <span
                    key={m}
                    data-wa-meta
                    className="font-mono flex items-center gap-3 text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/52 sm:text-[10.5px]"
                  >
                    <span className="tabular-nums text-white/34">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {m}
                  </span>
                ))}
              </div>

              {/* Monthly cadence motif — 12-tick annual rhythm, hairline, breathing anchor */}
              <div
                data-wa-cadence
                className="mt-16 flex flex-col gap-3 sm:mt-20 md:mt-24"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/38 sm:text-[10.5px]">
                    Zwölf Monate · Ein Rhythmus
                  </span>
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 sm:text-[10.5px]">
                    Aktueller Monat · M04
                  </span>
                </div>
                <MonthlyCadence />
              </div>
            </div>
          </div>
        </section>

        {/* Transition → § 01 Haltung */}
        <SectionTransition from="§ Hero — Modell" to="§ 01  Haltung" />

        {/* =========================================================
           STATEMENT 01 — "Nicht billig. Planbar."
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20 lg:gap-24">
              <div data-wa-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 01 — Haltung
                </p>
                <h2 className="font-instrument text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]">
                  Website im Abo heißt nicht billig.{" "}
                  <em className="italic text-white/58">Es heißt planbar.</em>
                </h2>

                {/* Forward cross-ref */}
                <div data-wa-reveal className="mt-10 flex items-center gap-4 md:mt-14">
                  <span aria-hidden className="h-px w-10 bg-white/22 md:w-14" />
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    → Siehe § Grundhaltung
                  </span>
                </div>
              </div>

              <div data-wa-reveal className="md:pt-3">
                <p className="font-ui text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Viele Modelle am Markt klingen nach Abo und enden bei Baukasten, Einschränkungen
                  und mittelmäßigen Ergebnissen.{" "}
                  <em className="italic text-white/88">Genau das ist nicht unser Ansatz.</em>
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Wir entwickeln auch im Abo keine beliebige Standardseite, sondern einen
                  professionellen Webauftritt, der zu deinem Unternehmen passt, hochwertig aussieht
                  und technisch sauber umgesetzt ist. Der Unterschied liegt nicht im Anspruch —
                  sondern im Zahlungsmodell.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → § 02 Passung */}
        <SectionTransition from="§ 01  Haltung" to="§ 02  Passung" />

        {/* =========================================================
           AUDIENCE — "Für wen sich das Modell lohnt"
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-wa-reveal className="md:pt-2">
                <ChapterMarker num="02" label="Passung" />
              </div>

              <div>
                <h2
                  data-wa-reveal
                  className="font-instrument max-w-[46rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Für wen sich das Modell{" "}
                  <em className="italic text-white/58">lohnt</em>.
                </h2>

                <p
                  data-wa-reveal
                  className="font-ui mt-8 max-w-xl text-[15px] leading-[1.7] text-white/58 md:mt-10 md:text-[15.5px]"
                >
                  Eine Website im Abo ist besonders sinnvoll, wenn du:
                </p>

                {/* Numbered row list — confident typography, hairline dividers */}
                <ul className="mt-10 space-y-0 border-t border-white/[0.07] md:mt-14">
                  {AUDIENCE.map((item, i) => (
                    <li
                      key={item}
                      data-wa-reveal
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 border-b border-white/[0.07] py-6 md:gap-x-9 md:py-8"
                    >
                      <span className="font-mono text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/40 md:text-[11.5px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-instrument text-[1.2rem] leading-[1.32] tracking-[-0.01em] text-white/90 md:text-[1.45rem] lg:text-[1.6rem]">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>

                <p
                  data-wa-reveal
                  className="font-ui mt-14 max-w-2xl text-[15px] leading-[1.72] text-white/58 md:mt-18 md:text-[15.5px]"
                >
                  Gerade für{" "}
                  <em className="italic text-white/86">
                    kleinere Unternehmen, lokale Anbieter, neue Marken oder wachsende Betriebe
                  </em>{" "}
                  kann das Modell deutlich entspannter sein als ein klassisches Einmalprojekt.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → § 03 Im Modell */}
        <SectionTransition from="§ 02  Passung" to="§ 03  Im Modell" />

        {/* =========================================================
           INCLUDES — "Was im Modell enthalten sein kann"
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-wa-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    § 03 — Im Modell
                  </p>
                  <span
                    aria-hidden
                    className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]"
                  >
                    {String(INCLUDES.length).padStart(2, "0")} /{" "}
                    {String(INCLUDES.length).padStart(2, "0")} Bausteine
                  </span>
                </div>
              </div>

              <div>
                <h2
                  data-wa-reveal
                  className="font-instrument max-w-[46rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Was im Modell{" "}
                  <em className="italic text-white/58">enthalten sein kann</em>.
                </h2>

                {/* Inclusion list — softer "row" style vs. page 1's column grid */}
                <ul className="mt-14 grid gap-x-14 gap-y-0 border-t border-white/[0.06] md:mt-20 md:grid-cols-2">
                  {INCLUDES.map((item, i) => (
                    <li
                      key={item.title}
                      data-wa-reveal
                      className="relative grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 border-b border-white/[0.06] py-8 sm:gap-x-7 md:py-10"
                    >
                      <span className="font-mono pt-[0.3rem] text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/40 md:text-[11.5px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-instrument text-[1.3rem] leading-[1.2] tracking-[-0.015em] text-white md:text-[1.45rem] lg:text-[1.55rem]">
                          {item.title}
                        </h3>
                        <p className="font-ui mt-3 max-w-md text-[14px] leading-[1.64] text-white/56 md:text-[14.5px]">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Restrained scope note — keeps the offer commercially safe.
                    Explicitly separates ongoing care from larger productions
                    or campaign-scale SEO work, so nothing in the model
                    implies unlimited scope. */}
                <div
                  data-wa-reveal
                  className="mt-12 max-w-[44rem] border-l border-white/[0.1] pl-5 md:mt-16 md:pl-7"
                >
                  <p className="font-ui text-[14.5px] leading-[1.7] text-white/58 md:text-[15px]">
                    Je nach Modell können auch{" "}
                    <em className="italic text-white/86">
                      SEO-Grundlagen, Textanpassungen und einfache Bildpflege
                    </em>{" "}
                    Teil der laufenden Betreuung sein. Größere Medienproduktionen, Kampagnen oder
                    umfangreiche SEO-Arbeit werden separat geplant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → Grundhaltung (darker) */}
        <SectionTransition from="§ 03  Im Modell" to="§ Grundhaltung" tone="darker" />

        {/* =========================================================
           HEART PULL-QUOTE — centered, emotional core, gated by rules
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#070708] px-5 py-36 sm:px-8 sm:py-44 md:px-12 md:py-56 lg:px-16 lg:py-64">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[115vw] max-w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.95]"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 36%, transparent 64%)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[68rem]">
              {/* Top gate — editorial hairline with centered label */}
              <div className="mb-16 flex items-center gap-5 sm:mb-24">
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
                  § Grundhaltung
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/12" />
              </div>

              <blockquote
                data-wa-heartheading
                className="font-instrument text-center text-[2.4rem] leading-[1.05] tracking-[-0.032em] text-white sm:text-[3.3rem] md:text-[4.4rem] lg:text-[5.2rem] xl:text-[5.9rem]"
              >
                <span className="block overflow-hidden">
                  <span data-wa-heart className="inline-block">
                    Weil gute Websites
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span data-wa-heart className="inline-block italic text-white/68">
                    nicht an der Zahlungsform
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span data-wa-heart className="inline-block italic text-white/68">
                    scheitern sollten.
                  </span>
                </span>
              </blockquote>

              {/* Bottom gate — mirrors the top */}
              <div className="mt-16 flex items-center gap-5 sm:mt-24">
                <span aria-hidden className="h-px flex-1 bg-white/12" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                  Edition · Grundhaltung 01
                </span>
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              </div>

              <div className="mx-auto mt-16 max-w-[48rem] sm:mt-24">
                <p
                  data-wa-reveal
                  className="font-ui text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]"
                >
                  Nicht jedes gute Projekt muss mit einer hohen Einmalzahlung starten. Manchmal ist
                  ein monatliches Modell einfach die bessere Entscheidung — wirtschaftlich,
                  organisatorisch und strategisch.
                </p>
                <p
                  data-wa-reveal
                  className="font-ui mt-5 text-[15px] leading-[1.72] text-white/58 md:text-[16px] md:leading-[1.72]"
                >
                  Deshalb bieten wir eine Lösung, die professionell bleibt, ohne direkt unnötig
                  schwer zu werden. <em className="italic text-white/86">Planbar für dich.</em>{" "}
                  <em className="italic text-white/86">Sauber umgesetzt von uns.</em>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → § 04 Absage */}
        <SectionTransition from="§ Grundhaltung" to="§ 04  Absage" tone="darker" />

        {/* =========================================================
           NEGATION — "Was unser Modell nicht ist"
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-48 lg:px-16 lg:py-52">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-wa-reveal className="md:pt-2">
                <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 04 — Absage
                </p>
              </div>

              <div>
                <h2
                  data-wa-reveal
                  className="font-instrument max-w-[46rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Was unser Modell{" "}
                  <em className="italic text-white/58">nicht ist</em>.
                </h2>

                <ul className="mt-14 space-y-7 md:mt-20 md:space-y-9">
                  {[
                    "Kein 29-Euro-Baukasten.",
                    "Kein beliebiges Massenprodukt.",
                    "Kein Abo, bei dem du am Ende in einem unflexiblen System festhängst, das weder gut aussieht noch sauber performt.",
                  ].map((line) => (
                    <li
                      key={line}
                      data-wa-reveal
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 md:gap-x-9"
                    >
                      <span
                        aria-hidden
                        className="font-instrument text-[1.5rem] italic leading-none text-white/38 md:text-[1.9rem] lg:text-[2.05rem]"
                      >
                        —
                      </span>
                      <p className="font-instrument text-[1.4rem] leading-[1.3] tracking-[-0.014em] text-white/80 md:text-[1.85rem] lg:text-[2.15rem] xl:text-[2.3rem]">
                        {line}
                      </p>
                    </li>
                  ))}
                </ul>

                <p
                  data-wa-reveal
                  className="font-ui mt-16 max-w-[46rem] text-[15.5px] leading-[1.72] text-white/62 md:mt-20 md:text-[16.5px]"
                >
                  Wir denken auch im Abo in{" "}
                  <em className="italic text-white/92">Qualität, Markenwirkung und Funktion.</em>{" "}
                  Sonst macht es keinen Sinn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → Zusammenfassung */}
        <SectionTransition from="§ 04  Absage" to="§ 05  Zusammenfassung" />

        {/* =========================================================
           TRIAD — the headline IS the three italic titles
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-32 sm:px-8 sm:py-40 md:px-12 md:py-52 lg:px-16 lg:py-60">
          <div className="layout-max">
            <div
              data-wa-reveal
              className="mb-16 flex items-center gap-5 sm:mb-24"
            >
              <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
                § 05 — Zusammenfassung
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/12" />
            </div>

            {/* Each triad entry is its own large statement — the grid IS the headline */}
            <ol className="mx-auto grid max-w-[84rem] gap-x-0 border-t border-white/[0.08] sm:grid-cols-3">
              {TRIAD.map((t, i) => (
                <li
                  key={t.title}
                  data-wa-reveal
                  className={`relative border-b border-white/[0.08] py-14 sm:py-20 md:py-24 ${
                    i > 0 ? "sm:border-l sm:border-white/[0.08]" : ""
                  } sm:px-8 md:px-12 lg:px-16`}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] font-medium leading-none tracking-[0.3em] text-white/34 md:text-[10.5px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/56 md:text-[10.5px]">
                      {t.eyebrow}
                    </span>
                  </div>

                  <h3
                    className={`font-instrument mt-8 text-[2rem] leading-[1.02] tracking-[-0.028em] md:mt-12 md:text-[2.55rem] lg:text-[2.9rem] xl:text-[3.15rem] ${
                      i === 1 ? "italic text-white/84" : "text-white"
                    }`}
                  >
                    {t.title}
                  </h3>

                  <p className="font-ui mt-6 max-w-xs text-[14px] leading-[1.62] text-white/56 md:mt-8 md:text-[14.5px]">
                    {t.body}
                  </p>

                  {i < TRIAD.length - 1 ? (
                    <span
                      aria-hidden
                      className="font-instrument pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 text-[2rem] italic text-white/14 sm:block md:text-[2.4rem]"
                    >
                      ·
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>

            <p
              data-wa-reveal
              className="font-ui mx-auto mt-18 max-w-[46rem] text-center text-[15px] leading-[1.72] text-white/58 md:mt-24 md:text-[16.5px]"
            >
              Das Modell ist ideal, wenn du eine moderne Website brauchst, aber lieber mit einer
              klaren monatlichen Struktur arbeitest statt mit einer großen Einmalinvestition.{" "}
              <em className="italic text-white/84">
                So bleibt der Einstieg leichter, ohne beim Ergebnis auf Standard runterzugehen.
              </em>
            </p>
          </div>
        </section>

        {/* =========================================================
           CONTEXTUAL CROSS-LINK → /websites-landingpages
        ========================================================= */}
        <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16 lg:py-32">
          <div className="layout-max">
            <div data-wa-reveal>
              <ContextualCrossLink
                eyebrow="Siehe auch"
                folio="Leistung · Websites"
                lead="Du willst erst sehen, wie wir Websites grundsätzlich denken und umsetzen? Dann wirf einen Blick auf Websites & Landing Pages."
                linkLabel="Websites & Landing Pages ansehen"
                to="/websites-landingpages"
              />
            </div>
          </div>
        </section>

        {/* =========================================================
           FINAL CTA — calmer, reassuring, with ledger
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#070708] px-5 pb-32 pt-32 sm:px-8 sm:pb-40 sm:pt-40 md:px-12 md:pb-48 md:pt-48 lg:px-16 lg:pt-56">
          <div aria-hidden className="section-top-rule" />

          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[46%] aspect-square w-[118vw] max-w-[1180px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.048) 0%, rgba(255,255,255,0.016) 32%, transparent 62%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 72% 62% at 50% 46%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[66rem] text-center">
              <div className="mb-14 inline-flex sm:mb-20">
                <ChapterMarker num="END" label="Gespräch" align="center" variant="end" />
              </div>

              <h2 className="font-instrument text-[2.5rem] leading-[0.97] tracking-[-0.038em] text-white sm:text-[3.4rem] md:text-[4.6rem] lg:text-[5.6rem] xl:text-[6.4rem]">
                <span className="block">
                  {["Lass", "uns", "schauen,", "ob", "Website", "im", "Abo"].map((w, i) => (
                    <span
                      key={`fa-${i}`}
                      className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-wa-finala className="inline-block">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/76 sm:mt-2">
                  {["zu", "deinem", "Unternehmen", "passt."].map((w, i) => (
                    <span
                      key={`fb-${i}`}
                      className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-wa-finalb className="inline-block">
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
                    data-wa-finalrule
                    className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  />
                </div>
                <span aria-hidden className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40">
                  ·
                </span>
              </div>

              <p className="font-ui mx-auto mt-10 max-w-[40rem] text-[15px] leading-[1.72] text-white/60 md:mt-12 md:text-[16.5px]">
                Wenn du eine professionelle Website willst, aber die Investition lieber planbar
                monatlich strukturieren möchtest, sprechen wir offen darüber, welches Modell sinnvoll
                ist.
              </p>

              {/* Ledger block — warmer metadata: Modell / Laufzeit / Direkt */}
              <div className="mt-14 grid items-center gap-10 text-left sm:mt-18 sm:grid-cols-[auto_1fr] sm:gap-14 md:gap-20">
                <div data-wa-finalcta className="flex justify-center sm:justify-start">
                  <Link
                    to="/kontakt"
                    className="group relative inline-flex items-center gap-3 rounded-full border border-white/22 bg-white py-4 pl-8 pr-3 text-[15px] font-medium tracking-wide text-[#0A0A0A] no-underline shadow-[0_34px_80px_-32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.45)] magicks-duration-hover magicks-ease-out transition-[transform,box-shadow] hover:-translate-y-[2px] hover:shadow-[0_44px_90px_-28px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.55)] active:translate-y-0 active:scale-[0.985] md:text-[16px]"
                  >
                    <span>Unverbindlich anfragen</span>
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
                  <div data-wa-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Modell
                    </span>
                    <span className="font-instrument text-[1.2rem] italic leading-[1.3] text-white/90 sm:text-[1.4rem] md:text-[1.5rem]">
                      Einstieg monatlich · ohne Einmalzahlung
                    </span>
                  </div>

                  <div data-wa-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Laufzeit
                    </span>
                    <span className="font-ui text-[13.5px] leading-[1.5] text-white/62 sm:text-[14.5px]">
                      Flexibel und im Gespräch festgelegt — nichts Starres.
                    </span>
                  </div>

                  <div data-wa-finalledger className="flex flex-col gap-1.5">
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

            {/* Bottom-edge colophon */}
            <div className="mt-24 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-7 sm:mt-28 sm:flex-row">
              <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/42 sm:text-[10.5px]">
                § End — Modell · Abo · Magicks · MMXXVI
              </span>
              <span aria-hidden className="hidden h-px w-20 bg-white/14 sm:block" />
              <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/42 sm:text-[10.5px]">
                Kein Druck · Kein Standard-Pitch
              </span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
