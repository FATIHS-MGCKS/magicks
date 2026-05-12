import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { runRouteReveal } from "../../lib/routeReveal";
import { RouteSEO } from "../../seo/RouteSEO";
import { ContextualCrossLink } from "../../components/service/ContextualCrossLink";

type CapabilityCategory = {
  title: string;
  benefit: string;
  items: string[];
};

type ContentPoint = {
  title: string;
  text: string;
};

type WorkflowStep = {
  title: string;
  text: string;
};

const CAPABILITY_CATEGORIES: CapabilityCategory[] = [
  {
    title: "Texte & Botschaften",
    benefit: "Damit Angebote schneller verstanden werden und die Seite gezielter zur Anfrage führt.",
    items: [
      "Website-Texte",
      "Hero-Texte",
      "Leistungsbeschreibungen",
      "Conversion-Copy",
    ],
  },
  {
    title: "Bildwelt & Fotografie",
    benefit: "Damit Qualität sichtbar wird und der Auftritt nicht nach austauschbarem Template aussieht.",
    items: ["Bildkonzepte", "eigene Fotos", "Bildbearbeitung & Retusche"],
  },
  {
    title: "Video & Motion",
    benefit: "Damit wichtige Aussagen, Übergänge oder Markenmomente schneller erfasst werden.",
    items: ["kurze Video-Snippets", "Motion Design", "Logo-Animationen"],
  },
  {
    title: "3D & Visualisierung",
    benefit: "Damit Produkte, Services oder digitale Systeme greifbarer und hochwertiger präsentiert werden.",
    items: ["3D-Visuals", "Produktvisualisierung", "Servicevisualisierung"],
  },
  {
    title: "Kampagnen & Social Assets",
    benefit: "Damit Website, Kampagne und Social Media nicht wie getrennte Welten wirken.",
    items: ["Social-Media-Visuals", "Mockups und Präsentationsgrafiken", "Kampagnen-Visuals"],
  },
];

const EFFECT_POINTS: ContentPoint[] = [
  {
    title: "Klarer erster Eindruck",
    text: "Besucher erkennen schneller, ob Ihr Unternehmen zu ihrem Bedarf passt.",
  },
  {
    title: "Schnellere Orientierung",
    text: "Texte, Bilder und visuelle Signale helfen, Leistungen ohne Umwege einzuordnen.",
  },
  {
    title: "Mehr Vertrauen",
    text: "Eine stimmige Bildwelt zeigt Qualität, Sorgfalt und Anspruch, bevor Details gelesen werden.",
  },
  {
    title: "Stärkere Wiedererkennung",
    text: "Ein eigener visueller Ton macht den Auftritt merkbarer als austauschbare Vorlagen.",
  },
  {
    title: "Bessere Erklärung komplexer Leistungen",
    text: "Visualisierungen, Motion oder klare Texte machen abstrakte Angebote leichter greifbar.",
  },
  {
    title: "Mehr Konsistenz",
    text: "Website, Kampagnen und Social Media können aus derselben visuellen Richtung heraus arbeiten.",
  },
];

const WEB_CONTEXT_POINTS: ContentPoint[] = [
  {
    title: "Websites & Landingpages",
    text: "Hero-Bereich, Seitenstruktur, Bildwelt, CTA und Texte werden als ein digitaler Auftritt gedacht.",
  },
  {
    title: "SEO & Sichtbarkeit",
    text: "Inhalte bleiben verständlich für Menschen und sauber strukturiert für Suchsysteme.",
  },
  {
    title: "Shops & Konfiguratoren",
    text: "Produkte, Varianten und Erklärungen erhalten Bilder, Visuals oder Medien, die Entscheidungen erleichtern.",
  },
  {
    title: "Kampagnen-Landingpages",
    text: "Angebot, Bild, Text und CTA werden auf einen klaren nächsten Schritt ausgerichtet.",
  },
];

