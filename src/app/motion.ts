/**
 * Unified motion language — single ease, tiered durations.
 * Use with Framer Motion `transition` prop or CSS `magicks-*` utility classes.
 */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Primary section reveals (headings, blocks) */
export const transition = {
  duration: 0.88,
  ease: easeOut,
};

/** Secondary reveals (supporting copy, forms) */
export const transitionFast = {
  duration: 0.58,
  ease: easeOut,
};

/** Micro UI (buttons, small motion.hoc) */
export const transitionMicro = {
  duration: 0.42,
  ease: easeOut,
};

export const stagger = 0.065;

/** Align CSS transitions with the same curve (ms) */
export const DURATION_MS = {
  hover: 550,
  surface: 700,
  media: 780,
  link: 550,
} as const;
