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
  const laptopX = useTransform(scrollYProgress, [0, 0.5, 1], [400, 0, -400]);
  const laptopY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
  const laptopZ = useTransform(scrollYProgress, [0, 0.5, 1], [-300, 0, -300]);
  const laptopRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [25, 5, 25]);
  const laptopRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-50, -15, 20]);
  const laptopRotateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-10, -2, 5]);
  const laptopScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.05, 0.8]);

  // Phone Animation (More pronounced movement for parallax depth, positioned lower)
  const phoneX = useTransform(scrollYProgress, [0, 0.5, 1], [550, 0, -550]);
  const phoneY = useTransform(scrollYProgress, [0, 0.5, 1], [280, 180, 80]); // Moved down by ~120px
  const phoneZ = useTransform(scrollYProgress, [0, 0.5, 1], [-150, 150, -150]);
  const phoneRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [30, 8, 30]);
  const phoneRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-60, -25, 25]);
  const phoneRotateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-15, -5, 10]);
  const phoneScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.15, 0.8]);

  // Global Opacity (fade in at start, fade out at end)
  const globalOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

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
          <div className="relative w-[360px] sm:w-[500px] aspect-[16/10.5] bg-[#0a0a0a] rounded-t-xl sm:rounded-t-2xl border-[4px] sm:border-[6px] border-[#1a1a1a] overflow-hidden flex flex-col shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
            {/* Camera Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40px] sm:w-[60px] h-[10px] sm:h-[14px] bg-[#1a1a1a] rounded-b-lg z-30 flex justify-center items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-900/50 flex justify-center items-center">
                <div className="w-0.5 h-0.5 rounded-full bg-blue-400" />
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
              <div className="absolute inset-0 bg-black/50" /> {/* Darker overlay for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
              
              {/* Header Menu Mockup */}
              <div className="absolute top-0 w-full h-10 sm:h-12 flex items-center px-4 sm:px-6 justify-between z-20">
                <img src="/magicks-logo.png" alt="Magicks" className="h-3 sm:h-4 object-contain opacity-90" />
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 sm:w-10 h-1 sm:h-1.5 bg-white/60 rounded-full" />
                  <div className="w-8 sm:w-10 h-1 sm:h-1.5 bg-white/60 rounded-full" />
                  <div className="w-8 sm:w-10 h-1 sm:h-1.5 bg-white/60 rounded-full" />
                </div>
              </div>

              {/* Hero Content */}
              <div className="z-10 flex flex-col items-center mt-2 px-6 text-center">
                {/* Eyebrow */}
                <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-3 sm:mb-4">
                  <span className="font-ui text-white/90 text-[8px] sm:text-[10px] tracking-[0.15em] uppercase font-semibold">Web Entwicklung mit</span>
                </div>
                
                {/* Title (Logo) */}
                <img src="/magicks-logo.png" alt="Magicks" className="h-6 sm:h-8 object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] mb-3 sm:mb-4" />
                
                {/* Subtext */}
                <p className="font-ui text-white/60 text-[8px] sm:text-[10px] leading-relaxed max-w-[80%] mb-4 sm:mb-5">
                  Digitale Markenauftritte. Lösungen. Fortschritt. Für Unternehmen, die moderner auftreten und besser performen wollen.
                </p>

                {/* CTA Buttons */}
                <div className="flex gap-2">
                  <div className="px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-50 text-[8px] sm:text-[10px] font-semibold shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    Unverbindlich anfragen
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-[8px] sm:text-[10px] font-semibold">
                    Leistungen
                  </div>
                </div>
              </div>
            </div>
            
            {/* Screen Glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] via-transparent to-transparent pointer-events-none z-30" />
          </div>
          
          {/* MacBook Base */}
          <div className="relative w-[400px] sm:w-[560px] h-[14px] sm:h-[20px] bg-gradient-to-b from-[#b0b0b0] to-[#808080] rounded-b-xl sm:rounded-b-2xl -ml-[20px] sm:-ml-[30px] flex justify-center shadow-[0_25px_50px_rgba(0,0,0,0.8)] border-t border-white/20">
            {/* Trackpad Notch */}
            <div className="w-[60px] sm:w-[80px] h-[5px] sm:h-[7px] bg-[#606060] rounded-b-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" />
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
          <div className="relative w-[130px] sm:w-[170px] aspect-[9/19.5] bg-[#0a0a0a] rounded-[2rem] sm:rounded-[2.5rem] border-[6px] sm:border-[8px] border-[#2a2a2a] overflow-hidden shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2),0_0_0_1px_rgba(0,0,0,1)]">
            
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[35%] h-[12px] sm:h-[16px] bg-black rounded-full z-30 flex justify-end items-center px-1.5 shadow-[inset_0_0_2px_rgba(255,255,255,0.1)]">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-900/40 flex justify-center items-center">
                 <div className="w-0.5 h-0.5 rounded-full bg-blue-400" />
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
              <div className="absolute inset-0 bg-black/50" /> {/* Darker overlay for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
              
              {/* Header Menu Mockup (Mobile) */}
              <div className="absolute top-0 w-full h-12 sm:h-16 flex items-end px-3 sm:px-4 pb-2 sm:pb-3 justify-between z-20">
                <img src="/magicks-logo.png" alt="Magicks" className="h-2.5 sm:h-3 object-contain opacity-90" />
                {/* Hamburger Menu Icon */}
                <div className="w-3 sm:w-4 h-2 sm:h-2.5 flex flex-col justify-between">
                  <div className="w-full h-[1px] sm:h-[1.5px] bg-white/80 rounded-full" />
                  <div className="w-full h-[1px] sm:h-[1.5px] bg-white/80 rounded-full" />
                  <div className="w-full h-[1px] sm:h-[1.5px] bg-white/80 rounded-full" />
                </div>
              </div>

              {/* Hero Content Mobile */}
              <div className="z-10 flex flex-col items-center mt-6 px-3 text-center">
                {/* Eyebrow */}
                <div className="px-2 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-2.5 sm:mb-3">
                  <span className="font-ui text-white/90 text-[6px] sm:text-[8px] tracking-[0.15em] uppercase font-semibold">App Entwicklung mit</span>
                </div>
                
                {/* Title (Logo) */}
                <img src="/magicks-logo.png" alt="Magicks" className="h-4 sm:h-5 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] mb-2.5 sm:mb-3" />
                
                {/* Subtext */}
                <p className="font-ui text-white/60 text-[6px] sm:text-[8px] leading-relaxed max-w-[90%] mb-3 sm:mb-4">
                  Digitale Markenauftritte. Lösungen. Fortschritt.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-1.5 w-[80%]">
                  <div className="w-full py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-50 text-[7px] sm:text-[9px] font-semibold shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    Unverbindlich anfragen
                  </div>
                  <div className="w-full py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-[7px] sm:text-[9px] font-semibold">
                    Leistungen
                  </div>
                </div>
              </div>
            </div>
            
            {/* Glass Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/12 via-transparent to-transparent pointer-events-none z-30" />
            
            {/* Side Buttons (Volume/Power) */}
            <div className="absolute top-[20%] -left-[6px] sm:-left-[8px] w-[2px] sm:w-[3px] h-[15%] bg-[#4a4a4a] rounded-l-sm" />
            <div className="absolute top-[40%] -left-[6px] sm:-left-[8px] w-[2px] sm:w-[3px] h-[15%] bg-[#4a4a4a] rounded-l-sm" />
            <div className="absolute top-[30%] -right-[6px] sm:-right-[8px] w-[2px] sm:w-[3px] h-[20%] bg-[#4a4a4a] rounded-r-sm" />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
