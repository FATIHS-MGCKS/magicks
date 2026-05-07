import { useCallback, useEffect, useRef, useState } from "react";
import {
  HERO_IMAGE_SRC_DESKTOP_FALLBACK,
  HERO_VIDEO_POSTER,
  HERO_VIDEO_SRC,
} from "../heroMedia";

/**
 * Autoplaying Hero-Video mit Bild-Poster als ruhiger Fallback.
 * Die Licht-/Vignetten-Layer bleiben weiterhin im Hero-Component selbst,
 * damit die Choreografie konsistent bleibt.
 */
export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoHasFrame, setVideoHasFrame] = useState(false);

  const configureMobileAutoplay = useCallback((video: HTMLVideoElement) => {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
  }, []);

  const playVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    configureMobileAutoplay(video);

    const playPromise = video.play();
    if (playPromise) {
      playPromise.then(() => setVideoHasFrame(true)).catch(() => {
        // Keep the poster fallback if the browser blocks autoplay.
      });
    }
  }, [configureMobileAutoplay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Mobile browsers are stricter about autoplay unless these are set as
    // DOM properties before play() is requested.
    configureMobileAutoplay(video);
    if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) video.load();

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) setVideoHasFrame(true);
    playVideo();

    const resumeOnInteraction = () => playVideo();
    const resumeWhenVisible = () => {
      if (document.visibilityState === "visible") playVideo();
    };
    document.addEventListener("visibilitychange", resumeWhenVisible);
    window.addEventListener("pageshow", resumeOnInteraction);
    window.addEventListener("pointerdown", resumeOnInteraction, { once: true, passive: true });
    window.addEventListener("touchstart", resumeOnInteraction, { once: true, passive: true });

    return () => {
      document.removeEventListener("visibilitychange", resumeWhenVisible);
      window.removeEventListener("pageshow", resumeOnInteraction);
      window.removeEventListener("pointerdown", resumeOnInteraction);
      window.removeEventListener("touchstart", resumeOnInteraction);
    };
  }, [configureMobileAutoplay, playVideo]);

  return (
    <div
      className="absolute inset-0 block h-full w-full overflow-hidden bg-[var(--magicks-bg-base)]"
      aria-hidden
    >
      <img
        src={HERO_VIDEO_POSTER}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover object-[62%_46%] md:object-[66%_48%] lg:object-[62%_50%] xl:object-[60%_50%] transition-opacity duration-500 ${
          videoHasFrame ? "opacity-0" : "opacity-100"
        }`}
        width={1920}
        height={1080}
        decoding="async"
      />
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-[62%_46%] md:object-[66%_48%] lg:object-[62%_50%] xl:object-[60%_50%]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        tabIndex={-1}
        disablePictureInPicture
        disableRemotePlayback
        onCanPlay={playVideo}
        onLoadedData={() => {
          setVideoHasFrame(true);
          playVideo();
        }}
        onPlaying={() => setVideoHasFrame(true)}
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>
      <noscript>
        <img
          src={HERO_IMAGE_SRC_DESKTOP_FALLBACK}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[62%_46%] md:object-[66%_48%] lg:object-[62%_50%] xl:object-[60%_50%]"
          width={1920}
          height={1080}
        />
      </noscript>
    </div>
  );
}
