import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { ContextualCrossLink } from "../../components/service/ContextualCrossLink";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { registerGsap } from "../../lib/gsap";
import { runRouteReveal } from "../../lib/routeReveal";
import { FaqJsonLd, type FaqItem } from "../../seo/FaqJsonLd";
import { RouteSEO } from "../../seo/RouteSEO";

type TextBlock = {
  title: string;
  text: string;
};

type BranchGroup = {
  code: string;
  title: string;
  items: string[];
};

type RelatedLink = {
  to: string;
  eyebrow: string;
  folio: string;
  lead: string;
  linkLabel: string;
};

const TRUST_CHIPS = [
  "3D",
  "Variantenlogik",
  "Anfrageprozess",
  "Technische Umsetzung",
] as const;

const VALUE_POINTS: TextBlock[] = [
  {
    title: "Varianten verständlich machen",
    text: "Optionen, Ausstattungen und Abhängigkeiten werden sichtbar, statt in langen Listen oder PDF-Tabellen zu verschwinden.",
  },
  {
    title: "Maße und Materialien erklären",
    text: "Kunden können Dimensionen, Materialien, Farben und Ausführungen im richtigen Zusammenhang auswählen.",
  },
  {
    title: "Auswahl sicherer führen",
    text: "Geführte Schritte reduzieren Unsicherheit und helfen, sinnvolle Kombinationen zu verstehen.",
  },
  {
    title: "Fehlanfragen reduzieren",
    text: "Wenn die Auswahl sauber vorbereitet wird, kommen Anfragen vollständiger und nachvollziehbarer im Vertrieb an.",
  },
  {
    title: "Vertrieb besser vorbereiten",
    text: "Konfiguration, Wünsche und Kontaktdaten können als Grundlage für Angebot, Beratung oder Rückfrage übergeben werden.",
  },
  {
    title: "Produkte hochwertiger präsentieren",
    text: "Interaktive Darstellung zeigt Qualität und Möglichkeiten, ohne das Produkt auf einen statischen Ausschnitt zu reduzieren.",
  },
];

const USE_CASES: TextBlock[] = [
  {
    title: "Ihre Produkte haben viele Varianten oder Optionen.",
    text: "Wenn Auswahlmöglichkeiten online schwer erklärbar sind, kann ein Konfigurator Ordnung schaffen.",
  },
  {
    title: "Maße, Farben, Materialien oder Ausstattungen müssen auswählbar sein.",
    text: "Der Konfigurator macht sichtbar, welche Entscheidungen zusammengehören und welche Kombinationen sinnvoll sind.",
  },
  {
    title: "Kunden stellen häufig ähnliche Rückfragen.",
    text: "Wiederkehrende Fragen können in der Auswahlführung aufgefangen werden, bevor der Vertrieb einsteigt.",
  },
  {
    title: "Statische Bilder erklären Ihr Produkt nicht ausreichend.",
    text: "Wenn Perspektive, Maß, Material oder Ausstattung wichtig sind, braucht die Darstellung mehr Kontext.",
  },
  {
    title: "Ihr Vertrieb braucht besser vorbereitete Anfragen.",
    text: "Anfragen können mit Varianten, Maßen, Wünschen und Kontaktdaten strukturiert übergeben werden.",
  },
  {
    title: "Individuelle Produkte sollen digital hochwertiger wirken.",
    text: "Ein Konfigurator kann Maßprodukte, B2B-Angebote und komplexe Varianten seriös online erklären.",
  },
  {
    title: "Konfiguration, Anfrage und Übergabe sollen verbunden werden.",
    text: "Die Auswahl endet nicht im Interface, sondern wird in Beratung, Angebot oder Systemübergabe weitergeführt.",
  },
];

const BRANCH_GROUPS: BranchGroup[] = [
  {
    code: "§ A",
    title: "Gebäudehülle & Außenraum",
    items: [
      "Wintergartenbauer",
      "Carport- und Vordachbauer",
      "Zaun- und Torbauer",
      "Rollladen- und Sonnenschutzbetriebe",
      "Insektenschutz-Anbieter",
      "Garagentor-Fachbetriebe",
      "Photovoltaik, Überdachung und Pergola",
    ],
  },
  {
    code: "§ B",
    title: "Innenausbau & Wohnraum",
    items: [
      "Treppen- und Geländerbauer",
      "Küchenstudios mit Maßanfertigung",
      "Badezimmerrenovierer",
      "Bodenleger, Parkett und Fliesen",
      "Möbel nach Maß und Einbauschränke",
    ],
  },
  {
    code: "§ C",
    title: "Spezialgewerke & Modulbau",
    items: [
      "Maler und Fassadenbetriebe",
      "Metallbau, Glasbau und Schlossereien",
      "Container-, Modulbau-, Gartenhaus- und Gartenraum-Anbieter",
    ],
  },
];

