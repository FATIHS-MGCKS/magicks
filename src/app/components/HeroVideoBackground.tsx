import {
  HERO_IMAGE_SRC_DESKTOP,
  HERO_IMAGE_SRC_DESKTOP_FALLBACK,
  HERO_IMAGE_SRC_MOBILE,
  HERO_IMAGE_SRC_MOBILE_FALLBACK,
} from "../heroMedia";

/**
 * Responsive Hero-Bild mit mobile/desktop Quellen.
 * Die Licht-/Vignetten-Layer bleiben weiterhin im Hero-Component selbst,
 * damit die Choreografie konsistent bleibt.
 *
 * Hinweis: Der Komponentenname bleibt aus Kompatibilitätsgründen gleich.
 */
export function HeroVideoBackground() {
  return (
    <picture className="absolute inset-0 block h-full w-full" aria-hidden>
      <source media="(max-width: 767px)" srcSet={HERO_IMAGE_SRC_MOBILE} type="image/webp" />
      <source media="(max-width: 767px)" srcSet={HERO_IMAGE_SRC_MOBILE_FALLBACK} type="image/png" />
      <source media="(min-width: 768px)" srcSet={HERO_IMAGE_SRC_DESKTOP} type="image/webp" />
      <img
        src={HERO_IMAGE_SRC_DESKTOP_FALLBACK}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        decoding="async"
      />
    </picture>
  );
}
