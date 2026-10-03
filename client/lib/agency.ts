import { cookies } from "next/headers";
import { cache } from "react";

import { API_URL, SESSION_COOKIE } from "./session";

export type AgencyAccount = {
  id: string;
  name: string;
  email: string;
  location: string;
  phone: string[];
  logoUrl: string | null;
  cachetUrl: string | null;
};

/** Full account of the signed-in agency (phones, logo and stamp), or null when the session is not an agency. */
export const getAgencyAccount = cache(async (): Promise<AgencyAccount | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/agency/profile`, {
      headers: { cookie: `${SESSION_COOKIE}=${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { account?: AgencyAccount };
    return data.account ?? null;
  } catch {
    return null;
  }
});
