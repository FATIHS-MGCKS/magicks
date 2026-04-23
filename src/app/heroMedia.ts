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
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4";
