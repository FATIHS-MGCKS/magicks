# MAGICKS Studio — Mobile Responsive QA Audit
**Date:** 2026-04-25
**Auditor:** Senior mobile responsive QA (read-only audit, no code changes)
**Tooling:** Playwright MCP (`browser_resize`, `browser_evaluate`, `browser_take_screenshot`) + `responsiveness-check` skill methodology
**Target:** `http://localhost:5180/` (homepage, Vite dev build)

---

## 1. Executive Summary

The site is **structurally responsive** — no horizontal page overflow at any tested width (`document.scrollWidth ≤ window.innerWidth` at all 8 viewports). Single-column stacking is correct on phones. The `md:` breakpoint (768 px) cleanly switches the navbar from hamburger to inline.

The defects are concentrated in **four recurring families** that affect every phone width (320–430 px):

1. **Editorial meta-labels are below readable size** (font-size 9–11 px, letter-spacing 0.2–0.42 em). 33 distinct text nodes render below 12 px on mobile.
2. **20 interactive elements ship with sub-44 px touch targets** on mobile, including primary hero & CTA links and the entire footer SEO list (17 px tall).
3. **Three Apple S3-hosted SF Pro Display webfonts return 403 Forbidden** — typography silently falls back to system fonts on every viewport, every load.
4. **One always-on `blur(40px)` decorative element of ~1.4 M px²** runs continuously inside the WhyMagicks aurora, plus 75 elements with persistent `will-change` hints — a meaningful mobile-paint cost.

A small number of cosmetic mobile issues (CTA pill text wrapping at 320, signature wordmark feeling slightly orphaned, wide tracking on chapter folios) round out the list.

**No layout shift was detected during scroll** at any width. The hamburger menu open-state, touch geometry, and overlay are all clean.

---

## 2. Test Methodology

| Step | What | How |
|------|------|-----|
| 1 | Open page | `browser_navigate` → `http://localhost:5180/` |
| 2 | Resize viewport | `browser_resize` at 320 / 360 / 375 / 390 / 414 / 430 / 768 / 1024 px (heights: real device heights) |
| 3 | Settle layout | 350 ms wait |
| 4 | Measure | `browser_evaluate` audits per viewport: `documentElement.scrollWidth` vs `innerWidth`, overflowing element scan, < 12 px font-size scan, < 44 px touch-target scan, large-area `blur()` scan, `will-change` count, doc-height stability across 9 scroll stops |
| 5 | Visualise | `browser_take_screenshot` of hero, §01 Denken, §02 Leistungen, §03 Warum, §04 Studio, §05 Kontakt, footer, mobile menu open state |
| 6 | Console | `browser_console_messages` to capture runtime errors / 403s |

**No code modified.** Dev server (`npm run dev`) was already running on port 5180.

---

## 3. Per-Viewport Layout Snapshot

| Width | innerWidth → scrollWidth | Doc Height | Horizontal Overflow | Sub-44 Touch Targets | Notes |
|-------|--------------------------|-----------|---------------------|----------------------|-------|
| 320 px | 320 → 305 | 9378 px | None | 20 | iPhone SE — narrowest. CTA pill text wraps. |
| 360 px | 360 → 345 | 9154 px | None | 20 | Same mobile layout. |
| 375 px | 375 → 360 | ~9100 px | None | 20 | iPhone 13 / SE 3. Same as 360. |
| 390 px | 390 → 375 | 9104 px | None | 20 | iPhone 14. Same as 375 (Tailwind `sm:` is 640). |
| 414 px | 414 → 399 | ~9100 px | None | 20 | iPhone Plus class. Same. |
| 430 px | 430 → 415 | ~9100 px | None | 20 | iPhone 15 Pro Max. Same. |
| 768 px | 768 → 753 | ~10100 px | None | 22 | iPad portrait — `md:` kicks in. Inline nav appears. Editorial 2-column reveals empty-left content. |
| 1024 px | 1024 → 1009 | — | None | — | iPad landscape / small laptop. Clean desktop layout. |

The constant 15 px gap between `innerWidth` and `scrollWidth` is the reserved scrollbar gutter — not real overflow.

