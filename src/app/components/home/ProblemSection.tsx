import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { HomeIcon, type HomeIconName } from "./HomeIcon";
import {
  focusEnvelope,
  parallaxDrift,
  presenceEnvelope,
  sectionFarewell,
} from "../../lib/scrollMotion";

/**
 * Problem section — exposes the four common gaps that keep websites from
 * converting. Sits between the ValueStatement (calm manifesto) and the
 * ProblemSolver / About-Us section (the answer).
 *
 * Visual language: a compact diagnosis list. It keeps the stronger
 * mobile typography and visible icons without mirroring the later
 * "Ihr Partner" reason-card grid.
 */

type ProblemCard = {
  title: string;
  text: string;
  icon: HomeIconName;
};

const PROBLEM_CARDS: ProblemCard[] = [
  {
    title: "Potenzial bleibt liegen",
    text: "Der Mehrwert wird nicht schnell genug klar.",
    icon: "clarity",
  },
  {
    title: "Vertrauen fehlt",
    text: "Ohne Beweise bleibt Qualität unsichtbar.",
    icon: "proof",
  },
  {
    title: "Interesse verläuft",
    text: "Ohne Führung wird aus Besuch keine Anfrage.",
    icon: "path",
  },
  {
    title: "Digital bleibt getrennt",
    text: "Website, Daten und Prozesse arbeiten nicht zusammen.",
    icon: "system",
  },
];

