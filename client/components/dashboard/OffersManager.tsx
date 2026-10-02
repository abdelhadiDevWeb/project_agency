"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import { Eye, EyeOff, MapPin, Moon, Pencil, Plus, Search, Trash2, TreePalm } from "lucide-react";

import type { OfferCategory } from "@/components/home/data";
import { formatDZD } from "@/lib/format";
import type { AgencyOffer, OfferStatus } from "@/lib/mock/dashboard";

import { FilterTabs } from "./FilterTabs";
import { Field, Modal } from "./Modal";
import { buttonPrimary, buttonSecondary, EmptyState, inputClass, StatusBadge } from "./ui";

const STATUS_FILTERS = ["All", "Published", "Draft"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const CATEGORIES: OfferCategory[] = ["Beach", "City", "Adventure"];

type Editing = { mode: "create" } | { mode: "edit"; offer: AgencyOffer };

export function OffersManager({ initialOffers }: { initialOffers: AgencyOffer[] }) {
  const [offers, setOffers] = useState(initialOffers);
  const [status, setStatus] = useState<StatusFilter>("All");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Editing | null>(null);

  const counts = useMemo(() => {
    const result = { All: offers.length, Published: 0, Draft: 0 } satisfies Record<StatusFilter, number>;
    for (const o of offers) result[o.status] += 1;
    return result;
  }, [offers]);

  const visible = offers.filter((o) => {
    if (status !== "All" && o.status !== status) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [o.title, o.location].some((field) => field.toLowerCase().includes(q));
  });

  const toggleStatus = (id: string) =>
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: o.status === "Published" ? "Draft" : "Published" } : o)),
    );

  const remove = (offer: AgencyOffer) => {
    if (window.confirm(`Delete "${offer.title}"? This cannot be undone.`)) {
      setOffers((prev) => prev.filter((o) => o.id !== offer.id));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    const data = new FormData(e.currentTarget);
    const price = Number(data.get("price"));
    const oldPrice = Number(data.get("oldPrice"));
    const fields = {
      title: String(data.get("title")).trim(),
      location: String(data.get("location")).trim(),
      category: data.get("category") as OfferCategory,
      nights: Number(data.get("nights")),
      price,
      oldPrice: oldPrice > price ? oldPrice : undefined,
      status: data.get("status") as OfferStatus,
    };

    if (editing.mode === "edit") {
      const id = editing.offer.id;
      setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...fields } : o)));
    } else {
      setOffers((prev) => [{ id: `offer-${Date.now()}`, bookings: 0, ...fields }, ...prev]);
      setStatus("All");
    }
    setEditing(null);
  };

  const current = editing?.mode === "edit" ? editing.offer : undefined;

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
              placeholder="Search offers…"
              aria-label="Search offers"
              className={`${inputClass} pl-10`}
            />
          </div>
          <button type="button" onClick={() => setEditing({ mode: "create" })} className={buttonPrimary}>
            <Plus className="size-4" /> New offer
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState message="No offers match your filters." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((offer, i) => (
            <article
              key={offer.id}
              className="animate-fade-up group flex flex-col overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5"
              style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
            >
              <div className="relative h-44 overflow-hidden bg-mist">
                {offer.image ? (
                  <Image
                    src={offer.image}
                    alt={offer.imageAlt ?? offer.title}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 45vw, 100vw"
                    className={`object-cover transition duration-700 group-hover:scale-105 ${
                      offer.status === "Draft" ? "grayscale-[60%]" : ""
                    }`}
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-linear-to-br from-mist to-ocean-light/30 text-ocean">
                    <TreePalm className="size-10" aria-hidden />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <StatusBadge status={offer.status} />
                </div>
                <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink backdrop-blur">
                  {offer.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold text-ink">{offer.title}</h3>
                <div className="mt-1 flex items-center gap-3 text-sm text-ink/50">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" aria-hidden /> {offer.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Moon className="size-3.5" aria-hidden /> {offer.nights} nights
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-ink/5 pt-4">
                  <div>
                    {offer.oldPrice && <p className="text-xs text-ink/40 line-through">{formatDZD(offer.oldPrice)}</p>}
                    <p className="text-lg font-bold whitespace-nowrap text-ink">{formatDZD(offer.price)}</p>
                  </div>
                  <p className="text-right text-xs text-ink/50">
                    <span className="block text-lg font-bold text-ocean">{offer.bookings}</span>
                    bookings
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleStatus(offer.id)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-mist px-3 py-2 text-xs font-semibold text-ocean transition hover:bg-ocean/10"
                  >
                    {offer.status === "Published" ? (
                      <>
                        <EyeOff className="size-3.5" /> Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="size-3.5" /> Publish
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing({ mode: "edit", offer })}
                    aria-label={`Edit ${offer.title}`}
                    className="grid size-9 place-items-center rounded-full bg-ink/5 text-ink/70 transition hover:bg-ink hover:text-white"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(offer)}
                    aria-label={`Delete ${offer.title}`}
                    className="grid size-9 place-items-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-600 hover:text-white"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={current ? "Edit offer" : "New offer"} onClose={() => setEditing(null)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Title">
              <input
                name="title"
                required
                minLength={3}
                defaultValue={current?.title}
                className={inputClass}
                placeholder="e.g. Istanbul City Break"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Location">
                <input
                  name="location"
                  required
                  defaultValue={current?.location}
                  className={inputClass}
                  placeholder="e.g. Istanbul, Turkey"
                />
              </Field>
              <Field label="Category">
                <select name="category" defaultValue={current?.category ?? "Beach"} className={inputClass}>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Nights">
                <input
                  name="nights"
                  type="number"
                  required
                  min={1}
                  max={60}
                  defaultValue={current?.nights ?? 7}
                  className={inputClass}
                />
              </Field>
              <Field label="Price (DA)">
                <input
                  name="price"
                  type="number"
                  required
                  min={1000}
                  step={500}
                  defaultValue={current?.price}
                  className={inputClass}
                  placeholder="189000"
                />
              </Field>
              <Field label="Old price (DA)">
                <input
                  name="oldPrice"
                  type="number"
                  min={0}
                  step={500}
                  defaultValue={current?.oldPrice}
                  className={inputClass}
                  placeholder="Optional"
                />
              </Field>
            </div>
            <Field label="Visibility">
              <select name="status" defaultValue={current?.status ?? "Draft"} className={inputClass}>
                <option value="Published">Published — visible to travelers</option>
                <option value="Draft">Draft — hidden</option>
              </select>
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className={buttonSecondary}>
                Cancel
              </button>
              <button type="submit" className={buttonPrimary}>
                {current ? "Save changes" : "Create offer"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
