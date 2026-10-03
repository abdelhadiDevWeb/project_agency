const BCRYPT_COST = 12;

export function hashPassword(plain: string): Promise<string> {
  return Bun.password.hash(plain, { algorithm: "bcrypt", cost: BCRYPT_COST });
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return Bun.password.verify(plain, hash);
}

let dummyHash: Promise<string> | undefined;

/**
 * Runs a full hash comparison against a throwaway hash so a login for an unknown
 * email takes as long as one for a real account (prevents email enumeration by timing).
 */
export async function burnPasswordCheck(plain: string): Promise<void> {
  dummyHash ??= hashPassword("timing-equaliser-not-a-real-password");
  await verifyPassword(plain, await dummyHash);
}
