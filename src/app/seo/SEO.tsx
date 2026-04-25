import { useEffect } from "react";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, type SeoConfig } from "./config";
import { buildBreadcrumbSchema, buildServiceSchema } from "./schema";

type SeoProps = Partial<Omit<SeoConfig, "path">> & {
  path?: string;
  /** Explicit canonical override. Defaults to SITE_URL + path. */
  canonical?: string;
};

/* ------------------------------------------------------------------
 * Head tag helpers — upsert-in-place so navigations overwrite their
 * predecessor's values instead of stacking duplicates. The
 * `data-magicks-seo` sentinel attribute scopes the query to tags we
 * own, so the static baseline tags in index.html remain untouched.
 * ------------------------------------------------------------------ */

const SEO_SENTINEL = "data-magicks-seo";
const SCHEMA_SENTINEL = "data-magicks-schema";

function setMeta(selector: string, createAttr: () => HTMLMetaElement) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = createAttr();
    document.head.appendChild(el);
  }
  return el;
}

function upsertName(name: string, content: string) {
  const el = setMeta(`meta[name="${name}"][${SEO_SENTINEL}]`, () => {
    const m = document.createElement("meta");
    m.setAttribute("name", name);
    m.setAttribute(SEO_SENTINEL, "true");
    return m;
  });
  el.setAttribute("content", content);
}

function upsertProperty(property: string, content: string) {
  const el = setMeta(`meta[property="${property}"][${SEO_SENTINEL}]`, () => {
    const m = document.createElement("meta");
    m.setAttribute("property", property);
    m.setAttribute(SEO_SENTINEL, "true");
    return m;
  });
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(
    `link[rel="canonical"][${SEO_SENTINEL}]`,
  );
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    el.setAttribute(SEO_SENTINEL, "true");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Replace any per-route JSON-LD blocks we previously injected with a
 * fresh set. Static schema in `index.html` (Organization + WebSite)
 * is untouched because it does not carry the `data-magicks-schema`
 * sentinel.
 */
function syncRouteSchema(blocks: unknown[]) {
  const existing = document.head.querySelectorAll<HTMLScriptElement>(
    `script[type="application/ld+json"][${SCHEMA_SENTINEL}]`,
  );
  existing.forEach((node) => node.remove());

  for (const block of blocks) {
    if (!block) continue;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute(SCHEMA_SENTINEL, "true");
    script.textContent = JSON.stringify(block);
    document.head.appendChild(script);
  }
}

/* ------------------------------------------------------------------
 * Canonical + OG image normalisation.
 *
 * Pages may pass absolute URLs (e.g. a remote gallery image) or
 * root-relative paths (e.g. "/og/project.png"). We always emit an
 * absolute URL in meta tags so crawlers resolve consistently.
 * ------------------------------------------------------------------ */

function toAbsolute(urlOrPath: string): string {
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  const path = urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
  return `${SITE_URL}${path}`;
}

/** Strip trailing slash except for the root, to keep canonicals stable. */
function normalisePath(path: string): string {
  if (!path || path === "/") return "/";
  return path.endsWith("/") ? path.slice(0, -1) : path;
}

/**
 * Derive a clean OG image alt by stripping the brand suffix the title
 * usually carries — "Webdesign Kassel | MAGICKS Studio" becomes
 * "Webdesign Kassel". Avoids the "MAGICKS Studio – X | MAGICKS Studio"
 * stutter the previous derivation produced.
 */
function deriveOgImageAlt(title: string, override?: string): string {
  if (override) return override;
  const stripped = title
    .replace(/\s*[|–—-]\s*MAGICKS Studio\s*$/i, "")
    .replace(/\s*[|–—-]\s*MAGICKS\s*$/i, "")
    .trim();
  return stripped.length > 0 ? stripped : SITE_NAME;
}

/**
 * Per-page SEO injector. Renders nothing; manipulates the document
 * head in a single useEffect pass so route changes stay in sync with
 * the title/meta/canonical and per-route JSON-LD. All managed tags
 * carry a `data-magicks-seo` (or `data-magicks-schema`) attribute so
 * they can be identified and overwritten cleanly on every navigation.
 *
 * Usage:
 *   <SEO path="/websites-landingpages" />
 *   <SEO path={`/projekte/${slug}`} title={...} description={...} />
 *
 * For static routes with a config entry in `SEO_BY_PATH`, prefer the
 * `<RouteSEO path="..." />` wrapper — it reads the config for you.
 */
export function SEO({
  path,
  title,
  description,
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  ogImage,
  ogImageAlt,
  ogType,
  robots,
  canonical,
  service,
  breadcrumbs,
}: SeoProps) {
  useEffect(() => {
    const effectiveTitle = title ?? SITE_NAME;
    const effectiveDescription = description ?? "";
    const rawPath = path ?? (typeof window !== "undefined" ? window.location.pathname : "/");
    const effectivePath = normalisePath(rawPath);
    const effectiveCanonical = canonical ?? `${SITE_URL}${effectivePath}`;
    const effectiveOgTitle = ogTitle ?? effectiveTitle;
    const effectiveOgDescription = ogDescription ?? effectiveDescription;
    const effectiveTwitterTitle = twitterTitle ?? effectiveOgTitle;
    const effectiveTwitterDescription = twitterDescription ?? effectiveOgDescription;
    const effectiveOgImage = toAbsolute(ogImage ?? DEFAULT_OG_IMAGE);
    const effectiveOgImageAlt = deriveOgImageAlt(effectiveTitle, ogImageAlt);
    const effectiveOgType = ogType ?? "website";
    const effectiveRobots = robots ?? "index, follow";

    document.title = effectiveTitle;

    upsertName("description", effectiveDescription);
    upsertName("robots", effectiveRobots);

    upsertCanonical(effectiveCanonical);

    upsertProperty("og:type", effectiveOgType);
    upsertProperty("og:site_name", SITE_NAME);
    upsertProperty("og:locale", "de_DE");
    upsertProperty("og:title", effectiveOgTitle);
    upsertProperty("og:description", effectiveOgDescription);
    upsertProperty("og:url", effectiveCanonical);
    upsertProperty("og:image", effectiveOgImage);
    upsertProperty("og:image:alt", effectiveOgImageAlt);

    upsertName("twitter:card", "summary_large_image");
    upsertName("twitter:title", effectiveTwitterTitle);
    upsertName("twitter:description", effectiveTwitterDescription);
    upsertName("twitter:url", effectiveCanonical);
    upsertName("twitter:image", effectiveOgImage);
    upsertName("twitter:image:alt", effectiveOgImageAlt);

    /* ----------------------------------------------------------------
     * Per-route JSON-LD: Service + BreadcrumbList. Static site-wide
     * Organization/WebSite schema lives in index.html so non-JS
     * crawlers always see it. These two blocks ride along on JS-able
     * crawlers (Google) until prerendering lands.
     * ---------------------------------------------------------------- */
    const schemaBlocks: unknown[] = [];
    const serviceBlock = buildServiceSchema(effectivePath, service);
    if (serviceBlock) schemaBlocks.push(serviceBlock);
    const breadcrumbBlock = breadcrumbs ? buildBreadcrumbSchema(breadcrumbs) : null;
    if (breadcrumbBlock) schemaBlocks.push(breadcrumbBlock);
    syncRouteSchema(schemaBlocks);
  }, [
    path,
    title,
    description,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    ogImage,
    ogImageAlt,
    ogType,
    robots,
    canonical,
    service,
    breadcrumbs,
  ]);

  return null;
}
