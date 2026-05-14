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

type TransformRow = {
  manual: string;
  automatic: string;
};

type RelatedLink = {
  to: string;
  eyebrow: string;
  folio: string;
  lead: string;
  linkLabel: string;
};

const TRUST_CHIPS = [
  "Prozesse analysieren",
  "Systeme verbinden",
  "Manuelle Arbeit reduzieren",
  "KI sinnvoll einsetzen",
] as const;

const CREDO_POINTS: TextBlock[] = [
  {
    title: "KI dort einsetzen, wo sie Arbeit abnimmt",
    text: "Nicht jeder Prozess braucht KI. Relevant wird sie dort, wo sie wiederkehrende Vorbereitung, Sortierung oder Strukturierung übernimmt.",
  },
  {
    title: "Abläufe verständlich halten",
    text: "Automationen müssen für Teams nachvollziehbar bleiben, sonst entsteht nur neue Abhängigkeit.",
  },
  {
    title: "Menschliche Prüfung bewusst behalten",
    text: "Wo Verantwortung, Kontext oder Freigabe wichtig sind, wird KI vorbereitend eingesetzt, nicht blind entscheidend.",
  },
  {
    title: "Automationen nachvollziehbar gestalten",
    text: "Eingaben, Ausgaben, Status und Fehlerfälle werden so geplant, dass der Prozess kontrollierbar bleibt.",
  },
  {
    title: "Systeme sinnvoll verbinden",
    text: "Formulare, CRM, E-Mail, Tabellen, APIs und interne Tools sollen zusammenarbeiten, statt nebeneinander zu laufen.",
  },
];

const USE_CASES: TextBlock[] = [
  {
    title: "Ihre Teams übertragen Daten regelmäßig zwischen mehreren Tools.",
    text: "Informationen sollen nicht händisch kopiert, sondern strukturiert an die richtige Stelle übergeben werden.",
  },
  {
    title: "Anfragen oder Formulare müssen manuell sortiert werden.",
    text: "Eingänge können vorbereitet, klassifiziert und an zuständige Personen oder Systeme übergeben werden.",
  },
  {
    title: "Wiederkehrende Aufgaben kosten täglich Zeit.",
    text: "Routinen werden zur Belastung, wenn sie in hoher Zahl immer wieder manuell erledigt werden.",
  },
  {
    title: "Informationen werden mehrfach gepflegt oder kopiert.",
    text: "Doppelte Datenpflege erzeugt Fehler, Reibung und unnötige Abstimmung.",
  },
  {
    title: "Antworten, E-Mails oder Dokumente müssen vorbereitet werden.",
    text: "KI-Workflows können Entwürfe, Zusammenfassungen oder Strukturierungen vorbereiten, die anschließend geprüft werden.",
  },
  {
    title: "Leads oder Anfragen brauchen Vorqualifizierung.",
    text: "Eingänge können nach Kriterien sortiert, angereichert und für den Vertrieb verständlicher gemacht werden.",
  },
  {
    title: "Interne Übergaben sind unklar.",
    text: "Statuslogiken, Benachrichtigungen und Zuständigkeiten machen sichtbar, was als Nächstes passieren muss.",
  },
  {
    title: "Sie möchten KI sinnvoll nutzen.",
    text: "Nicht als isolierte Demo, sondern als Teil eines realen Arbeitsablaufs mit klarem Nutzen.",
  },
];

