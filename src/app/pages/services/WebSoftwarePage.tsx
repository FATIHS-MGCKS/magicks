import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { runRouteReveal } from "../../lib/routeReveal";
import { RouteSEO } from "../../seo/RouteSEO";
import { ContextualCrossLink } from "../../components/service/ContextualCrossLink";
import { EditorialAnchor } from "../../components/service/EditorialAnchor";
import { SERVICE_PAGE_IMAGES } from "../../data/imageWorld";

type BenefitPoint = {
  title: string;
  text: string;
};

type AudienceCase = {
  title: string;
  text: string;
};

type Deliverable = {
  title: string;
  text: string;
};

type WorkflowStep = {
  title: string;
  text: string;
};

const STANDARD_TOOL_LIMITS: BenefitPoint[] = [
  {
    title: "Tabellen ersetzen keine Prozesse",
    text: "Listen können Daten sammeln, aber sie führen selten sauber durch Zuständigkeiten, Status und nächste Schritte.",
  },
  {
    title: "E-Mails ersetzen keine klare Zuständigkeit",
    text: "Wichtige Entscheidungen verschwinden schnell in Verläufen, Anhängen und Rückfragen.",
  },
  {
    title: "Tool-Chaos erzeugt doppelte Arbeit",
    text: "Wenn Systeme nicht zusammenspielen, werden Daten mehrfach gepflegt und Abläufe unnötig langsam.",
  },
  {
    title: "Verteilte Daten erschweren Entscheidungen",
    text: "Teams brauchen verlässliche Übersichten, statt Informationen in mehreren Anwendungen suchen zu müssen.",
  },
  {
    title: "Manuelle Schritte bremsen Wachstum",
    text: "Was bei wenigen Vorgängen funktioniert, wird bei mehr Volumen schnell zur operativen Belastung.",
  },
  {
    title: "Standardsoftware passt nicht immer zum realen Ablauf",
    text: "Manche Prozesse brauchen eine Anwendung, die Rollen, Daten und Logik präziser abbildet.",
  },
];

const AUDIENCE_CASES: AudienceCase[] = [
  {
    title: "Ihre Teams arbeiten zu viel mit Tabellen, E-Mails oder manuellen Listen.",
    text: "Abläufe sind vorhanden, aber nicht sauber digital geführt.",
  },
  {
    title: "Informationen liegen in mehreren Tools verteilt.",
    text: "Daten müssen gesucht, kopiert oder manuell zusammengeführt werden.",
  },
  {
    title: "Kunden, Mitarbeiter oder Partner brauchen ein eigenes Portal.",
    text: "Zugriff, Status, Dokumente, Aufgaben oder Anfragen sollen zentral erreichbar sein.",
  },
  {
    title: "Sie möchten Status, Aufgaben, Daten oder Vorgänge übersichtlich sichtbar machen.",
    text: "Dashboards und operative Übersichten schaffen Klarheit für Entscheidungen.",
  },
  {
    title: "Ihr Prozess passt nicht sauber in Standardsoftware.",
    text: "Die Realität Ihres Unternehmens ist genauer als die Vorgaben eines fertigen Tools.",
  },
  {
    title: "Sie brauchen Rollen, Rechte, Workflows und Datenlogik.",
    text: "Nicht jeder Nutzer darf alles sehen, bearbeiten oder freigeben.",
  },
  {
    title: "Sie möchten Abläufe digitalisieren, ohne ein überladenes System einzuführen.",
    text: "Die Anwendung soll entlasten, nicht neue Komplexität erzeugen.",
  },
];

