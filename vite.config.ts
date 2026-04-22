import { readFileSync } from "node:fs";
import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

/* ------------------------------------------------------------------
 * Sitemap generator — single source of truth at build time.
 *
 * Rationale:
 *   Before this plugin, the sitemap lived in two places (config.ts'
 *   SITEMAP_PATHS and a committed public/sitemap.xml). Adding a page
 *   meant editing both and hoping they stayed in sync. Instead, this
 *   plugin parses the same TypeScript sources the app uses — the route
 *   list in `src/app/seo/config.ts` and the featured project slugs in
 *   `src/app/data/projects.ts` — and emits a fresh sitemap.xml into
 *   `dist/` on every build. The committed tree only stores the inputs.
 *
 * Parsing approach:
 *   The two source files are stable, hand-maintained, and follow a
 *   predictable shape. A couple of narrow regexes extract the data
 *   we need without adding a TS module loader as a build dep.
 * ------------------------------------------------------------------ */

const SOURCE_CONFIG = "src/app/seo/config.ts";
const SOURCE_PROJECTS = "src/app/data/projects.ts";

type SitemapEntry = {
  loc: string;
  changefreq: string;
  priority: string;
  lastmod: string;
};

function readSource(relPath: string): string {
  return readFileSync(path.resolve(__dirname, relPath), "utf8");
}

/**
 * Strip `//` and `/* ... *\/` comments so the regex scanners below
 * never pick up fake route strings or stray `featured: true` hits out
 * of commented-out code. Quick-and-dirty is fine here — the TS source
 * files never contain string literals that span across a comment
 * boundary.
 */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|\s)\/\/.*$/gm, "$1");
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function extractSiteUrl(configSrc: string): string {
  const match = configSrc.match(/SITE_URL\s*=\s*["']([^"']+)["']/);
  if (!match) throw new Error("[sitemap] SITE_URL not found in seo/config.ts");
  return match[1].replace(/\/$/, "");
}

function extractStaticPaths(configSrc: string): string[] {
  const match = configSrc.match(/export const SITEMAP_PATHS[^=]*=\s*\[([\s\S]*?)\];/m);
  if (!match) throw new Error("[sitemap] SITEMAP_PATHS not found in seo/config.ts");
  return [...match[1].matchAll(/["']([^"']+)["']/g)]
    .map((m) => m[1])
    // Only real root-relative routes — ignore any incidental strings
    // someone might drop into the array as a comment-like note.
    .filter((s) => s.startsWith("/"));
}

function extractFeaturedProjectSlugs(projectsSrc: string): string[] {
  const arrayMatch = projectsSrc.match(/export const PROJECTS[^=]*=\s*\[([\s\S]*)\];/m);
  if (!arrayMatch) return [];

  const body = arrayMatch[1];
  const slugs: string[] = [];
  // Walk brace-matched top-level object literals. Each project is a
  // depth-0 `{ ... }` block. We pull the slug iff the block contains
  // `featured: true`.
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

function metaForPath(routePath: string): { changefreq: string; priority: string } {
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

function buildSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${xmlEscape(e.loc)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function magicksSitemapPlugin(): Plugin {
  return {
    name: "magicks-sitemap",
    apply: "build",
    generateBundle() {
      const configSrc = stripComments(readSource(SOURCE_CONFIG));
      const projectsSrc = stripComments(readSource(SOURCE_PROJECTS));

      const siteUrl = extractSiteUrl(configSrc);
      const staticPaths = extractStaticPaths(configSrc);
      const featuredSlugs = extractFeaturedProjectSlugs(projectsSrc);

      // Merge in featured projects that the static list may not yet
      // reference, then dedupe while preserving the manual order in
      // SITEMAP_PATHS for any static entries and appending new slugs
      // at the end.
      const merged: string[] = [...staticPaths];
      for (const slug of featuredSlugs) {
        const route = `/projekte/${slug}`;
        if (!merged.includes(route)) merged.push(route);
      }

      const lastmod = new Date().toISOString().slice(0, 10);
      const entries: SitemapEntry[] = merged.map((p) => {
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
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: xml,
      });

      // eslint-disable-next-line no-console
      console.log(`[sitemap] emitted dist/sitemap.xml (${entries.length} urls)`);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), magicksSitemapPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
          gsap: ["gsap"],
        },
      },
    },
  },
  server: {
    // Bind on all interfaces so localhost, 127.0.0.1, and LAN IPs work consistently.
    host: true,
    port: 5180,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.svg", "**/*.csv"],
});
