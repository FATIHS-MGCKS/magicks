import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { runRouteReveal } from "../../lib/routeReveal";
import { RouteSEO } from "../../seo/RouteSEO";

type TextBlock = {
  title: string;
  text: string;
};

type ScopeGroup = {
  title: string;
  items: string[];
};

type PriceOption = {
  name: string;
  price: string;
  monthly: string;
  note: string;
};

type ProcessStep = {
  title: string;
  text: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

const TRUST_CHIPS = [
  "Mobil optimiert",
  "Domain & Hosting betreut",
  "Klar kalkulierbar",
  "Ohne Technikstress",
] as const;

const PROBLEM_POINTS = [
  "Welche Leistungen bieten Sie genau an?",
  "Was kostet es ungefähr oder wie läuft eine Anfrage ab?",
  "Wie kann man Sie schnell kontaktieren?",
  "Gibt es Bilder, Referenzen oder Beispiele?",
  "Welche Öffnungszeiten, Standorte oder Kontaktwege sind wichtig?",
  "Warum sollte man sich gerade für Ihren Betrieb entscheiden?",
] as const;

const STARTER_BENEFITS: TextBlock[] = [
  {
    title: "Klarer erster Eindruck",
    text: "Kunden sehen sofort, welche Leistungen Sie anbieten und wie Ihr Betrieb erreichbar ist.",
  },
  {
    title: "Mobile Kontaktwege",
    text: "Telefon, Kontaktformular und optional WhatsApp sind auf dem Smartphone schnell erreichbar.",
  },
  {
    title: "Vertrauen vor der Anfrage",
    text: "Bilder, Beispiele, Öffnungszeiten und klare Informationen machen Ihren Betrieb greifbarer.",
  },
  {
    title: "Lokale Grundlage",
    text: "Saubere Seitentitel, Leistungsstruktur und Google-Business-Verlinkung unterstützen lokale Sichtbarkeit.",
  },
];

const SCOPE_GROUPS: ScopeGroup[] = [
  {
    title: "Website & Inhalte",
    items: [
      "moderne Unternehmenswebsite mit 1 bis 5 Seiten",
      "Startseite, Leistungen, Über uns und Kontakt",
      "Impressum und Datenschutz als Seiten technisch vorbereitet",
      "klare Struktur für Leistungen, Bilder und Kontaktwege",
    ],
  },
  {
    title: "Kontakt & Vertrauen",
    items: [
      "Kontaktformular",
      "Telefon-Button",
      "optional WhatsApp-Button",
      "Google-Business-Verlinkung",
      "Bilder, Referenzen oder Beispiele, wenn vorhanden",
    ],
  },
  {
    title: "Technik & Betreuung",
    items: [
      "mobil optimiert für Smartphone und Tablet",
      "Domain-Einrichtung",
      "Hosting-Einrichtung",
      "SSL, Backups, Wartung und Sicherheitsupdates",
      "kleine Text- und Bildänderungen im laufenden Service",
      "1 bis 2 Korrekturrunden vor Livegang",
    ],
  },
  {
    title: "SEO-Grundlage",
    items: [
      "lokale SEO-Grundstruktur",
      "saubere Seitentitel und Beschreibungen",
      "verständliche Leistungsstruktur",
      "Grundlage für bessere lokale Auffindbarkeit",
    ],
  },
];

const PRICE_OPTIONS: PriceOption[] = [
  {
    name: "Starter",
    price: "699 € einmalig",
    monthly: "+ 59 € monatlich",
    note:
      "Für Betriebe, die mit einer kleineren einmaligen Einrichtung starten und danach niedrigere laufende Kosten bevorzugen.",
  },
  {
    name: "Ohne Startkosten",
    price: "0 € Einrichtung",
    monthly: "+ 99 € monatlich bei 24 Monaten Laufzeit",
    note: "Für Betriebe, die ohne initiale Einrichtungskosten online starten möchten.",
  },
];

const INDUSTRIES = [
  "Friseur / Barbershop",
  "Beauty / Kosmetik",
  "Handwerk",
  "Reinigung / Gebäudeservice",
  "Garten- und Landschaftsbau",
  "Autopflege / Detailing",
  "kleine Praxis / Therapie",
  "Ferienwohnung / Pension",
  "Nachhilfe / Kurse",
  "lokaler Dienstleister",
  "Gastronomie mit Informationsbedarf",
  "mobile Dienstleister",
] as const;

const EXAMPLE_CATEGORIES = [
  "Barbershop",
  "Kosmetikstudio",
  "Handwerker",
  "Praxis / Therapie",
  "Ferienwohnung",
  "Autopflege",
] as const;

const PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Kurzes Erstgespräch",
    text:
      "Wir klären Leistungen, Region, Zielkunden, Kontaktwege, vorhandene Bilder und was schnell online gehen soll.",
  },
  {
    title: "Entwurf & Freigabe",
    text:
      "MAGICKS erstellt eine starke erste Version. Danach folgen 1 bis 2 Korrekturrunden bis zum finalen Stand.",
  },
  {
    title: "Livegang & Betreuung",
    text:
      "Wir kümmern uns um Domain, SSL, Hosting, Formular-Test, mobile Prüfung und die technische Grundlage für eine saubere Online-Präsenz.",
  },
  {
    title: "Weiterentwicklung",
    text:
      "Wenn Ihr Betrieb wächst, können später Landingpages, Buchung, zusätzliche Inhalte oder Automationen ergänzt werden.",
  },
];

