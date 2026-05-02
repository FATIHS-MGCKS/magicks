/**
 * Route prefetch map.
 *
 * When a nav/footer link is hovered or focused the matching async
 * chunk is imported ahead of the actual navigation. This turns the
 * otherwise cold-cache click into an effectively instant route
 * transition — the chunk + its dependencies are already in flight
 * (and usually cached) by the time the user actually commits to the
 * click.
 *
 * Only routes that are realistically reachable via hover/focus from
 * another route are listed here. The homepage itself is not
 * prefetchable (if you're hovering something, you are already on a
 * page, and any homepage internals you could navigate to are
 * route-split and listed below).
 */
const prefetchers: Record<string, () => Promise<unknown>> = {
  "/leistungen": () => import("../pages/LeistungenPage"),
  "/projekte": () => import("../pages/ProjektePage"),
  "/ueber-uns": () => import("../pages/UeberUnsPage"),
  "/kontakt": () => import("../pages/ContactPage"),

  "/websites-landingpages": () => import("../pages/services/WebsitesLandingPagesPage"),
  "/shops-produktkonfiguratoren": () => import("../pages/services/ShopsKonfiguratorenPage"),
  "/web-software": () => import("../pages/services/WebSoftwarePage"),
  "/ki-automationen-integrationen": () => import("../pages/services/KiAutomationenPage"),

  "/website-im-abo": () => import("../pages/seo/WebsiteImAboPage"),
  "/webdesign-kassel": () => import("../pages/seo/WebdesignKasselPage"),
  "/landingpages-kassel": () => import("../pages/seo/LandingPagesKasselPage"),
  "/produktkonfigurator-erstellen": () => import("../pages/seo/ProduktkonfiguratorErstellenPage"),
  "/ki-automation-unternehmen": () => import("../pages/seo/KiAutomationUnternehmenPage"),
  "/seo-sichtbarkeit": () => import("../pages/seo/SeoSichtbarkeitPage"),
  "/content-bildwelt-medien": () => import("../pages/seo/ContentBildweltMedienPage"),

  "/impressum": () => import("../pages/legal/ImpressumPage"),
  "/datenschutz": () => import("../pages/legal/DatenschutzPage"),
};

const inflight = new Set<string>();

/**
 * Kick off loading of a route's code + nested imports.
 * Safe to call multiple times — each route is prefetched at most once.
 */
export function prefetchRoute(path: string): void {
  const loader = prefetchers[path];
  if (!loader) return;
  if (inflight.has(path)) return;
  inflight.add(path);
  void loader().catch(() => {
    // Network blip or chunk failure — let the normal lazy() fallback
    // on navigation surface the error. Remove from the inflight set
    // so a retry on a future hover is allowed.
    inflight.delete(path);
  });
}
