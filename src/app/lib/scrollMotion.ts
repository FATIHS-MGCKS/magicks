import { gsap, ScrollTrigger } from "./gsap";

/**
 * Unified bidirectional motion language for the MAGICKS homepage.
 *
 * Every section is choreographed around the same three-zone envelope:
 *
 *   ┌── entry ──┬── focus ──┬── exit ──┐
 *   │ gain      │ strongest │ release  │
 *   │ presence  │ clarity   │ presence │
 *   └───────────┴───────────┴──────────┘
 *
 * All envelopes are scrub-driven via ScrollTrigger. Because the timeline
 * progress is a pure function of scroll position, motion works identically
 * in both directions — nothing "latches" after a single trigger.
 *
 * Helpers avoid springy easing. They never use `back.out`, `elastic`, or
 * overshoot — those feel app-like. Cinematic pacing comes from
 * `power2.inOut` curves across a wide scroll distance, not from bounces.
 *
 * Mobile adaptation:
 *   Narrow viewports (<= 640px) scale down blur radius and yFrom/yTo
 *   displacement. CSS `filter: blur()` is GPU-expensive on iOS Safari
 *   and large Y displacement amplifies the perceived "jank" when the
 *   user flicks quickly. The desktop experience is unchanged.
 */

type MaybeEl = Element | string | null;

/** Narrow-viewport detection. Cached lazily; SSR-safe. */
function isNarrowViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 640px)").matches;
}

/** Mobile-adaptive blur: halve radius on narrow viewports (min 1.5px). */
function adaptBlur(blur: number): number {
  return isNarrowViewport() ? Math.max(1.5, blur * 0.5) : blur;
}

/** Mobile-adaptive displacement: soften to 65% on narrow viewports. */
function adaptY(y: number): number {
  return isNarrowViewport() ? Math.round(y * 0.65) : y;
}

export type PresenceEnvelopeOptions = {
  /** Trigger element (defaults to the target itself). */
  trigger?: Element | string;
  /** Scrub smoothing (true | number). Prefer 0.6–1.2 for cinematic feel. */
  scrub?: boolean | number;
  /** ScrollTrigger start — default "top 88%". */
  start?: string;
  /** ScrollTrigger end   — default "bottom 12%". */
  end?: string;
  /** Displacement on entry (px). */
  yFrom?: number;
  /** Displacement on exit  (px). */
  yTo?: number;
  /** Blur at entry & exit (px). Focus is always 0. */
  blur?: number;
  /** Opacity floor at entry / exit. Focus is always 1. */
  opacityFloor?: number;
  /** Width of the hold zone as a 0–1 fraction of total timeline. */
  holdRatio?: number;
  /** Apply to each item with a stagger offset (in timeline seconds). */
  stagger?: number;
  /**
   * Length of the exit phase relative to the entry phase. `1` is fully
   * symmetric (default — preserves prior behaviour). `>1` makes the
   * exit slower than the entry (e.g. `2` = exit covers twice as much
   * scroll distance as the entry), so the element lingers as the next
   * section takes over instead of vanishing on a single wheel notch.
   */
  exitWeight?: number;
};

/**
 * Bidirectional presence envelope.
 *
 * Builds a scrubbed timeline where the element:
 *   · starts at opacityFloor, blurred, displaced by yFrom
 *   · ramps to 1 / no blur / 0 during the entry phase
 *   · holds at full focus across `holdRatio`
 *   · releases during the exit phase (length = entry × exitWeight)
 *
 * Everything is reversible because progress is driven by scroll.
 */
