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

type Platform = {
  title: string;
  text: string;
};

type WorkflowStep = {
  title: string;
  text: string;
};

const SHOP_LOGIC_POINTS: BenefitPoint[] = [
  {
    title: "Klare Produktstruktur",
    text: "Produkte, Kategorien und Angebote werden so geordnet, dass Nutzer schneller verstehen und vergleichen können.",
  },
  {
    title: "Verständliche Varianten",
    text: "Optionen, Maße, Materialien, Pakete oder Zubehör werden nicht versteckt, sondern sinnvoll geführt.",
  },
  {
    title: "Vertrauensbildende Inhalte",
    text: "Produkttexte, Bilder, Belege und Abläufe reduzieren Unsicherheit vor Kauf, Anfrage oder Buchung.",
  },
  {
    title: "Mobile Kauf- und Anfragewege",
    text: "Der Entscheidungsweg bleibt auch auf dem Smartphone klar, schnell und gut bedienbar.",
  },
  {
    title: "Schnelle Ladezeiten",
    text: "Performance stärkt Vertrauen und verhindert, dass Nutzer vor dem Abschluss abspringen.",
  },
  {
    title: "Reduzierte Reibung bis zum Abschluss",
    text: "Checkout, Anfrage, Formular oder Lead-Übergabe werden gezielt vereinfacht.",
  },
];

const AUDIENCE_CASES: AudienceCase[] = [
  {
    title: "Ihre Produkte sind erklärungsbedürftig.",
    text: "Nutzer brauchen mehr als Bilder und Preise, um eine sichere Entscheidung zu treffen.",
  },
  {
    title: "Ihre Varianten, Optionen oder Pakete sind online schwer verständlich.",
    text: "Ein klarer Konfigurator kann Auswahl, Logik und Zusammenfassung nachvollziehbar machen.",
  },
  {
    title: "Ihr aktueller Shop wirkt nicht hochwertig genug.",
    text: "Die digitale Verkaufsfläche passt nicht mehr zur Qualität Ihrer Produkte.",
  },
  {
    title: "Nutzer brechen ab, bevor sie kaufen oder anfragen.",
    text: "Reibung, fehlendes Vertrauen oder unklare Wege kosten Abschlüsse.",
  },
  {
    title: "Ihr Vertrieb braucht bessere digitale Vorqualifizierung.",
    text: "Anfragen sollen strukturierter, vollständiger und besser übergabefähig ankommen.",
  },
  {
    title: "Sie möchten Produkte online präsentieren, aber nicht alles direkt verkaufen.",
    text: "Nicht jedes Produkt braucht einen Checkout. Manchmal ist eine qualifizierte Anfrage der bessere Abschluss.",
  },
  {
    title: "Sie brauchen einen Konfigurator für individuelle Zusammenstellungen.",
    text: "Varianten, Zubehör, Maße oder Pakete können digital erklärt und sauber abgefragt werden.",
  },
];

