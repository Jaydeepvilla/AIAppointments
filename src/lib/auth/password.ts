import { hash, verify } from "@node-rs/argon2";

/**
 * Hash a plain text password using Argon2id.
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

/**
 * Verify a plain text password against a saved Argon2id hash.
 */
export async function verifyPassword(password: string, hashStr: string): Promise<boolean> {
  try {
    return await verify(hashStr, password);
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}
