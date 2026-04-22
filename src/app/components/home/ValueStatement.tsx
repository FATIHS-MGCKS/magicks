import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ChapterMarker } from "./ChapterMarker";

/**
 * Three sentences. Each reveals at its own tempo — fast/slow/fast —
 * so the meaning lands like pacing in a well-written paragraph.
 */
const SENTENCES: { text: string; tone: "strong" | "soft"; tempo: "fast" | "slow" }[] = [
  {
    // Drop-cap "W" is rendered separately — sentence continues with "ir …"
    text: "ir sind MAGICKS Studio — und Standard war noch nie unser Anspruch.",
    tone: "strong",
    tempo: "fast",
  },
  {
    text:
      "Wir entwickeln digitale Lösungen, die auffallen und sauber funktionieren — und setzen sie schneller um, als man es gewohnt ist.",
    tone: "soft",
    tempo: "slow",
  },
  {
    text: "Und wir haben keine Lust auf langweilige Web-Projekte.",
    tone: "strong",
    tempo: "fast",
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

      if (reduced) {
        gsap.set([chapter, dropCap, ...sentences, rule, ...indexItems], {
          opacity: 1,
          y: 0,
          scale: 1,
          scaleX: 1,
        });
        return;
      }

      gsap.set(chapter, { opacity: 0, y: 12 });
      gsap.set(dropCap, { opacity: 0, y: 24, scale: 0.95, transformOrigin: "left bottom" });
      gsap.set(sentences, { opacity: 0, y: 14, filter: "blur(6px)" });
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(indexItems, { opacity: 0, y: 8 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });

      tl.to(chapter, { opacity: 1, y: 0, duration: 0.8 }, 0);
      tl.to(
        dropCap,
        { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power2.out" },
        0.1,
      );

      // Variable tempo — the core art-direction move.
      sentences.forEach((s, i) => {
        const tempo = SENTENCES[i].tempo;
        const duration = tempo === "fast" ? 0.75 : 1.35;
        const ease = tempo === "fast" ? "power2.out" : "power1.out";
        const offset = i === 0 ? 0.45 : i === 1 ? 1.05 : 2.15;
        tl.to(s, { opacity: 1, y: 0, filter: "blur(0px)", duration, ease }, offset);
      });

      tl.to(rule, { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, 2.6);
      tl.to(indexItems, { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 }, 2.9);
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

      <div className="layout-max">
        <div className="grid gap-10 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20">
          <div data-value-chapter className="md:pt-2">
            <ChapterMarker num="01" label="Denken" />
          </div>

          <div className="max-w-[56rem]">
            <h2
              id="value-heading"
              className="font-instrument text-[1.9rem] leading-[1.22] tracking-[-0.025em] text-white sm:text-[2.35rem] md:text-[2.9rem] lg:text-[3.3rem]"
            >
              <span data-value-dropcap className="drop-cap">W</span>
              <span
                data-value-sentence
                className="block will-change-[opacity,transform,filter]"
              >
                {SENTENCES[0].text}
              </span>

              <span
                data-value-sentence
                className="mt-10 block text-white/55 will-change-[opacity,transform,filter] sm:mt-12"
              >
                {SENTENCES[1].text}
              </span>

              <span
                data-value-sentence
                className="mt-10 block will-change-[opacity,transform,filter] sm:mt-12"
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
                    className="flex items-baseline gap-2"
                  >
                    <span className="font-instrument text-[15px] italic text-white/55">
                      {it.n}
                    </span>
                    <span className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.26em] text-white/55 sm:text-[11px]">
                      {it.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
