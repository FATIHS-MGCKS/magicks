import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  focusEnvelope,
  horizontalDrift,
  parallaxDrift,
  presenceEnvelope,
  sectionFarewell,
} from "../../lib/scrollMotion";

/**
 * ProblemSolver / About-Us section.
 *
 * Replaces the previous standalone "Wir sind keine klassische Agentur"
 * studio section. The composition keeps the same atmospheric language —
 * oversized quote glyph, edge-glow, scroll-coupled body envelope — but
 * is reframed around partnership and in-house capability:
 *
 *   · Heading uses the existing "precise"-style focus-collapse motion.
 *     The three short phrases of the new headline map cleanly onto the
 *     three motion slots: "Ein Partner." (left), "Ein System." (centre,
 *     italic, the dwell anchor) and "Ein gemeinsames Ziel." (right).
 *   · Reason cards are deliberately *more substantial* than the
 *     ProblemSection register — filled, lifted, accent-ruled. The
 *     contrast (austere problem rows vs. material reason cards) is the
 *     section's narrative beat: where there is absence, here there is
 *     substance.
 *   · Trust boxes are a 4-column hairline-divided masthead grid —
 *     editorial fine print, not badge UI.
 *   · Tools marquee is a continuous CSS scroll (paused on hover) of
 *     the in-house toolbelt — restrained pills, not loud chips.
 */

const REASON_CARDS = [
  {
    title: "Alles aus einer Hand",
    text: "Von Idee bis Betreuung: ein Team, ein System, keine Reibung.",
  },
  {
    title: "Wir denken mit",
    text: "Nicht einfach umgesetzt, sondern verstanden, strukturiert und weitergedacht.",
  },
  {
    title: "Kreativ und technisch stark",
    text: "Content, Design und Entwicklung greifen als ein System ineinander.",
  },
  {
    title: "Für Wirkung gebaut",
    text: "Sichtbarkeit, Performance und Nutzerführung werden von Anfang an mitgedacht.",
  },
];

const TRUST_BOXES = [
  "+10 Jahre Erfahrung",
  "100 % DSGVO-konform",
  "Alles aus einer Hand",
  "In-house Content & Creative",
];

const TOOLBELT = [
  "HTML / CSS",
  "Shopify",
  "WordPress",
  "GSAP",
  "Three.js",
  "JavaScript",
  "Python",
  "Figma",
  "Photoshop",
  "Cinema 4D",
  "After Effects",
];

