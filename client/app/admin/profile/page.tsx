import type { Metadata } from "next";
import { Clock, KeyRound, Mail, ShieldCheck } from "lucide-react";

import { ProfileForms } from "@/components/dashboard/ProfileForms";
import { PageHeader } from "@/components/dashboard/ui";
import { requireSpace } from "@/lib/session";

export const metadata: Metadata = { title: "Profile" };

const ROLE_LABELS: Record<string, string> = { super_admin: "Super Admin", admin: "Admin" };

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export default async function AdminProfilePage() {
  const user = await requireSpace("admin");

  const security = [
    { icon: ShieldCheck, text: "Your session lives in a secure, HTTP-only cookie." },
    { icon: Clock, text: "Sessions end automatically after 8 hours." },
    { icon: KeyRound, text: "Passwords are stored as bcrypt hashes, never in plain text." },
  ];

  return (
    <>
      <PageHeader title="My profile" description="Manage your account details and keep your sign-in secure." />

      <div className="grid gap-6 lg:grid-cols-3">
        <aside className="animate-fade-up h-fit min-w-0 overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-sm">
          <div className="h-24 bg-linear-to-br from-ocean via-ocean to-ocean-light" />
          <div className="-mt-10 px-6 pb-6">
            <span className="grid size-20 place-items-center rounded-full bg-coral text-2xl font-semibold text-white ring-4 ring-white">
              {initialsOf(user.name)}
            </span>
            <h2 className="mt-4 truncate text-xl font-semibold text-ink">{user.name}</h2>
            <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-ink/55">
              <Mail className="size-4 shrink-0" aria-hidden /> {user.email}
            </p>
            <span className="mt-3 inline-flex rounded-full bg-coral/15 px-3 py-1 text-xs font-semibold text-coral">
              {ROLE_LABELS[user.role] ?? user.role}
            </span>

            <ul className="mt-6 space-y-3 border-t border-ink/5 pt-6">
              {security.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm text-ink/60">
                  <Icon className="mt-0.5 size-4 shrink-0 text-ocean" aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="min-w-0 lg:col-span-2">
          <ProfileForms name={user.name} email={user.email} />
        </div>
      </div>
    </>
  );
}
