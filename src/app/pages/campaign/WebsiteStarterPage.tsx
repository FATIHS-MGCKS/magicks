import { Link } from "react-router-dom";

import { RouteSEO } from "../../seo/RouteSEO";

const PROBLEM_POINTS = [
  "Welche Leistungen bieten Sie genau an?",
  "Was kostet es ungefähr?",
  "Wie kann man Sie schnell kontaktieren?",
  "Gibt es Bilder, Referenzen oder Beispiele?",
  "Warum sollte man sich gerade für Ihren Betrieb entscheiden?",
] as const;

const SCOPE_POINTS = [
  "moderne Unternehmenswebsite mit 1 bis 5 Seiten",
  "Startseite, Leistungen, Über uns, Kontakt, Impressum und Datenschutz",
  "mobil optimiert für Smartphone und Tablet",
  "Kontaktformular, Telefon-Button und optional WhatsApp-Button",
  "Google-Business-Verlinkung und lokale SEO-Grundstruktur",
  "Domain-Einrichtung und technische Hosting-Einrichtung",
  "SSL, Backups, Wartung und Sicherheitsupdates",
  "kleine Text- und Bildänderungen im laufenden Service",
  "1 bis 2 Korrekturrunden vor Livegang",
] as const;

const EXAMPLE_CATEGORIES = [
  "Friseur / Barbershop",
  "Beauty / Kosmetik",
  "Handwerk",
  "Praxis / Therapie",
  "Ferienwohnung / Pension",
  "Autopflege / Detailing",
] as const;

const PROCESS_STEPS = [
  {
    title: "Kurzes Erstgespräch",
    body: "Wir klären Leistungen, Region, Zielkunden, Kontaktwege und was schnell online gehen soll.",
  },
  {
    title: "Entwurf & Freigabe",
    body: "Wir bauen eine starke erste Version und gehen mit 1 bis 2 Korrekturrunden sauber zum finalen Stand.",
  },
  {
    title: "Livegang & Betreuung",
    body: "Wir kümmern uns um Domain, SSL, Hosting, Formular-Test, mobile Prüfung und die technische Grundlage für eine saubere Online-Präsenz.",
  },
] as const;

const INDUSTRIES = [
  "Friseur / Barbershop",
  "Beauty / Kosmetik",
  "Handwerk",
  "Praxis / Therapie",
  "Ferienwohnung / Pension",
  "Autopflege / Detailing",
] as const;

const FAQS = [
  {
    question: "Wie schnell kann meine Website online sein?",
    answer:
      "Sobald die wichtigsten Inhalte vorliegen, kann die erste Version zügig aufgebaut werden. Ziel des Angebots ist ein schneller, professioneller Einstieg ohne unnötige Komplexität.",
  },
  {
    question: "Muss ich mich um Domain und Hosting kümmern?",
    answer: "Nein. MAGICKS übernimmt die technische Einrichtung und Verwaltung im Rahmen des Servicevertrags.",
  },
  {
    question: "Gehört mir die Domain?",
    answer: "Ja. Die Domain bleibt Ihrem Unternehmen zugeordnet.",
  },
  {
    question: "Was ist im monatlichen Betrag enthalten?",
    answer: "Hosting, Wartung, Sicherheitsupdates, Backups und kleinere Text- oder Bildänderungen.",
  },
  {
    question: "Kann ich später erweitern?",
    answer:
      "Ja. Erweiterungen wie Landingpages, Online-Buchung, Google-Profil-Unterstützung oder Automationen können später ergänzt werden.",
  },
  {
    question: "Sind Impressum und Datenschutz dabei?",
    answer:
      "Technisch ja. Die rechtliche Richtigkeit sollte vom Kunden bestätigt oder extern abgesichert werden.",
  },
] as const;

