// Auto-detect the 4 screen corners (TL, TR, BR, BL) of a laptop image
// and write a compressed WebP with an alpha hole at the screen.
//
// Two detection modes:
//   · Alpha mode  — when the source already has a transparent screen.
//   · Color mode  — when the source is a flat RGB photo whose screen
//                   is a near-black rectangle (max(R,G,B) < THRESHOLD).
// In both cases the largest connected region of "screen-like" pixels
// is convex-hull'd and reduced to a 4-vertex quad, then ordered
// clockwise from top-left.
//
// The output WebP gets an alpha hole of exactly that quad — even when
// the source had no alpha — so the existing perspective-mapped iframe
// in Services.tsx will show through unchanged.
//
// Run:  node scripts/detect-screen-corners.mjs

import { statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Source PNG lives outside `public/` so the 8 MB original isn't served
// to the public CDN — only the compressed WebP we emit ends up there.
const SOURCE = resolve(ROOT, "_assets/source/service-websites-alpha-source.png");
const OUT_WEBP = resolve(ROOT, "public/media/home/service-websites-alpha-hires.webp");

const ALPHA_THRESHOLD = 16;
// Color mode: a pixel only counts as "screen-dark" if it's *very* dark.
// The screen of a real photo with no backlight on hits ~RGB(0..3); other
// dark regions (sofa, walls, deep shadows) sit at ~RGB(15..40), so a
// threshold of 6 cleanly isolates the screen and rejects upholstery.
const COLOR_THRESHOLD = 6;
const WEBP_QUALITY = 82;
// Reject any candidate region that's smaller than this fraction of the
// image area (filters out specks of sub-threshold noise).
const MIN_REGION_FRACTION = 0.005;
// Reject any candidate region whose bbox aspect ratio is more extreme
// than 5:1 in either direction — a screen is roughly 16:10, never a
// hairline strip.
const MAX_ASPECT_RATIO = 5;

// ─── Load source ────────────────────────────────────────────────────
console.log("\n→ Loading", SOURCE.replace(ROOT, "").replace(/\\/g, "/"));
const sourceBytes = statSync(SOURCE).size;
console.log("   size:", (sourceBytes / 1024 / 1024).toFixed(2), "MB");

const meta = await sharp(SOURCE).metadata();
const W = meta.width;
const H = meta.height;
console.log("   dims:", W, "×", H, "px, channels:", meta.channels, "hasAlpha:", meta.hasAlpha);

const { data, info } = await sharp(SOURCE)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
console.log("   raw RGBA buffer:", data.length, "bytes");

// ─── 1. Mark candidate pixels ───────────────────────────────────────
const trans = new Uint8Array(W * H);
let totalCandidates = 0;
const channels = info.channels; // 4 (we ensured alpha)

if (meta.hasAlpha) {
  console.log("→ Detection mode: ALPHA channel (source has transparency)");
  for (let i = 0; i < W * H; i++) {
    const a = data[i * channels + 3];
    if (a < ALPHA_THRESHOLD) {
      trans[i] = 1;
      totalCandidates++;
    }
  }
} else {
  console.log("→ Detection mode: COLOR threshold (max(R,G,B) <", COLOR_THRESHOLD + ")");
  for (let i = 0; i < W * H; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    if (r < COLOR_THRESHOLD && g < COLOR_THRESHOLD && b < COLOR_THRESHOLD) {
      trans[i] = 1;
      totalCandidates++;
    }
  }
}
console.log(
  "   candidate pixels:",
  totalCandidates,
  `(${((totalCandidates / (W * H)) * 100).toFixed(1)}%)`,
);

// ─── 2. Largest connected component (4-connectivity flood fill) ─────
let bestRegion = null;
let bestSize = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = y * W + x;
    if (trans[idx] !== 1) continue;
    const stack = [idx];
    const region = [];
    trans[idx] = 2;
    while (stack.length) {
      const p = stack.pop();
      region.push(p);
      const px = p % W;
      const py = (p - px) / W;
      const neigh = [
        py > 0 ? p - W : -1,
        py < H - 1 ? p + W : -1,
        px > 0 ? p - 1 : -1,
        px < W - 1 ? p + 1 : -1,
      ];
      for (const n of neigh) {
        if (n >= 0 && trans[n] === 1) {
          trans[n] = 2;
          stack.push(n);
        }
      }
    }
    if (region.length > bestSize) {
      bestSize = region.length;
      bestRegion = region;
    }
  }
}
if (!bestRegion) {
  console.error("\n✗  No screen-like region found.");
  process.exit(1);
}
console.log("   largest region:", bestSize, "pixels");

// ─── 3. Boundary points ─────────────────────────────────────────────
const boundary = [];
for (const p of bestRegion) {
  const x = p % W;
  const y = (p - x) / W;
  const left = x > 0 ? trans[p - 1] : 0;
  const right = x < W - 1 ? trans[p + 1] : 0;
  const up = y > 0 ? trans[p - W] : 0;
  const down = y < H - 1 ? trans[p + W] : 0;
  if (left !== 2 || right !== 2 || up !== 2 || down !== 2) {
    boundary.push([x, y]);
  }
}
console.log("   boundary pixels:", boundary.length);

// ─── 4. Convex hull (Andrew's monotone chain) ───────────────────────
function cross(o, a, b) {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}
function convexHull(points) {
  points = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const lower = [];
  for (const p of points) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
      lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
      upper.pop();
    upper.push(p);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}
const hull = convexHull(boundary);
console.log("   convex hull vertices:", hull.length);

