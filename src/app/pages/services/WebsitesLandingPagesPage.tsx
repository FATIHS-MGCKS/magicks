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
 * /websites-landingpages — bespoke editorial landing page.
 *
 * Emphasis: quality, design, clarity, performance, user guidance.
 * Visual language: sharp, editorial, digital-precise.
 *
 * Sections:
 *   · Hero                — chapter folio, two-line serif H1, CTA, meta triad, vertical credit
 *   · Statement 01        — "Er muss auch funktionieren." + cross-ref forward
 *   · Audience            — "Für Unternehmen, die digital besser auftreten"
 *   · Includes            — 6-item editorial grid w/ "01 / 06 Umfang" ledger
 *   · Approach            — editorial prose w/ display-italic pull
 *   · Negation            — "Was du nicht bekommst" — big hanging declarations
 *   · Ceremonial Pull     — "Websites, die wirken..." (own moment, hairline gates)
 *   · Cross-link          — /website-im-abo
 *   · Final CTA           — serif headline + session ledger + white pill
 * ------------------------------------------------------------------ */

const INCLUDES: { title: string; body: string }[] = [
  {
    title: "Strategie & Struktur",
    body:
      "Wir denken nicht einfach in Sektionen, sondern in Nutzerführung, Klarheit und Wirkung.",
  },
  {
    title: "Design mit Anspruch",
    body:
      "Individuelles, hochwertiges Webdesign statt Baukastenoptik oder Template-Look.",
  },
  {
    title: "Content & Copywriting",
    body:
      "Texte, die führen statt füllen — Hero-Aussagen, Leistungsbeschreibungen und CTAs, die zum Auftritt passen.",
  },
  {
    title: "Bildwelt & Medien",
    body:
      "Bildauswahl, Bildbearbeitung oder eigene Visuals, damit der Auftritt nicht mit Stock-Optik startet.",
  },
  {
    title: "Saubere Entwicklung",
    body:
      "Schnelle, moderne und responsive Umsetzung mit Fokus auf Performance und Stabilität.",
  },
  {
    title: "Landing Pages mit Ziel",
    body:
      "Seiten, die nicht nur hübsch sind, sondern gezielt auf Anfragen, Leads oder Verkäufe einzahlen.",
  },
  {
    title: "SEO-Grundlagen & Sichtbarkeit",
    body:
      "Saubere Seitenstruktur, Meta-Logik, Überschriftenhierarchie und technische Basis für gute Auffindbarkeit.",
  },
  {
    title: "Integrationen",
    body:
      "Formulare, CRM, Tracking, Terminbuchung, Automationen oder andere Systeme, die mit der Seite zusammenspielen müssen.",
  },
];

const AUDIENCE: string[] = [
  "einen hochwertigen digitalen Markenauftritt brauchst",
  "eine Landing Page für ein konkretes Angebot oder eine Kampagne willst",
  "deine bisherige Website nicht mehr zu deinem Anspruch passt",
  "Anfragen, Sichtbarkeit oder Conversion verbessern willst",
  "eine Seite brauchst, die nicht nur modern aussieht, sondern klar führt",
];

