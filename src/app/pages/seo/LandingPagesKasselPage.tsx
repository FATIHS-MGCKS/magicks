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

type ProcessStep = {
  title: string;
  text: string;
};

type RelatedLink = {
  to: string;
  eyebrow: string;
  folio: string;
  lead: string;
  linkLabel: string;
};

const TRUST_CHIPS = [
  "Kassel & Nordhessen",
  "Conversion-Fokus",
  "Klare Struktur",
  "Saubere technische Umsetzung",
] as const;

const PRINCIPLE_POINTS: TextBlock[] = [
  {
    title: "Ein Angebot",
    text: "Die Seite konzentriert sich auf eine konkrete Leistung, Aktion, Kampagne oder ein klar umrissenes Produkt.",
  },
  {
    title: "Eine Zielgruppe",
    text: "Inhalte, Argumente und Tonalität richten sich an Menschen, für die dieses Angebot jetzt relevant ist.",
  },
  {
    title: "Ein klarer Einstieg",
    text: "Besucher verstehen in wenigen Sekunden, worum es geht und warum sie weiterlesen sollten.",
  },
  {
    title: "Starke Argumente",
    text: "Vorteile, Ablauf, Beweise und Einwände werden so geordnet, dass die Entscheidung leichter wird.",
  },
  {
    title: "Eindeutige CTA",
    text: "Die nächste Handlung bleibt sichtbar: Anfrage, Buchung, Bewerbung, Kauf, Formular oder Termin.",
  },
  {
    title: "Weniger Ablenkung",
    text: "Navigation, Nebenbotschaften und visuelle Elemente werden dem Ziel der Seite untergeordnet.",
  },
];

const USE_CASES: TextBlock[] = [
  {
    title: "Gezielt Anfragen oder Leads erzeugen",
    text: "Wenn eine konkrete Leistung mehr Sichtbarkeit und bessere Anfragewege braucht.",
  },
  {
    title: "Eine Kampagne oder lokale Aktion starten",
    text: "Wenn Ads, Social Media, E-Mail oder lokale Kommunikation auf eine passende Zielseite führen sollen.",
  },
  {
    title: "Eine Dienstleistung fokussiert bewerben",
    text: "Wenn die bestehende Website zu breit ist, um ein einzelnes Angebot überzeugend zu erklären.",
  },
  {
    title: "Ein Produkt oder Angebot erklären",
    text: "Wenn Nutzen, Ablauf, Preislogik oder Unterschiede verständlich gemacht werden müssen.",
  },
  {
    title: "Ads mit einer passenden Zielseite verbinden",
    text: "Wenn Google Ads, Meta Ads oder andere Kampagnen nicht auf eine allgemeine Homepage führen sollen.",
  },
  {
    title: "Bewerbungen, Buchungen oder Termine sammeln",
    text: "Wenn eine Seite auf eine klare Handlung optimiert werden soll, ohne den Nutzer zu zerstreuen.",
  },
  {
    title: "Eine lokale Angebotsseite aufbauen",
    text: "Wenn ein Angebot in Kassel, Nordhessen oder einem regionalen Einzugsgebiet gefunden und verstanden werden soll.",
  },
  {
    title: "Eine bestehende Website ergänzen",
    text: "Wenn der Hauptauftritt bleibt, aber ein bestimmtes Thema eine eigene Conversion-Strecke braucht.",
  },
];

