import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { runRouteReveal } from "../../lib/routeReveal";
import { RouteSEO } from "../../seo/RouteSEO";
import { ContextualCrossLink } from "../../components/service/ContextualCrossLink";

type ContentBlock = {
  title: string;
  text: string;
};

type ComparisonBlock = {
  label: string;
  title: string;
  points: string[];
};

type WorkflowStep = {
  title: string;
  text: string;
};

const AUDIENCE_CASES: ContentBlock[] = [
  {
    title: "Sie möchten professionell online auftreten, ohne mit einer hohen Einmalinvestition zu starten.",
    text: "Das Modell erleichtert den Einstieg, ohne den Anspruch an Struktur, Design und technische Umsetzung zu senken.",
  },
  {
    title: "Sie bevorzugen planbare monatliche Kosten.",
    text: "Der finanzielle Rahmen wird im Gespräch passend zu Umfang, Betreuung und Bedarf strukturiert.",
  },
  {
    title: "Sie möchten Website, Hosting, Wartung und kleinere Anpassungen nicht getrennt organisieren.",
    text: "Ein Ansprechpartner kann Umsetzung und Betreuung zusammenführen, statt mehrere Stellen zu koordinieren.",
  },
  {
    title: "Sie gründen neu oder entwickeln Ihr Unternehmen gerade weiter.",
    text: "Der Auftritt kann professionell starten und später mit neuen Seiten, Inhalten oder Funktionen wachsen.",
  },
  {
    title: "Ihre aktuelle Website wirkt nicht mehr zeitgemäß.",
    text: "Wenn ein großes Einmalprojekt aktuell nicht passt, kann das monatliche Modell eine planbare Alternative sein.",
  },
  {
    title: "Sie möchten sauber starten, ohne auf Baukastenoptik auszuweichen.",
    text: "Die Website wird individuell geplant und umgesetzt, nicht aus einem beliebigen Standardpaket übernommen.",
  },
  {
    title: "Sie wünschen sich einen Ansprechpartner für Umsetzung, Betreuung und Weiterentwicklung.",
    text: "MAGICKS kann Struktur, Design, technische Umsetzung und laufende Pflege im Modell zusammen denken.",
  },
];

const INCLUDED_ITEMS: ContentBlock[] = [
  {
    title: "Konzept & Seitenstruktur",
    text: "Die Grundlage für einen klaren Auftritt, der Leistungen nachvollziehbar ordnet.",
  },
  {
    title: "Individuelles Webdesign",
    text: "Ein hochwertiges Design, das zu Ihrem Unternehmen passt und nicht nach Baukasten wirkt.",
  },
  {
    title: "Website-Texte oder Textüberarbeitung",
    text: "Je nach Modell können Texte geschärft, überarbeitet oder passend zur Seitenstruktur entwickelt werden.",
  },
  {
    title: "Responsive technische Umsetzung",
    text: "Die Website wird sauber für Desktop, Tablet und Smartphone umgesetzt.",
  },
  {
    title: "Technische SEO-Basis",
    text: "Überschriftenlogik, Meta-Grundlagen, Indexierbarkeit und saubere Seitenstruktur werden berücksichtigt.",
  },
  {
    title: "Performance-Grundlagen",
    text: "Ladezeit, Mediengrößen und technische Basis werden von Beginn an mitgedacht.",
  },
  {
    title: "Kontaktformulare und Anfragewege",
    text: "Kontaktpunkte werden so eingebunden, dass Besucher den nächsten Schritt leicht finden.",
  },
  {
    title: "Hosting und Wartung",
    text: "Je nach Modell können technische Betreuung, Updates und Wartung direkt mitgedacht werden.",
  },
  {
    title: "Kleinere Anpassungen",
    text: "Laufende Änderungen können im definierten Rahmen Teil der Betreuung sein.",
  },
  {
    title: "Support und Weiterentwicklung",
    text: "Nach dem Launch kann der Auftritt weiter gepflegt, erweitert und verbessert werden.",
  },
  {
    title: "Analyse und Optimierung",
    text: "Je nach Bedarf können Inhalte, Nutzerführung oder technische Details nachgeschärft werden.",
  },
];

const AVOID_POINTS = [
  "Kein Baukastenauftritt, der nur günstig wirkt.",
  "Kein beliebiges Massenprodukt.",
  "Kein Template, das nicht zu Ihrem Unternehmen passt.",
  "Kein Modell, bei dem Planbarkeit auf Kosten von Gestaltung, Technik oder Wirkung geht.",
  "Keine Lösung, die nach dem Launch ohne Betreuung liegen bleibt.",
  "Kein starres Paket ohne Blick auf Ihren tatsächlichen Bedarf.",
] as const;

