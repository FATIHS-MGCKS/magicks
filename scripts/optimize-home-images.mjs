/**
 * One-off WebP conversion for the five heavy home PNGs.
 *
 * Usage: `node scripts/optimize-home-images.mjs`
 *
 * Rationale:
 *   The five original PNGs in /public/media/home weighed 1.3–1.7 MB each
 *   (~7.3 MB combined). On a 4G iPhone that single-handedly dominates
 *   the initial load. Converting to WebP at q=82 with a 1600px ceiling
 *   brings each asset below 180 KB while keeping the editorial grain
 *   and tonal depth visually intact.
 *
 *   We keep the original PNG paths in the source code by overwriting the
 *   file name with a .webp twin and updating the <img src> references.
 *   The originals are left on disk for archival; .gitignore-add them if
 *   repo size ever matters.
 */

import { readdir, stat } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";

const INPUT_DIR = "public/media/home";
const QUALITY = 82;
const MAX_WIDTH = 1600;

const files = await readdir(INPUT_DIR);
const pngs = files.filter((f) => f.toLowerCase().endsWith(".png"));

for (const file of pngs) {
  const inputPath = join(INPUT_DIR, file);
  const { name } = parse(file);
  const outputPath = join(INPUT_DIR, `${name}.webp`);

  const inputBytes = (await stat(inputPath)).size;

  await sharp(inputPath)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(outputPath);

  const outputBytes = (await stat(outputPath)).size;
  const savedKB = Math.round((inputBytes - outputBytes) / 1024);
  const ratio = ((outputBytes / inputBytes) * 100).toFixed(0);

  console.log(
    `${file.padEnd(28)} ${Math.round(inputBytes / 1024)}KB → ${Math.round(
      outputBytes / 1024,
    )}KB (${ratio}%, saved ${savedKB}KB)`,
  );
}
