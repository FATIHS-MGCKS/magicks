import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { runRouteReveal } from "../lib/routeReveal";
import { RouteSEO } from "../seo/RouteSEO";

type ServicePillar = {
  title: string;
  intro: string;
  deliverables: string[];
  result: string;
  to: string;
  cta: string;
};

type FocusPoint = {
  title: string;
  text: string;
};

type AudienceCard = {
  title: string;
  text: string;
};

type WorkflowStep = {
  title: string;
  text: string;
};

const SERVICE_PILLARS: ServicePillar[] = [
  {
    title: "Websites & Landingpages",
    intro:
      "Für Auftritte, die Vertrauen schaffen, Leistungen verständlich machen und aus Besuchern echte Anfragen machen.",
    deliverables: [
      "Unternehmenswebsites",
      "Landingpages",
      "Lokale SEO-Seiten",
      "Conversion-Struktur",
      "Texte, Bildwelt und UX",
      "Hosting, Analyse und Optimierung",
    ],
    result:
      "Sie erhalten einen digitalen Auftritt, der hochwertig wirkt, klar führt und im Alltag zuverlässig performt.",
    to: "/websites-landingpages",
    cta: "Mehr zu Websites & Landingpages",
  },
  {
    title: "Shops & Konfiguratoren",
    intro:
      "Für Produkte, die klarer präsentiert, besser erklärt und leichter verkauft werden.",
    deliverables: [
      "Shopify-Shops",
      "Produktseiten",
      "Konfiguratoren",
      "Angebots- und Anfrageflows",
      "Checkout- und Conversion-Optimierung",
      "Visuelle Produktkommunikation",
    ],
    result:
      "Sie verkaufen verständlicher, reduzieren Rückfragen und steigern die Abschlusswahrscheinlichkeit über den gesamten Flow.",
    to: "/shops-produktkonfiguratoren",
    cta: "Mehr zu Shops & Konfiguratoren",
  },
  {
    title: "Web-Software",
    intro:
      "Für Prozesse, die nicht länger in Tabellen, Tools und manuellen Umwegen hängen.",
    deliverables: [
      "Kundenportale",
      "Interne Dashboards",
      "Buchungs- und Anfrageprozesse",
      "Datenverwaltung",
      "Schnittstellen",
      "Individuelle Web-Apps",
    ],
    result:
      "Sie schaffen transparente Abläufe, reduzieren Fehlerquellen und gewinnen eine technische Basis, die mit Ihrem Unternehmen mitwächst.",
    to: "/web-software",
    cta: "Mehr zu Web-Software",
  },
  {
    title: "KI & Automationen",
    intro:
      "Für Abläufe, die schneller, smarter und weniger manuell funktionieren.",
    deliverables: [
      "KI-gestützte Workflows",
      "Automationen",
      "Dokumentenverarbeitung",
      "CRM- und Lead-Prozesse",
      "Benachrichtigungen und Reports",
      "Integrationen zwischen bestehenden Tools",
    ],
    result:
      "Sie entlasten Ihr Team bei wiederkehrenden Aufgaben und machen Prozesse planbarer, nachvollziehbarer und skalierbarer.",
    to: "/ki-automationen-integrationen",
    cta: "Mehr zu KI & Automationen",
  },
];

const FOCUS_POINTS: FocusPoint[] = [
  {
    title: "Ein Auftritt, der erklärt",
    text: "Ihre Leistungen werden klar kommuniziert und schneller verstanden.",
  },
  {
    title: "Eine Struktur, die verkauft",
    text: "Nutzerführung und Angebotslogik unterstützen konkrete Entscheidungen.",
  },
  {
    title: "Systeme, die Prozesse vereinfachen",
    text: "Daten und Abläufe laufen konsistent statt verteilt über Einzellösungen.",
  },
  {
    title: "Automationen, die Arbeit reduzieren",
    text: "Wiederkehrende Schritte werden zuverlässig automatisiert.",
  },
  {
    title: "Daten, die Entscheidungen leichter machen",
    text: "Kennzahlen werden sichtbar, auswertbar und direkt nutzbar.",
  },
];

