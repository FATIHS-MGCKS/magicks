import { useLayoutEffect, useRef } from "react";
import { Award, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  presenceEnvelope,
  rackFocusTrack,
  sectionFarewell,
} from "../../lib/scrollMotion";
import { MagicksSignatureReveal } from "./MagicksSignatureReveal";

/**
 * Four statement lines. The lens rack-pulls down the paragraph as the user
 * scrolls — each line exists in layout from the start as soft-focused
 * ghost text, and every line's clarity is a direct function of scroll
 * position. Scrolling back up reverses the pull cleanly.
 *
 * A luminous focus band (a thin horizontal light) rides beside the
 * active line as a physical "lens carriage" — it's never called out,
 * but the eye registers that something is *moving with the read*.
 */
type ValueStatementBlock =
  | {
      tone: "headline";
      primary: string;
      secondary: string;
    }
  | {
      tone: "body";
      text: string;
    };

const STATEMENT_BLOCKS: ValueStatementBlock[] = [
  {
    tone: "headline",
    primary: "Der erste Eindruck entscheidet.",
    secondary: "Der zweite bleibt.",
  },
  {
    tone: "body",
    text:
      "Wir kreieren starke digitale Auftritte, die Ihre Besucher überzeugen und Ihrem Unternehmen zu mehr Umsatz und Wachstum verhelfen.",
  },
];

const TRUST_BADGES = [
  {
    title: "Alles aus einer Hand",
    text: "Strategie, Design, Entwicklung, SEO, Hosting und Optimierung aus einem klaren Prozess.",
    Icon: Layers3,
  },
  {
    title: "Kreativer Content inklusive",
    text: "Texte, Bilder, Videos und visuelle Konzepte entstehen direkt bei uns im Studio.",
    Icon: Sparkles,
  },
  {
    title: "100% DSGVO-konform",
    text: "Saubere technische Umsetzung mit Blick auf Datenschutz, Performance und Sicherheit.",
    Icon: ShieldCheck,
  },
  {
    title: "+10 Jahre Erfahrung",
    text: "Erfahrung aus Design, Webentwicklung, Automationen und digitalen Geschäftsprozessen.",
    Icon: Award,
  },
] as const;

const SOFTWARE_LOGOS = [
  { name: "HTML", src: "/media/home/software-logos/html.svg" },
  { name: "CSS", src: "/media/home/software-logos/css.svg" },
  { name: "Shopify", src: "/media/home/software-logos/shopify.svg" },
  { name: "WordPress", src: "/media/home/software-logos/wordpress.svg" },
  { name: "GSAP", src: "/media/home/software-logos/gsap.svg" },
  { name: "Three.js", src: "/media/home/software-logos/threejs.svg" },
  { name: "JavaScript", src: "/media/home/software-logos/javascript.svg" },
  { name: "Python", src: "/media/home/software-logos/python.svg" },
  { name: "Figma", src: "/media/home/software-logos/figma.svg" },
  { name: "Photoshop", src: "/media/home/software-logos/photoshop.svg" },
  { name: "Cinema 4D", src: "/media/home/software-logos/cinema4d.svg" },
  { name: "After Effects", src: "/media/home/software-logos/after-effects.svg" },
] as const;

