import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { DESTINATIONS } from "./data";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Destinations() {
  return (
    <section id="destinations" className="scroll-mt-24 bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Popular destinations"
            title="Where will you wake up next?"
            description="From sun-drenched coastlines to ancient wonders — explore the places our travelers can't stop talking about."
          />
        </Reveal>

        <div className="mt-14 grid auto-rows-[240px] gap-4 md:grid-cols-4">
          {DESTINATIONS.map((destination, i) => (
            <Reveal
              key={destination.name}
              delay={i * 90}
              className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}
            >
              <a
                href="#offers"
                className="group relative block h-full overflow-hidden rounded-3xl"
              >
                <Image
                  src={destination.image}
                  alt={destination.imageAlt}
                  fill
                  sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 100vw"}
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
                  <div>
                    <p className="text-xs font-medium tracking-[0.18em] text-white/70 uppercase">
                      {destination.country}
                    </p>
                    <h3
                      className={`mt-1 font-display font-semibold ${i === 0 ? "text-4xl" : "text-2xl"}`}
                    >
                      {destination.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/80">{destination.tours} tours available</p>
                  </div>
                  <span className="grid size-11 translate-y-3 place-items-center rounded-full bg-white text-ink opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
