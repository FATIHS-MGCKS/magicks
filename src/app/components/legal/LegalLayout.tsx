import { useLayoutEffect, useRef, type ReactNode } from "react";
import { registerGsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

/* ---------------------------------------------------------------
 * LegalLayout — shared editorial shell for /impressum & /datenschutz.
 *
 * Design intent:
 *   · Visually integrated into the MAGICKS publication system —
 *     folio + hairline flanks above the H1, serif italic H1, mono
 *     folio tags on each section, hairline dividers between sections.
 *   · Clarity and legal readability are prioritized over effect.
 *     Generous line-height, restrained colour contrast (white/72 body
 *     on #0A0A0A), constrained measure (~44rem reading column),
 *     predictable vertical rhythm.
 *   · Motion budget is intentionally tiny. A single quiet page-intro
 *     fade lifts the masthead in; the body stack stays fully static
 *     for readability, citability, and print. No scroll reveals, no
 *     section-level theatrics — legal content must feel trustworthy,
 *     not choreographed.
 * --------------------------------------------------------------- */

type LegalLayoutProps = {
  /** Top folio — e.g. "§ Impressum — MAGICKS Studio" */
  folio: string;
  /** The page's H1. Plain string or a node (to allow italics). */
  h1: ReactNode;
  /** Lead paragraph directly under the H1. */
  lead: ReactNode;
  /** Optional "Stand:" / last-updated label rendered below the lead. */
  stand?: string;
  /** Section blocks — normally <LegalSection /> children. */
  children: ReactNode;
  /** Closing block (e.g. "Questions? Contact us"). */
  footer?: ReactNode;
};

export function LegalLayout({
  folio,
  h1,
  lead,
  stand,
  children,
  footer,
}: LegalLayoutProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  // Quiet page-intro presence build — folio rule, H1, lead and
  // "Stand:" label lift in softly as a small cascade. One-time, on
  // page load, because it is a true intro moment. No scroll triggers,
  // no ornamental motion; the body stays fully static afterwards.
  useLayoutEffect(() => {
    if (reduced) return;
    const el = headerRef.current;
    if (!el) return;
    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      const rule = el.querySelector<HTMLElement>("[data-legal-rule]");
      const folioEl = el.querySelector<HTMLElement>("[data-legal-folio]");
      const h1El = el.querySelector<HTMLElement>("[data-legal-h1]");
      const leadEl = el.querySelector<HTMLElement>("[data-legal-lead]");
      const standEl = el.querySelector<HTMLElement>("[data-legal-stand]");

      if (rule) {
        gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      }
      gsap.set([folioEl, h1El, leadEl, standEl], { opacity: 0, y: 10 });

      const tl = gsap.timeline({
        delay: 0.1,
        defaults: { ease: "power3.out" },
      });
      if (rule) tl.to(rule, { scaleX: 1, duration: 0.95, ease: "power2.inOut" }, 0);
      if (folioEl) tl.to(folioEl, { opacity: 1, y: 0, duration: 0.75 }, 0.12);
      if (h1El) tl.to(h1El, { opacity: 1, y: 0, duration: 1.0 }, 0.28);
      if (leadEl) tl.to(leadEl, { opacity: 1, y: 0, duration: 0.9 }, 0.5);
      if (standEl) tl.to(standEl, { opacity: 1, y: 0, duration: 0.7 }, 0.68);
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <main className="relative overflow-hidden bg-[#0A0A0A] text-white">
      {/* ============================================================
         Header
         ============================================================ */}
      <section
        ref={headerRef}
        className="relative px-5 pt-28 pb-8 sm:px-8 sm:pt-32 sm:pb-10 md:px-12 md:pt-36 md:pb-12 lg:px-16 lg:pt-44"
      >
        <div className="layout-max">
          <div className="max-w-[48rem]">
            {/* Top folio — matches the convention on /kontakt & /ueber-uns */}
            <div className="flex items-center gap-4">
              <span aria-hidden className="h-px w-10 bg-white/28 sm:w-14" />
              <span
                data-legal-folio
                className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/50 sm:text-[10.5px]"
              >
                {folio}
              </span>
              <span
                aria-hidden
                data-legal-rule
                className="h-px flex-1 bg-white/10"
              />
            </div>

            <h1
              data-legal-h1
              className="mt-10 font-instrument text-[2.35rem] leading-[1.04] tracking-[-0.032em] text-white sm:mt-12 sm:text-[3rem] md:mt-14 md:text-[3.5rem] lg:text-[3.95rem]"
            >
              {h1}
            </h1>

            <p
              data-legal-lead
              className="font-ui mt-8 max-w-[44rem] text-[16px] leading-[1.7] text-white/68 sm:mt-10 sm:text-[16.5px] md:text-[17px]"
            >
              {lead}
            </p>

            {stand && (
              <p
                data-legal-stand
                className="font-mono mt-7 text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/40 sm:text-[10.5px]"
              >
                · {stand} ·
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
         Body — section stack
         ============================================================ */}
      <div className="relative px-5 pb-24 pt-8 sm:px-8 sm:pb-28 sm:pt-12 md:px-12 md:pb-36 md:pt-16 lg:px-16">
        <div className="layout-max">
          <div className="max-w-[68rem] border-t border-white/[0.1]">
            <div className="divide-y divide-white/[0.06]">{children}</div>
          </div>

          {footer ? (
            <div className="max-w-[68rem]">{footer}</div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

/* ===============================================================
   LegalSection — a single numbered section row.
   Left column:  mono folio + serif italic title.
   Right column: prose body.
   Collapses to a single column below md.
   =============================================================== */

type LegalSectionProps = {
  /** Section folio, e.g. "§ 01". Rendered as a mono kicker above the title. */
  folio: string;
  /** Section title — serif italic on emphasis words. */
  title: ReactNode;
  /** Section body — paragraphs, lists, addresses etc. */
  children: ReactNode;
  /** Optional id for in-page anchor linking. */
  id?: string;
};

export function LegalSection({ folio, title, children, id }: LegalSectionProps) {
  return (
    <section
      id={id}
      className="grid gap-6 py-10 md:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)] md:gap-12 md:py-14 lg:gap-16 lg:py-16"
    >
      <div className="md:sticky md:top-24 md:self-start">
        <p className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/44 sm:text-[10.5px]">
          {folio}
        </p>
        <h2 className="mt-5 font-instrument text-[1.35rem] leading-[1.16] tracking-[-0.02em] text-white sm:text-[1.5rem] md:mt-6 md:text-[1.7rem] lg:text-[1.85rem]">
          {title}
        </h2>
      </div>

      <div className="font-ui space-y-5 text-[15px] leading-[1.72] text-white/72 sm:text-[15.5px] md:text-[16px]">
        {children}
      </div>
    </section>
  );
}

/* ===============================================================
   LegalAddress — a tidy address stack used for § Diensteanbieter
   and § Verantwortlicher. Kept as a single component so the
   formatting is identical across pages.
   =============================================================== */

type LegalAddressProps = {
  lines: Array<{ value: string; strong?: boolean }>;
};

export function LegalAddress({ lines }: LegalAddressProps) {
  return (
    <address className="font-ui not-italic space-y-[0.2rem] text-[15px] leading-[1.65] text-white/82 sm:text-[15.5px] md:text-[16px]">
      {lines.map((line, i) => (
        <div
          key={i}
          className={
            line.strong
              ? "font-instrument text-[1.15rem] italic leading-[1.25] tracking-[-0.01em] text-white sm:text-[1.2rem] md:text-[1.28rem]"
              : ""
          }
        >
          {line.value}
        </div>
      ))}
    </address>
  );
}

/* ===============================================================
   LegalFooter — closing "Any questions?" block.
   =============================================================== */

export function LegalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="mt-14 max-w-[48rem] border-t border-white/[0.08] pt-10 md:mt-16 md:pt-12">
      <p className="font-ui text-[14px] leading-[1.7] text-white/52 md:text-[14.5px]">
        {children}
      </p>
    </div>
  );
}
