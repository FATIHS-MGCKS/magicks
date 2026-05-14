import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { ProjectIntakeForm } from "../components/contact/ProjectIntakeForm";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { registerGsap } from "../lib/gsap";
import { runRouteReveal } from "../lib/routeReveal";
import { RouteSEO } from "../seo/RouteSEO";

type ContactPoint = {
  label: string;
  value: string;
  href?: string;
};

type TextCard = {
  title: string;
  text: string;
  to?: string;
};

const CONTACT_POINTS: ContactPoint[] = [
  {
    label: "E-Mail",
    value: "hello@magicks.de",
    href: "mailto:hello@magicks.de",
  },
  {
    label: "Standort",
    value: "Kassel · Remote",
  },
  {
    label: "Antwort",
    value: "In der Regel innerhalb von 24 Stunden",
  },
];

const START_HELP = [
  "Worum geht es grob?",
  "Gibt es bereits eine Website oder Lösung?",
  "Welche Leistung passt ungefähr?",
  "Was soll verbessert oder neu entstehen?",
  "Gibt es einen gewünschten Zeitrahmen?",
] as const;

const SERVICE_TOPICS: TextCard[] = [
  {
    title: "Websites & Landingpages",
    text: "Für digitale Auftritte, Kampagnen und klare Anfragewege.",
    to: "/websites-landingpages",
  },
  {
    title: "Shops & Produktkonfiguratoren",
    text: "Für Produkte, Varianten, Anfrageflows und digitale Verkaufsflächen.",
    to: "/shops-produktkonfiguratoren",
  },
  {
    title: "Web-Software",
    text: "Für Portale, Dashboards, interne Tools und Prozesslogik.",
    to: "/web-software",
  },
  {
    title: "KI & Automationen",
    text: "Für Workflows, Integrationen und weniger manuelle Zwischenschritte.",
    to: "/ki-automationen-integrationen",
  },
  {
    title: "SEO, Content & Bildwelt",
    text: "Für Sichtbarkeit, bessere Inhalte und hochwertigere digitale Kommunikation.",
    to: "/seo-sichtbarkeit",
  },
  {
    title: "Noch offene digitale Idee",
    text: "Wenn die Richtung noch nicht feststeht, reicht eine kurze Beschreibung.",
    to: "/leistungen",
  },
];

const NEXT_STEPS: TextCard[] = [
  {
    title: "Anfrage senden",
    text: "Sie beschreiben kurz Ihr Vorhaben.",
  },
  {
    title: "Einordnung erhalten",
    text: "MAGICKS prüft, worum es geht und welche Richtung sinnvoll ist.",
  },
  {
    title: "Gespräch oder nächste Schritte",
    text: "Wenn es passt, besprechen wir Umfang, Ziel, Vorgehen und mögliche Umsetzung.",
  },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.74)] sm:text-[10.75px]">
      {children}
    </p>
  );
}

function PrimaryCta({ to, label }: { to: string; label: string }) {
  return (
    <a
      href={to}
      className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--magicks-ink-strong)] py-3 pl-6 pr-3 font-ui text-[15px] font-[590] tracking-[-0.004em] text-[var(--magicks-bg-lifted)] no-underline shadow-[0_20px_54px_-34px_rgba(20,28,44,0.42)] transition-[transform,box-shadow,background-color] duration-500 hover:-translate-y-[1px] hover:shadow-[0_26px_64px_-36px_rgba(20,28,44,0.52)] active:translate-y-0 active:scale-[0.985] sm:text-[15.5px]"
    >
      <span>{label}</span>
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--magicks-bg-lifted-rgb)/0.12)] transition-transform duration-500 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
      >
        ↓
      </span>
    </a>
  );
}

function SecondaryMailCta() {
  return (
    <a
      href="mailto:hello@magicks.de"
      className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-[rgb(var(--magicks-line-rgb)/0.18)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.5)] px-5 py-3 font-ui text-[15px] font-[560] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.78)] no-underline transition-[border-color,transform,color,background-color] duration-500 hover:-translate-y-[1px] hover:border-[rgb(var(--magicks-line-rgb)/0.34)] hover:bg-[rgb(var(--magicks-bg-lifted-rgb)/0.82)] hover:text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[15.5px]"
    >
      <span>Direkt per E-Mail schreiben</span>
      <span aria-hidden className="font-instrument italic transition-transform duration-500 group-hover:translate-x-[2px]">
        ↗
      </span>
    </a>
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
    <div data-contact-reveal className="max-w-[58rem]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-ui mt-6 max-w-[23ch] text-[2rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.55rem] md:text-[3.15rem]">
        {title}
      </h2>
      {text ? (
        <p className="font-ui mt-6 max-w-[50rem] text-[1rem] font-[470] leading-[1.7] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.06rem]">
          {text}
        </p>
      ) : null}
    </div>
  );
}

