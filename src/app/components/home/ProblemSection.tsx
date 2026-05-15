import { useLayoutEffect, useRef, useState } from "react";
import {
  BarChart3,
  ChevronUp,
  Gauge,
  MessageSquare,
  MousePointer2,
  Search,
  Shield,
  Smartphone,
  UserRound,
  AlertTriangle,
} from "lucide-react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Sektion 03 — Problem.
 *
 * Manual iPhone slider with dot navigation for all breakpoints.
 * Mobile keeps the intro centered; desktop uses a more compact composition.
 */

type ProblemSlide = {
  kicker: string;
  title: string;
  body: string;
  chips: string[];
  variant: "search" | "trust" | "conversion";
};

const PHONE_FRAME_SRC = "/media/home/ihpone-display.webp";

const PROBLEM_SLIDES: ProblemSlide[] = [
  {
    kicker: "Problem 1 / 3",
    title: "Kunden suchen —\naber finden andere",
    body: "Wenn Ihre Website bei relevanten Suchanfragen nicht sichtbar ist, gewinnen oft nicht die besten Anbieter, sondern die, die online präsenter, klarer und vertrauenswürdiger auftreten.",
    chips: ["SEO", "Lokale Suche", "GEO"],
    variant: "search",
  },
  {
    kicker: "Problem 2 / 3",
    title: "Der erste Eindruck\nüberzeugt nicht",
    body: "Viele Kunden prüfen Ihr Unternehmen online, bevor sie Kontakt aufnehmen. Wirkt der Auftritt veraltet, austauschbar oder unklar, entsteht Unsicherheit — noch bevor ein Gespräch stattfindet.",
    chips: ["Vertrauen", "Erster Eindruck", "Klarheit"],
    variant: "trust",
  },
  {
    kicker: "Problem 3 / 3",
    title: "Ihre Website verkauft\nnicht mit",
    body: "Gutes Webdesign ist nicht nur Optik. Geschwindigkeit, mobile Nutzerführung, klare Inhalte und starke Handlungswege entscheiden mit, ob Besucher bleiben, klicken und anfragen.",
    chips: ["Performance", "Nutzerführung", "Anfragen"],
    variant: "conversion",
  },
];