const DELIVERABLES: TextBlock[] = [
  {
    title: "Produktkonfiguratoren",
    text: "Für Produkte, die mit Standardseiten, PDF-Listen oder statischen Galerien nicht verständlich genug werden.",
  },
  {
    title: "3D-Produktkonfiguratoren",
    text: "Für Produkte, bei denen räumliche Darstellung echten Entscheidungswert schafft.",
  },
  {
    title: "Varianten- und Optionslogik",
    text: "Auswahlregeln, Abhängigkeiten, Pakete, Zubehör und sinnvolle Kombinationen werden sauber abgebildet.",
  },
  {
    title: "Maß-, Material-, Farb- und Ausstattungslogik",
    text: "Dimensionen und Eigenschaften werden so geführt, dass Kunden die Auswirkungen ihrer Auswahl verstehen.",
  },
  {
    title: "Interaktive Produktdarstellung",
    text: "2D, 3D, Bildlogik oder geführte Schritte werden nach Nutzen ausgewählt, nicht nach Effekt.",
  },
  {
    title: "Anfrage- und Angebotsflows",
    text: "Die fertige Konfiguration kann als Angebotsgrundlage, Anfrage, Warenkorb oder Beratungseinstieg weiterlaufen.",
  },
  {
    title: "Zusammenfassung der Konfiguration",
    text: "Kunden und Vertrieb sehen nachvollziehbar, was ausgewählt wurde und welche Informationen noch fehlen.",
  },
  {
    title: "Lead- und Vertriebsübergabe",
    text: "CRM, Formular, E-Mail oder interne Systeme können dort angebunden werden, wo sie den Prozess vereinfachen.",
  },
  {
    title: "Technische Web-Umsetzung",
    text: "Responsive, performant und so aufgebaut, dass Erweiterungen später möglich bleiben.",
  },
  {
    title: "Performance-Optimierung",
    text: "Interaktive Produktdarstellung muss schnell und stabil bleiben, besonders auf mobilen Geräten.",
  },
];

const SALES_FLOW_POINTS: TextBlock[] = [
  {
    title: "Konfigurierte Auswahl zusammenfassen",
    text: "Alle relevanten Varianten, Maße, Materialien und Optionen werden nachvollziehbar gebündelt.",
  },
  {
    title: "Kontaktdaten erfassen",
    text: "Der nächste Schritt bleibt klar, ohne den Nutzer mit unnötigen Formularfeldern zu verlieren.",
  },
  {
    title: "Anfrage übergeben",
    text: "E-Mail, CRM, Formular oder internes System erhalten eine strukturierte Grundlage statt loser Freitexte.",
  },
  {
    title: "Angebotsprozess vorbereiten",
    text: "Der Vertrieb sieht schneller, worum es geht, welche Auswahl getroffen wurde und wo Rückfragen nötig sind.",
  },
  {
    title: "Beratung erleichtern",
    text: "Kunden kommen mit einem konkreteren Bild in das Gespräch, nicht nur mit einer vagen Anfrage.",
  },
  {
    title: "Preisindikation zeigen, wenn sinnvoll",
    text: "Wo Regeln und Daten es erlauben, kann eine grobe Orientierung helfen. Nicht jedes Produkt braucht sofort einen Preis.",
  },
];