export default function ContactPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-contact-hero-item]");
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-contact-reveal]");

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
        heroYOffset: 14,
        revealYOffset: 16,
        blur: 3,
        duration: 0.62,
        heroStagger: 0.045,
        revealStart: "top 90%",
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/kontakt" />

      <main
        ref={rootRef}
        className="relative overflow-hidden bg-[var(--magicks-bg-base)] pt-[6.25rem] sm:pt-[7.25rem] md:pt-[8rem]"
      >
        <section className="relative overflow-hidden px-5 pb-20 pt-8 sm:px-8 sm:pb-28 sm:pt-10 md:px-12 md:pb-32 lg:px-16">
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
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
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
            <div className="mx-auto grid max-w-[82rem] gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(30rem,1fr)] lg:items-start lg:gap-14">
              <div className="lg:sticky lg:top-28">
                <div data-contact-hero-item>
                  <Eyebrow>Kontakt · MAGICKS Studio</Eyebrow>
                </div>

                <h1
                  data-contact-hero-item
                  className="font-ui mt-7 max-w-[14ch] text-[2.42rem] font-[650] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.35rem] md:text-[4.28rem] lg:text-[4.72rem]"
                >
                  Lassen Sie uns über Ihr Projekt sprechen.
                </h1>

                <p
                  data-contact-hero-item
                  className="font-ui mt-7 max-w-[45rem] text-[1.03rem] font-[480] leading-[1.7] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.1rem]"
                >
                  Ob Website, Landingpage, Shop, Produktkonfigurator,
                  Web-Software oder Automation: Eine kurze Beschreibung reicht
                  für den ersten Schritt. MAGICKS ordnet Ihr Vorhaben ein und
                  meldet sich mit einer klaren Einschätzung.
                </p>

                <div
                  data-contact-hero-item
                  className="mt-9 flex flex-wrap items-center gap-4"
                >
                  <PrimaryCta to="#anfrage" label="Anfrage senden" />
                  <SecondaryMailCta />
                </div>

                <dl
                  data-contact-hero-item
                  className="mt-9 grid gap-3 sm:grid-cols-3 lg:grid-cols-1"
                >
                  {CONTACT_POINTS.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[0.95rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.58)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]"
                    >
                      <dt className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.7)]">
                        {item.label}
                      </dt>
                      <dd className="font-ui mt-2 text-[14.5px] font-[590] leading-[1.45] text-[rgb(var(--magicks-ink-rgb)/0.82)]">
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-[rgb(var(--magicks-ink-rgb)/0.9)] no-underline underline decoration-[rgb(var(--magicks-line-rgb)/0.3)] underline-offset-[4px] hover:text-[rgb(var(--magicks-ink-rgb)/1)]"
                          >
                            {item.value}
                          </a>
                        ) : (
                          item.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p
                  data-contact-hero-item
                  className="font-ui mt-6 max-w-[35rem] text-[14.5px] leading-[1.65] text-[rgb(var(--magicks-ink-rgb)/0.62)]"
                >
                  Kein fertiges Lastenheft nötig. Wenn die Richtung noch offen
                  ist, reicht eine kurze Einordnung, was sich verändern soll.
                </p>
              </div>

              <div
                id="anfrage"
                data-contact-hero-item
                className="scroll-mt-28 rounded-[1.5rem] border border-[rgb(var(--magicks-line-rgb)/0.11)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.72)] p-5 shadow-[0_28px_78px_-54px_rgba(20,28,44,0.36),inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-7 md:p-8"
              >
                <div className="mb-3">
                  <Eyebrow>Projektanfrage</Eyebrow>
                  <p className="font-ui mt-4 max-w-[38rem] text-[14.8px] leading-[1.65] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                    Füllen Sie nur aus, was für den Start wichtig ist. Das
                    Formular bereitet eine E-Mail an MAGICKS vor.
                  </p>
                </div>
                <ProjectIntakeForm />
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
                <SectionIntro
                  eyebrow="Für den Start"
                  title="Was für den Start hilfreich ist."
                  text="Sie brauchen kein fertiges Lastenheft. Diese Punkte helfen nur dabei, Ihre Anfrage schneller einzuordnen."
                />

                <ul className="grid gap-3 sm:grid-cols-2">
                  {START_HELP.map((item, index) => (
                    <li
                      key={item}
                      data-contact-reveal
                      className="rounded-[0.95rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.54)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)]"
                    >
                      <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.68)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="font-ui mt-2 text-[15px] font-[590] leading-[1.45] text-[rgb(var(--magicks-ink-rgb)/0.8)]">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <SectionIntro
                eyebrow="Worum es gehen kann"
                title="Orientierung, ohne die Anfrage zu verkomplizieren."
                text="Wenn Sie die passende Kategorie kennen, wählen Sie sie im Formular aus. Wenn nicht, reicht eine kurze Beschreibung."
              />

              <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {SERVICE_TOPICS.map((item) => {
                  const content = (
                    <>
                      <h3 className="font-ui text-[1.05rem] font-[620] leading-[1.28] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.9)]">
                        {item.title}
                      </h3>
                      <p className="font-ui mt-3 text-[14.4px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.64)]">
                        {item.text}
                      </p>
                    </>
                  );

                  return item.to ? (
                    <Link
                      key={item.title}
                      data-contact-reveal
                      to={item.to}
                      className="group rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] p-5 no-underline shadow-[0_18px_50px_-42px_rgba(20,28,44,0.24),inset_0_1px_0_rgba(255,255,255,0.72)] transition-[transform,border-color,background-color] duration-500 hover:-translate-y-[1px] hover:border-[rgb(var(--magicks-line-rgb)/0.2)] hover:bg-[rgb(var(--magicks-bg-lifted-rgb)/0.76)]"
                    >
                      {content}
                      <span className="font-ui mt-5 inline-flex items-center gap-2 text-[14px] font-[620] text-[rgb(var(--magicks-ink-rgb)/0.82)]">
                        Ansehen
                        <span aria-hidden className="font-instrument italic transition-transform duration-500 group-hover:translate-x-1">
                          ↗
                        </span>
                      </span>
                    </Link>
                  ) : (
                    <article
                      key={item.title}
                      data-contact-reveal
                      className="rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.56)] p-5 shadow-[0_18px_50px_-42px_rgba(20,28,44,0.24),inset_0_1px_0_rgba(255,255,255,0.72)]"
                    >
                      {content}
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <SectionIntro
                eyebrow="Nach dem Absenden"
                title="So geht es danach weiter."
              />

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {NEXT_STEPS.map((step, index) => (
                  <article
                    key={step.title}
                    data-contact-reveal
                    className="rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.58)] p-5 shadow-[0_18px_50px_-42px_rgba(20,28,44,0.24),inset_0_1px_0_rgba(255,255,255,0.72)]"
                  >
                    <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.7)]">
                      Schritt {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-ui mt-4 text-[1.1rem] font-[620] leading-[1.28] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.9)]">
                      {step.title}
                    </h3>
                    <p className="font-ui mt-3 text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.64)]">
                      {step.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div className="layout-max">
            <div
              data-contact-reveal
              className="mx-auto max-w-[76rem] rounded-[1.5rem] border border-[rgb(var(--magicks-line-rgb)/0.11)] bg-[linear-gradient(160deg,rgba(255,255,255,0.78)_0%,rgba(246,242,233,0.64)_100%)] p-6 shadow-[0_24px_72px_-54px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.78)] sm:p-8 md:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-14">
                <div>
                  <Eyebrow>Direktkontakt</Eyebrow>
                  <h2 className="font-ui mt-6 max-w-[20ch] text-[2rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.55rem] md:text-[3.15rem]">
                    Lieber direkt schreiben?
                  </h2>
                </div>
                <div>
                  <p className="font-ui text-[1rem] leading-[1.7] text-[rgb(var(--magicks-ink-rgb)/0.68)] sm:text-[1.06rem]">
                    Sie können Ihre Anfrage auch direkt per E-Mail senden. Eine
                    kurze Beschreibung reicht.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <a
                      href="mailto:hello@magicks.de"
                      className="font-instrument text-[1.55rem] italic leading-none tracking-[-0.018em] text-[rgb(var(--magicks-ink-rgb)/0.92)] no-underline underline decoration-[rgb(var(--magicks-line-rgb)/0.28)] underline-offset-[6px] transition-colors duration-500 hover:text-[rgb(var(--magicks-ink-rgb)/1)] sm:text-[2rem]"
                    >
                      hello@magicks.de
                    </a>
                    <span className="font-ui rounded-full border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.62)] px-3 py-2 text-[13.2px] font-[560] leading-none text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                      Kassel · Remote
                    </span>
                    <span className="font-ui rounded-full border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.62)] px-3 py-2 text-[13.2px] font-[560] leading-none text-[rgb(var(--magicks-ink-rgb)/0.66)]">
                      Antwort meist binnen 24 Stunden
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[var(--magicks-bg-soft)] px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-24 md:px-12 md:pb-36 md:pt-28 lg:px-16">
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
              data-contact-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow>Erster Schritt</Eyebrow>
              <h2 className="font-ui mx-auto mt-7 max-w-[18ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.65rem]">
                Bereit für den ersten Schritt?
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[48rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Schreiben Sie kurz, worum es geht. MAGICKS meldet sich mit
                einer klaren Einschätzung.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta to="#anfrage" label="Anfrage senden" />
                <Link
                  to="/leistungen"
                  className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-[rgb(var(--magicks-line-rgb)/0.18)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.5)] px-5 py-3 font-ui text-[15px] font-[560] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.78)] no-underline transition-[border-color,transform,color,background-color] duration-500 hover:-translate-y-[1px] hover:border-[rgb(var(--magicks-line-rgb)/0.34)] hover:bg-[rgb(var(--magicks-bg-lifted-rgb)/0.82)] hover:text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[15.5px]"
                >
                  <span>Leistungen ansehen</span>
                  <span aria-hidden className="font-instrument italic transition-transform duration-500 group-hover:translate-x-[2px]">
                    ↗
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
