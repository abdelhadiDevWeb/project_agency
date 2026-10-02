import { Reveal } from "./Reveal";
import { STATS } from "./data";

export function Stats() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-16">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 100} className="text-center">
            <p className="font-display text-4xl font-semibold text-ink sm:text-5xl">{stat.value}</p>
            <p className="mt-1 text-sm text-ink/55">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
