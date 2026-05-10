import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { sectionFarewell } from "../../lib/scrollMotion";

/**
 * Section 04 — Ihr Partner.
 *
 * Direct answer to the preceding ProblemSection: three final image cards
 * present MAGICKS as strategic, creative and technical partner. Each card
 * keeps artwork as base and renders headline/copy inside the image area.
 */

const PARTNER_CARDS = [
  {
    src: "/media/home/ihr partner (1).png",
    title: "Alles aus einer Hand",
    description:
      "Von Strategie, Content und Design bis Entwicklung, SEO und Hosting: alles greift ineinander.",
    alt: "Illustration zur Leistung Alles aus einer Hand",
  },
  {
    src: "/media/home/ihr partner (2).png",
    title: "Wir denken mit",
    description:
      "Wir setzen nicht einfach um. Wir verstehen Ihr Angebot, strukturieren Ihre Botschaft und denken den digitalen Auftritt weiter.",
    alt: "Illustration zur Leistung Wir denken mit",
  },
  {
    src: "/media/home/ihr partner (3).png",
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

      if (reduced) {
        gsap.set(
          [...introItems, ...cards, farewell].filter(Boolean) as HTMLElement[],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          },
        );
        if (farewell) gsap.set(farewell, { opacity: 0 });
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
              className="font-ui mx-auto mt-6 max-w-[26ch] text-[2.55rem] font-[660] leading-[1.02] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3.5rem] md:text-[4.55rem] lg:max-w-[26ch] lg:text-[5.45rem]"
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
                austauschbar wirkt, verliert. MAGICKS macht aus Ihrem ersten
                Eindruck ein Verkaufsargument.
              </p>
            </div>
          </div>

          <p
            data-about-intro
            className="font-ui mx-auto mt-14 max-w-[44rem] text-center text-[1.05rem] font-[620] leading-[1.38] tracking-[-0.014em] text-[rgb(var(--magicks-ink-rgb)/0.82)] sm:mt-16 sm:text-[1.18rem] lg:mt-20"
          >
            mit Design, Strategie, Technik und kreativer Umsetzung aus einer Hand.
          </p>

          <div
            className="mt-6 grid gap-5 sm:mt-8 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-7"
            aria-label="Drei Gründe für MAGICKS als Partner"
          >
            {PARTNER_CARDS.map((card) => (
              <article
                key={card.title}
                data-about-card
                className="group relative overflow-hidden rounded-[1.6rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-white/58 p-2 shadow-[0_28px_80px_-58px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.78)] transition-[transform,box-shadow,border-color] duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[rgb(var(--magicks-accent-line-rgb)/0.24)] hover:shadow-[0_42px_110px_-62px_rgba(20,28,44,0.44),inset_0_1px_0_rgba(255,255,255,0.86)] md:last:col-span-2 md:last:mx-auto md:last:max-w-[31rem] lg:last:col-span-1 lg:last:mx-0 lg:last:max-w-none"
              >
                <div className="relative overflow-hidden rounded-[1.25rem]">
                  <img
                    src={card.src}
                    alt={card.alt}
                    loading="lazy"
                    decoding="async"
                    width={1024}
                    height={1280}
                    className="block h-auto w-full rounded-[1.25rem] transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                  />

                  <div className="pointer-events-none absolute inset-x-[7.5%] top-[7.2%] max-w-[79%] text-left">
                    <h3 className="font-ui text-[clamp(1.7rem,5.1vw,3.7rem)] font-[650] leading-[1.01] tracking-[-0.036em] text-[rgba(8,26,58,0.97)]">
                      {card.title}
                    </h3>
                    <p className="font-ui mt-[clamp(0.55rem,1.2vw,0.95rem)] text-[clamp(0.94rem,2.15vw,1.66rem)] font-[470] leading-[1.46] tracking-[-0.01em] text-[rgba(42,56,82,0.82)]">
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
