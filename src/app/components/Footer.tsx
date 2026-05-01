import { Link } from "react-router-dom";
import { SectionEyebrow } from "./SectionEyebrow";
import { MagicksLogo } from "./MagicksLogo";
import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";

const primaryNav = [
  { label: "Leistungen", to: "/leistungen" },
  { label: "Projekte", to: "/projekte" },
  { label: "Über uns", to: "/ueber-uns" },
  { label: "Kontakt", to: "/kontakt" },
];

const servicesNav = [
  { label: "Websites & Landing Pages", to: "/websites-landingpages" },
  { label: "Shops & Produktkonfiguratoren", to: "/shops-produktkonfiguratoren" },
  { label: "Web-Software", to: "/web-software" },
  { label: "KI-Automationen & Integrationen", to: "/ki-automationen-integrationen" },
  { label: "SEO & Sichtbarkeit", to: "/seo-sichtbarkeit" },
  { label: "Content, Bildwelt & Medien", to: "/content-bildwelt-medien" },
  { label: "Website im Abo", to: "/website-im-abo" },
];

const legalNav = [
  { label: "Impressum", to: "/impressum" },
  { label: "Datenschutz", to: "/datenschutz" },
];

const locationNav = [
  { label: "Webdesign Kassel", to: "/webdesign-kassel" },
  { label: "Landing Pages Kassel", to: "/landingpages-kassel" },
  { label: "Produktkonfigurator erstellen lassen", to: "/produktkonfigurator-erstellen" },
  { label: "KI-Automation für Unternehmen", to: "/ki-automation-unternehmen" },
];

const linkClass =
  "font-ui inline-flex min-h-[44px] items-center text-[14.5px] text-white/50 magicks-duration-hover magicks-ease-out transition-colors hover:text-white lg:min-h-[40px]";

export function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const gsap = registerGsap();

    const ctx = gsap.context(() => {
      const pulse = root.querySelector<HTMLElement>("[data-footer-pulse]");
      
      if (reduced) {
        if (pulse) gsap.set(pulse, { opacity: 0 });
        return;
      }

      // ─── Ambient Pulse: deep, slow breathing light in the footer ──────
      if (pulse) {
        gsap.to(pulse, {
          opacity: 0.6,
          duration: 4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <footer ref={rootRef} className="relative overflow-hidden border-t border-white/[0.06] bg-[#0A0A0A] px-5 pb-8 pt-14 md:pt-16">
      {/* Ambient Pulse — deep background glow */}
      <div
        data-footer-pulse
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-20 will-change-[opacity]"
        style={{
          background: "radial-gradient(circle at 50% 120%, rgba(255,255,255,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 layout-max">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-10 lg:gap-14">
          {/* Brand column */}
          <div className="max-w-sm">
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center no-underline lg:min-h-[40px]"
              aria-label="MAGICKS Studio Startseite"
            >
              <MagicksLogo className="h-8 w-auto md:h-9" />
            </Link>
            <p className="font-ui mt-4 text-[14.5px] leading-relaxed text-white/46">
              Digitale Markenauftritte und digitale Lösungen — mit Klarheit, technischer Präzision und
              unternehmerischem Fokus.
            </p>
            <p className="font-ui mt-4 text-[13px] leading-relaxed text-white/38">
              Kassel &amp; Nordhessen — bundesweit remote im Einsatz.
            </p>

            {/* Secondary location / SEO links — quiet, restrained */}
            <ul className="mt-8 space-y-1 border-t border-white/[0.05] pt-6 sm:space-y-2">
              {locationNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="font-ui inline-flex min-h-[44px] items-center text-[12.5px] text-white/36 magicks-duration-hover magicks-ease-out transition-colors hover:text-white/72 lg:min-h-[36px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Primary navigation */}
          <div>
            <p className="mb-4">
              <SectionEyebrow variant="compact">Navigation</SectionEyebrow>
            </p>
            <ul className="space-y-2.5">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="mb-4">
              <SectionEyebrow variant="compact">Leistungen</SectionEyebrow>
            </p>
            <ul className="space-y-2.5">
              {servicesNav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="mb-4">
              <SectionEyebrow variant="compact">Rechtliches</SectionEyebrow>
            </p>
            <ul className="space-y-2.5">
              {legalNav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-8 text-center sm:flex-row sm:gap-4 sm:text-left md:mt-16">
          <p className="font-ui text-[12.5px] leading-relaxed text-white/40 sm:text-[13px]">
            © {new Date().getFullYear()} MAGICKS Studio. Alle Rechte vorbehalten.
          </p>
          <p className="font-ui text-[12.5px] text-white/34">
            <a
              href="mailto:hello@magicks.de"
              className="inline-flex min-h-[44px] items-center break-all magicks-duration-hover magicks-ease-out transition-colors hover:text-white/70 lg:min-h-[32px]"
            >
              hello@magicks.de
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
