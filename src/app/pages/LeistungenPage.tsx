import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../lib/gsap";
import { presenceEnvelope, rackFocusTrack } from "../lib/scrollMotion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { ChapterMarker } from "../components/home/ChapterMarker";
import { ContextualCrossLink } from "../components/service/ContextualCrossLink";
import { SectionTransition } from "../components/service/SectionTransition";
import { ServicePlate } from "../components/service/ServicePlate";
import type { ServicePlateMotif, ServicePlateAnchor } from "../components/service/ServicePlate";
import { RouteSEO } from "../seo/RouteSEO";

/* ------------------------------------------------------------------
 * /leistungen — central service hub ("Register / Werk")
 *
 * This is the meta-page of the service universe. Its signature is
 * that there is no single signature — instead it presents the four
 * disciplines as a coherent editorial register, like a monograph's
 * table of contents. Each discipline carries a distinct mini-motif
 * that echoes its detail page (masthead · catalog · blueprint ·
 * flow) so the four plates feel art-directed, not templated.
 *
 * Sections:
 *   · Hero                — H1, intro, CTA, meta triad, ServiceRegister
 *   · § 01  Index         — "Was wir für dich bauen"
 *   · § 02  Werk          — 4 art-directed service plates (I–IV)
 *   · § 03  Übergänge     — "Integrationen sind oft der Teil…"
 *   · § 04  Haltung       — approach + ceremonial statement
 *   · § 05  Orientierung  — "Nicht sicher, was davon zu deinem…" → /kontakt
 *   · § Ergänzung         — cross-link gate → /website-im-abo
 *   · Final CTA           — register plate signature
 * ------------------------------------------------------------------ */

type PlateCopy = {
  folio: string;
  code: string;
  caption: string;
  title: string;
  body: string;
  points: string[];
  ctaLabel: string;
  to: string;
  motif: ServicePlateMotif;
  anchor: ServicePlateAnchor;
  hook: string;
};

/*
 * Plate register. Each plate's `code` reads as a paginated folio
 * ("Folio · I / IV") to stay clearly distinct from the page's own
 * narrative chapter markers ("§ 01 — Index", "§ 02 — Werk", …) —
 * no glyph collision, no doubled meaning. The Roman folio is the
 * display glyph; the code spells out position in the register.
 */
const PLATES: PlateCopy[] = [
  {
    folio: "I",
    code: "Folio · I / IV",
    caption: "Werk · Website & Landing",
    title: "Websites & Landing Pages",
    body:
      "Websites und Landing Pages, die nicht nur gut aussehen, sondern klar führen, schnell laden und Ergebnisse liefern.",
    points: [
      "starke digitale Markenauftritte",
      "Landing Pages mit klarem Ziel",
      "hochwertige Gestaltung",
      "saubere Entwicklung",
      "Performance, Struktur und Nutzerführung",
    ],
    ctaLabel: "Mehr zu Websites & Landing Pages",
    to: "/websites-landingpages",
    motif: "masthead",
    anchor: "left",
    hook: "plate-01",
  },
  {
    folio: "II",
    code: "Folio · II / IV",
    caption: "Werk · Shop & Konfigurator",
    title: "Shops & Produktkonfiguratoren",
    body:
      "Digitale Verkaufslösungen, die Produkte überzeugend präsentieren, Auswahl verständlich machen und Nutzer sauber zum nächsten Schritt führen.",
    points: [
      "moderne Shops mit Anspruch",
      "interaktive Produktkonfiguratoren",
      "3D-Konfiguratoren für erklärungsbedürftige Produkte",
      "bessere Nutzerführung im Vertrieb",
      "technische Integration in echte Prozesse",
    ],
    ctaLabel: "Mehr zu Shops & Produktkonfiguratoren",
    to: "/shops-produktkonfiguratoren",
    motif: "catalog",
    anchor: "right",
    hook: "plate-02",
  },
  {
    folio: "III",
    code: "Folio · III / IV",
    caption: "Werk · Plattform & Tool",
    title: "Web-Software",
    body:
      "Individuelle Web-Anwendungen, Portale, Dashboards und interne Tools, die Prozesse sinnvoll digitalisieren und mit dem Unternehmen mitwachsen.",
    points: [
      "Portale und Plattformen",
      "Dashboards und interne Tools",
      "Prozesslogik und Rollenmodelle",
      "strukturierte Daten- und Systemwelten",
      "skalierbare technische Umsetzung",
    ],
    ctaLabel: "Mehr zu Web-Software",
    to: "/web-software",
    motif: "blueprint",
    anchor: "left",
    hook: "plate-03",
  },
  {
    folio: "IV",
    code: "Folio · IV / IV",
    caption: "Werk · Protokoll & Fluss",
    title: "KI-Automationen & Integrationen",
    body:
      "Automationen und intelligente Systemverbindungen, die manuelle Arbeit reduzieren, Abläufe sauber verbinden und Teams spürbar entlasten.",
    points: [
      "Prozessautomationen",
      "KI-gestützte Workflows",
      "Integrationen zwischen Tools und Systemen",
      "Datenflüsse und Übergaben",
      "weniger Reibung im Alltag",
    ],
    ctaLabel: "Mehr zu KI-Automationen & Integrationen",
    to: "/ki-automationen-integrationen",
    motif: "flow",
    anchor: "right",
    hook: "plate-04",
  },
];

/* ------------------------------------------------------------------
 * ServiceRegister — the hero motif.
 *
 * A 4-column masthead showing all four disciplines side-by-side:
 * each column carries its folio (I–IV), register code, a tiny
 * signature glyph and the discipline title. Reads as the full
 * studio index in one glance, which is exactly what the hub page
 * should telegraph before the plates unfold below.
 * ------------------------------------------------------------------ */
