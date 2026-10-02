"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Ban, Check, MapPin, Plus, RotateCcw, Search, Star } from "lucide-react";

import { formatDate, formatDZDCompact, formatNumber } from "@/lib/format";
import { TODAY, type Agency, type AgencyPlan, type AgencyStatus } from "@/lib/mock/dashboard";

import { FilterTabs } from "./FilterTabs";
import { Field, Modal } from "./Modal";
import { buttonPrimary, buttonSecondary, EmptyState, inputClass, Panel, StatusBadge } from "./ui";

const STATUS_FILTERS = ["All", "Active", "Pending", "Suspended"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const PLANS: AgencyPlan[] = ["Basic", "Pro", "Premium"];

const actionClass =
  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AgenciesManager({ initialAgencies }: { initialAgencies: Agency[] }) {
  const [agencies, setAgencies] = useState(initialAgencies);
  const [status, setStatus] = useState<StatusFilter>("All");
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);

  const counts = useMemo(() => {
    const result = { All: agencies.length, Active: 0, Pending: 0, Suspended: 0 } satisfies Record<
      StatusFilter,
      number
    >;
    for (const a of agencies) result[a.status] += 1;
    return result;
  }, [agencies]);

  const visible = agencies.filter((a) => {
    if (status !== "All" && a.status !== status) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [a.name, a.city, a.owner, a.email].some((field) => field.toLowerCase().includes(q));
  });

  const setAgencyStatus = (id: string, next: AgencyStatus) =>
    setAgencies((prev) => prev.map((a) => (a.id === id ? { ...a, status: next } : a)));

  const handleCreate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const agency: Agency = {
      id: `agc-${Date.now()}`,
      name: String(data.get("name")).trim(),
      city: String(data.get("city")).trim(),
      owner: String(data.get("owner")).trim(),
      email: String(data.get("email")).trim(),
      plan: data.get("plan") as AgencyPlan,
      status: "Pending",
      offers: 0,
      bookings: 0,
      revenue: 0,
      rating: null,
      joined: TODAY,
    };
    setAgencies((prev) => [agency, ...prev]);
    setStatus("All");
    setAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs options={STATUS_FILTERS} value={status} onChange={setStatus} counts={counts} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink/35" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search agency, city, owner…"
              aria-label="Search agencies"
              className={`${inputClass} pl-10`}
            />
          </div>
          <button type="button" onClick={() => setAdding(true)} className={buttonPrimary}>
            <Plus className="size-4" /> Add agency
          </button>
        </div>
      </div>

      <Panel>
        {visible.length === 0 ? (
          <EmptyState message="No agencies match your filters." />
        ) : (
          <div className="-mx-6 overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/5 text-xs tracking-wide text-ink/45 uppercase">
                  <th className="px-6 py-3 font-medium">Agency</th>
                  <th className="px-3 py-3 font-medium">Owner</th>
                  <th className="px-3 py-3 font-medium">Plan</th>
                  <th className="px-3 py-3 text-right font-medium">Offers</th>
                  <th className="px-3 py-3 text-right font-medium">Bookings</th>
                  <th className="px-3 py-3 text-right font-medium">Revenue (12m)</th>
                  <th className="px-3 py-3 font-medium">Rating</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {visible.map((a) => (
                  <tr key={a.id} className="transition-colors hover:bg-mist/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-mist text-sm font-semibold text-ocean">
                          {initials(a.name)}
                        </span>
                        <div>
                          <p className="font-semibold text-ink">{a.name}</p>
                          <p className="flex items-center gap-1 text-xs text-ink/45">
                            <MapPin className="size-3" aria-hidden /> {a.city} · since {formatDate(a.joined)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <p className="text-ink/80">{a.owner}</p>
                      <p className="text-xs text-ink/45">{a.email}</p>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          a.plan === "Premium" ? "bg-coral/10 text-coral-dark" : "bg-ink/5 text-ink/60"
                        }`}
                      >
                        {a.plan}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-right text-ink/70">{a.offers}</td>
                    <td className="px-3 py-4 text-right text-ink/70">{formatNumber(a.bookings)}</td>
                    <td className="px-3 py-4 text-right font-semibold whitespace-nowrap text-ink">
                      {a.revenue ? formatDZDCompact(a.revenue) : "—"}
                    </td>
                    <td className="px-3 py-4">
                      {a.rating ? (
                        <span className="inline-flex items-center gap-1 text-ink/70">
                          <Star className="size-3.5 fill-sun text-sun" aria-hidden /> {a.rating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-ink/30">—</span>
                      )}
                    </td>
                    <td className="px-3 py-4">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {a.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => setAgencyStatus(a.id, "Active")}
                            className={`${actionClass} bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
                          >
                            <Check className="size-3.5" /> Approve
                          </button>
                        )}
                        {a.status === "Active" && (
                          <button
                            type="button"
                            onClick={() => setAgencyStatus(a.id, "Suspended")}
                            className={`${actionClass} bg-rose-50 text-rose-700 hover:bg-rose-100`}
                          >
                            <Ban className="size-3.5" /> Suspend
                          </button>
                        )}
                        {a.status === "Suspended" && (
                          <button
                            type="button"
                            onClick={() => setAgencyStatus(a.id, "Active")}
                            className={`${actionClass} bg-mist text-ocean hover:bg-ocean/10`}
                          >
                            <RotateCcw className="size-3.5" /> Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {adding && (
        <Modal title="Add a new agency" onClose={() => setAdding(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <Field label="Agency name">
              <input name="name" required minLength={2} className={inputClass} placeholder="e.g. Atlas Voyages" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City">
                <input name="city" required className={inputClass} placeholder="e.g. Sétif" />
              </Field>
              <Field label="Plan">
                <select name="plan" defaultValue="Basic" className={inputClass}>
                  {PLANS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Owner full name">
              <input name="owner" required className={inputClass} placeholder="e.g. Ahmed Zerrouki" />
            </Field>
            <Field label="Contact email">
              <input name="email" type="email" required className={inputClass} placeholder="contact@agency.dz" />
            </Field>
            <p className="text-xs text-ink/45">New agencies start as Pending until you approve them.</p>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setAdding(false)} className={buttonSecondary}>
                Cancel
              </button>
              <button type="submit" className={buttonPrimary}>
                Create agency
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
