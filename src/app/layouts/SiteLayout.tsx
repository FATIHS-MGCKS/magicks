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
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-zinc-100" style={{ overflowX: "clip" }}>
      <div aria-hidden className="magicks-grain" />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