const APPLICATIONS: TextBlock[] = [
  {
    title: "Formular- und Anfrageprozesse",
    text: "Eingaben werden strukturiert übernommen, geprüft und an die richtige Stelle weitergeführt.",
  },
  {
    title: "Lead-Vorqualifizierung",
    text: "Anfragen können sortiert, bewertet und für Vertrieb oder Beratung vorbereitet werden.",
  },
  {
    title: "CRM-Übergaben",
    text: "Kontakte, Notizen, Status und nächste Schritte landen sauber im passenden System.",
  },
  {
    title: "Datenübergaben zwischen Tools",
    text: "Informationen werden zwischen Website, Tabellen, CRM, Kalender, E-Mail oder APIs bewegt.",
  },
  {
    title: "E-Mail- und Antwortvorbereitung",
    text: "Antwortentwürfe, Zusammenfassungen oder nächste Schritte werden vorbereitet und bleiben prüfbar.",
  },
  {
    title: "Dokumentenverarbeitung",
    text: "Dokumente können extrahiert, zusammengefasst, klassifiziert oder für weitere Schritte strukturiert werden.",
  },
  {
    title: "Interne Freigaben und Statuslogiken",
    text: "Teams sehen, welche Aufgabe wo steht und wer prüfen oder entscheiden muss.",
  },
  {
    title: "Reports und Zusammenfassungen",
    text: "Wiederkehrende Übersichten können vorbereitet werden, damit Entscheidungen schneller möglich sind.",
  },
  {
    title: "Datenimporte und Exporte",
    text: "Wiederkehrende Datenbewegungen werden robuster, nachvollziehbarer und weniger fehleranfällig.",
  },
  {
    title: "Operative Routineaufgaben",
    text: "Kleine wiederkehrende Schritte werden dort automatisiert, wo sie im Alltag spürbar entlasten.",
  },
];

const DELIVERABLES: TextBlock[] = [
  {
    title: "KI-gestützte Workflows",
    text: "KI unterstützt beim Sortieren, Vorbereiten, Zusammenfassen, Prüfen oder Strukturieren.",
  },
  {
    title: "Prozessautomationen",
    text: "Wiederkehrende Schritte werden zuverlässig ausgelöst, verarbeitet und weitergegeben.",
  },
  {
    title: "Automationen zwischen Systemen",
    text: "Formulare, CRM, E-Mail, Tabellen, APIs und interne Tools werden sinnvoll verbunden.",
  },
  {
    title: "Reduktion manueller Zwischenschritte",
    text: "Doppelte Arbeit, händische Übergaben und operative Reibung werden dort reduziert, wo der Prozess es erlaubt.",
  },
  {
    title: "Anfrage- und Lead-Prozesse",
    text: "Eingänge werden strukturierter übergeben, vorqualifiziert und schneller bearbeitbar gemacht.",
  },
  {
    title: "Dokumenten- und Datenverarbeitung",
    text: "Informationen werden extrahiert, vorbereitet, klassifiziert oder für Folgeprozesse nutzbar gemacht.",
  },
  {
    title: "E-Mail- und Antwortprozesse",
    text: "Antworten, Zusammenfassungen oder nächste Schritte können vorbereitet und geprüft werden.",
  },
  {
    title: "Interne Übergaben und Statuslogiken",
    text: "Zuständigkeiten, Prüfungen und Bearbeitungsstände bleiben nachvollziehbar.",
  },
  {
    title: "API- und Webhook-Anbindungen",
    text: "Technische Übergaben werden so geplant, dass sie den Ablauf wirklich tragen.",
  },
  {
    title: "OpenAI / ChatGPT API",
    text: "Wenn KI sinnvoll ist, kann sie über passende Schnittstellen in bestehende Prozesse integriert werden.",
  },
  {
    title: "Make, Zapier oder n8n",
    text: "No-Code- und Low-Code-Workflows können passend sein, wenn sie den Prozess stabil und wartbar abbilden.",
  },
  {
    title: "Integration in bestehende Systeme",
    text: "MAGICKS wählt das technische Setup nach Prozess, Datenlage, Wartbarkeit und Alltagstauglichkeit.",
  },
];

