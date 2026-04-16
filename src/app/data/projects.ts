export type ProjectCategory =
  | "Website"
  | "Landingpage"
  | "Konfigurator"
  | "Shop"
  | "Dashboard"
  | "Web Software"
  | "Automation / KI";

export type ProjectMetric = { value: string; label: string };

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  /** Short line for grids */
  teaser: string;
  ausgangslage: string;
  entwicklung: string;
  fokus: string[];
  ergebnis: string;
  problem: string;
  solution: string;
  metrics: ProjectMetric[];
  image: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "regionaler-anbieter-leads",
    title: "Regionaler Anbieter: mehr qualifizierte Anfragen",
    category: "Website",
    teaser: "Klarheit statt Streuverkehr — Anfragen mit Absicht.",
    ausgangslage:
      "Viele Besucher, aber wenige konkrete Kontaktaufnahmen. Die nächsten Schritte wirkten für Nutzerinnen und Nutzer unscharf.",
    entwicklung:
      "Neue Seitenlogik mit klarer Nutzerführung und einem Anfrage-Flow, der Vertrauen vor dem Klick aufbaut — inhaltlich und technisch aus einem Guss.",
    fokus: ["Informationsarchitektur", "Conversion-orientiertes Design", "Performante Umsetzung"],
    ergebnis:
      "Mehr qualifizierte Anfragen bei klarerer Erwartung — das Team bekommt weniger Rückfragen und mehr Gespräche mit Substanz.",
    problem: "Viele Besucher, aber wenige konkrete Kontaktaufnahmen — die nächsten Schritte waren unklar.",
    solution: "Neue Seitenlogik mit klarer Nutzerführung und einem Anfrage-Flow, der Vertrauen vor dem Klick aufbaut.",
    metrics: [
      { value: "+240%", label: "Leads" },
      { value: "−60%", label: "Time-to-Lead" },
    ],
    image:
      "https://images.unsplash.com/photo-1768720407005-969ca95b5546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    slug: "konfigurator-vertrieb",
    title: "Konfigurator-Vertrieb: weniger manuelle Nacharbeit",
    category: "Konfigurator",
    teaser: "Strukturierte Anfragen statt unlesbarer E-Mails.",
    ausgangslage:
      "Anfragen kamen unstrukturiert an; der Vertrieb musste jeden Fall einzeln aufbereiten — mit wiederkehrendem Aufwand.",
    entwicklung:
      "Geführte Konfiguration mit konsistentem Datenexport und klarer Übergabe ins Team — von der Auswahl bis zur Übergabe.",
    fokus: ["Regelbasierte Logik", "Export & Schnittstellen", "Reduzierte Fehlerquellen"],
    ergebnis:
      "Weniger manuelle Nacharbeit, schnellere Angebote — und ein gemeinsames Bild dessen, was der Kunde wirklich will.",
    problem: "Anfragen kamen unstrukturiert an; Vertrieb musste jeden Fall einzeln aufbereiten.",
    solution: "Geführte Konfiguration mit konsistentem Datenexport und klarer Übergabe ins Team.",
    metrics: [
      { value: "−45%", label: "Bearbeitungszeit" },
      { value: "+180%", label: "abgeschlossene Konfigurationen" },
    ],
    image:
      "https://images.unsplash.com/photo-1730303827725-6cc9143877e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    slug: "steuerungspanel-operations",
    title: "Operatives Steuerungspanel statt Tabellen-Inseln",
    category: "Dashboard",
    teaser: "Ein gemeinsamer Überblick — ohne Datenjagd vor Meetings.",
    ausgangslage:
      "Kennzahlen und Aufträge verteilt auf mehrere Quellen — Meetings starteten mit Datenjagd statt mit Entscheidungen.",
    entwicklung:
      "Ein gemeinsames Portal mit Rollen, Live-Status und automatisierten Übersichten — so dass Teams dieselbe Realität sehen.",
    fokus: ["Rollen & Rechte", "Status-Logik", "Automatisierte Reports"],
    ergebnis:
      "Weniger manueller Abgleich, schnellere Entscheidungen — und weniger Reibung zwischen Front- und Backoffice.",
    problem: "Kennzahlen und Aufträge verteilt — Meetings starteten mit Datenjagd statt mit Entscheidungen.",
    solution: "Ein gemeinsames Portal mit Rollen, Live-Status und automatisierten Übersichten.",
    metrics: [
      { value: "−70%", label: "manueller Aufwand" },
      { value: "Echtzeit", label: "Team-Status" },
    ],
    image:
      "https://images.unsplash.com/photo-1702479744062-1880502275b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