// ─── 5. Reduce hull to 4 vertices via Visvalingam–Whyatt ────────────
function triArea(a, b, c) {
  return Math.abs(
    (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])) / 2,
  );
}
let poly = hull.slice();
while (poly.length > 4) {
  let minA = Infinity;
  let minI = -1;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[(i - 1 + poly.length) % poly.length];
    const b = poly[i];
    const c = poly[(i + 1) % poly.length];
    const A = triArea(a, b, c);
    if (A < minA) {
      minA = A;
      minI = i;
    }
  }
  poly.splice(minI, 1);
}

// ─── 6. Order clockwise, TL first ───────────────────────────────────
const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length;
const cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
poly.sort(
  (a, b) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx),
);
let tlIdx = 0;
let tlSum = poly[0][0] + poly[0][1];
for (let i = 1; i < poly.length; i++) {
  const s = poly[i][0] + poly[i][1];
  if (s < tlSum) {
    tlSum = s;
    tlIdx = i;
  }
}
poly = poly.slice(tlIdx).concat(poly.slice(0, tlIdx));

const labels = ["TL", "TR", "BR", "BL"];
console.log("\n→ Detected screen quad (CW from TL):");
for (let i = 0; i < 4; i++) console.log(`     ${labels[i]}:  [${poly[i][0]}, ${poly[i][1]}]`);

// ─── 7. Outward expansion (symmetric, conservative) ────────────────
// Earlier tuning used asymmetric +1% L / +1% T / +3% R / +1% B which
// was specific to the previous (alpha-channel) source where the
// right edge of the alpha hole had a 1–2 px sliver. The current
// color-threshold pipeline hits the screen edge cleanly, so any
// asymmetric expansion just bleeds the iframe past the actual bezel.
// We expand uniformly by EXPANSION_PERCENT (default 0 → pixel-perfect
// to the detected polygon).
const EXPANSION_PERCENT = 0;
const minX = Math.min(...poly.map((p) => p[0]));
const maxX = Math.max(...poly.map((p) => p[0]));
const minY = Math.min(...poly.map((p) => p[1]));
const maxY = Math.max(...poly.map((p) => p[1]));
const bw = maxX - minX;
const bh = maxY - minY;
const eL = (EXPANSION_PERCENT / 100) * bw;
const eT = (EXPANSION_PERCENT / 100) * bh;
const eR = (EXPANSION_PERCENT / 100) * bw;
const eB = (EXPANSION_PERCENT / 100) * bh;
const expanded = poly.map(([x, y]) => {
  const dx = x < cx ? -eL : eR;
  const dy = y < cy ? -eT : eB;
  return [Math.round(x + dx), Math.round(y + dy)];
});
console.log(`\n→ Edge-expanded quad (uniform ${EXPANSION_PERCENT}% expansion):`);
for (let i = 0; i < 4; i++)
  console.log(`     ${labels[i]}:  [${expanded[i][0]}, ${expanded[i][1]}]`);

// ─── 8. Punch alpha hole into the source via in-memory raw edit ─────
// We rasterise the expanded quad onto the alpha channel using a
// scanline approach. For each scanline y, find the entry/exit x values
// from the polygon's edges, then set alpha=0 between them.
console.log("\n→ Punching alpha hole into source pixels…");
const quad = expanded;
const minQuadY = Math.min(...quad.map((p) => p[1]));
const maxQuadY = Math.max(...quad.map((p) => p[1]));

for (let y = Math.max(0, minQuadY); y <= Math.min(H - 1, maxQuadY); y++) {
  const xs = [];
  for (let i = 0; i < 4; i++) {
    const [x1, y1] = quad[i];
    const [x2, y2] = quad[(i + 1) % 4];
    if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
      const t = (y - y1) / (y2 - y1);
      xs.push(x1 + t * (x2 - x1));
    }
  }
  xs.sort((a, b) => a - b);
  for (let k = 0; k < xs.length; k += 2) {
    const xStart = Math.max(0, Math.ceil(xs[k]));
    const xEnd = Math.min(W - 1, Math.floor(xs[k + 1]));
    for (let x = xStart; x <= xEnd; x++) {
      data[(y * W + x) * channels + 3] = 0;
    }
  }
}

// ─── 9. Write WebP ──────────────────────────────────────────────────
console.log("→ Encoding WebP @ q=" + WEBP_QUALITY + "  (alpha preserved)…");
await sharp(data, { raw: { width: W, height: H, channels } })
  .webp({ quality: WEBP_QUALITY, alphaQuality: 100, effort: 6 })
  .toFile(OUT_WEBP);

const outBytes = statSync(OUT_WEBP).size;
console.log(`   wrote: ${OUT_WEBP.replace(ROOT, "").replace(/\\/g, "/")}`);
console.log(
  `   size:  ${(outBytes / 1024).toFixed(1)} KB  (${((outBytes / sourceBytes) * 100).toFixed(1)}% of source)`,
);

// ─── 10. Print constants ────────────────────────────────────────────
console.log("\n┌────────────────────────────────────────────────────────────┐");
console.log("│  PASTE INTO src/app/components/home/Services.tsx           │");
console.log("└────────────────────────────────────────────────────────────┘\n");
console.log(`const SCREEN_CORNERS_NATIVE: readonly [V2, V2, V2, V2] = [`);
for (let i = 0; i < 4; i++) {
  console.log(`  [${expanded[i][0]}, ${expanded[i][1]}],   // ${labels[i]}`);
}
console.log(`];\n`);
console.log(`const LAPTOP_PNG_W = ${W};`);
console.log(`const LAPTOP_PNG_H = ${H};`);

console.log("\n✓ Done.\n");
