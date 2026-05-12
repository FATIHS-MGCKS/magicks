import { MAGICKS_EASE } from "./gsap";
import { prefersCheapMotion } from "./scrollMotion";

type RouteRevealOptions = {
  gsap: ReturnType<typeof import("./gsap").registerGsap>["gsap"];
  root: HTMLElement;
  heroItems: HTMLElement[];
  revealItems: HTMLElement[];
  heroYOffset?: number;
  revealYOffset?: number;
  blur?: number;
  duration?: number;
  heroStagger?: number;
  heroStart?: string;
  revealStart?: string;
};

/**
 * Shared reveal choreography for hero copy + section blocks on service/SEO routes.
 * Blur is disabled on cheap-motion devices to reduce mobile GPU cost.
 */
export function runRouteReveal({
  gsap,
  root,
  heroItems,
  revealItems,
  heroYOffset = 22,
  revealYOffset = 22,
  blur = 5,
  duration = 0.9,
  heroStagger = 0.08,
  heroStart = "top 88%",
  revealStart = "top 86%",
}: RouteRevealOptions) {
  const blurPx = prefersCheapMotion() ? 0 : blur;
  const heroFrom = blurPx > 0 ? { opacity: 0, y: heroYOffset, filter: `blur(${blurPx}px)` } : { opacity: 0, y: heroYOffset };
  const sectionFrom =
    blurPx > 0 ? { opacity: 0, y: revealYOffset, filter: `blur(${blurPx}px)` } : { opacity: 0, y: revealYOffset };
  const toVars = blurPx > 0 ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 1, y: 0 };

  if (heroItems.length > 0) {
    gsap.fromTo(heroItems, heroFrom, {
      ...toVars,
      duration,
      stagger: heroStagger,
      ease: MAGICKS_EASE,
      scrollTrigger: {
        trigger: root,
        start: heroStart,
        once: true,
      },
    });
  }

  revealItems.forEach((section) => {
    gsap.fromTo(section, sectionFrom, {
      ...toVars,
      duration,
      ease: MAGICKS_EASE,
      scrollTrigger: {
        trigger: section,
        start: revealStart,
        once: true,
      },
    });
  });
}
