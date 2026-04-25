import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/*
 * Signature source assets (exported from Figma into `src/assets/signature/`):
 *
 *   1. magicksSignatureUrl   — the "Magicks" wordmark only
 *   2. studioSignatureUrl    — the "Studio" tagline only
 *   3. combinedSignatureUrl  — both on a single canvas (poster/OG fallback)
 *
 * All three share viewBox `0 0 1672 941`, so when the two separated SVGs are
 * overlaid at full opacity with no clip they reproduce the combined asset
 * pixel-perfectly. The animated reveal therefore operates on the two
 * separated layers, and the combined SVG is kept only as a named export for
 * any external consumer (e.g. OG/poster generation) that prefers a single
 * composed file.
 *
 * Build note: Vite hashes and emits each `?url` import into
 * `dist/assets/*.svg`, so the fetched URL is immutable and cache-friendly.
 */
import magicksSignatureUrl from "../../../assets/signature/magicks-signature.svg?url";
import studioSignatureUrl from "../../../assets/signature/studio-signature.svg?url";
import combinedSignatureUrl from "../../../assets/signature/magicks-studio-signature-full.svg?url";

/**
 * Bundled URL of the combined "Magicks · Studio" signature SVG.
 * The runtime reveal uses the two separated SVGs (lighter payload, same
 * visual result). Exposed here so poster/OG generators can grab a single
 * composed asset without re-bundling it.
 */
export const MAGICKS_SIGNATURE_COMBINED_URL: string = combinedSignatureUrl;

const ASSET_W = 1672;
const ASSET_H = 941;

/**
 * Eager-fetch gate — the signature sits deep in the About section on the
 * homepage and well below the fold elsewhere, so we delay decoding until
 * the user is within ~1500 px of it. Below that margin the masked <div>s
 * render empty (no image fetch, no decode cost). Once flipped true we keep
 * it true so the GSAP timeline always has a stable asset.
 */
const SIG_ROOT_MARGIN = "1500px 0px";

/**
 * Per-word "write region", measured from the actual `<path>` bounding boxes
 * in each separated SVG (both share viewBox 1672 × 941):
 *
 *   Magicks ink: x 2.42% → 97.37%,  y 11.91% → 57.40%
 *   Studio  ink: x 41.39% → 97.13%, y 44.00% → 84.86%
 *
 * The pen ghost-traces these regions so the motion reads as "the nib is
 * following the letters" rather than "a wipe is crossing an empty canvas".
 * If the SVGs are re-exported with different bounds, update these values
 * (the measurement helper is saved on `MagicksSignatureReveal` history).
 *
 * Each value is a 0–1 fraction. Tiny padding on each side keeps the pen
 * visibly just ahead of / behind the ink on high-DPI screens.
 */
const MAGICKS_REGION = {
  xStart: 0.015,
  xEnd: 0.985,
  yTop: 0.10,
  yBottom: 0.60,
} as const;

const STUDIO_REGION = {
  xStart: 0.38,
  xEnd: 0.985,
  yTop: 0.42,
  yBottom: 0.87,
} as const;

type Props = {
  /** Caller-controlled width + placement, e.g. `"w-[220px] sm:w-[260px]"`. */
  className?: string;
  /** Total reveal duration in seconds. Tasteful range 2.5–4.5 s. Default 3.2 s. */
  duration?: number;
  /** ScrollTrigger `start` string. Default `"top 82%"`. */
  startTrigger?: string;
};