const DELIVERABLES: Deliverable[] = [
  {
    title: "Kundenportale",
    text: "Damit Kunden Status, Dokumente, Anfragen oder nächste Schritte an einem klaren Ort finden.",
  },
  {
    title: "Mitarbeiter- und Partnerportale",
    text: "Für geregelten Zugriff auf Informationen, Aufgaben, Freigaben oder gemeinsame Abläufe.",
  },
  {
    title: "Interne Dashboards",
    text: "Damit Teams Daten, Vorgänge und Kennzahlen schneller verstehen und priorisieren können.",
  },
  {
    title: "Admin-Systeme",
    text: "Für gepflegte Daten, nachvollziehbare Verwaltung und weniger manuelle Einzelarbeit.",
  },
  {
    title: "Buchungs- und Anfrageprozesse",
    text: "Damit Eingaben strukturiert ankommen und direkt weiterverarbeitet werden können.",
  },
  {
    title: "Freigabe- und Statusworkflows",
    text: "Damit Zuständigkeiten, Entscheidungen und Bearbeitungsstände sichtbar bleiben.",
  },
  {
    title: "Datenverwaltung und Übersichten",
    text: "Für zentrale Daten, klare Filter, Listen, Detailansichten und verlässliche Auswertungen.",
  },
  {
    title: "Rollen- und Rechtekonzepte",
    text: "Damit Nutzer nur sehen und bearbeiten, was für ihre Aufgabe relevant ist.",
  },
  {
    title: "CRM-nahe Tools",
    text: "Für Lead-, Kunden- oder Projektprozesse, die näher am tatsächlichen Vertrieb oder Betrieb liegen.",
  },
  {
    title: "Schnittstellen und API-Anbindungen",
    text: "Damit bestehende Systeme nicht isoliert bleiben und Daten sinnvoll fließen.",
  },
  {
    title: "Individuelle Plattformen",
    text: "Für digitale Systeme, die mehrere Rollen, Module und Abläufe zusammenführen.",
  },
  {
    title: "Reporting- und Analyseansichten",
    text: "Damit relevante Entwicklungen sichtbar werden, statt im Tagesgeschäft unterzugehen.",
  },
  {
    title: "Responsive Web-Anwendungen",
    text: "Damit wichtige Aufgaben auf Desktop, Tablet und Mobile sauber funktionieren.",
  },
  {
    title: "Hosting, Wartung und Weiterentwicklung",
    text: "Auf Wunsch begleiten wir Betrieb, Analyse, Anpassungen und sinnvolle Erweiterungen nach dem Launch.",
  },
];

const PROCESS_QUESTIONS = [
  "Wer nutzt die Anwendung?",
  "Welche Rollen und Rechte gibt es?",
  "Welche Daten müssen sichtbar oder bearbeitbar sein?",
  "Welche Schritte sollen automatisiert werden?",
  "Welche Systeme müssen angebunden werden?",
  "Welche Entscheidungen soll die Software erleichtern?",
] as const;

const INTEGRATION_POINTS = [
  "CRM-Anbindungen",
  "API-Schnittstellen",
  "Formular- und Anfrageflows",
  "Kalender- oder Buchungslogik",
  "Benachrichtigungen",
  "Reports",
  "Datenimporte und Exporte",
  "Automatisierte Folgeprozesse",
] as const;

const AVOID_POINTS = [
  "Kein überladenes Tool ohne klare Logik.",
  "Keine Oberfläche, die gut aussieht, aber den Prozess nicht trägt.",
  "Keine halbfertige Sonderlösung, die später nur Probleme macht.",
  "Keine Software ohne nachvollziehbare Struktur.",
  "Keine Funktionen, die niemand im Alltag wirklich braucht.",
  "Keine technische Lösung, die Ihr Team unnötig abhängig macht.",
] as const;

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    title: "Verstehen",
    text: "Wir analysieren Ziel, Nutzer, Rollen, Daten, Abläufe und bestehende Werkzeuge.",
  },
  {
    title: "Strukturieren",
    text: "Wir übersetzen den Prozess in klare Module, Zustände, Rechte und Informationsflüsse.",
  },
  {
    title: "Konzipieren",
    text: "Wir entwickeln Logik, Seitenstruktur und Nutzerführung, bevor visuelle Details entstehen.",
  },
  {
    title: "Gestalten",
    text: "Das Interface macht komplexe Abläufe verständlich, bedienbar und hochwertig.",
  },
  {
    title: "Entwickeln",
    text: "Die Anwendung wird sauber, responsiv, performant und erweiterbar umgesetzt.",
  },
  {
    title: "Verbinden",
    text: "Schnittstellen, Datenquellen und Automationen werden dort integriert, wo sie echten Nutzen schaffen.",
  },
  {
    title: "Optimieren",
    text: "Nach dem Launch können Analyse, Anpassungen und Weiterentwicklung folgen.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3 rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.22)] bg-[rgb(var(--magicks-accent-rgb)/0.07)] px-3 py-2 font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.78)] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] sm:text-[11px] sm:tracking-[0.22em]">
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--magicks-accent-rgb)/0.72)]"
      />
      {children}
    </span>
  );
}