export function ValueStatement() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const { gsap, ScrollTrigger } = registerGsap();
    let removeFocusBandListeners: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const sentences = gsap.utils.toArray<HTMLElement>("[data-value-sentence]");
      const heading = root.querySelector<HTMLElement>("[data-value-heading]");
      const focusBand = root.querySelector<HTMLElement>("[data-value-focusband]");
      const ambient = root.querySelector<HTMLElement>("[data-value-ambient]");
      const spotlight = root.querySelector<HTMLElement>("[data-value-spotlight]");
      const godray = root.querySelector<HTMLElement>("[data-value-godray] > div");
      const farewell = root.querySelector<HTMLElement>("[data-value-farewell]");
      const sign = root.querySelector<HTMLElement>("[data-value-sign]");
      const proofItems = gsap.utils.toArray<HTMLElement>("[data-value-proof]");
      const setFocusBandY = focusBand ? gsap.quickSetter(focusBand, "y", "px") : null;
      const setFocusBandOpacity = focusBand ? gsap.quickSetter(focusBand, "opacity") : null;
      let cachedSentenceCenters: number[] = [];

      const updateFocusBandGeometry = () => {
        if (!focusBand || !sentences.length) return;
        const parent = heading ?? root;
        const parentRect = parent.getBoundingClientRect();
        cachedSentenceCenters = sentences.map((sentence) => {
          const rect = sentence.getBoundingClientRect();
          return rect.top + rect.height / 2 - parentRect.top;
        });
      };

      if (reduced) {
        gsap.set(
          [
            ...sentences,
            ...proofItems,
            focusBand,
            ambient,
            spotlight,
            godray,
            farewell,
            sign,
          ].filter(Boolean) as HTMLElement[],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            scaleX: 1,
            filter: "blur(0px)",
          },
        );
        if (focusBand) gsap.set(focusBand, { opacity: 0 });
        if (farewell) gsap.set(farewell, { opacity: 0 });
        return;
      }

      // ─── Ambient field: a wide radial light follows the focus pull ────
      // Anchored behind the paragraph. Builds as line 1 reaches focus,
      // peaks through lines 2-3, softens as line 4 lands the close.
      if (ambient) {
        gsap.set(ambient, { opacity: 0 });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: heading ?? root,
              start: "top 78%",
              end: "bottom 30%",
              scrub: 1.1,
              invalidateOnRefresh: true,
            },
            defaults: { ease: "none" },
          })
          .to(ambient, { opacity: 0.72, duration: 0.35, ease: "power2.out" }, 0)
          .to(ambient, { opacity: 0.86, duration: 0.3, ease: "none" }, 0.35)
          .to(ambient, { opacity: 0.48, duration: 0.35, ease: "power2.in" }, 0.65);
      }

      // ─── Spotlight sweep: warm cinematic key light ────────────────────
      // A broad key light glides across the statement as the rack-focus
      // travels downward. It keeps the section cinematic without turning
      // into a hard visual effect.
      if (spotlight) {
        gsap.set(spotlight, { opacity: 0, xPercent: -8, scale: 0.96 });
        gsap
          .timeline({
            scrollTrigger: {
              trigger: heading ?? root,
              start: "top 82%",
              end: "bottom 20%",
              scrub: 1.25,
              invalidateOnRefresh: true,
            },
            defaults: { ease: "none" },
          })
          .to(spotlight, { opacity: 0.56, xPercent: 0, scale: 1, duration: 0.4, ease: "power2.out" }, 0)
          .to(spotlight, { opacity: 0.64, xPercent: 7, scale: 1.04, duration: 0.28, ease: "none" }, 0.4)
          .to(spotlight, { opacity: 0.24, xPercent: 11, scale: 1.08, duration: 0.32, ease: "power2.in" }, 0.68);
      }

      // ─── Volumetric God Ray: slow diagonal sweep ─────────────────────
      // Drifts across the text as the user scrolls, creating a sense of
      // depth and atmosphere.
      if (godray) {
        gsap.fromTo(
          godray,
          { opacity: 0, xPercent: -12, yPercent: -16 },
          {
            opacity: 0.66,
            xPercent: 8,
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1.5,
            },
          },
        );
      }

      // ─── Rack-focus sentence track ───────────────────────────────────
      // Wider hold ratio → each sentence reads sharply for longer before
      // handing off. Emits an `onProgress` signal so the luminous band can
      // track which sentence currently holds the lens.
      rackFocusTrack(sentences, {
        trigger: heading ?? root,
        start: "top 82%",
        end: "bottom 24%",
        scrub: 1.15,
        blur: 4.5,
        mobileBlur: 1.1,
        softOpacity: 0.48,
        reachOpacity: 1,
        holdRatio: 0.68,
        onProgress: (_idx, progress) => {
          if (!focusBand || !sentences.length) return;
          if (!cachedSentenceCenters.length) updateFocusBandGeometry();
          if (!cachedSentenceCenters.length) return;
          // Position the band along the paragraph height. We interpolate
          // through the sentence centers so the band moves
          // continuously, not in steps — even the "between" positions
          // read as the lens traversing space.
          const centers = cachedSentenceCenters;
          const indexFloat = Math.max(0, Math.min(centers.length - 1, progress * centers.length - 0.5));
          const lo = Math.floor(indexFloat);
          const hi = Math.min(centers.length - 1, lo + 1);
          const t = indexFloat - lo;
          const y = centers[lo] + (centers[hi] - centers[lo]) * t;
          setFocusBandY?.(y);
          setFocusBandOpacity?.(0.74);
        },
      });

      if (focusBand && sentences.length) {
        updateFocusBandGeometry();
        ScrollTrigger.addEventListener("refreshInit", updateFocusBandGeometry);
        ScrollTrigger.addEventListener("refresh", updateFocusBandGeometry);
        removeFocusBandListeners = () => {
          ScrollTrigger.removeEventListener("refreshInit", updateFocusBandGeometry);
          ScrollTrigger.removeEventListener("refresh", updateFocusBandGeometry);
        };
      }

      // ─── Editorial signature: scroll-coupled in/out envelope ─────────
      // The handwritten signature is the tail anchor of the value
      // statement. Wrapper plays a clean opacity + y + blur entry on
      // enter and reverses on leave — in sync with the inner
      // MagicksSignatureReveal which has its own ScrollTrigger for the
      // photographic exposure effect.
      if (sign) {
        presenceEnvelope(sign, {
          trigger: sign,
          start: "top 90%",
          end: "bottom 14%",
          yFrom: 12,
          yTo: -8,
          blur: 2.6,
          opacityFloor: 0.18,
          holdRatio: 0.62,
          scrub: 1.0,
        });
      }

      if (proofItems.length) {
        gsap.fromTo(
          proofItems,
          { opacity: 0, y: 20, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.055,
            ease: "power3.out",
            scrollTrigger: {
              trigger: proofItems[0],
              start: "top 86%",
              end: "top 58%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      // ─── Section farewell: ink-shadow bottom fade ────────────────────
      sectionFarewell(farewell, {
        trigger: root,
        peak: 1,
        start: "bottom 80%",
        end: "bottom 0%",
        scrub: 1.0,
      });
    }, root);

    return () => {
      removeFocusBandListeners?.();
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="denken"
      className="relative bg-[var(--magicks-bg-lifted)] px-5 pt-20 pb-32 sm:px-8 sm:pt-28 sm:pb-44 md:px-12 md:pt-32 md:pb-56 lg:px-16 lg:pt-40 lg:pb-64"
      aria-labelledby="value-heading"
    >
      <div aria-hidden className="section-top-rule" />

      {/* Volumetric God Ray — cinematic lighting sweeping diagonally across the section.
          Coupled to scroll so it 'reveals' the space dynamically. */}
      <div
        data-value-godray
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden will-change-[opacity,transform]"
      >
        <div
          className="absolute -inset-[50%] h-[200%] w-[200%] origin-top-left opacity-0"
          style={{
            background:
              "linear-gradient(135deg, transparent 34%, rgba(255,255,255,0.38) 45%, rgba(222,214,202,0.48) 50%, rgba(255,255,255,0.26) 56%, transparent 68%)",
            transform: "translate3d(0, -20%, 0) rotate(-15deg)",
            filter: "blur(40px)",
            mixBlendMode: "soft-light",
          }}
        />
      </div>

      {/* Ambient field — wide radial light anchored behind the paragraph.
          Never claims focus; registers as room-light moving with the read. */}
      <div
        data-value-ambient
        aria-hidden
        className="pointer-events-none absolute inset-0 will-change-[opacity]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 56% 42% at 62% 46%, rgba(34,44,64,0.1), transparent 68%), radial-gradient(ellipse 46% 34% at 24% 62%, rgba(255,255,255,0.22), transparent 74%)",
        }}
      />
      <div
        data-value-spotlight
        aria-hidden
        className="pointer-events-none absolute inset-0 will-change-[opacity,transform]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 54% 38% at 76% 34%, rgba(255,245,222,0.46), rgba(255,245,222,0.08) 44%, transparent 74%), radial-gradient(ellipse 36% 28% at 16% 68%, rgba(86,108,142,0.14), transparent 72%)",
          mixBlendMode: "soft-light",
        }}
      />

      <div className="layout-max">
        <div className="relative mx-auto max-w-[72rem]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-4 -inset-y-6 rounded-[2.35rem] border border-[rgb(var(--magicks-line-rgb)/0.045)] bg-[linear-gradient(145deg,rgba(255,255,255,0.38)_0%,rgba(248,244,236,0.2)_52%,rgba(236,230,219,0.08)_100%)] shadow-[0_42px_110px_-92px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.58)] sm:-inset-x-6 sm:-inset-y-8 md:-inset-x-10 md:-inset-y-10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-1 -inset-y-1 rounded-[2rem] bg-[radial-gradient(ellipse_68%_48%_at_70%_16%,rgba(255,255,255,0.64),transparent_70%)]"
          />
          {/* Luminous focus band — thin horizontal light that rides along
              the line currently in focus. Its Y is driven by the
              rack-focus track's onProgress callback, so position and
              sharpness always belong to the same scroll frame. */}
          <div
            data-value-focusband
            aria-hidden
            className="pointer-events-none absolute left-[-2rem] top-0 hidden h-[1.2em] w-[calc(100%+4rem)] will-change-[transform,opacity] md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,245,224,0.1) 20%, rgba(255,255,255,0.3) 50%, rgba(255,245,224,0.1) 80%, transparent 100%)",
              mixBlendMode: "soft-light",
              transform: "translateY(0) translateZ(0)",
            }}
          />

          <div
            data-value-heading
            className="relative z-10 mx-auto flex max-w-[64rem] flex-col items-center text-center rounded-[1.85rem] px-1 py-1 sm:px-3 sm:py-3 md:px-4 md:py-4"
          >
            {STATEMENT_BLOCKS.map((block) => {
              if (block.tone === "headline") {
                return (
                  <h2
                    key={block.primary}
                    id="value-heading"
                    data-value-sentence
                    className="mx-auto max-w-[22ch] font-ui text-[clamp(2.45rem,6.4vw,4.35rem)] font-[640] leading-[1.02] tracking-[-0.046em] text-[rgb(var(--magicks-ink-rgb)/0.97)] will-change-[opacity] md:max-w-[22ch] md:will-change-[opacity,filter]"
                  >
                    <span className="block">{block.primary}</span>
                    <em className="mx-auto mt-2 block max-w-[18ch] font-instrument italic text-[0.94em] font-normal tracking-[-0.034em] text-[rgb(var(--magicks-ink-rgb)/0.62)] sm:mt-3">
                      {block.secondary}
                    </em>
                  </h2>
                );
              }

              if (block.tone === "body") {
                return (
                  <p
                    key={block.text}
                    data-value-sentence
                    className="font-ui mx-auto mt-12 max-w-[42rem] text-[1.02rem] font-[500] leading-[1.66] tracking-[-0.008em] text-[rgb(var(--magicks-ink-rgb)/0.74)] will-change-[opacity] sm:mt-14 sm:text-[1.1rem] md:text-[1.18rem] md:will-change-[opacity,filter] lg:text-[1.24rem]"
                  >
                    {block.text}
                  </p>
                );
              }
            })}
          </div>

          {/* Editorial signature — signing hand directly below the
              statement. The handwritten mark IS the closing flourish;
              the previous trailing gradient rule was redundant and has
              been removed so the signature reads as the natural
              terminus of the manifesto. The colophon under it (Studio
              · Kassel, coordinates) sits as quiet authorship metadata
              — fine print in the magazine sense, not a chrome bar. */}
          <figure
            data-value-sign
            className="relative z-10 mx-auto mt-12 flex w-full max-w-[18rem] flex-col items-center will-change-[opacity,transform,filter] sm:mt-14 sm:max-w-[21rem] md:mt-16 md:max-w-[24rem]"
          >
            <MagicksSignatureReveal className="mx-auto w-full max-w-[16rem] sm:max-w-[19rem] md:max-w-[22rem]" />

            <figcaption className="font-mono mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 self-stretch text-center text-[10px] font-medium uppercase leading-none tracking-[0.16em] text-[rgb(var(--magicks-ink-rgb)/0.44)] sm:mt-6 sm:gap-x-5 sm:text-[10.5px] sm:tracking-[0.2em]">
              <span className="flex items-center gap-2 sm:gap-3">
                <span aria-hidden className="h-px w-5 bg-[rgb(var(--magicks-accent-line-rgb)/0.42)] sm:w-8" />
                <span>Studio · Kassel</span>
              </span>
              <span aria-hidden className="hidden h-1 w-1 rounded-full bg-[rgb(var(--magicks-accent-rgb)/0.52)] sm:inline-block" />
              <span className="text-[rgb(var(--magicks-ink-rgb)/0.36)]">N51°19′ · E9°29′</span>
            </figcaption>
          </figure>

          <div className="relative z-10 mx-auto mt-12 max-w-[70rem] sm:mt-14 md:mt-16">
            <TrustBadgeGrid />
            <SoftwareLogoMarquee reduced={reduced} />
          </div>
        </div>
      </div>

      {/* Section farewell — a thin ink-shadow at the bottom of the spread
          that deepens as the section exits and lifts on return. Hands off
          to Services as material, not as a cut. */}
      <div
        data-value-farewell
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 will-change-[opacity]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(46,56,76,0.06) 55%, rgba(46,56,76,0.12) 100%)",
        }}
      />
    </section>
  );
}

