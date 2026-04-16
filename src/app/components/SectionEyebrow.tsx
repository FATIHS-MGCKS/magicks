import type { ReactNode } from "react";

/**
 * Shared liquid-glass capsule for section / editorial labels.
 * Typography is fixed in CSS — keep copy concise.
 */
export function SectionEyebrow({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  /** `compact` = slightly tighter padding (form hints, inline sublabels) */
  variant?: "default" | "compact";
  className?: string;
}) {
  const v = variant === "compact" ? "section-eyebrow section-eyebrow--compact" : "section-eyebrow";
  return <span className={`${v} ${className}`.trim()}>{children}</span>;
}
