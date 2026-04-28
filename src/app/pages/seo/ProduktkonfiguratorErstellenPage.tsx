import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ChapterMarker } from "../../components/home/ChapterMarker";
import { ContextualCrossLink } from "../../components/service/ContextualCrossLink";
import { SectionTransition } from "../../components/service/SectionTransition";
import { RouteSEO } from "../../seo/RouteSEO";

/* ------------------------------------------------------------------
 * /produktkonfigurator-erstellen — bespoke editorial landing page.
 *
 * Emphasis: 3D configurators for construction and made-to-measure
 * businesses. Visually strong, product-driven, immersive but controlled.
 * Sharper than Web-Software, more expressive than the KI page, but
 * distinctly its own idiom — a specimen object on a technical plate.
 *
 * Hero motif: SpecimenCube — a cabinet-projected wireframe cube with
 * H · B · T dimension callouts, corner crop marks, and a single
 * breathing interaction point. Reads unambiguously as "3D object with
 * measurements", which telegraphs the entire page's premise in one
 * glance: configurators for dimensioned, made-to-measure products.
 *
 * Sections:
 *   · Hero                — H1, CTA, meta triad, SpecimenCube, vertical credit
 *   · § 01  Lage          — "Wenn Produkte erklärungsbedürftig sind"
 *   · § 02  Branchenatlas — 15 industries grouped in 3 editorial columns
 *   · § 03  Zielbild      — 5 audience cases routed to config-axes
 *   · § 04  Umfang        — 6-item SPEC register
 *   · § 05  Herangehen    — "Wie wir Produktkonfiguratoren denken"
 *   · § 06  Absage        — "Was du nicht bekommst"
 *   · § Positionierung    — "3D, die erklärt. Konfiguration, die führt..."
 *   · Cross-links         — Shops · Web-Software · KI
 *   · Final CTA           — specimen plate signature
 * ------------------------------------------------------------------ */

const INCLUDES: { spec: string; kind: string; title: string; body: string }[] = [
  {
    spec: "SPEC-01",
    kind: "3D",
    title: "3D-Produktkonfiguratoren",
    body:
      "Interaktive Lösungen, die Produkte räumlich, hochwertig und verständlich erlebbar machen.",
  },
  {
    spec: "SPEC-02",
    kind: "Logik",
    title: "Varianten- und Optionslogik",
    body:
      "Maße, Farben, Materialien, Ausstattungen und Abhängigkeiten sauber digital abbilden.",
  },
  {
    spec: "SPEC-03",
    kind: "Führung",
    title: "Nutzerführung mit Klarheit",
    body:
      "Konfiguratoren, die Entscheidungen leichter machen statt zusätzliche Reibung zu erzeugen.",
  },
  {
    spec: "SPEC-04",
    kind: "Übergabe",
    title: "Anfrage- und Vertriebslogik",
    body:
      "Strukturierte Übergaben, bessere Vorqualifizierung und saubere Anschlussprozesse.",
  },
  {
    spec: "SPEC-05",
    kind: "Technik",
    title: "Technische Umsetzung",
    body:
      "Performant, modern und sauber aufgebaut – für echte Nutzung, nicht nur Demo-Effekt.",
  },
  {
    spec: "SPEC-06",
    kind: "Brücke",
    title: "Integrationen",
    body:
      "Anbindungen an CRM, Anfrageprozesse, Kalkulationslogik oder andere Systeme, wenn sie Teil der Lösung sind.",
  },
];

/**
 * Audience cases mapped to a config-axis — Varianz, Mass, Erklärung,
 * Übergabe, Führung. Reads as a configurator dimensioning document
 * rather than a generic bullet list.
 */
const AUDIENCE: { text: string; axis: string }[] = [
  { text: "Produkte mit vielen Varianten oder Optionen anbietest", axis: "Varianz" },
  {
    text: "Maße, Farben, Materialien oder Ausstattungen digital auswählbar machen willst",
    axis: "Mass",
  },
  { text: "individuelle Produkte besser erklärbar machen musst", axis: "Erklärung" },
  { text: "Anfragen strukturierter vorbereiten willst", axis: "Übergabe" },
  { text: "Vertrieb und Nutzerführung digital verbessern möchtest", axis: "Führung" },
];

/**
 * Industry groupings — 15 construction-related and made-to-measure
 * business types grouped into 3 editorial chapters. The groupings are
 * real (Gebäudehülle · Innenausbau · Spezialgewerke) so the section
 * reads as a trade directory, not a keyword dump.
 */
const BRANCHEN: { code: string; title: string; items: string[] }[] = [
  {
    code: "§ A",
    title: "Gebäudehülle & Außenraum",
    items: [
      "Wintergartenbauer",
      "Carport- und Vordachbauer",
      "Zaun- und Torbauer",
      "Rollladen- und Sonnenschutzbetriebe",
      "Insektenschutz-Anbieter",
      "Garagentor-Fachbetriebe",
      "Photovoltaik, Überdachung und Pergola",
    ],
  },
  {
    code: "§ B",
    title: "Innenausbau & Wohnraum",
    items: [
      "Treppen- und Geländerbauer",
      "Küchenstudios mit Maßanfertigung",
      "Badezimmerrenovierer",
      "Bodenleger, Parkett und Fliesen",
      "Möbel nach Maß und Einbauschränke",
    ],
  },
  {
    code: "§ C",
    title: "Spezialgewerke & Modulbau",
    items: [
      "Maler und Fassadenbetriebe",
      "Metallbau, Glasbau und Schlossereien",
      "Container-, Modulbau-, Gartenhaus- und Gartenraum-Anbieter",
    ],
  },
];

