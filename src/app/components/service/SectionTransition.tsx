/**
 * Directional chapter transition sliver — sits between sections of a landing page.
 *
 * Replaces the generic `.section-top-rule` with an editorial pointer:
 * `—————  ↘ § 02  Substanz  ·  Zielbild  —————`
 *
 * It threads the document forward without adding visual noise and without
 * duplicating any ChapterMarker that already lives inside the next section.
 *
 * Kept static (no motion) on purpose — this is signage, not choreography.
 */
export function SectionTransition({
  from,
  to,
  tone = "dark",
}: {
  /** Short label for the section being left — e.g. `§ 01  Substanz`. */
  from: string;
  /** Short label for the section being entered — e.g. `§ 02  Zielbild`. */
  to: string;
  /** `darker` uses the deeper background (for sections sitting on `#070708`). */
  tone?: "dark" | "darker";
}) {
  const bg = tone === "darker" ? "bg-[#070708]" : "bg-[#0A0A0A]";

  return (
    <div
      aria-hidden
      className={`relative ${bg} px-5 py-7 sm:px-8 sm:py-12 md:px-12 md:py-14 lg:px-16`}
    >
      <div className="layout-max">
        <div className="flex items-center gap-3 sm:gap-7">
          <span aria-hidden className="h-px w-8 bg-white/22 sm:w-16" />

          {/* Mobile: compact forward signage only. Desktop: full from→to register. */}
          <span className="hidden sm:inline font-mono whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.42em] text-white/38 md:text-[10px]">
            {from}
          </span>

          <span
            aria-hidden
            className="font-mono flex-shrink-0 text-[10px] font-medium leading-none tracking-[0.3em] text-white/48 sm:text-[9.5px] sm:text-white/38 md:text-[10px]"
          >
            ↘
          </span>

          <span className="font-mono whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.22em] text-white/64 sm:tracking-[0.42em] sm:text-white/58 md:text-[10px]">
            {to}
          </span>

          <span aria-hidden className="h-px flex-1 bg-white/12" />
        </div>
      </div>
    </div>
  );
}