function ServiceRegister() {
  const entries: {
    folio: string;
    code: string;
    label: string;
    glyph: "rulers" | "tiles" | "corner" | "flow";
  }[] = [
    { folio: "I", code: "§ 01", label: "Websites & LP", glyph: "rulers" },
    { folio: "II", code: "§ 02", label: "Shops & Konfiguratoren", glyph: "tiles" },
    { folio: "III", code: "§ 03", label: "Web-Software", glyph: "corner" },
    { folio: "IV", code: "§ 04", label: "KI & Automationen", glyph: "flow" },
  ];

  return (
    <div aria-hidden className="w-full max-w-[56rem]">
      <div
        data-leis-register
        className="grid grid-cols-2 gap-x-4 gap-y-8 border-t border-white/[0.12] sm:grid-cols-4 sm:gap-x-0"
      >
        {entries.map((entry, i) => (
          <div
            key={entry.folio}
            data-leis-regcell
            className={`relative flex flex-col gap-3 border-b border-white/[0.12] pb-5 pt-4 sm:pt-5 ${
              i > 0 ? "sm:border-l sm:border-white/[0.09] sm:pl-5 md:pl-6" : ""
            }`}
          >
            {/* Top row: folio Roman + code */}
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-instrument text-[1.5rem] leading-none tracking-[-0.01em] text-white/92 sm:text-[1.75rem]">
                {entry.folio}
              </span>
              <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[9.5px]">
                {entry.code}
              </span>
            </div>

            {/* Glyph row — mini SVG signature */}
            <div className="flex min-h-[24px] items-center">
              <RegisterGlyph variant={entry.glyph} />
            </div>

            {/* Label */}
            <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.32em] text-white/68 sm:text-[9.5px]">
              {entry.label}
            </span>
          </div>
        ))}
      </div>

      {/* Register footer — hub signature */}
      <div className="font-mono mt-4 grid grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)] items-center gap-5 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/38 sm:text-[10.5px]">
        <span>Fig. 00 · Register</span>
        <span aria-hidden className="h-px w-full bg-white/14" />
        <span className="tabular-nums text-white/32">04 Disziplinen · 01 Studio</span>
      </div>
    </div>
  );
}

function RegisterGlyph({
  variant,
}: {
  variant: "rulers" | "tiles" | "corner" | "flow";
}) {
  const box = "block h-5 w-[78px] sm:h-6 sm:w-[88px]";
  switch (variant) {
    case "rulers":
      return (
        <svg viewBox="0 0 88 24" className={box} aria-hidden role="presentation">
          <g stroke="rgba(255,255,255,0.7)" fill="none" strokeLinecap="round">
            <path d="M 2 6 L 86 6" strokeWidth="1.3" />
            <path d="M 2 12 L 66 12" strokeWidth="0.9" strokeOpacity="0.6" />
            <path d="M 2 18 L 40 18" strokeWidth="0.7" strokeOpacity="0.4" />
          </g>
        </svg>
      );
    case "tiles":
      return (
        <svg viewBox="0 0 88 24" className={box} aria-hidden role="presentation">
          <g stroke="rgba(255,255,255,0.62)" fill="none" strokeWidth="0.8">
            <rect x="2" y="4" width="26" height="16" />
            <rect x="32" y="4" width="26" height="16" />
            <rect x="62" y="4" width="24" height="16" />
          </g>
          <rect x="32" y="4" width="26" height="16" fill="rgba(255,255,255,0.08)" />
        </svg>
      );
    case "corner":
      return (
        <svg viewBox="0 0 88 24" className={box} aria-hidden role="presentation">
          <g stroke="rgba(255,255,255,0.72)" fill="none" strokeWidth="0.9">
            <path d="M 2 4 L 2 22" />
            <path d="M 2 4 L 86 4" />
          </g>
          <g stroke="rgba(255,255,255,0.4)" strokeWidth="0.7">
            <path d="M 22 4 L 22 8" />
            <path d="M 44 4 L 44 8" />
            <path d="M 66 4 L 66 8" />
          </g>
          <circle cx="44" cy="14" r="1.4" fill="rgba(255,255,255,0.88)" />
        </svg>
      );
    case "flow":
      return (
        <svg viewBox="0 0 88 24" className={box} aria-hidden role="presentation">
          <path d="M 6 12 L 82 12" stroke="rgba(255,255,255,0.42)" strokeWidth="0.9" fill="none" />
          <circle cx="10" cy="12" r="2.4" fill="none" stroke="rgba(255,255,255,0.62)" strokeWidth="0.9" />
          <circle cx="44" cy="12" r="3.2" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.82)" strokeWidth="1" />
          <circle cx="78" cy="12" r="2.4" fill="none" stroke="rgba(255,255,255,0.62)" strokeWidth="0.9" />
          <circle cx="44" cy="12" r="1.2" fill="rgba(255,255,255,0.95)" />
        </svg>
      );
  }
}

