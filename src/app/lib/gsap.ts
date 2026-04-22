import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point for GSAP + ScrollTrigger.
 * Import `registerGsap()` from every consumer; it is a no-op after the first call
 * and guarantees the plugin is registered exactly once across the app.
 */
let registered = false;

export function registerGsap(): { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger } {
  if (typeof window === "undefined") {
    return { gsap, ScrollTrigger };
  }
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export { gsap, ScrollTrigger };

/** Signature ease — paired with the existing `magicks-ease-out` CSS curve. */
export const MAGICKS_EASE = "power3.out";
export const MAGICKS_EASE_SMOOTH = "power2.out";
