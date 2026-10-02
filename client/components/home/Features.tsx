import Image from "next/image";
import { BadgePercent, Headphones, ShieldCheck, Sparkles } from "lucide-react";

import { FEATURE_IMAGES } from "./data";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Handpicked experiences",
    text: "Every hotel, guide and activity is personally tested by our travel experts.",
  },
  {
    icon: BadgePercent,
    title: "Best price guarantee",
    text: "Found it cheaper elsewhere? We'll match the price and add a little extra.",
  },
  {
    icon: Headphones,
    title: "24/7 travel support",
    text: "A real human on the other end of the line — wherever you are, whenever you need us.",
  },
  {
    icon: ShieldCheck,
    title: "Flexible & secure booking",
    text: "Free changes up to 14 days before departure and fully protected payments.",
  },
];

export function Features() {
  return (
    <section id="why-us" className="mx-auto grid max-w-7xl scroll-mt-24 items-center gap-16 px-6 py-24 lg:grid-cols-2">
      <Reveal className="relative">
        <div className="relative aspect-[4/5] w-4/5 overflow-hidden rounded-[2rem]">
          <Image
            src={FEATURE_IMAGES.main}
            alt="Golden sunset over a quiet tropical beach"
            fill
            sizes="(min-width: 1024px) 40vw, 80vw"
            className="object-cover"
          />
        </div>
        <div className="absolute right-0 bottom-0 aspect-square w-1/2 overflow-hidden rounded-[2rem] border-8 border-sand">
          <Image
            src={FEATURE_IMAGES.secondary}
            alt="Vintage camper van on a desert road trip"
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="animate-float absolute top-10 right-4 rounded-2xl bg-white px-5 py-4 shadow-xl shadow-ink/10 sm:right-10">
          <p className="font-display text-3xl font-semibold text-coral">15+</p>
          <p className="text-sm text-ink/60">years crafting journeys</p>
        </div>
      </Reveal>

      <div>
        <Reveal>
          <SectionHeading
            eyebrow="Why travel with us"
            title={
              <>
                We plan it. <em className="font-normal text-ocean">You live it.</em>
              </>
            }
            description="Fifteen years of turning travel dreams into effortless, unforgettable trips."
          />
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 100}>
              <div className="group h-full rounded-3xl bg-white p-6 ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:ring-ocean/30">
                <span className="grid size-12 place-items-center rounded-2xl bg-mist text-ocean transition-colors duration-300 group-hover:bg-ocean group-hover:text-white">
                  <feature.icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{feature.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
