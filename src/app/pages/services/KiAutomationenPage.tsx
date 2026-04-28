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
 * /ki-automationen-integrationen — bespoke editorial landing page.
 *
 * Emphasis: connected systems, intelligent flow, operational relief.
 * Visual language: more kinetic than /web-software's architectural
 * calm, but calmer than /shops-produktkonfiguratoren's catalog energy.
 *
 * Hero motif: FlowMesh — three input tokens (SYS · DATA · API) feed
 * through a central KI hub, fan back out to three outputs (CRM · TEAM
 * · LOG). Hairline connectors carry a slow signal pulse — the visual
 * equivalent of "information landing where it is needed."
 *
 * Sections:
 *   · Hero               — chapter folio, serif H1, CTA, meta triad, FlowMesh
 *   · Statement 01       — "Wenn Systeme nicht zusammenspielen..."
 *   · Audience           — "Für Unternehmen, die weniger manuell arbeiten wollen"
 *   · Includes           — 6-item "Flussregister" (flow-stage labeled)
 *   · Approach           — "Wie wir KI und Automationen denken"
 *   · Negation           — "Was du nicht bekommst" — declaration ladder
 *   · Ceremonial Pull    — "Weniger manuell. Mehr verbunden..."
 *   · Cross-links        — /web-software AND /produktkonfigurator-erstellen
 *   · Final CTA          — serif headline + session ledger + white pill
 * ------------------------------------------------------------------ */

const INCLUDES: { flow: string; kind: string; title: string; body: string }[] = [
  {
    flow: "FLOW-01",
    kind: "Prozess",
    title: "Prozessautomationen",
    body:
      "Automatisierte Abläufe für wiederkehrende Aufgaben, Übergaben und interne Logik.",
  },
  {
    flow: "FLOW-02",
    kind: "Intelligenz",
    title: "KI-gestützte Workflows",
    body:
      "Smarte Prozesse, in denen KI dort eingesetzt wird, wo sie echten Mehrwert bringt.",
  },
  {
    flow: "FLOW-03",
    kind: "Brücke",
    title: "Tool- und Systemintegrationen",
    body:
      "Verbindungen zwischen CRM, Formularen, internen Tools, APIs, Datenquellen oder anderen Plattformen.",
  },
  {
    flow: "FLOW-04",
    kind: "Übergabe",
    title: "Datenflüsse & Übergaben",
    body:
      "Informationen landen automatisch dort, wo sie gebraucht werden, statt manuell verschoben zu werden.",
  },
  {
    flow: "FLOW-05",
    kind: "Entlastung",
    title: "Entlastung im Alltag",
    body:
      "Weniger manuelle Schritte, weniger doppelte Arbeit, weniger Reibung in operativen Abläufen.",
  },
  {
    flow: "FLOW-06",
    kind: "Struktur",
    title: "Skalierbare Strukturen",
    body:
      "Lösungen, die nicht nur kurzfristig helfen, sondern mit Prozessen und Unternehmen mitwachsen können.",
  },
];

/**
 * Audience cases are mapped to a flow-stage — Eingang, Logik, Brücke,
 * Übergabe, Ausgabe, KI — so the list reads as a real signal path,
 * not a generic bullet list. Reinforces the "mesh / flow" vocabulary.
 */
const AUDIENCE: { text: string; stage: string }[] = [
  { text: "Daten zwischen mehreren Tools automatisch übertragen willst", stage: "Brücke" },
  { text: "interne Abläufe beschleunigen möchtest", stage: "Logik" },
  { text: "KI sinnvoll in bestehende Prozesse integrieren willst", stage: "KI" },
  { text: "manuelle Zwischenschritte reduzieren musst", stage: "Übergabe" },
  { text: "wiederkehrende Aufgaben automatisieren willst", stage: "Eingang" },
  { text: "Systeme sauber miteinander verbinden möchtest", stage: "Ausgabe" },
];

/* ------------------------------------------------------------------
 * FlowMesh — three input tokens → central KI hub → three output tokens.
 *
 * SVG stays crisp at any width. Connectors carry a slow `stroke-dashoffset`
 * signal pulse (pure CSS, reduced-motion-aware) — a restrained visual cue
 * for "something is actually flowing" without a cheap glow effect.
 *
 * Nodes use the same hairline / corner-hint vocabulary as the rest of
 * the site (mono labels, serif title, monospace index) to stay in the
 * MAGICKS system instead of reading like a stock ERD diagram.
 * ------------------------------------------------------------------ */