### Layout Transitions Detected

| Transition | Where | Status |
|------------|-------|--------|
| Hamburger → inline nav | between 414 and 768 px (Tailwind `md:` = 768) | Clean — no broken intermediate state. |
| Single-column → 2-column editorial grid | at 768 px (`md:`) | Mechanically clean. UX side-effect: empty left column on tablet feels exaggerated (cosmetic, not a bug). |
| Service preview-stack reveal | mobile vertical stack vs. desktop "ServiceTriad" | Mobile renders `ServiceItem` blocks; desktop swaps in `ServiceTriad`. Both image sets exist in the DOM at the same time (perf note in §6). |

---

## 4. Issue Catalogue

> **Format per issue:** Viewport · Section/Component · Problem · Likely Source · Recommended Fix · Risk

### 4.1 Touch Targets

#### M-T-01 — Hero "Ein Projekt besprechen" CTA height 37 px (HIGH)
- **Viewports:** 320 / 360 / 375 / 390 / 414 / 430 px
- **Section:** Hero
- **Problem:** Primary above-the-fold CTA renders at **184 × 37 px**. 7 px shy of the 44 × 44 minimum. Anchored as a magazine-style underlined link, no `min-height`.
- **Source:** `src/app/components/home/Hero.tsx` lines ~353–370 (`<Link to="/kontakt" className="group relative inline-flex items-baseline gap-3 …">`).
- **Fix:** Add `min-h-[44px] py-2 sm:py-2.5` (or wrap the inner span in a 44 px hit area) without altering the visible underline rule. The arrow + label can stay visually compact.
- **Risk:** **High** — primary conversion CTA on every phone.

#### M-T-02 — About "Mehr über das Studio" link height 32 px (HIGH)
- **Viewports:** 320–430 px
- **Section:** §04 Studio
- **Problem:** Underlined text-link at **188 × 32 px**. 12 px shy.
- **Source:** `src/app/components/home/About.tsx` ~line 460 (`group inline-flex items-center gap-3 text-[15px] …`).
- **Fix:** Add `min-h-[44px]` and small vertical padding; keep underline-decoration treatment unchanged.
- **Risk:** **High** — secondary studio CTA.

#### M-T-03 — Final-CTA mailto `hello@magicks.de` height 32 px (HIGH)
- **Viewports:** 320–430 px
- **Section:** §05 Kontakt / Final CTA
- **Problem:** Italic mailto link **310 × 32 px** (font-size 1.25 rem). 12 px shy. The pill button above is fine.
- **Source:** `src/app/components/home/FinalCTA.tsx` lines 312–317.
- **Fix:** `inline-flex min-h-[44px] items-center` on the `<a>`.
- **Risk:** **High** — only direct contact path on the page besides the form.

#### M-T-04 — Footer SEO links 17 px tall (HIGH)
- **Viewports:** 320–430 px
- **Section:** Footer / SEO column
- **Problem:** Four links — *Webdesign Kassel · Landing Pages Kassel · Produktkonfigurator erstellen lassen · KI-Automation für Unternehmen* — render at **102/121/204/180 × 17 px**. **27 px shy** of 44 px. With only `space-y-2` between rows, they sit ~25 px apart center-to-center — borderline mis-tap zone.
- **Source:** `src/app/components/Footer.tsx` lines 54–65 (`text-[12.5px]` link, `space-y-2` list).
- **Fix:** Either (a) add `inline-flex min-h-[36px] items-center` like `linkClass` already does for primary nav, or (b) bump font to 13 px and `space-y-3`. (a) is the closer-match.
- **Risk:** **High** — these are SEO landing-page links explicitly meant to be tapped.

#### M-T-05 — Footer mailto in copyright row 17 px tall (MEDIUM)
- **Viewports:** 320–430 px
- **Section:** Footer / copyright row
- **Problem:** `hello@magicks.de` at **102 × 17 px**. 27 px shy.
- **Source:** `src/app/components/Footer.tsx` lines 121–128.
- **Fix:** Wrap in `inline-flex min-h-[36px] items-center` and bump to `text-[13px]`.
- **Risk:** **Medium** — duplicate of the prominent CTA mailto, but still a tap target.

