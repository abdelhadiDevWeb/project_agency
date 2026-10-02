import { Clock, Mail, MapPin, Phone, Plane } from "lucide-react";

import { BRAND, DESTINATIONS, NAV_LINKS } from "./data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-ink text-white/70">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2.5 font-display text-2xl font-semibold text-white">
            <span className="grid size-9 place-items-center rounded-full bg-coral">
              <Plane className="size-4 -rotate-45" aria-hidden />
            </span>
            {BRAND}
          </p>
          <p className="mt-4 text-sm leading-relaxed">
            Curated journeys, honest prices and real people who care — since 2011.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Explore</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="transition-colors hover:text-coral">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
            Top destinations
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {DESTINATIONS.map((d) => (
              <li key={d.name}>
                <a href="#destinations" className="transition-colors hover:text-coral">
                  {d.name}, {d.country}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="size-4 text-coral" aria-hidden />
              <a href="tel:+10000000000" className="hover:text-white">
                +1 (000) 000-0000
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 text-coral" aria-hidden />
              <a href="mailto:hello@voyago.travel" className="hover:text-white">
                hello@voyago.travel
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-4 text-coral" aria-hidden />
              Your agency address
            </li>
            <li className="flex items-center gap-3">
              <Clock className="size-4 text-coral" aria-hidden />
              Support open 24/7
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs sm:flex-row">
          <p>
            &copy; {year} {BRAND}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
