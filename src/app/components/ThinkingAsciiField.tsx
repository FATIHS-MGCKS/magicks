import { motion, MotionValue, useInView, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { HERO_VIDEO_SRC } from "../heroMedia";

export function ThinkingAsciiField({
  className,
  scrollYProgress,
}: {
  className?: string;
  scrollYProgress: MotionValue<number>;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const laptopVideoRef = useRef<HTMLVideoElement>(null);
  const phoneVideoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(sceneRef, { amount: 0.35 });

  // Premium Horizontal Slide & Pan Animation (Apple-style)
  // Devices slide in from the right, pan around to face the user, and slide out to the left.
  
  // Laptop Animation
  const laptopX = useTransform(scrollYProgress, [0, 0.45, 1], [-400, 0, 0]);
  const laptopY = useTransform(scrollYProgress, [0, 0.45, 1], [100, 0, 0]);
  const laptopZ = useTransform(scrollYProgress, [0, 0.45, 1], [-300, 0, 0]);
  const laptopRotateX = useTransform(scrollYProgress, [0, 0.45, 1], [25, 5, 0]);
  const laptopRotateY = useTransform(scrollYProgress, [0, 0.45, 1], [50, 15, 0]);
  const laptopRotateZ = useTransform(scrollYProgress, [0, 0.45, 1], [10, 2, 0]);
  const laptopScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.2, 0.2625, 1.125]);

  // Phone Animation (More pronounced movement for parallax depth, positioned lower)
  const phoneX = useTransform(scrollYProgress, [0, 0.45, 1], [550, 0, 0]);
  const phoneY = useTransform(scrollYProgress, [0, 0.45, 1], [280, 180, 180]); // Moved down by ~120px
  const phoneZ = useTransform(scrollYProgress, [0, 0.45, 1], [200, 400, 400]);
  const phoneRotateX = useTransform(scrollYProgress, [0, 0.45, 1], [30, 8, 0]);
  const phoneRotateY = useTransform(scrollYProgress, [0, 0.45, 1], [-60, -25, 0]);
  const phoneRotateZ = useTransform(scrollYProgress, [0, 0.45, 1], [-15, -5, 0]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.15, 0.23, 1.0]);

  // Global Opacity (fade in at start, fade out at end)
  const globalOpacity = useTransform(scrollYProgress, [0, 0.15, 0.95, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const syncVideoPlayback = (video: HTMLVideoElement | null) => {
      if (!video) return;

      if (isInView) {
        const playPromise = video.play();
        if (playPromise) {
          void playPromise.catch(() => {});
        }
        return;
      }

      video.pause();
    };

    syncVideoPlayback(laptopVideoRef.current);
    syncVideoPlayback(phoneVideoRef.current);
  }, [isInView]);

  return (
    <div
      ref={sceneRef}
      className={`relative flex items-center justify-center overflow-hidden bg-[#050608] ${className}`}
      style={{ perspective: "1400px" }}
    >
      {/* Ambient Glow */}
      <motion.div
        className="absolute w-[150%] h-[150%] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_50%)]"
        style={{ opacity: globalOpacity }}
      />

      <motion.div 
        className="relative w-full h-full flex items-center justify-center" 
        style={{ 
          opacity: globalOpacity,
          transformStyle: "preserve-3d" 
        }}
      >
        
        {/* REALISTIC MACBOOK MOCKUP */}
        <motion.div
          className="absolute z-10 drop-shadow-[0_50px_80px_rgba(0,0,0,0.95)]"
          style={{
            x: laptopX,
            y: laptopY,
            z: laptopZ,
            scale: laptopScale,
            rotateX: laptopRotateX,
            rotateY: laptopRotateY,
            rotateZ: laptopRotateZ,
            marginLeft: "-15%", // Base position
            transformStyle: "preserve-3d",
            willChange: "transform"
          }}
        >
          {/* MacBook Screen */}
          <div className="relative w-[1440px] sm:w-[2000px] aspect-[16/10.5] bg-[#0a0a0a] rounded-t-[2.5rem] sm:rounded-t-[3.5rem] border-[16px] sm:border-[24px] border-[#1a1a1a] overflow-hidden flex flex-col shadow-[inset_0_0_0_4px_rgba(255,255,255,0.1)]">
            {/* Camera Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] sm:w-[240px] h-[40px] sm:h-[56px] bg-[#1a1a1a] rounded-b-[2rem] z-30 flex justify-center items-center">
              <div className="w-6 h-6 rounded-full bg-blue-900/50 flex justify-center items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
              </div>
            </div>
            
            {/* Screen Content (Simulated Hero Section) */}
            <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center">
              {/* Hero Video Background */}
              <video 
                ref={laptopVideoRef}
                src={HERO_VIDEO_SRC}
                autoPlay 
                loop 
                muted 
                playsInline 
                preload="metadata"
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-black/65" /> {/* Darker overlay for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
              
              {/* Header Menu Mockup */}
              <div className="absolute top-0 w-full h-40 sm:h-48 flex items-center px-16 sm:px-24 justify-between z-20">
                <img src="/magicks-logo.png" alt="Magicks" className="h-12 sm:h-16 object-contain opacity-90" />
                <div className="flex gap-12 sm:gap-16">
                  <div className="w-32 sm:w-40 h-4 sm:h-6 bg-white/60 rounded-full" />
                  <div className="w-32 sm:w-40 h-4 sm:h-6 bg-white/60 rounded-full" />
                  <div className="w-32 sm:w-40 h-4 sm:h-6 bg-white/60 rounded-full" />
                </div>
              </div>

              {/* Hero Content */}
              <div className="z-10 flex flex-col items-center mt-8 px-24 text-center">
                {/* Eyebrow */}
                <div className="px-12 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-12 sm:mb-16">
                  <span className="font-ui text-white/90 text-[32px] sm:text-[40px] tracking-[0.15em] uppercase font-semibold">Web Entwicklung mit</span>
                </div>
                
                {/* Title (Logo) */}
                <img src="/magicks-logo.png" alt="Magicks" className="h-32 sm:h-40 object-contain drop-shadow-[0_0_120px_rgba(255,255,255,0.6)] mb-12 sm:mb-16" />
                
                {/* Subtext */}
                <p className="font-ui text-white/90 text-[36px] sm:text-[44px] leading-relaxed max-w-[80%] mb-16 sm:mb-20 font-medium">
                  Digitale Markenauftritte. Lösungen. Fortschritt. Für Unternehmen, die moderner auftreten und besser performen wollen.
                </p>

                {/* CTA Buttons */}
                <div className="flex gap-8">
                  <div className="px-16 py-6 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-50 text-[32px] sm:text-[40px] font-semibold shadow-[0_0_60px_rgba(34,211,238,0.2)]">
                    Unverbindlich anfragen
                  </div>
                  <div className="px-16 py-6 rounded-full bg-white/5 border border-white/10 text-white/80 text-[32px] sm:text-[40px] font-semibold">
                    Leistungen
                  </div>
                </div>
              </div>
            </div>
            
            {/* Screen Glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] via-transparent to-transparent pointer-events-none z-30" />
          </div>
          
          {/* MacBook Base */}
          <div className="relative w-[1600px] sm:w-[2240px] h-[56px] sm:h-[80px] bg-gradient-to-b from-[#b0b0b0] to-[#808080] rounded-b-[2.5rem] sm:rounded-b-[3.5rem] -ml-[80px] sm:-ml-[120px] flex justify-center shadow-[0_100px_200px_rgba(0,0,0,0.8)] border-t border-white/20">
            {/* Trackpad Notch */}
            <div className="w-[240px] sm:w-[320px] h-[20px] sm:h-[28px] bg-[#606060] rounded-b-[1rem] shadow-[inset_0_4px_8px_rgba(0,0,0,0.5)]" />
          </div>
        </motion.div>

        {/* REALISTIC iPHONE MOCKUP */}
        <motion.div
          className="absolute z-20 drop-shadow-[0_60px_100px_rgba(0,0,0,0.95)]"
          style={{
            x: phoneX,
            y: phoneY,
            z: phoneZ,
            scale: phoneScale,
            rotateX: phoneRotateX,
            rotateY: phoneRotateY,
            rotateZ: phoneRotateZ,
            marginLeft: "35%", // Base position
            marginTop: "15%", // Base position
            transformStyle: "preserve-3d",
            willChange: "transform"
          }}
        >
          {/* Phone Body */}
          <div className="relative w-[520px] sm:w-[680px] aspect-[9/19.5] bg-[#0a0a0a] rounded-[8rem] sm:rounded-[10rem] border-[24px] sm:border-[32px] border-[#2a2a2a] overflow-hidden shadow-[inset_0_0_0_4px_rgba(255,255,255,0.2),0_0_0_4px_rgba(0,0,0,1)]">
            
            {/* Dynamic Island */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[35%] h-[48px] sm:h-[64px] bg-black rounded-full z-30 flex justify-end items-center px-6 shadow-[inset_0_0_8px_rgba(255,255,255,0.1)]">
               <div className="w-6 h-6 rounded-full bg-blue-900/40 flex justify-center items-center">
                 <div className="w-2 h-2 rounded-full bg-blue-400" />
               </div>
            </div>
            
            {/* Screen Content (Simulated Hero Section Mobile) */}
            <div className="absolute inset-0 overflow-hidden flex flex-col items-center justify-center">
              {/* Hero Video Background */}
              <video 
                ref={phoneVideoRef}
                src={HERO_VIDEO_SRC}
                autoPlay 
                loop 
                muted 
                playsInline 
                preload="metadata"
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-black/65" /> {/* Darker overlay for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
              
              {/* Header Menu Mockup (Mobile) */}
              <div className="absolute top-0 w-full h-48 sm:h-64 flex items-end px-12 sm:px-16 pb-8 sm:pb-12 justify-between z-20">
                <img src="/magicks-logo.png" alt="Magicks" className="h-10 sm:h-12 object-contain opacity-90" />
                {/* Hamburger Menu Icon */}
                <div className="w-12 sm:w-16 h-8 sm:h-10 flex flex-col justify-between">
                  <div className="w-full h-[4px] sm:h-[6px] bg-white/80 rounded-full" />
                  <div className="w-full h-[4px] sm:h-[6px] bg-white/80 rounded-full" />
                  <div className="w-full h-[4px] sm:h-[6px] bg-white/80 rounded-full" />
                </div>
              </div>

              {/* Hero Content Mobile */}
              <div className="z-10 flex flex-col items-center mt-24 px-12 text-center">
                {/* Eyebrow */}
                <div className="px-8 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-10 sm:mb-12">
                  <span className="font-ui text-white/90 text-[24px] sm:text-[32px] tracking-[0.15em] uppercase font-semibold">App Entwicklung mit</span>
                </div>
                
                {/* Title (Logo) */}
                <img src="/magicks-logo.png" alt="Magicks" className="h-20 sm:h-24 object-contain drop-shadow-[0_0_100px_rgba(255,255,255,0.6)] mb-10 sm:mb-12" />
                
                {/* Subtext */}
                <p className="font-ui text-white/90 text-[28px] sm:text-[36px] leading-relaxed max-w-[90%] mb-12 sm:mb-16 font-medium">
                  Digitale Markenauftritte. Lösungen. Fortschritt.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-6 w-[80%]">
                  <div className="w-full py-6 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-50 text-[28px] sm:text-[36px] font-semibold shadow-[0_0_60px_rgba(34,211,238,0.2)]">
                    Unverbindlich anfragen
                  </div>
                  <div className="w-full py-6 rounded-full bg-white/5 border border-white/10 text-white/80 text-[28px] sm:text-[36px] font-semibold">
                    Leistungen
                  </div>
                </div>
              </div>
            </div>
            
            {/* Glass Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/12 via-transparent to-transparent pointer-events-none z-30" />
            
            {/* Side Buttons (Volume/Power) */}
            <div className="absolute top-[20%] -left-[24px] sm:-left-[32px] w-[8px] sm:w-[12px] h-[15%] bg-[#4a4a4a] rounded-l-md" />
            <div className="absolute top-[40%] -left-[24px] sm:-left-[32px] w-[8px] sm:w-[12px] h-[15%] bg-[#4a4a4a] rounded-l-md" />
            <div className="absolute top-[30%] -right-[24px] sm:-right-[32px] w-[8px] sm:w-[12px] h-[20%] bg-[#4a4a4a] rounded-r-md" />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
