import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  breathingScale,
  focusEnvelope,
  presenceEnvelope,
  rackFocusTrack,
  sectionFarewell,
} from "../../lib/scrollMotion";
import { ChapterMarker } from "./ChapterMarker";
import { MagicksSignatureReveal } from "./MagicksSignatureReveal";

/**
 * Three sentences. The lens rack-pulls down the paragraph as the user
 * scrolls — each sentence exists in layout from the start as soft-focused
 * ghost text, and every sentence's clarity is a direct function of scroll
 * position. Scrolling back up reverses the pull cleanly.
 *
 * A luminous focus band (a thin horizontal light) rides beside the
 * active sentence as a physical "lens carriage" — it's never called out,
 * but the eye registers that something is *moving with the read*.
 */
const SENTENCES: { text: string }[] = [
  {
    // Drop-cap "W" is rendered separately — sentence continues with "ir …"
    text: "ir sind MAGICKS Studio — und Standard war nie unser Anspruch.",
  },
  {
    text:
      "Wir entwickeln Websites, Web-Software und Automationen, die stark aussehen, sauber funktionieren und echte Arbeit abnehmen.",
  },
  {
    text:
      "Studio-Qualität ohne lange Agenturwege — präzise umgesetzt und bereit für den Alltag.",
  },
];

const INDEX_ITEMS = [
  { n: "¹", label: "Markenauftritte" },
  { n: "²", label: "Web-Software" },
  { n: "³", label: "Automation" },
  { n: "⁴", label: "KI mit Verantwortung" },
];

