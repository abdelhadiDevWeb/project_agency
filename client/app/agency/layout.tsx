import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireSpace } from "@/lib/session";

export const metadata: Metadata = {
  title: { default: "Agency dashboard — Voyago", template: "%s · Agency dashboard — Voyago" },
  robots: { index: false, follow: false },
};

export default async function AgencyLayout({ children }: { children: ReactNode }) {
  const user = await requireSpace("agency");
  const context = user.role === "agency" ? `${user.name} · ${user.location}` : user.name;
  const avatarUrl = user.role === "agency" ? user.logo : null;
  return (
    <DashboardShell variant="agency" user={{ name: user.name, email: user.email, avatarUrl }} context={context}>
      {children}
    </DashboardShell>
  );
}
