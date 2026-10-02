import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plane } from "lucide-react";

import { LoginForm } from "@/components/auth/LoginForm";
import { BRAND, HERO_IMAGE } from "@/components/home/data";
import { getSession, spaceFor } from "@/lib/session";

export const metadata: Metadata = {
  title: `Sign in — ${BRAND}`,
  robots: { index: false, follow: false },
};

const SAFE_NEXT = /^\/(admin|agency)(\/[a-z0-9-]+)*$/;

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const user = await getSession();
  if (user) redirect(`/${spaceFor(user)}`);

  const { next } = await searchParams;
  const safeNext = next && SAFE_NEXT.test(next) ? next : undefined;

  return (
    <div className="grid min-h-screen w-full flex-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src={HERO_IMAGE}
          alt="Turquoise sea and mountains at sunrise"
          fill
          preload
          sizes="50vw"
          className="animate-ken-burns object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/30 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="animate-fade-up font-display text-4xl leading-tight font-semibold">
            Every journey starts <em className="text-ocean-light">with a plan.</em>
          </p>
          <p className="animate-fade-up mt-4 max-w-md text-white/75" style={{ animationDelay: "120ms" }}>
            Manage your offers, bookings and travelers from one place.
          </p>
        </div>
      </div>

      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-semibold text-ink">
          <span className="grid size-8 place-items-center rounded-full bg-coral text-white">
            <Plane className="size-4 -rotate-45" aria-hidden />
          </span>
          {BRAND}
        </Link>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="animate-fade-up w-full max-w-md">
            <h1 className="font-display text-4xl font-semibold text-ink">Welcome back</h1>
            <p className="mt-2 text-ink/55">Sign in to your agency or admin space.</p>
            <LoginForm next={safeNext} />
          </div>
        </div>

        <p className="text-center text-xs text-ink/40">
          © {new Date().getFullYear()} {BRAND}. Accounts are created by the platform administrator.
        </p>
      </div>
    </div>
  );
}
