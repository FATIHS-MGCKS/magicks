import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { ChapterMarker } from "../../components/home/ChapterMarker";
import { ContextualCrossLink } from "../../components/service/ContextualCrossLink";
import { SectionTransition } from "../../components/service/SectionTransition";
import { EditorialAnchor } from "../../components/service/EditorialAnchor";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { registerGsap } from "../../lib/gsap";
import { presenceEnvelope, rackFocusTrack } from "../../lib/scrollMotion";
import { FaqJsonLd, type FaqItem } from "../../seo/FaqJsonLd";
import { RouteSEO } from "../../seo/RouteSEO";

/* ------------------------------------------------------------------
 * /webdesign-kassel — bespoke editorial landing page.
 *
 * Design intent: treat "Kassel" as a publication dateline, not a local-
 * SEO keyword. The page reads as a dispatch from MAGICKS · Studio ·
 * Kassel · Bureau, with cartographic anchoring and a confident editorial
 * rhythm. Premium, restrained, specific. Distinctly MAGICKS, distinctly
 * about this place — never provincial.
 *
 * Signature motif: a Studio Bureau dateline system with a left-edge
 * coordinate gutter ("51° N", "9° E", "Kassel" — real Kassel coords),
 * a masthead dateline strip in the hero, a vertical credit, and a closing
 * bureau cartouche. No maps, no flags, no pins.
 *
 * All prose copy (H1, eyebrow, lead, positioning, includes, audience,
 * approach, closing, related) is preserved verbatim. Only scaffolding
 * (folios, counters, coordinate labels, section markers, CTA cartouche)
 * is editorial — the same convention used across every bespoke page.
 * ------------------------------------------------------------------ */

/* =======  VERBATIM COPY  =======
 * Kept as module-level constants so the "do not change copy" discipline
 * is visible at a glance — diff this block against the old shell-based
 * version and every string will match.
 */

const CHAPTER = { num: "SEO", label: "Webdesign Kassel" } as const;

const HERO_EYEBROW = "Region · Kassel & Nordhessen";

const H1_PRIMARY_WORDS = ["Webdesign", "für", "Unternehmen"];
const H1_ITALIC_WORDS = ["in", "Kassel", "mit", "Anspruch."];

const HERO_LEAD_SENTENCE_1 = "MAGICKS ist ein kreatives Tech-Studio in Kassel.";
const HERO_LEAD_SENTENCE_2 =
  "Wir gestalten und entwickeln Websites, digitale Auftritte und Online-Systeme für Unternehmen in der Region — mit dem Anspruch, dass Qualität sichtbar wird, nicht nur versprochen.";

/**
 * Hero tier-3 support line — written to quietly widen the hero's
 * vocabulary so the page reads naturally for buyers who think in
 * "moderne Homepage", "professionelle Webseite" or "Internetauftritt"
 * without changing the lede. Typographically subdued (small, muted),
 * sits below the two-sentence lead as a supporting breath.
 */
const HERO_LEAD_SUPPORT =
  "Ob als moderne Homepage, professionelle Webseite oder Internetauftritt für Ihr Unternehmen — das Ergebnis soll zum Anspruch Ihrer Arbeit passen.";

/**
 * POSITIONING (rendered in § 01 split at the em-dash for rhythm):
 *   "In Kassel ansässig, bundesweit im Einsatz — aber mit kurzen Wegen,
 *    wenn es drauf ankommt."
 * Kept as a comment reference so a diff against the shell version is
 * trivially verifiable — every character is preserved in JSX below.
 */

const INCLUDES_INTRO = "Was Unternehmen aus Kassel bei uns konkret beauftragen:";

/**
 * § 02 kicker — a single supporting sentence after INCLUDES_INTRO. It
 * widens the vocabulary for traditional buyers (Website / Webseite /
 * Homepage / Landing Page) without turning the register into a
 * keyword list.
 */
const INCLUDES_KICKER =
  "Website, Webseite, Homepage oder einzelne Landing Page — jeweils individuell geplant und sauber gebaut.";

const INCLUDES: { title: string; body: string }[] = [
  {
    title: "Markenwebsites",
    body:
      "Repräsentativer Auftritt für Dienstleister, Hersteller und Handwerksunternehmen, die ihr Online-Bild modernisieren wollen.",
  },
  {
    title: "Relaunch-Projekte",
    body:
      "Gezielter Neubau bestehender Seiten — wenn Struktur, Design und Technik nicht mehr tragen. Ohne Content zu verlieren, mit sauberem Redirect-Konzept.",
  },
  {
    title: "Landing Pages",
    body:
      "Für Kampagnen, Services oder einzelne Geschäftsbereiche — klar geführt, schnell und auf Conversion angelegt.",
  },
  {
    title: "Regionale Positionierung",
    body:
      "SEO-Grundlagen inkl. lokaler Sichtbarkeit, strukturierter Daten und sauberer URL-Architektur — damit Kassel Sie findet, wenn sie suchen.",
  },
  {
    title: "Redaktionelle Pflege",
    body:
      "Auf Wunsch Redaktionssystem oder kontinuierliche Betreuung — damit die Website auch nach dem Launch nicht still steht.",
  },
  {
    title: "Direkter Ansprechpartner",
    body:
      "Sie sprechen mit den Menschen, die bauen. Keine Key-Account-Ebene, keine internationalen Umleitungen.",
  },
];

const AUDIENCE: { title: string; body: string }[] = [
  {
    title: "Unternehmen aus Kassel & Nordhessen.",
    body:
      "Dienstleister, Mittelstand, Handwerksbetriebe mit Qualitätsanspruch — die eine Website suchen, die zu ihrem Arbeitsstandard passt.",
  },
  {
    title: "Marken mit regionalem Schwerpunkt.",
    body:
      "Wenn Sichtbarkeit in der Region wichtig ist — Suchergebnisse, Google-Business, lokale Relevanz — neben überregionaler Präsenz.",
  },
  {
    title: "Unternehmen, die kurze Wege schätzen.",
    body:
      "Wenn Sie ein Gespräch nicht nur remote, sondern auch direkt vor Ort führen wollen, sind wir aus Kassel in unter 30 Minuten erreichbar.",
  },
];

/**
 * The first approach item's body mentions four regional towns verbatim.
 * To honor the "clearly about this place" brief without touching the text,
 * we visually emphasize just that substring — same characters, same order,
 * new italic serif weight. Everything else stays plain.
 */
