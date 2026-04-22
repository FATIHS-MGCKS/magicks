import { useEffect, useRef } from "react";
import { HERO_VIDEO_SRC } from "../heroMedia";

/**
 * Reines Loop-Video für den Hero. Alle Farbtiefe / Vignetten / Fall-offs
 * werden vom Hero-Component selbst orchestriert, damit sie Teil der
 * Intro-Choreografie sein können und nicht als statische Layer kleben.
 */
export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const playPromise = video.play();
          if (playPromise) {
            void playPromise.catch(() => {});
          }
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
