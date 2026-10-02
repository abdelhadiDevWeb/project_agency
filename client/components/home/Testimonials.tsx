import Image from "next/image";
import { Quote, Star } from "lucide-react";

import { TESTIMONIALS } from "./data";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Testimonials() {
  return (
    <section id="reviews" className="scroll-mt-24 bg-ink py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeading
            align="center"
            tone="light"
            eyebrow="Traveler stories"
            title="Memories that last a lifetime"
            description="Don't take our word for it — here's what our travelers say after coming home."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <figure className="flex h-full flex-col rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white/10">
                <Quote className="size-8 text-coral" aria-hidden />
                <div className="mt-5 flex gap-1 text-amber-300">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star key={star} className="size-4 fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 leading-relaxed text-white/80">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={52}
                    height={52}
                    className="size-13 rounded-full object-cover ring-2 ring-coral/60"
                  />
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-sm text-white/55">{t.trip}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
