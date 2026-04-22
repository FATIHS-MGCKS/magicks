import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ChapterMarker } from "./ChapterMarker";

type Service = {
  index: number;
  slug: string;
  number: string;
  kicker: string;
  title: string;
  teaser: string;
  metric: string;
  href: string;
  video: string;
};

const SERVICES: Service[] = [
  {
    index: 0,
    slug: "websites",
    number: "01",
    kicker: "Marke",
    title: "Websites & Landing Pages",
    teaser:
      "Markenauftritte und Leadstrecken als zusammenhängendes System — nicht als Einzelseiten.",
    metric: "Von Auftritt bis Conversion",
    href: "/websites-landingpages",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4",
  },
  {
    index: 1,
    slug: "shops",
    number: "02",
    kicker: "Commerce",
    title: "Shops & Konfiguratoren",
    teaser: "Komplexe Produkte führbar machen — vom ersten Klick bis zur sauberen Übergabe.",
    metric: "Shopware · Shopify · Custom",
    href: "/shops-produktkonfiguratoren",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4",
  },
  {
    index: 2,
    slug: "software",
    number: "03",
    kicker: "System",
    title: "Web-Software & Dashboards",
    teaser: "Interne Systeme, die Arbeit bündeln, statt neue manuelle Schleifen zu eröffnen.",
    metric: "Intern · Multi-Tenant · API",
    href: "/web-software",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4",
  },
  {
    index: 3,
    slug: "automation",
    number: "04",
    kicker: "Automation & KI",
    title: "Automation & KI",
    teaser: "Wiederkehrende Last aus dem Team holen — nachvollziehbar und wartbar.",
    metric: "n8n · Agents · LLM-Integration",
    href: "/ki-automationen-integrationen",
    video:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4",
  },
];

