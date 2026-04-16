/**
 * Tuning for `ThinkingAsciiField` — adjust feel without touching animation code.
 *
 * - speed: animation time multiplier (lower = calmer)
 * - densityPx: smaller = finer ASCII grid (more chars, heavier GPU/CPU)
 * - brightness: multiplies character opacity / perceived luminance
 * - fieldScale: scales the abstract gradient field (1 = default)
 * - mouseParallax: 0 = off, ~0.35–0.55 = subtle pointer response
 */
export const THINKING_ASCII_TUNING = {
  speed: 0.42,
  densityPx: 7.25,
  brightness: 0.92,
  fieldScale: 1,
  mouseParallax: 0.42,
} as const;