function TrustBadgeGrid() {
  return (
    <div
      data-value-proof
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="MAGICKS Vertrauensmerkmale"
    >
      {TRUST_BADGES.map(({ title, text, Icon }) => (
        <article
          key={title}
          className="group rounded-[1.15rem] border border-[rgb(var(--magicks-line-rgb)/0.105)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.62)] p-4 text-left shadow-[0_24px_68px_-58px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.74)] transition-[transform,border-color,background-color,box-shadow] duration-[720ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[rgb(var(--magicks-accent-line-rgb)/0.24)] hover:bg-[rgb(var(--magicks-bg-lifted-rgb)/0.78)] hover:shadow-[0_32px_80px_-58px_rgba(20,28,44,0.42),inset_0_1px_0_rgba(255,255,255,0.82)] sm:p-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.2)] bg-[rgb(var(--magicks-accent-rgb)/0.075)] text-[rgb(var(--magicks-accent-ink-rgb)/0.78)] shadow-[inset_0_1px_0_rgba(255,255,255,0.68)]">
            <Icon aria-hidden size={18} strokeWidth={1.35} />
          </div>
          <h3 className="font-ui mt-4 text-[1.02rem] font-[650] leading-[1.16] tracking-[-0.014em] text-[rgb(var(--magicks-ink-rgb)/0.94)]">
            {title}
          </h3>
          <p className="font-ui mt-2 text-[0.9rem] font-[450] leading-[1.58] tracking-[-0.004em] text-[rgb(var(--magicks-ink-rgb)/0.62)]">
            {text}
          </p>
        </article>
      ))}
    </div>
  );
}

