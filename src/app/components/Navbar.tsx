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

function NavCtaButton({ className = "" }: { className?: string }) {
  return (
    <PrefetchLink
      to="/kontakt"
      className={`group relative inline-flex min-h-11 items-center gap-2.5 rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.22)] bg-[linear-gradient(180deg,rgba(255,253,249,0.95)_0%,rgba(244,238,227,0.84)_100%)] py-2 pl-5 pr-2 font-ui text-[14px] font-[620] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.9)] no-underline shadow-[0_18px_52px_-40px_rgba(20,28,44,0.38),inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(148,124,92,0.1)] transition-[transform,box-shadow,background-color,border-color] duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1.5px] hover:border-[rgb(var(--magicks-accent-line-rgb)/0.38)] hover:bg-[linear-gradient(180deg,rgba(255,254,251,0.98)_0%,rgba(247,241,230,0.92)_100%)] hover:shadow-[0_26px_72px_-40px_rgba(20,28,44,0.46),inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-1px_0_rgba(148,124,92,0.14)] active:translate-y-0 active:scale-[0.99] sm:text-[14.5px] ${className}`}
      aria-label="Ihr Projekt besprechen"
    >
      <span className="relative">
        <span className="font-ui magicks-hero-cta-label inline-block transition-[letter-spacing,color] duration-[820ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:tracking-[0.004em] group-focus-visible:tracking-[0.004em]">
          Ihr Projekt besprechen
        </span>
      </span>

      <span
        aria-hidden
        className="ml-0.5 h-5 w-px bg-[rgb(var(--magicks-accent-rgb)/0.2)] transition-[background-color] duration-[720ms] group-hover:bg-[rgb(var(--magicks-accent-rgb)/0.4)] group-focus-visible:bg-[rgb(var(--magicks-accent-rgb)/0.4)]"
      />

      <span
        aria-hidden
        className="font-instrument flex h-7 w-7 items-center justify-center rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.32)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.9)] text-[1.05em] italic text-[rgb(var(--magicks-ink-rgb)/0.88)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_12px_30px_-24px_rgba(20,28,44,0.42)] transition-[transform,background-color,border-color,box-shadow] duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px] group-hover:translate-x-[3px] group-hover:border-[rgb(var(--magicks-accent-line-rgb)/0.48)] group-hover:bg-[rgb(var(--magicks-bg-lifted-rgb)/1)] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_16px_36px_-24px_rgba(20,28,44,0.48)] group-focus-visible:-translate-y-[2px] group-focus-visible:translate-x-[3px]"
        style={{ fontVariantEmoji: "text" }}
      >
        {"\u2197\uFE0E"}
      </span>
    </PrefetchLink>
  );
}

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
        className="liquid-glass liquid-glass-nav pointer-events-auto layout-max flex items-center justify-between rounded-full border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(165deg,rgba(255,255,255,0.86)_0%,rgba(244,240,232,0.72)_100%)] px-3 py-2 shadow-[0_24px_64px_-42px_rgba(20,28,44,0.26),inset_0_1px_0_rgba(255,255,255,0.84),inset_0_-1px_0_rgba(20,28,44,0.07)] sm:px-4 sm:py-2.5"
        aria-label="Hauptnavigation"
      >
        <Link
          to="/"
          aria-label="MAGICKS Studio Startseite"
          className="inline-flex h-11 items-center rounded-full px-2 text-[var(--magicks-text-1)] no-underline sm:h-12 sm:px-3"
        >
          <MagicksLogo className="h-[2.25rem] w-auto sm:h-[2.55rem]" />
        </Link>

        <div className="hidden items-center gap-1.5 rounded-full bg-[rgb(var(--magicks-bg-lifted-rgb)/0.34)] px-2 py-1 lg:flex">
          {navLinks.map((link) => (
            <PrefetchLink
              key={link.to}
              to={link.to}
              className="font-ui magicks-duration-hover magicks-ease-out inline-flex min-h-10 items-center rounded-full px-3.5 text-[13.5px] font-[560] tracking-[-0.002em] text-[rgb(var(--magicks-ink-rgb)/0.64)] transition-[background-color,color,transform] hover:-translate-y-px hover:bg-[rgb(var(--magicks-ink-rgb)/0.045)] hover:text-[rgb(var(--magicks-ink-rgb)/0.92)] focus-visible:bg-[rgb(var(--magicks-ink-rgb)/0.055)] focus-visible:text-[rgb(var(--magicks-ink-rgb)/0.92)]"
            >
              {link.label}
            </PrefetchLink>
          ))}
        </div>

        <div className="hidden items-center lg:flex">
          <NavCtaButton />
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--magicks-text-1)] transition-[background-color,transform] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:bg-[rgb(var(--magicks-ink-rgb)/0.045)] active:scale-[0.97] lg:hidden"
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
              <NavCtaButton className="mt-3 w-full justify-center" />
            </div>
          </div>
        </>
      )}
    </header>
  );
}
