import { useLayoutEffect, useRef, useState } from "react";
import {
  BarChart3,
  Check,
  ChevronUp,
  CircleUserRound,
  Gauge,
  Mail,
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

const PHONE_FRAME_SRC = "/media/home/ihpone-display.png";

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

    const { gsap, ScrollTrigger } = registerGsap();

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
        03 · Das Problem
      </span>

      <h2
        id="problem-heading"
        data-problem-copy
        className="font-ui mx-auto mt-6 max-w-[18ch] text-[2.05rem] font-[680] leading-[0.98] tracking-[-0.044em] text-[rgb(var(--magicks-ink-rgb)/0.98)] will-change-[opacity,transform,filter] sm:text-[2.6rem] md:text-[3.35rem] lg:mx-0 lg:max-w-[11ch] lg:text-[4.45rem]"
      >
        <span className="block lg:hidden">Verlieren Sie keine</span>
        <span className="block lg:hidden">wertvollen Chancen</span>
        <span className="hidden lg:inline">Verlieren Sie keine wertvollen Chancen</span>
      </h2>

      <p
        data-problem-copy
        className="font-ui mx-auto mt-7 max-w-[36rem] text-center text-[1.08rem] font-[540] leading-[1.52] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.82)] will-change-[opacity,transform,filter] sm:text-[1.2rem] md:text-[1.32rem] lg:mx-0 lg:text-left lg:text-[1.24rem]"
      >
        Ihre Kunden suchen, vergleichen und entscheiden online — oft lange bevor
        sie anrufen, buchen oder anfragen.
      </p>

      <p
        data-problem-copy
        className="font-ui mx-auto mt-5 max-w-[38rem] rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] px-5 py-5 text-center text-[0.98rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] shadow-[0_28px_78px_-58px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.72)] will-change-[opacity,transform,filter] sm:px-6 sm:py-6 sm:text-[1.02rem] lg:mx-0 lg:text-left lg:text-[1.06rem]"
      >
        Die entscheidende Frage ist nicht nur, ob Sie gefunden werden. Sondern
        was Menschen sehen, wenn sie Sie finden: eine überzeugende Webpräsenz,
        die Vertrauen aufbaut — oder einen Auftritt, der Zweifel hinterlässt.
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
    <article className="flex h-full flex-col px-[7.2%] pb-[7%] pt-[14%] text-center">
      <div className="mx-auto inline-flex rounded-full border border-[rgba(20,28,44,0.08)] bg-white/72 px-3 py-1.5 font-ui text-[0.72rem] font-[520] tracking-[-0.01em] text-[rgba(20,28,44,0.48)] shadow-[0_10px_26px_-22px_rgba(20,28,44,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] sm:text-[0.8rem]">
        {slide.kicker}
      </div>

      <h3 className="mx-auto mt-4 max-w-[9.5em] whitespace-pre-line font-ui text-[1.72rem] font-[720] leading-[1.04] tracking-[-0.044em] text-[rgba(13,17,23,0.96)] sm:text-[2.02rem]">
        {slide.title}
      </h3>

      <p className="mx-auto mt-4 max-w-[25.5em] font-ui text-[0.83rem] font-[460] leading-[1.5] tracking-[-0.012em] text-[rgba(18,24,34,0.75)] sm:text-[0.95rem]">
        {slide.body}
      </p>

      <div className="relative mt-auto flex min-h-[42%] items-center justify-center py-3">
        <ProblemScreenIllustration variant={slide.variant} />
      </div>

      <div className="rounded-[1.25rem] border border-[rgba(20,28,44,0.07)] bg-white/82 p-2 shadow-[0_16px_36px_-30px_rgba(20,28,44,0.36),inset_0_1px_0_rgba(255,255,255,0.92)]">
        <div className="grid grid-cols-3 divide-x divide-[rgba(20,28,44,0.07)]">
          {slide.chips.map((chip, chipIndex) => (
            <div
              key={chip}
              className="flex min-h-[3.1rem] flex-col items-center justify-center gap-1.5 px-1 font-ui text-[0.72rem] font-[520] tracking-[-0.012em] text-[rgba(18,24,34,0.82)] sm:text-[0.8rem]"
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
    <div aria-hidden className="relative h-[13rem] w-full max-w-[19rem] sm:h-[15rem]">
      <div className="absolute inset-x-[8%] top-[6%] rounded-[2rem] bg-[radial-gradient(circle_at_50%_55%,rgba(219,230,242,0.82),transparent_64%)] blur-sm" />
      <div className="absolute left-[7%] right-[7%] top-[8%] rounded-[1.25rem] border border-[rgba(31,41,55,0.08)] bg-white/88 p-3 shadow-[0_18px_42px_-30px_rgba(31,41,55,0.36)]">
        <div className="flex items-center gap-2 rounded-full bg-[rgba(239,243,248,0.95)] px-3 py-2 text-left">
          <Search size={15} strokeWidth={1.7} className="text-[rgba(54,73,95,0.56)]" />
          <span className="h-2.5 w-[58%] rounded-full bg-[rgba(54,73,95,0.16)]" />
        </div>
      </div>
      <div className="absolute left-[14%] right-[14%] top-[34%] rounded-[1.05rem] border border-[rgba(36,56,78,0.08)] bg-white p-3 text-left shadow-[0_22px_44px_-32px_rgba(31,41,55,0.34)]">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[rgba(72,160,105,0.13)] px-2 py-1 text-[0.62rem] font-semibold text-[rgba(42,125,75,0.9)]">
            #1
          </span>
          <ChevronUp size={16} className="text-[rgba(72,160,105,0.82)]" />
        </div>
        <span className="mt-3 block h-2.5 w-[74%] rounded-full bg-[rgba(42,62,82,0.22)]" />
        <span className="mt-2 block h-2 w-[54%] rounded-full bg-[rgba(42,62,82,0.12)]" />
      </div>
      <div className="absolute bottom-[19%] left-[5%] w-[42%] rounded-[0.95rem] border border-[rgba(36,56,78,0.07)] bg-white/72 p-3 opacity-70 blur-[0.1px]">
        <span className="block h-2 w-[60%] rounded-full bg-[rgba(42,62,82,0.14)]" />
        <span className="mt-2 block h-2 w-[42%] rounded-full bg-[rgba(42,62,82,0.08)]" />
      </div>
      <div className="absolute bottom-[14%] right-[7%] w-[38%] rounded-[0.95rem] border border-[rgba(36,56,78,0.07)] bg-white/72 p-3 opacity-60">
        <span className="block h-2 w-[64%] rounded-full bg-[rgba(42,62,82,0.14)]" />
        <span className="mt-2 block h-2 w-[46%] rounded-full bg-[rgba(42,62,82,0.08)]" />
      </div>
    </div>
  );
}

function TrustIllustration() {
  return (
    <div aria-hidden className="relative h-[13rem] w-full max-w-[19rem] sm:h-[15rem]">
      <div className="absolute inset-x-[2%] top-[12%] h-[72%] rounded-full bg-[rgba(228,237,247,0.62)] blur-sm" />
      <div className="absolute left-[12%] right-[12%] top-[2%] rounded-[1.15rem] border border-[rgba(31,41,55,0.08)] bg-white/78 p-3 text-left shadow-[0_18px_46px_-34px_rgba(31,41,55,0.3)]">
        <div className="flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[rgba(20,28,44,0.12)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[rgba(20,28,44,0.1)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[rgba(20,28,44,0.08)]" />
        </div>
        <div className="mt-3 h-14 rounded-[0.7rem] bg-[linear-gradient(135deg,rgba(220,226,235,0.92),rgba(242,244,247,0.8))]" />
        <span className="mt-4 block h-2.5 w-[58%] rounded-full bg-[rgba(27,38,55,0.18)]" />
        <span className="mt-2 block h-2 w-[42%] rounded-full bg-[rgba(27,38,55,0.08)]" />
      </div>
      <div className="absolute right-[4%] top-[20%] flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(195,70,62,0.12)] bg-[rgba(231,110,93,0.13)] text-[rgba(164,55,47,0.9)] shadow-[0_18px_36px_-28px_rgba(195,70,62,0.44)]">
        <AlertTriangle size={22} strokeWidth={1.55} />
      </div>
      <div className="absolute bottom-[23%] left-[0%] w-[45%] rounded-[0.9rem] border border-[rgba(36,56,78,0.07)] bg-white/82 p-3 text-left shadow-[0_18px_40px_-32px_rgba(31,41,55,0.22)]">
        <div className="flex gap-1 text-[rgba(20,28,44,0.18)]">
          {"★★★★★".split("").map((star, index) => (
            <span key={`${star}-${index}`}>★</span>
          ))}
        </div>
        <span className="mt-3 block h-2 w-[76%] rounded-full bg-[rgba(42,62,82,0.1)]" />
      </div>
      <div className="absolute bottom-[25%] right-[1%] w-[52%] rounded-[0.95rem] border border-[rgba(36,56,78,0.07)] bg-white/78 p-3 text-left shadow-[0_18px_40px_-32px_rgba(31,41,55,0.2)]">
        <div className="flex items-center gap-2">
          <CircleUserRound size={24} strokeWidth={1.35} className="text-[rgba(31,41,55,0.18)]" />
          <span className="h-2 w-[48%] rounded-full bg-[rgba(42,62,82,0.14)]" />
        </div>
        <span className="mt-2 block h-2 w-[68%] rounded-full bg-[rgba(42,62,82,0.08)]" />
      </div>
      <div className="absolute bottom-[6%] left-1/2 flex -translate-x-1/2 items-center gap-7 text-[rgba(31,41,55,0.34)]">
        <span className="h-px w-10 border-t border-dashed border-[rgba(31,41,55,0.22)]" />
        <Shield size={30} strokeWidth={1.2} />
        <span className="h-px w-10 border-t border-dashed border-[rgba(31,41,55,0.22)]" />
      </div>
    </div>
  );
}

function ConversionIllustration() {
  return (
    <div aria-hidden className="relative h-[13rem] w-full max-w-[19rem] sm:h-[15rem]">
      <div className="absolute inset-x-[3%] top-[12%] h-[70%] rounded-full bg-[rgba(226,236,248,0.62)] blur-sm" />
      <div className="absolute left-[10%] right-[20%] top-[5%] rounded-[1.05rem] border border-[rgba(31,41,55,0.08)] bg-white/84 p-3 text-left shadow-[0_20px_48px_-34px_rgba(31,41,55,0.34)]">
        <div className="h-12 rounded-[0.72rem] bg-[linear-gradient(135deg,rgba(218,226,238,0.95),rgba(244,246,249,0.84))]" />
        <span className="mt-3 block h-2.5 w-[68%] rounded-full bg-[rgba(27,38,55,0.16)]" />
        <span className="mt-2 block h-2 w-[44%] rounded-full bg-[rgba(27,38,55,0.09)]" />
        <button
          type="button"
          tabIndex={-1}
          className="mt-3 rounded-[0.55rem] bg-[#286fd6] px-3 py-1.5 text-[0.7rem] font-semibold text-white shadow-[0_14px_30px_-18px_rgba(40,111,214,0.72)]"
        >
          Jetzt anfragen
        </button>
      </div>
      <MousePointer2 className="absolute left-[60%] top-[51%] rotate-[-18deg] fill-[rgba(18,24,34,0.92)] text-white drop-shadow-md" size={29} strokeWidth={1.5} />
      <div className="absolute right-[3%] top-[22%] w-[30%] rounded-[0.92rem] border border-[rgba(72,160,105,0.12)] bg-white/86 p-3 text-left shadow-[0_18px_38px_-30px_rgba(72,160,105,0.34)]">
        <div className="text-[0.6rem] font-semibold text-[rgba(31,41,55,0.78)]">
          Anfragen
        </div>
        <BarChart3 className="mt-2 text-[rgba(72,160,105,0.78)]" size={42} strokeWidth={1.4} />
        <div className="mt-1 text-[0.78rem] font-bold text-[rgba(72,160,105,0.9)]">
          +68%
        </div>
      </div>
      <div className="absolute bottom-[10%] left-[9%] right-[9%] flex items-center justify-between text-[rgba(54,73,95,0.56)]">
        <JourneyIcon icon={<UserRound size={16} />} />
        <span className="h-px flex-1 border-t border-dashed border-[rgba(54,73,95,0.26)]" />
        <JourneyIcon icon={<Smartphone size={15} />} />
        <span className="h-px flex-1 border-t border-dashed border-[rgba(54,73,95,0.26)]" />
        <JourneyIcon icon={<Mail size={15} />} />
        <span className="h-px flex-1 border-t border-dashed border-[rgba(54,73,95,0.26)]" />
        <JourneyIcon
          success
          icon={<Check size={16} />}
        />
      </div>
    </div>
  );
}

function JourneyIcon({
  icon,
  success = false,
}: {
  icon: React.ReactNode;
  success?: boolean;
}) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white/82 ${
        success
          ? "border-[rgba(72,160,105,0.15)] text-[rgba(72,160,105,0.9)]"
          : "border-[rgba(54,73,95,0.1)]"
      }`}
    >
      {icon}
    </span>
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
      <p className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.22em] text-[rgb(var(--magicks-accent-ink-rgb)/0.66)]">
        Um es kurz zu fassen
      </p>
      <p className="font-ui mx-auto mt-5 max-w-[12ch] text-[2.5rem] font-[720] leading-[0.98] tracking-[-0.052em] text-[rgb(var(--magicks-ink-rgb)/0.98)] sm:text-[4.2rem] lg:text-[5.6rem]">
        Keine Überzeugung = Kein Umsatz
      </p>
      <p className="font-ui mx-auto mt-6 max-w-[42rem] text-[1.04rem] font-[470] leading-[1.7] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.68)] sm:text-[1.18rem]">
        Eine starke Website erklärt nicht nur, was Sie anbieten. Sie macht
        klar, warum genau Sie die richtige Wahl sind.
      </p>
    </div>
  );
}
