import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
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
 * Visual language: a typographic *register* — not a card grid. Four
 * hairline-divided rows with hanging numerals, large Apple-system
 * titles, and supporting copy in the right column. Each row carries a
 * fading trailing hairline on the right edge — a quiet metaphor for
 * "missed opportunity / unfinished business" without resorting to
 * warning iconography. The deliberate restraint is what differentiates
 * this section from the filled Reason cards in the next chapter.
 */

type ProblemCard = {
  title: string;
  text: string;
};

const PROBLEM_CARDS: ProblemCard[] = [
  {
    title: "Potenzial bleibt liegen",
    text: "Der Mehrwert wird nicht schnell genug klar.",
  },
  {
    title: "Vertrauen fehlt",
    text: "Ohne Beweise bleibt Qualität unsichtbar.",
  },
  {
    title: "Interesse verläuft",
    text: "Ohne Führung wird aus Besuch keine Anfrage.",
  },
  {
    title: "Digital bleibt getrennt",
    text: "Website, Daten und Prozesse arbeiten nicht zusammen.",
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
            "radial-gradient(ellipse 56% 46% at 28% 32%, rgba(34,44,64,0.08), transparent 70%), radial-gradient(ellipse 44% 36% at 78% 70%, rgba(255,255,255,0.22), transparent 76%)",
        }}
      />

      <div className="relative layout-max">
        <div className="mx-auto max-w-[64rem]">
          <span className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.22em] text-[rgb(var(--magicks-ink-rgb)/0.46)] sm:text-[11px] sm:tracking-[0.24em]">
            03 · Problem
          </span>

          <h2
            id="problem-heading"
            data-problem-headline
            className="font-ui mt-5 max-w-[26ch] text-[2.05rem] font-[600] leading-[1.06] tracking-[-0.024em] text-[rgb(var(--magicks-ink-rgb)/0.96)] will-change-[opacity,transform,filter] sm:mt-6 sm:text-[2.7rem] md:text-[3.25rem] lg:text-[3.7rem]"
          >
            Verlieren Sie keine{" "}
            <em className="font-instrument italic font-normal text-[rgb(var(--magicks-ink-rgb)/0.6)]">
              wertvollen
            </em>{" "}
            Chancen
          </h2>

          <div className="mt-10 grid gap-7 sm:mt-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-12 md:gap-y-9">
            <p
              data-problem-intro
              className="font-ui max-w-[34rem] text-[1rem] font-[450] leading-[1.7] tracking-[-0.005em] text-[rgb(var(--magicks-ink-rgb)/0.72)] will-change-[opacity,filter] sm:text-[1.06rem] md:text-[1.12rem]"
            >
              Viele Unternehmen haben eine Website.
              <br />
              Viele entscheiden sich trotzdem gegen sie.
            </p>

            <p
              data-problem-lede
              className="font-ui max-w-[34rem] text-[1rem] font-[450] leading-[1.7] tracking-[-0.005em] text-[rgb(var(--magicks-ink-rgb)/0.66)] will-change-[opacity,filter] sm:text-[1.06rem] md:text-[1.12rem]"
            >
              Eine starke Website erklärt nicht nur, was Sie anbieten — sie macht klar,{" "}
              <em className="font-instrument italic text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                warum genau Sie
              </em>{" "}
              die richtige Wahl sind.
            </p>
          </div>

          {/* Typographic register — not a card grid. Hairline rules
              between rows; hanging mono numeral in the gutter; title in
              the title column; supporting copy in the body column. The
              trailing hairline on each row visually "trails off" on the
              right — the quiet metaphor for missed opportunity. */}
          <ul
            role="list"
            className="mt-16 border-b border-[rgb(var(--magicks-line-rgb)/0.16)] sm:mt-20 md:mt-24"
          >
            {PROBLEM_CARDS.map((card, i) => (
              <li
                key={card.title}
                data-problem-card
                className="group relative grid grid-cols-[2.4rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 border-t border-[rgb(var(--magicks-line-rgb)/0.16)] py-7 will-change-[opacity,transform,filter] sm:grid-cols-[3.2rem_minmax(0,1fr)_minmax(0,1.18fr)] sm:gap-x-8 sm:gap-y-0 sm:py-9 md:gap-x-12 md:py-11"
              >
                <span
                  aria-hidden
                  className="font-mono pt-[0.45em] text-[11px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.42)] sm:text-[11.5px] sm:tracking-[0.2em]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="font-ui text-[1.2rem] font-[600] leading-[1.16] tracking-[-0.014em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[1.34rem] md:text-[1.5rem] lg:text-[1.62rem]">
                  {card.title}
                </h3>

                <p className="col-span-2 col-start-1 max-w-[34rem] font-ui text-[0.96rem] font-[440] leading-[1.66] text-[rgb(var(--magicks-ink-rgb)/0.64)] sm:col-span-1 sm:col-start-3 sm:max-w-[36rem] sm:pt-[0.32em] sm:text-[1rem] md:text-[1.06rem]">
                  {card.text}
                </p>

                {/* Trailing hairline — fades into nothing on the right
                    edge. Subtle visual metaphor for "missed opportunity"
                    that grows a hair on hover/focus-within. No
                    warning-iconography, no error states. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-3 right-0 hidden h-px w-[18%] origin-right bg-gradient-to-l from-transparent via-[rgb(var(--magicks-line-rgb)/0.12)] to-[rgb(var(--magicks-line-rgb)/0.32)] transition-[width,opacity] duration-[680ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:w-[22%] sm:block"
                />
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
