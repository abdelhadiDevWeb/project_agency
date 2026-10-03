"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ExternalLink, LogOut, Menu, Plane, X } from "lucide-react";

import { BRAND } from "@/components/home/data";

import { DASHBOARDS, type DashboardVariant } from "./nav-config";

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

function Avatar({ name, url, className }: { name: string; url?: string | null; className: string }) {
  if (url) {
    return (
      <span className={`relative shrink-0 overflow-hidden rounded-full ${className} bg-white!`}>
        <Image src={url} alt={`${name} logo`} fill sizes="40px" unoptimized className="object-contain p-1" />
      </span>
    );
  }
  return (
    <span className={`grid shrink-0 place-items-center rounded-full text-sm font-semibold ${className}`}>
      {initialsOf(name)}
    </span>
  );
}

export function DashboardShell({
  variant,
  user,
  context,
  children,
}: {
  variant: DashboardVariant;
  user: { name: string; email: string; avatarUrl?: string | null };
  context: string;
  children: ReactNode;
}) {
  const config = DASHBOARDS[variant];
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/login");
    router.refresh();
  };

  const isActive = (href: string) =>
    href === config.root ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex min-h-screen w-full flex-1">
      {open && (
        <div
          className="animate-fade-in fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-18 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-semibold">
            <span className="grid size-8 place-items-center rounded-full bg-coral">
              <Plane className="size-4 -rotate-45" aria-hidden />
            </span>
            {BRAND}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid size-9 place-items-center rounded-full text-white/70 hover:text-white lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-6">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${config.roleClass}`}>
            {config.roleLabel}
          </span>
        </div>

        <nav className="mt-6 flex-1 space-y-1 px-3">
          {config.nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {active && <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-coral" />}
                <item.icon className="size-5" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/60 transition hover:text-white"
          >
            <ExternalLink className="size-4" aria-hidden />
            View website
          </Link>
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white/5 p-3">
            <Avatar name={user.name} url={user.avatarUrl} className="size-10 bg-coral" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-white/50">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              aria-label="Sign out"
              title="Sign out"
              className="grid size-9 shrink-0 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-18 items-center gap-4 border-b border-ink/5 bg-sand/85 px-4 backdrop-blur-md sm:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-xl text-ink lg:hidden"
          >
            <Menu className="size-6" />
          </button>
          <p className="truncate text-sm font-medium text-ink/60">{context}</p>
          <Avatar
            name={user.name}
            url={user.avatarUrl}
            className="ml-auto size-10 bg-ink text-white ring-1 ring-ink/10"
          />
        </header>

        <main className="flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
