import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireSpace } from "@/lib/session";

export const metadata: Metadata = {
  title: { default: "Super Admin — Voyago", template: "%s · Super Admin — Voyago" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireSpace("admin");
  return (
    <DashboardShell variant="admin" user={{ name: user.name, email: user.email }} context="Platform administration">
      {children}
    </DashboardShell>
  );
}
