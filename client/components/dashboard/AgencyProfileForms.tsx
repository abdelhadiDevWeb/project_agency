"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Phone, Plus, Save, X } from "lucide-react";

import type { AgencyAccount } from "@/lib/agency";

import {
  ChangePasswordPanel,
  EmailPasswordConfirm,
  errorFrom,
  NETWORK_ERROR,
  NoticeBanner,
  SubmitButton,
  type Notice,
} from "./account-forms";
import { Field } from "./Modal";
import { inputClass, Panel } from "./ui";

const MAX_PHONES = 5;

export function AgencyProfileForms({ account }: { account: AgencyAccount }) {
  const router = useRouter();

  const [name, setName] = useState(account.name);
  const [location, setLocation] = useState(account.location);
  const [email, setEmail] = useState(account.email);
  const [savedEmail, setSavedEmail] = useState(account.email);
  const [phones, setPhones] = useState(account.phone.length ? account.phone : [""]);
  const [emailPassword, setEmailPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const emailChanged = email.trim().toLowerCase() !== savedEmail.toLowerCase();

  const setPhone = (index: number, value: string) =>
    setPhones((prev) => prev.map((p, i) => (i === index ? value : p)));

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotice(null);
    const cleanPhones = phones.map((p) => p.trim()).filter(Boolean);
    if (new Set(cleanPhones).size !== cleanPhones.length) {
      setNotice({ kind: "error", text: "Each phone number can only be listed once." });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/agency/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_agency: name,
          location,
          email,
          phone: cleanPhones,
          ...(emailChanged ? { current_password: emailPassword } : {}),
        }),
      });
      if (!res.ok) {
        setNotice({ kind: "error", text: await errorFrom(res) });
        return;
      }
      const { account: saved } = (await res.json()) as { account: AgencyAccount };
      setName(saved.name);
      setLocation(saved.location);
      setEmail(saved.email);
      setSavedEmail(saved.email);
      setPhones(saved.phone);
      setEmailPassword("");
      setNotice({ kind: "success", text: "Your agency profile has been updated." });
      router.refresh();
    } catch {
      setNotice({ kind: "error", text: NETWORK_ERROR });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Panel title="Agency information" description="Shown to travelers on your offers and vouchers.">
        <form onSubmit={save} className="space-y-4">
          <NoticeBanner notice={notice} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Agency name">
              <input
                name="name_agency"
                required
                minLength={2}
                maxLength={120}
                autoComplete="organization"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="City / address">
              <input
                name="location"
                required
                minLength={2}
                maxLength={200}
                autoComplete="address-level2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Email">
            <input
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </Field>
          {emailChanged && <EmailPasswordConfirm value={emailPassword} onChange={setEmailPassword} />}

          <fieldset className="space-y-2">
            <legend className="mb-1.5 text-sm font-medium text-ink/70">Phone numbers</legend>
            {phones.map((phone, i) => (
              <div key={i} className="flex gap-2">
                <span className="relative block flex-1">
                  <Phone className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink/35" aria-hidden />
                  <input
                    type="tel"
                    required={i === 0}
                    pattern="\+?[0-9][0-9 \-]{7,19}"
                    title="Digits, spaces or dashes, e.g. +213 555 12 34 56"
                    autoComplete={i === 0 ? "tel" : "off"}
                    aria-label={`Phone number ${i + 1}`}
                    placeholder="+213 555 12 34 56"
                    value={phone}
                    onChange={(e) => setPhone(i, e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </span>
                {phones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setPhones((prev) => prev.filter((_, idx) => idx !== i))}
                    aria-label={`Remove phone number ${i + 1}`}
                    className="grid size-11 shrink-0 place-items-center rounded-xl text-ink/45 transition hover:bg-rose-50 hover:text-rose-700"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            ))}
            {phones.length < MAX_PHONES && (
              <button
                type="button"
                onClick={() => setPhones((prev) => [...prev, ""])}
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-semibold text-ocean transition hover:bg-mist"
              >
                <Plus className="size-4" aria-hidden /> Add a phone number
              </button>
            )}
          </fieldset>

          <div className="flex justify-end">
            <SubmitButton busy={saving} icon={<Save className="size-4" aria-hidden />}>
              {saving ? "Saving…" : "Save changes"}
            </SubmitButton>
          </div>
        </form>
      </Panel>

      <ChangePasswordPanel endpoint="/api/agency/profile/password" />
    </div>
  );
}