const DELIVERABLES: Deliverable[] = [
  {
    title: "Shopify-Shops",
    text: "Für klare Shop-Strukturen, schnelle Commerce-Prozesse und eine saubere Verwaltung von Produkten, Bestellungen und Zahlungen.",
  },
  {
    title: "WordPress/WooCommerce-Shops",
    text: "Für Projekte, bei denen Content, SEO, redaktionelle Seiten und Shop-Funktion eng zusammenspielen.",
  },
  {
    title: "Individuelle Produktkonfiguratoren",
    text: "Für Variantenlogik, Anfrageprozesse oder Verkaufsabläufe, die Standardfunktionen nicht sauber abbilden.",
  },
  {
    title: "Produktseiten und Kategoriestrukturen",
    text: "Damit Nutzer Produkte schneller verstehen, vergleichen und gezielt weitergehen können.",
  },
  {
    title: "Anfrage- und Angebotsflows",
    text: "Für Produkte, bei denen eine qualifizierte Anfrage wichtiger ist als ein direkter Warenkorb.",
  },
  {
    title: "UX & Nutzerführung",
    text: "Wir reduzieren Reibung und führen Nutzer klar durch Auswahl, Produktlogik und Abschluss.",
  },
  {
    title: "Produkttexte und Conversion-Copy",
    text: "Texte erklären Nutzen, Unterschiede und nächste Schritte, statt nur Eigenschaften aufzulisten.",
  },
  {
    title: "Visuelle Produktpräsentation",
    text: "Bildwelt, Layout und Detailansichten machen Produkte hochwertig und verständlich sichtbar.",
  },
  {
    title: "Zahlungs-, Tracking-, CRM- oder ERP-Integrationen",
    text: "Relevante Systeme werden dort angebunden, wo sie den Verkaufsprozess wirklich unterstützen.",
  },
  {
    title: "Performance-Optimierung",
    text: "Schnelle Ladezeiten und stabile Interaktionen reduzieren Abbrüche im Entscheidungsprozess.",
  },
  {
    title: "Technische SEO-Basis",
    text: "Produkt- und Kategoriestrukturen werden suchmaschinenfreundlich und nachvollziehbar angelegt.",
  },
  {
    title: "Responsive Umsetzung",
    text: "Shop, Produktseiten und Konfigurator funktionieren sauber auf Mobile und Desktop.",
  },
  {
    title: "Hosting, Analyse und laufende Optimierung",
    text: "Auf Wunsch betreuen wir Betrieb, Auswertung und Weiterentwicklung nach dem Launch.",
  },
];

const PLATFORMS: Platform[] = [
  {
    title: "Shopify",
    text: "Für klare Shop-Strukturen, schnelle Commerce-Prozesse und eine saubere Verwaltung von Produkten, Bestellungen und Zahlungen.",
  },
  {
    title: "WordPress/WooCommerce",
    text: "Für Projekte, bei denen Content, SEO, redaktionelle Seiten und Shop-Funktion eng zusammenspielen sollen.",
  },
  {
    title: "Individuelle Lösungen",
    text: "Für Konfiguratoren, Anfrageprozesse, Variantenlogik oder Verkaufsabläufe, die mit Standardfunktionen nicht sauber abgebildet werden.",
  },
];

const CONFIGURATOR_POINTS = [
  "Varianten und Optionen",
  "Farben, Größen, Materialien",
  "Paket- und Zubehörlogik",
  "Preis- oder Anfrageindikationen",
  "Angebots- und Lead-Formulare",
  "Übergabe an Vertrieb, CRM oder E-Mail",
  "Verständliche Zusammenfassung der Auswahl",
] as const;

