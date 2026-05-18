import { useLayoutEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import {
  type Project,
  type ProjectCaseSection,
  type ProjectImage,
  projectBySlug,
  projectSeoDescription,
  projectSeoTitle,
} from "../data/projects";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { registerGsap } from "../lib/gsap";
import { runRouteReveal } from "../lib/routeReveal";
import { SEO } from "../seo/SEO";

type ProjectMetaItem = {
  label: string;
  value: React.ReactNode;
};

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectBySlug(slug) : undefined;

  if (!project) {
    return <ProjectNotFound />;
  }

  return <ProjectDetail project={project} />;
}

function ProjectDetail({ project }: { project: Project }) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const seoTitle = projectSeoTitle(project);
  const seoDescription = projectSeoDescription(project);
  const seoImage = project.seo?.ogImage ?? project.cover?.src;
  const prettyLiveUrl = project.publicUrl ? prettyUrl(project.publicUrl) : null;
  const galleryImages = useMemo(
    () => [project.cover, ...(project.gallery ?? [])].filter(Boolean) as ProjectImage[],
    [project.cover, project.gallery],
  );
  const primaryServiceLine = project.metaServices ?? project.services?.slice(0, 4).join(" · ") ?? project.category;

  const metaItems: ProjectMetaItem[] = [
    { label: "Kunde", value: project.clientName ?? project.title },
    { label: "Branche", value: project.industry ?? project.category },
    { label: "Leistung", value: primaryServiceLine },
    {
      label: "Website",
      value: project.publicUrl ? (
        <a
          href={project.publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[rgb(var(--magicks-ink-rgb)/0.86)] no-underline transition-colors duration-500 hover:text-[rgb(var(--magicks-ink-rgb)/1)]"
        >
          {prettyLiveUrl}
        </a>
      ) : (
        "Nicht öffentlich"
      ),
    },
  ];

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>("[data-cs-hero]");
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-cs-reveal]");

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
      <SEO
        path={`/projekte/${project.slug}`}
        title={seoTitle}
        description={seoDescription}
        ogImage={seoImage}
      />

      <main
        ref={rootRef}
        className="relative overflow-hidden bg-[var(--magicks-bg-base)] pt-[6.25rem] sm:pt-[7.25rem] md:pt-[8rem]"
      >
        <section className="relative px-5 pb-12 pt-8 sm:px-8 sm:pb-16 md:px-12 md:pb-20 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 58% 44% at 18% 12%, rgba(166,138,98,0.13), transparent 72%), radial-gradient(ellipse 52% 38% at 82% 34%, rgba(96,128,138,0.08), transparent 76%)",
            }}
          />

          <div className="relative layout-max">
            <div className="mx-auto max-w-[76rem]">
              <div data-cs-hero>
                <Link
                  to="/projekte"
                  className="font-mono inline-flex min-h-11 items-center gap-2 text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.52)] no-underline transition-colors duration-500 hover:text-[rgb(var(--magicks-ink-rgb)/0.86)] sm:tracking-[0.22em]"
                >
                  <span aria-hidden>{"\u2190"}</span>
                  Alle Projekte
                </Link>
              </div>

              <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.58fr)] lg:items-end lg:gap-16">
                <div>
                  <p
                    data-cs-hero
                    className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.76)] sm:text-[11px] sm:tracking-[0.22em]"
                  >
                    {project.category}
                  </p>

                  <h1
                    data-cs-hero
                    className="font-ui mt-6 max-w-[15ch] text-[2.55rem] font-[650] leading-[0.98] tracking-[-0.04em] text-[rgb(var(--magicks-ink-rgb)/0.97)] sm:text-[3.5rem] md:text-[4.45rem] lg:text-[5.15rem]"
                  >
                    {project.title}
                  </h1>

                  <p
                    data-cs-hero
                    className="font-ui mt-7 max-w-[42rem] text-[1.12rem] font-[560] leading-[1.5] tracking-[-0.012em] text-[rgb(var(--magicks-ink-rgb)/0.84)] sm:text-[1.25rem] md:text-[1.38rem]"
                  >
                    {project.teaser}
                  </p>

                  <p
                    data-cs-hero
                    className="font-ui mt-5 max-w-[43rem] text-[1rem] leading-[1.7] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.68)] sm:text-[1.05rem]"
                  >
                    {project.intro}
                  </p>

                  <div
                    data-cs-hero
                    className="mt-9 flex flex-wrap items-center gap-4 sm:mt-10"
                  >
                    {project.publicUrl ? (
                      <a
                        href={project.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.24)] bg-[linear-gradient(180deg,rgba(255,253,249,0.96)_0%,rgba(244,238,227,0.9)_100%)] py-2.5 pl-6 pr-2 font-ui text-[15.5px] font-[620] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.92)] no-underline shadow-[0_22px_62px_-42px_rgba(20,28,44,0.46),inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(148,124,92,0.12)] transition-[transform,box-shadow,border-color] duration-[620ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1.5px] hover:border-[rgb(var(--magicks-accent-line-rgb)/0.4)] hover:shadow-[0_32px_82px_-40px_rgba(20,28,44,0.52),inset_0_1px_0_rgba(255,255,255,0.92),inset_0_-1px_0_rgba(148,124,92,0.16)] active:translate-y-0 active:scale-[0.99]"
                      >
                        <span>Live ansehen</span>
                        <CtaArrow />
                      </a>
                    ) : null}
                    <Link
                      to="/kontakt"
                      className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-[rgb(var(--magicks-line-rgb)/0.18)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.54)] px-5 py-3 font-ui text-[15px] font-[560] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.76)] no-underline transition-[border-color,transform,color,background-color] duration-500 hover:-translate-y-[1px] hover:border-[rgb(var(--magicks-line-rgb)/0.34)] hover:bg-[rgb(var(--magicks-bg-lifted-rgb)/0.84)] hover:text-[rgb(var(--magicks-ink-rgb)/0.96)]"
                    >
                      <span>Projekt besprechen</span>
                      <span aria-hidden className="font-instrument italic transition-transform duration-500 group-hover:translate-x-[2px]">
                        ↗
                      </span>
                    </Link>
                  </div>
                </div>

                <dl
                  data-cs-hero
                  className="grid gap-0 overflow-hidden rounded-[1.35rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.68)] shadow-[0_22px_64px_-50px_rgba(20,28,44,0.3),inset_0_1px_0_rgba(255,255,255,0.78)]"
                >
                  {metaItems.map((item) => (
                    <MetaRow key={item.label} item={item} />
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-5 pb-20 sm:px-8 sm:pb-24 md:px-12 md:pb-32 lg:px-16">
          <div className="layout-max">
            <div data-cs-reveal className="mx-auto max-w-[76rem]">
              <ProjectCover image={project.cover} title={project.title} publicUrl={project.publicUrl} />
            </div>
          </div>
        </section>

        <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-32 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <div className="mx-auto max-w-[76rem]">
              <SectionHeader
                eyebrow="Kurzfassung"
                title="Was umgesetzt wurde."
                body="Ein kompakter Blick auf Aufgabe, Gestaltung und digitale Grundlage des Projekts."
              />

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {project.case.map((section, index) => (
                  <CaseSummaryCard key={`${section.title}-${index}`} section={section} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {galleryImages.length > 0 ? (
          <section className="relative bg-[var(--magicks-bg-base)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-32 lg:px-16">
            <div className="layout-max">
              <div className="mx-auto max-w-[76rem]">
                <SectionHeader
                  eyebrow="Einblicke"
                  title="Einblicke in den Auftritt."
                  body="Screens und Detailansichten aus dem Projekt."
                />

                <div className="mt-10 grid gap-5 md:grid-cols-12 md:gap-6">
                  {galleryImages.map((image, index) => (
                    <GalleryImage
                      key={`${image.src}-${index}`}
                      image={image}
                      index={index}
                      publicUrl={project.publicUrl}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {project.services && project.services.length > 0 ? (
          <section className="relative bg-[var(--magicks-bg-elevated)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-32 lg:px-16">
            <div aria-hidden className="section-top-rule" />
            <div className="layout-max">
              <div className="mx-auto grid max-w-[76rem] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
                <SectionHeader
                  eyebrow="Leistungen"
                  title="Was MAGICKS beigetragen hat."
                  body="Die wichtigsten Leistungen im Projekt, bewusst kompakt gehalten."
                />

                <ul data-cs-reveal className="flex flex-wrap content-start gap-3 lg:pt-12">
                  {project.services.map((service) => (
                    <li
                      key={service}
                      className="rounded-full border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.62)] px-4 py-2.5 font-ui text-[14.5px] font-[540] leading-none text-[rgb(var(--magicks-ink-rgb)/0.72)] shadow-[inset_0_1px_0_rgba(255,255,255,0.68)]"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ) : null}

        {project.relatedServices && project.relatedServices.length > 0 ? (
          <section className="relative bg-[var(--magicks-bg-lifted)] px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-32 lg:px-16">
            <div className="layout-max">
              <div className="mx-auto max-w-[76rem]">
                <SectionHeader
                  eyebrow="Weiterführend"
                  title="Passende Leistungen."
                  body="Nützliche interne Wege, wenn ein ähnliches Projekt geplant ist."
                />

                <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {project.relatedServices.map((link) => (
                    <Link
                      data-cs-reveal
                      key={link.to}
                      to={link.to}
                      className="group rounded-[1.05rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.46)] p-5 no-underline shadow-[0_18px_48px_-42px_rgba(20,28,44,0.24),inset_0_1px_0_rgba(255,255,255,0.68)] transition-[transform,border-color,background-color] duration-500 hover:-translate-y-[1px] hover:border-[rgb(var(--magicks-line-rgb)/0.2)] hover:bg-[rgb(var(--magicks-bg-lifted-rgb)/0.72)]"
                    >
                      <h3 className="font-ui text-[1.02rem] font-[620] leading-[1.3] tracking-[-0.013em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
                        {link.label}
                        <span className="font-instrument ml-2 italic text-[rgb(var(--magicks-accent-ink-rgb)/0.7)] transition-transform duration-500 group-hover:translate-x-1">
                          ↗
                        </span>
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

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
              data-cs-reveal
              className="mx-auto max-w-[68rem] rounded-[2rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(170deg,rgba(255,255,255,0.82)_0%,rgba(245,241,233,0.7)_100%)] px-6 py-12 text-center shadow-[0_30px_86px_-56px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.84)] sm:px-10 sm:py-14 md:px-14 md:py-18"
            >
              <p className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)] sm:tracking-[0.22em]">
                Nächster Schritt
              </p>
              <h2 className="font-ui mx-auto mt-7 max-w-[18ch] text-[2.1rem] font-[620] leading-[1.03] tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[2.85rem] md:text-[3.6rem]">
                Sie planen einen ähnlichen Webauftritt?
              </h2>
              <p className="font-ui mx-auto mt-6 max-w-[42rem] text-[1rem] leading-[1.7] text-[rgb(var(--magicks-ink-rgb)/0.7)] sm:text-[1.06rem]">
                MAGICKS entwickelt Websites, die Leistungen klar erklären,
                Vertrauen schaffen und technisch sauber umgesetzt sind.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/kontakt"
                  className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.24)] bg-[linear-gradient(180deg,rgba(255,253,249,0.96)_0%,rgba(244,238,227,0.9)_100%)] py-2.5 pl-6 pr-2 font-ui text-[15.5px] font-[620] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.92)] no-underline shadow-[0_22px_62px_-42px_rgba(20,28,44,0.46),inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-1px_0_rgba(148,124,92,0.12)] transition-[transform,box-shadow,border-color] duration-[620ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1.5px] hover:border-[rgb(var(--magicks-accent-line-rgb)/0.4)] active:translate-y-0 active:scale-[0.99]"
                >
                  <span>Projekt besprechen</span>
                  <CtaArrow />
                </Link>
                <Link
                  to="/projekte"
                  className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-[rgb(var(--magicks-line-rgb)/0.18)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.54)] px-5 py-3 font-ui text-[15px] font-[560] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.76)] no-underline transition-[border-color,transform,color,background-color] duration-500 hover:-translate-y-[1px] hover:border-[rgb(var(--magicks-line-rgb)/0.34)] hover:bg-[rgb(var(--magicks-bg-lifted-rgb)/0.84)] hover:text-[rgb(var(--magicks-ink-rgb)/0.96)]"
                >
                  <span>Alle Projekte ansehen</span>
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

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div data-cs-reveal className="max-w-[48rem]">
      <p className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)] sm:tracking-[0.22em]">
        {eyebrow}
      </p>
      <h2 className="font-ui mt-5 max-w-[18ch] text-[2rem] font-[620] leading-[1.04] tracking-[-0.032em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[2.55rem] md:text-[3.1rem]">
        {title}
      </h2>
      {body ? (
        <p className="font-ui mt-5 max-w-[42rem] text-[1rem] leading-[1.7] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.68)] sm:text-[1.05rem]">
          {body}
        </p>
      ) : null}
    </div>
  );
}

function MetaRow({ item }: { item: ProjectMetaItem }) {
  return (
    <div className="grid gap-2 border-b border-[rgb(var(--magicks-line-rgb)/0.09)] px-5 py-4 last:border-b-0 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-5 sm:px-6">
      <dt className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.42)]">
        {item.label}
      </dt>
      <dd className="font-ui m-0 text-[14.5px] font-[560] leading-[1.42] text-[rgb(var(--magicks-ink-rgb)/0.78)]">
        {item.value}
      </dd>
    </div>
  );
}

function ProjectCover({
  image,
  title,
  publicUrl,
}: {
  image?: ProjectImage;
  title: string;
  publicUrl?: string;
}) {
  if (image) {
    const content = (
      <figure className="m-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[var(--magicks-bg-lifted)] shadow-[0_28px_78px_-54px_rgba(20,28,44,0.38),inset_0_1px_0_rgba(255,255,255,0.74)] sm:aspect-[3/2] md:aspect-[16/9]">
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-cover transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.012]"
            fetchPriority="high"
          />
        </div>
        {image.caption ? (
          <figcaption className="font-ui mt-4 text-[14px] leading-[1.5] text-[rgb(var(--magicks-ink-rgb)/0.54)]">
            {image.caption}
          </figcaption>
        ) : null}
      </figure>
    );

    if (publicUrl) {
      return (
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block no-underline"
          aria-label={`${title} live ansehen`}
        >
          {content}
        </a>
      );
    }

    return content;
  }

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[linear-gradient(160deg,rgba(255,255,255,0.72)_0%,rgba(239,235,226,0.82)_100%)] shadow-[0_28px_78px_-54px_rgba(20,28,44,0.3)] sm:aspect-[3/2] md:aspect-[16/9]"
      role="img"
      aria-label={`${title} — Bildmaterial folgt`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(46,56,76,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(46,56,76,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <span className="font-mono absolute bottom-6 left-6 text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-ink-rgb)/0.46)]">
        Bildmaterial folgt
      </span>
    </div>
  );
}

function CaseSummaryCard({
  section,
  index,
}: {
  section: ProjectCaseSection;
  index: number;
}) {
  const paragraphs = Array.isArray(section.body)
    ? section.body
    : section.body
    ? [section.body]
    : [];

  return (
    <article
      data-cs-reveal
      className="rounded-[1.15rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-base-rgb)/0.5)] p-5 shadow-[0_18px_52px_-44px_rgba(20,28,44,0.24),inset_0_1px_0_rgba(255,255,255,0.7)] sm:p-6"
    >
      <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.66)]">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="font-ui mt-4 text-[1.12rem] font-[620] leading-[1.28] tracking-[-0.014em] text-[rgb(var(--magicks-ink-rgb)/0.92)]">
        {section.title}
      </h3>
      {paragraphs[0] ? (
        <p className="font-ui mt-3 text-[14.5px] leading-[1.62] text-[rgb(var(--magicks-ink-rgb)/0.66)]">
          {paragraphs[0]}
        </p>
      ) : null}
      {section.items && section.items.length > 0 ? (
        <ul className="mt-4 grid gap-2">
          {section.items.slice(0, 6).map((item) => (
            <li
              key={item}
              className="font-ui flex gap-2 text-[14px] leading-[1.5] text-[rgb(var(--magicks-ink-rgb)/0.66)]"
            >
              <span aria-hidden className="mt-[0.62em] h-1 w-1 shrink-0 rounded-full bg-[rgb(var(--magicks-accent-rgb)/0.66)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function GalleryImage({
  image,
  index,
  publicUrl,
}: {
  image: ProjectImage;
  index: number;
  publicUrl?: string;
}) {
  const colSpan = index === 0 ? "md:col-span-12" : index === 1 ? "md:col-span-7" : "md:col-span-5";
  const aspectClass = index === 0 ? "aspect-[16/10] md:aspect-[16/9]" : aspectToClass(image.aspect ?? "4/3");
  const content = (
    <figure className="m-0">
      <div className={`relative overflow-hidden rounded-[1.15rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[var(--magicks-bg-lifted)] shadow-[0_22px_58px_-50px_rgba(20,28,44,0.3)] ${aspectClass}`}>
        <img
          src={image.src}
          alt={image.alt}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.012]"
        />
      </div>
      {image.caption ? (
        <figcaption className="font-ui mt-3 text-[14px] leading-[1.5] text-[rgb(var(--magicks-ink-rgb)/0.54)]">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );

  return (
    <div data-cs-reveal className={`${colSpan} col-span-1`}>
      {publicUrl ? (
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block no-underline"
          aria-label={`Live ansehen: ${image.caption ?? "Projektbild"}`}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

function CtaArrow() {
  return (
    <span
      aria-hidden
      className="font-instrument flex h-8 w-8 items-center justify-center rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.34)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.9)] text-[1.05em] italic text-[rgb(var(--magicks-ink-rgb)/0.88)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] transition-transform duration-[620ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[2px] group-hover:translate-x-[3px]"
    >
      {"\u2197\uFE0E"}
    </span>
  );
}

function aspectToClass(aspect: ProjectImage["aspect"]): string {
  switch (aspect) {
    case "16/9":
      return "aspect-[16/9]";
    case "21/9":
      return "aspect-[21/9]";
    case "4/3":
      return "aspect-[4/3]";
    case "3/2":
      return "aspect-[3/2]";
    case "1/1":
      return "aspect-square";
    case "9/16":
      return "aspect-[9/16]";
    case "3/4":
      return "aspect-[3/4]";
    default:
      return "aspect-[4/3]";
  }
}

function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function ProjectNotFound() {
  return (
    <>
      <SEO
        path="/projekte"
        title="Projekt nicht gefunden – MAGICKS Studio"
        description="Das angefragte Projekt existiert nicht mehr oder wurde umbenannt. Zur Projektübersicht von MAGICKS Studio."
        robots="noindex, follow"
      />
      <main className="relative bg-[var(--magicks-bg-base)] px-5 pb-32 pt-[8.5rem] md:px-12">
        <div className="layout-max text-center">
          <p className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.72)] sm:tracking-[0.22em]">
            Nicht gefunden
          </p>
          <h1 className="font-ui mx-auto mt-6 max-w-[16ch] text-[2rem] font-[620] leading-[1.06] tracking-[-0.03em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[2.65rem] md:text-[3.2rem]">
            Dieses Projekt existiert nicht mehr oder wurde umbenannt.
          </h1>
          <p className="font-ui mx-auto mt-6 max-w-[36rem] text-[1rem] leading-[1.7] text-[rgb(var(--magicks-ink-rgb)/0.68)]">
            Alle veröffentlichten Arbeiten finden Sie in der aktuellen
            Projektübersicht.
          </p>
          <div className="mt-9">
            <Link
              to="/projekte"
              className="font-ui inline-flex min-h-11 items-center text-[15px] font-[580] text-[rgb(var(--magicks-ink-rgb)/0.86)] no-underline underline-offset-4 transition-colors hover:text-[rgb(var(--magicks-ink-rgb)/1)]"
            >
              ← Zur Projektübersicht
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
