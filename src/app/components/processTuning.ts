/**
 * Tuning for `Process` sticky scroll section — adjust feel without rewriting logic.
 *
 * sectionScrollVh: outer section height in vh (scroll range driver)
 * scrub: GSAP ScrollTrigger scrub smoothing (seconds or boolean)
 * pathGlowOpacity: base stroke opacity for the dim track
 * impulseOpacity: bright segment opacity
 * impulseLengthPx: length of the light impulse along the path
 * activeEmphasis: multiplier for active card border (via Tailwind opacity classes)
 */
export const PROCESS_TUNING = {
  /** Taller scroll range = more immersive guided narrative */
  sectionScrollVh: 280,
  scrub: 0.65 as number | boolean,
  pathGlowOpacity: 0.22,
  impulseOpacity: 0.55,
  impulseLengthPx: 22,
  /** Hauptlinie (px) — sichtbar, aber nicht schwer */
  pathStrokePx: 2.5,
  /** Zusätzliche Breite für die weiche „Ambient“-Spur unter der Linie */
  pathGlowExtraPx: 3,
} as const;