#### M-T-06 — Logo link wrapper 88 × 32 px (MEDIUM)
- **Viewports:** 320–430 px
- **Section:** Navbar
- **Problem:** Logo `<a href="/">` measures **88 × 32 px** (the SVG-image is the only child). Width is fine; height fails 44 px.
- **Source:** `src/app/components/Navbar.tsx` (logo Link wrapping `<MagicksLogo />`).
- **Fix:** `inline-flex h-11 items-center` on the `<a>` (the rounded pill bar around it is 64 px tall but the anchor itself is small).
- **Risk:** **Medium** — users typically tap the brand area to return home.

#### M-T-07 — Footer primary/services/legal links 36 px tall (MEDIUM)
- **Viewports:** 320–430 px
- **Section:** Footer columns
- **Problem:** Already use `inline-flex min-h-[36px]` (per the recent footer pass) but still **8 px shy** of 44 px on phones. With dense `space-y-2.5` rows, the gaps between rows are ~10 px — adequate but not generous.
- **Source:** `src/app/components/Footer.tsx` (the `linkClass` constant).
- **Fix:** Lift `min-h-[36px]` → `min-h-[44px]` for `< sm`; revert to current 36 px for tablets/desktop if visual rhythm regresses.
- **Risk:** **Medium**.

### 4.2 Typography & Readability

#### M-Y-01 — Editorial meta-labels at 9–11 px (HIGH)
- **Viewports:** 320–430 px (especially 320)
- **Section:** Hero (§ 00), §01 Denken, §02 Leistungen, §03 Warum, §04 Studio, §05 Kontakt — all `ChapterMarker`s; service badges `01/02/03/04`; Studio "Fig. 04 / Arbeitsplatz / N51° / E9°" location stamps; "· Studio" wordmark suffix.
- **Problem:** **33 distinct text nodes < 12 px** on mobile, many at 9–10 px. Examples:
  - `§ 00` chapter folio: 9 px / `tracking 0.42em` (`Hero.tsx`)
  - `§ 01 — Denken`, `§ 02 — Leistungen` …: 10 px / `tracking 0.2em` (`ChapterMarker.tsx`)
  - Service `01 / 02 / 03 / 04` badges: 11 px / `tracking 0.28em` (`Services.tsx`)
  - Service category labels (*Marke / Commerce / System / Automation & KI*): 9.5 px / `tracking 0.3em`
  - Footer SEO links: 12.5 px (just under threshold)
  - Studio location grid (*N51°19′ · E9°29′*): 10 px / `tracking 0.2em`
- **Source:** Editorial scale defined inline across `home/*.tsx`. `ChapterMarker.tsx` is one of the most repeated.
- **Fix:** Establish a mobile-floor policy: **no editorial text below 11 px on `< 640px`**, and at that floor use `tracking ≤ 0.18em`. Concretely:
  - `ChapterMarker.tsx`: bump mobile from `text-[10px] tracking-[0.2em]` → `text-[11px] tracking-[0.16em]`; keep `sm:tracking-[0.34em] sm:text-[10.5px]`.
  - Service badge in `Services.tsx`: 11 px is borderline, 0.28em is too loose at that size — drop to `0.18em` on `< sm`.
  - Hero `§ 00` (9 px / 0.42em): bump to 10.5 px / 0.22em on mobile to keep it sub-headline-quiet but readable on a 320 px screen.
- **Risk:** **High** — this is the *one* mobile-readability theme the user has flagged repeatedly.

#### M-Y-02 — Hero CTA pill text wraps to 2 lines on 320 (MEDIUM)
- **Viewports:** 320 px
- **Section:** Final CTA pill ("Unverbindlich anfragen")
- **Problem:** Text wraps to two lines inside the white pill at 320 px because the pill width is too narrow for "Unverbindlich anfragen" + arrow at the current padding. Visual feels cramped.
- **Source:** `src/app/components/home/FinalCTA.tsx` (the white pill button block).
- **Fix:** Either (a) reduce horizontal padding for `< sm` (e.g. `px-6 sm:px-8`), (b) reduce font from 16 → 15 px on `< sm`, or (c) tighten letter-spacing slightly. Keep the pill height ≥ 56 px.
- **Risk:** **Medium** — affects only 320 px, but that is iPhone SE / older Android.