const CONFIG_TYPES: TextBlock[] = [
  {
    title: "3D-Konfigurator",
    text: "Für Produkte, bei denen Raum, Perspektive, Maß oder Varianten visuell verstanden werden müssen.",
  },
  {
    title: "2D- oder bildbasierter Konfigurator",
    text: "Für Auswahlprozesse, bei denen klare Bilder, Zustände oder Variantenansichten ausreichen.",
  },
  {
    title: "Schritt-für-Schritt-Auswahl",
    text: "Für komplexe Entscheidungen, die in sinnvoller Reihenfolge geführt werden sollten.",
  },
  {
    title: "Anfrage-Konfigurator",
    text: "Für Produkte, bei denen nicht der Checkout, sondern eine qualifizierte Anfrage das Ziel ist.",
  },
  {
    title: "Produktberater",
    text: "Für Angebote, bei denen Nutzer erst herausfinden müssen, welche Lösung zu ihrem Bedarf passt.",
  },
  {
    title: "Varianten- oder Paketlogik",
    text: "Für Zubehör, Pakete, Ausstattungen oder Kombinationen, die voneinander abhängen.",
  },
];

const DECISION_QUESTIONS = [
  "Welche Varianten sind relevant?",
  "Welche Maße, Materialien oder Farben müssen auswählbar sein?",
  "Welche Entscheidungen müssen nacheinander passieren?",
  "Wo brauchen Nutzer Orientierung?",
  "Welche Daten braucht Ihr Vertrieb?",
  "Was soll am Ende entstehen: Anfrage, Angebot, Bestellung oder Beratung?",
  "Welche Systeme müssen angebunden werden?",
] as const;

const AVOID_POINTS = [
  "Keinen Konfigurator ohne klaren Nutzen.",
  "Keine 3D-Demo, die den Anfrageprozess nicht verbessert.",
  "Keine unübersichtliche Variantenlogik.",
  "Keine Oberfläche, die beeindruckt, aber Nutzer nicht führt.",
  "Keine technische Lösung, die später schwer zu pflegen ist.",
  "Keine Funktionen, die im Vertrieb oder Alltag keinen echten Wert schaffen.",
] as const;

const FAQ_ITEMS: ReadonlyArray<FaqItem> = [
  {
    question: "Was ist ein Produktkonfigurator?",
    answer:
      "Ein Produktkonfigurator führt Nutzer durch Varianten, Maße, Materialien, Farben, Optionen oder Pakete und bereitet daraus eine Anfrage, Bestellung, Beratung oder Angebotsgrundlage vor.",
  },
  {
    question: "Wann lohnt sich ein 3D-Produktkonfigurator?",
    answer:
      "Ein 3D-Produktkonfigurator lohnt sich, wenn räumliche Darstellung, Dimensionen, Materialien oder Ausstattungen für die Entscheidung wichtig sind und statische Bilder nicht genug erklären.",
  },
  {
    question: "Muss ein Konfigurator immer in 3D sein?",
    answer:
      "Nein. Manche Produkte brauchen 3D, andere funktionieren besser mit 2D, Bildern, geführten Schritten oder einer klaren Anfrage-Logik. Die technische Form sollte dem Entscheidungsprozess dienen.",
  },
  {
    question: "Für welche Branchen eignet sich ein Produktkonfigurator?",
    answer:
      "Besonders geeignet sind Produkte mit Maß, Varianten oder Erklärungsbedarf: Bau-Branche, Wintergärten, Carports, Zäune, Vordächer, Möbel nach Maß, Küchen, Innenausbau, Modulbau oder technische Produkte.",
  },
  {
    question: "Kann ein Konfigurator Anfragen an CRM oder E-Mail übergeben?",
    answer:
      "Ja. Konfigurationen können per E-Mail, Formular, CRM oder an andere Systeme übergeben werden, wenn die Schnittstellen und der Prozess dafür definiert sind.",
  },
  {
    question: "Kann ein Produktkonfigurator Preise berechnen?",
    answer:
      "Ja, wenn Preisregeln, Daten und Variantenlogik sauber vorliegen. In manchen Fällen ist eine Preisindikation sinnvoller als ein verbindlicher Preis.",
  },
  {
    question: "Funktioniert ein Konfigurator auch mobil?",
    answer:
      "Ja. Ein Konfigurator sollte auf Desktop und Mobile funktionieren. Bei komplexen 3D- oder Variantenlogiken muss die mobile Führung besonders klar und performant geplant werden.",
  },
  {
    question: "Wie aufwendig ist ein Produktkonfigurator?",
    answer:
      "Der Aufwand hängt von Produktlogik, 3D- oder 2D-Darstellung, Datenlage, Integrationen und Anfrageprozess ab. Deshalb beginnt MAGICKS mit einer Analyse der Entscheidungen und Anforderungen.",
  },
  {
    question: "Kann MAGICKS bestehende Produktdaten oder Systeme anbinden?",
    answer:
      "Ja, wenn Datenstruktur und Schnittstellen es erlauben. Möglich sind Anbindungen an CRM, E-Mail, Formulare, Produktdaten, Kalkulationslogik oder andere Systeme.",
  },
];

