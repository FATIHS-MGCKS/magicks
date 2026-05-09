import { useLayoutEffect, useRef } from "react";
import { PrefetchLink } from "../PrefetchLink";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { HomeIcon, type HomeIconName } from "./HomeIcon";
import {
  parallaxDrift,
  prefersCheapMotion,
  presenceEnvelope,
  sectionFarewell,
} from "../../lib/scrollMotion";
import { HOME_SERVICE_IMAGES } from "../../data/imageWorld";

type Service = {
  slug: string;
  title: string;
  teaser: string;
  href: string;
  icon: HomeIconName;
  /** Hero visual for the service — image-first, subtle motion applied in CSS. */
  image: string;
  imageAlt: string;
};

const SERVICES: Service[] = [
  {
    slug: "websites",
    title: "Websites & Landingpages",
    teaser: "Digitale Auftritte, die überzeugen, Vertrauen schaffen und Anfragen erzeugen.",
    href: "/websites-landingpages",
    icon: "web",
    image: HOME_SERVICE_IMAGES.websites.src,
    imageAlt: HOME_SERVICE_IMAGES.websites.alt,
  },
  {
    slug: "shops",
    title: "Shops & Konfiguratoren",
    teaser: "Verkaufsflächen, die Produkte klarer erklären und Kaufentscheidungen leichter machen.",
    href: "/shops-produktkonfiguratoren",
    icon: "commerce",
    image: HOME_SERVICE_IMAGES.shops.src,
    imageAlt: HOME_SERVICE_IMAGES.shops.alt,
  },
  {
    slug: "software",
    title: "Web-Software",
    teaser: "Individuelle Lösungen für Prozesse, die aus Tabellen, Umwegen und Insellösungen herauswachsen.",
    href: "/web-software",
    icon: "software",
    image: HOME_SERVICE_IMAGES.software.src,
    imageAlt: HOME_SERVICE_IMAGES.software.alt,
  },
  {
    slug: "automation",
    title: "KI & Automationen",
    teaser: "Smarte Systeme, die wiederkehrende Aufgaben reduzieren und Abläufe spürbar beschleunigen.",
    href: "/ki-automationen-integrationen",
    icon: "automation",
    image: HOME_SERVICE_IMAGES.automation.src,
    imageAlt: HOME_SERVICE_IMAGES.automation.alt,
  },
];

/**
 * Service image card — renders the hero visual for a single service with
 * the same editorial chrome as the original preview stack (meta-overlay,
 * gradient, studio-air sweep). Used in both the mobile inline slot and
 * the desktop card's right column.
 */
