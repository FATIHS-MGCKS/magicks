/**
 * Quick validator for the JSON-LD block in dist/index.html.
 * Confirms the schema parses, lists @graph node types, and checks for
 * the studio's email and address.
 *
 * Usage: `node scripts/validate-schema.mjs`
 */

import { readFileSync } from "node:fs";

const html = readFileSync("dist/index.html", "utf8");
const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

if (!m) {
  console.error("NO JSON-LD block found in dist/index.html");
  process.exit(1);
}

let obj;
try {
  obj = JSON.parse(m[1]);
} catch (err) {
  console.error("JSON-LD failed to parse:", err.message);
  process.exit(1);
}

console.log("JSON-LD parsed OK.");
console.log("@graph entries:", obj["@graph"].length);
const types = obj["@graph"].map((g) =>
  Array.isArray(g["@type"]) ? g["@type"].join("+") : g["@type"],
);
console.log("Types:", types.join(", "));

const org = obj["@graph"].find((g) => g["@id"]?.endsWith("#organization"));
console.log("Organization email:", org?.email);
console.log("Organization geo:", org?.geo?.latitude, org?.geo?.longitude);
console.log(
  "Organization address:",
  org?.address?.streetAddress,
  org?.address?.postalCode,
  org?.address?.addressLocality,
);
console.log("areaServed entries:", org?.areaServed?.length);
