import type { Metadata } from "next";

import { AgenciesManager } from "@/components/dashboard/AgenciesManager";
import { PageHeader } from "@/components/dashboard/ui";
import { AGENCIES } from "@/lib/mock/dashboard";
import { requireSpace } from "@/lib/session";

export const metadata: Metadata = { title: "Agencies" };

export default async function AdminAgenciesPage() {
  await requireSpace("admin");
  return (
    <>
      <PageHeader title="Agencies" description="Approve new agencies, manage plans and suspend accounts." />
      <AgenciesManager initialAgencies={AGENCIES} />
    </>
  );
}
