import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { ChapterMarker } from "../../components/home/ChapterMarker";
import { ContextualCrossLink } from "../../components/service/ContextualCrossLink";
import { SectionTransition } from "../../components/service/SectionTransition";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { registerGsap } from "../../lib/gsap";
import { presenceEnvelope, rackFocusTrack } from "../../lib/scrollMotion";
import { RouteSEO } from "../../seo/RouteSEO";

/* ------------------------------------------------------------------
 * /content-bildwelt-medien — supporting service landing page.
 *
 * Strategic role:
 *   Content, Bildwelt and media production are positioned as a
 *   supporting capability that strengthens MAGICKS web projects, not
 *   as a fifth main service. The page deliberately mirrors the
 *   editorial cadence of /seo-sichtbarkeit so the two new pages read
 *   as a paired set: same chapter folios, same six-section structure,
 *   same restrained register, same final CTA cartouche.
 *
 * Sections (mirrors the brief verbatim):
 *   · Hero               — ChapterMarker, eyebrow, H1, lead, CTA
 *   · § 01  Grundsatz    — content as part of the work, not late dressing
 *   · § 02  Was entstehen — 12-item editorial register grid
 *           kann
 *   · § 03  Warum das    — why media matter for trust and recognition
 *           wichtig ist
 *   · § 04  Eigene Medien — own visual direction, no stock-default
 *           statt Stock-Optik
 *   · § 05  Verbindung   — content as a part of webdesign, not parallel
 *           mit Webdesign
 *   · § 06  Ergebnis     — closing centered statement
 *   · § Orientierung     — internal cross-link gate
 *   · § END  Projekt     — final CTA cartouche
 * ------------------------------------------------------------------ */

const CHAPTER = { num: "Support", label: "Content, Bildwelt & Medien" } as const;
const HERO_EYEBROW = "Unterstützende Leistung · Content & Medien";

const H1_LINE_A = ["Bildwelt", "statt"];
const H1_LINE_B = ["Platzhalter."];

const HERO_LEAD =
  "Ein starker digitaler Auftritt lebt nicht nur von Layout und Code. Er braucht Bilder, Texte, Bewegung und eine visuelle Sprache, die zum Unternehmen passt.";

const HERO_LEAD_SUPPORT =
  "Bei MAGICKS können Content, Bildbearbeitung, Foto, Video, Motion Design und 3D-Visuals direkt im Projekt entstehen — damit eine Website nicht wie ein Template wirkt, sondern wie eine echte Marke.";

const GRUNDSATZ_P1 =
  "Viele Websites scheitern nicht an der Technik, sondern an fehlender Bildwelt, schwachen Texten und austauschbaren Inhalten.";
const GRUNDSATZ_P2 =
  "Deshalb denken wir Content und Medien nicht als spätes Dekor, sondern als Teil der Wirkung: Was sieht man zuerst? Was versteht man sofort? Was bleibt im Kopf?";

const PRODUCTIONS: string[] = [
  "Website-Texte",
  "Hero-Texte",
  "Leistungsbeschreibungen",
  "Bildkonzepte",
  "eigene Fotos",
  "Bildbearbeitung & Retusche",
  "Social-Media-Visuals",
  "kurze Video-Snippets",
  "Motion Design",
  "Logo-Animationen",
  "3D-Visuals",
  "Produkt- oder Servicevisualisierungen",
];

const WARUM_BODY =
  "Gute Medien machen ein Angebot schneller verständlich. Sie erzeugen Atmosphäre, Vertrauen und Wiedererkennung — besonders bei lokalen Dienstleistern, hochwertigen Services, erklärungsbedürftigen Produkten und digitalen Kampagnen.";

const STOCK_BODY =
  "Stockbilder können funktionieren, aber sie machen selten eigenständig. Wenn ein Projekt es braucht, entwickeln wir eine eigene visuelle Richtung: Licht, Bildstil, Komposition, Motion, 3D oder bearbeitete Motive.";

const VERBINDUNG_BODY =
  "Medien entstehen nicht getrennt von der Website. Hero-Bereich, Bildsprache, Text, CTA, Layout und Animation müssen zusammen funktionieren.";

const ERGEBNIS =
  "Ein digitaler Auftritt, der nicht nur technisch sauber ist, sondern visuell eigenständig wirkt.";

