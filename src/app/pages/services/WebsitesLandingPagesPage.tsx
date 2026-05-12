import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { runRouteReveal } from "../../lib/routeReveal";
import { RouteSEO } from "../../seo/RouteSEO";
import { EditorialAnchor } from "../../components/service/EditorialAnchor";
import { ContextualCrossLink } from "../../components/service/ContextualCrossLink";
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

const DESIGN_LOGIC_POINTS: BenefitPoint[] = [
  {
    title: "Klarer erster Eindruck",
    text: "Besucher verstehen sofort, wer Sie sind, was Sie anbieten und warum Ihr Unternehmen relevant ist.",
  },
  {
    title: "Verständliche Leistungen",
    text: "Ihre Angebote werden so strukturiert, dass sie auch ohne Vorgespräch nachvollziehbar sind.",
  },
  {
    title: "Vertrauensbildende Inhalte",
    text: "Texte, Bildwelt, Belege und Tonalität arbeiten zusammen, statt nur Fläche zu füllen.",
  },
  {
    title: "Mobile Nutzerführung",
    text: "Die wichtigsten Informationen, CTAs und Kontaktwege bleiben auch auf kleinen Screens klar erreichbar.",
  },
  {
    title: "Schnelle Ladezeiten",
    text: "Performance wird nicht als Nachtrag behandelt, sondern von Beginn an mitgedacht.",
  },
  {
    title: "Klare Anfragewege",
    text: "Kontaktformulare, Buchungen oder Angebotsanfragen werden sichtbar und sinnvoll in die Seite eingebunden.",
  },
];

const AUDIENCE_CASES: AudienceCase[] = [
  {
    title: "Ihre aktuelle Website wirkt nicht mehr hochwertig genug.",
    text: "Der Auftritt passt nicht mehr zu Ihrer Arbeit, Ihrem Angebot oder Ihrem Anspruch.",
  },
  {
    title: "Ihre Leistungen werden online nicht klar genug erklärt.",
    text: "Besucher verstehen zu spät, warum sie sich für Ihr Unternehmen entscheiden sollten.",
  },
  {
    title: "Ihre Website erzeugt zu wenige Anfragen.",
    text: "Es fehlt an Struktur, klaren Handlungswegen oder überzeugenden Argumenten.",
  },
  {
    title: "Ihre Landingpage verliert Nutzer, bevor sie handeln.",
    text: "Der Einstieg, die Reihenfolge der Argumente oder der CTA führen nicht präzise genug.",
  },
  {
    title: "Ihre Seite ist langsam, unübersichtlich oder mobil schwach.",
    text: "Technische Reibung und schlechte Lesbarkeit kosten Vertrauen, bevor ein Kontakt entsteht.",
  },
  {
    title: "Ihr digitaler Auftritt passt nicht mehr zu Ihrem Anspruch.",
    text: "Sie brauchen eine Website, die Ihre Qualität sichtbar macht und im Alltag funktioniert.",
  },
];

const DELIVERABLES: Deliverable[] = [
  {
    title: "Strategie & Seitenstruktur",
    text: "Wir ordnen Inhalte, Ziele und Prioritäten, damit Besucher schneller verstehen und handeln.",
  },
  {
    title: "UX & Nutzerführung",
    text: "Wir entwickeln klare Wege durch die Seite, damit Interesse nicht in Orientierungslosigkeit endet.",
  },
  {
    title: "Webdesign & visuelle Richtung",
    text: "Der Auftritt wirkt hochwertig, eigenständig und passend zu Ihrem Unternehmen.",
  },
  {
    title: "Texte & Conversion-Copy",
    text: "Headlines, Leistungsbeschreibungen und CTAs erklären Ihr Angebot klar und überzeugend.",
  },
  {
    title: "Bildwelt, Mockups und Content-Richtung",
    text: "Visuelle Elemente unterstützen Vertrauen und Aussagekraft, statt austauschbar zu wirken.",
  },
  {
    title: "Responsive Entwicklung",
    text: "Die Website funktioniert sauber auf Desktop, Tablet und Smartphone.",
  },
  {
    title: "Performance-Optimierung",
    text: "Schnelle Ladezeiten stärken Nutzererlebnis, Vertrauen und technische Qualität.",
  },
  {
    title: "Technische SEO-Basis",
    text: "Struktur, Meta-Daten, Überschriften und technische Grundlagen werden sauber angelegt.",
  },
  {
    title: "Kontaktformulare, Tracking und Anfrageflows",
    text: "Anfragen werden nicht dem Zufall überlassen, sondern sinnvoll vorbereitet und messbar gemacht.",
  },
  {
    title: "Landingpages für Kampagnen und lokale Sichtbarkeit",
    text: "Gezielte Seiten unterstützen Angebote, Anzeigen, Recruiting oder regionale Suchanfragen.",
  },
  {
    title: "Hosting, Analyse und laufende Optimierung",
    text: "Auf Wunsch betreuen wir den Auftritt auch nach dem Launch weiter.",
  },
];

