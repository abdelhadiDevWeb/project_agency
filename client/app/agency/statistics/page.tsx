import type { Metadata } from "next";
import { CalendarCheck, CircleX, Repeat, ShoppingBag, Trophy, Wallet } from "lucide-react";

import { LineChart } from "@/components/dashboard/LineChart";
import { Donut, PageHeader, Panel, StatCard } from "@/components/dashboard/ui";
import { formatDZD, formatDZDCompact, formatNumber } from "@/lib/format";
import {
  AGENCY_MONTHLY,
  AGENCY_MONTHLY_BOOKINGS,
  AGENCY_MONTHLY_BOOKINGS_PREVIOUS,
  AGENCY_MONTHLY_CANCELLATIONS,
  AGENCY_MONTHLY_PREVIOUS,
  AGENCY_NEW_CUSTOMERS,
  AGENCY_OFFERS,
  AGENCY_RETURNING_CUSTOMERS,
  MONTH_LABELS,
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

export default async function AgencyStatisticsPage() {
  await requireSpace("agency");

  const revenueValues = AGENCY_MONTHLY.map((m) => m.value);
  const revenuePreviousValues = AGENCY_MONTHLY_PREVIOUS.map((m) => m.value);
  const revenue = sum(revenueValues);
  const revenuePrevious = sum(revenuePreviousValues);

  const bookings = sum(AGENCY_MONTHLY_BOOKINGS);
  const bookingsPrevious = sum(AGENCY_MONTHLY_BOOKINGS_PREVIOUS);
  const cancellations = sum(AGENCY_MONTHLY_CANCELLATIONS);
  const cancellationRate = Math.round((cancellations / bookings) * 1000) / 10;

  const averageBooking = revenue / bookings;
  const averageBookingPrevious = revenuePrevious / bookingsPrevious;

  const newCustomers = sum(AGENCY_NEW_CUSTOMERS);
  const returningCustomers = sum(AGENCY_RETURNING_CUSTOMERS);
  const returningShare = Math.round((returningCustomers / (newCustomers + returningCustomers)) * 1000) / 10;

  const byCategory = (category: string) =>
    AGENCY_OFFERS.filter((o) => o.category === category).reduce((total, o) => total + o.bookings, 0);
  const categorySegments = [
    { label: "Beach", value: byCategory("Beach"), color: OCEAN },
    { label: "City", value: byCategory("City"), color: CORAL },
    { label: "Adventure", value: byCategory("Adventure"), color: SUN },
  ];

  const offerRevenue = AGENCY_OFFERS.map((o) => ({ ...o, revenue: o.bookings * o.price }))
    .filter((o) => o.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);
  const topOfferRevenue = offerRevenue[0]?.revenue ?? 1;

  const bestMonth = revenueValues.indexOf(Math.max(...revenueValues));
  const busiestMonth = AGENCY_MONTHLY_BOOKINGS.indexOf(Math.max(...AGENCY_MONTHLY_BOOKINGS));
  const loyalMonth = AGENCY_RETURNING_CUSTOMERS.indexOf(Math.max(...AGENCY_RETURNING_CUSTOMERS));

  const highlights = [
    { label: "Best month for revenue", value: MONTH_LABELS[bestMonth], detail: formatDZDCompact(revenueValues[bestMonth]) },
    { label: "Busiest month", value: MONTH_LABELS[busiestMonth], detail: `${AGENCY_MONTHLY_BOOKINGS[busiestMonth]} bookings` },
    {
      label: "Most returning travelers",
      value: MONTH_LABELS[loyalMonth],
      detail: `${AGENCY_RETURNING_CUSTOMERS[loyalMonth]} customers`,
    },
    { label: "Top offer", value: offerRevenue[0]?.title ?? "—", detail: formatDZDCompact(topOfferRevenue) },
  ];

  return (
    <>
      <PageHeader
        title="Statistics"
        description="How your agency is doing over the last 12 months, compared with the year before."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue"
          value={formatDZDCompact(revenue)}
          icon={Wallet}
          change={percentChange(revenue, revenuePrevious)}
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
          hint={`${cancellations} cancelled bookings`}
          delay={240}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Revenue" description="This year compared with the same months last year" className="lg:col-span-2">
          <LineChart
            labels={MONTH_LABELS}
            format="dzd"
            withRanges
            ariaLabel="Agency revenue per month, this year and last year"
            series={[
              { label: "This year", values: revenueValues, color: OCEAN, area: true },
              { label: "Last year", values: revenuePreviousValues, color: SLATE, dashed: true },
            ]}
          />
        </Panel>
        <Panel title="Bookings by category" description="Across all your offers">
          <Donut centerValue={formatNumber(sum(categorySegments.map((s) => s.value)))} centerLabel="bookings" segments={categorySegments} />
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
              { label: "Bookings", values: AGENCY_MONTHLY_BOOKINGS, color: OCEAN, area: true },
              { label: "Cancellations", values: AGENCY_MONTHLY_CANCELLATIONS, color: CORAL, area: true },
            ]}
          />
        </Panel>
        <Panel title="New and returning customers" description={`${returningShare}% of your customers came back`}>
          <LineChart
            labels={MONTH_LABELS}
            format="number"
            withRanges
            ariaLabel="New and returning customers per month"
            series={[
              { label: "New", values: AGENCY_NEW_CUSTOMERS, color: SUN, area: true },
              { label: "Returning", values: AGENCY_RETURNING_CUSTOMERS, color: CORAL, area: true },
            ]}
          />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Revenue by offer" description="Bookings × price per traveler" className="lg:col-span-2">
          <ul className="space-y-4">
            {offerRevenue.map((o, i) => (
              <li key={o.id} className="flex items-center gap-4">
                <span className="w-5 text-sm font-semibold text-ink/35">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate font-semibold text-ink">
                      {o.title} <span className="font-normal text-ink/45">· {o.bookings} bookings</span>
                    </p>
                    <p className="text-sm font-semibold whitespace-nowrap text-ink">{formatDZDCompact(o.revenue)}</p>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-ocean to-ocean-light"
                      style={{ width: `${(o.revenue / topOfferRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Highlights">
          <ul className="space-y-3">
            {highlights.map((h, i) => {
              const Icon = i === 2 ? Repeat : Trophy;
              return (
                <li key={h.label} className="flex items-center gap-4 rounded-2xl bg-sand p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-coral">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-ink/50">{h.label}</p>
                    <p className="truncate font-semibold text-ink">
                      {h.value} <span className="font-normal text-ink/50">· {h.detail}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </>
  );
}
