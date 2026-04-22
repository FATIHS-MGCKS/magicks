import { useEffect } from "react";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, type SeoConfig } from "./config";

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

function setMeta(selector: string, createAttr: () => HTMLMetaElement) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = createAttr();
    document.head.appendChild(el);
  }
  return el;
}

function upsertName(name: string, content: string) {
  const el = setMeta(`meta[name="${name}"][data-magicks-seo]`, () => {
    const m = document.createElement("meta");
    m.setAttribute("name", name);
    m.setAttribute("data-magicks-seo", "true");
    return m;
  });
  el.setAttribute("content", content);
}

function upsertProperty(property: string, content: string) {
  const el = setMeta(`meta[property="${property}"][data-magicks-seo]`, () => {
    const m = document.createElement("meta");
    m.setAttribute("property", property);
    m.setAttribute("data-magicks-seo", "true");
    return m;
  });
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"][data-magicks-seo]',
  );
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    el.setAttribute("data-magicks-seo", "true");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
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
 * Per-page SEO injector. Renders nothing; manipulates the document
 * head in a single useEffect pass so route changes stay in sync with
 * the title/meta/canonical. All managed tags carry a `data-magicks-seo`
 * attribute so they can be identified and overwritten cleanly on every
 * navigation.
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
  robots,
  canonical,
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
    const effectiveRobots = robots ?? "index, follow";

    document.title = effectiveTitle;

    upsertName("description", effectiveDescription);
    upsertName("robots", effectiveRobots);

    upsertCanonical(effectiveCanonical);

    upsertProperty("og:type", "website");
    upsertProperty("og:site_name", SITE_NAME);
    upsertProperty("og:locale", "de_DE");
    upsertProperty("og:title", effectiveOgTitle);
    upsertProperty("og:description", effectiveOgDescription);
    upsertProperty("og:url", effectiveCanonical);
    upsertProperty("og:image", effectiveOgImage);
    upsertProperty("og:image:alt", effectiveOgTitle);

    upsertName("twitter:card", "summary_large_image");
    upsertName("twitter:title", effectiveTwitterTitle);
    upsertName("twitter:description", effectiveTwitterDescription);
    upsertName("twitter:url", effectiveCanonical);
    upsertName("twitter:image", effectiveOgImage);
  }, [
    path,
    title,
    description,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    ogImage,
    robots,
    canonical,
  ]);

  return null;
}
