import { ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useServiceCardsVideo } from "../hooks/useServiceCardsVideo";
import { stagger, transition } from "../motion";
import { SectionEyebrow } from "./SectionEyebrow";
import { ServiceCardMedia } from "./ServiceCardMedia";

const V1 =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";
const V2 =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4";
const V3 =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4";
const V4 =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4";

const cards: {
  href: string;
  video: string;
  title: string;
  description: string;
}[] = [
  {
    href: "/leistungen#marken",
    video: V1,
    title: "Websites & Landing Pages",
    description: "Sichtbarkeit und Anfragen — als zusammenhängendes System, nicht als Einzelseiten.",
  },
  {
    href: "/leistungen#loesungen",
    video: V2,
    title: "Shops & Produktkonfiguratoren",
    description: "Komplexe Angebote führbar machen: vom ersten Klick bis zur strukturierten Übergabe.",
  },
  {
    href: "/leistungen#loesungen",
    video: V3,
    title: "Dashboards & Web-Software",
    description: "Interne Systeme, die Arbeit bündeln statt neue manuelle Schleifen zu eröffnen.",
  },
  {
    href: "/leistungen#automation",
    video: V4,
    title: "Automationen & KI",
    description: "Wiederkehrende Last aus dem Team holen — mit nachvollziehbaren, wartbaren Abläufen.",
  },
];

const h2 =
  "font-instrument text-[1.38rem] tracking-[-0.03em] text-white sm:text-[1.62rem] md:text-[1.75rem]";

export function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { playingIndex, canHover, setCardRootRef, onCardHoverStart, onCardHoverEnd } = useServiceCardsVideo(cards.length);

  return (
    <section id="leistungen" ref={ref} className="section-y relative overflow-hidden bg-[#0A0A0A] px-5" aria-labelledby="services-heading">
      <div className="pointer-events-none absolute inset-0 section-gradient opacity-48" aria-hidden />

      <div className="relative layout-max">
        <motion.div
          className="mb-6 md:mb-7"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={transition}
        >
          <p className="mb-1">
            <SectionEyebrow>Leistungsspektrum</SectionEyebrow>
          </p>
          <h2 id="services-heading" className={h2}>
            Was wir <em className="italic text-white/45">bauen</em>
          </h2>
          <p className="font-ui mt-1.5 max-w-lg text-[14px] leading-[1.65] text-white/44 md:text-[0.875rem]">
            Vier Einstiege — gebündelt in klaren Leistungsclustern auf der Seite Leistungen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-3.5">
          {cards.map((card, i) => {
            const active = playingIndex === i;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 22 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...transition, delay: stagger * (i + 1) }}
              >
                <Link
                  to={card.href}
                  className="group block h-full no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/40"
                  onPointerEnter={() => onCardHoverStart(i)}
                  onPointerLeave={onCardHoverEnd}
                  onFocus={() => canHover && onCardHoverStart(i)}
                  onBlur={onCardHoverEnd}
                >
                  <article
                    className={
                      active
                        ? "card-surface card-surface-interactive magicks-duration-surface magicks-ease-out flex h-full flex-col overflow-hidden rounded-xl shadow-[0_28px_56px_-36px_rgba(0,0,0,0.88)] ring-1 ring-white/[0.11] transition-[box-shadow,ring-color]"
                        : "card-surface card-surface-interactive magicks-duration-surface magicks-ease-out flex h-full flex-col overflow-hidden rounded-xl transition-[box-shadow,ring-color]"
                    }
                  >
                    <div className="relative">
                      <ServiceCardMedia
                        videoSrc={card.video}
                        cardIndex={i}
                        isPlaying={active}
                        setCardRootRef={setCardRootRef}
                      />
                      <div
                        className={
                          active
                            ? "absolute right-2.5 top-2.5 z-10 rounded-full border border-white/[0.1] bg-black/45 p-1.5 text-white/65 opacity-100 backdrop-blur-sm magicks-duration-hover magicks-ease-out transition-opacity"
                            : "absolute right-2.5 top-2.5 z-10 rounded-full border border-white/[0.1] bg-black/45 p-1.5 text-white/65 opacity-0 backdrop-blur-sm magicks-duration-hover magicks-ease-out transition-opacity group-hover:opacity-100"
                        }
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.25} aria-hidden />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-ui text-[14px] font-semibold tracking-tight text-white">{card.title}</h3>
                      <p className="font-ui mt-1.5 flex-1 text-[13px] leading-[1.6] text-white/46 md:text-[14px]">
                        {card.description}
                      </p>
                      <p className="font-ui mt-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-cyan-200/45">
                        Zum Cluster →
                      </p>
                    </div>
                  </article>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
