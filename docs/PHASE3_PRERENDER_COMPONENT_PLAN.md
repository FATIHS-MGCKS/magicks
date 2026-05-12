# Phase 3 Plan: Prerender And Component Consolidation

## Scope
- Keep public-site performance work and portal architecture work separated.
- Preserve current routes, premium visual direction, SEO intent, and motion concepts.
- Ship in small, reversible PRs with measurable checkpoints.

## Track A: Public Route Prerender

### Goal
Serve route HTML with route-level SEO metadata and JSON-LD present in first response, not only after client hydration.

### Candidate Routes
- `/`
- `/leistungen`
- `/websites-landingpages`
- `/shops-produktkonfiguratoren`
- `/web-software`
- `/ki-automationen-integrationen`
- `/seo-sichtbarkeit`
- `/content-bildwelt-medien`
- `/website-im-abo`
- `/website-starter`
- `/webdesign-kassel`
- `/landingpages-kassel`
- `/produktkonfigurator-erstellen`
- `/ki-automation-unternehmen`
- `/kontakt`
- `/ueber-uns`
- `/projekte`

### Approach
1. Add a prerender step to Vite build for static public routes.
2. Keep dynamic project detail routes (`/projekte/:slug`) in current SPA mode unless a separate static-data strategy is approved.
3. Ensure prerender output does not include `/portal` routes.
4. Validate canonical, Open Graph, Twitter, and JSON-LD blocks in prerendered HTML snapshots.

### Verification
- Compare prerendered HTML head tags against expected `RouteSEO` values.
- Confirm `robots.txt` and sitemap behavior remains unchanged.
- Re-run `npm run build` and crawl static output for metadata regressions.

## Track B: Shared Service Page Building Blocks

### Goal
Reduce repeated page boilerplate only after design/content has stabilized.

### Candidate Shared Units
- Common `Eyebrow` primitive
- Common primary CTA button shell
- Shared hero intro reveal wiring
- Shared section reveal wrappers for service/capability pages

### Approach
1. Freeze page copy and layout decisions first.
2. Extract one component/helper at a time.
3. Keep per-page visual motifs and section ordering route-specific.
4. Reject extra abstraction if it hides page intent or increases prop complexity.

### Verification
- Route-by-route visual QA (desktop/tablet/mobile).
- Keep current animation cadence and spacing intact.
- Confirm no SEO metadata regressions per route.

## Track C: CSS Utility Cleanup

### Goal
Remove dead/legacy utility styles without visual regressions.

### Approach
1. Build a usage map of custom utility classes.
2. Remove only classes with zero references in `src/app`.
3. Keep a short rollback window per cleanup batch.

### Verification
- Screenshot diff across key public pages.
- Focus checks on typography, spacing rhythm, and contrast layers.

## Delivery Order
1. Prerender prototype on a small route subset (`/`, `/leistungen`, one service page).
2. Expand prerender coverage after metadata validation.
3. Start component consolidation in separate PRs.
4. Finish with CSS cleanup batches.
