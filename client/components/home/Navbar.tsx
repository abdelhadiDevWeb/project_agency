"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Plane, X } from "lucide-react";

import { BRAND, NAV_LINKS } from "./data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? "bg-white/90 shadow-sm shadow-ink/5 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className={`flex items-center gap-2.5 font-display text-2xl font-semibold transition-colors ${
            solid ? "text-ink" : "text-white"
          }`}
        >
          <span className="grid size-9 place-items-center rounded-full bg-coral text-white">
            <Plane className="size-4 -rotate-45" aria-hidden />
          </span>
          {BRAND}
        </Link>

        <ul className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`group relative text-sm font-medium transition-colors ${
                  solid ? "text-ink/75 hover:text-ink" : "text-white/85 hover:text-white"
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-coral transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#offers"
          className="hidden rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-coral-dark md:inline-flex"
        >
          Book a trip
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={`grid size-10 place-items-center rounded-full md:hidden ${
            solid ? "text-ink" : "text-white"
          }`}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="animate-fade-up border-t border-ink/5 bg-white px-6 pt-2 pb-6 md:hidden">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-ink/80 hover:text-coral"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#offers"
            onClick={() => setOpen(false)}
            className="mt-3 flex justify-center rounded-full bg-coral py-3 text-sm font-semibold text-white"
          >
            Book a trip
          </a>
        </div>
      )}
    </header>
  );
}
