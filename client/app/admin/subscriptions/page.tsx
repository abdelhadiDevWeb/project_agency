import type { Metadata } from "next";

import { SubscriptionsManager } from "@/components/dashboard/SubscriptionsManager";
import { PageHeader } from "@/components/dashboard/ui";
import { AGENCIES, PLANS, SUBSCRIPTIONS } from "@/lib/mock/dashboard";
import { requireSpace } from "@/lib/session";

export const metadata: Metadata = { title: "Subscriptions" };

export default async function AdminSubscriptionsPage() {
  await requireSpace("admin");
  return (
    <>
      <PageHeader
        title="Subscriptions"
        description="Plans, prices and every agency's subscription. Activate trials, renew, change plans or cancel."
      />
      <SubscriptionsManager initialPlans={PLANS} initialSubscriptions={SUBSCRIPTIONS} agencies={AGENCIES} />
    </>
  );
}
