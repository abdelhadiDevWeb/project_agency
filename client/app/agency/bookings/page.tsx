import type { Metadata } from "next";

import { BookingsManager } from "@/components/dashboard/BookingsManager";
import { PageHeader } from "@/components/dashboard/ui";
import { BOOKINGS, CURRENT_AGENCY_ID } from "@/lib/mock/dashboard";
import { requireSpace } from "@/lib/session";

export const metadata: Metadata = { title: "Bookings" };

export default async function AgencyBookingsPage() {
  await requireSpace("agency");
  return (
    <>
      <PageHeader title="Bookings" description="Confirm or cancel pending reservations from your travelers." />
      <BookingsManager initialBookings={BOOKINGS.filter((b) => b.agencyId === CURRENT_AGENCY_ID)} canManage />
    </>
  );
}
