import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const ASSET_URL = "/assets/magicks-3d.svg";
const ASSET_W = 1672;
const ASSET_H = 941;

type Props = {
  /** Caller-controlled width + placement, e.g. `"w-[220px] sm:w-[260px]"`. */
  className?: string;
  /**
   * Upper-band height ratio. The current raster asset splits cleanly at
   * ~0.62 between the "Magicks" wordmark (upper) and the "Studio" tagline
   * (lower). Tuneable if the asset is recomposed later.
   */
  splitRatio?: number;
  /** Total reveal duration in seconds. Default 2.8 s. */
  duration?: number;
  /** ScrollTrigger `start` string. Default `"top 80%"`. */
  startTrigger?: string;
};

/**
 * MagicksSignatureReveal
 * ---------------------------------------------------------------------
 * Premium, once-per-load handwritten-signature reveal of the MAGICKS
 * wordmark. Two clip-path sweeps — one for "Magicks", one for "Studio"
 * — are guided by a thin ghost-pen highlight to emulate a nib writing
 * the mark. After both bands complete, the crisp base image fades in
 * and the masked layers retire.
 *
 * ▶ Why clip-path + ghost pen rather than stroke-dashoffset?
 *   The source at `/assets/magicks-3d.svg` is a *rasterized* SVG — its
 *   body is a single `<rect>` filled with a `<pattern>` that references
 *   an embedded PNG. It contains no vector paths, so stroke-based
 *   "writing" is not available. The two-band reveal with a travelling
 *   pen preserves the handwritten feel without needing pen geometry.
 *
 * ▶ Forward-compat (grouped vector upgrade):
 *   If the asset is later re-exported as a true vector with authored
 *   groups tagged `data-signature-part="magicks"` and
 *   `data-signature-part="studio"`, inline the SVG (e.g. via `?raw`
 *   import + `dangerouslySetInnerHTML` on this root) and swap the two
 *   masked <div>s below for those groups. The public API of this
 *   component (props, wrapper DOM, `data-signature-part` naming
 *   convention on the inner layers) is intentionally stable so the
 *   migration is a local, one-file change.
 *
 * ▶ Reduced-motion users get the crisp final state immediately — no
 *   timeline is built, no ScrollTrigger is registered for this node.
 * ---------------------------------------------------------------------
 */
