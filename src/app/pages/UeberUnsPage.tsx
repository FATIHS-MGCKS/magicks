import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap, MAGICKS_EASE } from "../lib/gsap";
import { parallaxDrift, presenceEnvelope, rackFocusTrack } from "../lib/scrollMotion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SectionTransition } from "../components/service/SectionTransition";
import { EditorialAnchor } from "../components/service/EditorialAnchor";
import { RouteSEO } from "../seo/RouteSEO";

/* ------------------------------------------------------------------
 * /ueber-uns — positioning manifesto for MAGICKS Studio.
 *
 * This page is written as a printed manifesto — preamble, position,
 * thesis, method, principia, work, trust — sealed with a ceremonial
 * statement and a closing invitation. It is deliberately not a
 * biography, not a timeline, not a team-grid template.
 *
 * Design register: typographic, aphoristic, statement-led. Keeps the
 * MAGICKS tokens (serif H1/H2, mono eyebrows, hairline rules) used on
 * /leistungen and the service detail pages, but reorganises them into
 * a manifesto vocabulary (declarations, not plates) so the two pages
 * stay clearly distinct.
 *
 * Sections:
 *   · § Präambel     — hero: folio, serif H1, intro, CTA, studio colophon
 *   · § 01 Position  — "Was MAGICKS ausmacht" (marginalia)
 *   · § 02 Wirkung   — "Wir denken nicht in hübschen Screens" (full-measure thesis)
 *   · § 03 Methode   — "Wie wir arbeiten" (stanza + 4-row register)
 *   · § 04 Principia — "Wofür wir stehen" (6 stacked aphorisms)
 *   · § 05 Werk      — "Was wir bauen" (prose + editorial index)
 *   · § 06 Vertrauen — "Warum Unternehmen mit MAGICKS arbeiten" (4-reasons stanza)
 *   · § Statement    — ceremonial 3-line declaration
 *   · § Einladung    — "Wenn du keine Lust auf Standard hast" → /kontakt
 *   · § End          — final CTA + register plate footer
 * ------------------------------------------------------------------ */

/* --- Manifesto data ------------------------------------------------ */

const PRINCIPIA: { num: string; head: string; tail: string }[] = [
  { num: "I",   head: "Klarheit",  tail: "statt Komplexität um ihrer selbst willen." },
  { num: "II",  head: "Qualität",  tail: "statt Mittelmaß." },
  { num: "III", head: "Tempo",     tail: "ohne Schlampigkeit." },
  { num: "IV",  head: "Design",    tail: "mit Anspruch." },
  { num: "V",   head: "Technik",   tail: "mit Struktur." },
  { num: "VI",  head: "Lösungen,", tail: "die wirklich weiterbringen." },
];

const METHOD: { num: string; kind: string; lead: string; body: string }[] = [
  { num: "01", kind: "Kommunikation", lead: "Klare Kommunikation",     body: "statt endloser Schleifen." },
  { num: "02", kind: "Entscheidung",  lead: "Schnelle Entscheidungen", body: "statt unnötigem Leerlauf." },
  { num: "03", kind: "Umsetzung",     lead: "Saubere Umsetzung",       body: "statt schöner Präsentationen ohne Substanz." },
  { num: "04", kind: "Einsatz",       lead: "Digitale Lösungen",       body: "die nicht nur im Pitch überzeugen, sondern im echten Einsatz." },
];

const WERK_INDEX: { folio: string; label: string; to: string; hint: string }[] = [
  { folio: "I",   label: "Websites & Landing Pages",        to: "/websites-landingpages",         hint: "Auftritt · Konversion" },
  { folio: "II",  label: "Shops & Produktkonfiguratoren",   to: "/shops-produktkonfiguratoren",   hint: "Produkt · Entscheidung" },
  { folio: "III", label: "Web-Software",                    to: "/web-software",                  hint: "System · Prozess" },
  { folio: "IV",  label: "KI-Automationen & Integrationen", to: "/ki-automationen-integrationen", hint: "Fluss · Entlastung" },
];

const REASONS: { num: string; head: string; tail: string }[] = [
  { num: "a", head: "Weil wir nicht erst drei Prozesse erfinden,", tail: "bevor etwas entsteht." },
  { num: "b", head: "Weil wir Entscheidungen treffen können.",     tail: "Direkt, begründet, ohne Schleifen." },
  { num: "c", head: "Weil wir Gestaltung und Technik",             tail: "wirklich ernst nehmen." },
  { num: "d", head: "Weil wir Projekte nicht als lose Seiten sehen,", tail: "sondern als Systeme, die im Alltag funktionieren müssen." },
];

const STATEMENT_LINES = [
  ["Websites,", "die", "wirken."],
  ["Automationen,", "die", "entlasten."],
  ["Ergebnisse,", "die", "bleiben."],
];

/* --- Component ----------------------------------------------------- */

