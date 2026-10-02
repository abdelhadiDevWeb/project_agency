import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";

import { HERO_IMAGE, TESTIMONIALS } from "./data";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[max(92svh,640px)] items-center overflow-hidden">
      <Image
        src={HERO_IMAGE}
        alt="Wooden boat on a turquoise alpine lake surrounded by mountains"
        fill
        preload
        sizes="100vw"
        className="animate-ken-burns -z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-ink/85 via-ink/45 to-ink/5" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-t from-ink/60 to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-6 pt-32 pb-28">
        <div className="max-w-2xl text-white">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-[0.18em] uppercase backdrop-blur">
            <span className="size-1.5 rounded-full bg-coral" />
            Summer 2026 collection
          </span>

          <h1
            className="animate-fade-up mt-6 font-display text-5xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "120ms" }}
          >
            Travel further.
            <br />
            Feel <em className="font-normal text-coral">everything.</em>
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-white/80"
            style={{ animationDelay: "240ms" }}
          >
            Handpicked journeys to the world&apos;s most breathtaking places, with
            exclusive prices and a team that takes care of every detail.
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "360ms" }}
          >
            <a
              href="#offers"
              className="group inline-flex items-center gap-2 rounded-full bg-coral px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-coral-dark"
            >
              Explore offers
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#destinations"
              className="inline-flex items-center rounded-full border border-white/40 px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white hover:text-ink"
            >
              View destinations
            </a>
          </div>

          <div
            className="animate-fade-up mt-12 flex items-center gap-4"
            style={{ animationDelay: "480ms" }}
          >
            <div className="flex -space-x-3">
              {TESTIMONIALS.map((t) => (
                <Image
                  key={t.name}
                  src={t.image}
                  alt=""
                  width={44}
                  height={44}
                  className="size-11 rounded-full object-cover ring-2 ring-white"
                />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1 text-amber-300">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" aria-hidden />
                ))}
                <span className="ml-1 font-semibold text-white">4.9</span>
              </div>
              <p className="text-white/70">Loved by 12,000+ travelers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