export default function WebsiteStarterPage() {
  return (
    <>
      <RouteSEO path="/website-starter" />

      <main className="relative overflow-hidden bg-[var(--magicks-bg-base)] text-[var(--magicks-text-1)]">
        <section className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32 md:px-12 md:pb-28 md:pt-36 lg:px-16 lg:pb-32 lg:pt-40">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.75]"
            style={{
              background:
                "radial-gradient(ellipse 62% 48% at 22% 22%, rgba(26,35,52,0.08) 0%, transparent 72%), radial-gradient(ellipse 58% 42% at 80% 12%, rgba(26,35,52,0.05) 0%, transparent 78%)",
            }}
          />

          <div className="relative layout-max">
            <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-[var(--magicks-text-3)] sm:text-[10.5px]">
              Website Starter für lokale Betriebe
            </p>

            <h1 className="font-instrument mt-8 max-w-[20ch] text-[2.35rem] leading-[1.02] tracking-[-0.03em] text-[var(--magicks-text-1)] sm:mt-10 sm:text-[3rem] md:mt-12 md:text-[3.5rem] lg:text-[4.05rem]">
              Ihre erste professionelle Website – schnell, modern und bezahlbar.
            </h1>

            <p className="font-ui mt-8 max-w-[48rem] text-[15.5px] leading-[1.72] text-[var(--magicks-text-2)] sm:mt-10 sm:text-[16px] md:text-[17px]">
              Für lokale Betriebe, die bisher vor allem über Google, Facebook oder Empfehlungen gefunden werden. Wir
              erstellen eine professionelle Website, die Vertrauen schafft, Leistungen klar zeigt und Anfragen einfacher
              macht.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4 md:mt-12">
              <Link
                to="/kontakt"
                className="font-ui inline-flex min-h-11 items-center justify-center rounded-full border border-[rgb(var(--magicks-line-rgb)/0.34)] bg-[var(--magicks-ink-strong)] px-6 py-2.5 text-[14.5px] font-medium text-[var(--magicks-bg-base)] no-underline shadow-[0_10px_30px_rgba(17,24,39,0.10)] magicks-duration-hover magicks-ease-out transition-[transform,box-shadow,opacity] hover:-translate-y-[1px] hover:shadow-[0_14px_34px_rgba(17,24,39,0.14)] active:translate-y-0"
              >
                Kostenlose Ersteinschätzung anfragen
              </Link>

              <a
                href="#starter-beispiele"
                className="font-ui inline-flex min-h-11 items-center justify-center rounded-full border border-[rgb(var(--magicks-line-rgb)/0.28)] bg-[rgb(var(--magicks-ink-rgb)/0.03)] px-6 py-2.5 text-[14.5px] font-medium text-[var(--magicks-text-1)] no-underline magicks-duration-hover magicks-ease-out transition-[transform,border-color,background-color] hover:-translate-y-[1px] hover:border-[rgb(var(--magicks-line-rgb)/0.44)] hover:bg-[rgb(var(--magicks-ink-rgb)/0.06)] active:translate-y-0"
              >
                Beispiel ansehen
              </a>
            </div>

            <p className="font-ui mt-7 max-w-[56rem] text-[13.5px] leading-[1.7] text-[var(--magicks-text-3)] sm:mt-8 md:text-[14px]">
              Mobil optimiert. Domain &amp; Hosting betreut. Klar kalkulierbar. Ohne Technikstress.
            </p>

            <div className="mt-8 grid max-w-[56rem] gap-2 border-t border-[rgb(var(--magicks-line-rgb)/0.2)] pt-5 sm:grid-cols-5 sm:gap-4">
              {["Erstkontakt", "Freigabe", "Beispiel", "Angebot", "Projekt"].map((item, idx) => (
                <div key={item} className="flex items-center gap-2 text-[11px] text-[var(--magicks-text-3)] sm:block">
                  <span className="font-mono inline-flex min-w-8 tabular-nums uppercase tracking-[0.24em] text-[rgb(var(--magicks-ink-rgb)/0.44)]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="font-ui">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[rgb(var(--magicks-line-rgb)/0.16)] bg-[var(--magicks-bg-elevated)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div className="layout-max">
            <h2 className="font-instrument max-w-[26ch] text-[1.95rem] leading-[1.08] tracking-[-0.024em] text-[var(--magicks-text-1)] sm:text-[2.35rem] md:text-[2.85rem]">
              Kunden suchen Sie online – aber finden oft nur einen Verzeichniseintrag.
            </h2>

            <p className="font-ui mt-7 max-w-[52rem] text-[15.5px] leading-[1.72] text-[var(--magicks-text-2)] md:mt-8 md:text-[16.5px]">
              Viele lokale Betriebe haben bereits gute Bewertungen und echte Nachfrage. Aber ohne eigene Website fehlt
              oft die zentrale Anlaufstelle, auf der Kunden sofort verstehen, was Sie anbieten, wie man Sie erreicht und
              warum man Ihnen vertrauen kann.
            </p>

            <ul className="mt-10 grid max-w-[56rem] gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4">
              {PROBLEM_POINTS.map((point) => (
                <li
                  key={point}
                  className="font-ui rounded-2xl border border-[rgb(var(--magicks-line-rgb)/0.2)] bg-[rgb(var(--magicks-bg-base-rgb)/0.82)] px-4 py-3 text-[14.5px] leading-[1.6] text-[var(--magicks-text-2)]"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-[rgb(var(--magicks-line-rgb)/0.16)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div className="layout-max">
            <h2 className="font-instrument max-w-[24ch] text-[1.95rem] leading-[1.08] tracking-[-0.024em] text-[var(--magicks-text-1)] sm:text-[2.35rem] md:text-[2.85rem]">
              Wir bauen Ihre digitale Visitenkarte – aber hochwertig.
            </h2>

            <p className="font-ui mt-7 max-w-[56rem] text-[15.5px] leading-[1.72] text-[var(--magicks-text-2)] md:mt-8 md:text-[16.5px]">
              Eine moderne Starter-Website macht Ihren Betrieb online professioneller, klarer und vertrauenswürdiger
              sichtbar. Kunden finden nicht nur einen Google-Eintrag, sondern eine echte Website mit Leistungen,
              Kontaktmöglichkeiten, Bildern und einer sauberen Darstellung auf dem Handy.
            </p>

            <h3 className="font-instrument mt-10 text-[1.5rem] leading-[1.12] tracking-[-0.018em] text-[var(--magicks-text-1)] sm:mt-12 sm:text-[1.8rem]">
              Was Sie bekommen
            </h3>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
              {SCOPE_POINTS.map((point) => (
                <li
                  key={point}
                  className="font-ui flex gap-3 rounded-2xl border border-[rgb(var(--magicks-line-rgb)/0.18)] bg-[var(--magicks-bg-lifted)] px-4 py-3.5 text-[14.5px] leading-[1.58] text-[var(--magicks-text-2)]"
                >
                  <span aria-hidden className="mt-[0.45rem] h-1.5 w-1.5 flex-none rounded-full bg-[var(--magicks-ink-strong)]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-[rgb(var(--magicks-line-rgb)/0.16)] bg-[var(--magicks-bg-elevated)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div className="layout-max">
            <h2 className="font-instrument max-w-[24ch] text-[1.95rem] leading-[1.08] tracking-[-0.024em] text-[var(--magicks-text-1)] sm:text-[2.35rem] md:text-[2.85rem]">
              Einfach starten – mit einem klaren Modell.
            </h2>

            <p className="font-ui mt-7 max-w-[56rem] text-[15.5px] leading-[1.72] text-[var(--magicks-text-2)] md:mt-8 md:text-[16.5px]">
              Damit der Einstieg für kleine Betriebe leicht bleibt, bieten wir im Rahmen unserer Digitalisierungskampagne
              bewusst nur zwei einfache Optionen an.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
              <article className="rounded-2xl border border-[rgb(var(--magicks-line-rgb)/0.24)] bg-[var(--magicks-bg-lifted)] p-6 shadow-[0_16px_40px_rgba(17,24,39,0.06)]">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--magicks-text-3)]">
                  Starter
                </p>
                <p className="font-instrument mt-5 text-[2rem] leading-[1] tracking-[-0.028em] text-[var(--magicks-text-1)]">
                  699 € einmalig
                </p>
                <p className="font-instrument mt-2 text-[1.45rem] leading-[1.1] tracking-[-0.018em] text-[rgb(var(--magicks-ink-rgb)/0.8)]">
                  + 59 € monatlich
                </p>
                <p className="font-ui mt-6 text-[14.5px] leading-[1.66] text-[var(--magicks-text-2)]">
                  Für Unternehmen, die günstig starten und danach niedrige laufende Kosten möchten.
                </p>
              </article>

              <article className="rounded-2xl border border-[rgb(var(--magicks-line-rgb)/0.24)] bg-[var(--magicks-bg-lifted)] p-6 shadow-[0_16px_40px_rgba(17,24,39,0.06)]">
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--magicks-text-3)]">
                  Ohne Startkosten
                </p>
                <p className="font-instrument mt-5 text-[2rem] leading-[1] tracking-[-0.028em] text-[var(--magicks-text-1)]">
                  0 € Einrichtung
                </p>
                <p className="font-instrument mt-2 text-[1.45rem] leading-[1.1] tracking-[-0.018em] text-[rgb(var(--magicks-ink-rgb)/0.8)]">
                  + 99 € monatlich bei 24 Monaten Laufzeit
                </p>
                <p className="font-ui mt-6 text-[14.5px] leading-[1.66] text-[var(--magicks-text-2)]">
                  Für Unternehmen, die komplett ohne Anfangsinvestition online gehen wollen.
                </p>
              </article>
            </div>

            <p className="font-ui mt-8 max-w-[56rem] text-[14.5px] leading-[1.7] text-[var(--magicks-text-2)] md:text-[15.5px]">
              In beiden Fällen kümmern wir uns um die technische Einrichtung, Domain, Hosting, mobile Optimierung,
              Kontaktformular und die Grundstruktur für Google.
            </p>

            <p className="font-ui mt-5 max-w-[56rem] rounded-2xl border border-[rgb(var(--magicks-line-rgb)/0.22)] bg-[rgb(var(--magicks-bg-base-rgb)/0.72)] px-4 py-4 text-[14px] leading-[1.66] text-[var(--magicks-text-2)] md:text-[14.5px]">
              Die Domain bleibt Ihrem Unternehmen zugeordnet. MAGICKS Studio übernimmt im Rahmen des Servicevertrags die
              technische Einrichtung, Verwaltung, Pflege und Betreuung.
            </p>

            <p className="font-ui mt-4 max-w-[56rem] text-[13.5px] leading-[1.68] text-[var(--magicks-text-3)] md:text-[14px]">
              Das Angebot ist als regionales Digitalisierungsangebot mit reduziertem Einstiegspreis gedacht — nicht als
              Billig-Website.
            </p>
          </div>
        </section>

        <section
          id="starter-beispiele"
          className="border-t border-[rgb(var(--magicks-line-rgb)/0.16)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16"
        >
          <div className="layout-max">
            <h2 className="font-instrument max-w-[22ch] text-[1.95rem] leading-[1.08] tracking-[-0.024em] text-[var(--magicks-text-1)] sm:text-[2.35rem] md:text-[2.85rem]">
              So könnte Ihre neue Website aussehen.
            </h2>

            <p className="font-ui mt-7 max-w-[56rem] text-[15.5px] leading-[1.72] text-[var(--magicks-text-2)] md:mt-8 md:text-[16.5px]">
              Der einfachste Weg, das Angebot greifbar zu machen: eine passende Beispielstruktur für Ihre Branche. So
              sehen Sie nicht nur ein abstraktes Angebot, sondern direkt, wie Ihre neue Website aufgebaut sein könnte.
            </p>

            <p className="font-ui mt-5 max-w-[56rem] text-[14.5px] leading-[1.68] text-[var(--magicks-text-3)] md:text-[15px]">
              Wir haben für wichtige Branchen bereits passende Beispielstrukturen vorbereitet, die mit Ihren
              Leistungen, Bildern und Kontaktdaten angepasst werden können.
            </p>

            <ul className="mt-9 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
              {EXAMPLE_CATEGORIES.map((category) => (
                <li
                  key={category}
                  className="font-ui rounded-xl border border-[rgb(var(--magicks-line-rgb)/0.2)] bg-[var(--magicks-bg-lifted)] px-4 py-3 text-[14.5px] leading-[1.58] text-[var(--magicks-text-2)]"
                >
                  {category}
                </li>
              ))}
            </ul>

            <div className="mt-10 sm:mt-12">
              <Link
                to="/kontakt"
                className="font-ui inline-flex min-h-11 items-center rounded-full border border-[rgb(var(--magicks-line-rgb)/0.32)] bg-[rgb(var(--magicks-ink-rgb)/0.04)] px-6 py-2.5 text-[14.5px] font-medium text-[var(--magicks-text-1)] no-underline magicks-duration-hover magicks-ease-out transition-[transform,border-color,background-color] hover:-translate-y-[1px] hover:border-[rgb(var(--magicks-line-rgb)/0.44)] hover:bg-[rgb(var(--magicks-ink-rgb)/0.08)]"
              >
                Passende Beispielstruktur ansehen
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-[rgb(var(--magicks-line-rgb)/0.16)] bg-[var(--magicks-bg-elevated)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div className="layout-max">
            <h2 className="font-instrument max-w-[20ch] text-[1.95rem] leading-[1.08] tracking-[-0.024em] text-[var(--magicks-text-1)] sm:text-[2.35rem] md:text-[2.85rem]">
              So einfach läuft es ab.
            </h2>

            <p className="font-ui mt-7 max-w-[56rem] text-[15.5px] leading-[1.72] text-[var(--magicks-text-2)] md:mt-8 md:text-[16.5px]">
              Sie brauchen kein kompliziertes Lastenheft und kein Technikverständnis. Wir halten den Einstieg bewusst
              einfach und klar.
            </p>

            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {PROCESS_STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-2xl border border-[rgb(var(--magicks-line-rgb)/0.2)] bg-[var(--magicks-bg-lifted)] px-5 py-5"
                >
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--magicks-text-3)]">
                    Schritt {i + 1}
                  </p>
                  <h3 className="font-instrument mt-4 text-[1.4rem] leading-[1.14] tracking-[-0.018em] text-[var(--magicks-text-1)]">
                    {step.title}
                  </h3>
                  <p className="font-ui mt-4 text-[14.5px] leading-[1.66] text-[var(--magicks-text-2)]">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-[rgb(var(--magicks-line-rgb)/0.16)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div className="layout-max">
            <h2 className="font-instrument max-w-[22ch] text-[1.95rem] leading-[1.08] tracking-[-0.024em] text-[var(--magicks-text-1)] sm:text-[2.35rem] md:text-[2.85rem]">
              Geeignet für lokale Betriebe wie …
            </h2>

            <p className="font-ui mt-7 max-w-[56rem] text-[15.5px] leading-[1.72] text-[var(--magicks-text-2)] md:mt-8 md:text-[16.5px]">
              Das Angebot ist besonders sinnvoll für Unternehmen, die bereits sichtbar sind, aber noch keine eigene
              Website haben.
            </p>

            <ul className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {INDUSTRIES.map((industry) => (
                <li
                  key={industry}
                  className="font-ui rounded-xl border border-[rgb(var(--magicks-line-rgb)/0.2)] bg-[var(--magicks-bg-lifted)] px-4 py-3 text-[14.5px] leading-[1.58] text-[var(--magicks-text-2)]"
                >
                  {industry}
                </li>
              ))}
            </ul>

            <p className="font-ui mt-8 max-w-[56rem] text-[14.5px] leading-[1.7] text-[var(--magicks-text-3)] md:text-[15px]">
              Wenn Ihr Betrieb bisher vor allem über Google, Verzeichnisse oder Social Media gefunden wird, ist dieses
              Angebot genau als einfacher erster Schritt gedacht.
            </p>
          </div>
        </section>

        <section className="border-t border-[rgb(var(--magicks-line-rgb)/0.16)] bg-[var(--magicks-bg-elevated)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div className="layout-max">
            <h2 className="font-instrument max-w-[24ch] text-[1.95rem] leading-[1.08] tracking-[-0.024em] text-[var(--magicks-text-1)] sm:text-[2.35rem] md:text-[2.85rem]">
              Warum nicht einfach selbst mit einem Baukasten?
            </h2>

            <p className="font-ui mt-7 max-w-[56rem] text-[15.5px] leading-[1.72] text-[var(--magicks-text-2)] md:mt-8 md:text-[16.5px]">
              Natürlich könnten Sie versuchen, eine Website selbst zu bauen. Das Problem ist: Genau dort bleiben viele
              kleine Betriebe hängen — technisch, gestalterisch oder zeitlich.
            </p>

            <p className="font-ui mt-5 max-w-[56rem] text-[14.5px] leading-[1.7] text-[var(--magicks-text-2)] md:text-[15.5px]">
              Klassische Agenturen sind für kleine lokale Betriebe oft zu teuer. Freelancer sind günstiger, bieten aber
              häufig weniger Betreuung nach dem Livegang. Baukästen wirken günstig, aber am Ende muss man sich selbst um
              Aufbau, Technik und Qualität kümmern.
            </p>

            <p className="font-instrument mt-7 max-w-[56rem] text-[1.15rem] leading-[1.45] tracking-[-0.008em] text-[rgb(var(--magicks-ink-rgb)/0.86)] sm:text-[1.24rem] md:text-[1.35rem]">
              Wir bauen es Ihnen fertig, professionell und suchmaschinenfreundlich — ohne dass Sie sich technisch darum
              kümmern müssen.
            </p>
          </div>
        </section>

        <section className="border-t border-[rgb(var(--magicks-line-rgb)/0.16)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div className="layout-max">
            <h2 className="font-instrument text-[1.95rem] leading-[1.08] tracking-[-0.024em] text-[var(--magicks-text-1)] sm:text-[2.35rem] md:text-[2.85rem]">
              Häufige Fragen
            </h2>

            <ol className="mt-10 divide-y divide-[rgb(var(--magicks-line-rgb)/0.16)] border-y border-[rgb(var(--magicks-line-rgb)/0.16)]">
              {FAQS.map((faq, i) => (
                <li key={faq.question} className="py-1">
                  <details className="group">
                    <summary className="grid cursor-pointer list-none grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-4 py-5 outline-none [&::-webkit-details-marker]:hidden sm:gap-6 sm:py-6">
                      <span className="font-mono pt-[0.18rem] text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--magicks-text-3)] sm:text-[10.5px]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-ui text-[15px] font-medium leading-[1.5] text-[var(--magicks-text-1)] sm:text-[16px]">
                        {faq.question}
                      </h3>
                      <span
                        aria-hidden
                        className="font-instrument text-[1.25rem] leading-none text-[var(--magicks-text-3)] magicks-duration-hover magicks-ease-out transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-4 pb-5 sm:gap-6 sm:pb-6">
                      <span aria-hidden />
                      <p className="font-ui max-w-[54rem] text-[14.5px] leading-[1.68] text-[var(--magicks-text-2)] sm:text-[15px]">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-[rgb(var(--magicks-line-rgb)/0.16)] bg-[var(--magicks-bg-lifted)] px-5 pb-24 pt-24 sm:px-8 sm:pb-28 sm:pt-28 md:px-12 md:pb-32 md:pt-32 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[62rem] text-center">
              <h2 className="font-instrument text-[2.15rem] leading-[1.02] tracking-[-0.03em] text-[var(--magicks-text-1)] sm:text-[2.7rem] md:text-[3.35rem] lg:text-[3.8rem]">
                Bereit für Ihren professionellen Start ins Web?
              </h2>

              <p className="font-ui mx-auto mt-7 max-w-[46rem] text-[15.5px] leading-[1.72] text-[var(--magicks-text-2)] sm:text-[16px] md:text-[17px]">
                Wenn Ihr Unternehmen bereits gefunden wird, aber noch keine eigene Website hat, ist jetzt der einfachste
                Moment für einen sauberen digitalen Auftritt.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:mt-12">
                <Link
                  to="/kontakt"
                  className="font-ui inline-flex min-h-11 items-center justify-center rounded-full border border-[rgb(var(--magicks-line-rgb)/0.34)] bg-[var(--magicks-ink-strong)] px-6 py-2.5 text-[14.5px] font-medium text-[var(--magicks-bg-base)] no-underline shadow-[0_10px_30px_rgba(17,24,39,0.10)] magicks-duration-hover magicks-ease-out transition-[transform,box-shadow] hover:-translate-y-[1px] hover:shadow-[0_14px_34px_rgba(17,24,39,0.14)]"
                >
                  Kostenlose Ersteinschätzung anfragen
                </Link>
                <a
                  href="#starter-beispiele"
                  className="font-ui inline-flex min-h-11 items-center justify-center rounded-full border border-[rgb(var(--magicks-line-rgb)/0.28)] bg-[rgb(var(--magicks-ink-rgb)/0.03)] px-6 py-2.5 text-[14.5px] font-medium text-[var(--magicks-text-1)] no-underline magicks-duration-hover magicks-ease-out transition-[transform,border-color,background-color] hover:-translate-y-[1px] hover:border-[rgb(var(--magicks-line-rgb)/0.44)] hover:bg-[rgb(var(--magicks-ink-rgb)/0.06)]"
                >
                  Beispielseite ansehen
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
