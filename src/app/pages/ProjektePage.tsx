import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { featuredProjects, type Project } from "../data/projects";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { registerGsap } from "../lib/gsap";
import { runRouteReveal } from "../lib/routeReveal";
import { RouteSEO } from "../seo/RouteSEO";

type MeasureItem = {
  title: string;
  text: string;
};

type ServiceLink = {
  title: string;
  text: string;
  to: string;
};

const MEASURE_ITEMS: MeasureItem[] = [
  {
    title: "Struktur",
    text: "Informationen sind so geordnet, dass Besucher schnell verstehen, worum es geht.",
  },
  {
    title: "Nutzerführung",
    text: "Der Weg zur Anfrage, Buchung oder nächsten Handlung bleibt klar.",
  },
  {
    title: "Performance",
    text: "Die technische Basis soll schnell, stabil und mobil sauber funktionieren.",
  },
  {
    title: "Sichtbarkeit",
    text: "Seitenstruktur, Inhalte und Technik schaffen eine Grundlage für Auffindbarkeit.",
  },
  {
    title: "Wirkung",
    text: "Der Auftritt soll nicht nur gut aussehen, sondern Vertrauen und Klarheit schaffen.",
  },
];

const SERVICE_LINKS: ServiceLink[] = [
  {
    title: "Websites & Landingpages",
    text: "Digitale Auftritte, die Leistungen verständlich machen und Anfragen erleichtern.",
    to: "/websites-landingpages",
  },
  {
    title: "Shops & Produktkonfiguratoren",
    text: "Verkaufsflächen und Konfiguratoren, die Produkte klarer erklären.",
    to: "/shops-produktkonfiguratoren",
  },
  {
    title: "Web-Software",
    text: "Portale, Dashboards und Anwendungen für saubere digitale Prozesse.",
    to: "/web-software",
  },
  {
    title: "KI & Automationen",
    text: "Workflows und Integrationen, die wiederkehrende Arbeit reduzieren.",
    to: "/ki-automationen-integrationen",
  },
  {
    title: "SEO & Sichtbarkeit",
    text: "Struktur, Inhalte und Technik als Grundlage für Auffindbarkeit.",
    to: "/seo-sichtbarkeit",
  },
  {
    title: "Content, Bildwelt & Medien",
    text: "Texte, Bilder und Medien, die den Auftritt eigenständiger machen.",
    to: "/content-bildwelt-medien",
  },
  {
    title: "Website Starter",
    text: "Ein klarer Einstieg für kleinere Unternehmen mit Qualitätsanspruch.",
    to: "/website-starter",
  },
  {
    title: "Website im Abo",
    text: "Website, Pflege und Weiterentwicklung in einem planbaren Modell.",
    to: "/website-im-abo",
  },
];

