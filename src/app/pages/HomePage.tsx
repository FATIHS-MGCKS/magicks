import { useEffect } from "react";
import { Hero } from "../components/Hero";
import { ThinkingSection } from "../components/ThinkingSection";
import { Services } from "../components/Services";
import { Process } from "../components/Process";
import { CaseStudies } from "../components/CaseStudies";
import { HomePositionSection } from "../components/HomePositionSection";
import { HomeCapabilitySection } from "../components/HomeCapabilitySection";
import { CtaSection } from "../components/CtaSection";

export default function HomePage() {
  useEffect(() => {
    document.title = "MAGICKS — Digitale Markenauftritte & Lösungen";
  }, []);

  return (
    <main>
      <Hero />
      <ThinkingSection />
      <Services />
      <Process />
      <CaseStudies />
      <HomePositionSection />
      <HomeCapabilitySection />
      <CtaSection />
    </main>
  );
}
