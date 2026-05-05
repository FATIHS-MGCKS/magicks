import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { MagicksLogo } from "./MagicksLogo";
import { PrefetchLink } from "./PrefetchLink";

const navLinks = [
  { label: "Leistungen", to: "/leistungen" },
  { label: "Projekte", to: "/projekte" },
  { label: "Über uns", to: "/ueber-uns" },
  { label: "Kontakt", to: "/kontakt" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 bg-transparent px-4 py-2.5 sm:px-5 sm:py-3">
      <nav
        className="liquid-glass liquid-glass-nav pointer-events-auto layout-max flex items-center justify-between rounded-full px-3 py-2.5 sm:px-5 sm:py-3"
        aria-label="Hauptnavigation"
      >
        <Link
          to="/"
          aria-label="MAGICKS Studio Startseite"
          className="inline-flex h-11 items-center pl-3 text-[var(--magicks-text-1)] no-underline sm:pl-4"
        >
          <MagicksLogo className="h-[2.4rem] w-auto sm:h-12" />
        </Link>

        <div className="hidden items-center gap-2 lg:flex lg:gap-4">
          {navLinks.map((link) => (
            <PrefetchLink
              key={link.to}
              to={link.to}
              className="font-ui inline-flex min-h-[44px] items-center text-[13px] font-medium tracking-[0.008em] text-[var(--magicks-text-2)] magicks-duration-hover magicks-ease-out transition-colors hover:text-[var(--magicks-text-1)] lg:text-[14.5px]"
            >
              {link.label}
            </PrefetchLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {/* CSS-only hover/active scale — identical feel to prior framer-motion
              micro-interaction, eliminates the 122 KB framer-motion bundle. */}
          <PrefetchLink
            to="/kontakt"
            className="font-ui inline-flex min-h-[44px] items-center rounded-full border border-[rgb(var(--magicks-line-rgb)/0.22)] bg-[var(--magicks-ink-strong)] px-5 py-2 text-[15px] font-medium tracking-[0.006em] text-[var(--magicks-bg-lifted)] no-underline shadow-[0_18px_36px_-20px_rgba(17,22,34,0.58)] transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] active:scale-[0.98] lg:text-[15.5px]"
          >
            Unverbindlich anfragen
          </PrefetchLink>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--magicks-text-1)] lg:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
        >
          {menuOpen ? <X className="h-[22px] w-[22px]" strokeWidth={1.25} /> : <Menu className="h-[22px] w-[22px]" strokeWidth={1.25} />}
        </button>
      </nav>

      {menuOpen && (
        <>
          <button
            type="button"
            className="pointer-events-auto fixed inset-0 z-40 bg-[rgba(232,226,212,0.72)] backdrop-blur-sm lg:hidden"
            aria-label="Menü schließen"
            onClick={() => setMenuOpen(false)}
          />
          <div className="liquid-glass liquid-glass-nav pointer-events-auto relative z-50 layout-max mt-2 rounded-2xl p-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <PrefetchLink
                  key={link.to}
                  to={link.to}
                  className="font-ui magicks-duration-hover magicks-ease-out flex min-h-[48px] items-center rounded-xl px-4 text-[16px] font-medium tracking-[0.004em] text-[var(--magicks-text-2)] transition-colors hover:bg-[rgb(var(--magicks-ink-rgb)/0.045)] hover:text-[var(--magicks-text-1)]"
                >
                  {link.label}
                </PrefetchLink>
              ))}
              <PrefetchLink
                to="/kontakt"
                className="font-ui mt-3 flex min-h-[52px] items-center justify-center rounded-full border border-[rgb(var(--magicks-line-rgb)/0.24)] bg-[var(--magicks-ink-strong)] text-[15.5px] font-medium tracking-[0.006em] text-[var(--magicks-bg-lifted)]"
              >
                Unverbindlich anfragen
              </PrefetchLink>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