function Eyebrow({ children }: { children: string }) {
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

export default function ProjektePage() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const projects = featuredProjects();
  const [featured, ...remainingProjects] = projects;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-projects-hero]");
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-projects-reveal]");

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
        heroYOffset: 16,
        revealYOffset: 18,
        blur: 4,
        duration: 0.72,
        heroStagger: 0.055,
        revealStart: "top 88%",
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <>
      <RouteSEO path="/projekte" />

      <main
        ref={rootRef}
        className="relative overflow-hidden bg-[var(--magicks-bg-base)] pt-[6.5rem] sm:pt-[7.5rem] md:pt-[8.25rem]"
      >
        <section
          data-pj-hero
          className="relative overflow-hidden px-5 pb-20 pt-8 sm:px-8 sm:pb-28 sm:pt-10 md:px-12 md:pb-36 lg:px-16 lg:pb-44"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 58% 46% at 20% 16%, rgba(166,138,98,0.14), transparent 72%), radial-gradient(ellipse 54% 42% at 82% 38%, rgba(96,128,138,0.1), transparent 76%), radial-gradient(ellipse 76% 44% at 50% 96%, rgba(255,255,255,0.58), transparent 76%)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,0.56fr)] lg:items-end lg:gap-16">
                <div>
                  <div data-projects-hero>
                    <Eyebrow>Projekte</Eyebrow>
                  </div>

                  <h1
                    data-projects-hero
                    className="font-ui mt-7 max-w-[18ch] text-[2.38rem] font-[650] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.35rem] md:text-[4.38rem] lg:text-[5.1rem]"
                  >
                    Ausgewählte Projekte von MAGICKS Studio.
                  </h1>

                  <p
                    data-projects-hero
                    className="font-ui mt-8 max-w-[55rem] text-[1.03rem] font-[480] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.1rem] md:text-[1.18rem]"
                  >
                    Einblicke in Websites, Landingpages und digitale Auftritte,
                    die MAGICKS für reale Unternehmen umgesetzt hat — mit klarer
                    Struktur, hochwertiger Gestaltung, technischer Umsetzung und
                    einem Fokus auf Wirkung im Alltag.
                  </p>

                  <div
                    data-projects-hero
                    className="mt-10 flex flex-wrap items-center gap-4 sm:mt-12"
                  >
                    <PrimaryCta to="/kontakt" label="Projekt besprechen" />
                    <SecondaryCta to="/leistungen" label="Leistungen ansehen" />
                  </div>
                </div>

                <aside
                  data-projects-hero
                  className="rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.66)] p-5 shadow-[0_24px_68px_-52px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.76)] sm:p-6"
                >
                  <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)]">
                    Projektprinzip
                  </p>
                  <p className="font-ui mt-5 text-[1rem] font-[610] leading-[1.35] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.9)]">
                    Echte Projekte. Keine erfundenen Kennzahlen. Keine
                    Demo-Cases.
                  </p>
                  <p className="font-ui mt-4 text-[14.5px] leading-[1.64] text-[rgb(var(--magicks-ink-rgb)/0.64)]">
                    Die Projektseiten zeigen reale Auftritte und qualitative
                    Einblicke. Messwerte werden nur ergänzt, wenn sie verifiziert
                    vorliegen.
                  </p>
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto grid max-w-[76rem] gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
              <div data-projects-reveal>
                <Eyebrow>Was wir zeigen</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[21ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.65rem] md:text-[3.25rem]">
                  Projekte sind hier kein dekoratives Portfolio.
                </h2>
              </div>
              <div data-projects-reveal className="lg:pt-14">
                <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                  MAGICKS zeigt Projekte mit Blick auf Aufgabe, Aufbau und
                  Alltagstauglichkeit. Entscheidend ist, was ein Auftritt leisten
                  sollte: verständlicher erklären, hochwertiger wirken,
                  Vertrauen schaffen, technisch sauber funktionieren oder eine
                  bessere Grundlage für Sichtbarkeit schaffen.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-base)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-projects-reveal className="max-w-[58rem]">
                <Eyebrow>Ausgewählte reale Projekte</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[20ch] text-[2.1rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.85rem] md:text-[3.65rem]">
                  Digitale Auftritte, an denen die Arbeit sichtbar wird.
                </h2>
              </div>

              {projects.length > 0 ? (
                <div className="mt-12 grid gap-6 md:mt-14">
                  {featured ? <FeaturedProjectCard project={featured} /> : null}

                  {remainingProjects.length > 0 ? (
                    <div className="grid gap-6 lg:grid-cols-2">
                      {remainingProjects.map((project) => (
                        <ProjectCard key={project.slug} project={project} />
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <EmptyProjectState />
              )}
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
                <div data-projects-reveal>
                  <Eyebrow>Maßstab</Eyebrow>
                  <h2 className="font-ui mt-7 max-w-[19ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.65rem] md:text-[3.25rem]">
                    Woran wir gute digitale Projekte messen.
                  </h2>
                </div>
                <div data-projects-reveal className="lg:pt-14">
                  <p className="font-ui text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                    Ein gutes Projekt endet nicht beim Design. Es muss
                    verständlich aufgebaut sein, schnell funktionieren, Nutzer
                    gut führen, technisch sauber umgesetzt sein und im Alltag des
                    Unternehmens einen echten Zweck erfüllen.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {MEASURE_ITEMS.map((item, index) => (
                  <MeasureCard key={item.title} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-40 lg:px-16">
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-projects-reveal className="max-w-[58rem]">
                <Eyebrow>Projektarten</Eyebrow>
                <h2 className="font-ui mt-7 max-w-[21ch] text-[2.05rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.75rem] md:text-[3.45rem]">
                  Welche Art von Projekten MAGICKS umsetzt.
                </h2>
                <p className="font-ui mt-7 max-w-[52rem] text-[1rem] font-[470] leading-[1.72] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                  Ein Projekt kann als Website starten und später mit SEO,
                  Content, Shop, Software oder Automation weiterwachsen.
                  Entscheidend ist, welche digitale Grundlage Ihr Unternehmen
                  wirklich braucht.
                </p>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {SERVICE_LINKS.map((link) => (
                  <ServiceAreaLink key={link.to} link={link} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[var(--magicks-bg-soft)] px-5 pb-24 pt-24 sm:px-8 sm:pb-32 sm:pt-32 md:px-12 md:pb-40 md:pt-40 lg:px-16">
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
              data-projects-reveal
              className="mx-auto max-w-[70rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <Eyebrow>Nächster Schritt</Eyebrow>
              <h2 className="font-ui mx-auto mt-7 max-w-[20ch] text-[2.2rem] font-[620] leading-[1.01] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[3rem] md:text-[3.9rem]">
                Lassen Sie uns über Ihr nächstes digitales Projekt sprechen.
              </h2>
              <p className="font-ui mx-auto mt-7 max-w-[54rem] text-[1rem] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.08rem]">
                Ob Website, Landingpage, Shop, Produktkonfigurator,
                Web-Software oder Automation: Beschreiben Sie kurz, worum es
                geht. MAGICKS meldet sich mit einer klaren Einschätzung.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
                <PrimaryCta to="/kontakt" label="Projekt besprechen" />
                <SecondaryCta to="/kontakt" label="Kontakt aufnehmen" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <article
      data-projects-reveal
      className="group overflow-hidden rounded-[1.65rem] border border-[rgb(var(--magicks-line-rgb)/0.11)] bg-[linear-gradient(160deg,rgba(255,255,255,0.86)_0%,rgba(246,242,233,0.72)_100%)] shadow-[0_28px_76px_-58px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.82)]"
    >
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <ProjectVisual project={project} large />
        <div className="flex flex-col p-6 sm:p-8 md:p-10">
          <ProjectMeta project={project} />
          <h3 className="font-ui mt-5 text-[1.9rem] font-[630] leading-[1.08] tracking-[-0.026em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.35rem] md:text-[2.75rem]">
            {project.title}
          </h3>
          <p className="font-ui mt-5 max-w-[38rem] text-[1rem] leading-[1.7] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.06rem]">
            {project.teaser}
          </p>
          <ProjectFocus project={project} />
          <ProjectActions project={project} />
        </div>
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      data-projects-reveal
      className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.62)] shadow-[0_20px_58px_-48px_rgba(20,28,44,0.3),inset_0_1px_0_rgba(255,255,255,0.74)]"
    >
      <ProjectVisual project={project} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <ProjectMeta project={project} />
        <h3 className="font-ui mt-4 text-[1.45rem] font-[630] leading-[1.12] tracking-[-0.022em] text-[rgb(var(--magicks-ink-rgb)/0.94)] sm:text-[1.72rem]">
          {project.title}
        </h3>
        <p className="font-ui mt-4 text-[15px] leading-[1.66] text-[rgb(var(--magicks-ink-rgb)/0.68)]">
          {project.teaser}
        </p>
        <ProjectFocus project={project} compact />
        <ProjectActions project={project} />
      </div>
    </article>
  );
}

function ProjectVisual({ project, large = false }: { project: Project; large?: boolean }) {
  const aspectClass = large ? "aspect-[4/3] lg:aspect-auto lg:min-h-full" : "aspect-[16/10]";

  if (project.cover) {
    return (
      <Link
        to={`/projekte/${project.slug}`}
        className={`relative block overflow-hidden bg-[rgb(var(--magicks-bg-elevated-rgb)/0.7)] no-underline ${aspectClass}`}
        aria-label={`${project.title} ansehen`}
      >
        <img
          src={project.cover.src}
          alt={project.cover.alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.018]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(20,28,44,0.24)] via-transparent to-transparent opacity-80"
        />
      </Link>
    );
  }

  return (
    <Link
      to={`/projekte/${project.slug}`}
      className={`relative block overflow-hidden bg-[linear-gradient(160deg,rgba(255,255,255,0.72)_0%,rgba(239,235,226,0.82)_100%)] no-underline ${aspectClass}`}
      aria-label={`${project.title} ansehen`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(46,56,76,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(46,56,76,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="absolute inset-6 rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.12)]" />
      <span className="font-mono absolute bottom-6 left-6 text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-ink-rgb)/0.46)]">
        Bildmaterial folgt
      </span>
    </Link>
  );
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <p className="font-mono flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.74)]">
      <span>{project.category}</span>
      {project.industry ? (
        <>
          <span aria-hidden className="text-[rgb(var(--magicks-ink-rgb)/0.28)]">
            ·
          </span>
          <span>{project.industry}</span>
        </>
      ) : null}
    </p>
  );
}

function ProjectFocus({ project, compact = false }: { project: Project; compact?: boolean }) {
  const focusItems = (project.services ?? project.goals ?? []).slice(0, compact ? 3 : 4);

  if (focusItems.length === 0) return null;

  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {focusItems.map((item) => (
        <li
          key={item}
          className="rounded-full border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[rgb(var(--magicks-bg-base-rgb)/0.5)] px-3 py-1.5 font-ui text-[13px] font-[520] leading-none text-[rgb(var(--magicks-ink-rgb)/0.68)]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-8">
      <Link
        to={`/projekte/${project.slug}`}
        className="group/link inline-flex min-h-11 items-center gap-2 font-ui text-[15px] font-[620] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.86)] no-underline transition-colors duration-500 hover:text-[rgb(var(--magicks-ink-rgb)/1)]"
      >
        Projekt ansehen
        <span aria-hidden className="font-instrument italic transition-transform duration-500 group-hover/link:translate-x-1">
          ↗
        </span>
      </Link>
      {project.publicUrl ? (
        <a
          href={project.publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/live inline-flex min-h-11 items-center gap-2 font-ui text-[14.5px] font-[560] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.58)] no-underline transition-colors duration-500 hover:text-[rgb(var(--magicks-ink-rgb)/0.9)]"
        >
          Live ansehen
          <span aria-hidden className="font-instrument italic transition-transform duration-500 group-hover/live:translate-x-1">
            ↗
          </span>
        </a>
      ) : null}
    </div>
  );
}

function MeasureCard({ item, index }: { item: MeasureItem; index: number }) {
  return (
    <article
      data-projects-reveal
      className="rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.58)] p-5 shadow-[0_18px_52px_-44px_rgba(20,28,44,0.28),inset_0_1px_0_rgba(255,255,255,0.72)]"
    >
      <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-accent-ink-rgb)/0.7)]">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="font-ui mt-4 text-[1.08rem] font-[620] leading-[1.28] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
        {item.title}
      </h3>
      <p className="font-ui mt-3 text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
        {item.text}
      </p>
    </article>
  );
}

function ServiceAreaLink({ link }: { link: ServiceLink }) {
  return (
    <Link
      data-projects-reveal
      to={link.to}
      className="group rounded-[1.05rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.48)] p-5 no-underline shadow-[0_18px_48px_-42px_rgba(20,28,44,0.24),inset_0_1px_0_rgba(255,255,255,0.68)] transition-[transform,border-color,background-color] duration-500 hover:-translate-y-[1px] hover:border-[rgb(var(--magicks-line-rgb)/0.2)] hover:bg-[rgb(var(--magicks-bg-lifted-rgb)/0.72)]"
    >
      <h3 className="font-ui text-[1.05rem] font-[620] leading-[1.3] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
        {link.title}
        <span className="font-instrument ml-2 italic text-[rgb(var(--magicks-accent-ink-rgb)/0.7)] transition-transform duration-500 group-hover:translate-x-1">
          ↗
        </span>
      </h3>
      <p className="font-ui mt-3 text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.64)]">
        {link.text}
      </p>
    </Link>
  );
}

function EmptyProjectState() {
  return (
    <div
      data-projects-reveal
      className="mt-12 rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.62)] p-6 shadow-[0_20px_58px_-48px_rgba(20,28,44,0.3),inset_0_1px_0_rgba(255,255,255,0.74)] sm:p-8"
    >
      <h3 className="font-ui text-[1.35rem] font-[620] leading-[1.2] tracking-[-0.018em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
        Weitere Projekte werden vorbereitet.
      </h3>
      <p className="font-ui mt-4 max-w-[38rem] text-[15px] leading-[1.66] text-[rgb(var(--magicks-ink-rgb)/0.68)]">
        Sobald reale Projektfreigaben und Bildmaterial vorliegen, ergänzt
        MAGICKS die Übersicht.
      </p>
    </div>
  );
}
