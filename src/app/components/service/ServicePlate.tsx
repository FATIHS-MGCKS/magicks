import { Link } from "react-router-dom";

/* ------------------------------------------------------------------
 * ServicePlate — one of the four service "folios" on /leistungen.
 *
 * Each plate shares a scaffold (folio rail · headline · body ·
 * supporting-points register · CTA rail) but the *register* itself
 * is tuned to the discipline. That's the structural answer to the
 * brief's "do not flatten into repetitive cards" note:
 *
 *   · masthead  — 2-column points register, each row prefixed by a
 *                 mono number and a short masthead tick (Websites &
 *                 Landing Pages)
 *   · catalog   — stacked rows, Roman pagination (§·I … §·V), a
 *                 catalog-edge tick per row (Shops & Konfiguratoren)
 *   · blueprint — architectural grid coordinates A1 … A5 with
 *                 coordinate-gutter ticks (Web-Software)
 *   · flow      — horizontal 5-stage flow strip with hop arrows
 *                 between stations (KI-Automationen)
 *
 * The plate CTA is a full-width baseline rail — folio label on the
 * left, the cross-link on the right — so each plate ends with the
 * same architectural weight rather than a shy inline underline.
 *
 * Plates alternate `anchor="left"` / `"right"` to build zig-zag
 * rhythm down the page; anchor only flips the folio rail position,
 * the register stays inside the content column.
 * ------------------------------------------------------------------ */

export type ServicePlateMotif = "masthead" | "catalog" | "blueprint" | "flow";
export type ServicePlateAnchor = "left" | "right";

type ServicePlateProps = {
  folio: string;
  code: string;
  caption: string;
  title: string;
  body: string;
  points: string[];
  ctaLabel: string;
  to: string;
  motif: ServicePlateMotif;
  anchor: ServicePlateAnchor;
  hook?: string;
};