function ServiceImage({ s }: { s: Service }) {
  return (
    <>
      <img
        src={s.image}
        alt={s.imageAlt}
        width={1440}
        height={1800}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
      />

      <div aria-hidden className="preview-sweep z-30 relative pointer-events-none" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(ellipse_120%_78%_at_50%_4%,rgba(255,255,255,0.24),transparent_64%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-t from-[rgba(28,36,52,0.24)] via-[rgba(28,36,52,0.02)] to-[rgba(255,255,255,0.2)]"
      />

      <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-40 flex items-baseline justify-between gap-4 sm:bottom-6 sm:left-6 sm:right-6">
        <span className="font-ui text-[13.5px] font-[520] tracking-[-0.004em] text-[rgba(255,255,255,0.92)] sm:text-[14.5px]">
          {s.title}
        </span>
      </div>
    </>
  );
}

export function Services() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const cheapMotion = prefersCheapMotion();
      const headline = root.querySelector<HTMLElement>("[data-services-headline]");
      const caption = root.querySelector<HTMLElement>("[data-services-caption]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]");
      const farewell = root.querySelector<HTMLElement>("[data-services-farewell]");
      const ambient = root.querySelector<HTMLElement>("[data-services-ambient]");

      if (reduced) {
        gsap.set([headline, caption, ...cards, farewell, ambient], {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
        });
        if (farewell) gsap.set(farewell, { opacity: 0 });
        return;
      }

      // ─── Ambient studio-light: behind the list ────────────────────────
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
          .to(ambient, { opacity: 0.66, duration: 0.32, ease: "power2.out" }, 0)
          .to(ambient, { opacity: 0.82, duration: 0.36, ease: "none" }, 0.32)
          .to(ambient, { opacity: 0.38, duration: 0.32, ease: "power2.in" }, 0.68);
        parallaxDrift(ambient, { trigger: root, from: -3, to: 4, scrub: true });
      }

      // ─── Headline: "Unser Leistungsumfang" ──────────────────────────
      const buildParts = root.querySelectorAll<HTMLElement>("[data-build-part]");
      if (buildParts.length > 0) {
        const buildFrom: gsap.TweenVars = cheapMotion
          ? { yPercent: 86, opacity: 0 }
          : { yPercent: 86, opacity: 0, rotateX: -34, transformOrigin: "50% 100%" };
        const buildTo: gsap.TweenVars = {
          yPercent: 0,
          opacity: 1,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            end: "top 24%",
            scrub: 1.2,
          },
        };
        if (!cheapMotion) buildTo.rotateX = 0;

        gsap.fromTo(
          buildParts,
          buildFrom,
          buildTo,
        );
      }

      presenceEnvelope(caption, {
        trigger: root,
        start: "top 90%",
        end: "top 0%",
        yFrom: 20,
        yTo: -10,
        blur: 3.5,
        holdRatio: 0.48,
        exitWeight: 2.5,
        scrub: 1.0,
      });

      // ─── Service Stacking Cards ──────────────────────────────────────
      // Every card shares the exact same sticky anchor. The next card
      // slides over the previous one 1:1, without scale or offset drift.
      gsap.set(cards, { opacity: 1, scale: 1, filter: "none" });

      // ─── Section farewell ────────────────────────────────────────────
      if (farewell) {
        sectionFarewell(farewell, { trigger: root, start: "bottom 95%", end: "bottom 60%" });
      }
    });

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="leistungen"
      className="relative bg-[var(--magicks-bg-base)] px-5 pb-28 pt-24 sm:px-8 sm:pb-36 sm:pt-28 md:px-12 md:pb-44 md:pt-36 lg:px-16"
      aria-labelledby="services-heading"
    >
      <div aria-hidden className="section-top-rule" />

      {/* Ambient studio-light: wide radial field behind the list.
          Scroll-coupled intensity + slow lateral drift so the background
          never sits flat. Pure depth — never a focal element. */}
      <div
        data-services-ambient
        aria-hidden
        className="pointer-events-none absolute inset-0 will-change-[opacity,transform]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 62% 52% at 24% 36%, rgba(34,44,64,0.1), transparent 72%), radial-gradient(ellipse 44% 36% at 78% 66%, rgba(255,255,255,0.22), transparent 78%)",
        }}
      />

      <div className="layout-max">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <span className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.22em] text-[rgb(var(--magicks-ink-rgb)/0.46)] sm:text-[11px] sm:tracking-[0.24em]">
            Unser Leistungsumfang
          </span>
        </div>
        <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-end md:gap-14">
          <h2
            id="services-heading"
            data-services-headline
            className="font-ui text-[2.32rem] font-[620] leading-[1.04] tracking-[-0.028em] text-[rgb(var(--magicks-ink-rgb)/0.95)] sm:text-[3.05rem] md:text-[4.05rem] lg:text-[4.7rem]"
            style={{ perspective: "1000px" }}
          >
            <span className="inline-block overflow-hidden pb-1 -mb-1">
              <span data-build-part className="inline-block will-change-transform">Unser</span>
            </span>{" "}
            <span className="inline-block overflow-hidden pb-1 -mb-1">
              <span data-build-part className="inline-block will-change-transform">Leistungs</span>
            </span>{" "}
            <em className="font-instrument inline-block italic font-normal text-[rgb(var(--magicks-ink-rgb)/0.62)]">
              {"umfang".split("").map((char, i) => (
                <span key={i} className="inline-block overflow-hidden pb-1 -mb-1">
                  <span data-build-part className="inline-block will-change-transform">{char}</span>
                </span>
              ))}
            </em>
            <span className="inline-block overflow-hidden pb-1 -mb-1">
              <span data-build-part className="inline-block will-change-transform">.</span>
            </span>
          </h2>
          <div
            data-services-caption
            className="relative pl-5 before:absolute before:left-0 before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-gradient-to-b before:from-[rgb(var(--magicks-line-rgb)/0.28)] before:via-[rgb(var(--magicks-line-rgb)/0.1)] before:to-transparent"
          >
            <p className="font-ui max-w-[30rem] text-[1.04rem] font-[450] leading-[1.7] tracking-[-0.006em] text-[rgb(var(--magicks-ink-rgb)/0.7)] md:text-[1.1rem]">
              Schönes Design ist nur der Anfang. Wir entwickeln Websites, Shops,
              3D-Konfiguratoren, Software und KI-Automationen. Alles, was Ihr
              Business digital stärker oder effizienter macht.
            </p>
          </div>
        </div>

        <div className="relative flex flex-col pt-10">
          {SERVICES.map((s, i) => {
            return (
              <article
                key={s.slug}
                data-service-card
                className="sticky z-10 w-full origin-top rounded-[1.75rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(165deg,rgba(255,255,255,0.86)_0%,rgba(246,242,233,0.72)_100%)] p-8 shadow-[0_28px_72px_-46px_rgba(20,28,44,0.34),inset_0_1px_0_rgba(255,255,255,0.8)] will-change-[transform,opacity] sm:p-10 md:p-12"
                style={{ top: "6rem", zIndex: 10 + i }}
              >
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 xl:gap-20">
                  {/* Left — Text Content */}
                  <PrefetchLink
                    to={s.href}
                    className="group relative block no-underline outline-none"
                  >
                    {/* Lens Flare — cinematic lighting on hover */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-0 top-0 h-px w-[120px] -translate-y-1/2 -translate-x-full bg-gradient-to-r from-transparent via-[rgba(255,248,236,0.9)] to-transparent blur-[2px] magicks-duration-hover magicks-ease-out transition-[opacity,transform] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                      style={{ mixBlendMode: "screen" }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-0 top-0 h-[3px] w-[60px] -translate-y-1/2 -translate-x-full bg-gradient-to-r from-transparent via-[rgb(var(--magicks-line-rgb)/0.62)] to-transparent blur-[4px] magicks-duration-hover magicks-ease-out transition-[opacity,transform] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                      style={{ mixBlendMode: "screen" }}
                    />

                    <div
                      aria-hidden
                      className="absolute left-0 top-0 h-full w-[2px] origin-top bg-[rgb(var(--magicks-line-rgb)/0.32)] magicks-duration-hover magicks-ease-out transition-[transform,opacity,background-color] scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100 group-hover:bg-[rgb(var(--magicks-line-rgb)/0.52)] group-focus-visible:scale-y-100 group-focus-visible:opacity-100 group-focus-visible:bg-[rgb(var(--magicks-line-rgb)/0.52)]"
                    />

                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-5 gap-y-1.5 sm:gap-x-7 md:gap-x-10">
                      <div>
                        {/* Chapter numeral — quiet mono kicker that
                            chapters the four services as a sequence,
                            not a flat grid. The trailing hairline
                            grows on hover, mirroring the "Ansehen"
                            ink underline below. */}
                        <div className="mb-5 flex items-center gap-3 sm:mb-6 md:mb-7">
                          <span
                            aria-hidden
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[rgb(var(--magicks-accent-line-rgb)/0.24)] bg-[rgb(var(--magicks-accent-rgb)/0.08)] text-[rgb(var(--magicks-accent-ink-rgb)/0.86)] shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] sm:h-7 sm:w-7"
                          >
                            <HomeIcon name={s.icon} size={13} strokeWidth={1.3} />
                          </span>
                          <span className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.22em] text-[rgb(var(--magicks-ink-rgb)/0.46)] magicks-duration-hover magicks-ease-out transition-colors sm:text-[11px] sm:tracking-[0.24em] group-hover:text-[rgb(var(--magicks-ink-rgb)/0.78)] group-focus-visible:text-[rgb(var(--magicks-ink-rgb)/0.78)]">
                            {String(i + 1).padStart(2, "0")}{" "}
                            <span className="text-[rgb(var(--magicks-ink-rgb)/0.34)]">/ 04</span>
                          </span>
                          <span
                            aria-hidden
                            className="h-px w-10 bg-gradient-to-r from-[rgb(var(--magicks-line-rgb)/0.3)] to-transparent magicks-duration-hover magicks-ease-out transition-[width] group-hover:w-16 group-focus-visible:w-16 sm:w-12"
                          />
                        </div>

                        <h3 className="font-ui text-[1.78rem] font-[600] leading-[1.14] tracking-[-0.022em] text-[rgb(var(--magicks-ink-rgb)/0.92)] magicks-duration-hover magicks-ease-out transition-colors sm:text-[2.16rem] md:text-[2.5rem] lg:text-[2.78rem] group-hover:text-[rgb(var(--magicks-ink-rgb)/0.98)] group-focus-visible:text-[rgb(var(--magicks-ink-rgb)/0.98)]">
                          {s.title}
                        </h3>

                        <p className="font-ui mt-4 max-w-md text-[15px] font-[450] leading-[1.66] tracking-[-0.005em] text-[rgb(var(--magicks-ink-rgb)/0.66)] md:mt-5 md:text-[15.5px]">
                          {s.teaser}
                        </p>

                        {/* Inline media — mobile/tablet only */}
                        <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-[0.85rem] border border-[rgb(var(--magicks-line-rgb)/0.14)] bg-[var(--magicks-bg-base)] shadow-[0_20px_46px_-34px_rgba(20,28,44,0.32)] lg:hidden">
                          <ServiceImage s={s} />
                        </div>

                        <span className="mt-6 inline-flex min-h-[40px] items-center gap-3 font-mono text-[11px] font-medium uppercase leading-none tracking-[0.16em] text-[rgb(var(--magicks-ink-rgb)/0.46)] magicks-duration-hover magicks-ease-out transition-colors sm:min-h-0 sm:text-[11.25px] sm:tracking-[0.2em] group-hover:text-[rgb(var(--magicks-ink-rgb)/0.9)] group-focus-visible:text-[rgb(var(--magicks-ink-rgb)/0.9)]">
                          Ansehen
                          <span
                            aria-hidden
                            className="h-px w-5 bg-[rgb(var(--magicks-line-rgb)/0.26)] magicks-duration-hover magicks-ease-out transition-[width,background-color] group-hover:w-12 group-hover:bg-[rgb(var(--magicks-line-rgb)/0.56)] group-focus-visible:w-12 group-focus-visible:bg-[rgb(var(--magicks-line-rgb)/0.56)]"
                          />
                        </span>
                      </div>

                      <span
                        aria-hidden
                        className="mt-[0.5rem] hidden h-8 w-8 items-center justify-center rounded-full border border-[rgb(var(--magicks-line-rgb)/0.18)] bg-transparent text-[rgb(var(--magicks-ink-rgb)/0.72)] magicks-duration-hover magicks-ease-out transition-[background-color,border-color,transform,color] md:flex group-hover:-translate-y-[1px] group-hover:translate-x-[1px] group-hover:border-[rgb(var(--magicks-line-rgb)/0.36)] group-hover:bg-[rgb(var(--magicks-ink-rgb)/0.06)] group-hover:text-[rgb(var(--magicks-ink-rgb)/0.9)] group-focus-visible:-translate-y-[1px] group-focus-visible:translate-x-[1px] group-focus-visible:border-[rgb(var(--magicks-line-rgb)/0.36)] group-focus-visible:bg-[rgb(var(--magicks-ink-rgb)/0.06)] group-focus-visible:text-[rgb(var(--magicks-ink-rgb)/0.9)]"
                      >
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4">
                          <path d="M3 11 L11 3 M5 3 H11 V9" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </PrefetchLink>

                  {/* Right — Image (Desktop only) */}
                  <aside aria-hidden className="hidden lg:block relative">
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1rem] border border-[rgb(var(--magicks-line-rgb)/0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.48),rgba(240,235,226,0.8))] shadow-[0_42px_98px_-58px_rgba(19,26,40,0.28),inset_0_1px_0_rgba(255,255,255,0.76)]">
                      <ServiceImage s={s} />
                    </div>
                  </aside>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Section farewell — ink shadow that deepens as Services hands off
          to Why MAGICKS. Reads as a printed spread ending, not a cut. */}
      <div
        data-services-farewell
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 will-change-[opacity]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(46,56,76,0.05) 58%, rgba(46,56,76,0.12) 100%)",
        }}
      />
    </section>
  );
}
