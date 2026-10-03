import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { BrandingSettings } from "@/components/dashboard/BrandingSettings";
import { PageHeader } from "@/components/dashboard/ui";
import { getAgencyAccount } from "@/lib/agency";
import { TODAY } from "@/lib/mock/dashboard";
import { requireSpace } from "@/lib/session";

export const metadata: Metadata = { title: "Settings" };

export default async function AgencySettingsPage() {
  await requireSpace("agency");
  const account = await getAgencyAccount();
  if (!account) redirect("/login?next=/agency/settings");

  return (
    <>
      <PageHeader title="Settings" description="Your agency's branding: the logo and the official stamp used on documents." />
      <BrandingSettings
        agency={{ name: account.name, location: account.location, phone: account.phone[0] ?? null, email: account.email }}
        initialLogoUrl={account.logoUrl}
        initialCachetUrl={account.cachetUrl}
        today={TODAY}
      />
    </>
  );
}