const LANDINGPAGE_TYPES = [
  "Kampagnen-Landingpages",
  "Lokale SEO-Landingpages",
  "Produkt- oder Angebotsseiten",
  "Bewerbungs- oder Recruiting-Landingpages",
  "Termin- oder Anfrage-Seiten",
] as const;

const AVOID_POINTS = [
  "Keine Baukastenoptik.",
  "Keine generischen Templates.",
  "Keine überladene Agentur-Show.",
  "Kein Design ohne klare Nutzerführung.",
  "Keine Website, die nach dem Launch technisch stehen bleibt.",
  "Keine Inhalte, die gut klingen, aber nichts erklären.",
] as const;

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    title: "Verstehen",
    text: "Weil eine gute Website mit Ihrem Unternehmen, Ihren Kunden und Ihrem Ziel beginnt.",
  },
  {
    title: "Strukturieren",
    text: "Wir ordnen Inhalte, Seitenlogik und Nutzerführung, bevor Design entsteht.",
  },
  {
    title: "Schärfen",
    text: "Texte, Bildwelt und Argumente werden so entwickelt, dass Ihr Angebot verständlich und überzeugend wirkt.",
  },
  {
    title: "Gestalten",
    text: "Das Design übersetzt Strategie in einen hochwertigen, klaren digitalen Auftritt.",
  },
  {
    title: "Entwickeln",
    text: "Die Umsetzung erfolgt responsiv, sauber, performant und technisch nachvollziehbar.",
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
        style={{ fontVariantEmoji: "text" }}
      >
        {"\u2197\uFE0E"}
      </span>
    </Link>
  );
}

