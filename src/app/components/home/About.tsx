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
    src: "/media/home/alles-aus-einer-hand.webp",
    title: "Alles aus einer Hand",
    description:
      "Von Strategie, Content und Design bis Entwicklung, SEO und Hosting: alles greift ineinander.",
    alt: "Illustration zur Leistung Alles aus einer Hand",
  },
  {
    src: "/media/home/wir-denken-mit.webp",
    title: "Wir denken mit",
    description:
      "Wir setzen nicht einfach um. Wir verstehen Ihr Angebot, strukturieren Ihre Botschaft und denken den digitalen Auftritt weiter.",
    alt: "Illustration zur Leistung Wir denken mit",
  },
  {
    src: "/media/home/für-wirkung-gebaut.webp",
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
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 54% 40% at 18% 10%, rgba(34,44,64,0.075), transparent 70%), radial-gradient(ellipse 44% 34% at 84% 80%, rgba(255,255,255,0.22), transparent 74%)",
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
              <p className="font-ui rounded-[1.2rem] border border-[rgb(var(--magicks-line-rgb)/0.08)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] px-5 py-5 text-[1.02rem] font-[470] leading-[1.68] tracking-[-0.006em] text-justify text-[rgb(var(--magicks-ink-rgb)/0.74)] shadow-[0_24px_70px_-58px_rgba(20,28,44,0.3),inset_0_1px_0_rgba(255,255,255,0.74)] sm:px-6 sm:py-6 sm:text-[1.1rem]">
                Sie haben nur wenige Sekunden, bis ein potenzieller Kunde
                entscheidet, ob er bleibt oder weiterklickt und wer
                austauschbar wirkt, verliert.{" "}
                <span className="mx-[0.08em] inline-flex items-center align-middle leading-none">
                  <img
                    src="/magicks-logo.webp"
                    alt="MAGICKS"
                    width={977}
                    height={354}
                    decoding="async"
                    className="h-[2.22em] w-auto"
                    style={{ filter: "brightness(0) saturate(100%)" }}
                  />
                </span>{" "}
                macht aus Ihrem ersten
                Eindruck ein Verkaufsargument.
              </p>
            </div>
          </div>

          <div
            className="mt-6 grid gap-5 sm:mt-8 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-7"
            aria-label="Drei Gründe für MAGICKS als Partner"
          >
            {PARTNER_CARDS.map((card) => (
              <article
                key={card.title}
                data-about-card
                className="group relative overflow-hidden rounded-[1.6rem] bg-transparent shadow-[0_28px_80px_-58px_rgba(20,28,44,0.34)] transition-[transform,box-shadow] duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_42px_110px_-62px_rgba(20,28,44,0.44)] md:last:col-span-2 md:last:mx-auto md:last:max-w-[31rem] lg:last:col-span-1 lg:last:mx-0 lg:last:max-w-none"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
                  <img
                    src={card.src}
                    alt={card.alt}
                    loading="lazy"
                    decoding="async"
                    width={1024}
                    height={1280}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                  />

                  <div className="pointer-events-none absolute inset-x-[calc(7.5%+20px)] top-[7.2%] max-w-[calc(79%-40px)] text-left">
                    <h3 className="font-ui text-[clamp(1.18rem,3vw,1.76rem)] font-[720] leading-[1.04] tracking-[-0.028em] text-[rgba(8,26,58,0.97)]">
                      {card.title}
                    </h3>
                    <p className="font-ui mt-[clamp(0.42rem,0.85vw,0.64rem)] text-[clamp(0.74rem,1.18vw,0.88rem)] font-[560] leading-[1.46] tracking-[-0.004em] text-[rgba(42,56,82,0.84)]">
                      {card.description}
                    </p>
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
