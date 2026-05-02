import { Hero } from "../components/home/Hero";
import { ValueStatement } from "../components/home/ValueStatement";
import { Services } from "../components/home/Services";
import { Bildwelt } from "../components/home/Bildwelt";
import { WhyMagicks } from "../components/home/WhyMagicks";
import { About } from "../components/home/About";
import { FinalCTA } from "../components/home/FinalCTA";
import { RouteSEO } from "../seo/RouteSEO";

export default function HomePage() {
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