export function presenceEnvelope(
  target: MaybeEl | Element[],
  {
    trigger,
    scrub = 0.8,
    start = "top 88%",
    end = "bottom 12%",
    yFrom = 28,
    yTo = -22,
    blur = 6,
    opacityFloor = 0,
    holdRatio = 0.42,
    stagger = 0,
    exitWeight = 1,
  }: PresenceEnvelopeOptions = {},
) {
  const targets = Array.isArray(target) ? target : [target];
  if (!targets.length) return;

  // Split the non-hold timeline between entry and exit using exitWeight.
  // entryFraction + exitFraction = 1 - holdRatio
  // exitFraction = entryFraction * exitWeight
  const nonHold = Math.max(0, 1 - holdRatio);
  const entryFraction = nonHold / (1 + exitWeight);
  const entryEnd = entryFraction;
  const exitStart = entryEnd + holdRatio;
  const blurPx = adaptBlur(blur);
  const yFromPx = adaptY(yFrom);
  const yToPx = adaptY(yTo);

  targets.forEach((el, i) => {
    if (!el) return;
    const offset = stagger * i;
    // When no explicit trigger is given AND we have an array, each
    // element scrubs on itself — otherwise they all share the same
    // trigger. This makes the helper usable both for "entire section
    // envelopes" and for "per-row envelopes" without two APIs.
    const triggerEl = trigger ?? (el as Element);

    gsap.set(el, { opacity: opacityFloor, y: yFromPx, filter: `blur(${blurPx}px)` });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        start,
        end,
        scrub,
        invalidateOnRefresh: true,
      },
      defaults: { ease: "none" },
    });

    tl.fromTo(
      el,
      { opacity: opacityFloor, y: yFromPx, filter: `blur(${blurPx}px)` },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: entryEnd + offset,
        ease: "power2.out",
      },
      0,
    );
    tl.to(
      el,
      { opacity: 1, y: 0, filter: "blur(0px)", duration: holdRatio, ease: "none" },
      entryEnd + offset,
    );
    tl.to(
      el,
      {
        opacity: opacityFloor,
        y: yToPx,
        filter: `blur(${blurPx}px)`,
        duration: 1 - exitStart - offset,
        ease: "power2.in",
      },
      exitStart + offset,
    );
  });
}

/**
 * Focus envelope — like `presenceEnvelope` but without Y displacement.
 * For body text blocks that should gain clarity (opacity+blur) on entry
 * and gently soften on exit, without any vertical jitter.
 */
export type FocusEnvelopeOptions = Omit<PresenceEnvelopeOptions, "yFrom" | "yTo"> & {
  /** Shallow floor so the text stays present but hazy before focus. */
  opacityFloor?: number;
  /** Opacity during the held focus zone. */
  focusOpacity?: number;
};

export function focusEnvelope(
  target: MaybeEl | Element[],
  {
    trigger,
    scrub = 0.8,
    start = "top 82%",
    end = "bottom 18%",
    blur = 5,
    opacityFloor = 0.26,
    focusOpacity = 1,
    holdRatio = 0.36,
    stagger = 0,
  }: FocusEnvelopeOptions = {},
) {
  const targets = Array.isArray(target) ? target : [target];
  if (!targets.length) return;

  const halfHold = holdRatio / 2;
  const entryEnd = 0.5 - halfHold;
  const exitStart = 0.5 + halfHold;
  const blurPx = adaptBlur(blur);

  targets.forEach((el, i) => {
    if (!el) return;
    const offset = stagger * i;
    const triggerEl = trigger ?? (el as Element);

    gsap.set(el, { opacity: opacityFloor, filter: `blur(${blurPx}px)` });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        start,
        end,
        scrub,
        invalidateOnRefresh: true,
      },
      defaults: { ease: "none" },
    });

    tl.fromTo(
      el,
      { opacity: opacityFloor, filter: `blur(${blurPx}px)` },
      { opacity: focusOpacity, filter: "blur(0px)", duration: entryEnd + offset, ease: "power2.out" },
      0,
    );
    tl.to(
      el,
      { opacity: focusOpacity, filter: "blur(0px)", duration: holdRatio, ease: "none" },
      entryEnd + offset,
    );
    tl.to(
      el,
      {
        opacity: opacityFloor * 1.35,
        filter: `blur(${blurPx * 0.8}px)`,
        duration: 1 - exitStart - offset,
        ease: "power2.in",
      },
      exitStart + offset,
    );
  });
}

/**
 * Parallax drift — scroll-linked Y translation with no blur/opacity change.
 * Used for decorative layers (vignettes, halos, oversized glyphs) that
 * should breathe slowly in the background without ever claiming focus.
 */
