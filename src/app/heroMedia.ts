export type HeroBackgroundMode = "core" | "image" | "video";

/**
 * `"core"` = Digital-Core-Szene (SVG/CSS) · `"image"` = Vollbild-Bild · `"video"` = Vollbild-Video
 */
export const HERO_BACKGROUND: HeroBackgroundMode = "video";

/**
 * Hero-Videoquelle.
 */
export const HERO_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260422_191657_800d4e1f-7ab3-41af-90b6-9bd3039eb294.mp4";

/**
 * Hero-Bildquellen (nur wenn `HERO_BACKGROUND === "image"`).
 *
 * Beispiele:
 * - **Lokal:** z. B. `public/hero-desktop.webp` → `"/hero-desktop.webp"`
 * - **CDN:** `https://…/dein-bild.webp`
 */
export const HERO_IMAGE_SRC_DESKTOP = "/media/home/hero-desktop.webp";
export const HERO_IMAGE_SRC_MOBILE = "/media/home/hero-mobile.webp";
export const HERO_VIDEO_POSTER = HERO_IMAGE_SRC_DESKTOP;

/**
 * PNG-Fallbacks für ältere Browser ohne WebP-Support.
 */
export const HERO_IMAGE_SRC_DESKTOP_FALLBACK = "/media/home/hero-desktop.PNG";
export const HERO_IMAGE_SRC_MOBILE_FALLBACK = "/media/home/hero-mobile.PNG";
