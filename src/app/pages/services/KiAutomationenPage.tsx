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

const SYSTEM_BREAKS: BenefitPoint[] = [
  {
    title: "Daten werden doppelt eingetragen",
    text: "Wenn Informationen manuell von Tool zu Tool wandern, entstehen Aufwand und Fehler.",
  },
  {
    title: "Informationen liegen verteilt",
    text: "Teams suchen in E-Mails, Tabellen, Formularen oder einzelnen Systemen nach dem aktuellen Stand.",
  },
  {
    title: "Aufgaben werden manuell weitergegeben",
    text: "Übergaben funktionieren nur, wenn jemand aktiv daran denkt.",
  },
  {
    title: "Anfragen müssen händisch sortiert werden",
    text: "Leads, Formulare oder Nachrichten kosten Zeit, bevor sie überhaupt bearbeitet werden können.",
  },
  {
    title: "Wiederkehrende Schritte bremsen den Alltag",
    text: "Kleine Routinen werden zur Belastung, wenn sie täglich in hoher Zahl auftreten.",
  },
  {
    title: "Systeme arbeiten nebeneinander statt miteinander",
    text: "Der eigentliche Prozess bleibt manuell, obwohl digitale Werkzeuge vorhanden sind.",
  },
];

const AUDIENCE_CASES: AudienceCase[] = [
  {
    title: "Ihre Teams übertragen Daten regelmäßig zwischen mehreren Tools.",
    text: "Informationen sollen automatisch dort landen, wo sie weiterverarbeitet werden.",
  },
  {
    title: "Anfragen, Leads oder Formulare müssen manuell sortiert werden.",
    text: "Eingänge können klassifiziert, vorbereitet und an die richtige Stelle übergeben werden.",
  },
  {
    title: "Wiederkehrende Aufgaben kosten täglich Zeit.",
    text: "Automationen reduzieren Routinearbeit, ohne den Prozess unkontrollierbar zu machen.",
  },
  {
    title: "Informationen kommen nicht automatisch dort an, wo sie gebraucht werden.",
    text: "Integrationen verbinden Website, CRM, E-Mail, Kalender, Tabellen, APIs oder interne Tools.",
  },
  {
    title: "Ihre Prozesse hängen an einzelnen Personen oder manuellen Übergaben.",
    text: "Klare Workflows machen Zuständigkeiten, Auslöser und nächste Schritte nachvollziehbar.",
  },
  {
    title: "Sie möchten KI sinnvoll einsetzen, aber nicht als Spielerei.",
    text: "KI unterstützt dort, wo sie Arbeit vorbereitet, strukturiert oder Prüfung erleichtert.",
  },
  {
    title: "Sie möchten Dokumente, Nachrichten oder Daten schneller vorbereiten.",
    text: "KI-Workflows können extrahieren, zusammenfassen, klassifizieren oder Entwürfe vorbereiten.",
  },
];