function SoftwareLogoMarquee({ reduced }: { reduced: boolean }) {
  const logos = reduced ? SOFTWARE_LOGOS : [...SOFTWARE_LOGOS, ...SOFTWARE_LOGOS];

  return (
    <div data-value-proof className="mt-9 sm:mt-11">
      <p className="font-mono text-center text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-[rgb(var(--magicks-ink-rgb)/0.42)] sm:text-[10.5px]">
        Tools, mit denen wir arbeiten
      </p>

      <div
        className={`mt-5 overflow-hidden rounded-[1.2rem] border border-[rgb(var(--magicks-line-rgb)/0.1)] bg-[rgb(var(--magicks-bg-lifted-rgb)/0.48)] px-3 py-3 shadow-[0_22px_70px_-60px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.74)] sm:px-4 ${
          reduced
            ? ""
            : "group [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
        }`}
      >
        <div
          className={
            reduced
              ? "flex flex-wrap items-center justify-center gap-3"
              : "tools-marquee items-center gap-3"
          }
        >
          {logos.map((logo, index) => (
            <a
              key={`${logo.name}-${index}`}
              href="#denken"
              className="flex h-16 min-w-[8.4rem] items-center justify-center rounded-[0.95rem] border border-[rgb(var(--magicks-line-rgb)/0.075)] bg-white/55 px-5 outline-none transition-[background-color,border-color,filter,transform,opacity] duration-500 hover:-translate-y-0.5 hover:border-[rgb(var(--magicks-accent-line-rgb)/0.22)] hover:bg-white/78 focus-visible:-translate-y-0.5 focus-visible:border-[rgb(var(--magicks-accent-line-rgb)/0.34)] focus-visible:bg-white/8"
              aria-label={`${logo.name} Logo`}
            >
              <img
                src={logo.src}
                alt={`${logo.name} Logo`}
                loading="lazy"
                decoding="async"
                className="max-h-7 max-w-[6.4rem] object-contain opacity-70 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
