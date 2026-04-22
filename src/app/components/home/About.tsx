import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ChapterMarker } from "./ChapterMarker";

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
      const line1 = gsap.utils.toArray<HTMLElement>("[data-about-l1]");
      const line2 = gsap.utils.toArray<HTMLElement>("[data-about-l2]");
      const body = root.querySelector<HTMLElement>("[data-about-body]");
      const cta = root.querySelector<HTMLElement>("[data-about-cta]");
      const sign = root.querySelector<HTMLElement>("[data-about-sign]");
      const rule = root.querySelector<HTMLElement>("[data-about-rule]");

      if (reduced) {
        gsap.set([chapter, quote, ...line1, ...line2, body, cta, sign, rule], {
          opacity: 1,
          y: 0,
          yPercent: 0,
          scale: 1,
          scaleX: 1,
        });
        return;
      }

      gsap.set(chapter, { opacity: 0, y: 14 });
      gsap.set(quote, { opacity: 0, y: 16, scale: 0.96 });
      gsap.set([line1, line2], { yPercent: 115, opacity: 0 });
      gsap.set(body, { opacity: 0, y: 16 });
      gsap.set(cta, { opacity: 0, y: 14 });
      gsap.set(sign, { opacity: 0, y: 10 });
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });

      gsap
        .timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: root, start: "top 72%", once: true },
        })
        .to(chapter, { opacity: 1, y: 0, duration: 0.85 }, 0)
        .to(quote, { opacity: 0.58, y: 0, scale: 1, duration: 2.0, ease: "power2.out" }, 0.1)
        .to(
          line1,
          { yPercent: 0, opacity: 1, duration: 1.45, stagger: 0.07, ease: "power1.out" },
          0.35,
        )
        .to(
          line2,
          { yPercent: 0, opacity: 1, duration: 1.55, stagger: 0.07, ease: "power1.out" },
          0.75,
        )
        .to(rule, { scaleX: 1, duration: 1.35, ease: "power2.inOut" }, 1.25)
        .to(body, { opacity: 1, y: 0, duration: 1.15 }, 1.35)
        .to(cta, { opacity: 1, y: 0, duration: 0.9 }, 1.8)
        .to(sign, { opacity: 0.78, y: 0, duration: 1.1 }, 1.9);

      // Subtle scroll drift on the quote mark — gives a slow parallax "breathing."
      gsap.to(quote, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const LINE_1 = ["Wir", "sind", "keine", "klassische", "Agentur."];
  const LINE_2 = ["Zum", "Glück."];

  return (
    <section
      ref={rootRef}
      id="ueber"
      className="relative overflow-hidden bg-[#0B0A09] px-5 py-36 sm:px-8 sm:py-48 md:px-12 md:py-64 lg:px-16 lg:py-72"
      aria-labelledby="about-heading"
    >
      <div aria-hidden className="section-top-rule" />

      {/* Oversized opening quote mark — floats as compositional anchor */}
      <div
        data-about-quote
        aria-hidden
        className="pointer-events-none absolute left-4 top-24 z-0 font-instrument leading-[0.72] text-white/18 sm:left-10 sm:top-28 sm:text-[12rem] md:left-16 md:top-32 md:text-[18rem] lg:left-24 lg:top-36 lg:text-[22rem]"
        style={{ fontSize: "clamp(8rem, 18vw, 22rem)" }}
      >
        “
      </div>

      <div className="relative z-10 layout-max">
        <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20">
          <div data-about-chapter className="md:pt-2">
            <ChapterMarker num="04" label="Studio" />
          </div>

          <div className="max-w-[52rem]">
            <h2
              id="about-heading"
              className="font-instrument text-[2.4rem] leading-[0.96] tracking-[-0.038em] text-white sm:text-[3.2rem] md:text-[4.2rem] lg:text-[5rem] xl:text-[5.6rem]"
            >
              <span className="block">
                {LINE_1.map((w, i) => (
                  <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
                    <span data-about-l1 className="inline-block">
                      {w}
                    </span>
                  </span>
                ))}
              </span>
              <span className="mt-2 block italic text-white/58 sm:mt-3">
                {LINE_2.map((w, i) => (
                  <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
                    <span data-about-l2 className="inline-block">
                      {w}
                    </span>
                  </span>
                ))}
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
                className="mt-8 max-w-[40rem] sm:mt-10"
              >
                <p className="font-instrument text-[1.15rem] leading-[1.68] tracking-[-0.005em] text-white/78 sm:text-[1.25rem] md:text-[1.35rem]">
                  MAGICKS arbeitet als kleines, fokussiertes Studio aus Kassel. Wenige Projekte pro
                  Jahr — dafür mit voller Aufmerksamkeit. Gestaltung, Web und Software laufen hier
                  als <em className="italic text-white">eine Arbeit</em>, nicht als getrennte
                  Abteilungen. Wir glauben, dass gute digitale Arbeit sichtbar wird — nicht durch
                  Effekte, sondern durch Substanz, Ruhe und Systeme, die auch in zwei Jahren noch
                  Sinn ergeben.
                </p>
              </div>
            </div>

            <div
              data-about-cta
              className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-5 sm:mt-16"
            >
              <Link
                to="/ueber-uns"
                className="font-ui group inline-flex items-center gap-3 text-[15px] text-white no-underline magicks-duration-hover magicks-ease-out transition-colors"
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

              <span className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.3em] text-white/38">
                Kassel · Nordhessen · Remote bundesweit
              </span>
            </div>

            {/* Signature line — bottom-right, ultra-small */}
            <div
              data-about-sign
              className="mt-20 flex items-center justify-end gap-4 sm:mt-24"
            >
              <span aria-hidden className="h-px w-16 bg-white/22" />
              <span className="font-instrument text-[0.95rem] italic text-white/55">Magicks</span>
              <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/35">
                · Studio
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