export default function LeistungenPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      /* ——— Hero elements ——— */
      const heroChapter = root.querySelector<HTMLElement>("[data-leis-chapter]");
      const heroLineA = gsap.utils.toArray<HTMLElement>("[data-leis-h1a]");
      const heroLineB = gsap.utils.toArray<HTMLElement>("[data-leis-h1b]");
      const heroH1 = root.querySelector<HTMLElement>("[data-leis-h1]");
      const heroLead = root.querySelector<HTMLElement>("[data-leis-lead]");
      const heroCta = root.querySelector<HTMLElement>("[data-leis-cta]");
      const heroCtaRule = root.querySelector<HTMLElement>("[data-leis-cta-rule]");
      const heroMeta = root.querySelector<HTMLElement>("[data-leis-meta]");
      const heroRegister = root.querySelector<HTMLElement>("[data-leis-register]");
      const heroRegCells = gsap.utils.toArray<HTMLElement>("[data-leis-regcell]");
      const heroCredit = root.querySelector<HTMLElement>("[data-leis-credit]");
      const heroSection = root.querySelector<HTMLElement>("[data-leis-hero]");
      const heroCopy = root.querySelector<HTMLElement>("[data-leis-herocopy]");

      /* ——— Scroll reveals ——— */
      const reveals = gsap.utils.toArray<HTMLElement>("[data-leis-reveal]");
      const plates = gsap.utils.toArray<HTMLElement>("[data-plate]");
      const pullLines = gsap.utils.toArray<HTMLElement>("[data-leis-pull]");
      const pullHeading = root.querySelector<HTMLElement>("[data-leis-pullheading]");
      const finalLineA = gsap.utils.toArray<HTMLElement>("[data-leis-finala]");
      const finalLineB = gsap.utils.toArray<HTMLElement>("[data-leis-finalb]");
      const finalRule = root.querySelector<HTMLElement>("[data-leis-finalrule]");
      const finalLedger = gsap.utils.toArray<HTMLElement>("[data-leis-finalledger]");
      const finalCta = root.querySelector<HTMLElement>("[data-leis-finalcta]");

      if (reduced) {
        gsap.set(
          [
            heroChapter,
            ...heroLineA,
            ...heroLineB,
            heroLead,
            heroCta,
            heroCtaRule,
            heroMeta,
            heroRegister,
            ...heroRegCells,
            heroCredit,
            ...reveals,
            ...plates,
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

      /* ——— Hero choreography ——— */
      gsap.set(heroChapter, { opacity: 0, y: 12 });
      gsap.set([...heroLineA, ...heroLineB], { yPercent: 118, opacity: 0 });
      if (heroH1) gsap.set(heroH1, { letterSpacing: "0.008em" });
      gsap.set(heroLead, { opacity: 0, y: 16 });
      gsap.set(heroCta, { opacity: 0, y: 14 });
      gsap.set(heroCtaRule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(heroMeta, { opacity: 0, y: 8 });
      gsap.set(heroRegister, { opacity: 0, y: 18 });
      gsap.set(heroRegCells, { opacity: 0, y: 10 });
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
          { letterSpacing: "-0.036em", duration: 1.6, ease: "power2.out" },
          0.45,
        )
        .to(heroLead, { opacity: 1, y: 0, duration: 1.0 }, 1.05)
        .to(heroCta, { opacity: 1, y: 0, duration: 0.95 }, 1.4)
        .to(heroCtaRule, { scaleX: 1, duration: 1.15, ease: "power2.inOut" }, 1.5)
        .to(heroMeta, { opacity: 1, y: 0, duration: 0.95 }, 1.65)
        .to(heroRegister, { opacity: 1, y: 0, duration: 1.1 }, 1.85)
        .to(
          heroRegCells,
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.12, ease: "power3.out" },
          1.95,
        )
        .to(heroCredit, { opacity: 1, y: 0, duration: 1.0 }, 2.4);

      /* ——— Hero camera push ——— */
      if (heroCopy && heroSection) {
        gsap.to(heroCopy, {
          yPercent: -6,
          opacity: 0.44,
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

      /* ——— Generic scroll reveals ———
       * Bidirectional: each [data-leis-reveal] block gains presence
       * on entry, holds through its focus zone, then gently releases
       * as the reader moves on. Replaces the old once:true fade-up. */
      presenceEnvelope(reveals, {
        start: "top 92%",
        end: "bottom 10%",
        yFrom: 22,
        yTo: -14,
        blur: 4,
        opacityFloor: 0,
        holdRatio: 0.48,
        scrub: 0.9,
      });

      /*
       * Service plate motion — bidirectional editorial envelope.
       *
       * Each plate passes through three zones as the reader scrolls
       * past it:
       *   · entry  — plate gathers presence from soft/blurred state
       *   · focus  — plate sits at full clarity across its reading zone
       *   · exit   — plate gently steps back, letting the next plate
       *              take over
       *
       * Distinct per-motif micro-accents remain, but they are now all
       * scroll-coupled rather than once:true reveals:
       *   · masthead  — heading letter-spacing settles into focus
       *   · catalog   — points cascade top-down across the entry zone
       *   · blueprint — points drift in from the coordinate gutter
       *   · flow      — points propagate left-to-right along the rail
       *
       * Because each inner timeline is scrub-driven, it re-plays in
       * reverse when the reader scrolls back up — nothing "latches".
       */
      plates.forEach((plate) => {
        const motifId =
          (plate.getAttribute("data-plate-motif-id") ?? "masthead") as
            | "masthead"
            | "catalog"
            | "blueprint"
            | "flow";
        const heading = plate.querySelector<HTMLElement>("[data-plate-heading]");
        const points = Array.from(
          plate.querySelectorAll<HTMLElement>("[data-plate-point]"),
        );
        const ctaRule = plate.querySelector<HTMLElement>("[data-plate-ctarule]");

        // Plate envelope — gain presence on entry, hold, release on exit.
        presenceEnvelope(plate as Element, {
          start: "top 86%",
          end: "bottom 14%",
          yFrom: 20,
          yTo: -14,
          blur: 4,
          holdRatio: 0.54,
          scrub: 0.95,
        });

        // Heading letter-spacing settle — scrubbed across the entry zone
        // so the display weight tightens as the plate moves into focus.
        if (heading) {
          gsap.set(heading, { letterSpacing: "0.006em" });
          gsap.to(heading, {
            letterSpacing: "-0.03em",
            ease: "none",
            scrollTrigger: {
              trigger: plate,
              start: "top 82%",
              end: "top 34%",
              scrub: 1.1,
              invalidateOnRefresh: true,
            },
          });
        }

        // Per-motif point accents — scrub-driven, fully bidirectional.
        if (points.length) {
          const pointsFrom: gsap.TweenVars = { opacity: 0.34 };
          const pointsTo: gsap.TweenVars = {
            opacity: 1,
            ease: "power2.out",
          };
          switch (motifId) {
            case "masthead":
              pointsFrom.y = 8;
              pointsTo.y = 0;
              break;
            case "catalog":
              pointsFrom.y = 10;
              pointsTo.y = 0;
              break;
            case "blueprint":
              pointsFrom.x = -8;
              pointsTo.x = 0;
              break;
            case "flow":
              pointsFrom.x = -10;
              pointsTo.x = 0;
              break;
          }
          gsap.set(points, pointsFrom);
          gsap.to(points, {
            ...pointsTo,
            stagger: {
              each: motifId === "flow" ? 0.14 : 0.08,
              from: "start",
            },
            scrollTrigger: {
              trigger: plate,
              start: "top 76%",
              end: "top 30%",
              scrub: 1.0,
              invalidateOnRefresh: true,
            },
          });
        }

        // CTA rule — hairline draws in during entry, retracts on exit.
        if (ctaRule) {
          gsap.set(ctaRule, { scaleX: 0, transformOrigin: "left center" });
          gsap.fromTo(
            ctaRule,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: plate,
                start: "top 60%",
                end: "top 26%",
                scrub: 0.9,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      });

      /* ——— Ceremonial statement ———
       * The pull quote now rides the scroll: the three lines build
       * presence during the entry zone, reach their sharpest clarity
       * in focus, and ease back out as the next section approaches.
       * Letter-spacing on the heading tightens into focus, loosens
       * on release — no once:true, no latched state. */
      if (pullLines.length) {
        const pullSection =
          (pullLines[0] as HTMLElement).closest("section") ?? pullLines[0];

        // Line-by-line presence, driven by the section as a whole so
        // each line reads in sequence rather than snapping together.
        gsap.set(pullLines, {
          yPercent: 26,
          opacity: 0,
          filter: "blur(6px)",
        });
        gsap.to(pullLines, {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.18,
          scrollTrigger: {
            trigger: pullSection,
            start: "top 82%",
            end: "top 32%",
            scrub: 1.0,
            invalidateOnRefresh: true,
          },
        });

        // Release on exit — gentle, symmetric.
        gsap.to(pullLines, {
          opacity: 0.22,
          filter: "blur(5px)",
          yPercent: -16,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: {
            trigger: pullSection,
            start: "bottom 60%",
            end: "bottom 10%",
            scrub: 1.0,
            invalidateOnRefresh: true,
          },
        });

        if (pullHeading) {
          gsap.set(pullHeading, { letterSpacing: "0.008em" });
          gsap.to(pullHeading, {
            letterSpacing: "-0.036em",
            ease: "none",
            scrollTrigger: {
              trigger: pullSection,
              start: "top 76%",
              end: "top 30%",
              scrub: 1.1,
              invalidateOnRefresh: true,
            },
          });
        }
      }

      /* ——— Final CTA ———
       * The sign-off gathers presence as it enters, holds full
       * clarity across the reading focus, and softens (never fully
       * disappears) as the footer approaches. All scrub-driven —
       * no spring easing, no once:true. */
      if (finalLineA.length || finalLineB.length) {
        const finalSection =
          (finalLineA[0] as HTMLElement | undefined)?.closest("section") ??
          (finalLineB[0] as HTMLElement | undefined)?.closest("section") ??
          finalLineA[0] ??
          finalLineB[0];

        // Lines lift into focus with the section's entry zone.
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

        // Centre-rule draws across the focus zone.
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

        // CTA gathers presence — restrained, no springy scale-up.
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

        // Ledger details — quiet focus track beneath the CTA.
        if (finalLedger.length) {
          rackFocusTrack(finalLedger, {
            trigger: finalSection,
            start: "top 58%",
            end: "top 22%",
            blur: 3,
            opacityFloor: 0.22,
            scrub: 1.0,
          });
        }
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/leistungen" />

      <main
        ref={rootRef}
        className="relative bg-[#0A0A0A] pb-0 pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.5rem]"
      >
        {/* =========================================================
           HERO — register index composition
        ========================================================= */}
        <section
          data-leis-hero
          className="relative overflow-hidden px-5 pb-28 sm:px-8 sm:pb-32 md:px-12 md:pb-44 lg:px-16 lg:pb-52"
        >
          {/* Editorial register texture — thin horizontal bands +
              faint vertical ticks.  Reads as "masthead ledger" and
              stays distinct from the detail pages' motif textures. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.3]"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(255,255,255,0.014) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.014) 1px, transparent 1px)",
              backgroundSize: "96px 96px, 48px 96px",
              maskImage:
                "radial-gradient(ellipse 66% 62% at 28% 54%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 66% 62% at 28% 54%, black, transparent)",
            }}
          />

          {/* Vertical editorial credit */}
          <div
            data-leis-credit
            aria-hidden
            className="pointer-events-none absolute bottom-14 left-5 z-10 hidden md:block lg:bottom-16 lg:left-8"
          >
            <span className="hero-vertical-credit">
              MAGICKS &nbsp;·&nbsp; WERK &nbsp;·&nbsp; LEISTUNGEN &nbsp;·&nbsp; REGISTER MMXXVI
            </span>
          </div>

          <div className="relative layout-max">
            <div data-leis-herocopy>
              <div data-leis-chapter className="mb-10 sm:mb-14">
                <ChapterMarker num="Register" label="Werk · Leistungen" />
              </div>

              {/*
               * H1 — two-line serif display.
               * The italic line carries the rhetorical turn of the
               * sentence ("nicht nach Standard aussehen."), so the
               * emphasis lands on the entire clause, not just its
               * last few words. Line A reads as set-up, Line B as
               * verdict — exactly the pacing the brief calls for.
               */}
              <h1
                data-leis-h1
                className="font-instrument max-w-[62rem] text-[2.3rem] leading-[0.98] tracking-[-0.036em] text-white sm:text-[2.95rem] md:text-[3.85rem] lg:text-[4.55rem] xl:text-[5.1rem]"
              >
                <span className="block">
                  {["Digitale", "Leistungen,", "die"].map((w, i) => (
                    <span
                      key={`a-${i}`}
                      className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-leis-h1a className="inline-block will-change-[transform,opacity]">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/64 sm:mt-2">
                  {["nicht", "nach", "Standard", "aussehen."].map((w, i) => (
                    <span
                      key={`b-${i}`}
                      className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-leis-h1b className="inline-block will-change-[transform,opacity]">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>

              {/* Intro */}
              <div data-leis-lead className="mt-10 max-w-[48rem] sm:mt-12 md:mt-14">
                <p className="font-instrument text-[1.3rem] italic leading-[1.35] tracking-[-0.01em] text-white/82 sm:text-[1.5rem] md:text-[1.65rem]">
                  Wir bauen, was Unternehmen digital wirklich weiterbringt.
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/58 md:text-[16px] md:leading-[1.72]">
                  Von Websites und Landing Pages über Shops und Produktkonfiguratoren bis zu
                  Web-Software, KI-Automationen und Integrationen.
                </p>
                <p className="font-ui mt-5 text-[15px] leading-[1.72] text-white/58 md:text-[16px] md:leading-[1.72]">
                  <em className="italic text-white/88">Keine Templates. Kein Mittelmaß.</em> Sondern
                  digitale Lösungen, die hochwertig aussehen, sauber funktionieren und im Alltag
                  genau das tun, was sie sollen.
                </p>
              </div>

              {/* CTA */}
              <div
                data-leis-cta
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
                      data-leis-cta-rule
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

              {/*
               * Hero monogram folio — a single-line mono signature
               * replaces the three-tag meta cluster. Reads as a true
               * hub monogram ("the whole body of work, Edition
               * MMXXVI") rather than a tag-cloud that echoes the
               * enumerated register below.
               */}
              <div
                data-leis-meta
                className="mt-14 flex items-center gap-4 sm:mt-18 md:mt-20"
              >
                <span aria-hidden className="h-px w-10 bg-white/24 sm:w-14" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.38em] text-white/58 sm:text-[10.5px]">
                  Werk · 04 Folios · Edition MMXXVI
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/12" />
              </div>

              {/* ServiceRegister — the signature motif of the hub.
                  A full 4-column ledger that shows all disciplines
                  at once, foreshadowing the plates that follow. */}
              <div className="mt-16 flex flex-col gap-3 sm:mt-20 md:mt-24">
                <div className="font-mono grid grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)] items-center gap-5 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/38 sm:text-[10.5px]">
                  <span>Werk · Register</span>
                  <span aria-hidden className="h-px w-full bg-white/14" />
                  <span className="tabular-nums text-white/32">I · II · III · IV</span>
                </div>
                <ServiceRegister />
              </div>
            </div>
          </div>

          {/* Register plate readout */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-6 right-5 hidden items-center gap-4 md:right-12 md:flex lg:right-16 lg:bottom-10"
          >
            <span className="font-mono flex items-center gap-2 text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/36">
              <span className="tick-breathing block h-1.5 w-1.5 rounded-full bg-white/75" />
              Register · Live
            </span>
            <span aria-hidden className="h-px w-8 bg-white/18" />
            <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.26em] text-white/34">
              WEB — SHOP — SOFT — KI
            </span>
          </div>
        </section>

        {/*
         * Transitions — we keep three, not five. Prior draft had
         * one at every § boundary which read as a metronome.
         * Pacing needs silence between beats, so only the real
         * pivots announce themselves:
         *   · Hero → § 02 Werk (skipping § 01, which is a quiet text beat)
         *   · § 02 Werk → § 03 Übergänge
         *   · § Statement → § 05 Orientierung
         */}

        {/* =========================================================
           § 01 — "Was wir für dich bauen"
           Narrative opener. The register echo was pulled: it used to
           preview the plates here, but that duplicated the Werk
           colophon that fires only seconds later. The page enumerated
           the four disciplines four times before anything happened.
           Now § 01 is a pure narrative beat — heading + lead prose +
           a single cross-ref line — and the register metaphor does
           its real work down in § 02.
        ========================================================= */}
        <section className="relative px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-20 lg:gap-28">
              <div data-leis-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 01 — Index
                </p>
                <h2 className="font-instrument text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]">
                  Was wir für dich{" "}
                  <em className="italic text-white/58">bauen.</em>
                </h2>

                <div className="mt-10 flex items-center gap-4 md:mt-14">
                  <span aria-hidden className="h-px w-10 bg-white/22 md:w-14" />
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                    ↘ Weiter in § 02  Werk
                  </span>
                </div>
              </div>

              <div data-leis-reveal className="md:pt-3">
                <p className="font-ui text-[15px] leading-[1.72] text-white/64 md:text-[16.5px] md:leading-[1.72]">
                  Nicht jedes Projekt braucht dasselbe. Manche brauchen einen starken digitalen
                  Auftritt. Manche einen Shop, einen Konfigurator oder eine individuelle
                  Web-Anwendung. Und manche brauchen vor allem saubere Prozesse, Integrationen und
                  Automationen im Hintergrund.
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/64 md:text-[16.5px] md:leading-[1.72]">
                  Genau deshalb denken wir Leistungen nicht als starre Pakete, sondern als{" "}
                  <em className="italic text-white/88">
                    Lösungen, die zu deinem Unternehmen, deinem Ziel und deinem digitalen Reifegrad
                    passen.
                  </em>
                </p>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 01  Index" to="§ 02  Werk — I bis IV" />

        {/* =========================================================
           § 02 — THE FOUR SERVICE PLATES
           Rendered as an editorial sequence. Each plate alternates
           anchor (left / right) to build a zigzag reading rhythm.
        ========================================================= */}
        <section className="relative bg-[#09090A]">
          {/*
           * A shared top/bottom frame — hairline rails with centered
           * register folio. Frames the 4 plates as one editorial
           * chapter instead of four disconnected blocks.
           */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(255,255,255,0.01) 1px, transparent 1px)",
              backgroundSize: "100% 240px",
              maskImage:
                "linear-gradient(180deg, transparent 0%, black 6%, black 94%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(180deg, transparent 0%, black 6%, black 94%, transparent 100%)",
            }}
          />

          {/*
           * Chapter frontispiece for § 02 Werk.
           * Not a caption line — a proper editorial opening. A folio
           * header row rides the top hairline with the pagination
           * "I · II · III · IV" readout; a huge italic serif "Werk."
           * display sets the chapter weight; a short italic caption
           * sits at the bottom-right of the display to hand off to
           * the first plate. No extra preview strip — the plates
           * themselves are the enumeration.
           */}
          <div
            data-leis-reveal
            className="relative px-5 pt-20 sm:px-8 sm:pt-24 md:px-12 md:pt-28 lg:px-16 lg:pt-32"
          >
            <div className="layout-max">
              {/* Folio header — left label, hairline, right specimen */}
              <div className="font-mono grid grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)] items-center gap-5 text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/42 sm:text-[10.5px]">
                <span>§ 02 — Werk · Vier Disziplinen</span>
                <span aria-hidden className="h-px w-full bg-white/14" />
                <span className="tabular-nums text-white/32">I · II · III · IV</span>
              </div>

              {/* Frontispiece display */}
              <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-end md:gap-16 lg:gap-24">
                <h2 className="font-instrument relative text-[4.25rem] leading-[0.92] tracking-[-0.04em] text-white sm:text-[6rem] md:text-[7.75rem] lg:text-[9.25rem] xl:text-[10.25rem]">
                  <em className="italic text-white">Werk</em>
                  <span aria-hidden className="text-white/40">.</span>
                </h2>

                <div className="flex flex-col gap-4 md:pb-4">
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 sm:text-[10.5px]">
                    Index · Vier Folios
                  </span>
                  <p className="font-instrument text-[1.15rem] italic leading-[1.4] tracking-[-0.008em] text-white/78 sm:text-[1.3rem] md:text-[1.4rem]">
                    Vier Disziplinen, die sich in echten Projekten ständig berühren — als eigenständige
                    Arbeitsfelder und als Teile derselben digitalen Lösung.
                  </p>
                </div>
              </div>

              {/*
               * The 4-column title colophon and the later slim
               * pagination bar were both pulled — the top-of-block
               * folio header ("§ 02 — Werk · Vier Disziplinen"
               * with "I · II · III · IV") already carries the
               * pagination, and the plates themselves are the
               * real enumeration. Nothing else needs to announce
               * the four disciplines again before Folio I opens.
               */}
            </div>
          </div>

          {/* Plates sequence */}
          <div className="relative">
            {PLATES.map((plate, i) => (
              <div key={plate.hook} className="relative">
                <ServicePlate
                  folio={plate.folio}
                  code={plate.code}
                  caption={plate.caption}
                  title={plate.title}
                  body={plate.body}
                  points={plate.points}
                  ctaLabel={plate.ctaLabel}
                  to={plate.to}
                  motif={plate.motif}
                  anchor={plate.anchor}
                  hook={plate.hook}
                />
                {i < PLATES.length - 1 && (
                  <div aria-hidden className="px-5 sm:px-8 md:px-12 lg:px-16">
                    <div className="layout-max">
                      {/*
                       * Between-plate page-turn: two short hairline
                       * dashes and a small serif Roman. Reads as
                       * "next folio" the way a printed monograph
                       * marks a page turn, not as agency-style
                       * section-nav.
                       */}
                      <div className="flex items-center justify-center gap-5">
                        <span aria-hidden className="h-px w-12 bg-white/12 sm:w-24" />
                        <span className="font-instrument text-[1rem] italic leading-none tracking-[-0.005em] text-white/36 sm:text-[1.1rem]">
                          {PLATES[i + 1].folio}
                        </span>
                        <span aria-hidden className="h-px w-12 bg-white/12 sm:w-24" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chapter colophon */}
          <div
            data-leis-reveal
            className="relative px-5 pb-16 sm:px-8 sm:pb-20 md:px-12 md:pb-24 lg:px-16"
          >
            <div className="layout-max">
              <div className="font-mono flex items-center gap-5 text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                <span aria-hidden className="h-px w-10 bg-white/22 sm:w-16" />
                <span>End · Werk — I bis IV</span>
                <span aria-hidden className="h-px flex-1 bg-white/12" />
                <span className="tabular-nums text-white/32">04 Disziplinen · MMXXVI</span>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ 02  Werk" to="§ 03  Übergänge" />

        {/* =========================================================
           § 03 — "Integrationen sind oft der Teil…"
           Layout-as-argument: the section literalises its thesis by
           placing a thin vertical connector rail between the two
           columns — the "Übergang" is the gap. A small hop-arrow
           sits on the rail as a nod to the flow motif without
           re-using a plate glyph.
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="relative grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-24 lg:gap-32">
              {/* Connector rail — vertical hairline with a mid-node */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-0 hidden h-full -translate-x-1/2 md:block"
              >
                <span className="absolute left-1/2 top-0 block h-full w-px -translate-x-1/2 bg-white/[0.09]" />
                <span className="absolute left-1/2 top-[calc(50%-28px)] block h-14 w-px -translate-x-1/2 bg-white/28" />
                <span className="absolute left-1/2 top-1/2 block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/62" />
                <span className="absolute left-1/2 top-[calc(50%+18px)] block h-px w-4 -translate-x-1/2 bg-white/36" />
                <span className="font-mono absolute left-1/2 top-[calc(50%+30px)] -translate-x-1/2 whitespace-nowrap text-[9px] font-medium uppercase leading-none tracking-[0.38em] text-white/40">
                  Übergang
                </span>
              </div>

              <div data-leis-reveal className="md:pr-6 lg:pr-10">
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 03 — Übergänge
                </p>
                <h2 className="font-instrument text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]">
                  Integrationen sind oft der Teil, der am Ende den{" "}
                  <em className="italic text-white/58">Unterschied macht.</em>
                </h2>
              </div>

              <div data-leis-reveal className="md:pl-6 md:pt-3 lg:pl-10">
                <p className="font-ui text-[15px] leading-[1.72] text-white/64 md:text-[16.5px] md:leading-[1.72]">
                  Eine gute digitale Lösung endet nicht an der Oberfläche. Oft entsteht der
                  eigentliche Mehrwert erst dann, wenn{" "}
                  <em className="italic text-white/88">
                    Systeme sauber zusammenspielen, Daten sinnvoll weiterlaufen
                  </em>{" "}
                  und Prozesse nicht mehr an manuellen Zwischenschritten hängen.
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/64 md:text-[16.5px] md:leading-[1.72]">
                  Deshalb denken wir nicht nur in Seiten oder Screens, sondern auch in Übergängen,
                  Logik und technischer Verbindung. Genau dort entstehen häufig die Lösungen, die
                  im Alltag wirklich spürbar etwas verbessern.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* § 03 → § 04 runs without a marker; two prose beats in
             close succession, no pivot. */}

        {/* =========================================================
           § 04 — "Wie wir Leistungen bei MAGICKS denken"
           Centered editorial composition — deliberately not another
           bipartite grid. Eyebrow sits alone on the top hairline,
           the headline spans the full measure, and the prose
           follows as a single centered column. Reads as the
           studio's statement of position rather than a caption /
           body split.
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-32 sm:px-8 sm:py-40 md:px-12 md:py-48 lg:px-16 lg:py-56">
          <div className="layout-max">
            <div className="mx-auto max-w-[58rem]">
              <div data-leis-reveal className="mb-14 flex items-center gap-5 sm:mb-20">
                <span aria-hidden className="h-px w-10 bg-white/24 sm:w-14" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/48 sm:text-[10.5px]">
                  § 04 — Haltung
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/14" />
              </div>

              <h2
                data-leis-reveal
                className="font-instrument text-[2.25rem] leading-[1.02] tracking-[-0.03em] text-white sm:text-[2.95rem] md:text-[3.6rem] lg:text-[4.1rem]"
              >
                Wie wir Leistungen bei{" "}
                <em className="italic text-white/58">MAGICKS</em> denken.
              </h2>

              <div data-leis-reveal className="mt-12 md:mt-16">
                <p className="font-instrument text-[1.2rem] italic leading-[1.38] tracking-[-0.008em] text-white/86 sm:text-[1.38rem] md:text-[1.52rem]">
                  Wir verkaufen keine aufgeblähten Leistungspakete, nur damit es nach mehr aussieht.
                </p>

                <p className="font-ui mt-8 max-w-[44rem] text-[15.5px] leading-[1.74] text-white/64 md:mt-10 md:text-[16.5px] md:leading-[1.74]">
                  Wir schauen zuerst darauf, was ein Projekt{" "}
                  <em className="italic text-white/88">wirklich braucht</em>: Sichtbarkeit,
                  Nutzerführung, Verkauf, digitale Prozesse, Automationen oder eine individuelle
                  Anwendung.
                </p>

                <p className="font-ui mt-5 max-w-[44rem] text-[15.5px] leading-[1.74] text-white/64 md:text-[16.5px] md:leading-[1.74]">
                  Darauf bauen wir die passende Lösung.{" "}
                  <em className="italic text-white/88">
                    Direkt, technisch sauber und mit dem Anspruch, dass das Ergebnis nicht nur im
                    Pitch gut aussieht, sondern im Alltag funktioniert.
                  </em>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* § 04 Haltung rises naturally into the ceremonial
             statement — no transition marker, the tonal shift does
             the pivot work. */}

        {/* =========================================================
           CEREMONIAL STATEMENT — three-line declaration
           "Websites, die wirken. Systeme, die funktionieren.
           Automationen, die entlasten."
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#070708] px-5 py-36 sm:px-8 sm:py-44 md:px-12 md:py-56 lg:px-16 lg:py-64">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.85]"
            style={{
              background:
                "radial-gradient(ellipse 62% 48% at 50% 50%, rgba(255,255,255,0.042), transparent 62%)",
            }}
          />
          {/* Register texture behind ceremonial statement */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(255,255,255,0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
              backgroundSize: "64px 64px, 64px 64px",
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
                  § Statement
                </span>
                <span aria-hidden className="h-px flex-1 bg-white/12" />
              </div>

              <div className="relative">
                {/*
                 * Gutter column — "WEB / SYS / AUT" tagging for each
                 * ceremonial line, threaded by a vertical hairline.
                 */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-10 top-0 hidden h-full flex-col justify-between py-[0.4em] md:-left-12 md:flex lg:-left-16"
                >
                  <span aria-hidden className="absolute left-[3px] top-[0.5em] bottom-[0.5em] w-px bg-white/14" />
                  {["WEB", "SYS", "AUT"].map((letter) => (
                    <span
                      key={letter}
                      className="font-mono relative flex items-center gap-2 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/36 sm:text-[10px]"
                    >
                      <span aria-hidden className="block h-px w-2 bg-white/34" />
                      {letter}
                    </span>
                  ))}
                </div>

                <h3
                  data-leis-pullheading
                  className="font-instrument text-[2.4rem] leading-[1.02] tracking-[-0.036em] text-white sm:text-[3.2rem] md:text-[4.1rem] lg:text-[4.7rem] xl:text-[5.3rem]"
                >
                  <span className="block overflow-hidden">
                    <span data-leis-pull className="inline-block">
                      Websites, die wirken.
                    </span>
                  </span>
                  <span className="block overflow-hidden">
                    <span data-leis-pull className="inline-block italic text-white/64">
                      Systeme, die funktionieren.
                    </span>
                  </span>
                  <span className="block overflow-hidden">
                    <span data-leis-pull className="inline-block">
                      Automationen, die entlasten.
                    </span>
                  </span>
                </h3>
              </div>

              <div className="mt-16 flex items-center gap-5 sm:mt-20">
                <span aria-hidden className="h-px flex-1 bg-white/12" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                  Edition · Haltung · Register
                </span>
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              </div>
            </div>
          </div>
        </section>

        <SectionTransition from="§ Statement" to="§ 05  Orientierung" tone="darker" />

        {/* =========================================================
           § 05 — "Nicht sicher, was davon zu deinem Projekt passt?"
           Consultative cross-link to /kontakt.
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20 lg:gap-24">
              <div data-leis-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 05 — Orientierung
                </p>
                <h2 className="font-instrument text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]">
                  Nicht sicher, was davon zu deinem Projekt{" "}
                  <em className="italic text-white/58">passt?</em>
                </h2>
              </div>

              <div data-leis-reveal className="md:pt-3">
                <p className="font-ui text-[15px] leading-[1.72] text-white/64 md:text-[16.5px] md:leading-[1.72]">
                  Nicht jedes Vorhaben lässt sich sofort sauber einer Kategorie zuordnen. Manchmal
                  beginnt es mit einer Website und endet bei einer größeren Web-Anwendung. Manchmal
                  ist ein Konfigurator Teil eines Vertriebsprozesses. Und manchmal liegt der größte
                  Hebel in der Automation dahinter.
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/64 md:text-[16.5px] md:leading-[1.72]">
                  <em className="italic text-white/88">Genau deshalb denken wir mit.</em> Wenn du
                  schon weißt, was du brauchst, gehen wir direkt rein. Und wenn noch nicht alles
                  klar ist, strukturieren wir es gemeinsam.
                </p>

                {/*
                 * CTA — promoted full-width baseline rail. Same shape
                 * as the plate CTAs so by § 05 readers already know
                 * this is how MAGICKS closes a chapter: hairline rule,
                 * folio label left, cross-link right.
                 */}
                <div
                  data-leis-reveal
                  className="mt-12 border-t border-white/[0.14] pt-6 md:mt-16 md:pt-7"
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.38em] text-white/54 sm:text-[10.5px]">
                      Nächster Schritt · Anfrage
                    </span>
                    <Link
                      to="/kontakt"
                      className="group relative inline-flex items-baseline gap-3 text-[16px] font-medium tracking-[-0.005em] text-white no-underline sm:text-[17px] md:text-[18.5px]"
                      aria-label="Projekt besprechen"
                    >
                      <span className="relative pb-2.5">
                        <span className="font-ui">Projekt besprechen</span>
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left bg-white/50"
                        />
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-white transition-transform duration-[820ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                        />
                      </span>
                      <span
                        aria-hidden
                        className="font-instrument text-[1.08em] italic text-white/88 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[3px] group-hover:translate-x-[3px]"
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

        {/* =========================================================
           CROSS-LINK GATE — "Planbarer starten?" → /website-im-abo
           Foreshadowed as "Plate · Beyond" so it reads as a fifth,
           ancillary plate that sits outside the main I–IV register
           rather than a bolted-on link.
        ========================================================= */}
        <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div className="layout-max">
            <div data-leis-reveal className="mb-6 sm:mb-8">
              {/* Pre-heading — sub-folio for the beyond register */}
              <div className="font-mono grid grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)] items-center gap-5 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/44 sm:text-[10.5px]">
                <span>Plate · Ergänzung</span>
                <span aria-hidden className="h-px w-full bg-white/14" />
                <span className="tabular-nums text-white/32">V · außerhalb Werk</span>
              </div>
              <p className="font-instrument mt-6 max-w-[52rem] text-[1.55rem] leading-[1.18] tracking-[-0.02em] text-white sm:text-[1.85rem] md:text-[2.1rem]">
                <em className="italic text-white">Planbarer starten?</em>
              </p>
            </div>

            <div data-leis-reveal>
              <ContextualCrossLink
                eyebrow="Ergänzung"
                folio="Plate V · Website im Abo"
                lead="Wenn du eine professionelle Website brauchst, aber die Investition lieber planbar monatlich strukturieren möchtest, gibt es bei MAGICKS Studio auch dafür ein passendes Modell."
                linkLabel="Mehr zu Website im Abo"
                to="/website-im-abo"
              />
            </div>
          </div>
        </section>

        {/* =========================================================
           FINAL CTA — register plate composition.
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#070708] px-5 pb-32 pt-32 sm:px-8 sm:pb-40 sm:pt-40 md:px-12 md:pb-48 md:pt-48 lg:px-16 lg:pt-56">
          <div aria-hidden className="section-top-rule" />

          {/*
           * Register plate corner crop marks — WEB / SHOP / SOFT / KI,
           * the four disciplines claimed at the plate's four corners.
           * Reads as the hub's own editorial signature and distinguishes
           * it from detail pages' IN/OUT or H/B/T cartouches.
           */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-5 hidden md:inset-8 md:block lg:inset-10"
          >
            <span className="absolute left-0 top-0 block h-3 w-3 border-l border-t border-white/28" />
            <span className="font-mono absolute left-5 top-1 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              WEB · NW
            </span>
            <span className="absolute right-0 top-0 block h-3 w-3 border-r border-t border-white/28" />
            <span className="font-mono absolute right-5 top-1 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              SHOP · NE
            </span>
            <span className="absolute bottom-0 left-0 block h-3 w-3 border-b border-l border-white/28" />
            <span className="font-mono absolute bottom-1 left-5 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              SOFT · SW
            </span>
            <span className="absolute bottom-0 right-0 block h-3 w-3 border-b border-r border-white/28" />
            <span className="font-mono absolute bottom-1 right-5 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              KI · SE
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
                "linear-gradient(0deg, rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
              backgroundSize: "80px 80px, 80px 80px",
              maskImage: "radial-gradient(ellipse 72% 62% at 50% 46%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[68rem] text-center">
              <div className="mb-14 inline-flex sm:mb-20">
                <ChapterMarker num="END" label="Register" align="center" variant="end" />
              </div>

              <h2 className="font-instrument text-[2.35rem] leading-[0.98] tracking-[-0.036em] text-white sm:text-[3.25rem] md:text-[4.3rem] lg:text-[5.2rem] xl:text-[5.9rem]">
                <span className="block">
                  {["Bereit", "für", "eine", "digitale", "Lösung,"].map((w, i) => (
                    <span
                      key={`fa-${i}`}
                      className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-leis-finala className="inline-block">
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
                      <span data-leis-finalb className="inline-block">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              </h2>

              <div className="mx-auto mt-12 flex w-full max-w-[42rem] items-center gap-4 sm:mt-16">
                <span aria-hidden className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40">
                  ·
                </span>
                <div aria-hidden className="relative h-px flex-1">
                  <span
                    data-leis-finalrule
                    className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  />
                </div>
                <span aria-hidden className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40">
                  ·
                </span>
              </div>

              <p className="font-ui mx-auto mt-10 max-w-[46rem] text-[15px] leading-[1.72] text-white/60 md:mt-12 md:text-[16.5px]">
                Wir entwickeln Websites, Shops, Produktkonfiguratoren, Web-Software und
                KI-Automationen, die hochwertig wirken, sauber funktionieren und digital wirklich
                weiterbringen.
              </p>

              {/*
               * The mid-ledger (Projekt / Register / Direkt) was
               * pulled. Corner crop marks already claim WEB / SHOP /
               * SOFT / KI, the final register plate carries the
               * studio signature, and the hero monogram stated the
               * edition up top. Another ledger here made the finale
               * feel like a contents page rather than a close.
               * A single centered CTA button + a quiet direct line
               * underneath is the real weight.
               */}
              <div className="mt-14 flex flex-col items-center gap-6 sm:mt-18 sm:gap-8">
                <div data-leis-finalcta>
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

                <div
                  data-leis-finalledger
                  className="flex flex-col items-center gap-1 sm:flex-row sm:gap-4"
                >
                  <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/42 sm:text-[10px]">
                    oder direkt
                  </span>
                  <a
                    href="mailto:hello@magicks.studio"
                    className="font-instrument text-[1.1rem] italic text-white/88 no-underline magicks-duration-hover magicks-ease-out transition-colors hover:text-white sm:text-[1.2rem]"
                  >
                    hello@magicks.studio
                  </a>
                </div>
              </div>
            </div>

            {/* Register plate — 4-field signature */}
            <div className="mt-24 border-t border-white/[0.08] pt-7 sm:mt-32">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-0">
                {[
                  { k: "§ End", v: "Werk · Register" },
                  { k: "Folio", v: "I · II · III · IV" },
                  { k: "Handschrift", v: "Magicks · Studio" },
                  { k: "Edition", v: "MMXXVI" },
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
