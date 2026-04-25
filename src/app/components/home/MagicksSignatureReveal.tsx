import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

import magicksSignatureUrl from "../../../assets/signature/magicks-signature.svg?url";
import studioSignatureUrl from "../../../assets/signature/studio-signature.svg?url";
import combinedSignatureUrl from "../../../assets/signature/magicks-studio-signature-full.svg?url";

export const MAGICKS_SIGNATURE_COMBINED_URL: string = combinedSignatureUrl;

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
 * effect. The logo emerges from the shadows via a combination of a 
 * soft-sweeping gradient mask, deep blur resolution, gentle upward 
 * scale, and an atmospheric silver bloom.
 */
export function MagicksSignatureReveal({
  className = "",
  duration = 3.6,
  startTrigger = "top 82%",
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
      // Deep blur, dropped slightly down, fully transparent, and the
      // mask gradient is pushed entirely off the left edge.
      // We use a slight 3D rotation and translateZ to force hardware 
      // anti-aliasing and prevent rasterization artifacts during scale.
      gsap.set([magicks, studio], { 
        opacity: 0.01, 
        filter: "blur(8px)", 
        scale: 0.98,
        y: 8,
        z: 0,
        rotationZ: 0.01,
        "--m-end": "-40%" 
      });
      gsap.set(glow, { opacity: 0 });

      // ─── Timing ───────────────────────────────────────────────────────
      const magicksDur = duration * 0.65; 
      const studioDur = duration * 0.65; 
      const stagger = duration * 0.3;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: startTrigger,
          once: true,
          invalidateOnRefresh: true,
        },
      });

      // 1. Ambient glow breathes in heavily, then settles to a subtle halo.
      tl.to(glow, { opacity: 1, duration: duration * 0.45, ease: "power2.out" }, 0);
      tl.to(glow, { opacity: 0.25, duration: duration * 0.55, ease: "power2.inOut" }, duration * 0.45);

      // 2. Magicks emerges.
      // Opacity snaps to 1 almost instantly so the mask gradient alone drives the light.
      tl.to(magicks, { "--m-end": "120%", duration: magicksDur, ease: "power1.inOut" }, 0);
      tl.to(magicks, { opacity: 1, duration: 0.2, ease: "none" }, 0);
      tl.to(magicks, { filter: "blur(0px)", duration: magicksDur * 0.7, ease: "power2.out" }, 0);
      tl.to(magicks, { scale: 1, y: 0, rotationZ: 0, duration: magicksDur, ease: "expo.out" }, 0);

      // 3. Studio staggers in shortly after, following the exact same physics.
      tl.to(studio, { "--m-end": "120%", duration: studioDur, ease: "power1.inOut" }, stagger);
      tl.to(studio, { opacity: 1, duration: 0.2, ease: "none" }, stagger);
      tl.to(studio, { filter: "blur(0px)", duration: studioDur * 0.7, ease: "power2.out" }, stagger);
      tl.to(studio, { scale: 1, y: 0, rotationZ: 0, duration: studioDur, ease: "expo.out" }, stagger);

    }, root);

    return () => ctx.revert();
  }, [reduced, duration, startTrigger, mediaReady]);

  const layerStyle = (url: string) => {
    const base: React.CSSProperties & Record<string, string | number> = {
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      "--m-end": "100%",
      // The mask creates a 30% wide gradient sweep edge for an ultra-smooth but bright reveal.
      maskImage: "linear-gradient(to right, black var(--m-end), transparent calc(var(--m-end) + 30%))",
      WebkitMaskImage: "linear-gradient(to right, black var(--m-end), transparent calc(var(--m-end) + 30%))",
      transformOrigin: "center center",
      // Force hardware acceleration and high-res rasterization
      transform: "translateZ(0)",
      backfaceVisibility: "hidden",
      willChange: "opacity, filter, transform, mask-image",
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
