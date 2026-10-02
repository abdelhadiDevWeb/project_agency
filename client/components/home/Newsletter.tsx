"use client";

import { useState, type FormEvent } from "react";
import { Check, Send } from "lucide-react";

import { Reveal } from "./Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setSubscribed(true);
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ocean px-8 py-16 text-center text-white sm:px-16">
          <div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -right-16 -bottom-28 size-80 rounded-full bg-coral/30" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-4xl leading-tight font-semibold sm:text-5xl">
              Get secret deals in your inbox
            </h2>
            <p className="mt-4 text-lg text-white/75">
              Join 40,000 travelers who get early access to flash sales and travel inspiration.
              No spam, ever.
            </p>

            {subscribed ? (
              <p className="animate-fade-up mx-auto mt-10 inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 font-semibold text-ocean">
                <Check className="size-5" />
                You&apos;re on the list — check your inbox!
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-10 flex max-w-lg flex-col gap-3 rounded-3xl bg-white p-2 sm:flex-row sm:rounded-full"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 rounded-full bg-transparent px-5 py-3 text-ink outline-none placeholder:text-ink/40"
                />
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-coral px-7 py-3 font-semibold text-white transition hover:bg-coral-dark"
                >
                  Subscribe
                  <Send className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
