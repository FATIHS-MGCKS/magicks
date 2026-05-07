import { Hero } from "../components/home/Hero";
import { ValueStatement } from "../components/home/ValueStatement";
import { ProblemSection } from "../components/home/ProblemSection";
import { About } from "../components/home/About";
import { Services } from "../components/home/Services";
import { Bildwelt } from "../components/home/Bildwelt";
import { FinalCTA } from "../components/home/FinalCTA";
import { RouteSEO } from "../seo/RouteSEO";

export default function HomePage() {
  return (
    <>
      <RouteSEO path="/" />
      <main>
        <Hero />
        <ValueStatement />
        <ProblemSection />
        <About />
        <Services />
        <Bildwelt />
        <FinalCTA />
      </main>
    </>
  );
}