const DELIVERABLES: TextBlock[] = [
  {
    title: "Landing Pages mit Conversion-Fokus",
    text: "Klare Seitenlogik, starke Einstiegsaussage und ein sichtbarer Weg zur Anfrage.",
  },
  {
    title: "Kampagnen- und Angebotsseiten",
    text: "Für konkrete Leistungen, Produkte, Aktionen, lokale Angebote, Recruiting oder Lead-Generierung.",
  },
  {
    title: "Lokale Landing Pages",
    text: "Für Kassel und Nordhessen, wenn regionale Suchintention und überzeugende Nutzerführung zusammenkommen sollen.",
  },
  {
    title: "Storyline und CTA-Logik",
    text: "Einstieg, Argumente, Trust-Elemente und Handlung werden so geordnet, dass die Seite nicht beliebig wirkt.",
  },
  {
    title: "UX und Nutzerführung",
    text: "Der Blick wird geführt, Ablenkung reduziert und der nächste Schritt an den richtigen Stellen sichtbar gemacht.",
  },
  {
    title: "Texte und Conversion-Copy",
    text: "Formulierungen erklären das Angebot klar, behandeln Einwände und bleiben formal, präzise und glaubwürdig.",
  },
  {
    title: "Bildwelt und Medienintegration",
    text: "Bilder, Hero-Visuals oder Medienbausteine unterstützen Vertrauen und Verständnis statt nur Dekoration zu sein.",
  },
  {
    title: "Responsive Umsetzung",
    text: "Die Landing Page wird mobil lesbar, schnell bedienbar und technisch sauber umgesetzt.",
  },
  {
    title: "Technische SEO-Basis",
    text: "Meta-Daten, Struktur, Performance, Indexierbarkeit und interne Verlinkung werden von Beginn an mitgedacht.",
  },
  {
    title: "Formulare und Integrationen",
    text: "Tracking, CRM, Terminbuchung oder Formularstrecken können ergänzt werden, wenn sie zum Ziel der Seite passen.",
  },
];

const COMPARISON = [
  {
    label: "Homepage",
    points: ["viele Themen", "breite Orientierung", "gesamtes Unternehmen", "mehr Navigationswege"],
  },
  {
    label: "Landing Page",
    points: ["ein Ziel", "ein Angebot", "klare Entscheidung", "weniger Ablenkung", "stärkere CTA-Führung"],
  },
] as const;

const LOCAL_POINTS: TextBlock[] = [
  {
    title: "Suchintention statt Ortsnamen-Stapel",
    text: "Landing Pages Kassel, Landingpage Kassel oder Landing Page erstellen lassen Kassel werden nur dort aufgenommen, wo sie zur echten Nachfrage passen.",
  },
  {
    title: "Regionale Angebote verständlich machen",
    text: "Lokale Dienstleistungen, Aktionen oder Kampagnen brauchen Inhalte, die in Kassel und Nordhessen relevant sind.",
  },
  {
    title: "Vertrauen nach dem Klick",
    text: "Eine lokale Zielseite muss nicht nur gefunden werden, sondern sofort seriös, klar und handlungsfähig wirken.",
  },
  {
    title: "Lokale Sichtbarkeit mit Conversion verbinden",
    text: "Struktur, Inhalt, Nutzerführung und Technik werden so verbunden, dass aus regionalem Interesse eine Anfrage werden kann.",
  },
];

const LANDING_PAGE_ELEMENTS: TextBlock[] = [
  {
    title: "Klare Hauptaussage",
    text: "Ein Satz muss verständlich machen, welches Angebot für wen relevant ist.",
  },
  {
    title: "Konkretes Angebot",
    text: "Die Seite braucht einen greifbaren Fokus, nicht nur allgemeine Unternehmenskommunikation.",
  },
  {
    title: "Verständliche Vorteile",
    text: "Nutzen, Ablauf und Unterschiede werden so erklärt, dass Interessenten schneller entscheiden können.",
  },
  {
    title: "Visuelle Führung",
    text: "Layout, Rhythmus, Medien und CTA-Positionen führen den Blick ohne laute Funnel-Klischees.",
  },
  {
    title: "Trust-Elemente",
    text: "Belege, Beispiele, Referenzen, klare Kontaktwege oder relevante Fakten bauen Vertrauen auf.",
  },
  {
    title: "Schnelle Ladezeit",
    text: "Performance ist Teil der Conversion, besonders auf mobilen Geräten und bei Kampagnen-Traffic.",
  },
  {
    title: "Mobile Optimierung",
    text: "Die wichtigste Zielgruppe sieht die Seite häufig zuerst auf dem Smartphone.",
  },
  {
    title: "Analyse, wenn sinnvoll",
    text: "Tracking und Auswertung können helfen, die Seite nach dem Launch gezielt zu verbessern.",
  },
];

const PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Ziel klären",
    text: "Wir definieren, welches Angebot, welche Zielgruppe und welche Handlung im Mittelpunkt stehen.",
  },
  {
    title: "Struktur entwickeln",
    text: "Wir ordnen Einstieg, Argumente, Vertrauen, Medien und CTA zu einer klaren Seitenlogik.",
  },
  {
    title: "Text und Bildwelt schärfen",
    text: "Wir formulieren Inhalte so, dass sie verständlich, überzeugend und zur Zielgruppe passend sind.",
  },
  {
    title: "Design gestalten",
    text: "Das Design führt den Blick, stärkt den Eindruck und unterstützt die Entscheidung.",
  },
  {
    title: "Technisch umsetzen",
    text: "Die Landing Page wird responsive, performant und technisch sauber umgesetzt.",
  },
  {
    title: "Messen und verbessern",
    text: "Wenn sinnvoll, können Tracking, Analyse und Optimierung nach dem Launch ergänzt werden.",
  },
];

const AVOID_POINTS = [
  "Keine Landing Page ohne klares Ziel.",
  "Keine generische Werbeseite ohne Struktur.",
  "Keine überladene Seite mit zu vielen Ablenkungen.",
  "Keine CTA-Logik, die Nutzer im Unklaren lässt.",
  "Keine Keyword-Texte, die lokal wirken sollen, aber nicht überzeugen.",
  "Keine Gestaltung, die gut aussieht, aber nicht zur Anfrage führt.",
  "Keine leeren Conversion-Versprechen ohne saubere Grundlage.",
] as const;

const FAQ_ITEMS: ReadonlyArray<FaqItem> = [
  {
    question: "Was ist der Unterschied zwischen einer Landing Page und einer normalen Website?",
    answer:
      "Eine normale Website erklärt meist das gesamte Unternehmen. Eine Landing Page konzentriert sich auf ein klares Angebot, eine Zielgruppe und eine gewünschte Handlung wie Anfrage, Buchung, Kauf, Bewerbung oder Termin.",
  },
  {
    question: "Für welche Unternehmen in Kassel lohnt sich eine Landing Page?",
    answer:
      "Eine Landing Page lohnt sich für Unternehmen, die ein konkretes Angebot, eine Kampagne, eine lokale Aktion, eine Dienstleistung oder ein Produkt gezielter präsentieren möchten.",
  },
  {
    question: "Kann eine Landing Page auch ohne komplette Website funktionieren?",
    answer:
      "Ja, wenn Ziel, Angebot, Vertrauen, Kontaktweg und Technik sauber angelegt sind. In vielen Fällen ist sie aber stärker, wenn sie sinnvoll mit dem bestehenden Webauftritt verbunden wird.",
  },
  {
    question: "Kann eine Landing Page für Google Ads oder Meta Ads genutzt werden?",
    answer:
      "Ja. Für Anzeigenkampagnen ist eine fokussierte Zielseite oft sinnvoller als eine allgemeine Homepage, weil Botschaft, Zielgruppe und CTA genauer zusammenpassen.",
  },
  {
    question: "Unterstützt MAGICKS auch Texte, Bilder und Conversion-Struktur?",
    answer:
      "Ja. MAGICKS kann Struktur, UX, Texte, Bildwelt, Medien, CTA-Logik und technische Umsetzung zusammen entwickeln, damit die Seite nicht aus Einzelteilen besteht.",
  },
  {
    question: "Wird lokale SEO für Kassel mitgedacht?",
    answer:
      "Ja. Wenn die Landing Page regional gefunden werden soll, werden lokale Suchintention, Seitenstruktur, interne Verlinkung, Meta-Daten und verständliche Inhalte mitgedacht — ohne Keyword-Spam.",
  },
  {
    question: "Wie schnell kann eine Landing Page umgesetzt werden?",
    answer:
      "Je nach Umfang kann eine fokussierte Landing Page häufig innerhalb weniger Wochen umgesetzt werden. Content, Medien, Integrationen und Abstimmungen beeinflussen den Zeitplan.",
  },
  {
    question: "Können Formular, Tracking, CRM oder Terminbuchung integriert werden?",
    answer:
      "Ja, wenn es zum Ziel der Seite passt. Formulare, Tracking, CRM-Anbindung oder Terminbuchung können Teil der Umsetzung sein.",
  },
  {
    question: "Gibt es eine Garantie für Anfragen oder Rankings?",
    answer:
      "Nein. MAGICKS gibt keine Lead- oder Ranking-Garantien. Ziel ist eine saubere Grundlage aus Angebot, Nutzerführung, Technik, Sichtbarkeit und Vertrauen, die messbar verbessert werden kann.",
  },
];

