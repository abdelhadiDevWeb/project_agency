import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Countdown } from "./Countdown";
import { PROMO_IMAGE } from "./data";
import { Reveal } from "./Reveal";

export function Promo() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-24">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[2.5rem] px-8 py-16 text-white sm:px-14 lg:py-20">
          <Image
            src={PROMO_IMAGE}
            alt="Traveler relaxing at an airport window as a plane takes off"
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink/95 via-ink/80 to-coral/40" />

          <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="inline-flex rounded-full bg-coral px-4 py-1.5 text-xs font-bold tracking-[0.18em] uppercase">
                Last-minute deal
              </span>
              <h2 className="mt-5 font-display text-4xl leading-tight font-semibold sm:text-5xl">
                Summer escape — up to <span className="text-coral">40% off</span>
              </h2>
              <p className="mt-4 max-w-lg text-lg text-white/75">
                Book before the end of the month and save on flights, hotels and tours to our
                top beach destinations.
              </p>
              <a
                href="#offers"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-coral hover:text-white"
              >
                Grab the deal
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div className="lg:justify-self-end">
              <p className="mb-3 text-sm font-medium text-white/70">Offer ends in</p>
              <Countdown />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