/**
 * MagicksSignatureReveal
 * ---------------------------------------------------------------------
 * Premium, once-per-load handwritten-signature reveal of the MAGICKS
 * wordmark. Two `clip-path` sweeps — one for the "Magicks" layer, one
 * for the "Studio" layer — are guided by a thin ghost-pen highlight so
 * the motion reads as a nib writing the mark in real time. After both
 * bands complete, the pen lifts, a subtle silver glow relaxes to an
 * imperceptible halo, and the two layers settle as the final crisp
 * logo.
 *
 *
 * ▶ Why clip-path + ghost pen rather than stroke-dashoffset?
 *   The exported SVGs contain hundreds of filled closed paths
 *   (`<path fill="#FBFBFB">`, `fill="#CFCCCB"`, …) with no strokes.
 *   Forcing `stroke-dasharray` onto filled shapes looks like a cheap
 *   outline trace — precisely the "bad stroke animation" the brief
 *   forbids. A masked reveal with a guided pen preserves the exact
 *   handwritten geometry while producing a real-time writing feel.
 *
 *
 * ▶ Clip-path driver
 *   Each layer's `clip-path` is composed from two CSS custom
 *   properties (`--sig-left-px` for the fixed ink-x padding and
 *   `--sig-right-pct` for the tweened reveal progress). GSAP animates
 *   the custom property directly on the element, which the browser
 *   re-composes into a valid `inset(...)` string on every frame —
 *   this is substantially more robust than tweening a JS proxy with
 *   an `onUpdate` writer (which can miss frames when a ScrollTrigger
 *   timeline is fast-forwarded because the trigger point was already
 *   past at creation time).
 *
 *
 * ▶ Forward-compat (true stroke-path upgrade):
 *   If the asset is re-exported as single-stroke paths grouped
 *   `data-signature-part="magicks"` / `data-signature-part="studio"`,
 *   inline the SVG (e.g. `?raw` + `dangerouslySetInnerHTML`) and swap
 *   the two masked <div>s below for those groups — the public props,
 *   wrapper DOM, and the `MAGICKS_REGION` / `STUDIO_REGION` constants
 *   remain stable so the migration stays local to this file.
 *
 *
 * ▶ Reduced-motion users get the crisp final state immediately — no
 *   timeline is built and no ScrollTrigger is registered.
 * ---------------------------------------------------------------------
 */
