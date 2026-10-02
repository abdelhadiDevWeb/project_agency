"use client";

import { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";

import type { Agency, Booking, BookingStatus } from "@/lib/mock/dashboard";

import { FilterTabs } from "./FilterTabs";
import { BookingsTable, inputClass, Panel } from "./ui";

const STATUS_FILTERS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export function BookingsManager({
  initialBookings,
  agencies,
  canManage = false,
}: {
  initialBookings: Booking[];
  agencies?: Agency[];
  canManage?: boolean;
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [status, setStatus] = useState<StatusFilter>("All");
  const [query, setQuery] = useState("");
  const [agencyId, setAgencyId] = useState("all");

  const counts = useMemo(() => {
    const result = { All: bookings.length, Pending: 0, Confirmed: 0, Completed: 0, Cancelled: 0 } satisfies Record<
      StatusFilter,
      number
    >;
    for (const b of bookings) result[b.status] += 1;
    return result;
  }, [bookings]);

  const visible = bookings.filter((b) => {
    if (status !== "All" && b.status !== status) return false;
    if (agencyId !== "all" && b.agencyId !== agencyId) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [b.customer, b.id, b.trip].some((field) => field.toLowerCase().includes(q));
  });

  const setBookingStatus = (id: string, next: BookingStatus) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: next } : b)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs options={STATUS_FILTERS} value={status} onChange={setStatus} counts={counts} />
        <div className="flex flex-col gap-3 sm:flex-row">
          {agencies && (
            <select
              value={agencyId}
              onChange={(e) => setAgencyId(e.target.value)}
              aria-label="Filter by agency"
              className={`${inputClass} sm:w-52`}
            >
              <option value="all">All agencies</option>
              {agencies.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          )}
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink/35" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customer, trip, ID…"
              aria-label="Search bookings"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>
      </div>

      <Panel>
        <BookingsTable
          bookings={visible}
          agencies={agencies}
          actions={
            canManage
              ? (b) =>
                  b.status === "Pending" ? (
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setBookingStatus(b.id, "Confirmed")}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      >
                        <Check className="size-3.5" /> Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingStatus(b.id, "Cancelled")}
                        className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        <X className="size-3.5" /> Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-ink/30">—</span>
                  )
              : undefined
          }
        />
      </Panel>
    </div>
  );
}
