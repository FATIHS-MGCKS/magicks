import { useEffect, useLayoutEffect, useRef } from "react";
import { HERO_VIDEO_SRC } from "../heroMedia";

/**
 * Reines Loop-Video für den Hero. Alle Farbtiefe / Vignetten / Fall-offs
 * werden vom Hero-Component selbst orchestriert, damit sie Teil der
 * Intro-Choreografie sein können und nicht als statische Layer kleben.
 */
export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // React intentionally does NOT render `<video muted>` as an HTML
  // attribute (it sets the property post-mount). Chrome's autoplay
  // policy is parsed from the *attribute* though — without it on
  // initial markup, the `autoplay` attribute is silently rejected
  // when the element is inside an iframe (laptop-screen preview on
  // /services). Forcing the attribute before paint restores autoplay.
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

    // When this hero is rendered inside an iframe (the laptop-screen
    // preview on /services), IntersectionObserver against the iframe's
    // own viewport returns `isIntersecting: false` because the parent's
    // matrix3d transform makes Chrome treat the iframe as off-screen
    // — even though the user can clearly see it. The IO would then
    // call `video.pause()` immediately, fighting against the parent's
    // attempts to start the video. The parent owns play/pause for the
    // iframe instance, so we skip the IO entirely there.
    const inIframe = typeof window !== "undefined" && window.self !== window.top;
    if (inIframe) {
      return () => {
        video.pause();
      };
    }

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