const APPROACH: {
  title: string;
  body: { before: string; emphasized?: string; after: string };
}[] = [
  {
    title: "Gespräch vor Ort, wenn es passt.",
    body: {
      before:
        "Für Kunden aus der Region bieten wir das erste Gespräch gern vor Ort an. ",
      emphasized: "Kassel, Baunatal, Fuldabrück, Vellmar",
      after: " — kurzfristig umsetzbar.",
    },
  },
  {
    title: "Individuelles Design, keine Templates.",
    body: {
      before:
        "Jede Seite entsteht eigens — als Ausdruck Ihrer Marke, nicht als Variante eines Baukastens.",
      after: "",
    },
  },
  {
    title: "Transparenter Ablauf.",
    body: {
      before:
        "Jeder Schritt wird dokumentiert — von Wireframe bis Launch. Sie wissen jederzeit, wo wir stehen und warum.",
      after: "",
    },
  },
  {
    title: "Sauberer Launch und Nachbetreuung.",
    body: {
      before:
        "Nach dem Go-Live bleiben wir ansprechbar — sowohl für technische Fragen als auch für redaktionelle Erweiterungen.",
      after: "",
    },
  },
];

const CLOSING =
  "Eine Website aus Kassel, die Ihrem Unternehmen überregional gerecht wird — und regional den Eindruck hinterlässt, den Ihre Arbeit verdient.";

/* ------------------------------------------------------------------
 * Local-intent FAQ. Five short, citation-ready answers focused on the
 * questions Kassel-region buyers actually ask before reaching out.
 * Mirrored to FAQPage JSON-LD; never hidden.
 * ------------------------------------------------------------------ */
const FAQ_ITEMS: ReadonlyArray<FaqItem> = [
  {
    question: "Macht MAGICKS Webdesign in Kassel auch vor Ort?",
    answer:
      "Ja. Das Studio sitzt in Kassel (Schwabstr. 7a, 34125 Kassel). Erstgespräche und Projektworkshops finden auf Wunsch direkt vor Ort statt — in Kassel, Baunatal, Vellmar, Fuldabrück, Lohfelden, Niestetal und Umgebung in der Regel kurzfristig. Ansonsten arbeiten wir bundesweit remote.",
  },
  {
    question: "Was kostet eine professionelle Website in Kassel?",
    answer:
      "Der Investitionsrahmen hängt vom Umfang ab — Markenwebsite, Relaunch, Landing Page oder größerer Internetauftritt. Wir nennen einen klaren Festpreis nach einem Erstgespräch, damit du planbar entscheiden kannst. Für laufende Kosten gibt es zusätzlich das Modell Website im Abo.",
  },
  {
    question: "Wie lange dauert eine Website in Kassel von der Idee bis zum Launch?",
    answer:
      "Eine fokussierte Markenwebsite oder Landing Page geht häufig in 4 bis 8 Wochen live, größere Auftritte mit mehreren Templates und Integrationen entsprechend länger. KI-gestützte Entwicklung verkürzt die Time-to-Launch ohne Qualitätsverlust.",
  },
  {
    question: "Kümmert ihr euch auch um SEO, Hosting und Pflege?",
    answer:
      "Ja. Saubere SEO-Grundlagen (Struktur, Performance, strukturierte Daten, lokale Sichtbarkeit) sind Teil jedes Projekts. Hosting läuft auf Hostinger in Deutschland; auf Wunsch übernehmen wir laufende Pflege, Updates und redaktionelle Erweiterungen.",
  },
  {
    question: "Arbeitet ihr nur in Kassel oder auch bundesweit?",
    answer:
      "Beides. Sitz ist Kassel, Schwerpunkt ist Nordhessen — direkt erreichbar in unter 30 Minuten Fahrzeit für die meisten Unternehmen der Region. Mandate aus dem gesamten DACH-Raum laufen remote, mit denselben Tools, demselben Team und denselben kurzen Wegen.",
  },
];

const RELATED: {
  to: string;
  label: string;
  description: string;
  eyebrow: string;
  folio: string;
  linkLabel: string;
}[] = [
  {
    to: "/websites-landingpages",
    label: "Websites & Landing Pages",
    description:
      "Der Kern der Arbeit — individuelle Websites und Landing Pages mit sauberer Technik und klarer Nutzerführung.",
    eyebrow: "Kern",
    folio: "Plate · Websites & Landing Pages",
    // Anchor text carries the search intent naturally (the card's own
    // title remains "Websites & Landing Pages" so the gatefold stays
    // readable as an editorial header; the link phrasing tells a
    // business owner exactly what the page is for). Covers both the
    // modern ("Website") and the traditional ("Homepage") vocabulary
    // with a single confident action phrase.
    linkLabel: "Website oder Homepage erstellen lassen",
  },
  {
    to: "/landingpages-kassel",
    label: "Landing Pages Kassel",
    description:
      "Separate, conversion-orientierte Landing Pages für Kassel-bezogene Kampagnen und Zielgruppen.",
    eyebrow: "Kampagne",
    folio: "Bureau · Landing Pages Kassel",
    linkLabel: "Landing Page in Kassel erstellen lassen",
  },
  {
    to: "/website-im-abo",
    label: "Website im Abo",
    description:
      "Für Unternehmen aus Kassel, die keine hohe Einmalzahlung leisten wollen — Website als monatliches Modell.",
    eyebrow: "Modell",
    folio: "Cadence · Website im Abo",
    linkLabel: "Website oder Homepage im Abo starten",
  },
];

/* =======  PAGE  ======= */

