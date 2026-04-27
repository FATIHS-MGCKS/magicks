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
import { ChapterMarker } from "./ChapterMarker";

/**
 * Bildwelt statt Platzhalter — homepage supporting capability section.
 *
 * Quiet editorial bridge between the four main service clusters
 * (§ 02 Leistungen) and the principles section (§ 03 Unterschied).
 * Reads as a deliberate addendum, not as a fifth main service: it
 * names the project capabilities — content, SEO, image world, media —
 * that surround the four clusters and makes the relationship visible
 * without overloading the homepage.
 *
 * Visual language is intentionally subordinate to Services:
 *   · same chapter-marker idiom, but numbered "02b" so it reads as
 *     an extension of the services chapter rather than a new one
 *   · same two-column grid (chapter | content) at md+
 *   · chips render as a flex-wrap row with index numerals — mirrors
 *     the typographic rhythm of ValueStatement's INDEX_ITEMS list
 *   · two CTAs in a single row: a primary anchor link to the
 *     content/media page and a secondary monospace link to the SEO
 *     page, balanced by an inline "Sichtbarkeit · Hinweis" caption
 *     that delivers the brief's PART 4 SEO/Sichtbarkeit mention
 */

const CHIPS: { n: string; label: string }[] = [
  { n: "¹", label: "Texte & Content" },
  { n: "²", label: "SEO-Struktur" },
  { n: "³", label: "Foto & Bildbearbeitung" },
  { n: "⁴", label: "Video & Motion Design" },
  { n: "⁵", label: "3D-Visuals" },
  { n: "⁶", label: "Social-Media-Visuals" },
];