const AVOID_POINTS = [
  "Keinen beliebigen Standardshop.",
  "Keine Produktseiten ohne klare Argumente.",
  "Keinen Konfigurator, der nur technisch existiert, aber niemanden sauber führt.",
  "Keine überladene Oberfläche, die Entscheidungen schwerer macht.",
  "Keine Lösung, die gut aussieht und im Alltag unnötig Reibung erzeugt.",
  "Keine Plattformentscheidung ohne Blick auf Pflege, Prozesse und Wachstum.",
] as const;

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    title: "Verstehen",
    text: "Wir analysieren Produkte, Zielgruppen, Varianten, Kaufentscheidungen und Vertriebslogik.",
  },
  {
    title: "Strukturieren",
    text: "Wir ordnen Kategorien, Produktlogik, Nutzerführung und Abschlusswege.",
  },
  {
    title: "Schärfen",
    text: "Texte, Produktargumente, Bildwelt und Beweise werden so entwickelt, dass Auswahl leichter wird.",
  },
  {
    title: "Gestalten",
    text: "Das Design macht Produkte hochwertig sichtbar und führt Nutzer klar durch den Entscheidungsprozess.",
  },
  {
    title: "Entwickeln",
    text: "Wir setzen Shop, Konfigurator, Integrationen und responsives Verhalten technisch sauber um.",
  },
  {
    title: "Optimieren",
    text: "Nach dem Launch können Analyse, Anpassungen, Conversion-Optimierung und Weiterentwicklung folgen.",
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

function VariantMatrix() {
  const selected = 5;

  return (
    <div className="w-full" aria-label="Visualisierte Variantenlogik">
      <div className="grid grid-cols-4 gap-[1px] rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-line-rgb)/0.08)] p-[1px] shadow-[0_22px_64px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.66)]">
        {Array.from({ length: 12 }).map((_, index) => {
          const isSelected = index === selected;
          const isAnchor = index % 4 === 0;
          return (
            <div
              key={index}
              data-ss-cell
              className={`relative flex h-[54px] items-center justify-center bg-[rgb(var(--magicks-bg-lifted-rgb)/0.68)] px-3 sm:h-[64px] ${
                isSelected
                  ? "ring-1 ring-[rgb(var(--magicks-accent-line-rgb)/0.42)]"
                  : ""
              }`}
            >
              <span
                className={`font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.26em] sm:text-[10.5px] ${
                  isSelected
                    ? "text-[rgb(var(--magicks-ink-rgb)/0.94)]"
                    : isAnchor
                      ? "text-[rgb(var(--magicks-ink-rgb)/0.52)]"
                      : "text-[rgb(var(--magicks-ink-rgb)/0.32)]"
                }`}
              >
                V{String(index + 1).padStart(2, "0")}
              </span>
              {isSelected ? (
                <span
                  aria-hidden
                  className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-[rgb(var(--magicks-accent-rgb)/0.82)]"
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="font-mono mt-3 flex items-start justify-between gap-4 text-[9.5px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-ink-rgb)/0.38)] sm:text-[10px]">
        <span>Variante 01</span>
        <span className="text-[rgb(var(--magicks-ink-rgb)/0.58)]">Ausgewählt · V06</span>
        <span>Variante 12</span>
      </div>
    </div>
  );
}

export default function ShopsKonfiguratorenPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-ss-hero-item]");
      const heroCells = gsap.utils.toArray<HTMLElement>("[data-ss-cell]");
      const reveals = gsap.utils.toArray<HTMLElement>("[data-ss-reveal]");

      if (reduced) {
        gsap.set([...heroItems, ...heroCells, ...reveals], {
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
        heroCells,
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: { amount: 0.55, from: "start" },
          ease: "power2.out",
        },
      );

    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/shops-produktkonfiguratoren" />

      <main
        ref={rootRef}
        className="relative overflow-hidden bg-[var(--magicks-bg-base)] pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.25rem]"
      >
        <section
          data-ss-hero
          className="relative overflow-hidden px-5 pb-24 pt-8 sm:px-8 sm:pb-32 sm:pt-10 md:px-12 md:pb-40 lg:px-16 lg:pb-48"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 58% 46% at 18% 18%, rgba(166,138,98,0.14), transparent 72%), radial-gradient(ellipse 52% 40% at 82% 36%, rgba(122,142,166,0.12), transparent 74%), radial-gradient(ellipse 74% 44% at 50% 94%, rgba(255,255,255,0.58), transparent 76%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.3]"
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
                  <div data-ss-hero-item>
                    <Eyebrow>Shops & Produktkonfiguratoren</Eyebrow>
                  </div>

                  <h1
                    data-ss-hero-item
                    className="font-ui mt-7 max-w-[18ch] text-[2.42rem] font-[630] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.35rem] md:text-[4.42rem] lg:text-[5.1rem]"
                  >
                    Shops & Produktkonfiguratoren, die Produkte verständlich
                    machen und Verkäufe erleichtern.
                  </h1>

                  <p
                    data-ss-hero-item
                    className="font-ui mt-8 max-w-[50rem] text-[1.03rem] font-[480] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.1rem] md:text-[1.18rem]"
                  >
                    MAGICKS entwickelt Shops und Produktkonfiguratoren, die
                    Produkte hochwertig präsentieren, Varianten verständlich
                    machen und Nutzer gezielt zum nächsten Schritt führen —
                    vom ersten Interesse bis zur Anfrage, Buchung oder
                    Bestellung.
                  </p>

                  <div
                    data-ss-hero-item
                    className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12"
                  >
                    <PrimaryCta to="/kontakt" label="Shop-Projekt besprechen" />
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

                <aside data-ss-hero-item className="lg:mb-2">
                  <div className="rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.62)] p-5 shadow-[0_24px_68px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.74)] sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)]">
                        Variantenlogik
                      </span>
                      <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.38)]">
                        12 Optionen · 1 gewählt
                      </span>
                    </div>
                    <VariantMatrix />
                  </div>
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
                <div data-ss-reveal>
                  <Eyebrow>Warum ein Shop mehr sein muss</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[18ch] text-[2.1rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.85rem] md:text-[3.55rem]">
                    Ein guter Shop zeigt nicht nur Produkte. Er führt zur
                    Entscheidung.
                  </h2>
                </div>

                <div data-ss-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Produkte online zu zeigen reicht nicht. Nutzer müssen
                    verstehen, vergleichen, auswählen und sicher den nächsten
                    Schritt gehen können. Erst wenn Produktpräsentation,
                    Struktur, Vertrauen, Performance und Abschlusslogik
                    zusammenspielen, wird aus Interesse ein Kauf, eine Anfrage
                    oder ein qualifizierter Lead.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {SHOP_LOGIC_POINTS.map((point) => (
                  <article
                    key={point.title}
                    data-ss-reveal
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

              <div data-ss-reveal className="mt-18 sm:mt-20 md:mt-24">
                <EditorialAnchor
                  src={SERVICE_PAGE_IMAGES.shops.pergola.src}
                  alt={SERVICE_PAGE_IMAGES.shops.pergola.alt}
                  folio="Plate 01"
                  context="Konfigurator"
                  leftCaption="Produktlogik · Auswahl · Anfrage"
                  rightCaption="Digitale Verkaufsfläche"
                  aspect="16/9"
                  align="right"
                  maxWidth="46rem"
                  revealAttr="data-ss-reveal"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-ss-reveal className="max-w-[60rem]">
                <Eyebrow>Für wen diese Leistung passt</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[24ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Für Unternehmen, die Produkte digital besser verkaufen oder
                  erklären wollen.
                </h2>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2">
                {AUDIENCE_CASES.map((item) => (
                  <article
                    key={item.title}
                    data-ss-reveal
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
              <div data-ss-reveal className="max-w-[60rem]">
                <Eyebrow>Was MAGICKS für Sie umsetzt</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[22ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Alles, was digitale Verkaufsflächen überzeugend macht.
                </h2>
                <p className="font-ui mt-7 max-w-[50rem] text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                  Jedes Element muss helfen: Produktlogik verstehen, Vertrauen
                  aufbauen, Auswahl erleichtern und den nächsten Schritt
                  sichtbar machen.
                </p>
              </div>

              <ol className="mt-12 grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
                {DELIVERABLES.map((item, index) => (
                  <li
                    key={item.title}
                    data-ss-reveal
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
                <div data-ss-reveal>
                  <Eyebrow>Systemwahl</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[18ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                    Das richtige System für den richtigen Verkaufsprozess.
                  </h2>
                </div>

                <div data-ss-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Wir arbeiten mit passenden Systemen wie Shopify,
                    WordPress/WooCommerce oder individuellen Web-Lösungen.
                    Entscheidend ist nicht der Name des Tools, sondern ob
                    Produktlogik, Pflege, Nutzerführung, Integrationen und
                    Wachstum zusammenpassen.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 lg:grid-cols-3">
                {PLATFORMS.map((platform) => (
                  <article
                    key={platform.title}
                    data-ss-reveal
                    className="rounded-[1.15rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.52)] p-5 shadow-[0_18px_52px_-44px_rgba(20,28,44,0.25),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6"
                  >
                    <h3 className="font-ui text-[1.15rem] font-[620] leading-[1.26] tracking-[-0.014em] text-[rgb(var(--magicks-ink-rgb)/0.94)]">
                      {platform.title}
                    </h3>
                    <p className="font-ui mt-3 text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                      {platform.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-start lg:gap-16">
                <div data-ss-reveal>
                  <Eyebrow>Konfiguratoren als Vertriebswerkzeug</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[18ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                    Ein Konfigurator ist kein Spielzeug.
                    <span className="font-instrument mt-2 block italic font-normal text-[rgb(var(--magicks-ink-rgb)/0.62)]">
                      Er ist ein Vertriebswerkzeug.
                    </span>
                  </h2>
                </div>

                <div data-ss-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Ein guter Produktkonfigurator macht komplexe Auswahl
                    verständlich. Er führt Nutzer durch Varianten, Optionen,
                    Maße, Materialien oder Pakete und übersetzt daraus eine
                    klare Anfrage, ein Angebot oder eine Bestellung.
                  </p>

                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {CONFIGURATOR_POINTS.map((item) => (
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

              <div data-ss-reveal className="mt-18 sm:mt-20 md:mt-24">
                <EditorialAnchor
                  src={SERVICE_PAGE_IMAGES.shops.window.src}
                  alt={SERVICE_PAGE_IMAGES.shops.window.alt}
                  folio="Plate 02"
                  context="Entscheidungsführung"
                  leftCaption="Optionen · Maße · Material"
                  rightCaption="Konfigurator-Logik"
                  aspect="16/9"
                  align="left"
                  maxWidth="48rem"
                  revealAttr="data-ss-reveal"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-ss-reveal className="max-w-[58rem]">
                <Eyebrow>Was wir bewusst vermeiden</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[17ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Nicht jede Lösung hilft nur, weil sie nach Shop aussieht.
                </h2>
              </div>

              <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AVOID_POINTS.map((line) => (
                  <li
                    key={line}
                    data-ss-reveal
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
              <div data-ss-reveal className="max-w-[58rem]">
                <Eyebrow>Unser Ablauf</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[18ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Vom Produkt zur digitalen Verkaufsfläche.
                </h2>
              </div>

              <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {WORKFLOW_STEPS.map((step, index) => (
                  <li
                    key={step.title}
                    data-ss-reveal
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
            <div data-ss-reveal>
              <ContextualCrossLink
                eyebrow="Überblick"
                folio="Service Hub"
                lead="Wenn Sie Website, Shop, Software und Automationen zusammen denken möchten, zeigt die Leistungsübersicht den gesamten MAGICKS-Rahmen."
                linkLabel="Alle Leistungen ansehen"
                to="/leistungen"
              />
            </div>

            <div data-ss-reveal className="mt-12 sm:mt-14 md:mt-16">
              <ContextualCrossLink
                eyebrow="Prozesse"
                folio="Web-Software"
                lead="Wenn Ihr Projekt über einen klassischen Shop hinausgeht und eher Plattform, Portal oder individuelle Anwendung wird, ist Web-Software der nächste relevante Bereich."
                linkLabel="Web-Software ansehen"
                to="/web-software"
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
              data-ss-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow>Nächster Schritt</Eyebrow>
              <h2 className="font-ui mx-auto mt-7 max-w-[18ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.9rem]">
                Ist Ihr Shop bereit, mehr zu leisten?
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[46rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Lassen Sie uns klären, wie Ihre Produkte online klarer
                präsentiert, besser erklärt und überzeugender verkauft werden
                können.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta to="/kontakt" label="Shop-Projekt besprechen" />
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
