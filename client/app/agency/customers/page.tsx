import type { Metadata } from "next";
import { Crown, Repeat, Users, Wallet } from "lucide-react";

import { CustomersManager } from "@/components/dashboard/CustomersManager";
import { PageHeader, StatCard } from "@/components/dashboard/ui";
import { daysBetween, formatDZDCompact, formatNumber } from "@/lib/format";
import {
  AGENCY_CUSTOMERS,
  BOOKINGS,
  CURRENT_AGENCY_ID,
  customerSegment,
  TODAY,
  VIP_SPEND,
} from "@/lib/mock/dashboard";
import { requireSpace } from "@/lib/session";

export const metadata: Metadata = { title: "Customers" };

export default async function AgencyCustomersPage() {
  await requireSpace("agency");

  const total = AGENCY_CUSTOMERS.length;
  const returning = AGENCY_CUSTOMERS.filter((c) => c.bookings >= 2).length;
  const vip = AGENCY_CUSTOMERS.filter((c) => customerSegment(c) === "VIP").length;
  const newThisMonth = AGENCY_CUSTOMERS.filter((c) => daysBetween(c.firstBooking, TODAY) <= 30).length;
  const averageSpend = AGENCY_CUSTOMERS.reduce((sum, c) => sum + c.totalSpent, 0) / Math.max(total, 1);
  const agencyBookings = BOOKINGS.filter((b) => b.agencyId === CURRENT_AGENCY_ID);

  return (
    <>
      <PageHeader title="Customers" description="Everyone who has booked a trip with your agency." />

      <div className="mb-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Customers" value={formatNumber(total)} icon={Users} hint={`${newThisMonth} joined in the last 30 days`} />
        <StatCard
          label="Returning customers"
          value={`${Math.round((returning / Math.max(total, 1)) * 100)}%`}
          icon={Repeat}
          hint={`${returning} booked more than once`}
          delay={80}
        />
        <StatCard
          label="Average spend"
          value={formatDZDCompact(averageSpend)}
          icon={Wallet}
          hint="per customer"
          delay={160}
        />
        <StatCard
          label="VIP customers"
          value={String(vip)}
          icon={Crown}
          hint={`${formatDZDCompact(VIP_SPEND)}+ spent or 5+ trips`}
          delay={240}
        />
      </div>

      <CustomersManager customers={AGENCY_CUSTOMERS} bookings={agencyBookings} />
    </>
  );
}
