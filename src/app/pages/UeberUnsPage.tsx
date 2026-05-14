import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { useReducedMotion } from "../hooks/useReducedMotion";
import { registerGsap } from "../lib/gsap";
import { runRouteReveal } from "../lib/routeReveal";
import { RouteSEO } from "../seo/RouteSEO";

type TextCard = {
  title: string;
  text: string;
};

type ServiceCard = TextCard & {
  to: string;
  label: string;
};

type SupportLink = {
  to: string;
  label: string;
  text: string;
};

const TRUST_LINE = ["Kassel", "Design", "Entwicklung", "SEO", "Content", "Automationen"] as const;

const POSITIONING_POINTS: TextCard[] = [
  {
    title: "Design mit Haltung",
    text: "Gestaltung soll nicht dekorieren, sondern Anspruch, Qualität und Orientierung sichtbar machen.",
  },
  {
    title: "Entwicklung mit Struktur",
    text: "Technik muss sauber, wartbar, performant und für den nächsten Schritt vorbereitet sein.",
  },
  {
    title: "Inhalte mit Klarheit",
    text: "Texte, Bildwelt und Nutzerführung erklären, warum ein Unternehmen vertrauenswürdig ist.",
  },
  {
    title: "SEO mit Nutzerführung",
    text: "Sichtbarkeit entsteht nicht durch Wortlisten, sondern durch Seiten, die Suchintention und Entscheidung zusammenbringen.",
  },
  {
    title: "Automationen mit echtem Nutzen",
    text: "Workflows helfen nur, wenn sie reale Arbeit reduzieren und für Teams nachvollziehbar bleiben.",
  },
  {
    title: "Betreuung mit Verantwortung",
    text: "Nach dem Launch zählen Pflege, Erweiterbarkeit, klare Übergaben und ein Blick auf den Alltag.",
  },
];

const WORK_STEPS: TextCard[] = [
  {
    title: "Verstehen",
    text: "Wir klären, was Ihr Unternehmen ausmacht, welche Ziele relevant sind und wo digitaler Mehrwert entstehen soll.",
  },
  {
    title: "Strukturieren",
    text: "Wir ordnen Inhalte, Nutzerführung, Funktionen, Prozesse und technische Anforderungen.",
  },
  {
    title: "Gestalten",
    text: "Wir entwickeln ein hochwertiges Design, das nicht nur gut aussieht, sondern Ihre Leistungen klarer macht.",
  },
  {
    title: "Entwickeln",
    text: "Wir setzen sauber, responsiv, performant und technisch nachvollziehbar um.",
  },
  {
    title: "Verbinden",
    text: "Wenn sinnvoll, werden Website, Formulare, Shops, Software, CRM, Daten oder Automationen miteinander verbunden.",
  },
  {
    title: "Weiterentwickeln",
    text: "Nach dem Launch können Analyse, Optimierung, Pflege und Erweiterungen folgen.",
  },
];

const VALUES: TextCard[] = [
  {
    title: "Klarheit",
    text: "Digitale Lösungen müssen verständlich sein — für Nutzer, Kunden und das Unternehmen selbst.",
  },
  {
    title: "Qualität",
    text: "Design, Technik und Inhalte sollen nicht nur im Entwurf überzeugen, sondern auch nach dem Launch Bestand haben.",
  },
  {
    title: "Wirkung",
    text: "Ein digitaler Auftritt muss erklären, Vertrauen schaffen und den nächsten Schritt erleichtern.",
  },
  {
    title: "Struktur",
    text: "Gute Ergebnisse entstehen nicht durch Zufall, sondern durch saubere Ordnung von Inhalt, Funktion und Technik.",
  },
  {
    title: "Verantwortung",
    text: "Wir übernehmen Verantwortung für die Umsetzung und denken mit, statt nur Aufgaben abzuarbeiten.",
  },
  {
    title: "Weiterentwicklung",
    text: "Digitale Lösungen dürfen wachsen, wenn das Unternehmen wächst.",
  },
];