const RELATED: { to: string; eyebrow: string; folio: string; lead: string; linkLabel: string }[] = [
  {
    to: "/websites-landingpages",
    eyebrow: "Verwandt · Kern",
    folio: "Plate · Websites & Landing Pages",
    lead:
      "Wenn aus Content und Bildwelt eine ganze Seite werden soll: Struktur, Design, Technik und Inhalte als ein Stück Arbeit.",
    linkLabel: "Mehr zu Websites & Landing Pages",
  },
  {
    to: "/seo-sichtbarkeit",
    eyebrow: "Verwandt · Sichtbarkeit",
    folio: "Plate · SEO & Sichtbarkeit",
    lead:
      "Inhalte, die für Menschen lesbar und für Suchsysteme verständlich sind — die zweite Hälfte der Wirkung.",
    linkLabel: "Mehr zu SEO & Sichtbarkeit",
  },
  {
    to: "/projekte",
    eyebrow: "Verwandt · Beispiele",
    folio: "Plate · Projekte",
    lead:
      "Ein Blick darauf, wie Content, Bildwelt und Layout in laufenden Projekten zusammenfinden.",
    linkLabel: "Projekte ansehen",
  },
];

export default function ContentBildweltMedienPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroSection = root.querySelector<HTMLElement>("[data-cbm-hero]");
      const heroCopy = root.querySelector<HTMLElement>("[data-cbm-herocopy]");
      const heroChapter = root.querySelector<HTMLElement>("[data-cbm-chapter]");
      const heroEyebrow = root.querySelector<HTMLElement>("[data-cbm-eyebrow]");
      const heroLineA = gsap.utils.toArray<HTMLElement>("[data-cbm-h1a]");
      const heroLineB = gsap.utils.toArray<HTMLElement>("[data-cbm-h1b]");
      const heroH1 = root.querySelector<HTMLElement>("[data-cbm-h1]");
      const heroLead = root.querySelector<HTMLElement>("[data-cbm-lead]");
      const heroSupport = root.querySelector<HTMLElement>("[data-cbm-support]");
      const heroCta = root.querySelector<HTMLElement>("[data-cbm-cta]");
      const heroCtaRule = root.querySelector<HTMLElement>("[data-cbm-cta-rule]");
      const heroCredit = root.querySelector<HTMLElement>("[data-cbm-credit]");

      const reveals = gsap.utils.toArray<HTMLElement>("[data-cbm-reveal]");
      const ergebnisLines = gsap.utils.toArray<HTMLElement>("[data-cbm-ergebnis]");
      const finalLineA = gsap.utils.toArray<HTMLElement>("[data-cbm-finala]");
      const finalLineB = gsap.utils.toArray<HTMLElement>("[data-cbm-finalb]");
      const finalRule = root.querySelector<HTMLElement>("[data-cbm-finalrule]");
      const finalLedger = gsap.utils.toArray<HTMLElement>("[data-cbm-finalledger]");
      const finalCta = root.querySelector<HTMLElement>("[data-cbm-finalcta]");

      if (reduced) {
        gsap.set(
          [
            heroChapter,
            heroEyebrow,
            ...heroLineA,
            ...heroLineB,
            heroLead,
            heroSupport,
            heroCta,
            heroCtaRule,
            heroCredit,
            ...reveals,
            ...ergebnisLines,
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

      gsap.set(heroChapter, { opacity: 0, y: 12 });
      gsap.set(heroEyebrow, { opacity: 0, y: 10 });
      gsap.set([...heroLineA, ...heroLineB], { yPercent: 118, opacity: 0 });
      if (heroH1) gsap.set(heroH1, { letterSpacing: "0.008em" });
      gsap.set(heroLead, { opacity: 0, y: 16 });
      gsap.set(heroSupport, { opacity: 0, y: 12 });
      gsap.set(heroCta, { opacity: 0, y: 14 });
      gsap.set(heroCtaRule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(heroCredit, { opacity: 0, y: 8 });

      gsap
        .timeline({ delay: 0.12, defaults: { ease: "power3.out" } })
        .to(heroChapter, { opacity: 1, y: 0, duration: 0.9 }, 0)
        .to(heroEyebrow, { opacity: 1, y: 0, duration: 0.85 }, 0.3)
        .to(
          heroLineA,
          { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: "power4.out" },
          0.42,
        )
        .to(
          heroLineB,
          { yPercent: 0, opacity: 1, duration: 1.3, stagger: 0.08, ease: "power4.out" },
          0.7,
        )
        .to(heroH1, { letterSpacing: "-0.034em", duration: 1.6, ease: "power2.out" }, 0.55)
        .to(heroLead, { opacity: 1, y: 0, duration: 1.0 }, 1.18)
        .to(heroSupport, { opacity: 1, y: 0, duration: 0.95 }, 1.42)
        .to(heroCta, { opacity: 1, y: 0, duration: 0.95 }, 1.65)
        .to(heroCtaRule, { scaleX: 1, duration: 1.15, ease: "power2.inOut" }, 1.75)
        .to(heroCredit, { opacity: 1, y: 0, duration: 1.0 }, 2.05);

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

      presenceEnvelope(reveals, {
        start: "top 90%",
        end: "bottom 10%",
        yFrom: 22,
        yTo: -14,
        blur: 4,
        holdRatio: 0.5,
        scrub: 0.95,
      });

      if (finalLineA.length || finalLineB.length) {
        const finalSection =
          (finalLineA[0] as HTMLElement | undefined)?.closest("section") ??
          (finalLineB[0] as HTMLElement | undefined)?.closest("section") ??
          finalLineA[0] ??
          finalLineB[0];

        gsap.set([...finalLineA, ...finalLineB], {
          yPercent: 36,
          opacity: 0,
          filter: "blur(6px)",
        });
        gsap.to([...finalLineA, ...finalLineB], {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.09,
          scrollTrigger: {
            trigger: finalSection,
            start: "top 84%",
            end: "top 38%",
            scrub: 1.0,
            invalidateOnRefresh: true,
          },
        });

        if (finalRule) {
          gsap.set(finalRule, { scaleX: 0, transformOrigin: "center" });
          gsap.to(finalRule, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: finalSection,
              start: "top 66%",
              end: "top 34%",
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          });
        }

        if (finalCta) {
          gsap.set(finalCta, { opacity: 0, y: 16 });
          gsap.to(finalCta, {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: finalSection,
              start: "top 60%",
              end: "top 30%",
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          });
        }

        if (finalLedger.length) {
          rackFocusTrack(finalLedger, {
            trigger: finalSection,
            start: "top 58%",
            end: "top 22%",
            blur: 3,
            opacityFloor: 0.24,
            scrub: 1.0,
          });
        }
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/content-bildwelt-medien" />

      <main
        ref={rootRef}
        className="relative bg-[#0A0A0A] pb-0 pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.5rem]"
      >
        {/* =========================================================
           § 00 — HERO
        ========================================================= */}
        <section
          data-cbm-hero
          className="relative overflow-hidden px-5 pb-28 sm:px-8 sm:pb-32 md:px-12 md:pb-40 lg:px-16 lg:pb-48"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 104px)",
              maskImage:
                "radial-gradient(ellipse 60% 68% at 30% 56%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 68% at 30% 56%, black, transparent)",
            }}
          />

          <div
            data-cbm-credit
            aria-hidden
            className="pointer-events-none absolute bottom-14 left-5 z-10 hidden md:block lg:bottom-16 lg:left-8"
          >
            <span className="hero-vertical-credit">
              MAGICKS &nbsp;·&nbsp; SUPPORT &nbsp;·&nbsp; MEDIA &nbsp;·&nbsp; EDITION MMXXVI
            </span>
          </div>

          <div className="relative layout-max">
            <div data-cbm-herocopy>
              <div data-cbm-chapter className="mb-10 sm:mb-14">
                <ChapterMarker num={CHAPTER.num} label={CHAPTER.label} />
              </div>

              <p
                data-cbm-eyebrow
                className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/52 sm:mb-10 sm:text-[10.5px]"
              >
                {HERO_EYEBROW}
              </p>

              <h1
                data-cbm-h1
                className="font-instrument max-w-[60rem] text-[2.3rem] leading-[0.98] tracking-[-0.034em] text-white sm:text-[3rem] md:text-[3.85rem] lg:text-[4.5rem] xl:text-[5rem]"
              >
                <span className="block">
                  {H1_LINE_A.map((w, i) => (
                    <span
                      key={`a-${i}`}
                      className="mr-[0.22em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-cbm-h1a className="inline-block will-change-[transform,opacity]">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/64 sm:mt-2">
                  {H1_LINE_B.map((w, i) => (
                    <span
                      key={`b-${i}`}
                      className="mr-[0.22em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-cbm-h1b className="inline-block will-change-[transform,opacity]">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>

              <div className="mt-10 max-w-[46rem] sm:mt-12 md:mt-14">
                <p
                  data-cbm-lead
                  className="font-ui text-[15px] leading-[1.72] text-white/64 md:text-[16px]"
                >
                  {HERO_LEAD}
                </p>
                <p
                  data-cbm-support
                  className="font-ui mt-6 max-w-[42rem] border-t border-white/[0.08] pt-5 text-[13.5px] leading-[1.7] text-white/48 md:text-[14px]"
                >
                  {HERO_LEAD_SUPPORT}
                </p>
              </div>

              <div
                data-cbm-cta
                className="mt-12 inline-flex items-baseline gap-3 sm:mt-14 md:mt-16"
              >
                <Link
                  to="/kontakt"
                  className="group relative inline-flex items-baseline gap-3 text-[15px] font-medium tracking-[-0.005em] text-white no-underline sm:text-[16px] md:text-[17px]"
                  aria-label="Projekt besprechen"
                >
                  <span className="relative pb-3">
                    <span className="font-ui">Projekt besprechen</span>
                    <span
                      data-cbm-cta-rule
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
                    ↗︎
                  </span>
                </Link>

                <Link
                  to="/websites-landingpages"
                  className="group ml-6 hidden items-baseline gap-3 text-[14.5px] font-medium tracking-[-0.005em] text-white/68 no-underline sm:inline-flex sm:text-[15px] md:text-[15.5px]"
                  aria-label="Mehr zu Websites & Landing Pages"
                >
                  <span className="relative pb-3">
                    <span className="font-ui">Mehr zu Websites & Landing Pages</span>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 block h-px bg-white/16"
                    />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 00  Hero — Support" to="§ 01  Grundsatz" />

        {/* =========================================================
           § 01 — GRUNDSATZ
        ========================================================= */}
        <section className="relative bg-[#080809] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-cbm-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                    § 01 — Grundsatz
                  </p>
                  <ChapterMarker num="01" label="Haltung" />
                </div>
              </div>

              <div>
                <h2
                  data-cbm-reveal
                  className="font-instrument max-w-[48rem] text-[2rem] leading-[1.05] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]"
                >
                  Inhalt und Bildwelt sind <em className="italic text-white/60">kein spätes Dekor</em>.
                </h2>

                <div className="mt-10 max-w-[46rem] space-y-6 md:mt-12">
                  <p
                    data-cbm-reveal
                    className="font-ui text-[15px] leading-[1.72] text-white/66 md:text-[16px]"
                  >
                    {GRUNDSATZ_P1}
                  </p>
                  <p
                    data-cbm-reveal
                    className="font-ui text-[15px] leading-[1.72] text-white/66 md:text-[16px]"
                  >
                    {GRUNDSATZ_P2}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 01  Grundsatz" to="§ 02  Register" />

        {/* =========================================================
           § 02 — WAS ENTSTEHEN KANN
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-cbm-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                    § 02 — Register
                  </p>
                  <ChapterMarker num="02" label="Was entstehen kann" />
                  <span
                    aria-hidden
                    className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]"
                  >
                    {String(PRODUCTIONS.length).padStart(2, "0")} Bausteine · MMXXVI
                  </span>
                </div>
              </div>

              <div>
                <h2
                  data-cbm-reveal
                  className="font-instrument max-w-[48rem] text-[2rem] leading-[1.05] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]"
                >
                  Was <em className="italic text-white/60">entstehen kann</em>.
                </h2>

                <p
                  data-cbm-reveal
                  className="font-ui mt-7 max-w-[42rem] text-[15px] leading-[1.7] text-white/58 md:mt-9 md:text-[15.5px]"
                >
                  Je nach Projekt sind das einzelne Bausteine — manchmal nur ein Hero-Bild, manchmal
                  eine vollständige eigene Bildwelt. Was zusammen funktioniert, entscheidet das
                  Projekt, nicht das Paket.
                </p>

                <ol className="mt-12 grid gap-x-12 gap-y-0 border-t border-white/[0.07] md:mt-16 md:grid-cols-2">
                  {PRODUCTIONS.map((item, i) => (
                    <li
                      key={item}
                      data-cbm-reveal
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 border-b border-white/[0.07] py-6 md:gap-x-8 md:py-7"
                    >
                      <span className="font-mono pt-[0.32rem] text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/50 md:text-[11.5px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-instrument text-[1.18rem] leading-[1.22] tracking-[-0.014em] text-white md:text-[1.32rem] lg:text-[1.42rem]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ol>

                <div
                  data-cbm-reveal
                  className="font-mono mt-6 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:mt-8"
                >
                  <span>Register · Was entstehen kann</span>
                  <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                  <span className="tabular-nums">12 Bausteine · MMXXVI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 02  Register" to="§ 03  Wirkung" />

        {/* =========================================================
           § 03 — WARUM DAS WICHTIG IST
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-20 lg:gap-28">
              <div data-cbm-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                  § 03 — Warum das wichtig ist
                </p>
                <h2 className="font-instrument text-[2rem] leading-[1.05] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]">
                  Atmosphäre, Vertrauen,{" "}
                  <em className="italic text-white/60">Wiedererkennung</em>.
                </h2>
              </div>

              <div data-cbm-reveal className="md:pt-3">
                <p className="font-ui text-[15px] leading-[1.72] text-white/66 md:text-[16px]">
                  {WARUM_BODY}
                </p>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 03  Wirkung" to="§ 04  Eigene Medien" />

        {/* =========================================================
           § 04 — EIGENE MEDIEN STATT STOCK-OPTIK
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-cbm-reveal className="md:pt-2">
                <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                  § 04 — Eigene Medien statt Stock-Optik
                </p>
              </div>

              <div>
                <h2
                  data-cbm-reveal
                  className="font-instrument max-w-[48rem] text-[2rem] leading-[1.05] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]"
                >
                  Wenn ein Projekt es <em className="italic text-white/60">braucht</em>.
                </h2>

                <p
                  data-cbm-reveal
                  className="font-ui mt-10 max-w-[44rem] text-[15px] leading-[1.72] text-white/64 md:mt-12 md:text-[16px]"
                >
                  {STOCK_BODY}
                </p>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 04  Eigene Medien" to="§ 05  Verbindung" />

        {/* =========================================================
           § 05 — VERBINDUNG MIT WEBDESIGN
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-cbm-reveal className="md:pt-2">
                <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                  § 05 — Verbindung mit Webdesign
                </p>
              </div>

              <div>
                <h2
                  data-cbm-reveal
                  className="font-instrument max-w-[48rem] text-[2rem] leading-[1.05] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]"
                >
                  Medien sind <em className="italic text-white/60">Teil der Seite</em>.
                </h2>

                <p
                  data-cbm-reveal
                  className="font-ui mt-10 max-w-[44rem] text-[15px] leading-[1.72] text-white/64 md:mt-12 md:text-[16px]"
                >
                  {VERBINDUNG_BODY}
                </p>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 05  Verbindung" to="§ 06  Ergebnis" tone="darker" />

        {/* =========================================================
           § 06 — ERGEBNIS
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#070708] px-5 py-32 sm:px-8 sm:py-40 md:px-12 md:py-52 lg:px-16 lg:py-56">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.7]"
            style={{
              background:
                "radial-gradient(ellipse 60% 46% at 50% 50%, rgba(255,255,255,0.03), transparent 64%)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[60rem] text-center">
              <div className="mb-14 flex items-center justify-center gap-5 sm:mb-20">
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-20" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
                  § 06 — Ergebnis
                </span>
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-20" />
              </div>

              <p
                data-cbm-ergebnis
                className="font-instrument text-[1.65rem] leading-[1.32] tracking-[-0.018em] text-white sm:text-[2.05rem] md:text-[2.5rem] lg:text-[2.85rem]"
              >
                {ERGEBNIS}
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
           § Orientierung — internal cross-links
        ========================================================= */}
        <section className="relative bg-[#080809] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="mb-20 flex items-center gap-5 sm:mb-24">
              <span aria-hidden className="h-px w-14 bg-white/24 sm:w-20" />
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
                § Orientierung
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/12" />
            </div>

            <div className="space-y-14 sm:space-y-16 md:space-y-20">
              {RELATED.map((r) => (
                <div key={r.to} data-cbm-reveal>
                  <ContextualCrossLink
                    eyebrow={r.eyebrow}
                    folio={r.folio}
                    lead={r.lead}
                    linkLabel={r.linkLabel}
                    to={r.to}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <SectionTransition from="§ Orientierung" to="§ END  Projekt" tone="darker" />

        {/* =========================================================
           § END — FINAL CTA
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#070708] px-5 pb-32 pt-32 sm:px-8 sm:pb-40 sm:pt-40 md:px-12 md:pb-48 md:pt-48 lg:px-16 lg:pt-56">
          <div aria-hidden className="section-top-rule" />

          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[46%] aspect-square w-[118vw] max-w-[1180px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.014) 32%, transparent 62%)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[68rem] text-center">
              <div className="mb-14 inline-flex sm:mb-20">
                <ChapterMarker num="END" label="Projekt" align="center" variant="end" />
              </div>

              <h2 className="font-instrument text-[2.4rem] leading-[0.98] tracking-[-0.036em] text-white sm:text-[3.4rem] md:text-[4.5rem] lg:text-[5.3rem] xl:text-[5.9rem]">
                <span className="block">
                  <span className="mr-[0.18em] inline-block overflow-hidden align-bottom">
                    <span data-cbm-finala className="inline-block">
                      Projekt
                    </span>
                  </span>
                  <span className="mr-[0.18em] inline-block overflow-hidden align-bottom">
                    <span data-cbm-finalb className="inline-block italic text-white/72">
                      besprechen.
                    </span>
                  </span>
                </span>
              </h2>

              <div className="mx-auto mt-12 flex w-full max-w-[42rem] items-center gap-4 sm:mt-16">
                <span
                  aria-hidden
                  className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40"
                >
                  ·
                </span>
                <div aria-hidden className="relative h-px flex-1">
                  <span
                    data-cbm-finalrule
                    className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  />
                </div>
                <span
                  aria-hidden
                  className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40"
                >
                  ·
                </span>
              </div>

              <p className="font-ui mx-auto mt-10 max-w-[44rem] text-[15px] leading-[1.72] text-white/62 md:mt-12 md:text-[16.5px]">
                Kurz beschreiben, welche Inhalte oder Bilder Ihrem Auftritt fehlen — wir melden
                uns mit einer klaren Einschätzung. Kein Druck, kein Standard-Pitch.
              </p>

              <div className="mt-14 grid items-center gap-10 text-left sm:mt-18 sm:grid-cols-[auto_1fr] sm:gap-14 md:gap-20">
                <div data-cbm-finalcta className="flex justify-center sm:justify-start">
                  <Link
                    to="/kontakt"
                    className="group relative inline-flex items-center gap-3 rounded-full border border-white/22 bg-white py-4 pl-8 pr-3 text-[15px] font-medium tracking-wide text-[#0A0A0A] no-underline shadow-[0_34px_80px_-32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.45)] magicks-duration-hover magicks-ease-out transition-[transform,box-shadow] hover:-translate-y-[2px] hover:shadow-[0_44px_90px_-28px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.55)] active:translate-y-0 active:scale-[0.985] md:text-[16px]"
                  >
                    <span>Unverbindlich anfragen</span>
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

                <div className="flex flex-col gap-5 border-l border-white/[0.08] pl-6 sm:pl-10 md:pl-12">
                  <div data-cbm-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Studio
                    </span>
                    <span className="font-instrument text-[1.2rem] italic leading-[1.3] text-white/90 sm:text-[1.4rem] md:text-[1.5rem]">
                      Kassel · Nordhessen
                    </span>
                  </div>

                  <div data-cbm-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Antwort
                    </span>
                    <span className="font-ui text-[14px] leading-[1.5] text-white/72 sm:text-[14.5px] md:text-[15px]">
                      In der Regel binnen 24 Stunden — werktags.
                    </span>
                  </div>

                  <div data-cbm-finalledger className="flex flex-col gap-1.5">
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

            <div className="mt-24 border-t border-white/[0.06] pt-7 sm:mt-28">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-0">
                {[
                  { k: "§ End", v: "Support · Content & Medien" },
                  { k: "Studio", v: "Kassel · Nordhessen" },
                  { k: "Rolle", v: "Unterstützend · Projektbasiert" },
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
