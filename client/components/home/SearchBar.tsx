"use client";

import type { FormEvent, ReactNode } from "react";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";

import { OFFERS } from "./data";

function Field({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-mist">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mist text-ocean">
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-semibold tracking-wide text-ink/50 uppercase">{label}</span>
        {children}
      </span>
    </label>
  );
}

const inputClass =
  "w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink/40";

export function SearchBar() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.getElementById("offers")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="relative z-10 mx-auto -mt-16 w-full max-w-6xl px-6">
      <form
        onSubmit={handleSubmit}
        className="animate-fade-up grid gap-1 rounded-3xl bg-white p-3 shadow-2xl shadow-ink/10 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-center"
        style={{ animationDelay: "600ms" }}
      >
        <Field icon={<MapPin className="size-5" />} label="Destination">
          <input
            name="destination"
            list="destination-options"
            placeholder="Where do you want to go?"
            className={inputClass}
          />
          <datalist id="destination-options">
            {OFFERS.map((offer) => (
              <option key={offer.id} value={offer.location} />
            ))}
          </datalist>
        </Field>

        <Field icon={<CalendarDays className="size-5" />} label="Departure">
          <input name="date" type="date" className={inputClass} />
        </Field>

        <Field icon={<Users className="size-5" />} label="Travelers">
          <select name="travelers" defaultValue="2" className={inputClass}>
            <option value="1">1 traveler</option>
            <option value="2">2 travelers</option>
            <option value="3">3 travelers</option>
            <option value="4">4+ travelers</option>
          </select>
        </Field>

        <button
          type="submit"
          className="group flex items-center justify-center gap-2 rounded-2xl bg-ink px-8 py-4 font-semibold text-white transition hover:bg-coral"
        >
          <Search className="size-5 transition-transform group-hover:scale-110" />
          Search
        </button>
      </form>
    </div>
  );
}
