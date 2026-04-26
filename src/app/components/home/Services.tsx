import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  breathingScale,
  focusEnvelope,
  parallaxDrift,
  presenceEnvelope,
  sectionFarewell,
} from "../../lib/scrollMotion";
import { quadToQuadMatrix3d, type V2 } from "../../lib/perspective";
import { HERO_VIDEO_SRC } from "../../heroMedia";
import { ChapterMarker } from "./ChapterMarker";

type Service = {
  index: number;
  slug: string;
  number: string;
  kicker: string;
  title: string;
  teaser: string;
  metric: string;
  href: string;
  /** Hero visual for the service — image-first, subtle motion applied in CSS. */
  image: string;
  imageAlt: string;
};

const SERVICES: Service[] = [
  {
    index: 0,
    slug: "websites",
    number: "01",
    kicker: "Marke",
    title: "Websites & Landing Pages",
    teaser:
      "Markenwebsites, Landing Pages und Relaunches als zusammenhängendes System — geführt, schnell, conversion-orientiert.",
    metric: "Von Auftritt bis Conversion",
    href: "/websites-landingpages",
    image: "/media/home/service-websites-alpha-hires.webp",
    imageAlt:
      "Editorial-Website auf einem Laptop, daneben ein Messinglineal und ein gefalteter Print-Proof auf dunklem Walnut-Desk.",
  },
  {
    index: 1,
    slug: "shops",
    number: "02",
    kicker: "Commerce",
    title: "Shops & Konfiguratoren",
    teaser:
      "Online-Shops und 2D/3D-Produktkonfiguratoren, die komplexe Produkte erklären und Anfragen sauber qualifizieren.",
    metric: "Shopware · Shopify · Custom",
    href: "/shops-produktkonfiguratoren",
    image: "/media/home/service-shops.webp",
    imageAlt:
      "Produktkonfigurator für eine moderne Terrassenüberdachung auf einem Laptop, darunter ein architektonischer Bauplan.",
  },
  {
    index: 2,
    slug: "software",
    number: "03",
    kicker: "System",
    title: "Web-Software & Dashboards",
    teaser:
      "Dashboards, Portale und individuelle Web-Software — Prozesse bündeln statt Tabs sammeln.",
    metric: "Intern · Multi-Tenant · API",
    href: "/web-software",
    image: "/media/home/service-software.webp",
    imageAlt:
      "Mehrpaneel-Plattform mit Projekttabelle, Statuschips und Timeline-Drawer auf einem Wide-Monitor vor einer Betonwand.",
  },
  {
    index: 3,
    slug: "automation",
    number: "04",
    kicker: "Automation & KI",
    title: "Automation & KI",
    teaser:
      "KI-Workflows, Automationen und Integrationen — wiederkehrende Arbeit aus dem Team holen, nachvollziehbar und wartbar.",
    metric: "n8n · Agents · LLM-Integration",
    href: "/ki-automationen-integrationen",
    image: "/media/home/service-automation.webp",
    imageAlt:
      "Drei verbundene UI-Fragmente — Anfrage, Verarbeitung, CRM-Eintrag — auf einer dunklen Gitterplatte, verbunden durch feine Flusslinien.",
  },
];

// ─── Laptop-screen perspective ───────────────────────────────────────────
//
// The laptop photo (2400 × 1500 px WebP, alpha preserved) has a TRUE
// alpha hole in the shape of the screen. The four corners of that hole
// — measured directly from the alpha channel — are the source of truth
// for projecting the iframe onto the screen with correct perspective.
//
// We render the iframe *behind* the photo at a fixed desktop resolution
// (1440 × 900) and apply a `matrix3d()` 4-point homography that maps the
// iframe's rectangle onto the screen quadrilateral. The alpha hole acts
// as the natural mask — no clip-path needed.
//
// The corners below were detected via the alpha channel and then
// expanded outward by 1 % L, 1 % top, 3 % R, 1 % bottom (relative to
// the screen-quad bbox) so the iframe edges sit a hair past the alpha
// edge — eliminates the hairline white sliver that would otherwise
// appear at the screen's right and top edges.

/** Screen-corner positions in the native 2400×1500 WebP, clockwise from TL. */
const SCREEN_CORNERS_NATIVE: readonly [V2, V2, V2, V2] = [
  [538, 290],
  [1390, 217],
  [1502, 862],
  [662, 1047],
];

