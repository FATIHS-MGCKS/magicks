import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function SiteLayout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const run = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      requestAnimationFrame(() => requestAnimationFrame(run));
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <div
      className="magicks-light min-h-screen bg-[var(--magicks-bg-canvas)] font-sans text-[var(--magicks-text-1)]"
      // `overflow-x: clip` is the modern, paint-friendly choice (it does not
      // create a scroll container the way `hidden` does), but older Edge
      // builds — which still surface in the wild on managed corporate
      // Windows machines — fall back to `visible` and let off-canvas
      // decorative elements push the layout sideways. Setting `hidden`
      // first as a fallback and then upgrading to `clip` keeps Edge happy
      // without sacrificing anything on modern Chromium.
      style={{ overflowX: "hidden" }}
    >
      <div aria-hidden className="magicks-grain" />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
