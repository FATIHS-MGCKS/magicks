import { Link } from "react-router-dom";

type ContextualCrossLinkProps = {
  /** Eyebrow shown at the center of the top hairline — e.g. `Alternative` / `Siehe auch` / `Verwandt`. */
  eyebrow: string;
  /** The one-line contextual sentence leading into the link. */
  lead: string;
  /** Anchor of the target link — short and confident. */
  linkLabel: string;
  /** Target route. */
  to: string;
  /** Small tagline rendered opposite the CTA — one or two words. */
  folio?: string;
};

/**
 * Inline contextual cross-link block, used between related service landings.
 *
 * Built as an editorial gatefold — not a card. A centered eyebrow rides a
 * top hairline rule, the lead is rendered as a display-italic paragraph,
 * and the CTA sits on a baseline beneath the lead, aligned against the
 * folio on the opposite side. No pill, no shadows, no glass.
 */
export function ContextualCrossLink({
  eyebrow,
  lead,
  linkLabel,
  to,
  folio,
}: ContextualCrossLinkProps) {
  return (
    <aside className="relative">
      {/* Top gate — centered eyebrow riding a hairline rule */}
      <div className="mb-10 flex items-center gap-5 sm:mb-14 md:mb-16">
        <span aria-hidden className="h-px w-10 bg-white/24 sm:w-16" />
        <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.42em] text-white/46 sm:text-[10.5px]">
          ↘ {eyebrow}
        </span>
        <span aria-hidden className="h-px flex-1 bg-white/12" />
      </div>

      <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end md:gap-20 lg:gap-24">
        {/* Lead — editorial italic pull, two-line max */}
        <p className="font-instrument max-w-[44rem] text-[1.45rem] leading-[1.35] tracking-[-0.015em] text-white/92 sm:text-[1.75rem] md:text-[2rem] lg:text-[2.2rem]">
          {lead}
        </p>

        {/* CTA + folio — baseline-aligned, right-hung on desktop */}
        <div className="flex items-baseline justify-between gap-8 md:flex-col md:items-end md:gap-5 md:self-end md:text-right">
          <Link
            to={to}
            className="group relative inline-flex items-baseline gap-3 text-[14.5px] font-medium text-white no-underline sm:text-[15.5px] md:text-[16px]"
            aria-label={linkLabel}
          >
            <span className="relative pb-2">
              <span className="font-ui">{linkLabel}</span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left bg-white/32"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-white transition-transform duration-[820ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </span>
            <span
              aria-hidden
              className="font-instrument text-[1.1em] italic text-white/82 transition-transform duration-[560ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[3px] group-hover:translate-x-[3px]"
            >
              ↗
            </span>
          </Link>

          {folio ? (
            <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.34em] text-white/36 sm:text-[10.5px]">
              {folio}
            </span>
          ) : null}
        </div>
      </div>

      {/* Bottom gate — mirrors the top, thinner */}
      <div className="mt-10 flex items-center gap-5 sm:mt-14 md:mt-16">
        <span aria-hidden className="h-px flex-1 bg-white/10" />
        <span aria-hidden className="h-px w-6 bg-white/22 sm:w-10" />
      </div>
    </aside>
  );
}
