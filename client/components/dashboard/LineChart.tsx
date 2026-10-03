"use client";

import { useId, useState, type PointerEvent } from "react";

import { formatDZDCompact, formatNumber } from "@/lib/format";

export type LineSeries = {
  label: string;
  values: number[];
  color: string;
  dashed?: boolean;
  area?: boolean;
};

const FORMATTERS = { dzd: formatDZDCompact, number: formatNumber } as const;
const RANGES = [6, 12] as const;

function niceStep(raw: number): number {
  if (raw <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const n = raw / magnitude;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return nice * magnitude;
}

/** Smooth path through the points; control points share the endpoints' y so the curve never overshoots. */
function smoothPath(points: Array<[number, number]>): string {
  return points
    .map(([x, y], i) => {
      if (i === 0) return `M ${x} ${y}`;
      const [px, py] = points[i - 1];
      const mid = (x - px) / 2;
      return `C ${px + mid} ${py} ${x - mid} ${y} ${x} ${y}`;
    })
    .join(" ");
}

export function LineChart({
  labels,
  series,
  format,
  ariaLabel,
  withRanges = false,
}: {
  labels: string[];
  series: LineSeries[];
  format: keyof typeof FORMATTERS;
  ariaLabel: string;
  withRanges?: boolean;
}) {
  const id = useId();
  const [range, setRange] = useState<(typeof RANGES)[number]>(12);
  const [active, setActive] = useState<number | null>(null);
  const formatValue = FORMATTERS[format];

  const count = Math.min(withRanges ? range : labels.length, labels.length);
  const start = labels.length - count;
  const visibleLabels = labels.slice(start);
  const visibleSeries = series.map((s) => ({ ...s, values: s.values.slice(start) }));

  const max = Math.max(0, ...visibleSeries.flatMap((s) => s.values));
  const step = niceStep(max / 4);
  const top = Math.max(step, Math.ceil(max / step) * step);
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step).reverse();

  const x = (i: number) => (count > 1 ? (i / (count - 1)) * 100 : 50);
  const y = (value: number) => 100 - (value / top) * 100;

  const handlePointer = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    setActive(Math.round(ratio * (count - 1)));
  };

  const tooltipAlign =
    active === null ? "" : x(active) < 20 ? "translate-x-0" : x(active) > 80 ? "-translate-x-full" : "-translate-x-1/2";

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {series.map((s) => (
            <li key={s.label} className="flex items-center gap-2 text-ink/65">
              <span
                className="h-0.5 w-5 rounded-full"
                style={
                  s.dashed
                    ? { backgroundImage: `linear-gradient(90deg, ${s.color} 60%, transparent 0)`, backgroundSize: "6px 2px" }
                    : { background: s.color }
                }
                aria-hidden
              />
              {s.label}
            </li>
          ))}
        </ul>
        {withRanges && (
          <div className="flex rounded-full bg-mist p-1 text-xs font-semibold" role="group" aria-label="Time range">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                aria-pressed={range === r}
                className={`rounded-full px-3 py-1 transition ${range === r ? "bg-white text-ink shadow-sm" : "text-ink/50 hover:text-ink"}`}
              >
                {r}M
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <div className="relative h-64 w-14 shrink-0 text-right text-[11px] text-ink/40" aria-hidden>
          {ticks.map((tick) => (
            <span key={tick} className="absolute right-0 -translate-y-1/2 whitespace-nowrap" style={{ top: `${y(tick)}%` }}>
              {formatValue(tick)}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="relative h-64 touch-pan-y"
            role="img"
            aria-label={ariaLabel}
            onPointerMove={handlePointer}
            onPointerDown={handlePointer}
            onPointerLeave={() => setActive(null)}
          >
            {ticks.map((tick) => (
              <div
                key={tick}
                className={`absolute inset-x-0 border-t ${tick === 0 ? "border-ink/15" : "border-dashed border-ink/8"}`}
                style={{ top: `${y(tick)}%` }}
                aria-hidden
              />
            ))}

            <svg
              key={count}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="animate-reveal-x absolute inset-0 size-full overflow-visible"
              aria-hidden
            >
              <defs>
                {visibleSeries.map((s, si) => (
                  <linearGradient key={s.label} id={`${id}-fill-${si}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              {visibleSeries.map((s, si) => {
                const line = smoothPath(s.values.map((v, i) => [x(i), y(v)]));
                return (
                  <g key={s.label}>
                    {s.area && <path d={`${line} L 100 100 L 0 100 Z`} fill={`url(#${id}-fill-${si})`} />}
                    <path
                      d={line}
                      fill="none"
                      stroke={s.color}
                      strokeWidth={s.dashed ? 2 : 2.75}
                      strokeDasharray={s.dashed ? "5 5" : undefined}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                );
              })}
            </svg>

            {active !== null && (
              <>
                <div
                  className="pointer-events-none absolute inset-y-0 w-px bg-ink/15"
                  style={{ left: `${x(active)}%` }}
                  aria-hidden
                />
                {visibleSeries.map((s) => (
                  <span
                    key={s.label}
                    className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                    style={{ left: `${x(active)}%`, top: `${y(s.values[active])}%`, background: s.color }}
                    aria-hidden
                  />
                ))}
                <div
                  className={`animate-fade-in pointer-events-none absolute -top-2 z-10 min-w-36 rounded-xl bg-ink px-3 py-2 text-xs text-white shadow-xl ${tooltipAlign}`}
                  style={{ left: `${x(active)}%` }}
                >
                  <p className="mb-1 font-semibold">{visibleLabels[active]}</p>
                  {visibleSeries.map((s) => (
                    <p key={s.label} className="flex items-center justify-between gap-4 whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-white/70">
                        <span className="size-2 rounded-full" style={{ background: s.color }} aria-hidden />
                        {s.label}
                      </span>
                      <span className="font-semibold">{formatValue(s.values[active])}</span>
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative mt-3 h-4 text-[11px]" aria-hidden>
            {visibleLabels.map((label, i) => (
              <span
                key={label}
                className={`absolute -translate-x-1/2 ${i === active ? "font-semibold text-ink" : "text-ink/45"} ${
                  count > 6 && (count - 1 - i) % 2 === 1 ? "hidden sm:inline" : ""
                }`}
                style={{ left: `${x(i)}%` }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