export function parallaxDrift(
  target: MaybeEl,
  {
    trigger,
    from = 0,
    to = -30,
    start = "top bottom",
    end = "bottom top",
    scrub = true,
  }: {
    trigger?: Element | string;
    from?: number;
    to?: number;
    start?: string;
    end?: string;
    scrub?: boolean | number;
  } = {},
) {
  if (!target) return;
  gsap.fromTo(
    target,
    { yPercent: from },
    {
      yPercent: to,
      ease: "none",
      scrollTrigger: {
        trigger: trigger ?? (target as Element),
        start,
        end,
        scrub,
        invalidateOnRefresh: true,
      },
    },
  );
}

/**
 * Atmospheric field — scroll-linked intensity shift (opacity, optional scale)
 * for ambient light / overlay layers. Builds presence into the focus zone
 * and releases on the way out, so background depth is never static.
 */
export function atmosphericField(
  target: MaybeEl,
  {
    trigger,
    baseOpacity = 0.2,
    peakOpacity = 1,
    scale = [1.02, 1],
    start = "top bottom",
    end = "bottom top",
    scrub = 1.1,
  }: {
    trigger?: Element | string;
    baseOpacity?: number;
    peakOpacity?: number;
    scale?: [number, number];
    start?: string;
    end?: string;
    scrub?: boolean | number;
  } = {},
) {
  if (!target) return;
  const triggerEl = trigger ?? (target as Element);

  gsap.set(target, { opacity: baseOpacity, scale: scale[0], transformOrigin: "center center" });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerEl,
      start,
      end,
      scrub,
      invalidateOnRefresh: true,
    },
    defaults: { ease: "none" },
  });

  tl.to(target, { opacity: peakOpacity, scale: scale[1], duration: 0.5, ease: "power2.out" }, 0);
  tl.to(target, { opacity: baseOpacity * 1.4, scale: scale[0], duration: 0.5, ease: "power2.in" }, 0.5);
}

/**
 * Rack-focus track — sequential focus pull across an array of children.
 * Reads like a camera lens moving down a list of statements: the current
 * line is crisp, the one above has already softened, the one below is
 * still arriving. Fully bidirectional.
 */
export function rackFocusTrack(
  items: Element[],
  {
    trigger,
    start = "top 70%",
    end = "bottom 35%",
    scrub = 0.9,
    blur = 5.5,
    softOpacity = 0.34,
    reachOpacity = 1,
    /** How much of each item's slot is held at full sharpness. 0.45 ≈ long reading time. */
    holdRatio = 0.45,
    /** Callback fired with the currently-focused index (0…n-1). Lets callers drive a
     *  synchronized visual (e.g. a light band) from the same scrub source. */
    onProgress,
  }: {
    trigger: Element | string;
    start?: string;
    end?: string;
    scrub?: boolean | number;
    blur?: number;
    softOpacity?: number;
    reachOpacity?: number;
    holdRatio?: number;
    /** Accepted for API parity with `focusEnvelope`. Currently mapped to `softOpacity`. */
    opacityFloor?: number;
    /** Accepted for API parity with `focusEnvelope`. Currently ignored. */
    stagger?: number;
    onProgress?: (index: number, progress: number) => void;
  },
) {
  if (!items.length) return;

  const blurPx = adaptBlur(blur);

  items.forEach((el) => {
    gsap.set(el, { opacity: softOpacity, filter: `blur(${blurPx}px)` });
  });

  const slot = 1 / items.length;
  // holdRatio = half-width of the "sharp" window inside each slot.
  const focusHalf = (slot * holdRatio) / 2 + slot * 0.3;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub,
      invalidateOnRefresh: true,
      onUpdate: onProgress
        ? (self) => {
            const p = self.progress;
            const idx = Math.min(items.length - 1, Math.max(0, Math.floor(p * items.length)));
            onProgress(idx, p);
          }
        : undefined,
    },
    defaults: { ease: "none" },
  });

  items.forEach((el, i) => {
    const center = slot * (i + 0.5);
    const pullStart = Math.max(0, center - focusHalf);
    const pullEnd = Math.min(1, center + focusHalf);

    tl.to(
      el,
      {
        opacity: reachOpacity,
        filter: "blur(0px)",
        duration: center - pullStart,
        ease: "power2.out",
      },
      pullStart,
    );

    // Explicit hold — keeps the sharpness steady across the reading window
    // instead of immediately releasing. The line reads for longer before
    // handing off to the next.
    const holdEnd = Math.min(1, center + (focusHalf * holdRatio) / 2);
    tl.to(
      el,
      { opacity: reachOpacity, filter: "blur(0px)", duration: holdEnd - center, ease: "none" },
      center,
    );

    if (i < items.length - 1) {
      tl.to(
        el,
        {
          opacity: softOpacity * 1.1,
          filter: `blur(${blurPx * 0.72}px)`,
          duration: pullEnd - holdEnd,
          ease: "power2.in",
        },
        holdEnd,
      );
    }
  });
}

