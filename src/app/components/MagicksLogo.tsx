type MagicksLogoProps = {
  /** Tailwind height class, e.g. h-7, h-8, h-10 */
  className?: string;
};

/**
 * Offizielles MAGICKS-Wordmark (PNG mit Transparenz).
 */
export function MagicksLogo({ className = "h-8" }: MagicksLogoProps) {
  return (
    <img
      src="/magicks-logo.png"
      alt="MAGICKS"
      className={`w-auto shrink-0 object-contain object-left ${className}`}
      decoding="async"
    />
  );
}