const LAPTOP_PNG_W = 2400;
const LAPTOP_PNG_H = 1500;

/**
 * Horizontal `object-position` percentage on the laptop image. The
 * native image is 16:10 inside a 4:5 (taller) container — so half of
 * the width is cropped off at default `object-position: center`. We
 * shift slightly left of center so the screen's left edge isn't lost.
 */
const LAPTOP_OBJECT_POSITION_X = 35; // %

/** Native iframe resolution that gets perspective-mapped onto the screen. */
const HERO_IFRAME_W = 1440;
const HERO_IFRAME_H = 900;

/**
 * Native size of the standalone `<video>` element used on mobile (no
 * iframe). 16:10 to roughly match the screen quad — content inside is
 * `object-cover` so absolute dimensions don't matter for fidelity, only
 * that they're picked up by `quadToQuadMatrix3d` as the source rect.
 */
const HERO_VIDEO_W = 1280;
const HERO_VIDEO_H = 800;

/**
 * Computes the 4 screen-corner positions in CONTAINER pixel coordinates
 * for the given container size, accounting for `object-cover` cropping
 * and the configured `object-position`. Handles both axes — the desktop
 * 4:5 container crops horizontally (height-limited), the mobile 16:10
 * container matches the image ratio exactly (no crop). A future taller
 * container would crop vertically (width-limited).
 */
function projectCornersToContainer(
  containerW: number,
  containerH: number,
  objectPositionX: number = LAPTOP_OBJECT_POSITION_X,
  objectPositionY: number = 50,
): [V2, V2, V2, V2] {
  const containerRatio = containerW / containerH;
  const imageRatio = LAPTOP_PNG_W / LAPTOP_PNG_H;

  let scale: number;
  let cropLeft: number;
  let cropTop: number;

  if (imageRatio >= containerRatio) {
    // Image is at least as wide as the container — height fills, width
    // overflows (or matches exactly when ratios are equal).
    scale = containerH / LAPTOP_PNG_H;
    const overflow = LAPTOP_PNG_W * scale - containerW;
    cropLeft = (objectPositionX / 100) * overflow;
    cropTop = 0;
  } else {
    // Container is wider than the image — width fills, height overflows.
    scale = containerW / LAPTOP_PNG_W;
    cropLeft = 0;
    const overflow = LAPTOP_PNG_H * scale - containerH;
    cropTop = (objectPositionY / 100) * overflow;
  }

  const map = ([nx, ny]: V2): V2 => [nx * scale - cropLeft, ny * scale - cropTop];

  return [
    map(SCREEN_CORNERS_NATIVE[0]),
    map(SCREEN_CORNERS_NATIVE[1]),
    map(SCREEN_CORNERS_NATIVE[2]),
    map(SCREEN_CORNERS_NATIVE[3]),
  ];
}

/**
 * Renders the live hero inside the laptop screen with correct
 * perspective. The wrapper observes its own size and recomputes the
 * `matrix3d` transform whenever the container resizes.
 */