/**
 * Breathing scale — for ornamental elements (drop-caps, oversized glyphs)
 * that should feel drawn in the moment rather than anchored. Adds a tiny
 * scroll-coupled scale pulse across the full section.
 *
 * The curve goes: small → full → slightly-over → full → small, creating
 * an organic "intake / exhale" feel as the user scrolls through.
 */
export function breathingScale(
  target: MaybeEl,
  {
    trigger,
    from = 0.985,
    peak = 1.012,
    to = 0.995,
    start = "top bottom",
    end = "bottom top",
    scrub = 1.2,
  }: {
    trigger?: Element | string;
    from?: number;
    peak?: number;
    to?: number;
    start?: string;
    end?: string;
    scrub?: boolean | number;
  } = {},
) {
  if (!target) return;
  const triggerEl = trigger ?? (target as Element);

  gsap.set(target, { scale: from, transformOrigin: "center center" });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerEl,
      start,
      end,
      scrub,
      invalidateOnRefresh: true,
    },
    defaults: { ease: "none" },
  });

  tl.to(target, { scale: peak, duration: 0.45, ease: "power1.inOut" }, 0);
  tl.to(target, { scale: to, duration: 0.55, ease: "power1.inOut" }, 0.45);
}

/**
 * Section farewell — a bottom-edge gradient overlay that intensifies as the
 * section exits, then recedes on return. Creates the "ink shadow" between
 * printed spreads so sections feel separated by material, not by cuts.
 *
 * The caller is expected to place a positioned div with this handle at
 * the bottom of the section. The opacity scrubs with scroll position.
 */
export function sectionFarewell(
  target: MaybeEl,
  {
    trigger,
    peak = 1,
    start = "bottom 75%",
    end = "bottom 5%",
    scrub = 1.0,
  }: {
    trigger?: Element | string;
    peak?: number;
    start?: string;
    end?: string;
    scrub?: boolean | number;
  } = {},
) {
  if (!target) return;
  const triggerEl = trigger ?? (target as Element);

  gsap.set(target, { opacity: 0 });
  gsap.fromTo(
    target,
    { opacity: 0 },
    {
      opacity: peak,
      ease: "none",
      scrollTrigger: {
        trigger: triggerEl,
        start,
        end,
        scrub,
        invalidateOnRefresh: true,
      },
    },
  );
}

/**
 * Horizontal drift — scroll-linked X translation. Pair with `parallaxDrift`
 * for atmospheric layers that need to feel like they sit in deep space
 * (not just parallax vertically). Keep amplitudes under ±8% to stay subtle.
 */
export function horizontalDrift(
  target: MaybeEl,
  {
    trigger,
    from = 0,
    to = -4,
    start = "top bottom",
    end = "bottom top",
    scrub = true,
  }: {
    trigger?: Element | string;
    from?: number;
    to?: number;
    start?: string;
    end?: string;
    scrub?: boolean | number;
  } = {},
) {
  if (!target) return;
  gsap.fromTo(
    target,
    { xPercent: from },
    {
      xPercent: to,
      ease: "none",
      scrollTrigger: {
        trigger: trigger ?? (target as Element),
        start,
        end,
        scrub,
        invalidateOnRefresh: true,
      },
    },
  );
}

/**
 * Refreshes ScrollTrigger after fonts/images load — helpful on dense pages
 * where late layout shifts would otherwise skew scrub positions.
 */
export function refreshScrollTriggerOnLoad() {
  if (typeof window === "undefined") return;
  const run = () => ScrollTrigger.refresh();
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
}
