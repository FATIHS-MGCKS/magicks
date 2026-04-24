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
    text: "ir sind MAGICKS Studio — und Standard war noch nie unser Anspruch.",
  },
  {
    text:
      "Wir entwickeln digitale Lösungen, die auffallen und sauber funktionieren — und setzen sie schneller um, als man es gewohnt ist.",
  },
  {
    text: "Und wir haben keine Lust auf langweilige Web-Projekte.",
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
      const farewell = root.querySelector<HTMLElement>("[data-value-farewell]");

      if (reduced) {
        gsap.set([chapter, dropCap, ...sentences, rule, ...indexItems, focusBand, ambient, farewell], {
          opacity: 1,
          y: 0,
          scale: 1,
          scaleX: 1,
          filter: "blur(0px)",
        });
        if (focusBand) gsap.set(focusBand, { opacity: 0 });
        if (farewell) gsap.set(farewell, { opacity: 0 });
        return;
      }

      // ─── Chapter: presence envelope, enters as hero finishes dissolving ─
      presenceEnvelope(chapter, {
        trigger: root,
        start: "top 96%",
        end: "top 28%",
        yFrom: 14,
        yTo: -10,
        blur: 3,
        holdRatio: 0.58,
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
          .to(ambient, { opacity: 0.9, duration: 0.35, ease: "power2.out" }, 0)
          .to(ambient, { opacity: 1, duration: 0.3, ease: "none" }, 0.35)
          .to(ambient, { opacity: 0.55, duration: 0.35, ease: "power2.in" }, 0.65);
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
        blur: 5.5,
        softOpacity: 0.32,
        reachOpacity: 1,
        holdRatio: 0.58,
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
          gsap.set(focusBand, { y, opacity: 0.85 });
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
      className="relative bg-[#0B0B0C] px-5 py-32 sm:px-8 sm:py-44 md:px-12 md:py-56 lg:px-16 lg:py-64"
      aria-labelledby="value-heading"
    >
      <div aria-hidden className="section-top-rule" />

      {/* Ambient field — wide radial light anchored behind the paragraph.
          Never claims focus; registers as room-light moving with the read. */}
      <div
        data-value-ambient
        aria-hidden
        className="pointer-events-none absolute inset-0 will-change-[opacity]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 56% 42% at 62% 46%, rgba(255,255,255,0.028), transparent 68%)",
        }}
      />

      <div className="layout-max">
        <div className="grid gap-10 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20">
          <div data-value-chapter className="md:pt-2">
            <ChapterMarker num="01" label="Denken" />
          </div>

          <div className="relative max-w-[56rem]">
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
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 22%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.05) 78%, transparent 100%)",
                mixBlendMode: "screen",
                transform: "translateY(0) translateZ(0)",
              }}
            />

            <h2
              id="value-heading"
              data-value-heading
              className="relative font-instrument text-[1.9rem] leading-[1.22] tracking-[-0.025em] text-white sm:text-[2.35rem] md:text-[2.9rem] lg:text-[3.3rem]"
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
                className="mt-10 block text-white/55 will-change-[opacity,filter] sm:mt-12"
              >
                {SENTENCES[1].text}
              </span>

              <span
                data-value-sentence
                className="mt-10 block will-change-[opacity,filter] sm:mt-12"
              >
                {SENTENCES[2].text}
              </span>
            </h2>

            <div className="mt-16 sm:mt-20 md:mt-24">
              <div aria-hidden className="relative h-px w-full">
                <span
                  data-value-rule
                  className="absolute inset-0 block bg-gradient-to-r from-white/35 via-white/12 to-transparent"
                />
              </div>

              <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-3 sm:mt-8 sm:gap-x-10">
                {INDEX_ITEMS.map((it) => (
                  <li
                    key={it.label}
                    data-value-index
                    className="flex items-baseline gap-2 will-change-[opacity,filter]"
                  >
                    <span className="font-instrument text-[15px] italic text-white/55">
                      {it.n}
                    </span>
                    <span className="font-mono text-[11.5px] font-medium uppercase leading-none tracking-[0.18em] text-white/60 sm:text-[11px] sm:tracking-[0.26em]">
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
            "linear-gradient(180deg, transparent 0%, rgba(8,8,10,0.35) 55%, rgba(8,8,10,0.62) 100%)",
        }}
      />
    </section>
  );
}
