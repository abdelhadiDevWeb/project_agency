import type { Metadata } from "next";

import { BookingsManager } from "@/components/dashboard/BookingsManager";
import { PageHeader } from "@/components/dashboard/ui";
import { AGENCIES, BOOKINGS } from "@/lib/mock/dashboard";
import { requireSpace } from "@/lib/session";

export const metadata: Metadata = { title: "Bookings" };

export default async function AdminBookingsPage() {
  await requireSpace("admin");
  return (
    <>
      <PageHeader title="All bookings" description="Every reservation made through the platform, across all agencies." />
      <BookingsManager initialBookings={BOOKINGS} agencies={AGENCIES} />
    </>
  );
}