export default function WebsitesLandingPagesPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-wl-hero-item]");
      const reveals = gsap.utils.toArray<HTMLElement>("[data-wl-reveal]");

      if (reduced) {
        gsap.set([...heroItems, ...reveals], {
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
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/websites-landingpages" />

      <main
        ref={rootRef}
        className="relative overflow-hidden bg-[var(--magicks-bg-base)] pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.25rem]"
      >
        <section
          data-wl-hero
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
            className="pointer-events-none absolute inset-0 opacity-[0.32]"
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
              <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,0.62fr)] lg:items-end lg:gap-16">
                <div>
                  <div data-wl-hero-item>
                    <Eyebrow>Websites & Landingpages</Eyebrow>
                  </div>

                  <h1
                    data-wl-hero-item
                    className="font-ui mt-7 max-w-[17ch] text-[2.42rem] font-[630] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.35rem] md:text-[4.42rem] lg:text-[5.1rem]"
                  >
                    Websites & Landing Pages, die Vertrauen schaffen und
                    Anfragen erzeugen.
                  </h1>

                  <p
                    data-wl-hero-item
                    className="font-ui mt-8 max-w-[49rem] text-[1.03rem] font-[480] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.1rem] md:text-[1.18rem]"
                  >
                    MAGICKS entwickelt digitale Auftritte, die hochwertig
                    wirken, Leistungen klar erklären und Besucher gezielt zur
                    nächsten Handlung führen — vom ersten Eindruck bis zur
                    Anfrage.
                  </p>

                  <div
                    data-wl-hero-item
                    className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12"
                  >
                    <PrimaryCta to="/kontakt" label="Website-Projekt besprechen" />
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

                <aside
                  data-wl-hero-item
                  className="rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.62)] p-5 shadow-[0_24px_68px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.74)] sm:p-6 lg:mb-2"
                  aria-label="Kernnutzen"
                >
                  <p className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.74)] sm:text-[11px]">
                    Was die Seite leisten muss
                  </p>
                  <ul className="mt-5 grid gap-3">
                    {[
                      "Erster Eindruck",
                      "Klarheit",
                      "Vertrauen",
                      "Nutzerführung",
                      "Performance",
                      "Anfrageflow",
                    ].map((item) => (
                      <li
                        key={item}
                        className="font-ui flex items-center justify-between gap-5 border-t border-[rgb(var(--magicks-line-rgb)/0.09)] pt-3 text-[14.5px] font-[560] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.78)]"
                      >
                        <span>{item}</span>
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--magicks-accent-rgb)/0.7)]"
                        />
                      </li>
                    ))}
                  </ul>
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
                <div data-wl-reveal>
                  <Eyebrow>Warum Design allein nicht reicht</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[15ch] text-[2.1rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.85rem] md:text-[3.55rem]">
                    Gutes Design ist nur der Anfang.
                  </h2>
                </div>

                <div data-wl-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Eine Website muss hochwertig aussehen. Aber sie muss auch
                    verständlich erklären, Vertrauen aufbauen, Nutzer sicher
                    führen und technisch sauber funktionieren. Erst wenn
                    Struktur, Text, Design, Performance und Nutzerführung
                    zusammenspielen, wird aus einem Besuch eine echte Anfrage.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {DESIGN_LOGIC_POINTS.map((point) => (
                  <article
                    key={point.title}
                    data-wl-reveal
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

              <div data-wl-reveal className="mt-18 sm:mt-20 md:mt-24">
                <EditorialAnchor
                  src={SERVICE_PAGE_IMAGES.websites.brand.src}
                  alt={SERVICE_PAGE_IMAGES.websites.brand.alt}
                  folio="Fig. 01"
                  context="Web-Auftritt"
                  leftCaption="Struktur · Vertrauen · Anfrage"
                  rightCaption="MAGICKS Service Detail"
                  aspect="16/9"
                  align="right"
                  maxWidth="46rem"
                  revealAttr="data-wl-reveal"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-wl-reveal className="max-w-[58rem]">
                <Eyebrow>Für wen diese Leistung passt</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Für Unternehmen, deren Website mehr leisten muss.
                </h2>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2">
                {AUDIENCE_CASES.map((item) => (
                  <article
                    key={item.title}
                    data-wl-reveal
                    className="grid gap-4 rounded-[1.15rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] p-5 shadow-[0_20px_56px_-48px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.74)] sm:grid-cols-[auto_minmax(0,1fr)] sm:p-6"
                  >
                    <span
                      aria-hidden
                      className="font-instrument text-[1.55rem] italic leading-none text-[rgb(var(--magicks-accent-ink-rgb)/0.62)]"
                    >
                      —
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
              <div data-wl-reveal className="max-w-[60rem]">
                <Eyebrow>Was MAGICKS für Sie umsetzt</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Alles, was ein überzeugender Auftritt braucht.
                </h2>
                <p className="font-ui mt-7 max-w-[50rem] text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                  Wir planen Websites nicht als lose Liste von Funktionen,
                  sondern als zusammenhängenden Auftritt: verständlich,
                  vertrauensbildend, schnell und auf Anfragen ausgerichtet.
                </p>
              </div>

              <ol className="mt-12 grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
                {DELIVERABLES.map((item, index) => (
                  <li
                    key={item.title}
                    data-wl-reveal
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
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-start lg:gap-16">
                <div data-wl-reveal>
                  <Eyebrow>Landingpages als Verkaufsflächen</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[18ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                    Eine Landingpage ist keine kleine Website.
                    <span className="font-instrument mt-2 block italic font-normal text-[rgb(var(--magicks-ink-rgb)/0.62)]">
                      Sie ist eine fokussierte Verkaufsfläche.
                    </span>
                  </h2>
                </div>

                <div data-wl-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Landingpages verfolgen ein klares Ziel: Anfrage, Buchung,
                    Kauf, Bewerbung oder Termin. Deshalb braucht jede
                    Landingpage eine präzise Struktur, einen starken Einstieg,
                    klare Argumente, sichtbare Beweise und eine eindeutige
                    nächste Handlung.
                  </p>

                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {LANDINGPAGE_TYPES.map((item) => (
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

              <div data-wl-reveal className="mt-18 sm:mt-20 md:mt-24">
                <EditorialAnchor
                  src={SERVICE_PAGE_IMAGES.websites.detail.src}
                  alt={SERVICE_PAGE_IMAGES.websites.detail.alt}
                  folio="Fig. 02"
                  context="Landingpage"
                  leftCaption="Kampagne · Fokus · Handlung"
                  rightCaption="Conversion-Struktur"
                  aspect="16/9"
                  align="left"
                  maxWidth="48rem"
                  revealAttr="data-wl-reveal"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-wl-reveal className="max-w-[58rem]">
                <Eyebrow>Was wir bewusst vermeiden</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[17ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Ruhig in der Haltung. Klar in der Entscheidung.
                </h2>
              </div>

              <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AVOID_POINTS.map((line) => (
                  <li
                    key={line}
                    data-wl-reveal
                    className="rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.54)] p-5 shadow-[0_18px_48px_-42px_rgba(20,28,44,0.24),inset_0_1px_0_rgba(255,255,255,0.72)]"
                  >
                    <p className="font-ui text-[1rem] font-[610] leading-[1.34] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.88)]">
                      {line}
                    </p>
                  </li>
                ))}
              </ul>

              <p
                data-wl-reveal
                className="font-ui mt-10 max-w-[46rem] text-[15px] leading-[1.7] text-[rgb(var(--magicks-ink-rgb)/0.66)] sm:text-[15.5px]"
              >
                Der Anspruch ist nicht, lauter als andere aufzutreten. Der
                Anspruch ist ein digitaler Auftritt, der verstanden wird,
                Vertrauen aufbaut und zur richtigen Handlung führt.
              </p>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-wl-reveal className="max-w-[58rem]">
                <Eyebrow>Unser Ablauf</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[18ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Strategisch gedacht. Sauber umgesetzt.
                </h2>
              </div>

              <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {WORKFLOW_STEPS.map((step, index) => (
                  <li
                    key={step.title}
                    data-wl-reveal
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
            <div data-wl-reveal>
              <ContextualCrossLink
                eyebrow="Überblick"
                folio="Service Hub"
                lead="Wenn Sie Website, Shop, Software und Automationen zusammen denken möchten, zeigt die Leistungsübersicht den gesamten MAGICKS-Rahmen."
                linkLabel="Alle Leistungen ansehen"
                to="/leistungen"
              />
            </div>

            <div data-wl-reveal className="mt-12 sm:mt-14 md:mt-16">
              <ContextualCrossLink
                eyebrow="Planbares Modell"
                folio="Website im Abo"
                lead="Wenn eine professionelle Website planbar monatlich starten soll, ist Website im Abo der passende Einstieg."
                linkLabel="Website im Abo ansehen"
                to="/website-im-abo"
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
              data-wl-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow>Nächster Schritt</Eyebrow>
              <h2 className="font-ui mx-auto mt-7 max-w-[18ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.9rem]">
                Ist Ihre Website bereit, mehr zu leisten?
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[46rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Lassen Sie uns klären, wie Ihr digitaler Auftritt hochwertiger,
                klarer und anfrage-stärker werden kann.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta to="/kontakt" label="Website-Projekt besprechen" />
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
