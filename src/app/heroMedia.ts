export type HeroBackgroundMode = "core" | "video";

/**
 * `"core"` = Digital-Core-Szene (SVG/CSS) · `"video"` = Vollbild-Video im Hintergrund
 */
export const HERO_BACKGROUND: HeroBackgroundMode = "video";

/**
 * Video-Quelle (nur wenn `HERO_BACKGROUND === "video"`).
 *
 * Beispiele:
 * - **Lokal:** z. B. `public/hero-video.mp4` → `"/hero-video.mp4"`
 * - **CDN:** `https://…/dein-video.mp4`
 */
export const HERO_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_074215_04640ca7-042c-45d6-bb56-58b1e8a42489.mp4";