export function ValueStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const chapter = root.querySelector<HTMLElement>("[data-value-chapter]");
      const dropCap = root.querySelector<HTMLElement>("[data-value-dropcap]");
      const sentences = gsap.utils.toArray<HTMLElement>("[data-value-sentence]");
      const rule = root.querySelector<HTMLElement>("[data-value-rule]");
      const indexItems = gsap.utils.toArray<HTMLElement>("[data-value-index]");
      const heading = root.querySelector<HTMLElement>("[data-value-heading]");
      const focusBand = root.querySelector<HTMLElement>("[data-value-focusband]");
      const ambient = root.querySelector<HTMLElement>("[data-value-ambient]");
      const godray = root.querySelector<HTMLElement>("[data-value-godray] > div");
      const farewell = root.querySelector<HTMLElement>("[data-value-farewell]");
      const sign = root.querySelector<HTMLElement>("[data-value-sign]");

      if (reduced) {
        gsap.set(
          [chapter, dropCap, ...sentences, rule, ...indexItems, focusBand, ambient, godray, farewell, sign].filter(Boolean) as HTMLElement[],
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

      // ─── Chapter: presence envelope, enters as hero finishes dissolving ─
      // Asymmetric exit so the chapter marker still anchors the spread
      // while the reader is mid-paragraph instead of vanishing on a
      // single wheel notch.
      presenceEnvelope(chapter, {
        trigger: root,
        start: "top 96%",
        end: "top 0%",
        yFrom: 14,
        yTo: -10,
        blur: 3,
        holdRatio: 0.5,
        exitWeight: 2.5,
        scrub: 1.0,
      });

      // ─── Drop-cap: presence envelope + scroll-coupled breathing ───────
      // The "W" is a fixed typographic anchor. It arrives cleanly, holds
      // through the section, releases late. While it holds it also
      // breathes at a different rate — the scale-pulse is so small it
      // reads as *paper / eye settling*, not motion.
      presenceEnvelope(dropCap, {
        trigger: root,
        start: "top 90%",
        end: "bottom 40%",
        yFrom: 28,
        yTo: -12,
        blur: 4.5,
        holdRatio: 0.68,
      });
      breathingScale(dropCap, {
        trigger: root,
        from: 0.992,
        peak: 1.014,
        to: 0.998,
        scrub: 1.5,
      });

      // ─── Ambient field: a wide radial light follows the focus pull ────
      // Anchored behind the paragraph. Builds as sentence 1 reaches focus,
      // peaks through sentence 2, softens as sentence 3 lands its punch.
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
        start: "top 74%",
        end: "bottom 38%",
        scrub: 0.95,
        blur: 4.2,
        softOpacity: 0.44,
        reachOpacity: 1,
        holdRatio: 0.62,
        onProgress: (_idx, progress) => {
          if (!focusBand || !sentences.length) return;
          // Position the band along the paragraph height. We interpolate
          // through the three sentence centers so the band moves
          // continuously, not in steps — even the "between" positions
          // read as the lens traversing space.
          const rects = sentences.map((s) => (s as HTMLElement).getBoundingClientRect());
          const parentRect = (heading ?? root).getBoundingClientRect();
          const centers = rects.map((r) => r.top + r.height / 2 - parentRect.top);
          const indexFloat = Math.max(0, Math.min(centers.length - 1, progress * centers.length - 0.5));
          const lo = Math.floor(indexFloat);
          const hi = Math.min(centers.length - 1, lo + 1);
          const t = indexFloat - lo;
          const y = centers[lo] + (centers[hi] - centers[lo]) * t;
          gsap.set(focusBand, { y, opacity: 0.74 });
        },
      });

      // ─── Rule: scrubbed draw + gentle release ────────────────────────
      gsap.fromTo(
        rule,
        { scaleX: 0, transformOrigin: "left center" },
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

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="denken"
      className="relative bg-[var(--magicks-bg-lifted)] px-5 py-32 sm:px-8 sm:py-44 md:px-12 md:py-56 lg:px-16 lg:py-64"
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

      <div className="layout-max">
        <div className="grid gap-10 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20">
          <div data-value-chapter className="md:pt-2">
            <ChapterMarker num="01" label="Denken" />
          </div>

          <div className="relative max-w-[54rem]">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-4 -inset-y-5 rounded-[1.45rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[linear-gradient(170deg,rgba(255,255,255,0.56)_0%,rgba(246,241,233,0.38)_100%)] sm:-inset-x-6 sm:-inset-y-6 md:-inset-x-8 md:-inset-y-8"
            />
            {/* Luminous focus band — thin horizontal light that rides along
                the sentence currently in focus. Its Y is driven by the
                rack-focus track's onProgress callback, so position and
                sharpness always belong to the same scroll frame. */}
            <div
              data-value-focusband
              aria-hidden
              className="pointer-events-none absolute left-[-2rem] top-0 hidden h-[1.2em] w-[calc(100%+4rem)] will-change-[transform,opacity] md:block"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(24,30,44,0.03) 22%, rgba(24,30,44,0.08) 50%, rgba(24,30,44,0.03) 78%, transparent 100%)",
                mixBlendMode: "multiply",
                transform: "translateY(0) translateZ(0)",
              }}
            />

            <h2
              id="value-heading"
              data-value-heading
              className="relative z-10 font-instrument text-[1.95rem] leading-[1.32] tracking-[-0.018em] text-[rgb(var(--magicks-ink-rgb)/0.94)] sm:text-[2.38rem] md:text-[2.92rem] lg:text-[3.3rem]"
            >
              <span data-value-dropcap className="drop-cap will-change-[opacity,transform,filter]">
                W
              </span>
              <span
                data-value-sentence
                className="block will-change-[opacity,filter]"
              >
                {SENTENCES[0].text}
              </span>

              <span
                data-value-sentence
                className="mt-10 block text-[rgb(var(--magicks-ink-rgb)/0.64)] will-change-[opacity,filter] sm:mt-12"
              >
                {SENTENCES[1].text}
              </span>

              <span
                data-value-sentence
                className="mt-10 block text-[rgb(var(--magicks-ink-rgb)/0.88)] will-change-[opacity,filter] sm:mt-12"
              >
                {SENTENCES[2].text}
              </span>
            </h2>

            {/* Editorial signature — signing hand directly below the
                three-sentence declaration. Aligned to the right column,
                surrounded by quiet whitespace. Sits before the services
                index so the signature closes the *statement*, and the
                services list reads as a follow-on footnote. */}
            <figure
              data-value-sign
              className="relative z-10 mx-auto mt-14 flex w-full max-w-[34rem] flex-col items-center will-change-[opacity,transform,filter] sm:mt-16 sm:ml-auto sm:mr-0 sm:max-w-[36rem] md:mt-20 md:max-w-[42rem]"
            >
              <MagicksSignatureReveal className="w-full max-w-[28rem] sm:max-w-[32rem] md:max-w-[38rem]" />

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
                  className="absolute inset-0 block bg-gradient-to-r from-[rgb(var(--magicks-line-rgb)/0.4)] via-[rgb(var(--magicks-line-rgb)/0.12)] to-transparent"
                />
              </div>

              <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-3 sm:mt-8 sm:gap-x-10">
                {INDEX_ITEMS.map((it) => (
                  <li
                    key={it.label}
                    data-value-index
                    className="flex items-baseline gap-2 will-change-[opacity,filter]"
                  >
                    <span className="font-instrument text-[15px] italic text-[rgb(var(--magicks-ink-rgb)/0.55)]">
                      {it.n}
                    </span>
                    <span className="font-mono text-[11.5px] font-medium uppercase leading-none tracking-[0.13em] text-[rgb(var(--magicks-ink-rgb)/0.6)] sm:text-[11.25px] sm:tracking-[0.18em]">
                      {it.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
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