export default function WebsitesLandingPagesPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      // ——— Hero intro timeline ———
      const heroChapter = root.querySelector<HTMLElement>("[data-wl-chapter]");
      const heroLineA = gsap.utils.toArray<HTMLElement>("[data-wl-h1a]");
      const heroLineB = gsap.utils.toArray<HTMLElement>("[data-wl-h1b]");
      const heroH1 = root.querySelector<HTMLElement>("[data-wl-h1]");
      const heroLead = root.querySelector<HTMLElement>("[data-wl-lead]");
      const heroCta = root.querySelector<HTMLElement>("[data-wl-cta]");
      const heroCtaRule = root.querySelector<HTMLElement>("[data-wl-cta-rule]");
      const heroMeta = gsap.utils.toArray<HTMLElement>("[data-wl-meta]");
      const heroSpecimen = root.querySelector<HTMLElement>("[data-wl-specimen]");
      const heroCredit = root.querySelector<HTMLElement>("[data-wl-credit]");
      const heroSection = root.querySelector<HTMLElement>("[data-wl-hero]");
      const heroCopy = root.querySelector<HTMLElement>("[data-wl-herocopy]");

      // ——— Scroll-reveal groups ———
      const reveals = gsap.utils.toArray<HTMLElement>("[data-wl-reveal]");
      const pullLines = gsap.utils.toArray<HTMLElement>("[data-wl-pull]");
      const pullHeading = root.querySelector<HTMLElement>("[data-wl-pullheading]");
      const finalLineA = gsap.utils.toArray<HTMLElement>("[data-wl-finala]");
      const finalLineB = gsap.utils.toArray<HTMLElement>("[data-wl-finalb]");
      const finalRule = root.querySelector<HTMLElement>("[data-wl-finalrule]");
      const finalLedger = gsap.utils.toArray<HTMLElement>("[data-wl-finalledger]");
      const finalCta = root.querySelector<HTMLElement>("[data-wl-finalcta]");

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
            heroSpecimen,
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
      gsap.set(heroSpecimen, { opacity: 0 });
      gsap.set(heroCredit, { opacity: 0, y: 8 });

      gsap
        .timeline({ delay: 0.15, defaults: { ease: "power3.out" } })
        .to(heroChapter, { opacity: 1, y: 0, duration: 0.9 }, 0)
        .to(heroSpecimen, { opacity: 1, duration: 1.6, ease: "power2.out" }, 0.1)
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
        // Letter-spacing settle on H1 — signature cinematic move
        .to(
          heroH1,
          {
            letterSpacing: "-0.038em",
            duration: 1.6,
            ease: "power2.out",
          },
          0.45,
        )
        .to(heroLead, { opacity: 1, y: 0, duration: 1.0 }, 1.05)
        .to(heroCta, { opacity: 1, y: 0, duration: 0.95 }, 1.4)
        .to(heroCtaRule, { scaleX: 1, duration: 1.15, ease: "power2.inOut" }, 1.5)
        .to(heroMeta, { opacity: 1, y: 0, duration: 0.85, stagger: 0.09 }, 1.65)
        .to(heroCredit, { opacity: 1, y: 0, duration: 1.0 }, 1.9);

      // ——— Hero camera push — very subtle scroll-linked drift on copy ———
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

      // ——— Scroll-triggered line/word reveals ———
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

      // ——— Ceremonial pull statement — three stacked lines arriving sequentially ———
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
            duration: 1.3,
            ease: "power4.out",
            stagger: 0.12,
          });
        if (pullHeading) {
          tl.to(
            pullHeading,
            { letterSpacing: "-0.038em", duration: 1.6, ease: "power2.out" },
            0.15,
          );
        }
      }

      // ——— Final CTA choreography — headline, rule, ledger, CTA ———
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
      <RouteSEO path="/websites-landingpages" />

      <main
        ref={rootRef}
        className="relative bg-[#0A0A0A] pb-0 pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.5rem]"
      >
        {/* =========================================================
           HERO
        ========================================================= */}
        <section
          data-wl-hero
          className="relative overflow-hidden px-5 pb-28 sm:px-8 sm:pb-32 md:px-12 md:pb-44 lg:px-16 lg:pb-52"
        >
          {/* Specimen / baseline-grid hint — a quiet reference to measurement + precision */}
          <div
            data-wl-specimen
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.42]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px)",
              backgroundSize: "100% 56px",
              maskImage:
                "radial-gradient(ellipse 55% 72% at 24% 62%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 55% 72% at 24% 62%, black, transparent)",
            }}
          />

          {/* Vertical editorial credit — pinned to the left edge, fades on scroll */}
          <div
            data-wl-credit
            aria-hidden
            className="pointer-events-none absolute bottom-14 left-5 z-10 hidden md:block lg:bottom-16 lg:left-8"
          >
            <span className="hero-vertical-credit">
              MAGICKS &nbsp;·&nbsp; LEISTUNG 02 &nbsp;·&nbsp; WEBSITES &nbsp;·&nbsp; SPECIMEN MMXXVI
            </span>
          </div>

          <div className="relative layout-max">
            <div data-wl-herocopy>
              <div data-wl-chapter className="mb-10 sm:mb-14">
                <ChapterMarker num="02" label="Leistungen / Websites" />
              </div>

              {/* H1 — two-line mask-reveal, word by word, letter-spacing settle on reveal */}
              <h1
                data-wl-h1
                className="font-instrument max-w-[62rem] text-[2.4rem] leading-[0.98] tracking-[-0.038em] text-white sm:text-[3.1rem] md:text-[4.1rem] lg:text-[4.8rem] xl:text-[5.6rem]"
              >
                <span className="block">
                  {["Websites", "&", "Landing", "Pages,"].map((w, i) => (
                    <span
                      key={`a-${i}`}
                      className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-wl-h1a className="inline-block will-change-[transform,opacity]">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/62 sm:mt-2">
                  {["die", "nicht", "nach", "Standard", "aussehen."].map((w, i) => (
                    <span
                      key={`b-${i}`}
                      className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-wl-h1b className="inline-block will-change-[transform,opacity]">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>

              {/* Intro — two-paragraph lead */}
              <div data-wl-lead className="mt-10 max-w-[44rem] sm:mt-12 md:mt-14">
                <p className="font-instrument text-[1.3rem] italic leading-[1.35] tracking-[-0.01em] text-white/82 sm:text-[1.5rem] md:text-[1.65rem]">
                  Keine Templates. Kein Mittelmaß.
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/58 md:text-[16px] md:leading-[1.72]">
                  Websites und Landing Pages, die deine Marke stark nach außen tragen, Nutzer klar
                  führen und mit Struktur, Inhalt, Bildwelt und Technik Vertrauen aufbauen.
                </p>
              </div>

              {/* CTA — text-link magazine style */}
              <div
                data-wl-cta
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
                      data-wl-cta-rule
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
              </div>

              {/* Meta triad — three small mono markers, almost a typographic specimen.
                  Mobile: column stack (prevents awkward wrap + dead space). */}
              <div className="mt-12 flex flex-col gap-2 sm:mt-18 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-3 md:mt-20">
                {["Design", "Entwicklung", "Performance"].map((m, i) => (
                  <span
                    key={m}
                    data-wl-meta
                    className="font-mono flex items-center gap-3 text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/52 sm:text-[10.5px]"
                  >
                    <span className="tabular-nums text-white/34">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Specimen readout — editorial trivia pinned to the lower-right of the hero */}
          <div
            data-wl-meta
            aria-hidden
            className="pointer-events-none absolute bottom-6 right-5 hidden items-center gap-4 md:right-12 md:flex lg:right-16 lg:bottom-10"
          >
            <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/34">
              Specimen · Leistung 02
            </span>
            <span aria-hidden className="h-px w-10 bg-white/18" />
            <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.26em] text-white/34">
              00:00 — 00:06 — 00:12
            </span>
          </div>
        </section>

        {/* Transition → § 01 Substanz */}
        <SectionTransition from="§ Hero — Leistungen 02" to="§ 01  Substanz" />

        {/* =========================================================
           STATEMENT 01 — "Er muss auch funktionieren."
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20 lg:gap-24">
              <div data-wl-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 01 — Substanz
                </p>
                <h2 className="font-instrument text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]">
                  Ein guter Auftritt reicht nicht.{" "}
                  <em className="italic text-white/58">Er muss auch funktionieren.</em>
                </h2>

                {/* Forward cross-ref — threads the document */}
                <div data-wl-reveal className="mt-10 flex items-center gap-4 md:mt-14">
                  <span aria-hidden className="h-px w-10 bg-white/22 md:w-14" />
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    → Siehe § 04 Arbeitsweise
                  </span>
                </div>
              </div>

              <div data-wl-reveal className="md:pt-3">
                <p className="font-ui text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Eine starke Website ist nicht einfach nur schön. Sie muss schnell laden, klar
                  strukturiert sein, auf jedem Gerät sauber funktionieren und den Nutzer sicher
                  durch die Seite führen.
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Genau darauf legen wir Wert. Wir bauen keine schönen Hüllen, die danach nichts
                  leisten. Wir entwickeln Websites und Landing Pages mit Substanz —{" "}
                  <em className="italic text-white/86">
                    designstark, technisch sauber und so aufgebaut, dass sie im echten Einsatz
                    Wirkung haben.
                  </em>
                </p>
              </div>
            </div>

            {/* Editorial visual anchor — proof for the "Substanz" claim.
                Placed at the end of § 01 so the argument is closed by a
                single, deliberate picture rather than more prose. */}
            <div className="mt-20 sm:mt-24 md:mt-28">
              <EditorialAnchor
                src="/media/services/websites/hero-brand.webp"
                alt="Premium Brand-Site auf einem Laptop auf dunklem Studiotisch: serifige Headline ‚Werkstätte · 2026‘, schlichte 4er-Navigation, eine einzelne Fassaden-Aufnahme, daneben eine handgezeichnete Skizze."
                folio="Fig. 01"
                context="Web-Entwurf"
                leftCaption="Brand-Site · Desktop"
                rightCaption="Entwurf · Studio MAGICKS"
                aspect="16/9"
                align="right"
                maxWidth="44rem"
                revealAttr="data-wl-reveal"
              />
            </div>
          </div>
        </section>

        {/* Transition → § 02 Zielbild */}
        <SectionTransition from="§ 01  Substanz" to="§ 02  Zielbild" />

        {/* =========================================================
           AUDIENCE — "Für Unternehmen, die digital besser auftreten wollen als der Rest."
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-wl-reveal className="md:pt-2">
                <ChapterMarker num="02" label="Zielbild" />
              </div>

              <div>
                <h2
                  data-wl-reveal
                  className="font-instrument max-w-[48rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Für Unternehmen, die digital{" "}
                  <em className="italic text-white/58">besser auftreten wollen</em> als der Rest.
                </h2>

                <p
                  data-wl-reveal
                  className="font-ui mt-8 max-w-xl text-[15px] leading-[1.7] text-white/56 md:mt-10 md:text-[15.5px]"
                >
                  Diese Leistung ist für Unternehmen, die mehr wollen als eine austauschbare
                  Standardseite.
                </p>

                <p
                  data-wl-reveal
                  className="font-instrument mt-10 text-[1.18rem] italic leading-[1.4] tracking-[-0.01em] text-white/72 md:text-[1.32rem]"
                >
                  Zum Beispiel, wenn du:
                </p>

                {/* Audience declarations — hanging em-dashes, display-italic, bigger */}
                <ul className="mt-10 space-y-6 md:mt-14 md:space-y-9">
                  {AUDIENCE.map((item) => (
                    <li
                      key={item}
                      data-wl-reveal
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 md:gap-x-8"
                    >
                      <span
                        aria-hidden
                        className="font-instrument text-[1.4rem] italic leading-none text-white/38 md:text-[1.7rem] lg:text-[1.85rem]"
                      >
                        —
                      </span>
                      <p className="font-instrument text-[1.35rem] leading-[1.32] tracking-[-0.012em] text-white/90 md:text-[1.6rem] lg:text-[1.78rem] xl:text-[1.9rem]">
                        {item}
                      </p>
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
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-wl-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    § 03 — Umfang
                  </p>
                  <span
                    aria-hidden
                    className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]"
                  >
                    06 / 06 Positionen
                  </span>
                </div>
              </div>

              <div>
                <h2
                  data-wl-reveal
                  className="font-instrument max-w-[48rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Was wir für dich <em className="italic text-white/58">umsetzen</em>.
                </h2>

                {/* 6-item grid — mono folios + bigger titles + better spacing */}
                <ol className="mt-14 grid gap-x-12 gap-y-12 md:mt-20 md:grid-cols-2 md:gap-y-16">
                  {INCLUDES.map((item, i) => (
                    <li
                      key={item.title}
                      data-wl-reveal
                      className="relative grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 sm:gap-x-8"
                    >
                      <span className="font-mono pt-[0.4rem] text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/40 md:text-[11.5px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-instrument text-[1.4rem] leading-[1.18] tracking-[-0.018em] text-white md:text-[1.55rem] lg:text-[1.7rem]">
                          {item.title}
                        </h3>
                        <p className="font-ui mt-3 max-w-md text-[14px] leading-[1.65] text-white/54 md:text-[14.5px]">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → § 04 Arbeitsweise */}
        <SectionTransition from="§ 03  Umfang" to="§ 04  Arbeitsweise" />

        {/* =========================================================
           APPROACH — "Wie wir daran rangehen"
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-20 lg:gap-28">
              <div data-wl-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 04 — Arbeitsweise
                </p>
                <h2 className="font-instrument text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]">
                  Wie wir daran <em className="italic text-white/58">rangehen</em>.
                </h2>
              </div>

              <div data-wl-reveal className="md:pt-3">
                <p className="font-ui text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Wir starten nicht mit einem hübschen Dribbble-Screen und hoffen, dass der Rest
                  schon passt. Wir denken zuerst an Marke, Ziel, Struktur und Nutzerfluss — und
                  bauen darauf ein Design, das auffällt, aber nicht nur dekorativ ist.
                </p>

                {/* Display pull — italic mid-paragraph, left-hung rule for gravity */}
                <div className="mt-10 flex items-start gap-5 border-l border-white/[0.12] pl-6 md:mt-12 md:pl-8">
                  <p className="font-instrument text-[1.35rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 md:text-[1.6rem] lg:text-[1.75rem]">
                    Danach entwickeln wir sauber, direkt und ohne unnötigen Leerlauf.
                  </p>
                </div>

                <p className="font-ui mt-8 text-[15px] leading-[1.72] text-white/60 md:text-[16px] md:leading-[1.72]">
                  Keine aufgeblähten Prozesse. Keine fünf Abstimmungsschleifen für Dinge, die längst
                  klar sind. Sondern ein klarer Weg zu einer Website, die hochwertig aussieht und
                  im Alltag funktioniert.
                </p>
              </div>
            </div>

            {/* Editorial visual anchor — an interface-plate crop that shows
                the same thought in practice ("Unser Ansatz beginnt mit
                Verstehen."). Deliberately a crop, not a whole device: the
                section is about how we work, not what the outside looks like. */}
            <div className="mt-20 sm:mt-24 md:mt-28">
              <EditorialAnchor
                src="/media/services/websites/detail-approach.webp"
                alt="Enger Bildausschnitt einer dunklen Website-Section: serifige Überschrift ‚Unser Ansatz beginnt mit Verstehen.‘, zwei Absätze in Off-White und ein reduzierter Gespräch-anfragen-Button."
                folio="Fig. 02"
                context="Interface-Plate"
                leftCaption="Arbeitsweise · Ausschnitt"
                rightCaption="Entwurf · § 04"
                aspect="16/9"
                align="left"
                maxWidth="46rem"
                revealAttr="data-wl-reveal"
              />
            </div>
          </div>
        </section>

        {/* Transition → § 05 Absage */}
        <SectionTransition from="§ 04  Arbeitsweise" to="§ 05  Absage" />

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
              <div data-wl-reveal className="md:pt-2">
                <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 05 — Absage
                </p>
              </div>

              <div>
                <h2
                  data-wl-reveal
                  className="font-instrument max-w-[48rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Was du von uns{" "}
                  <em className="italic text-white/58">nicht bekommst</em>.
                </h2>

                {/* Three anti-lines — larger display declarations w/ hanging em-dash */}
                <ul className="mt-14 space-y-8 md:mt-20 md:space-y-10">
                  {[
                    "Keine Website von der Stange.",
                    "Keine überladene Agentur-Präsentation.",
                    "Kein Design, das gut aussieht und danach niemanden führt.",
                  ].map((line) => (
                    <li
                      key={line}
                      data-wl-reveal
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 md:gap-x-9"
                    >
                      <span
                        aria-hidden
                        className="font-instrument text-[1.6rem] italic leading-none text-white/38 md:text-[2rem] lg:text-[2.25rem]"
                      >
                        —
                      </span>
                      <p className="font-instrument text-[1.55rem] leading-[1.28] tracking-[-0.018em] text-white/78 md:text-[2.05rem] lg:text-[2.4rem] xl:text-[2.6rem]">
                        {line}
                      </p>
                    </li>
                  ))}
                </ul>

                <p
                  data-wl-reveal
                  className="font-ui mt-16 max-w-[42rem] text-[15.5px] leading-[1.72] text-white/62 md:mt-20 md:text-[16.5px]"
                >
                  Was du bekommst, ist ein digitaler Auftritt mit{" "}
                  <em className="italic text-white/92">Klarheit, Anspruch und Substanz.</em>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → Positionierung */}
        <SectionTransition from="§ 05  Absage" to="§ 06  Mehr als Oberfläche" tone="darker" />

        {/* =========================================================
           § 06 — "Eine Website braucht mehr als Oberfläche."
           Frames the page as the umbrella service that pulls
           SEO, Content/Bildwelt and conversion into one project.
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-wl-reveal className="md:pt-2">
                <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                  § 06 — Mehr als Oberfläche
                </p>
              </div>

              <div>
                <h2
                  data-wl-reveal
                  className="font-instrument max-w-[48rem] text-[2.05rem] leading-[1.04] tracking-[-0.028em] text-white sm:text-[2.6rem] md:text-[3.15rem] lg:text-[3.55rem]"
                >
                  Eine Website braucht{" "}
                  <em className="italic text-white/60">mehr als Oberfläche</em>.
                </h2>

                <p
                  data-wl-reveal
                  className="font-ui mt-10 max-w-[44rem] text-[15px] leading-[1.72] text-white/64 md:mt-12 md:text-[16px]"
                >
                  Deshalb denken wir bei Websites und Landing Pages nicht nur an Design und
                  Entwicklung, sondern auch an Inhalte, Suchstruktur, Bildwelt, Performance und
                  die Frage, wie der Auftritt im Alltag wirklich genutzt wird.
                </p>

                <ul className="mt-12 grid gap-x-10 border-t border-white/[0.07] sm:grid-cols-2 md:mt-14">
                  {[
                    {
                      to: "/seo-sichtbarkeit",
                      title: "SEO & Sichtbarkeit",
                      body:
                        "Struktur, Inhalte und technische Grundlagen, damit die Seite gefunden und verstanden wird.",
                    },
                    {
                      to: "/content-bildwelt-medien",
                      title: "Content, Bildwelt & Medien",
                      body:
                        "Texte, Bildwelt, Foto, Bildbearbeitung, Video und Motion — wenn der Auftritt nicht mit Platzhaltern starten soll.",
                    },
                    {
                      to: "/landingpages-kassel",
                      title: "Landing Pages für Kassel",
                      body:
                        "Wenn die Seite stark auf eine Kampagne, ein Angebot oder lokale Anfragen ausgerichtet werden soll.",
                    },
                  ].map((item, i) => (
                    <li
                      key={item.to}
                      data-wl-reveal
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 border-b border-white/[0.07] py-6 md:gap-x-7 md:py-7"
                    >
                      <span className="font-mono pt-[0.32rem] text-[10px] font-medium leading-none tracking-[0.28em] text-white/40 md:text-[10.5px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <Link
                          to={item.to}
                          className="group inline-flex items-baseline gap-2 text-white no-underline"
                        >
                          <span className="font-instrument text-[1.18rem] leading-[1.22] tracking-[-0.014em] md:text-[1.32rem] lg:text-[1.4rem]">
                            {item.title}
                          </span>
                          <span
                            aria-hidden
                            className="font-instrument text-[1em] italic text-white/72 transition-transform duration-[520ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
                          >
                            ↗︎
                          </span>
                        </Link>
                        <p className="font-ui mt-2 max-w-md text-[13.5px] leading-[1.62] text-white/56 md:text-[14px]">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 06  Mehr als Oberfläche" to="§ Positionierung" tone="darker" />

        {/* =========================================================
           CEREMONIAL PULL-STATEMENT — three-line declaration, own moment
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
                data-wl-pullheading
                className="font-instrument text-[2.6rem] leading-[1.0] tracking-[-0.038em] text-white sm:text-[3.6rem] md:text-[4.7rem] lg:text-[5.6rem] xl:text-[6.2rem]"
              >
                <span className="block overflow-hidden">
                  <span data-wl-pull className="inline-block">
                    Websites, die wirken.
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span data-wl-pull className="inline-block italic text-white/64">
                    Landing Pages, die führen.
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span data-wl-pull className="inline-block">
                    Umsetzung, die nicht ausbremst.
                  </span>
                </span>
              </h3>

              <div className="mt-16 flex items-center gap-5 sm:mt-20">
                <span aria-hidden className="h-px flex-1 bg-white/12" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                  Edition · Positionierung 01
                </span>
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
           CONTEXTUAL CROSS-LINK → /website-im-abo
        ========================================================= */}
        <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16 lg:py-32">
          <div className="layout-max">
            <div data-wl-reveal>
              <ContextualCrossLink
                eyebrow="Alternative"
                folio="Modell · Abo"
                lead="Du willst eine professionelle Website, aber lieber mit planbaren monatlichen Kosten? Dann schau dir unser Modell Website im Abo an."
                linkLabel="Website im Abo ansehen"
                to="/website-im-abo"
              />
            </div>
          </div>
        </section>

        {/* =========================================================
           FINAL CTA — serif headline, ledger, white pill
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
                  {["Bereit", "für", "eine", "Website,"].map((w, i) => (
                    <span
                      key={`fa-${i}`}
                      className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-wl-finala className="inline-block">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/76 sm:mt-2">
                  {["die", "mehr", "kann", "als", "nur", "gut", "aussehen?"].map((w, i) => (
                    <span
                      key={`fb-${i}`}
                      className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-wl-finalb className="inline-block">
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
                    data-wl-finalrule
                    className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  />
                </div>
                <span aria-hidden className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40">
                  ·
                </span>
              </div>

              <p className="font-ui mx-auto mt-10 max-w-[38rem] text-[15px] leading-[1.72] text-white/60 md:mt-12 md:text-[16.5px]">
                Wir entwickeln Websites und Landing Pages, die deine Marke hochwertig präsentieren
                und im Alltag genau das tun, was sie sollen.
              </p>

              {/* Ledger block — CTA left, session metadata right */}
              <div className="mt-14 grid items-center gap-10 text-left sm:mt-18 sm:grid-cols-[auto_1fr] sm:gap-14 md:gap-20">
                <div data-wl-finalcta className="flex justify-center sm:justify-start">
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
                  <div data-wl-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Projekt
                    </span>
                    <span className="font-instrument text-[1.2rem] italic leading-[1.3] text-white/90 sm:text-[1.4rem] md:text-[1.5rem]">
                      Start flexibel · individuell geplant
                    </span>
                  </div>

                  <div data-wl-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Antwort
                    </span>
                    <span className="font-ui text-[13.5px] leading-[1.5] text-white/62 sm:text-[14.5px]">
                      In der Regel binnen 24 Stunden — werktags.
                    </span>
                  </div>

                  <div data-wl-finalledger className="flex flex-col gap-1.5">
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
                § End — Leistungen 02 · Magicks · MMXXVI
              </span>
              <span aria-hidden className="hidden h-px w-20 bg-white/14 sm:block" />
              <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/42 sm:text-[10.5px]">
                Kassel / DE · DE & EN
              </span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
