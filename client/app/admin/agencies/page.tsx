import type { Metadata } from "next";

import { AgenciesManager } from "@/components/dashboard/AgenciesManager";
import { PageHeader } from "@/components/dashboard/ui";
import { AGENCIES } from "@/lib/mock/dashboard";

export const metadata: Metadata = { title: "Agencies" };

export default function AdminAgenciesPage() {
  return (
    <>
      <PageHeader title="Agencies" description="Approve new agencies, manage plans and suspend accounts." />
      <AgenciesManager initialAgencies={AGENCIES} />
    </>
  );
}