const RELATED_LINKS: RelatedLink[] = [
  {
    to: "/websites-landingpages",
    eyebrow: "Website-Basis",
    folio: "Websites & Landingpages",
    lead: "Wenn die Landing Page Teil eines größeren Auftritts mit klarer Struktur, Design und Anfragewegen werden soll.",
    linkLabel: "Websites & Landingpages ansehen",
  },
  {
    to: "/webdesign-kassel",
    eyebrow: "Region",
    folio: "Webdesign Kassel",
    lead: "Wenn der gesamte Webauftritt in Kassel und Nordhessen professioneller, lokaler und vertrauenswürdiger wirken soll.",
    linkLabel: "Webdesign Kassel ansehen",
  },
  {
    to: "/seo-sichtbarkeit",
    eyebrow: "Sichtbarkeit",
    folio: "SEO & Sichtbarkeit",
    lead: "Wenn die Zielseite nicht nur konvertieren, sondern auch strukturiert auffindbar und verständlich aufgebaut werden soll.",
    linkLabel: "SEO & Sichtbarkeit ansehen",
  },
  {
    to: "/leistungen",
    eyebrow: "Studio",
    folio: "Leistungen",
    lead: "Wenn Sie den gesamten MAGICKS-Rahmen aus Websites, Shops, Web-Software und Automationen einordnen möchten.",
    linkLabel: "Leistungen ansehen",
  },
  {
    to: "/kontakt",
    eyebrow: "Direkt",
    folio: "Kontakt",
    lead: "Wenn ein konkretes Angebot oder eine Kampagne bereits im Raum steht und Sie die passende Landing Page besprechen möchten.",
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
    <div data-lp-reveal className="max-w-[62rem]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-ui mt-7 max-w-[22ch] text-[2.05rem] font-[620] leading-[1.02] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
        {title}
      </h2>
      {text ? (
        <p className="font-ui mt-7 max-w-[52rem] text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
          {text}
        </p>
      ) : null}
    </div>
  );
}