function PrimaryCta({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="group relative inline-flex min-h-12 items-center gap-3 rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.24)] bg-[linear-gradient(180deg,rgba(255,253,249,0.96)_0%,rgba(244,238,227,0.9)_100%)] py-2.5 pl-6 pr-2 font-ui text-[15.5px] font-[600] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.92)] no-underline shadow-[0_22px_62px_-42px_rgba(20,28,44,0.46),inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(148,124,92,0.12)] transition-[transform,box-shadow,border-color] duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1.5px] hover:border-[rgb(var(--magicks-accent-line-rgb)/0.4)] hover:shadow-[0_32px_82px_-40px_rgba(20,28,44,0.52),inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-1px_0_rgba(148,124,92,0.16)] active:translate-y-0 active:scale-[0.99] sm:pl-7 sm:pr-2.5 sm:text-[16px] md:text-[16.5px]"
    >
      <span>{label}</span>
      <span
        aria-hidden
        className="ml-1 h-5 w-px bg-[rgb(var(--magicks-accent-rgb)/0.22)] transition-colors duration-[720ms] group-hover:bg-[rgb(var(--magicks-accent-rgb)/0.42)] sm:h-6"
      />
      <span
        aria-hidden
        className="font-instrument flex h-8 w-8 items-center justify-center rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.34)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.9)] text-[1.05em] italic text-[rgb(var(--magicks-ink-rgb)/0.88)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-transform duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px] group-hover:translate-x-[3px]"
      >
        {"\u2197\uFE0E"}
      </span>
    </Link>
  );
}

function SystemSchema() {
  const modules = [
    { label: "Rollen", meta: "Wer darf was?" },
    { label: "Daten", meta: "Was ist relevant?" },
    { label: "Workflow", meta: "Was passiert wann?" },
    { label: "Interface", meta: "Wie wird es nutzbar?" },
  ] as const;

  return (
    <div className="w-full" aria-label="Visualisierte Struktur einer Web-Anwendung">
      <div className="rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.62)] p-5 shadow-[0_24px_68px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.74)] sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)]">
            Prozessschema
          </span>
          <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.38)]">
            4 Module · 1 Ablauf
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {modules.map((module, index) => (
            <article
              key={module.label}
              data-ws-module
              className="relative min-h-[7.2rem] rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.58)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.66)]"
            >
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.62)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-ui mt-4 text-[1.05rem] font-[620] leading-[1.2] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                {module.label}
              </h3>
              <p className="font-ui mt-2 text-[13.5px] leading-[1.55] text-[rgb(var(--magicks-ink-rgb)/0.58)]">
                {module.meta}
              </p>
              <span
                aria-hidden
                className="absolute right-3 top-3 h-2 w-2 border-r border-t border-[rgb(var(--magicks-line-rgb)/0.22)]"
              />
            </article>
          ))}
        </div>

        <div className="font-mono mt-5 flex items-start justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-ink-rgb)/0.38)] sm:text-[10px]">
          <span>Eingang</span>
          <span className="text-[rgb(var(--magicks-ink-rgb)/0.58)]">Ablauf wird nutzbar</span>
          <span>Ausgabe</span>
        </div>
      </div>
    </div>
  );
}

