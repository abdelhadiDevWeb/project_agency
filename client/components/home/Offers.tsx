"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Heart, MapPin, Moon, Star } from "lucide-react";

import { formatDZD } from "@/lib/format";

import { OFFERS, type Offer, type OfferCategory } from "./data";
import { SectionHeading } from "./SectionHeading";

const FILTERS: Array<"All" | OfferCategory> = ["All", "Beach", "City", "Adventure"];

function OfferCard({
  offer,
  index,
  saved,
  onToggleSave,
}: {
  offer: Offer;
  index: number;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const discount = Math.round((1 - offer.price / offer.oldPrice) * 100);

  return (
    <article
      className="group animate-fade-up flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-ink/10"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={offer.image}
          alt={offer.imageAlt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <span className="absolute top-4 left-4 rounded-full bg-coral px-3 py-1 text-xs font-bold text-white">
          -{discount}%
        </span>
        {offer.tag && (
          <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
            {offer.tag}
          </span>
        )}
        <button
          type="button"
          onClick={onToggleSave}
          aria-label={saved ? `Remove ${offer.title} from saved` : `Save ${offer.title}`}
          aria-pressed={saved}
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-110 active:scale-95"
        >
          <Heart
            className={`size-4 transition-colors ${saved ? "fill-coral text-coral" : "text-ink"}`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1 text-xs font-semibold text-ocean">
          <MapPin className="size-3.5" aria-hidden />
          {offer.location}
        </p>
        <h3 className="mt-2 font-display text-xl leading-snug font-semibold text-ink">
          {offer.title}
        </h3>
        <div className="mt-3 flex items-center gap-4 text-sm text-ink/60">
          <span className="flex items-center gap-1.5">
            <Moon className="size-4" aria-hidden />
            {offer.nights} nights
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
            <span className="font-medium text-ink">{offer.rating}</span>
            <span className="text-ink/40">({offer.reviews})</span>
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-ink/5 pt-4">
          <div>
            <p className="text-xs text-ink/45">
              from <s>{formatDZD(offer.oldPrice)}</s>
            </p>
            <p className="text-xl font-bold whitespace-nowrap text-ink">{formatDZD(offer.price)}</p>
            <p className="text-xs text-ink/45">per person</p>
          </div>
          <a
            href="#contact"
            aria-label={`Book ${offer.title}`}
            className="grid size-11 place-items-center rounded-full bg-ink text-white transition-colors duration-300 group-hover:bg-coral"
          >
            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:rotate-45" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function Offers() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [saved, setSaved] = useState<Set<string>>(() => new Set());

  const visible = filter === "All" ? OFFERS : OFFERS.filter((o) => o.category === filter);

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section id="offers" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-24">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Hot deals"
          title={
            <>
              Exclusive offers, <em className="font-normal text-coral">handpicked</em> for you
            </>
          }
          description="Limited-time prices on our most-loved trips. Flights, hotels and experiences included."
        />

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter offers">
          {FILTERS.map((item) => {
            const active = item === filter;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                aria-pressed={active}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-ink text-white"
                    : "bg-white text-ink/70 ring-1 ring-ink/10 hover:text-ink hover:ring-ink/30"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div key={filter} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((offer, i) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            index={i}
            saved={saved.has(offer.id)}
            onToggleSave={() => toggleSave(offer.id)}
          />
        ))}
      </div>
    </section>
  );
}