export function MagicksSignatureReveal({
  className = "",
  splitRatio = 0.62,
  duration = 2.8,
  startTrigger = "top 80%",
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const base = root.querySelector<HTMLElement>("[data-sig-base]");
      const upper = root.querySelector<HTMLElement>('[data-sig-layer="upper"]');
      const lower = root.querySelector<HTMLElement>('[data-sig-layer="lower"]');
      const pen = root.querySelector<HTMLElement>("[data-sig-pen]");
      const glow = root.querySelector<HTMLElement>("[data-sig-glow]");

      if (!base || !upper || !lower || !pen || !glow) return;

      if (reduced) {
        // Respect reduced-motion: show the settled logo, hide all mask
        // scaffolding. No timeline, no ScrollTrigger.
        gsap.set(base, { opacity: 1 });
        gsap.set([upper, lower, pen], { opacity: 0 });
        gsap.set(glow, { opacity: 0.14 });
        return;
      }

      // --- Geometry ------------------------------------------------------
      // Upper band covers the top `splitRatio` of the frame. Its clip
      // `inset(top right bottom left)` starts with right=100% (fully
      // hidden) and tweens to right=0% (fully revealed).
      const upperBottomPct = (1 - splitRatio) * 100;
      const lowerTopPct = splitRatio * 100;

      const upperClipFrom = `inset(0% 100% ${upperBottomPct}% 0%)`;
      const upperClipTo = `inset(0% 0% ${upperBottomPct}% 0%)`;
      const lowerClipFrom = `inset(${lowerTopPct}% 100% 0% 0%)`;
      const lowerClipTo = `inset(${lowerTopPct}% 0% 0% 0%)`;

      // --- Initial state -------------------------------------------------
      gsap.set(base, { opacity: 0 });
      gsap.set(upper, {
        opacity: 1,
        clipPath: upperClipFrom,
        WebkitClipPath: upperClipFrom,
      });
      gsap.set(lower, {
        opacity: 1,
        clipPath: lowerClipFrom,
        WebkitClipPath: lowerClipFrom,
      });
      gsap.set(pen, {
        opacity: 0,
        left: "0%",
        top: "0%",
        height: `${splitRatio * 100}%`,
      });
      gsap.set(glow, { opacity: 0 });

      // --- Timing --------------------------------------------------------
      const upperDur = duration * 0.41; // ~1.15 s of 2.8 s
      const lowerDur = duration * 0.41;
      const handoffOverlap = duration * 0.07; // ~0.2 s overlap feels "written"
      const lowerStart = upperDur - handoffOverlap;
      const settleStart = lowerStart + lowerDur;

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: root,
          start: startTrigger,
          once: true,
          invalidateOnRefresh: true,
        },
      });

      // Glow lights up as the pen touches down.
      tl.to(glow, { opacity: 1, duration: 0.28, ease: "power2.out" }, 0);
      tl.to(pen, { opacity: 1, duration: 0.22, ease: "power2.out" }, 0);

      // Upper band ("Magicks") — pen sweeps left → right.
      tl.to(
        upper,
        {
          clipPath: upperClipTo,
          WebkitClipPath: upperClipTo,
          duration: upperDur,
          ease: "power2.out",
        },
        0,
      ).to(pen, { left: "100%", duration: upperDur, ease: "power2.out" }, 0);

      // Pen reseats onto the lower band. Short opacity dip + snap-relocation
      // + fade back in, so the handoff reads as "lifting and replanting".
      tl.to(pen, { opacity: 0, duration: 0.12, ease: "power1.out" }, lowerStart - 0.12);
      tl.set(pen, {
        left: "0%",
        top: `${lowerTopPct}%`,
        height: `${(1 - splitRatio) * 100}%`,
      });
      tl.to(pen, { opacity: 1, duration: 0.16, ease: "power2.out" }, lowerStart);

      // Lower band ("Studio") — same sweep cadence.
      tl.to(
        lower,
        {
          clipPath: lowerClipTo,
          WebkitClipPath: lowerClipTo,
          duration: lowerDur,
          ease: "power2.out",
        },
        lowerStart,
      ).to(pen, { left: "100%", duration: lowerDur, ease: "power2.out" }, lowerStart);

      // Settle — pen fades out, crisp base fades in, masks retire, glow
      // decays from a subtle halo to an almost-imperceptible afterlight.
      tl.to(pen, { opacity: 0, duration: 0.3, ease: "power1.inOut" }, settleStart - 0.1);
      tl.to(base, { opacity: 1, duration: 0.42, ease: "power2.out" }, settleStart);
      tl.to(
        [upper, lower],
        { opacity: 0, duration: 0.42, ease: "power2.out" },
        settleStart,
      );
      tl.to(glow, { opacity: 0.16, duration: 0.55, ease: "power2.out" }, settleStart);
    }, root);

    return () => ctx.revert();
  }, [reduced, splitRatio, duration, startTrigger]);

  const bgStyle = {
    backgroundImage: `url(${ASSET_URL})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  } as const;

  return (
    <div
      ref={rootRef}
      className={`relative block ${className}`.trim()}
      style={{ aspectRatio: `${ASSET_W} / ${ASSET_H}` }}
      role="img"
      aria-label="MAGICKS Studio — Signatur"
    >
      {/* Ambient drop-shadow wrapper — kept on an inner element so outer
          envelopes on the host (e.g. About.tsx's presenceEnvelope) can
          safely tween opacity/filter without clobbering our halo. */}
      <div
        data-sig-glow
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{ filter: "drop-shadow(0 0 14px rgba(255,255,255,0.22))" }}
      >
        {/* Settled logo — revealed at the tail of the timeline. */}
        <div
          data-sig-base
          aria-hidden
          className="absolute inset-0 opacity-0"
          style={bgStyle}
        />

        {/* Upper band ("Magicks" region) — clip-path sweeps L→R. */}
        <div
          data-sig-layer="upper"
          aria-hidden
          className="absolute inset-0"
          style={bgStyle}
        />

        {/* Lower band ("Studio" region) — clip-path sweeps L→R after upper. */}
        <div
          data-sig-layer="lower"
          aria-hidden
          className="absolute inset-0"
          style={bgStyle}
        />

        {/* Ghost pen — thin stripe with soft trailing halo. Position is
            fully GSAP-driven (left / top / height / opacity). */}
        <span
          data-sig-pen
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 w-[2px]"
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
