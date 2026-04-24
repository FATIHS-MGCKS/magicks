type ChapterMarkerProps = {
  num: string;
  label: string;
  align?: "left" | "center" | "right";
  variant?: "default" | "end";
  className?: string;
};

/**
 * Editorial chapter folio — thin monospace tag prefixed by a hairline.
 * Used to thread sections into a single magazine-like document.
 */
export function ChapterMarker({
  num,
  label,
  align = "left",
  variant = "default",
  className = "",
}: ChapterMarkerProps) {
  const alignClass =
    align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start";

  const prefix = variant === "end" ? "§ END" : `§ ${num}`;

  return (
    <div className={`flex items-center ${alignClass} ${className}`.trim()}>
      <span
        aria-hidden
        className="mr-[0.75em] inline-block h-px w-[28px] bg-gradient-to-r from-white/0 via-white/35 to-white/35 sm:mr-[0.9em] sm:w-[56px]"
      />
      <span className="font-mono text-[11.5px] font-medium uppercase leading-none tracking-[0.18em] text-white/55 sm:tracking-[0.34em] sm:text-[10.5px] sm:text-white/46">
        {prefix} — {label}
      </span>
      {variant === "end" ? (
        <span
          aria-hidden
          className="ml-[0.75em] inline-block h-px w-[28px] bg-gradient-to-l from-white/0 via-white/35 to-white/35 sm:ml-[0.9em] sm:w-[56px]"
        />
      ) : null}
    </div>
  );
}