export function ServicePlate({
  folio,
  code,
  caption,
  title,
  body,
  points,
  ctaLabel,
  to,
  motif,
  anchor,
  hook = "plate",
}: ServicePlateProps) {
  const isRight = anchor === "right";
  const gridCols =
    "md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]";

  return (
    <article
      data-plate
      data-plate-hook={hook}
      data-plate-motif-id={motif}
      className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-28 md:px-12 md:py-36 lg:px-16 lg:py-44"
    >
      {/* Per-discipline ambient texture — hairline-thin, masked so
          it never competes with the serif headline. */}
      <PlateTexture variant={motif} />

      <div className="relative layout-max">
        <div className={`grid gap-10 md:gap-16 lg:gap-24 ${gridCols}`}>
          {/* Folio rail */}
          <div
            data-plate-folio
            className={`flex flex-col gap-6 ${
              isRight ? "md:order-2 md:items-end md:text-right" : "md:items-start"
            }`}
          >
            <div
              className={`flex items-baseline gap-5 ${
                isRight ? "md:flex-row-reverse" : ""
              }`}
            >
              <span
                data-plate-roman
                className="font-instrument text-[3.75rem] leading-[0.88] tracking-[-0.02em] text-white/92 sm:text-[4.5rem] md:text-[5.2rem] lg:text-[6rem]"
              >
                {folio}
              </span>
              <span
                aria-hidden
                className="hidden h-px w-10 bg-white/22 sm:block md:w-14"
              />
            </div>

            <div
              className={`flex flex-col gap-2 ${
                isRight ? "md:items-end md:text-right" : ""
              }`}
            >
              <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/58 sm:text-[10.5px]">
                {code}
              </span>
              <span className="font-mono text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/38 sm:text-[10px]">
                {caption}
              </span>
            </div>

            <div
              className={`mt-3 ${isRight ? "md:ml-auto" : ""}`}
              data-plate-motif
            >
              <PlateMotif variant={motif} />
            </div>
          </div>

          {/* Content column */}
          <div
            data-plate-content
            className={`${isRight ? "md:order-1" : ""}`}
          >
            {/*
             * Plate H2 — scaled above the narrative section H2s so
             * the plates own the page visually. The italic "em" span
             * is the whole title; variation comes from the motif +
             * register treatment below, not from typographic tricks.
             */}
            <h2
              data-plate-heading
              className="font-instrument max-w-[44rem] text-[2.4rem] leading-[1.02] tracking-[-0.03em] text-white sm:text-[2.95rem] md:text-[3.55rem] lg:text-[4rem]"
            >
              <em className="italic text-white">{title}</em>
            </h2>

            <p
              data-plate-body
              className="font-ui mt-8 max-w-[44rem] text-[15.5px] leading-[1.72] text-white/68 md:mt-10 md:text-[16.5px] md:leading-[1.72]"
            >
              {body}
            </p>

            {/* Per-discipline register — the real structural differentiator */}
            <div data-plate-register className="mt-12 md:mt-14">
              <PlateRegister variant={motif} points={points} />
            </div>

            {/*
             * CTA — architectural baseline rail:
             * top hairline · plate-code on the left · cross-link on
             * the right. Same shape across plates so the four CTAs
             * read as a consistent "end of folio" signature, but the
             * label itself is unique per plate (verbatim from brief).
             */}
            <div
              data-plate-cta
              className="mt-14 border-t border-white/[0.12] pt-6 md:mt-16 md:pt-7"
            >
              <div className="flex items-baseline justify-between gap-6">
                <span className="font-mono text-[10px] font-medium uppercase leading-none tracking-[0.36em] text-white/50 sm:text-[10.5px]">
                  {code} · Weiterlesen
                </span>
                <Link
                  to={to}
                  className="group relative inline-flex items-baseline gap-3 text-[15.5px] font-medium tracking-[-0.003em] text-white no-underline sm:text-[16.5px] md:text-[17.5px]"
                  aria-label={ctaLabel}
                >
                  <span className="relative pb-2.5">
                    <span className="font-ui">{ctaLabel}</span>
                    <span
                      aria-hidden
                      data-plate-ctarule
                      className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left bg-white/42"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-white transition-transform duration-[820ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                  </span>
                  <span
                    aria-hidden
                    className="font-instrument text-[1.08em] italic text-white/88 transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[3px] group-hover:translate-x-[3px]"
                  >
                    ↗
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------
 * PlateRegister — per-discipline supporting-points treatment.
 *
 * Each variant keeps the same data ({points: string[]}) but renders
 * it through the discipline's own visual vocabulary. This is what
 * makes the four plates feel art-directed instead of template-
 * mirror-flipped.
 * ------------------------------------------------------------------ */
function PlateRegister({
  variant,
  points,
}: {
  variant: ServicePlateMotif;
  points: string[];
}) {
  switch (variant) {
    /* ——— I · Masthead ————————————————————————————————————
     * 2-column hairline register. Each row is prefixed by a mono
     * index (01 / 02 / …) followed by a short masthead tick rule
     * (echoing the three-weight typography rulers in the motif).
     * Reads as editorial colophon columns. */
    case "masthead":
      return (
        <ul
          data-plate-points
          className="grid max-w-[52rem] grid-cols-1 gap-x-10 border-t border-white/[0.09] sm:grid-cols-2"
        >
          {points.map((point, i) => (
            <li
              key={point}
              data-plate-point
              className="grid grid-cols-[auto_auto_minmax(0,1fr)] items-baseline gap-x-4 border-b border-white/[0.09] py-4 md:py-5"
            >
              <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/48 md:text-[10px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                aria-hidden
                className="block h-px w-4 bg-white/30 md:w-6"
              />
              <span className="font-instrument text-[1.02rem] leading-[1.35] tracking-[-0.008em] text-white/88 md:text-[1.12rem]">
                {point}
              </span>
            </li>
          ))}
        </ul>
      );

    /* ——— II · Catalog ————————————————————————————————————
     * Stacked rows with Roman pagination §·I … §·V and a catalog-
     * edge tick that extends past the row into the right margin,
     * like a real catalog page's thumb-index. */
    case "catalog":
      return (
        <ul
          data-plate-points
          className="grid max-w-[46rem] grid-cols-1 gap-y-0 border-t border-white/[0.09]"
        >
          {points.map((point, i) => {
            const romans = ["I", "II", "III", "IV", "V"];
            return (
              <li
                key={point}
                data-plate-point
                className="relative grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 border-b border-white/[0.09] py-4 md:py-5"
              >
                <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/48 md:text-[10px]">
                  §·{romans[i] ?? String(i + 1)}
                </span>
                <span className="font-instrument text-[1.02rem] leading-[1.35] tracking-[-0.008em] text-white/88 md:text-[1.12rem]">
                  {point}
                </span>
                {/* Catalog thumb-index tick — hangs off the right edge */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-[-28px] top-1/2 hidden h-px w-6 -translate-y-1/2 bg-white/24 md:block"
                />
              </li>
            );
          })}
        </ul>
      );

    /* ——— III · Blueprint ————————————————————————————————
     * Architectural grid-coordinate addressing: A1 … A5. Each row
     * carries a coordinate tick in a hairline gutter on the left,
     * echoing a schematic's dimension call-outs. */
    case "blueprint":
      return (
        <ul
          data-plate-points
          className="relative grid max-w-[46rem] grid-cols-1 gap-y-0 border-t border-white/[0.09] pl-6 md:pl-8"
        >
          {/* Blueprint coordinate gutter — vertical hairline + row ticks */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 block h-full w-px bg-white/16"
          />
          {points.map((point, i) => (
            <li
              key={point}
              data-plate-point
              className="relative grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 border-b border-white/[0.09] py-4 md:py-5"
            >
              {/* Row coordinate tick — hangs off the gutter hairline */}
              <span
                aria-hidden
                className="pointer-events-none absolute -left-6 top-1/2 block h-px w-4 -translate-y-1/2 bg-white/36 md:-left-8 md:w-6"
              />
              <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.32em] text-white/48 md:text-[10px]">
                A{i + 1}
              </span>
              <span className="font-instrument text-[1.02rem] leading-[1.35] tracking-[-0.008em] text-white/88 md:text-[1.12rem]">
                {point}
              </span>
            </li>
          ))}
        </ul>
      );

    /* ——— IV · Flow ———————————————————————————————————————
     * Horizontal 5-stage flow strip. Points render in a row with
     * connecting hairlines between stations. On mobile it falls
     * back to a compact numbered list so readability holds. */
    case "flow":
      return (
        <div data-plate-points className="max-w-[54rem]">
          {/* Desktop horizontal flow */}
          <ol className="relative hidden gap-0 border-y border-white/[0.09] py-7 md:grid md:grid-cols-5 md:gap-0">
            {points.map((point, i) => (
              <li
                key={point}
                data-plate-point
                className={`relative flex flex-col gap-3 pr-4 ${
                  i > 0 ? "border-l border-white/[0.09] pl-5" : ""
                }`}
              >
                <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/48">
                  →{String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-instrument text-[0.96rem] leading-[1.38] tracking-[-0.008em] text-white/88">
                  {point}
                </span>
              </li>
            ))}
            {/* Horizontal rail — a thin line drawn through the nodes */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-5 right-5 top-[34px] block h-px bg-white/18"
            />
          </ol>

          {/* Mobile fallback — compact numbered list */}
          <ul className="grid grid-cols-1 gap-y-0 border-t border-white/[0.09] md:hidden">
            {points.map((point, i) => (
              <li
                key={point}
                data-plate-point
                className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 border-b border-white/[0.09] py-4"
              >
                <span className="font-mono tabular-nums text-[9.5px] font-medium uppercase leading-none tracking-[0.34em] text-white/48">
                  →{String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-instrument text-[1rem] leading-[1.35] tracking-[-0.008em] text-white/88">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
  }
}

/* ------------------------------------------------------------------
 * PlateTexture — per-discipline ambient texture.
 *
 * Hairline-thin, heavily masked. Reads as discipline ambient
 * without stealing attention from the serif headline. Every
 * texture is rendered as a pure CSS background so it costs
 * nothing at runtime.
 * ------------------------------------------------------------------ */
function PlateTexture({ variant }: { variant: ServicePlateMotif }) {
  switch (variant) {
    case "masthead":
      return (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
            backgroundSize: "100% 160px",
            maskImage:
              "radial-gradient(ellipse 68% 56% at 18% 46%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 68% 56% at 18% 46%, black, transparent)",
          }}
        />
      );
    case "catalog":
      return (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.26]"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(255,255,255,0.014) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.014) 1px, transparent 1px)",
            backgroundSize: "54px 54px, 54px 54px",
            maskImage:
              "radial-gradient(ellipse 66% 58% at 82% 46%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 66% 58% at 82% 46%, black, transparent)",
          }}
        />
      );
    case "blueprint":
      return (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.24]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
            backgroundSize: "112px 100%",
            maskImage:
              "radial-gradient(ellipse 72% 58% at 18% 54%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 72% 58% at 18% 54%, black, transparent)",
          }}
        />
      );
    case "flow":
      return (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.26]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 14px)",
            backgroundSize: "14px 100%",
            maskImage:
              "linear-gradient(180deg, transparent 0%, black 35%, black 65%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, black 35%, black 65%, transparent 100%)",
          }}
        />
      );
  }
}