const DELIVERABLES: Deliverable[] = [
  {
    title: "Prozessautomationen",
    text: "Wiederkehrende Schritte werden zuverlässig ausgelöst, verarbeitet und weitergegeben.",
  },
  {
    title: "KI-gestützte Workflows",
    text: "KI unterstützt beim Sortieren, Vorbereiten, Zusammenfassen, Prüfen oder Strukturieren.",
  },
  {
    title: "Tool- und Systemintegrationen",
    text: "Website, CRM, E-Mail, Kalender, Tabellen, APIs und interne Tools arbeiten besser zusammen.",
  },
  {
    title: "CRM- und Lead-Prozesse",
    text: "Anfragen werden strukturiert übergeben, vorqualifiziert und schneller bearbeitbar.",
  },
  {
    title: "Formular- und Anfrageflows",
    text: "Eingaben landen nicht im Postfach-Chaos, sondern im passenden Prozess.",
  },
  {
    title: "Automatische Benachrichtigungen",
    text: "Teams werden informiert, wenn ein relevanter Vorgang Aufmerksamkeit braucht.",
  },
  {
    title: "Datenimporte und Datenexporte",
    text: "Daten werden sauber zwischen Systemen bewegt, ohne ständige manuelle Kopien.",
  },
  {
    title: "Dokumentenverarbeitung",
    text: "Dokumente können vorbereitet, geprüft, extrahiert oder für weitere Schritte strukturiert werden.",
  },
  {
    title: "E-Mail- und Antwortvorbereitung",
    text: "Antworten, Zusammenfassungen oder nächste Schritte können vorbereitet und geprüft werden.",
  },
  {
    title: "Reports und Statusübersichten",
    text: "Relevante Informationen werden sichtbar, statt in einzelnen Tools zu verschwinden.",
  },
  {
    title: "API- und Webhook-Anbindungen",
    text: "Technische Übergaben werden so geplant, dass sie den Ablauf wirklich tragen.",
  },
  {
    title: "Kalender- und Buchungslogik",
    text: "Termine, Verfügbarkeiten und Buchungen können mit Folgeprozessen verbunden werden.",
  },
  {
    title: "Interne Übergaben und Freigabeprozesse",
    text: "Zuständigkeiten, Prüfungen und Freigaben bleiben nachvollziehbar.",
  },
  {
    title: "Automationen zwischen Website, Web-Software und bestehenden Tools",
    text: "Digitale Auftritte, interne Systeme und vorhandene Werkzeuge werden sinnvoll verbunden.",
  },
];

const AI_USE_CASES = [
  "Anfragen klassifizieren",
  "Texte oder Antworten vorbereiten",
  "Dokumente vorstrukturieren",
  "Inhalte zusammenfassen",
  "Daten extrahieren",
  "Leads vorqualifizieren",
  "Support- oder Serviceprozesse vorbereiten",
  "Interne Wissens- oder Assistenzsysteme aufbauen",
] as const;

const TOOL_EXAMPLES = [
  "CRM-Systeme",
  "Website-Formulare",
  "E-Mail und Benachrichtigungen",
  "Kalender und Buchungssysteme",
  "Google Sheets oder Airtable",
  "Interne Dashboards",
  "Zahlungs- oder Bestellprozesse",
  "APIs und Webhooks",
  "Make, Zapier oder n8n",
  "OpenAI / ChatGPT API",
] as const;

const METHOD_QUESTIONS = [
  "Welche Aufgabe wiederholt sich?",
  "Welche Daten werden benötigt?",
  "Wo entstehen Fehler oder Verzögerungen?",
  "Welche Systeme sind beteiligt?",
  "Was darf automatisiert werden?",
  "Wo braucht es menschliche Prüfung?",
  "Welches Ergebnis soll am Ende entstehen?",
] as const;