const AUDIENCE_CARDS: AudienceCard[] = [
  {
    title: "Hochwertiger digitaler Auftritt",
    text: "Für Unternehmen, deren Website professioneller wirken und gleichzeitig besser überzeugen soll.",
  },
  {
    title: "Mehr qualifizierte Anfragen",
    text: "Für Dienstleister, die planbar neue Anfragen aus dem digitalen Auftritt gewinnen möchten.",
  },
  {
    title: "Erklärungsbedürftige Leistungen",
    text: "Für Betriebe, die komplexe Angebote klar, verständlich und vertrauensstark darstellen müssen.",
  },
  {
    title: "Produkte digital besser verkaufen",
    text: "Für Anbieter, die Produkte online überzeugender präsentieren oder direkt verkaufen möchten.",
  },
  {
    title: "Weniger Tabellen und Tool-Chaos",
    text: "Für Teams mit manuellen Prozessen, die strukturierter und effizienter arbeiten wollen.",
  },
  {
    title: "Ein Partner statt viele Stellen",
    text: "Für Unternehmen, die Design, Entwicklung, SEO, Hosting und Automationen zusammen denken möchten.",
  },
];

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    title: "Verstehen",
    text: "Wir klären Ziele, Zielgruppen, Angebot und die wichtigsten geschäftlichen Hebel.",
  },
  {
    title: "Strukturieren",
    text: "Wir definieren Seiten, Inhalte, Prozesse und Datenflüsse mit klarer Priorität.",
  },
  {
    title: "Gestalten",
    text: "Wir entwickeln eine visuelle und inhaltliche Linie, die hochwertig wirkt und klar führt.",
  },
  {
    title: "Entwickeln",
    text: "Wir setzen technisch sauber, performant und wartbar um.",
  },
  {
    title: "Verbinden",
    text: "Wir integrieren relevante Tools, Systeme und Automationen in einen funktionierenden Ablauf.",
  },
  {
    title: "Optimieren",
    text: "Wir analysieren Ergebnisse und verbessern den Auftritt Schritt für Schritt weiter.",
  },
];

function Eyebrow({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-3 rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.22)] bg-[rgb(var(--magicks-accent-rgb)/0.07)] px-3 py-2 font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.78)] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] sm:text-[11px] sm:tracking-[0.22em]">
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--magicks-accent-rgb)/0.72)]"
      />
      {text}
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
        style={{ fontVariantEmoji: "text" }}
      >
        {"\u2197\uFE0E"}
      </span>
    </Link>
  );
}

