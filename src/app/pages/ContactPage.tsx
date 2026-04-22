import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { RouteSEO } from "../seo/RouteSEO";
import { SectionTransition } from "../components/service/SectionTransition";
import { ProjectIntakeForm } from "../components/contact/ProjectIntakeForm";
import { registerGsap, MAGICKS_EASE, MAGICKS_EASE_SMOOTH } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";

/* ---------------------------------------------------------------
 * /kontakt — MAGICKS Studio's positioning + conversion document.
 *
 * Reads as a single editorial document paced from premise → process →
 * trust → statement → form → closing. Pattern deliberately mirrors
 * /ueber-uns (folio tags, ceremonial kickers, hairline rails, serif
 * italic statement) so the two pages read as the same publication.
 * --------------------------------------------------------------- */

/* —— Content constants —— */

const HERO_INTRO_LINES = [
  {
    tone: "lead",
    text:
      "Ob Website, Shop, Produktkonfigurator, Web-Software oder Automation — wenn du etwas bauen willst, das nicht nach Standard aussieht und im Alltag wirklich funktioniert, dann bist du hier richtig.",
  },
  {
    tone: "quiet",
    text: "Du brauchst dafür kein fertiges Lastenheft.",
  },
  {
    tone: "quiet-italic",
    text: "Eine klare Idee reicht für den Anfang völlig aus.",
  },
] as const;

/**
 * Editorial "support register" — each entry links to its home page when
 * one exists, otherwise sits as an unlinked line that signals range
 * without over-promising a dedicated page.
 */
const SUPPORT_REGISTER: Array<{
  kind: string;
  lead: string;
  body: string;
  to?: string;
}> = [
  {
    kind: "Auftritt",
    lead: "Websites & Landing Pages",
    body: "Digitale Auftritte, die klar führen und echte Ergebnisse liefern — vom Markenkern bis zur Konversion.",
    to: "/websites-landingpages",
  },
  {
    kind: "Produkt",
    lead: "Shops & Produktkonfiguratoren",
    body: "Shops und Konfiguratoren mit starker UX — für Produkte, die eine Entscheidung brauchen, nicht nur einen Button.",
    to: "/shops-produktkonfiguratoren",
  },
  {
    kind: "3D-Konfigurator",
    lead: "3D-Produktkonfiguratoren",
    body: "Für erklärungsbedürftige oder maßgefertigte Produkte — Visualisierung, Logik und Vertriebsanbindung in einem System.",
    to: "/produktkonfigurator-erstellen",
  },
  {
    kind: "System",
    lead: "Web-Software, Portale & interne Tools",
    body: "Individuelle Software, die echte Prozesse bedient und nicht nur ein Dashboard daraus macht.",
    to: "/web-software",
  },
  {
    kind: "Automation",
    lead: "KI-Automationen & Integrationen",
    body: "Stille Workflows, die manuelle Arbeit ersetzen und Systeme sauber miteinander verbinden.",
    to: "/ki-automationen-integrationen",
  },
  {
    kind: "Offen",
    lead: "Digitale Lösungen, die noch in keine Schublade passen",
    body: "Mischformen, Sonderfälle, neue Ideen — wenn die Kategorie erst entstehen muss, helfen wir beim Einordnen.",
  },
];

/**
 * 4-step typographic stairway for "So läuft der erste Austausch ab".
 * Numerals + kind-tags are editorial scaffolding; the step text is the
 * exact copy from the brief, lightly reframed for rhythm.
 */
const PROCESS_STEPS = [
  {
    roman: "I.",
    kind: "Eingang",
    body: "Du schickst uns dein Vorhaben, deine Idee oder deinen aktuellen Stand.",
  },
  {
    roman: "II.",
    kind: "Einordnung",
    body: "Wir schauen uns an, worum es geht und was wirklich gebraucht wird.",
  },
  {
    roman: "III.",
    kind: "Einschätzung",
    body: "Wir geben dir eine ehrliche Einschätzung, wie wir das Projekt sehen würden.",
  },
  {
    roman: "IV.",
    kind: "Zusammenarbeit",
    body: "Wenn es fachlich und menschlich passt, gehen wir die nächsten Schritte gemeinsam.",
  },
] as const;

/** Trust stanza — a short covenant, not a feature list. */
const EXPECT_STANZA = [
  "Klare Kommunikation.",
  "Direkte Einschätzung.",
  "Kein unnötiger Leerlauf.",
  "Hochwertige Umsetzung.",
  "Technisches Verständnis und Blick fürs Ganze.",
] as const;

/** Statement — identical vocabulary to /ueber-uns § Statement. */
const STATEMENT_LINES: string[][] = [
  ["Direkt", "sprechen."],
  ["Klar", "einordnen."],
  ["Sauber", "umsetzen."],
];

/** Form supporting checklist — what to include for a clear first message. */
const BRIEF_PROMPTS = [
  "worum es grob geht",
  "was du bauen möchtest",
  "ob es schon eine bestehende Seite oder Lösung gibt",
  "welche Ziele du verfolgst",
  "ob es einen groben Zeitrahmen gibt",
] as const;

/**
 * Internal-link register. The primary row points to the full service
 * overview and is rendered as a large, singular exit. The secondary
 * list gathers the four discipline-specific entry points as a quieter
 * cross-index below.
 */
const ORIENTATION_PRIMARY = {
  to: "/leistungen",
  label: "Alle Leistungen im Überblick",
  kind: "Register",
} as const;