#### M-Y-03 — SF Pro Display fonts fail with HTTP 403 (HIGH)
- **Viewports:** All
- **Section:** Global (typography stack)
- **Problem:** Console shows
  ```
  Failed to load resource: 403 — applesocial.s3.amazonaws.com/.../sf-pro-display_regular.woff2
  Failed to load resource: 403 — …_medium.woff2
  Failed to load resource: 403 — …_semibold.woff2
  ```
  All three weights are referenced in `src/styles/fonts.css` lines 5/13/21/29 from a third-party Apple S3 bucket. `document.fonts` reports the family but no glyph file ever loads → silent fallback to system. On iOS Safari the system fallback **happens to be SF Pro**, so the visual cost is invisible there. On Android, Windows, and most desktop browsers the result is Helvetica / Segoe UI / Roboto instead of the intended typeface.
- **Source:** `src/styles/fonts.css` lines 3–32.
- **Fix:** Either (a) self-host the SF Pro Display weights (proper Apple licence required), or (b) replace SF Pro Display with a licensed alternative already in the stack (Manrope is loaded; Inter / SF Pro Text local fallback is one option).
- **Risk:** **High** — the entire UI font silently falls back on three of four major device-OS combinations.

#### M-Y-04 — Inline `font-size` literals limit per-viewport tuning (MEDIUM)
- **Viewports:** 320–430 px
- **Section:** Throughout — service items, chapter markers, footer
- **Problem:** Many components set `text-[10px]`, `text-[10.5px]`, `text-[11px]`, `text-[12.5px]` directly without `sm:` ladders. This makes per-viewport tuning piecemeal and is the root mechanism behind M-Y-01.
- **Source:** Multiple components (see grep results in §6).
- **Fix:** Adopt 2–3 named utilities — e.g. `eyebrow-xs (11/0.18 → sm 12/0.34)`, `meta-tag-xs (12/0.16 → sm 12.5/0.30)` — and migrate inline values toward them.
- **Risk:** **Medium** — refactor risk, not visible bug, but unblocks M-Y-01.

### 4.3 Layout / Spacing / Stacking

