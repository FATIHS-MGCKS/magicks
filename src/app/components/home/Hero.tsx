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
 *   · two-line headline — "Wir bauen das Web, / das dein Business verdient."
 *   · text-link CTA with dual underline sweep
 *   · thin scroll cue + § 00 folio (bottom-center)
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
      const credit = root.querySelector<HTMLElement>("[data-hero-credit]");
      const lineA = gsap.utils.toArray<HTMLElement>("[data-hero-a]");
      const lineB = gsap.utils.toArray<HTMLElement>("[data-hero-b]");
      const cta = root.querySelector<HTMLElement>("[data-hero-cta]");
      const ctaRule = root.querySelector<HTMLElement>("[data-hero-cta-rule]");
      const cue = root.querySelector<HTMLElement>("[data-hero-cue]");
      const cueLabel = root.querySelector<HTMLElement>("[data-hero-cue-label]");
      const scaler = root.querySelector<HTMLElement>("[data-hero-scaler]");
      const vignette = root.querySelector<HTMLElement>("[data-hero-vignette]");
      const bottomFade = root.querySelector<HTMLElement>("[data-hero-bottomfade]");
      const wipe = root.querySelector<HTMLElement>("[data-hero-wipe]");
      const copy = root.querySelector<HTMLElement>("[data-hero-copy]");

      if (reduced) {
        gsap.set(
          [credit, ...lineA, ...lineB, cta, ctaRule, cue, cueLabel, vignette, bottomFade],
          { opacity: 1, y: 0, yPercent: 0, letterSpacing: "-0.032em", scaleX: 1 },
        );
        gsap.set(wipe, { opacity: 0 });
        return;
      }

      // Pre-roll: the entire stage is black. Overlays, video and type arrive together.
      gsap.set(wipe, { opacity: 1 });
      gsap.set(vignette, { opacity: 0 });
      gsap.set(bottomFade, { opacity: 0 });
      gsap.set(credit, { opacity: 0, x: -6 });
      gsap.set(lineA, { yPercent: 118, opacity: 0, letterSpacing: "0.02em" });
      gsap.set(lineB, { yPercent: 118, opacity: 0, letterSpacing: "0.02em" });
      gsap.set(cta, { opacity: 0, y: 14 });
      gsap.set(ctaRule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(cue, { opacity: 0 });
      gsap.set(cueLabel, { opacity: 0, y: 6 });

      const tl = gsap.timeline({
        delay: 0.25,
        defaults: { ease: "power3.out" },
      });

      // Pre-roll wipe dissolves — overlays fade in with it.
      tl.to(wipe, { opacity: 0, duration: 1.4, ease: "power2.inOut" }, 0)
        .to(vignette, { opacity: 1, duration: 2.0, ease: "power2.out" }, 0.15)
        .to(bottomFade, { opacity: 1, duration: 2.0, ease: "power2.out" }, 0.15);

      // Headline — mask-reveal with a slow letter-spacing settlement.
      // Line B holds slightly longer than line A for cadence.
      tl.to(
        lineA,
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.3,
          stagger: 0.085,
          ease: "power4.out",
        },
        0.55,
      )
        .to(
          lineA,
          {
            letterSpacing: "-0.032em",
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
            duration: 1.4,
            stagger: 0.1,
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
      tl.to(credit, { opacity: 0.52, x: 0, duration: 1.35, ease: "power2.out" }, 1.25);

      // CTA arrives last — text first, then the underline draws.
      tl.to(cta, { opacity: 1, y: 0, duration: 1.1 }, 1.7)
        .to(ctaRule, { scaleX: 1, duration: 1.25, ease: "power2.inOut" }, 1.85);

      // Scroll cue surfaces quietly.
      tl.to(cue, { opacity: 1, duration: 1.0, ease: "power2.out" }, 2.25)
        .to(cueLabel, { opacity: 0.6, y: 0, duration: 0.9 }, 2.4);

      // Scroll-linked camera push + copy exhale.
      gsap.to(scaler, {
        scale: 1.12,
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(copy, {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom 20%",
          scrub: true,
        },
      });

      gsap.to([cue, cueLabel, credit], {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom 75%",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#070708]"
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

      {/* 1 — global color grade: pulls the whole frame 18% darker + adds a cool tone */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[rgba(8,8,10,0.22)]"
      />

      {/* 2 — edge vignette: keeps the eye centered, feels like a film-gate */}
      <div
        data-hero-vignette
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 82% 62% at 50% 52%, transparent 0%, transparent 42%, rgba(7,7,8,0.52) 92%, rgba(7,7,8,0.78) 100%)",
        }}
      />

      {/* 3 — left-column darkener: grounds the type without a visible edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(7,7,8,0.55) 0%, rgba(7,7,8,0.22) 28%, transparent 58%)",
        }}
      />

      {/* 4 — bottom copy-zone fade: tight, concentrated near the scroll edge */}
      <div
        data-hero-bottomfade
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(7,7,8,0.4) 42%, rgba(7,7,8,0.78) 78%, #070708 100%)",
        }}
      />

      {/* Pre-roll wipe — solid black that dissolves with the intro timeline */}
      <div
        data-hero-wipe
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#070708]"
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
        className="relative z-10 flex flex-1 items-center px-6 pb-28 pt-24 sm:px-10 sm:pb-32 md:px-20 md:pb-36 md:pt-32 lg:px-28 lg:pb-40"
      >
        <div className="layout-max w-full">
          <div className="max-w-[min(44rem,82vw)]">
            <h1
              id="hero-heading"
              className="font-instrument text-[2.9rem] leading-[0.94] tracking-[-0.038em] text-white sm:text-[4rem] md:text-[5.2rem] lg:text-[6.2rem] xl:text-[7.1rem]"
            >
              <span className="block">
                {LINE_A.map((w, i) => (
                  <span
                    key={`a-${i}`}
                    className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                  >
                    <span data-hero-a className="inline-block will-change-[transform,opacity]">
                      {w}
                    </span>
                  </span>
                ))}
              </span>
              <span className="mt-1 block italic text-white/80 sm:mt-2">
                {LINE_B.map((w, i) => (
                  <span
                    key={`b-${i}`}
                    className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                  >
                    <span data-hero-b className="inline-block will-change-[transform,opacity]">
                      {w}
                    </span>
                  </span>
                ))}
              </span>
            </h1>

            {/* Text-link CTA — dual-underline magazine style, no glass pill */}
            <div data-hero-cta className="mt-14 inline-block sm:mt-16 md:mt-20">
              <Link
                to="/kontakt"
                className="group relative inline-flex items-baseline gap-3 text-[15px] font-medium tracking-[-0.005em] text-white no-underline sm:text-[16px] md:text-[17px]"
                aria-label="Projekt besprechen"
              >
                <span className="relative pb-3">
                  <span className="font-ui">Ein Projekt besprechen</span>

                  {/* Static baseline rule — always present, restrained */}
                  <span
                    data-hero-cta-rule
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left bg-white/28"
                  />

                  {/* Hover sweep — draws a 100% white line across, then releases */}
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
          </div>
        </div>
      </div>

      {/* Scroll cue — thin breathing line + tiny § 00 folio */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-8"
      >
        <span data-hero-cue className="relative block h-11 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 block h-1/2 bg-gradient-to-b from-white/75 to-transparent magicks-hero-cue-line" />
        </span>
        <span
          data-hero-cue-label
          className="font-mono text-[9px] font-medium uppercase leading-none tracking-[0.42em] text-white/55 sm:text-[10px]"
        >
          § 00
        </span>
      </div>
    </section>
  );
}
