import Link from "next/link";
import { ArrowRight, CalendarCheck, CalendarDays, Plus, Star, TreePalm, Users, Wallet } from "lucide-react";

import {
  BarChart,
  BookingsTable,
  buttonPrimary,
  Donut,
  PageHeader,
  Panel,
  StatCard,
} from "@/components/dashboard/ui";
import { formatDate, formatDZDCompact, formatNumber } from "@/lib/format";
import {
  AGENCIES,
  AGENCY_MONTHLY,
  AGENCY_OFFERS,
  BOOKINGS,
  CURRENT_AGENCY_ID,
  TODAY,
} from "@/lib/mock/dashboard";
import { requireSpace } from "@/lib/session";

export default async function AgencyOverviewPage() {
  const user = await requireSpace("agency");
  const agency = AGENCIES.find((a) => a.id === CURRENT_AGENCY_ID)!;
  const bookings = BOOKINGS.filter((b) => b.agencyId === CURRENT_AGENCY_ID);
  const published = AGENCY_OFFERS.filter((o) => o.status === "Published");
  const topOffers = [...AGENCY_OFFERS].sort((a, b) => b.bookings - a.bookings).slice(0, 4);
  const topBookings = topOffers[0]?.bookings || 1;
  const upcoming = bookings
    .filter((b) => b.departure >= TODAY && b.status !== "Cancelled")
    .sort((a, b) => a.departure.localeCompare(b.departure))
    .slice(0, 4);
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;

  const byCategory = (category: string) =>
    AGENCY_OFFERS.filter((o) => o.category === category).reduce((sum, o) => sum + o.bookings, 0);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user.name}`}
        description="Here is how your agency is doing. Amounts in Algerian dinar."
        action={
          <Link href="/agency/offers" className={buttonPrimary}>
            <Plus className="size-4" /> New offer
          </Link>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue (12 months)" value={formatDZDCompact(agency.revenue)} icon={Wallet} change={21.3} hint="vs previous year" />
        <StatCard
          label="Bookings"
          value={formatNumber(agency.bookings)}
          icon={CalendarCheck}
          change={14.8}
          hint={`${pendingCount} pending`}
          delay={80}
        />
        <StatCard
          label="Active offers"
          value={`${published.length} / ${AGENCY_OFFERS.length}`}
          icon={TreePalm}
          hint={`${AGENCY_OFFERS.length - published.length} in draft`}
          delay={160}
        />
        <StatCard label="Average rating" value={agency.rating?.toFixed(1) ?? "—"} icon={Star} hint="from traveler reviews" delay={240} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Revenue" description="Monthly, last 12 months" className="lg:col-span-2">
          <BarChart data={AGENCY_MONTHLY} />
        </Panel>
        <Panel title="Bookings by category">
          <Donut
            centerValue={formatNumber(agency.bookings)}
            centerLabel="bookings"
            segments={[
              { label: "Beach", value: byCategory("Beach"), color: "var(--color-ocean)" },
              { label: "City", value: byCategory("City"), color: "var(--color-coral)" },
              { label: "Adventure", value: byCategory("Adventure"), color: "var(--color-sun)" },
            ]}
          />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel
          title="Top offers"
          description="By number of bookings"
          className="lg:col-span-2"
          action={
            <Link href="/agency/offers" className="flex items-center gap-1 text-sm font-semibold text-ocean hover:underline">
              Manage offers <ArrowRight className="size-4" />
            </Link>
          }
        >
          <ul className="space-y-4">
            {topOffers.map((o) => (
              <li key={o.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate font-semibold text-ink">
                    {o.title} <span className="font-normal text-ink/45">· {o.location}</span>
                  </p>
                  <p className="text-sm font-semibold whitespace-nowrap text-ink">{o.bookings} bookings</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-coral to-sun"
                    style={{ width: `${(o.bookings / topBookings) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Upcoming departures" description="Next trips leaving">
          <ul className="space-y-3">
            {upcoming.map((b) => (
              <li key={b.id} className="flex items-center gap-4 rounded-2xl bg-sand p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-ocean shadow-sm">
                  <CalendarDays className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{b.trip}</p>
                  <p className="flex items-center gap-1.5 text-xs text-ink/50">
                    {formatDate(b.departure)} · <Users className="size-3" aria-hidden /> {b.travelers} · {b.customer}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="Recent bookings"
        className="mt-6"
        action={
          <Link href="/agency/bookings" className="flex items-center gap-1 text-sm font-semibold text-ocean hover:underline">
            All bookings <ArrowRight className="size-4" />
          </Link>
        }
      >
        <BookingsTable bookings={bookings.slice(0, 5)} />
      </Panel>
    </>
  );
}
