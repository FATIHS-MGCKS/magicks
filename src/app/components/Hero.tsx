import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HERO_BACKGROUND, HERO_VIDEO_SRC } from "../heroMedia";
import { DigitalCoreScene } from "./DigitalCoreScene";
import { HeroVideoBackground } from "./HeroVideoBackground";
import { transitionFast, transitionMicro } from "../motion";
import { SectionEyebrow } from "./SectionEyebrow";

export function Hero() {
  const useVideo = HERO_BACKGROUND === "video" && HERO_VIDEO_SRC.trim().length > 0;

  return (
    <section
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#0A0A0A]"
      aria-labelledby="hero-heading"
    >
      {useVideo ? <HeroVideoBackground /> : <DigitalCoreScene />}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0A0A0A] to-transparent" aria-hidden />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-7 pt-[9rem] text-center sm:pt-[10rem] md:justify-start md:pb-10 md:pt-44 lg:pt-56">
        <motion.p
          className="mb-3.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transitionFast}
        >
          <SectionEyebrow className="!px-[1.14rem] !py-[0.56rem] !text-[13px] !tracking-[0.19em]">
            MAGICKS · Digitale Marken &amp; Lösungen
          </SectionEyebrow>
        </motion.p>

        <motion.h1
          id="hero-heading"
          className="font-instrument max-w-[26rem] text-[2.08rem] font-normal leading-[1.12] tracking-[-0.03em] text-white sm:max-w-2xl sm:text-[2.62rem] md:max-w-3xl md:text-[3.2rem] lg:text-[3.58rem]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitionFast, delay: 0.06 }}
        >
          Digitale Markenauftritte. <em className="italic text-white/[0.92]">Lösungen.</em> Fortschritt.
        </motion.h1>

        <motion.p
          className="font-ui mt-6 max-w-lg text-[17px] leading-[1.65] text-white/52 md:text-[1.0625rem]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitionFast, delay: 0.14 }}
        >
          Websites, Software, Konfiguratoren und Automationen — entwickelt für Unternehmen, die moderner auftreten,
          besser performen und nicht digital stehen bleiben wollen.
        </motion.p>

        <motion.p
          className="font-ui mt-3.5 max-w-sm text-[16px] font-medium leading-snug tracking-wide text-white/38"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitionFast, delay: 0.2 }}
        >
          Für Unternehmen, die mehr wollen als nur eine Website.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitionFast, delay: 0.26 }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }} transition={transitionMicro}>
            <Link
              to="/kontakt"
              className="hero-cta-primary font-ui liquid-glass cta-core-glow magicks-duration-hover magicks-ease-out relative inline-block rounded-full px-8 py-3.5 text-[16px] font-semibold tracking-wide text-white no-underline transition-[transform,box-shadow,opacity]"
            >
              Unverbindlich anfragen
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }} transition={transitionMicro}>
            <Link
              to="/leistungen"
              className="font-ui magicks-duration-hover magicks-ease-out inline-block rounded-full border border-white/[0.14] bg-[#111111]/60 px-8 py-3.5 text-[16px] font-semibold tracking-wide text-white/92 no-underline backdrop-blur-sm transition-[border-color,background-color,box-shadow,color] hover:border-cyan-400/25 hover:bg-[#141418]/80 hover:shadow-[0_0_28px_-8px_rgba(34,211,238,0.12)]"
            >
              Leistungen
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
