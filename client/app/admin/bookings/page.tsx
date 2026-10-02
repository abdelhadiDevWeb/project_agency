import type { Metadata } from "next";

import { BookingsManager } from "@/components/dashboard/BookingsManager";
import { PageHeader } from "@/components/dashboard/ui";
import { AGENCIES, BOOKINGS } from "@/lib/mock/dashboard";

export const metadata: Metadata = { title: "Bookings" };

export default function AdminBookingsPage() {
  return (
    <>
      <PageHeader title="All bookings" description="Every reservation made through the platform, across all agencies." />
      <BookingsManager initialBookings={BOOKINGS} agencies={AGENCIES} />
    </>
  );
}