export default function LeistungenPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-leis-hero-item]");
      const sections = gsap.utils.toArray<HTMLElement>("[data-leis-reveal]");

      if (reduced) {
        gsap.set([...heroItems, ...sections], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      runRouteReveal({
        gsap,
        root,
        heroItems,
        revealItems: sections,
        revealYOffset: 24,
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/leistungen" />

      <main
        ref={rootRef}
        className="relative overflow-hidden bg-[var(--magicks-bg-base)] pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.25rem]"
      >
        <section className="relative overflow-hidden px-5 pb-24 pt-8 sm:px-8 sm:pb-32 sm:pt-10 md:px-12 md:pb-40 lg:px-16 lg:pb-48">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 56% 44% at 22% 16%, rgba(166,138,98,0.13), transparent 72%), radial-gradient(ellipse 48% 38% at 82% 34%, rgba(94,118,148,0.12), transparent 74%), radial-gradient(ellipse 74% 44% at 50% 92%, rgba(255,255,255,0.56), transparent 76%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(46,56,76,0.05) 60%, rgba(46,56,76,0.1) 100%)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="mx-auto max-w-[60rem] text-center">
                <div data-leis-hero-item>
                  <Eyebrow text="Leistungen" />
                </div>

                <h1
                  data-leis-hero-item
                  className="font-ui mx-auto mt-7 max-w-[17ch] text-[2.35rem] font-[630] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.3rem] md:text-[4.35rem] lg:text-[5.1rem]"
                >
                  <span className="block">
                    Leistungen, die nicht nur gut aussehen.
                  </span>
                  <span className="font-instrument mt-2 block italic font-normal text-[rgb(var(--magicks-ink-rgb)/0.64)]">
                    Sondern Ihr Unternehmen weiterbringen.
                  </span>
                </h1>

                <p
                  data-leis-hero-item
                  className="font-ui mx-auto mt-8 max-w-[52rem] text-[1.03rem] font-[480] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.1rem] md:text-[1.18rem]"
                >
                  Von Websites und Landingpages über Shops und Konfiguratoren
                  bis zu Web-Software, KI-Automationen und Integrationen.
                  MAGICKS verbindet Design, Entwicklung und Strategie zu
                  digitalen Lösungen, die hochwertig wirken, verständlich
                  bleiben und im Alltag funktionieren.
                </p>

                <div
                  data-leis-hero-item
                  className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12"
                >
                  <PrimaryCta to="/kontakt" label="Projekt besprechen" />
                  <a
                    href="#leistungspakete"
                    className="group inline-flex min-h-11 items-center gap-2 px-2 font-ui text-[15px] font-[560] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.74)] no-underline transition-colors duration-500 hover:text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[15.5px]"
                  >
                    <span className="relative pb-1">
                      Leistungen ansehen
                      <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-px bg-[rgb(var(--magicks-line-rgb)/0.28)] transition-colors duration-500 group-hover:bg-[rgb(var(--magicks-line-rgb)/0.62)]"
                      />
                    </span>
                    <span
                      aria-hidden
                      className="font-instrument text-[1.04em] italic"
                    >
                      ↓
                    </span>
                  </a>
                </div>
              </div>

              <div
                data-leis-hero-item
                className="mx-auto mt-14 grid max-w-[68rem] gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4"
              >
                {[
                  {
                    label: "Auftritt",
                    text: "Websites und Landingpages, die Vertrauen aufbauen.",
                  },
                  {
                    label: "Verkauf",
                    text: "Shops und Konfiguratoren, die Entscheidungen erleichtern.",
                  },
                  {
                    label: "Prozesse",
                    text: "Web-Software, die Abläufe klar und effizient strukturiert.",
                  },
                  {
                    label: "Automationen",
                    text: "KI-gestützte Workflows, die Ihr Team spürbar entlasten.",
                  },
                ].map((item) => (
                  <article
                    key={item.label}
                    className="rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.58)] p-4 shadow-[0_20px_56px_-48px_rgba(20,28,44,0.35),inset_0_1px_0_rgba(255,255,255,0.74)] sm:p-5"
                  >
                    <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.74)] sm:text-[11px]">
                      {item.label}
                    </p>
                    <p className="font-ui mt-2 text-[14.5px] leading-[1.6] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                      {item.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="leistungspakete"
          className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16"
        >
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-leis-reveal className="max-w-[56rem]">
                <Eyebrow text="Leistungsbereiche" />
                <h2 className="font-ui mt-7 max-w-[20ch] text-[2.1rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.85rem] md:text-[3.65rem]">
                  Vier Bereiche, die zusammen ein starkes digitales System
                  ergeben.
                </h2>
                <p className="font-ui mt-7 max-w-[50rem] text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                  Jede Leistung ist einzeln wertvoll. Der größte Effekt entsteht,
                  wenn Auftritt, Verkauf, Prozesse und Automationen konsequent
                  aufeinander abgestimmt sind.
                </p>
              </div>

              <div className="mt-12 grid gap-6 md:mt-14 lg:grid-cols-2">
                {SERVICE_PILLARS.map((pillar, index) => (
                  <article
                    key={pillar.title}
                    data-leis-reveal
                    className="rounded-[1.5rem] border border-[rgb(var(--magicks-line-rgb)/0.11)] bg-[linear-gradient(168deg,rgba(255,255,255,0.84)_0%,rgba(246,242,234,0.72)_100%)] p-6 shadow-[0_28px_76px_-58px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.82)] sm:p-8"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.22em] text-[rgb(var(--magicks-accent-ink-rgb)/0.74)] sm:text-[11px]">
                        {String(index + 1).padStart(2, "0")} / 04
                      </span>
                      <span
                        aria-hidden
                        className="h-px flex-1 bg-[rgb(var(--magicks-line-rgb)/0.14)]"
                      />
                    </div>

                    <h3 className="font-ui mt-5 text-[1.7rem] font-[620] leading-[1.12] tracking-[-0.022em] text-[rgb(var(--magicks-ink-rgb)/0.94)] sm:text-[2.05rem]">
                      {pillar.title}
                    </h3>
                    <p className="font-ui mt-4 text-[15px] leading-[1.66] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[15.5px]">
                      {pillar.intro}
                    </p>

                    <ul className="mt-6 grid gap-2.5">
                      {pillar.deliverables.map((item) => (
                        <li
                          key={item}
                          className="font-ui flex items-start gap-2.5 text-[14.5px] leading-[1.56] text-[rgb(var(--magicks-ink-rgb)/0.74)]"
                        >
                          <span
                            aria-hidden
                            className="mt-[0.55em] h-1.5 w-1.5 rounded-full bg-[rgb(var(--magicks-accent-rgb)/0.72)]"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="font-ui mt-7 rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.52)] px-4 py-3 text-[14.5px] leading-[1.58] text-[rgb(var(--magicks-ink-rgb)/0.74)] sm:text-[15px]">
                      <span className="font-[620] text-[rgb(var(--magicks-ink-rgb)/0.9)]">
                        Ergebnis:
                      </span>{" "}
                      {pillar.result}
                    </p>

                    <Link
                      to={pillar.to}
                      className="group mt-6 inline-flex min-h-11 items-center gap-2 font-ui text-[15px] font-[560] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.78)] no-underline transition-colors duration-500 hover:text-[rgb(var(--magicks-ink-rgb)/0.98)]"
                    >
                      <span className="relative pb-1">
                        {pillar.cta}
                        <span
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-px bg-[rgb(var(--magicks-line-rgb)/0.28)] transition-colors duration-500 group-hover:bg-[rgb(var(--magicks-line-rgb)/0.62)]"
                        />
                      </span>
                      <span
                        aria-hidden
                        className="font-instrument text-[1.02em] italic"
                      >
                        ↗
                      </span>
                    </Link>
                  </article>
                ))}
              </div>

              <div
                data-leis-reveal
                className="mt-8 rounded-[1.2rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.55)] p-5 sm:mt-10 sm:p-6"
              >
                <p className="font-ui text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.68)] sm:text-[15px]">
                  Für planbare monatliche Budgets bieten wir zusätzlich ein
                  strukturiertes Einstiegsmodell:
                  <Link
                    to="/website-im-abo"
                    className="ml-2 inline-flex items-center gap-1.5 text-[rgb(var(--magicks-ink-rgb)/0.9)] no-underline hover:text-[rgb(var(--magicks-ink-rgb)/1)]"
                  >
                    <span className="underline decoration-[rgb(var(--magicks-line-rgb)/0.36)] underline-offset-[4px]">
                      Website im Abo
                    </span>
                    <span aria-hidden className="font-instrument italic">
                      ↗
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-18">
                <div data-leis-reveal>
                  <Eyebrow text="Warum alles zusammengehört" />
                  <h2 className="font-ui mt-7 max-w-[16ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.4rem]">
                    Ein guter digitaler Auftritt endet nicht bei der Website.
                  </h2>
                </div>
                <div data-leis-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Viele Unternehmen trennen Website, Shop, Daten, Prozesse
                    und Automationen voneinander. Dadurch entstehen doppelte
                    Arbeit, unklare Abläufe und digitale Lösungen, die nicht
                    zusammenarbeiten. MAGICKS denkt diese Bereiche gemeinsam —
                    damit Ihr Auftritt nicht nur sichtbar ist, sondern auch im
                    Hintergrund funktioniert.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {FOCUS_POINTS.map((item) => (
                  <article
                    key={item.title}
                    data-leis-reveal
                    className="rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] p-4 shadow-[0_18px_52px_-44px_rgba(20,28,44,0.3),inset_0_1px_0_rgba(255,255,255,0.74)] sm:p-5"
                  >
                    <h3 className="font-ui text-[1rem] font-[610] leading-[1.28] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                      {item.title}
                    </h3>
                    <p className="font-ui mt-2 text-[14px] leading-[1.56] text-[rgb(var(--magicks-ink-rgb)/0.66)] sm:text-[14.5px]">
                      {item.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-leis-reveal className="max-w-[58rem]">
                <Eyebrow text="Für wen das passt" />
                <h2 className="font-ui mt-7 max-w-[23ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Für Unternehmen, die digital klarer auftreten und effizienter
                  arbeiten wollen.
                </h2>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AUDIENCE_CARDS.map((card) => (
                  <article
                    key={card.title}
                    data-leis-reveal
                    className="rounded-[1.15rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.5)] p-5 shadow-[0_20px_54px_-46px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6"
                  >
                    <h3 className="font-ui text-[1.08rem] font-[610] leading-[1.3] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.93)] sm:text-[1.15rem]">
                      {card.title}
                    </h3>
                    <p className="font-ui mt-3 text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.67)]">
                      {card.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-leis-reveal className="max-w-[58rem]">
                <Eyebrow text="Arbeitsweise" />
                <h2 className="font-ui mt-7 max-w-[18ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Strategisch gedacht. Sauber umgesetzt. Langfristig betreut.
                </h2>
              </div>

              <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {WORKFLOW_STEPS.map((step, index) => (
                  <li
                    key={step.title}
                    data-leis-reveal
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
              data-leis-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow text="Nächster Schritt" />
              <h2 className="font-ui mx-auto mt-7 max-w-[18ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.9rem]">
                Welche digitale Lösung bringt Ihr Unternehmen wirklich weiter?
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[46rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Lassen Sie uns gemeinsam klären, was Ihr Unternehmen braucht
                und welche Lösung den größten Unterschied macht.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta to="/kontakt" label="Projekt besprechen" />
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