const ORIENTATION_INDEX: Array<{ to: string; label: string; kind: string }> = [
  { to: "/websites-landingpages",         label: "Websites & Landing Pages",        kind: "Auftritt"   },
  { to: "/shops-produktkonfiguratoren",   label: "Shops & Produktkonfiguratoren",   kind: "Produkt"    },
  { to: "/web-software",                  label: "Web-Software",                    kind: "System"     },
  { to: "/ki-automationen-integrationen", label: "KI-Automationen & Integrationen", kind: "Automation" },
];

/* ---------------------------------------------------------------
 * Page
 * --------------------------------------------------------------- */

export default function ContactPage() {
  const heroRef = useRef<HTMLElement | null>(null);
  const processRef = useRef<HTMLElement | null>(null);
  const expectRef = useRef<HTMLElement | null>(null);
  const statementRef = useRef<HTMLElement | null>(null);

  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const { gsap, ScrollTrigger } = registerGsap();
    const cleanups: Array<() => void> = [];

    /* ---------- Hero intro timeline ---------- */
    const heroEl = heroRef.current;
    if (heroEl) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { duration: 0.95, ease: MAGICKS_EASE },
        });
        tl.from("[data-kon-folio]", { y: -8, opacity: 0, duration: 0.75 })
          .from(
            "[data-kon-h1] [data-kon-word]",
            { y: "102%", opacity: 0, duration: 1.15, stagger: 0.065 },
            "-=0.4",
          )
          .from(
            "[data-kon-intro]",
            { y: 14, opacity: 0, duration: 0.95, stagger: 0.085 },
            "-=0.6",
          )
          .from(
            "[data-kon-cta]",
            { y: 12, opacity: 0, duration: 0.85 },
            "-=0.35",
          )
          // Imprint rows reveal as a short cascade — they read as the studio's
          // signature, arriving just after the primary CTA has landed.
          .from(
            "[data-kon-imprint] [data-kon-imprint-row]",
            { y: 10, opacity: 0, duration: 0.8, stagger: 0.075 },
            "-=0.5",
          )
          .from(
            "[data-kon-secondary]",
            { y: 6, opacity: 0, duration: 0.65 },
            "-=0.35",
          )
          // Vertical credit fades in last, as a quiet perimeter signal.
          .from(
            "[data-kon-credit]",
            { opacity: 0, duration: 0.9 },
            "-=0.6",
          );
      }, heroEl);
      cleanups.push(() => ctx.revert());
    }

    /* ---------- Process rail draw-in ---------- */
    const processEl = processRef.current;
    if (processEl) {
      const ctx = gsap.context(() => {
        gsap.from("[data-kon-rail]", {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 1.6,
          ease: MAGICKS_EASE_SMOOTH,
          scrollTrigger: {
            trigger: processEl,
            start: "top 72%",
            end: "bottom 30%",
            scrub: 0.6,
          },
        });

        gsap.from("[data-kon-step]", {
          y: 26,
          opacity: 0,
          duration: 0.85,
          ease: MAGICKS_EASE,
          stagger: 0.13,
          scrollTrigger: {
            trigger: processEl,
            start: "top 76%",
            once: true,
          },
        });
      }, processEl);
      cleanups.push(() => ctx.revert());
    }

    /* ---------- Expect stanza cascade ---------- */
    const expectEl = expectRef.current;
    if (expectEl) {
      const ctx = gsap.context(() => {
        gsap.from("[data-kon-vow]", {
          y: 16,
          opacity: 0,
          duration: 0.95,
          ease: MAGICKS_EASE,
          stagger: 0.11,
          scrollTrigger: {
            trigger: expectEl,
            start: "top 70%",
            once: true,
          },
        });
      }, expectEl);
      cleanups.push(() => ctx.revert());
    }

    /* ---------- Statement — word-by-word, deliberate cadence ---------- */
    const statementEl = statementRef.current;
    if (statementEl) {
      const ctx = gsap.context(() => {
        gsap.from("[data-kon-stm-word]", {
          y: "102%",
          opacity: 0,
          duration: 1.4,
          ease: MAGICKS_EASE,
          stagger: 0.09,
          scrollTrigger: {
            trigger: statementEl,
            start: "top 68%",
            once: true,
          },
        });
      }, statementEl);
      cleanups.push(() => ctx.revert());
    }

    // Re-measure scroll positions once fonts settle.
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/kontakt" />

      <main className="relative overflow-hidden bg-[#0A0A0A] text-white">
        {/* ============================================================
           § Anfrage — Hero
           ============================================================ */}
        <section
          ref={heroRef}
          className="relative overflow-hidden px-5 pt-28 pb-20 sm:px-8 sm:pt-32 sm:pb-24 md:px-12 md:pt-36 md:pb-28 lg:px-16 lg:pt-44 lg:pb-36"
        >
          <HeroTexture />

          {/* Vertical credit — MAGICKS signature move, pinned to the hero's left edge */}
          <div
            data-kon-credit
            aria-hidden
            className="pointer-events-none absolute bottom-14 left-5 z-10 hidden select-none md:block lg:bottom-16 lg:left-8"
          >
            <span className="hero-vertical-credit">
              MAGICKS &nbsp;·&nbsp; ANFRAGE &nbsp;·&nbsp; KONTAKT &nbsp;·&nbsp; EDITION MMXXVI
            </span>
          </div>

          <div className="layout-max relative">
            {/* Top folio */}
            <div data-kon-folio className="flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-white/28 sm:w-14" />
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/50 sm:text-[10.5px]">
                § 00 — Kontakt · MAGICKS Studio
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/10" />
            </div>

            {/* H1 */}
            <h1
              data-kon-h1
              className="mt-10 max-w-[34ch] font-instrument text-[2.45rem] leading-[1.02] tracking-[-0.035em] text-white sm:mt-12 sm:text-[3.15rem] md:mt-14 md:text-[3.7rem] lg:text-[4.15rem]"
            >
              {splitWords("Lass uns über dein Projekt sprechen.")}
            </h1>

            {/* Intro tiers */}
            <div className="mt-10 grid gap-6 sm:mt-12 md:mt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-x-14">
              <p
                data-kon-intro
                className="font-ui max-w-[40rem] text-[16.5px] leading-[1.62] text-white/74 sm:text-[17px] md:text-[17.5px]"
              >
                {HERO_INTRO_LINES[0].text}
              </p>
              <div className="space-y-3 md:pt-[0.35rem]">
                <p
                  data-kon-intro
                  className="font-ui max-w-[30rem] text-[15.5px] leading-[1.55] text-white/60 sm:text-[16px]"
                >
                  {HERO_INTRO_LINES[1].text}
                </p>
                <p
                  data-kon-intro
                  className="font-instrument max-w-[30rem] text-[1.15rem] italic leading-[1.4] text-white/68 sm:text-[1.22rem] md:text-[1.26rem]"
                >
                  {HERO_INTRO_LINES[2].text}
                </p>
              </div>
            </div>

            {/* Primary CTA rail */}
            <div
              data-kon-cta
              className="mt-14 max-w-[44rem] border-t border-white/[0.14] pt-5 md:mt-16 md:pt-6"
            >
              <div className="flex items-baseline justify-between gap-6">
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/50 sm:text-[10.5px]">
                  § 00 · Formular
                </span>
                <UnderlineAnchor href="#anfrage" label="Projekt anfragen" />
              </div>
            </div>

            {/* Studio imprint — replaces the inline trust strip. Reads as a sealed studio card,
                not a feature list: hairlines open & close the block, rows are label/value pairs. */}
            <div data-kon-imprint className="mt-12 max-w-[44rem] sm:mt-14 md:mt-16">
              <HeroStudioImprint />
            </div>

            {/* Secondary anchor — quiet footer-of-hero, offers a "not ready yet" path without
                competing with the primary CTA above. Placed after trust to feel earned. */}
            <div
              data-kon-secondary
              className="mt-7 flex max-w-[44rem] justify-end sm:mt-8"
            >
              <Link
                to="/leistungen"
                className="group inline-flex items-baseline gap-2 font-mono text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/44 no-underline transition-colors duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:text-white sm:text-[10.5px]"
              >
                <span>Oder zuerst die Leistungen ansehen</span>
                <span
                  aria-hidden
                  className="font-instrument text-[0.95rem] not-italic tracking-normal transition-transform duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[2px]"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 00 · Anfrage" to="§ 01 · Einordnung" />

        {/* ============================================================
           § 01 — Einordnung
           ============================================================ */}
        <section className="relative overflow-hidden bg-[#0A0A0A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-40 lg:px-16 lg:py-44">
          <div className="layout-max relative">
            <div className="grid gap-10 md:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)] md:gap-x-14 lg:gap-x-20">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/44 sm:text-[10.5px]">
                  § 01 — Einordnung · Einstieg
                </p>
              </div>

              <div className="max-w-[46rem]">
                <h2 className="font-instrument text-[2rem] leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.35rem] md:text-[2.7rem]">
                  Der erste Schritt muss nicht kompliziert sein.
                </h2>

                <div className="mt-8 space-y-5 md:mt-10">
                  <p className="font-ui text-[16px] leading-[1.68] text-white/74 sm:text-[16.5px] md:text-[17px]">
                    Nicht jedes Projekt ist am Anfang komplett ausformuliert.
                    <br className="hidden sm:inline" />
                    Manchmal gibt es schon ein klares Ziel. Manchmal nur eine Richtung. Und manchmal ist nur klar,
                    dass die aktuelle Lösung nicht mehr reicht.
                  </p>

                  <p className="font-ui text-[15.5px] leading-[1.65] text-white/56 sm:text-[16px]">
                    Genau dafür ist der erste Austausch da. Wir schauen gemeinsam auf dein Vorhaben, stellen die
                    richtigen Fragen und ordnen ein, was sinnvoll ist — direkt, ehrlich und ohne unnötiges
                    Agenturtheater.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
           § 02 — Unterstützung (editorial register, not a bullet dump)
           ============================================================ */}
        <section className="relative overflow-hidden bg-[#08080A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-40 lg:px-16 lg:py-44">
          <span aria-hidden className="section-top-rule" />

          <div className="layout-max relative">
            <div className="grid gap-10 md:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] md:gap-x-14 lg:gap-x-20">
              <div className="md:pt-2">
                <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/44 sm:text-[10.5px]">
                  § 02 — Unterstützung · Register
                </p>

                <h2 className="mt-6 font-instrument text-[2rem] leading-[1.08] tracking-[-0.03em] text-white sm:text-[2.3rem] md:text-[2.5rem]">
                  Wobei wir dich <em className="italic text-white/72">unterstützen</em> können
                </h2>

                <p className="font-ui mt-6 max-w-[24rem] text-[14.5px] leading-[1.6] text-white/54 md:text-[15px]">
                  Ein Querschnitt, kein Baukasten. Wenn dein Projekt sich nicht sauber zuordnen lässt, ist das kein
                  Problem — wir klären das gemeinsam.
                </p>
              </div>

              <div>
                <ul className="-mt-5 divide-y divide-white/[0.08]">
                  {SUPPORT_REGISTER.map((item) =>
                    item.to ? (
                      // Whole row becomes the link target — hover scopes to the
                      // entire row so the mono kind-tag brightens in concert
                      // with the heading, rather than acting as dead chrome.
                      <li key={item.lead}>
                        <Link
                          to={item.to}
                          className="group block py-7 no-underline sm:py-8 md:py-9"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                            <span className="font-mono shrink-0 text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/40 transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:text-white/72 sm:w-[7.5rem] sm:text-[10px]">
                              · {item.kind}
                            </span>

                            <div className="flex-1 transition-transform duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px]">
                              <span className="inline-flex items-baseline gap-2">
                                <span className="font-instrument text-[1.55rem] leading-[1.2] tracking-[-0.018em] text-white transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:text-white/92 sm:text-[1.75rem] md:text-[1.95rem]">
                                  {item.lead}
                                </span>
                                <span
                                  aria-hidden
                                  className="font-instrument text-[1.3rem] italic text-white/42 transition-[color,transform] duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px] group-hover:text-white sm:text-[1.45rem]"
                                >
                                  →
                                </span>
                              </span>

                              <p className="font-ui mt-2 max-w-[38rem] text-[14.5px] leading-[1.6] text-white/58 md:text-[15px]">
                                {item.body}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ) : (
                      // Unlinked row — treated distinctly so it reads as "the
                      // open drawer" rather than a dimmed link. Kicker above
                      // the heading signals "intentionally open-ended."
                      <li key={item.lead} className="py-7 sm:py-8 md:py-9">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                          <span className="font-mono shrink-0 text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/34 sm:w-[7.5rem] sm:text-[10px]">
                            · {item.kind}
                          </span>

                          <div className="flex-1">
                            <span className="font-mono block text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10px]">
                              · offen — Mischform
                            </span>
                            <span className="mt-3 block font-instrument text-[1.55rem] italic leading-[1.2] tracking-[-0.018em] text-white/78 sm:text-[1.75rem] md:text-[1.95rem]">
                              {item.lead}
                            </span>
                            <p className="font-ui mt-2 max-w-[38rem] text-[14.5px] leading-[1.6] text-white/54 md:text-[15px]">
                              {item.body}
                            </p>
                          </div>
                        </div>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 02 · Register" to="§ 03 · Ablauf" tone="darker" />

        {/* ============================================================
           § 03 — Ablauf (typographic stairway)
           ============================================================ */}
        <section
          ref={processRef}
          className="relative overflow-hidden bg-[#0A0A0A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16 lg:py-52"
        >
          <ProcessTexture />

          <div className="layout-max relative">
            {/* Header */}
            <div className="max-w-[54rem]">
              <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/44 sm:text-[10.5px]">
                § 03 — Ablauf · Vier Schritte
              </p>
              <h2 className="mt-6 font-instrument text-[2.1rem] leading-[1.04] tracking-[-0.035em] text-white sm:text-[2.6rem] md:text-[3rem] lg:text-[3.45rem]">
                So läuft der <em className="italic text-white/74">erste Austausch</em> ab.
              </h2>
              <p className="font-ui mt-6 max-w-[38rem] text-[15.5px] leading-[1.65] text-white/58 sm:text-[16px]">
                Keine Stage-Präsentation, kein Pitch-Theater. Vier ruhige Schritte, die aus einer Idee einen klaren
                nächsten Schritt machen.
              </p>
            </div>

            {/* Stairway */}
            <div className="relative mt-16 sm:mt-20 md:mt-24 lg:mt-28">
              {/* Vertical rail — scrubbed via GSAP */}
              <span
                data-kon-rail
                aria-hidden
                className="pointer-events-none absolute left-[0.95rem] top-2 bottom-2 block w-px bg-gradient-to-b from-white/22 via-white/16 to-white/22 sm:left-[1.2rem] md:left-[1.5rem]"
              />

              <ol className="relative space-y-14 sm:space-y-16 md:space-y-20">
                {PROCESS_STEPS.map((step, i) => (
                  <li
                    key={step.roman}
                    data-kon-step
                    className="relative grid grid-cols-[minmax(0,2rem)_minmax(0,1fr)] items-baseline gap-x-6 pl-6 sm:grid-cols-[minmax(0,2.5rem)_minmax(0,1fr)] sm:gap-x-8 sm:pl-8 md:grid-cols-[minmax(0,3rem)_minmax(0,1fr)] md:pl-10"
                  >
                    {/* Rail node */}
                    <span
                      aria-hidden
                      className="absolute left-[0.72rem] top-[0.55rem] h-1.5 w-1.5 rounded-full bg-white sm:left-[0.97rem] sm:top-[0.75rem] sm:h-2 sm:w-2 md:left-[1.27rem]"
                    />

                    {/* Roman numeral column */}
                    <div className="font-instrument text-[1.35rem] italic leading-none text-white/56 sm:text-[1.55rem] md:text-[1.75rem]">
                      {step.roman}
                    </div>

                    {/* Body column */}
                    <div>
                      {/* Step header: kind on the left, step count on the right.
                          Splitting them gives the mono row editorial structure
                          instead of a chatty center-dot chain. */}
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/52 sm:text-[10px]">
                          · {step.kind}
                        </span>
                        <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.48em] text-white/34 sm:text-[9.5px]">
                          0{i + 1} / 04
                        </span>
                      </div>
                      <p className="mt-3 font-instrument text-[1.55rem] leading-[1.22] tracking-[-0.02em] text-white sm:mt-4 sm:text-[1.85rem] md:text-[2.1rem] lg:text-[2.35rem]">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ============================================================
           § 04 — Erwartung (covenant stanza)
           ============================================================ */}
        <section
          ref={expectRef}
          className="relative overflow-hidden bg-[#08080A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16 lg:py-52"
        >
          <span aria-hidden className="section-top-rule" />

          <div className="layout-max relative">
            <div className="mx-auto max-w-[60rem] text-center">
              <p className="font-instrument text-[1.3rem] italic leading-none tracking-[-0.02em] text-white/62 sm:text-[1.55rem] md:text-[1.8rem]">
                Was du erwarten kannst.
              </p>
              <p className="font-mono mt-5 text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                § 04 · Fünf Zusagen
              </p>

              <div className="mx-auto mt-14 flex max-w-[30rem] items-center gap-5 sm:mt-16 sm:gap-7">
                <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-white/0 via-white/18 to-white/22" />
                <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.48em] text-white/34 sm:text-[9.5px]">
                  i — v
                </span>
                <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-white/0 via-white/18 to-white/22" />
              </div>

              <ul className="mt-14 space-y-10 sm:mt-16 sm:space-y-12 md:mt-20 md:space-y-14">
                {EXPECT_STANZA.map((line, i) => {
                  // Two-tier cadence only: primary lines & one italic pause.
                  // Line 3 ("Kein unnötiger Leerlauf") sits as a quieter caesura
                  // in the middle of the stanza — all other lines share the
                  // same weight so the litany reads as conviction, not design.
                  const isPause = i === 2;
                  return (
                    <li
                      key={line}
                      data-kon-vow
                      className={[
                        "font-instrument leading-[1.16] tracking-[-0.02em] text-white",
                        isPause
                          ? "text-[1.45rem] italic text-white/72 sm:text-[1.75rem] md:text-[2.05rem] lg:text-[2.2rem]"
                          : "text-[1.65rem] sm:text-[2.05rem] md:text-[2.4rem] lg:text-[2.6rem]",
                      ].join(" ")}
                    >
                      {line}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* ============================================================
           § 05 — Offenheit (non-standard projects welcome)
           Centered pivot — this section functions as a quiet prelude
           to the main § Statement. The repeated "marginalia grid" from
           §§ 01 & 02 would make this read as a third helping of the
           same pattern; centering it differentiates the beat and sets
           up the ceremonial pivot below.
           ============================================================ */}
        <section className="relative overflow-hidden bg-[#0A0A0A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-40 lg:px-16 lg:py-44">
          <div className="layout-max relative">
            <div className="mx-auto max-w-[50rem] text-center">
              <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/42 sm:text-[10.5px]">
                § 05 — Offenheit · Sonderfälle
              </p>

              <h2 className="mt-8 font-instrument text-[2.05rem] leading-[1.05] tracking-[-0.03em] text-white sm:mt-10 sm:text-[2.5rem] md:mt-12 md:text-[3rem] lg:text-[3.3rem]">
                <em className="italic text-white/74">Kein Standardprojekt?</em> Gut.
              </h2>

              <div className="mx-auto mt-10 max-w-[42rem] space-y-5 sm:mt-12 md:mt-14">
                <p className="font-ui text-[16px] leading-[1.7] text-white/74 sm:text-[16.5px] md:text-[17px]">
                  Viele spannende Projekte passen am Anfang nicht sauber in eine Kategorie.
                  Manchmal ist es eine Website mit tieferer Logik. Manchmal ein Konfigurator mit Vertriebsprozess.
                  Manchmal eine Web-Anwendung, in der später noch Automationen dazukommen.
                </p>

                <p className="font-ui mx-auto max-w-[38rem] text-[15.5px] leading-[1.66] text-white/56 sm:text-[16px]">
                  Genau deshalb denken wir nicht in starren Schubladen. Wir helfen dir, das Projekt richtig
                  einzuordnen und daraus einen klaren nächsten Schritt zu machen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
           § Statement — ceremonial
           ============================================================ */}
        <section
          ref={statementRef}
          className="relative overflow-hidden bg-[#070708] px-5 py-32 sm:px-8 sm:py-44 md:px-12 md:py-52 lg:px-16 lg:py-[14rem]"
        >
          <StatementTexture />
          <div className="layout-max relative">
            <div className="mx-auto max-w-[60rem] text-center">
              <p className="font-instrument text-[1.25rem] italic leading-none tracking-[-0.02em] text-white/60 sm:text-[1.5rem] md:text-[1.75rem]">
                — Haltung —
              </p>

              <h2 className="mt-12 font-instrument text-[2.05rem] leading-[1.04] tracking-[-0.035em] text-white sm:mt-14 sm:text-[2.95rem] md:mt-16 md:text-[3.75rem] lg:text-[4.6rem]">
                {STATEMENT_LINES.map((line, li) => (
                  <span key={li} className="block">
                    {line.map((word, wi) => (
                      <span
                        key={`${li}-${wi}`}
                        data-kon-stm-word
                        className="inline-block overflow-hidden align-bottom"
                      >
                        <span
                          className={`inline-block ${
                            wi === 1 ? "italic text-white/76" : ""
                          }`}
                        >
                          {word}
                          {wi < line.length - 1 ? "\u00A0" : ""}
                        </span>
                      </span>
                    ))}
                  </span>
                ))}
              </h2>

              <div className="mx-auto mt-14 flex max-w-[32rem] items-baseline justify-center gap-5 sm:mt-16 sm:gap-6">
                <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-white/0 via-white/20 to-white/26" />
                <span className="font-instrument whitespace-nowrap text-[1.1rem] italic leading-none tracking-[-0.01em] text-white/76 sm:text-[1.2rem] md:text-[1.3rem]">
                  MAGICKS
                </span>
                <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-white/0 via-white/20 to-white/26" />
              </div>
              <div className="mt-3 flex items-center justify-center">
                <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.48em] text-white/38 sm:text-[10px]">
                  · Kontakt · MMXXVI ·
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
           § Anfrage — Formular (the main act)
           Layout: title-page treatment above, full-width form below.
           This gives the form maximum presence instead of relegating it
           to a right-hand column — the intent is "this is the work."
           ============================================================ */}
        <section className="relative overflow-hidden bg-[#08080A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16 lg:py-52">
          <span aria-hidden className="section-top-rule" />
          <FormTexture />

          <div className="layout-max relative">
            {/* Title page — centered, acts as the form's frontispiece */}
            <div className="mx-auto max-w-[48rem] text-center">
              <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.48em] text-white/44 sm:text-[10.5px]">
                § Anfrage — Formular
              </p>

              <h2 className="mt-6 font-instrument text-[2.1rem] leading-[1.04] tracking-[-0.032em] text-white sm:mt-8 sm:text-[2.55rem] md:mt-10 md:text-[2.95rem] lg:text-[3.2rem]">
                Erzähl uns, worum es <em className="italic text-white/74">geht</em>.
              </h2>

              <p className="font-ui mx-auto mt-7 max-w-[36rem] text-[15.5px] leading-[1.7] text-white/68 sm:mt-8 sm:text-[16px] md:text-[16.5px]">
                Je klarer du dein Vorhaben beschreibst, desto gezielter können wir einschätzen, was sinnvoll ist.
                Ganz unkompliziert reicht zum Start schon:
              </p>

              {/* Prompt checklist — left-aligned inside centered column so
                  it reads as a prep sheet rather than a centered list. */}
              <ul className="mx-auto mt-10 max-w-[34rem] space-y-3 border-l border-white/[0.12] pl-5 text-left sm:mt-12 sm:space-y-[0.9rem]">
                {BRIEF_PROMPTS.map((prompt, i) => (
                  <li
                    key={prompt}
                    className="flex items-baseline gap-3 font-ui text-[14px] leading-[1.55] text-white/68 sm:text-[14.5px] md:text-[15px]"
                  >
                    <span
                      aria-hidden
                      className="font-instrument shrink-0 text-[1rem] italic leading-none text-white/44 sm:text-[1.05rem]"
                    >
                      {String.fromCharCode(97 + i)}.
                    </span>
                    <span>{prompt}</span>
                  </li>
                ))}
              </ul>

              {/* Downward gesture — guides the eye into the form below
                  without shouting. One quiet hairline, no ornament. */}
              <div
                aria-hidden
                className="mx-auto mt-14 flex max-w-[18rem] items-center gap-4 sm:mt-16"
              >
                <span className="h-px flex-1 bg-gradient-to-r from-white/0 to-white/22" />
                <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.48em] text-white/40 sm:text-[10px]">
                  ↓ Formular
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-white/0 to-white/22" />
              </div>
            </div>

            {/* Form — constrained to a comfortable reading/typing width
                so it doesn't stretch edge-to-edge, but clearly dominant. */}
            <div className="mx-auto mt-16 max-w-[58rem] sm:mt-20 md:mt-24">
              <ProjectIntakeForm />
            </div>
          </div>
        </section>

        {/* ============================================================
           § Direkt — alternative contact
           ============================================================ */}
        <section className="relative overflow-hidden bg-[#0A0A0A] px-5 py-24 sm:px-8 sm:py-28 md:px-12 md:py-32 lg:px-16 lg:py-36">
          <span aria-hidden className="section-top-rule" />

          <div className="layout-max relative">
            <div className="grid gap-10 md:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] md:items-baseline md:gap-x-14">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/44 sm:text-[10.5px]">
                  § Direkt · Alternativer Weg
                </p>

                <h2 className="mt-6 font-instrument text-[1.85rem] leading-[1.1] tracking-[-0.028em] text-white sm:text-[2.15rem] md:text-[2.35rem]">
                  Lieber direkt schreiben?
                </h2>

                <p className="font-ui mt-5 max-w-[28rem] text-[15px] leading-[1.62] text-white/58 sm:text-[15.5px] md:text-[16px]">
                  Du kannst uns auch direkt kontaktieren — wir antworten in der Regel innerhalb eines Werktages.
                </p>
              </div>

              <div className="relative border-t border-white/[0.14] pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-2 lg:pl-14">
                <a
                  href="mailto:hello@magicks.studio"
                  className="group inline-flex flex-col gap-3 no-underline"
                >
                  <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/40 transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:text-white/72 sm:text-[10px]">
                    · Studio · Direktkontakt ·
                  </span>
                  <span className="relative inline-block">
                    <span className="font-instrument text-[2rem] italic leading-[1.05] tracking-[-0.025em] text-white transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:text-white/84 sm:text-[2.5rem] md:text-[2.95rem] lg:text-[3.25rem]">
                      hello@magicks.studio
                    </span>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 -bottom-1 block h-px origin-left scale-x-0 bg-white/38 transition-transform duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                    />
                  </span>
                  {/* Hover-only micro-hint — idle state stays quieter */}
                  <span
                    aria-hidden
                    className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/0 transition-[color,transform] duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[2px] group-hover:text-white/62 sm:text-[10.5px]"
                  >
                    ↘ Mail öffnen
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
           § Orientierung — internal link register
           Hierarchy: /leistungen is the primary exit (big serif italic
           link), the four discipline pages sit below as a compact
           secondary index. This reads as "main way out, or direct
           entries" rather than a flat list of five equal links.
           ============================================================ */}
        <section className="relative overflow-hidden bg-[#08080A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-40 lg:px-16 lg:py-44">
          <span aria-hidden className="section-top-rule" />

          <div className="layout-max relative">
            <div className="mx-auto max-w-[62rem]">
              {/* Section header — centered, functions as an editorial lede */}
              <div className="text-center">
                <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/44 sm:text-[10.5px]">
                  § Orientierung · Letzte Wegweisung
                </p>

                <h2 className="mt-6 font-instrument text-[1.95rem] leading-[1.08] tracking-[-0.028em] text-white sm:text-[2.3rem] md:text-[2.55rem]">
                  Noch nicht sicher, <em className="italic text-white/74">welche Leistung</em> passt?
                </h2>

                <p className="font-ui mx-auto mt-6 max-w-[32rem] text-[15px] leading-[1.64] text-white/60 sm:text-[15.5px] md:text-[16px]">
                  Dann schau dir zuerst unsere Leistungen oder die passenden Lösungsseiten an.
                </p>
              </div>

              {/* Primary exit — /leistungen, promoted as a singular large link */}
              <div className="mx-auto mt-14 max-w-[44rem] border-t border-white/[0.14] pt-8 sm:mt-16 md:mt-20 md:pt-10">
                <Link
                  to={ORIENTATION_PRIMARY.to}
                  className="group flex items-baseline justify-between gap-6 no-underline"
                >
                  <span className="flex-1">
                    <span className="block font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/42 transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:text-white/72 sm:text-[10px]">
                      · {ORIENTATION_PRIMARY.kind} · Hauptweg
                    </span>
                    <span className="mt-3 block font-instrument text-[1.75rem] leading-[1.08] tracking-[-0.022em] text-white transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:text-white/86 sm:mt-4 sm:text-[2.1rem] md:text-[2.45rem] lg:text-[2.7rem]">
                      <em className="italic text-white/82">{ORIENTATION_PRIMARY.label}</em>
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="font-instrument shrink-0 self-center text-[1.65rem] italic text-white/50 transition-[color,transform] duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[4px] group-hover:text-white sm:text-[2rem] md:text-[2.35rem]"
                  >
                    →
                  </span>
                </Link>
              </div>

              {/* Transition — "or go directly" */}
              <div className="mx-auto mt-14 flex max-w-[28rem] items-center gap-5 sm:mt-16 sm:gap-7">
                <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-white/0 via-white/14 to-white/18" />
                <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.48em] text-white/38 sm:text-[10px]">
                  oder direkt
                </span>
                <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-white/0 via-white/14 to-white/18" />
              </div>

              {/* Secondary index — the four disciplines, compact */}
              <ul className="mx-auto mt-10 max-w-[52rem] divide-y divide-white/[0.06] sm:mt-12">
                {ORIENTATION_INDEX.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="group flex items-baseline gap-5 py-4 no-underline sm:gap-6 sm:py-5 md:py-[1.35rem]"
                    >
                      <span className="font-mono w-[6rem] shrink-0 text-[9px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:text-white/68 sm:w-[7.5rem] sm:text-[9.5px]">
                        · {item.kind}
                      </span>
                      <span className="flex-1 font-instrument text-[1.1rem] leading-[1.3] tracking-[-0.015em] text-white/86 transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:text-white sm:text-[1.22rem] md:text-[1.32rem]">
                        {item.label}
                      </span>
                      <span
                        aria-hidden
                        className="font-instrument shrink-0 text-[0.95rem] italic text-white/38 transition-[color,transform] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px] group-hover:text-white sm:text-[1.05rem]"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ============================================================
           § End — final CTA
           ============================================================ */}
        <section className="relative overflow-hidden bg-[#070708] px-5 pt-28 pb-24 sm:px-8 sm:pt-36 sm:pb-28 md:px-12 md:pt-44 md:pb-32 lg:px-16 lg:pt-52 lg:pb-36">
          <EndTexture />

          <div className="layout-max relative">
            <div className="mx-auto max-w-[52rem] text-center">
              {/* Ceremonial kicker — "Einladung." reads as an open door rather
                  than a closing sentence, keeping the final beat inviting. */}
              <p className="font-instrument text-[1.25rem] italic leading-none tracking-[-0.02em] text-white/66 sm:text-[1.5rem] md:text-[1.75rem]">
                Einladung.
              </p>
              <p className="font-mono mt-4 text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                § End · MAGICKS Studio
              </p>

              <h2 className="mt-12 font-instrument text-[2.1rem] leading-[1.06] tracking-[-0.035em] text-white sm:mt-14 sm:text-[2.7rem] md:mt-16 md:text-[3.2rem] lg:text-[3.7rem]">
                Bereit, etwas zu bauen, das <em className="italic text-white/76">nicht wie Standard</em> endet?
              </h2>

              <p className="font-ui mx-auto mt-7 max-w-[38rem] text-[15.5px] leading-[1.65] text-white/62 sm:mt-8 sm:text-[16px] md:text-[16.5px]">
                Wenn du ein digitales Projekt planst und einen Partner suchst, der direkt arbeitet, mitdenkt und
                sauber umsetzt, dann lass uns sprechen.
              </p>

              {/* Pill CTA */}
              <div className="mt-12 flex items-center justify-center sm:mt-14">
                <a
                  href="#anfrage"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-9 py-[1.05rem] text-[15.5px] font-semibold text-[#0A0A0A] no-underline shadow-[0_34px_80px_-32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.45)] transition-[transform,box-shadow] duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:shadow-[0_44px_90px_-28px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.55)] sm:gap-3.5 sm:px-10 sm:py-[1.2rem] sm:text-[16px] md:px-11 md:text-[16.5px]"
                >
                  <span>Nachricht senden</span>
                  <span
                    aria-hidden
                    className="font-instrument text-[1.1em] italic transition-transform duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px] group-hover:translate-x-[3px]"
                  >
                    →
                  </span>
                </a>
              </div>

              {/* Colophon — closes the page on the studio, not on finality. */}
              <div className="mx-auto mt-16 flex max-w-[36rem] items-center gap-5 sm:mt-20 sm:gap-7">
                <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-white/0 via-white/18 to-white/22" />
                <span className="font-mono whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.48em] text-white/38 sm:text-[10px]">
                  · MAGICKS Studio · Kassel · MMXXVI ·
                </span>
                <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-white/0 via-white/18 to-white/22" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/* ================================================================
   Helpers — typography splitters, inline CTAs, section textures
   ================================================================ */

/** Splits a string into word-span tokens for hero H1 stagger reveal. */
function splitWords(text: string) {
  return text.split(" ").map((word, i, arr) => (
    <span key={i} className="inline-block overflow-hidden align-bottom">
      <span data-kon-word className="inline-block">
        {word}
        {i < arr.length - 1 ? "\u00A0" : ""}
      </span>
    </span>
  ));
}

/**
 * HeroStudioImprint — sealed three-row imprint block that closes the hero.
 * Replaces a chatty inline trust strip with a proper studio card: hairlines
 * open and close the block, rows are strict label / value pairs with a
 * right-aligned signature below. Every signal is honest (no invented
 * certifications, no fake numbers, no client logos).
 */
function HeroStudioImprint() {
  const rows: Array<{ label: string; value: string; italic?: boolean }> = [
    { label: "Antwort",   value: "≤ 24 Stunden" },
    { label: "Gespräch",  value: "Einordnung · nicht Pitch", italic: true },
    { label: "Studio",    value: "Kassel · Remote" },
  ];

  return (
    <div className="relative">
      {/* Opening rule */}
      <span aria-hidden className="block h-px w-full bg-white/[0.14]" />

      <dl className="divide-y divide-white/[0.06]">
        {rows.map((row) => (
          <div
            key={row.label}
            data-kon-imprint-row
            className="grid grid-cols-[7.5rem_1fr] items-baseline gap-5 py-4 sm:grid-cols-[9rem_1fr] sm:gap-7 sm:py-[1.05rem] md:grid-cols-[10rem_1fr] md:py-5"
          >
            <dt className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/44 sm:text-[10px]">
              · {row.label}
            </dt>
            <dd
              className={[
                "font-instrument leading-[1.2] tracking-[-0.01em] text-white/88",
                "text-[1.05rem] sm:text-[1.15rem] md:text-[1.22rem]",
                row.italic ? "italic text-white/80" : "",
              ].join(" ")}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Closing rule + signature */}
      <span aria-hidden className="block h-px w-full bg-white/[0.14]" />
      <div className="mt-3 flex items-center justify-between gap-6">
        <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.48em] text-white/34 sm:text-[9.5px]">
          · Kontakt · MMXXVI ·
        </span>
        <span
          aria-hidden
          className="font-instrument text-[0.95rem] italic leading-none tracking-[-0.005em] text-white/42 sm:text-[1rem]"
        >
          MAGICKS Studio
        </span>
      </div>
    </div>
  );
}

/** Inline underline CTA — pairs with a rail + folio tag in the parent. */
function UnderlineAnchor({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="group relative inline-flex items-baseline gap-3 text-[15px] font-medium tracking-[-0.005em] text-white no-underline sm:text-[16px] md:text-[17px]"
      aria-label={label}
    >
      <span className="relative pb-3">
        <span className="font-ui">{label}</span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left bg-white/34 transition-[background-color,transform] duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:bg-white"
        />
      </span>
      <span
        aria-hidden
        className="font-instrument text-[1.05em] italic text-white/72 transition-[color,transform] duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px] group-hover:text-white"
      >
        →
      </span>
    </a>
  );
}

/* ——— Section textures. Subtle, never noisy. ——— */

function HeroTexture() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_78%_58%_at_50%_102%,rgba(255,255,255,0.06),transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_8%_10%,rgba(255,255,255,0.04),transparent_60%)]"
      />
    </>
  );
}

function ProcessTexture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_-10%,rgba(255,255,255,0.045),transparent_60%)]"
    />
  );
}

function StatementTexture() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_72%_52%_at_50%_50%,rgba(255,255,255,0.045),transparent_66%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent"
      />
    </>
  );
}

function FormTexture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_85%_8%,rgba(255,255,255,0.035),transparent_60%)]"
    />
  );
}

function EndTexture() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(255,255,255,0.06),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_42%_at_50%_110%,rgba(255,255,255,0.04),transparent_60%)]"
      />
    </>
  );
}