const SERVICES: ServiceCard[] = [
  {
    title: "Websites & Landingpages",
    text: "Digitale Auftritte, die Vertrauen schaffen, Leistungen verständlich machen und Anfragen erleichtern.",
    to: "/websites-landingpages",
    label: "Websites ansehen",
  },
  {
    title: "Shops & Produktkonfiguratoren",
    text: "Verkaufsflächen und Konfiguratoren, die Produkte klarer erklären und Entscheidungen leichter machen.",
    to: "/shops-produktkonfiguratoren",
    label: "Commerce ansehen",
  },
  {
    title: "Web-Software",
    text: "Portale, Dashboards und Anwendungen für Prozesse, die nicht länger in Tabellen oder Insellösungen hängen sollen.",
    to: "/web-software",
    label: "Software ansehen",
  },
  {
    title: "KI & Automationen",
    text: "Workflows, Integrationen und KI-Automationen, die wiederkehrende Arbeit reduzieren und Systeme verbinden.",
    to: "/ki-automationen-integrationen",
    label: "Automationen ansehen",
  },
];

const SUPPORT_LINKS: SupportLink[] = [
  {
    to: "/seo-sichtbarkeit",
    label: "SEO & Sichtbarkeit",
    text: "Struktur, Inhalte und Technik für Seiten, die gefunden und verstanden werden.",
  },
  {
    to: "/content-bildwelt-medien",
    label: "Content, Bildwelt & Medien",
    text: "Texte, Bilder, Video und visuelle Systeme, die Auftritte hochwertiger und eigenständiger machen.",
  },
  {
    to: "/website-im-abo",
    label: "Website im Abo",
    text: "Ein planbarer Weg für Unternehmen, die Website, Pflege und Weiterentwicklung verbinden möchten.",
  },
  {
    to: "/website-starter",
    label: "Website Starter",
    text: "Ein klarer Einstieg für kleinere Unternehmen, die professioneller online auftreten wollen.",
  },
];

const AUDIENCES: TextCard[] = [
  {
    title: "Lokale Unternehmen und Dienstleister",
    text: "Für Betriebe, die in Kassel, Nordhessen oder darüber hinaus professioneller sichtbar werden möchten.",
  },
  {
    title: "Kleine und mittlere Unternehmen",
    text: "Für Teams, die einen hochwertigen digitalen Auftritt brauchen, aber keine aufgeblähten Prozesse.",
  },
  {
    title: "Erklärungsbedürftige Leistungen",
    text: "Für Unternehmen, deren Angebot mehr braucht als ein paar schöne Bilder und einen Kontaktbutton.",
  },
  {
    title: "Manuelle Prozesse",
    text: "Für Organisationen, die Daten, Anfragen, Tools und Übergaben besser verbinden möchten.",
  },
  {
    title: "Produkte mit Varianten",
    text: "Für Anbieter, deren Produkte über Shops, Konfiguratoren oder Anfrageflows klarer verkauft werden können.",
  },
  {
    title: "Ein Partner statt viele Stellen",
    text: "Für Unternehmen, die Design, Entwicklung, SEO, Content und Automationen nicht getrennt koordinieren möchten.",
  },
];

const TRUST_REASONS: TextCard[] = [
  {
    title: "Ein Ansprechpartner für mehrere Disziplinen",
    text: "Design, Entwicklung, Content, SEO und Automationen werden zusammen gedacht, nicht als getrennte Übergaben.",
  },
  {
    title: "Direkte Kommunikation",
    text: "Sie sprechen mit Menschen, die verstehen, gestalten und umsetzen, nicht nur Aufgaben weiterreichen.",
  },
  {
    title: "Saubere technische Umsetzung",
    text: "Der Auftritt soll nicht nur gut aussehen, sondern schnell laden, wartbar bleiben und zuverlässig funktionieren.",
  },
  {
    title: "Hochwertige Gestaltung",
    text: "MAGICKS entwickelt digitale Oberflächen, die den Anspruch Ihres Unternehmens sichtbar machen.",
  },
  {
    title: "Klare Struktur statt unnötiger Komplexität",
    text: "Gute digitale Projekte brauchen Vorbereitung, Entscheidungen und Verantwortung, nicht möglichst viele Schleifen.",
  },
  {
    title: "Regionale Nähe und digitale Zusammenarbeit",
    text: "MAGICKS sitzt in Kassel und arbeitet regional ebenso wie remote für Projekte darüber hinaus.",
  },
];