const TRIAD: ContentBlock[] = [
  {
    title: "Monatlich",
    text: "Planbare Kosten statt hoher Einstiegshürde. Das Modell wird so besprochen, dass es zu Projektumfang und Betreuung passt.",
  },
  {
    title: "Professionell",
    text: "Individuelles Design, klare Struktur und saubere technische Umsetzung — ohne Baukastenoptik.",
  },
  {
    title: "Betreut",
    text: "Hosting, Wartung, kleinere Anpassungen oder Weiterentwicklung können direkt mitgedacht werden, damit die Website nicht nach dem Launch stehen bleibt.",
  },
];

const COMPARISON: ComparisonBlock[] = [
  {
    label: "Klassisches Projekt",
    title: "Größere Einmalinvestition",
    points: [
      "klarer Projektumfang",
      "definierter Projektabschluss",
      "passend für größere Budgets oder umfangreiche Relaunches",
    ],
  },
  {
    label: "Website im Abo",
    title: "Monatliche Struktur",
    points: [
      "planbarer Einstieg",
      "laufende Betreuung möglich",
      "passend, wenn Investition und Pflege strukturiert werden sollen",
    ],
  },
  {
    label: "Beide Modelle",
    title: "Gleicher Qualitätsanspruch",
    points: [
      "Strategie, Design und Entwicklung bleiben professionell",
      "die Wahl hängt von Ziel, Budget, Umfang und gewünschter Betreuung ab",
      "das Modell wird im Gespräch eingeordnet",
    ],
  },
];

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    title: "Klären",
    text: "Wir besprechen Ziel, Umfang, Seitenstruktur, Inhalte und welches Modell sinnvoll ist.",
  },
  {
    title: "Strukturieren",
    text: "Wir ordnen Seiten, Nutzerführung, Inhalte und Anfragewege.",
  },
  {
    title: "Gestalten",
    text: "Das Design wird individuell entwickelt und auf Ihr Unternehmen abgestimmt.",
  },
  {
    title: "Umsetzen",
    text: "Die Website wird responsiv, technisch sauber und performant umgesetzt.",
  },
  {
    title: "Betreuen",
    text: "Je nach Modell können Hosting, Wartung, kleinere Anpassungen und Weiterentwicklung laufend begleitet werden.",
  },
  {
    title: "Weiterentwickeln",
    text: "Nach dem Launch kann die Website mit Ihrem Unternehmen wachsen.",
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

function MonthlyCadence() {
  return (
    <div className="rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.62)] p-5 shadow-[0_24px_68px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.74)] sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)]">
          Monatsrhythmus
        </span>
        <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.38)]">
          M01 → M12
        </span>
      </div>

      <div className="flex items-end gap-[0.34rem]">
        {Array.from({ length: 12 }).map((_, index) => {
          const isAnchor = index === 0 || index === 5 || index === 11;
          const isCurrent = index === 3;
          const height = isCurrent
            ? "h-[2.2rem]"
            : isAnchor
              ? "h-[1.8rem]"
              : index % 3 === 0
                ? "h-[1.35rem]"
                : "h-[0.95rem]";

          return (
            <span
              key={index}
              data-wa-tick
              className={`block flex-1 rounded-full ${height} ${
                isCurrent
                  ? "bg-[rgb(var(--magicks-accent-rgb)/0.58)]"
                  : "bg-[rgb(var(--magicks-line-rgb)/0.26)]"
              }`}
            />
          );
        })}
      </div>

      <div className="font-mono mt-4 flex items-start justify-between text-[9px] font-medium uppercase leading-none tracking-[0.24em] text-[rgb(var(--magicks-ink-rgb)/0.42)] sm:text-[9.5px]">
        <span>M01</span>
        <span>Planung</span>
        <span>M12</span>
      </div>

      <div className="mt-6 grid gap-3">
        {[
          ["01", "Start mit klarer Struktur"],
          ["02", "Monatlich planbarer Rahmen"],
          ["03", "Betreuung und Entwicklung möglich"],
        ].map(([num, text]) => (
          <div
            key={num}
            className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-3 rounded-[0.9rem] border border-[rgb(var(--magicks-line-rgb)/0.09)] bg-[rgb(var(--magicks-bg-base-rgb)/0.5)] px-4 py-3"
          >
            <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.62)]">
              {num}
            </span>
            <span className="font-ui text-[14px] font-[560] leading-[1.35] text-[rgb(var(--magicks-ink-rgb)/0.7)]">
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WebsiteImAboPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-wa-hero-item]");
      const cadenceTicks = gsap.utils.toArray<HTMLElement>("[data-wa-tick]");
      const reveals = gsap.utils.toArray<HTMLElement>("[data-wa-reveal]");

      if (reduced) {
        gsap.set([...heroItems, ...cadenceTicks, ...reveals], {
          opacity: 1,
          y: 0,
          scaleY: 1,
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
        cadenceTicks,
        { scaleY: 0.28, opacity: 0.28, transformOrigin: "bottom center" },
        {
          scaleY: 1,
          opacity: 1,
          duration: 0.62,
          stagger: 0.035,
          ease: "power2.out",
        },
      );

    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/website-im-abo" />

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
                "radial-gradient(ellipse 58% 46% at 18% 18%, rgba(166,138,98,0.14), transparent 72%), radial-gradient(ellipse 52% 40% at 82% 36%, rgba(104,132,164,0.11), transparent 74%), radial-gradient(ellipse 74% 44% at 50% 94%, rgba(255,255,255,0.58), transparent 76%)",
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
                  <div data-wa-hero-item>
                    <Eyebrow>Website im Abo</Eyebrow>
                  </div>

                  <h1
                    data-wa-hero-item
                    className="font-ui mt-7 max-w-[16ch] text-[2.42rem] font-[630] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.35rem] md:text-[4.42rem] lg:text-[5.1rem]"
                  >
                    Professionelle Website. Planbar monatlich.
                  </h1>

                  <p
                    data-wa-hero-item
                    className="font-ui mt-8 max-w-[50rem] text-[1.03rem] font-[480] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.1rem] md:text-[1.18rem]"
                  >
                    MAGICKS entwickelt professionelle Websites im monatlichen
                    Modell — für Unternehmen, die hochwertig auftreten möchten,
                    aber ihre Investition lieber planbar strukturieren.
                    Individuell gestaltet, technisch sauber umgesetzt und auf
                    Wunsch laufend betreut.
                  </p>

                  <div
                    data-wa-hero-item
                    className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12"
                  >
                    <PrimaryCta to="/kontakt" label="Abo-Modell besprechen" />
                    <Link
                      to="/websites-landingpages"
                      className="group inline-flex min-h-11 items-center gap-2 px-2 font-ui text-[15px] font-[560] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.74)] no-underline transition-colors duration-500 hover:text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[15.5px]"
                    >
                      <span className="relative pb-1">
                        Mehr zu Websites & Landingpages
                        <span
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-px bg-[rgb(var(--magicks-line-rgb)/0.28)] transition-colors duration-500 group-hover:bg-[rgb(var(--magicks-line-rgb)/0.62)]"
                        />
                      </span>
                      <span aria-hidden className="font-instrument text-[1.04em] italic">
                        ↗
                      </span>
                    </Link>
                  </div>
                </div>

                <aside data-wa-hero-item className="lg:mb-2">
                  <MonthlyCadence />
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
                <div data-wa-reveal>
                  <Eyebrow>Planbar heißt nicht beliebig</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[18ch] text-[2.1rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.85rem] md:text-[3.55rem]">
                    Planbar heißt nicht beliebig.
                  </h2>
                </div>

                <div data-wa-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Eine Website im Abo darf nicht nach Baukasten, Massenprodukt
                    oder Kompromiss aussehen. Der Unterschied liegt im Modell —
                    nicht im Anspruch. Auch im monatlichen Modell braucht ein
                    digitaler Auftritt klare Struktur, individuelles Design,
                    saubere Technik und eine Wirkung, die zum Unternehmen passt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-wa-reveal className="max-w-[60rem]">
                <Eyebrow>Für wen sich das Modell lohnt</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Für Unternehmen, die professionell starten und planbar bleiben
                  möchten.
                </h2>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2">
                {AUDIENCE_CASES.map((item, index) => (
                  <article
                    key={item.title}
                    data-wa-reveal
                    className={`grid gap-4 rounded-[1.15rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] p-5 shadow-[0_20px_56px_-48px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.74)] sm:grid-cols-[auto_minmax(0,1fr)] sm:p-6 ${
                      index === AUDIENCE_CASES.length - 1 ? "md:col-span-2" : ""
                    }`}
                  >
                    <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.7)] sm:pt-1">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-ui text-[1.08rem] font-[620] leading-[1.28] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)] sm:text-[1.16rem]">
                        {item.title}
                      </h3>
                      <p className="font-ui mt-2.5 text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.67)]">
                        {item.text}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-wa-reveal className="max-w-[60rem]">
                <Eyebrow>Was im Modell enthalten sein kann</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Ein professioneller Webauftritt mit definiertem Rahmen.
                </h2>
                <p className="font-ui mt-7 max-w-[50rem] text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                  Der genaue Umfang wird im gemeinsamen Gespräch definiert. Je
                  nach Modell können folgende Bausteine enthalten sein, ohne
                  dass daraus starre Pakete oder pauschale Vertragsversprechen
                  abgeleitet werden.
                </p>
              </div>

              <div className="mt-12 grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
                {INCLUDED_ITEMS.map((item, index) => (
                  <article
                    key={item.title}
                    data-wa-reveal
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
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-wa-reveal className="max-w-[58rem]">
                <Eyebrow>Was unser Modell bewusst nicht ist</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Planbarkeit darf nicht nach Kompromiss aussehen.
                </h2>
              </div>

              <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AVOID_POINTS.map((line) => (
                  <li
                    key={line}
                    data-wa-reveal
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

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-wa-reveal className="max-w-[58rem]">
                <Eyebrow>Monatlich. Professionell. Betreut.</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[18ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Ein leichterer Einstieg ohne niedrigeren Anspruch.
                </h2>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {TRIAD.map((item, index) => (
                  <article
                    key={item.title}
                    data-wa-reveal
                    className="rounded-[1.2rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] p-6 shadow-[0_20px_58px_-48px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)]"
                  >
                    <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.68)]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-ui mt-4 text-[1.35rem] font-[620] leading-[1.16] tracking-[-0.018em] text-[rgb(var(--magicks-ink-rgb)/0.93)]">
                      {item.title}
                    </h3>
                    <p className="font-ui mt-4 text-[14.5px] leading-[1.64] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                      {item.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:gap-16">
                <div data-wa-reveal>
                  <Eyebrow>Der Unterschied zum klassischen Projekt</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                    Gleicher Anspruch. Anderes Modell.
                  </h2>
                </div>

                <div data-wa-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Bei einem klassischen Website-Projekt steht meist eine
                    größere Einmalinvestition im Vordergrund. Beim Abo-Modell
                    wird der Einstieg planbarer. Entscheidend bleibt aber, dass
                    die Website strategisch gedacht, individuell gestaltet und
                    technisch sauber umgesetzt wird.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 lg:grid-cols-3">
                {COMPARISON.map((item) => (
                  <article
                    key={item.label}
                    data-wa-reveal
                    className="rounded-[1.15rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.54)] p-5 shadow-[0_18px_52px_-44px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6"
                  >
                    <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.68)]">
                      {item.label}
                    </p>
                    <h3 className="font-ui mt-4 text-[1.18rem] font-[620] leading-[1.22] tracking-[-0.014em] text-[rgb(var(--magicks-ink-rgb)/0.93)] sm:text-[1.32rem]">
                      {item.title}
                    </h3>
                    <ul className="mt-5 space-y-3">
                      {item.points.map((point) => (
                        <li
                          key={point}
                          className="font-ui text-[14.3px] leading-[1.58] text-[rgb(var(--magicks-ink-rgb)/0.66)]"
                        >
                          {point}
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
              <div data-wa-reveal className="max-w-[58rem]">
                <Eyebrow>Unser Ablauf</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[22ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Vom Modell zur professionellen Website.
                </h2>
              </div>

              <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {WORKFLOW_STEPS.map((step, index) => (
                  <li
                    key={step.title}
                    data-wa-reveal
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
            <div data-wa-reveal>
              <ContextualCrossLink
                eyebrow="Website-Basis"
                folio="Websites & Landingpages"
                lead="Wenn Sie sehen möchten, wie MAGICKS Websites grundsätzlich strukturiert, gestaltet und auf Anfragen ausrichtet."
                linkLabel="Websites & Landingpages ansehen"
                to="/websites-landingpages"
              />
            </div>

            <div data-wa-reveal className="mt-12 sm:mt-14 md:mt-16">
              <ContextualCrossLink
                eyebrow="Sichtbarkeit"
                folio="SEO & Sichtbarkeit"
                lead="Wenn der neue Auftritt von Beginn an mit technischer SEO-Basis, Seitenstruktur und verständlichen Inhalten geplant werden soll."
                linkLabel="SEO & Sichtbarkeit ansehen"
                to="/seo-sichtbarkeit"
              />
            </div>

            <div data-wa-reveal className="mt-12 sm:mt-14 md:mt-16">
              <ContextualCrossLink
                eyebrow="Inhalte"
                folio="Content, Bildwelt & Medien"
                lead="Wenn Texte, Bildwelt oder Medien direkt im Kontext des neuen Webauftritts entwickelt werden sollen."
                linkLabel="Content, Bildwelt & Medien ansehen"
                to="/content-bildwelt-medien"
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
              data-wa-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow>Nächster Schritt</Eyebrow>
              <h2 className="font-ui mx-auto mt-7 max-w-[20ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.9rem]">
                Passt Website im Abo zu Ihrem Unternehmen?
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[46rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Lassen Sie uns klären, ob ein monatliches Modell für Ihren neuen
                Webauftritt sinnvoll ist und welcher Umfang zu Ihrem Unternehmen
                passt.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta to="/kontakt" label="Abo-Modell besprechen" />
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
