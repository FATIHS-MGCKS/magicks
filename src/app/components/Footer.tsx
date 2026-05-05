import { Link } from "react-router-dom";
import { SectionEyebrow } from "./SectionEyebrow";
import { MagicksLogo } from "./MagicksLogo";
import { PrefetchLink } from "./PrefetchLink";
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

const secondaryOfferNav = [
  { label: "Website Starter (für Betriebe ohne Website)", to: "/website-starter" },
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
  "font-ui inline-flex min-h-[44px] items-center text-[15px] font-medium tracking-[0.004em] text-[var(--magicks-text-2)] magicks-duration-hover magicks-ease-out transition-colors hover:text-[var(--magicks-text-1)] lg:min-h-[40px]";

export function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

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
    <footer
      ref={rootRef}
      className="relative overflow-hidden border-t border-[rgb(var(--magicks-line-rgb)/0.14)] bg-[var(--magicks-bg-base)] px-5 pb-8 pt-14 md:pt-16"
    >
      {/* Ambient Pulse — deep background glow */}
      <div
        data-footer-pulse
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-20 will-change-[opacity]"
        style={{
          background: "radial-gradient(circle at 50% 120%, rgba(20,28,44,0.08) 0%, transparent 64%)",
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
            <p className="font-ui mt-4 text-[15px] leading-[1.74] text-[var(--magicks-text-2)]">
              Digitale Markenauftritte und digitale Lösungen — mit Klarheit, technischer Präzision und
              unternehmerischem Fokus.
            </p>
            <p className="font-ui mt-4 text-[14px] leading-[1.7] text-[var(--magicks-text-3)]">
              Kassel &amp; Nordhessen — bundesweit remote im Einsatz.
            </p>

            {/* Secondary location / SEO links — quiet, restrained */}
            <ul className="mt-8 space-y-1 border-t border-[rgb(var(--magicks-line-rgb)/0.12)] pt-6 sm:space-y-2">
              {locationNav.map((item) => (
                <li key={item.to}>
                  <PrefetchLink
                    to={item.to}
                    className="font-ui inline-flex min-h-[44px] items-center text-[13.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.52)] magicks-duration-hover magicks-ease-out transition-colors hover:text-[rgb(var(--magicks-ink-rgb)/0.82)] lg:min-h-[36px]"
                  >
                    {item.label}
                  </PrefetchLink>
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
                  <PrefetchLink to={item.to} className={linkClass}>
                    {item.label}
                  </PrefetchLink>
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
                  <PrefetchLink to={item.to} className={linkClass}>
                    {item.label}
                  </PrefetchLink>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-[rgb(var(--magicks-line-rgb)/0.12)] pt-4">
              <p className="font-mono mb-2 text-[9.5px] font-medium uppercase tracking-[0.3em] text-[rgb(var(--magicks-ink-rgb)/0.44)]">
                Angebot
              </p>
              <ul className="space-y-1.5">
                {secondaryOfferNav.map((item) => (
                  <li key={item.to}>
                    <PrefetchLink
                      to={item.to}
                      className="font-ui inline-flex min-h-[40px] items-center text-[13.5px] leading-[1.6] text-[rgb(var(--magicks-ink-rgb)/0.58)] magicks-duration-hover magicks-ease-out transition-colors hover:text-[rgb(var(--magicks-ink-rgb)/0.84)]"
                    >
                      {item.label}
                    </PrefetchLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="mb-4">
              <SectionEyebrow variant="compact">Rechtliches</SectionEyebrow>
            </p>
            <ul className="space-y-2.5">
              {legalNav.map((item) => (
                <li key={item.to}>
                  <PrefetchLink to={item.to} className={linkClass}>
                    {item.label}
                  </PrefetchLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[rgb(var(--magicks-line-rgb)/0.14)] pt-8 text-center sm:flex-row sm:gap-4 sm:text-left md:mt-16">
          <p className="font-ui text-[13.5px] leading-[1.64] text-[rgb(var(--magicks-ink-rgb)/0.58)]">
            © {new Date().getFullYear()} MAGICKS Studio. Alle Rechte vorbehalten.
          </p>
          <p className="font-ui text-[13.5px] text-[rgb(var(--magicks-ink-rgb)/0.52)]">
            <a
              href="mailto:hello@magicks.de"
              className="inline-flex min-h-[44px] items-center break-all magicks-duration-hover magicks-ease-out transition-colors hover:text-[rgb(var(--magicks-ink-rgb)/0.78)] lg:min-h-[32px]"
            >
              hello@magicks.de
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