const AVOID_POINTS = [
  "Keine Baukastenoptik.",
  "Keine leeren Agenturfloskeln.",
  "Keine Gestaltung ohne klare Nutzerführung.",
  "Keine Technik, die nach dem Launch schwer zu pflegen ist.",
  "Keine Automationen ohne echten Prozessnutzen.",
  "Keine Projekte, bei denen niemand Verantwortung für das Ergebnis übernimmt.",
] as const;

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.74)] sm:text-[10.75px]">
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
    <div data-about-reveal className="max-w-[62rem]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-ui mt-7 max-w-[24ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
        {title}
      </h2>
      {text ? (
        <p className="font-ui mt-7 max-w-[55rem] text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
          {text}
        </p>
      ) : null}
    </div>
  );
}

function InfoCard({ item, index }: { item: TextCard; index?: number }) {
  return (
    <article
      data-about-reveal
      className="rounded-[1.1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.58)] p-5 shadow-[0_18px_52px_-44px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6"
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

export default function UeberUnsPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-about-hero-item]");
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-about-reveal]");

      if (reduced) {
        gsap.set([...heroItems, ...revealItems], {
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
        revealItems,
        heroYOffset: 16,
        revealYOffset: 18,
        blur: 4,
        duration: 0.72,
        heroStagger: 0.055,
        revealStart: "top 88%",
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/ueber-uns" />

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
                "radial-gradient(ellipse 58% 46% at 18% 18%, rgba(166,138,98,0.14), transparent 72%), radial-gradient(ellipse 52% 40% at 84% 36%, rgba(96,128,138,0.12), transparent 74%), radial-gradient(ellipse 74% 44% at 50% 94%, rgba(255,255,255,0.58), transparent 76%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.24]"
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
              <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,0.58fr)] lg:items-end lg:gap-16">
                <div>
                  <div data-about-hero-item>
                    <Eyebrow>MAGICKS Studio · Kassel</Eyebrow>
                  </div>

                  <h1
                    data-about-hero-item
                    className="font-ui mt-7 max-w-[17ch] text-[2.42rem] font-[650] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.35rem] md:text-[4.42rem] lg:text-[5.1rem]"
                  >
                    Ein Studio für digitale Auftritte, die nicht nur gut aussehen. Sondern wirken.
                  </h1>

                  <p
                    data-about-hero-item
                    className="font-ui mt-8 max-w-[54rem] text-[1.03rem] font-[480] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.1rem] md:text-[1.18rem]"
                  >
                    MAGICKS Studio aus Kassel entwickelt Websites,
                    Landingpages, Shops, Web-Software und Automationen für
                    Unternehmen, die digital hochwertiger auftreten, klarer
                    erklären und effizienter arbeiten möchten.
                  </p>

                  <div
                    data-about-hero-item
                    className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12"
                  >
                    <PrimaryCta to="/kontakt" label="Projekt besprechen" />
                    <SecondaryCta to="/leistungen" label="Leistungen ansehen" />
                  </div>
                </div>

                <aside
                  data-about-hero-item
                  className="rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.66)] p-5 shadow-[0_24px_68px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.76)] sm:p-6"
                >
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)]">
                    Studio-Rahmen
                  </p>
                  <div className="mt-6 grid gap-3">
                    {TRUST_LINE.map((item) => (
                      <div
                        key={item}
                        className="flex items-baseline justify-between gap-4 border-b border-[rgb(var(--magicks-line-rgb)/0.1)] pb-3 last:border-b-0 last:pb-0"
                      >
                        <span className="font-ui text-[1rem] font-[610] leading-[1.35] text-[rgb(var(--magicks-ink-rgb)/0.88)]">
                          {item}
                        </span>
                        <span
                          aria-hidden
                          className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[rgb(var(--magicks-ink-rgb)/0.32)]"
                        >
                          in house
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="font-ui mt-6 text-[14.2px] leading-[1.64] text-[rgb(var(--magicks-ink-rgb)/0.62)]">
                    Ein direkter Arbeitsrahmen für digitale Projekte, die
                    Gestaltung, Technik, Inhalte und Prozesse zusammenbringen.
                  </p>
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-16">
                <SectionIntro
                  eyebrow="Was MAGICKS ausmacht"
                  title="Wir verbinden Gestaltung, Entwicklung und digitale Systeme."
                />
                <div data-about-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Viele digitale Projekte werden getrennt gedacht: Design
                    hier, Technik dort, Inhalte irgendwo dazwischen. MAGICKS
                    denkt diese Bereiche zusammen. So entstehen digitale
                    Auftritte, die hochwertig wirken, verständlich erklären und
                    technisch sauber funktionieren.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {POSITIONING_POINTS.map((item, index) => (
                  <InfoCard key={item.title} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div
                data-about-reveal
                className="rounded-[1.65rem] border border-[rgb(var(--magicks-line-rgb)/0.11)] bg-[linear-gradient(160deg,rgba(255,255,255,0.78)_0%,rgba(246,242,233,0.64)_100%)] p-6 shadow-[0_24px_72px_-54px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.78)] sm:p-8 md:p-10"
              >
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
                  <div>
                    <Eyebrow>Warum wir anders arbeiten</Eyebrow>
                    <h2 className="font-ui mt-7 max-w-[21ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.65rem] md:text-[3.25rem]">
                      Anders arbeiten heißt für uns: klarer, direkter und verantwortlicher.
                    </h2>
                  </div>
                  <div className="lg:pt-14">
                    <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                      Wir glauben nicht an unnötig aufgeblähte Prozesse. Aber
                      wir glauben an saubere Vorbereitung, klare Entscheidungen
                      und eine Umsetzung, die im Alltag funktioniert. Ein gutes
                      digitales Projekt braucht keine endlosen Schleifen — es
                      braucht Verständnis, Struktur und Verantwortung.
                    </p>
                  </div>
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
                eyebrow="Wie wir arbeiten"
                title="So entsteht digitale Qualität."
                text="Der Prozess bleibt klar, weil jeder Schritt eine Aufgabe hat: verstehen, ordnen, gestalten, entwickeln, verbinden und weiter verbessern."
              />

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {WORK_STEPS.map((item, index) => (
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
                eyebrow="Wofür MAGICKS steht"
                title="Haltung, die im Projekt nützlich wird."
                text="MAGICKS darf Haltung haben. Aber sie muss dem Ergebnis dienen: mehr Klarheit, bessere Entscheidungen und digitale Lösungen, die im Alltag bestehen."
              />

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {VALUES.map((item, index) => (
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
                eyebrow="Was wir bauen"
                title="Was daraus entstehen kann."
                text="MAGICKS arbeitet nicht in isolierten Einzelleistungen. Eine Website kann mit SEO, Content, Formularen, Automationen oder Software verbunden werden. Ein Shop kann mit Konfiguratoren, Daten und Prozessen wachsen. Entscheidend ist, welche digitale Lösung Ihr Unternehmen wirklich weiterbringt."
              />

              <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {SERVICES.map((item, index) => (
                  <article
                    key={item.to}
                    data-about-reveal
                    className="group flex min-h-[22rem] flex-col rounded-[1.15rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.58)] p-5 shadow-[0_18px_52px_-44px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)] transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-[2px] hover:border-[rgb(var(--magicks-line-rgb)/0.2)] hover:shadow-[0_26px_68px_-48px_rgba(20,28,44,0.34)] sm:p-6"
                  >
                    <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.7)]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-ui mt-5 text-[1.28rem] font-[620] leading-[1.18] tracking-[-0.018em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                      {item.title}
                    </h3>
                    <p className="font-ui mt-4 text-[14.6px] leading-[1.66] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                      {item.text}
                    </p>
                    <Link
                      to={item.to}
                      className="font-ui mt-auto inline-flex min-h-11 items-center gap-2 pt-8 text-[14.5px] font-[620] text-[rgb(var(--magicks-ink-rgb)/0.84)] no-underline transition-colors duration-500 group-hover:text-[rgb(var(--magicks-ink-rgb)/0.98)]"
                    >
                      {item.label}
                      <span aria-hidden className="font-instrument italic transition-transform duration-500 group-hover:translate-x-1">
                        ↗
                      </span>
                    </Link>
                  </article>
                ))}
              </div>

              <div className="mt-10 grid gap-3 md:grid-cols-2">
                {SUPPORT_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    data-about-reveal
                    to={item.to}
                    className="group rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.42)] p-5 no-underline transition-[transform,border-color,background-color] duration-500 hover:-translate-y-[1px] hover:border-[rgb(var(--magicks-line-rgb)/0.2)] hover:bg-[rgb(var(--magicks-bg-lifted-rgb)/0.7)]"
                  >
                    <span className="font-ui text-[1rem] font-[620] text-[rgb(var(--magicks-ink-rgb)/0.9)]">
                      {item.label}
                    </span>
                    <span className="font-instrument ml-2 italic text-[rgb(var(--magicks-accent-ink-rgb)/0.7)] transition-transform duration-500 group-hover:translate-x-1">
                      ↗
                    </span>
                    <p className="font-ui mt-3 text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.64)]">
                      {item.text}
                    </p>
                  </Link>
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
                eyebrow="Für wen MAGICKS arbeitet"
                title="Für Unternehmen, die digital klarer auftreten und besser arbeiten wollen."
              />

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AUDIENCES.map((item, index) => (
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
                eyebrow="Warum Unternehmen mit MAGICKS arbeiten"
                title="Vertrauen entsteht durch Klarheit, Verantwortung und gute Umsetzung."
              />

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {TRUST_REASONS.map((item, index) => (
                  <InfoCard key={item.title} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div
                data-about-reveal
                className="rounded-[1.65rem] border border-[rgb(var(--magicks-line-rgb)/0.11)] bg-[linear-gradient(160deg,rgba(255,255,255,0.8)_0%,rgba(239,235,226,0.68)_100%)] p-6 shadow-[0_24px_72px_-54px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.78)] sm:p-8 md:p-10"
              >
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
                  <div>
                    <Eyebrow>Kassel & darüber hinaus</Eyebrow>
                    <h2 className="font-ui mt-7 max-w-[19ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.65rem] md:text-[3.25rem]">
                      Verwurzelt in Kassel. Digital nicht begrenzt.
                    </h2>
                  </div>
                  <div className="lg:pt-14">
                    <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                      MAGICKS sitzt in Kassel und arbeitet für Unternehmen aus
                      der Region ebenso wie remote für Projekte darüber hinaus.
                      Wichtig ist nicht die Entfernung, sondern ein klarer
                      Prozess, gute Kommunikation und ein gemeinsames
                      Verständnis für das Ziel.
                    </p>
                  </div>
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
                title="Gute digitale Arbeit braucht weniger Floskel und mehr Verantwortung."
              />

              <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AVOID_POINTS.map((point) => (
                  <li
                    key={point}
                    data-about-reveal
                    className="rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] p-5 shadow-[0_18px_48px_-42px_rgba(20,28,44,0.24),inset_0_1px_0_rgba(255,255,255,0.72)]"
                  >
                    <p className="font-ui text-[1rem] font-[610] leading-[1.34] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.88)]">
                      {point}
                    </p>
                  </li>
                ))}
              </ul>
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
              data-about-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow>Nächster Schritt</Eyebrow>
              <h2 className="font-ui mx-auto mt-7 max-w-[19ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.9rem]">
                Passt MAGICKS zu Ihrem Projekt?
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[50rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Beschreiben Sie kurz, worum es geht. Wir melden uns mit einer
                klaren Einschätzung — ohne Druck, ohne Standard-Pitch.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta to="/kontakt" label="Projekt besprechen" />
                <SecondaryCta to="/leistungen" label="Leistungen ansehen" />
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