export default function UeberUnsPage() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (reduced) return;
    const { gsap, ScrollTrigger } = registerGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      /* Hero — unified reveal timeline. Fewer overlapping beats, slightly
         slower overall pacing so the page opens with composure, not rush. */
      const heroEyebrow = root.querySelector("[data-ab-eyebrow]");
      const heroHead    = root.querySelectorAll<HTMLElement>("[data-ab-head] > span > span");
      const heroLead    = root.querySelectorAll<HTMLElement>("[data-ab-lead]");
      const heroCta     = root.querySelector<HTMLElement>("[data-ab-cta]");
      const heroColophonRows = root.querySelectorAll<HTMLElement>("[data-ab-colo-row]");
      const heroCredit  = root.querySelector<HTMLElement>("[data-ab-credit]");
      const heroMasthead = root.querySelectorAll<HTMLElement>("[data-ab-masthead] > *");

      const tl = gsap.timeline({ defaults: { ease: MAGICKS_EASE } });
      if (heroEyebrow) tl.from(heroEyebrow, { opacity: 0, y: 4, duration: 0.7 }, 0);
      if (heroHead.length)
        tl.from(heroHead, { yPercent: 112, opacity: 0, duration: 1.25, stagger: 0.09 }, 0.15);
      if (heroLead.length)
        tl.from(heroLead, { opacity: 0, y: 14, duration: 1.0, stagger: 0.08 }, 0.7);
      if (heroColophonRows.length)
        tl.from(heroColophonRows, { opacity: 0, y: 8, duration: 0.8, stagger: 0.07 }, 0.55);
      if (heroCta) tl.from(heroCta, { opacity: 0, y: 10, duration: 0.85 }, 1.05);
      if (heroMasthead.length)
        tl.from(heroMasthead, { opacity: 0, y: 4, duration: 0.9, stagger: 0.05 }, 1.2);
      if (heroCredit) tl.from(heroCredit, { opacity: 0, duration: 1.1 }, 1.1);

      /* ---- Hero scroll-exit — makes the preamble feel spatial ----
       * The hero copy parallaxes up and softens as the reader moves
       * on, so the page releases its opening page rather than snapping
       * from "hero" to "body". Atmospheric field on the backdrop
       * breathes in and out with scroll. Vertical credit fades as a
       * perimeter signal once the reader has clearly left the hero. */
      const heroSection = root.querySelector<HTMLElement>("[data-ab-hero]");
      const heroCopy = root.querySelector<HTMLElement>("[data-ab-hero-copy]");
      const heroTexture = root.querySelector<HTMLElement>("[data-ab-hero-texture]");

      if (heroCopy && heroSection) {
        gsap.to(heroCopy, {
          yPercent: -6,
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

      if (heroTexture && heroSection) {
        // Subtle texture parallax only — keeps the hero present on
        // first load, then drifts quietly as the reader scrolls past.
        // We deliberately avoid a full atmosphericField here so the
        // opening page reads at peak immediately.
        parallaxDrift(heroTexture, {
          trigger: heroSection,
          from: 0,
          to: -24,
          start: "top top",
          end: "bottom top",
          scrub: true,
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

      const heroMastheadBox = root.querySelector<HTMLElement>("[data-ab-masthead]");
      if (heroMastheadBox && heroSection) {
        // The bottom "Manifest · MAGICKS · MMXXVI" masthead drifts
        // upward slightly with the reader so it feels anchored to
        // the hero frame, not pinned in place.
        parallaxDrift(heroMastheadBox, {
          trigger: heroSection,
          from: 0,
          to: -12,
          start: "top top",
          end: "bottom top",
          scrub: true,
        });
      }

      /* =================================================================
       * Bidirectional scroll motion — manifesto-grade choreography.
       *
       * Every non-hero section is treated as a three-zone envelope:
       *   · entry — block gathers presence from soft/blurred state
       *   · focus — block holds its clearest, sharpest state
       *   · exit  — block gently softens, letting the next passage speak
       *
       * Scrolling up re-plays the choreography in reverse. No once:true
       * latches, no hard reveals, no springy easing.
       * ================================================================= */

      /* Generic reveal — every [data-ab-reveal] block breathes through
         the viewport. Triggered per-element with a wide envelope so
         long blocks fade in and out naturally. */
      const reveals = gsap.utils.toArray<HTMLElement>("[data-ab-reveal]");
      presenceEnvelope(reveals, {
        start: "top 90%",
        end: "bottom 12%",
        yFrom: 20,
        yTo: -12,
        blur: 4,
        holdRatio: 0.5,
        scrub: 0.95,
      });

      /* Principia — each aphorism gains presence as a line, with a
         scrubbed letter-spacing settle driven by its own position.
         The whole stanza doubles as a section group so adjacent lines
         read as a passage rather than individual reveals. */
      const principia = gsap.utils.toArray<HTMLElement>("[data-ab-principle]");
      if (principia.length) {
        const principiaSection =
          (principia[0] as HTMLElement).closest("section") ?? principia[0];

        gsap.set(principia, {
          opacity: 0,
          y: 18,
          letterSpacing: "0.05em",
          filter: "blur(5px)",
        });

        gsap.to(principia, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          letterSpacing: "-0.025em",
          ease: "none",
          stagger: 0.06,
          scrollTrigger: {
            trigger: principiaSection,
            start: "top 82%",
            end: "top 20%",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });

        // Gentle release on exit — the stanza softens, it does not vanish.
        gsap.to(principia, {
          opacity: 0.38,
          filter: "blur(3px)",
          letterSpacing: "0.004em",
          ease: "none",
          stagger: 0.03,
          scrollTrigger: {
            trigger: principiaSection,
            start: "bottom 55%",
            end: "bottom 5%",
            scrub: 1.0,
            invalidateOnRefresh: true,
          },
        });
      }

      /* Method rows — horizontal drift stagger, now scroll-coupled.
         Reads as a register of method entries being brought into focus. */
      const methodRows = gsap.utils.toArray<HTMLElement>("[data-ab-method-row]");
      if (methodRows.length) {
        const methodSection =
          (methodRows[0] as HTMLElement).closest("section") ?? methodRows[0];

        gsap.set(methodRows, {
          opacity: 0,
          x: -18,
          filter: "blur(4px)",
        });
        gsap.to(methodRows, {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.08,
          scrollTrigger: {
            trigger: methodSection,
            start: "top 82%",
            end: "top 30%",
            scrub: 1.0,
            invalidateOnRefresh: true,
          },
        });
      }

      /* Werk index rows — focus track: each row tightens as it enters
         the reading band, softens as it exits. */
      const werkRows = gsap.utils.toArray<HTMLElement>("[data-ab-werk-row]");
      if (werkRows.length) {
        const werkSection =
          (werkRows[0] as HTMLElement).closest("section") ?? werkRows[0];

        gsap.set(werkRows, { opacity: 0, y: 14, filter: "blur(4px)" });
        gsap.to(werkRows, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.075,
          scrollTrigger: {
            trigger: werkSection,
            start: "top 82%",
            end: "top 26%",
            scrub: 1.0,
            invalidateOnRefresh: true,
          },
        });
      }

      /* Reasons stanza — four lines read as a single measured breath. */
      const reasonLines = gsap.utils.toArray<HTMLElement>("[data-ab-reason]");
      if (reasonLines.length) {
        const reasonsSection =
          (reasonLines[0] as HTMLElement).closest("section") ?? reasonLines[0];

        gsap.set(reasonLines, { opacity: 0, y: 14, filter: "blur(5px)" });
        gsap.to(reasonLines, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.09,
          scrollTrigger: {
            trigger: reasonsSection,
            start: "top 80%",
            end: "top 22%",
            scrub: 1.05,
            invalidateOnRefresh: true,
          },
        });

        gsap.to(reasonLines, {
          opacity: 0.3,
          filter: "blur(3px)",
          ease: "none",
          stagger: 0.04,
          scrollTrigger: {
            trigger: reasonsSection,
            start: "bottom 55%",
            end: "bottom 5%",
            scrub: 1.0,
            invalidateOnRefresh: true,
          },
        });
      }

      /* Ceremonial statement — masked word-by-word lift, scroll-coupled
         so the declaration rises as the reader engages and settles back
         into the page when they move on. The mask/clipping is preserved
         by the parent overflow; we only animate translate + opacity. */
      const statementWords = gsap.utils.toArray<HTMLElement>(
        "[data-ab-statement] [data-ab-word] > span",
      );
      if (statementWords.length) {
        const statementSection =
          (statementWords[0] as HTMLElement).closest("section") ?? statementWords[0];

        gsap.set(statementWords, { yPercent: 120, opacity: 0 });
        gsap.to(statementWords, {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: {
            trigger: statementSection,
            start: "top 78%",
            end: "top 28%",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });

        // Gentle release — the statement softens slightly but stays
        // legible until the user is clearly past it.
        gsap.to(statementWords, {
          opacity: 0.32,
          ease: "none",
          stagger: 0.02,
          scrollTrigger: {
            trigger: statementSection,
            start: "bottom 52%",
            end: "bottom 0%",
            scrub: 1.0,
            invalidateOnRefresh: true,
          },
        });
      }

      /* Invitation plates — two blocks side-by-side, each with its own
         presence envelope so they read as a paired declaration. */
      const invBlocks = gsap.utils.toArray<HTMLElement>("[data-ab-invite]");
      if (invBlocks.length) {
        presenceEnvelope(invBlocks, {
          start: "top 88%",
          end: "bottom 12%",
          yFrom: 22,
          yTo: -12,
          blur: 4,
          holdRatio: 0.5,
          stagger: 0.12,
          scrub: 1.0,
        });
      }

      /* Final CTA — the display H2 settles into focus as the reader
         arrives; the body paragraph and CTA rail track alongside. */
      const finalHead = root.querySelector<HTMLElement>("[data-ab-final-head]");
      const finalBody = gsap.utils.toArray<HTMLElement>("[data-ab-final-body]");
      const finalSection =
        finalHead?.closest("section") ??
        (finalBody[0] as HTMLElement | undefined)?.closest("section") ??
        finalHead ??
        (finalBody[0] as HTMLElement | undefined) ??
        null;

      if (finalHead && finalSection) {
        gsap.set(finalHead, {
          opacity: 0,
          y: 16,
          letterSpacing: "0.03em",
          filter: "blur(5px)",
        });
        gsap.to(finalHead, {
          opacity: 1,
          y: 0,
          letterSpacing: "-0.03em",
          filter: "blur(0px)",
          ease: "none",
          scrollTrigger: {
            trigger: finalSection,
            start: "top 80%",
            end: "top 28%",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });
      }

      if (finalBody.length && finalSection) {
        rackFocusTrack(finalBody, {
          trigger: finalSection,
          start: "top 72%",
          end: "top 22%",
          blur: 4,
          opacityFloor: 0,
          stagger: 0.09,
          scrub: 1.0,
        });
      }

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/ueber-uns" />
      <div ref={rootRef} className="bg-[#0A0A0A]">
        {/* ════════════════════════════════════════════════════════════
              § PRÄAMBEL — Hero
          ════════════════════════════════════════════════════════════ */}
        <section
          data-ab-section="preamble"
          data-ab-hero
          className="relative overflow-hidden px-5 pb-20 pt-[6.5rem] sm:px-8 sm:pb-24 sm:pt-[7.5rem] md:px-12 md:pb-28 md:pt-[8.5rem] lg:px-16"
        >
          <HeroTexture />
          <VerticalCredit label="Manifest · Edition MMXXVI · MAGICKS Studio" />

          <div data-ab-hero-copy className="layout-max relative">
            {/* Top folio — quiet chapter signal */}
            <div data-ab-eyebrow className="flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-white/28 sm:w-14" />
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/50 sm:text-[10.5px]">
                § 00 — Manifest · MAGICKS Studio
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/10" />
            </div>

            <div className="mt-14 grid gap-14 md:mt-20 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:gap-20 lg:gap-28">
              {/* Left — H1 + intro + CTA */}
              <div>
                <h1
                  data-ab-head
                  className="font-instrument max-w-[42rem] text-[2.5rem] leading-[1.02] tracking-[-0.03em] text-white sm:text-[3.1rem] md:text-[3.6rem] lg:text-[4.2rem]"
                >
                  <span className="block overflow-hidden">
                    <span className="inline-block">Wir sind keine klassische Agentur.</span>
                  </span>
                  <span className="block overflow-hidden">
                    <span className="inline-block italic text-white/80">Zum Glück.</span>
                  </span>
                </h1>

                <div className="mt-10 max-w-[40rem] space-y-5 md:mt-14">
                  <p data-ab-lead className="font-ui text-[15.5px] leading-[1.7] text-white/74 md:text-[16.5px]">
                    MAGICKS Studio steht für eine andere Art, digitale Projekte anzugehen.
                  </p>
                  <p data-ab-lead className="font-ui text-[15.5px] leading-[1.7] text-white/62 md:text-[16.5px]">
                    Kein aufgeblähter Prozess, keine sinnlosen Meetings, kein Design by Committee.
                  </p>
                  <p data-ab-lead className="font-ui text-[15.5px] leading-[1.7] text-white/54 md:text-[16.5px]">
                    Wir entwickeln digitale Lösungen mit Anspruch — direkt, technisch sauber und mit dem Ziel, dass das
                    Ergebnis nicht nur gut aussieht, sondern im Alltag wirklich funktioniert.
                  </p>
                </div>

                {/* CTA baseline rail — mirrors the § Einladung rail so all CTAs read as one system */}
                <div data-ab-cta className="mt-14 max-w-[40rem] border-t border-white/[0.14] pt-5 md:mt-16 md:pt-6">
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/50 sm:text-[10.5px]">
                      § 00 · /kontakt
                    </span>
                    <UnderlineCta to="/kontakt" label="Projekt anfragen" />
                  </div>
                </div>
              </div>

              {/* Right — Studio Imprint (sealed, not framed) */}
              <aside className="md:pt-4 lg:pt-8">
                <StudioImprint />
              </aside>
            </div>

            {/* Bottom wordmark — editorial masthead with serif italic MAGICKS as the hero's signature */}
            <div
              aria-hidden
              data-ab-masthead
              className="mt-20 flex items-baseline justify-center gap-3 sm:mt-24 sm:gap-5 md:mt-32 md:gap-7"
            >
              <span className="h-px flex-1 bg-gradient-to-r from-white/0 via-white/12 to-white/20" />
              <span className="font-mono whitespace-nowrap pb-[3px] text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/42 sm:text-[10px] md:text-[10.5px]">
                Manifest
              </span>
              <span aria-hidden className="hidden h-3 w-px bg-white/26 sm:inline-block sm:h-4" />
              <span className="font-instrument whitespace-nowrap text-[1.3rem] italic leading-none tracking-[-0.015em] text-white/88 sm:text-[1.65rem] md:text-[1.95rem] lg:text-[2.1rem]">
                MAGICKS
              </span>
              <span aria-hidden className="hidden h-3 w-px bg-white/26 sm:inline-block sm:h-4" />
              <span className="font-mono whitespace-nowrap pb-[3px] text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/42 sm:text-[10px] md:text-[10.5px]">
                MMXXVI
              </span>
              <span className="h-px flex-1 bg-gradient-to-l from-white/0 via-white/12 to-white/20" />
            </div>
          </div>
        </section>

        <SectionTransition from="§ 00 · Manifest" to="§ 01 · Position" />

        {/* ════════════════════════════════════════════════════════════
              § 01 — POSITION  (marginalia layout)
          ════════════════════════════════════════════════════════════ */}
        <section className="relative px-5 py-24 sm:px-8 sm:py-28 md:px-12 md:py-36 lg:px-16 lg:py-44">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:gap-16 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-28">
              {/* Marginalia column */}
              <div data-ab-reveal>
                <p className="font-mono mb-7 text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/44 sm:text-[10.5px]">
                  § 01 — Position
                </p>
                <h2 className="font-instrument text-[2.1rem] leading-[1.02] tracking-[-0.03em] text-white sm:text-[2.45rem] md:text-[2.7rem]">
                  Was MAGICKS <em className="italic text-white/82">ausmacht</em>.
                </h2>
              </div>

              {/* Body measure */}
              <div data-ab-reveal className="max-w-[42rem] space-y-6 md:pt-2 md:text-[1.03rem]">
                <p className="font-ui text-[15.5px] leading-[1.75] text-white/84 md:text-[1.03rem]">
                  Wir mögen keine <em className="font-instrument not-italic text-white">halben Lösungen</em>.
                </p>
                <p className="font-ui text-[15px] leading-[1.72] text-white/58 md:text-[1rem]">
                  Keine digitalen Auftritte, die nur gut aussehen, aber sonst nichts leisten. Keine Prozesse, die
                  künstlich aufgeblasen werden, nur damit sie nach mehr aussehen.
                </p>
                <p className="font-ui text-[15px] leading-[1.72] text-white/72 md:text-[1rem]">
                  Was wir bauen, soll auffallen, funktionieren und mit dem Unternehmen mitwachsen. Deshalb verbinden wir
                  Design, Entwicklung, Integrationen und Automationen nicht als einzelne Disziplinen, sondern als
                  zusammenhängendes digitales System.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
              § 02 — WIRKUNG  (full-measure thesis)
          ════════════════════════════════════════════════════════════ */}
        <section className="relative px-5 pb-28 pt-12 sm:px-8 sm:pb-36 sm:pt-14 md:px-12 md:pb-44 md:pt-20 lg:px-16 lg:pb-52">
          <div className="layout-max">
            <div className="mx-auto max-w-[60rem]">
              {/* Eyebrow rendered as a thin left-margin flag — less metronomic */}
              <div data-ab-reveal className="mb-10 flex items-center gap-4 md:mb-14">
                <span aria-hidden className="h-px w-10 bg-white/24 sm:w-14" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/44 sm:text-[10.5px]">
                  § 02 — Wirkung · These
                </span>
              </div>

              <h2
                data-ab-reveal
                className="font-instrument text-[2.15rem] leading-[1.02] tracking-[-0.03em] text-white sm:text-[2.85rem] md:text-[3.55rem] lg:text-[4.15rem]"
              >
                Wir denken nicht in hübschen <em className="italic text-white/78">Screens</em>.{" "}
                <span className="block mt-1 sm:mt-2 md:mt-3">
                  Wir denken in <em className="italic text-white">Wirkung</em>.
                </span>
              </h2>

              {/* Two-paragraph body — asymmetric measure reinforces thesis */}
              <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-16 lg:gap-24">
                <p data-ab-reveal className="font-ui max-w-[30rem] text-[15.5px] leading-[1.72] text-white/76 md:text-[1.06rem] md:leading-[1.7]">
                  Eine starke digitale Lösung muss mehr können als gut aussehen. Sie muss klar führen, technisch sauber
                  funktionieren, im Alltag bestehen und dort ansetzen, wo sie für Unternehmen wirklich etwas verbessert.
                </p>
                <p data-ab-reveal className="font-ui max-w-[34rem] text-[15.5px] leading-[1.72] text-white/58 md:text-[1.06rem] md:leading-[1.7]">
                  Genau deshalb schauen wir nicht nur auf Oberfläche, sondern auch auf Struktur, Nutzerführung, Logik,
                  Prozesse und technische Verbindung. So entstehen Ergebnisse, die nicht wie Standard wirken und nicht
                  wie Standard funktionieren.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
              § INTERLUDIUM — Tipped-in Plate
              The single literal photograph on the entire manifesto,
              placed precisely where the argument pivots from *what we
              believe* to *how we work*. Treated as a tipped-in plate
              in the convention of a printed book: centered on the
              measure, preceded by a quiet folio, followed by a single
              italic pull-quote line. No explanation copy — the plate
              is allowed to breathe.

              Idiom-distinct: this page uses the ceremonial centered
              cadence that § 04 Principia and § Statement also use.
              On /webdesign-kassel the anchor idiom is a "Bureau
              specimen" rail system; on /landingpages-kassel it is a
              "Focal Axis" split caption. Each page gets its own.
          ════════════════════════════════════════════════════════════ */}
        <section
          aria-label="Studio-Blick"
          className="relative overflow-hidden bg-[#09090B] px-5 py-28 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16 lg:py-48"
        >
          <div className="layout-max relative">
            <div className="mx-auto max-w-[54rem]">
              {/* Opening folio — centered ruled rail, ceremonial cadence */}
              <div
                data-ab-reveal
                className="mb-10 flex items-center justify-center gap-5 sm:mb-12 md:mb-14"
              >
                <span aria-hidden className="h-px w-10 bg-white/24 sm:w-14" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.44em] text-white/54 sm:text-[10.5px]">
                  § Interludium &nbsp;·&nbsp; Plate
                </span>
                <span aria-hidden className="h-px w-10 bg-white/24 sm:w-14" />
              </div>

              <EditorialAnchor
                src="/media/pages/ueber-uns/studio.webp"
                alt="Dunkler Arbeitstisch aus Eiche mit aufgeschlagenem Notizbuch voller handgeschriebener Typografie- und Rasterstudien, einer Espresso-Tasse, einer Messlupe, Papierproben und einem matten Laptop im weichen Seitenlicht."
                aspect="16/9"
                align="center"
                maxWidth="54rem"
                revealAttr="data-ab-reveal"
              />

              {/* Colophon line — single italic serif pull, quiet, restrained.
                  Mirrors the typographic register of § Statement. No
                  descriptive copy; the plate speaks for itself. */}
              <p
                data-ab-reveal
                className="font-instrument mt-8 text-center text-[1.1rem] italic leading-[1.45] tracking-[-0.012em] text-white/58 sm:mt-10 sm:text-[1.22rem] md:mt-12 md:text-[1.32rem]"
              >
                — Kein Pitch. Nur der Arbeitstisch. —
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
              § 03 — METHODE  (stanza + 4-row register)
          ════════════════════════════════════════════════════════════ */}
        <section className="relative bg-[#08080A] px-5 py-24 sm:px-8 sm:py-28 md:px-12 md:py-36 lg:px-16 lg:py-44">
          <div className="layout-max">
            <div className="grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-16 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-24">
              <div data-ab-reveal className="md:pt-1">
                <p className="font-mono mb-6 text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/44 sm:text-[10.5px]">
                  § 03 — Methode
                </p>
                <h2 className="font-instrument text-[2.1rem] leading-[1.02] tracking-[-0.03em] text-white sm:text-[2.45rem] md:text-[2.7rem]">
                  Wie wir <em className="italic text-white/82">arbeiten</em>.
                </h2>
              </div>

              <div className="max-w-[42rem]">
                {/* Opening stanza — three-line declaration */}
                <div data-ab-reveal className="space-y-3 md:space-y-4">
                  <p className="font-instrument text-[1.55rem] leading-[1.22] tracking-[-0.02em] text-white sm:text-[1.8rem] md:text-[2.05rem]">
                    Wir arbeiten <em className="italic">direkt</em>.
                  </p>
                  <p className="font-instrument text-[1.55rem] leading-[1.22] tracking-[-0.02em] text-white/82 sm:text-[1.8rem] md:text-[2.05rem]">
                    Wir denken <em className="italic">mit</em>.
                  </p>
                  <p className="font-instrument text-[1.55rem] leading-[1.22] tracking-[-0.02em] text-white/66 sm:text-[1.8rem] md:text-[2.05rem]">
                    Und wir übernehmen <em className="italic">Verantwortung</em> für das, was wir abliefern.
                  </p>
                </div>

                {/* Continuation phrase — flows as italic serif, not a new sub-heading */}
                <p
                  data-ab-reveal
                  className="font-instrument mt-12 text-[1.15rem] italic leading-[1.5] tracking-[-0.01em] text-white/58 sm:text-[1.22rem] md:mt-14 md:text-[1.3rem]"
                >
                  Das bedeutet —
                </p>

                {/* Method register — 4 rows, labels on a ruler, leads with display weight */}
                <ul className="mt-6 grid grid-cols-1 border-t border-white/[0.09] md:mt-8">
                  {METHOD.map((m) => (
                    <li
                      key={m.num}
                      data-ab-method-row
                      className="grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] items-baseline gap-6 border-b border-white/[0.07] py-6 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] sm:py-7 md:py-8"
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="font-instrument text-[1.05rem] italic leading-none tracking-[-0.01em] text-white/52 sm:text-[1.15rem] md:text-[1.22rem]">
                          {m.num}
                        </span>
                        <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/44 sm:text-[10px]">
                          {m.kind}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
                        <span className="font-instrument text-[1.25rem] leading-[1.22] tracking-[-0.02em] text-white sm:text-[1.45rem] md:text-[1.65rem]">
                          {m.lead}
                        </span>
                        <span className="font-ui text-[14.5px] leading-[1.55] text-white/58 md:text-[15.5px]">
                          {m.body}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 03 · Methode" to="§ 04 · Principia" tone="darker" />

        {/* ════════════════════════════════════════════════════════════
              § 04 — PRINCIPIA  (six aphorisms)
          ════════════════════════════════════════════════════════════ */}
        <section className="relative bg-[#070708] px-5 py-32 sm:px-8 sm:py-40 md:px-12 md:py-52 lg:px-16 lg:py-60">
          <PrincipiaTexture />
          <div className="layout-max relative">
            <div className="mx-auto max-w-[68rem]">
              <div data-ab-reveal className="flex flex-col items-center text-center">
                {/* Ceremonial kicker — serif italic display word over a micro mono folio.
                    Breaks the mono-eyebrow metronome used in narrative sections. */}
                <p className="font-instrument text-[1.4rem] italic leading-none tracking-[-0.02em] text-white/68 sm:text-[1.65rem] md:text-[1.9rem]">
                  Principia.
                </p>
                <span className="font-mono mt-3 text-[9.5px] font-medium uppercase leading-none tracking-[0.48em] text-white/36 sm:text-[10px]">
                  § 04 · Sechs Sätze
                </span>

                <h2 className="font-instrument mt-10 text-[2.15rem] leading-[1.02] tracking-[-0.03em] text-white sm:text-[2.6rem] md:text-[2.95rem] md:mt-12">
                  Wofür wir <em className="italic text-white/82">stehen</em>.
                </h2>
              </div>

              {/* Aphorism stack — serif italic numerals hang right-aligned in the margin */}
              <ol className="mt-16 border-t border-white/[0.1] sm:mt-20 md:mt-24">
                {PRINCIPIA.map((p) => (
                  <li
                    key={p.num}
                    data-ab-principle
                    className="grid grid-cols-[minmax(0,3.75rem)_minmax(0,1fr)] items-baseline gap-5 border-b border-white/[0.07] py-9 sm:grid-cols-[minmax(0,6rem)_minmax(0,1fr)] sm:gap-8 sm:py-11 md:py-14 lg:grid-cols-[minmax(0,7rem)_minmax(0,1fr)] lg:gap-10"
                  >
                    <span className="font-instrument text-right text-[1.35rem] italic leading-none tracking-[-0.01em] text-white/54 sm:text-[1.65rem] md:text-[1.95rem] lg:text-[2.15rem]">
                      {p.num}.
                    </span>
                    <p className="font-instrument text-[1.7rem] leading-[1.14] tracking-[-0.025em] text-white sm:text-[2.2rem] md:text-[2.65rem] lg:text-[2.95rem]">
                      <em className="italic">{p.head}</em>{" "}
                      <span className="text-white/60">{p.tail}</span>
                    </p>
                  </li>
                ))}
              </ol>

              {/* Principia signature — a quiet end-mark under the stack */}
              <div data-ab-reveal className="mt-10 flex items-center gap-4 sm:mt-14 md:mt-16">
                <span aria-hidden className="h-px flex-1 bg-white/10" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/42 sm:text-[10.5px]">
                  · VI / VI ·
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/10" />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
              § 05 — WERK  (prose + editorial index)
          ════════════════════════════════════════════════════════════ */}
        <section className="relative px-5 py-24 sm:px-8 sm:py-28 md:px-12 md:py-36 lg:px-16 lg:py-44">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16 lg:gap-24">
              {/* Left — prose */}
              <div data-ab-reveal>
                <p className="font-mono mb-6 text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/44 sm:text-[10.5px]">
                  § 05 — Werk
                </p>
                <h2 className="font-instrument text-[2.1rem] leading-[1.02] tracking-[-0.03em] text-white sm:text-[2.45rem] md:text-[2.7rem]">
                  Was wir <em className="italic text-white/82">bauen</em>.
                </h2>

                <div className="mt-8 max-w-[34rem] space-y-5 md:mt-10">
                  <p className="font-ui text-[15.5px] leading-[1.72] text-white/78 md:text-[1.02rem]">
                    Wir entwickeln Websites, Landing Pages, Shops, Produktkonfiguratoren, Web-Software und
                    KI-Automationen für Unternehmen, die digital mehr erwarten als eine schöne Oberfläche.
                  </p>
                  <p className="font-ui text-[15px] leading-[1.7] text-white/58 md:text-[1rem]">
                    Immer mit demselben Anspruch: hochwertig im Design, sauber in der Entwicklung und sinnvoll in der
                    Art, wie alles zusammenspielt.
                  </p>
                </div>

                {/* Editorial continuation — reads like a "weiter lesen" footnote, not a CTA */}
                <p className="font-instrument mt-10 max-w-[34rem] text-[1.05rem] italic leading-[1.5] tracking-[-0.01em] text-white/62 sm:text-[1.12rem] md:text-[1.18rem]">
                  Eine ausführliche Übersicht der Disziplinen findet sich im{" "}
                  <Link
                    to="/leistungen"
                    className="group relative inline-flex items-baseline gap-1.5 not-italic text-white/88 no-underline transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:text-white"
                  >
                    <span className="relative">
                      <span className="italic">Leistungs-Register</span>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 -bottom-[2px] block h-px bg-white/32"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 -bottom-[2px] block h-px origin-left scale-x-0 bg-white transition-transform duration-[820ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                      />
                    </span>
                    <span
                      aria-hidden
                      className="font-instrument text-[0.9em] italic text-white/70 transition-transform duration-500 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
                    >
                      ↗
                    </span>
                  </Link>
                  .
                </p>
              </div>

              {/* Right — editorial index */}
              <div data-ab-reveal>
                <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-white/[0.1] pb-4">
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.38em] text-white/48 sm:text-[10.5px]">
                    Register · Disziplinen
                  </span>
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.38em] text-white/34 sm:text-[10.5px]">
                    04 Folios
                  </span>
                </div>

                <ul className="divide-y divide-white/[0.07]">
                  {WERK_INDEX.map((w) => (
                    <li key={w.to} data-ab-werk-row>
                      <Link
                        to={w.to}
                        className="group relative flex items-baseline justify-between gap-4 py-5 no-underline transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] sm:py-6 md:py-7"
                        aria-label={w.label}
                      >
                        {/* Hover wash — subtle tint slides in from the left */}
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-y-0 left-0 block w-0 bg-white/[0.02] transition-[width] duration-[700ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
                        />
                        <div className="relative flex items-baseline gap-4 sm:gap-6">
                          <span className="font-instrument inline-block w-8 text-right text-[1.05rem] italic leading-none tracking-[-0.01em] text-white/48 sm:w-10 sm:text-[1.25rem] md:text-[1.4rem]">
                            {w.folio}.
                          </span>
                          <div className="flex flex-col gap-1.5">
                            <span className="font-instrument text-[1.15rem] leading-[1.2] tracking-[-0.01em] text-white sm:text-[1.32rem] md:text-[1.5rem]">
                              {w.label}
                            </span>
                            <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/38 sm:text-[9.5px]">
                              {w.hint}
                              <span aria-hidden className="mx-2 text-white/22">·</span>
                              {w.to}
                            </span>
                          </div>
                        </div>
                        <span
                          aria-hidden
                          className="font-instrument relative text-[1.25em] italic text-white/62 transition-transform duration-500 group-hover:-translate-y-[2px] group-hover:translate-x-[3px] group-hover:text-white"
                        >
                          ↗
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
              § 06 — VERTRAUEN  (4-reasons stanza)
          ════════════════════════════════════════════════════════════ */}
        <section className="relative bg-[#08080A] px-5 py-24 sm:px-8 sm:py-28 md:px-12 md:py-36 lg:px-16 lg:py-44">
          <div className="layout-max">
            <div className="mx-auto max-w-[54rem]">
              <div data-ab-reveal className="flex flex-col items-center text-center">
                <p className="font-mono mb-6 text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/44 sm:text-[10.5px]">
                  § 06 — Vertrauen
                </p>
                <h2 className="font-instrument text-[1.95rem] leading-[1.08] tracking-[-0.03em] text-white sm:text-[2.35rem] md:text-[2.6rem]">
                  Warum Unternehmen mit <em className="italic text-white/82">MAGICKS</em> arbeiten.
                </h2>
              </div>

              {/* Reasons — editorial stanza, marginalia letter on each row */}
              <ol className="mt-14 md:mt-18">
                {REASONS.map((r) => (
                  <li
                    key={r.num}
                    data-ab-reason
                    className="grid grid-cols-[minmax(0,2.5rem)_minmax(0,1fr)] items-baseline gap-4 py-4 sm:grid-cols-[minmax(0,3.5rem)_minmax(0,1fr)] sm:gap-6 sm:py-5 md:py-6"
                  >
                    <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/38 sm:text-[10.5px]">
                      § {r.num}
                    </span>
                    <p className="font-instrument text-[1.3rem] leading-[1.28] tracking-[-0.015em] text-white sm:text-[1.55rem] md:text-[1.78rem]">
                      <em className="italic">{r.head}</em>{" "}
                      <span className="text-white/58">{r.tail}</span>
                    </p>
                  </li>
                ))}
              </ol>

              {/* End-mark — echoes the Principia close */}
              <div data-ab-reveal className="mt-12 flex items-center gap-4 sm:mt-14 md:mt-16">
                <span aria-hidden className="h-px flex-1 bg-white/10" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/42 sm:text-[10.5px]">
                  · § a — § d ·
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/10" />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
              § STATEMENT — Ceremonial declaration
          ════════════════════════════════════════════════════════════ */}
        <section
          data-ab-statement
          className="relative overflow-hidden bg-[#070708] px-5 py-36 sm:px-8 sm:py-48 md:px-12 md:py-56 lg:px-16 lg:py-[16rem]"
        >
          <StatementTexture />
          <div className="layout-max relative">
            <div className="mx-auto max-w-[64rem] text-center">
              {/* Ceremonial kicker — serif italic, no mono. Echoes Principia's kicker treatment. */}
              <div data-ab-reveal className="mb-14 flex flex-col items-center sm:mb-16 md:mb-20">
                <p className="font-instrument text-[1.3rem] italic leading-none tracking-[-0.02em] text-white/62 sm:text-[1.55rem] md:text-[1.8rem]">
                  — Statement —
                </p>
              </div>

              <h2 className="font-instrument text-[2.2rem] leading-[1.04] tracking-[-0.035em] text-white sm:text-[3.2rem] md:text-[4.15rem] lg:text-[5.1rem]">
                {STATEMENT_LINES.map((line, li) => (
                  <span key={li} className="block">
                    {line.map((word, wi) => (
                      <span
                        key={`${li}-${wi}`}
                        data-ab-word
                        className="inline-block overflow-hidden align-bottom"
                      >
                        <span
                          className={`inline-block ${
                            wi === 2 ? "italic" : wi === 1 ? "text-white/72" : ""
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

              {/* Under-rule signature — stronger presence, a single printed line */}
              <div className="mx-auto mt-16 flex max-w-[32rem] items-baseline justify-center gap-5 sm:mt-20 sm:gap-6">
                <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-white/0 via-white/22 to-white/28" />
                <span className="font-instrument whitespace-nowrap text-[1.15rem] italic leading-none tracking-[-0.01em] text-white/78 sm:text-[1.25rem] md:text-[1.35rem]">
                  MAGICKS
                </span>
                <span aria-hidden className="h-px flex-1 bg-gradient-to-l from-white/0 via-white/22 to-white/28" />
              </div>
              <div className="mt-3 flex items-center justify-center">
                <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.48em] text-white/38 sm:text-[10px]">
                  Haltung · MMXXVI
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
              § EINLADUNG — Invitation to /kontakt
          ════════════════════════════════════════════════════════════ */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16 lg:py-52">
          <div className="layout-max">
            <div className="grid gap-10 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:items-center md:gap-20 lg:gap-28">
              <div data-ab-invite>
                <p className="font-mono mb-6 text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/44 sm:text-[10.5px]">
                  § Einladung
                </p>
                <h2 className="font-instrument text-[2.05rem] leading-[1.04] tracking-[-0.03em] text-white sm:text-[2.55rem] md:text-[2.95rem] lg:text-[3.3rem]">
                  Wenn du keine Lust auf <em className="italic text-white/82">Standard</em> hast.
                </h2>
                <div className="mt-8 max-w-[40rem] space-y-5 md:mt-10">
                  <p className="font-ui text-[15.5px] leading-[1.72] text-white/78 md:text-[1.03rem]">
                    Dann passen wir wahrscheinlich gut zusammen.
                  </p>
                  <p className="font-ui text-[15px] leading-[1.7] text-white/58 md:text-[1rem]">
                    Ob Website, Shop, Produktkonfigurator, Web-Software oder Automation — wir entwickeln digitale
                    Lösungen, die hochwertig wirken, sauber funktionieren und nicht unnötig Zeit verschwenden.
                  </p>
                </div>
              </div>

              {/* CTA rail — architectural baseline rail mirroring the plate CTAs */}
              <div data-ab-invite className="md:pl-6 lg:pl-10">
                <div className="border-t border-white/[0.14] pt-6 md:pt-7">
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/50 sm:text-[10.5px]">
                      § Einladung · /kontakt
                    </span>
                    <Link
                      to="/kontakt"
                      className="group relative inline-flex items-baseline gap-3 text-[15px] font-medium text-white no-underline sm:text-[16px] md:text-[16.5px]"
                      aria-label="Projekt starten"
                    >
                      <span className="relative pb-2">
                        <span className="font-ui">Projekt starten</span>
                        <span
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
                        className="font-instrument text-[1.1em] italic text-white/82 transition-transform duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[3px] group-hover:translate-x-[3px]"
                      >
                        ↗
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
              § END — Final CTA
          ════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#070708] px-5 pb-36 pt-32 sm:px-8 sm:pb-48 sm:pt-44 md:px-12 md:pb-56 md:pt-52 lg:px-16 lg:pt-60">
          <FinalTexture />
          <div className="layout-max relative">
            <div className="mx-auto flex max-w-[54rem] flex-col items-center text-center">
              {/* Ceremonial kicker — serif italic, matching Principia and Statement */}
              <p className="font-instrument text-[1.3rem] italic leading-none tracking-[-0.02em] text-white/62 sm:text-[1.55rem] md:text-[1.8rem]">
                Finis.
              </p>
              <span className="font-mono mt-3 text-[9.5px] font-medium uppercase leading-none tracking-[0.48em] text-white/36 sm:text-[10px]">
                § End · MAGICKS Manifest
              </span>

              <h2
                data-ab-final-head
                className="font-instrument mt-12 text-[2.15rem] leading-[1.06] tracking-[-0.03em] text-white sm:mt-16 sm:text-[2.85rem] md:mt-20 md:text-[3.55rem] lg:text-[4.15rem]"
              >
                Bereit für ein Projekt, das sich{" "}
                <em className="italic text-white/84">wirklich lohnt</em>?
              </h2>

              <p data-ab-final-body className="font-ui mt-7 max-w-[40rem] text-[15.5px] leading-[1.7] text-white/68 sm:mt-9 md:text-[16.5px]">
                Wenn du einen digitalen Partner suchst, der direkt arbeitet, mitdenkt und hochwertig umsetzt, dann lass
                uns sprechen.
              </p>

              <div data-ab-final-body className="mt-14 flex flex-col items-center gap-6 sm:mt-16 sm:gap-8">
                <Link
                  to="/kontakt"
                  className="group inline-flex items-center gap-3 rounded-full bg-white px-9 py-[1.05rem] text-[15.5px] font-semibold text-[#0A0A0A] no-underline transition-transform duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] sm:gap-3.5 sm:px-10 sm:py-[1.2rem] sm:text-[16px] md:px-11 md:text-[16.5px]"
                  aria-label="Lass uns reden"
                >
                  <span>Lass uns reden</span>
                  <span
                    aria-hidden
                    className="font-instrument text-[1.1em] italic transition-transform duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px] group-hover:translate-x-[3px]"
                  >
                    →
                  </span>
                </Link>

                <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-4">
                  <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/42">
                    oder direkt
                  </span>
                  <a
                    href="mailto:hello@magicks.studio"
                    className="font-instrument text-[1.1rem] italic tracking-[-0.01em] text-white/86 no-underline transition-colors duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:text-white sm:text-[1.18rem]"
                  >
                    hello@magicks.studio
                  </a>
                </div>
              </div>
            </div>

            {/* Footer colophon — manifesto signature */}
            <div className="mx-auto mt-32 max-w-[68rem] border-t border-white/[0.1] pt-8 sm:mt-40 md:mt-48">
              <div className="flex flex-wrap items-baseline justify-between gap-y-4 gap-x-8">
                <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/48 sm:text-[10px]">
                  Manifest · Edition MMXXVI
                </span>
                <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/36 sm:text-[10px]">
                  MAGICKS Studio · Kassel
                </span>
                <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/48 sm:text-[10px]">
                  · Finis ·
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/* ====================================================================
   Subcomponents
   ==================================================================== */

/** Shared underline CTA — inline editorial link with animated baseline. */
function UnderlineCta({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="group relative inline-flex items-baseline gap-3 text-[15px] font-medium text-white no-underline sm:text-[16px] md:text-[16.5px]"
      aria-label={label}
    >
      <span className="relative pb-2">
        <span className="font-ui">{label}</span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left bg-white/34"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-white transition-transform duration-[820ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </span>
      <span
        aria-hidden
        className="font-instrument text-[1.1em] italic text-white/84 transition-transform duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[3px] group-hover:translate-x-[3px]"
      >
        →
      </span>
    </Link>
  );
}

/** Vertical hero credit — thin monospace column on the left edge. */
function VerticalCredit({ label }: { label: string }) {
  return (
    <div
      aria-hidden
      className="hero-vertical-credit pointer-events-none absolute left-4 top-[5.25rem] hidden select-none text-[9.5px] font-medium uppercase tracking-[0.5em] text-white/30 sm:left-6 md:left-8 md:block md:text-[10px] lg:left-10"
      data-ab-credit
    >
      <span>{label}</span>
    </div>
  );
}

/**
 * Hero texture — restrained editorial backdrop.
 * A wide soft radial in the lower-right, plus a thin horizontal rule
 * anchoring the composition. No cheap glow, no gradients screaming.
 */
function HeroTexture() {
  return (
    <div
      aria-hidden
      data-ab-hero-texture
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 70% at 82% 115%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 62%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0.7) 1px, transparent 1px, transparent 160px)",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, rgba(0,0,0,0) 100%)",
        }}
      />
    </div>
  );
}

/**
 * Principia texture — 6 soft vertical rules mirror the 6 aphorisms.
 * Quiet architectural backbone behind the centered stack.
 */
function PrincipiaTexture() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.65) 0px, rgba(255,255,255,0.65) 1px, transparent 1px, transparent 180px)",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, rgba(0,0,0,0) 100%)",
        }}
      />
    </div>
  );
}

/** Ceremonial statement texture — a deep central halo. */
function StatementTexture() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 50%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0.7) 1px, transparent 1px, transparent 220px)",
        }}
      />
    </div>
  );
}

/** Final CTA texture — a low, broad floor glow anchoring the close. */
function FinalTexture() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 80% at 50% 110%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)",
        }}
      />
    </div>
  );
}

/**
 * StudioImprint — a sealed imprint block, not a card. Four rows of
 * label / value separated by pure hairlines, opened and closed by
 * thin rules. No borders, no corner ornaments, no framed box — reads
 * as a title-page imprint printed directly onto the paper.
 */
function StudioImprint() {
  const rows: { label: string; value: string; italic?: boolean }[] = [
    { label: "Studio",   value: "MAGICKS" },
    { label: "Haltung",  value: "Direkt · Hochwertig · Klar", italic: true },
    { label: "Register", value: "Website · Shop · Software · Automation" },
    { label: "Sitz",     value: "Kassel · Remote" },
  ];

  return (
    <div className="relative">
      {/* Top rule */}
      <span aria-hidden className="block h-px w-full bg-gradient-to-r from-white/0 via-white/22 to-white/0" />

      <dl className="divide-y divide-white/[0.06]">
        {rows.map((r) => (
          <div
            key={r.label}
            data-ab-colo-row
            className="grid grid-cols-[minmax(0,5.5rem)_minmax(0,1fr)] items-baseline gap-5 py-4 md:gap-6 md:py-[1.1rem]"
          >
            <dt className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/44 sm:text-[10px]">
              {r.label}
            </dt>
            <dd
              className={`font-instrument text-[1.05rem] leading-[1.24] tracking-[-0.01em] text-white sm:text-[1.12rem] md:text-[1.2rem] ${
                r.italic ? "italic text-white/86" : ""
              }`}
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Bottom rule */}
      <span aria-hidden className="block h-px w-full bg-gradient-to-r from-white/0 via-white/22 to-white/0" />

      {/* Signature — right-hung, micro mono, reads as the imprint's date/place line */}
      <div className="mt-4 flex items-baseline justify-end">
        <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.42em] text-white/36 sm:text-[9.5px]">
          · Edition MMXXVI ·
        </span>
      </div>
    </div>
  );
}