const RELATED_LINKS: RelatedLink[] = [
  {
    to: "/shops-produktkonfiguratoren",
    eyebrow: "Commerce",
    folio: "Shops & Konfiguratoren",
    lead: "Wenn Produktpräsentation, Shop-Struktur, Anfragewege und Konfigurator als zusammenhängender Verkaufsprozess gedacht werden sollen.",
    linkLabel: "Shops & Konfiguratoren ansehen",
  },
  {
    to: "/web-software",
    eyebrow: "System",
    folio: "Web-Software",
    lead: "Wenn der Konfigurator Teil einer größeren Plattform, eines Portals oder einer individuellen Anwendung wird.",
    linkLabel: "Web-Software ansehen",
  },
  {
    to: "/ki-automationen-integrationen",
    eyebrow: "Automation",
    folio: "KI & Integrationen",
    lead: "Wenn hinter der Konfiguration Automationen, Anfrageverarbeitung, Systemverbindungen oder intelligente Workflows entstehen sollen.",
    linkLabel: "KI-Automationen ansehen",
  },
  {
    to: "/websites-landingpages",
    eyebrow: "Auftritt",
    folio: "Websites & Landingpages",
    lead: "Wenn der Konfigurator in einen hochwertigen Webauftritt mit klarer Nutzerführung eingebettet werden soll.",
    linkLabel: "Websites & Landingpages ansehen",
  },
  {
    to: "/leistungen",
    eyebrow: "Studio",
    folio: "Leistungen",
    lead: "Wenn Sie den gesamten MAGICKS-Rahmen aus Auftritt, Commerce, Web-Software und Automationen einordnen möchten.",
    linkLabel: "Leistungen ansehen",
  },
  {
    to: "/kontakt",
    eyebrow: "Direkt",
    folio: "Kontakt",
    lead: "Wenn ein konkretes Produkt, eine Variantenlogik oder ein Anfrageprozess bereits im Raum steht.",
    linkLabel: "Kontakt aufnehmen",
  },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)] sm:text-[10.75px]">
      {children}
    </p>
  );
}

function PrimaryCta({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--magicks-ink-strong)] py-3 pl-6 pr-3 font-ui text-[15px] font-[590] tracking-[-0.004em] text-[var(--magicks-bg-lifted)] no-underline shadow-[0_20px_54px_-34px_rgba(20,28,44,0.42)] transition-[transform,box-shadow,background-color] duration-500 hover:-translate-y-[1px] hover:shadow-[0_26px_64px_-36px_rgba(20,28,44,0.52)] active:translate-y-0 active:scale-[0.985] sm:text-[15.5px]"
    >
      <span>{label}</span>
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--magicks-bg-lifted-rgb)/0.12)] transition-transform duration-500 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
      >
        ↗
      </span>
    </Link>
  );
}

function SecondaryCta({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-[rgb(var(--magicks-line-rgb)/0.18)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.5)] px-5 py-3 font-ui text-[15px] font-[560] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.78)] no-underline transition-[border-color,transform,color,background-color] duration-500 hover:-translate-y-[1px] hover:border-[rgb(var(--magicks-line-rgb)/0.34)] hover:bg-[rgb(var(--magicks-bg-lifted-rgb)/0.82)] hover:text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[15.5px]"
    >
      <span>{label}</span>
      <span aria-hidden className="font-instrument italic transition-transform duration-500 group-hover:translate-x-[2px]">
        ↗
      </span>
    </Link>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div data-pk-reveal className="max-w-[62rem]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-ui mt-7 max-w-[23ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
        {title}
      </h2>
      {text ? (
        <p className="font-ui mt-7 max-w-[54rem] text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
          {text}
        </p>
      ) : null}
    </div>
  );
}

function InfoCard({ item, index }: { item: TextBlock; index?: number }) {
  return (
    <article
      data-pk-reveal
      className="rounded-[1.1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] p-5 shadow-[0_18px_52px_-44px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6"
    >
      {typeof index === "number" ? (
        <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.7)]">
          {String(index + 1).padStart(2, "0")}
        </p>
      ) : null}
      <h3 className="font-ui mt-3 text-[1.08rem] font-[620] leading-[1.28] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)] sm:text-[1.16rem]">
        {item.title}
      </h3>
      <p className="font-ui mt-3 text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
        {item.text}
      </p>
    </article>
  );
}

