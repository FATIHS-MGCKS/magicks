import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

/* ------------------------------------------------------------------
 * EditorialAnchor — a single compositional image-anchor for the
 * service pages.
 *
 * The service pages are intentionally type-heavy (specimen grids,
 * variant matrices, SystemSchema, FlowMesh). We do not want to
 * compete with those systems — we want to place a small number
 * of deliberate photographic *breath-points* between sections.
 *
 * This component mirrors the treatment used on the home About
 * visual (paper-lift shadow, top-left folio marker, split caption,
 * tonal unification filter) so the pages feel part of the same
 * editorial family without repeating the exact same composition.
 *
 * Refinement pass 2 additions:
 *  - one-shot rack-focus entry (opacity + blur-clear) when the
 *    figure enters the viewport, echoing the home Services stack
 *    without repeating the Ken-Burns loop
 *  - three-layer paper-lift shadow (close press + mid-field lift
 *    + deep atmospheric cavity) for a more "lifted off the page"
 *    sensation
 *  - slightly brighter inner highlight + stroke for an editorial
 *    paper-edge catch
 *  - default tonal grade aligned with the home Services stack
 *    (adds a barely-perceptible brightness 0.98) so all media on
 *    the site reads as one coherent series
 *  - respects prefers-reduced-motion (no entry motion, no blur)
 *
 * It accepts an optional `revealAttr` so each page's existing
 * GSAP reveal system picks up the figure without any changes to
 * the page's ScrollTrigger setup.
 * ------------------------------------------------------------------ */

export type EditorialAnchorAlign = "left" | "right" | "center";

type Props = {
  src: string;
  alt: string;
  /** Small editorial folio marker inside the frame, top-left.
   *  Optional — when omitted, no in-frame label is rendered, allowing
   *  the figure to be wrapped in a page-specific caption chrome
   *  (bureau dateline rail, focal-axis split caption, tipped-in
   *  plate colophon, etc.). */
  folio?: string;
  /** One-word context next to the folio (e.g. "Web-Entwurf").
   *  Rendered only when `folio` is also set. */
  context?: string;
  /** Lower-left caption label. Optional — when omitted the figcaption
   *  block is not rendered at all. */
  leftCaption?: string;
  /** Optional right-side caption (format, dimension, location).
   *  Rendered only when `leftCaption` is set. */
  rightCaption?: string;
  /** Tailwind-compatible CSS aspect shorthand, e.g. "16/10". */
  aspect?: string;
  /** Block alignment inside its section. */
  align?: EditorialAnchorAlign;
  /** Max width cap of the figure — keeps anchors never full-bleed. */
  maxWidth?: string;
  /** Attribute name the consumer's page reveal system hooks into. */
  revealAttr?: string;
  /** Optional extra classes on the outer figure. */
  className?: string;
  /** Image loading strategy. Default: "lazy". */
  loading?: "lazy" | "eager";
  /** Tone-unification filter override. */
  filter?: string;
  /** Slightly overrides the overlay mix — keep defaults unless needed. */
  overlayClass?: string;
};

const ALIGN_CLASS: Record<EditorialAnchorAlign, string> = {
  left: "mr-auto",
  right: "ml-auto",
  center: "mx-auto",
};

/**
 * Paper-lift shadow, refined pass 2.
 *  - L1: tight 1px/2px shadow below → photograph pressed onto the page
 *  - L2: mid-field 6px/14px lift → proper floating presence
 *  - L3: deep 56px/140px atmospheric cavity → room around the frame
 *  - L4: inner 1px white top highlight → paper-edge catch-light
 */
const PAPER_LIFT_SHADOW =
  "shadow-[0_1px_2px_0_rgba(0,0,0,0.42),0_6px_14px_-2px_rgba(0,0,0,0.62),0_56px_140px_-64px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)]";

export function EditorialAnchor({
  src,
  alt,
  folio,
  context,
  leftCaption,
  rightCaption,
  aspect = "16/10",
  align = "right",
  maxWidth = "42rem",
  revealAttr,
  className = "",
  loading = "lazy",
  filter = "saturate(0.95) contrast(1.03) brightness(0.98)",
  overlayClass = "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/55 via-transparent to-[#0A0A0A]/10",
}: Props) {
  const revealProps = revealAttr ? { [revealAttr]: "" } : {};
  const figureStyle: CSSProperties = { maxWidth };
  const frameStyle: CSSProperties = { aspectRatio: aspect.replace("/", " / ") };

  /* ----------------------------------------------------------------
   * One-shot rack-focus entry.
   *
   * Initial state: slightly transparent + a gentle blur.
   * On first viewport intersection the image settles into crisp
   * clarity over ~1.1s with a cinematic easing curve.
   *
   * This gives otherwise-static editorial photographs a subtle
   * "breathing" moment of arrival, consistent with the home
   * Services reveal, but without any looping motion afterwards.
   *
   * Respects prefers-reduced-motion: users with the setting get
   * the settled state from the first paint, no motion at all.
   * ---------------------------------------------------------------- */
  const frameRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (isInView) return;
    const el = frameRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "-4% 0px -4% 0px", threshold: 0.18 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isInView]);

  const motionBlur = isInView ? "" : " blur(3.5px)";
  const imageStyle: CSSProperties = {
    filter: `${filter}${motionBlur}`,
    opacity: isInView ? 1 : 0.32,
    transition:
      "opacity 1100ms cubic-bezier(0.22, 1, 0.36, 1), filter 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
    willChange: isInView ? "auto" : "opacity, filter",
  };

  return (
    <figure
      {...revealProps}
      className={`relative w-full ${ALIGN_CLASS[align]} ${className}`.trim()}
      style={figureStyle}
    >
      <div
        ref={frameRef}
        className={`relative w-full overflow-hidden rounded-[0.95rem] border border-white/[0.1] bg-[#0A0A0A] ${PAPER_LIFT_SHADOW}`}
        style={frameStyle}
      >
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={imageStyle}
        />
        <div aria-hidden className={overlayClass} />

        {/* Folio marker — like an archival contact sheet caption.
            Each page uses a family-specific abbreviation (FIG./PLATE/
            MOD./HOP) so the anchors tie into that page's own
            editorial vocabulary instead of a generic "figure" label.
            Rendered only when the consumer opts in via `folio`; pages
            with their own caption chrome (bureau rails, focal-axis
            split caption) omit this to avoid competing metadata. */}
        {folio ? (
          <div
            aria-hidden
            className="font-mono pointer-events-none absolute left-4 top-4 flex items-center gap-2 text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/58 sm:left-5 sm:top-5"
          >
            <span>{folio}</span>
            {context ? (
              <>
                <span aria-hidden className="h-px w-5 bg-white/28" />
                <span>{context}</span>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      {leftCaption ? (
        <figcaption className="font-mono mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[10px] font-medium uppercase leading-none tracking-[0.32em] text-white/42">
          <span className="flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-white/26" />
            <span>{leftCaption}</span>
          </span>
          {rightCaption ? <span className="text-white/34">{rightCaption}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
