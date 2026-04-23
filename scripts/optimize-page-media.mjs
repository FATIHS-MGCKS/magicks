/**
 * One-off conversion of the 4 freshly-generated PNG page anchors into
 * optimized WebP assets at our canonical public paths.
 *
 * Follows the same optimization profile as `scripts/optimize-service-media.mjs`:
 *   - quality 78, effort 6
 *   - strips metadata, resizes wide hero crops down to 2200 px max
 *   - writes to public/media/<path>/<name>.webp
 */
import sharp from "sharp";
import { mkdir, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import process from "node:process";

const ROOT = resolve(process.cwd());
const SOURCE_DIR = "C:\\Users\\FS93\\.cursor\\projects\\c-Users-FS93-MAGICKS\\assets";

const jobs = [
  {
    in: "ueber-uns-studio.png",
    out: "public/media/pages/ueber-uns/studio.webp",
    maxWidth: 2200,
  },
  {
    in: "projekt-renova-cover.png",
    out: "public/media/projects/renova-strassensanierung/cover.webp",
    maxWidth: 2400,
  },
  // Refinement pass 2 — v3 supersedes v1 (NORDWERK wordmark, minimal
  // copy, no body gibberish, specimen-worthy frontal composition).
  {
    in: "webdesign-kassel-anchor-v3.png",
    out: "public/media/pages/webdesign-kassel/anchor.webp",
    maxWidth: 2200,
  },
  {
    in: "landingpages-kassel-anchor.png",
    out: "public/media/pages/landingpages-kassel/anchor.webp",
    maxWidth: 2200,
  },
  // Refinement pass 2 — Renova detail crop pairs with the macro cover
  // as a "zoom out / zoom in" editorial diptych: golden-hour context of
  // a finished resin repair across an industrial access road.
  {
    in: "renova-detail-01.png",
    out: "public/media/projects/renova-strassensanierung/detail-01.webp",
    maxWidth: 2400,
  },
];

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function run() {
  for (const job of jobs) {
    const inputPath = resolve(SOURCE_DIR, job.in);
    const outputPath = resolve(ROOT, job.out);
    const exists = await fileExists(inputPath);
    if (!exists) {
      console.warn(`⚠  skipping — source missing: ${inputPath}`);
      continue;
    }
    await mkdir(dirname(outputPath), { recursive: true });
    await sharp(inputPath)
      .resize({ width: job.maxWidth, withoutEnlargement: true })
      .webp({ quality: 78, effort: 6 })
      .toFile(outputPath);
    const meta = await sharp(outputPath).metadata();
    console.log(
      `✓  ${job.out}  ·  ${meta.width}×${meta.height}  ·  ${(
        (meta.size ?? 0) /
        1024
      ).toFixed(1)} KB`,
    );
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
