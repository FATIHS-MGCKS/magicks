import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { prefersCheapMotion, sectionFarewell } from "../../lib/scrollMotion";

/**
 * Section 04 — Ihr Partner.
 *
 * Direct answer to the preceding ProblemSection: three final image cards
 * present MAGICKS as strategic, creative and technical partner. Each card
 * keeps artwork as base and renders headline/copy inside the image area.
 */

const PARTNER_CARDS = [
  {
    src: "/media/home/alles-aus-einer-hand.png",
    title: "Alles aus einer Hand",
    description:
      "Von Strategie, Content und Design bis Entwicklung, SEO und Hosting: alles greift ineinander.",
    alt: "Illustration zur Leistung Alles aus einer Hand",
  },
  {
    src: "/media/home/wir-denken-mit.png",
    title: "Wir denken mit",
    description:
      "Wir setzen nicht einfach um. Wir verstehen Ihr Angebot, strukturieren Ihre Botschaft und denken den digitalen Auftritt weiter.",
    alt: "Illustration zur Leistung Wir denken mit",
  },
  {
    src: "/media/home/fuer-wirkung-gebaut.png",
    title: "Für Wirkung gebaut",
    description:
      "Sichtbarkeit, Performance und Nutzerführung werden von Anfang an mitgedacht — damit Ihr Auftritt nicht nur gut aussieht, sondern arbeitet.",
    alt: "Illustration zur Leistung Für Wirkung gebaut",
  },
] as const;