function SpecimenPlate() {
  return (
    <div className="relative overflow-hidden rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.66)] p-5 shadow-[0_24px_68px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.76)] sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(46,56,76,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(46,56,76,0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="relative">
        <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)]">
          SpecimenCube · H × B × T
        </p>
        <svg
          viewBox="0 0 280 210"
          className="mt-6 w-full"
          role="img"
          aria-label="Technische Skizze eines konfigurierbaren Produktwürfels mit Höhe, Breite und Tiefe"
        >
          <g stroke="rgb(24 28 37 / 0.14)" strokeWidth="0.8" fill="none">
            <path d="M 44 54 L 44 170" />
            <path d="M 40 54 L 48 54" />
            <path d="M 40 170 L 48 170" />
            <path d="M 60 188 L 170 188" />
            <path d="M 60 184 L 60 192" />
            <path d="M 170 184 L 170 192" />
            <path d="M 182 52 L 230 24" />
            <path d="M 178 48 L 186 56" />
            <path d="M 226 20 L 234 28" />
          </g>
          <g stroke="rgb(24 28 37 / 0.55)" strokeWidth="1.2" fill="none" strokeLinecap="round">
            <path data-pk-edge d="M 60 170 L 170 170" />
            <path data-pk-edge d="M 170 170 L 170 60" />
            <path data-pk-edge d="M 170 60 L 60 60" />
            <path data-pk-edge d="M 60 60 L 60 170" />
            <path data-pk-edge d="M 60 60 L 108 32" />
            <path data-pk-edge d="M 108 32 L 218 32" />
            <path data-pk-edge d="M 170 60 L 218 32" />
            <path data-pk-edge d="M 170 170 L 218 142" />
            <path data-pk-edge d="M 218 142 L 218 32" />
          </g>
          <g stroke="rgb(24 28 37 / 0.2)" strokeWidth="0.8" strokeDasharray="2 3" fill="none">
            <path d="M 108 142 L 218 142" />
            <path d="M 108 32 L 108 142" />
            <path d="M 60 170 L 108 142" />
          </g>
          <g fill="rgb(24 28 37 / 0.68)" className="font-mono" fontSize="9" letterSpacing="2">
            <text x="37" y="118" textAnchor="end">H</text>
            <text x="115" y="205" textAnchor="middle">B</text>
            <text x="226" y="51" textAnchor="start">T</text>
          </g>
          <g stroke="rgb(24 28 37 / 0.8)" strokeWidth="1" fill="none">
            <path d="M 170 54 L 170 66" />
            <path d="M 164 60 L 176 60" />
          </g>
          <circle data-pk-axis cx="170" cy="60" r="2.6" fill="rgb(122 96 66 / 0.82)" />
          <g fill="rgb(24 28 37 / 0.38)">
            <circle cx="60" cy="60" r="1.5" />
            <circle cx="60" cy="170" r="1.5" />
            <circle cx="170" cy="170" r="1.5" />
          </g>
        </svg>
        <div className="font-mono mt-4 grid grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)] items-center gap-4 text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.42)]">
          <span>Specimen No. 01</span>
          <span aria-hidden className="h-px bg-[rgb(var(--magicks-line-rgb)/0.16)]" />
          <span>Maß · Variante · Anfrage</span>
        </div>
      </div>
    </div>
  );
}

export default function ProduktkonfiguratorErstellenPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-pk-hero-item]");
      const reveals = gsap.utils.toArray<HTMLElement>("[data-pk-reveal]");
      const edges = gsap.utils.toArray<SVGPathElement>("[data-pk-edge]");
      const axis = root.querySelector<SVGCircleElement>("[data-pk-axis]");

      if (reduced) {
        gsap.set([...heroItems, ...reveals, ...edges, axis], {
          opacity: 1,
          y: 0,
          filter: "none",
          strokeDashoffset: 0,
          scale: 1,
        });
        return;
      }

      runRouteReveal({
        gsap,
        root,
        heroItems,
        revealItems: reveals,
        heroYOffset: 16,
        revealYOffset: 18,
        blur: 4,
        duration: 0.72,
        heroStagger: 0.055,
        revealStart: "top 88%",
      });

      edges.forEach((edge) => {
        const length = edge.getTotalLength();
        gsap.set(edge, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(edge, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power2.out",
          delay: 0.2,
        });
      });

      if (axis) {
        gsap.fromTo(
          axis,
          { scale: 0.5, opacity: 0.35, transformOrigin: "center" },
          {
            scale: 1,
            opacity: 1,
            duration: 0.78,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/produktkonfigurator-erstellen" />

      <main
        ref={rootRef}
        className="relative overflow-hidden bg-[var(--magicks-bg-base)] pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.25rem]"
      >
        <section
          data-pk-hero
          className="relative overflow-hidden px-5 pb-24 pt-8 sm:px-8 sm:pb-32 sm:pt-10 md:px-12 md:pb-40 lg:px-16 lg:pb-48"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 58% 46% at 18% 18%, rgba(166,138,98,0.15), transparent 72%), radial-gradient(ellipse 52% 40% at 84% 36%, rgba(118,132,150,0.11), transparent 74%), radial-gradient(ellipse 74% 44% at 50% 94%, rgba(255,255,255,0.58), transparent 76%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.28]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(46,56,76,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(46,56,76,0.035) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 42%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 42%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.66fr)] lg:items-end lg:gap-16">
                <div>
                  <div data-pk-hero-item>
                    <Eyebrow>Produktkonfigurator erstellen lassen</Eyebrow>
                  </div>

                  <h1
                    data-pk-hero-item
                    className="font-ui mt-7 max-w-[18ch] text-[2.42rem] font-[650] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.35rem] md:text-[4.42rem] lg:text-[5.1rem]"
                  >
                    Produktkonfiguratoren, die Varianten verständlich machen und
                    Anfragen besser vorbereiten.
                  </h1>

                  <p
                    data-pk-hero-item
                    className="font-ui mt-8 max-w-[52rem] text-[1.03rem] font-[480] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.1rem] md:text-[1.18rem]"
                  >
                    MAGICKS entwickelt Produktkonfiguratoren und 3D-Konfiguratoren,
                    die Maße, Varianten, Materialien, Farben und Optionen
                    verständlich machen — damit Kunden sicherer auswählen und
                    Anfragen strukturierter bei Ihnen ankommen.
                  </p>

                  <div
                    data-pk-hero-item
                    className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12"
                  >
                    <PrimaryCta to="/kontakt" label="Produktkonfigurator besprechen" />
                    <SecondaryCta
                      to="/shops-produktkonfiguratoren"
                      label="Mehr zu Shops & Konfiguratoren"
                    />
                  </div>

                  <div
                    data-pk-hero-item
                    className="mt-8 flex max-w-[54rem] flex-wrap gap-2.5"
                  >
                    {TRUST_CHIPS.map((chip) => (
                      <span
                        key={chip}
                        className="font-ui rounded-full border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.62)] px-3 py-2 text-[13.2px] font-[560] leading-none text-[rgb(var(--magicks-ink-rgb)/0.7)] shadow-[inset_0_1px_0_rgba(255,255,255,0.68)]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div data-pk-hero-item>
                  <SpecimenPlate />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
                <SectionIntro
                  eyebrow="Mehr als 3D-Effekt"
                  title="Ein Produktkonfigurator ist mehr als ein 3D-Effekt."
                />
                <div data-pk-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Ein guter Konfigurator macht Produkte nicht nur sichtbar. Er
                    macht Auswahl verständlich. Nutzer sehen Varianten, Maße,
                    Materialien oder Optionen im richtigen Zusammenhang und
                    können Schritt für Schritt zu einer sinnvollen Anfrage oder
                    Bestellung geführt werden.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {VALUE_POINTS.map((item, index) => (
                  <InfoCard key={item.title} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <SectionIntro
                eyebrow="Wann ein Produktkonfigurator sinnvoll ist"
                title="Wenn Auswahl, Maß und Erklärung digital geführt werden müssen."
                text="Ein Konfigurator lohnt sich nicht wegen der Technik allein, sondern wenn er Entscheidungen klarer macht und den Anfrage- oder Angebotsprozess verbessert."
              />

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {USE_CASES.map((item, index) => (
                  <InfoCard key={item.title} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <SectionIntro
                eyebrow="Branchenatlas"
                title="Für Bau-Branche, Maßprodukte und erklärungsbedürftige Angebote."
                text="Diese Beispiele zeigen typische Fälle. Entscheidend ist nicht die Branche allein, sondern ob Ihr Produkt Auswahl, Maß, Varianten oder Erklärung braucht."
              />

              <div className="mt-12 grid gap-5 lg:grid-cols-3">
                {BRANCH_GROUPS.map((group) => (
                  <article
                    key={group.title}
                    data-pk-reveal
                    className="rounded-[1.2rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] p-5 shadow-[0_20px_58px_-48px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6"
                  >
                    <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.7)]">
                      {group.code}
                    </p>
                    <h3 className="font-ui mt-3 text-[1.2rem] font-[620] leading-[1.22] tracking-[-0.014em] text-[rgb(var(--magicks-ink-rgb)/0.93)]">
                      {group.title}
                    </h3>
                    <ul className="mt-5 grid gap-3">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="font-ui rounded-[0.85rem] border border-[rgb(var(--magicks-line-rgb)/0.09)] bg-[rgb(var(--magicks-bg-base-rgb)/0.5)] px-4 py-3 text-[14.2px] font-[560] leading-[1.45] text-[rgb(var(--magicks-ink-rgb)/0.68)]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <SectionIntro
                eyebrow="Was MAGICKS für Sie umsetzt"
                title="Konfiguratoren mit Produktlogik, Darstellung und sauberem Anschlussprozess."
                text="Die Umsetzung verbindet Auswahlführung, Darstellung, technische Logik und den nächsten Schritt im Vertrieb."
              />

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {DELIVERABLES.map((item, index) => (
                  <InfoCard key={item.title} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
                <SectionIntro
                  eyebrow="Von Auswahl zur Anfrage"
                  title="Der wichtigste Moment ist nicht die Animation. Es ist die Anfrage."
                />
                <div data-pk-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Ein Konfigurator entfaltet seinen Wert, wenn die Auswahl am
                    Ende sauber weitergeführt wird: als strukturierte Anfrage,
                    Angebotsgrundlage, Warenkorb, Termin, Beratungsgespräch
                    oder Vertriebsübergabe. Deshalb plant MAGICKS nicht nur die
                    Oberfläche, sondern auch den nächsten Schritt.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {SALES_FLOW_POINTS.map((item, index) => (
                  <InfoCard key={item.title} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:gap-16">
                <SectionIntro
                  eyebrow="3D, 2D oder geführte Auswahl"
                  title="Nicht jedes Produkt braucht 3D. Aber jedes Produkt braucht Klarheit."
                />
                <div data-pk-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Manche Produkte profitieren stark von einer räumlichen
                    3D-Darstellung. Andere brauchen vor allem eine klare
                    Variantenlogik, gute Bilder, geführte Schritte oder eine
                    saubere Anfrageführung. MAGICKS entscheidet die technische
                    Form nicht nach Effekt, sondern danach, was Nutzern und
                    Vertrieb wirklich hilft.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {CONFIG_TYPES.map((item, index) => (
                  <InfoCard key={item.title} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div
                data-pk-reveal
                className="rounded-[1.65rem] border border-[rgb(var(--magicks-line-rgb)/0.11)] bg-[linear-gradient(160deg,rgba(255,255,255,0.78)_0%,rgba(246,242,233,0.64)_100%)] p-6 shadow-[0_24px_72px_-54px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.78)] sm:p-8 md:p-10"
              >
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
                  <div>
                    <Eyebrow>Wie MAGICKS Produktkonfiguratoren denkt</Eyebrow>
                    <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.65rem] md:text-[3.25rem]">
                      Wir starten nicht mit Technik. Wir starten mit der Entscheidung.
                    </h2>
                  </div>
                  <div className="lg:pt-14">
                    <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                      Bevor ein Konfigurator gestaltet oder entwickelt wird, muss
                      klar sein, welche Entscheidungen Nutzer treffen müssen,
                      welche Optionen voneinander abhängen und welches Ergebnis
                      am Ende entstehen soll.
                    </p>
                  </div>
                </div>

                <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {DECISION_QUESTIONS.map((question) => (
                    <li
                      key={question}
                      className="font-ui rounded-[0.9rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.54)] px-4 py-3 text-[14.5px] font-[560] leading-[1.5] text-[rgb(var(--magicks-ink-rgb)/0.68)]"
                    >
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <SectionIntro
                eyebrow="Was wir bewusst vermeiden"
                title="Ein Konfigurator muss führen, nicht nur beeindrucken."
              />

              <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AVOID_POINTS.map((line) => (
                  <li
                    key={line}
                    data-pk-reveal
                    className="rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] p-5 shadow-[0_18px_48px_-42px_rgba(20,28,44,0.24),inset_0_1px_0_rgba(255,255,255,0.72)]"
                  >
                    <p className="font-ui text-[1rem] font-[610] leading-[1.34] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.88)]">
                      {line}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <SectionIntro
                eyebrow="Häufige Fragen"
                title="Was Unternehmen vor einem Produktkonfigurator wissen möchten."
                text="Kurze Antworten zu 3D, Variantenlogik, Preisen, CRM-Anbindung, Mobile und Projektaufwand."
              />

              <ol className="mt-12 border-t border-[rgb(var(--magicks-line-rgb)/0.12)]">
                {FAQ_ITEMS.map((item, index) => (
                  <li
                    key={item.question}
                    data-pk-reveal
                    className="border-b border-[rgb(var(--magicks-line-rgb)/0.12)]"
                  >
                    <details className="group/pkfaq">
                      <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-5 py-6 outline-none [&::-webkit-details-marker]:hidden md:gap-x-8 md:py-7">
                        <span className="font-mono pt-[0.32rem] text-[10.5px] font-medium leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.68)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-ui text-[1.08rem] font-[620] leading-[1.28] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)] md:text-[1.22rem]">
                          {item.question}
                        </h3>
                        <span
                          aria-hidden
                          className="font-instrument self-center text-[1.4rem] italic leading-none text-[rgb(var(--magicks-ink-rgb)/0.5)] transition-transform duration-500 group-open/pkfaq:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-5 pb-7 md:gap-x-8">
                        <span aria-hidden />
                        <p className="font-ui max-w-[50rem] text-[14.6px] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.66)] md:text-[15px]">
                          {item.answer}
                        </p>
                        <span aria-hidden />
                      </div>
                    </details>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <FaqJsonLd id="produktkonfigurator-erstellen" items={FAQ_ITEMS} />
        </section>

        <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16 lg:py-32">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem] space-y-12 sm:space-y-14 md:space-y-16">
              {RELATED_LINKS.map((item) => (
                <div key={item.to} data-pk-reveal>
                  <ContextualCrossLink
                    eyebrow={item.eyebrow}
                    folio={item.folio}
                    lead={item.lead}
                    linkLabel={item.linkLabel}
                    to={item.to}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[var(--magicks-bg-soft)] px-5 pb-24 pt-24 sm:px-8 sm:pb-32 sm:pt-32 md:px-12 md:pb-40 md:pt-40 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 62% 46% at 24% 20%, rgba(166,138,98,0.13), transparent 74%), radial-gradient(ellipse 52% 40% at 80% 76%, rgba(104,132,164,0.1), transparent 76%)",
            }}
          />
          <div className="relative layout-max">
            <div
              data-pk-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow>Nächster Schritt</Eyebrow>
              <h2 className="font-ui mx-auto mt-7 max-w-[22ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.9rem]">
                Bereit für einen Produktkonfigurator, der Auswahl verständlich macht?
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[50rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Lassen Sie uns klären, welche Varianten, Maße, Optionen und
                Anfragewege Ihr Produkt braucht — und ob 3D, eine geführte
                Auswahl oder ein individueller Konfigurator der richtige Weg ist.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta to="/kontakt" label="Produktkonfigurator besprechen" />
                <SecondaryCta to="/kontakt" label="Kontakt aufnehmen" />
              </div>

              <p className="font-ui mt-8 text-[14px] leading-[1.6] text-[rgb(var(--magicks-ink-rgb)/0.62)] sm:text-[14.5px]">
                Oder direkt:
                <a
                  href="mailto:hello@magicks.de"
                  className="ml-2 text-[rgb(var(--magicks-ink-rgb)/0.92)] no-underline underline decoration-[rgb(var(--magicks-line-rgb)/0.36)] underline-offset-[4px] hover:text-[rgb(var(--magicks-ink-rgb)/1)]"
                >
                  hello@magicks.de
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
