import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ImageUp, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

import { AgencyProfileForms } from "@/components/dashboard/AgencyProfileForms";
import { PageHeader } from "@/components/dashboard/ui";
import { getAgencyAccount } from "@/lib/agency";
import { requireSpace } from "@/lib/session";

export const metadata: Metadata = { title: "Profile" };

export default async function AgencyProfilePage() {
  await requireSpace("agency");
  const account = await getAgencyAccount();
  if (!account) redirect("/login?next=/agency/profile");

  return (
    <>
      <PageHeader title="Agency profile" description="Keep your contact details up to date and your account secure." />

      <div className="grid gap-6 lg:grid-cols-3">
        <aside className="animate-fade-up h-fit min-w-0 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-sm">
          <div className="h-24 bg-linear-to-br from-coral via-coral to-sun" />
          <div className="-mt-10 px-6 pb-6">
            <span className="relative grid size-20 place-items-center overflow-hidden rounded-2xl bg-white text-2xl font-semibold text-ocean shadow-sm ring-4 ring-white">
              {account.logoUrl ? (
                <Image src={account.logoUrl} alt={`${account.name} logo`} fill sizes="80px" unoptimized className="object-contain p-2" />
              ) : (
                account.name.slice(0, 1).toUpperCase()
              )}
            </span>
            <h2 className="mt-4 truncate text-xl font-semibold text-ink">{account.name}</h2>
            <span className="mt-2 inline-flex rounded-full bg-ocean-light/20 px-3 py-1 text-xs font-semibold text-ocean">
              Travel agency
            </span>

            <ul className="mt-6 space-y-3 border-t border-ink/5 pt-6 text-sm text-ink/65">
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-ocean" aria-hidden />
                <span className="truncate">{account.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="size-4 shrink-0 text-ocean" aria-hidden />
                <span className="truncate">{account.location}</span>
              </li>
              {account.phone.map((phone) => (
                <li key={phone} className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0 text-ocean" aria-hidden />
                  {phone}
                </li>
              ))}
              <li className="flex items-center gap-3">
                <ShieldCheck className="size-4 shrink-0 text-ocean" aria-hidden />
                Sessions end automatically after 8 hours.
              </li>
            </ul>

            <Link
              href="/agency/settings"
              className="mt-6 flex items-center justify-center gap-2 rounded-full border border-ink/10 px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-ink/25"
            >
              <ImageUp className="size-4" aria-hidden /> Change logo or stamp
            </Link>
          </div>
        </aside>

        <div className="min-w-0 lg:col-span-2">
          <AgencyProfileForms account={account} />
        </div>
      </div>
    </>
  );
}