/* ------------------------------------------------------------------
 * SpecimenCube — cabinet-projected wireframe with H / B / T callouts.
 *
 * Drawn in SVG so it stays crisp at every width and can animate
 * deterministically. Three dimension labels sit outside the cube
 * (ruler-style with tick marks), one interaction point breathes at
 * a configurable corner, and corner crop-marks anchor the specimen
 * on the technical plate.
 *
 * Cabinet projection with 30° depth angle:
 *   screen_x = x + 0.5 · y · cos(30°)
 *   screen_y = -z − 0.5 · y · sin(30°)
 * Cube edge = 110. Origin at front-bottom-left = (60, 170).
 * ------------------------------------------------------------------ */
function SpecimenCube() {
  // Pre-computed 2D coords for the 8 cube corners
  // F = Front face, B = Back face. {T,B}op, {L,R}eft
  const FBL: [number, number] = [60, 170];
  const FBR: [number, number] = [170, 170];
  const FTL: [number, number] = [60, 60];
  const FTR: [number, number] = [170, 60];
  const BBL: [number, number] = [108, 142]; // +48 / -28 depth offset
  const BBR: [number, number] = [218, 142];
  const BTL: [number, number] = [108, 32];
  const BTR: [number, number] = [218, 32];

  const line = (p1: [number, number], p2: [number, number]) =>
    `M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]}`;

  return (
    <div aria-hidden className="w-full max-w-[44rem]">
      <svg
        viewBox="0 0 280 200"
        className="w-full"
        role="presentation"
        aria-hidden
      >
        {/* Hidden edges — very thin, barely visible, for completeness */}
        <g stroke="rgba(255,255,255,0.11)" strokeWidth="0.6" strokeDasharray="2 2" fill="none">
          <path d={line(BBL, BBR)} />
          <path d={line(BBL, BTL)} />
          <path d={line(FBL, BBL)} />
        </g>

        {/* Visible wireframe — front face + top + right-top + right-bottom depth */}
        <g stroke="rgba(255,255,255,0.55)" strokeWidth="1" fill="none" strokeLinecap="round">
          {/* Front face */}
          <path d={line(FBL, FBR)} data-pk-edge />
          <path d={line(FBR, FTR)} data-pk-edge />
          <path d={line(FTR, FTL)} data-pk-edge />
          <path d={line(FTL, FBL)} data-pk-edge />
          {/* Top face — back edges */}
          <path d={line(FTL, BTL)} data-pk-edge />
          <path d={line(BTL, BTR)} data-pk-edge />
          <path d={line(FTR, BTR)} data-pk-edge />
          {/* Right face — back edges */}
          <path d={line(FBR, BBR)} data-pk-edge />
          <path d={line(BBR, BTR)} data-pk-edge />
        </g>

        {/* Dimension rulers — Height (left).
            Main rail + end caps + 3 subdivision ticks reading as a
            calibrated measuring instrument, not just an abstract label. */}
        <g stroke="rgba(255,255,255,0.32)" strokeWidth="0.8" fill="none">
          <path d="M 44 60 L 44 170" />
          <path d="M 40 60 L 48 60" />
          <path d="M 40 170 L 48 170" />
          {/* subdivisions — quarter, half, three-quarter */}
          <path d="M 42 87.5 L 46 87.5" opacity="0.6" />
          <path d="M 41 115 L 47 115" opacity="0.7" />
          <path d="M 42 142.5 L 46 142.5" opacity="0.6" />
        </g>
        <text
          x="38"
          y="122"
          textAnchor="end"
          fill="rgba(255,255,255,0.78)"
          className="font-mono"
          fontSize="8.5"
          letterSpacing="2.2"
          style={{ textTransform: "uppercase", fontWeight: 500 }}
        >
          H
        </text>

        {/* Dimension rulers — Breite (bottom) */}
        <g stroke="rgba(255,255,255,0.32)" strokeWidth="0.8" fill="none">
          <path d="M 60 186 L 170 186" />
          <path d="M 60 182 L 60 190" />
          <path d="M 170 182 L 170 190" />
          <path d="M 87.5 184 L 87.5 188" opacity="0.6" />
          <path d="M 115 183 L 115 189" opacity="0.7" />
          <path d="M 142.5 184 L 142.5 188" opacity="0.6" />
        </g>
        <text
          x="115"
          y="198"
          textAnchor="middle"
          fill="rgba(255,255,255,0.78)"
          className="font-mono"
          fontSize="8.5"
          letterSpacing="2.2"
          style={{ textTransform: "uppercase", fontWeight: 500 }}
        >
          B
        </text>

        {/* Dimension rulers — Tiefe (top-right diagonal) */}
        <g stroke="rgba(255,255,255,0.32)" strokeWidth="0.8" fill="none">
          <path d="M 182 52 L 230 24" />
          <path d="M 178 48 L 186 56" />
          <path d="M 226 20 L 234 28" />
          <path d="M 192 44 L 198 48" opacity="0.6" />
          <path d="M 204 37 L 211 41" opacity="0.7" />
          <path d="M 216 30 L 222 33" opacity="0.6" />
        </g>
        <text
          x="226"
          y="50"
          textAnchor="start"
          fill="rgba(255,255,255,0.78)"
          className="font-mono"
          fontSize="8.5"
          letterSpacing="2.2"
          style={{ textTransform: "uppercase", fontWeight: 500 }}
        >
          T
        </text>

        {/* Corner crosshair — top-right front, the "configurable" point */}
        <g stroke="rgba(255,255,255,0.82)" strokeWidth="1" fill="none">
          <path d="M 170 54 L 170 66" />
          <path d="M 164 60 L 176 60" />
        </g>
        <circle
          cx="170"
          cy="60"
          r="2.2"
          fill="rgba(255,255,255,0.92)"
          data-pk-tick
        />

        {/* Subtle axis anchors — tiny corner ticks on the other 3 front corners */}
        <g fill="rgba(255,255,255,0.44)">
          <circle cx="60" cy="60" r="1.4" />
          <circle cx="60" cy="170" r="1.4" />
          <circle cx="170" cy="170" r="1.4" />
        </g>
      </svg>

      <div className="font-mono mt-3 grid grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)] items-center gap-4 text-[9px] font-medium uppercase leading-none tracking-[0.28em] text-white/30 sm:text-[9.5px]">
        <span className="tabular-nums">Specimen No. 01</span>
        <span aria-hidden className="h-px w-full bg-white/12" />
        <span className="tabular-nums text-white/46">H × B × T · Konfigurierbar</span>
      </div>
    </div>
  );
}

export default function ProduktkonfiguratorErstellenPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      // ——— Hero ———
      const heroChapter = root.querySelector<HTMLElement>("[data-pk-chapter]");
      const heroLineA = gsap.utils.toArray<HTMLElement>("[data-pk-h1a]");
      const heroLineB = gsap.utils.toArray<HTMLElement>("[data-pk-h1b]");
      const heroH1 = root.querySelector<HTMLElement>("[data-pk-h1]");
      const heroLead = root.querySelector<HTMLElement>("[data-pk-lead]");
      const heroCta = root.querySelector<HTMLElement>("[data-pk-cta]");
      const heroCtaRule = root.querySelector<HTMLElement>("[data-pk-cta-rule]");
      const heroMeta = gsap.utils.toArray<HTMLElement>("[data-pk-meta]");
      const heroSpecimen = root.querySelector<HTMLElement>("[data-pk-specimen]");
      const heroEdges = gsap.utils.toArray<SVGPathElement>("[data-pk-edge]");
      const heroTick = root.querySelector<SVGCircleElement>("[data-pk-tick]");
      const heroCredit = root.querySelector<HTMLElement>("[data-pk-credit]");
      const heroSection = root.querySelector<HTMLElement>("[data-pk-hero]");
      const heroCopy = root.querySelector<HTMLElement>("[data-pk-herocopy]");

      // ——— Scroll reveals ———
      const reveals = gsap.utils.toArray<HTMLElement>("[data-pk-reveal]");
      const branchGroups = gsap.utils.toArray<HTMLElement>("[data-pk-branchgroup]");
      const pullLines = gsap.utils.toArray<HTMLElement>("[data-pk-pull]");
      const pullHeading = root.querySelector<HTMLElement>("[data-pk-pullheading]");
      const finalLineA = gsap.utils.toArray<HTMLElement>("[data-pk-finala]");
      const finalLineB = gsap.utils.toArray<HTMLElement>("[data-pk-finalb]");
      const finalRule = root.querySelector<HTMLElement>("[data-pk-finalrule]");
      const finalLedger = gsap.utils.toArray<HTMLElement>("[data-pk-finalledger]");
      const finalCta = root.querySelector<HTMLElement>("[data-pk-finalcta]");

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
            heroTick,
            heroCredit,
            ...reveals,
            ...branchGroups,
            ...pullLines,
            pullHeading,
            ...finalLineA,
            ...finalLineB,
            finalRule,
            ...finalLedger,
            finalCta,
          ],
          { opacity: 1, y: 0, yPercent: 0, scaleX: 1, letterSpacing: "normal", rotate: 0 },
        );
        heroEdges.forEach((e) => {
          try {
            const length = e.getTotalLength();
            gsap.set(e, { strokeDasharray: length, strokeDashoffset: 0 });
          } catch {
            // Path length not available
          }
        });
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
      gsap.set(heroSpecimen, { opacity: 0, scale: 0.98, transformOrigin: "center center" });
      gsap.set(heroTick, { opacity: 0, scale: 0, transformOrigin: "center center" });
      gsap.set(heroCredit, { opacity: 0, y: 8 });

      // Cube edges draw in sequentially
      heroEdges.forEach((e) => {
        try {
          const length = e.getTotalLength();
          gsap.set(e, { strokeDasharray: length, strokeDashoffset: length });
        } catch {
          // Path length not available
        }
      });

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
        .to(heroSpecimen, { opacity: 1, scale: 1, duration: 1.2 }, 1.78)
        // Edges draw in — 9 visible edges, paced like a technical drawing
        // being laid out. Slightly slower stagger = more considered,
        // more specimen-plate energy, less "loader" energy.
        .to(
          heroEdges,
          {
            strokeDashoffset: 0,
            duration: 1.0,
            stagger: 0.095,
            ease: "power2.inOut",
          },
          1.88,
        )
        .to(
          heroTick,
          { opacity: 1, scale: 1, duration: 0.9, ease: "back.out(2)" },
          2.95,
        )
        .to(heroCredit, { opacity: 1, y: 0, duration: 1.0 }, 3.05);

      // Subtle idle drift on the specimen — reads as "real object in space"
      if (heroSpecimen) {
        gsap.to(heroSpecimen, {
          y: -3,
          duration: 5.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 3.5,
        });
      }

      // ——— Hero camera push ———
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

      // ——— Branchenatlas reveal — groups stagger in as a sweep ———
      branchGroups.forEach((group, i) => {
        const items = group.querySelectorAll<HTMLElement>("[data-pk-branchitem]");
        gsap.set(group, { opacity: 0, y: 24 });
        gsap.set(items, { opacity: 0, y: 10 });
        gsap
          .timeline({
            scrollTrigger: { trigger: group, start: "top 82%", once: true },
          })
          .to(group, { opacity: 1, y: 0, duration: 0.95, ease: "power3.out" }, i * 0.05)
          .to(
            items,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.06,
              ease: "power3.out",
            },
            i * 0.05 + 0.15,
          );
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
            stagger: 0.16,
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
      <RouteSEO path="/produktkonfigurator-erstellen" />

      <main
        ref={rootRef}
        className="relative bg-[#0A0A0A] pb-0 pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.5rem]"
      >
        {/* =========================================================
           HERO — specimen object on a technical plate
        ========================================================= */}
        <section
          data-pk-hero
          className="relative overflow-hidden px-5 pb-28 sm:px-8 sm:pb-32 md:px-12 md:pb-44 lg:px-16 lg:pb-52"
        >
          {/* Isometric plate texture — distinguished from Web-Software's
              uniform dot grid by angled strokes at 30° */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.28]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(30deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 64px), repeating-linear-gradient(-30deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 64px)",
              maskImage:
                "radial-gradient(ellipse 60% 66% at 32% 54%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 66% at 32% 54%, black, transparent)",
            }}
          />

          <div
            data-pk-credit
            aria-hidden
            className="pointer-events-none absolute bottom-14 left-5 z-10 hidden md:block lg:bottom-16 lg:left-8"
          >
            <span className="hero-vertical-credit">
              MAGICKS &nbsp;·&nbsp; SPEZIAL &nbsp;·&nbsp; 3D-KONFIGURATOR &nbsp;·&nbsp; SPECIMEN MMXXVI
            </span>
          </div>

          <div className="relative layout-max">
            <div data-pk-herocopy>
              <div data-pk-chapter className="mb-10 sm:mb-14">
                <ChapterMarker num="Spezial" label="3D Konfiguratoren" />
              </div>

              {/* H1 */}
              <h1
                data-pk-h1
                className="font-instrument max-w-[62rem] text-[2.25rem] leading-[0.98] tracking-[-0.038em] text-white sm:text-[2.95rem] md:text-[3.8rem] lg:text-[4.5rem] xl:text-[5.05rem]"
              >
                <span className="block">
                  {["3D-Produktkonfiguratoren,", "die", "Produkte"].map((w, i) => (
                    <span
                      key={`a-${i}`}
                      className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-pk-h1a className="inline-block will-change-[transform,opacity]">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/64 sm:mt-2">
                  {["verständlich", "machen", "und", "Anfragen", "besser", "führen."].map(
                    (w, i) => (
                      <span
                        key={`b-${i}`}
                        className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                      >
                        <span data-pk-h1b className="inline-block will-change-[transform,opacity]">
                          {w}
                        </span>
                      </span>
                    ),
                  )}
                </span>
              </h1>

              {/* Intro */}
              <div data-pk-lead className="mt-10 max-w-[46rem] sm:mt-12 md:mt-14">
                <p className="font-instrument text-[1.3rem] italic leading-[1.35] tracking-[-0.01em] text-white/82 sm:text-[1.5rem] md:text-[1.65rem]">
                  Ein guter Produktkonfigurator ist mehr als eine technische Spielerei.
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/58 md:text-[16px] md:leading-[1.72]">
                  Er hilft Nutzern, Produkte besser zu verstehen, Varianten sicher auszuwählen und
                  schneller zu einer klaren Entscheidung oder Anfrage zu kommen.
                </p>
                <p className="font-ui mt-5 text-[15px] leading-[1.72] text-white/58 md:text-[16px] md:leading-[1.72]">
                  Genau dafür entwickeln wir 3D-Produktkonfiguratoren, die{" "}
                  <em className="italic text-white/86">
                    visuell hochwertig wirken, technisch sauber funktionieren
                  </em>{" "}
                  und im Vertrieb oder Anfrageprozess echten Mehrwert schaffen.
                </p>
              </div>

              {/* CTA */}
              <div
                data-pk-cta
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
                      data-pk-cta-rule
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

              {/* Meta triad — mobile stacks as ledger column. */}
              <div className="mt-12 flex flex-col gap-2 sm:mt-18 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-3 md:mt-20">
                {["Raum", "Varianz", "Anfrage"].map((m, i) => (
                  <span
                    key={m}
                    data-pk-meta
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
               * SpecimenCube — the signature motif.
               * Caption row uses a three-field folio (prefix · hairline ·
               * right spec) that mirrors a technical plate caption
               * instead of two floating chips.
               */}
              <div
                data-pk-specimen
                className="mt-16 flex flex-col gap-3 sm:mt-20 md:mt-24"
              >
                <div className="font-mono grid grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)] items-center gap-5 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/38 sm:text-[10.5px]">
                  <span>Fig. 01 · Specimen</span>
                  <span aria-hidden className="h-px w-full bg-white/14" />
                  <span className="tabular-nums text-white/32">H · B · T · Konfigurierbar</span>
                </div>
                <SpecimenCube />
              </div>
            </div>
          </div>

          {/*
           * Specimen plate readout — a 3D-object footer line that mirrors
           * the KI page's "Signal · Live" indicator but carries the
           * specimen vocabulary. The breathing tick reads as "object is
           * in frame", staying distinct from a signal-flow aesthetic.
           */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-6 right-5 hidden items-center gap-4 md:right-12 md:flex lg:right-16 lg:bottom-10"
          >
            <span className="font-mono flex items-center gap-2 text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/36">
              <span className="tick-breathing block h-1.5 w-1.5 rounded-full bg-white/75" />
              Specimen · Live
            </span>
            <span aria-hidden className="h-px w-8 bg-white/18" />
            <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/34">
              Specimen · Spezial
            </span>
            <span aria-hidden className="h-px w-10 bg-white/18" />
            <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.26em] text-white/34">
              RAUM — VARIANZ — MASS — ANFRAGE
            </span>
          </div>
        </section>

        {/* Transition → § 01 Lage */}
        <SectionTransition from="§ Hero — Spezial" to="§ 01  Lage" />

        {/* =========================================================
           § 01 — "Wenn Produkte erklärungsbedürftig sind"
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20 lg:gap-24">
              <div data-pk-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 01 — Lage
                </p>
                <h2 className="font-instrument text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]">
                  Wenn Produkte erklärungsbedürftig, variantenreich oder{" "}
                  <em className="italic text-white/58">maßgefertigt</em> sind.
                </h2>

                <div data-pk-reveal className="mt-10 flex items-center gap-4 md:mt-14">
                  <span aria-hidden className="h-px w-10 bg-white/22 md:w-14" />
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    → Siehe § 02 Branchenatlas
                  </span>
                </div>
              </div>

              <div data-pk-reveal className="md:pt-3">
                <p className="font-ui text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Nicht jedes Produkt lässt sich mit ein paar statischen Bildern sauber verkaufen
                  oder erklären.
                </p>
                <p className="font-ui mt-5 text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Sobald{" "}
                  <em className="italic text-white/88">
                    Varianten, Maße, Ausstattungen, Farben, Optionen oder individuelle
                    Zusammenstellungen
                  </em>{" "}
                  ins Spiel kommen, wird gute Nutzerführung entscheidend.
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Wir entwickeln 3D-Produktkonfiguratoren, die genau diese Komplexität verständlich
                  machen. So entstehen digitale Erlebnisse, die Produkte klarer zeigen,
                  Auswahlprozesse strukturieren und Anfragen deutlich besser vorbereiten.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → § 02 Branchenatlas */}
        <SectionTransition from="§ 01  Lage" to="§ 02  Branchenatlas" />

        {/* =========================================================
           § 02 — BRANCHENATLAS
           15 industries grouped in 3 editorial chapters.
           This is the SEO-critical section: it must feel premium,
           trustworthy, and structured — never a spammy list.
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          {/* Subtle isometric texture for this section */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(30deg, rgba(255,255,255,0.01) 0 1px, transparent 1px 72px), repeating-linear-gradient(-30deg, rgba(255,255,255,0.01) 0 1px, transparent 1px 72px)",
              maskImage:
                "radial-gradient(ellipse 70% 62% at 50% 50%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 62% at 50% 50%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="grid gap-14 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-pk-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <ChapterMarker num="02" label="Branchenatlas" />
                  <span
                    aria-hidden
                    className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]"
                  >
                    03 Kapitel · 15 Gewerke
                  </span>
                </div>
              </div>

              <div>
                {/* Atlas frontispiece — positions the section as a real
                    trade directory, not a keyword dump. */}
                <p
                  data-pk-reveal
                  className="font-mono mb-6 flex items-center gap-3 text-[9.5px] font-medium uppercase leading-none tracking-[0.38em] text-white/38 sm:text-[10px]"
                >
                  <span aria-hidden className="h-px w-8 bg-white/24 sm:w-12" />
                  <span>Atlas · Gewerke &amp; Mass</span>
                </p>

                <h2
                  data-pk-reveal
                  className="font-instrument max-w-[52rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  3D-Produktkonfiguratoren für die{" "}
                  <em className="italic text-white/58">Bau-Branche</em> und maßgefertigte Produkte.
                </h2>

                <p
                  data-pk-reveal
                  className="font-ui mt-8 max-w-[42rem] text-[15px] leading-[1.7] text-white/58 md:mt-10 md:text-[15.5px]"
                >
                  Gerade in der Bau-Branche und überall dort, wo Produkte konfigurierbar,
                  erklärungsbedürftig oder individuell gefertigt sind, kann ein
                  3D-Produktkonfigurator einen echten Unterschied machen.
                </p>

                <p
                  data-pk-reveal
                  className="font-instrument mt-8 text-[1.18rem] italic leading-[1.4] tracking-[-0.01em] text-white/72 md:mt-10 md:text-[1.32rem]"
                >
                  Zum Beispiel für:
                </p>

                {/*
                 * Editorial Branchenatlas — 3 grouped chapters, each
                 * presented as an addressable register (§ A / § B / § C)
                 * with its own title, code and itemized list. Thin rules
                 * between items, mono trade index, and a right-hung trade
                 * count per chapter. Reads as a professional trade
                 * directory rather than a bullet list.
                 */}
                <div className="mt-12 flex flex-col gap-20 md:mt-16 md:gap-28">
                  {BRANCHEN.map((group, groupIndex) => (
                    <div
                      key={group.code}
                      data-pk-branchgroup
                      className="relative"
                    >
                      {/*
                       * Group header — folio-style. Register code + big
                       * italicized serif title on the left, atlas
                       * pagination + gewerke count on the right. Title
                       * was sized up (~1.9→2.35rem) so each chapter
                       * reads as a confident editorial statement
                       * instead of a list heading.
                       */}
                      <div className="flex flex-col gap-5 pb-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:pb-6">
                        <div className="flex items-baseline gap-4 sm:gap-6">
                          <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/60 sm:text-[10.5px]">
                            {group.code}
                          </span>
                          <h3 className="font-instrument text-[1.55rem] leading-[1.08] tracking-[-0.022em] text-white sm:text-[1.9rem] md:text-[2.15rem] lg:text-[2.35rem]">
                            <em className="italic text-white">{group.title}</em>
                          </h3>
                        </div>

                        <div className="flex items-baseline gap-4 font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/36 sm:text-[10px]">
                          <span className="tabular-nums">
                            Blatt · {String(groupIndex + 1).padStart(2, "0")} / {String(BRANCHEN.length).padStart(2, "0")}
                          </span>
                          <span aria-hidden className="h-px w-5 bg-white/22" />
                          <span className="tabular-nums">
                            {String(group.items.length).padStart(2, "0")} Gewerke
                          </span>
                        </div>
                      </div>

                      {/* Folio divider — a touch stronger and paired with
                          two corner ticks that read as atlas page anchors. */}
                      <div aria-hidden className="relative h-px w-full bg-white/[0.14]">
                        <span className="absolute -left-px -top-[3px] block h-[7px] w-px bg-white/32" />
                        <span className="absolute -right-px -top-[3px] block h-[7px] w-px bg-white/32" />
                      </div>

                      {/*
                       * Industry items — two columns on desktop, hairline
                       * rows with a dual trade index (group · position).
                       * Rows hover-lift subtly on desktop for a live
                       * directory-entry feeling without visual noise.
                       */}
                      <ul className="grid grid-cols-1 gap-x-10 gap-y-0 sm:grid-cols-2 md:gap-x-14">
                        {group.items.map((item, i) => (
                          <li
                            key={item}
                            data-pk-branchitem
                            className="group/branchrow relative grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 border-b border-white/[0.07] py-4 md:py-5"
                          >
                            <span className="font-mono tabular-nums text-[9.5px] font-medium leading-none tracking-[0.28em] text-white/42 md:text-[10px]">
                              {String.fromCharCode(65 + groupIndex)}
                              <span className="mx-[0.3em] text-white/22">·</span>
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <p className="font-instrument text-[1.04rem] leading-[1.3] tracking-[-0.01em] text-white/90 transition-colors duration-500 group-hover/branchrow:text-white md:text-[1.12rem] lg:text-[1.2rem]">
                              {item}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Atlas footer — specimen signature */}
                <div
                  data-pk-reveal
                  className="font-mono mt-14 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:mt-20"
                >
                  <span>Register · Branchenatlas</span>
                  <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                  <span className="tabular-nums">15 Gewerke · MMXXVI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → § 03 Zielbild */}
        <SectionTransition from="§ 02  Branchenatlas" to="§ 03  Zielbild" />

        {/* =========================================================
           § 03 — AUDIENCE ZIELBILD
           5 cases routed to config-axes.
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-pk-reveal className="md:pt-2">
                <ChapterMarker num="03" label="Zielbild" />
              </div>

              <div>
                <h2
                  data-pk-reveal
                  className="font-instrument max-w-[52rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Für Unternehmen, die{" "}
                  <em className="italic text-white/58">
                    Auswahl, Varianten und Anfrageprozesse
                  </em>{" "}
                  klarer digital abbilden wollen.
                </h2>

                <p
                  data-pk-reveal
                  className="font-ui mt-8 max-w-xl text-[15px] leading-[1.7] text-white/56 md:mt-10 md:text-[15.5px]"
                >
                  Diese Leistung ist für Unternehmen, die Produkte nicht nur zeigen, sondern digital
                  verständlich konfigurieren und sauber zum nächsten Schritt führen wollen.
                </p>

                <p
                  data-pk-reveal
                  className="font-instrument mt-10 text-[1.18rem] italic leading-[1.4] tracking-[-0.01em] text-white/72 md:text-[1.32rem]"
                >
                  Zum Beispiel, wenn du:
                </p>

                {/*
                 * Config-axis routing table — each case routes to a
                 * coded axis (AX-01 … AX-05) plus its human label. The
                 * technical AX-NN prefix gives the table a real
                 * specimen-catalogue structure; the italicized serif
                 * name keeps it readable, not cold.
                 */}
                <ul className="mt-10 space-y-0 border-t border-white/[0.07] md:mt-14">
                  {AUDIENCE.map((item, i) => (
                    <li
                      key={item.text}
                      data-pk-reveal
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
                        className="col-span-2 inline-flex items-center gap-3 md:col-span-1"
                      >
                        <span aria-hidden className="h-px w-6 bg-white/22 md:w-9" />
                        <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/58 md:text-[10px]">
                          AX-{String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-instrument text-[0.95rem] italic leading-none tracking-[-0.005em] text-white/68 md:text-[1.02rem]">
                          {item.axis}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → § 04 Umfang */}
        <SectionTransition from="§ 03  Zielbild" to="§ 04  Umfang" />

        {/* =========================================================
           § 04 — INCLUDES — "Was wir für dich umsetzen"
           Spec-register — 6 items with SPEC-NN prefix and kind chip.
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-pk-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    § 04 — Umfang
                  </p>
                  <span
                    aria-hidden
                    className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]"
                  >
                    Specimen-Register · 06 Positionen
                  </span>
                </div>
              </div>

              <div>
                <h2
                  data-pk-reveal
                  className="font-instrument max-w-[48rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Was wir für dich <em className="italic text-white/58">umsetzen</em>.
                </h2>

                <ol className="mt-14 grid gap-x-14 gap-y-0 border-t border-white/[0.06] md:mt-20 md:grid-cols-2">
                  {INCLUDES.map((item, i) => (
                    <li
                      key={item.title}
                      data-pk-reveal
                      className="relative grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 border-b border-white/[0.06] py-8 sm:gap-x-8 md:py-10"
                    >
                      <span className="font-mono pt-[0.4rem] text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/52 md:text-[11.5px]">
                        {item.spec}
                      </span>
                      <div>
                        {/*
                         * Row chip — specimen kind + position in the
                         * register. "Position NN / 06" replaces the
                         * generic "axis" placeholder with a real
                         * specimen-catalogue position marker.
                         */}
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/50 md:text-[10.5px]">
                            {item.kind}
                          </span>
                          <span aria-hidden className="h-px w-3 bg-white/18 md:w-5" />
                          <span className="font-mono tabular-nums text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:text-[9.5px]">
                            Position · {String(i + 1).padStart(2, "0")} / {String(INCLUDES.length).padStart(2, "0")}
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

                <div
                  data-pk-reveal
                  className="font-mono mt-6 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:mt-8"
                >
                  <span>Register · Specimen</span>
                  <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                  <span className="tabular-nums">3D · Dim · H×B×T</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → § 05 Herangehen */}
        <SectionTransition from="§ 04  Umfang" to="§ 05  Herangehen" />

        {/* =========================================================
           § 05 — APPROACH
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-20 lg:gap-28">
              <div data-pk-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 05 — Herangehen
                </p>
                <h2 className="font-instrument text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]">
                  Wie wir Produktkonfiguratoren{" "}
                  <em className="italic text-white/58">denken</em>.
                </h2>
              </div>

              <div data-pk-reveal className="md:pt-3">
                <p className="font-ui text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Wir starten nicht mit Technik um der Technik willen.
                </p>

                <p className="font-ui mt-5 text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Wir schauen zuerst darauf, wie ein Produkt{" "}
                  <em className="italic text-white/88">
                    erklärt, verstanden und ausgewählt
                  </em>{" "}
                  wird.
                </p>

                {/* Four configurator questions */}
                <div className="mt-8 flex flex-col gap-4 border-l border-white/[0.12] pl-6 md:mt-10 md:pl-8">
                  <p className="font-instrument text-[1.2rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 md:text-[1.4rem] lg:text-[1.55rem]">
                    Welche Varianten sind relevant?
                  </p>
                  <p className="font-instrument text-[1.2rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 md:text-[1.4rem] lg:text-[1.55rem]">
                    Welche Entscheidungen müssen nacheinander passieren?
                  </p>
                  <p className="font-instrument text-[1.2rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 md:text-[1.4rem] lg:text-[1.55rem]">
                    Wo braucht es Orientierung?
                  </p>
                  <p className="font-instrument text-[1.2rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 md:text-[1.4rem] lg:text-[1.55rem]">
                    Wie wird daraus am Ende eine gute Anfrage oder ein sauberer Abschluss?
                  </p>
                </div>

                <p className="font-ui mt-10 text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Darauf bauen wir Konfiguratoren, die nicht nur beeindrucken, sondern{" "}
                  <em className="italic text-white/88">im echten Prozess funktionieren.</em>
                </p>
                <p className="font-ui mt-5 text-[15px] leading-[1.72] text-white/60 md:text-[16px] md:leading-[1.72]">
                  Visuell stark, logisch aufgebaut und klar geführt.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → § 06 Absage */}
        <SectionTransition from="§ 05  Herangehen" to="§ 06  Absage" />

        {/* =========================================================
           § 06 — NEGATION
        ========================================================= */}
        <section className="relative overflow-hidden px-5 py-32 sm:px-8 sm:py-40 md:px-12 md:py-52 lg:px-16 lg:py-56">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.55]"
            style={{
              background:
                "radial-gradient(ellipse 55% 42% at 50% 50%, rgba(255,255,255,0.03), transparent 62%)",
            }}
          />

          <div className="relative layout-max">
            <div className="grid gap-16 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-pk-reveal className="md:pt-2">
                <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 06 — Absage
                </p>
              </div>

              <div>
                <h2
                  data-pk-reveal
                  className="font-instrument max-w-[48rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Was du von uns{" "}
                  <em className="italic text-white/58">nicht bekommst</em>.
                </h2>

                <ul className="mt-14 space-y-8 md:mt-20 md:space-y-10">
                  {[
                    "Keinen Spielerei-Konfigurator ohne echten Nutzen.",
                    "Keine unübersichtliche Variantenhölle.",
                    "Keine 3D-Lösung, die beeindruckt, aber Vertrieb, Anfrage oder Nutzerführung nicht wirklich verbessert.",
                  ].map((line) => (
                    <li
                      key={line}
                      data-pk-reveal
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
                  data-pk-reveal
                  className="font-ui mt-16 max-w-[44rem] text-[15.5px] leading-[1.72] text-white/62 md:mt-20 md:text-[16.5px]"
                >
                  Was du bekommst, ist ein Produktkonfigurator mit{" "}
                  <em className="italic text-white/92">
                    Klarheit, Funktion und echter Relevanz für deinen Prozess.
                  </em>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → Positionierung */}
        <SectionTransition from="§ 06  Absage" to="§ Positionierung" tone="darker" />

        {/* =========================================================
           CEREMONIAL PULL — "3D, die erklärt. Konfiguration, die führt..."
           H / B / T coordinate column threading the specimen vocabulary.
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
            className="pointer-events-none absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(30deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 56px), repeating-linear-gradient(-30deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 56px)",
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

              <div className="relative">
                {/*
                 * Dimension gutter — ceremonial labels threaded onto a
                 * vertical hairline reading as a calibrated H/B/T axis
                 * running along the page's left edge. Small cross-ticks
                 * sit at each dimension letter like real ruler marks.
                 */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-10 top-0 hidden h-full flex-col justify-between py-[0.4em] md:-left-12 md:flex lg:-left-16"
                >
                  <span aria-hidden className="absolute left-[3px] top-[0.5em] bottom-[0.5em] w-px bg-white/14" />
                  {["H", "B", "T"].map((letter) => (
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
                  data-pk-pullheading
                  className="font-instrument text-[2.35rem] leading-[1.02] tracking-[-0.038em] text-white sm:text-[3.15rem] md:text-[4.05rem] lg:text-[4.65rem] xl:text-[5.2rem]"
                >
                  <span className="block overflow-hidden">
                    <span data-pk-pull className="inline-block">
                      3D, die erklärt.
                    </span>
                  </span>
                  <span className="block overflow-hidden">
                    <span data-pk-pull className="inline-block italic text-white/64">
                      Konfiguration, die führt.
                    </span>
                  </span>
                  <span className="block overflow-hidden">
                    <span data-pk-pull className="inline-block">
                      Umsetzung, die im Vertrieb wirklich hilft.
                    </span>
                  </span>
                </h3>
              </div>

              <div className="mt-16 flex items-center gap-5 sm:mt-20">
                <span aria-hidden className="h-px flex-1 bg-white/12" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                  Edition · Positionierung · Spezial
                </span>
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              </div>
            </div>
          </div>
        </section>

        {/*
         * ========================================================
         * CONTEXTUAL CROSS-LINKS — three stacked gates.
         *  · Kollektion  → /shops-produktkonfiguratoren
         *  · Fundament   → /web-software
         *  · Nebenstrang → /ki-automationen-integrationen
         * ========================================================
         */}
        <section className="relative px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16 lg:py-28">
          <div className="layout-max space-y-14 sm:space-y-16 md:space-y-20">
            <div data-pk-reveal>
              <ContextualCrossLink
                eyebrow="Kollektion"
                folio="Plate · Shops & Konfiguratoren"
                lead="Wenn dein Projekt stärker auf Shop, Verkauf und digitale Produktpräsentation einzahlt, schau dir auch unsere Shops & Produktkonfiguratoren an."
                linkLabel="Shops & Konfiguratoren ansehen"
                to="/shops-produktkonfiguratoren"
              />
            </div>

            <div data-pk-reveal>
              <ContextualCrossLink
                eyebrow="Fundament"
                folio="Plate 04 · Web-Software"
                lead="Wenn dein Konfigurator eher Teil einer größeren Plattform oder individuellen Anwendung wird, wirf einen Blick auf unsere Web-Software."
                linkLabel="Web-Software ansehen"
                to="/web-software"
              />
            </div>

            <div data-pk-reveal>
              <ContextualCrossLink
                eyebrow="Nebenstrang"
                folio="Protocol 05 · KI & Automationen"
                lead="Wenn hinter dem Konfigurator zusätzlich Automationen, Anfragenlogik oder Systemverbindungen laufen sollen, schau dir auch unsere KI-Automationen & Integrationen an."
                linkLabel="KI & Automationen ansehen"
                to="/ki-automationen-integrationen"
              />
            </div>
          </div>
        </section>

        {/* =========================================================
           FINAL CTA — specimen plate composition.
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#070708] px-5 pb-32 pt-32 sm:px-8 sm:pb-40 sm:pt-40 md:px-12 md:pb-48 md:pt-48 lg:px-16 lg:pt-56">
          <div aria-hidden className="section-top-rule" />

          {/* Specimen plate corner crop marks */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-5 hidden md:inset-8 md:block lg:inset-10"
          >
            <span className="absolute left-0 top-0 block h-3 w-3 border-l border-t border-white/28" />
            <span className="font-mono absolute left-5 top-1 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              H · NW
            </span>
            <span className="absolute right-0 top-0 block h-3 w-3 border-r border-t border-white/28" />
            <span className="font-mono absolute right-5 top-1 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              T · NE
            </span>
            <span className="absolute bottom-0 left-0 block h-3 w-3 border-b border-l border-white/28" />
            <span className="font-mono absolute bottom-1 left-5 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              B · SW
            </span>
            <span className="absolute bottom-0 right-0 block h-3 w-3 border-b border-r border-white/28" />
            <span className="font-mono absolute bottom-1 right-5 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              M · SE
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
                "repeating-linear-gradient(30deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 72px), repeating-linear-gradient(-30deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 72px)",
              maskImage: "radial-gradient(ellipse 72% 62% at 50% 46%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[68rem] text-center">
              <div className="mb-14 inline-flex sm:mb-20">
                <ChapterMarker num="END" label="Projekt" align="center" variant="end" />
              </div>

              <h2 className="font-instrument text-[2.35rem] leading-[0.98] tracking-[-0.038em] text-white sm:text-[3.25rem] md:text-[4.3rem] lg:text-[5.2rem] xl:text-[5.9rem]">
                <span className="block">
                  {["Bereit", "für", "einen", "3D-Produktkonfigurator,"].map((w, i) => (
                    <span
                      key={`fa-${i}`}
                      className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-pk-finala className="inline-block">
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
                      <span data-pk-finalb className="inline-block">
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
                    data-pk-finalrule
                    className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  />
                </div>
                <span aria-hidden className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40">
                  ·
                </span>
              </div>

              <p className="font-ui mx-auto mt-10 max-w-[44rem] text-[15px] leading-[1.72] text-white/60 md:mt-12 md:text-[16.5px]">
                Wir entwickeln Produktkonfiguratoren, die Varianten verständlich machen, Nutzer klar
                führen und Anfragen oder Verkaufsprozesse digital spürbar verbessern.
              </p>

              <div className="mt-14 grid items-center gap-10 text-left sm:mt-18 sm:grid-cols-[auto_1fr] sm:gap-14 md:gap-20">
                <div data-pk-finalcta className="flex justify-center sm:justify-start">
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
                  <div data-pk-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Projekt
                    </span>
                    <span className="font-instrument text-[1.2rem] italic leading-[1.3] text-white/90 sm:text-[1.4rem] md:text-[1.5rem]">
                      3D Konfigurator · Varianten · Anfrage
                    </span>
                  </div>

                  <div data-pk-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Specimen
                    </span>
                    <span className="font-ui text-[13.5px] leading-[1.5] text-white/62 sm:text-[14.5px]">
                      Maße, Optionen und Übergaben — geplant, bevor gebaut wird.
                    </span>
                  </div>

                  <div data-pk-finalledger className="flex flex-col gap-1.5">
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

            {/* Specimen plate cartouche — 4-field signature */}
            <div className="mt-24 border-t border-white/[0.06] pt-7 sm:mt-28">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-0">
                {[
                  { k: "§ End", v: "Spezial · 3D" },
                  { k: "Specimen", v: "3D Konfigurator" },
                  { k: "Dim", v: "H × B × T" },
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
