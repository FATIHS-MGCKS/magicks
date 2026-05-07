import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  focusEnvelope,
  parallaxDrift,
  presenceEnvelope,
  sectionFarewell,
} from "../../lib/scrollMotion";

/**
 * Bausteine / Bildwelt — in-house content & visual capability section.
 *
 * This is the page's *creative* beat. Where Services reads as four
 * structural capabilities, this section communicates the surrounding
 * craft work — content, SEO, image, motion, 3D — that MAGICKS produces
 * directly inside a project rather than briefing out.
 *
 * Visual language sits deliberately between Services and the rest of
 * the page: editorial split layout (title + body left, capability
 * grid right), light tiles with hanging mono indices that read as a
 * "system" rather than a chip cloud, and two restrained CTAs at the
 * tail. The light theme is enforced directly via ink tokens here —
 * earlier the section used legacy `text-white/x` utilities that
 * relied on a global remap and made the surface intent fragile.
 */

const CAPABILITIES: { label: string }[] = [
  { label: "Texte & Content" },
  { label: "SEO-Struktur" },
  { label: "Foto & Bildbearbeitung" },
  { label: "Video & Motion Design" },
  { label: "3D-Visuals" },
  { label: "Social-Media-Visuals" },
];

export function Bildwelt() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const headline = root.querySelector<HTMLElement>("[data-bw-headline]");
      const main = root.querySelector<HTMLElement>("[data-bw-main]");
      const support = root.querySelector<HTMLElement>("[data-bw-support]");
      const tiles = gsap.utils.toArray<HTMLElement>("[data-bw-tile]");
      const cta = root.querySelector<HTMLElement>("[data-bw-cta]");
      const ambient = root.querySelector<HTMLElement>("[data-bw-ambient]");
      const farewell = root.querySelector<HTMLElement>("[data-bw-farewell]");

      if (reduced) {
        gsap.set(
          [headline, main, support, ...tiles, cta, ambient, farewell],
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        );
        if (farewell) gsap.set(farewell, { opacity: 0 });
        return;
      }

      // ─── Ambient field — restrained, half the intensity of Services ─
      if (ambient) {
        gsap.set(ambient, { opacity: 0 });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root,
              start: "top 82%",
              end: "bottom 25%",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
            defaults: { ease: "none" },
          })
          .to(ambient, { opacity: 0.56, duration: 0.32, ease: "power2.out" }, 0)
          .to(ambient, { opacity: 0.72, duration: 0.36, ease: "none" }, 0.32)
          .to(ambient, { opacity: 0.34, duration: 0.32, ease: "power2.in" }, 0.68);
        parallaxDrift(ambient, { trigger: root, from: -2, to: 4, scrub: true });
      }

      // ─── Header & body envelopes ────────────────────────────────────
      // Exit weighted ~2.5–3× the entry so the headline anchors the
      // spread through the supporting paragraphs and chip list instead
      // of dissolving after a single wheel notch.
      presenceEnvelope(headline, {
        trigger: root,
        start: "top 92%",
        end: "top 0%",
        yFrom: 18,
        yTo: -8,
        blur: 3.4,
        opacityFloor: 0.22,
        holdRatio: 0.56,
        exitWeight: 2.4,
        scrub: 1.05,
      });

      focusEnvelope(main, {
        trigger: main ?? root,
        start: "top 86%",
        end: "bottom 22%",
        blur: 2.4,
        opacityFloor: 0.36,
        focusOpacity: 1,
        holdRatio: 0.64,
      });

      focusEnvelope(support, {
        trigger: support ?? root,
        start: "top 84%",
        end: "bottom 22%",
        blur: 2.2,
        opacityFloor: 0.3,
        focusOpacity: 1,
        holdRatio: 0.64,
      });

      // ─── Capability tiles: focus envelope with light stagger ────────
      focusEnvelope(tiles as HTMLElement[], {
        start: "top 88%",
        end: "bottom 14%",
        blur: 2.4,
        opacityFloor: 0.3,
        focusOpacity: 1,
        holdRatio: 0.58,
        stagger: 0.04,
      });

      // ─── CTA at the tail ────────────────────────────────────────────
      presenceEnvelope(cta, {
        trigger: cta ?? root,
        start: "top 92%",
        end: "bottom 0%",
        yFrom: 12,
        yTo: -6,
        blur: 2,
        opacityFloor: 0.28,
        holdRatio: 0.64,
      });

      sectionFarewell(farewell, {
        trigger: root,
        peak: 0.82,
        start: "bottom 80%",
        end: "bottom 0%",
        scrub: 1.0,
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="bausteine"
      className="relative overflow-hidden bg-[var(--magicks-bg-lifted)] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16"
      aria-labelledby="bildwelt-heading"
    >
      <div aria-hidden className="section-top-rule" />

      {/* Ambient field — quieter than Services so the section reads as a
          subordinate addendum rather than an independent main beat. */}
      <div
        data-bw-ambient
        aria-hidden
        className="pointer-events-none absolute inset-0 will-change-[opacity,transform]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 56% 48% at 72% 38%, rgba(34,44,64,0.07), transparent 70%)",
        }}
      />

      <div className="relative layout-max">
        <div className="mx-auto max-w-none">
          {/* Editorial split — title + body sit in the left column,
              the capability "system" tiles sit in the right column.
              On mobile the columns stack so the title leads, then the
              tiles, then the supporting copy and CTAs. */}
          <div className="grid gap-y-12 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-x-14 md:gap-y-0 lg:gap-x-20 xl:gap-x-24">
            {/* ── Left column ─────────────────────────────────────── */}
            <div className="flex flex-col">
              <span className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.22em] text-[rgb(var(--magicks-ink-rgb)/0.46)] sm:text-[11px] sm:tracking-[0.24em]">
                06 · In-house
              </span>

              <h2
                id="bildwelt-heading"
                data-bw-headline
                className="font-ui mt-5 max-w-[18ch] text-[2.32rem] font-[620] leading-[1.04] tracking-[-0.028em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:mt-6 sm:text-[3.05rem] md:text-[3.78rem] lg:text-[4.4rem]"
              >
                Alles, was ein Auftritt{" "}
                <em className="font-instrument italic font-normal text-[rgb(var(--magicks-ink-rgb)/0.6)]">
                  braucht
                </em>
                .
              </h2>

              <p
                data-bw-main
                className="font-ui mt-10 max-w-[36rem] text-[1.04rem] font-[450] leading-[1.7] tracking-[-0.005em] text-[rgb(var(--magicks-ink-rgb)/0.78)] sm:mt-12 sm:text-[1.1rem] md:text-[1.16rem]"
              >
                Ein starker Webauftritt lebt nicht nur von Layout und Code. Deshalb entstehen bei
                MAGICKS auf Wunsch auch Texte, SEO-Struktur, Fotos, Bildbearbeitung, Videos, Motion
                Design und 3D-Visuals direkt im Projekt.
              </p>

              <p
                data-bw-support
                className="font-ui mt-6 max-w-[32rem] text-[15px] font-[440] leading-[1.72] text-[rgb(var(--magicks-ink-rgb)/0.62)] sm:mt-7 md:text-[15.5px]"
              >
                So bekommt jedes Projekt eine eigene visuelle Sprache — statt austauschbarer
                Stockbilder und generischer Inhalte.
              </p>

              {/* CTA row — primary anchor → /content-bildwelt-medien,
                  secondary mono link → /seo-sichtbarkeit. Inherits the
                  About section's "label + circled arrow" idiom so the
                  section reads as a continuation, not a new island. */}
              <div
                data-bw-cta
                className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 will-change-[opacity,transform,filter] sm:mt-14"
              >
                <Link
                  to="/content-bildwelt-medien"
                  className="font-ui group inline-flex min-h-11 items-center gap-3 py-1.5 text-[15.5px] font-[540] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.92)] no-underline magicks-duration-hover magicks-ease-out transition-colors lg:min-h-0 lg:py-0"
                >
                  <span className="underline decoration-[rgb(var(--magicks-line-rgb)/0.22)] decoration-[0.5px] underline-offset-[6px] magicks-duration-hover magicks-ease-out transition-[text-decoration-color] group-hover:decoration-[rgb(var(--magicks-line-rgb)/0.68)]">
                    Mehr zu Content &amp; Medien
                  </span>
                  <span
                    aria-hidden
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgb(var(--magicks-line-rgb)/0.18)] text-[rgb(var(--magicks-ink-rgb)/0.7)] magicks-duration-hover magicks-ease-out transition-[background,border,color,transform] group-hover:-translate-y-[1px] group-hover:translate-x-[2px] group-hover:border-[rgb(var(--magicks-line-rgb)/0.36)] group-hover:bg-[rgb(var(--magicks-ink-rgb)/0.06)] group-hover:text-[rgb(var(--magicks-ink-rgb)/0.92)]"
                  >
                    <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M3 11 L11 3 M5 3 H11 V9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>

                <span aria-hidden className="hidden h-4 w-px bg-[rgb(var(--magicks-line-rgb)/0.18)] sm:inline-block" />

                <Link
                  to="/seo-sichtbarkeit"
                  className="font-mono group inline-flex min-h-11 items-center gap-2 text-[11.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.5)] no-underline magicks-duration-hover magicks-ease-out transition-colors hover:text-[rgb(var(--magicks-ink-rgb)/0.92)] sm:min-h-0 sm:text-[11px] sm:tracking-[0.22em]"
                >
                  SEO &amp; Sichtbarkeit
                  <span
                    aria-hidden
                    className="h-px w-5 bg-[rgb(var(--magicks-line-rgb)/0.34)] magicks-duration-hover magicks-ease-out transition-[width,background-color] group-hover:w-9 group-hover:bg-[rgb(var(--magicks-line-rgb)/0.7)]"
                  />
                </Link>
              </div>
            </div>

            {/* ── Right column — capability "system" tiles ─────────
                A 2-column grid of soft tiles. Each tile has a hanging
                mono index, the capability label in Apple sans, and a
                subtle accent rule that grows on hover. Reads as a
                periodic table of in-house craft, not a chip cloud. */}
            <ul
              role="list"
              className="grid grid-cols-2 gap-3 self-start sm:gap-4 md:mt-2"
            >
              {CAPABILITIES.map((c, i) => (
                <li
                  key={c.label}
                  data-bw-tile
                  className="group relative flex flex-col gap-3 rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[linear-gradient(168deg,rgba(255,255,255,0.86)_0%,rgba(247,243,234,0.7)_100%)] px-5 py-5 shadow-[0_18px_48px_-44px_rgba(20,28,44,0.32),inset_0_1px_0_rgba(255,255,255,0.78)] will-change-[opacity,filter] sm:px-6 sm:py-6"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span
                      aria-hidden
                      className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-accent-ink-rgb)/0.68)] sm:text-[11px] sm:tracking-[0.2em]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden
                      className="h-px w-8 origin-right bg-gradient-to-l from-transparent to-[rgb(var(--magicks-accent-line-rgb)/0.34)] magicks-duration-hover magicks-ease-out transition-[width,opacity] group-hover:w-12 group-hover:opacity-100"
                    />
                  </div>

                  <span className="font-ui text-[0.96rem] font-[540] leading-[1.28] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.92)] sm:text-[1.02rem] md:text-[1.06rem]">
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Section farewell — handoff into Why MAGICKS. Same idiom as
          Services so the page reads as a single editorial spread. */}
      <div
        data-bw-farewell
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 will-change-[opacity]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(46,56,76,0.08) 58%, rgba(46,56,76,0.14) 100%)",
        }}
      />
    </section>
  );
}