export function About() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const introItems = gsap.utils.toArray<HTMLElement>("[data-about-intro]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-about-card]");
      const farewell = root.querySelector<HTMLElement>("[data-about-farewell]");
      const lightLeak = root.querySelector<HTMLElement>("[data-about-lightleak]");
      const cheapMotion = prefersCheapMotion();

      if (reduced) {
        gsap.set(
          [...introItems, ...cards, farewell, lightLeak].filter(Boolean) as HTMLElement[],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          },
        );
        if (farewell) gsap.set(farewell, { opacity: 0 });
        if (lightLeak) gsap.set(lightLeak, { opacity: 0 });
        return;
      }

      const edgeGlow = root.querySelector<HTMLElement>("[data-about-edgeglow]");
      if (edgeGlow) {
        gsap.fromTo(
          edgeGlow,
          { xPercent: -100, opacity: 0 },
          {
            xPercent: 100,
            opacity: 0.62,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.0,
            },
          },
        );
      }

      if (lightLeak) {
        gsap.set(lightLeak, { opacity: 0, xPercent: -5, yPercent: -3, scale: 0.98 });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: cards[0] ?? root,
              start: "top 88%",
              end: "bottom 30%",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
            defaults: { ease: "none" },
          })
          .to(lightLeak, { opacity: cheapMotion ? 0.1 : 0.24, xPercent: 0, yPercent: 0, scale: 1, duration: 0.38, ease: "power2.out" }, 0)
          .to(lightLeak, { opacity: cheapMotion ? 0.12 : 0.3, xPercent: 3, yPercent: 2, scale: 1.02, duration: 0.3, ease: "none" }, 0.38)
          .to(lightLeak, { opacity: 0.04, xPercent: 7, yPercent: 5, scale: 1.04, duration: 0.32, ease: "power2.in" }, 0.68);
      }

      gsap.fromTo(
        introItems,
        { opacity: 0, y: 24, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.075,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 28, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cards[0] ?? root,
            start: "top 86%",
            end: "top 54%",
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        },
      );

      sectionFarewell(farewell, {
        trigger: root,
        peak: 1,
        start: "bottom 80%",
        end: "bottom -5%",
        scrub: 1.0,
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="ueber"
      className="relative overflow-hidden bg-[var(--magicks-bg-lifted)] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-12 lg:py-52 xl:px-16"
      aria-labelledby="about-heading"
    >
      <div aria-hidden className="section-top-rule" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 54% 40% at 18% 10%, rgba(34,44,64,0.075), transparent 70%), radial-gradient(ellipse 44% 34% at 84% 80%, rgba(255,255,255,0.22), transparent 74%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(20,20,20,0.2) 1.6px, transparent 1.65px)",
          backgroundPosition: "center top",
          backgroundSize: "56px 56px",
          mixBlendMode: "multiply",
          opacity: 0.72,
        }}
      />

      <div
        data-about-lightleak
        aria-hidden
        className="pointer-events-none absolute -inset-x-[30%] top-[16%] z-0 h-[62%] origin-center rotate-[-12deg] will-change-[opacity,transform]"
        style={{
          background:
            "linear-gradient(105deg, transparent 24%, rgba(255,250,236,0.16) 39%, rgba(220,190,142,0.2) 48%, rgba(255,253,246,0.14) 57%, transparent 74%)",
          mixBlendMode: "soft-light",
        }}
      />

      {/* Edge Glow — wandering light along the top border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] overflow-hidden"
      >
        <div
          data-about-edgeglow
          className="h-full w-1/2 bg-gradient-to-r from-transparent via-[rgb(var(--magicks-line-rgb)/0.3)] to-transparent blur-[1px] will-change-[transform,opacity]"
        />
      </div>

      <div className="relative z-10 layout-max">
        <div className="mx-auto max-w-[86rem]">
          <div className="mx-auto max-w-[68rem] text-center">
            <span
              data-about-intro
              className="mx-auto inline-flex items-center gap-3 rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.22)] bg-[rgb(var(--magicks-accent-rgb)/0.07)] px-3 py-2 font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.78)] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] sm:text-[11px] sm:tracking-[0.22em]"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--magicks-accent-rgb)/0.72)]"
              />
              Ein Partner, der mitdenkt.
            </span>

            <h2
              id="about-heading"
              data-about-intro
              className="font-ui mx-auto mt-6 max-w-[26ch] text-[2.55rem] font-[660] leading-[1.02] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3.5rem] md:text-[76px] lg:max-w-[26ch] lg:text-[5.45rem]"
            >
              <span className="block">Wir bauen keine</span>
              <span className="block whitespace-nowrap font-instrument italic font-normal text-[rgb(var(--magicks-ink-rgb)/0.64)]">
                irgendwie oder reicht schon
              </span>
              <span className="block">Webseiten</span>
            </h2>

            <div
              data-about-intro
              className="mx-auto mt-9 max-w-[52rem] text-balance sm:mt-11"
            >
              <div className="font-ui rounded-[1.2rem] border border-[rgb(var(--magicks-line-rgb)/0.08)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] px-5 py-6 text-center text-[1.02rem] font-[500] leading-[1.66] tracking-[-0.008em] text-[rgb(var(--magicks-ink-rgb)/0.74)] shadow-[0_24px_70px_-58px_rgba(20,28,44,0.3),inset_0_1px_0_rgba(255,255,255,0.74)] sm:px-7 sm:py-7 sm:text-[1.1rem] md:text-[20px]">
                <div className="mx-auto max-w-[45rem]">
                  <p className="m-0">
                    <span className="block">
                      <strong className="font-[720] text-[rgb(var(--magicks-ink-rgb)/0.94)]">
                        3 Sekunden.
                      </strong>{" "}
                      Mehr Zeit bleibt oft nicht.
                    </span>
                    <span className="block">Dann entscheidet ein potenzieller Kunde,</span>
                    <span className="block">ob er bleibt, vertraut — oder weitersucht.</span>
                  </p>

                  <p className="m-0 mt-8 sm:mt-9">
                    <span className="block">Wir sorgen dafür, dass diese 3 Sekunden</span>
                    <span className="block">für Sie arbeiten.</span>
                  </p>

                  <p className="m-0 mt-8 sm:mt-9">
                    <span className="block">Als Ihr Partner für Strategie, Design,</span>
                    <span className="block">
                      Inhalt und Technik machen wir Ihre Botschaft
                    </span>
                    <span className="block">sichtbar, verständlich und überzeugend.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-6 grid items-stretch gap-5 sm:mt-8 md:gap-6 lg:grid-cols-3 lg:gap-7"
            aria-label="Drei Gründe für MAGICKS als Partner"
          >
            {PARTNER_CARDS.map((card) => (
              <article
                key={card.title}
                data-about-card
                className="group relative isolate flex h-full overflow-hidden rounded-[1.7rem] border border-[rgb(var(--magicks-line-rgb)/0.11)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.92)] p-5 shadow-[0_28px_84px_-58px_rgba(20,28,44,0.38),inset_0_1px_0_rgba(255,255,255,0.82)] transition-[transform,box-shadow,border-color] duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[rgb(var(--magicks-accent-line-rgb)/0.18)] hover:shadow-[0_42px_112px_-62px_rgba(20,28,44,0.46),inset_0_1px_0_rgba(255,255,255,0.9)] sm:p-6"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.74)_0%,rgba(248,244,235,0.72)_46%,rgba(239,233,221,0.58)_100%)]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-[9%] bottom-[6%] z-0 h-[34%] rounded-full bg-[rgba(183,158,117,0.13)] blur-2xl transition-opacity duration-[720ms] group-hover:opacity-80"
                />

                <div className="relative z-10 grid min-h-[23rem] w-full grid-rows-[auto_1fr] overflow-visible px-1 pb-0 pt-3 sm:min-h-[24rem] sm:px-2 sm:pt-4 lg:min-h-[25rem]">
                  <div className="mx-auto flex min-h-[9.75rem] max-w-[18rem] flex-col items-center text-center sm:min-h-[10.25rem]">
                    <h3 className="font-ui min-h-[3.9rem] text-[28px] font-[720] leading-[1.02] tracking-[-0.035em] text-[rgb(var(--magicks-ink-rgb)/0.94)]">
                      {card.title}
                    </h3>
                    <p className="font-ui mx-auto mt-3 max-w-[17.5rem] text-[0.9rem] font-[600] leading-[1.52] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.66)] sm:text-[0.95rem] lg:min-h-[5.8rem]">
                      {card.description}
                    </p>
                  </div>

                  <div className="relative flex min-h-[11.5rem] items-end justify-center pt-1 sm:min-h-[12.25rem] sm:pt-2 lg:min-h-[12.75rem]">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-[8%] bottom-2 h-[38%] rounded-full bg-[linear-gradient(90deg,transparent,rgba(187,163,124,0.18),transparent)] blur-xl"
                    />
                    <img
                      src={card.src}
                      alt={card.alt}
                      loading="lazy"
                      decoding="async"
                      width={1024}
                      height={1280}
                      className="relative z-10 block h-auto max-h-[16rem] w-[112%] max-w-[27rem] object-contain object-bottom drop-shadow-[0_22px_34px_rgba(20,28,44,0.14)] transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-[-3px] group-hover:scale-[1.015] sm:max-h-[17.5rem] lg:w-[114%] lg:max-w-[28rem]"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div
        data-about-farewell
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 will-change-[opacity]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(46,56,76,0.05) 58%, rgba(46,56,76,0.12) 100%)",
        }}
      />
    </section>
  );
}
