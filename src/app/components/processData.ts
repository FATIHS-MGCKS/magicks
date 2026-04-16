export type ProcessStep = {
  title: string;
  subtitle: string;
  /** Editorial line for the active phase */
  micro: string;
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Strategie",
    subtitle: "Wir verstehen Ihr Geschäft",
    micro: "Geschäftsmodell, Ziele und Prioritäten schärfen",
  },
  {
    title: "Konzept",
    subtitle: "Struktur & UX",
    micro: "Struktur, Nutzerführung und Systemlogik definieren",
  },
  {
    title: "Design",
    subtitle: "Conversion-orientiert",
    micro: "Wirkung, Klarheit und Conversion gezielt ausarbeiten",
  },
  {
    title: "Entwicklung",
    subtitle: "Skalierbar",
    micro: "Sauber umsetzen auf skalierbarer technischer Basis",
  },
  {
    title: "Integration",
    subtitle: "Systeme verbinden",
    micro: "Tools, Daten und Prozesse sinnvoll verbinden",
  },
  {
    title: "Skalierung",
    subtitle: "Wachstum ermöglichen",
    micro: "Systeme erweitern und Wachstum operativ ermöglichen",
  },
];
