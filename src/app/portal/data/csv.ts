/**
 * Robust CSV parser for the lead exports created in ChatGPT.
 *
 * - Tolerant of UTF-8 BOM (strips it from the first cell)
 * - Auto-detects ; or , as separator on the header row (semicolon wins
 *   if it appears at all, since the brief says these CSVs are normally
 *   semicolon-delimited)
 * - Handles double-quoted fields with embedded separators, newlines,
 *   and escaped quotes ("") per RFC 4180
 * - Skips fully blank lines so trailing newlines don't create a
 *   "ghost" row in the preview
 */

const KNOWN_HEADER_MAP: Record<string, keyof MappedRow> = {
  nr: "nr",
  unternehmen: "companyName",
  ort: "city",
  entfernung_ab_kassel: "distanceFromKassel",
  bereich: "industry",
  telefon: "phone",
  bewertungssignal: "ratingSignal",
  website_pruefung: "websiteCheck",
  google_check_status: "googleCheckStatus",
  lead_status: "leadStatusRaw",
  einschaetzung: "assessment",
  quelle: "sourceUrl",
  recherche_hinweis: "researchNote",
  // Common variants tolerated.
  firma: "companyName",
  stadt: "city",
  branche: "industry",
};

export interface MappedRow {
  nr?: string;
  companyName?: string;
  city?: string;
  distanceFromKassel?: string;
  industry?: string;
  phone?: string;
  ratingSignal?: string;
  websiteCheck?: string;
  googleCheckStatus?: string;
  leadStatusRaw?: string;
  assessment?: string;
  sourceUrl?: string;
  researchNote?: string;
  rawMetadata: Record<string, string>;
}

export interface ParsedCsv {
  headers: string[];
  /** Header → mapped field name we recognised (or null if it goes to rawMetadata). */
  fieldMap: Array<{ header: string; mapped: keyof MappedRow | null }>;
  rows: MappedRow[];
  delimiter: ";" | ",";
  /** Filled when parsing fails for unrecoverable reasons. */
  error?: string;
}

const stripBom = (s: string): string =>
  s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;

const normalizeHeader = (h: string): string =>
  h
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

function detectDelimiter(firstLine: string): ";" | "," {
  return firstLine.includes(";") ? ";" : ",";
}

function tokenize(input: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === delimiter) {
      current.push(field);
      field = "";
      continue;
    }
    if (ch === "\r") continue;
    if (ch === "\n") {
      current.push(field);
      rows.push(current);
      current = [];
      field = "";
      continue;
    }
    field += ch;
  }
  if (field.length > 0 || current.length > 0) {
    current.push(field);
    rows.push(current);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

export function parseCsv(input: string): ParsedCsv {
  const text = stripBom(input ?? "");
  if (!text.trim()) {
    return { headers: [], fieldMap: [], rows: [], delimiter: ";", error: "Leere Datei." };
  }

  const firstLineEnd = text.indexOf("\n");
  const firstLine = firstLineEnd === -1 ? text : text.slice(0, firstLineEnd);
  const delimiter = detectDelimiter(firstLine);

  const tokens = tokenize(text, delimiter);
  if (tokens.length < 1) {
    return {
      headers: [],
      fieldMap: [],
      rows: [],
      delimiter,
      error: "CSV enthält keine Zeilen.",
    };
  }

  const headers = tokens[0].map((h) => h.trim());
  const fieldMap = headers.map((header) => {
    const key = normalizeHeader(header);
    const mapped = (KNOWN_HEADER_MAP[key] ?? null) as keyof MappedRow | null;
    return { header, mapped };
  });

  const rows: MappedRow[] = [];
  for (let r = 1; r < tokens.length; r += 1) {
    const cells = tokens[r];
    const row: MappedRow = { rawMetadata: {} };
    for (let c = 0; c < headers.length; c += 1) {
      const value = (cells[c] ?? "").trim();
      if (!value) continue;
      const map = fieldMap[c];
      if (map.mapped) {
        // rawMetadata stays — but we don't double-write here.
        (row as Record<string, unknown>)[map.mapped as string] = value;
      } else {
        row.rawMetadata[map.header] = value;
      }
    }
    rows.push(row);
  }

  return { headers, fieldMap, rows, delimiter };
}
