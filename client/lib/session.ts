import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const API_URL = process.env.API_URL ?? "http://localhost:4000";
export const SESSION_COOKIE = "access_token";

export type SessionUser =
  | { id: string; role: "agency"; name: string; email: string; location: string; logo: string | null }
  | { id: string; role: "super_admin" | "admin"; name: string; email: string };

export type Space = "admin" | "agency";

export function spaceFor(user: SessionUser): Space {
  return user.role === "agency" ? "agency" : "admin";
}

/** Asks the API who owns the session cookie. Deduplicated per request. */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/me`, {
      headers: { cookie: `${SESSION_COOKIE}=${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { user?: SessionUser };
    return data.user ?? null;
  } catch {
    return null;
  }
});

/** Returns the signed-in user for this space, otherwise redirects to login or to the user's own space. */
export async function requireSpace(space: Space): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect(`/login?next=/${space}`);
  if (spaceFor(user) !== space) redirect(`/${spaceFor(user)}`);
  return user;
}
