import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { sectionFarewell } from "../../lib/scrollMotion";

/**
 * Section 04 — Ihr Partner.
 *
 * Direct answer to the preceding ProblemSection: three final image cards
 * present MAGICKS as strategic, creative and technical partner. Each card
 * keeps the visual artwork and renders title + supporting copy directly
 * inside the image area as an overlay.
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
              className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.22em] text-[rgb(var(--magicks-ink-rgb)/0.46)] sm:text-[11px] sm:tracking-[0.24em]"
            >
              04 · Ihr Partner
            </span>

            <h2
              id="about-heading"
              data-about-intro
              className="font-ui mx-auto mt-6 max-w-[12ch] text-[2.55rem] font-[660] leading-[1.02] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3.5rem] md:text-[4.55rem] lg:text-[5.45rem]"
            >
              <span className="block">Ein Partner.</span>
              <span className="block font-instrument italic font-normal text-[rgb(var(--magicks-ink-rgb)/0.64)]">
                Der mitdenkt.
              </span>
              <span className="block">Nicht nur umsetzt.</span>
            </h2>

            <div
              data-about-intro
              className="mx-auto mt-9 grid max-w-[64rem] gap-4 text-balance sm:mt-11 md:grid-cols-2 md:gap-7"
            >
              <p className="font-ui rounded-[1.2rem] border border-[rgb(var(--magicks-line-rgb)/0.08)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] px-5 py-5 text-[1.02rem] font-[470] leading-[1.68] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.74)] shadow-[0_24px_70px_-58px_rgba(20,28,44,0.3),inset_0_1px_0_rgba(255,255,255,0.74)] sm:px-6 sm:py-6 sm:text-[1.1rem]">
                Mit MAGICKS haben Sie einen Partner, der Ihr Business versteht —
                und nicht einfach einen weiteren Dienstleister.
              </p>
              <p className="font-ui rounded-[1.2rem] border border-[rgb(var(--magicks-line-rgb)/0.08)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.48)] px-5 py-5 text-[1.02rem] font-[470] leading-[1.68] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] shadow-[0_24px_70px_-60px_rgba(20,28,44,0.26),inset_0_1px_0_rgba(255,255,255,0.7)] sm:px-6 sm:py-6 sm:text-[1.1rem]">
                Kreativ, technisch und strategisch aus einer Hand machen wir
                aus Webpräsenzen digitale Erlebnisse — sichtbar,
                vertrauensstark und auf Anfragen ausgerichtet.
              </p>
            </div>
          </div>

          <div
            className="mt-14 grid gap-5 sm:mt-16 md:grid-cols-2 md:gap-6 lg:mt-20 lg:grid-cols-3 lg:gap-7"
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

                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,20,0.04)_30%,rgba(8,12,20,0.35)_62%,rgba(8,12,20,0.84)_100%)]"
                  />

                  <div className="absolute inset-x-2 bottom-2 rounded-[1.05rem] border border-white/15 bg-[linear-gradient(180deg,rgba(12,18,28,0.28),rgba(10,16,24,0.72))] px-3.5 pb-3.5 pt-3 backdrop-blur-[1px] sm:inset-x-3 sm:bottom-3 sm:px-4 sm:pb-4 sm:pt-3.5">
                    <h3 className="font-ui text-[1.15rem] font-[640] leading-[1.14] tracking-[-0.018em] text-white sm:text-[1.28rem]">
                      {card.title}
                    </h3>
                    <p className="font-ui mt-2.5 text-[0.9rem] font-[450] leading-[1.56] tracking-[-0.004em] text-white/88 sm:text-[0.96rem]">
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
