import { Building2, CalendarCheck, LayoutDashboard, TreePalm, type LucideIcon } from "lucide-react";

export type DashboardVariant = "admin" | "agency";

type DashboardConfig = {
  root: string;
  roleLabel: string;
  roleClass: string;
  nav: Array<{ label: string; href: string; icon: LucideIcon }>;
};

export const DASHBOARDS: Record<DashboardVariant, DashboardConfig> = {
  admin: {
    root: "/admin",
    roleLabel: "Super Admin",
    roleClass: "bg-coral/15 text-coral",
    nav: [
      { label: "Overview", href: "/admin", icon: LayoutDashboard },
      { label: "Agencies", href: "/admin/agencies", icon: Building2 },
      { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
    ],
  },
  agency: {
    root: "/agency",
    roleLabel: "Agency",
    roleClass: "bg-ocean-light/15 text-ocean-light",
    nav: [
      { label: "Overview", href: "/agency", icon: LayoutDashboard },
      { label: "Offers", href: "/agency/offers", icon: TreePalm },
      { label: "Bookings", href: "/agency/bookings", icon: CalendarCheck },
    ],
  },
};
