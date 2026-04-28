// One-shot sweep that injects U+FE0E (Variation Selector-15) after every
// arrow glyph that can otherwise render as an emoji on iOS/Android.
// Idempotent: skips arrows that already have VS-15 right after them.
//
// Usage:  node scripts/fix-arrow-glyphs.mjs
//
// Glyphs covered:
//   U+2197 ↗  North-East arrow  (used everywhere as the "external link" mark)
//   U+2196 ↖  North-West arrow
//   U+2198 ↘  South-East arrow  (used as section / chapter marker)
//   U+2199 ↙  South-West arrow

import { readFileSync, writeFileSync } from "node:fs";
import { globSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const ARROWS = ["\u2196", "\u2197", "\u2198", "\u2199"];
const VS15 = "\uFE0E";

const patterns = ["src/**/*.tsx", "src/**/*.ts"];
const files = patterns.flatMap((p) =>
  globSync(p, { cwd: ROOT, absolute: true }),
);

let totalFiles = 0;
let totalReplacements = 0;

for (const file of files) {
  const before = readFileSync(file, "utf8");
  let after = before;
  let perFile = 0;

  for (const arrow of ARROWS) {
    // Match the arrow only when it is NOT already followed by VS-15.
    const re = new RegExp(arrow + "(?!" + VS15 + ")", "g");
    after = after.replace(re, () => {
      perFile++;
      return arrow + VS15;
    });
  }

  if (perFile > 0) {
    writeFileSync(file, after, "utf8");
    totalFiles++;
    totalReplacements += perFile;
    console.log(
      "  " + file.replace(ROOT, "").replace(/\\/g, "/") + "  (+" + perFile + ")",
    );
  }
}

console.log("");
console.log(
  "Done — " + totalReplacements + " arrow(s) hardened across " + totalFiles + " file(s).",
);
