"use client";

export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
  counts,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  counts?: Partial<Record<T, number>>;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-full bg-white p-1 shadow-sm ring-1 ring-ink/5" role="tablist">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              active ? "bg-ink text-white" : "text-ink/60 hover:text-ink"
            }`}
          >
            {option}
            {counts?.[option] !== undefined && (
              <span
                className={`rounded-full px-1.5 text-xs ${active ? "bg-white/15" : "bg-ink/5 text-ink/50"}`}
              >
                {counts[option]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