export default function WebdesignKasselPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      // -------- HERO targets --------
      const heroSection = root.querySelector<HTMLElement>("[data-wk-hero]");
      const heroCopy = root.querySelector<HTMLElement>("[data-wk-herocopy]");
      const heroChapter = root.querySelector<HTMLElement>("[data-wk-chapter]");
      const heroDateline = root.querySelector<HTMLElement>("[data-wk-dateline]");
      const heroDatelineRule = root.querySelector<HTMLElement>("[data-wk-dateline-rule]");
      const heroEyebrow = root.querySelector<HTMLElement>("[data-wk-eyebrow]");
      const heroLineA = gsap.utils.toArray<HTMLElement>("[data-wk-h1a]");
      const heroLineB = gsap.utils.toArray<HTMLElement>("[data-wk-h1b]");
      const heroH1 = root.querySelector<HTMLElement>("[data-wk-h1]");
      const heroLead1 = root.querySelector<HTMLElement>("[data-wk-lead1]");
      const heroLead2 = root.querySelector<HTMLElement>("[data-wk-lead2]");
      const heroLead3 = root.querySelector<HTMLElement>("[data-wk-lead3]");
      const heroCta = root.querySelector<HTMLElement>("[data-wk-cta]");
      const heroCtaRule = root.querySelector<HTMLElement>("[data-wk-cta-rule]");
      const heroMeta = gsap.utils.toArray<HTMLElement>("[data-wk-meta]");
      const heroGutterRule = root.querySelector<HTMLElement>("[data-wk-gutter-rule]");
      const heroGutterLabels = gsap.utils.toArray<HTMLElement>("[data-wk-gutter-label]");
      const heroCredit = root.querySelector<HTMLElement>("[data-wk-credit]");

      // -------- Scroll reveals --------
      const reveals = gsap.utils.toArray<HTMLElement>("[data-wk-reveal]");
      const positioningLines = gsap.utils.toArray<HTMLElement>("[data-wk-pull]");
      const positioningHeading = root.querySelector<HTMLElement>("[data-wk-pullheading]");
      const finalLineA = gsap.utils.toArray<HTMLElement>("[data-wk-finala]");
      const finalLineB = gsap.utils.toArray<HTMLElement>("[data-wk-finalb]");
      const finalRule = root.querySelector<HTMLElement>("[data-wk-finalrule]");
      const finalLedger = gsap.utils.toArray<HTMLElement>("[data-wk-finalledger]");
      const finalCta = root.querySelector<HTMLElement>("[data-wk-finalcta]");

      if (reduced) {
        gsap.set(
          [
            heroChapter,
            heroDateline,
            heroDatelineRule,
            heroEyebrow,
            ...heroLineA,
            ...heroLineB,
            heroLead1,
            heroLead2,
            heroLead3,
            heroCta,
            heroCtaRule,
            ...heroMeta,
            heroGutterRule,
            ...heroGutterLabels,
            heroCredit,
            ...reveals,
            ...positioningLines,
            positioningHeading,
            ...finalLineA,
            ...finalLineB,
            finalRule,
            ...finalLedger,
            finalCta,
          ],
          {
            opacity: 1,
            y: 0,
            yPercent: 0,
            scaleX: 1,
            scaleY: 1,
            letterSpacing: "normal",
          },
        );
        return;
      }

      // -------- Hero choreography --------
      gsap.set(heroChapter, { opacity: 0, y: 12 });
      gsap.set(heroDatelineRule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(heroDateline, { opacity: 0, y: 8 });
      gsap.set(heroEyebrow, { opacity: 0, y: 10 });
      gsap.set([...heroLineA, ...heroLineB], { yPercent: 118, opacity: 0 });
      if (heroH1) gsap.set(heroH1, { letterSpacing: "0.008em" });
      gsap.set(heroLead1, { opacity: 0, y: 14 });
      gsap.set(heroLead2, { opacity: 0, y: 14 });
      gsap.set(heroLead3, { opacity: 0, y: 12 });
      gsap.set(heroCta, { opacity: 0, y: 14 });
      gsap.set(heroCtaRule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(heroMeta, { opacity: 0, y: 8 });
      gsap.set(heroGutterRule, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(heroGutterLabels, { opacity: 0, x: -6 });
      gsap.set(heroCredit, { opacity: 0, y: 8 });

      gsap
        .timeline({ delay: 0.12, defaults: { ease: "power3.out" } })
        .to(heroChapter, { opacity: 1, y: 0, duration: 0.9 }, 0)
        .to(heroDatelineRule, { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0.22)
        .to(heroDateline, { opacity: 1, y: 0, duration: 0.85 }, 0.42)
        .to(heroEyebrow, { opacity: 1, y: 0, duration: 0.85 }, 0.48)
        .to(
          heroLineA,
          { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: "power4.out" },
          0.62,
        )
        .to(
          heroLineB,
          { yPercent: 0, opacity: 1, duration: 1.3, stagger: 0.08, ease: "power4.out" },
          0.94,
        )
        .to(
          heroH1,
          { letterSpacing: "-0.035em", duration: 1.7, ease: "power2.out" },
          0.72,
        )
        .to(heroLead1, { opacity: 1, y: 0, duration: 1.0 }, 1.35)
        .to(heroLead2, { opacity: 1, y: 0, duration: 1.0 }, 1.55)
        .to(heroLead3, { opacity: 1, y: 0, duration: 0.95 }, 1.78)
        .to(heroCta, { opacity: 1, y: 0, duration: 0.95 }, 2.0)
        .to(heroCtaRule, { scaleX: 1, duration: 1.15, ease: "power2.inOut" }, 2.1)
        .to(heroMeta, { opacity: 1, y: 0, duration: 0.85, stagger: 0.08 }, 2.25)
        .to(heroGutterRule, { scaleY: 1, duration: 1.2, ease: "power2.inOut" }, 2.35)
        .to(heroGutterLabels, { opacity: 1, x: 0, duration: 0.85, stagger: 0.09 }, 2.7)
        .to(heroCredit, { opacity: 1, y: 0, duration: 0.95 }, 2.9);

      // Subtle camera-push on scroll — content parallaxes up just a touch
      if (heroCopy && heroSection) {
        gsap.to(heroCopy, {
          yPercent: -6,
          opacity: 0.45,
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

      /* -------- Generic scroll reveals — bidirectional envelope --------
       * Each block on /webdesign-kassel gains presence on entry, holds
       * clarity across its reading zone, then releases as the next
       * section arrives. Works cleanly in both scroll directions. */
      presenceEnvelope(reveals, {
        start: "top 90%",
        end: "bottom 10%",
        yFrom: 22,
        yTo: -14,
        blur: 4,
        holdRatio: 0.5,
        scrub: 0.95,
      });

      /* -------- Ceremonial positioning pull --------
       * The positioning stanza rises into focus as the reader engages
       * and softens as they move on. Letter-spacing on the heading
       * settles across the focus zone. Reversible — scrolling back up
       * re-engages the statement rather than leaving it latched. */
      if (positioningLines.length) {
        const positioningSection =
          (positioningLines[0] as HTMLElement).closest("section") ??
          positioningLines[0];

        gsap.set(positioningLines, {
          yPercent: 22,
          opacity: 0,
          filter: "blur(5px)",
        });
        gsap.to(positioningLines, {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.15,
          scrollTrigger: {
            trigger: positioningSection,
            start: "top 80%",
            end: "top 28%",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });
        // Exit softening — keeps the stanza present but no longer
        // demanding once the reader has moved past it.
        gsap.to(positioningLines, {
          opacity: 0.28,
          filter: "blur(4px)",
          yPercent: -14,
          ease: "none",
          stagger: 0.06,
          scrollTrigger: {
            trigger: positioningSection,
            start: "bottom 55%",
            end: "bottom 5%",
            scrub: 1.0,
            invalidateOnRefresh: true,
          },
        });

        if (positioningHeading) {
          gsap.set(positioningHeading, { letterSpacing: "0.008em" });
          gsap.to(positioningHeading, {
            letterSpacing: "-0.035em",
            ease: "none",
            scrollTrigger: {
              trigger: positioningSection,
              start: "top 76%",
              end: "top 30%",
              scrub: 1.1,
              invalidateOnRefresh: true,
            },
          });
        }
      }

      /* -------- Final CTA — scroll-coupled sign-off --------
       * The final block assembles as the reader arrives (lines lift,
       * centre rule draws, CTA and ledger settle) and softens on exit.
       * All scrub-driven. No back.out spring, no once:true latch. */
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
      <RouteSEO path="/webdesign-kassel" />

      <main
        ref={rootRef}
        className="relative bg-[#0A0A0A] pb-0 pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.5rem]"
      >
        {/* =========================================================
           § 00 — HERO (Studio · Bureau dateline)
        ========================================================= */}
        <section
          data-wk-hero
          className="relative overflow-hidden px-5 pb-28 sm:px-8 sm:pb-32 md:px-12 md:pb-40 lg:px-16 lg:pb-52"
        >
          {/* Soft editorial plate texture — coarse horizontal rules only,
              distinct from the diagonal/isometric textures used on
              /produktkonfigurator-erstellen. Reads as newsprint tooth. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 96px)",
              maskImage:
                "radial-gradient(ellipse 62% 70% at 34% 52%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 62% 70% at 34% 52%, black, transparent)",
            }}
          />

          {/* Vertical credit — left edge of the hero */}
          <div
            data-wk-credit
            aria-hidden
            className="pointer-events-none absolute bottom-14 left-5 z-10 hidden select-none md:block lg:bottom-16 lg:left-8"
          >
            <span className="hero-vertical-credit">
              MAGICKS &nbsp;·&nbsp; STUDIO &nbsp;·&nbsp; KASSEL &nbsp;·&nbsp; EDITION MMXXVI
            </span>
          </div>

          <div className="relative layout-max">
            {/* ----- Top dateline masthead ----- */}
            <div className="mb-10 flex flex-col gap-5 sm:mb-14 md:mb-16">
              <div data-wk-chapter>
                <ChapterMarker num={CHAPTER.num} label={CHAPTER.label} />
              </div>

              {/* Dateline strip — `— STUDIO · KASSEL  ·  BUREAU · MMXXVI —` */}
              <div className="flex items-center gap-4 sm:gap-5">
                <span aria-hidden className="h-px w-10 bg-white/24 sm:w-14" />
                <span
                  data-wk-dateline
                  className="font-mono flex items-center gap-4 whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/52 sm:gap-5 sm:text-[10px] md:text-[10.5px]"
                >
                  <span>Studio · Kassel</span>
                  <span aria-hidden className="h-px w-4 bg-white/28 sm:w-5" />
                  <span className="text-white/40">Bureau · MMXXVI</span>
                </span>
                <span
                  aria-hidden
                  data-wk-dateline-rule
                  className="block h-px flex-1 origin-left bg-white/12"
                />
              </div>
            </div>

            <div data-wk-herocopy className="relative">
              {/* ----- Coordinate gutter (desktop only) -----
                  A vertical hairline with three real Kassel coordinate
                  stops. Sits just left of the hero copy on md+; on mobile
                  it's hidden so the copy owns the full width. */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-0 top-[0.4rem] hidden h-[min(28rem,82%)] md:-left-8 md:block lg:-left-12"
              >
                <span
                  data-wk-gutter-rule
                  className="absolute left-[3px] top-0 block h-full w-px bg-white/16"
                />
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[
                    { label: "51° N" },
                    { label: "9° E" },
                    { label: "Kassel" },
                  ].map((row) => (
                    <span
                      key={row.label}
                      data-wk-gutter-label
                      className="font-mono relative flex items-center gap-2 text-[9px] font-medium uppercase leading-none tracking-[0.38em] text-white/44 sm:text-[9.5px]"
                    >
                      <span aria-hidden className="block h-px w-2 bg-white/36" />
                      <span className="tabular-nums">{row.label}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* ----- Eyebrow ----- */}
              <p
                data-wk-eyebrow
                className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/52 sm:mb-10 sm:text-[10.5px]"
              >
                {HERO_EYEBROW}
              </p>

              {/* ----- H1 (split into two visual lines, word-by-word) ----- */}
              <h1
                data-wk-h1
                className="font-instrument max-w-[62rem] text-[2.2rem] leading-[0.98] tracking-[-0.035em] text-white sm:text-[2.9rem] md:text-[3.7rem] lg:text-[4.35rem] xl:text-[4.85rem]"
              >
                <span className="block">
                  {H1_PRIMARY_WORDS.map((w, i) => (
                    <span
                      key={`a-${i}`}
                      className="mr-[0.22em] inline-block overflow-hidden align-bottom"
                    >
                      <span
                        data-wk-h1a
                        className="inline-block will-change-[transform,opacity]"
                      >
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/62 sm:mt-2">
                  {H1_ITALIC_WORDS.map((w, i) => (
                    <span
                      key={`b-${i}`}
                      className="mr-[0.22em] inline-block overflow-hidden align-bottom"
                    >
                      <span
                        data-wk-h1b
                        className="inline-block will-change-[transform,opacity]"
                      >
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>

              {/* ----- Lead paragraph — two typographic tiers.
                  Same sentence, same order, just broken on a real sentence
                  boundary so the opening line reads as a confident lede. */}
              <div className="mt-10 max-w-[46rem] sm:mt-12 md:mt-14">
                <p
                  data-wk-lead1
                  className="font-instrument text-[1.28rem] italic leading-[1.35] tracking-[-0.01em] text-white/86 sm:text-[1.48rem] md:text-[1.62rem]"
                >
                  {HERO_LEAD_SENTENCE_1}
                </p>
                <p
                  data-wk-lead2
                  className="font-ui mt-5 text-[15px] leading-[1.72] text-white/60 md:text-[16px]"
                >
                  {HERO_LEAD_SENTENCE_2}
                </p>
                {/* Tier-3 — a supporting breath that widens the vocabulary
                    for traditional buyers (Homepage / Webseite / Internet­
                    auftritt) without crowding the lede. */}
                <p
                  data-wk-lead3
                  className="font-ui mt-6 max-w-[42rem] border-t border-white/[0.08] pt-5 text-[13.5px] leading-[1.7] text-white/48 md:text-[14px]"
                >
                  {HERO_LEAD_SUPPORT}
                </p>
              </div>

              {/* ----- Primary CTA ----- */}
              <div
                data-wk-cta
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
                      data-wk-cta-rule
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

              {/* ----- Bureau meta triad — mobile stacks as ledger column. ----- */}
              <div className="mt-12 flex flex-col gap-2 sm:mt-16 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-3 md:mt-20">
                {[
                  { num: "01", label: "Studio · Kassel" },
                  { num: "02", label: "Bundesweit remote" },
                  { num: "03", label: "Edition · MMXXVI" },
                ].map((m) => (
                  <span
                    key={m.num}
                    data-wk-meta
                    className="font-mono flex items-center gap-3 text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/52 sm:text-[10.5px]"
                  >
                    <span className="tabular-nums text-white/34">{m.num}</span>
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bureau readout — bottom-right editorial plate signature */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-6 right-5 hidden items-center gap-4 md:right-12 md:flex lg:right-16 lg:bottom-10"
          >
            <span className="font-mono flex items-center gap-2 text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/36">
              <span className="tick-breathing block h-1.5 w-1.5 rounded-full bg-white/75" />
              Bureau · Live
            </span>
            <span aria-hidden className="h-px w-8 bg-white/18" />
            <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/34">
              Studio · Kassel
            </span>
            <span aria-hidden className="h-px w-10 bg-white/18" />
            <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.26em] text-white/34">
              51° N — 9° E — NORDHESSEN
            </span>
          </div>
        </section>

        <SectionTransition from="§ 00  Hero — Bureau" to="§ 01  Positionierung" />

        {/* =========================================================
           § 01 — POSITIONIERUNG (ceremonial statement)
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#080809] px-5 py-32 sm:px-8 sm:py-40 md:px-12 md:py-52 lg:px-16 lg:py-64">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.6]"
            style={{
              background:
                "radial-gradient(ellipse 60% 46% at 50% 50%, rgba(255,255,255,0.03), transparent 64%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 88px)",
              maskImage:
                "radial-gradient(ellipse 62% 50% at 50% 50%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 62% 50% at 50% 50%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[74rem]">
              <div className="mb-16 flex items-center gap-5 sm:mb-20">
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
                  § 01 — Positionierung
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/12" />
              </div>

              {/* Positioning statement — word-reveal timeline.
                  One confident, centered declaration. The sentence breaks
                  on the em-dash to make the pivot legible. */}
              <h2
                data-wk-pullheading
                className="font-instrument max-w-[70rem] text-[2.1rem] leading-[1.08] tracking-[-0.032em] text-white sm:text-[2.8rem] md:text-[3.6rem] lg:text-[4.1rem] xl:text-[4.55rem]"
              >
                <span className="block overflow-hidden">
                  <span data-wk-pull className="inline-block">
                    In Kassel ansässig, bundesweit im Einsatz —
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span data-wk-pull className="inline-block italic text-white/66">
                    aber mit kurzen Wegen, wenn es drauf ankommt.
                  </span>
                </span>
              </h2>

              <div className="mt-14 flex items-center gap-5 sm:mt-20">
                <span aria-hidden className="h-px flex-1 bg-white/12" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                  Dispatch · Bureau · Kassel
                </span>
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              </div>
            </div>
          </div>
        </section>

        <SectionTransition
          from="§ 01  Positionierung"
          to="§ 02  Auftrag"
          tone="darker"
        />

        {/* =========================================================
           § INTERLUDIUM — BUREAU SPECIMEN
           Page-specific idiom. This page carries a Studio Bureau
           dateline system (coordinate gutter 51°N · 9°E, masthead
           dateline strip, vertical credits). The anchor joins that
           vocabulary rather than using a generic 2-column formula:
           a full-measure specimen plate with a top rail carrying the
           bureau dateline (studio · exhibit · coordinates) and a
           bottom rail carrying the dispatch metadata (year · subject).
           The photograph has no internal folio overlay — the rails
           do all the captioning, treating the image as a single
           exhibited specimen rather than a decorated figure.
        ========================================================= */}
        <section
          aria-label="Bureau · Exhibit I · Webpräsenz"
          className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-28 md:px-12 md:py-32 lg:px-16 lg:py-36"
        >
          <div className="layout-max">
            <figure className="relative">
              {/* Top dateline rail — matches the hero bureau dateline */}
              <div
                data-wk-reveal
                className="mb-6 flex items-center gap-4 border-t border-white/[0.1] pt-4 sm:mb-7 sm:gap-5 md:mb-8"
              >
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/58 sm:text-[10.5px]">
                  Studio · Bureau
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/14" />
                <span className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.38em] text-white/46 sm:text-[10.5px]">
                  Exhibit · I
                </span>
                <span aria-hidden className="hidden h-px w-14 bg-white/14 sm:block" />
                <span className="font-mono hidden whitespace-nowrap text-[10px] font-medium uppercase leading-none tracking-[0.4em] text-white/46 sm:inline-block sm:text-[10.5px]">
                  51°&nbsp;19′&nbsp;N &nbsp;·&nbsp; 9°&nbsp;29′&nbsp;E
                </span>
              </div>

              {/* Specimen plate — chromeless; the rails above/below
                  carry all caption metadata so the image reads as
                  a pure bureau exhibit. */}
              <EditorialAnchor
                src="/media/pages/webdesign-kassel/anchor.webp"
                alt="Dunkel gestaltete deutschsprachige Unternehmenswebsite (Wortmarke Nordwerk) auf einem mattschwarzen Laptop in einer ruhigen Studio-Umgebung: zentrierte Serifentitel „Arbeit mit Haltung.“, feine Navigationszeile und ein einzelner unterstrichener Call-to-Action."
                aspect="16/9"
                align="center"
                maxWidth="64rem"
                revealAttr="data-wk-reveal"
              />

              {/* Bottom dispatch rail — dispatch metadata */}
              <figcaption
                data-wk-reveal
                className="mt-6 flex items-center gap-4 border-b border-white/[0.08] pb-4 sm:mt-7 sm:gap-5 md:mt-8"
              >
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/52 sm:text-[10.5px]">
                  Dispatch
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/12" />
                <span className="font-instrument text-[0.92rem] italic leading-none tracking-[-0.008em] text-white/62 sm:text-[0.98rem]">
                  Ein ruhiges, vollmessbares Beispiel. Keine Bühne, keine Effekte.
                </span>
                <span aria-hidden className="hidden h-px w-14 bg-white/12 sm:block" />
                <span className="font-mono hidden whitespace-nowrap text-[10px] font-medium uppercase leading-none tracking-[0.38em] text-white/44 sm:inline-block sm:text-[10.5px]">
                  Kassel · MMXXVI
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* =========================================================
           § 02 — AUFTRAG (Includes register)
           Two-column register. Left rail: section folio + chapter +
           intro kicker. Right column: 6 numbered entries.
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-wk-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                    § 02 — Auftrag
                  </p>
                  <ChapterMarker num="02" label="Register" />
                  <span
                    aria-hidden
                    className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]"
                  >
                    06 Positionen · MMXXVI
                  </span>
                </div>
              </div>

              <div>
                <h2
                  data-wk-reveal
                  className="font-instrument max-w-[48rem] text-[2rem] leading-[1.05] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]"
                >
                  Was <em className="italic text-white/60">Teil der Arbeit</em> ist.
                </h2>

                <p
                  data-wk-reveal
                  className="font-ui mt-7 max-w-[42rem] text-[15px] leading-[1.7] text-white/58 md:mt-9 md:text-[15.5px]"
                >
                  {INCLUDES_INTRO}
                </p>

                {/* Kicker — quiet italic supporting line that names the
                    traditional vocabulary (Website · Webseite · Homepage ·
                    Landing Page) once, naturally, before the register. */}
                <p
                  data-wk-reveal
                  className="font-instrument mt-4 max-w-[44rem] text-[1.05rem] italic leading-[1.45] tracking-[-0.008em] text-white/72 md:mt-5 md:text-[1.15rem]"
                >
                  {INCLUDES_KICKER}
                </p>

                <ol className="mt-14 grid gap-x-14 gap-y-0 border-t border-white/[0.07] md:mt-20 md:grid-cols-2">
                  {INCLUDES.map((item, i) => (
                    <li
                      key={item.title}
                      data-wk-reveal
                      className="relative grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 border-b border-white/[0.07] py-8 sm:gap-x-8 md:py-10"
                    >
                      <span className="font-mono pt-[0.4rem] text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/52 md:text-[11.5px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span
                            aria-hidden
                            className="font-mono tabular-nums text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 md:text-[9.5px]"
                          >
                            Pos · {String(i + 1).padStart(2, "0")} / {String(INCLUDES.length).padStart(2, "0")}
                          </span>
                        </div>
                        <h3 className="font-instrument text-[1.3rem] leading-[1.18] tracking-[-0.016em] text-white md:text-[1.5rem] lg:text-[1.62rem]">
                          {item.title}
                        </h3>
                        <p className="font-ui mt-3 max-w-md text-[14px] leading-[1.65] text-white/56 md:text-[14.5px]">
                          {item.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div
                  data-wk-reveal
                  className="font-mono mt-6 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:mt-8"
                >
                  <span>Register · Auftrag</span>
                  <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                  <span className="tabular-nums">Studio · Kassel · MMXXVI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 02  Auftrag" to="§ 03  Bezug" />

        {/* =========================================================
           § 03 — BEZUG (Audience — regional anchor register)
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-wk-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                    § 03 — Bezug
                  </p>
                  <ChapterMarker num="03" label="Zielbild" />
                </div>
              </div>

              <div>
                <h2
                  data-wk-reveal
                  className="font-instrument max-w-[52rem] text-[2rem] leading-[1.05] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]"
                >
                  Wer davon am meisten <em className="italic text-white/60">profitiert</em>.
                </h2>

                <ul className="mt-12 space-y-0 border-t border-white/[0.07] md:mt-16">
                  {AUDIENCE.map((item, i) => (
                    <li
                      key={item.title}
                      data-wk-reveal
                      className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 border-b border-white/[0.07] py-7 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-9 md:py-9"
                    >
                      <span className="font-mono tabular-nums text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/48 md:text-[11.5px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="max-w-[42rem]">
                        <h3 className="font-instrument text-[1.3rem] leading-[1.22] tracking-[-0.014em] text-white md:text-[1.55rem] lg:text-[1.72rem]">
                          {item.title}
                        </h3>
                        <p className="font-ui mt-3 text-[14.5px] leading-[1.7] text-white/58 md:text-[15px]">
                          {item.body}
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className="col-span-2 mt-2 inline-flex items-center gap-3 md:col-span-1 md:mt-0"
                      >
                        <span aria-hidden className="h-px w-6 bg-white/22 md:w-10" />
                        <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/48 md:text-[10px]">
                          BZ-{String(i + 1).padStart(2, "0")}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <div
                  data-wk-reveal
                  className="font-mono mt-6 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:mt-8"
                >
                  <span>Register · Bezug</span>
                  <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                  <span className="tabular-nums">03 Anker · Nordhessen</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 03  Bezug" to="§ 04  Ansatz" />

        {/* =========================================================
           § 04 — ANSATZ (Approach — process stairway)
           4 steps. Step 01's body is the only place city names appear;
           those exact characters get a subtle italic-serif emphasis so
           the place lives editorially, not as a keyword.
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-20 lg:gap-28">
              <div data-wk-reveal>
                <p className="font-mono mb-6 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:mb-8 sm:text-[10.5px]">
                  § 04 — Ansatz
                </p>
                <h2 className="font-instrument max-w-[36rem] text-[2rem] leading-[1.05] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]">
                  Wie MAGICKS es <em className="italic text-white/60">angeht</em>.
                </h2>
                <div
                  data-wk-reveal
                  className="mt-10 flex items-center gap-4 md:mt-14"
                >
                  <span aria-hidden className="h-px w-10 bg-white/22 md:w-14" />
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    04 Stufen · Ablauf
                  </span>
                </div>
              </div>

              <div>
                <ol className="border-t border-white/[0.08]">
                  {APPROACH.map((item, i) => (
                    <li
                      key={item.title}
                      data-wk-reveal
                      className="group/step grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 border-b border-white/[0.08] py-8 sm:gap-x-9 md:py-10 lg:py-12"
                    >
                      <span className="font-mono pt-[0.32rem] text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/48 md:text-[11.5px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="max-w-[42rem]">
                        <div className="mb-3 flex items-baseline justify-between gap-5">
                          <h3 className="font-instrument text-[1.32rem] leading-[1.22] tracking-[-0.014em] text-white md:text-[1.55rem] lg:text-[1.72rem]">
                            {item.title}
                          </h3>
                          <span
                            aria-hidden
                            className="font-mono tabular-nums whitespace-nowrap text-[9px] font-medium uppercase leading-none tracking-[0.32em] text-white/36 md:text-[9.5px]"
                          >
                            {String(i + 1).padStart(2, "0")} / {String(APPROACH.length).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="font-ui text-[14.5px] leading-[1.72] text-white/60 md:text-[15.5px]">
                          {item.body.before}
                          {item.body.emphasized ? (
                            <em className="font-instrument italic text-white/92">
                              {item.body.emphasized}
                            </em>
                          ) : null}
                          {item.body.after}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 04  Ansatz" to="§ 05  Haltung" />

        {/* =========================================================
           § 05 — HALTUNG (Credo — traditional search-intent reprise)
           A premium, single-column credo page sitting between the
           process register (§ 04) and the closing (§ 06). Its job is
           to welcome more traditional German business wording —
           Webseite, Homepage, Internetauftritt, Landing Page — into the
           page with grace, so the site reads naturally for buyers at
           every vocabulary register without ever feeling like SEO.
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          {/* Credo plate texture — tight horizontal rules, narrower
              pitch than the hero plate. Signals "statement page"
              without repeating § 01 Positionierung's ceremony. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0 1px, transparent 1px 112px)",
              maskImage:
                "radial-gradient(ellipse 64% 58% at 50% 50%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 64% 58% at 50% 50%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            {/* Top credo rail */}
            <div
              data-wk-reveal
              className="mb-12 flex items-center gap-5 sm:mb-16"
            >
              <span aria-hidden className="h-px w-14 bg-white/24 sm:w-20" />
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/48 sm:text-[10.5px]">
                § 05 — Haltung · Credo
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/12" />
              <span className="font-mono hidden whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/36 sm:inline-block sm:text-[10px]">
                Studio · Kassel · MMXXVI
              </span>
            </div>

            {/* Credo heading — exact theme from the brief, with the
                em-dash pivot italicized for typographic rhythm. */}
            <h2
              data-wk-reveal
              className="font-instrument max-w-[58rem] text-[2.05rem] leading-[1.06] tracking-[-0.03em] text-white sm:text-[2.7rem] md:text-[3.3rem] lg:text-[3.8rem] xl:text-[4.1rem]"
            >
              Website, Webseite oder Homepage —{" "}
              <em className="italic text-white/66">
                am Ende zählt, dass sie funktioniert.
              </em>
            </h2>

            {/* Credo body — four paragraphs, tight reading column.
                First paragraph in serif italic to mirror the lede
                rhythm; subsequent paragraphs in ui body. Contains two
                natural inline internal links whose anchor text matches
                the page's target search intent ("Website erstellen
                lassen" → /websites-landingpages, "Landing Page für
                eine Kampagne" → /landingpages-kassel). */}
            <div className="mt-12 max-w-[46rem] space-y-6 md:mt-16">
              <p
                data-wk-reveal
                className="font-instrument text-[1.22rem] italic leading-[1.4] tracking-[-0.012em] text-white/86 sm:text-[1.38rem] md:text-[1.52rem]"
              >
                Manche nennen es Website. Andere sagen Webseite, Homepage oder
                Internetauftritt. Wieder andere meinen eine einzelne Landing Page.
              </p>

              <p
                data-wk-reveal
                className="font-ui text-[15px] leading-[1.72] text-white/66 md:text-[16px]"
              >
                Für uns ist das keine Glaubensfrage. Entscheidend ist, dass das
                Ergebnis hochwertig aussieht, sauber funktioniert und im Alltag
                Ihres Unternehmens wirklich etwas bewegt.
              </p>

              <p
                data-wk-reveal
                className="font-ui text-[15px] leading-[1.72] text-white/66 md:text-[16px]"
              >
                Ob Sie eine{" "}
                <Link
                  to="/websites-landingpages"
                  className="text-white/92 no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-[text-decoration-color,color] hover:text-white hover:underline hover:decoration-white/60"
                >
                  Website erstellen lassen
                </Link>
                , eine professionelle Webseite neu aufsetzen, eine moderne Homepage
                planen oder eine{" "}
                <Link
                  to="/landingpages-kassel"
                  className="text-white/92 no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-[text-decoration-color,color] hover:text-white hover:underline hover:decoration-white/60"
                >
                  Landing Page für eine Kampagne
                </Link>{" "}
                brauchen — die Grundhaltung bleibt die gleiche: individuell geplant,
                ehrlich umgesetzt, technisch belastbar.
              </p>

              <p
                data-wk-reveal
                className="font-ui text-[15px] leading-[1.72] text-white/64 md:text-[16px]"
              >
                So entstehen digitale Auftritte, die Unternehmen in Kassel und
                Nordhessen im Außenbild tragen — als Startseite, als einzelne
                Landing Page oder als vollständiger Internetauftritt für Ihr
                Unternehmen.
              </p>
            </div>

            {/* Closing credo rail */}
            <div
              data-wk-reveal
              className="mt-16 flex items-center gap-5 sm:mt-20"
            >
              <span aria-hidden className="h-px flex-1 bg-white/12" />
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                Credo · Dispatch · MMXXVI
              </span>
              <span aria-hidden className="h-px w-14 bg-white/24 sm:w-20" />
            </div>
          </div>
        </section>

        <SectionTransition
          from="§ 05  Haltung"
          to="§ 06  Orientierung"
          tone="darker"
        />

        {/* =========================================================
           § 06 — ORIENTIERUNG (Closing statement + Cross-links)
           The closing paragraph is promoted out of the approach tail
           and given full section weight; the three related routes are
           elevated to full-width ContextualCrossLink gatefolds.
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#080809] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.55]"
            style={{
              background:
                "radial-gradient(ellipse 55% 40% at 50% 46%, rgba(255,255,255,0.025), transparent 66%)",
            }}
          />

          <div className="relative layout-max">
            <div className="mb-20 flex items-center gap-5 sm:mb-24">
              <span aria-hidden className="h-px w-14 bg-white/24 sm:w-20" />
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
                § 06 — Orientierung
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/12" />
            </div>

            {/* Closing paragraph — centered, ceremonial */}
            <div className="mx-auto max-w-[60rem]">
              <p
                data-wk-reveal
                className="font-instrument text-center text-[1.6rem] leading-[1.32] tracking-[-0.018em] text-white sm:text-[2rem] md:text-[2.4rem] lg:text-[2.75rem]"
              >
                {CLOSING}
              </p>
            </div>

            {/* Cross-links — three ContextualCrossLink gatefolds.
                Promotes internal linking from a forgettable footer into
                a real editorial handoff, the same way the signature
                bespoke pages treat their neighbors. */}
            <div className="mt-24 space-y-14 sm:mt-28 sm:space-y-16 md:mt-32 md:space-y-20">
              {RELATED.map((r) => (
                <div key={r.to} data-wk-reveal>
                  <ContextualCrossLink
                    eyebrow={r.eyebrow}
                    folio={r.folio}
                    lead={r.description}
                    linkLabel={r.linkLabel}
                    to={r.to}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
           § 07 — BUREAU · HÄUFIGE FRAGEN
           Five citation-ready answers for buyers in Kassel and
           Nordhessen. Visible on the page AND mirrored to FAQPage
           JSON-LD via <FaqJsonLd /> below — both signals, never
           hidden. Built in the page's bureau register so it reads
           as a chapter beat, not a footer accordion.
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div
              data-wk-reveal
              className="mb-12 flex items-center gap-5 sm:mb-16"
            >
              <span aria-hidden className="h-px w-14 bg-white/24 sm:w-20" />
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/48 sm:text-[10.5px]">
                § 07 — Bureau · Häufige Fragen
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/12" />
              <span className="font-mono hidden whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/36 sm:inline-block sm:text-[10px]">
                05 Antworten · Kassel
              </span>
            </div>

            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-wk-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                    Dispatch · Antworten
                  </p>
                  <ChapterMarker num="07" label="Antworten" />
                  <span className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]">
                    Studio · Kassel · MMXXVI
                  </span>
                </div>
              </div>

              <div>
                <h2
                  data-wk-reveal
                  className="font-instrument max-w-[48rem] text-[2rem] leading-[1.05] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]"
                >
                  Was Unternehmen aus Kassel{" "}
                  <em className="italic text-white/60">vor einer Anfrage fragen</em>.
                </h2>

                <p
                  data-wk-reveal
                  className="font-ui mt-7 max-w-[42rem] text-[15px] leading-[1.7] text-white/58 md:mt-9 md:text-[15.5px]"
                >
                  Kurze, direkte Antworten auf das, was wir am häufigsten in
                  Erstgesprächen aus der Region hören. Wenn Ihre Frage hier nicht
                  steht, schreiben Sie uns an{" "}
                  <a
                    href="mailto:hello@magicks.de"
                    className="text-white/92 no-underline underline-offset-[5px] magicks-duration-hover magicks-ease-out transition-[text-decoration-color,color] hover:text-white hover:underline hover:decoration-white/60"
                  >
                    hello@magicks.de
                  </a>
                  .
                </p>

                <ol className="mt-12 border-t border-white/[0.08] md:mt-16">
                  {FAQ_ITEMS.map((item, i) => (
                    <li
                      key={item.question}
                      data-wk-reveal
                      className="border-b border-white/[0.08]"
                    >
                      <details className="group/wkfaq">
                        <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-6 py-7 outline-none [&::-webkit-details-marker]:hidden md:gap-x-9 md:py-8">
                          <span className="font-mono pt-[0.32rem] text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/48 md:text-[11.5px]">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <h3 className="font-instrument text-[1.18rem] leading-[1.22] tracking-[-0.014em] text-white md:text-[1.4rem] lg:text-[1.5rem]">
                            {item.question}
                          </h3>
                          <span
                            aria-hidden
                            className="font-instrument self-center text-[1.4rem] italic leading-none text-white/56 magicks-duration-hover magicks-ease-out transition-transform group-open/wkfaq:rotate-45 md:text-[1.55rem]"
                          >
                            +
                          </span>
                        </summary>
                        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-6 pb-8 md:gap-x-9 md:pb-9">
                          <span aria-hidden className="block" />
                          <p className="font-ui max-w-[42rem] text-[14.5px] leading-[1.7] text-white/64 md:text-[15px] md:leading-[1.74]">
                            {item.answer}
                          </p>
                          <span aria-hidden className="block" />
                        </div>
                      </details>
                    </li>
                  ))}
                </ol>

                <div
                  data-wk-reveal
                  className="font-mono mt-6 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:mt-8"
                >
                  <span>Register · Antworten</span>
                  <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                  <span className="tabular-nums">05 · Kassel · MMXXVI</span>
                </div>
              </div>
            </div>
          </div>

          <FaqJsonLd id="webdesign-kassel" items={FAQ_ITEMS} />
        </section>

        <SectionTransition
          from="§ 07  Antworten"
          to="§ END  Projekt"
          tone="darker"
        />

        {/* =========================================================
           § END — FINAL CTA (bureau cartouche)
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#070708] px-5 pb-32 pt-32 sm:px-8 sm:pb-40 sm:pt-40 md:px-12 md:pb-48 md:pt-48 lg:px-16 lg:pt-56">
          <div aria-hidden className="section-top-rule" />

          {/* Plate corner crop marks — four cardinal anchors, Kassel-
              coded. Makes the closing feel like a bureau dispatch,
              not a marketing box. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-5 hidden md:inset-8 md:block lg:inset-10"
          >
            <span className="absolute left-0 top-0 block h-3 w-3 border-l border-t border-white/28" />
            <span className="font-mono absolute left-5 top-1 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              N · NW
            </span>
            <span className="absolute right-0 top-0 block h-3 w-3 border-r border-t border-white/28" />
            <span className="font-mono absolute right-5 top-1 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              E · NE
            </span>
            <span className="absolute bottom-0 left-0 block h-3 w-3 border-b border-l border-white/28" />
            <span className="font-mono absolute bottom-1 left-5 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              S · SW
            </span>
            <span className="absolute bottom-0 right-0 block h-3 w-3 border-b border-r border-white/28" />
            <span className="font-mono absolute bottom-1 right-5 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              W · SE
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
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0 1px, transparent 1px 88px)",
              maskImage: "radial-gradient(ellipse 72% 62% at 50% 46%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[68rem] text-center">
              <div className="mb-14 inline-flex sm:mb-20">
                <ChapterMarker num="END" label="Projekt" align="center" variant="end" />
              </div>

              {/* H2 — the single existing CTA heading, per-word reveal. */}
              <h2 className="font-instrument text-[2.4rem] leading-[0.98] tracking-[-0.036em] text-white sm:text-[3.4rem] md:text-[4.5rem] lg:text-[5.3rem] xl:text-[5.9rem]">
                <span className="block">
                  {["Projekt", "besprechen."].map((w, i) => (
                    <span
                      key={`fa-${i}`}
                      className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                    >
                      <span
                        data-wk-finala
                        className={`inline-block ${
                          i === 1 ? "italic text-white/72" : ""
                        }`}
                      >
                        {w}
                      </span>
                    </span>
                  ))}
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
                    data-wk-finalrule
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
                Kurz beschreiben, was Sie vorhaben — wir melden uns mit einer klaren
                Einschätzung. Kein Druck, kein Standard-Pitch.
              </p>

              <div className="mt-14 grid items-center gap-10 text-left sm:mt-18 sm:grid-cols-[auto_1fr] sm:gap-14 md:gap-20">
                <div
                  data-wk-finalcta
                  className="flex justify-center sm:justify-start"
                >
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
                  <div data-wk-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Studio
                    </span>
                    <span className="font-instrument text-[1.2rem] italic leading-[1.3] text-white/90 sm:text-[1.4rem] md:text-[1.5rem]">
                      Kassel · Nordhessen
                    </span>
                  </div>

                  <div data-wk-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Coord
                    </span>
                    <span className="font-mono tabular-nums text-[14px] leading-[1.3] text-white/82 sm:text-[15px] md:text-[15.5px]">
                      51° N &nbsp;·&nbsp; 9° E
                    </span>
                  </div>

                  <div data-wk-finalledger className="flex flex-col gap-1.5">
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

            {/* Bureau cartouche — 4-field signature */}
            <div className="mt-24 border-t border-white/[0.06] pt-7 sm:mt-28">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-0">
                {[
                  { k: "§ End", v: "Webdesign · Kassel" },
                  { k: "Studio", v: "Kassel · Nordhessen" },
                  { k: "Coord", v: "51° N · 9° E" },
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
