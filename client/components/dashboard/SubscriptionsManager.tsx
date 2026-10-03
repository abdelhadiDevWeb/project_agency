"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeftRight,
  Ban,
  CalendarClock,
  Check,
  CircleCheck,
  Crown,
  Hourglass,
  MapPin,
  Pencil,
  RefreshCw,
  RotateCcw,
  Search,
  Wallet,
} from "lucide-react";

import { addMonths, daysBetween, formatDate, formatDZD } from "@/lib/format";
import {
  billedPrice,
  EXPIRING_SOON_DAYS,
  monthlyRecurringRevenue,
  TODAY,
  YEARLY_BILLED_MONTHS,
  type Agency,
  type AgencyPlan,
  type BillingCycle,
  type Plan,
  type Subscription,
} from "@/lib/mock/dashboard";

import { FilterTabs } from "./FilterTabs";
import { Field, Modal } from "./Modal";
import { buttonPrimary, buttonSecondary, EmptyState, inputClass, Panel, StatCard, StatusBadge } from "./ui";

const STATUS_FILTERS = ["All", "Active", "Expiring soon", "Trial", "Expired", "Cancelled"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];
type DisplayStatus = Exclude<StatusFilter, "All">;

const BILLING_CYCLES: BillingCycle[] = ["Monthly", "Yearly"];

const actionClass =
  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition";

function displayStatus(sub: Subscription): DisplayStatus {
  if (sub.status === "Active" && daysBetween(TODAY, sub.endsAt) <= EXPIRING_SOON_DAYS) return "Expiring soon";
  return sub.status;
}

function cycleMonths(billing: BillingCycle): number {
  return billing === "Yearly" ? 12 : 1;
}

function relativeDays(iso: string): string {
  const days = daysBetween(TODAY, iso);
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days > 0) return `in ${days} days`;
  return days === -1 ? "yesterday" : `${-days} days ago`;
}

