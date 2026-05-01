/**
 * Tiny formatting helpers used across portal pages.
 * Kept here rather than scattered ad-hoc inline.
 */

export function formatDate(value: string | undefined | null): string {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function formatDateTime(value: string | undefined | null): string {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function formatRelative(value: string | undefined | null): string {
  if (!value) return "—";
  try {
    const d = new Date(value).getTime();
    if (!Number.isFinite(d)) return "—";
    const diffMs = d - Date.now();
    const abs = Math.abs(diffMs);
    const m = 60 * 1000;
    const h = 60 * m;
    const day = 24 * h;
    const fmt = new Intl.RelativeTimeFormat("de-DE", { numeric: "auto" });
    if (abs < h) return fmt.format(Math.round(diffMs / m), "minute");
    if (abs < day) return fmt.format(Math.round(diffMs / h), "hour");
    if (abs < 14 * day) return fmt.format(Math.round(diffMs / day), "day");
    return formatDate(value);
  } catch {
    return formatDate(value);
  }
}

/** "Today" / "Overdue" / "in N days" status for a follow-up dueDate. */
export type DueClass = "overdue" | "today" | "soon" | "later" | "none";

export function classifyDue(value: string | undefined | null): DueClass {
  if (!value) return "none";
  const due = new Date(value).getTime();
  if (!Number.isFinite(due)) return "none";
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const startOfTomorrow = startOfToday + 24 * 60 * 60 * 1000;
  if (due < startOfToday) return "overdue";
  if (due < startOfTomorrow) return "today";
  if (due < startOfToday + 7 * 24 * 60 * 60 * 1000) return "soon";
  return "later";
}

