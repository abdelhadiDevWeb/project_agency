const NBSP = "\u00A0";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function groupThousands(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

function oneDecimal(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "");
}

/** Full Algerian dinar amount, e.g. "289 000 DA". Formatted by hand so server and browser output always match. */
export function formatDZD(value: number): string {
  return `${groupThousands(value)}${NBSP}DA`;
}

/** Short dinar amount for charts and KPIs, e.g. "18.4 M DA". */
export function formatDZDCompact(value: number): string {
  if (value >= 1_000_000_000) return `${oneDecimal(value / 1_000_000_000)}${NBSP}Md${NBSP}DA`;
  if (value >= 1_000_000) return `${oneDecimal(value / 1_000_000)}${NBSP}M${NBSP}DA`;
  if (value >= 10_000) return `${oneDecimal(value / 1_000)}${NBSP}k${NBSP}DA`;
  return formatDZD(value);
}

export function formatNumber(value: number): string {
  return groupThousands(value);
}

/** "2026-10-18" -> "18 Oct 2026" */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function parseISODate(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

/** Whole days from `from` to `to` (negative when `to` is earlier). Both are "YYYY-MM-DD". */
export function daysBetween(from: string, to: string): number {
  return Math.round((parseISODate(to) - parseISODate(from)) / DAY_MS);
}

/** "2026-01-31" + 1 month -> "2026-02-28": the day is clamped to the end of the target month. */
export function addMonths(iso: string, months: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const target = new Date(Date.UTC(year, month - 1 + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target.toISOString().slice(0, 10);
}
