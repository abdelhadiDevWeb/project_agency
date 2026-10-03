import type { Metadata } from "next";
import { CalendarCheck, CircleX, ShoppingBag, Trophy, Wallet } from "lucide-react";

import { LineChart } from "@/components/dashboard/LineChart";
import { Donut, PageHeader, Panel, StatCard } from "@/components/dashboard/ui";
import { formatDZD, formatDZDCompact, formatNumber } from "@/lib/format";
import {
  MONTH_LABELS,
  MONTHLY_BOOKINGS,
  MONTHLY_BOOKINGS_PREVIOUS,
  MONTHLY_CANCELLATIONS,
  monthlyRecurringRevenue,
  mrrHistory,
  PLANS,
  PLATFORM_MONTHLY,
  PLATFORM_MONTHLY_PREVIOUS,
  SUBSCRIPTIONS,
  TOP_DESTINATIONS,
} from "@/lib/mock/dashboard";
import { requireSpace } from "@/lib/session";

export const metadata: Metadata = { title: "Statistics" };

const OCEAN = "#0f766e";
const CORAL = "#ff6b4a";
const SUN = "#f5b841";
const SLATE = "#94a3b8";

const sum = (values: number[]) => values.reduce((total, v) => total + v, 0);
const percentChange = (current: number, previous: number) =>
  previous ? Math.round(((current - previous) / previous) * 1000) / 10 : 0;

