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
 * Typography keeps both headline lines in Instrument Serif as the hero's
 * editorial accent, with "Online." scaled down for a quieter second beat.
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

      {/* 3 — upper reading field: keeps the headline readable while leaving
             the new floral video edge visually present. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 72% 50% at 50% 32%, rgba(255,253,247,0.66) 0%, rgba(251,247,239,0.44) 30%, rgba(248,244,235,0.16) 56%, transparent 78%)",
        }}
      />

      {/* 3b — centred cinematic key light behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[8%] h-[58%] w-[min(82vw,900px)] -translate-x-1/2 rounded-[2.5rem]"
        style={{
          background:
            "radial-gradient(ellipse 78% 66% at 50% 42%, rgba(255,255,255,0.3) 0%, rgba(250,246,238,0.16) 48%, rgba(248,244,235,0.045) 74%, transparent 100%)",
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
        className="relative z-10 flex flex-1 items-center justify-center px-5 pb-[10rem] pt-24 text-center sm:px-8 sm:pb-[11.5rem] md:px-12 md:pb-[13.5rem] md:pt-[7.5rem] lg:px-16 lg:pb-[15rem] xl:px-20"
      >
        <div className="layout-max w-full">
          <div className="mx-auto flex max-w-[min(54rem,92vw)] flex-col items-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.22)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.74)] px-3.5 py-1.5 font-ui text-[0.62rem] font-[620] uppercase leading-none tracking-[0.15em] text-[rgb(var(--magicks-accent-ink-rgb)/0.76)] shadow-[0_18px_52px_-44px_rgba(20,28,44,0.38),inset_0_1px_0_rgba(255,255,255,0.78)] sm:mb-6 sm:px-4 sm:text-[0.64rem] sm:tracking-[0.18em]">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--magicks-accent-rgb)/0.72)] shadow-[0_0_0_0.25em_rgb(var(--magicks-accent-rgb)/0.08)]"
              />
              WEBAGENTUR AUS KASSEL
            </div>

            <h1
              id="hero-heading"
              className="font-ui text-[2.85rem] leading-[0.94] tracking-[-0.042em] text-[rgb(var(--magicks-ink-rgb)/0.98)] [text-shadow:0_1px_0_rgba(255,255,255,0.74)] sm:text-[4.05rem] md:text-[5.05rem] lg:text-[5.75rem] xl:text-[6.3rem]"
            >
              <span className="font-instrument block font-[460] italic text-[rgb(var(--magicks-ink-rgb)/0.78)]">
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
              <span className="font-instrument mt-0.5 block text-[0.72em] font-[460] italic leading-[0.98] sm:mt-1 md:text-[0.69em] lg:text-[0.66em]">
                {LINE_B.map((w, i) => (
                  <span
                    key={`b-${i}`}
                    className="mr-[0.16em] inline-block overflow-hidden px-[0.14em] -mx-[0.14em] py-[0.08em] -my-[0.08em] align-bottom last:mr-0 text-emerald-700"
                  >
                    <span
                      data-hero-b
                      className="relative inline-flex items-center gap-[0.18em] text-emerald-700 [text-shadow:0_0.02em_0_rgba(255,255,255,0.72)] after:absolute after:inset-x-[0.02em] after:bottom-[0.07em] after:h-[0.04em] after:rounded-full after:bg-[linear-gradient(90deg,transparent_0%,rgb(var(--magicks-accent-rgb)/0.28)_18%,rgba(5,150,105,0.24)_50%,rgb(var(--magicks-accent-rgb)/0.18)_82%,transparent_100%)] after:content-[''] will-change-[transform,opacity]"
                    >
                      <span className="relative flex items-center justify-center">
                        <span
                          aria-hidden
                          className="absolute h-[0.18em] w-[0.18em] animate-pulse rounded-full bg-emerald-500 blur-[0.06em] opacity-75"
                        />
                        <span
                          aria-hidden
                          className="relative inline-block h-[0.18em] w-[0.18em] rounded-full border border-white/30 bg-[radial-gradient(circle_at_30%_30%,#34d399,#059669_70%,#022c22_100%)] align-middle shadow-[inset_0_0.03em_0.03em_rgba(255,255,255,0.6),inset_0_-0.03em_0.06em_rgba(0,0,0,0.35),0_0.03em_0.06em_rgba(0,0,0,0.18)]"
                        />
                      </span>
                      {w}
                    </span>
                  </span>
                ))}
              </span>
            </h1>

            <div className="mx-auto mt-5 flex w-full max-w-[43rem] flex-col items-center gap-3 rounded-[1.5rem] border border-[rgb(var(--magicks-accent-line-rgb)/0.18)] bg-[linear-gradient(180deg,rgba(255,253,249,0.9)_0%,rgba(244,238,227,0.74)_100%)] px-4 py-3 shadow-[0_24px_70px_-54px_rgba(20,28,44,0.38),inset_0_1px_0_rgba(255,255,255,0.82),inset_0_-1px_0_rgba(148,124,92,0.08)] sm:mt-6 sm:max-w-[45rem] sm:flex-row sm:justify-between sm:gap-5 sm:px-5 sm:py-3.5">
              {/* Quiet H2 subtext — placed inside the action card so the copy
                  reads as a deliberate title card over the new video frame. */}
              <h2
                data-hero-subline
                className="font-ui m-0 max-w-[32rem] text-center text-[14px] font-[520] leading-[1.45] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.79)] sm:text-left sm:text-[15px] md:text-[15.5px]"
              >
                Für Unternehmen, die{" "}
                <span className="font-instrument px-[0.06em] text-[1.13em] italic tracking-[-0.012em] text-[rgb(var(--magicks-accent-ink-rgb)/0.88)]">
                  klar zeigen
                </span>{" "}
                möchten, warum Kunden{" "}
                <span className="font-[640] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                  Vertrauen fassen
                </span>{" "}
                und sich entscheiden.
              </h2>

              {/* Hero CTA — warm ivory pill with a refined arrow chip. */}
              <div data-hero-cta className="shrink-0">
                <Link
                  to="/kontakt"
                  // Baseline-aligned at every viewport: the arrow's text
                  // baseline locks onto the label's baseline so it never
                  // drifts low on mobile. min-h-11 keeps the touch target
                  // above 44 px without affecting alignment.
                  className="group relative inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.24)] bg-[linear-gradient(180deg,rgba(255,253,249,0.98)_0%,rgba(244,238,227,0.92)_100%)] py-2 pl-5 pr-2 font-ui text-[14px] font-[620] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.92)] no-underline shadow-[0_18px_48px_-36px_rgba(20,28,44,0.46),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(148,124,92,0.12)] transition-[transform,box-shadow,background-color,border-color] duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1.5px] hover:border-[rgb(var(--magicks-accent-line-rgb)/0.4)] hover:bg-[linear-gradient(180deg,rgba(255,254,251,1)_0%,rgba(247,241,230,0.96)_100%)] hover:shadow-[0_26px_68px_-36px_rgba(20,28,44,0.52),inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-1px_0_rgba(148,124,92,0.16)] active:translate-y-0 active:scale-[0.99] sm:text-[14.5px]"
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
                    className="ml-0.5 h-5 w-px bg-[rgb(var(--magicks-accent-rgb)/0.22)] transition-[background-color] duration-[720ms] group-hover:bg-[rgb(var(--magicks-accent-rgb)/0.42)] group-focus-visible:bg-[rgb(var(--magicks-accent-rgb)/0.42)]"
                  />

                  <span
                    aria-hidden
                    // U+FE0E (VARIATION SELECTOR-15) forces text-style
                    // rendering of U+2197. Without it, iOS/Android route
                    // the arrow through the system emoji font and the
                    // glyph looks different from the desktop italic
                    // serif rendering. The selector is invisible.
                    className="font-instrument flex h-7 w-7 items-center justify-center rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.34)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.92)] text-[1.05em] italic text-[rgb(var(--magicks-ink-rgb)/0.88)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_30px_-24px_rgba(20,28,44,0.46)] transition-[transform,background-color,border-color,box-shadow] duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px] group-hover:translate-x-[3px] group-hover:border-[rgb(var(--magicks-accent-line-rgb)/0.5)] group-hover:bg-[rgb(var(--magicks-bg-lifted-rgb)/1)] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_16px_36px_-24px_rgba(20,28,44,0.52)] group-focus-visible:-translate-y-[2px] group-focus-visible:translate-x-[3px]"
                    style={{ fontVariantEmoji: "text" }}
                  >
                    {"\u2197\uFE0E"}
                  </span>
                </Link>
              </div>
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