/* ------------------------------------------------------------------
 * PlateMotif — four signature glyphs, each echoing the design
 * language of its respective detail page (scaled up from the hero
 * ServiceRegister so each plate's motif registers stronger than
 * the hub preview).
 * ------------------------------------------------------------------ */
function PlateMotif({ variant }: { variant: ServicePlateMotif }) {
  const common = "block h-[62px] w-[132px] sm:h-[68px] sm:w-[144px]";

  switch (variant) {
    case "masthead":
      return (
        <svg
          viewBox="0 0 132 62"
          className={common}
          role="presentation"
          aria-hidden
        >
          <g fill="none" stroke="rgba(255,255,255,0.82)" strokeLinecap="round">
            <path d="M 4 14 L 128 14" strokeWidth="1.8" />
            <path d="M 4 28 L 100 28" strokeWidth="1.2" strokeOpacity="0.7" />
            <path d="M 4 42 L 74 42" strokeWidth="0.9" strokeOpacity="0.48" />
            <path d="M 4 54 L 48 54" strokeWidth="0.7" strokeOpacity="0.32" />
          </g>
          <path d="M 4 2 L 4 8 M 4 2 L 10 2" stroke="rgba(255,255,255,0.5)" strokeWidth="0.7" fill="none" />
        </svg>
      );

    case "catalog":
      return (
        <svg
          viewBox="0 0 132 62"
          className={common}
          role="presentation"
          aria-hidden
        >
          <g fill="none" stroke="rgba(255,255,255,0.62)" strokeWidth="0.9">
            <rect x="4" y="4" width="36" height="26" />
            <rect x="48" y="4" width="36" height="26" />
            <rect x="92" y="4" width="36" height="26" />
            <rect x="4" y="34" width="36" height="26" />
            <rect x="48" y="34" width="36" height="26" />
            <rect x="92" y="34" width="36" height="26" />
          </g>
          <rect x="48" y="4" width="36" height="26" fill="rgba(255,255,255,0.08)" />
          <circle cx="66" cy="17" r="1.5" fill="rgba(255,255,255,0.88)" />
        </svg>
      );

    case "blueprint":
      return (
        <svg
          viewBox="0 0 132 62"
          className={common}
          role="presentation"
          aria-hidden
        >
          <g fill="none" stroke="rgba(255,255,255,0.72)" strokeWidth="1">
            <path d="M 4 4 L 4 58" />
            <path d="M 4 4 L 128 4" />
          </g>
          <g stroke="rgba(255,255,255,0.46)" strokeWidth="0.8">
            <path d="M 36 4 L 36 10" />
            <path d="M 66 4 L 66 10" />
            <path d="M 96 4 L 96 10" />
          </g>
          <g stroke="rgba(255,255,255,0.46)" strokeWidth="0.8">
            <path d="M 4 22 L 10 22" />
            <path d="M 4 40 L 10 40" />
          </g>
          <path
            d="M 122 54 L 128 54 L 128 58"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="0.7"
            fill="none"
          />
          <circle cx="66" cy="34" r="1.8" fill="rgba(255,255,255,0.92)" />
        </svg>
      );

    case "flow":
      return (
        <svg
          viewBox="0 0 132 62"
          className={common}
          role="presentation"
          aria-hidden
        >
          <path
            d="M 10 31 L 122 31"
            stroke="rgba(255,255,255,0.38)"
            strokeWidth="0.9"
            fill="none"
          />
          <g stroke="rgba(255,255,255,0.56)" strokeWidth="0.8" fill="none" strokeLinecap="round">
            <path d="M 40 27 L 44 31 L 40 35" />
            <path d="M 84 27 L 88 31 L 84 35" />
          </g>
          <circle cx="14" cy="31" r="3.4" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
          <circle cx="66" cy="31" r="5" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.82)" strokeWidth="1.1" />
          <circle cx="118" cy="31" r="3.4" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
          <circle cx="66" cy="31" r="1.5" fill="rgba(255,255,255,0.95)" />
        </svg>
      );
  }
}
