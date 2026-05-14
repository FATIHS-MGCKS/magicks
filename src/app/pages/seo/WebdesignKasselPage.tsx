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
  "Persönliche Abstimmung",
  "Individuelles Design",
  "Saubere technische Umsetzung",
] as const;

const VALUE_POINTS: TextBlock[] = [
  {
    title: "Leistungen klar erklären",
    text: "Besucher sollen schnell verstehen, was Ihr Unternehmen anbietet, für wen es passt und warum der nächste Schritt sinnvoll ist.",
  },
  {
    title: "Vertrauen aufbauen",
    text: "Gestaltung, Inhalte, Bildwelt und technische Qualität müssen denselben Anspruch zeigen wie Ihre Arbeit.",
  },
  {
    title: "Lokal gefunden werden",
    text: "Kassel, Nordhessen und relevante Suchintentionen werden sauber eingebunden, ohne den Text künstlich aufzublähen.",
  },
  {
    title: "Mobil funktionieren",
    text: "Die Seite muss auf Smartphone, Tablet und Desktop lesbar, schnell und einfach bedienbar bleiben.",
  },
  {
    title: "Kontakt erleichtern",
    text: "Anfragewege, CTAs und Kontaktinformationen werden so platziert, dass aus Interesse eine konkrete Anfrage werden kann.",
  },
  {
    title: "Technisch sauber bleiben",
    text: "Performance, Struktur, SEO-Grundlagen, Weiterleitungen und Pflegefähigkeit werden von Anfang an mitgedacht.",
  },
];

const COMMISSION_ITEMS: TextBlock[] = [
  {
    title: "Unternehmenswebsites",
    text: "Für Dienstleister, Mittelstand, Handwerk und lokale Marken, die professioneller auftreten und Leistungen verständlicher erklären möchten.",
  },
  {
    title: "Moderne Homepages",
    text: "Startseiten, die nicht nur gut aussehen, sondern Orientierung geben, Vertrauen schaffen und Kontaktwege sichtbar machen.",
  },
  {
    title: "Relaunch bestehender Webseiten",
    text: "Wenn Struktur, Inhalt, Design oder Technik nicht mehr zum Anspruch des Unternehmens passen.",
  },
  {
    title: "Landing Pages für Kampagnen",
    text: "Für einzelne Angebote, lokale Aktionen, Recruiting, Google Ads oder konkrete Leistungen in Kassel und Nordhessen.",
  },
  {
    title: "Lokale SEO-Seiten",
    text: "Seiten für regionale Suchintentionen wie Webdesign Kassel, Website erstellen lassen Kassel oder Landingpage Kassel — natürlich formuliert und nutzerorientiert.",
  },
  {
    title: "Content & Bildwelt",
    text: "Texte, Medien, Bildauswahl und visuelle Richtung, damit der Internetauftritt nicht nach Platzhalter oder Baukasten wirkt.",
  },
  {
    title: "Technische SEO-Basis",
    text: "Saubere Seitenstruktur, Meta-Daten, Performance, Indexierbarkeit, strukturierte Daten und interne Verlinkung.",
  },
  {
    title: "Hosting, Pflege und Betreuung",
    text: "Auf Wunsch mit laufender Pflege, redaktionellen Erweiterungen, Hosting-Betreuung und planbaren Modellen wie Website im Abo.",
  },
];

