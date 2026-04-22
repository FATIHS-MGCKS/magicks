import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ChapterMarker } from "./ChapterMarker";

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

      if (reduced) {
        gsap.set(
          [chapter, ...lineAWords, ...lineBWords, rule, ...ledger, cta, halo, ...runEnd],
          { opacity: 1, y: 0, yPercent: 0, scale: 1, scaleX: 1 },
        );
        return;
      }

      gsap.set(chapter, { opacity: 0, y: 14 });
      gsap.set([lineAWords, lineBWords], { yPercent: 118, opacity: 0 });
      gsap.set(rule, { scaleX: 0, transformOrigin: "center" });
      gsap.set(ledger, { opacity: 0, y: 14 });
      gsap.set(cta, { opacity: 0, y: 18, scale: 0.96 });
      gsap.set(halo, { opacity: 0, scale: 0.86 });
      gsap.set(runEnd, { opacity: 0, y: 6 });

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 70%", once: true },
        })
        .to(halo, { opacity: 1, scale: 1, duration: 1.8, ease: "power2.out" }, 0)
        .to(chapter, { opacity: 1, y: 0, duration: 0.9 }, 0.15)
        .to(
          lineAWords,
          { yPercent: 0, opacity: 1, duration: 1.05, stagger: 0.05, ease: "power4.out" },
          0.28,
        )
        .to(
          lineBWords,
          { yPercent: 0, opacity: 1, duration: 1.05, stagger: 0.05, ease: "power4.out" },
          0.52,
        )
        .to(rule, { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, 0.95)
        .to(cta, { opacity: 1, y: 0, scale: 1, duration: 0.95, ease: "back.out(1.25)" }, 1.2)
        .to(ledger, { opacity: 1, y: 0, duration: 0.95, stagger: 0.1 }, 1.35)
        .to(runEnd, { opacity: 0.55, y: 0, duration: 1.0, stagger: 0.12 }, 1.75);

      // Subtle halo contraction after arrival — pulls the eye toward the CTA.
      gsap.to(halo, {
        scale: 0.92,
        opacity: 0.75,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 30%",
          end: "bottom bottom",
          scrub: true,
        },
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
        className="pointer-events-none absolute left-1/2 top-[44%] z-0 aspect-square w-[130vw] max-w-[1300px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.018) 28%, transparent 62%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 72% 62% at 50% 46%, black, transparent)",
        }}
      />

      <div className="relative z-10 layout-max">
        <div className="mx-auto max-w-[68rem] text-center">
          <div data-fc-chapter className="mb-14 inline-flex sm:mb-20">
            <ChapterMarker num="Kontakt / 05" label="Abschluss" align="center" />
          </div>

          <h2
            id="fc-heading"
            className="font-instrument text-[3.2rem] leading-[0.9] tracking-[-0.04em] text-white sm:text-[4.8rem] md:text-[6.2rem] lg:text-[7.6rem] xl:text-[8.4rem]"
          >
            <span className="block">
              {LINE_A.map((w, i) => (
                <span key={i} className="mr-[0.18em] inline-block overflow-hidden align-bottom">
                  <span data-fc-a className="inline-block">
                    {w}
                  </span>
                </span>
              ))}
            </span>
            <span className="mt-1 block italic text-white/84 sm:mt-2">
              {LINE_B.map((w, i) => (
                <span key={i} className="mr-[0.18em] inline-block overflow-hidden align-bottom">
                  <span data-fc-b className="inline-block">
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
            <div data-fc-cta className="flex justify-center sm:justify-start">
              <Link
                to="/kontakt"
                className="group relative inline-flex items-center gap-3 rounded-full border border-white/22 bg-white py-4 pl-8 pr-3 text-[15px] font-medium tracking-wide text-[#0A0A0A] no-underline shadow-[0_34px_80px_-32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.45)] magicks-duration-hover magicks-ease-out transition-[transform,box-shadow] hover:-translate-y-[2px] hover:shadow-[0_44px_90px_-28px_rgba(0,0,0,1),inset_0_1px_0_rgba(255,255,255,0.55)] active:translate-y-0 active:scale-[0.985] md:text-[16px]"
              >
                <span>Unverbindlich anfragen</span>
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
              <div data-fc-ledger className="flex flex-col gap-1">
                <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/40 sm:text-[10.5px]">
                  Direkt
                </span>
                <a
                  href="mailto:hello@magicks.studio"
                  className="font-instrument text-[1.25rem] italic text-white no-underline magicks-duration-hover magicks-ease-out transition-colors hover:text-white/82 sm:text-[1.45rem] md:text-[1.6rem]"
                >
                  hello@magicks.studio
                </a>
              </div>

              <div data-fc-ledger className="flex flex-col gap-1.5">
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

        {/* Bottom-edge run-end — cinema colophon */}
        <div className="mt-24 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-7 sm:mt-32 sm:flex-row">
          <span data-fc-runend className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/45 sm:text-[10.5px]">
            § End — Magicks · MMXXVI
          </span>
          <span data-fc-runend aria-hidden className="hidden h-px w-20 bg-white/14 sm:block" />
          <span data-fc-runend className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/45 sm:text-[10.5px]">
            Kassel / DE · DE & EN
          </span>
        </div>
      </div>
    </section>
  );
}
