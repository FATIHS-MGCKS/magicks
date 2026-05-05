export type HeroBackgroundMode = "core" | "image";

/**
 * `"core"` = Digital-Core-Szene (SVG/CSS) · `"image"` = Vollbild-Bild im Hintergrund
 */
export const HERO_BACKGROUND: HeroBackgroundMode = "image";

/**
 * Hero-Bildquellen (nur wenn `HERO_BACKGROUND === "image"`).
 *
 * Beispiele:
 * - **Lokal:** z. B. `public/hero-desktop.webp` → `"/hero-desktop.webp"`
 * - **CDN:** `https://…/dein-bild.webp`
 */
export const HERO_IMAGE_SRC_DESKTOP = "/media/home/hero-desktop.webp";
export const HERO_IMAGE_SRC_MOBILE = "/media/home/hero-mobile.webp";

/**
 * PNG-Fallbacks für ältere Browser ohne WebP-Support.
 */
export const HERO_IMAGE_SRC_DESKTOP_FALLBACK = "/media/home/hero-desktop.PNG";
export const HERO_IMAGE_SRC_MOBILE_FALLBACK = "/media/home/hero-mobile.PNG";
