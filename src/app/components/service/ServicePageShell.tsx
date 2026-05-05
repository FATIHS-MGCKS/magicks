import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChapterMarker } from "../home/ChapterMarker";

export type ServicePageIncludesItem = {
  title: string;
  body: string;
};

export type ServicePageAudienceItem = {
  title: string;
  body: string;
};

export type ServicePageApproachItem = {
  title: string;
  body: string;
};

export type ServicePageRelated = {
  to: string;
  label: string;
  description: string;
};

export type ServicePageShellProps = {
  /** `§ 02 — Leistungen / Websites` etc. — chapter label above the headline. */
  chapter: { num: string; label: string };
  /** Short line above the H1. */
  eyebrow: string;
  /** Full H1. */
  h1: ReactNode;
  /** 1–2 sentences, sub-headline. */
  lead: string;
  /** Optional pillar positioning statement — a pull-quote-like line. */
  positioning?: string;
  includesIntro?: string;
  includes: ServicePageIncludesItem[];
  audience: ServicePageAudienceItem[];
  approach: ServicePageApproachItem[];
  /** Closing paragraph shown above the CTA. */
  closing?: string;
  /** Headline for the CTA card. */
  ctaHeading?: string;
  /** Copy for the CTA card. */
  ctaCopy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  related?: ServicePageRelated[];
};

/**
 * Shared layout for every service + strategic SEO landing page.
 *
 * Structure:
 *   · Hero: chapter marker, eyebrow, H1, lead
 *   · Positioning statement (optional, editorial pull quote)
 *   · "Was enthalten ist" — what's included (bullet cards)
 *   · "Für wen" — audience fit
 *   · "Wie wir arbeiten" — approach
 *   · Closing paragraph
 *   · CTA block with primary link
 *   · Related services footer
 */
