import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  atmosphericField,
  focusEnvelope,
  presenceEnvelope,
} from "../../lib/scrollMotion";
import { ChapterMarker } from "./ChapterMarker";

/**
 * Final CTA — the closing cinematic frame.
 *
 * Every element follows the same three-zone envelope: it builds into the
 * focus zone, holds for as long as the user dwells there, then gently
 * releases. The halo lives as an atmospheric field, breathing in and out
 * rather than snapping. The button is a slow presence build — no springy
 * back-ease, no bouncy settle. Mature, decisive, expensive.
 */
export function FinalCTA() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const chapter = root.querySelector<HTMLElement>("[data-fc-chapter]");
      const lineAWords = gsap.utils.toArray<HTMLElement>("[data-fc-a]");
      const lineBWords = gsap.utils.toArray<HTMLElement>("[data-fc-b]");
      const rule = root.querySelector<HTMLElement>("[data-fc-rule]");
      const ledger = gsap.utils.toArray<HTMLElement>("[data-fc-ledger]");
      const cta = root.querySelector<HTMLElement>("[data-fc-cta]");
      const halo = root.querySelector<HTMLElement>("[data-fc-halo]");
      const runEnd = gsap.utils.toArray<HTMLElement>("[data-fc-runend]");
      const grid = root.querySelector<HTMLElement>("[data-fc-grid]");
      const ground = root.querySelector<HTMLElement>("[data-fc-ground]");
      const heading = root.querySelector<HTMLElement>("[data-fc-heading]");

      if (reduced) {
        gsap.set(
          [chapter, ...lineAWords, ...lineBWords, rule, ...ledger, cta, halo, ...runEnd, grid, ground],
          { opacity: 1, y: 0, yPercent: 0, scale: 1, scaleX: 1, filter: "blur(0px)" },
        );
        if (ground) gsap.set(ground, { opacity: 0 });
        return;
      }

      // ─── Halo: atmospheric field ─────────────────────────────────────
      // The halo is never snapped in — it grows from a soft baseline as
      // the section enters, peaks mid-section, and eases back down as it
      // leaves. The scrub is deliberately slow (1.8) so the motion reads
      // like a light source coming up, not an effect turning on.
      atmosphericField(halo, {
        trigger: root,
        baseOpacity: 0,
        peakOpacity: 1,
        scale: [0.88, 1.02],
        scrub: 1.8,
        start: "top bottom",
        end: "bottom top",
      });

      // Grid plate — same long breathing, lower amplitude. Sits under
      // the halo; together they read as a single atmospheric layer.
      if (grid) {
        atmosphericField(grid, {
          trigger: root,
          baseOpacity: 0,
          peakOpacity: 0.32,
          scale: [1.04, 1.0],
          scrub: 2.0,
        });
      }

      // ─── Ground-light wash ───────────────────────────────────────────
      // A very slow, very soft light that rises from below as the user
      // approaches the page end. It's not a vignette — it's a *stage
      // light from the floor*, the cinematic equivalent of the lights
      // coming up in a theatre at the end of a film.
      if (ground) {
        gsap.set(ground, { opacity: 0 });
        gsap.fromTo(
          ground,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 55%",
              end: "bottom 15%",
              scrub: 1.4,
            },
          },
        );
      }

      // ─── Chapter marker ──────────────────────────────────────────────
      presenceEnvelope(chapter, {
        trigger: root,
        start: "top 96%",
        end: "top 30%",
        yFrom: 14,
        yTo: -8,
        blur: 3,
        holdRatio: 0.62,
      });

      // ─── Headline: scrubbed mask-reveal, bidirectional ───────────────
      // "Projekt" and "besprechen." each ride a yPercent mask. The scrub
      // ties the arrival to scroll position, and the exit softens with
      // a gentle blur + rise rather than holding hard.
      const headingTrigger = heading ?? root;

      const animateMaskedWord = (w: HTMLElement, eStart: number, eEnd: number) => {
        gsap.set(w, { yPercent: 118, opacity: 0 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headingTrigger,
            start: "top 78%",
            end: "bottom 35%",
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "none" },
        });
        tl.fromTo(
          w,
          { yPercent: 118, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: eEnd - eStart, ease: "power2.out" },
          eStart,
        );
        tl.to(w, { yPercent: 0, opacity: 1, duration: 0.7 - eEnd, ease: "none" }, eEnd);
        tl.to(w, { yPercent: -18, opacity: 0.32, duration: 0.28, ease: "power2.in" }, 0.7);
      };

      lineAWords.forEach((w, i) => animateMaskedWord(w, 0.05 + i * 0.04, 0.26 + i * 0.04));
      lineBWords.forEach((w, i) => animateMaskedWord(w, 0.22 + i * 0.035, 0.44 + i * 0.035));

      // ─── Editorial rule: bidirectional scale ─────────────────────────
      gsap.fromTo(
        rule,
        { scaleX: 0, transformOrigin: "center center" },
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
        scaleX: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: rule,
          start: "top 25%",
          end: "bottom -30%",
          scrub: 1.0,
        },
      });

      // ─── CTA button: mature presence build, no spring ────────────────
      // Gentle entry from below + soft blur release — no `back.out`, no
      // overshoot. The button holds for most of the hold zone and then
      // eases out cleanly as the section exits.
      presenceEnvelope(cta, {
        trigger: cta ?? root,
        start: "top 90%",
        end: "bottom 10%",
        yFrom: 22,
        yTo: -10,
        blur: 3,
        holdRatio: 0.62,
      });

      // ─── Ledger block: focus envelope ────────────────────────────────
      focusEnvelope(ledger as HTMLElement[], {
        start: "top 86%",
        end: "bottom 12%",
        blur: 3,
        opacityFloor: 0.18,
        focusOpacity: 1,
        holdRatio: 0.58,
      });

      // ─── Run-end colophon: softer tail ───────────────────────────────
      focusEnvelope(runEnd as HTMLElement[], {
        start: "top 95%",
        end: "bottom 50%",
        blur: 2.5,
        opacityFloor: 0.12,
        focusOpacity: 0.55,
        holdRatio: 0.66,
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const LINE_A = ["Projekt"];
  const LINE_B = ["besprechen."];

  return (
    <section
      ref={rootRef}
      id="kontakt"
      className="relative overflow-hidden bg-[#070708] px-5 pb-24 pt-32 sm:px-8 sm:pb-28 sm:pt-40 md:px-12 md:pb-32 md:pt-48 lg:px-16 lg:pb-40 lg:pt-56"
      aria-labelledby="fc-heading"
    >
      <div aria-hidden className="section-top-rule" />

      <div
        data-fc-halo
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[44%] z-0 aspect-square w-[130vw] max-w-[1300px] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-[opacity,transform]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.018) 28%, transparent 62%)",
        }}
      />
      <div
        data-fc-grid
        aria-hidden
        className="pointer-events-none absolute inset-0 will-change-[opacity,transform]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 72% 62% at 50% 46%, black, transparent)",
        }}
      />

      <div className="relative z-10 layout-max">
        <div className="mx-auto max-w-[68rem] text-center">
          <div data-fc-chapter className="mb-14 inline-flex will-change-[opacity,transform] sm:mb-20">
            <ChapterMarker num="Kontakt / 05" label="Abschluss" align="center" />
          </div>

          <h2
            id="fc-heading"
            data-fc-heading
            className="font-instrument text-[3.2rem] leading-[0.9] tracking-[-0.04em] text-white sm:text-[4.8rem] md:text-[6.2rem] lg:text-[7.6rem] xl:text-[8.4rem]"
          >
            <span className="block">
              {LINE_A.map((w, i) => (
                <span key={i} className="mr-[0.18em] inline-block overflow-hidden align-bottom">
                  <span data-fc-a className="inline-block will-change-transform">
                    {w}
                  </span>
                </span>
              ))}
            </span>
            <span className="mt-1 block italic text-white/84 sm:mt-2">
              {LINE_B.map((w, i) => (
                <span key={i} className="mr-[0.18em] inline-block overflow-hidden align-bottom">
                  <span data-fc-b className="inline-block will-change-transform">
                    {w}
                  </span>
                </span>
              ))}
            </span>
          </h2>

          {/* Editorial rule — draws in from center */}
          <div className="mx-auto mt-12 flex w-full max-w-[42rem] items-center gap-4 sm:mt-16">
            <span aria-hidden className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40">
              ·
            </span>
            <div aria-hidden className="relative h-px flex-1">
              <span
                data-fc-rule
                className="absolute inset-0 block bg-gradient-to-r from-transparent via-white/60 to-transparent"
              />
            </div>
            <span aria-hidden className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.36em] text-white/40">
              ·
            </span>
          </div>

          {/* Ledger block — CTA left, email + response metadata right */}
          <div className="mt-14 grid items-center gap-10 text-left sm:mt-16 sm:grid-cols-[auto_1fr] sm:gap-14 md:gap-20">
            <div data-fc-cta className="flex justify-center will-change-[opacity,transform,filter] sm:justify-start">
              <Link
                to="/kontakt"
                className="group relative inline-flex items-center gap-3 rounded-full border border-white/22 bg-white py-4 pl-8 pr-3 text-[15px] font-medium tracking-wide text-[#0A0A0A] no-underline shadow-[0_2px_4px_-1px_rgba(0,0,0,0.35),0_34px_80px_-32px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.48)] magicks-ease-out [transition:transform_640ms_cubic-bezier(0.22,1,0.36,1),box-shadow_640ms_cubic-bezier(0.22,1,0.36,1),letter-spacing_640ms_cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1.5px] hover:tracking-[0.03em] hover:shadow-[0_3px_6px_-1px_rgba(0,0,0,0.42),0_56px_120px_-28px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.6)] active:translate-y-0 active:scale-[0.99] md:text-[16px]"
              >
                <span>Unverbindlich anfragen</span>
                <span
                  aria-hidden
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A0A0A] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] [transition:transform_720ms_cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
                >
                  <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M3 11 L11 3 M5 3 H11 V9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </div>

            <div className="flex flex-col gap-4 border-l border-white/[0.08] pl-6 sm:pl-10 md:pl-12">
              <div data-fc-ledger className="flex flex-col gap-1 will-change-[opacity,filter]">
                <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                  Direkt
                </span>
                <a
                  href="mailto:hello@magicks.de"
                  className="font-instrument text-[1.25rem] italic text-white no-underline magicks-duration-hover magicks-ease-out transition-colors hover:text-white/82 sm:text-[1.45rem] md:text-[1.6rem]"
                >
                  hello@magicks.de
                </a>
              </div>

              <div data-fc-ledger className="flex flex-col gap-1.5 will-change-[opacity,filter]">
                <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                  Antwort
                </span>
                <span className="font-ui text-[13.5px] leading-[1.5] text-white/62 sm:text-[14.5px]">
                  In der Regel binnen 24 Stunden — werktags.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ground-light wash — rises from below as the page closes.
          Atmospheric; builds through the entire section, peaks near
          the bottom. Mature, cinematic, never loud. */}
      <div
        data-fc-ground
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[55%] will-change-[opacity]"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.012) 36%, transparent 68%)",
        }}
      />

      {/* Bottom-edge run-end — cinema colophon */}
        <div className="mt-24 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-7 sm:mt-32 sm:flex-row">
          <span data-fc-runend className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/45 will-change-[opacity,filter] sm:text-[10.5px]">
            § End — Magicks · MMXXVI
          </span>
          <span data-fc-runend aria-hidden className="hidden h-px w-20 bg-white/14 will-change-[opacity,filter] sm:block" />
          <span data-fc-runend className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/45 will-change-[opacity,filter] sm:text-[10.5px]">
            Kassel / DE · DE & EN
          </span>
        </div>
      </div>
    </section>
  );
}
