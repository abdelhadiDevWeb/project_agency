"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Eye, Mail, MapPin, Phone, Search } from "lucide-react";

import { formatDate, formatDZD, formatDZDCompact } from "@/lib/format";
import { customerSegment, type Booking, type Customer, type CustomerSegment } from "@/lib/mock/dashboard";

import { FilterTabs } from "./FilterTabs";
import { Modal } from "./Modal";
import { EmptyState, inputClass, Panel, StatusBadge } from "./ui";

const SEGMENT_FILTERS = ["All", "VIP", "Returning", "New"] as const;
type SegmentFilter = (typeof SEGMENT_FILTERS)[number];

const SORTS = {
  recent: { label: "Latest trip", compare: (a: Customer, b: Customer) => b.lastTripDate.localeCompare(a.lastTripDate) },
  spent: { label: "Top spenders", compare: (a: Customer, b: Customer) => b.totalSpent - a.totalSpent },
  bookings: { label: "Most bookings", compare: (a: Customer, b: Customer) => b.bookings - a.bookings },
  name: { label: "Name (A–Z)", compare: (a: Customer, b: Customer) => a.name.localeCompare(b.name) },
} as const;
type SortKey = keyof typeof SORTS;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function CustomersManager({ customers, bookings }: { customers: Customer[]; bookings: Booking[] }) {
  const [segment, setSegment] = useState<SegmentFilter>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [selected, setSelected] = useState<Customer | null>(null);

  const counts = useMemo(() => {
    const result = { All: customers.length, VIP: 0, Returning: 0, New: 0 } satisfies Record<SegmentFilter, number>;
    for (const c of customers) result[customerSegment(c)] += 1;
    return result;
  }, [customers]);

  const visible = customers
    .filter((c) => {
      if (segment !== "All" && customerSegment(c) !== segment) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return [c.name, c.email, c.phone, c.city].some((field) => field.toLowerCase().includes(q));
    })
    .sort(SORTS[sort].compare);

  const selectedBookings = selected ? bookings.filter((b) => b.customer === selected.name) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs options={SEGMENT_FILTERS} value={segment} onChange={setSegment} counts={counts} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink/35" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, phone, city…"
              aria-label="Search customers"
              className={`${inputClass} pl-10`}
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort customers"
            className={`${inputClass} sm:w-44`}
          >
            {(Object.keys(SORTS) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {SORTS[key].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Panel>
        {visible.length === 0 ? (
          <EmptyState message="No customers match your filters." />
        ) : (
          <div className="relative -mx-6 overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/5 text-xs tracking-wide text-ink/45 uppercase">
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-3 py-3 font-medium">Phone</th>
                  <th className="px-3 py-3 font-medium">City</th>
                  <th className="px-3 py-3 text-right font-medium">Bookings</th>
                  <th className="px-3 py-3 text-right font-medium">Total spent</th>
                  <th className="px-3 py-3 font-medium">Latest trip</th>
                  <th className="px-3 py-3 font-medium">Segment</th>
                  <th className="px-6 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {visible.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-mist/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mist text-sm font-semibold text-ocean">
                          {initials(c.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink">{c.name}</p>
                          <p className="truncate text-xs text-ink/45">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-ink/70">{c.phone}</td>
                    <td className="px-3 py-4 text-ink/70">{c.city}</td>
                    <td className="px-3 py-4 text-right text-ink/70">{c.bookings}</td>
                    <td className="px-3 py-4 text-right font-semibold whitespace-nowrap text-ink">
                      {c.totalSpent ? formatDZDCompact(c.totalSpent) : "—"}
                    </td>
                    <td className="px-3 py-4">
                      <p className="text-ink/80">{c.lastTrip}</p>
                      <p className="text-xs text-ink/45">{formatDate(c.lastTripDate)}</p>
                    </td>
                    <td className="px-3 py-4">
                      <StatusBadge status={customerSegment(c)} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelected(c)}
                        className="inline-flex items-center gap-1 rounded-full bg-mist px-3 py-1.5 text-xs font-semibold text-ocean transition hover:bg-ocean/10"
                      >
                        <Eye className="size-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <CustomerDetails customer={selected} segment={customerSegment(selected)} bookings={selectedBookings} />
        </Modal>
      )}
    </div>
  );
}

function CustomerDetails({
  customer,
  segment,
  bookings,
}: {
  customer: Customer;
  segment: CustomerSegment;
  bookings: Booking[];
}) {
  const stats = [
    { label: "Bookings", value: String(customer.bookings) },
    { label: "Total spent", value: customer.totalSpent ? formatDZDCompact(customer.totalSpent) : "—" },
    {
      label: "Per trip",
      value: customer.totalSpent ? formatDZDCompact(customer.totalSpent / customer.bookings) : "—",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 text-sm text-ink/60">
        <StatusBadge status={segment} />
        <span className="flex items-center gap-1.5">
          <MapPin className="size-4" aria-hidden /> {customer.city}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-4" aria-hidden /> Customer since {formatDate(customer.firstBooking)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-sand p-4">
            <p className="text-xs text-ink/50">{s.label}</p>
            <p className="mt-1 font-semibold whitespace-nowrap text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={`mailto:${customer.email}`}
          className="flex min-w-0 items-center gap-3 rounded-2xl border border-ink/10 p-3 text-sm transition hover:border-ocean/40"
        >
          <Mail className="size-4 shrink-0 text-ocean" aria-hidden />
          <span className="truncate text-ink/80">{customer.email}</span>
        </a>
        <a
          href={`tel:${customer.phone.replace(/\s+/g, "")}`}
          className="flex items-center gap-3 rounded-2xl border border-ink/10 p-3 text-sm transition hover:border-ocean/40"
        >
          <Phone className="size-4 shrink-0 text-ocean" aria-hidden />
          <span className="text-ink/80">{customer.phone}</span>
        </a>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Recent bookings</h3>
        {bookings.length === 0 ? (
          <p className="rounded-2xl bg-mist/60 px-4 py-6 text-center text-sm text-ink/50">
            Latest trip: {customer.lastTrip} on {formatDate(customer.lastTripDate)}.
          </p>
        ) : (
          <ul className="divide-y divide-ink/5 rounded-2xl border border-ink/5">
            {bookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{b.trip}</p>
                  <p className="text-xs text-ink/45">
                    {b.id} · {formatDate(b.departure)} · {b.travelers} {b.travelers > 1 ? "travelers" : "traveler"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="font-semibold whitespace-nowrap text-ink">{formatDZD(b.amount)}</span>
                  <StatusBadge status={b.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
