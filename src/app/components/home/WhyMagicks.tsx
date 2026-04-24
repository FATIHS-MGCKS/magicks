import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  atmosphericField,
  focusEnvelope,
  horizontalDrift,
  parallaxDrift,
  presenceEnvelope,
  sectionFarewell,
} from "../../lib/scrollMotion";
import { ChapterMarker } from "./ChapterMarker";

/**
 * Statements are set in giant Instrument Serif — each on its own line pair.
 * Numerals hang in the left margin as superscript italics. Marginalia
 * lives in a narrow right column in monospace, like footnotes in print.
 *
 * Motion is entirely atmospheric + bidirectional: the depth layers drift
 * slowly as the user scrolls, each principle gains and then releases
 * presence as it passes through the focus zone, and the typography never
 * stops being the hero.
 */
const PRINCIPLES: {
  sup: string;
  line1: string;
  line2?: string;
  tone: "strong" | "hush";
  note: string;
}[] = [
  {
    sup: "01",
    line1: "Keine Umwege.",
    line2: "Wir bauen direkt.",
    tone: "strong",
    note:
      "Sie sprechen mit den Menschen, die bauen. Keine Projektleitung, die Mails weiterreicht.",
  },
  {
    sup: "02",
    line1: "Design und Code",
    line2: "aus einer Hand.",
    tone: "hush",
    note:
      "Markengefühl und Umsetzung auf einer Linie — kein Verlust zwischen Kreativ und Entwicklung.",
  },
  {
    sup: "03",
    line1: "Automation als",
    line2: "Verantwortung.",
    tone: "strong",
    note:
      "Wir automatisieren dort, wo die Entlastung nachweisbar ist — mit Regeln, die Ihr Team versteht.",
  },
  {
    sup: "04",
    line1: "Jede Entscheidung",
    line2: "nachvollziehbar.",
    tone: "hush",
    note:
      "Kein Blackbox-Effekt. Alles dokumentiert, messbar, übergabefähig — auch ohne uns.",
  },
];