export function ProblemSection() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const headline = root.querySelector<HTMLElement>("[data-problem-headline]");
      const intro = root.querySelector<HTMLElement>("[data-problem-intro]");
      const lede = root.querySelector<HTMLElement>("[data-problem-lede]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-problem-card]");
      const ambient = root.querySelector<HTMLElement>("[data-problem-ambient]");
      const farewell = root.querySelector<HTMLElement>("[data-problem-farewell]");

      if (reduced) {
        gsap.set(
          [headline, intro, lede, ...cards, ambient, farewell].filter(
            Boolean,
          ) as HTMLElement[],
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        );
        if (farewell) gsap.set(farewell, { opacity: 0 });
        return;
      }

      if (ambient) {
        gsap.set(ambient, { opacity: 0 });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root,
              start: "top 82%",
              end: "bottom 25%",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
            defaults: { ease: "none" },
          })
          .to(ambient, { opacity: 0.6, duration: 0.32, ease: "power2.out" }, 0)
          .to(ambient, { opacity: 0.78, duration: 0.36, ease: "none" }, 0.32)
          .to(ambient, { opacity: 0.32, duration: 0.32, ease: "power2.in" }, 0.68);
        parallaxDrift(ambient, { trigger: root, from: -3, to: 4, scrub: true });
      }

      presenceEnvelope(headline, {
        trigger: root,
        start: "top 92%",
        end: "top 0%",
        yFrom: 18,
        yTo: -8,
        blur: 3.4,
        opacityFloor: 0.22,
        holdRatio: 0.56,
        exitWeight: 2.4,
        scrub: 1.05,
      });

      focusEnvelope(intro, {
        trigger: intro ?? root,
        start: "top 86%",
        end: "bottom 22%",
        blur: 2.4,
        opacityFloor: 0.32,
        focusOpacity: 1,
        holdRatio: 0.6,
      });

      focusEnvelope(lede, {
        trigger: lede ?? root,
        start: "top 86%",
        end: "bottom 18%",
        blur: 2.2,
        opacityFloor: 0.32,
        focusOpacity: 1,
        holdRatio: 0.6,
      });

      // Cards rise with a soft stagger, then settle. Bidirectional via
      // scrub so scrolling back lifts them out the same way.
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 28, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: `top ${88 - i * 1.5}%`,
              end: `top ${52 - i * 1.5}%`,
              scrub: 1.0,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      sectionFarewell(farewell, {
        trigger: root,
        peak: 0.82,
        start: "bottom 80%",
        end: "bottom 0%",
        scrub: 1.0,
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="problem"
      className="relative overflow-hidden bg-[var(--magicks-bg-base)] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16"
      aria-labelledby="problem-heading"
    >
      <div aria-hidden className="section-top-rule" />

      <div
        data-problem-ambient
        aria-hidden
        className="pointer-events-none absolute inset-0 will-change-[opacity,transform]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 58% 46% at 18% 24%, rgba(166,138,98,0.16), transparent 70%), radial-gradient(ellipse 48% 38% at 82% 68%, rgba(92,122,154,0.12), transparent 74%), radial-gradient(ellipse 42% 34% at 46% 92%, rgba(255,255,255,0.34), transparent 78%)",
        }}
      />

      <div className="relative layout-max">
        <div className="mx-auto max-w-[72rem]">
          <span className="inline-flex items-center gap-3 rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.22)] bg-[rgb(var(--magicks-accent-rgb)/0.07)] px-3 py-2 font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.78)] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] sm:text-[11px] sm:tracking-[0.22em]">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--magicks-accent-rgb)/0.72)]" />
            03 · Problem
          </span>

          <h2
            id="problem-heading"
            data-problem-headline
            className="font-ui mt-6 max-w-[20ch] text-[2.55rem] font-[650] leading-[1.02] tracking-[-0.038em] text-[rgb(var(--magicks-ink-rgb)/0.98)] will-change-[opacity,transform,filter] sm:text-[3.35rem] md:text-[4.35rem] lg:text-[5rem]"
          >
            Verlieren Sie keine{" "}
            <em className="font-instrument italic font-normal text-[rgb(var(--magicks-accent-ink-rgb)/0.74)]">
              wertvollen
            </em>{" "}
            Chancen
          </h2>

          <div className="mt-9 grid gap-5 sm:mt-11 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-10 md:gap-y-8">
            <p
              data-problem-intro
              className="font-ui max-w-[38rem] text-[1.16rem] font-[520] leading-[1.58] tracking-[-0.01em] text-[rgb(var(--magicks-ink-rgb)/0.82)] will-change-[opacity,filter] sm:text-[1.24rem] md:text-[1.34rem]"
            >
              Viele Unternehmen haben eine Website.
              <br />
              Viele entscheiden sich trotzdem gegen sie.
            </p>

            <p
              data-problem-lede
              className="font-ui max-w-[40rem] rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.54)] px-5 py-5 text-[1.05rem] font-[470] leading-[1.68] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] shadow-[0_28px_78px_-58px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.7)] will-change-[opacity,filter] sm:px-6 sm:py-6 sm:text-[1.12rem] md:text-[1.18rem]"
            >
              Eine starke Website erklärt nicht nur, was Sie anbieten — sie macht klar,{" "}
              <em className="font-instrument italic text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                warum genau Sie
              </em>{" "}
              die richtige Wahl sind.
            </p>
          </div>

          {/* Compact diagnosis list — calmer than cards, clearer than the
              experimental signal stack, and visually distinct from Partner. */}
          <ul
            role="list"
            className="mt-14 divide-y divide-[rgb(var(--magicks-line-rgb)/0.13)] border-y border-[rgb(var(--magicks-line-rgb)/0.14)] sm:mt-16 md:mt-20"
          >
            {PROBLEM_CARDS.map((card, i) => (
              <li
                key={card.title}
                data-problem-card
                className="group relative grid gap-4 py-6 will-change-[opacity,transform,filter] transition-colors duration-[680ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:bg-[rgb(var(--magicks-accent-rgb)/0.035)] sm:gap-5 sm:py-7 md:grid-cols-[3.5rem_minmax(11rem,0.72fr)_minmax(0,1fr)] md:items-center md:gap-8 md:px-4"
              >
                <div className="flex items-center justify-between gap-4 md:contents">
                  <span
                    aria-hidden
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.22)] bg-[rgb(var(--magicks-accent-rgb)/0.08)] text-[rgb(var(--magicks-accent-ink-rgb)/0.86)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] sm:h-11 sm:w-11"
                  >
                    <HomeIcon name={card.icon} size={18} strokeWidth={1.3} />
                  </span>

                  <span className="font-mono text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.38)] sm:text-[11.5px] md:order-first md:text-left">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="max-w-[18ch] font-ui text-[1.32rem] font-[630] leading-[1.12] tracking-[-0.018em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[1.46rem] md:text-[1.58rem]">
                  {card.title}
                </h3>

                <p className="max-w-[38rem] font-ui text-[1rem] font-[460] leading-[1.62] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.68)] sm:text-[1.06rem] md:text-[1.1rem]">
                  {card.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        data-problem-farewell
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 will-change-[opacity]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(46,56,76,0.05) 58%, rgba(46,56,76,0.12) 100%)",
        }}
      />
    </section>
  );
}