function FlowMesh() {
  const inputs: { label: string; kind: string; idx: string }[] = [
    { label: "Signal", kind: "SYS", idx: "IN.01" },
    { label: "Daten", kind: "DATA", idx: "IN.02" },
    { label: "API", kind: "SRC", idx: "IN.03" },
  ];
  const outputs: { label: string; kind: string; idx: string }[] = [
    { label: "Team", kind: "OUT", idx: "OUT.01" },
    { label: "System", kind: "OUT", idx: "OUT.02" },
    { label: "Log", kind: "OUT", idx: "OUT.03" },
  ];

  return (
    <div aria-hidden className="w-full max-w-[48rem]">
      <div className="relative">
        {/* SVG connector layer — sits behind the nodes */}
        <svg
          viewBox="0 0 600 220"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="mesh-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.42)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
            </linearGradient>
          </defs>

          {/* Converging — three inputs → center hub */}
          {[44, 110, 176].map((y, i) => (
            <path
              key={`in-${i}`}
              d={`M 128 ${y} C 230 ${y}, 260 110, 300 110`}
              stroke="url(#mesh-line)"
              strokeWidth="1"
              fill="none"
              data-ki-wire
            />
          ))}

          {/* Diverging — center hub → three outputs */}
          {[44, 110, 176].map((y, i) => (
            <path
              key={`out-${i}`}
              d={`M 300 110 C 340 110, 370 ${y}, 472 ${y}`}
              stroke="url(#mesh-line)"
              strokeWidth="1"
              fill="none"
              data-ki-wire
            />
          ))}
        </svg>

        <div className="relative grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)] items-stretch gap-8 sm:gap-10 md:gap-14">
          {/* Inputs column */}
          <div className="flex flex-col gap-3">
            {inputs.map((node) => (
              <div
                key={node.idx}
                data-ki-node
                className="relative flex flex-col gap-2 border border-white/[0.14] bg-[#0A0A0A] px-3 py-2.5 sm:px-3.5 sm:py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.3em] text-white/44 sm:text-[9.5px]">
                    {node.kind}
                  </span>
                  <span className="font-mono tabular-nums text-[8.5px] font-medium uppercase leading-none tracking-[0.3em] text-white/30 sm:text-[9px]">
                    {node.idx}
                  </span>
                </div>
                <span className="font-instrument text-[0.98rem] leading-none tracking-[-0.01em] text-white/92 sm:text-[1.05rem] md:text-[1.12rem]">
                  {node.label}
                </span>

                {/* Corner hints */}
                <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-1 w-1 border-l border-t border-white/30" />
                <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-1 w-1 border-b border-r border-white/30" />
              </div>
            ))}
          </div>

          {/* Central KI hub — emphasized */}
          <div
            data-ki-hub
            className="relative flex flex-col items-center justify-center gap-3 border border-white/[0.24] bg-[#0C0C0D] px-4 py-6 sm:px-5 sm:py-8"
          >
            <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.36em] text-white/50 sm:text-[9.5px]">
              Core · Hub
            </span>
            <span className="font-instrument text-[1.5rem] leading-none tracking-[-0.02em] text-white sm:text-[1.72rem] md:text-[1.92rem]">
              KI
            </span>
            <span className="font-mono tabular-nums text-[9px] font-medium uppercase leading-none tracking-[0.3em] text-white/40 sm:text-[9.5px]">
              01 · Logik
            </span>
            <span className="tick-breathing pointer-events-none absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-white/85" />

            {/* Corner crop marks — 4 corners for the hub */}
            <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-1.5 w-1.5 border-l border-t border-white/50" />
            <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-1.5 w-1.5 border-r border-t border-white/50" />
            <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l border-white/50" />
            <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-white/50" />
          </div>

          {/* Outputs column */}
          <div className="flex flex-col gap-3">
            {outputs.map((node) => (
              <div
                key={node.idx}
                data-ki-node
                className="relative flex flex-col gap-2 border border-white/[0.14] bg-[#0A0A0A] px-3 py-2.5 sm:px-3.5 sm:py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.3em] text-white/44 sm:text-[9.5px]">
                    {node.kind}
                  </span>
                  <span className="font-mono tabular-nums text-[8.5px] font-medium uppercase leading-none tracking-[0.3em] text-white/30 sm:text-[9px]">
                    {node.idx}
                  </span>
                </div>
                <span className="font-instrument text-[0.98rem] leading-none tracking-[-0.01em] text-white/92 sm:text-[1.05rem] md:text-[1.12rem]">
                  {node.label}
                </span>

                <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-1 w-1 border-l border-t border-white/30" />
                <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-1 w-1 border-b border-r border-white/30" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mesh footer */}
      <div className="font-mono mt-4 flex items-start justify-between text-[9px] font-medium uppercase leading-none tracking-[0.28em] text-white/30 sm:text-[9.5px]">
        <span>03 Eingänge</span>
        <span className="text-white/46">Flussdiagramm · 7 Knoten</span>
        <span>03 Ausgänge</span>
      </div>
    </div>
  );
}

export default function KiAutomationenPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      // ——— Hero elements ———
      const heroChapter = root.querySelector<HTMLElement>("[data-ki-chapter]");
      const heroLineA = gsap.utils.toArray<HTMLElement>("[data-ki-h1a]");
      const heroLineB = gsap.utils.toArray<HTMLElement>("[data-ki-h1b]");
      const heroH1 = root.querySelector<HTMLElement>("[data-ki-h1]");
      const heroLead = root.querySelector<HTMLElement>("[data-ki-lead]");
      const heroCta = root.querySelector<HTMLElement>("[data-ki-cta]");
      const heroCtaRule = root.querySelector<HTMLElement>("[data-ki-cta-rule]");
      const heroMeta = gsap.utils.toArray<HTMLElement>("[data-ki-meta]");
      const heroMesh = root.querySelector<HTMLElement>("[data-ki-mesh]");
      const heroNodes = gsap.utils.toArray<HTMLElement>("[data-ki-node]");
      const heroHub = root.querySelector<HTMLElement>("[data-ki-hub]");
      const heroWires = gsap.utils.toArray<SVGPathElement>("[data-ki-wire]");
      const heroCredit = root.querySelector<HTMLElement>("[data-ki-credit]");
      const heroSection = root.querySelector<HTMLElement>("[data-ki-hero]");
      const heroCopy = root.querySelector<HTMLElement>("[data-ki-herocopy]");

      // ——— Scroll reveals ———
      const reveals = gsap.utils.toArray<HTMLElement>("[data-ki-reveal]");
      const pullLines = gsap.utils.toArray<HTMLElement>("[data-ki-pull]");
      const pullHeading = root.querySelector<HTMLElement>("[data-ki-pullheading]");
      const finalLineA = gsap.utils.toArray<HTMLElement>("[data-ki-finala]");
      const finalLineB = gsap.utils.toArray<HTMLElement>("[data-ki-finalb]");
      const finalRule = root.querySelector<HTMLElement>("[data-ki-finalrule]");
      const finalLedger = gsap.utils.toArray<HTMLElement>("[data-ki-finalledger]");
      const finalCta = root.querySelector<HTMLElement>("[data-ki-finalcta]");

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
            heroMesh,
            ...heroNodes,
            heroHub,
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
        // Reset SVG dash state on reduced motion
        heroWires.forEach((w) => {
          try {
            const length = w.getTotalLength();
            gsap.set(w, { strokeDasharray: length, strokeDashoffset: 0 });
          } catch {
            // Path length not available — leave as-is
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
      gsap.set(heroMesh, { opacity: 0, scale: 0.985, transformOrigin: "50% 50%" });
      gsap.set(heroNodes, { opacity: 0, y: 10 });
      gsap.set(heroHub, { opacity: 0, scale: 0.94 });
      gsap.set(heroCredit, { opacity: 0, y: 8 });

      // Wires draw in from start to end (converging), then out (diverging)
      heroWires.forEach((w) => {
        try {
          const length = w.getTotalLength();
          gsap.set(w, { strokeDasharray: length, strokeDashoffset: length });
        } catch {
          // Path length not available — leave as-is
        }
      });

      const tl = gsap
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
        .to(heroMesh, { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, 1.75)
        // Inputs and outputs arrive in a staggered sweep, hub settles last
        .to(
          heroNodes,
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.14,
            ease: "power3.out",
          },
          1.85,
        )
        .to(
          heroHub,
          { opacity: 1, scale: 1, duration: 0.95, ease: "back.out(1.4)" },
          2.12,
        )
        .to(heroCredit, { opacity: 1, y: 0, duration: 1.0 }, 2.35);

      // Wires — converging lines draw first (0-2), diverging (3-5) next
      if (heroWires.length >= 6) {
        tl.to(
          [heroWires[0], heroWires[1], heroWires[2]],
          {
            strokeDashoffset: 0,
            duration: 0.95,
            stagger: 0.1,
            ease: "power2.inOut",
          },
          1.95,
        ).to(
          [heroWires[3], heroWires[4], heroWires[5]],
          {
            strokeDashoffset: 0,
            duration: 0.95,
            stagger: 0.1,
            ease: "power2.inOut",
          },
          2.3,
        );
      }

      // Slow looping signal pulse — travels along wires indefinitely.
      // 7.8s cycle (was 6.2s) reads as more considered, more premium,
      // less "dashboard loader" and more "system breathing."
      const pulseStart = 3.0;
      heroWires.forEach((w, i) => {
        try {
          const length = w.getTotalLength();
          gsap.to(w, {
            strokeDashoffset: `-=${length * 2}`,
            duration: 7.8,
            ease: "none",
            repeat: -1,
            delay: pulseStart + i * 0.18,
            modifiers: {
              strokeDashoffset: (val) => {
                // Keep value bounded — dash pattern stays stable
                return `${parseFloat(val) % (length * 2)}`;
              },
            },
          });
        } catch {
          // Skip pulse on unsupported browsers
        }
      });

      // ——— Hero camera push — scroll-linked drift ———
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
        const ptl = gsap
          .timeline({
            scrollTrigger: { trigger: pullLines[0], start: "top 78%", once: true },
          })
          .to(pullLines, {
            yPercent: 0,
            opacity: 1,
            duration: 1.45,
            ease: "power4.out",
            stagger: 0.14,
          });
        if (pullHeading) {
          ptl.to(
            pullHeading,
            { letterSpacing: "-0.038em", duration: 1.75, ease: "power2.out" },
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
      <RouteSEO path="/ki-automationen-integrationen" />

      <main
        ref={rootRef}
        className="relative bg-[#0A0A0A] pb-0 pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.5rem]"
      >
        {/* =========================================================
           HERO — connected-flow energy
        ========================================================= */}
        <section
          data-ki-hero
          className="relative overflow-hidden px-5 pb-28 sm:px-8 sm:pb-32 md:px-12 md:pb-44 lg:px-16 lg:pb-52"
        >
          {/* Network texture — hairline lines + subtle dot grid.
              Reads as "signal / network", distinct from Web-Software's
              uniform dot grid and Shops' horizontal lines. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.3]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(255,255,255,0.014) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.16) 0.8px, transparent 0.8px)",
              backgroundSize: "96px 96px, 40px 40px",
              maskImage:
                "radial-gradient(ellipse 60% 66% at 28% 54%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 66% at 28% 54%, black, transparent)",
            }}
          />

          {/* Vertical editorial credit */}
          <div
            data-ki-credit
            aria-hidden
            className="pointer-events-none absolute bottom-14 left-5 z-10 hidden md:block lg:bottom-16 lg:left-8"
          >
            <span className="hero-vertical-credit">
              MAGICKS &nbsp;·&nbsp; LEISTUNG 05 &nbsp;·&nbsp; KI &amp; AUTOMATIONEN &nbsp;·&nbsp; PROTOCOL MMXXVI
            </span>
          </div>

          <div className="relative layout-max">
            <div data-ki-herocopy>
              <div data-ki-chapter className="mb-10 sm:mb-14">
                <ChapterMarker num="05" label="Leistungen / KI &amp; Automationen" />
              </div>

              {/* H1 */}
              <h1
                data-ki-h1
                className="font-instrument max-w-[60rem] text-[2.3rem] leading-[0.98] tracking-[-0.038em] text-white sm:text-[3rem] md:text-[3.85rem] lg:text-[4.55rem] xl:text-[5.1rem]"
              >
                <span className="block">
                  {["KI-Automationen", "&", "Integrationen,"].map((w, i) => (
                    <span
                      key={`a-${i}`}
                      className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-ki-h1a className="inline-block will-change-[transform,opacity]">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/64 sm:mt-2">
                  {["die", "Arbeit", "spürbar", "entlasten."].map((w, i) => (
                    <span
                      key={`b-${i}`}
                      className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-ki-h1b className="inline-block will-change-[transform,opacity]">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              </h1>

              {/* Intro */}
              <div data-ki-lead className="mt-10 max-w-[46rem] sm:mt-12 md:mt-14">
                <p className="font-instrument text-[1.3rem] italic leading-[1.35] tracking-[-0.01em] text-white/82 sm:text-[1.5rem] md:text-[1.65rem]">
                  Viele digitale Prozesse scheitern nicht an fehlenden Tools, sondern daran, dass
                  Systeme nicht sauber zusammenspielen und zu viel noch manuell läuft.
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/58 md:text-[16px] md:leading-[1.72]">
                  Genau hier setzen wir an.
                </p>
                <p className="font-ui mt-3 text-[15px] leading-[1.72] text-white/58 md:text-[16px] md:leading-[1.72]">
                  Wir entwickeln KI-Automationen und Integrationen, die{" "}
                  <em className="italic text-white/86">
                    Abläufe verbinden, manuelle Arbeit reduzieren
                  </em>{" "}
                  und dafür sorgen, dass Informationen dort landen, wo sie gebraucht werden.
                </p>
              </div>

              {/* CTA */}
              <div
                data-ki-cta
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
                      data-ki-cta-rule
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

              {/*
               * Meta triad — rendered as a visible flow chain.
               * The three concepts are no longer three disconnected tags:
               * a thin connector arrow between them makes the sequence
               * literal — Signal → Logik → Ausgabe — which telegraphs
               * the entire page premise in a single glance.
               */}
              <div className="mt-14 flex flex-wrap items-center gap-x-4 gap-y-3 sm:mt-18 md:mt-20">
                {["Signal", "Logik", "Ausgabe"].map((m, i) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-3"
                  >
                    <span
                      data-ki-meta
                      className="font-mono flex items-center gap-3 text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/52 sm:text-[10.5px]"
                    >
                      <span className="tabular-nums text-white/34">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {m}
                    </span>
                    {i < 2 && (
                      <span
                        aria-hidden
                        data-ki-meta
                        className="inline-flex items-center gap-1.5 text-white/30"
                      >
                        <span className="block h-px w-5 bg-white/26 sm:w-8" />
                        <span className="font-mono text-[10px] leading-none">→</span>
                      </span>
                    )}
                  </span>
                ))}
              </div>

              {/*
               * FlowMesh — the signature motif.
               * Header uses a three-field folio row (prefix · centered
               * title · right spec) that mirrors a real protocol diagram
               * caption rather than two floating labels.
               */}
              <div
                data-ki-mesh
                className="mt-16 flex flex-col gap-3 sm:mt-20 md:mt-24"
              >
                <div className="font-mono grid grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)] items-center gap-5 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/38 sm:text-[10.5px]">
                  <span>Fig. 01 · Flussdiagramm</span>
                  <span aria-hidden className="h-px w-full bg-white/14" />
                  <span className="tabular-nums text-white/32">03 IN · 01 HUB · 03 OUT</span>
                </div>
                <FlowMesh />
              </div>
            </div>
          </div>

          {/*
           * Specimen readout — protocol vocabulary + live signal
           * indicator. The breathing tick borrowed from the hub reads
           * as "the system is awake" without tipping into dashboard
           * cheapness.
           */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-6 right-5 hidden items-center gap-4 md:right-12 md:flex lg:right-16 lg:bottom-10"
          >
            <span className="font-mono flex items-center gap-2 text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/36">
              <span className="tick-breathing block h-1.5 w-1.5 rounded-full bg-white/75" />
              Signal · Live
            </span>
            <span aria-hidden className="h-px w-8 bg-white/18" />
            <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/34">
              Protocol · Leistung 05
            </span>
            <span aria-hidden className="h-px w-10 bg-white/18" />
            <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.26em] text-white/34">
              IN — LOGIK — KI — OUT
            </span>
          </div>
        </section>

        {/* Transition → § 01 Bruch */}
        <SectionTransition from="§ Hero — Leistungen 05" to="§ 01  Bruch" />

        {/* =========================================================
           STATEMENT 01 — "Wenn Systeme nicht zusammenspielen"
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-20 lg:gap-24">
              <div data-ki-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 01 — Bruch
                </p>
                <h2 className="font-instrument text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]">
                  Wenn Systeme nicht zusammenspielen, wird es{" "}
                  <em className="italic text-white/58">unnötig aufwendig.</em>
                </h2>

                {/* Forward cross-ref */}
                <div data-ki-reveal className="mt-10 flex items-center gap-4 md:mt-14">
                  <span aria-hidden className="h-px w-10 bg-white/22 md:w-14" />
                  <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    → Siehe § 04 Herangehen
                  </span>
                </div>
              </div>

              <div data-ki-reveal className="md:pt-3">
                <p className="font-ui text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  In vielen Unternehmen entstehen Reibung, Zeitverlust und Fehler nicht, weil gar
                  keine Tools vorhanden sind, sondern weil sie isoliert nebeneinander laufen.
                </p>
                <p className="font-ui mt-5 text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Daten werden doppelt gepflegt, Informationen manuell übertragen und{" "}
                  <em className="italic text-white/88">Prozesse hängen an einzelnen Personen.</em>
                </p>
                <p className="font-ui mt-6 text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Wir entwickeln Automationen und Integrationen, die genau diese Brüche schließen.
                  So entstehen Abläufe, die sauberer, schneller und verlässlicher funktionieren.
                </p>
              </div>
            </div>

            {/* First editorial anchor — a restrained workflow-canvas scene.
                Three clean nodes (Formular · Logik · CRM) with a single
                travelling pulse. A quiet, operational picture — not a
                sci-fi AI visual. */}
            <div className="mt-20 sm:mt-24 md:mt-28">
              <EditorialAnchor
                src="/media/services/ki-automation/hero-canvas.webp"
                alt="Laptop auf dunklem Studiotisch mit einer Workflow-Canvas in dunklem UI: drei verbundene Knoten Formular, Logik und CRM, dünne Hairline-Verbindungslinien mit einem wandernden Signal-Punkt, Header ‚Lead-Eingang · v3 · Aktiv‘."
                folio="Hop 01"
                context="Ablauf"
                leftCaption="Lead-Eingang · Canvas"
                rightCaption="Formular → Logik → CRM"
                aspect="16/9"
                align="right"
                maxWidth="46rem"
                revealAttr="data-ki-reveal"
              />
            </div>
          </div>
        </section>

        {/* Transition → § 02 Zielbild */}
        <SectionTransition from="§ 01  Bruch" to="§ 02  Zielbild" />

        {/* =========================================================
           AUDIENCE — "Für Unternehmen, die weniger manuell arbeiten wollen"
           Each case is routed to a flow-stage — reads as a signal path.
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-ki-reveal className="md:pt-2">
                <ChapterMarker num="02" label="Zielbild" />
              </div>

              <div>
                <h2
                  data-ki-reveal
                  className="font-instrument max-w-[48rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Für Unternehmen, die{" "}
                  <em className="italic text-white/58">
                    weniger manuell arbeiten
                  </em>{" "}
                  wollen.
                </h2>

                <p
                  data-ki-reveal
                  className="font-ui mt-8 max-w-xl text-[15px] leading-[1.7] text-white/56 md:mt-10 md:text-[15.5px]"
                >
                  Diese Leistung ist für Unternehmen, die wiederkehrende Aufgaben reduzieren,
                  Prozesse intelligenter verbinden und digitale Abläufe sauberer organisieren
                  wollen.
                </p>

                <p
                  data-ki-reveal
                  className="font-instrument mt-10 text-[1.18rem] italic leading-[1.4] tracking-[-0.01em] text-white/72 md:text-[1.32rem]"
                >
                  Zum Beispiel, wenn du:
                </p>

                {/*
                 * Flow-stage routing table — each row routes to a coded
                 * flow-stage (FL-01 … FL-06) plus its human label. The
                 * technical FL-NN prefix reads as a real protocol
                 * signal-path, with the italicized serif stage name
                 * keeping the row legible and premium.
                 */}
                <ul className="mt-10 space-y-0 border-t border-white/[0.07] md:mt-14">
                  {AUDIENCE.map((item, i) => (
                    <li
                      key={item.text}
                      data-ki-reveal
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
                          FL-{String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-instrument text-[0.95rem] italic leading-none tracking-[-0.005em] text-white/68 md:text-[1.02rem]">
                          {item.stage}
                        </span>
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
           Flussregister — each row is a taxonomy entry addressed by
           FLOW-NN and stage chip. Reads as a protocol document.
        ========================================================= */}
        <section className="relative px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-ki-reveal className="md:pt-2">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                    § 03 — Umfang
                  </p>
                  <span
                    aria-hidden
                    className="font-mono tabular-nums text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-white/34 sm:text-[10.5px]"
                  >
                    Flussregister · 06 Stufen
                  </span>
                </div>
              </div>

              <div>
                <h2
                  data-ki-reveal
                  className="font-instrument max-w-[48rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Was wir für dich <em className="italic text-white/58">umsetzen</em>.
                </h2>

                <ol className="mt-14 grid gap-x-14 gap-y-0 border-t border-white/[0.06] md:mt-20 md:grid-cols-2">
                  {INCLUDES.map((item, i) => (
                    <li
                      key={item.title}
                      data-ki-reveal
                      className="relative grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 border-b border-white/[0.06] py-8 sm:gap-x-8 md:py-10"
                    >
                      <span className="font-mono pt-[0.4rem] text-[10.5px] font-medium leading-none tracking-[0.28em] text-white/52 md:text-[11.5px]">
                        {item.flow}
                      </span>
                      <div>
                        {/*
                         * Row chip — kind on the left, protocol hop counter
                         * on the right. "Hop NN / 06" reads as a real
                         * protocol addressing scheme and replaces the
                         * generic "stage" placeholder with something
                         * operationally meaningful.
                         */}
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/50 md:text-[10.5px]">
                            {item.kind}
                          </span>
                          <span aria-hidden className="h-px w-3 bg-white/18 md:w-5" />
                          <span className="font-mono tabular-nums text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:text-[9.5px]">
                            Hop · {String(i + 1).padStart(2, "0")} / {String(INCLUDES.length).padStart(2, "0")}
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

                {/* Register footer — protocol signature */}
                <div
                  data-ki-reveal
                  className="font-mono mt-6 flex items-center justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/32 md:mt-8"
                >
                  <span>Register · Flussstufen</span>
                  <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                  <span className="tabular-nums">Protocol 05 · MMXXVI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → § 04 Herangehen */}
        <SectionTransition from="§ 03  Umfang" to="§ 04  Herangehen" />

        {/* =========================================================
           APPROACH — "Wie wir KI und Automationen denken"
        ========================================================= */}
        <section className="relative bg-[#09090A] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16">
          <div className="layout-max">
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-20 lg:gap-28">
              <div data-ki-reveal>
                <p className="font-mono mb-8 text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 04 — Herangehen
                </p>
                <h2 className="font-instrument text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]">
                  Wie wir KI und Automationen{" "}
                  <em className="italic text-white/58">denken</em>.
                </h2>
              </div>

              <div data-ki-reveal className="md:pt-3">
                <p className="font-ui text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Wir automatisieren nicht blind, nur weil es technisch möglich ist.
                </p>

                <p className="font-ui mt-5 text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Wir schauen zuerst auf{" "}
                  <em className="italic text-white/88">
                    Prozess, Nutzen und Reibung
                  </em>
                  :
                </p>

                {/* Three diagnostic questions — hairline bordered left */}
                <div className="mt-8 flex flex-col gap-4 border-l border-white/[0.12] pl-6 md:mt-10 md:pl-8">
                  <p className="font-instrument text-[1.2rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 md:text-[1.4rem] lg:text-[1.55rem]">
                    Wo geht Zeit verloren?
                  </p>
                  <p className="font-instrument text-[1.2rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 md:text-[1.4rem] lg:text-[1.55rem]">
                    Wo entstehen Fehler?
                  </p>
                  <p className="font-instrument text-[1.2rem] italic leading-[1.4] tracking-[-0.012em] text-white/90 md:text-[1.4rem] lg:text-[1.55rem]">
                    Wo wiederholt sich Arbeit unnötig?
                  </p>
                </div>

                <p className="font-ui mt-10 text-[15px] leading-[1.72] text-white/62 md:text-[16px] md:leading-[1.72]">
                  Darauf bauen wir eine Lösung, die{" "}
                  <em className="italic text-white/88">
                    sinnvoll integriert ist, verständlich bleibt und im Alltag wirklich entlastet.
                  </em>
                </p>
                <p className="font-ui mt-5 text-[15px] leading-[1.72] text-white/60 md:text-[16px] md:leading-[1.72]">
                  Nicht als Tech-Spielerei, sondern als funktionierender Teil eines sauberen
                  Systems.
                </p>
              </div>
            </div>

            {/* Second editorial anchor — a single handoff moment in detail.
                Form entry on the left, CRM record on the right, with a
                measured "Validierung ✓ — 218 ms" indicator between them.
                Shows "funktionierender Teil eines sauberen Systems" as a
                concrete picture, not as a claim. */}
            <div className="mt-20 sm:mt-24 md:mt-28">
              <EditorialAnchor
                src="/media/services/ki-automation/detail-handoff.webp"
                alt="Enger Ausschnitt eines Automations-Handoffs: links eine Formular-Karte mit Name, Unternehmen, Anfrage und Budget, rechts ein daraus erzeugter CRM-Datensatz mit Kontakt, Firma, Projekt, Quelle Webformular und Status Neu, dazwischen ein Indikator ‚Validierung ✓ — 218 ms‘."
                folio="Hop 02"
                context="Übergabe"
                leftCaption="Formular → CRM"
                rightCaption="Validierung · 218 ms"
                aspect="16/9"
                align="left"
                maxWidth="48rem"
                revealAttr="data-ki-reveal"
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
                "radial-gradient(ellipse 55% 42% at 50% 50%, rgba(255,255,255,0.03), transparent 62%)",
            }}
          />

          <div className="relative layout-max">
            <div className="grid gap-16 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20 lg:gap-28">
              <div data-ki-reveal className="md:pt-2">
                <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/46 sm:text-[10.5px]">
                  § 05 — Absage
                </p>
              </div>

              <div>
                <h2
                  data-ki-reveal
                  className="font-instrument max-w-[48rem] text-[2.05rem] leading-[1.03] tracking-[-0.03em] text-white sm:text-[2.65rem] md:text-[3.2rem] lg:text-[3.6rem]"
                >
                  Was du von uns{" "}
                  <em className="italic text-white/58">nicht bekommst</em>.
                </h2>

                <ul className="mt-14 space-y-8 md:mt-20 md:space-y-10">
                  {[
                    "Keine Automation um der Automation willen.",
                    "Keinen KI-Hype ohne echten Nutzen.",
                    "Keine Integration, die technisch existiert, aber operativ niemandem hilft.",
                  ].map((line) => (
                    <li
                      key={line}
                      data-ki-reveal
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
                  data-ki-reveal
                  className="font-ui mt-16 max-w-[42rem] text-[15.5px] leading-[1.72] text-white/62 md:mt-20 md:text-[16.5px]"
                >
                  Was du bekommst, sind digitale Abläufe mit{" "}
                  <em className="italic text-white/92">
                    Klarheit, Struktur und echter Entlastung.
                  </em>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transition → Positionierung (darker) */}
        <SectionTransition from="§ 05  Absage" to="§ Positionierung" tone="darker" />

        {/* =========================================================
           CEREMONIAL PULL-STATEMENT — three-line declaration
           IN → LOGIK → OUT coordinate column in the left gutter.
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
          {/* Network texture — hairline stripes + dot grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(255,255,255,0.12) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.14) 0.8px, transparent 0.8px)",
              backgroundSize: "64px 64px, 32px 32px",
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
                 * Flow-stage gutter — ceremonial labels threaded by a
                 * vertical hairline so IN → LOGIK → OUT reads as a real
                 * signal rail on the page's left edge, not three
                 * detached tags. Small cross-ticks mark each station.
                 */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-10 top-0 hidden h-full flex-col justify-between py-[0.4em] md:-left-12 md:flex lg:-left-16"
                >
                  <span aria-hidden className="absolute left-[3px] top-[0.5em] bottom-[0.5em] w-px bg-white/14" />
                  {["IN", "LOGIK", "OUT"].map((letter) => (
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
                  data-ki-pullheading
                  className="font-instrument text-[2.4rem] leading-[1.02] tracking-[-0.038em] text-white sm:text-[3.3rem] md:text-[4.2rem] lg:text-[4.9rem] xl:text-[5.5rem]"
                >
                  <span className="block overflow-hidden">
                    <span data-ki-pull className="inline-block">
                      Weniger manuell.
                    </span>
                  </span>
                  <span className="block overflow-hidden">
                    <span data-ki-pull className="inline-block italic text-white/64">
                      Mehr verbunden.
                    </span>
                  </span>
                  <span className="block overflow-hidden">
                    <span data-ki-pull className="inline-block">
                      Sauber automatisiert.
                    </span>
                  </span>
                </h3>
              </div>

              <div className="mt-16 flex items-center gap-5 sm:mt-20">
                <span aria-hidden className="h-px flex-1 bg-white/12" />
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 sm:text-[10.5px]">
                  Edition · Positionierung 05
                </span>
                <span aria-hidden className="h-px w-14 bg-white/24 sm:w-24" />
              </div>
            </div>
          </div>
        </section>

        {/*
         * ========================================================
         * CONTEXTUAL CROSS-LINKS — two stacked gates.
         *
         * First gate: "Fundament" toward the platform discipline.
         * Second gate: "Spezial" toward the 3D configurator landing.
         * Reads as two continuations rather than isolated suggestions.
         * ========================================================
         */}
        <section className="relative px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16 lg:py-28">
          <div className="layout-max space-y-14 sm:space-y-16 md:space-y-20">
            <div data-ki-reveal>
              <ContextualCrossLink
                eyebrow="Fundament"
                folio="Plate 04 · Web-Software"
                lead="Wenn dein Projekt eher eine individuelle Plattform, ein Portal oder ein internes Tool braucht, schau dir auch unsere Web-Software an."
                linkLabel="Web-Software ansehen"
                to="/web-software"
              />
            </div>

            <div data-ki-reveal>
              <ContextualCrossLink
                eyebrow="Spezial"
                folio="Specimen · 3D Konfigurator"
                lead="Wenn du digitale Nutzerführung und Konfiguration mit intelligenter Prozesslogik verbinden willst, wirf auch einen Blick auf Produktkonfiguratoren."
                linkLabel="Produktkonfiguratoren ansehen"
                to="/produktkonfigurator-erstellen"
              />
            </div>
          </div>
        </section>

        {/* =========================================================
           FINAL CTA — protocol plate composition.
           4-field colophon reads as a protocol signature rather than
           a product back-cover (Shops) or blueprint cartouche (WS).
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#070708] px-5 pb-32 pt-32 sm:px-8 sm:pb-40 sm:pt-40 md:px-12 md:pb-48 md:pt-48 lg:px-16 lg:pt-56">
          <div aria-hidden className="section-top-rule" />

          {/* Protocol plate corner crop marks — flow stages at corners
              (IN · NW / LOG · NE / SRC · SW / OUT · SE). Mirrors WS's
              blueprint A/B/C/D corners but threads the flow vocabulary. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-5 hidden md:inset-8 md:block lg:inset-10"
          >
            <span className="absolute left-0 top-0 block h-3 w-3 border-l border-t border-white/28" />
            <span className="font-mono absolute left-5 top-1 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              IN · NW
            </span>
            <span className="absolute right-0 top-0 block h-3 w-3 border-r border-t border-white/28" />
            <span className="font-mono absolute right-5 top-1 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              LOG · NE
            </span>
            <span className="absolute bottom-0 left-0 block h-3 w-3 border-b border-l border-white/28" />
            <span className="font-mono absolute bottom-1 left-5 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              SRC · SW
            </span>
            <span className="absolute bottom-0 right-0 block h-3 w-3 border-b border-r border-white/28" />
            <span className="font-mono absolute bottom-1 right-5 text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-white/34 sm:text-[9.5px]">
              OUT · SE
            </span>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[46%] aspect-square w-[118vw] max-w-[1180px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.014) 32%, transparent 62%)",
            }}
          />
          {/* Network texture behind CTA */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.14) 0.8px, transparent 0.8px)",
              backgroundSize: "80px 80px, 40px 40px",
              maskImage: "radial-gradient(ellipse 72% 62% at 50% 46%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[66rem] text-center">
              <div className="mb-14 inline-flex sm:mb-20">
                <ChapterMarker num="END" label="Projekt" align="center" variant="end" />
              </div>

              <h2 className="font-instrument text-[2.4rem] leading-[0.98] tracking-[-0.038em] text-white sm:text-[3.3rem] md:text-[4.4rem] lg:text-[5.4rem] xl:text-[6.2rem]">
                <span className="block">
                  {["Bereit", "für", "Prozesse,"].map((w, i) => (
                    <span
                      key={`fa-${i}`}
                      className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-ki-finala className="inline-block">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="mt-1 block italic text-white/76 sm:mt-2">
                  {["die", "nicht", "mehr", "unnötig", "aufhalten?"].map((w, i) => (
                    <span
                      key={`fb-${i}`}
                      className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                    >
                      <span data-ki-finalb className="inline-block">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              </h2>

              {/* Editorial rule */}
              <div className="mx-auto mt-12 flex w-full max-w-[42rem] items-center gap-4 sm:mt-16">
                <span aria-hidden className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40">
                  ·
                </span>
                <div aria-hidden className="relative h-px flex-1">
                  <span
                    data-ki-finalrule
                    className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  />
                </div>
                <span aria-hidden className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40">
                  ·
                </span>
              </div>

              <p className="font-ui mx-auto mt-10 max-w-[42rem] text-[15px] leading-[1.72] text-white/60 md:mt-12 md:text-[16.5px]">
                Wir entwickeln KI-Automationen und Integrationen, die Abläufe vereinfachen, Systeme
                verbinden und Teams im Alltag spürbar entlasten.
              </p>

              {/* Ledger block — protocol-flavored session metadata */}
              <div className="mt-14 grid items-center gap-10 text-left sm:mt-18 sm:grid-cols-[auto_1fr] sm:gap-14 md:gap-20">
                <div data-ki-finalcta className="flex justify-center sm:justify-start">
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
                  <div data-ki-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Projekt
                    </span>
                    <span className="font-instrument text-[1.2rem] italic leading-[1.3] text-white/90 sm:text-[1.4rem] md:text-[1.5rem]">
                      Automation · Integration · KI-Workflow
                    </span>
                  </div>

                  <div data-ki-finalledger className="flex flex-col gap-1.5">
                    <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                      Flow
                    </span>
                    <span className="font-ui text-[13.5px] leading-[1.5] text-white/62 sm:text-[14.5px]">
                      Eingänge, Logik und Ausgänge — geplant, bevor gebaut wird.
                    </span>
                  </div>

                  <div data-ki-finalledger className="flex flex-col gap-1.5">
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

            {/* Protocol plate — 4-field signature */}
            <div className="mt-24 border-t border-white/[0.06] pt-7 sm:mt-28">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-0">
                {[
                  { k: "§ End", v: "Leistungen 05" },
                  { k: "Protocol", v: "05 · KI & Automationen" },
                  { k: "Flow", v: "Eingang → Logik → Ausgang" },
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
