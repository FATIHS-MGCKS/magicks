import { motion, useMotionValueEvent, useScroll, useTransform, MotionValue } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { SectionEyebrow } from "./SectionEyebrow";
import { ThinkingAsciiField } from "./ThinkingAsciiField";

/**
 * A component that reveals text character by character based on scroll progress.
 */
function ScrollTypewriter({
  text,
  progress,
  start,
  end,
  className,
}: {
  text: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  className?: string;
}) {
  const words = useMemo(() => text.split(" "), [text]);
  const [visibleWordCount, setVisibleWordCount] = useState(0);
  const revealProgress = useTransform(progress, [start, end], [0, 1], { clamp: true });

  useMotionValueEvent(revealProgress, "change", (latest) => {
    const clamped = Math.max(0, Math.min(1, latest));
    const nextVisibleWords = Math.round(clamped * words.length);
    setVisibleWordCount((prev) => (prev === nextVisibleWords ? prev : nextVisibleWords));
  });

  const safeVisibleWords = Math.max(0, Math.min(words.length, visibleWordCount));
  const visibleText = words.slice(0, safeVisibleWords).join(" ");
  const remainingText = words.slice(safeVisibleWords).join(" ");

  return (
    <span className={className}>
      {visibleText.length > 0 ? <span className="text-white">{visibleText}{remainingText.length > 0 ? " " : ""}</span> : null}
      {safeVisibleWords < words.length ? (
        <span
          className="mx-[0.01em] inline-block h-[0.92em] w-px translate-y-[0.12em] bg-white/55 align-baseline"
          aria-hidden
        />
      ) : null}
      <span className="text-white/20">{remainingText}</span>
    </span>
  );
}

/**
 * „Wie wir denken“ — manifesto block with calm ambient visual and scroll-triggered typewriter effect.
 */
export function ThinkingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Track scroll progress through this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 75%"], // Start animating when top hits 75% of viewport, end when bottom hits 75%
  });

  // Overall fade-in for the panel background and structure
  const panelOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const panelY = useTransform(scrollYProgress, [0, 0.1], [20, 0]);

  // Visual fade-in
  const visualOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const visualY = useTransform(scrollYProgress, [0.1, 0.3], [20, 0]);
  const tagOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

  return (
    <section
      id="denken"
      ref={sectionRef}
      className="relative min-h-[150vh] bg-[#0A0A0A] px-5 py-16 md:py-20 lg:py-28" // Increased height to allow scrolling
      aria-labelledby="thinking-heading"
    >
      <div className="pointer-events-none absolute inset-0 section-gradient opacity-70" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_50%,transparent_20%,#0A0A0A_88%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="sticky top-0 layout-max relative flex min-h-[min(100vh,1080px)] flex-col justify-center">
        <div className="grid flex-1 items-center lg:items-stretch gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 xl:gap-20">
          <motion.article
            className="thinking-panel order-1 lg:order-none flex flex-col justify-center"
            style={{ opacity: panelOpacity, y: panelY }}
          >
            <p className="mb-5">
              <SectionEyebrow>Wie wir denken</SectionEyebrow>
            </p>
            <h2
              id="thinking-heading"
              className="font-instrument mb-6 max-w-[24ch] text-[1.52rem] leading-[1.15] tracking-[-0.03em] text-white sm:text-[1.72rem] md:text-[clamp(1.72rem,2.4vw,2.12rem)]"
            >
              <ScrollTypewriter 
                text="Digitalisierung ist kein Nebenprojekt mehr." 
                progress={scrollYProgress} 
                start={0.1} 
                end={0.3} 
              />
            </h2>
            <div className="font-ui space-y-4 text-[1rem] leading-[1.72] text-white/80 md:text-[1.02rem] md:leading-[1.75]">
              <p>
                <ScrollTypewriter 
                  text="Sichtbare Markenqualität und funktionierende Systeme gehören zusammen: Was nach außen modern wirkt, muss innen tragfähig sein — und umgekehrt." 
                  progress={scrollYProgress} 
                  start={0.3} 
                  end={0.5} 
                />
              </p>
              <p className="text-[1.02rem] font-medium tracking-[-0.01em] text-white">
                <ScrollTypewriter 
                  text="MAGICKS verbindet Gestaltung, Web und Software mit unternehmerischem Maß." 
                  progress={scrollYProgress} 
                  start={0.5} 
                  end={0.65} 
                />
              </p>
              <p>
                <ScrollTypewriter 
                  text="Wir setzen auf klare Strukturen, saubere Umsetzung und dort, wo es sinnvoll ist, Automation und KI — ohne Hype, mit nachvollziehbarem Nutzen." 
                  progress={scrollYProgress} 
                  start={0.65} 
                  end={0.85} 
                />
              </p>
              <p className="text-white/90">
                <ScrollTypewriter 
                  text="Ziel bleibt: Sie treten moderner auf, kommunizieren klarer und arbeiten digital effizienter." 
                  progress={scrollYProgress} 
                  start={0.85} 
                  end={1.0} 
                />
              </p>
            </div>
            
            <motion.p 
              className="font-ui mt-8 flex flex-wrap gap-x-3 gap-y-1 border-t border-white/[0.08] pt-6 text-[11px] font-medium uppercase tracking-[0.2em] text-white/32"
              style={{ opacity: tagOpacity }}
            >
              <span>Markenauftritte</span>
              <span className="text-white/18" aria-hidden>
                /
              </span>
              <span>Lösungen</span>
              <span className="text-white/18" aria-hidden>
                /
              </span>
              <span>Automation</span>
              <span className="text-white/18" aria-hidden>
                /
              </span>
              <span>KI</span>
            </motion.p>
          </motion.article>

          <motion.div
            className="relative order-2 h-[380px] sm:h-[420px] w-full lg:order-none lg:h-auto"
            style={{ opacity: visualOpacity, y: visualY }}
          >
            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-sky-500/[0.035] via-transparent to-violet-500/[0.04] blur-2xl" aria-hidden />
            <div className="relative h-full w-full overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-[#050608]/90 shadow-[0_32px_80px_-40px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.04)]">
              <ThinkingAsciiField className="h-full w-full" scrollYProgress={scrollYProgress} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
