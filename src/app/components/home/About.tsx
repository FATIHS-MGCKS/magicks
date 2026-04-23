import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  breathingScale,
  focusEnvelope,
  horizontalDrift,
  parallaxDrift,
  presenceEnvelope,
  sectionFarewell,
} from "../../lib/scrollMotion";
import { ChapterMarker } from "./ChapterMarker";

/**
 * About breathes as the user scrolls. Each element has its own envelope:
 * the oversized quote glyph drifts and dims; the two-line statement
 * arrives mask-wrapped and releases with a slow rise; the body clarifies
 * into its reading zone and softens on the way out; the editorial visual
 * gently floats in and out; CTA and signature sit at the tail, following
 * the same three-zone cadence.
 *
 * Nothing stays "revealed forever" — everything is a function of where
 * the section sits in the viewport.
 */
export function About() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const chapter = root.querySelector<HTMLElement>("[data-about-chapter]");
      const quote = root.querySelector<HTMLElement>("[data-about-quote]");
      const line1 = gsap.utils.toArray<HTMLElement>("[data-about-l1]");
      const line2 = gsap.utils.toArray<HTMLElement>("[data-about-l2]");
      const body = root.querySelector<HTMLElement>("[data-about-body]");
      const visual = root.querySelector<HTMLElement>("[data-about-visual]");
      const cta = root.querySelector<HTMLElement>("[data-about-cta]");
      const sign = root.querySelector<HTMLElement>("[data-about-sign]");
      const rule = root.querySelector<HTMLElement>("[data-about-rule]");
      const heading = root.querySelector<HTMLElement>("[data-about-heading]");
      const farewell = root.querySelector<HTMLElement>("[data-about-farewell]");
      const emphasis = root.querySelectorAll<HTMLElement>("[data-about-emphasis]");

      if (reduced) {
        gsap.set(
          [chapter, quote, ...line1, ...line2, body, visual, cta, sign, rule, farewell, ...emphasis],
          {
            opacity: 1,
            y: 0,
            yPercent: 0,
            scale: 1,
            scaleX: 1,
            filter: "blur(0px)",
          },
        );
        if (farewell) gsap.set(farewell, { opacity: 0 });
        return;
      }

      // ─── Quote glyph: atmospheric drift + presence envelope ──────────
      // Stays as the compositional anchor. Its opacity breathes as the
      // section passes through the viewport, and it drifts down slowly
      // across the full range. The result is that no state feels "done"
      // — the glyph is always gently moving.
      gsap.set(quote, { opacity: 0, y: 18, scale: 0.96 });
      gsap.fromTo(
        quote,
        { opacity: 0, y: 18, scale: 0.96 },
        {
          opacity: 0.58,
          y: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            end: "top 35%",
            scrub: 1.0,
          },
        },
      );
      gsap.to(quote, {
        opacity: 0.1,
        scale: 1.03,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "bottom 55%",
          end: "bottom 10%",
          scrub: 1.0,
        },
      });
      parallaxDrift(quote, { trigger: root, from: -6, to: 18, scrub: true });
      // Tiny horizontal drift so the glyph never sits pinned. 1.5% total.
      horizontalDrift(quote, { trigger: root, from: -1.5, to: 1.5, scrub: true });

      // ─── Chapter marker: envelope + sub-drift ────────────────────────
      presenceEnvelope(chapter, {
        trigger: root,
        start: "top 98%",
        end: "top 32%",
        yFrom: 14,
        yTo: -8,
        blur: 3,
        holdRatio: 0.58,
      });
      // Ultra-subtle lateral drift — the marker isn't anchored to the
      // page grid, it belongs to the moment of reading.
      horizontalDrift(chapter, { trigger: root, from: -0.6, to: 0.6, scrub: true });

      // ─── Two-line statement: scrubbed mask-reveal ────────────────────
      // Each word rides a yPercent mask. The scrub ties the arrival to
      // the scroll, and the exit softens slightly rather than holding —
      // that extra release is what makes the section feel alive.
      const words1 = line1;
      const words2 = line2;
      const headingTrigger = heading ?? root;

      words1.forEach((w, i) => {
        gsap.set(w, { yPercent: 100, opacity: 0 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headingTrigger,
            start: "top 82%",
            end: "bottom 35%",
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "none" },
        });
        const eStart = 0.05 + i * 0.025;
        const eEnd = 0.28 + i * 0.02;
        const xStart = 0.72;
        const xEnd = 0.96;
        tl.fromTo(
          w,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: eEnd - eStart, ease: "power2.out" },
          eStart,
        );
        tl.to(w, { yPercent: 0, opacity: 1, duration: xStart - eEnd, ease: "none" }, eEnd);
        tl.to(w, { yPercent: -22, opacity: 0.38, duration: xEnd - xStart, ease: "power2.in" }, xStart);
      });

      words2.forEach((w, i) => {
        gsap.set(w, { yPercent: 100, opacity: 0 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headingTrigger,
            start: "top 82%",
            end: "bottom 35%",
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "none" },
        });
        const eStart = 0.22 + i * 0.04;
        const eEnd = 0.42 + i * 0.04;
        const xStart = 0.74;
        const xEnd = 0.96;
        tl.fromTo(
          w,
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: eEnd - eStart, ease: "power2.out" },
          eStart,
        );
        tl.to(w, { yPercent: 0, opacity: 1, duration: xStart - eEnd, ease: "none" }, eEnd);
        tl.to(w, { yPercent: -22, opacity: 0.38, duration: xEnd - xStart, ease: "power2.in" }, xStart);
      });

      // ─── Rule: bidirectional scale ───────────────────────────────────
      gsap.fromTo(
        rule,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rule,
            start: "top 85%",
            end: "top 55%",
            scrub: 0.9,
          },
        },
      );
      gsap.to(rule, {
        scaleX: 0.55,
        ease: "none",
        scrollTrigger: {
          trigger: rule,
          start: "top 30%",
          end: "bottom -30%",
          scrub: 1.0,
        },
      });

      // ─── Body copy: focus envelope with extended hold ────────────────
      // Soft ghost opacity at the edges, crisp in the reading zone. This
      // is where the user actually sits and reads — the hold is the
      // longest on the page (0.68) so the paragraph settles before
      // anything else moves.
      focusEnvelope(body, {
        trigger: body ?? root,
        start: "top 84%",
        end: "bottom 14%",
        blur: 3.5,
        opacityFloor: 0.22,
        focusOpacity: 1,
        holdRatio: 0.68,
      });

      // ─── Body emphasis: scrubbed color bloom ─────────────────────────
      // The "eine Arbeit" <em> brightens into full white as the body
      // passes through the reading zone, then releases. Not a reveal —
      // the word is legible from the start; the bloom is a *focus pull*
      // on meaning.
      if (emphasis.length) {
        emphasis.forEach((em) => {
          gsap.set(em, { color: "rgba(255,255,255,0.72)" });
          gsap
            .timeline({
              scrollTrigger: {
                trigger: em,
                start: "top 78%",
                end: "bottom 28%",
                scrub: 1.0,
                invalidateOnRefresh: true,
              },
              defaults: { ease: "none" },
            })
            .to(em, { color: "rgba(255,255,255,1)", duration: 0.45, ease: "power2.out" }, 0)
            .to(em, { color: "rgba(255,255,255,1)", duration: 0.25, ease: "none" }, 0.45)
            .to(em, { color: "rgba(255,255,255,0.78)", duration: 0.3, ease: "power2.in" }, 0.7);
        });
      }

      // ─── Editorial visual: gentle drift + envelope ───────────────────
      // Builds in with a restrained scale + blur release. Drifts very
      // subtly across the full scroll — never a Ken-Burns, just enough
      // to read as "a live photograph," not a static card.
      if (visual) {
        gsap.set(visual, { opacity: 0, y: 26, scale: 0.99, filter: "blur(5px)" });
        gsap.fromTo(
          visual,
          { opacity: 0, y: 26, scale: 0.99, filter: "blur(5px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: visual,
              start: "top 85%",
              end: "top 45%",
              scrub: 0.9,
            },
          },
        );
        gsap.to(visual, {
          opacity: 0.55,
          y: -12,
          filter: "blur(2px)",
          ease: "none",
          scrollTrigger: {
            trigger: visual,
            start: "bottom 45%",
            end: "bottom 8%",
            scrub: 0.9,
          },
        });

        const visualImg = visual.querySelector<HTMLElement>("img");
        if (visualImg) {
          parallaxDrift(visualImg, { trigger: visual, from: -4, to: 4, scrub: true });
        }
      }

      // ─── CTA + signature: tail-end envelopes ─────────────────────────
      presenceEnvelope(cta, {
        trigger: cta ?? root,
        start: "top 94%",
        end: "bottom 0%",
        yFrom: 18,
        yTo: -6,
        blur: 2.5,
        holdRatio: 0.62,
      });

      presenceEnvelope(sign, {
        trigger: sign ?? root,
        start: "top 92%",
        end: "bottom -12%",
        yFrom: 12,
        yTo: -4,
        blur: 2,
        opacityFloor: 0,
        holdRatio: 0.7,
      });
      // Signature drifts very slightly laterally — it's a handwritten
      // sign-off, not a pinned footer tag. Keep amplitude under 0.8%.
      horizontalDrift(sign, { trigger: sign ?? root, from: -0.8, to: 0.8, scrub: true });

      // ─── Section farewell ────────────────────────────────────────────
      sectionFarewell(farewell, {
        trigger: root,
        peak: 1,
        start: "bottom 80%",
        end: "bottom -5%",
        scrub: 1.0,
      });

      // ─── Chapter breathing: extremely subtle scale pulse ─────────────
      // The chapter marker is a tiny typographic anchor. Breathing it
      // by 0.6% gives the header a *pulse* across the whole section
      // without any visible animation.
      breathingScale(chapter, {
        trigger: root,
        from: 0.996,
        peak: 1.006,
        to: 1.0,
        scrub: 1.6,
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const LINE_1 = ["Wir", "sind", "keine", "klassische", "Agentur."];
  const LINE_2 = ["Zum", "Glück."];

  return (
    <section
      ref={rootRef}
      id="ueber"
      className="relative overflow-hidden bg-[#0B0A09] px-5 py-36 sm:px-8 sm:py-48 md:px-12 md:py-64 lg:px-16 lg:py-72"
      aria-labelledby="about-heading"
    >
      <div aria-hidden className="section-top-rule" />

      {/* Oversized opening quote mark — floats as compositional anchor */}
      <div
        data-about-quote
        aria-hidden
        className="pointer-events-none absolute left-4 top-24 z-0 font-instrument leading-[0.72] text-white/18 will-change-[opacity,transform] sm:left-10 sm:top-28 sm:text-[12rem] md:left-16 md:top-32 md:text-[18rem] lg:left-24 lg:top-36 lg:text-[22rem]"
        style={{ fontSize: "clamp(8rem, 18vw, 22rem)" }}
      >
        “
      </div>

      <div className="relative z-10 layout-max">
        <div className="grid gap-12 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20">
          <div data-about-chapter className="md:pt-2">
            <ChapterMarker num="04" label="Studio" />
          </div>

          <div className="max-w-[52rem]">
            <h2
              id="about-heading"
              data-about-heading
              className="font-instrument text-[2.4rem] leading-[0.96] tracking-[-0.038em] text-white sm:text-[3.2rem] md:text-[4.2rem] lg:text-[5rem] xl:text-[5.6rem]"
            >
              <span className="block">
                {LINE_1.map((w, i) => (
                  <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
                    <span data-about-l1 className="inline-block will-change-transform">
                      {w}
                    </span>
                  </span>
                ))}
              </span>
              <span className="mt-2 block italic text-white/58 sm:mt-3">
                {LINE_2.map((w, i) => (
                  <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
                    <span data-about-l2 className="inline-block will-change-transform">
                      {w}
                    </span>
                  </span>
                ))}
              </span>
            </h2>

            <div className="mt-14 sm:mt-16 md:mt-20">
              <div aria-hidden className="relative h-px w-full max-w-[34rem]">
                <span
                  data-about-rule
                  className="absolute inset-0 block bg-gradient-to-r from-white/28 via-white/10 to-transparent"
                />
              </div>

              <div
                data-about-body
                className="mt-8 max-w-[40rem] will-change-[opacity,filter] sm:mt-10"
              >
                <p className="font-instrument text-[1.15rem] leading-[1.68] tracking-[-0.005em] text-white/78 sm:text-[1.25rem] md:text-[1.35rem]">
                  MAGICKS arbeitet als kleines, fokussiertes Studio aus Kassel. Wenige Projekte pro
                  Jahr — dafür mit voller Aufmerksamkeit. Gestaltung, Web und Software laufen hier
                  als <em data-about-emphasis className="italic text-white">eine Arbeit</em>, nicht als getrennte
                  Abteilungen. Wir glauben, dass gute digitale Arbeit sichtbar wird — nicht durch
                  Effekte, sondern durch Substanz, Ruhe und Systeme, die auch in zwei Jahren noch
                  Sinn ergeben.
                </p>
              </div>
            </div>

            {/* Editorial visual — single compositional anchor for the section. */}
            <figure
              data-about-visual
              className="mt-16 ml-auto max-w-[34rem] will-change-[opacity,transform,filter] sm:mt-20 md:mt-24"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[0.95rem] border border-white/[0.08] bg-[#0A0A0A] shadow-[0_2px_6px_-1px_rgba(0,0,0,0.55),0_44px_130px_-60px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)]">
                <img
                  src="/media/home/about-studio.webp"
                  alt="Ruhiger Studio-Arbeitsplatz: Leinen-Notizbuch, Messinglineal, gefaltete Print-Proofs, Olivenzweig und ein matter Laptop bei weichem Seitenlicht."
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
                  style={{ filter: "saturate(0.95) contrast(1.03)" }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0A09]/55 via-transparent to-[#0B0A09]/10"
                />

                {/* Tiny editorial folio marker — top-left, inside the frame.
                    Reads like a caption on an archival contact sheet. */}
                <div
                  aria-hidden
                  className="font-mono pointer-events-none absolute left-4 top-4 flex items-center gap-2 text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/58 sm:left-5 sm:top-5"
                >
                  <span>Fig. 04</span>
                  <span aria-hidden className="h-px w-5 bg-white/28" />
                  <span>Arbeitsplatz</span>
                </div>
              </div>

              <figcaption className="font-mono mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[10px] font-medium uppercase leading-none tracking-[0.32em] text-white/42">
                <span className="flex items-center gap-3">
                  <span aria-hidden className="h-px w-8 bg-white/26" />
                  <span>Studio · Kassel</span>
                </span>
                <span className="text-white/34">N51°19′ · E9°29′</span>
              </figcaption>
            </figure>

            <div
              data-about-cta
              className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-5 will-change-[opacity,transform,filter] sm:mt-16"
            >
              <Link
                to="/ueber-uns"
                className="font-ui group inline-flex items-center gap-3 text-[15px] text-white no-underline magicks-duration-hover magicks-ease-out transition-colors"
              >
                <span className="underline decoration-white/22 decoration-[0.5px] underline-offset-[6px] magicks-duration-hover magicks-ease-out transition-[text-decoration-color] group-hover:decoration-white/80">
                  Mehr über das Studio
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

              <span className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.3em] text-white/38">
                Kassel · Nordhessen · Remote bundesweit
              </span>
            </div>

            {/* Signature line — bottom-right, ultra-small */}
            <div
              data-about-sign
              className="mt-20 flex items-center justify-end gap-4 will-change-[opacity,transform,filter] sm:mt-24"
            >
              <span aria-hidden className="h-px w-16 bg-white/22" />
              <span className="font-instrument text-[0.95rem] italic text-white/55">Magicks</span>
              <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/35">
                · Studio
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section farewell — ink shadow handoff into Final CTA. */}
      <div
        data-about-farewell
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 will-change-[opacity]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(7,6,5,0.32) 58%, rgba(7,6,5,0.6) 100%)",
        }}
      />
    </section>
  );
}
