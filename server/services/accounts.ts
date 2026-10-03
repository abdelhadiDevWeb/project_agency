import { isValidObjectId } from "mongoose";

import { burnPasswordCheck, verifyPassword } from "../lib/password";
import type { JwtUser } from "../middleware/auth";
import { Admin, ADMIN_ROLES, type AdminRole } from "../models/Admin";
import { Agency } from "../models/Agency";
import { logoUrl } from "./branding";

export type SessionUser =
  | {
      id: string;
      role: "agency";
      name: string;
      email: string;
      location: string;
      logo: string | null;
    }
  | {
      id: string;
      role: AdminRole;
      name: string;
      email: string;
    };

type AgencyFields = { _id: unknown; name_agency: string; email: string; location: string; logo?: string | null };
type AdminFields = { _id: unknown; full_name: string; email: string; role: string };

function agencyToSession(agency: AgencyFields): SessionUser {
  return {
    id: String(agency._id),
    role: "agency",
    name: agency.name_agency,
    email: agency.email,
    location: agency.location,
    logo: logoUrl(agency.logo),
  };
}

export function adminToSession(admin: AdminFields): SessionUser {
  return {
    id: String(admin._id),
    role: admin.role as AdminRole,
    name: admin.full_name,
    email: admin.email,
  };
}

/**
 * Agencies are checked first, then admins. Returns null when no account matches
 * the email + password pair; callers must not reveal which part was wrong.
 */
export async function authenticate(email: string, password: string): Promise<SessionUser | null> {
  const agency = await Agency.findOne({ email }).select("+password").lean();
  if (agency && (await verifyPassword(password, agency.password))) {
    return agencyToSession(agency);
  }

  const admin = await Admin.findOne({ email }).select("+password").lean();
  if (admin && (await verifyPassword(password, admin.password))) {
    return adminToSession(admin);
  }

  if (!agency && !admin) await burnPasswordCheck(password);
  return null;
}

/** Resolves the account behind a verified token, or null if it no longer exists. */
export async function findSessionUser(user: JwtUser): Promise<SessionUser | null> {
  if (!isValidObjectId(user.sub)) return null;
  const roles = user.roles ?? [];

  if (roles.includes("agency")) {
    const agency = await Agency.findById(user.sub).lean();
    return agency ? agencyToSession(agency) : null;
  }

  if (roles.some((role) => (ADMIN_ROLES as readonly string[]).includes(role))) {
    const admin = await Admin.findById(user.sub).lean();
    return admin ? adminToSession(admin) : null;
  }

  return null;
}
