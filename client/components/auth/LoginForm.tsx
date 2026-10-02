"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CircleAlert, Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";

type LoginResponse = { ok: boolean; user?: { role: string } };

function errorMessage(status: number): string {
  if (status === 401) return "Incorrect email or password.";
  if (status === 400) return "Please enter a valid email address and your password.";
  if (status === 429) return "Too many attempts. Please wait a minute and try again.";
  if (status >= 500) return "We can't reach the server right now. Please try again shortly.";
  return "Something went wrong. Please try again.";
}

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
      });

      if (!res.ok) {
        setError(errorMessage(res.status));
        setSubmitting(false);
        return;
      }

      const { user } = (await res.json()) as LoginResponse;
      const space = user?.role === "agency" ? "/agency" : "/admin";
      router.replace(next?.startsWith(space) ? next : space);
      router.refresh();
    } catch {
      setError(errorMessage(500));
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-ink/10 bg-white py-3.5 pr-4 pl-12 text-ink outline-none transition placeholder:text-ink/35 focus:border-ocean focus:ring-4 focus:ring-ocean/10";

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-5">
      {error && (
        <div
          role="alert"
          className="animate-fade-in flex items-start gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-600/15"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink/70">Email</span>
        <span className="relative block">
          <Mail className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink/35" aria-hidden />
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            maxLength={254}
            placeholder="you@agency.dz"
            className={inputClass}
          />
        </span>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink/70">Password</span>
        <span className="relative block">
          <Lock className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink/35" aria-hidden />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            maxLength={128}
            placeholder="••••••••"
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-3 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink/45 transition hover:bg-ink/5 hover:text-ink"
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-coral py-3.5 font-semibold text-white shadow-lg shadow-coral/25 transition hover:bg-coral-dark disabled:cursor-wait disabled:opacity-70"
      >
        {submitting && <LoaderCircle className="size-5 animate-spin" aria-hidden />}
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
