import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { HeroVideoBackground } from "../HeroVideoBackground";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Hero — one dominant statement, one text-link CTA, one cinema credit.
 * Everything else whispers.
 *
 * Composition:
 *   · vertical production credit (left edge)
 *   · centred two-line headline — "Mehr als nur / Online."
 *   · success-oriented subtext in a high-contrast reading field
 *   · centred CTA with dual underline sweep
 *   · thin scroll cue (bottom-centre)
 *
 * Typography keeps the headline's first line and subtext in Apple-system
 * for SF Pro precision; the italic second line shifts to Instrument Serif
 * as the hero's editorial accent.
 */

const LINE_A = ["Mehr", "als", "nur"];
const LINE_B = ["Online."];

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const mobileViewport =
        window.matchMedia("(max-width: 767px)").matches ||
        window.matchMedia("(pointer: coarse)").matches;
      const credit = root.querySelector<HTMLElement>("[data-hero-credit]");
      const lineA = gsap.utils.toArray<HTMLElement>("[data-hero-a]");
      const lineB = gsap.utils.toArray<HTMLElement>("[data-hero-b]");
      const subline = root.querySelector<HTMLElement>("[data-hero-subline]");
      const cta = root.querySelector<HTMLElement>("[data-hero-cta]");
      const cue = root.querySelector<HTMLElement>("[data-hero-cue]");
      const vignette = root.querySelector<HTMLElement>("[data-hero-vignette]");
      const bottomFade = root.querySelector<HTMLElement>("[data-hero-bottomfade]");
      const haze = root.querySelector<HTMLElement>("[data-hero-haze]");
      const wipe = root.querySelector<HTMLElement>("[data-hero-wipe]");
      const copy = root.querySelector<HTMLElement>("[data-hero-copy]");
      const depth = root.querySelector<HTMLElement>("[data-hero-depth]");

      if (reduced) {
        gsap.set(
          [credit, ...lineA, ...lineB, subline, cta, cue, vignette, bottomFade],
          { opacity: 1, y: 0, yPercent: 0, letterSpacing: "-0.032em", scaleX: 1 },
        );
        gsap.set(lineA, { letterSpacing: "-0.0275em" });
        gsap.set(haze, { opacity: 0, yPercent: 0 });
        gsap.set(wipe, { opacity: 0 });
        gsap.set(depth, { opacity: 0 });
        return;
      }

      // Pre-roll: a light editorial veil that quickly clears into focus.
      gsap.set(wipe, { opacity: 0.3 });
      gsap.set(vignette, { opacity: 0.16 });
      gsap.set(bottomFade, { opacity: 0.14 });
      gsap.set(haze, { opacity: 0, yPercent: 8 });
      gsap.set(credit, { opacity: 0, x: -4 });
      // Letter-spacing initial value must stay inside the "same-wrap" zone so
      // the animated settlement never crosses a line-wrap threshold. Measured
      // at 320 / 375 / 390 / 768 / 1024 / 1440 px the H1 stays on 3 lines for
      // any letter-spacing in [-0.02em, -0.032em]; going wider (e.g. the
      // previous `0.02em`) pushes the H1 to 4 and then 5 lines, which caused
      // a ~87 px layout shift during the intro timeline (CLS ~0.29). Keeping
      // the settlement inside the safe zone preserves the cinematic touch
      // while eliminating the Core Web Vitals hit.
      gsap.set(lineA, { yPercent: 118, opacity: 0, letterSpacing: "-0.02em" });
      gsap.set(lineB, { yPercent: 118, opacity: 0, letterSpacing: "-0.02em" });
      // Subline paints at its final resting state from the first frame.
      // The black pre-roll wipe still covers it for the cinematic fade-in,
      // so visually the subline reveals *with* the wipe — but to the browser
      // (and to LCP), the H2 text is considered rendered immediately,
      // eliminating the prior ~1.4 s LCP delay on the homepage.
      gsap.set(subline, { opacity: 0.66, y: 0 });
      gsap.set(cta, { opacity: 0, y: 12 });
      gsap.set(cue, { opacity: 0 });

      const tl = gsap.timeline({
        delay: 0.25,
        defaults: { ease: "power3.out" },
      });

      // Pre-roll wipe dissolves — overlays fade in with it.
      tl.to(wipe, { opacity: 0, duration: 1.12, ease: "power2.inOut" }, 0)
        .to(vignette, { opacity: 0.58, duration: 1.7, ease: "power2.out" }, 0.1)
        .to(bottomFade, { opacity: 0.52, duration: 1.8, ease: "power2.out" }, 0.1);

      // Headline — mask-reveal with a slow letter-spacing settlement.
      // Line B holds slightly longer than line A for cadence.
      tl.to(
        lineA,
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.078,
          ease: "power4.out",
        },
        0.55,
      )
        .to(
          lineA,
          {
            letterSpacing: "-0.0275em",
            duration: 1.85,
            stagger: 0.04,
            ease: "expo.out",
          },
          0.6,
        )
        .to(
          lineB,
          {
            yPercent: 0,
            opacity: 1,
          duration: 1.28,
          stagger: 0.09,
            ease: "power4.out",
          },
          0.92,
        )
        .to(
          lineB,
          {
            letterSpacing: "-0.032em",
            duration: 1.95,
            stagger: 0.05,
            ease: "expo.out",
          },
          0.98,
        );

      // Credit glides in from the edge once the headline has anchored.
      tl.to(credit, { opacity: 0.48, x: 0, duration: 1.2, ease: "power2.out" }, 1.2);

      // Subline was previously tweened from opacity:0 → 0.62 at t=1.45.
      // It now starts at its final state (see `gsap.set` above) so the H2
      // is paintable from first frame and registers as LCP at FCP time
      // rather than ~2.5 s later. The black pre-roll wipe still veils it
      // until ~t=1.4, preserving the cinematic entry.

      // CTA arrives last — text only.
      tl.to(cta, { opacity: 1, y: 0, duration: 0.95 }, 1.62);

      // Scroll cue surfaces quietly.
      tl.to(cue, { opacity: 1, duration: 0.9, ease: "power2.out" }, 2.05);

      // ─── Scroll-coupled cinematic step-back ──────────────────────────
      // The video stays fixed in scale while scroll only adjusts atmosphere
      // and copy presence. On mobile/coarse viewports those atmosphere
      // changes stay deliberately quiet so they do not read as video zoom.
      const depthTargetOpacity = mobileViewport ? 0.14 : 0.62;
      const vignetteStartOpacity = mobileViewport ? 0.56 : 0.94;
      const vignetteEndOpacity = mobileViewport ? 0.62 : 1.04;
      const hazeTargetOpacity = mobileViewport ? 0.34 : 0.48;
      const hazeTargetY = mobileViewport ? 2 : -2;

      // 01 — the depth layer darkens in two beats: a soft cool grade
      // first, then a stronger mid-frame falloff as the copy clears.
      gsap.fromTo(
        depth,
        { opacity: 0 },
        {
          opacity: depthTargetOpacity,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.9,
          },
        },
      );

      // 02 — vignette tightens toward the end of the scroll, pulling the
      // eye off the hero and priming the next section.
      gsap.fromTo(
        vignette,
        { opacity: vignetteStartOpacity },
        {
          opacity: vignetteEndOpacity,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 1.0,
          },
        },
      );

      // 03 — warm bottom haze: a champagne-toned mist that softens the
      // lower video area as the hero hands off to the next section.
      gsap.to(haze, {
        opacity: hazeTargetOpacity,
        yPercent: hazeTargetY,
        force3D: true,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom 18%",
          scrub: 0.9,
        },
      });

      // 04 — copy exhale: lifts and loses contrast before the frame goes.
      // This stays transform/opacity-only so the video layer remains static.
      const copyExit: gsap.TweenVars = {
        yPercent: -10,
        opacity: 0.26,
        force3D: true,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom 12%",
          scrub: 0.9,
        },
      };
      gsap.to(copy, copyExit);

      // 05 — marginalia (cue + credit) dissolve earlier than the copy so
      // the core headline holds the longest.
      gsap.to([cue, credit], {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom 78%",
          scrub: 0.6,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[var(--magicks-bg-base)] md:min-h-[100dvh]"
      aria-labelledby="hero-heading"
    >
      {/* Static hero media layer */}
      <div className="absolute inset-0" aria-hidden>
        <HeroVideoBackground />
      </div>

      {/* Overlay stack — deliberate atmosphere layers, each with one job */}

      {/* 1 — global color grade: soft ivory wash for light-theme legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(248,245,238,0.028) 0%, rgba(245,241,232,0.024) 52%, rgba(241,236,227,0.04) 100%)",
        }}
      />

      {/* 2 — edge vignette: keeps the eye centered, feels like a film-gate */}
      <div
        data-hero-vignette
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 84% 64% at 50% 52%, transparent 0%, transparent 43%, rgba(236,230,220,0.14) 90%, rgba(232,225,214,0.2) 100%)",
        }}
      />

      {/* 3 — centred reading field: keeps the headline readable over video */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 78% 64% at 50% 45%, rgba(255,253,247,0.56) 0%, rgba(251,247,239,0.42) 28%, rgba(248,244,235,0.22) 50%, rgba(245,240,230,0.06) 70%, transparent 100%)",
        }}
      />

      {/* 3b — centred cinematic key light behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[13%] h-[66%] w-[min(82vw,920px)] -translate-x-1/2 rounded-[2.5rem]"
        style={{
          background:
            "radial-gradient(ellipse 78% 70% at 50% 48%, rgba(255,255,255,0.28) 0%, rgba(250,246,238,0.17) 46%, rgba(248,244,235,0.06) 72%, transparent 100%)",
        }}
      />

      {/* 4 — bottom copy-zone fade: tight, concentrated near the scroll edge */}
      <div
        data-hero-bottomfade
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(239,234,224,0.14) 36%, rgba(236,231,221,0.33) 72%, var(--magicks-bg-lifted) 100%)",
        }}
      />

      {/* 5 — scroll-coupled depth layer: invisible at rest, grades the
             frame ~18% darker as the user scrolls, so the hero "steps back"
             cinematically without ever going off. Sits below the UI copy
             but above the static overlays so it can keyframe cleanly. */}
      <div
        data-hero-depth
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(34,44,62,0.01) 0%, rgba(34,44,62,0.05) 52%, rgba(34,44,62,0.09) 100%)",
        }}
      />

      {/* 6 — scroll-coupled bottom haze: warm mist over the video edge only */}
      <div
        data-hero-haze
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-[34%] opacity-0 will-change-[opacity,transform] sm:h-[39%] md:h-[46%]"
        style={{
          background:
            "radial-gradient(ellipse 62% 42% at 18% 74%, rgba(255,250,239,0.72) 0%, rgba(250,243,228,0.34) 42%, transparent 72%), radial-gradient(ellipse 78% 46% at 82% 82%, rgba(244,231,205,0.56) 0%, rgba(239,226,201,0.26) 44%, transparent 76%), linear-gradient(180deg, transparent 0%, rgba(253,248,238,0.14) 24%, rgba(248,240,225,0.34) 58%, rgba(241,234,219,0.66) 82%, var(--magicks-bg-lifted) 100%)",
        }}
      />

      {/* Pre-roll wipe — solid black that dissolves with the intro timeline */}
      <div
        data-hero-wipe
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[var(--magicks-bg-base)]"
      />

      {/* Left-edge cinema credit */}
      <div
        data-hero-credit
        className="pointer-events-none absolute bottom-14 left-5 z-10 hidden md:block lg:bottom-16 lg:left-8"
      >
        <span className="hero-vertical-credit">
          MAGICKS &nbsp;·&nbsp; Studio &nbsp;·&nbsp; EST. MMXXIV &nbsp;·&nbsp; Kassel / DE
        </span>
      </div>

      {/* Main content column */}
      <div
        data-hero-copy
        className="relative z-10 flex flex-1 items-center justify-center px-5 pb-[7.5rem] pt-24 text-center sm:px-8 sm:pb-[8.5rem] md:px-12 md:pb-[9.5rem] md:pt-32 lg:px-16 lg:pb-[10.5rem] xl:px-20"
      >
        <div className="layout-max w-full">
          <div className="mx-auto flex max-w-[min(58rem,92vw)] flex-col items-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.24)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.7)] px-3.5 py-2 font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.78)] shadow-[0_18px_52px_-42px_rgba(20,28,44,0.4),inset_0_1px_0_rgba(255,255,255,0.78)] sm:mb-7 sm:px-4 sm:text-[10.5px] sm:tracking-[0.24em]">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--magicks-accent-rgb)/0.72)] shadow-[0_0_0_0.25em_rgb(var(--magicks-accent-rgb)/0.08)]"
              />
              WEBAGENTUR AUS KASSEL
            </div>

            <h1
              id="hero-heading"
              className="font-ui text-[3rem] leading-[0.96] tracking-[-0.042em] text-[rgb(var(--magicks-ink-rgb)/0.98)] [text-shadow:0_1px_0_rgba(255,255,255,0.74)] sm:text-[4.35rem] md:text-[5.45rem] lg:text-[6.35rem] xl:text-[7rem]"
            >
              <span className="block font-[640]">
                {LINE_A.map((w, i) => (
                  <span
                    key={`a-${i}`}
                    className="mr-[0.19em] inline-block overflow-hidden align-bottom last:mr-0"
                  >
                    <span data-hero-a className="inline-block will-change-[transform,opacity]">
                      {w}
                    </span>
                  </span>
                ))}
              </span>
              <span className="font-instrument mt-1 block font-[460] italic text-[rgb(var(--magicks-ink-rgb)/0.78)] sm:mt-2">
                {LINE_B.map((w, i) => (
                  <span
                    key={`b-${i}`}
                    className="mr-[0.18em] inline-block overflow-hidden px-[0.18em] -mx-[0.18em] py-[0.12em] -my-[0.12em] align-bottom last:mr-0 text-emerald-700"
                  >
                    <span
                      data-hero-b
                      className="relative inline-flex items-center gap-[0.25em] text-emerald-700 [text-shadow:0_0.025em_0_rgba(255,255,255,0.72)] after:absolute after:inset-x-[0.02em] after:bottom-[0.08em] after:h-[0.045em] after:rounded-full after:bg-[linear-gradient(90deg,transparent_0%,rgb(var(--magicks-accent-rgb)/0.28)_18%,rgba(5,150,105,0.24)_50%,rgb(var(--magicks-accent-rgb)/0.18)_82%,transparent_100%)] after:content-[''] will-change-[transform,opacity]"
                    >
                      <span className="relative flex items-center justify-center">
                        <span
                          aria-hidden
                          className="absolute h-[0.26em] w-[0.26em] animate-pulse rounded-full bg-emerald-500 blur-[0.1em] opacity-80"
                        />
                        <span
                          aria-hidden
                          className="relative inline-block h-[0.26em] w-[0.26em] rounded-full border border-white/30 bg-[radial-gradient(circle_at_30%_30%,#34d399,#059669_70%,#022c22_100%)] align-middle shadow-[inset_0_0.04em_0.04em_rgba(255,255,255,0.6),inset_0_-0.04em_0.08em_rgba(0,0,0,0.4),0_0.04em_0.08em_rgba(0,0,0,0.2)]"
                        />
                      </span>
                      {w}
                    </span>
                  </span>
                ))}
              </span>
            </h1>

            {/* Quiet H2 subtext — centred and placed on a calm surface so it
                remains readable over the moving video frame. */}
            <h2
              data-hero-subline
              className="font-ui mx-auto mt-7 max-w-[38rem] rounded-[999px] border border-[rgb(var(--magicks-accent-line-rgb)/0.18)] bg-[linear-gradient(180deg,rgba(255,253,249,0.82)_0%,rgba(244,238,227,0.58)_100%)] px-5 py-3.5 text-center text-[16px] font-[520] leading-[1.5] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.8)] shadow-[0_22px_64px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.78),inset_0_-1px_0_rgba(148,124,92,0.08)] sm:mt-8 sm:max-w-[42rem] sm:px-7 sm:py-4 sm:text-[17.5px] md:mt-9 md:text-[19px] lg:text-[20px]"
            >
              Für Unternehmen, die{" "}
              <span className="font-instrument px-[0.06em] text-[1.12em] italic tracking-[-0.012em] text-[rgb(var(--magicks-accent-ink-rgb)/0.88)]">
                klar zeigen
              </span>{" "}
              möchten, warum Kunden{" "}
              <span className="font-[640] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                Vertrauen fassen
              </span>{" "}
              und sich entscheiden.
            </h2>

            {/* Hero CTA — warm ivory pill with a refined arrow chip. */}
            <div data-hero-cta className="mt-9 inline-block sm:mt-11 md:mt-12">
              <Link
                to="/kontakt"
                // Baseline-aligned at every viewport: the arrow's text
                // baseline locks onto the label's baseline so it never
                // drifts low on mobile. min-h-11 + py-1 keep the touch
                // target ≥ 44 px below lg without affecting alignment.
                className="group relative inline-flex min-h-12 items-center gap-3 rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.24)] bg-[linear-gradient(180deg,rgba(255,253,249,0.96)_0%,rgba(244,238,227,0.9)_100%)] py-2.5 pl-6 pr-2 font-ui text-[15.5px] font-[600] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.92)] no-underline shadow-[0_22px_62px_-42px_rgba(20,28,44,0.46),inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(148,124,92,0.12)] transition-[transform,box-shadow,background-color,border-color] duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1.5px] hover:border-[rgb(var(--magicks-accent-line-rgb)/0.4)] hover:bg-[linear-gradient(180deg,rgba(255,254,251,0.98)_0%,rgba(247,241,230,0.94)_100%)] hover:shadow-[0_32px_82px_-40px_rgba(20,28,44,0.52),inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-1px_0_rgba(148,124,92,0.16)] active:translate-y-0 active:scale-[0.99] sm:min-h-[52px] sm:pl-7 sm:pr-2.5 sm:text-[16px] md:text-[16.5px]"
                aria-label="Kostenlose Ersteinschätzung"
              >
                <span className="relative">
                  <span className="font-ui magicks-hero-cta-label inline-block transition-[letter-spacing,color] duration-[820ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:tracking-[0.004em] group-focus-visible:tracking-[0.004em]">
                    Kostenlose Ersteinschätzung
                  </span>
                </span>

                {/* Hairline carriage divider — thin vertical rule between
                    label and arrow chip. Brightens on hover so the
                    chip reads as a separate "stop". */}
                <span
                  aria-hidden
                  className="ml-1 h-5 w-px bg-[rgb(var(--magicks-accent-rgb)/0.22)] transition-[background-color] duration-[720ms] group-hover:bg-[rgb(var(--magicks-accent-rgb)/0.42)] group-focus-visible:bg-[rgb(var(--magicks-accent-rgb)/0.42)] sm:h-6"
                />

                <span
                  aria-hidden
                  // U+FE0E (VARIATION SELECTOR-15) forces text-style
                  // rendering of U+2197. Without it, iOS/Android route
                  // the arrow through the system emoji font and the
                  // glyph looks different from the desktop italic
                  // serif rendering. The selector is invisible.
                  className="font-instrument flex h-8 w-8 items-center justify-center rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.34)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.9)] text-[1.05em] italic text-[rgb(var(--magicks-ink-rgb)/0.88)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_30px_-24px_rgba(20,28,44,0.46)] transition-[transform,background-color,border-color,box-shadow] duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px] group-hover:translate-x-[3px] group-hover:border-[rgb(var(--magicks-accent-line-rgb)/0.5)] group-hover:bg-[rgb(var(--magicks-bg-lifted-rgb)/1)] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_16px_36px_-24px_rgba(20,28,44,0.52)] group-focus-visible:-translate-y-[2px] group-focus-visible:translate-x-[3px]"
                  style={{ fontVariantEmoji: "text" }}
                >
                  {"\u2197\uFE0E"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--magicks-line-rgb)/0.2)] to-transparent"
      />

      {/* Scroll cue — thin breathing line */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center sm:bottom-8"
      >
        <span data-hero-cue className="relative block h-11 w-px overflow-hidden bg-[rgb(var(--magicks-line-rgb)/0.18)]">
          <span className="absolute inset-x-0 top-0 block h-1/2 bg-gradient-to-b from-[rgb(var(--magicks-ink-rgb)/0.72)] to-transparent magicks-hero-cue-line" />
        </span>
      </div>
    </section>
  );
}