const AUDIENCE_ITEMS: TextBlock[] = [
  {
    title: "Lokale Dienstleister",
    text: "Für Unternehmen, die über Google, Empfehlungen und persönliche Recherche geprüft werden, bevor eine Anfrage entsteht.",
  },
  {
    title: "Handwerksbetriebe",
    text: "Für Betriebe, deren Qualität online sichtbar werden soll — mit klaren Leistungen, Bildern, Referenzen und schnellen Kontaktwegen.",
  },
  {
    title: "Mittelstand in Nordhessen",
    text: "Für Unternehmen, deren Website nicht mehr zur Größe, Qualität oder Vertriebsrealität passt.",
  },
  {
    title: "Praxen und Beratungen",
    text: "Für Angebote, bei denen Seriosität, Orientierung und Vertrauen wichtiger sind als laute Effekte.",
  },
  {
    title: "Erklärungsbedürftige Leistungen",
    text: "Für Anbieter, die komplexe Leistungen verständlich machen müssen, damit Interessenten schneller entscheiden können.",
  },
  {
    title: "Unternehmen mit regionalem Schwerpunkt",
    text: "Für Marken, die in Kassel, Baunatal, Vellmar, Fuldabrück, Lohfelden, Niestetal oder Nordhessen klarer sichtbar werden möchten.",
  },
];

const LOCAL_SEO_POINTS: TextBlock[] = [
  {
    title: "Suchintention statt Ortsnamen-Stapel",
    text: "Eine lokale Seite muss beantworten, was Menschen wirklich suchen: Kosten, Ablauf, Qualität, Nähe, Vertrauen und Kontakt.",
  },
  {
    title: "Struktur statt Textwüste",
    text: "Leistungsseiten, FAQ, interne Links und klare Abschnitte helfen mehr als wiederholte Keyword-Ketten.",
  },
  {
    title: "Regionale Relevanz mit Substanz",
    text: "Kassel und Nordhessen werden dort genannt, wo der Standort, die Abstimmung oder die lokale Nachfrage wirklich eine Rolle spielen.",
  },
  {
    title: "Sichtbarkeit nach dem Klick",
    text: "Gefunden werden reicht nicht. Die Seite muss danach Vertrauen aufbauen, Orientierung geben und Anfragen erleichtern.",
  },
];

const PROCESS_STEPS: ProcessStep[] = [
  {
    title: "Verstehen",
    text: "Wir klären Ziel, Zielgruppe, Leistungen, Region, Wettbewerb, vorhandene Inhalte und den gewünschten nächsten Schritt.",
  },
  {
    title: "Strukturieren",
    text: "Wir ordnen Seiten, Nutzerführung, Inhalte, lokale Suchintention und Kontaktwege zu einem verständlichen Aufbau.",
  },
  {
    title: "Gestalten",
    text: "Das Design übersetzt Ihren Anspruch in einen hochwertigen, klaren digitalen Auftritt mit eigener Bild- und Tonalitätslogik.",
  },
  {
    title: "Umsetzen",
    text: "Die Website wird responsiv, performant, technisch sauber und SEO-bewusst umgesetzt.",
  },
  {
    title: "Betreuen",
    text: "Nach dem Launch können Pflege, Hosting, Erweiterungen und Optimierung begleitet werden, wenn es zum Projekt passt.",
  },
];

const AVOID_POINTS = [
  "Keine Baukastenoptik.",
  "Keine generischen Templates.",
  "Keine Keyword-Textwüsten.",
  "Keine Website, die nur lokal ranken soll, aber nicht überzeugt.",
  "Keine Gestaltung ohne klare Nutzerführung.",
  "Keine Technik, die nach dem Launch schwer zu pflegen ist.",
  "Keine leeren Versprechen zu Google-Rankings.",
] as const;