function LaptopScreenIframe() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  // (Re)apply the perspective matrix whenever the wrapper resizes OR
  // the iframe gets mounted (gated behind `ready`).
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const apply = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const rect = wrapper.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const corners = projectCornersToContainer(rect.width, rect.height);
      const matrix = quadToQuadMatrix3d(
        HERO_IFRAME_W,
        HERO_IFRAME_H,
        corners,
      );
      iframe.style.transform = matrix;
      iframe.style.transformOrigin = "0 0";
      // Reveal once the matrix has landed so the user never sees the
      // pre-transform 1440×900 rectangle in the wrong spot.
      iframe.style.opacity = "1";
    };

    apply();

    const ro = new ResizeObserver(apply);
    ro.observe(wrapper);

    // Same-origin iframe: drive autoplay from the parent, which retains
    // the user-activation transferred during navigation. Calls from
    // inside the iframe's own scripts (the hero's useEffect) are
    // silently rejected by Chrome's autoplay heuristic when there is
    // no explicit user gesture in the iframe document, even though the
    // iframe element has `allow="autoplay"`. Driving from the parent
    // — which DOES have activation — works reliably.
    const iframeEl = iframeRef.current;
    let retryTimer: ReturnType<typeof setInterval> | null = null;
    const tryPlay = () => {
      const doc = iframeEl?.contentDocument;
      const video = doc?.querySelector("video");
      if (!video) return false;
      video.muted = true;
      video.setAttribute("muted", "");
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          if (retryTimer) {
            clearInterval(retryTimer);
            retryTimer = null;
          }
          if (iframeEl) iframeEl.dataset.heroPlaying = "true";
        }).catch(() => {});
      }
      return !video.paused;
    };

    if (iframeEl) {
      iframeEl.addEventListener("load", tryPlay);
      // Best-effort retry: poll every 250 ms for up to 4 s. Catches
      // races where the iframe load event fired before the listener
      // attached, and gives Chrome a chance to grant autoplay once
      // the iframe gets composited.
      tryPlay();
      let elapsed = 0;
      retryTimer = setInterval(() => {
        elapsed += 250;
        if (tryPlay() || elapsed >= 4000) {
          if (retryTimer) {
            clearInterval(retryTimer);
            retryTimer = null;
          }
        }
      }, 250);
    }

    return () => {
      ro.disconnect();
      iframeEl?.removeEventListener("load", tryPlay);
      if (retryTimer) clearInterval(retryTimer);
    };
  }, [ready]);

  // Mount gating:
  //  · Only mount on lg+ viewports (the desktop aside is `lg:block`).
  //  · Only mount when the laptop preview is approaching the viewport
  //    (IntersectionObserver with 600 px rootMargin). This stops the
  //    iframe from booting a full second React app + GSAP + the hero
  //    video while the user is still at the top of the page —
  //    primary cause of the perceived performance dip.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const mq = window.matchMedia("(min-width: 1024px)");
    let near = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const evaluate = () => {
      if (!mq.matches || !near) {
        setReady(false);
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        return;
      }
      // Tiny defer so the in-page paint isn't competing with the
      // iframe's hero boot.
      if (!timer) timer = setTimeout(() => setReady(true), 250);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        evaluate();
      },
      { rootMargin: "600px 0px", threshold: 0 },
    );
    io.observe(wrapper);

    const onMq = () => evaluate();
    mq.addEventListener("change", onMq);

    return () => {
      io.disconnect();
      mq.removeEventListener("change", onMq);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0A0A0B]"
    >
      {ready && (
        <iframe
          ref={iframeRef}
          src="/?hero-only=true"
          title="Magicks Hero Preview"
          className="absolute left-0 top-0 border-0 bg-[#0a0a0a]"
          style={{
            width: `${HERO_IFRAME_W}px`,
            height: `${HERO_IFRAME_H}px`,
            // Initial opacity hides the iframe before matrix3d lands —
            // we don't translate it off-screen because Chrome's
            // autoplay heuristic refuses to start the video unless
            // the iframe is at least conceptually "visible". The
            // layout effect flips opacity to 1 the moment matrix3d
            // is applied (single frame).
            opacity: 0,
            transformOrigin: "0 0",
          }}
          loading="lazy"
          tabIndex={-1}
          // Same-origin iframe but the browser still requires explicit
          // `allow` permissions for autoplay. Without these, the hero
          // video stays on its first frame and the section reads as a
          // static screenshot instead of the live animated hero.
          allow="autoplay; encrypted-media; fullscreen"
        />
      )}
    </div>
  );
}

/**
 * Mobile counterpart to `LaptopScreenIframe`. Instead of mounting an
 * entire second React app inside an iframe, we render a plain `<video>`
 * element and perspective-map it onto the laptop screen quad. Cuts the
 * runtime cost dramatically (no second GSAP boot, no second hero
 * component tree) while still showing live motion through the alpha
 * hole. Used inside the per-card mobile inline preview.
 *
 * The video element is the same source as the homepage hero, so on
 * cached navigations the file is already in the browser cache.
 */
function LaptopScreenVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const apply = () => {
      const video = videoRef.current;
      if (!video) return;
      const rect = wrapper.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      // Mobile container is `aspect-[16/10]` — same ratio as the image
      // — and uses default `object-position: center`, so we pass 50%.
      const corners = projectCornersToContainer(rect.width, rect.height, 50, 50);
      const matrix = quadToQuadMatrix3d(HERO_VIDEO_W, HERO_VIDEO_H, corners);
      video.style.transform = matrix;
      video.style.transformOrigin = "0 0";
      video.style.opacity = "1";
    };

    apply();

    const ro = new ResizeObserver(apply);
    ro.observe(wrapper);

    // Force the muted attribute pre-paint (React only sets the
    // property), then kick playback. iOS Safari additionally requires
    // playsInline (set on the JSX) for inline autoplay.
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.setAttribute("muted", "");
      const p = v.play();
      if (p && typeof p.then === "function") p.catch(() => {});
    }

    return () => {
      ro.disconnect();
    };
  }, [ready]);

  // Lazy-mount when the card approaches the viewport. Tighter
  // rootMargin than the iframe (300 px vs. 600 px) because a `<video>`
  // is far cheaper to spin up — we can afford to defer harder.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!timer) timer = setTimeout(() => setReady(true), 120);
        } else {
          setReady(false);
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
        }
      },
      { rootMargin: "300px 0px", threshold: 0 },
    );
    io.observe(wrapper);

    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0A0A0B]"
    >
      {ready && (
        <video
          ref={videoRef}
          src={HERO_VIDEO_SRC}
          className="absolute left-0 top-0 object-cover object-center"
          style={{
            width: `${HERO_VIDEO_W}px`,
            height: `${HERO_VIDEO_H}px`,
            opacity: 0,
            transformOrigin: "0 0",
          }}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          tabIndex={-1}
        />
      )}
    </div>
  );
}

