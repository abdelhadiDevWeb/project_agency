import {
  Building2,
  CalendarCheck,
  ChartLine,
  CreditCard,
  LayoutDashboard,
  Settings,
  TreePalm,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

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
      { label: "Statistics", href: "/admin/statistics", icon: ChartLine },
      { label: "Agencies", href: "/admin/agencies", icon: Building2 },
      { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
      { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
      { label: "Profile", href: "/admin/profile", icon: UserRound },
    ],
  },
  agency: {
    root: "/agency",
    roleLabel: "Agency",
    roleClass: "bg-ocean-light/15 text-ocean-light",
    nav: [
      { label: "Overview", href: "/agency", icon: LayoutDashboard },
      { label: "Statistics", href: "/agency/statistics", icon: ChartLine },
      { label: "Offers", href: "/agency/offers", icon: TreePalm },
      { label: "Bookings", href: "/agency/bookings", icon: CalendarCheck },
      { label: "Customers", href: "/agency/customers", icon: Users },
      { label: "Settings", href: "/agency/settings", icon: Settings },
      { label: "Profile", href: "/agency/profile", icon: UserRound },
    ],
  },
};