export function WhyMagicks() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const chapter = root.querySelector<HTMLElement>("[data-why-chapter]");
      const intro = root.querySelector<HTMLElement>("[data-why-intro]");
      const rows = gsap.utils.toArray<HTMLElement>("[data-why-row]");
      const atmos01 = root.querySelector<HTMLElement>("[data-why-atmos-01]");
      const atmos02 = root.querySelector<HTMLElement>("[data-why-atmos-02]");
      const atmos03 = root.querySelector<HTMLElement>("[data-why-atmos-03]");
      const atmosShaft = root.querySelector<HTMLElement>("[data-why-atmos-shaft]");
      const atmosBand = root.querySelector<HTMLElement>("[data-why-atmos-band]");
      const gutter = root.querySelector<HTMLElement>("[data-why-gutter]");
      const farewell = root.querySelector<HTMLElement>("[data-why-farewell]");

      if (reduced) {
        gsap.set([chapter, intro, ...rows, atmosShaft, gutter, farewell], {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scaleY: 1,
        });
        if (atmosShaft) gsap.set(atmosShaft, { opacity: 0.18 });
        if (farewell) gsap.set(farewell, { opacity: 0 });
        rows.forEach((r) => {
          gsap.set(r.querySelectorAll("[data-why-sup], [data-why-line], [data-why-note]"), {
            opacity: 1,
            y: 0,
            yPercent: 0,
            filter: "blur(0px)",
          });
        });
        return;
      }

      // ─── Atmospheric drift ───────────────────────────────────────────
      // Four light fields breathe through the section at different rates
      // and different axes. Nothing ever claims attention — the eye just
      // registers that the room is lit, and the lighting is alive.
      atmosphericField(atmos01, {
        trigger: root,
        baseOpacity: 0.32,
        peakOpacity: 1,
        scale: [1.04, 1.0],
        scrub: 1.3,
      });
      parallaxDrift(atmos01, { trigger: root, from: -4, to: 6, scrub: true });

      atmosphericField(atmos02, {
        trigger: root,
        baseOpacity: 0.48,
        peakOpacity: 0.9,
        scale: [1.02, 1.0],
        scrub: 1.6,
      });
      parallaxDrift(atmos02, { trigger: root, from: 5, to: -4, scrub: true });

      atmosphericField(atmos03, {
        trigger: root,
        baseOpacity: 0.3,
        peakOpacity: 0.75,
        scale: [1.03, 1.0],
        scrub: 1.8,
      });
      parallaxDrift(atmos03, { trigger: root, from: -2, to: 5, scrub: true });

      // Diagonal "window shaft" — a long, narrow light at a 12° tilt
      // that drifts laterally across the section as the user scrolls.
      // This is the layer doing most of the *depth* work: it gives the
      // room a direction, a sense that light is coming *from somewhere*.
      if (atmosShaft) {
        atmosphericField(atmosShaft, {
          trigger: root,
          baseOpacity: 0.06,
          peakOpacity: 0.22,
          scale: [1, 1],
          scrub: 1.7,
        });
        horizontalDrift(atmosShaft, { trigger: root, from: -6, to: 6, scrub: true });
      }

      // Mid-height editorial band — slow horizontal drift, catches the eye
      // mid-section and then releases.
      parallaxDrift(atmosBand, { trigger: root, from: -3, to: 3, scrub: true });

      // ─── Editorial gutter: scroll-coupled breathing ──────────────────
      // The thin vertical hairline between numeral + statement columns
      // scrubs its vertical extension with scroll. Never visible as
      // motion — the eye registers the column breathing, and the list
      // feels *drawn*, not placed.
      if (gutter) {
        gsap.fromTo(
          gutter,
          { scaleY: 0.55, transformOrigin: "top center", opacity: 0.4 },
          {
            scaleY: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 80%",
              end: "bottom 40%",
              scrub: 1.1,
            },
          },
        );
        gsap.to(gutter, {
          scaleY: 0.7,
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "bottom 40%",
            end: "bottom 5%",
            scrub: 1.1,
          },
        });
      }

      // ─── Header: presence envelope (earlier entry for handoff) ───────
      presenceEnvelope(chapter, {
        trigger: root,
        start: "top 98%",
        end: "top 32%",
        yFrom: 14,
        yTo: -8,
        blur: 3,
        holdRatio: 0.6,
      });

      presenceEnvelope(intro, {
        trigger: root,
        start: "top 92%",
        end: "top 26%",
        yFrom: 20,
        yTo: -10,
        blur: 4,
        holdRatio: 0.58,
      });

      // ─── Per-row focus envelope ──────────────────────────────────────
      // Each principle is a camera hold: the statement and its marginalia
      // gain presence entering the focus zone, reach full clarity as they
      // pass the center, then gently release as the next principle takes
      // over. The typography stays crisp within the hold zone — only the
      // presence curve moves.
      rows.forEach((row) => {
        const sup = row.querySelector<HTMLElement>("[data-why-sup]");
        const lines = gsap.utils.toArray<HTMLElement>(row.querySelectorAll("[data-why-line]"));
        const note = row.querySelector<HTMLElement>("[data-why-note]");

        // Superscript numeral — small, soft arrival, holds, softens.
        focusEnvelope(sup, {
          trigger: row,
          start: "top 85%",
          end: "bottom 15%",
          blur: 2.5,
          opacityFloor: 0.24,
          focusOpacity: 1,
          holdRatio: 0.52,
        });

        // Statement lines — mask-wrapped, so we can use yPercent + opacity
        // without any blur (blur on giant serif can muddy the strokes).
        // Stagger ensures line 2 reaches focus a beat after line 1.
        lines.forEach((line, i) => {
          gsap.set(line, { yPercent: 100, opacity: 0 });
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: "top 82%",
              end: "bottom 25%",
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
            defaults: { ease: "none" },
          });

          const entryStart = 0.04 + i * 0.07;
          const entryEnd = 0.32 + i * 0.06;
          const exitStart = 0.66;
          const exitEnd = 0.94;

          tl.fromTo(
            line,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: entryEnd - entryStart, ease: "power2.out" },
            entryStart,
          );
          tl.to(
            line,
            { yPercent: 0, opacity: 1, duration: exitStart - entryEnd, ease: "none" },
            entryEnd,
          );
          tl.to(
            line,
            {
              yPercent: -28,
              opacity: 0.18,
              duration: exitEnd - exitStart,
              ease: "power2.in",
            },
            exitStart,
          );
        });

        // Marginalia — fades in last, fades out first. Arrives with a
        // soft blur, reaches 72% opacity (the existing editorial tone),
        // releases cleanly.
        if (note) {
          focusEnvelope(note, {
            trigger: row,
            start: "top 72%",
            end: "bottom 22%",
            blur: 3,
            opacityFloor: 0.12,
            focusOpacity: 0.78,
            holdRatio: 0.46,
          });
        }
      });

      // ─── Section farewell ────────────────────────────────────────────
      sectionFarewell(farewell, {
        trigger: root,
        peak: 1,
        start: "bottom 78%",
        end: "bottom -5%",
        scrub: 1.0,
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="warum"
      className="relative overflow-hidden bg-[#090909] px-5 py-32 sm:px-8 sm:py-44 md:px-12 md:py-56 lg:px-16 lg:py-64"
      aria-labelledby="why-heading"
    >
      <div aria-hidden className="section-top-rule" />

      {/* Depth layer 01 — soft overhead key-light, centered */}
      <div
        data-why-atmos-01
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 72% 44% at 50% -4%, rgba(255,255,255,0.036), transparent 62%)",
        }}
      />

      {/* Depth layer 02 — off-axis ambient glow, bottom-right asymmetry */}
      <div
        data-why-atmos-02
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 52% 40% at 88% 86%, rgba(255,255,255,0.026), transparent 60%)",
        }}
      />

      {/* Depth layer 03 — low-lit counter-glow from the opposite edge */}
      <div
        data-why-atmos-03
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 44% 34% at 8% 18%, rgba(255,255,255,0.018), transparent 60%)",
        }}
      />

      {/* Depth layer 04 — ultra-faint horizontal band, drifts slowly */}
      <div
        data-why-atmos-band
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
      />

      {/* Depth layer 05 — the diagonal "window shaft".
          A long, narrow light at 12° that drifts laterally with scroll.
          Ultra low opacity; what it adds is *direction* — the room has
          a light source now, and that source is moving. */}
      <div
        data-why-atmos-shaft
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-1/2 top-[-20%] h-[140%] w-[42%] -translate-x-1/2 [filter:blur(14px)] will-change-transform sm:[filter:blur(24px)] md:[filter:blur(40px)]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.018) 28%, rgba(255,255,255,0.045) 50%, rgba(255,255,255,0.018) 72%, transparent 100%)",
            transform: "translateX(-50%) rotate(12deg)",
          }}
        />
      </div>

      {/* Depth layer 06 — gentle bottom falloff, static hand-off to About */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#070707] via-transparent to-transparent"
      />

      <div className="relative layout-max">
        <div className="mb-16 grid gap-6 md:mb-24 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20">
          <div data-why-chapter className="md:pt-2">
            <ChapterMarker num="03" label="Unterschied" />
          </div>

          <div data-why-intro>
            <h2
              id="why-heading"
              className="font-instrument text-[1.9rem] leading-[1.05] tracking-[-0.025em] text-white sm:text-[2.4rem] md:text-[2.95rem] lg:text-[3.3rem]"
            >
              Kern der Arbeit. <em className="italic text-white/50">Nicht Aufsatz.</em>
            </h2>
            <p className="font-ui mt-8 max-w-xl text-[14.5px] leading-[1.7] text-white/50 md:mt-10 md:text-[15.5px]">
              Vier Prinzipien. Sie entscheiden, was wir annehmen und was wir bewusst nicht machen.
              Sie laufen nicht als Slogan im Kopf — sie laufen als Betriebssystem.
            </p>
          </div>
        </div>

        <ol className="relative">
          {/* Editorial gutter — a soft vertical hairline in the gap
              between numeral and statement columns. Scrubs its vertical
              extension with scroll so the column feels *drawn* as the
              user descends the list. Desktop only. */}
          <div
            data-why-gutter
            aria-hidden
            className="pointer-events-none absolute inset-y-16 left-[92px] hidden w-px origin-top bg-gradient-to-b from-transparent via-white/[0.045] to-transparent will-change-[transform,opacity] md:block lg:left-[108px]"
          />
          {PRINCIPLES.map((p, i) => (
            <li
              key={p.sup}
              data-why-row
              className={`relative grid items-start gap-x-6 gap-y-4 py-12 sm:gap-x-10 sm:py-16 md:grid-cols-[minmax(56px,80px)_minmax(0,1fr)_minmax(220px,360px)] md:gap-x-16 md:py-24 lg:gap-x-20 lg:py-28 ${
                i > 0 ? "border-t border-white/[0.06]" : ""
              }`}
            >
              {/* Hanging superscript numeral */}
              <span className="flex items-start justify-start md:justify-end md:pt-[0.85rem]">
                <span
                  data-why-sup
                  className="why-superscript text-[1.4rem] will-change-[opacity,filter] sm:text-[1.65rem] md:text-[1.9rem]"
                >
                  {p.sup}
                </span>
              </span>

              {/* Statement — giant serif, two lines */}
              <h3
                className={`font-instrument tracking-[-0.028em] ${
                  p.tone === "hush" ? "text-white/82" : "text-white"
                } text-[2rem] leading-[0.98] sm:text-[2.9rem] md:text-[4rem] lg:text-[4.6rem] xl:text-[5.2rem]`}
              >
                <span className="block overflow-hidden">
                  <span data-why-line className="block will-change-transform">
                    {p.line1}
                  </span>
                </span>
                {p.line2 ? (
                  <span className="block overflow-hidden">
                    <span
                      data-why-line
                      className={`block will-change-transform ${i % 2 === 1 ? "italic text-white/58" : ""}`}
                    >
                      {p.line2}
                    </span>
                  </span>
                ) : null}
              </h3>

              {/* Marginalia — narrow monospace column on the right */}
              <aside className="md:pt-[1.1rem]">
                <p
                  data-why-note
                  className="font-mono max-w-[36ch] text-[11.5px] leading-[1.7] tracking-[0.04em] text-white/58 will-change-[opacity,filter] sm:text-[12px]"
                >
                  <span aria-hidden className="mr-2 inline-block h-px w-6 bg-white/35 align-middle" />
                  {p.note}
                </p>
              </aside>
            </li>
          ))}
        </ol>
      </div>

      {/* Section farewell — scrubbed ink-shadow handoff into About. */}
      <div
        data-why-farewell
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-52 will-change-[opacity]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(7,7,9,0.38) 60%, rgba(7,7,9,0.66) 100%)",
        }}
      />
    </section>
  );
}
