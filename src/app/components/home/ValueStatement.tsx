import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  focusEnvelope,
  presenceEnvelope,
  rackFocusTrack,
  sectionFarewell,
} from "../../lib/scrollMotion";
import { MagicksSignatureReveal } from "./MagicksSignatureReveal";

/**
 * Four statement lines. The lens rack-pulls down the paragraph as the user
 * scrolls — each line exists in layout from the start as soft-focused
 * ghost text, and every line's clarity is a direct function of scroll
 * position. Scrolling back up reverses the pull cleanly.
 *
 * A luminous focus band (a thin horizontal light) rides beside the
 * active line as a physical "lens carriage" — it's never called out,
 * but the eye registers that something is *moving with the read*.
 */
type ValueStatementBlock =
  | {
      tone: "headline";
      primary: string;
      secondary: string;
    }
  | {
      tone: "body";
      text: string;
    }
  | {
      tone: "closing";
      primary: string;
      secondary: string;
    };

const STATEMENT_BLOCKS: ValueStatementBlock[] = [
  {
    tone: "headline",
    primary: "Der erste Eindruck entscheidet.",
    secondary: "Der zweite bleibt.",
  },
  {
    tone: "body",
    text:
      "Ihre Website muss sichtbar sein, Vertrauen schaffen und vor allem im Kopf bleiben — so werden aus Besuchern richtige Anfragen.",
  },
  {
    tone: "closing",
    primary: "Genau das macht ein Digitales Erlebnis aus",
    secondary: "und diese kreieren wir mit Leidenschaft.",
  },
];

const INDEX_ITEMS = [
  { label: "Markenauftritte" },
  { label: "Web-Software" },
  { label: "Automation" },
  { label: "KI mit Verantwortung" },
];

