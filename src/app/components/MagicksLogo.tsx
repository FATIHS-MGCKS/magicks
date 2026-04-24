type MagicksLogoProps = {
  /** Tailwind height class, e.g. h-7, h-8, h-10 */
  className?: string;
};

/**
 * Offizielles MAGICKS-Wordmark (WebP mit Transparenz).
 * Intrinsic width/height hints prevent CLS when the bitmap arrives
 * after initial layout. Ratio ≈ 977 × 354 = 2.76 : 1.
 */
export function MagicksLogo({ className = "h-8" }: MagicksLogoProps) {
  // Use the lowercase HTML attribute name to silence React's
  // "unknown DOM attribute" warning on react-dom 18.3 builds where the
  // camelCase `fetchPriority` prop is not yet whitelisted at runtime.
  // We spread it via an extra props object so the JSX type stays clean.
  const extraImgAttrs: { fetchpriority?: "high" | "low" | "auto" } = {
    fetchpriority: "high",
  };

  return (
    <img
      src="/magicks-logo.webp"
      alt="MAGICKS"
      width={977}
      height={354}
      className={`w-auto shrink-0 object-contain object-left ${className}`}
      decoding="async"
      {...extraImgAttrs}
    />
  );
}
