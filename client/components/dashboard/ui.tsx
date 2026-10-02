import type { ReactNode } from "react";
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

import { formatDate, formatDZD, formatDZDCompact } from "@/lib/format";
import type { Agency, Booking, MonthlyPoint } from "@/lib/mock/dashboard";

export const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-coral/25 transition hover:bg-coral-dark disabled:opacity-50";

export const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-ink/25";

export const inputClass =
  "w-full rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-ocean focus:ring-4 focus:ring-ocean/10";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="animate-fade-up mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-ink/55">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({
  title,
  description,
  action,
  className = "",
  children,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`min-w-0 rounded-3xl border border-ink/5 bg-white p-6 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-lg font-semibold text-ink">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-ink/50">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  change,
  hint,
  delay = 0,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  change?: number;
  hint?: string;
  delay?: number;
}) {
  const positive = (change ?? 0) >= 0;
  return (
    <div
      className="animate-fade-up rounded-3xl border border-ink/5 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink/55">{label}</p>
        <span className="grid size-10 place-items-center rounded-2xl bg-mist text-ocean">
          <Icon className="size-5" aria-hidden />
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold whitespace-nowrap text-ink sm:text-3xl">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${
              positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {positive ? "+" : ""}
            {change}%
          </span>
        )}
        {hint && <span className="text-ink/45">{hint}</span>}
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  Confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  Published: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  Completed: "bg-sky-50 text-sky-700 ring-sky-600/15",
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Suspended: "bg-rose-50 text-rose-700 ring-rose-600/15",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-600/15",
  Draft: "bg-ink/5 text-ink/60 ring-ink/10",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        STATUS_STYLES[status] ?? STATUS_STYLES.Draft
      }`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </span>
  );
}

export function BarChart({ data }: { data: MonthlyPoint[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex h-64 items-end gap-1.5 sm:gap-3" role="img" aria-label="Monthly revenue chart">
      {data.map((point, i) => {
        const isLast = i === data.length - 1;
        return (
          <div key={point.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div className="relative flex w-full flex-1 items-end">
              <div
                className={`animate-grow-up relative w-full origin-bottom rounded-t-lg transition-colors duration-300 ${
                  isLast ? "bg-coral" : "bg-ocean/80 group-hover:bg-ocean"
                }`}
                style={{ height: `${(point.value / max) * 100}%`, animationDelay: `${i * 60}ms` }}
              >
                <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-ink px-2 py-1 text-[11px] font-semibold whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100">
                  {formatDZDCompact(point.value)}
                </span>
              </div>
            </div>
            <span className={`text-[11px] ${isLast ? "font-semibold text-ink" : "text-ink/45"}`}>
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function Donut({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
  centerLabel: string;
  centerValue: string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const percent = (value: number) => (total ? (value / total) * 100 : 0);
  const stops = segments
    .map((s, i) => {
      const start = percent(segments.slice(0, i).reduce((sum, prev) => sum + prev.value, 0));
      return `${s.color} ${start}% ${start + percent(s.value)}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row lg:flex-col 2xl:flex-row">
      <div
        className="relative grid size-40 shrink-0 place-items-center rounded-full"
        style={{ background: `conic-gradient(${stops})` }}
        role="img"
        aria-label={segments.map((s) => `${s.label}: ${s.value}`).join(", ")}
      >
        <div className="grid size-28 place-items-center rounded-full bg-white text-center">
          <div>
            <p className="text-2xl font-bold text-ink">{centerValue}</p>
            <p className="text-xs text-ink/50">{centerLabel}</p>
          </div>
        </div>
      </div>
      <ul className="w-full min-w-0 space-y-3">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-ink/70">
              <span className="size-2.5 rounded-full" style={{ background: s.color }} aria-hidden />
              {s.label}
            </span>
            <span className="font-semibold text-ink">
              {s.value}
              <span className="ml-1 font-normal text-ink/40">
                {total ? Math.round((s.value / total) * 100) : 0}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <p className="rounded-2xl bg-mist/60 px-4 py-10 text-center text-sm text-ink/50">{message}</p>;
}

export function BookingsTable({
  bookings,
  agencies,
  actions,
}: {
  bookings: Booking[];
  agencies?: Agency[];
  actions?: (booking: Booking) => ReactNode;
}) {
  if (bookings.length === 0) return <EmptyState message="No bookings match your filters." />;

  const agencyName = (id: string) => agencies?.find((a) => a.id === id)?.name ?? "—";

  return (
    <div className="-mx-6 overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink/5 text-xs tracking-wide text-ink/45 uppercase">
            <th className="px-6 py-3 font-medium">Booking</th>
            <th className="px-3 py-3 font-medium">Trip</th>
            {agencies && <th className="px-3 py-3 font-medium">Agency</th>}
            <th className="px-3 py-3 font-medium">Departure</th>
            <th className="px-3 py-3 text-right font-medium">Amount</th>
            <th className="px-3 py-3 font-medium">Status</th>
            {actions && <th className="px-6 py-3 text-right font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/5">
          {bookings.map((b) => (
            <tr key={b.id} className="transition-colors hover:bg-mist/40">
              <td className="px-6 py-4">
                <p className="font-semibold text-ink">{b.customer}</p>
                <p className="text-xs text-ink/45">
                  {b.id} · {b.travelers} {b.travelers > 1 ? "travelers" : "traveler"}
                </p>
              </td>
              <td className="px-3 py-4 text-ink/70">{b.trip}</td>
              {agencies && <td className="px-3 py-4 text-ink/70">{agencyName(b.agencyId)}</td>}
              <td className="px-3 py-4 whitespace-nowrap text-ink/70">{formatDate(b.departure)}</td>
              <td className="px-3 py-4 text-right font-semibold whitespace-nowrap text-ink">
                {formatDZD(b.amount)}
              </td>
              <td className="px-3 py-4">
                <StatusBadge status={b.status} />
              </td>
              {actions && <td className="px-6 py-4 text-right">{actions(b)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
