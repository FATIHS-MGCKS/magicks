import { useEffect, useRef } from "react";
import { HERO_VIDEO_SRC } from "../heroMedia";

/**
 * Stillschweifendes Loop-Video für den Hero (Vollfläche, unter dem Text).
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
    <>
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
      {/* Lesbarkeit + Anbindung an #0A0A0A */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/35 to-[#0A0A0A]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_25%,rgba(59,130,246,0.06),transparent_55%)]"
        aria-hidden
      />
    </>
  );
}
