/**
 * Normalisation helpers used for lead deduplication.
 *
 * Two leads are considered duplicates if their normalised
 * `companyName + city + phone` triple matches. The phone number is
 * reduced to digits only (so "+49 561 12345" and "0561-12345" collide
 * the way a human reading the lead list would expect).
 */

export function normalizeText(value: string | undefined | null): string {
  if (!value) return "";
  return value
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizePhone(value: string | undefined | null): string {
  if (!value) return "";
  // Reduce to a numeric form so different formatting collides.
  // We deliberately keep a leading 0 if present after stripping non-digits
  // because German national numbers are commonly written that way.
  return value.toString().replace(/[^0-9]/g, "");
}

export function dedupeKey(
  companyName: string | undefined | null,
  city: string | undefined | null,
  phone: string | undefined | null,
): string {
  return [normalizeText(companyName), normalizeText(city), normalizePhone(phone)].join("|");
}
