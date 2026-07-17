import { db } from "@/server/db";
import { loginAttempts } from "@/server/db/schema";
import { eq, and, gte, desc, or, count } from "drizzle-orm";

/**
 * Checks if a login attempt for a given email or IP is currently locked out.
 * Lockout rule: 5 failed attempts in 15 minutes = 15 minutes lockout.
 */
export async function checkLoginRateLimit(
  email: string,
  ipAddress?: string
): Promise<{ isLocked: boolean; remainingTime?: number }> {
  const maxAttempts = 5;
  const lockoutDurationMinutes = 15;
  const windowStart = new Date(Date.now() - lockoutDurationMinutes * 60 * 1000);

  const emailClean = email.toLowerCase().trim();

  // Construct filters
  const conditions = [
    eq(loginAttempts.success, false),
    gte(loginAttempts.attemptedAt, windowStart),
  ];

  const orConditions = [eq(loginAttempts.email, emailClean)];
  if (ipAddress) {
    orConditions.push(eq(loginAttempts.ipAddress, ipAddress));
  }

  const queryCondition = and(...conditions, or(...orConditions));

  // Count failures
  const [failuresCount] = await db
    .select({ value: count(loginAttempts.id) })
    .from(loginAttempts)
    .where(queryCondition);

  const totalFailures = failuresCount?.value || 0;

  if (totalFailures >= maxAttempts) {
    // Retrieve the timestamp of the latest failed attempt to calculate remaining time
    const [latestAttempt] = await db
      .select({ attemptedAt: loginAttempts.attemptedAt })
      .from(loginAttempts)
      .where(queryCondition)
      .orderBy(desc(loginAttempts.attemptedAt))
      .limit(1);

    if (latestAttempt) {
      const expiresAt = latestAttempt.attemptedAt.getTime() + lockoutDurationMinutes * 60 * 1000;
      const remainingTime = Math.ceil((expiresAt - Date.now()) / 1000); // in seconds
      if (remainingTime > 0) {
        return { isLocked: true, remainingTime };
      }
    }
  }

  return { isLocked: false };
}

/**
 * Logs a login attempt to database for rate limiting analysis.
 */
export async function recordLoginAttempt(
  email: string,
  success: boolean,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await db.insert(loginAttempts).values({
      email: email.toLowerCase().trim(),
      success,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    });
  } catch (error) {
    console.error("Failed to record login attempt:", error);
  }
}