export function ServicePageShell(props: ServicePageShellProps) {
  const {
    chapter,
    eyebrow,
    h1,
    lead,
    positioning,
    includesIntro,
    includes,
    audience,
    approach,
    closing,
    ctaHeading = "Projekt besprechen.",
    ctaCopy = "Kurz beschreiben, was Sie vorhaben — wir melden uns mit einer klaren Einschätzung. Kein Druck, kein Standard-Pitch.",
    ctaLabel = "Unverbindlich anfragen",
    ctaHref = "/kontakt",
    related,
  } = props;

  return (
    <main className="relative bg-[var(--magicks-bg-base)] pb-24 pt-[7rem] sm:pb-28 sm:pt-[8rem] md:pb-36 md:pt-[9rem] lg:pb-44">
      {/* Hero */}
      <section className="relative px-5 pb-20 sm:px-8 sm:pb-24 md:px-12 md:pb-28 lg:px-16">
        <div className="layout-max">
          <div className="max-w-[56rem]">
            <div className="mb-8 sm:mb-10">
              <ChapterMarker num={chapter.num} label={chapter.label} />
            </div>

            <p className="font-mono mb-5 text-[10.5px] font-medium uppercase leading-none tracking-[0.24em] text-white/50 sm:text-[11px] sm:tracking-[0.22em]">
              {eyebrow}
            </p>

            <h1 className="font-instrument text-[2.1rem] leading-[1.05] tracking-[-0.03em] text-white sm:text-[2.8rem] md:text-[3.4rem] lg:text-[3.9rem] xl:text-[4.3rem]">
              {h1}
            </h1>

            <p className="font-ui mt-8 max-w-[46rem] text-[15.5px] leading-[1.74] text-white/60 sm:mt-10 md:text-[17.5px] md:leading-[1.72]">
              {lead}
            </p>
          </div>
        </div>
      </section>

      {/* Positioning pull quote — optional */}
      {positioning ? (
        <section className="relative px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16">
          <div aria-hidden className="section-top-rule" />
          <div className="layout-max">
            <blockquote className="max-w-[44rem]">
              <span aria-hidden className="block font-instrument text-[6rem] leading-[0.5] text-white/16 sm:text-[8rem]">
                “
              </span>
              <p className="font-instrument mt-4 text-[1.45rem] leading-[1.4] tracking-[-0.012em] text-white sm:text-[1.7rem] md:text-[2rem] md:leading-[1.36]">
                {positioning}
              </p>
            </blockquote>
          </div>
        </section>
      ) : null}

      {/* Includes */}
      <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
        <div aria-hidden className="section-top-rule" />
        <div className="layout-max">
          <div className="grid gap-10 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20">
            <div className="md:pt-2">
              <p className="font-mono text-[10.75px] font-medium uppercase leading-none tracking-[0.24em] text-white/46 sm:tracking-[0.22em]">
                Enthalten
              </p>
            </div>

            <div>
              <h2 className="font-instrument text-[1.78rem] leading-[1.14] tracking-[-0.022em] text-white sm:text-[2.2rem] md:text-[2.68rem]">
                Was <em className="italic text-white/58">Teil der Arbeit</em> ist.
              </h2>

              {includesIntro ? (
                <p className="font-ui mt-6 max-w-xl text-[15px] leading-[1.72] text-white/55 md:text-[16px]">
                  {includesIntro}
                </p>
              ) : null}

              <ol className="mt-10 grid gap-6 sm:grid-cols-2 md:mt-12 md:gap-7">
                {includes.map((item, i) => (
                  <li key={item.title} className="relative pl-10 sm:pl-12">
                    <span
                      aria-hidden
                      className="font-mono absolute left-0 top-[0.2rem] text-[11.25px] font-medium leading-none tracking-[0.18em] text-white/38"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-instrument text-[1.22rem] leading-[1.24] tracking-[-0.012em] text-white md:text-[1.34rem]">
                      {item.title}
                    </h3>
                    <p className="font-ui mt-2 text-[14.5px] leading-[1.68] text-white/52 md:text-[15px]">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
        <div aria-hidden className="section-top-rule" />
        <div className="layout-max">
          <div className="grid gap-10 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20">
            <div className="md:pt-2">
              <p className="font-mono text-[10.75px] font-medium uppercase leading-none tracking-[0.24em] text-white/46 sm:tracking-[0.22em]">
                Für wen
              </p>
            </div>

            <div>
              <h2 className="font-instrument text-[1.78rem] leading-[1.14] tracking-[-0.022em] text-white sm:text-[2.2rem] md:text-[2.68rem]">
                Wer davon am meisten <em className="italic text-white/58">profitiert</em>.
              </h2>

              <ul className="mt-10 space-y-6 border-t border-white/[0.06] md:mt-12">
                {audience.map((item) => (
                  <li key={item.title} className="border-b border-white/[0.06] py-5 md:py-7">
                    <h3 className="font-instrument text-[1.18rem] leading-[1.26] tracking-[-0.008em] text-white md:text-[1.32rem]">
                      {item.title}
                    </h3>
                    <p className="font-ui mt-2 max-w-2xl text-[14.5px] leading-[1.7] text-white/56 md:text-[15.5px]">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-12 md:py-28 lg:px-16">
        <div aria-hidden className="section-top-rule" />
        <div className="layout-max">
          <div className="grid gap-10 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20">
            <div className="md:pt-2">
              <p className="font-mono text-[10.75px] font-medium uppercase leading-none tracking-[0.24em] text-white/46 sm:tracking-[0.22em]">
                Herangehensweise
              </p>
            </div>

            <div>
              <h2 className="font-instrument text-[1.78rem] leading-[1.14] tracking-[-0.022em] text-white sm:text-[2.2rem] md:text-[2.68rem]">
                Wie MAGICKS es <em className="italic text-white/58">angeht</em>.
              </h2>

              <ol className="mt-10 space-y-7 md:mt-12 md:space-y-8">
                {approach.map((item, i) => (
                  <li key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-5 md:gap-7">
                    <span className="font-mono text-[11.25px] font-medium leading-none tracking-[0.18em] text-white/45 md:text-[12px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-instrument text-[1.22rem] leading-[1.26] tracking-[-0.012em] text-white md:text-[1.34rem]">
                        {item.title}
                      </h3>
                      <p className="font-ui mt-2 max-w-xl text-[14.5px] leading-[1.7] text-white/55 md:text-[15.5px]">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              {closing ? (
                <p className="font-ui mt-14 max-w-[44rem] text-[15.5px] leading-[1.74] text-white/58 md:text-[16.5px]">
                  {closing}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-5 py-24 sm:px-8 sm:py-32 md:px-12 md:py-36 lg:px-16">
        <div aria-hidden className="section-top-rule" />
        <div className="layout-max">
          <div className="grid items-center gap-8 rounded-[1rem] border border-white/[0.08] bg-white/[0.015] px-7 py-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-14 sm:px-10 sm:py-14 md:px-14 md:py-16">
            <div className="max-w-[42rem]">
              <h2 className="font-instrument text-[1.78rem] leading-[1.08] tracking-[-0.026em] text-white sm:text-[2.16rem] md:text-[2.52rem]">
                {ctaHeading}
              </h2>
              <p className="font-ui mt-5 text-[15px] leading-[1.74] text-white/58 md:text-[16px]">
                {ctaCopy}
              </p>
            </div>

            <Link
              to={ctaHref}
              className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full border border-[rgb(var(--magicks-line-rgb)/0.22)] bg-[var(--magicks-ink-strong)] px-6 py-3.5 text-[14.5px] font-medium tracking-[0.001em] text-[var(--magicks-bg-lifted)] no-underline shadow-[0_22px_52px_-28px_rgba(20,28,44,0.48)] magicks-duration-hover magicks-ease-out transition-[transform,box-shadow] hover:-translate-y-[1px] hover:shadow-[0_30px_72px_-26px_rgba(20,28,44,0.62)] active:translate-y-0 active:scale-[0.985] sm:text-[15.5px] md:text-[16.5px]"
            >
              <span>{ctaLabel}</span>
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--magicks-bg-lifted)] text-[var(--magicks-ink-strong)] magicks-duration-hover magicks-ease-out transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
              >
                <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M3 11 L11 3 M5 3 H11 V9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Related */}
      {related && related.length > 0 ? (
        <section className="relative px-5 pb-0 pt-8 sm:px-8 md:px-12 lg:px-16">
          <div className="layout-max">
            <div className="border-t border-white/[0.06] pt-12 md:pt-16">
              <p className="font-mono mb-10 text-[10.75px] font-medium uppercase leading-none tracking-[0.24em] text-white/46 md:mb-14 sm:tracking-[0.22em]">
                Verwandte Leistungen
              </p>

              <ul className="grid gap-x-10 gap-y-4 md:grid-cols-2 md:gap-y-6">
                {related.map((r) => (
                  <li key={r.to}>
                    <Link
                      to={r.to}
                      className="group block border-b border-white/[0.06] py-5 no-underline md:py-6"
                    >
                      <div className="flex items-baseline justify-between gap-6">
                        <h3 className="font-instrument text-[1.22rem] leading-[1.24] tracking-[-0.012em] text-white magicks-duration-hover magicks-ease-out transition-colors group-hover:text-white md:text-[1.34rem]">
                          {r.label}
                        </h3>
                        <span
                          aria-hidden
                          className="font-mono shrink-0 text-[11.25px] font-medium uppercase leading-none tracking-[0.18em] text-white/38 magicks-duration-hover magicks-ease-out transition-colors group-hover:text-white/72"
                        >
                          Ansehen →
                        </span>
                      </div>
                      <p className="font-ui mt-2 max-w-2xl text-[14px] leading-[1.68] text-white/50 md:text-[15px]">
                        {r.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
