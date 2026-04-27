import { useLocation } from "react-router-dom";
import { Hero } from "../components/home/Hero";
import { ValueStatement } from "../components/home/ValueStatement";
import { Services } from "../components/home/Services";
import { Bildwelt } from "../components/home/Bildwelt";
import { WhyMagicks } from "../components/home/WhyMagicks";
import { About } from "../components/home/About";
import { FinalCTA } from "../components/home/FinalCTA";
import { RouteSEO } from "../seo/RouteSEO";

export default function HomePage() {
  const location = useLocation();
  const isHeroOnly = new URLSearchParams(location.search).get("hero-only") === "true";

  if (isHeroOnly) {
    return (
      <main className="bg-transparent h-screen w-screen overflow-hidden">
        <Hero />
      </main>
    );
  }

  return (
    <>
      <RouteSEO path="/" />
      <main>
        <Hero />
        <ValueStatement />
        <Services />
        <Bildwelt />
        <WhyMagicks />
        <About />
        <FinalCTA />
      </main>
    </>
  );
}
