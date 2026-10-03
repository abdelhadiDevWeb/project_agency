import { env } from "../config/env";
import { Admin } from "../models/Admin";

/** Creates the default super admin from env if it does not exist. Never overwrites an existing password. */
export async function ensureDefaultAdmin(): Promise<void> {
  const { email, password, name } = env.defaultAdmin;
  if (!email || !password) return;

  if (await Admin.exists({ email })) return;

  await Admin.create({ email, password, full_name: name, role: "super_admin" });
  // eslint-disable-next-line no-console
  console.log(`Default super admin created: ${email}`);
}