const FAQ_ITEMS: ReadonlyArray<FaqItem> = [
  {
    question: "Macht MAGICKS Webdesign in Kassel auch vor Ort?",
    answer:
      "Ja. MAGICKS sitzt in Kassel. Erstgespräche, Abstimmungen oder Workshops können auf Wunsch vor Ort stattfinden, wenn es zum Projekt passt. Viele Projekte laufen trotzdem hybrid oder remote, damit der Ablauf schlank bleibt.",
  },
  {
    question: "Was kostet eine professionelle Website in Kassel?",
    answer:
      "Der Investitionsrahmen hängt vom Umfang ab: einfache Homepage, Unternehmenswebsite, Relaunch, Landing Page oder größerer Internetauftritt. Nach einem Erstgespräch erhalten Sie eine klare Einschätzung, damit Sie planbar entscheiden können.",
  },
  {
    question: "Wie lange dauert eine Website von der Idee bis zum Launch?",
    answer:
      "Fokussierte Websites oder Landing Pages gehen je nach Umfang häufig innerhalb von 4 bis 8 Wochen live. Größere Auftritte mit mehreren Seitentypen, Content-Produktion oder Integrationen brauchen entsprechend mehr Zeit.",
  },
  {
    question: "Sind SEO, Hosting und Pflege Teil des Projekts?",
    answer:
      "SEO-Grundlagen, saubere Struktur, Performance und technische Umsetzung werden von Beginn an mitgedacht. Hosting, Pflege, redaktionelle Erweiterungen und laufende Betreuung können nach Bedarf ergänzt werden.",
  },
  {
    question: "Arbeitet MAGICKS nur in Kassel oder auch bundesweit?",
    answer:
      "MAGICKS hat seinen Sitz in Kassel und arbeitet für Unternehmen aus Nordhessen ebenso wie für Kunden im gesamten DACH-Raum. Der regionale Vorteil liegt in kurzen Wegen, wenn persönliche Abstimmung sinnvoll ist.",
  },
  {
    question: "Ist Website im Abo für Unternehmen aus Kassel möglich?",
    answer:
      "Ja. Wenn eine hohe Einmalinvestition nicht sinnvoll ist, kann ein monatliches Modell geprüft werden. Entscheidend ist, ob Umfang, Betreuung und Laufzeit zum Unternehmen passen.",
  },
  {
    question: "Gibt es auch kleinere Starter-Websites für lokale Betriebe?",
    answer:
      "Ja. Für kleinere lokale Betriebe kann der Website Starter passen: eine klare, mobil optimierte Website mit betreuter technischer Grundlage, Kontaktwegen und lokaler SEO-Grundstruktur.",
  },
];

