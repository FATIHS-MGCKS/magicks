import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { HeroVideoBackground } from "../HeroVideoBackground";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { prefersCheapMotion } from "../../lib/scrollMotion";

/**
 * Hero — one dominant statement, one text-link CTA, one cinema credit.
 * Everything else whispers.
 *
 * Composition:
 *   · vertical production credit (left edge)
 *   · two-line headline — "Wir bauen das Web, / das dein Business verdient."
 *   · text-link CTA with dual underline sweep
 *   · thin scroll cue (bottom-center)
 *
 * No sub-paragraph. No glass pill. No secondary link. No session ledger.
 * The restraint is the point.
 */

const LINE_A = ["Wir", "bauen", "das", "Web,"];
const LINE_B = ["das", "dein", "Business", "verdient."];

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const cheapMotion = prefersCheapMotion();
      const credit = root.querySelector<HTMLElement>("[data-hero-credit]");
      const lineA = gsap.utils.toArray<HTMLElement>("[data-hero-a]");
      const lineB = gsap.utils.toArray<HTMLElement>("[data-hero-b]");
      const subline = root.querySelector<HTMLElement>("[data-hero-subline]");
      const cta = root.querySelector<HTMLElement>("[data-hero-cta]");
      const cue = root.querySelector<HTMLElement>("[data-hero-cue]");
      const scaler = root.querySelector<HTMLElement>("[data-hero-scaler]");
      const vignette = root.querySelector<HTMLElement>("[data-hero-vignette]");
      const bottomFade = root.querySelector<HTMLElement>("[data-hero-bottomfade]");
      const wipe = root.querySelector<HTMLElement>("[data-hero-wipe]");
      const copy = root.querySelector<HTMLElement>("[data-hero-copy]");
      const depth = root.querySelector<HTMLElement>("[data-hero-depth]");

      if (reduced) {
        gsap.set(
          [credit, ...lineA, ...lineB, subline, cta, cue, vignette, bottomFade],
          { opacity: 1, y: 0, yPercent: 0, letterSpacing: "-0.032em", scaleX: 1 },
        );
        gsap.set(lineA, { letterSpacing: "-0.0275em" });
        gsap.set(wipe, { opacity: 0 });
        gsap.set(depth, { opacity: 0 });
        return;
      }

      // Pre-roll: a light editorial veil that quickly clears into focus.
      gsap.set(wipe, { opacity: 0.82 });
      gsap.set(vignette, { opacity: 0.16 });
      gsap.set(bottomFade, { opacity: 0.14 });
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
        .to(vignette, { opacity: 0.72, duration: 1.7, ease: "power2.out" }, 0.1)
        .to(bottomFade, { opacity: 0.64, duration: 1.8, ease: "power2.out" }, 0.1);

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
      // The hero never "snaps" away. Instead it recedes in layered depth
      // as the user scrolls toward the Value Statement. Every layer scrubs,
      // which means scrolling back up reverses the entire composition and
      // the frame reclaims its dominance.

      // 01 — video plane gently pushes and drifts. `scrub: 1.1` adds a
      // film-magazine inertia so the push never feels UI-like.
      const scalerExit: gsap.TweenVars = {
        scale: 1.08,
        yPercent: -3,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      };
      if (!cheapMotion) scalerExit.filter = "blur(1.2px)";
      gsap.to(scaler, scalerExit);

      // 02 — the depth layer darkens in two beats: a soft cool grade
      // first, then a stronger mid-frame falloff as the copy clears.
      gsap.fromTo(
        depth,
        { opacity: 0 },
        {
          opacity: 0.62,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.9,
          },
        },
      );

      // 03 — vignette tightens toward the end of the scroll, pulling the
      // eye off the hero and priming the next section.
      gsap.fromTo(
        vignette,
        { opacity: 0.94 },
        {
          opacity: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 1.0,
          },
        },
      );

      // 04 — copy exhale: lifts, softens, and loses contrast before the
      // frame goes. No opacity wall — blur+y carries most of the farewell.
      const copyExit: gsap.TweenVars = {
        yPercent: -10,
        opacity: 0.26,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom 12%",
          scrub: 0.9,
        },
      };
      if (!cheapMotion) copyExit.filter = "blur(2.2px)";
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
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[var(--magicks-bg-base)]"
      aria-labelledby="hero-heading"
    >
      {/* Camera push layer */}
      <div
        data-hero-scaler
        className="absolute inset-0 origin-center will-change-transform"
        aria-hidden
      >
        <HeroVideoBackground />
      </div>

      {/* Overlay stack — four deliberate layers, each a different job */}

      {/* 1 — global color grade: soft ivory wash for light-theme legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(248,245,238,0.11) 0%, rgba(245,241,232,0.08) 52%, rgba(241,236,227,0.12) 100%)",
        }}
      />

      {/* 2 — edge vignette: keeps the eye centered, feels like a film-gate */}
      <div
        data-hero-vignette
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 84% 64% at 50% 52%, transparent 0%, transparent 43%, rgba(236,230,220,0.38) 90%, rgba(232,225,214,0.56) 100%)",
        }}
      />

      {/* 3 — left-column reading field: uses the calmer half of the video */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(255,253,247,0.78) 0%, rgba(248,244,235,0.58) 31%, rgba(245,240,230,0.22) 52%, transparent 74%)",
        }}
      />

      {/* 3b — left-side cinematic key light behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[6vw] top-[18%] h-[58%] w-[min(56vw,780px)] rounded-[2.5rem]"
        style={{
          background:
            "radial-gradient(ellipse 72% 64% at 26% 48%, rgba(255,255,255,0.42) 0%, rgba(248,244,235,0.2) 52%, transparent 100%)",
        }}
      />

      {/* 4 — bottom copy-zone fade: tight, concentrated near the scroll edge */}
      <div
        data-hero-bottomfade
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(239,234,224,0.18) 36%, rgba(236,231,221,0.44) 72%, var(--magicks-bg-lifted) 100%)",
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
        className="relative z-10 flex flex-1 items-center px-6 pb-[7.5rem] pt-24 sm:px-10 sm:pb-[8.5rem] md:px-14 md:pb-[9.5rem] md:pt-32 lg:px-18 lg:pb-[10.5rem] xl:px-24"
      >
        <div className="layout-max w-full">
          <div className="max-w-[min(45rem,88vw)] text-left md:max-w-[min(48rem,58vw)] lg:max-w-[min(52rem,52vw)] xl:max-w-[min(56rem,50vw)]">
            <h1
              id="hero-heading"
              className="font-instrument text-[3.42rem] leading-[0.96] tracking-[-0.036em] text-[rgb(var(--magicks-ink-rgb)/0.98)] [text-shadow:0_1px_0_rgba(255,255,255,0.58)] sm:text-[4.72rem] md:text-[5.6rem] lg:text-[6.35rem] xl:text-[7.1rem]"
            >
              <span className="block font-[560]">
                {LINE_A.map((w, i) => (
                  <span
                    key={`a-${i}`}
                    className="mr-[0.16em] inline-block overflow-hidden align-bottom last:mr-0"
                  >
                    <span data-hero-a className="inline-block will-change-[transform,opacity]">
                      {w}
                    </span>
                  </span>
                ))}
              </span>
              <span className="mt-1 block italic text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:mt-2">
                {LINE_B.map((w, i) => (
                  <span
                    key={`b-${i}`}
                    className="mr-[0.16em] inline-block overflow-hidden align-bottom last:mr-0"
                  >
                    <span data-hero-b className="inline-block will-change-[transform,opacity]">
                      {w}
                    </span>
                  </span>
                ))}
              </span>
            </h1>

            {/* Editorial sub-line — quiet H2 carrying the primary local +
                service vocabulary so the homepage anchors a crawlable
                topic underneath the brand-poetic H1.
                Type: Instrument Serif at reading size (matches the H1
                family) with the locale ("Webagentur aus Kassel") set
                in italic as a focal accent and the offer list rendered
                Roman. The italic / Roman split echoes the H1's "block
                + italic" couplet, so the trio reads as one breath
                rather than three disconnected layers. */}
            <h2
              data-hero-subline
              className="font-ui mt-7 max-w-[34rem] border-l border-[rgb(var(--magicks-line-rgb)/0.2)] pl-5 text-[16px] leading-[1.62] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:mt-8 sm:max-w-[38rem] sm:pl-6 sm:text-[17.5px] md:mt-9 md:text-[19px] lg:max-w-[40rem] lg:text-[20px]"
            >
              <em className="font-instrument block text-[1.34em] italic leading-[1.12] tracking-[-0.026em] text-[rgb(var(--magicks-ink-rgb)/0.94)]">Technologie, die sich nach Premium anfühlt.</em>
              <span className="mt-2.5 block text-[rgb(var(--magicks-ink-rgb)/0.68)]">Ein digitaler Eindruck, der im Gedächtnis bleibt.</span>
            </h2>

            {/* Text-link CTA — magazine-style dual underline, no glass pill.
                Hover is deliberately slow + deep: the sweep rule draws in
                over ~900ms, the arrow lifts on a symmetric curve, the copy
                picks up a hair of tracking — all on a single cubic-bezier
                so the whole word feels like it "opens" rather than pops. */}
            <div data-hero-cta className="mt-10 inline-block sm:mt-12 md:mt-14">
              <Link
                to="/kontakt"
                // Baseline-aligned at every viewport: the arrow's text
                // baseline locks onto the label's baseline so it never
                // drifts low on mobile. min-h-11 + py-1 keep the touch
                // target ≥ 44 px below lg without affecting alignment.
                className="group relative inline-flex min-h-12 items-center gap-3 rounded-full border border-[rgb(var(--magicks-line-rgb)/0.22)] bg-[rgb(var(--magicks-ink-rgb)/0.92)] py-2.5 pl-6 pr-2.5 font-ui text-[15.5px] font-semibold tracking-[-0.004em] text-[var(--magicks-bg-lifted)] no-underline shadow-[0_24px_70px_-36px_rgba(20,28,44,0.5),inset_0_1px_0_rgba(255,255,255,0.16)] transition-[transform,box-shadow,background-color] duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1.5px] hover:bg-[rgb(var(--magicks-ink-rgb)/0.98)] hover:shadow-[0_34px_90px_-34px_rgba(20,28,44,0.58),inset_0_1px_0_rgba(255,255,255,0.18)] sm:min-h-[52px] sm:pl-7 sm:text-[16px] md:text-[16.5px]"
                aria-label="Projekt besprechen"
              >
                <span className="relative">
                  <span className="font-ui magicks-hero-cta-label inline-block transition-[letter-spacing,color] duration-[820ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:tracking-[0.004em] group-focus-visible:tracking-[0.004em]">
                    Ein Projekt besprechen
                  </span>
                </span>

                <span
                  aria-hidden
                  // U+FE0E (VARIATION SELECTOR-15) forces text-style
                  // rendering of U+2197. Without it, iOS/Android route
                  // the arrow through the system emoji font and the
                  // glyph looks different from the desktop italic
                  // serif rendering. The selector is invisible.
                  className="font-instrument flex h-8 w-8 items-center justify-center rounded-full bg-[var(--magicks-bg-lifted)] text-[1.05em] italic text-[rgb(var(--magicks-ink-rgb)/0.88)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-transform duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px] group-hover:translate-x-[3px] group-focus-visible:-translate-y-[2px] group-focus-visible:translate-x-[3px]"
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