function InfoCard({ item, index }: { item: TextBlock; index?: number }) {
  return (
    <article
      data-lp-reveal
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

export default function LandingPagesKasselPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-lp-hero-item]");
      const reveals = gsap.utils.toArray<HTMLElement>("[data-lp-reveal]");
      const axisItems = gsap.utils.toArray<HTMLElement>("[data-lp-axis]");

      if (reduced) {
        gsap.set([...heroItems, ...reveals, ...axisItems], {
          opacity: 1,
          y: 0,
          filter: "none",
          scaleY: 1,
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
        duration: 0.68,
        heroStagger: 0.055,
        revealStart: "top 88%",
      });

      gsap.fromTo(
        axisItems,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.58,
          stagger: 0.055,
          ease: "power2.out",
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/landingpages-kassel" />

      <main
        ref={rootRef}
        className="relative overflow-hidden bg-[var(--magicks-bg-base)] pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.25rem]"
      >
        <section
          data-lp-hero
          className="relative overflow-hidden px-5 pb-24 pt-8 sm:px-8 sm:pb-32 sm:pt-10 md:px-12 md:pb-40 lg:px-16 lg:pb-48"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 58% 46% at 18% 18%, rgba(166,138,98,0.14), transparent 72%), radial-gradient(ellipse 52% 40% at 84% 34%, rgba(104,132,164,0.13), transparent 74%), radial-gradient(ellipse 74% 44% at 50% 94%, rgba(255,255,255,0.58), transparent 76%)",
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
              <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.62fr)] lg:items-end lg:gap-16">
                <div>
                  <div data-lp-hero-item>
                    <Eyebrow>Landing Pages Kassel · Campaign Sheet</Eyebrow>
                  </div>

                  <h1
                    data-lp-hero-item
                    className="font-ui mt-7 max-w-[18ch] text-[2.42rem] font-[650] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.35rem] md:text-[4.42rem] lg:text-[5.1rem]"
                  >
                    Landing Pages für Unternehmen in Kassel mit klarem Ziel.
                  </h1>

                  <p
                    data-lp-hero-item
                    className="font-ui mt-8 max-w-[52rem] text-[1.03rem] font-[480] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.1rem] md:text-[1.18rem]"
                  >
                    MAGICKS entwickelt Landing Pages für Unternehmen in Kassel
                    und Nordhessen, die konkrete Angebote, Kampagnen oder
                    Leistungen klar positionieren, Nutzer gezielt führen und
                    den nächsten Schritt leichter machen — von der ersten
                    Aufmerksamkeit bis zur Anfrage.
                  </p>

                  <div
                    data-lp-hero-item
                    className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12"
                  >
                    <PrimaryCta to="/kontakt" label="Landingpage-Projekt besprechen" />
                    <SecondaryCta
                      to="/websites-landingpages"
                      label="Mehr zu Websites & Landingpages"
                    />
                  </div>

                  <div
                    data-lp-hero-item
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

                <aside
                  data-lp-hero-item
                  className="rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.66)] p-5 shadow-[0_24px_68px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.76)] sm:p-6"
                  aria-label="Conversion-Fokus der Landing Page"
                >
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)]">
                    Intent → Fokus → Anfrage
                  </p>
                  <div className="mt-6 grid gap-4">
                    {[
                      ["Intent", "Aufmerksamkeit aus Suche, Ads oder Kampagne"],
                      ["Fokus", "ein Angebot, eine Zielgruppe, eine klare CTA"],
                      ["Anfrage", "Formular, Termin, Lead, Buchung oder Kontakt"],
                    ].map(([label, value], index) => (
                      <div
                        key={label}
                        data-lp-axis
                        className={`border-t pt-4 ${
                          index === 1
                            ? "border-[rgb(var(--magicks-accent-line-rgb)/0.28)]"
                            : "border-[rgb(var(--magicks-line-rgb)/0.11)]"
                        }`}
                      >
                        <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.42)]">
                          {label}
                        </p>
                        <p className="font-ui mt-2 text-[1.02rem] font-[620] leading-[1.28] tracking-[-0.014em] text-[rgb(var(--magicks-ink-rgb)/0.9)]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="font-ui mt-6 text-[14.2px] leading-[1.64] text-[rgb(var(--magicks-ink-rgb)/0.62)]">
                    Der Focal Axis bleibt als ruhige Kampagnenlogik erhalten:
                    Aufmerksamkeit bündeln, Angebot erklären, Entscheidung
                    erleichtern.
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
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
                <SectionIntro
                  eyebrow="Prinzip"
                  title="Eine Landing Page ist keine normale Unterseite."
                />
                <div data-lp-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Eine normale Website muss oft viele Themen gleichzeitig
                    erklären. Eine Landing Page konzentriert sich auf ein
                    klares Ziel: ein Angebot verständlich machen, Vertrauen
                    aufbauen und Besucher gezielt zur nächsten Handlung führen.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {PRINCIPLE_POINTS.map((item, index) => (
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
                eyebrow="Einsatzfälle"
                title="Wann eine Landing Page sinnvoll ist."
                text="Landing Pages sind besonders stark, wenn ein einzelnes Angebot mehr Fokus braucht als eine normale Website oder Homepage leisten kann."
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
                eyebrow="Was MAGICKS für Sie umsetzt"
                title="Eine fokussierte Zielseite mit Design, Text, Technik und Anfrageweg."
                text="Je nach Ziel wird die Landing Page für Kampagnen, lokale Suche oder beides aufgebaut. Wichtig ist, dass jedes Element die Entscheidung unterstützt."
              />

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {DELIVERABLES.map((item, index) => (
                  <InfoCard key={item.title} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
                <SectionIntro
                  eyebrow="Homepage oder Landing Page"
                  title="Warum Landing Pages oft besser funktionieren als eine klassische Homepage."
                />
                <div data-lp-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Eine Homepage ist ein Einstieg in das gesamte Unternehmen.
                    Eine Landing Page ist ein fokussierter Weg zu einem
                    bestimmten Ziel. Deshalb eignet sie sich besonders für
                    Kampagnen, Angebote, regionale Leistungen, Produkte,
                    Recruiting, Aktionen oder Lead-Generierung.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-5 md:grid-cols-2">
                {COMPARISON.map((column) => (
                  <article
                    key={column.label}
                    data-lp-reveal
                    className="rounded-[1.2rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.55)] p-5 shadow-[0_20px_58px_-48px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6"
                  >
                    <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.7)]">
                      {column.label}
                    </p>
                    <ul className="mt-5 grid gap-3">
                      {column.points.map((point) => (
                        <li
                          key={point}
                          className="font-ui rounded-[0.85rem] border border-[rgb(var(--magicks-line-rgb)/0.09)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.54)] px-4 py-3 text-[14.5px] font-[560] leading-[1.45] text-[rgb(var(--magicks-ink-rgb)/0.68)]"
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

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
                <SectionIntro
                  eyebrow="Landing Pages für Kassel und Nordhessen"
                  title="Lokal sichtbar, aber nicht lokal beliebig."
                />
                <div data-lp-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Für Unternehmen aus Kassel und Nordhessen kann eine Landing
                    Page besonders sinnvoll sein, wenn ein konkretes Angebot
                    regional gefunden und verstanden werden soll. Entscheidend
                    ist nicht, Ortsnamen möglichst oft zu wiederholen, sondern
                    Suchintention, Inhalt, Nutzerführung und Vertrauen sauber
                    zusammenzubringen.
                  </p>
                  <p className="font-ui mt-6 text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.66)] sm:text-[1.06rem]">
                    Begriffe wie Landing Pages Kassel, Landingpage Kassel,
                    Landing Page erstellen lassen Kassel, Kampagnen-Landingpage
                    Kassel oder Landing Pages Nordhessen werden nur dort
                    eingesetzt, wo sie zur echten Suchabsicht passen.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {LOCAL_POINTS.map((item, index) => (
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
                eyebrow="Anatomie"
                title="Was eine starke Landing Page braucht."
                text="Die beste Landing Page wirkt einfach. Dahinter stehen aber klare Entscheidungen zu Angebot, Reihenfolge, Beweisen, Medien, Technik und Messbarkeit."
              />

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {LANDING_PAGE_ELEMENTS.map((item, index) => (
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
                data-lp-reveal
                className="rounded-[1.65rem] border border-[rgb(var(--magicks-line-rgb)/0.11)] bg-[linear-gradient(160deg,rgba(255,255,255,0.78)_0%,rgba(246,242,233,0.64)_100%)] p-6 shadow-[0_24px_72px_-54px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.78)] sm:p-8 md:p-10"
              >
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
                  <div>
                    <Eyebrow>Einbettung in den digitalen Auftritt</Eyebrow>
                    <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.65rem] md:text-[3.25rem]">
                      Nicht jede Landing Page steht für sich allein.
                    </h2>
                  </div>
                  <div className="lg:pt-14">
                    <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                      Manche Landing Pages sind Teil einer größeren Website.
                      Manche hängen an Kampagnen. Manche führen in einen Shop,
                      einen Konfigurator, ein Formular, eine Buchung oder ein
                      größeres digitales System. Deshalb betrachtet MAGICKS
                      nicht nur die einzelne Seite, sondern auch ihre Rolle im
                      gesamten digitalen Auftritt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <SectionIntro
                eyebrow="Was wir bewusst vermeiden"
                title="Conversion braucht Fokus, nicht Druck."
              />

              <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AVOID_POINTS.map((line) => (
                  <li
                    key={line}
                    data-lp-reveal
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

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <SectionIntro
                eyebrow="Unser Ablauf"
                title="Vom Angebot zur fokussierten Landing Page."
              />

              <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {PROCESS_STEPS.map((step, index) => (
                  <li
                    key={step.title}
                    data-lp-reveal
                    className="rounded-[1.15rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[linear-gradient(160deg,rgba(255,255,255,0.82)_0%,rgba(246,242,233,0.68)_100%)] p-5 shadow-[0_20px_58px_-48px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)]"
                  >
                    <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)]">
                      Schritt {index + 1}
                    </p>
                    <h3 className="font-ui mt-4 text-[1.08rem] font-[620] leading-[1.28] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                      {step.title}
                    </h3>
                    <p className="font-ui mt-3 text-[14.2px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.67)]">
                      {step.text}
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
              <SectionIntro
                eyebrow="Häufige Fragen"
                title="Was Unternehmen vor einer Landingpage-Anfrage wissen möchten."
                text="Kurze Antworten zu Unterschied, Einsatz, Ads, lokaler SEO, Integrationen und realistischen Erwartungen."
              />

              <ol className="mt-12 border-t border-[rgb(var(--magicks-line-rgb)/0.12)]">
                {FAQ_ITEMS.map((item, index) => (
                  <li
                    key={item.question}
                    data-lp-reveal
                    className="border-b border-[rgb(var(--magicks-line-rgb)/0.12)]"
                  >
                    <details className="group/lpfaq">
                      <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-5 py-6 outline-none [&::-webkit-details-marker]:hidden md:gap-x-8 md:py-7">
                        <span className="font-mono pt-[0.32rem] text-[10.5px] font-medium leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.68)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-ui text-[1.08rem] font-[620] leading-[1.28] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)] md:text-[1.22rem]">
                          {item.question}
                        </h3>
                        <span
                          aria-hidden
                          className="font-instrument self-center text-[1.4rem] italic leading-none text-[rgb(var(--magicks-ink-rgb)/0.5)] transition-transform duration-500 group-open/lpfaq:rotate-45"
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

          <FaqJsonLd id="landingpages-kassel" items={FAQ_ITEMS} />
        </section>

        <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16 lg:py-32">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem] space-y-12 sm:space-y-14 md:space-y-16">
              {RELATED_LINKS.map((item) => (
                <div key={item.to} data-lp-reveal>
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
                "radial-gradient(ellipse 62% 46% at 24% 20%, rgba(166,138,98,0.13), transparent 74%), radial-gradient(ellipse 52% 40% at 80% 76%, rgba(104,132,164,0.1), transparent 76%)",
            }}
          />
          <div className="relative layout-max">
            <div
              data-lp-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow>Nächster Schritt</Eyebrow>
              <h2 className="font-ui mx-auto mt-7 max-w-[21ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.9rem]">
                Bereit für eine Landing Page, die klar auf Anfrage führt?
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[48rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Lassen Sie uns klären, welches Ziel Ihre Landing Page verfolgen
                soll und wie daraus eine klare, hochwertige und anfrage-starke
                Seite entstehen kann.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta to="/kontakt" label="Landingpage-Projekt besprechen" />
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
