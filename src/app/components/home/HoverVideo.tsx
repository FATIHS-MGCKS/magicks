import { useEffect, useRef, useState } from "react";

/**
 * Lightweight hover-to-play video surface for the Services bento.
 * - On fine-pointer devices: plays on hover, pauses on leave (debounced).
 * - On touch: plays when the card is mostly in view, pauses otherwise.
 * - Metadata-only preload and pause-off-screen keep the homepage quiet until needed.
 */
export function HoverVideo({
  src,
  active,
  className = "",
}: {
  src: string;
  active: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (active) {
      const p = v.play();
      if (p) void p.catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  return (
    <div className={`relative overflow-hidden ${className}`.trim()}>
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setReady(true)}
        aria-hidden
      >
        <source src={src} type="video/mp4" />
      </video>

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_120%,rgba(10,10,10,0.72),transparent_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-transparent to-[#0A0A0A]/30"
        aria-hidden
      />
    </div>
  );
}