function useCanHover(): boolean {
  const [v, setV] = useState<boolean>(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const on = () => setV(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return v;
}

/** Preloaded cross-fade video stack — only the active one plays. */
function PreviewStack({ activeIdx, className = "" }: { activeIdx: number; className?: string }) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    refs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIdx) {
        const p = v.play();
        if (p) void p.catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [activeIdx]);

  return (
    <div className={`relative overflow-hidden ${className}`.trim()}>
      {SERVICES.map((s, i) => (
        <video
          key={s.slug}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[750ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
            activeIdx === i ? "opacity-100" : "opacity-0"
          }`}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        >
          <source src={s.video} type="video/mp4" />
        </video>
      ))}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_120%,rgba(10,10,10,0.68),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/60 via-transparent to-[#0A0A0B]/28"
      />

      {/* Preview chapter-meta overlay */}
      <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-3 sm:left-6 sm:top-6">
        <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/68 sm:text-[10.5px]">
          §{" "}
          {SERVICES[activeIdx]?.number}
        </span>
        <span aria-hidden className="h-px w-7 bg-white/32" />
        <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/58 sm:text-[10.5px]">
          {SERVICES[activeIdx]?.kicker}
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-baseline justify-between gap-4 sm:bottom-6 sm:left-6 sm:right-6">
        <span className="font-instrument text-[14px] italic text-white/75 sm:text-[15px]">
          {SERVICES[activeIdx]?.title}
        </span>
        <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.24em] text-white/46 sm:text-[10.5px]">
          {SERVICES[activeIdx]?.metric}
        </span>
      </div>
    </div>
  );
}

export function Services() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const canHover = useCanHover();

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [scrollIdx, setScrollIdx] = useState<number>(0);
  const hoverLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // IntersectionObserver — tracks which entry dominates the viewport.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const entries = Array.from(root.querySelectorAll<HTMLElement>("[data-service-entry]"));
    const ratios = new Array<number>(entries.length).fill(0);

    const obs = new IntersectionObserver(
      (records) => {
        for (const r of records) {
          const idx = Number((r.target as HTMLElement).dataset.serviceIndex ?? -1);
          if (idx < 0 || idx >= ratios.length) continue;
          ratios[idx] = r.intersectionRatio;
        }
        let best = 0;
        let bestR = 0;
        for (let i = 0; i < ratios.length; i++) {
          if (ratios[i] > bestR) {
            bestR = ratios[i];
            best = i;
          }
        }
        setScrollIdx(best);
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );

    entries.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  const onEnter = useCallback(
    (i: number) => {
      if (!canHover) return;
      if (hoverLeaveTimer.current) {
        clearTimeout(hoverLeaveTimer.current);
        hoverLeaveTimer.current = null;
      }
      setHoverIdx(i);
    },
    [canHover],
  );

  const onLeave = useCallback(() => {
    if (!canHover) return;
    if (hoverLeaveTimer.current) clearTimeout(hoverLeaveTimer.current);
    hoverLeaveTimer.current = setTimeout(() => {
      setHoverIdx(null);
      hoverLeaveTimer.current = null;
    }, 120);
  }, [canHover]);

  useEffect(() => {
    return () => {
      if (hoverLeaveTimer.current) clearTimeout(hoverLeaveTimer.current);
    };
  }, []);

  const activeIdx = canHover && hoverIdx !== null ? hoverIdx : scrollIdx;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { gsap } = registerGsap();

    const ctx = gsap.context(() => {
      const chapter = root.querySelector<HTMLElement>("[data-services-chapter]");
      const headline = root.querySelector<HTMLElement>("[data-services-headline]");
      const caption = root.querySelector<HTMLElement>("[data-services-caption]");
      const entries = gsap.utils.toArray<HTMLElement>("[data-service-entry]");
      const preview = root.querySelector<HTMLElement>("[data-services-preview]");

      if (reduced) {
        gsap.set([chapter, headline, caption, ...entries, preview], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(chapter, { opacity: 0, y: 14 });
      gsap.set(headline, { opacity: 0, y: 22 });
      gsap.set(caption, { opacity: 0, y: 14 });
      gsap.set(entries, { opacity: 0, y: 28 });
      gsap.set(preview, { opacity: 0, scale: 0.98 });

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 75%", once: true },
        })
        .to(chapter, { opacity: 1, y: 0, duration: 0.75 }, 0)
        .to(headline, { opacity: 1, y: 0, duration: 1.0 }, 0.1)
        .to(caption, { opacity: 1, y: 0, duration: 0.8 }, 0.35)
        .to(preview, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }, 0.45);

      gsap.to(entries, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.11,
        scrollTrigger: { trigger: entries[0], start: "top 82%", once: true },
      });
    }, root);

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
            >
              Was wir <em className="italic text-white/58">bauen</em>.
            </h2>
            <p
              data-services-caption
              className="font-ui max-w-md text-[14px] leading-[1.66] text-white/52 md:text-[15px]"
            >
              Vier Cluster. Jedes für einen klaren unternehmerischen Einsatz — keines davon als
              Standard-Produkt, alle als Arbeit mit Absicht. Auswahl während des Scrolls; Vorschau
              läuft rechts mit.
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 xl:gap-20">
          {/* Left — editorial index */}
          <ol className="relative border-t border-white/[0.08]">
            {SERVICES.map((s, i) => {
              const active = activeIdx === i;
              return (
                <li
                  key={s.slug}
                  data-service-entry
                  data-service-index={s.index}
                  onPointerEnter={() => onEnter(i)}
                  onPointerLeave={onLeave}
                  className="border-b border-white/[0.08]"
                >
                  <Link
                    to={s.href}
                    onFocus={() => canHover && onEnter(i)}
                    onBlur={onLeave}
                    className="group relative block py-10 no-underline outline-none sm:py-12 md:py-14"
                  >
                    <div
                      aria-hidden
                      className={`absolute left-0 top-0 h-full w-[2px] origin-top bg-white magicks-duration-hover magicks-ease-out transition-[transform,opacity] ${
                        active ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                      }`}
                    />

                    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-5 gap-y-1.5 sm:gap-x-7 md:grid-cols-[52px_minmax(0,1fr)_auto] md:gap-x-10">
                      <span
                        className={`font-mono pt-[0.55rem] text-[11px] font-medium leading-none tracking-[0.28em] magicks-duration-hover magicks-ease-out transition-colors sm:text-[12px] ${
                          active ? "text-white" : "text-white/35"
                        }`}
                      >
                        {s.number}
                      </span>

                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          <span
                            className={`font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.3em] magicks-duration-hover magicks-ease-out transition-colors sm:text-[10.5px] ${
                              active ? "text-white/70" : "text-white/32"
                            }`}
                          >
                            {s.kicker}
                          </span>
                          <span
                            aria-hidden
                            className={`h-px magicks-duration-hover magicks-ease-out transition-[width,background-color] ${
                              active ? "w-10 bg-white/40" : "w-5 bg-white/15"
                            }`}
                          />
                        </div>

                        <h3
                          className={`font-instrument text-[1.65rem] leading-[1.1] tracking-[-0.02em] magicks-duration-hover magicks-ease-out transition-colors sm:text-[2rem] md:text-[2.3rem] lg:text-[2.45rem] ${
                            active ? "text-white" : "text-white/82"
                          }`}
                        >
                          {s.title}
                        </h3>

                        <p className="font-ui mt-3 max-w-md text-[14px] leading-[1.62] text-white/52 sm:text-[14.5px] md:mt-4 md:text-[15px]">
                          {s.teaser}
                        </p>

                        {/* Inline media — mobile/tablet only */}
                        <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-[0.85rem] border border-white/[0.08] lg:hidden">
                          <video
                            className="absolute inset-0 h-full w-full object-cover object-center"
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            autoPlay
                            aria-hidden
                          >
                            <source src={s.video} type="video/mp4" />
                          </video>
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/70 via-transparent to-[#0A0A0B]/25"
                          />
                        </div>

                        <span
                          className={`mt-5 inline-flex items-center gap-2 font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.24em] magicks-duration-hover magicks-ease-out transition-colors sm:text-[11px] ${
                            active ? "text-white" : "text-white/50"
                          }`}
                        >
                          Ansehen
                          <span
                            aria-hidden
                            className={`h-px magicks-duration-hover magicks-ease-out transition-[width,background-color] ${
                              active ? "w-8 bg-white" : "w-4 bg-white/40"
                            }`}
                          />
                        </span>
                      </div>

                      <span
                        aria-hidden
                        className={`mt-[0.5rem] hidden h-8 w-8 items-center justify-center rounded-full border text-white magicks-duration-hover magicks-ease-out transition-[background-color,border-color,transform] md:flex ${
                          active
                            ? "-translate-y-[1px] translate-x-[1px] border-white/40 bg-white/10"
                            : "border-white/10 bg-transparent"
                        }`}
                      >
                        <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4">
                          <path d="M3 11 L11 3 M5 3 H11 V9" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>

          {/* Right — sticky preview (desktop only) */}
          <aside
            aria-hidden
            className="relative hidden lg:block"
          >
            <div className="sticky top-[14vh]">
              <div
                data-services-preview
                className="relative aspect-[4/5] w-full overflow-hidden rounded-[1rem] border border-white/[0.08] bg-[#0C0C0E] shadow-[0_48px_120px_-60px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <PreviewStack activeIdx={activeIdx} className="h-full w-full" />
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 px-2">
                <span className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.28em] text-white/40">
                  Live Preview
                </span>
                <span className="font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.28em] text-white/40">
                  {String(activeIdx + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