const COMPARISON: TextBlock[] = [
  {
    title: "Baukasten",
    text:
      "Kann funktionieren, aber Struktur, Texte, Design, Technik, Updates und Qualität bleiben bei Ihnen.",
  },
  {
    title: "Klassische Agentur",
    text:
      "Oft hochwertig, für kleine Betriebe aber häufig mit einer zu hohen Einstiegshürde verbunden.",
  },
  {
    title: "Website Starter",
    text:
      "Professionell vorbereitet, klar begrenzter Umfang, monatlich betreut und mit lokaler Sichtbarkeit mitgedacht.",
  },
];

const EXCLUDED_POINTS = [
  "keine große individuelle Markenstrategie",
  "kein großer Onlineshop",
  "keine komplexe Web-Software",
  "keine umfangreichen Fotoshootings, sofern nicht separat vereinbart",
  "keine rechtliche Prüfung von Impressum oder Datenschutz",
  "keine garantierten Google-Rankings",
  "keine unbegrenzten Korrekturrunden",
  "keine Spezialfunktionen ohne gesonderte Abstimmung",
] as const;

const FAQS: FaqItem[] = [
  {
    question: "Wie schnell kann meine Website online sein?",
    answer:
      "Sobald die wichtigsten Inhalte, Kontaktwege und Bilder vorliegen, kann eine erste Version zügig aufgebaut werden. Der genaue Zeitplan hängt vom Umfang und von der Rückmeldung im Freigabeprozess ab.",
  },
  {
    question: "Muss ich mich um Domain und Hosting kümmern?",
    answer:
      "Nein. MAGICKS übernimmt die technische Einrichtung von Domain, Hosting, SSL und grundlegender Wartung im Rahmen des vereinbarten Service.",
  },
  {
    question: "Gehört mir die Domain?",
    answer:
      "Die Domain wird Ihrem Unternehmen zugeordnet. Die genaue Einrichtung und Verwaltung klären wir transparent vor dem Start.",
  },
  {
    question: "Was ist im monatlichen Betrag enthalten?",
    answer:
      "Der monatliche Betrag deckt je nach gewählter Option Hosting, Wartung, Sicherheitsupdates, Backups und kleinere Text- oder Bildänderungen im definierten Rahmen ab.",
  },
  {
    question: "Kann ich später erweitern?",
    answer:
      "Ja. Zusätzliche Seiten, Landingpages, Buchungsfunktionen, weitere Inhalte oder Automationen können später separat besprochen und ergänzt werden.",
  },
  {
    question: "Sind Impressum und Datenschutz dabei?",
    answer:
      "Die Seiten können technisch vorbereitet und eingebunden werden. Die rechtliche Prüfung der Inhalte erfolgt durch Sie oder eine entsprechend qualifizierte Stelle.",
  },
  {
    question: "Ist das Angebot auch geeignet, wenn ich schon Google Business habe?",
    answer:
      "Ja. Ein Google-Unternehmensprofil ist ein guter Anfang. Die Website ergänzt es als zentrale Seite für Leistungen, Bilder, Kontaktwege und weiterführende Informationen.",
  },
  {
    question: "Kann ich eigene Bilder verwenden?",
    answer:
      "Ja. Vorhandene Bilder, Referenzen oder Beispielarbeiten können eingebunden werden, sofern Qualität, Format und Nutzungsrechte passen.",
  },
  {
    question: "Gibt es eine Garantie für Google-Rankings?",
    answer:
      "Nein. Der Website Starter schafft eine saubere lokale SEO-Grundstruktur, aber keine Garantie für bestimmte Platzierungen in Suchmaschinen.",
  },
  {
    question: "Was passiert, wenn ich später mehr Seiten oder Funktionen brauche?",
    answer:
      "Dann kann der Auftritt erweitert werden. Größere Funktionen, zusätzliche Inhalte oder Spezialanforderungen werden separat eingeordnet und angeboten.",
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

function SecondaryAnchor({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-11 items-center rounded-full border border-[rgb(var(--magicks-line-rgb)/0.2)] bg-transparent px-6 py-2.5 font-ui text-[15px] font-[560] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.82)] no-underline transition-[border-color,transform,color,background-color] duration-500 hover:-translate-y-[1px] hover:border-[rgb(var(--magicks-line-rgb)/0.42)] hover:bg-[rgb(var(--magicks-bg-lifted-rgb)/0.66)] hover:text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[15.5px]"
    >
      {label}
    </a>
  );
}

