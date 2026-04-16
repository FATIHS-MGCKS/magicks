import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

// --- Card 0: Websites & Landing Pages ---
function LandingPageAnimation({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      <motion.div 
        className="w-[85%] h-[250%] bg-[#111] rounded-t-md border-x border-t border-white/10 flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.8)]"
        animate={{ y: isPlaying ? ["0%", "-60%"] : "0%" }}
        transition={{ duration: 8, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        {/* Header */}
        <div className="h-4 border-b border-white/5 flex items-center px-3 justify-between bg-white/[0.02]">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
          <div className="flex gap-2">
            <div className="w-4 h-0.5 bg-white/10 rounded-full" />
            <div className="w-4 h-0.5 bg-white/10 rounded-full" />
          </div>
        </div>
        {/* Hero Section */}
        <div className="h-32 flex flex-col items-center justify-center p-4 text-center relative border-b border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.15),transparent_70%)]" />
          <div className="w-3/4 h-2 bg-white/90 rounded-full mb-2 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
          <div className="w-1/2 h-2 bg-white/90 rounded-full mb-4" />
          <div className="w-16 h-4 bg-cyan-500/80 rounded-full" />
        </div>
        {/* Features Grid */}
        <div className="h-32 p-3 grid grid-cols-2 gap-2 border-b border-white/5">
          <div className="bg-white/5 rounded border border-white/5" />
          <div className="bg-white/5 rounded border border-white/5" />
          <div className="bg-white/5 rounded border border-white/5" />
          <div className="bg-white/5 rounded border border-white/5" />
        </div>
        {/* Content Section */}
        <div className="h-40 p-4 flex flex-col gap-3 border-b border-white/5">
          <div className="w-1/3 h-2 bg-white/40 rounded-full mb-2" />
          <div className="w-full h-1.5 bg-white/10 rounded-full" />
          <div className="w-full h-1.5 bg-white/10 rounded-full" />
          <div className="w-4/5 h-1.5 bg-white/10 rounded-full" />
          <div className="mt-2 w-full flex-1 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded border border-white/5" />
        </div>
      </motion.div>
      <GlassOverlay />
    </div>
  );
}

// --- Card 1: Shops & Produktkonfiguratoren ---
function ConfiguratorAnimation({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <motion.div 
        className="w-full h-full bg-[#111] rounded-xl border border-white/10 flex overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]"
        animate={{ scale: isPlaying ? 1.02 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Left: Product Viewer */}
        <div className="flex-1 border-r border-white/5 p-4 flex flex-col items-center justify-center relative bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)]">
          <motion.div 
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border-4 border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]"
            animate={{ 
              rotate: isPlaying ? [0, 90, 180, 270, 360] : 0,
              borderColor: isPlaying ? ["rgba(255,255,255,0.1)", "rgba(56,189,248,0.5)", "rgba(167,139,250,0.5)", "rgba(255,255,255,0.1)"] : "rgba(255,255,255,0.1)",
              backgroundColor: isPlaying ? ["rgba(255,255,255,0.02)", "rgba(56,189,248,0.1)", "rgba(167,139,250,0.1)", "rgba(255,255,255,0.02)"] : "rgba(255,255,255,0.02)"
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <div className="mt-6 w-24 h-1.5 bg-white/10 rounded-full" />
          <div className="mt-2 w-16 h-1.5 bg-white/5 rounded-full" />
        </div>
        
        {/* Right: Configurator UI */}
        <div className="w-[40%] bg-black/40 p-3 sm:p-4 flex flex-col gap-4">
          <div className="w-1/2 h-2 bg-white/20 rounded-full mb-1" />
          
          {/* Swatches */}
          <div className="grid grid-cols-2 gap-2">
            <motion.div 
              className="aspect-square rounded-md bg-cyan-500/20 border border-cyan-500/50 relative"
              animate={{ opacity: isPlaying ? [0.5, 1, 0.5] : 0.8 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            </motion.div>
            <div className="aspect-square rounded-md bg-white/5 border border-white/10" />
            <div className="aspect-square rounded-md bg-white/5 border border-white/10" />
            <div className="aspect-square rounded-md bg-white/5 border border-white/10" />
          </div>
          
          {/* Sliders/Options */}
          <div className="mt-auto flex flex-col gap-3">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-cyan-400/80" 
                animate={{ width: isPlaying ? ["30%", "80%", "40%"] : "30%" }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
              />
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-400/80" 
                animate={{ width: isPlaying ? ["60%", "20%", "70%"] : "60%" }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} 
              />
            </div>
            <motion.div 
              className="w-full h-6 sm:h-8 bg-white/10 rounded-md mt-2"
              animate={{ backgroundColor: isPlaying ? ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.15)", "rgba(255,255,255,0.1)"] : "rgba(255,255,255,0.1)" }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
      <GlassOverlay />
    </div>
  );
}

// --- Card 2: Dashboards & Web-Software ---
function DashboardAnimation({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <motion.div 
        className="w-full h-full bg-[#111] rounded-xl border border-white/10 flex flex-col overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]"
        animate={{ y: isPlaying ? -4 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="h-5 sm:h-6 border-b border-white/5 flex items-center px-3 gap-2 bg-white/[0.02]">
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <div className="w-12 h-1.5 bg-white/10 rounded-full" />
        </div>
        
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-10 sm:w-12 border-r border-white/5 flex flex-col items-center py-3 gap-3 bg-black/20">
            <div className="w-5 h-5 rounded bg-white/10" />
            <div className="w-5 h-5 rounded bg-white/5" />
            <div className="w-5 h-5 rounded bg-white/5" />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 p-3 sm:p-4 flex flex-col gap-3">
            {/* Metrics Row */}
            <div className="flex gap-2 h-12 sm:h-14">
              <div className="flex-1 bg-white/5 rounded-lg border border-white/5 p-2 flex flex-col justify-between">
                <div className="w-8 h-1.5 bg-white/20 rounded-full" />
                <motion.div 
                  className="w-16 h-2 bg-cyan-400/60 rounded-full" 
                  animate={{ width: isPlaying ? ["40%", "80%", "60%"] : "40%" }} 
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
                />
              </div>
              <div className="flex-1 bg-white/5 rounded-lg border border-white/5 p-2 flex flex-col justify-between">
                <div className="w-8 h-1.5 bg-white/20 rounded-full" />
                <motion.div 
                  className="w-12 h-2 bg-indigo-400/60 rounded-full" 
                  animate={{ width: isPlaying ? ["60%", "30%", "70%"] : "60%" }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
                />
              </div>
            </div>
            
            {/* Chart Area */}
            <div className="flex-1 bg-white/5 rounded-lg border border-white/5 relative overflow-hidden flex items-end p-2 gap-1.5 sm:gap-2">
               <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_20%]" />
               {[40, 70, 45, 90, 65, 80, 30].map((h, i) => (
                 <motion.div 
                   key={i} 
                   className="flex-1 bg-gradient-to-t from-cyan-500/20 to-cyan-400/40 rounded-t-sm border-t border-cyan-400/50 relative z-10"
                   initial={{ height: "10%" }}
                   animate={{ height: isPlaying ? `${h}%` : "10%" }}
                   transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                 />
               ))}
            </div>
          </div>
        </div>
      </motion.div>
      <GlassOverlay />
    </div>
  );
}

// --- Card 3: Automationen & KI ---
function AutomationAnimation({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff1_1px,transparent_1px),linear-gradient(to_bottom,#fff1_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
      
      <motion.div 
        className="relative w-full h-full max-w-[300px] max-h-[160px]" 
        animate={{ scale: isPlaying ? 1.05 : 1 }} 
        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
      >
        {/* SVG Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 160">
          {/* Static Paths */}
          <path d="M 50 80 C 100 80, 100 40, 150 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <path d="M 50 80 C 100 80, 100 120, 150 120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <path d="M 150 40 C 200 40, 200 80, 250 80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <path d="M 150 120 C 200 120, 200 80, 250 80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          
          {/* Animated Data Flow (Dashed Lines) */}
          {isPlaying && (
            <>
              <motion.path d="M 50 80 C 100 80, 100 40, 150 40" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6 12" animate={{ strokeDashoffset: [24, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              <motion.path d="M 50 80 C 100 80, 100 120, 150 120" fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="6 12" animate={{ strokeDashoffset: [24, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
              <motion.path d="M 150 40 C 200 40, 200 80, 250 80" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6 12" animate={{ strokeDashoffset: [24, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              <motion.path d="M 150 120 C 200 120, 200 80, 250 80" fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="6 12" animate={{ strokeDashoffset: [24, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
            </>
          )}
        </svg>

        {/* Nodes */}
        {/* Trigger Node */}
        <motion.div 
          className="absolute left-[30px] top-[65px] w-10 h-10 bg-white/10 border border-white/20 rounded-lg backdrop-blur-md flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          animate={{ boxShadow: isPlaying ? "0 0 20px rgba(56,189,248,0.3)" : "0 0 15px rgba(255,255,255,0.05)" }} 
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        >
           <div className="w-4 h-4 rounded-full bg-cyan-400/80" />
        </motion.div>
        
        {/* Action Node 1 */}
        <div className="absolute left-[130px] top-[20px] w-10 h-10 bg-[#111] border border-white/10 rounded-lg flex items-center justify-center shadow-lg">
           <div className="w-4 h-1 bg-white/40 rounded-full" />
        </div>
        
        {/* Action Node 2 */}
        <div className="absolute left-[130px] top-[100px] w-10 h-10 bg-[#111] border border-white/10 rounded-lg flex items-center justify-center shadow-lg">
           <div className="w-4 h-1 bg-white/40 rounded-full" />
        </div>
        
        {/* Result/AI Node */}
        <motion.div 
          className="absolute left-[230px] top-[60px] w-12 h-12 bg-indigo-500/20 border border-indigo-400/30 rounded-xl backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.1)]"
          animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }} 
          transition={{ duration: 2, repeat: Infinity }}
        >
           <div className="w-5 h-5 rounded bg-indigo-400/80" />
        </motion.div>
      </motion.div>
      <GlassOverlay />
    </div>
  );
}

// --- Shared Glass Overlay ---
function GlassOverlay() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-transparent pointer-events-none" />
    </>
  );
}

// --- Main Component ---
export function ServiceCardMedia({
  videoSrc,
  cardIndex,
  isPlaying,
  setCardRootRef,
}: {
  videoSrc: string;
  cardIndex: number;
  isPlaying: boolean;
  setCardRootRef: (index: number, el: HTMLDivElement | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setCardRootRef(cardIndex, containerRef.current);
    }
  }, [cardIndex, setCardRootRef]);

  const renderAnimation = () => {
    switch (cardIndex) {
      case 0:
        return <LandingPageAnimation isPlaying={isPlaying} />;
      case 1:
        return <ConfiguratorAnimation isPlaying={isPlaying} />;
      case 2:
        return <DashboardAnimation isPlaying={isPlaying} />;
      case 3:
        return <AutomationAnimation isPlaying={isPlaying} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[2/1] overflow-hidden sm:aspect-[16/9]"
    >
      {renderAnimation()}
    </div>
  );
}