const TRANSFORM_ROWS: TransformRow[] = [
  {
    manual: "Formular händisch erfasst",
    automatic: "strukturiert übernommen",
  },
  {
    manual: "Daten kopiert und weitergegeben",
    automatic: "zwischen Systemen übertragen",
  },
  {
    manual: "Antwort einzeln vorbereitet",
    automatic: "als Entwurf vorbereitet und geprüft",
  },
  {
    manual: "Status manuell nachgefragt",
    automatic: "automatisch sichtbar gemacht",
  },
  {
    manual: "Lead manuell sortiert",
    automatic: "nach Kriterien vorqualifiziert",
  },
  {
    manual: "Report manuell erstellt",
    automatic: "regelmäßig vorbereitet",
  },
];

const CONTROL_POINTS: TextBlock[] = [
  {
    title: "Klare Eingaben",
    text: "Ein Workflow braucht definierte Datenquellen und eindeutige Auslöser.",
  },
  {
    title: "Nachvollziehbare Ausgaben",
    text: "Ergebnisse müssen lesbar, prüfbar und für den nächsten Schritt geeignet sein.",
  },
  {
    title: "Menschliche Prüfung",
    text: "Wo Verantwortung oder Kontext wichtig bleibt, wird KI als Vorbereitung eingesetzt.",
  },
  {
    title: "Definierte Zuständigkeiten",
    text: "Teams müssen wissen, wer prüft, entscheidet, freigibt oder nachfasst.",
  },
  {
    title: "Saubere Fehlerfälle",
    text: "Wenn Daten fehlen oder unsicher sind, braucht der Prozess klare Ausnahmen.",
  },
  {
    title: "Keine blinde Vollautomatisierung",
    text: "Nicht alles sollte automatisch entschieden werden. Kontrolle ist Teil der Qualität.",
  },
];

const METHOD_QUESTIONS = [
  "Welche Aufgabe wiederholt sich?",
  "Welche Daten werden benötigt?",
  "Wo entstehen Fehler?",
  "Welche Systeme sind beteiligt?",
  "Wer prüft das Ergebnis?",
  "Was soll automatisch vorbereitet werden?",
  "Was muss bewusst manuell bleiben?",
] as const;

const AVOID_POINTS = [
  "Keinen KI-Hype ohne echten Nutzen.",
  "Keine Automation, die nur technisch existiert, aber operativ nichts verbessert.",
  "Keine Blackbox, die Ihr Team nicht versteht.",
  "Keine Workflows, die mehr Pflege erzeugen als sie Arbeit sparen.",
  "Keine Tool-Konstruktion, die später niemand sauber pflegen kann.",
  "Keine Vollautomatisierung dort, wo Prüfung, Verantwortung oder Kontext wichtig bleiben.",
] as const;

const FAQ_ITEMS: ReadonlyArray<FaqItem> = [
  {
    question: "Was bedeutet KI-Automation für Unternehmen?",
    answer:
      "KI-Automation verbindet Automatisierung mit KI-Funktionen wie Sortieren, Zusammenfassen, Klassifizieren, Vorbereiten oder Strukturieren. Ziel ist weniger manuelle Arbeit und ein klarerer Prozess.",
  },
  {
    question: "Wann lohnt sich KI-Automation?",
    answer:
      "Sie lohnt sich, wenn wiederkehrende Aufgaben, Datenübergaben, manuelle Sortierung, Formularprozesse oder Antwortvorbereitung regelmäßig Zeit kosten und klar beschreibbar sind.",
  },
  {
    question: "Welche Prozesse lassen sich mit KI automatisieren?",
    answer:
      "Typische Fälle sind Anfragen, Leads, CRM-Übergaben, E-Mail-Entwürfe, Dokumentenverarbeitung, Reports, Statuslogiken, Datenimporte, Exporte und wiederkehrende operative Aufgaben.",
  },
  {
    question: "Ersetzt KI menschliche Arbeit komplett?",
    answer:
      "Nein. KI sollte dort unterstützen, wo sie sinnvoll vorbereitet, strukturiert oder entlastet. Prüfung, Verantwortung und Kontext bleiben dort menschlich, wo es notwendig ist.",
  },
  {
    question: "Kann KI an CRM, Formulare oder bestehende Tools angebunden werden?",
    answer:
      "Ja. Je nach System können Formulare, CRM, E-Mail, Tabellen, Kalender, APIs, Webhooks oder interne Tools angebunden werden.",
  },
  {
    question: "Wie bleibt ein KI-Workflow kontrollierbar?",
    answer:
      "Durch klare Eingaben, nachvollziehbare Ausgaben, definierte Zuständigkeiten, Protokollierung, Fehlerfälle und menschliche Prüfung an wichtigen Stellen.",
  },
  {
    question: "Was ist der Unterschied zwischen Automation und KI-Automation?",
    answer:
      "Automation folgt festen Regeln. KI-Automation ergänzt diese Regeln dort, wo Inhalte klassifiziert, zusammengefasst, extrahiert oder vorbereitet werden sollen.",
  },
  {
    question: "Kann MAGICKS auch kleinere Automationen umsetzen?",
    answer:
      "Ja. Nicht jeder Prozess braucht ein großes System. Manchmal reicht eine kleine, sauber integrierte Automation, die eine wiederkehrende Aufgabe spürbar entlastet.",
  },
  {
    question: "Welche Tools werden für KI-Automationen genutzt?",
    answer:
      "Das hängt vom Prozess ab. Möglich sind API-Integrationen, Webhooks, Make, Zapier, n8n, OpenAI / ChatGPT API, CRM-Systeme, E-Mail, Tabellen oder individuelle Web-Software.",
  },
];

