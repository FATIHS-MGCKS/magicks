import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { transitionMicro } from "../motion";
import { MagicksLogo } from "./MagicksLogo";

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
        <Link to="/" className="flex items-center pl-3 text-white no-underline sm:pl-4">
          <MagicksLogo className="h-[2.8rem] w-auto sm:h-12" />
        </Link>

        <div className="hidden items-center gap-2 md:flex lg:gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-ui text-[11px] font-medium text-white/68 magicks-duration-hover magicks-ease-out transition-colors hover:text-white lg:text-[13px]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={transitionMicro}>
            <Link
              to="/kontakt"
              className="font-ui liquid-glass inline-block rounded-full px-5 py-2 text-[14px] font-semibold text-white no-underline lg:text-[15px]"
            >
              Unverbindlich anfragen
            </Link>
          </motion.div>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full text-white md:hidden"
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
            className="pointer-events-auto fixed inset-0 z-40 bg-[#0A0A0A]/72 backdrop-blur-sm md:hidden"
            aria-label="Menü schließen"
            onClick={() => setMenuOpen(false)}
          />
          <div className="liquid-glass liquid-glass-nav pointer-events-auto relative z-50 layout-max mt-2 rounded-2xl p-3 md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-ui magicks-duration-hover magicks-ease-out flex min-h-[48px] items-center rounded-xl px-4 text-[15px] font-medium text-white/82 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/kontakt"
                className="font-ui mt-3 flex min-h-[52px] items-center justify-center rounded-full bg-white text-[15px] font-semibold text-black"
              >
                Unverbindlich anfragen
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
