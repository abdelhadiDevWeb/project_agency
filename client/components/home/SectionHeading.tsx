import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
}: SectionHeadingProps) {
  const centered = align === "center";
  const light = tone === "light";

  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p
        className={`text-sm font-semibold tracking-[0.2em] uppercase ${light ? "text-ocean-light" : "text-ocean"}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-display text-4xl leading-tight font-semibold sm:text-5xl ${light ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-lg ${light ? "text-white/70" : "text-ink/60"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
