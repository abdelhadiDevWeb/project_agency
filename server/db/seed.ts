import { env } from "../config/env";
import { Admin } from "../models/Admin";

/**
 * Bootstraps the first super admin from env when the admin collection is empty.
 * Once any admin exists this does nothing, so profile changes (email, password) are never undone on restart.
 */
export async function ensureDefaultAdmin(): Promise<void> {
  const { email, password, name } = env.defaultAdmin;
  if (!email || !password) return;

  if (await Admin.exists({})) return;

  await Admin.create({ email, password, full_name: name, role: "super_admin" });
  // eslint-disable-next-line no-console
  console.log(`Default super admin created: ${email}`);
}
