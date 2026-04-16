import { Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { transitionMicro } from "../motion";
import { SectionEyebrow } from "./SectionEyebrow";
import { MagicksLogo } from "./MagicksLogo";

const footerNav = [
  { label: "Leistungen", to: "/leistungen" },
  { label: "Projekte", to: "/projekte" },
  { label: "Über MAGICKS", to: "/ueber-magicks" },
  { label: "Kontakt", to: "/kontakt" },
];

const leistungAnchors = [
  { label: "Digitale Markenauftritte", to: "/leistungen#marken" },
  { label: "Digitale Lösungen", to: "/leistungen#loesungen" },
  { label: "Automationen & KI", to: "/leistungen#automation" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0A0A0A] px-5 pb-7 pt-8 md:pt-10">
      <div className="layout-max">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link to="/" className="inline-block no-underline">
              <MagicksLogo className="h-8 w-auto md:h-9" />
            </Link>
            <p className="font-ui mt-3 text-[15px] leading-relaxed text-white/45">
              Digitale Markenauftritte und digitale Lösungen — mit Klarheit, technischer Präzision und
              unternehmerischem Fokus.
            </p>
            <p className="font-ui mt-4 text-[13px] leading-relaxed text-white/38">
              Kassel &amp; Nordhessen — bundesweit remote im Einsatz.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 md:gap-14">
            <div>
              <p className="mb-3">
                <SectionEyebrow variant="compact">Navigation</SectionEyebrow>
              </p>
              <ul className="space-y-2">
                {footerNav.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="font-ui text-[15px] text-white/50 magicks-duration-hover magicks-ease-out transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3">
                <SectionEyebrow variant="compact">Leistungen</SectionEyebrow>
              </p>
              <ul className="space-y-2">
                {leistungAnchors.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="font-ui text-[15px] text-white/50 magicks-duration-hover magicks-ease-out transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3">
                <SectionEyebrow variant="compact">Rechtliches</SectionEyebrow>
              </p>
              <ul className="space-y-2">
                {["Impressum", "Datenschutz"].map((label) => (
                  <li key={label}>
                    <a
                      href="#"
                      className="font-ui text-[15px] text-white/50 magicks-duration-hover magicks-ease-out transition-colors hover:text-white"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="font-ui text-[13px] text-white/40">© {new Date().getFullYear()} MAGICKS. Alle Rechte vorbehalten.</p>
          <div className="flex gap-3">
            {[
              { Icon: Instagram, label: "Instagram" },
              { Icon: Linkedin, label: "LinkedIn" },
            ].map(({ Icon, label }) => (
              <motion.a
                key={label}
                href="#"
                aria-label={label}
                className="flex rounded-full border border-white/[0.08] p-2.5 text-white/55 magicks-duration-hover magicks-ease-out transition-colors hover:border-white/15 hover:text-white"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={transitionMicro}
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
