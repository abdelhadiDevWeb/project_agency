import type { Metadata } from "next";

import { OffersManager } from "@/components/dashboard/OffersManager";
import { PageHeader } from "@/components/dashboard/ui";
import { AGENCY_OFFERS } from "@/lib/mock/dashboard";
import { requireSpace } from "@/lib/session";

export const metadata: Metadata = { title: "Offers" };

export default async function AgencyOffersPage() {
  await requireSpace("agency");
  return (
    <>
      <PageHeader title="Your offers" description="Create trips, set prices in DA and choose what travelers can see." />
      <OffersManager initialOffers={AGENCY_OFFERS} />
    </>
  );
}
