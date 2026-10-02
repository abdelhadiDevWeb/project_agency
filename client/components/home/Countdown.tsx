"use client";

import { useEffect, useState } from "react";

function endOfMonth(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

function split(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
  };
}

export function Countdown() {
  // Starts empty so server and first client render match; time is filled in after mount.
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = endOfMonth(new Date()).getTime();
    const tick = () => setRemaining(target - Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const parts = remaining === null ? null : split(remaining);
  const units = [
    { label: "Days", value: parts?.days },
    { label: "Hours", value: parts?.hours },
    { label: "Mins", value: parts?.minutes },
    { label: "Secs", value: parts?.seconds },
  ];

  return (
    <div className="flex gap-3" aria-label="Time left on this offer">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex w-18 flex-col items-center rounded-2xl border border-white/20 bg-white/10 py-3 backdrop-blur"
        >
          <span className="font-display text-3xl font-semibold tabular-nums">
            {unit.value === undefined ? "--" : String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-xs tracking-wide text-white/70 uppercase">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
