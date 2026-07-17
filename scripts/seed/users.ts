import { db } from "../../src/server/db";
import { users } from "../../src/server/db/schema";
import { faker } from "@faker-js/faker";

export async function seedUsers(): Promise<string[]> {
  console.log("👤 Seeding users...");
  
  // Fetch existing users in database
  const existingUsers = await db.select().from(users);
  
  if (existingUsers.length > 0) {
    const ids = existingUsers.map(u => u.id);
    console.log(`Preserved ${ids.length} active database users: ${ids.join(", ")}`);
    return ids;
  }

  // If no user exists, create a default demo administrator
  const demoUserId = "user_2demo_admin_clerk_test";
  const { hashPassword } = await import("../../src/lib/auth/password");
  const passwordHash = await hashPassword("Dem0P@ssw0rd!2026_");

  await db.insert(users).values({
    id: demoUserId,
    email: "demo+clerk_test@example.com",
    name: "Demo Admin",
    passwordHash,
    isVerified: true,
    avatar: faker.image.avatar(),
  }).onConflictDoNothing();

  console.log(`✅ Seeded default user: ${demoUserId}`);
  return [demoUserId];
}
