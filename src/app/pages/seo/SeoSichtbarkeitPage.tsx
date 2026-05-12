import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { runRouteReveal } from "../../lib/routeReveal";
import { RouteSEO } from "../../seo/RouteSEO";
import { ContextualCrossLink } from "../../components/service/ContextualCrossLink";

type SeoBlock = {
  title: string;
  text: string;
};

type WorkflowStep = {
  title: string;
  text: string;
};

const SEO_BUILDING_BLOCKS: SeoBlock[] = [
  {
    title: "Seitenstruktur",
    text: "Damit Suchsysteme und Besucher schneller verstehen, welche Leistung auf welcher Seite erklärt wird.",
  },
  {
    title: "Meta-Titles & Descriptions",
    text: "Damit Suchergebnisse klar einordnen, worum es geht und warum der Klick relevant ist.",
  },
  {
    title: "Überschriftenlogik",
    text: "Damit Inhalte hierarchisch lesbar bleiben und zentrale Themen nachvollziehbar gegliedert sind.",
  },
  {
    title: "Lokale Suchbegriffe",
    text: "Damit regionale Nachfrage aus Kassel, Nordhessen und dem passenden Einzugsgebiet sauber berücksichtigt wird.",
  },
  {
    title: "Leistungsseiten",
    text: "Damit einzelne Angebote nicht in allgemeinen Texten verschwinden, sondern verständlich auffindbar sind.",
  },
  {
    title: "Interne Verlinkung",
    text: "Damit Nutzer und Suchsysteme relevante Zusammenhänge zwischen Leistungen, Regionen und Inhalten erkennen.",
  },
  {
    title: "Technische SEO-Grundlagen",
    text: "Damit Indexierbarkeit, Canonicals, Weiterleitungen und Seitensignale sauber angelegt sind.",
  },
  {
    title: "Ladezeit & Performance",
    text: "Damit Sichtbarkeit nicht an langsamen Seiten, schlechter Erfahrung oder technischen Reibungen verliert.",
  },
  {
    title: "Strukturierte Inhalte",
    text: "Damit Abschnitte, Fragen, Leistungen und Argumente leichter verstanden und weiterverarbeitet werden können.",
  },
  {
    title: "FAQ-Logik",
    text: "Nur dort, wo echte Fragen beantwortet werden und die Entscheidung für Besucher leichter wird.",
  },
  {
    title: "Redirects bei Relaunches",
    text: "Damit bestehende Sichtbarkeit nicht unnötig verloren geht, wenn Seiten neu aufgebaut werden.",
  },
  {
    title: "Saubere Indexierbarkeit",
    text: "Damit wichtige Seiten erreichbar, crawlbar und eindeutig zuordenbar bleiben.",
  },
  {
    title: "Bild- und Medienoptimierung",
    text: "Damit Bilder schnell laden, sinnvoll beschrieben sind und die Seite nicht ausbremsen.",
  },
  {
    title: "Content-Struktur",
    text: "Damit Inhalte nicht nur vorhanden sind, sondern Orientierung, Vertrauen und Anfragen unterstützen.",
  },
  {
    title: "Conversion-relevante Seitenführung",
    text: "Damit Sichtbarkeit nicht beim Besuch endet, sondern zu Kontakt, Anfrage oder nächstem Schritt führen kann.",
  },
];

const LOCAL_POINTS: SeoBlock[] = [
  {
    title: "Lokale Leistungsseiten",
    text: "Für Angebote, die in Kassel, Nordhessen oder einem klaren Einzugsgebiet gesucht werden.",
  },
  {
    title: "Regionale Keyword-Struktur",
    text: "Suchbegriffe werden natürlich eingeordnet, statt künstlich in Texte gedrückt zu werden.",
  },
  {
    title: "Standort- und Einzugsgebietslogik",
    text: "Kassel, Nordhessen und relevante Orte werden so eingebunden, dass der regionale Bezug verständlich bleibt.",
  },
  {
    title: "Google-Unternehmensprofil",
    text: "Als ergänzende Sichtbarkeitsfläche, die zum Webauftritt und zur lokalen Suche passen sollte.",
  },
  {
    title: "Regionale interne Verlinkung",
    text: "Verbindungen zwischen lokalen Seiten helfen Nutzern und Suchsystemen, den Kontext zu erkennen.",
  },
  {
    title: "Verständliche Inhalte statt Keyword-Spam",
    text: "Lokale Sichtbarkeit darf nicht auf Kosten von Lesbarkeit und Vertrauen entstehen.",
  },
];

