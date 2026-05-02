import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

import magicksSignatureUrl from "../../../assets/signature/magicks-signature.svg?url";
import studioSignatureUrl from "../../../assets/signature/studio-signature.svg?url";

const ASSET_W = 1672;
const ASSET_H = 941;
const SIG_ROOT_MARGIN = "1500px 0px";

type Props = {
  className?: string;
  duration?: number;
  startTrigger?: string;
};

/**
 * MagicksSignatureReveal
 * ---------------------------------------------------------------------
 * Premium cinematic reveal for the MAGICKS wordmark.
 *
 * Instead of a literal "pen writing" clip-path (which looks cheap on
 * filled outline SVGs), this uses a high-end "photographic exposure"
 * effect. The logo emerges from the shadows via a soft-sweeping
 * gradient mask, deep blur resolution, and an atmospheric silver bloom.
 *
 * Mobile/perf notes:
 *   • No scale/y transform on the layers — the mask sweep + blur
 *     resolve + opacity snap carry the entire choreography. Removing
 *     transforms eliminates GPU pressure on low-end mobile chips and
 *     prevents jitter during touch scroll.
 *   • The trigger fires earlier on small viewports so the user sees
 *     the full reveal as the figure enters from the bottom rather
 *     than after they've already scrolled past it.
 *   • Scroll-coupled: the same choreography plays forward on enter
 *     and reverses on leave (and vice versa when scrolling back),
 *     so the signature feels alive both directions.
 */
export function MagicksSignatureReveal({
  className = "",
  duration = 3.4,
  startTrigger,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [mediaReady, setMediaReady] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (typeof IntersectionObserver === "undefined") {
      setMediaReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMediaReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: SIG_ROOT_MARGIN, threshold: 0 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!mediaReady) return;

    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const magicks = root.querySelector<HTMLElement>('[data-sig-layer="magicks"]');
      const studio = root.querySelector<HTMLElement>('[data-sig-layer="studio"]');
      const glow = root.querySelector<HTMLElement>("[data-sig-glow]");

      if (!magicks || !studio || !glow) return;

      if (reduced) {
        gsap.set([magicks, studio], { opacity: 1, filter: "blur(0px)", "--m-end": "100%" });
        gsap.set(glow, { opacity: 0.15 });
        return;
      }

      // ─── Initial state ────────────────────────────────────────────────
      // Layers start invisible (opacity ~0), softly out of focus, with
      // the mask gradient parked off the left edge. No scale/y/3D
      // transforms — they cause sub-pixel jitter on mobile during
      // touch-scroll and don't add to the cinematic feel here.
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
      const startBlur = isMobile ? 6 : 8;

      gsap.set([magicks, studio], {
        opacity: 0.01,
        filter: `blur(${startBlur}px)`,
        "--m-end": "-30%",
      });
      gsap.set(glow, { opacity: 0 });

      // ─── Timing ───────────────────────────────────────────────────────
      const magicksDur = duration * 0.62;
      const studioDur = duration * 0.62;
      const stagger = duration * 0.3;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          // Fire earlier on small viewports so the reveal aligns with
          // the figure entering the bottom of the screen.
          start: startTrigger ?? (isMobile ? "top 92%" : "top 82%"),
          // The figure leaves when its bottom passes 15% of viewport top.
          // Combined with toggleActions below, this means the timeline
          // reverses elegantly as the user scrolls past, then plays
          // forward again on the way back.
          end: "bottom 15%",
          toggleActions: "play reverse play reverse",
          invalidateOnRefresh: true,
        },
      });

      // 1. Ambient glow breathes in, then settles to a quiet halo.
      tl.to(glow, { opacity: 1, duration: duration * 0.42, ease: "power2.out" }, 0);
      tl.to(glow, { opacity: 0.22, duration: duration * 0.58, ease: "power2.inOut" }, duration * 0.42);

      // 2. Magicks emerges.
      // Opacity snaps to 1 almost instantly so the mask gradient alone
      // drives the visible light — the mark stays bright and sharp the
      // entire time the sweep is moving across it.
      tl.to(magicks, { opacity: 1, duration: 0.18, ease: "none" }, 0);
      tl.to(magicks, { "--m-end": "120%", duration: magicksDur, ease: "power2.inOut" }, 0);
      tl.to(magicks, { filter: "blur(0px)", duration: magicksDur * 0.75, ease: "power3.out" }, 0);

      // 3. Studio staggers in shortly after, identical physics.
      tl.to(studio, { opacity: 1, duration: 0.18, ease: "none" }, stagger);
      tl.to(studio, { "--m-end": "120%", duration: studioDur, ease: "power2.inOut" }, stagger);
      tl.to(studio, { filter: "blur(0px)", duration: studioDur * 0.75, ease: "power3.out" }, stagger);

    }, root);

    return () => ctx.revert();
  }, [reduced, duration, startTrigger, mediaReady]);

  const layerStyle = (url: string) => {
    const base: React.CSSProperties & Record<string, string | number> = {
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      "--m-end": "100%",
      // 28% wide gradient sweep edge — wide enough to feel like soft
      // light, narrow enough to keep the mark bright and crisp.
      maskImage:
        "linear-gradient(to right, black var(--m-end), transparent calc(var(--m-end) + 28%))",
      WebkitMaskImage:
        "linear-gradient(to right, black var(--m-end), transparent calc(var(--m-end) + 28%))",
      // Promote to its own GPU layer so the only animated properties
      // (opacity, filter, mask-image) compose without re-layout.
      transform: "translateZ(0)",
      backfaceVisibility: "hidden",
      willChange: "opacity, filter, mask-image",
    };
    if (mediaReady) {
      base.backgroundImage = `url(${url})`;
    }
    return base;
  };

  return (
    <div
      ref={rootRef}
      className={`relative block ${className}`.trim()}
      style={{ aspectRatio: `${ASSET_W} / ${ASSET_H}` }}
      role="img"
      aria-label="MAGICKS Studio — Signatur"
    >
      <div
        data-sig-glow
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          // Multiple shadows create a more cinematic, diffuse bloom than a single one
          filter: "drop-shadow(0 0 12px rgba(255,255,255,0.3)) drop-shadow(0 0 32px rgba(255,255,255,0.2))",
          transform: "translateZ(0)",
        }}
      >
        <div
          data-sig-layer="magicks"
          aria-hidden
          className="absolute inset-0"
          style={layerStyle(magicksSignatureUrl)}
        />
        <div
          data-sig-layer="studio"
          aria-hidden
          className="absolute inset-0"
          style={layerStyle(studioSignatureUrl)}
        />
      </div>
    </div>
  );
}
