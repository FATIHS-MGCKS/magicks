import { useLayoutEffect, useRef } from "react";
import { PrefetchLink } from "../PrefetchLink";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  parallaxDrift,
  presenceEnvelope,
  sectionFarewell,
} from "../../lib/scrollMotion";
import { ChapterMarker } from "./ChapterMarker";

type Service = {
  slug: string;
  number: string;
  kicker: string;
  title: string;
  teaser: string;
  metric: string;
  href: string;
  /** Hero visual for the service — image-first, subtle motion applied in CSS. */
  image: string;
  imageAlt: string;
};

const SERVICES: Service[] = [
  {
    slug: "websites",
    number: "01",
    kicker: "Marke",
    title: "Websites & Landing Pages",
    teaser:
      "Markenwebsites, Landing Pages und Relaunches als zusammenhängendes System — geführt, schnell, conversion-orientiert.",
    metric: "Von Auftritt bis Conversion",
    href: "/websites-landingpages",
    image: "/media/home/service-websites-ultrarealistic.jpg",
    imageAlt:
      "Premium-Website auf einem Laptop in einem dunklen Studio-Setup mit Messinglineal, Print-Proof und edler Schreibtischszene.",
  },
  {
    slug: "shops",
    number: "02",
    kicker: "Commerce",
    title: "Shops & Konfiguratoren",
    teaser:
      "Online-Shops und 2D/3D-Produktkonfiguratoren, die komplexe Produkte erklären und Anfragen sauber qualifizieren.",
    metric: "Shopware · Shopify · Custom",
    href: "/shops-produktkonfiguratoren",
    image: "/media/home/service-shops-ultrarealistic.jpg",
    imageAlt:
      "Produktkonfigurator für eine moderne Terrassenüberdachung auf einem Laptop, darunter ein architektonischer Bauplan.",
  },
  {
    slug: "software",
    number: "03",
    kicker: "System",
    title: "Web-Software & Dashboards",
    teaser:
      "Dashboards, Portale und individuelle Web-Software — Prozesse bündeln statt Tabs sammeln.",
    metric: "Intern · Multi-Tenant · API",
    href: "/web-software",
    image: "/media/home/service-software-ultrarealistic.jpg",
    imageAlt:
      "Mehrpaneel-Plattform mit Projekttabelle, Statuschips und Timeline-Drawer auf einem Wide-Monitor vor einer Betonwand.",
  },
  {
    slug: "automation",
    number: "04",
    kicker: "Automation & KI",
    title: "Automation & KI",
    teaser:
      "KI-Workflows, Automationen und Integrationen — wiederkehrende Arbeit aus dem Team holen, nachvollziehbar und wartbar.",
    metric: "n8n · Agents · LLM-Integration",
    href: "/ki-automationen-integrationen",
    image: "/media/home/service-automation-ultrarealistic.jpg",
    imageAlt:
      "Drei verbundene UI-Fragmente — Anfrage, Verarbeitung, CRM-Eintrag — auf einer dunklen Gitterplatte, verbunden durch feine Flusslinien.",
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
        fetchPriority="low"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
      />

      <div aria-hidden className="preview-sweep z-30 relative pointer-events-none" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(ellipse_120%_80%_at_50%_120%,rgba(10,10,10,0.45),transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-t from-[#0A0A0B]/48 via-transparent to-[#0A0A0B]/14"
      />

      <div className="pointer-events-none absolute left-5 top-5 z-40 flex items-center gap-3 sm:left-6 sm:top-6">
        <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/68 sm:text-[10.5px]">
          § {s.number}
        </span>
        <span aria-hidden className="h-px w-7 bg-white/32" />
        <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/58 sm:text-[10.5px]">
          {s.kicker}
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-40 flex items-baseline justify-between gap-4 sm:bottom-6 sm:left-6 sm:right-6">
        <span className="font-instrument text-[14px] italic text-white/75 sm:text-[15px]">
          {s.title}
        </span>
        <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.24em] text-white/46 sm:text-[10.5px]">
          {s.metric}
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
      const chapter = root.querySelector<HTMLElement>("[data-services-chapter]");
      const headline = root.querySelector<HTMLElement>("[data-services-headline]");
      const caption = root.querySelector<HTMLElement>("[data-services-caption]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]");
      const farewell = root.querySelector<HTMLElement>("[data-services-farewell]");
      const ambient = root.querySelector<HTMLElement>("[data-services-ambient]");

      if (reduced) {
        gsap.set([chapter, headline, caption, ...cards, farewell, ambient], {
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
          .to(ambient, { opacity: 0.8, duration: 0.32, ease: "power2.out" }, 0)
          .to(ambient, { opacity: 1, duration: 0.36, ease: "none" }, 0.32)
          .to(ambient, { opacity: 0.42, duration: 0.32, ease: "power2.in" }, 0.68);
        parallaxDrift(ambient, { trigger: root, from: -4, to: 6, scrub: true });
      }

      // ─── Section header ──────────────────────────────────────────────
      presenceEnvelope(chapter, {
        trigger: root,
        start: "top 98%",
        end: "top 4%",
        yFrom: 16,
        yTo: -8,
        blur: 3,
        holdRatio: 0.5,
        exitWeight: 2.5,
        scrub: 1.0,
      });

      // ─── Headline: "Was wir bauen." ──────────────────────────────────
      const buildParts = root.querySelectorAll<HTMLElement>("[data-build-part]");
      if (buildParts.length > 0) {
        gsap.fromTo(
          buildParts,
          { yPercent: 120, opacity: 0, rotateX: -60, transformOrigin: "50% 100%" },
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            stagger: 0.18,
            ease: "power3.out",
            scrollTrigger: {
              trigger: root,
              start: "top 85%",
              end: "top 15%",
              scrub: 1.5,
            },
          },
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
      // As the user scrolls, each service card sticks to the top.
      // When the next card scrolls up, the current card scales down and darkens slightly.
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // Last card doesn't scale down

        const nextCard = cards[i + 1];

        gsap.to(card, {
          scale: 0.94,
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: nextCard,
            start: "top 85%", // Start scaling when the next card comes into view
            end: "top 35%",   // Finish scaling when the next card reaches its sticky position
            scrub: true,
          },
        });
      });

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
      className="relative bg-[#0A0A0B] px-5 pb-28 pt-24 sm:px-8 sm:pb-36 sm:pt-28 md:px-12 md:pb-44 md:pt-36 lg:px-16"
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
            "radial-gradient(ellipse 60% 50% at 28% 38%, rgba(255,255,255,0.025), transparent 72%)",
        }}
      />

      <div className="layout-max">
        <div className="mb-16 grid gap-5 md:mb-24 md:grid-cols-[max-content_minmax(0,1fr)] md:gap-20">
          <div data-services-chapter className="md:pt-2">
            <ChapterMarker num="02" label="Leistungen" />
          </div>

          <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-end md:gap-14">
            <h2
              id="services-heading"
              data-services-headline
              className="font-instrument text-[2rem] leading-[1.02] tracking-[-0.028em] text-white sm:text-[2.55rem] md:text-[3.15rem] lg:text-[3.6rem]"
              style={{ perspective: "1000px" }}
            >
              <span className="inline-block overflow-hidden pb-1 -mb-1">
                <span data-build-part className="inline-block will-change-transform">Was</span>
              </span>{" "}
              <span className="inline-block overflow-hidden pb-1 -mb-1">
                <span data-build-part className="inline-block will-change-transform">wir</span>
              </span>{" "}
              <em className="italic text-white/58 inline-block">
                {"bauen".split("").map((char, i) => (
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
              className="relative pl-5 before:absolute before:left-0 before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-gradient-to-b before:from-white/30 before:via-white/10 before:to-transparent"
            >
              <p className="font-instrument max-w-[26rem] text-[1.15rem] leading-[1.6] tracking-[-0.01em] text-white/65 md:text-[1.25rem]">
                Vier Bereiche für digitale Arbeit, die <em className="italic text-white/90">sichtbar besser</em> wirkt und im Alltag <em className="italic text-white/90">sauber funktioniert</em> — von Websites und Konfiguratoren bis zu Web-Software und Automationen.
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col pt-10">
          {SERVICES.map((s, i) => {
            return (
              <article
                key={s.slug}
                data-service-card
                className="sticky z-10 w-full border border-white/[0.08] rounded-3xl bg-[#0A0A0B] p-8 sm:p-10 md:p-12 origin-top will-change-[transform,opacity] shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                style={{ top: `calc(6rem + ${i * 2.5}rem)` }}
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
                      className="pointer-events-none absolute left-0 top-0 h-px w-[120px] -translate-y-1/2 -translate-x-full bg-gradient-to-r from-transparent via-amber-200/80 to-transparent blur-[2px] magicks-duration-hover magicks-ease-out transition-[opacity,transform] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                      style={{ mixBlendMode: "screen" }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-0 top-0 h-[3px] w-[60px] -translate-y-1/2 -translate-x-full bg-gradient-to-r from-transparent via-white to-transparent blur-[4px] magicks-duration-hover magicks-ease-out transition-[opacity,transform] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                      style={{ mixBlendMode: "screen" }}
                    />

                    <div
                      aria-hidden
                      className="absolute left-0 top-0 h-full w-[2px] origin-top bg-white magicks-duration-hover magicks-ease-out transition-[transform,opacity] scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100 group-focus-visible:scale-y-100 group-focus-visible:opacity-100"
                    />

                    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-5 gap-y-1.5 sm:gap-x-7 md:grid-cols-[52px_minmax(0,1fr)_auto] md:gap-x-10">
                      <span className="font-mono pt-[0.55rem] text-[12px] font-medium leading-none tracking-[0.18em] text-white/45 magicks-duration-hover magicks-ease-out transition-colors sm:text-[12px] sm:tracking-[0.28em] group-hover:text-white group-focus-visible:text-white">
                        {s.number}
                      </span>

                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          <span className="font-mono text-[11px] font-medium uppercase leading-none tracking-[0.2em] text-white/40 magicks-duration-hover magicks-ease-out transition-colors sm:text-[10.5px] sm:tracking-[0.3em] group-hover:text-white/72 group-focus-visible:text-white/72">
                            {s.kicker}
                          </span>
                          <span
                            aria-hidden
                            className="h-px w-5 bg-white/15 magicks-duration-hover magicks-ease-out transition-[width,background-color] group-hover:w-10 group-hover:bg-white/40 group-focus-visible:w-10 group-focus-visible:bg-white/40"
                          />
                        </div>

                        <h3 className="font-instrument text-[1.65rem] leading-[1.1] tracking-[-0.02em] text-white/82 magicks-duration-hover magicks-ease-out transition-colors sm:text-[2rem] md:text-[2.3rem] lg:text-[2.45rem] group-hover:text-white group-focus-visible:text-white">
                          {s.title}
                        </h3>

                        <p className="font-ui mt-3 max-w-md text-[14px] leading-[1.62] text-white/52 sm:text-[14.5px] md:mt-4 md:text-[15px]">
                          {s.teaser}
                        </p>

                        {/* Inline media — mobile/tablet only */}
                        <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-[0.85rem] border border-white/[0.08] lg:hidden">
                          <ServiceImage s={s} />
                        </div>

                        <span className="mt-6 inline-flex min-h-[40px] items-center gap-3 font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.25em] text-white/40 magicks-duration-hover magicks-ease-out transition-colors sm:min-h-0 sm:text-[11px] sm:tracking-[0.3em] group-hover:text-white group-focus-visible:text-white">
                          Ansehen
                          <span
                            aria-hidden
                            className="h-px w-5 bg-white/20 magicks-duration-hover magicks-ease-out transition-[width,background-color] group-hover:w-12 group-hover:bg-white group-focus-visible:w-12 group-focus-visible:bg-white"
                          />
                        </span>
                      </div>

                      <span
                        aria-hidden
                        className="mt-[0.5rem] hidden h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-transparent text-white magicks-duration-hover magicks-ease-out transition-[background-color,border-color,transform] md:flex group-hover:-translate-y-[1px] group-hover:translate-x-[1px] group-hover:border-white/40 group-hover:bg-white/10 group-focus-visible:-translate-y-[1px] group-focus-visible:translate-x-[1px] group-focus-visible:border-white/40 group-focus-visible:bg-white/10"
                      >
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4">
                          <path d="M3 11 L11 3 M5 3 H11 V9" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </PrefetchLink>

                  {/* Right — Image (Desktop only) */}
                  <aside aria-hidden className="hidden lg:block relative">
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1rem] border border-white/[0.08] bg-[#0C0C0E] shadow-[0_48px_120px_-60px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.04)]">
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
            "linear-gradient(180deg, transparent 0%, rgba(8,8,10,0.32) 58%, rgba(8,8,10,0.58) 100%)",
        }}
      />
    </section>
  );
}
