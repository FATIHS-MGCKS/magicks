import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  breathingScale,
  focusEnvelope,
  horizontalDrift,
  parallaxDrift,
  presenceEnvelope,
  sectionFarewell,
} from "../../lib/scrollMotion";
import { ChapterMarker } from "./ChapterMarker";
import { MagicksSignatureReveal } from "./MagicksSignatureReveal";

/**
 * About breathes as the user scrolls. Each element has its own envelope:
 * the oversized quote glyph drifts and dims; the two-line statement
 * arrives mask-wrapped and releases with a slow rise; the body clarifies
 * into its reading zone and softens on the way out; the editorial visual
 * gently floats in and out; CTA and signature sit at the tail, following
 * the same three-zone cadence.
 *
 * Nothing stays "revealed forever" — everything is a function of where
 * the section sits in the viewport.
 */
export function About() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const chapter = root.querySelector<HTMLElement>("[data-about-chapter]");
      const quote = root.querySelector<HTMLElement>("[data-about-quote]");
      const left = root.querySelector<HTMLElement>("[data-about-left]");
      const center = root.querySelector<HTMLElement>("[data-about-center]");
      const right = root.querySelector<HTMLElement>("[data-about-right]");
      const body = root.querySelector<HTMLElement>("[data-about-body]");
      const cta = root.querySelector<HTMLElement>("[data-about-cta]");
      const sign = root.querySelector<HTMLElement>("[data-about-sign]");
      const rule = root.querySelector<HTMLElement>("[data-about-rule]");
      const heading = root.querySelector<HTMLElement>("[data-about-heading]");
      const farewell = root.querySelector<HTMLElement>("[data-about-farewell]");
      const emphasis = root.querySelectorAll<HTMLElement>("[data-about-emphasis]");

      if (reduced) {
        gsap.set(
          [chapter, quote, left, center, right, body, cta, sign, rule, ...emphasis].filter(
            Boolean,
          ) as HTMLElement[],
          {
            opacity: 1,
            x: 0,
            y: 0,
            yPercent: 0,
            scale: 1,
            scaleX: 1,
            filter: "blur(0px)",
          },
        );
        if (farewell) gsap.set(farewell, { opacity: 0 });
        return;
      }

      // ─── Quote glyph: atmospheric drift + presence envelope ──────────
      // Stays as the compositional anchor. Its opacity breathes as the
      // section passes through the viewport, and it drifts down slowly
      // across the full range. The result is that no state feels "done"
      // — the glyph is always gently moving.
      gsap.set(quote, { opacity: 0, y: 18, scale: 0.96 });
      gsap.fromTo(
        quote,
        { opacity: 0, y: 18, scale: 0.96 },
        {
          opacity: 0.58,
          y: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            end: "top 35%",
            scrub: 1.0,
          },
        },
      );
      gsap.to(quote, {
        opacity: 0.1,
        scale: 1.03,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "bottom 55%",
          end: "bottom 10%",
          scrub: 1.0,
        },
      });
      parallaxDrift(quote, { trigger: root, from: -6, to: 18, scrub: true });
      // Tiny horizontal drift so the glyph never sits pinned. 1.5% total.
      horizontalDrift(quote, { trigger: root, from: -1.5, to: 1.5, scrub: true });

      // ─── Chapter marker: envelope + sub-drift ────────────────────────
      presenceEnvelope(chapter, {
        trigger: root,
        start: "top 98%",
        end: "top 32%",
        yFrom: 14,
        yTo: -8,
        blur: 3,
        holdRatio: 0.58,
      });
      // Ultra-subtle lateral drift — the marker isn't anchored to the
      // page grid, it belongs to the moment of reading.
      horizontalDrift(chapter, { trigger: root, from: -0.6, to: 0.6, scrub: true });

      // ─── Heading: "precise"-style focus collapse ─────────────────────
      // Inspiration: countdown.substraterx.com.
      //
      // Choreography is sequential, not parallel. Substraterx's beat:
      //   1. "precise" appears oversized and *holds* there for a long
      //      stretch of scrolling — the eye locks onto it.
      //   2. Continued scrolling shrinks it to its final size.
      //   3. Only then do the surrounding words glide in from the
      //      sides, around the (now small) anchor.
      //
      // We map that onto our scroll distance as four scroll-progress
      // bands:
      //
      //   0  ──── 12 % ─── fade-in (Center surfaces oversized)
      //  12 % ─── 42 % ─── hold     (Center stays big — the dwell)
      //  42 % ─── 72 % ─── collapse (Center scales down to 1)
      //  68 % ─── 100% ── slides   (Left & Right glide into place)
      //
      // The scroll range is `top 95% → top 28%` so the dwell happens
      // while the heading is still travelling up through the lower
      // half of the viewport, the collapse lands at roughly the
      // viewport mid-line, and the flanks finish a bit above mid —
      // exactly the rhythm of the reference site.
      //
      // `scrub: 1.4` lerps the playhead toward the actual scroll
      // position over 1.4 s, which is what makes the choreography
      // feel butter-smooth even with imperfect scrolling.
      const headingTrigger = heading ?? root;

      if (left && center && right) {
        gsap.set(center, {
          scale: 1.55,
          opacity: 0,
          transformOrigin: "0% 50%",
          willChange: "transform, opacity",
        });
        gsap.set(left, { x: -90, opacity: 0, willChange: "transform, opacity" });
        gsap.set(right, { x: 90, opacity: 0, willChange: "transform, opacity" });

        // Total timeline length ≈ 4.0 s; ScrollTrigger maps it onto
        // the 67 %-of-viewport scroll distance. Tween positions are
        // chosen so the four phases above land exactly on those
        // scroll-progress percentages.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headingTrigger,
            start: "top 95%",
            end: "top 28%",
            scrub: 1.4,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "power2.inOut" },
        });

        // Phase 1 (0 → ~12 %) — Center surfaces oversized.
        tl.to(center, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0);

        // Phase 2 (~12 → 42 %) — held by the absence of a tween.
        // GSAP keeps Center at scale 1.55 / opacity 1 until the next
        // tween starts at 1.7 s on the timeline (≈ 42 % of 4.0 s).

        // Phase 3 (~42 → 72 %) — Center collapses.
        tl.to(center, { scale: 1, duration: 1.2, ease: "power3.inOut" }, 1.7);

        // Phase 4 (~68 → 100 %) — Flanks glide in around the anchor.
        // Slight head-start vs. the collapse-end so the eye sees the
        // wings already approaching while the centre is still
        // settling, rather than landing in a vacuum.
        tl.to(left, { x: 0, opacity: 1, duration: 1.3, ease: "power2.inOut" }, 2.7)
          .to(right, { x: 0, opacity: 1, duration: 1.3, ease: "power2.inOut" }, 2.7);
      }

      // ─── Rule: bidirectional scale ───────────────────────────────────
      gsap.fromTo(
        rule,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rule,
            start: "top 85%",
            end: "top 55%",
            scrub: 0.9,
          },
        },
      );
      gsap.to(rule, {
        scaleX: 0.55,
        ease: "none",
        scrollTrigger: {
          trigger: rule,
          start: "top 30%",
          end: "bottom -30%",
          scrub: 1.0,
        },
      });

      // ─── Body copy: focus envelope with extended hold ────────────────
      // Soft ghost opacity at the edges, crisp in the reading zone. This
      // is where the user actually sits and reads — the hold is the
      // longest on the page (0.68) so the paragraph settles before
      // anything else moves.
      focusEnvelope(body, {
        trigger: body ?? root,
        start: "top 84%",
        end: "bottom 14%",
        blur: 3.5,
        opacityFloor: 0.22,
        focusOpacity: 1,
        holdRatio: 0.68,
      });

      // ─── Body emphasis: scrubbed color bloom ─────────────────────────
      // The "eine Arbeit" <em> brightens into full white as the body
      // passes through the reading zone, then releases. Not a reveal —
      // the word is legible from the start; the bloom is a *focus pull*
      // on meaning.
      if (emphasis.length) {
        emphasis.forEach((em) => {
          gsap.set(em, { color: "rgba(255,255,255,0.72)" });
          gsap
            .timeline({
              scrollTrigger: {
                trigger: em,
                start: "top 78%",
                end: "bottom 28%",
                scrub: 1.0,
                invalidateOnRefresh: true,
              },
              defaults: { ease: "none" },
            })
            .to(em, { color: "rgba(255,255,255,1)", duration: 0.45, ease: "power2.out" }, 0)
            .to(em, { color: "rgba(255,255,255,1)", duration: 0.25, ease: "none" }, 0.45)
            .to(em, { color: "rgba(255,255,255,0.78)", duration: 0.3, ease: "power2.in" }, 0.7);
        });
      }

      // ─── Editorial signature: scroll-coupled in/out envelope ─────────
      // The handwritten signature is the section's compositional anchor.
      // The wrapper plays a clean opacity + y + blur entry on enter
      // and reverses on leave (in either scroll direction). This stays
      // perfectly in sync with the inner MagicksSignatureReveal, which
      // uses the same toggleActions semantics on its own ScrollTrigger.
      // No scrub: the choreography keeps its premium pacing regardless
      // of scroll velocity.
      if (sign) {
        gsap.set(sign, { opacity: 0, y: 14, filter: "blur(3px)" });
        gsap.fromTo(
          sign,
          { opacity: 0, y: 14, filter: "blur(3px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sign,
              start: "top 88%",
              end: "bottom 12%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      }

      // ─── CTA: tail-end envelope ─────────────────────────────────────
      presenceEnvelope(cta, {
        trigger: cta ?? root,
        start: "top 94%",
        end: "bottom 0%",
        yFrom: 18,
        yTo: -6,
        blur: 2.5,
        holdRatio: 0.62,
      });

      // ─── Section farewell ────────────────────────────────────────────
      sectionFarewell(farewell, {
        trigger: root,
        peak: 1,
        start: "bottom 80%",
        end: "bottom -5%",
        scrub: 1.0,
      });

      // ─── Chapter breathing: extremely subtle scale pulse ─────────────
      // The chapter marker is a tiny typographic anchor. Breathing it
      // by 0.6% gives the header a *pulse* across the whole section
      // without any visible animation.
      breathingScale(chapter, {
        trigger: root,
        from: 0.996,
        peak: 1.006,
        to: 1.0,
        scrub: 1.6,
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="ueber"
      className="relative overflow-hidden bg-[#0B0A09] px-5 py-36 sm:px-8 sm:py-48 md:px-12 md:py-64 lg:px-12 lg:py-72 xl:px-16"
      aria-labelledby="about-heading"
    >
      <div aria-hidden className="section-top-rule" />

      {/* Oversized opening quote mark — floats as compositional anchor */}
      <div
        data-about-quote
        aria-hidden
        className="pointer-events-none absolute left-4 top-24 z-0 font-instrument leading-[0.72] text-white/18 will-change-[opacity,transform] sm:left-10 sm:top-28 sm:text-[12rem] md:left-16 md:top-32 md:text-[18rem] lg:left-24 lg:top-36 lg:text-[22rem]"
        style={{ fontSize: "clamp(8rem, 18vw, 22rem)" }}
      >
        “
      </div>

      <div className="relative z-10 layout-max">
        <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-14 lg:gap-16">
          <div data-about-chapter className="md:pt-2">
            <ChapterMarker num="04" label="Studio" />
          </div>

          <div className="max-w-[52rem] md:max-w-none">
            {/* "Precise"-style focus collapse heading.
                Layout matches the original two-line composition:
                  Line 1: "Wir sind keine klassische Agentur."
                  Line 2: "Zum Glück."   (italic, dimmed)
                Animation re-arranges the entry, not the layout:
                  · "Zum Glück." starts oversized in its final spot and
                    collapses on `expo.out` to scale 1 — the "precise"
                    beat that anchors the heading;
                  · "Wir sind keine" slides in from the left and
                    "klassische Agentur." slides in from the right,
                    both arriving slightly behind the collapse so the
                    eye tracks the center first. */}
            <h2
              id="about-heading"
              data-about-heading
              className="font-instrument text-[2.4rem] leading-[0.96] tracking-[-0.038em] text-white sm:text-[3.2rem] md:text-[3.8rem] lg:text-[4.4rem] xl:text-[5rem]"
            >
              <span className="block lg:whitespace-nowrap">
                <span
                  data-about-left
                  className="mr-[0.25em] inline-block will-change-[transform,opacity]"
                >
                  Wir sind keine
                </span>
                <span
                  data-about-right
                  className="inline-block will-change-[transform,opacity]"
                >
                  klassische Agentur.
                </span>
              </span>
              <span className="mt-2 block italic text-white/58 sm:mt-3">
                <span
                  data-about-center
                  className="inline-block will-change-[transform,opacity]"
                >
                  Zum Glück.
                </span>
              </span>
            </h2>

            <div className="mt-14 sm:mt-16 md:mt-20">
              <div aria-hidden className="relative h-px w-full max-w-[34rem]">
                <span
                  data-about-rule
                  className="absolute inset-0 block bg-gradient-to-r from-white/28 via-white/10 to-transparent"
                />
              </div>

              <div
                data-about-body
                className="mt-8 max-w-[40rem] will-change-[opacity,filter] sm:mt-10"
              >
                <p className="font-instrument text-[1.15rem] leading-[1.68] tracking-[-0.005em] text-white/78 sm:text-[1.25rem] md:text-[1.35rem]">
                  MAGICKS ist ein kleines, fokussiertes Studio aus Kassel. Wenige Projekte pro
                  Jahr — dafür mit voller Aufmerksamkeit.
                </p>
                <p className="font-instrument mt-5 text-[1.15rem] leading-[1.68] tracking-[-0.005em] text-white/78 sm:mt-6 sm:text-[1.25rem] md:mt-7 md:text-[1.35rem]">
                  Design, Code und Automation entstehen bei uns als{" "}
                  <em data-about-emphasis className="italic text-white">eine Arbeit</em>, nicht
                  als getrennte Abteilungen. Routine darf schneller werden. Konzept, Struktur und
                  Qualität bleiben bewusst menschlich.
                </p>
                <p className="font-instrument mt-5 text-[1.15rem] leading-[1.68] tracking-[-0.005em] text-white/78 sm:mt-6 sm:text-[1.25rem] md:mt-7 md:text-[1.35rem]">
                  Direkter Kontakt zu den Menschen, die bauen. Keine unnötigen Schleifen. Kein
                  Weiterreichen.
                </p>
              </div>
            </div>

            {/* Editorial signature — single compositional anchor for the
                section. The handwritten reveal replaces the previous
                studio photograph: it carries the same editorial weight
                and frames the section's tail without competing with the
                heading. Sized large, centred in the right column,
                surrounded by quiet whitespace. */}
            <figure
              data-about-sign
              className="mx-auto mt-14 flex w-full max-w-[34rem] flex-col items-center will-change-[opacity,transform,filter] sm:mt-20 sm:ml-auto sm:mr-0 sm:max-w-[36rem] md:mt-28 md:max-w-[42rem]"
            >
              <MagicksSignatureReveal className="w-full max-w-[28rem] sm:max-w-[32rem] md:max-w-[38rem]" />

              <figcaption className="font-mono mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 self-stretch text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-white/45 sm:mt-7 sm:gap-x-6 sm:text-[10px] sm:tracking-[0.32em] sm:text-white/42">
                <span className="flex items-center gap-2 sm:gap-3">
                  <span aria-hidden className="h-px w-5 bg-white/26 sm:w-8" />
                  <span>Studio · Kassel</span>
                </span>
                <span className="text-white/34">N51°19′ · E9°29′</span>
              </figcaption>
            </figure>

            <div
              data-about-cta
              className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 will-change-[opacity,transform,filter] sm:mt-20"
            >
              <Link
                to="/ueber-uns"
                className="font-ui group inline-flex min-h-11 items-center gap-3 py-1.5 text-[15px] text-white no-underline magicks-duration-hover magicks-ease-out transition-colors lg:min-h-0 lg:py-0"
              >
                <span className="underline decoration-white/22 decoration-[0.5px] underline-offset-[6px] magicks-duration-hover magicks-ease-out transition-[text-decoration-color] group-hover:decoration-white/80">
                  Mehr über das Studio
                </span>
                <span
                  aria-hidden
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/65 magicks-duration-hover magicks-ease-out transition-[background,border,color,transform] group-hover:translate-x-[1px] group-hover:border-white/32 group-hover:bg-white/8 group-hover:text-white"
                >
                  <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M3 11 L11 3 M5 3 H11 V9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>

              <span className="font-mono text-[11px] font-medium uppercase leading-snug tracking-[0.18em] text-white/42 sm:text-[10.5px] sm:leading-none sm:tracking-[0.3em] sm:text-white/38">
                Kassel · Nordhessen · Remote bundesweit
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section farewell — ink shadow handoff into Final CTA. */}
      <div
        data-about-farewell
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 will-change-[opacity]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(7,6,5,0.32) 58%, rgba(7,6,5,0.6) 100%)",
        }}
      />
    </section>
  );
}