export function ValueStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { gsap, ScrollTrigger } = registerGsap();
    let removeFocusBandListeners: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const sentences = gsap.utils.toArray<HTMLElement>("[data-value-sentence]");
      const rule = root.querySelector<HTMLElement>("[data-value-rule]");
      const indexItems = gsap.utils.toArray<HTMLElement>("[data-value-index]");
      const heading = root.querySelector<HTMLElement>("[data-value-heading]");
      const focusBand = root.querySelector<HTMLElement>("[data-value-focusband]");
      const ambient = root.querySelector<HTMLElement>("[data-value-ambient]");
      const spotlight = root.querySelector<HTMLElement>("[data-value-spotlight]");
      const godray = root.querySelector<HTMLElement>("[data-value-godray] > div");
      const farewell = root.querySelector<HTMLElement>("[data-value-farewell]");
      const sign = root.querySelector<HTMLElement>("[data-value-sign]");
      const setFocusBandY = focusBand ? gsap.quickSetter(focusBand, "y", "px") : null;
      const setFocusBandOpacity = focusBand ? gsap.quickSetter(focusBand, "opacity") : null;
      let cachedSentenceCenters: number[] = [];

      const updateFocusBandGeometry = () => {
        if (!focusBand || !sentences.length) return;
        const parent = heading ?? root;
        const parentRect = parent.getBoundingClientRect();
        cachedSentenceCenters = sentences.map((sentence) => {
          const rect = sentence.getBoundingClientRect();
          return rect.top + rect.height / 2 - parentRect.top;
        });
      };

      if (reduced) {
        gsap.set(
          [...sentences, rule, ...indexItems, focusBand, ambient, spotlight, godray, farewell, sign].filter(Boolean) as HTMLElement[],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            scaleX: 1,
            filter: "blur(0px)",
          },
        );
        if (focusBand) gsap.set(focusBand, { opacity: 0 });
        if (farewell) gsap.set(farewell, { opacity: 0 });
        return;
      }

      // ─── Ambient field: a wide radial light follows the focus pull ────
      // Anchored behind the paragraph. Builds as line 1 reaches focus,
      // peaks through lines 2-3, softens as line 4 lands the close.
      if (ambient) {
        gsap.set(ambient, { opacity: 0 });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: heading ?? root,
              start: "top 78%",
              end: "bottom 30%",
              scrub: 1.1,
              invalidateOnRefresh: true,
            },
            defaults: { ease: "none" },
          })
          .to(ambient, { opacity: 0.72, duration: 0.35, ease: "power2.out" }, 0)
          .to(ambient, { opacity: 0.86, duration: 0.3, ease: "none" }, 0.35)
          .to(ambient, { opacity: 0.48, duration: 0.35, ease: "power2.in" }, 0.65);
      }

      // ─── Spotlight sweep: warm cinematic key light ────────────────────
      // A broad key light glides across the statement as the rack-focus
      // travels downward. It keeps the section cinematic without turning
      // into a hard visual effect.
      if (spotlight) {
        gsap.set(spotlight, { opacity: 0, xPercent: -8, scale: 0.96 });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: heading ?? root,
              start: "top 82%",
              end: "bottom 20%",
              scrub: 1.25,
              invalidateOnRefresh: true,
            },
            defaults: { ease: "none" },
          })
          .to(spotlight, { opacity: 0.56, xPercent: 0, scale: 1, duration: 0.4, ease: "power2.out" }, 0)
          .to(spotlight, { opacity: 0.64, xPercent: 7, scale: 1.04, duration: 0.28, ease: "none" }, 0.4)
          .to(spotlight, { opacity: 0.24, xPercent: 11, scale: 1.08, duration: 0.32, ease: "power2.in" }, 0.68);
      }

      // ─── Volumetric God Ray: slow diagonal sweep ─────────────────────
      // Drifts across the text as the user scrolls, creating a sense of
      // depth and atmosphere.
      if (godray) {
        gsap.fromTo(
          godray,
          { opacity: 0, xPercent: -12, yPercent: -16 },
          {
            opacity: 0.66,
            xPercent: 8,
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1.5,
            },
          },
        );
      }

      // ─── Rack-focus sentence track ───────────────────────────────────
      // Wider hold ratio → each sentence reads sharply for longer before
      // handing off. Emits an `onProgress` signal so the luminous band can
      // track which sentence currently holds the lens.
      rackFocusTrack(sentences, {
        trigger: heading ?? root,
        start: "top 82%",
        end: "bottom 30%",
        scrub: 0.95,
        blur: 4.5,
        softOpacity: 0.35,
        reachOpacity: 1,
        holdRatio: 0.56,
        onProgress: (_idx, progress) => {
          if (!focusBand || !sentences.length) return;
          if (!cachedSentenceCenters.length) updateFocusBandGeometry();
          if (!cachedSentenceCenters.length) return;
          // Position the band along the paragraph height. We interpolate
          // through the sentence centers so the band moves
          // continuously, not in steps — even the "between" positions
          // read as the lens traversing space.
          const centers = cachedSentenceCenters;
          const indexFloat = Math.max(0, Math.min(centers.length - 1, progress * centers.length - 0.5));
          const lo = Math.floor(indexFloat);
          const hi = Math.min(centers.length - 1, lo + 1);
          const t = indexFloat - lo;
          const y = centers[lo] + (centers[hi] - centers[lo]) * t;
          setFocusBandY?.(y);
          setFocusBandOpacity?.(0.74);
        },
      });

      if (focusBand && sentences.length) {
        updateFocusBandGeometry();
        ScrollTrigger.addEventListener("refreshInit", updateFocusBandGeometry);
        ScrollTrigger.addEventListener("refresh", updateFocusBandGeometry);
        removeFocusBandListeners = () => {
          ScrollTrigger.removeEventListener("refreshInit", updateFocusBandGeometry);
          ScrollTrigger.removeEventListener("refresh", updateFocusBandGeometry);
        };
      }

      // ─── Rule: scrubbed draw + gentle release ────────────────────────
      gsap.fromTo(
        rule,
        { scaleX: 0, transformOrigin: "center" },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rule,
            start: "top 90%",
            end: "top 58%",
            scrub: 0.9,
          },
        },
      );
      gsap.to(rule, {
        scaleX: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: rule,
          start: "top 35%",
          end: "bottom -20%",
          scrub: 1.0,
        },
      });

      // ─── Index items: focus envelope with slight stagger ─────────────
      focusEnvelope(indexItems, {
        trigger: rule ?? root,
        start: "top 85%",
        end: "bottom -10%",
        blur: 3,
        opacityFloor: 0.2,
        focusOpacity: 1,
        holdRatio: 0.56,
        stagger: 0.02,
      });

      // ─── Editorial signature: scroll-coupled in/out envelope ─────────
      // The handwritten signature is the tail anchor of the value
      // statement. Wrapper plays a clean opacity + y + blur entry on
      // enter and reverses on leave — in sync with the inner
      // MagicksSignatureReveal which has its own ScrollTrigger for the
      // photographic exposure effect.
      if (sign) {
        presenceEnvelope(sign, {
          trigger: sign,
          start: "top 90%",
          end: "bottom 14%",
          yFrom: 12,
          yTo: -8,
          blur: 2.6,
          opacityFloor: 0.18,
          holdRatio: 0.62,
          scrub: 1.0,
        });
      }

      // ─── Section farewell: ink-shadow bottom fade ────────────────────
      sectionFarewell(farewell, {
        trigger: root,
        peak: 1,
        start: "bottom 80%",
        end: "bottom 0%",
        scrub: 1.0,
      });
    }, root);

    return () => {
      removeFocusBandListeners?.();
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="denken"
      className="relative bg-[var(--magicks-bg-lifted)] px-5 pt-20 pb-32 sm:px-8 sm:pt-28 sm:pb-44 md:px-12 md:pt-32 md:pb-56 lg:px-16 lg:pt-40 lg:pb-64"
      aria-labelledby="value-heading"
    >
      <div aria-hidden className="section-top-rule" />

      {/* Volumetric God Ray — cinematic lighting sweeping diagonally across the section.
          Coupled to scroll so it 'reveals' the space dynamically. */}
      <div
        data-value-godray
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden will-change-[opacity,transform]"
      >
        <div
          className="absolute -inset-[50%] h-[200%] w-[200%] origin-top-left opacity-0"
          style={{
            background:
              "linear-gradient(135deg, transparent 34%, rgba(255,255,255,0.38) 45%, rgba(222,214,202,0.48) 50%, rgba(255,255,255,0.26) 56%, transparent 68%)",
            transform: "translate3d(0, -20%, 0) rotate(-15deg)",
            filter: "blur(40px)",
            mixBlendMode: "soft-light",
          }}
        />
      </div>

      {/* Ambient field — wide radial light anchored behind the paragraph.
          Never claims focus; registers as room-light moving with the read. */}
      <div
        data-value-ambient
        aria-hidden
        className="pointer-events-none absolute inset-0 will-change-[opacity]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 56% 42% at 62% 46%, rgba(34,44,64,0.1), transparent 68%), radial-gradient(ellipse 46% 34% at 24% 62%, rgba(255,255,255,0.22), transparent 74%)",
        }}
      />
      <div
        data-value-spotlight
        aria-hidden
        className="pointer-events-none absolute inset-0 will-change-[opacity,transform]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 54% 38% at 76% 34%, rgba(255,245,222,0.46), rgba(255,245,222,0.08) 44%, transparent 74%), radial-gradient(ellipse 36% 28% at 16% 68%, rgba(86,108,142,0.14), transparent 72%)",
          mixBlendMode: "soft-light",
        }}
      />

      <div className="layout-max">
        <div className="relative mx-auto max-w-[72rem]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-4 -inset-y-6 rounded-[2.35rem] border border-[rgb(var(--magicks-line-rgb)/0.045)] bg-[linear-gradient(145deg,rgba(255,255,255,0.38)_0%,rgba(248,244,236,0.2)_52%,rgba(236,230,219,0.08)_100%)] shadow-[0_42px_110px_-92px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.58)] sm:-inset-x-6 sm:-inset-y-8 md:-inset-x-10 md:-inset-y-10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-1 -inset-y-1 rounded-[2rem] bg-[radial-gradient(ellipse_68%_48%_at_70%_16%,rgba(255,255,255,0.64),transparent_70%)]"
          />
          {/* Luminous focus band — thin horizontal light that rides along
              the line currently in focus. Its Y is driven by the
              rack-focus track's onProgress callback, so position and
              sharpness always belong to the same scroll frame. */}
          <div
            data-value-focusband
            aria-hidden
            className="pointer-events-none absolute left-[-2rem] top-0 hidden h-[1.2em] w-[calc(100%+4rem)] will-change-[transform,opacity] md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,245,224,0.1) 20%, rgba(255,255,255,0.3) 50%, rgba(255,245,224,0.1) 80%, transparent 100%)",
              mixBlendMode: "soft-light",
              transform: "translateY(0) translateZ(0)",
            }}
          />

          <div
            data-value-heading
            className="relative z-10 mx-auto flex max-w-[64rem] flex-col items-center text-center rounded-[1.85rem] px-1 py-1 sm:px-3 sm:py-3 md:px-4 md:py-4"
          >
            {STATEMENT_BLOCKS.map((block) => {
              if (block.tone === "headline") {
                return (
                  <h2
                    key={block.primary}
                    id="value-heading"
                    data-value-sentence
                    className="mx-auto max-w-[20ch] font-instrument text-[clamp(2.8rem,6.5vw,4.8rem)] font-normal leading-[0.98] tracking-[-0.036em] text-[rgb(var(--magicks-ink-rgb)/0.97)] will-change-[opacity,filter] md:max-w-[20ch]"
                  >
                    <span className="block">{block.primary}</span>
                    <em className="mx-auto mt-2 block max-w-[18ch] text-[0.92em] font-normal italic tracking-[-0.035em] text-[rgb(var(--magicks-ink-rgb)/0.56)] sm:mt-3">
                      {block.secondary}
                    </em>
                  </h2>
                );
              }

              if (block.tone === "body") {
                return (
                  <p
                    key={block.text}
                    data-value-sentence
                    className="font-ui mx-auto mt-12 max-w-[41rem] text-[0.98rem] font-normal leading-[1.68] tracking-[-0.01em] text-[rgb(var(--magicks-ink-rgb)/0.7)] will-change-[opacity,filter] sm:mt-14 sm:text-[1.06rem] md:text-[1.1rem] lg:text-[1.16rem]"
                  >
                    {block.text}
                  </p>
                );
              }

              return (
                <div
                  key={block.primary}
                  data-value-sentence
                  className="mx-auto mt-12 max-w-[58rem] will-change-[opacity,filter] sm:mt-14"
                >
                  <p className="font-instrument text-[clamp(1.9rem,3.8vw,3.35rem)] italic leading-[1.05] tracking-[-0.028em] text-[rgb(var(--magicks-ink-rgb)/0.9)]">
                    {block.primary}
                  </p>
                  <p className="font-instrument mx-auto mt-4 max-w-[31rem] text-[1.25rem] font-normal leading-[1.4] tracking-[-0.01em] text-[rgb(var(--magicks-ink-rgb)/0.76)] sm:text-[1.35rem] md:text-[1.45rem]">
                    {block.secondary}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Editorial signature — signing hand directly below the
              statement. Aligned to the right column, surrounded by
              quiet whitespace. Sits before the services index so the
              signature closes the statement and the list reads as a
              follow-on footnote. */}
          <figure
            data-value-sign
            className="relative z-10 mx-auto mt-14 flex w-full max-w-[28rem] flex-col items-center will-change-[opacity,transform,filter] sm:mt-16 sm:max-w-[32rem] md:mt-20 md:max-w-[36rem]"
          >
            <MagicksSignatureReveal className="w-full max-w-[24rem] sm:max-w-[28rem] md:max-w-[32rem]" />

            <figcaption className="font-mono mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 self-stretch text-[10.75px] font-medium uppercase leading-none tracking-[0.14em] text-[rgb(var(--magicks-ink-rgb)/0.46)] sm:mt-7 sm:gap-x-6 sm:text-[11px] sm:tracking-[0.2em] sm:text-[rgb(var(--magicks-ink-rgb)/0.42)]">
              <span className="flex items-center gap-2 sm:gap-3">
                <span aria-hidden className="h-px w-5 bg-[rgb(var(--magicks-line-rgb)/0.28)] sm:w-8" />
                <span>Studio · Kassel</span>
              </span>
              <span className="text-[rgb(var(--magicks-ink-rgb)/0.34)]">N51°19′ · E9°29′</span>
            </figcaption>
          </figure>

          <div className="relative z-10 mt-16 sm:mt-20 md:mt-24">
            <div aria-hidden className="relative h-px w-full">
              <span
                data-value-rule
                className="absolute inset-0 block bg-gradient-to-r from-transparent via-[rgb(var(--magicks-line-rgb)/0.3)] to-transparent"
              />
            </div>

            <ul className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-3 sm:mt-8 sm:gap-x-10">
              {INDEX_ITEMS.map((it) => (
                <li
                  key={it.label}
                  data-value-index
                  className="flex items-baseline gap-2 will-change-[opacity,filter]"
                >
                  <span className="font-mono text-[11.5px] font-medium uppercase leading-none tracking-[0.13em] text-[rgb(var(--magicks-ink-rgb)/0.6)] sm:text-[11.25px] sm:tracking-[0.18em]">
                    {it.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Section farewell — a thin ink-shadow at the bottom of the spread
          that deepens as the section exits and lifts on return. Hands off
          to Services as material, not as a cut. */}
      <div
        data-value-farewell
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 will-change-[opacity]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(46,56,76,0.06) 55%, rgba(46,56,76,0.12) 100%)",
        }}
      />
    </section>
  );
}
