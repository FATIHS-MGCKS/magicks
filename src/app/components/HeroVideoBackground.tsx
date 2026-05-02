import { useEffect, useLayoutEffect, useRef } from "react";
import { HERO_VIDEO_SRC } from "../heroMedia";

/**
 * Reines Loop-Video für den Hero. Alle Farbtiefe / Vignetten / Fall-offs
 * werden vom Hero-Component selbst orchestriert, damit sie Teil der
 * Intro-Choreografie sein können und nicht als statische Layer kleben.
 */
export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // React sets `muted` as a property after mount. Setting the attribute
  // before paint keeps browser autoplay handling consistent.
  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.setAttribute("muted", "");
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Kick off playback immediately on mount.
    const tryPlay = () => {
      const p = video.play();
      if (p) void p.catch(() => {});
    };
    tryPlay();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryPlay();
          return;
        }
        video.pause();
      },
      { threshold: 0.15 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover object-center"
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      aria-hidden
    >
      <source src={HERO_VIDEO_SRC} type="video/mp4" />
    </video>
  );
}
