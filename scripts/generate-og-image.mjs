/**
 * One-off OG fallback PNG generator.
 *
 * Usage: `node scripts/generate-og-image.mjs`
 *
 * Rationale:
 *   `og-default.svg` ships as a 2.4 KB infrastructure placeholder, but
 *   Facebook, LinkedIn, WhatsApp, X (Twitter), Slack, Telegram and
 *   Discord do not render SVG as `og:image`. Most either show a broken
 *   thumbnail or fall back to a domain-only stub. This script renders a
 *   1200×630 PNG twin from a server-safe SVG (system fonts only — no
 *   Instrument Serif / SF Mono dependency) so every share preview lands
 *   with a real raster image. The site keeps the SVG too as a
 *   build-time placeholder; only the OG meta references the PNG.
 *
 *   Dimensions: 1200×630 (the canonical 1.91:1 OG ratio).
 *   Palette:    #0A0A0A background, #F3F7FF foreground.
 *   Output:     `public/og-default.png` (target ≈ 60–120 KB).
 *
 *   Per-route OG image overrides remain supported via the `ogImage`
 *   field on `SeoConfig`; this fallback only fires when a page has none.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const W = 1200;
const H = 630;

// Server-safe SVG — uses generic serif/monospace stacks so the
// rasterizer (librsvg via sharp) never reaches for an unavailable
// proprietary face. Georgia / Times New Roman are universally present
// on Windows, macOS and Linux installations of librsvg with fontconfig.
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#0A0A0A"/>

  <!-- Editorial inner frame — mirrors the hairline-rule idiom on the site. -->
  <g stroke="#F3F7FF" fill="none">
    <rect x="72" y="72" width="1056" height="486" stroke-opacity="0.08" stroke-width="1"/>
    <line x1="72" y1="118" x2="1128" y2="118" stroke-opacity="0.06" stroke-width="1"/>
    <line x1="72" y1="512" x2="1128" y2="512" stroke-opacity="0.06" stroke-width="1"/>
  </g>

  <!-- Top-left folio. -->
  <text x="96" y="106"
        font-family="Consolas, 'Courier New', monospace"
        font-size="14" letter-spacing="4.2"
        fill="#F3F7FF" fill-opacity="0.46">§ 00 — STUDIO · MMXXVI</text>

  <!-- Top-right specimen. -->
  <text x="1104" y="106" text-anchor="end"
        font-family="Consolas, 'Courier New', monospace"
        font-size="14" letter-spacing="4.2"
        fill="#F3F7FF" fill-opacity="0.34">MAGICKS.STUDIO</text>

  <!-- Wordmark. Generous optical size, serif italic cadence. -->
  <text x="600" y="332" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="176" letter-spacing="-6"
        font-weight="400"
        fill="#F3F7FF">MAGICKS</text>

  <!-- Italic coda. -->
  <text x="600" y="392" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="36" font-style="italic" letter-spacing="0.2"
        fill="#F3F7FF" fill-opacity="0.7">Studio</text>

  <!-- Bottom strap — quiet editorial line. -->
  <text x="600" y="548" text-anchor="middle"
        font-family="Consolas, 'Courier New', monospace"
        font-size="12" letter-spacing="5.2"
        fill="#F3F7FF" fill-opacity="0.4">WEBSITES · SHOPS · WEB-SOFTWARE · KI-AUTOMATIONEN</text>
</svg>`;

const outputPath = resolve("public/og-default.png");

const buffer = await sharp(Buffer.from(svg), { density: 144 })
  .png({ quality: 90, compressionLevel: 9 })
  .toBuffer();

writeFileSync(outputPath, buffer);

const sizeKB = Math.round(buffer.length / 1024);
console.log(`og-default.png written → ${outputPath} (${sizeKB} KB, ${W}×${H})`);
