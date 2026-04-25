/**
 * Standalone sitemap generator — mirrors the vite plugin's logic.
 *
 * Usage: `node scripts/generate-sitemap.mjs`
 *
 * Why this exists alongside the plugin:
 *   The plugin only runs on `vite build`. This script writes the same
 *   `public/sitemap.xml` from outside a build invocation, so the file
 *   can be regenerated quickly during SEO work or CI smoke tests
 *   without producing the full dist/ output.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SOURCE_CONFIG = resolve(ROOT, "src/app/seo/config.ts");
const SOURCE_PROJECTS = resolve(ROOT, "src/app/data/projects.ts");
const TARGET = resolve(ROOT, "public/sitemap.xml");

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|\s)\/\/.*$/gm, "$1");
}

function xmlEscape(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function extractSiteUrl(configSrc) {
  const match = configSrc.match(/SITE_URL\s*=\s*["']([^"']+)["']/);
  if (!match) throw new Error("[sitemap] SITE_URL not found in seo/config.ts");
  return match[1].replace(/\/$/, "");
}

function extractStaticPaths(configSrc) {
  const match = configSrc.match(/export const SITEMAP_PATHS[^=]*=\s*\[([\s\S]*?)\];/m);
  if (!match) throw new Error("[sitemap] SITEMAP_PATHS not found in seo/config.ts");
  return [...match[1].matchAll(/["']([^"']+)["']/g)]
    .map((m) => m[1])
    .filter((s) => s.startsWith("/"));
}

function extractFeaturedProjectSlugs(projectsSrc) {
  const arrayMatch = projectsSrc.match(/export const PROJECTS[^=]*=\s*\[([\s\S]*)\];/m);
  if (!arrayMatch) return [];

  const body = arrayMatch[1];
  const slugs = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        const block = body.slice(start, i + 1);
        if (/\bfeatured\s*:\s*true\b/.test(block)) {
          const slugMatch = block.match(/\bslug\s*:\s*["']([^"']+)["']/);
          if (slugMatch) slugs.push(slugMatch[1]);
        }
        start = -1;
      }
    }
  }
  return slugs;
}

function metaForPath(routePath) {
  if (routePath === "/") return { changefreq: "weekly", priority: "1.0" };
  if (routePath === "/leistungen") return { changefreq: "monthly", priority: "0.9" };
  if (routePath === "/projekte") return { changefreq: "monthly", priority: "0.8" };
  if (routePath.startsWith("/projekte/")) return { changefreq: "monthly", priority: "0.7" };
  if (routePath === "/ueber-uns" || routePath === "/kontakt") {
    return { changefreq: "monthly", priority: "0.7" };
  }
  const serviceRoutes = new Set([
    "/websites-landingpages",
    "/shops-produktkonfiguratoren",
    "/web-software",
    "/ki-automationen-integrationen",
  ]);
  if (serviceRoutes.has(routePath)) return { changefreq: "monthly", priority: "0.85" };
  return { changefreq: "monthly", priority: "0.75" };
}

function buildSitemapXml(entries) {
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${xmlEscape(e.loc)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const configSrc = stripComments(readFileSync(SOURCE_CONFIG, "utf8"));
const projectsSrc = stripComments(readFileSync(SOURCE_PROJECTS, "utf8"));

const siteUrl = extractSiteUrl(configSrc);
const staticPaths = extractStaticPaths(configSrc);
const featuredSlugs = extractFeaturedProjectSlugs(projectsSrc);

const merged = [...staticPaths];
for (const slug of featuredSlugs) {
  const route = `/projekte/${slug}`;
  if (!merged.includes(route)) merged.push(route);
}

const lastmod = new Date().toISOString().slice(0, 10);
const entries = merged.map((p) => {
  const { changefreq, priority } = metaForPath(p);
  const canonicalPath = p === "/" ? "/" : p.replace(/\/$/, "");
  return {
    loc: `${siteUrl}${canonicalPath}`,
    lastmod,
    changefreq,
    priority,
  };
});

const xml = buildSitemapXml(entries);
writeFileSync(TARGET, xml);
console.log(`[sitemap] wrote ${TARGET} (${entries.length} urls)`);