export function SubscriptionsManager({
  initialPlans,
  initialSubscriptions,
  agencies,
}: {
  initialPlans: Plan[];
  initialSubscriptions: Subscription[];
  agencies: Agency[];
}) {
  const [plans, setPlans] = useState(initialPlans);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [status, setStatus] = useState<StatusFilter>("All");
  const [query, setQuery] = useState("");
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [changing, setChanging] = useState<Subscription | null>(null);

  const agencyById = useMemo(() => new Map(agencies.map((a) => [a.id, a])), [agencies]);
  const planById = (id: AgencyPlan) => plans.find((p) => p.id === id);

  const counts = useMemo(() => {
    const result = {
      All: subscriptions.length,
      Active: 0,
      "Expiring soon": 0,
      Trial: 0,
      Expired: 0,
      Cancelled: 0,
    } satisfies Record<StatusFilter, number>;
    for (const sub of subscriptions) result[displayStatus(sub)] += 1;
    return result;
  }, [subscriptions]);

  const mrr = monthlyRecurringRevenue(subscriptions, plans);
  const paying = subscriptions.filter((s) => s.status === "Active");
  const yearly = paying.filter((s) => s.billing === "Yearly").length;

  const visible = subscriptions.filter((sub) => {
    if (status !== "All" && displayStatus(sub) !== status) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const agency = agencyById.get(sub.agencyId);
    return [agency?.name ?? "", agency?.city ?? "", sub.plan].some((field) => field.toLowerCase().includes(q));
  });

  const update = (id: string, change: (sub: Subscription) => Partial<Subscription>) =>
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, ...change(s) } : s)));

  const startPeriod = (sub: Subscription): Partial<Subscription> => ({
    status: "Active",
    startedAt: TODAY,
    endsAt: addMonths(TODAY, cycleMonths(sub.billing)),
  });

  const openPlanEditor = (plan: Plan) => {
    setEditingPlan(plan);
    setPriceInput(String(plan.monthlyPrice));
  };

  const priceValue = Number(priceInput);
  const priceValid = Number.isInteger(priceValue) && priceValue >= 1_000 && priceValue <= 1_000_000;

  const handlePriceSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPlan || !priceValid) return;
    setPlans((prev) => prev.map((p) => (p.id === editingPlan.id ? { ...p, monthlyPrice: priceValue } : p)));
    setEditingPlan(null);
  };

  const handlePlanChange = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!changing) return;
    const data = new FormData(e.currentTarget);
    update(changing.id, () => ({
      plan: data.get("plan") as AgencyPlan,
      billing: data.get("billing") as BillingCycle,
    }));
    setChanging(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Monthly recurring revenue" value={formatDZD(mrr)} icon={Wallet} hint="from active subscriptions" />
        <StatCard
          label="Paying agencies"
          value={String(paying.length)}
          icon={CircleCheck}
          hint={`${yearly} on yearly billing`}
          delay={80}
        />
        <StatCard label="Free trials" value={String(counts.Trial)} icon={Hourglass} hint="waiting to convert" delay={160} />
        <StatCard
          label="Expiring soon"
          value={String(counts["Expiring soon"])}
          icon={CalendarClock}
          hint={`renewal within ${EXPIRING_SOON_DAYS} days`}
          delay={240}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((plan, i) => {
          const featured = plan.id === "Premium";
          const subscribers = paying.filter((s) => s.plan === plan.id);
          const planMrr = monthlyRecurringRevenue(subscribers, [plan]);
          return (
            <article
              key={plan.id}
              className={`animate-fade-up flex flex-col rounded-3xl p-6 shadow-sm ${
                featured ? "bg-ink text-white" : "border border-ink/5 bg-white text-ink"
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    {featured && <Crown className="size-4 text-sun" aria-hidden />}
                    {plan.id}
                  </h3>
                  <p className={`text-sm ${featured ? "text-white/60" : "text-ink/50"}`}>{plan.tagline}</p>
                </div>
                <button
                  type="button"
                  onClick={() => openPlanEditor(plan)}
                  aria-label={`Edit ${plan.id} price`}
                  title="Edit price"
                  className={`grid size-9 shrink-0 place-items-center rounded-full transition ${
                    featured ? "text-white/70 hover:bg-white/10 hover:text-white" : "text-ink/50 hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  <Pencil className="size-4" />
                </button>
              </div>

              <p className="mt-5 text-3xl font-bold whitespace-nowrap">
                {formatDZD(plan.monthlyPrice)}
                <span className={`ml-1 text-sm font-normal ${featured ? "text-white/50" : "text-ink/45"}`}>/ month</span>
              </p>
              <p className={`mt-1 text-xs ${featured ? "text-white/50" : "text-ink/45"}`}>
                or {formatDZD(billedPrice(plan, "Yearly"))} / year ({12 - YEARLY_BILLED_MONTHS} months free)
              </p>

              <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className={`mt-0.5 size-4 shrink-0 ${featured ? "text-ocean-light" : "text-ocean"}`} aria-hidden />
                    <span className={featured ? "text-white/80" : "text-ink/70"}>{feature}</span>
                  </li>
                ))}
              </ul>

              <div
                className={`mt-6 flex items-center justify-between gap-3 border-t pt-4 text-sm ${
                  featured ? "border-white/10" : "border-ink/5"
                }`}
              >
                <span className={featured ? "text-white/60" : "text-ink/50"}>
                  {subscribers.length} paying {subscribers.length === 1 ? "agency" : "agencies"}
                </span>
                <span className="font-semibold whitespace-nowrap">{formatDZD(planMrr)} / mo</span>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs options={STATUS_FILTERS} value={status} onChange={setStatus} counts={counts} />
        <div className="relative lg:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink/35" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agency, city, plan…"
            aria-label="Search subscriptions"
            className={`${inputClass} pl-10`}
          />
        </div>
      </div>

      <Panel>
        {visible.length === 0 ? (
          <EmptyState message="No subscriptions match your filters." />
        ) : (
          <div className="-mx-6 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/5 text-xs tracking-wide text-ink/45 uppercase">
                  <th className="px-6 py-3 font-medium">Agency</th>
                  <th className="px-3 py-3 font-medium">Plan</th>
                  <th className="px-3 py-3 font-medium">Billing</th>
                  <th className="px-3 py-3 font-medium">Started</th>
                  <th className="px-3 py-3 font-medium">Renewal / end</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {visible.map((sub) => {
                  const agency = agencyById.get(sub.agencyId);
                  const plan = planById(sub.plan);
                  const shown = displayStatus(sub);
                  return (
                    <tr key={sub.id} className="transition-colors hover:bg-mist/40">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-ink">{agency?.name ?? "—"}</p>
                        {agency && (
                          <p className="flex items-center gap-1 text-xs text-ink/45">
                            <MapPin className="size-3" aria-hidden /> {agency.city}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            sub.plan === "Premium" ? "bg-coral/10 text-coral-dark" : "bg-ink/5 text-ink/60"
                          }`}
                        >
                          {sub.plan}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <p className="text-ink/80">{sub.billing}</p>
                        {plan && (
                          <p className="text-xs whitespace-nowrap text-ink/45">
                            {formatDZD(billedPrice(plan, sub.billing))} / {sub.billing === "Yearly" ? "year" : "month"}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-ink/70">{formatDate(sub.startedAt)}</td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <p className="text-ink/80">{formatDate(sub.endsAt)}</p>
                        <p className={`text-xs ${shown === "Expiring soon" ? "font-semibold text-amber-700" : "text-ink/45"}`}>
                          {relativeDays(sub.endsAt)}
                        </p>
                      </td>
                      <td className="px-3 py-4">
                        <StatusBadge status={shown} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {sub.status === "Trial" && (
                            <button
                              type="button"
                              onClick={() => update(sub.id, startPeriod)}
                              className={`${actionClass} bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
                            >
                              <CircleCheck className="size-3.5" /> Activate
                            </button>
                          )}
                          {sub.status === "Active" && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  update(sub.id, (s) => ({ endsAt: addMonths(s.endsAt, cycleMonths(s.billing)) }))
                                }
                                className={`${actionClass} bg-mist text-ocean hover:bg-ocean/10`}
                              >
                                <RefreshCw className="size-3.5" /> Renew
                              </button>
                              <button
                                type="button"
                                onClick={() => setChanging(sub)}
                                className={`${actionClass} bg-ink/5 text-ink/70 hover:bg-ink/10`}
                              >
                                <ArrowLeftRight className="size-3.5" /> Change plan
                              </button>
                            </>
                          )}
                          {(sub.status === "Active" || sub.status === "Trial") && (
                            <button
                              type="button"
                              onClick={() =>
                                update(sub.id, (s) => ({ status: "Cancelled", endsAt: s.status === "Trial" ? TODAY : s.endsAt }))
                              }
                              className={`${actionClass} bg-rose-50 text-rose-700 hover:bg-rose-100`}
                            >
                              <Ban className="size-3.5" /> Cancel
                            </button>
                          )}
                          {(sub.status === "Expired" || sub.status === "Cancelled") && (
                            <button
                              type="button"
                              onClick={() => update(sub.id, startPeriod)}
                              className={`${actionClass} bg-mist text-ocean hover:bg-ocean/10`}
                            >
                              <RotateCcw className="size-3.5" /> Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {editingPlan && (
        <Modal title={`Edit ${editingPlan.id} price`} onClose={() => setEditingPlan(null)}>
          <form onSubmit={handlePriceSave} className="space-y-4">
            <Field label="Monthly price (DA)">
              <input
                type="number"
                inputMode="numeric"
                min={1_000}
                max={1_000_000}
                step={100}
                required
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className={inputClass}
              />
            </Field>
            <p className="text-sm text-ink/55">
              {priceValid
                ? `Yearly price: ${formatDZD(priceValue * YEARLY_BILLED_MONTHS)} (${YEARLY_BILLED_MONTHS} months billed).`
                : "Enter a whole amount between 1 000 and 1 000 000 DA."}
            </p>
            <p className="text-xs text-ink/45">New prices apply to the next renewal of every agency on this plan.</p>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditingPlan(null)} className={buttonSecondary}>
                Cancel
              </button>
              <button type="submit" disabled={!priceValid} className={buttonPrimary}>
                Save price
              </button>
            </div>
          </form>
        </Modal>
      )}

      {changing && (
        <Modal title={`Change plan · ${agencyById.get(changing.agencyId)?.name ?? ""}`} onClose={() => setChanging(null)}>
          <form onSubmit={handlePlanChange} className="space-y-4">
            <Field label="Plan">
              <select name="plan" defaultValue={changing.plan} className={inputClass}>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} · {formatDZD(p.monthlyPrice)} / month
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Billing">
              <select name="billing" defaultValue={changing.billing} className={inputClass}>
                {BILLING_CYCLES.map((cycle) => (
                  <option key={cycle} value={cycle}>
                    {cycle === "Yearly" ? `Yearly (${12 - YEARLY_BILLED_MONTHS} months free)` : "Monthly"}
                  </option>
                ))}
              </select>
            </Field>
            <p className="text-xs text-ink/45">The change applies right away; the renewal date stays the same.</p>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setChanging(null)} className={buttonSecondary}>
                Cancel
              </button>
              <button type="submit" className={buttonPrimary}>
                Save changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
