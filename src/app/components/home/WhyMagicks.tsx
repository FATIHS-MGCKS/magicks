import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ChapterMarker } from "./ChapterMarker";

/**
 * Statements are set in giant Instrument Serif — each on its own line pair.
 * Numerals hang in the left margin as superscript italics. Marginalia
 * lives in a narrow right column in monospace, like footnotes in print.
 */
const PRINCIPLES: {
  sup: string;
  line1: string;
  line2?: string;
  tone: "strong" | "hush";
  note: string;
}[] = [
  {
    sup: "01",
    line1: "Keine Umwege.",
    line2: "Wir bauen direkt.",
    tone: "strong",
    note:
      "Sie sprechen mit den Menschen, die bauen. Keine Projektleitung, die Mails weiterreicht.",
  },
  {
    sup: "02",
    line1: "Design und Code",
    line2: "aus einer Hand.",
    tone: "hush",
    note:
      "Markengefühl und Umsetzung auf einer Linie — kein Verlust zwischen Kreativ und Entwicklung.",
  },
  {
    sup: "03",
    line1: "Automation als",
    line2: "Verantwortung.",
    tone: "strong",
    note:
      "Wir automatisieren dort, wo die Entlastung nachweisbar ist — mit Regeln, die Ihr Team versteht.",
  },
  {
    sup: "04",
    line1: "Jede Entscheidung",
    line2: "nachvollziehbar.",
    tone: "hush",
    note:
      "Kein Blackbox-Effekt. Alles dokumentiert, messbar, übergabefähig — auch ohne uns.",
  },
];

export function WhyMagicks() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const chapter = root.querySelector<HTMLElement>("[data-why-chapter]");
      const intro = root.querySelector<HTMLElement>("[data-why-intro]");
      const rows = gsap.utils.toArray<HTMLElement>("[data-why-row]");

      if (reduced) {
        gsap.set([chapter, intro, ...rows], { opacity: 1, y: 0 });
        rows.forEach((r) => {
          gsap.set(r.querySelectorAll("[data-why-sup], [data-why-line], [data-why-note]"), {
            opacity: 1,
            y: 0,
            yPercent: 0,
          });
        });
        return;
      }

      gsap.set(chapter, { opacity: 0, y: 14 });
      gsap.set(intro, { opacity: 0, y: 18 });

      gsap.to(chapter, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: chapter, start: "top 82%", once: true },
      });
      gsap.to(intro, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: { trigger: intro, start: "top 82%", once: true },
      });

      rows.forEach((row, i) => {
        const sup = row.querySelector<HTMLElement>("[data-why-sup]");
        const lines = row.querySelectorAll<HTMLElement>("[data-why-line]");
        const note = row.querySelector<HTMLElement>("[data-why-note]");

        // Intentionally slow for the first three — the fourth lands fast as a punctuation.
        const isPunch = i === PRINCIPLES.length - 1;
        const lineDuration = isPunch ? 0.9 : 1.45;
        const lineEase = isPunch ? "power4.out" : "power1.out";

        gsap.set(sup, { opacity: 0, y: 10 });
        gsap.set(lines, { yPercent: 115, opacity: 0 });
        gsap.set(note, { opacity: 0, y: 10 });

        gsap
          .timeline({
            scrollTrigger: { trigger: row, start: "top 78%", once: true },
            defaults: { ease: "power2.out" },
          })
          .to(sup, { opacity: 1, y: 0, duration: 0.85 }, 0)
          .to(
            lines,
            {
              yPercent: 0,
              opacity: 1,
              duration: lineDuration,
              ease: lineEase,
              stagger: isPunch ? 0.06 : 0.12,
            },
            0.15,
          )
          .to(note, { opacity: 0.72, y: 0, duration: 0.95 }, lineDuration * 0.7 + 0.2);
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="warum"
      className="relative overflow-hidden bg-[#090909] px-5 py-32 sm:px-8 sm:py-44 md:px-12 md:py-56 lg:px-16 lg:py-64"
      aria-labelledby="why-heading"
    >
      <div aria-hidden className="section-top-rule" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 68% 42% at 50% 0%, rgba(255,255,255,0.028), transparent 62%)",
        }}
      />

      <div className="layout-max">
        <div className="mb-16 grid gap-6 md:mb-24 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20">
          <div data-why-chapter className="md:pt-2">
            <ChapterMarker num="03" label="Unterschied" />
          </div>

          <div data-why-intro>
            <h2
              id="why-heading"
              className="font-instrument text-[1.9rem] leading-[1.05] tracking-[-0.025em] text-white sm:text-[2.4rem] md:text-[2.95rem] lg:text-[3.3rem]"
            >
              Kern der Arbeit. <em className="italic text-white/50">Nicht Aufsatz.</em>
            </h2>
            <p className="font-ui mt-8 max-w-xl text-[14.5px] leading-[1.7] text-white/50 md:mt-10 md:text-[15.5px]">
              Vier Prinzipien. Sie entscheiden, was wir annehmen und was wir bewusst nicht machen.
              Sie laufen nicht als Slogan im Kopf — sie laufen als Betriebssystem.
            </p>
          </div>
        </div>

        <ol className="relative">
          {PRINCIPLES.map((p, i) => (
            <li
              key={p.sup}
              data-why-row
              className={`relative grid items-start gap-x-6 gap-y-4 py-12 sm:gap-x-10 sm:py-16 md:grid-cols-[minmax(56px,80px)_minmax(0,1fr)_minmax(220px,360px)] md:gap-x-16 md:py-24 lg:gap-x-20 lg:py-28 ${
                i > 0 ? "border-t border-white/[0.06]" : ""
              }`}
            >
              {/* Hanging superscript numeral */}
              <span className="flex items-start justify-start md:justify-end md:pt-[0.85rem]">
                <span
                  data-why-sup
                  className="why-superscript text-[1.4rem] sm:text-[1.65rem] md:text-[1.9rem]"
                >
                  {p.sup}
                </span>
              </span>

              {/* Statement — giant serif, two lines */}
              <h3
                className={`font-instrument tracking-[-0.028em] ${
                  p.tone === "hush" ? "text-white/82" : "text-white"
                } text-[2rem] leading-[0.98] sm:text-[2.9rem] md:text-[4rem] lg:text-[4.6rem] xl:text-[5.2rem]`}
              >
                <span className="block overflow-hidden">
                  <span data-why-line className="block">
                    {p.line1}
                  </span>
                </span>
                {p.line2 ? (
                  <span className="block overflow-hidden">
                    <span
                      data-why-line
                      className={`block ${i % 2 === 1 ? "italic text-white/58" : ""}`}
                    >
                      {p.line2}
                    </span>
                  </span>
                ) : null}
              </h3>

              {/* Marginalia — narrow monospace column on the right */}
              <aside className="md:pt-[1.1rem]">
                <p
                  data-why-note
                  className="font-mono max-w-[36ch] text-[11.5px] leading-[1.7] tracking-[0.04em] text-white/58 sm:text-[12px]"
                >
                  <span aria-hidden className="mr-2 inline-block h-px w-6 bg-white/35 align-middle" />
                  {p.note}
                </p>
              </aside>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