const RELATED_LINKS: RelatedLink[] = [
  {
    to: "/ki-automationen-integrationen",
    eyebrow: "Kernleistung",
    folio: "KI & Automationen",
    lead: "Wenn Sie den umfassenden MAGICKS-Rahmen für Workflows, Integrationen und KI-gestützte Prozesse sehen möchten.",
    linkLabel: "KI & Automationen ansehen",
  },
  {
    to: "/web-software",
    eyebrow: "System",
    folio: "Web-Software",
    lead: "Wenn die Automation an Dashboards, Portale, interne Tools oder individuelle Anwendungen anschließt.",
    linkLabel: "Web-Software ansehen",
  },
  {
    to: "/websites-landingpages",
    eyebrow: "Eingang",
    folio: "Websites & Landingpages",
    lead: "Wenn Formulare, Anfragen oder digitale Auftritte der Startpunkt für automatisierte Prozesse sind.",
    linkLabel: "Websites & Landingpages ansehen",
  },
  {
    to: "/shops-produktkonfiguratoren",
    eyebrow: "Vertrieb",
    folio: "Shops & Konfiguratoren",
    lead: "Wenn Automationen an Produktlogik, Anfrageprozesse, Bestellungen oder Konfiguratoren anschließen.",
    linkLabel: "Shops & Konfiguratoren ansehen",
  },
  {
    to: "/leistungen",
    eyebrow: "Studio",
    folio: "Leistungen",
    lead: "Wenn Sie den gesamten MAGICKS-Rahmen aus Auftritt, Commerce, Web-Software und Automation einordnen möchten.",
    linkLabel: "Leistungen ansehen",
  },
  {
    to: "/kontakt",
    eyebrow: "Direkt",
    folio: "Kontakt",
    lead: "Wenn Sie beschreiben möchten, welche manuelle Arbeit in Ihrem Unternehmen nicht länger hängen bleiben sollte.",
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
    <div data-ku-reveal className="max-w-[62rem]">
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
      data-ku-reveal
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

function ProcessRegister() {
  return (
    <aside
      data-ku-hero-item
      className="rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.66)] p-5 shadow-[0_24px_68px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.76)] sm:p-6"
      aria-label="Prozess-Register Manuell zu Automatisch"
    >
      <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)]">
        Prozess-Register
      </p>
      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-3 border-b border-[rgb(var(--magicks-line-rgb)/0.1)] pb-3 font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.42)]">
        <span>Manuell</span>
        <span aria-hidden>→</span>
        <span>Automatisch</span>
      </div>
      <ul className="divide-y divide-[rgb(var(--magicks-line-rgb)/0.1)]">
        {TRANSFORM_ROWS.slice(0, 4).map((row, index) => (
          <li
            key={row.manual}
            data-ku-process-row
            className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-baseline sm:gap-4"
          >
            <span className="font-ui text-[14.2px] leading-[1.55] text-[rgb(var(--magicks-ink-rgb)/0.58)]">
              {row.manual}
            </span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[rgb(var(--magicks-accent-ink-rgb)/0.58)]">
              OP-{String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-ui text-[14.5px] font-[610] leading-[1.55] text-[rgb(var(--magicks-ink-rgb)/0.86)]">
              {row.automatic}
            </span>
          </li>
        ))}
      </ul>
      <p className="font-ui mt-5 text-[14.2px] leading-[1.64] text-[rgb(var(--magicks-ink-rgb)/0.62)]">
        Nicht alles wird autonom entschieden. Viele gute Workflows bereiten vor,
        strukturieren und geben zur Prüfung weiter.
      </p>
    </aside>
  );
}

export default function KiAutomationUnternehmenPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-ku-hero-item]");
      const reveals = gsap.utils.toArray<HTMLElement>("[data-ku-reveal]");
      const processRows = gsap.utils.toArray<HTMLElement>("[data-ku-process-row]");

      if (reduced) {
        gsap.set([...heroItems, ...reveals, ...processRows], {
          opacity: 1,
          y: 0,
          filter: "none",
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

      gsap.fromTo(
        processRows,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.58,
          stagger: 0.06,
          ease: "power2.out",
          delay: 0.2,
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/ki-automation-unternehmen" />

      <main
        ref={rootRef}
        className="relative overflow-hidden bg-[var(--magicks-bg-base)] pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.25rem]"
      >
        <section
          data-ku-hero
          className="relative overflow-hidden px-5 pb-24 pt-8 sm:px-8 sm:pb-32 sm:pt-10 md:px-12 md:pb-40 lg:px-16 lg:pb-48"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 58% 46% at 18% 18%, rgba(166,138,98,0.14), transparent 72%), radial-gradient(ellipse 52% 40% at 84% 36%, rgba(96,128,138,0.12), transparent 74%), radial-gradient(ellipse 74% 44% at 50% 94%, rgba(255,255,255,0.58), transparent 76%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.26]"
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
                  <div data-ku-hero-item>
                    <Eyebrow>KI-Automation für Unternehmen</Eyebrow>
                  </div>

                  <h1
                    data-ku-hero-item
                    className="font-ui mt-7 max-w-[18ch] text-[2.42rem] font-[650] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.35rem] md:text-[4.42rem] lg:text-[5.1rem]"
                  >
                    KI-Automation für Unternehmen, die weniger manuell arbeiten wollen.
                  </h1>

                  <p
                    data-ku-hero-item
                    className="font-ui mt-8 max-w-[52rem] text-[1.03rem] font-[480] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.1rem] md:text-[1.18rem]"
                  >
                    MAGICKS entwickelt KI-Automationen und smarte Workflows, die
                    wiederkehrende Aufgaben reduzieren, Informationen
                    strukturieren und digitale Prozesse sinnvoll miteinander
                    verbinden — ohne Hype, ohne unnötige Komplexität, mit
                    klarem Nutzen im Alltag.
                  </p>

                  <div
                    data-ku-hero-item
                    className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12"
                  >
                    <PrimaryCta to="/kontakt" label="KI-Automation besprechen" />
                    <SecondaryCta
                      to="/ki-automationen-integrationen"
                      label="Mehr zu KI & Automationen"
                    />
                  </div>

                  <div
                    data-ku-hero-item
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

                <ProcessRegister />
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
                  eyebrow="Sinnvoll eingesetzte KI"
                  title="Nicht mehr KI. Sondern sinnvoll eingesetzte KI."
                />
                <div data-ku-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    KI bringt nur dann echten Mehrwert, wenn sie an den
                    richtigen Stellen eingesetzt wird. Nicht als Showeffekt.
                    Nicht als Buzzword. Sondern dort, wo sie Arbeit vorbereitet,
                    Informationen strukturiert, wiederkehrende Schritte reduziert
                    oder Prozesse nachvollziehbar ergänzt.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {CREDO_POINTS.map((item, index) => (
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
                eyebrow="Wann KI-Automation sinnvoll ist"
                title="Wenn wiederkehrende Arbeit den Alltag bremst."
                text="KI-Automation lohnt sich nicht wegen der Technologie allein, sondern wenn sie reale Arbeit entlastet, Übergaben klärt und Informationen besser nutzbar macht."
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
                eyebrow="Typische Einsatzfelder"
                title="KI-Automation dort, wo Prozesse täglich Arbeit erzeugen."
                text="Die folgenden Beispiele sind typische Ausgangspunkte. Entscheidend ist, ob der Ablauf klar genug ist, um ihn sinnvoll zu strukturieren und zu entlasten."
              />

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {APPLICATIONS.map((item, index) => (
                  <InfoCard key={item.title} item={item} index={index} />
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
                title="Workflows, Integrationen und KI dort, wo sie den Prozess tragen."
                text="MAGICKS wählt das technische Setup nach Prozess, Datenlage, Wartbarkeit und Nutzen. Nicht jedes Projekt braucht dieselben Tools."
              />

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              <SectionIntro
                eyebrow="Manuell zu Automatisch"
                title="Von manuellen Zwischenschritten zu klaren Workflows."
                text="Gute Automationen bedeuten nicht, dass alles ohne Kontrolle läuft. Viele sinnvolle Abläufe bereiten vor, strukturieren, übergeben oder machen Status sichtbar."
              />

              <div className="mt-12 overflow-hidden rounded-[1.2rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.58)] shadow-[0_20px_58px_-48px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)]">
                <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-3 border-b border-[rgb(var(--magicks-line-rgb)/0.1)] px-5 py-4 font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.45)]">
                  <span>Manuell</span>
                  <span aria-hidden>→</span>
                  <span>Unterstützt</span>
                </div>
                <ul className="divide-y divide-[rgb(var(--magicks-line-rgb)/0.1)]">
                  {TRANSFORM_ROWS.map((row, index) => (
                    <li
                      key={row.manual}
                      data-ku-reveal
                      className="grid gap-3 px-5 py-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-baseline md:gap-5"
                    >
                      <p className="font-ui text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.62)]">
                        {row.manual}
                      </p>
                      <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[rgb(var(--magicks-accent-ink-rgb)/0.62)]">
                        OP-{String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="font-ui text-[14.8px] font-[610] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.86)]">
                        {row.automatic}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
                <SectionIntro
                  eyebrow="KI mit Kontrolle"
                  title="KI muss nachvollziehbar bleiben."
                />
                <div data-ku-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Gerade in Unternehmensprozessen darf KI nicht zur Blackbox
                    werden. Deshalb planen wir Workflows so, dass Eingaben,
                    Ausgaben, Prüfungen und Zuständigkeiten klar bleiben. KI
                    kann vorbereiten, sortieren, zusammenfassen oder
                    unterstützen — aber wichtige Entscheidungen müssen dort
                    kontrollierbar bleiben, wo es sinnvoll oder notwendig ist.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {CONTROL_POINTS.map((item, index) => (
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
                data-ku-reveal
                className="rounded-[1.65rem] border border-[rgb(var(--magicks-line-rgb)/0.11)] bg-[linear-gradient(160deg,rgba(255,255,255,0.78)_0%,rgba(246,242,233,0.64)_100%)] p-6 shadow-[0_24px_72px_-54px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.78)] sm:p-8 md:p-10"
              >
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
                  <div>
                    <Eyebrow>Wie MAGICKS KI-Automation denkt</Eyebrow>
                    <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.65rem] md:text-[3.25rem]">
                      Wir automatisieren nicht blind.
                    </h2>
                  </div>
                  <div className="lg:pt-14">
                    <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                      Wir schauen zuerst darauf, wo Zeit verloren geht, wo
                      Fehler entstehen und welche Schritte sich unnötig
                      wiederholen. Erst danach entsteht eine Lösung, die den
                      Prozess wirklich vereinfacht — klar, verständlich und
                      sauber integriert.
                    </p>
                  </div>
                </div>

                <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {METHOD_QUESTIONS.map((question) => (
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
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:gap-16">
                <SectionIntro
                  eyebrow="Kontext"
                  title="KI-Automation ist selten eine Einzellösung."
                />
                <div data-ku-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Oft ist KI-Automation Teil eines größeren digitalen Setups:
                    manchmal an einem Formularprozess, manchmal an einer
                    Web-Anwendung, manchmal an einem Vertriebs- oder
                    Anfrage-Workflow. Deshalb denkt MAGICKS nicht isoliert in
                    Tools, sondern in Systemen, Übergaben und sinnvoll
                    verbundenen Prozessen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <SectionIntro
                eyebrow="Was wir bewusst vermeiden"
                title="Entlastung braucht Struktur, nicht KI-Theater."
                text="Was Sie bekommen, sind durchdachte digitale Abläufe mit Klarheit, Struktur und echter Entlastung."
              />

              <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AVOID_POINTS.map((line) => (
                  <li
                    key={line}
                    data-ku-reveal
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

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <SectionIntro
                eyebrow="Häufige Fragen"
                title="Was Unternehmen vor einer KI-Automation wissen möchten."
                text="Kurze Antworten zu KI-Automation, Prozessen, Kontrolle, Systemanbindung und realistischen Erwartungen."
              />

              <ol className="mt-12 border-t border-[rgb(var(--magicks-line-rgb)/0.12)]">
                {FAQ_ITEMS.map((item, index) => (
                  <li
                    key={item.question}
                    data-ku-reveal
                    className="border-b border-[rgb(var(--magicks-line-rgb)/0.12)]"
                  >
                    <details className="group/kufaq">
                      <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-5 py-6 outline-none [&::-webkit-details-marker]:hidden md:gap-x-8 md:py-7">
                        <span className="font-mono pt-[0.32rem] text-[10.5px] font-medium leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.68)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-ui text-[1.08rem] font-[620] leading-[1.28] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)] md:text-[1.22rem]">
                          {item.question}
                        </h3>
                        <span
                          aria-hidden
                          className="font-instrument self-center text-[1.4rem] italic leading-none text-[rgb(var(--magicks-ink-rgb)/0.5)] transition-transform duration-500 group-open/kufaq:rotate-45"
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

          <FaqJsonLd id="ki-automation-unternehmen" items={FAQ_ITEMS} />
        </section>

        <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16 lg:py-32">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem] space-y-12 sm:space-y-14 md:space-y-16">
              {RELATED_LINKS.map((item) => (
                <div key={item.to} data-ku-reveal>
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
                "radial-gradient(ellipse 62% 46% at 24% 20%, rgba(166,138,98,0.13), transparent 74%), radial-gradient(ellipse 52% 40% at 80% 76%, rgba(96,128,138,0.1), transparent 76%)",
            }}
          />
          <div className="relative layout-max">
            <div
              data-ku-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow>Nächster Schritt</Eyebrow>
              <h2 className="font-ui mx-auto mt-7 max-w-[22ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.9rem]">
                Bereit für Prozesse, die weniger Zeit kosten und mehr leisten?
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[50rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Lassen Sie uns klären, welche wiederkehrenden Aufgaben,
                Datenübergaben oder Anfrageprozesse durch KI-Automation sinnvoll
                entlastet werden können.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta to="/kontakt" label="KI-Automation besprechen" />
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
