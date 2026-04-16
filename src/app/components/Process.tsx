import { motion, useInView } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PROCESS_STEPS } from "./processData";
import { PROCESS_TUNING } from "./processTuning";
import { SectionEyebrow } from "./SectionEyebrow";
import { transition, transitionMicro } from "../motion";

const h2 =
  "font-instrument max-w-2xl text-[1.38rem] tracking-[-0.03em] text-white sm:text-[1.62rem] md:text-[1.75rem]";

export function Process() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const [progress, setProgress] = useState(0);
  const [paths, setPaths] = useState<string[]>([]);
  const [pathLengths, setPathLengths] = useState<number[]>([]);
  const [reduced, setReduced] = useState(false);
  const scrollTriggerRef = useRef<{ refresh: () => void; create: (vars: Record<string, unknown>) => { kill: () => void } } | null>(null);
  const queuedProgressRef = useRef(0);
  const rafProgressRef = useRef<number | null>(null);

  // Check for reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Calculate SVG Paths from Steps to the Core
  const updatePathGeometry = useCallback(() => {
    const container = containerRef.current;
    const core = coreRef.current;
    if (!container || !core) return;

    const cr = container.getBoundingClientRect();
    if (cr.width < 8 || cr.height < 8) return;

    const coreRect = core.getBoundingClientRect();
    // Core center relative to container
    const coreX = coreRect.left + coreRect.width / 2 - cr.left;
    const coreY = coreRect.top + coreRect.height / 2 - cr.top;

    const newPaths: string[] = [];

    for (let i = 0; i < PROCESS_STEPS.length; i++) {
      const el = stepRefs.current[i];
      if (!el) {
        newPaths.push("");
        continue;
      }
      const r = el.getBoundingClientRect();
      // Step center relative to container
      const startX = r.left + r.width / 2 - cr.left;
      const startY = r.top + r.height / 2 - cr.top;

      // Smooth curve
      const cp1x = startX + (coreX - startX) * 0.5;
      const cp1y = startY;
      const cp2x = startX + (coreX - startX) * 0.5;
      const cp2y = coreY;

      newPaths.push(`M ${startX} ${startY} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${coreX} ${coreY}`);
    }

    setPaths(newPaths);
  }, []);

  const commitProgress = useCallback(() => {
    rafProgressRef.current = null;
    const snappedProgress = Math.round(queuedProgressRef.current * 240) / 240;
    setProgress((prev) => (Math.abs(prev - snappedProgress) < 0.0005 ? prev : snappedProgress));
  }, []);

  // Measure path lengths after they are rendered
  useLayoutEffect(() => {
    const lengths = pathRefs.current.map((path) => (path ? path.getTotalLength() : 1000));
    setPathLengths(lengths);
  }, [paths]);

  // Handle Resize
  useLayoutEffect(() => {
    updatePathGeometry();
    const ro = new ResizeObserver(() => {
      updatePathGeometry();
      scrollTriggerRef.current?.refresh();
    });
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", updatePathGeometry);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updatePathGeometry);
    };
  }, [updatePathGeometry]);

  // GSAP ScrollTrigger for robust progress tracking
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (reduced) {
      queuedProgressRef.current = 1;
      setProgress(1);
      return;
    }

    let disposed = false;
    let st: { kill: () => void } | null = null;

    const initScrollTrigger = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);
      scrollTriggerRef.current = ScrollTrigger;

      st = ScrollTrigger.create({
        id: "process-ablauf",
        trigger: section,
        scroller: window,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self: { progress: number }) => {
          queuedProgressRef.current = self.progress;
          if (rafProgressRef.current === null) {
            rafProgressRef.current = requestAnimationFrame(commitProgress);
          }
        },
      });

      requestAnimationFrame(() => {
        updatePathGeometry();
        ScrollTrigger.refresh();
      });
    };

    void initScrollTrigger();

    return () => {
      disposed = true;
      if (rafProgressRef.current !== null) {
        cancelAnimationFrame(rafProgressRef.current);
        rafProgressRef.current = null;
      }
      st?.kill();
    };
  }, [commitProgress, reduced, updatePathGeometry]);

  const sectionH = `350vh`;

  return (
    <section
      id="prozess"
      ref={sectionRef}
      className="relative bg-[#0A0A0A]"
      style={{ minHeight: sectionH }}
      aria-labelledby="process-heading"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
        {/* Background Ambient Gradients */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_28%_0%,rgba(59,130,246,0.04),transparent_48%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(99,102,241,0.03),transparent_55%)]"
          aria-hidden
        />

        <div className="relative w-full max-w-[1220px] z-20 mb-6 md:mb-12">
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 14 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={transition}
          >
            <p className="mb-1">
              <SectionEyebrow>Ablauf</SectionEyebrow>
            </p>
            <h2 id="process-heading" className={h2}>
              Klar strukturiert. <em className="italic text-white/45">Effizient umgesetzt.</em>
            </h2>
          </motion.div>
        </div>

        <div
          className="relative w-full max-w-[1220px] z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-16"
          ref={containerRef}
        >
          {/* SVG Overlay for Connections (Behind the cards) */}
          <svg className="absolute inset-0 pointer-events-none z-0 overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="process-beam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="1" />
              </linearGradient>
              <filter id="process-beam-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {paths.map((d, i) => {
              const stepFraction = 1 / PROCESS_STEPS.length;
              const localP = Math.max(0, Math.min(1, (progress - i * stepFraction) / stepFraction));
              const len = pathLengths[i] || 1000;

              return (
                <g key={i}>
                  {/* Invisible path to measure length */}
                  <path
                    ref={(el) => { pathRefs.current[i] = el; }}
                    d={d}
                    fill="none"
                    stroke="none"
                  />
                  
                  {/* Faint background path */}
                  <path d={d} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />

                  {/* Animated beam */}
                  {localP > 0 && (
                    <path
                      d={d}
                      fill="none"
                      stroke="url(#process-beam)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={len}
                      strokeDashoffset={len * (1 - localP)}
                      filter="url(#process-beam-glow)"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Left: Steps Grid (Z-index higher than SVG so lines go behind) */}
          <div className="w-full lg:w-7/12 grid grid-cols-2 gap-3 sm:gap-4 relative z-10">
            {PROCESS_STEPS.map((step, i) => {
              const stepFraction = 1 / PROCESS_STEPS.length;
              const isActive = progress >= i * stepFraction;
              const localP = Math.max(0, Math.min(1, (progress - i * stepFraction) / stepFraction));

              return (
                <div
                  key={i}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className={`relative p-4 md:p-5 rounded-xl border magicks-duration-surface magicks-ease-out transition-[border-color,background-color,box-shadow] backdrop-blur-sm ${
                    isActive
                      ? "border-cyan-500/30 bg-[#0A0A0A]/90 shadow-[0_0_30px_-10px_rgba(56,189,248,0.15)]"
                      : "border-white/10 bg-[#0A0A0A]/70"
                  }`}
                >
                  <div
                    className={`font-ui text-xs md:text-sm font-bold mb-2 transition-colors ${
                      isActive ? "text-cyan-400" : "text-white/20"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}{" "}
                    <span className="ml-1 font-normal opacity-60">· {step.micro}</span>
                  </div>
                  <h3
                    className={`font-ui font-semibold text-[13px] md:text-[15px] mb-1 leading-tight transition-colors ${
                      isActive ? "text-white" : "text-white/30"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`font-ui text-[11px] md:text-[13px] leading-snug transition-colors ${
                      isActive ? "text-white/60" : "text-white/20"
                    }`}
                  >
                    {step.subtitle}
                  </p>

                  {/* Subtle highlight ring when active */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-xl border border-cyan-400/30 opacity-0 animate-[pulse_2s_ease-in-out_infinite] pointer-events-none"
                      style={{ animationDelay: `${i * 0.2}s`, opacity: localP * 0.5 }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: The Core ("Webpräsenz Transformation") */}
          <div className="w-full lg:w-5/12 flex flex-col justify-center items-center relative z-10 mt-8 lg:mt-0">
            <div
              className="relative flex aspect-square w-full max-w-[200px] sm:max-w-[260px] md:max-w-[300px] items-center justify-center"
              ref={coreRef}
            >
              {/* --- STATE 1: RAW WIREFRAMES & CODE --- */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  opacity: Math.max(0, 1 - progress * 1.5),
                  transform: `scale(${1 - progress * 0.08}) translateY(${progress * 18}px)`,
                }}
              >
                <div className="w-4/5 h-8 border-2 border-dashed border-zinc-700 rounded-md mb-4 flex items-center px-2 animate-[pulse_3s_ease-in-out_infinite]">
                  <div className="w-1/3 h-2 bg-zinc-700 rounded-full" />
                </div>
                <div className="w-full h-24 border-2 border-dashed border-zinc-700 rounded-xl mb-4 flex flex-col justify-center p-4 gap-3">
                  <div className="w-1/2 h-2 bg-zinc-800 rounded-full" />
                  <div className="w-3/4 h-2 bg-zinc-800 rounded-full" />
                  <div className="w-5/6 h-2 bg-zinc-800 rounded-full" />
                </div>
                <div className="flex gap-4 w-full">
                  <div className="w-1/2 h-12 border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-zinc-700 rounded-full" />
                  </div>
                  <div className="w-1/2 h-12 border-2 border-dashed border-zinc-700 rounded-lg" />
                </div>
              </div>

              {/* --- STATE 2: POLISHED DASHBOARD UI --- */}
              <div
                className="absolute inset-[-20px] sm:inset-[-40px] flex items-center justify-center"
                style={{
                  opacity: progress,
                  transform: `scale(${0.9 + progress * 0.1}) translateY(${(1 - progress) * 20}px)`,
                }}
              >
                {/* Glowing Aura */}
                <div 
                  className="absolute w-[100%] h-[100%] rounded-full bg-cyan-500/20 blur-[50px]"
                  style={{ opacity: progress * 0.8, transform: `scale(${progress})` }}
                />
                <div 
                  className="absolute w-[70%] h-[70%] rounded-full bg-indigo-500/30 blur-[40px]"
                  style={{ opacity: progress * 0.6, transform: `scale(${progress})` }}
                />

                {/* The UI Card */}
                <div className="relative z-10 w-full aspect-[4/5] max-w-[240px] sm:max-w-[280px] liquid-glass rounded-2xl border border-white/10 p-4 sm:p-5 flex flex-col shadow-[0_20px_40px_rgba(34,211,238,0.15)] overflow-hidden">
                  {/* Header */}
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      <div className="h-2.5 w-16 bg-white/20 rounded-full" />
                    </div>
                    <div className="h-4 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <div className="h-1 w-6 bg-cyan-400/80 rounded-full" />
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="relative z-10 flex-1 w-full bg-black/20 rounded-xl border border-white/5 p-3 flex flex-col justify-end overflow-hidden">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-20">
                      <div className="w-full h-px bg-white/20" />
                      <div className="w-full h-px bg-white/20" />
                      <div className="w-full h-px bg-white/20" />
                    </div>
                    
                    {/* Spline/Graph */}
                    <svg className="absolute inset-x-0 bottom-0 w-full h-[70%] drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M0,100 C20,80 30,90 50,40 C70,-10 80,30 100,10 L100,100 Z" fill="url(#chart-grad)" opacity="0.2" />
                      <path d="M0,100 C20,80 30,90 50,40 C70,-10 80,30 100,10" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" className="animate-[dash_3s_ease-in-out_infinite]" strokeDasharray="200" strokeDashoffset="0" />
                      <defs>
                        <linearGradient id="chart-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    {/* Floating Metric */}
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-cyan-500/20 border border-cyan-400/30 backdrop-blur-sm">
                      <span className="text-[10px] font-bold text-cyan-300">+142%</span>
                    </div>
                  </div>

                  {/* Bottom Metrics */}
                  <div className="relative z-10 flex gap-2 mt-3">
                    <div className="flex-1 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center px-2 gap-2">
                      <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-indigo-400 rounded-full" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="w-8 h-1.5 bg-white/30 rounded-full" />
                        <div className="w-12 h-1.5 bg-white/10 rounded-full" />
                      </div>
                    </div>
                    <div className="flex-1 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center px-2 gap-2">
                      <div className="w-6 h-6 rounded-md bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                        <div className="w-3 h-3 border-2 border-purple-400 rounded-sm" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="w-8 h-1.5 bg-white/30 rounded-full" />
                        <div className="w-12 h-1.5 bg-white/10 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="mt-8 md:mt-10"
          initial={{ opacity: 0 }}
          animate={isHeaderInView ? { opacity: 1 } : {}}
          transition={{ ...transition, delay: 0.35 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }} transition={transitionMicro}>
            <Link
              to="/kontakt"
              className="hero-cta-primary font-ui liquid-glass cta-core-glow magicks-duration-hover magicks-ease-out relative inline-block rounded-full px-6 py-2.5 text-[14px] font-semibold tracking-wide text-white no-underline transition-[transform,box-shadow,opacity]"
            >
              Unverbindlich anfragen
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