export function MagicksSignatureReveal({
  className = "",
  duration = 3.2,
  startTrigger = "top 82%",
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  // `mediaReady` gates the first image decode. Until the signature nears
  // the viewport, the masked <div>s have no background — zero network
  // and zero paint cost. Once flipped true we keep it true.
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
        for (const e of entries) {
          if (e.isIntersecting) {
            setMediaReady(true);
            observer.disconnect();
            return;
          }
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
      const pen = root.querySelector<HTMLElement>("[data-sig-pen]");
      const glow = root.querySelector<HTMLElement>("[data-sig-glow]");

      if (!magicks || !studio || !pen || !glow) return;

      const pct = (v: number) => `${(v * 100).toFixed(3)}%`;

      // Each layer reveals from left to right. We express the "right
      // inset" as a CSS custom property (`--sig-right`) on the layer
      // itself; the clip-path on the layer then reads that property.
      // GSAP tweens the custom property directly, and the browser
      // re-composes the valid clip-path string every frame.
      const magRightStart = `${(100).toFixed(3)}%`;
      const magRightEnd = `${((1 - MAGICKS_REGION.xEnd) * 100).toFixed(3)}%`;
      const stuRightStart = `${(100).toFixed(3)}%`;
      const stuRightEnd = `${((1 - STUDIO_REGION.xEnd) * 100).toFixed(3)}%`;

      if (reduced) {
        // Respect prefers-reduced-motion: skip the write, show the
        // settled mark. No timeline, no ScrollTrigger.
        gsap.set(magicks, {
          opacity: 1,
          "--sig-right": magRightEnd,
        });
        gsap.set(studio, {
          opacity: 1,
          "--sig-right": stuRightEnd,
        });
        gsap.set(pen, { opacity: 0 });
        gsap.set(glow, { opacity: 0.14 });
        return;
      }

      // --- Initial state ------------------------------------------------
      gsap.set(magicks, { opacity: 1, "--sig-right": magRightStart });
      gsap.set(studio, { opacity: 1, "--sig-right": stuRightStart });
      gsap.set(pen, {
        opacity: 0,
        left: pct(MAGICKS_REGION.xStart),
        top: pct(MAGICKS_REGION.yTop),
        height: pct(MAGICKS_REGION.yBottom - MAGICKS_REGION.yTop),
      });
      gsap.set(glow, { opacity: 0 });

      // --- Timing -------------------------------------------------------
      // Pen + clip for each word run in strict sequence (no overlap on the
      // pen's own tweens) so the nib cleanly lifts off "Magicks" and
      // replants at "Studio". The handoff band is where the cinematic
      // overlap lives: opacity dip, vertical re-seat, opacity return.
      const magicksDur = duration * 0.43; // Magicks write  ≈ 1.376 s @ 3.2 s
      const handoffDur = duration * 0.08; // Nib lift + replant ≈ 0.256 s
      const studioDur = duration * 0.42; // Studio write  ≈ 1.344 s
      const handoffStart = magicksDur;
      const studioStart = magicksDur + handoffDur;
      const settleStart = studioStart + studioDur;

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: root,
          start: startTrigger,
          once: true,
          invalidateOnRefresh: true,
        },
      });

      // Glow + pen touch down.
      tl.to(glow, { opacity: 1, duration: 0.32, ease: "power2.out" }, 0);
      tl.to(pen, { opacity: 1, duration: 0.22, ease: "power2.out" }, 0.04);

      // "Magicks" — animate the custom property (the inset() string
      // recomposes automatically); the pen tracks the clip's leading
      // edge through the exact same x range.
      tl.to(
        magicks,
        {
          "--sig-right": magRightEnd,
          duration: magicksDur,
          ease: "power1.inOut",
        },
        0,
      ).to(
        pen,
        {
          left: pct(MAGICKS_REGION.xEnd),
          duration: magicksDur,
          ease: "power1.inOut",
        },
        0,
      );

      // Nib handoff ---
      // Fade pen out at the tail of "Magicks", instantly re-seat onto
      // the Studio band, fade pen back in just before Studio begins.
      // Because the Magicks pen tween has ended at `handoffStart`, there
      // is no residual tween competing with these writes.
      tl.to(
        pen,
        { opacity: 0, duration: handoffDur * 0.45, ease: "power1.out" },
        handoffStart,
      );
      tl.set(
        pen,
        {
          left: pct(STUDIO_REGION.xStart),
          top: pct(STUDIO_REGION.yTop),
          height: pct(STUDIO_REGION.yBottom - STUDIO_REGION.yTop),
        },
        handoffStart + handoffDur * 0.5,
      );
      tl.to(
        pen,
        { opacity: 1, duration: handoffDur * 0.45, ease: "power2.out" },
        handoffStart + handoffDur * 0.55,
      );

      // "Studio" — same cadence, tuned to its own span.
      tl.to(
        studio,
        {
          "--sig-right": stuRightEnd,
          duration: studioDur,
          ease: "power1.inOut",
        },
        studioStart,
      ).to(
        pen,
        {
          left: pct(STUDIO_REGION.xEnd),
          duration: studioDur,
          ease: "power1.inOut",
        },
        studioStart,
      );

      // Settle — pen retires, glow relaxes from write-time halo to a
      // near-imperceptible afterlight. Clip-paths are fully open, so the
      // layers now render their full ink cleanly.
      tl.to(pen, { opacity: 0, duration: 0.35, ease: "power1.inOut" }, settleStart - 0.1);
      tl.to(glow, { opacity: 0.18, duration: 0.55, ease: "power2.out" }, settleStart);
    }, root);

    return () => ctx.revert();
  }, [reduced, duration, startTrigger, mediaReady]);

  // Empty style until the layer is in range — no background = no fetch.
  // The `--sig-left` custom property is layer-specific and set inline
  // from `MAGICKS_REGION.xStart` / `STUDIO_REGION.xStart` so updates to
  // the regions flow through without touching the clip-path expression.
  const layerStyle = (url: string, leftPct: number, initialRight: string) => {
    const base: React.CSSProperties & Record<string, string | number> = {
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      // `--sig-right` is the GSAP-animated property; seeded here so the
      // initial style object already carries the var the tween expects.
      "--sig-left": `${(leftPct * 100).toFixed(3)}%`,
      "--sig-right": initialRight,
      clipPath: "inset(0% var(--sig-right) 0% var(--sig-left))",
      WebkitClipPath: "inset(0% var(--sig-right) 0% var(--sig-left))",
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
      {/* Ambient halo wrapper — isolated on an inner element so an outer
          envelope on the host (e.g. About.tsx's presenceEnvelope) can
          tween opacity/filter without clobbering our glow. */}
      <div
        data-sig-glow
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{ filter: "drop-shadow(0 0 14px rgba(255,255,255,0.22))" }}
      >
        {/* "Magicks" layer — clip-path sweeps L→R across its own span. */}
        <div
          data-sig-layer="magicks"
          aria-hidden
          className="absolute inset-0"
          style={layerStyle(magicksSignatureUrl, MAGICKS_REGION.xStart, "100.000%")}
        />

        {/* "Studio" layer — clip-path sweeps L→R after Magicks. */}
        <div
          data-sig-layer="studio"
          aria-hidden
          className="absolute inset-0"
          style={layerStyle(studioSignatureUrl, STUDIO_REGION.xStart, "100.000%")}
        />

        {/* Ghost pen — thin luminous stripe with a soft trailing halo.
            Position (left/top/height/opacity) is fully GSAP-driven. */}
        <span
          data-sig-pen
          aria-hidden
          className="pointer-events-none absolute w-[2px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.6))",
            boxShadow:
              "0 0 10px rgba(255,255,255,0.55), -18px 0 22px -6px rgba(255,255,255,0.35)",
            transform: "skewX(-4deg)",
            opacity: 0,
          }}
        />
      </div>
    </div>
  );
}