const MODERN_SEARCH_POINTS = [
  "Suchintention verstehen",
  "Klare Antworten geben",
  "Abschnitte nachvollziehbar strukturieren",
  "FAQs nur dort nutzen, wo sie wirklich helfen",
  "Verständliche Sprache statt Fachtext",
  "Interne Orientierung stärken",
  "Inhalte zur Entscheidung führen",
] as const;

const AVOID_POINTS = [
  "Keine Ranking-Garantien.",
  "Kein Keyword-Spam.",
  "Keine künstlichen Texte, die niemand lesen will.",
  "Keine SEO-Maßnahmen, die kurzfristig gut klingen und langfristig schaden.",
  "Keine Sichtbarkeit ohne klare Nutzerführung.",
  "Keine Inhalte ohne echten Nutzen für Besucher.",
] as const;

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    title: "Verstehen",
    text: "Wir analysieren Angebot, Zielgruppen, Region, Suchintention und bestehende Seitenstruktur.",
  },
  {
    title: "Strukturieren",
    text: "Wir ordnen Leistungen, Seitenlogik, interne Verlinkung und lokale Relevanz.",
  },
  {
    title: "Schärfen",
    text: "Wir entwickeln Inhalte, Überschriften und Argumente so, dass sie gefunden und verstanden werden.",
  },
  {
    title: "Optimieren",
    text: "Wir verbessern technische Grundlagen, Ladezeit, Indexierbarkeit und SEO-relevante Seitenelemente.",
  },
  {
    title: "Verbinden",
    text: "SEO wird mit Design, Nutzerführung, Kontaktwegen und Conversion-Logik verbunden.",
  },
  {
    title: "Weiterentwickeln",
    text: "Nach dem Launch können Rankings, Inhalte, Suchanfragen und Nutzerverhalten ausgewertet und verbessert werden.",
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

function VisibilityMap() {
  const items = [
    "Struktur",
    "Inhalt",
    "Technik",
    "Lokalität",
    "Vertrauen",
    "Anfrage",
  ] as const;

  return (
    <div className="rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.62)] p-5 shadow-[0_24px_68px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.74)] sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)]">
          Sichtbarkeit
        </span>
        <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.38)]">
          Finden → Verstehen
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={item}
            data-seo-map
            className="relative rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.58)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.66)]"
          >
            <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.64)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="font-ui mt-4 text-[1rem] font-[620] leading-[1.2] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.9)]">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SeoSichtbarkeitPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-seo-hero-item]");
      const mapItems = gsap.utils.toArray<HTMLElement>("[data-seo-map]");
      const reveals = gsap.utils.toArray<HTMLElement>("[data-seo-reveal]");

      if (reduced) {
        gsap.set([...heroItems, ...mapItems, ...reveals], {
          opacity: 1,
          y: 0,
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
        mapItems,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.06,
          ease: "power2.out",
        },
      );

    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/seo-sichtbarkeit" />

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
                  <div data-seo-hero-item>
                    <Eyebrow>SEO & Sichtbarkeit</Eyebrow>
                  </div>

                  <h1
                    data-seo-hero-item
                    className="font-ui mt-7 max-w-[18ch] text-[2.42rem] font-[630] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.35rem] md:text-[4.42rem] lg:text-[5.1rem]"
                  >
                    SEO, das Struktur, Inhalte und Anfragen zusammenbringt.
                  </h1>

                  <p
                    data-seo-hero-item
                    className="font-ui mt-8 max-w-[50rem] text-[1.03rem] font-[480] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.1rem] md:text-[1.18rem]"
                  >
                    MAGICKS denkt Sichtbarkeit dort mit, wo sie entsteht: in
                    Seitenstruktur, Inhalt, Technik, Ladezeit, lokaler Relevanz
                    und klarer Nutzerführung. Damit Ihr Unternehmen nicht nur
                    gefunden wird, sondern auch verstanden und angefragt wird.
                  </p>

                  <div
                    data-seo-hero-item
                    className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12"
                  >
                    <PrimaryCta to="/kontakt" label="SEO-Projekt besprechen" />
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

                <aside data-seo-hero-item className="lg:mb-2">
                  <VisibilityMap />
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
                <div data-seo-reveal>
                  <Eyebrow>SEO ist kein nachträglicher Aufsatz</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[18ch] text-[2.1rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.85rem] md:text-[3.55rem]">
                    SEO beginnt nicht am Ende. SEO beginnt in der Struktur.
                  </h2>
                </div>

                <div data-seo-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Wenn Seitenstruktur, Inhalte, Technik und Nutzerführung
                    nicht stimmen, wird Sichtbarkeit unnötig schwer. Deshalb
                    beginnt Suchmaschinenoptimierung bei MAGICKS nicht mit
                    Keyword-Listen, sondern mit der Frage, wie ein Angebot
                    gefunden, verstanden und sauber zur Anfrage weitergeführt
                    werden kann.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-seo-reveal className="max-w-[60rem]">
                <Eyebrow>Was MAGICKS optimiert</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Bausteine, die Sichtbarkeit möglich machen.
                </h2>
                <p className="font-ui mt-7 max-w-[50rem] text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                  Sichtbarkeit entsteht nicht aus einer einzelnen Maßnahme.
                  Sie entsteht aus sauberer Struktur, verständlichen Inhalten,
                  technischer Grundlage und Seitenführung, die zur Anfrage
                  passt.
                </p>
              </div>

              <ol className="mt-12 grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
                {SEO_BUILDING_BLOCKS.map((item, index) => (
                  <li
                    key={item.title}
                    data-seo-reveal
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

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:gap-16">
                <div data-seo-reveal>
                  <Eyebrow>Local SEO für Kassel und Nordhessen</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                    Lokale Sichtbarkeit entscheidet oft über den ersten Kontakt.
                  </h2>
                </div>

                <div data-seo-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Gerade für regionale Unternehmen reicht es nicht, allgemein
                    sichtbar zu sein. Leistungen, Standort, Einzugsgebiet und
                    Suchintention müssen sauber zusammenfinden. MAGICKS
                    entwickelt lokale Seitenstrukturen und Inhalte, die für
                    Menschen verständlich bleiben und Suchsystemen klare Signale
                    geben — ohne künstliche SEO-Textwüsten.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {LOCAL_POINTS.map((item) => (
                  <article
                    key={item.title}
                    data-seo-reveal
                    className="rounded-[1.05rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.54)] p-5 shadow-[0_18px_52px_-44px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6"
                  >
                    <h3 className="font-ui text-[1.05rem] font-[620] leading-[1.26] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                      {item.title}
                    </h3>
                    <p className="font-ui mt-3 text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                      {item.text}
                    </p>
                  </article>
                ))}
              </div>

              <div
                data-seo-reveal
                className="mt-10 rounded-[1.15rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.54)] p-5 shadow-[0_18px_48px_-42px_rgba(20,28,44,0.24),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6"
              >
                <p className="font-ui text-[14.5px] leading-[1.64] text-[rgb(var(--magicks-ink-rgb)/0.68)] sm:text-[15px]">
                  Für regionale Suchintentionen können Seiten wie{" "}
                  <Link
                    to="/webdesign-kassel"
                    className="text-[rgb(var(--magicks-ink-rgb)/0.92)] underline decoration-[rgb(var(--magicks-line-rgb)/0.32)] underline-offset-[4px]"
                  >
                    Webdesign Kassel
                  </Link>{" "}
                  oder{" "}
                  <Link
                    to="/landingpages-kassel"
                    className="text-[rgb(var(--magicks-ink-rgb)/0.92)] underline decoration-[rgb(var(--magicks-line-rgb)/0.32)] underline-offset-[4px]"
                  >
                    Landingpages Kassel
                  </Link>{" "}
                  sinnvoll sein, wenn sie echte Suchintention abdecken und nicht
                  als Keyword-Füllseiten gebaut werden.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-start lg:gap-16">
                <div data-seo-reveal>
                  <Eyebrow>Moderne Suche</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                    Inhalte müssen Fragen beantworten, nicht nur Keywords
                    enthalten.
                  </h2>
                </div>

                <div data-seo-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Gute Inhalte erklären Zusammenhänge, beantworten konkrete
                    Fragen und machen Leistungen nachvollziehbar. So entstehen
                    Seiten, die für Menschen lesbar und für Suchsysteme
                    verständlich sind — auch in einer Suche, die immer stärker
                    mit Antworten, Kontext und Intent arbeitet.
                  </p>

                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {MODERN_SEARCH_POINTS.map((item) => (
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
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:gap-16">
                <div data-seo-reveal>
                  <Eyebrow>Sichtbarkeit & Conversion</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                    Gefunden werden ist der erste Schritt. Überzeugen der
                    zweite.
                  </h2>
                </div>

                <div data-seo-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Mehr Sichtbarkeit bringt wenig, wenn Besucher danach nicht
                    verstehen, warum sie anfragen sollten. Deshalb denken wir
                    SEO, Design, Text, Nutzerführung und Conversion zusammen.
                    Die Seite soll gefunden werden, aber danach auch Vertrauen
                    aufbauen und zur richtigen Handlung führen.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {[
                  {
                    to: "/websites-landingpages",
                    title: "Websites & Landingpages",
                    text: "Für Auftritte, die Sichtbarkeit, Vertrauen und Anfragewege verbinden.",
                  },
                  {
                    to: "/content-bildwelt-medien",
                    title: "Content, Bildwelt & Medien",
                    text: "Für Inhalte und visuelle Substanz, die Suchende wirklich verstehen können.",
                  },
                  {
                    to: "/leistungen",
                    title: "Leistungsübersicht",
                    text: "Für den gesamten MAGICKS-Rahmen aus Auftritt, Verkauf, Software und Automationen.",
                  },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    data-seo-reveal
                    className="group rounded-[1.05rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] p-5 text-left no-underline shadow-[0_18px_52px_-44px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)] transition-[transform,border-color] duration-500 hover:-translate-y-[1px] hover:border-[rgb(var(--magicks-line-rgb)/0.22)] sm:p-6"
                  >
                    <h3 className="font-ui text-[1.05rem] font-[620] leading-[1.26] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                      {item.title}
                    </h3>
                    <p className="font-ui mt-3 text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                      {item.text}
                    </p>
                    <span className="font-ui mt-5 inline-flex text-[14px] font-[560] text-[rgb(var(--magicks-ink-rgb)/0.78)] group-hover:text-[rgb(var(--magicks-ink-rgb)/0.96)]">
                      Ansehen ↗
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-seo-reveal className="max-w-[58rem]">
                <Eyebrow>Was wir bewusst vermeiden</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[18ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Sichtbarkeit darf nicht auf Kosten von Vertrauen entstehen.
                </h2>
              </div>

              <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AVOID_POINTS.map((line) => (
                  <li
                    key={line}
                    data-seo-reveal
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
              <div data-seo-reveal className="max-w-[58rem]">
                <Eyebrow>Unser Ablauf</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[22ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Von der Suchintention zur überzeugenden Seite.
                </h2>
              </div>

              <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {WORKFLOW_STEPS.map((step, index) => (
                  <li
                    key={step.title}
                    data-seo-reveal
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
            <div data-seo-reveal>
              <ContextualCrossLink
                eyebrow="Website-Basis"
                folio="Websites & Landingpages"
                lead="Wenn Sichtbarkeit direkt in einen hochwertigen Auftritt mit klarer Nutzerführung und Anfragewegen eingebettet werden soll."
                linkLabel="Websites & Landingpages ansehen"
                to="/websites-landingpages"
              />
            </div>

            <div data-seo-reveal className="mt-12 sm:mt-14 md:mt-16">
              <ContextualCrossLink
                eyebrow="Region"
                folio="Webdesign Kassel"
                lead="Für Unternehmen, die regionale Sichtbarkeit in Kassel und Nordhessen mit einem klaren digitalen Auftritt verbinden möchten."
                linkLabel="Webdesign Kassel ansehen"
                to="/webdesign-kassel"
              />
            </div>

            <div data-seo-reveal className="mt-12 sm:mt-14 md:mt-16">
              <ContextualCrossLink
                eyebrow="Kampagnen"
                folio="Landingpages Kassel"
                lead="Für lokale Landingpages, die Angebote, Kampagnen oder konkrete Leistungen sichtbar und anfrageorientiert platzieren."
                linkLabel="Landingpages Kassel ansehen"
                to="/landingpages-kassel"
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
              data-seo-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow>Nächster Schritt</Eyebrow>
              <h2 className="font-ui mx-auto mt-7 max-w-[20ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.9rem]">
                Wird Ihr Unternehmen dort gefunden, wo Kunden suchen?
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[46rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Lassen Sie uns prüfen, wie Ihre Seitenstruktur, Inhalte und
                lokale Sichtbarkeit klarer auf Anfragen ausgerichtet werden
                können.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta to="/kontakt" label="SEO-Projekt besprechen" />
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
