import Link from "next/link";
import { ArrowRight, Building2, CalendarCheck, Percent, Wallet } from "lucide-react";

import { BarChart, BookingsTable, Donut, PageHeader, Panel, StatCard, StatusBadge } from "@/components/dashboard/ui";
import { formatDate, formatDZDCompact, formatNumber } from "@/lib/format";
import { AGENCIES, BOOKINGS, PLATFORM_COMMISSION, PLATFORM_MONTHLY } from "@/lib/mock/dashboard";

export default function AdminOverviewPage() {
  const gmv = PLATFORM_MONTHLY.reduce((sum, m) => sum + m.value, 0);
  const commission = gmv * PLATFORM_COMMISSION;
  const totalBookings = AGENCIES.reduce((sum, a) => sum + a.bookings, 0);
  const active = AGENCIES.filter((a) => a.status === "Active");
  const pending = AGENCIES.filter((a) => a.status === "Pending");
  const suspended = AGENCIES.filter((a) => a.status === "Suspended");
  const topAgencies = [...AGENCIES].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const topRevenue = topAgencies[0]?.revenue ?? 1;

  const thisMonth = PLATFORM_MONTHLY[PLATFORM_MONTHLY.length - 1].value;
  const lastMonth = PLATFORM_MONTHLY[PLATFORM_MONTHLY.length - 2].value;
  const monthChange = Math.round(((thisMonth - lastMonth) / lastMonth) * 1000) / 10;

  return (
    <>
      <PageHeader
        title="Platform overview"
        description="Every agency on Voyago at a glance. Amounts in Algerian dinar, last 12 months."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Gross booking value" value={formatDZDCompact(gmv)} icon={Wallet} change={18.6} hint="vs previous year" />
        <StatCard
          label={`Commission (${Math.round(PLATFORM_COMMISSION * 100)}%)`}
          value={formatDZDCompact(commission)}
          icon={Percent}
          change={18.6}
          hint="vs previous year"
          delay={80}
        />
        <StatCard
          label="Active agencies"
          value={`${active.length} / ${AGENCIES.length}`}
          icon={Building2}
          hint={`${pending.length} waiting for approval`}
          delay={160}
        />
        <StatCard
          label="Total bookings"
          value={formatNumber(totalBookings)}
          icon={CalendarCheck}
          change={12.4}
          hint="vs previous year"
          delay={240}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel
          title="Gross booking value"
          description={`This month ${formatDZDCompact(thisMonth)} (${monthChange > 0 ? "+" : ""}${monthChange}% vs last month)`}
          className="lg:col-span-2"
        >
          <BarChart data={PLATFORM_MONTHLY} />
        </Panel>
        <Panel title="Agencies by status">
          <Donut
            centerValue={String(AGENCIES.length)}
            centerLabel="agencies"
            segments={[
              { label: "Active", value: active.length, color: "var(--color-ocean)" },
              { label: "Pending", value: pending.length, color: "var(--color-sun)" },
              { label: "Suspended", value: suspended.length, color: "var(--color-coral)" },
            ]}
          />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel
          title="Top agencies"
          description="By gross booking value"
          className="lg:col-span-2"
          action={
            <Link href="/admin/agencies" className="flex items-center gap-1 text-sm font-semibold text-ocean hover:underline">
              All agencies <ArrowRight className="size-4" />
            </Link>
          }
        >
          <ul className="space-y-4">
            {topAgencies.map((a, i) => (
              <li key={a.id} className="flex items-center gap-4">
                <span className="w-5 text-sm font-semibold text-ink/35">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate font-semibold text-ink">
                      {a.name} <span className="font-normal text-ink/45">· {a.city}</span>
                    </p>
                    <p className="text-sm font-semibold whitespace-nowrap text-ink">{formatDZDCompact(a.revenue)}</p>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-ocean to-ocean-light"
                      style={{ width: `${(a.revenue / topRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Waiting for approval"
          description={`${pending.length} new agencies`}
          action={
            <Link href="/admin/agencies" className="text-sm font-semibold text-ocean hover:underline">
              Review
            </Link>
          }
        >
          <ul className="space-y-3">
            {pending.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 rounded-2xl bg-sand p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{a.name}</p>
                  <p className="text-xs text-ink/50">
                    {a.city} · applied {formatDate(a.joined)}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="Latest bookings"
        description="Across all agencies"
        className="mt-6"
        action={
          <Link href="/admin/bookings" className="flex items-center gap-1 text-sm font-semibold text-ocean hover:underline">
            All bookings <ArrowRight className="size-4" />
          </Link>
        }
      >
        <BookingsTable bookings={BOOKINGS.slice(0, 6)} agencies={AGENCIES} />
      </Panel>
    </>
  );
}