const AUDIENCE_CASES: ContentPoint[] = [
  {
    title: "Ihre Website wirkt noch zu generisch oder templatehaft.",
    text: "Der Auftritt funktioniert technisch, aber die visuelle Sprache passt nicht zum Anspruch Ihres Unternehmens.",
  },
  {
    title: "Ihre Leistungen sind stark, aber online nicht gut genug erklärt.",
    text: "Texte, Bildwelt oder Medien machen noch nicht deutlich, warum Besucher anfragen sollten.",
  },
  {
    title: "Ihre Bildwelt passt nicht mehr zum Unternehmen.",
    text: "Fotos, Farben, Motive oder Grafiken wirken älter, beliebiger oder weniger hochwertig als Ihre Arbeit.",
  },
  {
    title: "Sie brauchen bessere Inhalte für eine neue Website.",
    text: "Texte, Bilder und visuelle Richtung sollen direkt mit Struktur, Design und Entwicklung entstehen.",
  },
  {
    title: "Ihre Produkte oder Services sind schwer mit Standardbildern darstellbar.",
    text: "Visualisierungen, bearbeitete Szenen, Motion oder 3D können Zusammenhänge klarer machen.",
  },
  {
    title: "Website, Social Media und Kampagnen sollen konsistenter wirken.",
    text: "Ein gemeinsames visuelles System stärkt Wiedererkennung und reduziert Abstimmungsaufwand.",
  },
  {
    title: "Sie möchten hochwertige Medien ohne mehrere Dienstleister koordinieren.",
    text: "MAGICKS kann Inhalte im Kontext des Webprojekts konzipieren, erstellen und einbinden.",
  },
];