export default function WebsiteStarterPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-ws-hero-item]");
      const reveals = gsap.utils.toArray<HTMLElement>("[data-ws-reveal]");

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
        heroYOffset: 18,
        revealYOffset: 18,
        blur: 4,
        duration: 0.72,
        heroStagger: 0.06,
        revealStart: "top 88%",
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/website-starter" />

      <main
        ref={rootRef}
        className="relative overflow-hidden bg-[var(--magicks-bg-base)] pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.25rem]"
      >
        <section className="relative overflow-hidden px-5 pb-20 pt-8 sm:px-8 sm:pb-26 sm:pt-10 md:px-12 md:pb-32 lg:px-16 lg:pb-36">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 58% 46% at 18% 18%, rgba(166,138,98,0.15), transparent 72%), radial-gradient(ellipse 52% 40% at 82% 36%, rgba(104,132,164,0.11), transparent 74%), radial-gradient(ellipse 74% 44% at 50% 94%, rgba(255,255,255,0.58), transparent 76%)",
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
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.62fr)] lg:items-end lg:gap-16">
                <div>
                  <div data-ws-hero-item>
                    <Eyebrow>Website Starter für lokale Betriebe</Eyebrow>
                  </div>

                  <h1
                    data-ws-hero-item
                    className="font-ui mt-7 max-w-[18ch] text-[2.42rem] font-[650] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.2rem] md:text-[4.15rem] lg:text-[4.75rem]"
                  >
                    Die erste professionelle Website für lokale Betriebe.
                  </h1>

                  <p
                    data-ws-hero-item
                    className="font-ui mt-7 max-w-[50rem] text-[1.02rem] font-[480] leading-[1.7] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.08rem] md:text-[1.16rem]"
                  >
                    Für lokale Betriebe, die bisher vor allem über Google,
                    Empfehlungen, Social Media oder Verzeichnisse gefunden
                    werden. MAGICKS erstellt eine professionelle Starter-Website,
                    die Leistungen klar zeigt, Vertrauen aufbaut und Kunden den
                    nächsten Schritt erleichtert — mobil optimiert, technisch
                    betreut und klar kalkulierbar.
                  </p>

                  <div
                    data-ws-hero-item
                    className="mt-9 flex flex-wrap items-center gap-4 sm:mt-10"
                  >
                    <PrimaryCta
                      to="/kontakt"
                      label="Kostenlose Ersteinschätzung anfragen"
                    />
                    <SecondaryAnchor href="#starter-beispiele" label="Beispiel ansehen" />
                  </div>

                  <div
                    data-ws-hero-item
                    className="mt-8 flex max-w-[52rem] flex-wrap gap-2.5"
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
                  data-ws-hero-item
                  className="rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.66)] p-5 shadow-[0_24px_68px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.76)] sm:p-6"
                >
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)]">
                    Angebot
                  </p>
                  <div className="mt-5 space-y-4">
                    <div>
                      <p className="font-ui text-[14px] font-[560] leading-[1.45] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                        Starter
                      </p>
                      <p className="font-ui mt-1 text-[1.58rem] font-[650] leading-[1.05] tracking-[-0.025em] text-[rgb(var(--magicks-ink-rgb)/0.94)]">
                        699 € einmalig
                      </p>
                      <p className="font-ui mt-1 text-[1.08rem] font-[620] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.72)]">
                        + 59 € monatlich
                      </p>
                    </div>
                    <div className="h-px bg-[rgb(var(--magicks-line-rgb)/0.12)]" />
                    <div>
                      <p className="font-ui text-[14px] font-[560] leading-[1.45] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                        Ohne Startkosten
                      </p>
                      <p className="font-ui mt-1 text-[1.58rem] font-[650] leading-[1.05] tracking-[-0.025em] text-[rgb(var(--magicks-ink-rgb)/0.94)]">
                        0 € Einrichtung
                      </p>
                      <p className="font-ui mt-1 text-[1.08rem] font-[620] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.72)]">
                        + 99 € monatlich bei 24 Monaten Laufzeit
                      </p>
                    </div>
                  </div>
                  <p className="font-ui mt-6 text-[13.8px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.62)]">
                    Für kleine Unternehmen, lokale Dienstleister und Betriebe,
                    die professionell starten möchten, ohne unnötige Komplexität.
                  </p>
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
                <div data-ws-reveal>
                  <Eyebrow>Warum ein Google-Eintrag oft nicht reicht</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.6rem] md:text-[3.2rem]">
                    Ein Google-Eintrag ist gut. Eine eigene Website macht den
                    Eindruck vollständiger.
                  </h2>
                </div>

                <div data-ws-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.06rem]">
                    Viele lokale Betriebe werden bereits über Google,
                    Empfehlungen, Facebook, Instagram oder Verzeichnisse
                    gefunden. Das ist ein guter Anfang. Aber oft fehlt eine
                    zentrale Seite, auf der Kunden sofort sehen, was Sie
                    anbieten, wie sie Sie erreichen, welche Bilder oder
                    Referenzen es gibt und warum sie Ihrem Betrieb vertrauen
                    können.
                  </p>
                </div>
              </div>

              <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PROBLEM_POINTS.map((point) => (
                  <li
                    key={point}
                    data-ws-reveal
                    className="font-ui rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.54)] p-4 text-[14.5px] leading-[1.6] text-[rgb(var(--magicks-ink-rgb)/0.68)] shadow-[inset_0_1px_0_rgba(255,255,255,0.68)]"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-ws-reveal className="max-w-[58rem]">
                <Eyebrow>Was der Website Starter löst</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[18ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.6rem] md:text-[3.2rem]">
                  Eine einfache Website. Aber professionell gemacht.
                </h2>
                <p className="font-ui mt-7 max-w-[50rem] text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.06rem]">
                  Der Website Starter ist für Betriebe gedacht, die keine große
                  Website brauchen, aber online professioneller wirken möchten.
                  Eine klare Startseite, verständliche Leistungen, schnelle
                  Kontaktwege, mobile Optimierung und eine saubere technische
                  Grundlage reichen oft aus, um deutlich vertrauenswürdiger
                  aufzutreten.
                </p>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {STARTER_BENEFITS.map((benefit) => (
                  <article
                    key={benefit.title}
                    data-ws-reveal
                    className="rounded-[1.05rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] p-5 shadow-[0_18px_52px_-44px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)]"
                  >
                    <h3 className="font-ui text-[1.02rem] font-[620] leading-[1.26] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                      {benefit.title}
                    </h3>
                    <p className="font-ui mt-3 text-[14.2px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                      {benefit.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-ws-reveal className="max-w-[58rem]">
                <Eyebrow>Was enthalten ist</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[18ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.6rem] md:text-[3.2rem]">
                  Was Sie bekommen.
                </h2>
              </div>

              <div className="mt-10 grid gap-5 lg:grid-cols-2">
                {SCOPE_GROUPS.map((group, index) => (
                  <article
                    key={group.title}
                    data-ws-reveal
                    className="rounded-[1.2rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] p-5 shadow-[0_20px_58px_-48px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6"
                  >
                    <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.68)]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-ui mt-3 text-[1.2rem] font-[620] leading-[1.22] tracking-[-0.014em] text-[rgb(var(--magicks-ink-rgb)/0.93)]">
                      {group.title}
                    </h3>
                    <ul className="mt-5 grid gap-3">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="font-ui text-[14.3px] leading-[1.58] text-[rgb(var(--magicks-ink-rgb)/0.67)]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <p
                data-ws-reveal
                className="font-ui mt-8 max-w-[56rem] rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[rgb(var(--magicks-bg-base-rgb)/0.58)] p-5 text-[14.2px] leading-[1.66] text-[rgb(var(--magicks-ink-rgb)/0.66)]"
              >
                Die rechtliche Prüfung der Inhalte für Impressum und Datenschutz
                erfolgt durch den Kunden oder eine entsprechend qualifizierte
                Stelle.
              </p>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-ws-reveal className="max-w-[58rem]">
                <Eyebrow>Preise</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[22ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.6rem] md:text-[3.2rem]">
                  Zwei einfache Wege zum professionellen Start.
                </h2>
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {PRICE_OPTIONS.map((option) => (
                  <article
                    key={option.name}
                    data-ws-reveal
                    className="rounded-[1.3rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(160deg,rgba(255,255,255,0.84)_0%,rgba(246,242,233,0.7)_100%)] p-6 shadow-[0_24px_72px_-54px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.78)] sm:p-7"
                  >
                    <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.22em] text-[rgb(var(--magicks-accent-ink-rgb)/0.7)]">
                      {option.name}
                    </p>
                    <p className="font-ui mt-5 text-[2rem] font-[650] leading-[1] tracking-[-0.03em] text-[rgb(var(--magicks-ink-rgb)/0.94)] sm:text-[2.25rem]">
                      {option.price}
                    </p>
                    <p className="font-ui mt-2 text-[1.22rem] font-[620] leading-[1.18] tracking-[-0.016em] text-[rgb(var(--magicks-ink-rgb)/0.74)] sm:text-[1.35rem]">
                      {option.monthly}
                    </p>
                    <p className="font-ui mt-6 text-[14.5px] leading-[1.64] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                      {option.note}
                    </p>
                  </article>
                ))}
              </div>

              <div
                data-ws-reveal
                className="mt-8 grid gap-4 rounded-[1.15rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.58)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:p-6"
              >
                <p className="font-ui text-[14.5px] leading-[1.66] text-[rgb(var(--magicks-ink-rgb)/0.68)]">
                  In beiden Fällen kümmern wir uns um technische Einrichtung,
                  Domain, Hosting, mobile Optimierung, Kontaktformular und die
                  Grundstruktur für lokale Sichtbarkeit.
                </p>
                <p className="font-ui text-[13.8px] leading-[1.64] text-[rgb(var(--magicks-ink-rgb)/0.58)]">
                  Umfang und Betreuung werden im Erstgespräch bestätigt.
                  Zusätzliche Funktionen können separat besprochen werden. Alle
                  Angaben vorbehaltlich individueller Prüfung des Projektumfangs.
                </p>
              </div>

              <p
                data-ws-reveal
                className="font-ui mt-5 max-w-[58rem] text-[13.8px] leading-[1.66] text-[rgb(var(--magicks-ink-rgb)/0.58)]"
              >
                Das Angebot ist als regionales Digitalisierungsangebot mit
                reduziertem Einstieg gedacht — nicht als Baukasten- oder
                Discount-Website.
              </p>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-ws-reveal className="max-w-[58rem]">
                <Eyebrow>Für welche Betriebe das passt</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[22ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.6rem] md:text-[3.2rem]">
                  Für lokale Betriebe, die professioneller online auftreten
                  möchten.
                </h2>
                <p className="font-ui mt-7 max-w-[50rem] text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.06rem]">
                  Die Beispiele zeigen typische Fälle. Entscheidend ist, ob Ihre
                  Kunden vor der Anfrage kurz prüfen möchten, ob Ihr Betrieb
                  seriös, erreichbar und passend ist.
                </p>
              </div>

              <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {INDUSTRIES.map((industry) => (
                  <li
                    key={industry}
                    data-ws-reveal
                    className="font-ui rounded-[0.95rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.54)] px-4 py-3 text-[14.2px] font-[560] leading-[1.45] text-[rgb(var(--magicks-ink-rgb)/0.68)]"
                  >
                    {industry}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="starter-beispiele"
          className="relative bg-[var(--magicks-bg-base)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16"
        >
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
                <div data-ws-reveal>
                  <Eyebrow>Beispielstruktur</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.6rem] md:text-[3.2rem]">
                    Ein Beispiel macht das Angebot greifbarer.
                  </h2>
                </div>

                <div data-ws-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.06rem]">
                    Viele Betriebe können sich eine Website erst vorstellen,
                    wenn sie sehen, wie die eigene Branche dargestellt werden
                    könnte. Deshalb kann MAGICKS passende Beispielstrukturen
                    vorbereiten, die anschließend mit Ihren Leistungen, Bildern,
                    Öffnungszeiten und Kontaktwegen angepasst werden.
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,0.62fr)]">
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {EXAMPLE_CATEGORIES.map((category) => (
                    <li
                      key={category}
                      data-ws-reveal
                      className="font-ui rounded-[0.95rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] px-4 py-3 text-[14.2px] font-[560] leading-[1.45] text-[rgb(var(--magicks-ink-rgb)/0.68)]"
                    >
                      {category}
                    </li>
                  ))}
                </ul>

                <div data-ws-reveal className="flex items-start md:justify-end">
                  <PrimaryCta to="/kontakt" label="Passende Beispielstruktur ansehen" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-ws-reveal className="max-w-[58rem]">
                <Eyebrow>So einfach läuft es ab</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[22ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.6rem] md:text-[3.2rem]">
                  Kein Lastenheft. Kein Technikstress. Ein klarer Ablauf.
                </h2>
              </div>

              <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {PROCESS_STEPS.map((step, index) => (
                  <li
                    key={step.title}
                    data-ws-reveal
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

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
                <div data-ws-reveal>
                  <Eyebrow>Baukasten, Agentur oder Starter?</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.6rem] md:text-[3.2rem]">
                    Baukästen wirken einfach. Die Verantwortung bleibt trotzdem
                    bei Ihnen.
                  </h2>
                </div>

                <div data-ws-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.06rem]">
                    Natürlich kann man eine Website selbst mit einem Baukasten
                    erstellen. Für viele kleine Betriebe scheitert es aber nicht
                    am Tool, sondern an Zeit, Struktur, Texten, Bildern, Technik,
                    mobiler Qualität und der Frage, was auf der Seite überhaupt
                    stehen soll. Der Website Starter nimmt Ihnen diese Arbeit ab
                    und schafft eine fertige, professionelle Grundlage.
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-4 lg:grid-cols-3">
                {COMPARISON.map((item) => (
                  <article
                    key={item.title}
                    data-ws-reveal
                    className="rounded-[1.15rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.54)] p-5 shadow-[0_18px_52px_-44px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)] sm:p-6"
                  >
                    <h3 className="font-ui text-[1.16rem] font-[620] leading-[1.22] tracking-[-0.014em] text-[rgb(var(--magicks-ink-rgb)/0.93)]">
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

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-ws-reveal className="max-w-[58rem]">
                <Eyebrow>Bewusst klar begrenzt</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[20ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.6rem] md:text-[3.2rem]">
                  Ein fairer Einstieg braucht einen klaren Rahmen.
                </h2>
                <p className="font-ui mt-7 max-w-[50rem] text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.06rem]">
                  Der Website Starter ist für einen professionellen Einstieg
                  gedacht. Damit der Preis fair und der Ablauf einfach bleibt,
                  ist der Umfang bewusst klar begrenzt.
                </p>
              </div>

              <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {EXCLUDED_POINTS.map((point) => (
                  <li
                    key={point}
                    data-ws-reveal
                    className="font-ui rounded-[0.95rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.54)] px-4 py-3 text-[14.2px] leading-[1.5] text-[rgb(var(--magicks-ink-rgb)/0.66)]"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-ws-reveal className="max-w-[58rem]">
                <Eyebrow>FAQ</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[16ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.6rem] md:text-[3.2rem]">
                  Häufige Fragen.
                </h2>
              </div>

              <ol className="mt-10 divide-y divide-[rgb(var(--magicks-line-rgb)/0.14)] border-y border-[rgb(var(--magicks-line-rgb)/0.14)]">
                {FAQS.map((faq, index) => (
                  <li key={faq.question} data-ws-reveal className="py-1">
                    <details className="group">
                      <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-4 py-5 outline-none [&::-webkit-details-marker]:hidden sm:gap-6 sm:py-6">
                        <span className="font-mono pt-[0.18rem] text-[10px] font-medium uppercase tracking-[0.22em] text-[rgb(var(--magicks-ink-rgb)/0.42)] sm:text-[10.5px]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-ui text-[15px] font-[620] leading-[1.5] text-[rgb(var(--magicks-ink-rgb)/0.9)] sm:text-[16px]">
                          {faq.question}
                        </h3>
                        <span
                          aria-hidden
                          className="font-instrument text-[1.25rem] leading-none text-[rgb(var(--magicks-ink-rgb)/0.48)] transition-transform duration-500 group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 pb-5 sm:gap-6 sm:pb-6">
                        <span aria-hidden />
                        <p className="font-ui max-w-[54rem] text-[14.5px] leading-[1.68] text-[rgb(var(--magicks-ink-rgb)/0.66)] sm:text-[15px]">
                          {faq.answer}
                        </p>
                      </div>
                    </details>
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
              data-ws-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow>Nächster Schritt</Eyebrow>
              <h2 className="font-ui mx-auto mt-7 max-w-[20ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.7rem]">
                Bereit für den ersten professionellen Webauftritt?
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[46rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Lassen Sie uns kurz prüfen, ob der Website Starter zu Ihrem
                Betrieb passt und welche Inhalte für einen professionellen Start
                nötig sind.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta
                  to="/kontakt"
                  label="Kostenlose Ersteinschätzung anfragen"
                />
                <SecondaryAnchor href="#starter-beispiele" label="Beispiel ansehen" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