const AVOID_POINTS = [
  "Keine Automation um der Automation willen.",
  "Kein KI-Hype ohne echten Nutzen.",
  "Keine Integration, die technisch existiert, aber operativ niemandem hilft.",
  "Keine Blackbox, die Ihr Team nicht versteht.",
  "Keine Workflows, die mehr Pflege erzeugen als sie Arbeit sparen.",
  "Keine Lösung ohne klare Zuständigkeiten, Prüfung und nachvollziehbare Abläufe.",
] as const;

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    title: "Verstehen",
    text: "Wir analysieren Aufgaben, Systeme, Daten, Übergaben und wiederkehrende Arbeit.",
  },
  {
    title: "Vereinfachen",
    text: "Wir prüfen, welche Schritte wirklich nötig sind und wo Reibung entsteht.",
  },
  {
    title: "Strukturieren",
    text: "Wir definieren Eingänge, Logik, Prüfungen, Ausgaben und Zuständigkeiten.",
  },
  {
    title: "Verbinden",
    text: "Wir integrieren Website, Formulare, CRM, E-Mail, APIs oder interne Tools dort, wo es Sinn ergibt.",
  },
  {
    title: "Automatisieren",
    text: "Wir bauen Workflows, die zuverlässig auslösen, Daten verarbeiten und Aufgaben weitergeben.",
  },
  {
    title: "Prüfen",
    text: "Wichtige Entscheidungen bleiben nachvollziehbar und menschliche Kontrolle bleibt dort, wo sie gebraucht wird.",
  },
  {
    title: "Optimieren",
    text: "Nach dem Launch können Abläufe gemessen, angepasst und erweitert werden.",
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

function FlowMesh() {
  const nodes = [
    { label: "Eingang", meta: "Formular · Mail · API" },
    { label: "Logik", meta: "Regeln · KI · Prüfung" },
    { label: "Übergabe", meta: "CRM · Team · Report" },
  ] as const;

  return (
    <div className="w-full" aria-label="Visualisierter Automationsflow">
      <div className="rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.62)] p-5 shadow-[0_24px_68px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.74)] sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)]">
            FlowMesh
          </span>
          <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.38)]">
            Signal → Logik → Ausgabe
          </span>
        </div>

        <div className="grid gap-3">
          {nodes.map((node, index) => (
            <article
              key={node.label}
              data-ki-node
              className="relative rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.58)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.66)]"
            >
              <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.64)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-ui text-[1.05rem] font-[620] leading-[1.2] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                    {node.label}
                  </h3>
                  <p className="font-ui mt-1.5 text-[13.5px] leading-[1.55] text-[rgb(var(--magicks-ink-rgb)/0.58)]">
                    {node.meta}
                  </p>
                </div>
                {index < nodes.length - 1 ? (
                  <span className="font-instrument hidden text-[1.35rem] italic leading-none text-[rgb(var(--magicks-accent-ink-rgb)/0.58)] sm:inline">
                    ↓
                  </span>
                ) : (
                  <span className="font-mono hidden text-[9.5px] font-medium uppercase tracking-[0.2em] text-[rgb(var(--magicks-ink-rgb)/0.42)] sm:inline">
                    Ergebnis
                  </span>
                )}
              </div>
              <span
                aria-hidden
                className="absolute right-3 top-3 h-2 w-2 border-r border-t border-[rgb(var(--magicks-line-rgb)/0.22)]"
              />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function KiAutomationenPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-ki-hero-item]");
      const nodes = gsap.utils.toArray<HTMLElement>("[data-ki-node]");
      const reveals = gsap.utils.toArray<HTMLElement>("[data-ki-reveal]");

      if (reduced) {
        gsap.set([...heroItems, ...nodes, ...reveals], {
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
        nodes,
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
      <RouteSEO path="/ki-automationen-integrationen" />

      <main
        ref={rootRef}
        className="relative overflow-hidden bg-[var(--magicks-bg-base)] pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.25rem]"
      >
        <section
          data-ki-hero
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
                  <div data-ki-hero-item>
                    <Eyebrow>KI & Automationen</Eyebrow>
                  </div>

                  <h1
                    data-ki-hero-item
                    className="font-ui mt-7 max-w-[18ch] text-[2.42rem] font-[630] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.35rem] md:text-[4.42rem] lg:text-[5.1rem]"
                  >
                    KI & Automationen, die Arbeit reduzieren und Systeme
                    verbinden.
                  </h1>

                  <p
                    data-ki-hero-item
                    className="font-ui mt-8 max-w-[50rem] text-[1.03rem] font-[480] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.1rem] md:text-[1.18rem]"
                  >
                    MAGICKS entwickelt KI-gestützte Workflows, Automationen und
                    Integrationen, die wiederkehrende Aufgaben reduzieren,
                    Systeme verbinden und Informationen automatisch dorthin
                    bringen, wo sie gebraucht werden.
                  </p>

                  <div
                    data-ki-hero-item
                    className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12"
                  >
                    <PrimaryCta to="/kontakt" label="Automation-Projekt besprechen" />
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

                <aside data-ki-hero-item className="lg:mb-2">
                  <FlowMesh />
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
                <div data-ki-reveal>
                  <Eyebrow>Wenn Systeme nicht zusammenspielen</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[21ch] text-[2.1rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.85rem] md:text-[3.55rem]">
                    Wenn Systeme nicht zusammenspielen, wird Arbeit unnötig
                    manuell.
                  </h2>
                </div>

                <div data-ki-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Viele Unternehmen nutzen bereits mehrere digitale
                    Werkzeuge. Trotzdem werden Daten doppelt gepflegt,
                    Informationen manuell übertragen und Aufgaben per E-Mail,
                    Tabellen oder Zuruf weitergegeben. Genau dort entstehen
                    Zeitverlust, Fehler und Reibung. Automationen und
                    Integrationen schließen diese Brüche.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {SYSTEM_BREAKS.map((point) => (
                  <article
                    key={point.title}
                    data-ki-reveal
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

              <div data-ki-reveal className="mt-18 sm:mt-20 md:mt-24">
                <EditorialAnchor
                  src={SERVICE_PAGE_IMAGES.automation.canvas.src}
                  alt={SERVICE_PAGE_IMAGES.automation.canvas.alt}
                  folio="Flow 01"
                  context="Automation"
                  leftCaption="Formular · Logik · CRM"
                  rightCaption="Saubere Übergabe"
                  aspect="16/9"
                  align="right"
                  maxWidth="46rem"
                  revealAttr="data-ki-reveal"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-ki-reveal className="max-w-[60rem]">
                <Eyebrow>Für wen diese Leistung passt</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Für Unternehmen, die weniger manuell arbeiten wollen.
                </h2>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2">
                {AUDIENCE_CASES.map((item) => (
                  <article
                    key={item.title}
                    data-ki-reveal
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
              <div data-ki-reveal className="max-w-[60rem]">
                <Eyebrow>Was MAGICKS für Sie umsetzt</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[21ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Digitale Abläufe, die Arbeit wirklich abnehmen.
                </h2>
                <p className="font-ui mt-7 max-w-[50rem] text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                  Automationen sind nur dann wertvoll, wenn sie konkrete
                  Arbeit reduzieren, Übergaben verbessern und Informationen
                  zuverlässig weiterbringen.
                </p>
              </div>

              <ol className="mt-12 grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
                {DELIVERABLES.map((item, index) => (
                  <li
                    key={item.title}
                    data-ki-reveal
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
                <div data-ki-reveal>
                  <Eyebrow>KI sinnvoll einsetzen</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[19ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                    KI ist nur dann sinnvoll, wenn sie einen echten Prozess
                    verbessert.
                  </h2>
                </div>

                <div data-ki-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Wir setzen KI nicht ein, damit ein Prozess moderner wirkt.
                    Wir setzen KI dort ein, wo sie wiederkehrende Arbeit
                    vorbereitet, Inhalte strukturiert, Informationen erkennt,
                    Entscheidungen unterstützt oder Teams entlastet. Der Ablauf
                    muss nachvollziehbar bleiben — besonders dort, wo Menschen
                    prüfen, freigeben oder entscheiden müssen.
                  </p>

                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {AI_USE_CASES.map((item) => (
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

              <div data-ki-reveal className="mt-18 sm:mt-20 md:mt-24">
                <EditorialAnchor
                  src={SERVICE_PAGE_IMAGES.automation.handoff.src}
                  alt={SERVICE_PAGE_IMAGES.automation.handoff.alt}
                  folio="Flow 02"
                  context="Übergabe"
                  leftCaption="Klassifizierung · Prüfung"
                  rightCaption="CRM · E-Mail · Team"
                  aspect="16/9"
                  align="left"
                  maxWidth="48rem"
                  revealAttr="data-ki-reveal"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-start lg:gap-16">
                <div data-ki-reveal>
                  <Eyebrow>Integrationen & Tools</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                    Damit Informationen nicht mehr manuell wandern müssen.
                  </h2>
                </div>

                <div data-ki-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Integrationen sorgen dafür, dass Daten zwischen Website,
                    Formularen, CRM, E-Mail, Kalendern, Tabellen, internen Tools
                    oder externen APIs sauber fließen. Entscheidend ist nicht,
                    möglichst viele Tools zu verbinden, sondern die richtigen
                    Übergaben zu automatisieren.
                  </p>

                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {TOOL_EXAMPLES.map((item) => (
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
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:gap-16">
                <div data-ki-reveal>
                  <Eyebrow>Vom manuellen Ablauf zum Workflow</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                    Wir automatisieren nicht blind. Wir verstehen zuerst den
                    Ablauf.
                  </h2>
                </div>

                <div data-ki-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Gute Automationen entstehen nicht aus einer Tool-Liste.
                    Zuerst muss klar sein, wo Arbeit entsteht, welche Daten
                    benötigt werden, welche Entscheidung getroffen wird und wo
                    menschliche Kontrolle sinnvoll bleibt. Erst danach entsteht
                    ein Workflow, der zuverlässig funktioniert.
                  </p>

                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {METHOD_QUESTIONS.map((item) => (
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
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-ki-reveal className="max-w-[58rem]">
                <Eyebrow>Was wir bewusst vermeiden</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[19ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Automationen müssen den Alltag entlasten, nicht komplizierter
                  machen.
                </h2>
              </div>

              <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AVOID_POINTS.map((line) => (
                  <li
                    key={line}
                    data-ki-reveal
                    className="rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.54)] p-5 shadow-[0_18px_48px_-42px_rgba(20,28,44,0.24),inset_0_1px_0_rgba(255,255,255,0.72)]"
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
              <div data-ki-reveal className="max-w-[58rem]">
                <Eyebrow>Unser Ablauf</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[21ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Vom manuellen Schritt zum sauberen Workflow.
                </h2>
              </div>

              <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {WORKFLOW_STEPS.map((step, index) => (
                  <li
                    key={step.title}
                    data-ki-reveal
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
            <div data-ki-reveal>
              <ContextualCrossLink
                eyebrow="Überblick"
                folio="Service Hub"
                lead="Wenn Sie Website, Shop, Software und Automationen zusammen denken möchten, zeigt die Leistungsübersicht den gesamten MAGICKS-Rahmen."
                linkLabel="Alle Leistungen ansehen"
                to="/leistungen"
              />
            </div>

            <div data-ki-reveal className="mt-12 sm:mt-14 md:mt-16">
              <ContextualCrossLink
                eyebrow="Fundament"
                folio="Web-Software"
                lead="Wenn ein Ablauf eine eigene Plattform, ein Portal oder ein internes Tool braucht, ist Web-Software der passende nächste Bereich."
                linkLabel="Web-Software ansehen"
                to="/web-software"
              />
            </div>

            <div data-ki-reveal className="mt-12 sm:mt-14 md:mt-16">
              <ContextualCrossLink
                eyebrow="Verkauf"
                folio="Shops & Produktkonfiguratoren"
                lead="Wenn Automationen direkt mit Produktlogik, Anfragen oder Verkaufsprozessen verbunden werden sollen, ist der Commerce-Bereich relevant."
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
              data-ki-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow>Nächster Schritt</Eyebrow>
              <h2 className="font-ui mx-auto mt-7 max-w-[20ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.9rem]">
                Welche Arbeit sollte nicht länger manuell hängen bleiben?
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[46rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Lassen Sie uns klären, welche Prozesse in Ihrem Unternehmen
                durch KI, Automationen und Integrationen schneller, klarer und
                verlässlicher werden können.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta to="/kontakt" label="Automation-Projekt besprechen" />
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