export function About() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const quote = root.querySelector<HTMLElement>("[data-about-quote]");
      const left = root.querySelector<HTMLElement>("[data-about-left]");
      const center = root.querySelector<HTMLElement>("[data-about-center]");
      const right = root.querySelector<HTMLElement>("[data-about-right]");
      const body = root.querySelector<HTMLElement>("[data-about-body]");
      const cta = root.querySelector<HTMLElement>("[data-about-cta]");
      const rule = root.querySelector<HTMLElement>("[data-about-rule]");
      const heading = root.querySelector<HTMLElement>("[data-about-heading]");
      const farewell = root.querySelector<HTMLElement>("[data-about-farewell]");
      const reasonCards = gsap.utils.toArray<HTMLElement>("[data-about-reason]");
      const trustItems = gsap.utils.toArray<HTMLElement>("[data-about-trust]");
      const toolStrip = root.querySelector<HTMLElement>("[data-about-tools]");
      const emphasis = root.querySelectorAll<HTMLElement>("[data-about-emphasis]");

      if (reduced) {
        gsap.set(
          [
            quote,
            left,
            center,
            right,
            body,
            cta,
            rule,
            ...reasonCards,
            ...trustItems,
            toolStrip,
            ...emphasis,
          ].filter(Boolean) as HTMLElement[],
          {
            opacity: 1,
            x: 0,
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

      // ─── Edge Glow: wandering light along the section boundary ───────
      const edgeGlow = root.querySelector<HTMLElement>("[data-about-edgeglow]");
      if (edgeGlow) {
        gsap.fromTo(
          edgeGlow,
          { xPercent: -100, opacity: 0 },
          {
            xPercent: 100,
            opacity: 0.62,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.0,
            },
          },
        );
      }

      // ─── Quote glyph: atmospheric drift + presence envelope ──────────
      gsap.set(quote, { opacity: 0, y: 18, scale: 0.96 });
      gsap.fromTo(
        quote,
        { opacity: 0, y: 18, scale: 0.96 },
        {
          opacity: 0.46,
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
        opacity: 0.16,
        scale: 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "bottom 55%",
          end: "bottom 10%",
          scrub: 1.0,
        },
      });
      parallaxDrift(quote, { trigger: root, from: -6, to: 18, scrub: true });
      horizontalDrift(quote, { trigger: root, from: -1.5, to: 1.5, scrub: true });

      // ─── Heading: "precise"-style focus collapse (substraterx idiom) ─
      // The three short phrases map onto the three motion slots:
      //   · "Ein System."          → centre (oversized → collapses)
      //   · "Ein Partner."         → left   (slides in from left)
      //   · "Ein gemeinsames Ziel."→ right  (slides in from right)
      // The same scroll-progress bands as the previous "Zum Glück." beat
      // are reused so the section's cadence stays unchanged.
      const headingTrigger = heading ?? root;

      if (left && center && right) {
        gsap.set(center, {
          scale: 1.34,
          opacity: 0,
          transformOrigin: "50% 50%",
          willChange: "transform, opacity",
        });
        gsap.set(left, { x: -72, opacity: 0, willChange: "transform, opacity" });
        gsap.set(right, { x: 72, opacity: 0, willChange: "transform, opacity" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headingTrigger,
            start: "top 95%",
            end: "top 28%",
            scrub: 1.15,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "power2.inOut" },
        });

        // Phase 1 (0 → ~12 %) — Centre surfaces oversized.
        tl.to(center, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0);

        // Phase 2 (~12 → 42 %) — held by the absence of a tween.

        // Phase 3 (~42 → 72 %) — Centre collapses to scale 1.
        tl.to(center, { scale: 1, duration: 1.2, ease: "power3.inOut" }, 1.7);

        // Phase 4 (~68 → 100 %) — Flanks glide in around the anchor.
        tl.to(left, { x: 0, opacity: 1, duration: 1.3, ease: "power2.inOut" }, 2.7)
          .to(right, { x: 0, opacity: 1, duration: 1.3, ease: "power2.inOut" }, 2.7);
      }

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
      focusEnvelope(body, {
        trigger: body ?? root,
        start: "top 84%",
        end: "bottom 14%",
        blur: 3.2,
        opacityFloor: 0.24,
        focusOpacity: 1,
        holdRatio: 0.66,
      });

      // ─── Reason cards: stagger rise + soft blur release ──────────────
      reasonCards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 26, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: `top ${88 - i * 1.2}%`,
              end: `top ${52 - i * 1.2}%`,
              scrub: 1.0,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      // ─── Trust row: soft entrance, single envelope ───────────────────
      if (trustItems.length) {
        focusEnvelope(trustItems as HTMLElement[], {
          start: "top 92%",
          end: "bottom 22%",
          blur: 2.4,
          opacityFloor: 0.28,
          focusOpacity: 1,
          holdRatio: 0.6,
          stagger: 0.04,
        });
      }

      // ─── Toolbelt: presence envelope (marquee handles its own loop) ──
      if (toolStrip) {
        presenceEnvelope(toolStrip, {
          trigger: toolStrip,
          start: "top 95%",
          end: "bottom 8%",
          yFrom: 14,
          yTo: -6,
          blur: 2.4,
          opacityFloor: 0.28,
          holdRatio: 0.66,
        });
      }

      // ─── Body emphasis: scrubbed colour bloom ────────────────────────
      // Literal rgba() values are used here because GSAP's CSSPlugin
      // colour parser cannot tween through `rgb(var(--token) / a)` —
      // the var() collapses to NaN mid-interpolation and the colour
      // resolves to fully transparent. The tones below are the same
      // ink (#181c25) at 72 → 96 → 78 % so the scroll-coupled bloom
      // matches the rest of the section's typographic register.
      if (emphasis.length) {
        const inkSoft = "rgba(24,28,37,0.78)";
        const inkBase = "rgba(24,28,37,0.86)";
        const inkPeak = "rgba(24,28,37,0.98)";
        emphasis.forEach((em) => {
          gsap.set(em, { color: inkBase });
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
            .to(em, { color: inkPeak, duration: 0.45, ease: "power2.out" }, 0)
            .to(em, { color: inkPeak, duration: 0.25, ease: "none" }, 0.45)
            .to(em, { color: inkSoft, duration: 0.3, ease: "power2.in" }, 0.7);
        });
      }

      presenceEnvelope(cta, {
        trigger: cta ?? root,
        start: "top 94%",
        end: "bottom 0%",
        yFrom: 18,
        yTo: -6,
        blur: 2.5,
        holdRatio: 0.62,
      });

      sectionFarewell(farewell, {
        trigger: root,
        peak: 1,
        start: "bottom 80%",
        end: "bottom -5%",
        scrub: 1.0,
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="ueber"
      className="relative overflow-hidden bg-[var(--magicks-bg-lifted)] px-5 py-32 sm:px-8 sm:py-44 md:px-12 md:py-56 lg:px-12 lg:py-64 xl:px-16"
      aria-labelledby="about-heading"
    >
      <div aria-hidden className="section-top-rule" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 58% 42% at 18% 12%, rgba(34,44,64,0.09), transparent 68%), radial-gradient(ellipse 44% 36% at 84% 74%, rgba(255,255,255,0.16), transparent 72%)",
        }}
      />

      {/* Edge Glow — wandering light along the top border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] overflow-hidden"
      >
        <div
          data-about-edgeglow
          className="h-full w-1/2 bg-gradient-to-r from-transparent via-[rgb(var(--magicks-line-rgb)/0.3)] to-transparent blur-[1px] will-change-[transform,opacity]"
        />
      </div>

      {/* Oversized opening quote mark — floats as compositional anchor */}
      <div
        data-about-quote
        aria-hidden
        className="pointer-events-none absolute left-4 top-24 z-0 font-instrument leading-[0.72] text-[rgb(var(--magicks-line-rgb)/0.18)] will-change-[opacity,transform] sm:left-10 sm:top-28 md:left-16 md:top-32 lg:left-24 lg:top-36"
        style={{ fontSize: "clamp(8rem, 18vw, 22rem)" }}
      >
        “
      </div>

      <div className="relative z-10 layout-max">
        <div className="mx-auto max-w-[52rem] md:max-w-none">
          <span className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.22em] text-[rgb(var(--magicks-ink-rgb)/0.46)] sm:text-[11px] sm:tracking-[0.24em]">
            04 · Ihr Partner
          </span>

          {/* "precise"-style focus-collapse heading.
              Layout: three short phrases stacked vertically.
                · Line 1 (left)   — "Ein Partner."
                · Line 2 (centre) — "Ein System."   (italic, dwell anchor)
                · Line 3 (right)  — "Ein gemeinsames Ziel." */}
          <h2
            id="about-heading"
            data-about-heading
            className="font-ui mt-5 text-[2.42rem] font-[600] leading-[1.04] tracking-[-0.028em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:mt-6 sm:text-[3.32rem] md:text-[4.05rem] lg:text-[4.8rem] xl:text-[5.4rem]"
          >
            <span className="block">
              <span
                data-about-left
                className="inline-block will-change-[transform,opacity]"
              >
                Ein Partner.
              </span>
            </span>
            <span className="mt-1 block font-instrument italic font-normal text-[rgb(var(--magicks-ink-rgb)/0.6)] sm:mt-2">
              <span
                data-about-center
                className="inline-block will-change-[transform,opacity]"
              >
                Ein System.
              </span>
            </span>
            <span className="mt-1 block sm:mt-2">
              <span
                data-about-right
                className="inline-block will-change-[transform,opacity]"
              >
                Ein gemeinsames Ziel.
              </span>
            </span>
          </h2>

          <div className="mt-14 sm:mt-16 md:mt-20">
            <div aria-hidden className="relative h-px w-full max-w-[34rem]">
              <span
                data-about-rule
                className="absolute inset-0 block bg-gradient-to-r from-[rgb(var(--magicks-line-rgb)/0.28)] via-[rgb(var(--magicks-line-rgb)/0.12)] to-transparent"
              />
            </div>

            <div
              data-about-body
              className="mt-8 max-w-[44rem] rounded-[1.2rem] border border-[rgb(var(--magicks-line-rgb)/0.08)] bg-[linear-gradient(168deg,rgba(255,253,248,0.62)_0%,rgba(245,241,234,0.5)_100%)] px-6 py-7 will-change-[opacity,filter] sm:mt-10 sm:px-8 sm:py-8"
            >
              <p className="font-ui text-[1.04rem] font-[450] leading-[1.74] tracking-[-0.005em] text-[rgb(var(--magicks-ink-rgb)/0.78)] sm:text-[1.12rem] md:text-[1.18rem]">
                Mit uns haben Sie einen Partner, der{" "}
                <em data-about-emphasis className="font-instrument italic text-[rgb(var(--magicks-ink-rgb)/0.96)]">
                  Ihr Business versteht
                </em>{" "}
                — und nicht noch einen weiteren Dienstleister.
              </p>
              <p className="font-ui mt-5 text-[1.04rem] font-[450] leading-[1.74] tracking-[-0.005em] text-[rgb(var(--magicks-ink-rgb)/0.74)] sm:mt-6 sm:text-[1.12rem] md:text-[1.18rem]">
                Kreativ, technisch und mit klarem Fokus holen wir das meiste aus Ihrer
                Webpräsenz heraus.
              </p>
            </div>
          </div>

          {/* Reason cards — material counterpart to the ProblemSection
              register. Filled surfaces, oversized "01 / 04" notation in
              the corner, accent rule under the title that grows on
              hover. The chrome is intentional: where Problem reads as
              absence, Reason reads as substance. */}
          <ul
            role="list"
            className="mt-16 grid gap-5 sm:mt-20 sm:grid-cols-2 sm:gap-6 lg:gap-7"
          >
            {REASON_CARDS.map((card, i) => (
              <li
                key={card.title}
                data-about-reason
                className="group relative flex flex-col rounded-[1.4rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[linear-gradient(165deg,rgba(255,255,255,0.92)_0%,rgba(248,243,233,0.78)_100%)] px-7 py-8 shadow-[0_30px_80px_-50px_rgba(20,28,44,0.38),inset_0_1px_0_rgba(255,255,255,0.84)] will-change-[opacity,transform,filter] sm:px-8 sm:py-9 md:px-9 md:py-10"
              >
                <span
                  aria-hidden
                  className="absolute right-6 top-6 font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.34)] sm:right-7 sm:top-7 sm:text-[11px] sm:tracking-[0.2em]"
                >
                  {String(i + 1).padStart(2, "0")} / 04
                </span>

                <h3 className="font-ui max-w-[20ch] text-[1.3rem] font-[620] leading-[1.16] tracking-[-0.018em] text-[rgb(var(--magicks-ink-rgb)/0.96)] sm:text-[1.42rem] md:text-[1.54rem]">
                  {card.title}
                </h3>

                <span
                  aria-hidden
                  className="mt-4 block h-px w-10 bg-[rgb(var(--magicks-line-rgb)/0.34)] transition-[width,background-color] duration-[680ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:w-16 group-hover:bg-[rgb(var(--magicks-line-rgb)/0.52)]"
                />

                <p className="font-ui mt-5 max-w-[28rem] text-[0.98rem] font-[450] leading-[1.66] text-[rgb(var(--magicks-ink-rgb)/0.72)] sm:text-[1.02rem] md:text-[1.06rem]">
                  {card.text}
                </p>
              </li>
            ))}
          </ul>

          {/* Trust row — 4-column hairline-divided masthead grid. Each
              cell carries a tiny mono index above its phrase. The
              vertical dividers and uniform cell padding give the row
              the rhythm of an editorial colophon — visually distinct
              from both the Problem register and the Reason cards. */}
          <ul
            role="list"
            className="mt-16 grid grid-cols-2 divide-x divide-y divide-[rgb(var(--magicks-line-rgb)/0.14)] border border-[rgb(var(--magicks-line-rgb)/0.14)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.36)] sm:mt-20 md:mt-24 md:grid-cols-4 md:divide-y-0"
          >
            {TRUST_BOXES.map((label, i) => (
              <li
                key={label}
                data-about-trust
                className="flex flex-col items-start gap-2.5 px-5 py-6 will-change-[opacity,filter] sm:gap-3 sm:px-6 sm:py-7 md:px-7 md:py-8"
              >
                <span
                  aria-hidden
                  className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.18em] text-[rgb(var(--magicks-ink-rgb)/0.4)] sm:text-[11px] sm:tracking-[0.2em]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-ui text-[0.95rem] font-[540] leading-[1.32] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.88)] sm:text-[1rem] md:text-[1.02rem]">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          {/* Toolbelt marquee — continuous, restrained. Edge gradients
              fade the strip into the surrounding canvas so the loop
              never looks like a hard cut. The track is duplicated 1:1
              so the CSS animation can lerp between -50% and 0 cleanly. */}
          <div
            data-about-tools
            className="relative mt-14 overflow-hidden border-y border-[rgb(var(--magicks-line-rgb)/0.08)] py-6 will-change-[opacity,transform,filter] sm:mt-16 sm:py-7"
            aria-label="Werkzeuge im Studio"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--magicks-bg-lifted)] to-transparent sm:w-24"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--magicks-bg-lifted)] to-transparent sm:w-24"
            />

            <div className="tools-marquee">
              {[...TOOLBELT, ...TOOLBELT].map((tool, i) => (
                <span
                  key={`${tool}-${i}`}
                  className="font-ui mx-3 inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(165deg,rgba(255,255,255,0.78)_0%,rgba(246,242,233,0.62)_100%)] px-4 py-2 text-[0.84rem] font-[520] tracking-[-0.002em] text-[rgb(var(--magicks-ink-rgb)/0.74)] sm:mx-4 sm:px-5 sm:py-2.5 sm:text-[0.88rem]"
                  aria-hidden={i >= TOOLBELT.length}
                >
                  <span
                    aria-hidden
                    className="inline-block h-1 w-1 rounded-full bg-[rgb(var(--magicks-ink-rgb)/0.42)]"
                  />
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div
            data-about-cta
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 will-change-[opacity,transform,filter] sm:mt-14"
          >
            <Link
              to="/ueber-uns"
              className="font-ui group inline-flex min-h-12 items-center gap-3 rounded-full border border-[rgb(var(--magicks-line-rgb)/0.22)] bg-[rgb(var(--magicks-ink-rgb)/0.92)] py-2.5 pl-6 pr-2.5 text-[15px] font-[560] tracking-[-0.004em] text-[var(--magicks-bg-lifted)] no-underline shadow-[0_24px_70px_-36px_rgba(20,28,44,0.5),inset_0_1px_0_rgba(255,255,255,0.16)] transition-[transform,box-shadow,background-color] duration-[620ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[1.5px] hover:bg-[rgb(var(--magicks-ink-rgb)/0.98)] hover:shadow-[0_34px_90px_-34px_rgba(20,28,44,0.58),inset_0_1px_0_rgba(255,255,255,0.18)] sm:py-3 sm:pl-7 sm:text-[15.5px]"
              aria-label="Mehr über uns"
            >
              <span>Mehr über uns</span>
              <span
                aria-hidden
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--magicks-bg-lifted)] text-[rgb(var(--magicks-ink-rgb)/0.88)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-transform duration-[620ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[1px] group-hover:translate-x-[2px]"
              >
                <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M3 11 L11 3 M5 3 H11 V9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            <span className="font-mono text-[11px] font-medium uppercase leading-snug tracking-[0.2em] text-[rgb(var(--magicks-ink-rgb)/0.46)]">
              Kassel · Nordhessen · Remote bundesweit
            </span>
          </div>
        </div>
      </div>

      <div
        data-about-farewell
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 will-change-[opacity]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(46,56,76,0.05) 58%, rgba(46,56,76,0.12) 100%)",
        }}
      />
    </section>
  );
}
