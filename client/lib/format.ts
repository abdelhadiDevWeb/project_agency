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