export default function WebSoftwarePage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-ws-hero-item]");
      const modules = gsap.utils.toArray<HTMLElement>("[data-ws-module]");
      const reveals = gsap.utils.toArray<HTMLElement>("[data-ws-reveal]");

      if (reduced) {
        gsap.set([...heroItems, ...modules, ...reveals], {
          opacity: 1,
          y: 0,
          scale: 1,
        });
        return;
      }

      runRouteReveal({
        gsap,
        root,
        heroItems,
        revealItems: reveals,
      });

      gsap.fromTo(
        modules,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.08,
          ease: "power2.out",
        },
      );

    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/web-software" />

      <main
        ref={rootRef}
        className="relative overflow-hidden bg-[var(--magicks-bg-base)] pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.25rem]"
      >
        <section
          data-ws-hero
          className="relative overflow-hidden px-5 pb-24 pt-8 sm:px-8 sm:pb-32 sm:pt-10 md:px-12 md:pb-40 lg:px-16 lg:pb-48"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 58% 46% at 18% 18%, rgba(166,138,98,0.14), transparent 72%), radial-gradient(ellipse 52% 40% at 82% 36%, rgba(104,132,164,0.13), transparent 74%), radial-gradient(ellipse 74% 44% at 50% 94%, rgba(255,255,255,0.58), transparent 76%)",
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
                  <div data-ws-hero-item>
                    <Eyebrow>Web-Software</Eyebrow>
                  </div>

                  <h1
                    data-ws-hero-item
                    className="font-ui mt-7 max-w-[17ch] text-[2.42rem] font-[630] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.35rem] md:text-[4.42rem] lg:text-[5.1rem]"
                  >
                    Web-Software, die Prozesse klarer macht und Teams
                    entlastet.
                  </h1>

                  <p
                    data-ws-hero-item
                    className="font-ui mt-8 max-w-[50rem] text-[1.03rem] font-[480] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.1rem] md:text-[1.18rem]"
                  >
                    MAGICKS entwickelt Portale, Dashboards, interne Tools und
                    individuelle Web-Anwendungen, die Abläufe strukturieren,
                    Informationen zugänglich machen und Teams im Alltag spürbar
                    entlasten.
                  </p>

                  <div
                    data-ws-hero-item
                    className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12"
                  >
                    <PrimaryCta to="/kontakt" label="Web-Software-Projekt besprechen" />
                    <a
                      href="#leistungen-ansehen"
                      className="group inline-flex min-h-11 items-center gap-2 px-2 font-ui text-[15px] font-[560] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.74)] no-underline transition-colors duration-500 hover:text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[15.5px]"
                    >
                      <span className="relative pb-1">
                        Leistungen ansehen
                        <span
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-px bg-[rgb(var(--magicks-line-rgb)/0.28)] transition-colors duration-500 group-hover:bg-[rgb(var(--magicks-line-rgb)/0.62)]"
                        />
                      </span>
                      <span aria-hidden className="font-instrument text-[1.04em] italic">
                        ↓
                      </span>
                    </a>
                  </div>
                </div>

                <aside data-ws-hero-item className="lg:mb-2">
                  <SystemSchema />
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
                <div data-ws-reveal>
                  <Eyebrow>Wenn Standard-Tools nicht mehr reichen</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[17ch] text-[2.1rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.85rem] md:text-[3.55rem]">
                    Wenn Standard-Tools nicht mehr reichen.
                  </h2>
                </div>

                <div data-ws-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Viele Prozesse funktionieren eine Zeit lang mit Tabellen,
                    E-Mails, einzelnen Tools oder manuellen Umwegen. Doch
                    irgendwann werden Abläufe unübersichtlich, Daten liegen
                    verteilt, Zuständigkeiten bleiben unklar und Teams verlieren
                    Zeit. Genau dann braucht es keine weitere Notlösung, sondern
                    eine Web-Anwendung, die den Prozess sauber abbildet.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {STANDARD_TOOL_LIMITS.map((point) => (
                  <article
                    key={point.title}
                    data-ws-reveal
                    className="rounded-[1.05rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.54)] p-5 shadow-[0_18px_52px_-44px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6"
                  >
                    <h3 className="font-ui text-[1.05rem] font-[620] leading-[1.26] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                      {point.title}
                    </h3>
                    <p className="font-ui mt-3 text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                      {point.text}
                    </p>
                  </article>
                ))}
              </div>

              <div data-ws-reveal className="mt-18 sm:mt-20 md:mt-24">
                <EditorialAnchor
                  src={SERVICE_PAGE_IMAGES.software.portal.src}
                  alt={SERVICE_PAGE_IMAGES.software.portal.alt}
                  folio="Mod. 01"
                  context="Portal"
                  leftCaption="Rollen · Status · Zugriff"
                  rightCaption="Operative Web-Anwendung"
                  aspect="16/9"
                  align="left"
                  maxWidth="48rem"
                  revealAttr="data-ws-reveal"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-ws-reveal className="max-w-[60rem]">
                <Eyebrow>Für wen diese Leistung passt</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[24ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Für Unternehmen mit Prozessen, die digital klarer werden
                  müssen.
                </h2>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2">
                {AUDIENCE_CASES.map((item) => (
                  <article
                    key={item.title}
                    data-ws-reveal
                    className="grid gap-4 rounded-[1.15rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] p-5 shadow-[0_20px_56px_-48px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.74)] sm:grid-cols-[auto_minmax(0,1fr)] sm:p-6"
                  >
                    <span className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.7)]">
                      →
                    </span>
                    <div>
                      <h3 className="font-ui text-[1.05rem] font-[620] leading-[1.28] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)] sm:text-[1.12rem]">
                        {item.title}
                      </h3>
                      <p className="font-ui mt-2.5 text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                        {item.text}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="leistungen-ansehen"
          className="relative bg-[var(--magicks-bg-elevated)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16"
        >
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-ws-reveal className="max-w-[60rem]">
                <Eyebrow>Was MAGICKS für Sie umsetzt</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Digitale Werkzeuge für echte Abläufe.
                </h2>
                <p className="font-ui mt-7 max-w-[50rem] text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                  Web-Software ist kein dekoratives Frontend. Sie muss Daten,
                  Rollen, Workflows und Entscheidungen so abbilden, dass der
                  Alltag einfacher wird.
                </p>
              </div>

              <ol className="mt-12 grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
                {DELIVERABLES.map((item, index) => (
                  <li
                    key={item.title}
                    data-ws-reveal
                    className="rounded-[1.05rem] border border-[rgb(var(--magicks-line-rgb)/0.095)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.52)] p-5 shadow-[0_18px_48px_-42px_rgba(20,28,44,0.24),inset_0_1px_0_rgba(255,255,255,0.72)]"
                  >
                    <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.19em] text-[rgb(var(--magicks-accent-ink-rgb)/0.68)]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-ui mt-3 text-[1rem] font-[620] leading-[1.26] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                      {item.title}
                    </h3>
                    <p className="font-ui mt-2.5 text-[14.2px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:gap-16">
                <div data-ws-reveal>
                  <Eyebrow>Von Prozesslogik zu nutzbarer Software</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[18ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                    Wir starten nicht mit Oberfläche. Wir starten mit Struktur.
                  </h2>
                </div>

                <div data-ws-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Gute Web-Software entsteht nicht, indem man Screens
                    gestaltet und später Logik ergänzt. Zuerst müssen Rollen,
                    Daten, Zustände, Abläufe und Entscheidungen verstanden
                    werden. Erst danach entsteht ein Interface, das nicht nur
                    gut aussieht, sondern den Prozess wirklich trägt.
                  </p>

                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {PROCESS_QUESTIONS.map((item) => (
                      <li
                        key={item}
                        className="font-ui rounded-[0.9rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.5)] px-4 py-3 text-[14.5px] font-[560] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.74)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div data-ws-reveal className="mt-18 sm:mt-20 md:mt-24">
                <EditorialAnchor
                  src={SERVICE_PAGE_IMAGES.software.workflow.src}
                  alt={SERVICE_PAGE_IMAGES.software.workflow.alt}
                  folio="Mod. 02"
                  context="Workflow"
                  leftCaption="Status · Freigabe · Aufgabe"
                  rightCaption="Prozesslogik"
                  aspect="16/9"
                  align="right"
                  maxWidth="48rem"
                  revealAttr="data-ws-reveal"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-start lg:gap-16">
                <div data-ws-reveal>
                  <Eyebrow>Integrationen & Automationen</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                    Web-Software wird stärker, wenn sie mit Ihren Systemen
                    zusammenarbeitet.
                  </h2>
                </div>

                <div data-ws-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Viele Anwendungen entfalten ihren Wert erst durch saubere
                    Verbindungen: zu CRM-Systemen, Formularen,
                    Zahlungsprozessen, Kalendern, E-Mail, Datenquellen, APIs
                    oder Automationen. MAGICKS denkt diese Schnittstellen früh
                    mit, damit Ihre Web-Software nicht isoliert steht.
                  </p>

                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {INTEGRATION_POINTS.map((item) => (
                      <li
                        key={item}
                        className="font-ui rounded-[0.9rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.5)] px-4 py-3 text-[14.5px] font-[560] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.74)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-ws-reveal className="max-w-[58rem]">
                <Eyebrow>Was wir bewusst vermeiden</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[18ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Software darf Komplexität nicht einfach nur schöner machen.
                </h2>
              </div>

              <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AVOID_POINTS.map((line) => (
                  <li
                    key={line}
                    data-ws-reveal
                    className="rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.5)] p-5 shadow-[0_18px_48px_-42px_rgba(20,28,44,0.24),inset_0_1px_0_rgba(255,255,255,0.72)]"
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
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-ws-reveal className="max-w-[58rem]">
                <Eyebrow>Unser Ablauf</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[22ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Von der Prozessanalyse zur nutzbaren Anwendung.
                </h2>
              </div>

              <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {WORKFLOW_STEPS.map((step, index) => (
                  <li
                    key={step.title}
                    data-ws-reveal
                    className="rounded-[1.15rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[linear-gradient(160deg,rgba(255,255,255,0.82)_0%,rgba(246,242,233,0.68)_100%)] p-5 shadow-[0_20px_58px_-48px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6"
                  >
                    <p className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.74)] sm:text-[11px]">
                      Schritt {index + 1}
                    </p>
                    <h3 className="font-ui mt-3 text-[1.08rem] font-[620] leading-[1.28] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)] sm:text-[1.16rem]">
                      {step.title}
                    </h3>
                    <p className="font-ui mt-2.5 text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.67)]">
                      {step.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16 lg:py-32">
          <div className="layout-max">
            <div data-ws-reveal>
              <ContextualCrossLink
                eyebrow="Überblick"
                folio="Service Hub"
                lead="Wenn Sie Website, Shop, Software und Automationen zusammen denken möchten, zeigt die Leistungsübersicht den gesamten MAGICKS-Rahmen."
                linkLabel="Alle Leistungen ansehen"
                to="/leistungen"
              />
            </div>

            <div data-ws-reveal className="mt-12 sm:mt-14 md:mt-16">
              <ContextualCrossLink
                eyebrow="Automationen"
                folio="KI-Automationen & Integrationen"
                lead="Wenn wiederkehrende Schritte, Datenübergaben oder Benachrichtigungen automatisiert werden sollen, ist dieser Bereich der passende nächste Schritt."
                linkLabel="KI-Automationen ansehen"
                to="/ki-automationen-integrationen"
              />
            </div>

            <div data-ws-reveal className="mt-12 sm:mt-14 md:mt-16">
              <ContextualCrossLink
                eyebrow="Verkauf"
                folio="Shops & Produktkonfiguratoren"
                lead="Wenn Ihr System stärker auf Produktdarstellung, Auswahl oder Verkaufsprozesse einzahlt, ist der Commerce-Bereich relevant."
                linkLabel="Shops & Konfiguratoren ansehen"
                to="/shops-produktkonfiguratoren"
              />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[var(--magicks-bg-soft)] px-5 pb-24 pt-24 sm:px-8 sm:pb-32 sm:pt-32 md:px-12 md:pb-40 md:pt-40 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 62% 46% at 24% 20%, rgba(166,138,98,0.12), transparent 74%), radial-gradient(ellipse 52% 40% at 80% 76%, rgba(96,118,146,0.1), transparent 76%)",
            }}
          />
          <div className="relative layout-max">
            <div
              data-ws-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow>Nächster Schritt</Eyebrow>
              <h2 className="font-ui mx-auto mt-7 max-w-[19ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.9rem]">
                Bereit für Web-Software, die Ihren Alltag wirklich erleichtert?
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[46rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Lassen Sie uns klären, welche Abläufe in Ihrem Unternehmen
                durch eine individuelle Web-Anwendung klarer, schneller und
                besser nutzbar werden können.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta to="/kontakt" label="Web-Software-Projekt besprechen" />
                <Link
                  to="/kontakt"
                  className="inline-flex min-h-11 items-center rounded-full border border-[rgb(var(--magicks-line-rgb)/0.2)] bg-transparent px-6 py-2.5 font-ui text-[15px] font-[560] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.82)] no-underline transition-[border-color,transform,color,background-color] duration-500 hover:-translate-y-[1px] hover:border-[rgb(var(--magicks-line-rgb)/0.42)] hover:bg-[rgb(var(--magicks-bg-lifted-rgb)/0.66)] hover:text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[15.5px]"
                >
                  Kontakt aufnehmen
                </Link>
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