const AVOID_POINTS = [
  "Keine beliebige Stock-Optik.",
  "Keine Texte, die gut klingen, aber nichts erklären.",
  "Keine Bilder, die nicht zur Marke passen.",
  "Keine Medienproduktion ohne Bezug zur Website.",
  "Keine überladenen Effekte, die vom Inhalt ablenken.",
  "Keine visuelle Richtung, die nur dekorativ ist und keinen Zweck erfüllt.",
] as const;

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    title: "Verstehen",
    text: "Wir klären, was Ihr Unternehmen ausmacht, welche Leistungen erklärt werden müssen und welche Wirkung der Auftritt erzeugen soll.",
  },
  {
    title: "Schärfen",
    text: "Wir entwickeln Botschaften, Textlogik und visuelle Richtung passend zu Zielgruppe, Angebot und Website-Struktur.",
  },
  {
    title: "Konzipieren",
    text: "Wir definieren Motive, Bildstil, Medienformate, Motion-Ideen oder Visualisierungen, die den Auftritt stärken.",
  },
  {
    title: "Erstellen",
    text: "Je nach Projekt entstehen Texte, bearbeitete Bilder, Foto- oder Videoelemente, Motion Design, 3D-Visuals oder Präsentationsgrafiken.",
  },
  {
    title: "Einbinden",
    text: "Die Medien werden nicht isoliert geliefert, sondern in Layout, CTA, Nutzerführung, SEO-Struktur und Animation eingebettet.",
  },
  {
    title: "Optimieren",
    text: "Nach dem Launch können Inhalte, Bildwelt und Medienformate weiterentwickelt und für Kampagnen oder Social Media angepasst werden.",
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

function MediaDirectionMap() {
  const items = [
    { label: "Worte", value: "erklären" },
    { label: "Bilder", value: "prägen" },
    { label: "Motion", value: "führt" },
    { label: "3D", value: "zeigt" },
    { label: "Kampagne", value: "verstärkt" },
    { label: "Website", value: "verbindet" },
  ] as const;

  return (
    <div className="rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.62)] p-5 shadow-[0_24px_68px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.74)] sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)]">
          Bildwelt
        </span>
        <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.38)]">
          Erkennen → Vertrauen
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={item.label}
            data-cbm-map
            className="relative rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.58)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.66)]"
          >
            <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.64)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="font-ui mt-4 text-[1rem] font-[620] leading-[1.2] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.9)]">
              {item.label}
            </p>
            <p className="font-ui mt-1 text-[13px] leading-[1.42] text-[rgb(var(--magicks-ink-rgb)/0.58)]">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ContentBildweltMedienPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-cbm-hero-item]");
      const mapItems = gsap.utils.toArray<HTMLElement>("[data-cbm-map]");
      const reveals = gsap.utils.toArray<HTMLElement>("[data-cbm-reveal]");

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
      <RouteSEO path="/content-bildwelt-medien" />

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
                "radial-gradient(ellipse 58% 46% at 16% 18%, rgba(166,138,98,0.14), transparent 72%), radial-gradient(ellipse 50% 40% at 84% 34%, rgba(122,104,86,0.12), transparent 74%), radial-gradient(ellipse 74% 44% at 50% 94%, rgba(255,255,255,0.58), transparent 76%)",
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
                  <div data-cbm-hero-item>
                    <Eyebrow>Content, Bildwelt & Medien</Eyebrow>
                  </div>

                  <h1
                    data-cbm-hero-item
                    className="font-ui mt-7 max-w-[18ch] text-[2.42rem] font-[630] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.35rem] md:text-[4.42rem] lg:text-[5.1rem]"
                  >
                    Content & Bildwelt, die Ihren Auftritt eigenständig machen.
                  </h1>

                  <p
                    data-cbm-hero-item
                    className="font-ui mt-8 max-w-[50rem] text-[1.03rem] font-[480] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.1rem] md:text-[1.18rem]"
                  >
                    MAGICKS entwickelt Texte, Bildkonzepte, Medien und visuelle
                    Richtungen, die Websites hochwertiger, verständlicher und
                    eigenständiger machen — damit Ihr digitaler Auftritt nicht
                    wie ein Template wirkt, sondern wie Ihr Unternehmen.
                  </p>

                  <div
                    data-cbm-hero-item
                    className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12"
                  >
                    <PrimaryCta to="/kontakt" label="Content-Projekt besprechen" />
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

                <aside data-cbm-hero-item className="lg:mb-2">
                  <MediaDirectionMap />
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
                <div data-cbm-reveal>
                  <Eyebrow>Kein spätes Dekor</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[18ch] text-[2.1rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.85rem] md:text-[3.55rem]">
                    Inhalt und Bildwelt sind kein spätes Dekor.
                  </h2>
                </div>

                <div data-cbm-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Viele Websites wirken austauschbar, weil Texte, Bilder und
                    Medien erst am Ende ergänzt werden. Dann entstehen
                    Platzhalter, Stock-Optik und Aussagen, die wenig erklären.
                    MAGICKS denkt Content und Bildwelt früher mit — damit
                    Struktur, Design, Text, Bild und Bewegung zusammenarbeiten.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-cbm-reveal className="max-w-[60rem]">
                <Eyebrow>Was entstehen kann</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[21ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Bausteine für einen Auftritt, der nach Ihrem Unternehmen
                  aussieht.
                </h2>
                <p className="font-ui mt-7 max-w-[50rem] text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                  Je nach Projekt entstehen einzelne Bausteine oder eine
                  vollständige visuelle Richtung. Entscheidend ist nicht die
                  Menge der Medien, sondern ob sie Klarheit, Vertrauen,
                  Wiedererkennung und Anfragewege unterstützen.
                </p>
              </div>

              <div className="mt-12 grid gap-5 lg:grid-cols-2">
                {CAPABILITY_CATEGORIES.map((category, index) => (
                  <article
                    key={category.title}
                    data-cbm-reveal
                    className={`rounded-[1.2rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.54)] p-5 shadow-[0_18px_52px_-44px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6 ${
                      index === CAPABILITY_CATEGORIES.length - 1 ? "lg:col-span-2" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.68)]">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <h3 className="font-ui mt-3 text-[1.18rem] font-[620] leading-[1.22] tracking-[-0.014em] text-[rgb(var(--magicks-ink-rgb)/0.93)] sm:text-[1.32rem]">
                          {category.title}
                        </h3>
                      </div>
                    </div>
                    <p className="font-ui mt-4 max-w-[42rem] text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                      {category.benefit}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2.5">
                      {category.items.map((item) => (
                        <li
                          key={item}
                          className="font-ui rounded-full border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[rgb(var(--magicks-bg-base-rgb)/0.56)] px-3 py-2 text-[13.2px] font-[560] leading-none text-[rgb(var(--magicks-ink-rgb)/0.7)]"
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

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:gap-16">
                <div data-cbm-reveal>
                  <Eyebrow>Warum Medien Wirkung verändern</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                    Menschen entscheiden schneller, wenn sie verstehen, was sie
                    sehen.
                  </h2>
                </div>

                <div data-cbm-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Bilder, Texte und Medien prägen den ersten Eindruck oft
                    schneller als jede technische Funktion. Sie zeigen Qualität,
                    machen Leistungen greifbar und geben einem Unternehmen eine
                    erkennbare Sprache. Gerade bei hochwertigen
                    Dienstleistungen, lokalen Unternehmen, erklärungsbedürftigen
                    Produkten und digitalen Kampagnen entscheidet die Bildwelt
                    darüber, ob ein Auftritt glaubwürdig wirkt.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {EFFECT_POINTS.map((point) => (
                  <article
                    key={point.title}
                    data-cbm-reveal
                    className="rounded-[1.05rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.54)] p-5 shadow-[0_18px_52px_-44px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6"
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
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-start lg:gap-16">
                <div data-cbm-reveal>
                  <Eyebrow>Eigene Bildwelt statt Stock-Optik</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                    Stockbilder können füllen. Eine eigene Bildwelt kann führen.
                  </h2>
                </div>

                <div data-cbm-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Stockbilder können in einzelnen Fällen sinnvoll sein. Aber
                    sie ersetzen selten eine visuelle Richtung, die wirklich zum
                    Unternehmen passt. Wenn ein Projekt es braucht, entwickelt
                    MAGICKS eine eigene Bildlogik: Licht, Perspektive,
                    Komposition, Farbgefühl, Motive, Bewegung, 3D oder
                    bearbeitete Szenen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:gap-16">
                <div data-cbm-reveal>
                  <Eyebrow>Content als Teil von Webdesign</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                    Medien entstehen nicht neben der Website. Sie entstehen mit
                    ihr.
                  </h2>
                </div>

                <div data-cbm-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Hero-Bereich, Seitenstruktur, Text, Bildwelt, CTA,
                    Animation und Nutzerführung müssen zusammen funktionieren.
                    Deshalb werden Inhalte bei MAGICKS nicht isoliert
                    produziert, sondern im Kontext des digitalen Auftritts
                    gedacht.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {WEB_CONTEXT_POINTS.map((point) => (
                  <article
                    key={point.title}
                    data-cbm-reveal
                    className="rounded-[1.05rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] p-5 shadow-[0_18px_52px_-44px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)]"
                  >
                    <h3 className="font-ui text-[1.02rem] font-[620] leading-[1.26] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                      {point.title}
                    </h3>
                    <p className="font-ui mt-3 text-[14.2px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                      {point.text}
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
              <div data-cbm-reveal className="max-w-[60rem]">
                <Eyebrow>Für wen diese Leistung passt</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[22ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Für Unternehmen, deren Auftritt nicht mehr austauschbar wirken
                  soll.
                </h2>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2">
                {AUDIENCE_CASES.map((item, index) => (
                  <article
                    key={item.title}
                    data-cbm-reveal
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

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-cbm-reveal className="max-w-[58rem]">
                <Eyebrow>Was wir bewusst vermeiden</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Eine Bildwelt braucht Richtung, nicht nur Material.
                </h2>
              </div>

              <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AVOID_POINTS.map((line) => (
                  <li
                    key={line}
                    data-cbm-reveal
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
              <div data-cbm-reveal className="max-w-[58rem]">
                <Eyebrow>Unser Ablauf</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[22ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Von der Aussage zur eigenen Bildwelt.
                </h2>
              </div>

              <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {WORKFLOW_STEPS.map((step, index) => (
                  <li
                    key={step.title}
                    data-cbm-reveal
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
            <div data-cbm-reveal>
              <ContextualCrossLink
                eyebrow="Website-Basis"
                folio="Websites & Landingpages"
                lead="Wenn Inhalte, Bildwelt, Design, Technik und Nutzerführung als ein vollständiger digitaler Auftritt entstehen sollen."
                linkLabel="Websites & Landingpages ansehen"
                to="/websites-landingpages"
              />
            </div>

            <div data-cbm-reveal className="mt-12 sm:mt-14 md:mt-16">
              <ContextualCrossLink
                eyebrow="Sichtbarkeit"
                folio="SEO & Sichtbarkeit"
                lead="Wenn Inhalte nicht nur hochwertig wirken, sondern auch strukturiert, auffindbar und verständlich aufgebaut werden sollen."
                linkLabel="SEO & Sichtbarkeit ansehen"
                to="/seo-sichtbarkeit"
              />
            </div>

            <div data-cbm-reveal className="mt-12 sm:mt-14 md:mt-16">
              <ContextualCrossLink
                eyebrow="Produkte"
                folio="Shops & Konfiguratoren"
                lead="Wenn Produktbilder, Visualisierungen oder Medien helfen sollen, Varianten, Nutzen und Kaufentscheidungen klarer zu machen."
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
                "radial-gradient(ellipse 62% 46% at 24% 20%, rgba(166,138,98,0.12), transparent 74%), radial-gradient(ellipse 52% 40% at 80% 76%, rgba(122,104,86,0.1), transparent 76%)",
            }}
          />
          <div className="relative layout-max">
            <div
              data-cbm-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow>Nächster Schritt</Eyebrow>
              <h2 className="font-ui mx-auto mt-7 max-w-[20ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.9rem]">
                Wirkt Ihr Auftritt schon nach Ihrem Unternehmen?
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[46rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Lassen Sie uns klären, welche Texte, Bilder oder Medien Ihrem
                digitalen Auftritt mehr Klarheit, Vertrauen und Eigenständigkeit
                geben können.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta to="/kontakt" label="Content-Projekt besprechen" />
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