function useCanHover(): boolean {
  const [v, setV] = useState<boolean>(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const on = () => setV(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return v;
}

/**
 * Image-first preview stack. All four visuals are rendered up-front so
 * the cross-fade is a pure opacity swap (no layout thrash). The active
 * image additionally gets a slow Ken-Burns move via `.preview-stack__image`
 * so the still has just enough life to feel cinematic without ever
 * pulling attention away from the type on the left column.
 */
function PreviewStack({ activeIdx, className = "" }: { activeIdx: number; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`.trim()}>
      {SERVICES.map((s, i) => {
        const isActive = activeIdx === i;
        const isWebsites = s.slug === "websites";

        return (
          <div
            key={s.slug}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/*
              For the websites slide we render the live hero BEHIND
              the laptop photo. The photo has a true alpha hole at the
              screen, so the iframe naturally appears only inside the
              screen area — no clip-path needed. The iframe itself is
              perspective-mapped via matrix3d (see LaptopScreenIframe).
            */}
            {isWebsites && <LaptopScreenIframe />}

            {/* Laptop photograph — sits ABOVE the iframe so the alpha
                hole reveals the hero. object-position is shifted left
                of center because the screen sits left of the image
                center; default centering would crop the screen edge. */}
            <img
              src={s.image}
              alt={isActive ? s.imageAlt : ""}
              width={1440}
              height={1800}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              draggable={false}
              className={`preview-stack__image absolute inset-0 h-full w-full object-cover ${
                isWebsites ? "z-10" : ""
              } ${isActive ? "preview-stack__image--active" : ""}`}
              style={
                isWebsites
                  ? { objectPosition: `${LAPTOP_OBJECT_POSITION_X}% center` }
                  : undefined
              }
            />
          </div>
        );
      })}

      {/* Studio-air — a very slow diagonal light pass. Non-looping perception
          (cycle is 34s and travels edge-to-edge only at the midpoint). */}
      <div aria-hidden className="preview-sweep z-30 relative pointer-events-none" />

      {/* Overlays tuned for intentionally dark-composed still images —
          lighter than the original video-era values so the composition
          reads through while the meta-text at top/bottom stays legible. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(ellipse_120%_80%_at_50%_120%,rgba(10,10,10,0.45),transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-t from-[#0A0A0B]/48 via-transparent to-[#0A0A0B]/14"
      />

      {/* Preview chapter-meta overlay */}
      <div className="pointer-events-none absolute left-5 top-5 z-40 flex items-center gap-3 sm:left-6 sm:top-6">
        <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/68 sm:text-[10.5px]">
          §{" "}
          {SERVICES[activeIdx]?.number}
        </span>
        <span aria-hidden className="h-px w-7 bg-white/32" />
        <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/58 sm:text-[10.5px]">
          {SERVICES[activeIdx]?.kicker}
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-baseline justify-between gap-4 sm:bottom-6 sm:left-6 sm:right-6">
        <span className="font-instrument text-[14px] italic text-white/75 sm:text-[15px]">
          {SERVICES[activeIdx]?.title}
        </span>
        <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.24em] text-white/46 sm:text-[10.5px]">
          {SERVICES[activeIdx]?.metric}
        </span>
      </div>
    </div>
  );
}

export function Services() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const canHover = useCanHover();

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [scrollIdx, setScrollIdx] = useState<number>(0);
  const hoverLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // IntersectionObserver — tracks which entry dominates the viewport.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const entries = Array.from(root.querySelectorAll<HTMLElement>("[data-service-entry]"));
    const ratios = new Array<number>(entries.length).fill(0);

    const obs = new IntersectionObserver(
      (records) => {
        for (const r of records) {
          const idx = Number((r.target as HTMLElement).dataset.serviceIndex ?? -1);
          if (idx < 0 || idx >= ratios.length) continue;
          ratios[idx] = r.intersectionRatio;
        }
        let best = 0;
        let bestR = 0;
        for (let i = 0; i < ratios.length; i++) {
          if (ratios[i] > bestR) {
            bestR = ratios[i];
            best = i;
          }
        }
        setScrollIdx(best);
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );

    entries.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  const onEnter = useCallback(
    (i: number) => {
      if (!canHover) return;
      if (hoverLeaveTimer.current) {
        clearTimeout(hoverLeaveTimer.current);
        hoverLeaveTimer.current = null;
      }
      setHoverIdx(i);
    },
    [canHover],
  );

  const onLeave = useCallback(() => {
    if (!canHover) return;
    if (hoverLeaveTimer.current) clearTimeout(hoverLeaveTimer.current);
    hoverLeaveTimer.current = setTimeout(() => {
      setHoverIdx(null);
      hoverLeaveTimer.current = null;
    }, 120);
  }, [canHover]);

  useEffect(() => {
    return () => {
      if (hoverLeaveTimer.current) clearTimeout(hoverLeaveTimer.current);
    };
  }, []);

  const activeIdx = canHover && hoverIdx !== null ? hoverIdx : scrollIdx;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const chapter = root.querySelector<HTMLElement>("[data-services-chapter]");
      const headline = root.querySelector<HTMLElement>("[data-services-headline]");
      const caption = root.querySelector<HTMLElement>("[data-services-caption]");
      const entries = gsap.utils.toArray<HTMLElement>("[data-service-entry]");
      const preview = root.querySelector<HTMLElement>("[data-services-preview]");
      const previewSticky = root.querySelector<HTMLElement>("[data-services-preview-sticky]");
      const farewell = root.querySelector<HTMLElement>("[data-services-farewell]");
      const ambient = root.querySelector<HTMLElement>("[data-services-ambient]");

      if (reduced) {
        gsap.set([chapter, headline, caption, ...entries, preview, farewell, ambient], {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
        });
        if (farewell) gsap.set(farewell, { opacity: 0 });
        return;
      }

      // ─── Ambient studio-light: behind the list ────────────────────────
      // A wide radial light that slowly drifts as the user reads through
      // the four clusters. Registers as depth, not as decoration.
      if (ambient) {
        gsap.set(ambient, { opacity: 0 });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root,
              start: "top 82%",
              end: "bottom 25%",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
            defaults: { ease: "none" },
          })
          .to(ambient, { opacity: 0.8, duration: 0.32, ease: "power2.out" }, 0)
          .to(ambient, { opacity: 1, duration: 0.36, ease: "none" }, 0.32)
          .to(ambient, { opacity: 0.42, duration: 0.32, ease: "power2.in" }, 0.68);
        parallaxDrift(ambient, { trigger: root, from: -4, to: 6, scrub: true });
      }

      // ─── Section header ──────────────────────────────────────────────
      // Wider entry triggers (top 98% → top ~30%) so chapter+headline+
      // caption begin building the instant the section peeks — no cold
      // frame between Value and Services.
      presenceEnvelope(chapter, {
        trigger: root,
        start: "top 98%",
        end: "top 34%",
        yFrom: 16,
        yTo: -8,
        blur: 3,
        holdRatio: 0.58,
      });

      presenceEnvelope(headline, {
        trigger: root,
        start: "top 96%",
        end: "top 26%",
        yFrom: 28,
        yTo: -12,
        blur: 5,
        holdRatio: 0.6,
      });

      presenceEnvelope(caption, {
        trigger: root,
        start: "top 90%",
        end: "top 22%",
        yFrom: 20,
        yTo: -10,
        blur: 3.5,
        holdRatio: 0.58,
      });

      // ─── Preview frame: entry + hold-breathing + exit ────────────────
      // The preview is sticky, so it lives on screen for the entire list.
      // It builds presence with the section entry, BREATHES softly during
      // the hold so the frame never feels frozen, and releases as the
      // user exits the section.
      if (preview) {
        const triggerEl = previewSticky ?? root;
        gsap.set(preview, { opacity: 0, scale: 0.955, filter: "blur(7px)" });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: triggerEl,
              start: "top 90%",
              end: "top 32%",
              scrub: 0.95,
              invalidateOnRefresh: true,
            },
            defaults: { ease: "none" },
          })
          .to(preview, {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            ease: "power2.out",
          });

        breathingScale(preview, { trigger: root, from: 0.996, peak: 1.008, to: 1.0, scrub: 1.6 });

        gsap.to(preview, {
          opacity: 0,
          scale: 0.988,
          filter: "blur(5px)",
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "bottom 60%",
            end: "bottom 12%",
            scrub: 0.95,
          },
        });
      }

      // ─── Service entries: per-entry focus envelope ───────────────────
      // Each entry gains clarity as it reaches its own viewport sweet
      // spot and softens as the next one takes over. Slightly stronger
      // floor-opacity than other sections so the list reads as a
      // continuous index rather than fade-pairs.
      focusEnvelope(entries as HTMLElement[], {
        start: "top 86%",
        end: "bottom 16%",
        blur: 4,
        opacityFloor: 0.3,
        focusOpacity: 1,
        holdRatio: 0.5,
      });

      // ─── Section farewell: deepens into Why MAGICKS ──────────────────
      sectionFarewell(farewell, {
        trigger: root,
        peak: 1,
        start: "bottom 80%",
        end: "bottom 0%",
        scrub: 1.0,
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="leistungen"
      className="relative bg-[#0A0A0B] px-5 pb-28 pt-24 sm:px-8 sm:pb-36 sm:pt-28 md:px-12 md:pb-44 md:pt-36 lg:px-16"
      aria-labelledby="services-heading"
    >
      <div aria-hidden className="section-top-rule" />

      {/* Ambient studio-light: wide radial field behind the list.
          Scroll-coupled intensity + slow lateral drift so the background
          never sits flat. Pure depth — never a focal element. */}
      <div
        data-services-ambient
        aria-hidden
        className="pointer-events-none absolute inset-0 will-change-[opacity,transform]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 28% 38%, rgba(255,255,255,0.025), transparent 72%)",
        }}
      />

      <div className="layout-max">
        <div className="mb-16 grid gap-5 md:mb-24 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20">
          <div data-services-chapter className="md:pt-2">
            <ChapterMarker num="02" label="Leistungen" />
          </div>

          <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-end md:gap-14">
            <h2
              id="services-heading"
              data-services-headline
              className="font-instrument text-[2rem] leading-[1.02] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.15rem] lg:text-[3.6rem]"
            >
              Was wir <em className="italic text-white/58">bauen</em>.
            </h2>
            <p
              data-services-caption
              className="font-ui max-w-md text-[14px] leading-[1.66] text-white/52 md:text-[15px]"
            >
              Vier Cluster, jeder mit klarem Einsatz im Unternehmen — keine Standard-Pakete,
              jedes Projekt als Arbeit mit Absicht. KI-gestützt umgesetzt, ohne Verlust an
              Substanz.
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 xl:gap-20">
          {/* Left — editorial index */}
          <ol className="relative border-t border-white/[0.08]">
            {SERVICES.map((s, i) => {
              const active = activeIdx === i;
              return (
                <li
                  key={s.slug}
                  data-service-entry
                  data-service-index={s.index}
                  onPointerEnter={() => onEnter(i)}
                  onPointerLeave={onLeave}
                  className="border-b border-white/[0.08]"
                >
                  <Link
                    to={s.href}
                    onFocus={() => canHover && onEnter(i)}
                    onBlur={onLeave}
                    className="group relative block py-10 no-underline outline-none sm:py-12 md:py-14"
                  >
                    <div
                      aria-hidden
                      className={`absolute left-0 top-0 h-full w-[2px] origin-top bg-white magicks-duration-hover magicks-ease-out transition-[transform,opacity] ${
                        active ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                      }`}
                    />

                    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-5 gap-y-1.5 sm:gap-x-7 md:grid-cols-[52px_minmax(0,1fr)_auto] md:gap-x-10">
                      <span
                        className={`font-mono pt-[0.55rem] text-[12px] font-medium leading-none tracking-[0.18em] magicks-duration-hover magicks-ease-out transition-colors sm:text-[12px] sm:tracking-[0.28em] ${
                          active ? "text-white" : "text-white/45"
                        }`}
                      >
                        {s.number}
                      </span>

                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          <span
                            className={`font-mono text-[11px] font-medium uppercase leading-none tracking-[0.2em] magicks-duration-hover magicks-ease-out transition-colors sm:text-[10.5px] sm:tracking-[0.3em] ${
                              active ? "text-white/72" : "text-white/40"
                            }`}
                          >
                            {s.kicker}
                          </span>
                          <span
                            aria-hidden
                            className={`h-px magicks-duration-hover magicks-ease-out transition-[width,background-color] ${
                              active ? "w-10 bg-white/40" : "w-5 bg-white/15"
                            }`}
                          />
                        </div>

                        <h3
                          className={`font-instrument text-[1.65rem] leading-[1.1] tracking-[-0.02em] magicks-duration-hover magicks-ease-out transition-colors sm:text-[2rem] md:text-[2.3rem] lg:text-[2.45rem] ${
                            active ? "text-white" : "text-white/82"
                          }`}
                        >
                          {s.title}
                        </h3>

                        <p className="font-ui mt-3 max-w-md text-[14px] leading-[1.62] text-white/52 sm:text-[14.5px] md:mt-4 md:text-[15px]">
                          {s.teaser}
                        </p>

                        {/* Inline media — mobile/tablet only. The
                            websites slide gets a live <video> behind the
                            laptop's alpha hole (no iframe, just a raw
                            video element — far cheaper on mobile).
                            Other slides stay as plain images. */}
                        <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-[0.85rem] border border-white/[0.08] lg:hidden">
                          {s.slug === "websites" && <LaptopScreenVideo />}
                          <img
                            src={s.image}
                            alt={s.imageAlt}
                            width={1440}
                            height={900}
                            loading="lazy"
                            decoding="async"
                            fetchPriority="low"
                            draggable={false}
                            className={`preview-stack__image preview-stack__image--active absolute inset-0 h-full w-full object-cover object-center ${
                              s.slug === "websites" ? "z-10" : ""
                            }`}
                          />
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#0A0A0B]/45 via-transparent to-[#0A0A0B]/12"
                          />
                        </div>

                        <span
                          className={`mt-5 inline-flex min-h-[40px] items-center gap-2 font-mono text-[11.5px] font-medium uppercase leading-none tracking-[0.16em] magicks-duration-hover magicks-ease-out transition-colors sm:min-h-0 sm:text-[11px] sm:tracking-[0.24em] ${
                            active ? "text-white" : "text-white/55"
                          }`}
                        >
                          Ansehen
                          <span
                            aria-hidden
                            className={`h-px magicks-duration-hover magicks-ease-out transition-[width,background-color] ${
                              active ? "w-8 bg-white" : "w-4 bg-white/40"
                            }`}
                          />
                        </span>
                      </div>

                      <span
                        aria-hidden
                        className={`mt-[0.5rem] hidden h-8 w-8 items-center justify-center rounded-full border text-white magicks-duration-hover magicks-ease-out transition-[background-color,border-color,transform] md:flex ${
                          active
                            ? "-translate-y-[1px] translate-x-[1px] border-white/40 bg-white/10"
                            : "border-white/10 bg-transparent"
                        }`}
                      >
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4">
                          <path d="M3 11 L11 3 M5 3 H11 V9" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>

          {/* Right — sticky preview (desktop only) */}
          <aside
            data-services-preview-sticky
            aria-hidden
            className="relative hidden lg:block"
          >
            <div className="sticky top-[14vh]">
              <div
                data-services-preview
                className="relative aspect-[4/5] w-full overflow-hidden rounded-[1rem] border border-white/[0.08] bg-[#0C0C0E] shadow-[0_48px_120px_-60px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <PreviewStack activeIdx={activeIdx} className="h-full w-full" />
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 px-2">
                <span className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.28em] text-white/40">
                  Live Preview
                </span>
                <span className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.28em] text-white/40">
                  {String(activeIdx + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Section farewell — ink shadow that deepens as Services hands off
          to Why MAGICKS. Reads as a printed spread ending, not a cut. */}
      <div
        data-services-farewell
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 will-change-[opacity]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(8,8,10,0.32) 58%, rgba(8,8,10,0.58) 100%)",
        }}
      />
    </section>
  );
}