export function Bildwelt() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const chapter = root.querySelector<HTMLElement>("[data-bw-chapter]");
      const headline = root.querySelector<HTMLElement>("[data-bw-headline]");
      const main = root.querySelector<HTMLElement>("[data-bw-main]");
      const support = root.querySelector<HTMLElement>("[data-bw-support]");
      const chips = gsap.utils.toArray<HTMLElement>("[data-bw-chip]");
      const seoLine = root.querySelector<HTMLElement>("[data-bw-seoline]");
      const cta = root.querySelector<HTMLElement>("[data-bw-cta]");
      const ambient = root.querySelector<HTMLElement>("[data-bw-ambient]");
      const farewell = root.querySelector<HTMLElement>("[data-bw-farewell]");

      if (reduced) {
        gsap.set(
          [chapter, headline, main, support, ...chips, seoLine, cta, ambient, farewell],
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
          .to(ambient, { opacity: 0.7, duration: 0.32, ease: "power2.out" }, 0)
          .to(ambient, { opacity: 0.85, duration: 0.36, ease: "none" }, 0.32)
          .to(ambient, { opacity: 0.4, duration: 0.32, ease: "power2.in" }, 0.68);
        parallaxDrift(ambient, { trigger: root, from: -3, to: 5, scrub: true });
      }

      // ─── Header & body envelopes ────────────────────────────────────
      presenceEnvelope(chapter, {
        trigger: root,
        start: "top 96%",
        end: "top 32%",
        yFrom: 14,
        yTo: -8,
        blur: 3,
        holdRatio: 0.58,
      });

      presenceEnvelope(headline, {
        trigger: root,
        start: "top 92%",
        end: "top 26%",
        yFrom: 24,
        yTo: -10,
        blur: 4.5,
        holdRatio: 0.6,
      });

      focusEnvelope(main, {
        trigger: main ?? root,
        start: "top 86%",
        end: "bottom 22%",
        blur: 3,
        opacityFloor: 0.28,
        focusOpacity: 1,
        holdRatio: 0.6,
      });

      focusEnvelope(support, {
        trigger: support ?? root,
        start: "top 84%",
        end: "bottom 22%",
        blur: 2.5,
        opacityFloor: 0.22,
        focusOpacity: 1,
        holdRatio: 0.6,
      });

      // ─── Chips: focus envelope with light stagger ───────────────────
      focusEnvelope(chips as HTMLElement[], {
        start: "top 88%",
        end: "bottom 14%",
        blur: 3,
        opacityFloor: 0.24,
        focusOpacity: 1,
        holdRatio: 0.54,
        stagger: 0.025,
      });

      // ─── SEO note + CTAs at the tail ────────────────────────────────
      focusEnvelope(seoLine, {
        trigger: seoLine ?? root,
        start: "top 92%",
        end: "bottom 8%",
        blur: 2.5,
        opacityFloor: 0.2,
        focusOpacity: 1,
        holdRatio: 0.56,
      });

      presenceEnvelope(cta, {
        trigger: cta ?? root,
        start: "top 92%",
        end: "bottom 0%",
        yFrom: 16,
        yTo: -6,
        blur: 2.5,
        holdRatio: 0.6,
      });

      sectionFarewell(farewell, {
        trigger: root,
        peak: 1,
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
      className="relative overflow-hidden bg-[#0A0A09] px-5 py-28 sm:px-8 sm:py-36 md:px-12 md:py-44 lg:px-16"
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
            "radial-gradient(ellipse 56% 48% at 72% 38%, rgba(255,255,255,0.022), transparent 70%)",
        }}
      />

      <div className="relative layout-max">
        <div className="grid gap-10 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20">
          <div data-bw-chapter className="md:pt-2">
            <ChapterMarker num="02b" label="Bausteine" />
          </div>

          <div className="max-w-[58rem]">
            <h2
              id="bildwelt-heading"
              data-bw-headline
              className="font-instrument text-[2rem] leading-[1.04] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.1rem] lg:text-[3.55rem]"
            >
              Bildwelt statt <em className="italic text-white/58">Platzhalter</em>.
            </h2>

            <div className="mt-10 grid gap-6 sm:mt-12 md:grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)] md:gap-12 md:gap-y-10">
              <p
                data-bw-main
                className="font-instrument max-w-[36rem] text-[1.12rem] leading-[1.62] tracking-[-0.005em] text-white/78 sm:text-[1.22rem] md:text-[1.32rem]"
              >
                Ein starker Webauftritt lebt nicht nur von Layout und Code. Deshalb können bei
                MAGICKS auch Texte, SEO-Struktur, Fotos, Bildbearbeitung, Videos, Motion Design
                und 3D-Visuals direkt im Projekt entstehen.
              </p>

              <p
                data-bw-support
                className="font-ui max-w-[32rem] text-[14.5px] leading-[1.7] text-white/52 md:text-[15px]"
              >
                So bekommt jedes Projekt eine eigene visuelle Sprache — statt austauschbarer
                Stockbilder und generischer Inhalte.
              </p>
            </div>

            {/* Capability chips — typographic, restrained. Each chip
                carries a hanging numeral in instrument italic that
                doubles as a quiet rhythm marker. The list reads as
                a single typographic field, not a feature grid. */}
            <div className="mt-12 sm:mt-14 md:mt-16">
              <div aria-hidden className="relative h-px w-full max-w-[36rem]">
                <span
                  className="absolute inset-0 block bg-gradient-to-r from-white/28 via-white/10 to-transparent"
                />
              </div>
              <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-3.5 sm:mt-9 sm:gap-x-10">
                {CHIPS.map((c) => (
                  <li
                    key={c.label}
                    data-bw-chip
                    className="flex items-baseline gap-2 will-change-[opacity,filter]"
                  >
                    <span className="font-instrument text-[15px] italic text-white/52">
                      {c.n}
                    </span>
                    <span className="font-mono text-[11.5px] font-medium uppercase leading-none tracking-[0.18em] text-white/62 sm:text-[11px] sm:tracking-[0.26em]">
                      {c.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quiet visibility note — the homepage's PART 4 SEO mention.
                Sits as an inline italic register, links naturally into
                the SEO page without claiming a section of its own. */}
            <div
              data-bw-seoline
              className="mt-12 max-w-[44rem] border-t border-white/[0.08] pt-9 will-change-[opacity,filter] sm:mt-14 sm:pt-10 md:mt-16 md:pt-12"
            >
              <p className="font-instrument text-[1.05rem] italic leading-[1.55] tracking-[-0.005em] text-white/68 sm:text-[1.12rem] md:text-[1.18rem]">
                Gute digitale Auftritte müssen nicht nur gestaltet und gebaut werden. Sie
                brauchen Struktur, Inhalte und technische Grundlagen, damit sie verstanden und
                gefunden werden können.
              </p>
            </div>

            {/* CTA row — primary anchor → /content-bildwelt-medien,
                secondary mono link → /seo-sichtbarkeit. Both reuse the
                existing About-style "label + circled arrow" idiom so
                the section feels native, not bolted on. */}
            <div
              data-bw-cta
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 will-change-[opacity,transform,filter] sm:mt-12 md:mt-14"
            >
              <Link
                to="/content-bildwelt-medien"
                className="font-ui group inline-flex min-h-11 items-center gap-3 py-1.5 text-[15px] text-white no-underline magicks-duration-hover magicks-ease-out transition-colors lg:min-h-0 lg:py-0"
              >
                <span className="underline decoration-white/22 decoration-[0.5px] underline-offset-[6px] magicks-duration-hover magicks-ease-out transition-[text-decoration-color] group-hover:decoration-white/80">
                  Mehr zu Content &amp; Medien
                </span>
                <span
                  aria-hidden
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/65 magicks-duration-hover magicks-ease-out transition-[background,border,color,transform] group-hover:translate-x-[1px] group-hover:border-white/32 group-hover:bg-white/8 group-hover:text-white"
                >
                  <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M3 11 L11 3 M5 3 H11 V9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>

              <span aria-hidden className="hidden h-4 w-px bg-white/14 sm:inline-block" />

              <Link
                to="/seo-sichtbarkeit"
                className="font-mono group inline-flex min-h-11 items-center gap-2 text-[11.5px] font-medium uppercase leading-none tracking-[0.18em] text-white/55 no-underline magicks-duration-hover magicks-ease-out transition-colors hover:text-white sm:min-h-0 sm:text-[11px] sm:tracking-[0.28em]"
              >
                SEO &amp; Sichtbarkeit
                <span
                  aria-hidden
                  className="h-px w-5 bg-white/40 magicks-duration-hover magicks-ease-out transition-[width,background-color] group-hover:w-9 group-hover:bg-white"
                />
              </Link>
            </div>
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
            "linear-gradient(180deg, transparent 0%, rgba(8,8,10,0.32) 58%, rgba(8,8,10,0.58) 100%)",
        }}
      />
    </section>
  );
}