export default async function AdminStatisticsPage() {
  await requireSpace("admin");

  const gmvValues = PLATFORM_MONTHLY.map((m) => m.value);
  const gmvPreviousValues = PLATFORM_MONTHLY_PREVIOUS.map((m) => m.value);
  const gmv = sum(gmvValues);
  const gmvPrevious = sum(gmvPreviousValues);

  const bookings = sum(MONTHLY_BOOKINGS);
  const bookingsPrevious = sum(MONTHLY_BOOKINGS_PREVIOUS);
  const cancellations = sum(MONTHLY_CANCELLATIONS);
  const cancellationRate = Math.round((cancellations / bookings) * 1000) / 10;

  const averageBooking = gmv / bookings;
  const averageBookingPrevious = gmvPrevious / bookingsPrevious;

  const mrr = monthlyRecurringRevenue(SUBSCRIPTIONS, PLANS);
  const mrrValues = mrrHistory(mrr);
  const mrrChange = percentChange(mrrValues[mrrValues.length - 1], mrrValues[mrrValues.length - 2]);

  const liveSubscriptions = SUBSCRIPTIONS.filter((s) => s.status === "Active" || s.status === "Trial");
  const planSegments = PLANS.map((plan, i) => ({
    label: plan.id,
    value: liveSubscriptions.filter((s) => s.plan === plan.id).length,
    color: [SUN, OCEAN, CORAL][i] ?? SLATE,
  }));

  const bestGmvMonth = gmvValues.indexOf(Math.max(...gmvValues));
  const busiestMonth = MONTHLY_BOOKINGS.indexOf(Math.max(...MONTHLY_BOOKINGS));
  const monthlyCancelRates = MONTHLY_CANCELLATIONS.map((c, i) => c / MONTHLY_BOOKINGS[i]);
  const calmestMonth = monthlyCancelRates.indexOf(Math.min(...monthlyCancelRates));
  const topDestination = TOP_DESTINATIONS[0]?.bookings ?? 1;

  const highlights = [
    {
      label: "Best month for sales",
      value: MONTH_LABELS[bestGmvMonth],
      detail: formatDZDCompact(gmvValues[bestGmvMonth]),
    },
    {
      label: "Busiest month",
      value: MONTH_LABELS[busiestMonth],
      detail: `${formatNumber(MONTHLY_BOOKINGS[busiestMonth])} bookings`,
    },
    {
      label: "Lowest cancellation rate",
      value: MONTH_LABELS[calmestMonth],
      detail: `${(monthlyCancelRates[calmestMonth] * 100).toFixed(1)}%`,
    },
    {
      label: "Top destination",
      value: TOP_DESTINATIONS[0]?.name ?? "—",
      detail: `${formatNumber(topDestination)} bookings`,
    },
  ];

  return (
    <>
      <PageHeader
        title="Statistics"
        description="How the platform is performing over the last 12 months, compared with the year before."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Gross booking value"
          value={formatDZDCompact(gmv)}
          icon={Wallet}
          change={percentChange(gmv, gmvPrevious)}
          hint="vs previous year"
        />
        <StatCard
          label="Bookings"
          value={formatNumber(bookings)}
          icon={CalendarCheck}
          change={percentChange(bookings, bookingsPrevious)}
          hint="vs previous year"
          delay={80}
        />
        <StatCard
          label="Average booking"
          value={formatDZD(averageBooking)}
          icon={ShoppingBag}
          change={percentChange(averageBooking, averageBookingPrevious)}
          hint="vs previous year"
          delay={160}
        />
        <StatCard
          label="Cancellation rate"
          value={`${cancellationRate}%`}
          icon={CircleX}
          hint={`${formatNumber(cancellations)} cancelled bookings`}
          delay={240}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel
          title="Gross booking value"
          description="This year compared with the same months last year"
          className="lg:col-span-2"
        >
          <LineChart
            labels={MONTH_LABELS}
            format="dzd"
            withRanges
            ariaLabel="Gross booking value per month, this year and last year"
            series={[
              { label: "This year", values: gmvValues, color: OCEAN, area: true },
              { label: "Last year", values: gmvPreviousValues, color: SLATE, dashed: true },
            ]}
          />
        </Panel>
        <Panel title="Subscriptions by plan" description="Active and trial subscriptions">
          <Donut centerValue={String(liveSubscriptions.length)} centerLabel="subscriptions" segments={planSegments} />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Bookings and cancellations" description={`${formatNumber(bookings)} bookings, ${cancellationRate}% cancelled`}>
          <LineChart
            labels={MONTH_LABELS}
            format="number"
            withRanges
            ariaLabel="Bookings and cancellations per month"
            series={[
              { label: "Bookings", values: MONTHLY_BOOKINGS, color: OCEAN, area: true },
              { label: "Cancellations", values: MONTHLY_CANCELLATIONS, color: CORAL, area: true },
            ]}
          />
        </Panel>
        <Panel
          title="Subscription revenue"
          description={`Monthly recurring revenue ${formatDZD(mrr)} (${mrrChange > 0 ? "+" : ""}${mrrChange}% vs last month)`}
        >
          <LineChart
            labels={MONTH_LABELS}
            format="dzd"
            withRanges
            ariaLabel="Monthly recurring revenue from agency subscriptions"
            series={[{ label: "MRR", values: mrrValues, color: CORAL, area: true }]}
          />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Top destinations" description="By number of bookings" className="lg:col-span-2">
          <ul className="space-y-4">
            {TOP_DESTINATIONS.map((d, i) => (
              <li key={d.name} className="flex items-center gap-4">
                <span className="w-5 text-sm font-semibold text-ink/35">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate font-semibold text-ink">
                      {d.name} <span className="font-normal text-ink/45">· {d.country}</span>
                    </p>
                    <p className="text-sm font-semibold whitespace-nowrap text-ink">{formatNumber(d.bookings)}</p>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-coral to-sun"
                      style={{ width: `${(d.bookings / topDestination) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Highlights">
          <ul className="space-y-3">
            {highlights.map((h) => (
              <li key={h.label} className="flex items-center gap-4 rounded-2xl bg-sand p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-coral">
                  <Trophy className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-ink/50">{h.label}</p>
                  <p className="truncate font-semibold text-ink">
                    {h.value} <span className="font-normal text-ink/50">· {h.detail}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