const RELATED_LINKS: RelatedLink[] = [
  {
    to: "/websites-landingpages",
    eyebrow: "Website-Basis",
    folio: "Websites & Landingpages",
    lead: "Wenn aus Webdesign ein vollständiger Auftritt mit Struktur, Gestaltung, Technik und klaren Anfragewegen werden soll.",
    linkLabel: "Websites & Landingpages ansehen",
  },
  {
    to: "/landingpages-kassel",
    eyebrow: "Kampagnen",
    folio: "Landing Pages Kassel",
    lead: "Für lokale Kampagnen, einzelne Angebote oder konkrete Leistungen, die in Kassel sichtbar und anfrageorientiert präsentiert werden sollen.",
    linkLabel: "Landing Pages Kassel ansehen",
  },
  {
    to: "/seo-sichtbarkeit",
    eyebrow: "Sichtbarkeit",
    folio: "SEO & Sichtbarkeit",
    lead: "Wenn Ihr Webauftritt nicht nur gut aussieht, sondern auch strukturiert, auffindbar und verständlich aufgebaut werden soll.",
    linkLabel: "SEO & Sichtbarkeit ansehen",
  },
  {
    to: "/content-bildwelt-medien",
    eyebrow: "Inhalt",
    folio: "Content, Bildwelt & Medien",
    lead: "Wenn Texte, Bildwelt und Medien direkt im Kontext des neuen Auftritts entwickelt werden sollen.",
    linkLabel: "Content, Bildwelt & Medien ansehen",
  },
  {
    to: "/website-im-abo",
    eyebrow: "Modell",
    folio: "Website im Abo",
    lead: "Für Unternehmen, die einen professionellen Webauftritt planbar monatlich strukturieren möchten.",
    linkLabel: "Website im Abo ansehen",
  },
  {
    to: "/website-starter",
    eyebrow: "Einstieg",
    folio: "Website Starter",
    lead: "Für kleinere lokale Betriebe, die erstmals professionell online auftreten möchten, ohne unnötige Komplexität.",
    linkLabel: "Website Starter ansehen",
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
    <div data-wk-reveal className="max-w-[62rem]">
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
      data-wk-reveal
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

export default function WebdesignKasselPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-wk-hero-item]");
      const reveals = gsap.utils.toArray<HTMLElement>("[data-wk-reveal]");
      const coordinateItems = gsap.utils.toArray<HTMLElement>("[data-wk-coordinate]");

      if (reduced) {
        gsap.set([...heroItems, ...reveals, ...coordinateItems], {
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
        heroYOffset: 18,
        revealYOffset: 18,
        blur: 4,
        duration: 0.72,
        heroStagger: 0.06,
        revealStart: "top 88%",
      });

      gsap.fromTo(
        coordinateItems,
        { opacity: 0, y: 10 },
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
      <RouteSEO path="/webdesign-kassel" />

      <main
        ref={rootRef}
        className="relative overflow-hidden bg-[var(--magicks-bg-base)] pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.25rem]"
      >
        <section
          data-wk-hero
          className="relative overflow-hidden px-5 pb-24 pt-8 sm:px-8 sm:pb-32 sm:pt-10 md:px-12 md:pb-40 lg:px-16 lg:pb-48"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 60% 46% at 18% 18%, rgba(166,138,98,0.15), transparent 72%), radial-gradient(ellipse 54% 42% at 84% 34%, rgba(104,132,164,0.12), transparent 74%), radial-gradient(ellipse 74% 44% at 50% 94%, rgba(255,255,255,0.58), transparent 76%)",
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
                "radial-gradient(ellipse 72% 60% at 50% 42%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 72% 60% at 50% 42%, black, transparent)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.62fr)] lg:items-end lg:gap-16">
                <div>
                  <div data-wk-hero-item>
                    <Eyebrow>Webdesign Kassel · Studio Bureau</Eyebrow>
                  </div>

                  <h1
                    data-wk-hero-item
                    className="font-ui mt-7 max-w-[18ch] text-[2.42rem] font-[650] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.35rem] md:text-[4.42rem] lg:text-[5.1rem]"
                  >
                    Webdesign für Unternehmen in Kassel mit Anspruch.
                  </h1>

                  <p
                    data-wk-hero-item
                    className="font-ui mt-8 max-w-[52rem] text-[1.03rem] font-[480] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.1rem] md:text-[1.18rem]"
                  >
                    MAGICKS gestaltet und entwickelt Websites, Homepages, Landing
                    Pages und digitale Auftritte für Unternehmen in Kassel und
                    Nordhessen — mit klarer Struktur, hochwertiger Gestaltung,
                    lokaler Sichtbarkeit und Nutzerführung, die den nächsten
                    Schritt erleichtert.
                  </p>

                  <div
                    data-wk-hero-item
                    className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12"
                  >
                    <PrimaryCta to="/kontakt" label="Website-Projekt besprechen" />
                    <SecondaryCta to="/leistungen" label="Leistungen ansehen" />
                  </div>

                  <div
                    data-wk-hero-item
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
                  data-wk-hero-item
                  className="rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.66)] p-5 shadow-[0_24px_68px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.76)] sm:p-6"
                  aria-label="MAGICKS Standort und Fokus"
                >
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)]">
                    Bureau · Kassel
                  </p>
                  <div className="mt-6 grid gap-4">
                    {[
                      ["Standort", "Kassel · Nordhessen"],
                      ["Koordinaten", "51° N · 9° E"],
                      ["Fokus", "Vertrauen · Klarheit · Anfragen"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        data-wk-coordinate
                        className="border-t border-[rgb(var(--magicks-line-rgb)/0.11)] pt-4"
                      >
                        <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.42)]">
                          {label}
                        </p>
                        <p className="font-ui mt-2 text-[1.08rem] font-[620] leading-[1.22] tracking-[-0.014em] text-[rgb(var(--magicks-ink-rgb)/0.9)]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="font-ui mt-6 text-[14.2px] leading-[1.64] text-[rgb(var(--magicks-ink-rgb)/0.62)]">
                    Ein regionaler Ausgangspunkt, kein lokales Klischee. Der
                    Auftritt soll Ihr Unternehmen verständlich machen und seriös
                    zur Anfrage führen.
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
                  eyebrow="Mehr als eine moderne Homepage"
                  title="Eine gute Website ist mehr als eine moderne Oberfläche."
                />
                <div data-wk-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Viele Unternehmen suchen nach Webdesign, meinen aber mehr
                    als Farben, Layout und Technik. Sie brauchen einen digitalen
                    Auftritt, der Leistungen verständlich macht, Qualität
                    sichtbar zeigt, Vertrauen aufbaut und Kunden den nächsten
                    Schritt erleichtert.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {VALUE_POINTS.map((item, index) => (
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
                eyebrow="Was Unternehmen aus Kassel beauftragen"
                title="Websites, Homepages und Landing Pages mit geschäftlichem Zweck."
                text="MAGICKS plant Webdesign nicht als isolierte Oberfläche. Entscheidend ist, was der Auftritt im Alltag leisten soll: erklären, führen, Vertrauen schaffen, lokal sichtbar werden und Anfragen ermöglichen."
              />

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {COMMISSION_ITEMS.map((item, index) => (
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
                eyebrow="Für wen Webdesign aus Kassel passt"
                title="Für Unternehmen, die regional sichtbar und professionell auftreten wollen."
                text="Die Seite richtet sich an Betriebe und Unternehmen, die keine generische Agentur-Website suchen, sondern einen Auftritt, der zum eigenen Anspruch passt."
              />

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AUDIENCE_ITEMS.map((item, index) => (
                  <InfoCard key={item.title} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
                <SectionIntro
                  eyebrow="Lokale Sichtbarkeit ohne Keyword-Spam"
                  title="Lokale Sichtbarkeit funktioniert nicht durch Keyword-Spam."
                />
                <div data-wk-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Damit eine Website in Kassel und Nordhessen sinnvoll
                    gefunden wird, braucht sie mehr als wiederholte Ortsnamen.
                    Entscheidend sind klare Seitenstruktur, verständliche
                    Inhalte, lokale Suchintention, interne Verlinkung,
                    technische Grundlagen und Seiten, die nach dem Klick
                    wirklich überzeugen.
                  </p>
                  <p className="font-ui mt-6 text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.66)] sm:text-[1.06rem]">
                    Begriffe wie Webdesign Kassel, Homepage erstellen lassen
                    Kassel, Website erstellen lassen Kassel, Webagentur Kassel
                    oder Landingpage Kassel werden nur dort eingesetzt, wo sie
                    zur echten Suchabsicht passen.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {LOCAL_SEO_POINTS.map((item, index) => (
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
                data-wk-reveal
                className="rounded-[1.65rem] border border-[rgb(var(--magicks-line-rgb)/0.11)] bg-[linear-gradient(160deg,rgba(255,255,255,0.78)_0%,rgba(246,242,233,0.64)_100%)] p-6 shadow-[0_24px_72px_-54px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.78)] sm:p-8 md:p-10"
              >
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
                  <div>
                    <Eyebrow>Vor Ort oder remote</Eyebrow>
                    <h2 className="font-ui mt-7 max-w-[18ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.65rem] md:text-[3.25rem]">
                      Kurze Wege, wenn sie sinnvoll sind.
                    </h2>
                  </div>
                  <div className="lg:pt-14">
                    <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                      MAGICKS sitzt in Kassel und arbeitet für Unternehmen aus
                      der Region ebenso wie remote für Kunden darüber hinaus.
                      Für regionale Projekte können Erstgespräche,
                      Abstimmungen oder Workshops auf Wunsch auch vor Ort
                      stattfinden — wenn es zum Projekt passt und ohne den
                      Ablauf unnötig kompliziert zu machen.
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
                eyebrow="Wie MAGICKS Webdesign angeht"
                title="Erst verstehen. Dann gestalten. Dann sauber umsetzen."
              />

              <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {PROCESS_STEPS.map((step, index) => (
                  <li
                    key={step.title}
                    data-wk-reveal
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
              <div className="grid gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:gap-16">
                <SectionIntro
                  eyebrow="Website, Webseite, Homepage"
                  title="Website, Webseite oder Homepage — wichtig ist, dass sie funktioniert."
                />
                <div data-wk-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Unterschiedliche Unternehmen verwenden unterschiedliche
                    Begriffe. Manche suchen nach einer Website, andere nach
                    einer Webseite, Homepage oder einem Internetauftritt. Für
                    MAGICKS zählt, dass das Ergebnis hochwertig aussieht,
                    verständlich erklärt, technisch sauber läuft und im Alltag
                    Ihres Unternehmens etwas bewegt.
                  </p>
                  <p className="font-ui mt-6 text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.66)] sm:text-[1.06rem]">
                    Wenn daraus eine Kampagne entstehen soll, ist eine{" "}
                    <Link
                      to="/landingpages-kassel"
                      className="text-[rgb(var(--magicks-ink-rgb)/0.92)] underline decoration-[rgb(var(--magicks-line-rgb)/0.32)] underline-offset-[4px]"
                    >
                      Landing Page in Kassel
                    </Link>{" "}
                    oft sinnvoll. Wenn der gesamte Auftritt neu gedacht wird,
                    führt der Weg meist über{" "}
                    <Link
                      to="/websites-landingpages"
                      className="text-[rgb(var(--magicks-ink-rgb)/0.92)] underline decoration-[rgb(var(--magicks-line-rgb)/0.32)] underline-offset-[4px]"
                    >
                      Websites & Landingpages
                    </Link>
                    .
                  </p>
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
                title="Webdesign darf nicht wie ein lokales SEO-Manöver wirken."
              />

              <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {AVOID_POINTS.map((line) => (
                  <li
                    key={line}
                    data-wk-reveal
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
                eyebrow="Häufige Fragen"
                title="Was Unternehmen aus Kassel vor einer Anfrage wissen möchten."
                text="Kurze Antworten auf typische Fragen zu Ablauf, Kosten, SEO, Betreuung und regionaler Zusammenarbeit."
              />

              <ol className="mt-12 border-t border-[rgb(var(--magicks-line-rgb)/0.12)]">
                {FAQ_ITEMS.map((item, index) => (
                  <li
                    key={item.question}
                    data-wk-reveal
                    className="border-b border-[rgb(var(--magicks-line-rgb)/0.12)]"
                  >
                    <details className="group/wkfaq">
                      <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-5 py-6 outline-none [&::-webkit-details-marker]:hidden md:gap-x-8 md:py-7">
                        <span className="font-mono pt-[0.32rem] text-[10.5px] font-medium leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.68)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-ui text-[1.08rem] font-[620] leading-[1.28] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)] md:text-[1.22rem]">
                          {item.question}
                        </h3>
                        <span
                          aria-hidden
                          className="font-instrument self-center text-[1.4rem] italic leading-none text-[rgb(var(--magicks-ink-rgb)/0.5)] transition-transform duration-500 group-open/wkfaq:rotate-45"
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

          <FaqJsonLd id="webdesign-kassel" items={FAQ_ITEMS} />
        </section>

        <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16 lg:py-32">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem] space-y-12 sm:space-y-14 md:space-y-16">
              {RELATED_LINKS.map((item) => (
                <div key={item.to} data-wk-reveal>
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
              data-wk-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow>Nächster Schritt</Eyebrow>
              <h2 className="font-ui mx-auto mt-7 max-w-[21ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.9rem]">
                Lassen Sie uns über Ihren Webauftritt in Kassel sprechen.
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[48rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Beschreiben Sie kurz, was Sie vorhaben. MAGICKS meldet sich mit
                einer klaren Einschätzung — ohne Druck, ohne Standard-Pitch.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta to="/kontakt" label="Website-Projekt besprechen" />
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