export function ProblemSection() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const copyItems = gsap.utils.toArray<HTMLElement>("[data-problem-copy]");
      const phones = gsap.utils.toArray<HTMLElement>("[data-problem-phone]");
      const closing = root.querySelector<HTMLElement>("[data-problem-closing]");
      const ambient = root.querySelector<HTMLElement>("[data-problem-ambient]");

      if (reduced) {
        gsap.set([...phones, closing, ambient].filter(Boolean) as HTMLElement[], {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        });
        return;
      }

      if (ambient) {
        gsap.fromTo(
          ambient,
          { opacity: 0.35, yPercent: -2 },
          {
            opacity: 0.9,
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      gsap.fromTo(
        copyItems,
        { opacity: 0, y: 22, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.08,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 76%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        phones,
        { opacity: 0, y: 34, scale: 0.975, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        closing,
        { opacity: 0, y: 34, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "power3.out",
          scrollTrigger: {
            trigger: closing,
            start: "top 80%",
            end: "top 50%",
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const clampedSlide = Math.max(0, Math.min(activeSlide, PROBLEM_SLIDES.length - 1));

  return (
    <section
      ref={rootRef}
      id="problem"
      className="relative overflow-hidden bg-[var(--magicks-bg-base)] px-5 py-20 sm:px-8 sm:py-28 md:px-12 lg:px-16 lg:py-20"
      aria-labelledby="problem-heading"
    >
      <div aria-hidden className="section-top-rule" />

      <div
        data-problem-ambient
        aria-hidden
        className="pointer-events-none absolute inset-0 will-change-[opacity,transform]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 48% 36% at 78% 30%, rgba(92,122,154,0.16), transparent 72%), radial-gradient(ellipse 54% 40% at 22% 22%, rgba(166,138,98,0.14), transparent 72%), radial-gradient(ellipse 44% 32% at 50% 96%, rgba(255,255,255,0.62), transparent 74%)",
        }}
      />

      <div className="relative layout-max">
        <div
          data-problem-desktop
          className="mx-auto hidden max-w-[84rem] lg:block"
        >
          <div className="grid w-full grid-cols-[0.46fr_0.54fr] items-center gap-10 xl:gap-14">
            <ProblemIntro />

            <div
              data-problem-phone
              className="relative mx-auto w-[clamp(320px,30vw,440px)] will-change-[opacity,transform,filter]"
            >
              <ProblemIphoneMockup
                activeIndex={clampedSlide}
                onSlideChange={(index) => setActiveSlide(index)}
              />
              <ProblemSliderDots activeIndex={clampedSlide} onSelect={setActiveSlide} className="mt-7" />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[32rem] lg:hidden">
          <ProblemIntro />

          <div data-problem-phone className="mx-auto mt-12 will-change-[opacity,transform,filter]">
            <ProblemIphoneMockup
              activeIndex={clampedSlide}
              onSlideChange={(index) => setActiveSlide(index)}
            />
          </div>

          <ProblemSliderDots activeIndex={clampedSlide} onSelect={setActiveSlide} className="mt-6" />
        </div>

        <ProblemClosing />
      </div>
    </section>
  );
}

function ProblemIntro() {
  return (
    <div className="relative z-10 text-center lg:text-left">
      <span
        data-problem-copy
        className="mx-auto inline-flex items-center gap-3 rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.22)] bg-[rgb(var(--magicks-accent-rgb)/0.07)] px-3 py-2 font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.78)] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] sm:text-[11px] sm:tracking-[0.22em] lg:mx-0"
      >
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--magicks-accent-rgb)/0.72)]"
        />
        UNGENUTZTE CHANCEN
      </span>

      <h2
        id="problem-heading"
        data-problem-copy
        className="font-ui mx-auto mt-6 max-w-[17ch] text-[2.25rem] font-[700] leading-[0.98] tracking-[-0.044em] text-[rgb(var(--magicks-ink-rgb)/0.98)] will-change-[opacity,transform,filter] sm:text-[2.85rem] md:text-[62px] lg:mx-0 lg:max-w-[15ch] lg:text-[4.45rem]"
      >
        <span className="block">Ihre Webseite ist</span>
        <span className="block whitespace-nowrap text-emerald-700">
          <span className="inline-flex items-center whitespace-nowrap">
            <span
              aria-hidden
              className="relative -top-[0.04em] mr-2 inline-block h-[0.4em] w-[0.4em] rounded-full bg-emerald-500 align-middle shadow-[0_0_0_0.22em_rgba(16,185,129,0.14),0_0_1em_rgba(16,185,129,0.38)]"
            />
            Online
          </span>
          .
        </span>
        <span className="block">Aber verkauft sie auch?</span>
      </h2>

      <p
        data-problem-copy
        className="font-ui mx-auto mt-7 max-w-[36rem] text-justify text-[1.08rem] font-[540] leading-[1.52] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.82)] will-change-[opacity,transform,filter] sm:text-[1.2rem] md:text-[1.32rem] lg:text-[1.24rem]"
      >
        Ihre Website arbeitet rund um die Uhr für Ihr Unternehmen. Sie
        präsentiert Ihr Angebot, erklärt Ihre Leistungen und macht aus Besuchern
        Anfragen.
      </p>

      <p
        data-problem-copy
        className="font-ui mx-auto mt-5 max-w-[38rem] rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] px-5 py-5 text-center text-[0.98rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] shadow-[0_28px_78px_-58px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.72)] will-change-[opacity,transform,filter] sm:px-6 sm:py-6 sm:text-[1.02rem] lg:text-[1.06rem]"
      >
        <span className="block">Doch wenn am Ende keine Kontakte,</span>
        <span className="block">keine Buchungen und keine neuen</span>
        <span className="block">Kunden entstehen, bleibt sie nur</span>
        <span className="block">
          <strong className="font-[680] text-[rgb(var(--magicks-ink-rgb)/0.82)]">
            sichtbar
          </strong>{" "}
          aber nicht{" "}
          <strong className="font-[720] text-[rgb(var(--magicks-ink-rgb)/0.9)] underline decoration-[rgb(var(--magicks-accent-rgb)/0.42)] decoration-2 underline-offset-[0.16em]">
            wirksam
          </strong>
          .
        </span>
      </p>
    </div>
  );
}

function ProblemIphoneMockup({
  activeIndex,
  onSlideChange,
}: {
  activeIndex: number;
  onSlideChange: (index: number) => void;
}) {
  const clampedIndex = Math.max(0, Math.min(activeIndex, PROBLEM_SLIDES.length - 1));
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number | null;
    dragging: boolean;
    startX: number;
    latestX: number;
    startedAt: number;
    updatedAt: number;
  }>({
    pointerId: null,
    dragging: false,
    startX: 0,
    latestX: 0,
    startedAt: 0,
    updatedAt: 0,
  });
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [snapDurationMs, setSnapDurationMs] = useState(320);

  const clampSlideIndex = (index: number) =>
    Math.max(0, Math.min(index, PROBLEM_SLIDES.length - 1));

  const applyEdgeResistance = (deltaX: number) => {
    const isAtFirstSlide = clampedIndex === 0;
    const isAtLastSlide = clampedIndex === PROBLEM_SLIDES.length - 1;

    if ((isAtFirstSlide && deltaX > 0) || (isAtLastSlide && deltaX < 0)) {
      return deltaX * 0.34;
    }
    return deltaX;
  };

  const completeDrag = (deltaX: number, velocityX: number) => {
    const viewportWidth = viewportRef.current?.clientWidth ?? 0;
    const distanceThreshold = Math.max(36, Math.min(84, viewportWidth * 0.14));
    const flickVelocityThreshold = 0.42;
    const flickDistanceThreshold = 18;

    let nextIndex = clampedIndex;

    if (
      deltaX <= -distanceThreshold ||
      (velocityX <= -flickVelocityThreshold && deltaX <= -flickDistanceThreshold)
    ) {
      nextIndex = clampSlideIndex(clampedIndex + 1);
    } else if (
      deltaX >= distanceThreshold ||
      (velocityX >= flickVelocityThreshold && deltaX >= flickDistanceThreshold)
    ) {
      nextIndex = clampSlideIndex(clampedIndex - 1);
    }

    const hasSlideChanged = nextIndex !== clampedIndex;
    if (hasSlideChanged) {
      setSnapDurationMs(Math.abs(velocityX) > 0.75 ? 250 : 320);
      onSlideChange(nextIndex);
    } else {
      setSnapDurationMs(220);
    }

    setDragOffsetPx(0);
    setIsDragging(false);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    dragRef.current = {
      pointerId: event.pointerId,
      dragging: true,
      startX: event.clientX,
      latestX: event.clientX,
      startedAt: event.timeStamp,
      updatedAt: event.timeStamp,
    };
    setDragOffsetPx(0);
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragRef.current;
    if (!state.dragging || state.pointerId !== event.pointerId) return;

    state.latestX = event.clientX;
    state.updatedAt = event.timeStamp;
    const rawDelta = state.latestX - state.startX;
    const resistantDelta = applyEdgeResistance(rawDelta);
    const viewportWidth = viewportRef.current?.clientWidth ?? 0;
    const limit = viewportWidth > 0 ? viewportWidth * 0.32 : 110;
    const boundedDelta = Math.max(-limit, Math.min(limit, resistantDelta));
    setDragOffsetPx(boundedDelta);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragRef.current;
    if (!state.dragging || state.pointerId !== event.pointerId) return;

    const deltaX = state.latestX - state.startX;
    const elapsedMs = Math.max(16, state.updatedAt - state.startedAt);
    const velocityX = deltaX / elapsedMs;
    state.dragging = false;
    state.pointerId = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    completeDrag(deltaX, velocityX);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragRef.current;
    if (state.pointerId === event.pointerId) {
      state.dragging = false;
      state.pointerId = null;
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setSnapDurationMs(220);
    setDragOffsetPx(0);
    setIsDragging(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      onSlideChange(clampSlideIndex(clampedIndex + 1));
    } else if (event.key === "ArrowLeft") {
      onSlideChange(clampSlideIndex(clampedIndex - 1));
    }
  };

  return (
    <div
      className="relative mx-auto aspect-[0.72] w-[min(92vw,390px)] overflow-visible lg:w-full"
      aria-label="iPhone Darstellung der drei zentralen Website-Probleme"
    >
      <div
        aria-hidden
        className="absolute -inset-[8%] rounded-[42%] bg-[radial-gradient(circle_at_50%_44%,rgba(138,160,185,0.2),transparent_58%)] blur-2xl"
      />

      <div
        ref={viewportRef}
        className={`absolute inset-[3.2%_5.6%] z-20 overflow-hidden rounded-[2.55rem] [touch-action:pan-y] sm:rounded-[3rem] ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div
          className={`flex h-full w-full select-none will-change-transform ${
            isDragging
              ? "transition-none"
              : "transition-transform ease-[cubic-bezier(0.22,1,0.36,1)]"
          }`}
          style={{
            transform: `translate3d(calc(-${clampedIndex * 100}% + ${dragOffsetPx}px), 0, 0)`,
            transitionDuration: `${snapDurationMs}ms`,
          }}
        >
          {PROBLEM_SLIDES.map((slide, index) => (
            <div
              key={slide.kicker}
              aria-hidden={index !== clampedIndex}
              className="h-full min-w-full"
            >
              <ProblemPhoneScreen slide={slide} />
            </div>
          ))}
        </div>
      </div>

      <img
        src={PHONE_FRAME_SRC}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full select-none object-contain"
      />
    </div>
  );
}

function ProblemPhoneScreen({
  slide,
}: {
  slide: ProblemSlide;
}) {
  return (
    <article className="grid h-full grid-rows-[auto_auto_auto_minmax(0,1fr)_auto] px-[7.2%] pb-[5.8%] pt-[16%] text-center">
      <div className="mx-auto inline-flex rounded-full border border-[rgba(20,28,44,0.06)] bg-white/68 px-2 py-0.5 font-ui text-[0.55rem] font-[520] tracking-[-0.01em] text-[rgba(20,28,44,0.44)] shadow-[0_8px_20px_-20px_rgba(20,28,44,0.26),inset_0_1px_0_rgba(255,255,255,0.9)] sm:text-[0.62rem]">
        {slide.kicker}
      </div>

      <h3 className="mx-auto mt-3 max-w-[9.5em] whitespace-pre-line font-ui text-[1.3rem] font-[720] leading-[1.05] tracking-[-0.04em] text-[rgba(13,17,23,0.96)] sm:text-[1.52rem]">
        {slide.title}
      </h3>

      <p className="mx-auto mt-2.5 max-w-[25.5em] font-ui text-[0.7rem] font-[460] leading-[1.42] tracking-[-0.012em] text-[rgba(18,24,34,0.72)] sm:text-[0.8rem]">
        {slide.body}
      </p>

      <div className="relative flex min-h-0 items-center justify-center py-2">
        <ProblemScreenIllustration variant={slide.variant} />
      </div>

      <div className="rounded-[0.8rem] border border-[rgba(20,28,44,0.055)] bg-white/78 p-1 shadow-[0_12px_24px_-26px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="grid grid-cols-3 divide-x divide-[rgba(20,28,44,0.07)]">
          {slide.chips.map((chip, chipIndex) => (
            <div
              key={chip}
              className="flex min-h-[1.82rem] flex-col items-center justify-center gap-0.5 px-1 font-ui text-[0.52rem] font-[520] tracking-[-0.012em] text-[rgba(18,24,34,0.76)] sm:min-h-[2.05rem] sm:text-[0.58rem]"
            >
              <ChipIcon variant={slide.variant} index={chipIndex} />
              <span>{chip}</span>
            </div>
          ))}
        </div>
      </div>

    </article>
  );
}

function ProblemSliderDots({
  activeIndex,
  onSelect,
  className = "",
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center gap-1.5 ${className}`.trim()}
      aria-label="Navigation der Problem-Screens"
    >
      {PROBLEM_SLIDES.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={slide.kicker}
            type="button"
            aria-pressed={isActive}
            aria-label={`Problem-Screen ${index + 1} anzeigen`}
            onClick={() => onSelect(index)}
            className="group flex h-11 w-11 items-center justify-center"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "scale-100 bg-[rgba(18,24,34,0.84)]"
                  : "scale-90 bg-[rgba(18,24,34,0.18)] group-hover:scale-100 group-hover:bg-[rgba(18,24,34,0.34)]"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function ProblemScreenIllustration({
  variant,
}: {
  variant: ProblemSlide["variant"];
}) {
  if (variant === "search") return <SearchIllustration />;
  if (variant === "trust") return <TrustIllustration />;
  return <ConversionIllustration />;
}

function SearchIllustration() {
  return (
    <div aria-hidden className="relative h-[8.2rem] w-full max-w-[13.8rem] sm:h-[9rem] sm:max-w-[15rem]">
      <div className="absolute inset-x-[6%] top-[33%] h-[40%] rounded-[1.6rem] bg-[rgba(255,34,50,0.07)] blur-lg" />

      <div className="absolute left-[6%] right-[6%] top-[0%] flex h-[1.58rem] items-center gap-1.5 rounded-full border border-[rgba(31,41,55,0.075)] bg-white/72 px-3 shadow-[0_12px_28px_-28px_rgba(31,41,55,0.3),inset_0_1px_0_rgba(255,255,255,0.9)]">
        <Search size={12} strokeWidth={1.65} className="shrink-0 text-[rgba(39,48,64,0.56)]" />
        <span className="h-1.5 w-[42%] rounded-full bg-[rgba(39,48,64,0.06)]" />
      </div>

      <div className="absolute left-[4%] right-[4%] top-[30%] flex h-[2.6rem] items-center gap-[0.4375rem] rounded-[0.78rem] border border-[rgba(244,63,78,0.07)] bg-white/94 px-2 py-1.5 text-left shadow-[0_16px_34px_-28px_rgba(244,63,78,0.24),0_0_24px_rgba(244,63,78,0.06),inset_0_1px_0_rgba(255,255,255,0.92)]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(244,63,78,0.08)] font-ui text-[0.82rem] font-[760] tracking-[-0.055em] text-[rgb(224,20,38)] sm:h-9 sm:w-9 sm:text-[0.92rem]">
          #1
        </div>

        <div className="min-w-0 flex-1">
          <div className="font-ui text-[0.58rem] font-[760] leading-none tracking-[-0.035em] text-[rgb(207,18,34)] sm:text-[0.64rem]">
            Nicht Ihr Unternehmen
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-1 w-[58%] rounded-full bg-[rgb(255,23,42)] shadow-[0_4px_10px_rgba(255,23,42,0.18)]" />
            <span className="h-1 w-[24%] rounded-full bg-[rgba(255,23,42,0.08)]" />
          </div>
          <span className="mt-1 block h-1 w-[78%] rounded-full bg-[rgba(255,23,42,0.06)]" />
          <span className="mt-1 block h-1 w-[58%] rounded-full bg-[rgba(255,23,42,0.04)]" />
        </div>

        <div className="relative h-[2.25rem] w-[2.8rem] shrink-0 overflow-visible rounded-[0.52rem] bg-[linear-gradient(135deg,rgba(201,213,222,0.96),rgba(246,239,228,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
          <div className="absolute inset-x-[10%] bottom-[18%] h-[42%] rounded-[0.18rem] bg-[linear-gradient(135deg,rgba(72,84,93,0.86),rgba(22,28,34,0.78))]" />
          <div className="absolute left-[12%] top-[24%] h-[30%] w-[36%] rounded-[0.16rem] bg-[rgba(255,255,255,0.72)]" />
          <div className="absolute right-[10%] top-[18%] h-[38%] w-[34%] rounded-[0.16rem] bg-[rgba(255,255,255,0.56)]" />
          <div className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-[0.45rem] bg-[rgb(255,92,105)] text-white shadow-[0_10px_18px_-10px_rgba(244,63,78,0.74)]">
            <svg viewBox="0 0 16 16" width="10" height="10" fill="none" aria-hidden>
              <path d="M8 14S3.5 10.1 3.5 6.7A4.5 4.5 0 0 1 12.5 6.7C12.5 10.1 8 14 8 14Z" fill="currentColor" />
              <circle cx="8" cy="6.9" r="1.55" fill="rgba(255,255,255,0.95)" />
            </svg>
          </div>
        </div>

        <div className="absolute right-[29%] top-[45%] flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(244,63,78,0.08)] text-[rgb(244,63,78)]">
          <AlertTriangle size={9} strokeWidth={1.8} />
        </div>
      </div>

      <SearchResultGhost className="top-[63%]" index="#2" tone="red" />
      <SearchResultGhost className="top-[80%]" index="#3" tone="blue" />
    </div>
  );
}

function SearchResultGhost({
  className,
  index,
  tone,
}: {
  className: string;
  index: string;
  tone: "red" | "blue";
}) {
  return (
    <div className={`absolute left-[10%] right-[10%] flex h-[1.72rem] items-center gap-1.5 rounded-[0.58rem] border border-[rgba(31,41,55,0.035)] bg-white/5 px-[0.4375rem] text-left opacity-62 shadow-[0_8px_18px_-22px_rgba(31,41,55,0.18)] ${className}`}>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/56 font-ui text-[0.52rem] font-[720] tracking-[-0.04em] text-[rgba(31,41,55,0.34)]">
        {index}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block h-[3px] w-[46%] rounded-full bg-[rgba(31,41,55,0.09)]" />
        <span className="mt-[3px] block h-[3px] w-[76%] rounded-full bg-[rgba(31,41,55,0.05)]" />
        <span className="mt-[3px] block h-[3px] w-[58%] rounded-full bg-[rgba(31,41,55,0.035)]" />
      </span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[0.4rem] ${
          tone === "red"
            ? "bg-[rgba(244,63,78,0.055)] text-[rgba(244,63,78,0.5)]"
            : "bg-[rgba(82,125,236,0.065)] text-[rgba(82,125,236,0.5)]"
        }`}
      >
        <svg viewBox="0 0 16 16" width="9" height="9" fill="none" aria-hidden>
          <path d="M8 14S3.5 10.1 3.5 6.7A4.5 4.5 0 0 1 12.5 6.7C12.5 10.1 8 14 8 14Z" fill="currentColor" />
          <circle cx="8" cy="6.9" r="1.55" fill="rgba(255,255,255,0.82)" />
        </svg>
      </span>
    </div>
  );
}

function TrustIllustration() {
  return (
    <div aria-hidden className="relative h-[8.2rem] w-full max-w-[13.8rem] sm:h-[9rem] sm:max-w-[15rem]">
      <div className="absolute inset-x-[4%] top-[18%] h-[66%] rounded-[1.7rem] bg-[rgba(216,224,232,0.3)] blur-lg" />

      <div className="absolute inset-x-[2%] inset-y-[2%] overflow-hidden rounded-[0.95rem] border border-[rgba(31,41,55,0.08)] bg-white/78 shadow-[0_18px_42px_-32px_rgba(31,41,55,0.3),inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="flex h-[1.05rem] items-center justify-between border-b border-[rgba(31,41,55,0.045)] bg-[rgba(246,247,249,0.72)] px-2">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[rgba(31,41,55,0.24)]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[rgba(31,41,55,0.18)]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[rgba(31,41,55,0.12)]" />
          </div>
          <AlertBadge size="sm" />
        </div>

        <div className="px-2.5 py-2">
          <div className="flex justify-between gap-2">
            <span className="h-1 w-[18%] rounded-full bg-[rgba(31,41,55,0.12)]" />
            <span className="h-1 w-[20%] rounded-full bg-[rgba(31,41,55,0.1)]" />
            <span className="h-1 w-[18%] rounded-full bg-[rgba(31,41,55,0.09)]" />
            <span className="h-1 w-[16%] rounded-full bg-[rgba(31,41,55,0.08)]" />
          </div>

          <div className="relative mt-3 grid grid-cols-[1fr_0.95fr] gap-3 rounded-[0.55rem] bg-[rgba(246,247,249,0.62)] p-2">
            <div className="relative h-11 overflow-hidden rounded-[0.45rem] bg-[linear-gradient(135deg,rgba(216,221,227,0.74),rgba(238,240,243,0.82))]">
              <span className="absolute left-[14%] top-[48%] h-[42%] w-[58%] rounded-t-[0.35rem] bg-[rgba(198,204,211,0.62)]" />
              <span className="absolute right-[8%] top-[38%] h-[52%] w-[48%] rounded-t-[0.4rem] bg-[rgba(210,215,221,0.74)]" />
              <span className="absolute left-[34%] top-[19%] h-3.5 w-3.5 rounded-full bg-[rgba(204,210,217,0.74)]" />
            </div>
            <div className="pt-2 text-left">
              <span className="block h-1.5 w-[72%] rounded-full bg-[rgba(31,41,55,0.22)]" />
              <span className="mt-1.5 block h-1 w-[92%] rounded-full bg-[rgba(31,41,55,0.12)]" />
              <span className="mt-1.5 block h-1 w-[72%] rounded-full bg-[rgba(31,41,55,0.09)]" />
              <span className="mt-2 block h-3 w-[48%] rounded-[0.25rem] bg-[rgba(31,41,55,0.12)]" />
            </div>
            <div className="absolute right-2 top-2">
              <AlertBadge />
            </div>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((index) => (
              <div key={index} className="rounded-[0.45rem] bg-[rgba(246,247,249,0.7)] px-2 py-2">
                <span className="mx-auto block h-4 w-4 rounded-full bg-[rgba(31,41,55,0.12)]" />
                <span className="mx-auto mt-2 block h-1.5 w-[78%] rounded-full bg-[rgba(31,41,55,0.12)]" />
                <span className="mx-auto mt-1 block h-1 w-[58%] rounded-full bg-[rgba(31,41,55,0.08)]" />
              </div>
            ))}
          </div>

          <div className="relative mt-2 flex h-8 items-center gap-3 rounded-[0.45rem] bg-[rgba(246,247,249,0.64)] px-2">
            <span className="font-ui text-[0.86rem] font-[720] text-[rgba(31,41,55,0.34)]">?</span>
            <span className="min-w-0 flex-1">
              <span className="block h-1.5 w-[58%] rounded-full bg-[rgba(31,41,55,0.1)]" />
              <span className="mt-1.5 block h-1 w-[38%] rounded-full bg-[rgba(31,41,55,0.06)]" />
            </span>
            <span className="h-4 w-[18%] rounded-[0.22rem] bg-[rgba(31,41,55,0.12)]" />
            <AlertBadge />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 grid h-4 grid-cols-3 border-t border-[rgba(31,41,55,0.045)] bg-white/38 px-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex items-center justify-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[rgba(31,41,55,0.12)]" />
              <span className="h-1 w-5 rounded-full bg-[rgba(31,41,55,0.1)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AlertBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const boxClass = size === "sm" ? "h-4 w-4 rounded-[0.32rem]" : "h-5 w-5 rounded-[0.42rem]";
  const iconSize = size === "sm" ? 10 : 12;

  return (
    <span className={`flex shrink-0 items-center justify-center bg-[rgb(255,83,94)] text-white shadow-[0_10px_18px_-10px_rgba(244,63,78,0.62)] ${boxClass}`}>
      <AlertTriangle size={iconSize} strokeWidth={2} />
    </span>
  );
}

function ConversionIllustration() {
  return (
    <div aria-hidden className="relative h-[9.2rem] w-full max-w-[14.6rem] sm:h-[9.8rem] sm:max-w-[15.4rem]">
      <div className="absolute inset-x-[4%] top-[20%] h-[60%] rounded-[1.7rem] bg-[rgba(142,134,205,0.1)] blur-lg" />

      <div className="absolute left-[1%] top-[5%] h-[61%] w-[60%] overflow-hidden rounded-[0.86rem] border border-[rgba(31,41,55,0.075)] bg-white/76 shadow-[0_18px_42px_-32px_rgba(31,41,55,0.28),inset_0_1px_0_rgba(255,255,255,0.9)]">
        <div className="flex h-3 items-center gap-1 border-b border-[rgba(31,41,55,0.045)] bg-[rgba(246,247,249,0.64)] px-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[rgba(132,123,205,0.45)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[rgba(132,123,205,0.32)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[rgba(132,123,205,0.22)]" />
          <span className="ml-2 h-1.5 w-[42%] rounded-full bg-[rgba(31,41,55,0.06)]" />
        </div>

        <div className="px-2.5 py-2 text-left">
          <div className="relative h-8 overflow-hidden rounded-[0.52rem] bg-[linear-gradient(135deg,rgba(230,229,243,0.9),rgba(244,245,249,0.84))]">
            <span className="absolute left-[9%] top-[42%] h-[44%] w-[42%] rounded-t-[0.35rem] bg-[rgba(205,209,220,0.52)]" />
            <span className="absolute right-[8%] top-[28%] h-[58%] w-[50%] rounded-t-[0.42rem] bg-[rgba(216,219,229,0.66)]" />
            <span className="absolute left-[22%] top-[19%] h-3 w-3 rounded-full bg-[rgba(191,196,211,0.62)]" />
          </div>

          <span className="mt-2 block h-1.5 w-[38%] rounded-full bg-[rgba(31,41,55,0.13)]" />
          <span className="mt-1.5 block h-1.5 w-[72%] rounded-full bg-[rgba(31,41,55,0.075)]" />
          <span className="mt-1.5 block h-1.5 w-[50%] rounded-full bg-[rgba(31,41,55,0.055)]" />

          <div className="relative mt-2 ml-auto flex h-[1.125rem] w-[52%] items-center justify-center rounded-[0.36rem] bg-[rgba(132,123,205,0.3)] font-ui text-[0.45rem] font-[620] tracking-[-0.02em] text-white shadow-[0_12px_20px_-14px_rgba(132,123,205,0.55)]">
            Jetzt anfragen
          </div>
        </div>
      </div>

      <div className="absolute left-[2%] top-[45%] h-3 w-3 rounded-full border-2 border-[rgba(132,123,205,0.34)] bg-white/7" />
      <svg
        className="absolute left-[1%] top-[40%] h-[2.55rem] w-[60%] overflow-visible text-[rgba(132,123,205,0.38)]"
        viewBox="0 0 150 60"
        fill="none"
        aria-hidden
      >
        <path d="M5 42 C32 4 45 64 74 37 C102 14 111 55 145 18" stroke="currentColor" strokeWidth="2" strokeDasharray="7 7" strokeLinecap="round" />
        <circle cx="47" cy="46" r="5" fill="white" stroke="currentColor" strokeWidth="2" />
        <circle cx="145" cy="18" r="5" fill="white" stroke="currentColor" strokeWidth="2" />
      </svg>
      <MousePointer2 className="absolute left-[52%] top-[52%] rotate-[-18deg] fill-[rgba(18,24,34,0.92)] text-white drop-shadow-md" size={18} strokeWidth={1.45} />
      <span className="absolute left-[60%] top-[65%] font-ui text-[0.9rem] font-[720] text-[rgba(18,24,34,0.68)]">?</span>

      <div className="absolute bottom-[5%] left-[7%] flex h-[2.1rem] w-[50%] items-center gap-1.5 rounded-[0.58rem] border border-[rgba(190,135,48,0.12)] bg-white/74 px-2 shadow-[0_14px_30px_-28px_rgba(31,41,55,0.22)]">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[0.42rem] border border-[rgba(190,135,48,0.18)] text-[rgba(190,135,48,0.78)]">
          <AlertTriangle size={13} strokeWidth={1.6} />
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block font-ui text-[0.48rem] font-[680] tracking-[-0.02em] text-[rgba(31,41,55,0.74)]">
            Unklare Botschaft
          </span>
          <span className="mt-1 block h-1 w-[82%] rounded-full bg-[rgba(31,41,55,0.08)]" />
        </span>
      </div>

      <ConversionMetricCard className="right-[1%] top-[4%]" title="Conversions" value="+ 0,8 %" />
      <ConversionMetricCard className="right-[1%] top-[37%]" title="Wenig sichtbar" value="CTA zu schwach" warning />
      <ConversionMetricCard className="right-[1%] top-[70%]" title="Hohe Absprungrate" value="68 % verlassen" danger />
    </div>
  );
}

function ConversionMetricCard({
  className,
  title,
  value,
  warning = false,
  danger = false,
}: {
  className: string;
  title: string;
  value: string;
  warning?: boolean;
  danger?: boolean;
}) {
  return (
    <div className={`absolute z-10 h-[26%] w-[35%] rounded-[0.58rem] border border-[rgba(31,41,55,0.06)] bg-white/82 px-1.5 py-1.5 text-left shadow-[0_12px_26px_-24px_rgba(31,41,55,0.24),inset_0_1px_0_rgba(255,255,255,0.9)] ${className}`}>
      <div className="font-ui text-[0.42rem] font-[680] leading-tight tracking-[-0.02em] text-[rgba(18,24,34,0.84)]">
        {title}
      </div>
      {warning ? (
        <div className="mt-1 flex items-center gap-1">
          <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[0.3rem] bg-[rgba(132,123,205,0.1)] text-[rgba(82,94,166,0.72)]">
            <svg viewBox="0 0 18 18" width="10" height="10" fill="none" aria-hidden>
              <path d="M1.8 9s2.5-4.2 7.2-4.2S16.2 9 16.2 9 13.7 13.2 9 13.2 1.8 9 1.8 9Z" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="9" cy="9" r="2.2" fill="currentColor" opacity="0.42" />
            </svg>
          </span>
          <span className="font-ui text-[0.4rem] font-[560] leading-tight text-[rgba(18,24,34,0.68)]">{value}</span>
        </div>
      ) : danger ? (
        <>
          <div className="mt-1 flex items-center gap-1">
            <UserRound size={11} strokeWidth={1.45} className="shrink-0 text-[rgba(82,94,166,0.72)]" />
            <span className="font-ui text-[0.4rem] font-[560] leading-tight text-[rgba(18,24,34,0.68)]">{value}</span>
          </div>
          <span className="mt-1 block h-1 w-[72%] rounded-full bg-[rgba(255,83,94,0.68)]" />
        </>
      ) : (
        <div className="mt-1">
          <svg viewBox="0 0 60 24" className="h-4 w-full text-[rgba(132,123,205,0.58)]" fill="none" aria-hidden>
            <path d="M2 18 L10 15 L18 11 L27 7 L36 12 L45 5 L57 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-right font-ui text-[0.42rem] font-[680] text-[rgba(132,123,205,0.76)]">{value}</div>
        </div>
      )}
    </div>
  );
}

function ChipIcon({
  variant,
  index,
}: {
  variant: ProblemSlide["variant"];
  index: number;
}) {
  const className = "text-[rgba(18,24,34,0.9)]";

  if (variant === "search") {
    return index === 0 ? (
      <Search size={19} strokeWidth={1.4} className={className} />
    ) : index === 1 ? (
      <BarChart3 size={19} strokeWidth={1.35} className={className} />
    ) : (
      <ChevronUp size={19} strokeWidth={1.45} className={className} />
    );
  }

  if (variant === "trust") {
    return index === 0 ? (
      <Shield size={19} strokeWidth={1.35} className={className} />
    ) : index === 1 ? (
      <UserRound size={19} strokeWidth={1.35} className={className} />
    ) : (
      <Search size={19} strokeWidth={1.35} className={className} />
    );
  }

  return index === 0 ? (
    <Gauge size={19} strokeWidth={1.35} className={className} />
  ) : index === 1 ? (
    <Smartphone size={19} strokeWidth={1.35} className={className} />
  ) : (
    <MessageSquare size={19} strokeWidth={1.35} className={className} />
  );
}

function ProblemClosing() {
  return (
    <div
      data-problem-closing
      className="relative z-10 mx-auto mt-20 max-w-[58rem] text-center will-change-[opacity,transform,filter] sm:mt-24 lg:mt-24 lg:pb-20"
    >
      <p className="mx-auto inline-flex items-center gap-3 rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.22)] bg-[rgb(var(--magicks-accent-rgb)/0.07)] px-3 py-2 font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.78)] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] sm:text-[11px] sm:tracking-[0.22em]">
        Um es kurz zu fassen
      </p>
      <p className="font-ui mx-auto mt-5 max-w-[16ch] text-[2.5rem] font-[720] leading-[0.98] tracking-[-0.052em] text-[rgb(var(--magicks-ink-rgb)/0.98)] sm:text-[4.2rem] lg:text-[5.6rem]">
        <span className="block whitespace-nowrap">Keine Überzeugung</span>
        <span className="block">=</span>
        <span className="block">
          <span className="relative inline-block pb-4">
            Kein Umsatz
            <svg
              aria-hidden
              viewBox="0 0 620 72"
              preserveAspectRatio="none"
              className="pointer-events-none absolute -bottom-2 left-[-5%] h-[0.38em] w-[110%] rotate-[-1.4deg] overflow-visible"
            >
              <defs>
                <linearGradient id="problem-brush-red" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="rgba(132,18,20,0)" />
                  <stop offset="10%" stopColor="rgba(164,19,25,0.72)" />
                  <stop offset="38%" stopColor="rgba(221,32,40,0.95)" />
                  <stop offset="66%" stopColor="rgba(191,20,28,0.88)" />
                  <stop offset="90%" stopColor="rgba(148,18,22,0.5)" />
                  <stop offset="100%" stopColor="rgba(132,18,20,0)" />
                </linearGradient>
                <filter id="problem-brush-rough">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.045 0.34"
                    numOctaves="3"
                    seed="11"
                  />
                  <feDisplacementMap in="SourceGraphic" scale="5" />
                </filter>
              </defs>
              <path
                d="M18 42 C88 34 135 48 205 39 C285 28 348 47 420 37 C492 27 548 35 604 29"
                fill="none"
                stroke="url(#problem-brush-red)"
                strokeWidth="20"
                strokeLinecap="round"
                filter="url(#problem-brush-rough)"
                opacity="0.96"
              />
              <path
                d="M38 48 C128 42 204 52 283 43 C372 34 462 46 575 35"
                fill="none"
                stroke="rgba(255,109,116,0.32)"
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#problem-brush-rough)"
              />
              <path
                d="M70 33 C178 44 286 28 396 36 C470 42 536 25 590 31"
                fill="none"
                stroke="rgba(102,14,17,0.22)"
                strokeWidth="7"
                strokeLinecap="round"
                filter="url(#problem-brush-rough)"
              />
            </svg>
          </span>
        </span>
      </p>
    </div>
  );
}