#### M-L-01 — `§04 Studio` signature feels orphaned at the bottom of the section (LOW)
- **Viewports:** 320–430 px (visible at all phones; tablet+ has the hairline so it's anchored)
- **Section:** §04 Studio, end-of-section signature row
- **Problem:** The handwritten "Magicks Studio" wordmark is right-aligned with `· Studio` mono suffix to its right. The decorative hairline (`hidden h-px w-16 sm:block`) is intentionally hidden on `< sm`, leaving the wordmark hovering against the right edge with empty left space. Visually disconnected from the body text above on phones.
- **Source:** `src/app/components/home/About.tsx` (`<MagicksSignatureReveal>` row).
- **Fix:** On mobile, swap `justify-end` → `justify-center` and add a subtle hairline that's allowed on phones too (e.g. `inline-block h-px w-8`). Keeps the editorial feel and binds the signature to the section.
- **Risk:** **Low** — cosmetic.

#### M-L-02 — `§02 Leistungen` section is 2150 px tall on 320 (≈ 2.7 phone screens) (LOW)
- **Viewports:** 320 px
- **Section:** §02 Leistungen
- **Problem:** Four `ServiceItem` blocks stack vertically with image + text + CTA each. Total 2150 px on a 320 phone — three full screen-heights of slow scroll between hero and §03.
- **Source:** `src/app/components/home/Services.tsx` (mobile vertical stack path).
- **Fix:** Tighten per-item vertical rhythm on `< sm` — e.g. shrink image aspect from `4/5` to `5/4`, drop `mt-` between items by ~25 %, or collapse description to 2 lines initially with a "weiterlesen" chip. Keep desktop choreography untouched.
- **Risk:** **Low** — feels long but content is correct, no overflow.

#### M-L-03 — Footer copyright + mailto stack feels disconnected on mobile (LOW)
- **Viewports:** 320–430 px
- **Section:** Footer bottom row
- **Problem:** `flex flex-col items-center justify-between gap-4 … sm:flex-row`. On mobile the `© 2026 …` is left-aligned (because of the inner `<p>` width) while the `hello@magicks.de` is forced center by `items-center`. Visual asymmetry — the mailto looks orphaned.
- **Source:** `src/app/components/Footer.tsx` lines 117–129.
- **Fix:** Replace `items-center` with `items-start` on mobile (`items-start sm:items-center`), or wrap each `<p>` in a `w-full` block so they align consistently to the section column.
- **Risk:** **Low**.

#### M-L-04 — `§01 Denken` has empty left column on 768 px (LOW)
- **Viewports:** 768 px
- **Section:** §01 Denken, §03 Warum, §04 Studio (anywhere using the editorial 2-column grid)
- **Problem:** At exactly 768 px the `md:` 2-col grid kicks in and content sits in the right half, leaving the left half as a wide vacant column. Not a bug — it is the editorial choice — but on iPad portrait it looks more like wasted space than negative space.
- **Source:** Sections under `home/*.tsx` using `md:grid-cols-12 md:col-start-…` patterns.
- **Fix:** Defer the 2-column reveal to `lg:` (1024 px+) so iPad portrait keeps a centred single-column composition. If the left column should appear at 768 px, populate it with the chapter folio / pull-quote / number to give it weight.
- **Risk:** **Low** — design call rather than a bug; flagged because the user specifically asked about iPad widths.

### 4.4 Decorative / Animation / Performance

#### M-A-01 — Always-on `blur(40px)` over a 1.4 M px area in §03 Warum aurora (HIGH)
- **Viewports:** All phones (also bigger, but worst on phones with weak GPUs)
- **Section:** §03 Warum (`WhyMagicks.tsx`)
- **Problem:** A decorative gradient div with `class="absolute left-1/2 top-[-20%] h-[140%] w-[42%]"` and **inline** `style="filter: blur(40px); transform: translateX(-50%) rotate(12deg)"`. At 390×844 viewport the bounding box is **1410 × 1000 ≈ 1.41 M px** — bigger than the viewport itself. Blur(40px) over this area is one of the most expensive paint operations possible, and it stays painted permanently because the element has `will-change: transform`. `adaptBlur()` in `scrollMotion.ts` only touches GSAP-driven blur, not this static CSS filter. Confirmed by `getComputedStyle` returning `filter: blur(40px)` regardless of viewport.
- **Source:** `src/app/components/home/WhyMagicks.tsx` lines 364–372.
- **Fix:** Use one of:
  - Step-down per viewport: `filter: blur(${vw < 480 ? 18 : vw < 1024 ? 26 : 40}px)` via inline-style hook.
  - Reduce blur radius and compensate with opacity (e.g. `blur(16px)` + opacity boost gives a similar atmospheric look at a fraction of the paint cost).
  - Replace the 40 px blur with a pre-rasterised PNG/WebP (single decode, zero per-frame cost).
  - Hide entirely on `< 480 px` (`hidden sm:block`) — the rest of the section is rich enough.
- **Risk:** **High** for low-end phones (perceptible scroll jank during §03), **medium** otherwise.

#### M-A-02 — 75 elements with persistent `will-change` (MEDIUM)
- **Viewports:** All
- **Section:** Global, but concentrated in Hero, Services, About, FinalCTA
- **Problem:** `getComputedStyle` count of elements with `will-change ≠ auto` is **75** on a single page. Each forces a separate GPU compositor layer, which costs both video memory and per-frame paint scheduling. Best practice: set `will-change` only during the active animation window and drop it at end. Patterns like `will-change-[opacity,transform,filter]` baked into Tailwind class strings keep them on permanently.
- **Source:** Many — easiest grep: `rg "will-change-\[" src/app/components/home`.
- **Fix:** Either prune to ~ 15–25 layers (only those actively scrubbed) by replacing static `will-change-…` classes with a small JS hook that toggles `style.willChange = "transform"` only on `ScrollTrigger.onEnter` and removes it on `onLeave`. GSAP can do this inline via `onStart` / `onComplete`.
- **Risk:** **Medium** — does not break rendering; degrades sustained scroll FPS on low-RAM phones.

#### M-A-03 — Multiple GSAP-driven blur scrubs running concurrently (MEDIUM)
- **Viewports:** All phones
- **Section:** Hero, §01 Denken, §02 Leistungen, §03 Warum, §04 Studio
- **Problem:** 10 elements were observed with `filter: blur(<small>px)` in mid-animation states (e.g. `1.93px`, `2.96px`, `3.96px`) on a single scroll position. Combined with the 75-layer compositor list (M-A-02), continuous GPU upload during fast scroll is expensive even though the per-element blur radius is small.
- **Source:** `presenceEnvelope` / `focusEnvelope` / `rackFocusTrack` in `src/app/lib/scrollMotion.ts`.
- **Fix:** `adaptBlur()` already halves on narrow viewport — verify it runs for *all* sites of `filter: blur(...)` set by GSAP, not only some. Consider zero-blur on `< 480 px` (replace with a small `opacity` shift only) to match the user's "smoother on phones" goal.
- **Risk:** **Medium** — perceptible only on weak GPUs.

#### M-A-04 — Service preview images render at 1376 × 768 onto a ~280 px wide slot (MEDIUM)
- **Viewports:** 320–430 px
- **Section:** §02 Leistungen + §04 Studio (`about-studio.webp`)
- **Problem:** `service-websites.webp / service-shops.webp / service-software.webp / service-automation.webp / about-studio.webp` are 1376×768 source. At 320 px viewport they paint into a ~280 × 350 px slot — a ~5× oversample. WebP keeps the wire size sane but the **decode cost** is per-pixel of source, not per-pixel of slot. Each of these images is also referenced **twice** in the DOM (mobile `ServiceItem` + desktop `ServiceTriad` preview-stack both rendered, one hidden by CSS).
- **Source:** `src/app/components/home/Services.tsx`, `home/About.tsx`, `public/media/home/`.
- **Fix:** Add `srcset` + `sizes` in three breakpoint flavours (e.g. 480w / 960w / 1376w) and let the browser pick. Optionally render only one of the two preview blocks at a time by mounting based on a `useBreakpoint` hook (CSS `display:none` still keeps the `<img>` decoded).
- **Risk:** **Medium** — first-paint and scroll-paint cost on phones; not a visual bug.

### 4.5 Console / Runtime

#### M-C-01 — React `fetchPriority` casing warning (LOW)
- **Viewports:** All
- **Section:** Navbar / `MagicksLogo`
- **Problem:** Console error from React 18: *"React does not recognize the `fetchPriority` prop on a DOM element. Spell it as lowercase `fetchpriority`."* Triggered by `<img fetchPriority="high">` in `src/app/components/MagicksLogo.tsx`.
- **Source:** `src/app/components/MagicksLogo.tsx` line ~17.
- **Fix:** Either (a) replace with lowercase `fetchpriority="high"` (raw HTML attribute), or (b) check React version — React 18.3 + supports the camelCase form; bump if pinned older. The current spelling is harmless at runtime but litters the console for every page render.
- **Risk:** **Low** — cosmetic / dev-tools noise.

---

## 5. What's Working Well (worth preserving on next pass)

- **No horizontal page overflow** at any tested width — all decorative absolutely-positioned blocks have `overflow:hidden` ancestors or are inside `aspect-ratio` boxes.
- **No layout shift during scroll** — `documentElement.scrollHeight` was 9104 px at every one of 9 scroll stops on 390 px width.
- **Hamburger menu** (`Navbar.tsx`) — button is exactly **44 × 44 px**, the open-menu links are **262 × 48 px** each, and the open animation is calm. Nothing to do here.
- **Hero typography ladder** at `text-7xl / text-8xl` proportions falls cleanly into its mobile counterparts; the "Wir bauen das Web, das dein Business verdient." headline never wraps awkwardly.
- **Footer touch-target pass that already happened** (`linkClass` with `inline-flex min-h-[36px]`) is the right pattern — just needs to be lifted to 44 on phones (M-T-07) and applied to the SEO column (M-T-04) and mailto rows (M-T-05).
- **Hostinger / `hello@magicks.de`** corrections from the previous pass are everywhere; no stale references found while crawling the page.

---

## 6. Source-File Mapping (for the implementation pass)

Found via `Grep` (cross-checked against runtime DOM):

| Issue ID | File | Line(s) |
|----------|------|---------|
| M-T-01 | `src/app/components/home/Hero.tsx` | ~353–370 |
| M-T-02 | `src/app/components/home/About.tsx` | ~458–465 |
| M-T-03 | `src/app/components/home/FinalCTA.tsx` | 312–317 |
| M-T-04 | `src/app/components/Footer.tsx` | 54–65 |
| M-T-05 | `src/app/components/Footer.tsx` | 117–129 |
| M-T-06 | `src/app/components/Navbar.tsx` | (logo `<Link>` wrapper) |
| M-T-07 | `src/app/components/Footer.tsx` | (`linkClass` constant) |
| M-Y-01 | `src/app/components/home/ChapterMarker.tsx` 31; `home/Services.tsx` 463–467; `home/Hero.tsx` (§ 00); `home/About.tsx` (Studio meta) | — |
| M-Y-02 | `src/app/components/home/FinalCTA.tsx` | (CTA pill) |
| M-Y-03 | `src/styles/fonts.css` | 3–32 |
| M-Y-04 | Spread across `home/*.tsx` | — |
| M-L-01 | `src/app/components/home/About.tsx` | (signature row) |
| M-L-02 | `src/app/components/home/Services.tsx` | (mobile vertical stack) |
| M-L-03 | `src/app/components/Footer.tsx` | 117–129 |
| M-L-04 | `home/*.tsx` `md:` 2-col grids | — |
| M-A-01 | `src/app/components/home/WhyMagicks.tsx` | 364–372 |
| M-A-02 | Many — search `will-change-\[` under `src/app/components/home` | — |
| M-A-03 | `src/app/lib/scrollMotion.ts` | (`adaptBlur`, envelopes) |
| M-A-04 | `src/app/components/home/Services.tsx`, `home/About.tsx`, `public/media/home/*.webp` | — |
| M-C-01 | `src/app/components/MagicksLogo.tsx` | ~17 |

---

## 7. Risk Summary

| Severity | Count | Issues |
|----------|-------|--------|
| **High** | 7 | M-T-01, M-T-02, M-T-03, M-T-04, M-Y-01, M-Y-03, M-A-01 |
| **Medium** | 8 | M-T-05, M-T-06, M-T-07, M-Y-02, M-Y-04, M-A-02, M-A-03, M-A-04 |
| **Low** | 5 | M-L-01, M-L-02, M-L-03, M-L-04, M-C-01 |

Recommended order of attack on the next change pass (highest mobile UX yield first):

1. **M-Y-03** — fix or replace SF Pro Display (one file, fixes typography on every device).
2. **M-T-01 / M-T-02 / M-T-03** — three CTAs to 44 px tall (three small edits).
3. **M-T-04 / M-T-05 / M-T-07** — footer touch-target sweep (one file).
4. **M-Y-01** — editorial-label typography pass (`ChapterMarker.tsx` first, then service badges).
5. **M-A-01** — step-down or rasterise the WhyMagicks aurora blur on phones.
6. Everything else.

---

## 8. Out-of-Scope Notes

- Per the brief, no code was modified. All measurements are observational.
- Desktop ≥ 1280 px not re-audited (user scope ends at 1024 px).
- Accessibility beyond touch-target sizing (semantic landmarks, ARIA, contrast on the `text-white/35` editorial labels) was not in the brief; ChapterMarker labels at `text-white/46` over `bg-[#0A0A0B]` may also fail WCAG AA contrast — flagged here as a follow-up candidate, not part of this audit.
- All 8 viewport screenshots are saved under `magicks-landing/.playwright-mcp/` (`audit-{width}-{section}.png`) for visual reference.

---

*End of audit — no files modified.*
