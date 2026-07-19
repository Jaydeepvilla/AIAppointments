import "dotenv/config";
import { db } from "../src/server/db";
import { users } from "../src/server/db/schema";
import { faker } from "@faker-js/faker";
import { hashPassword } from "../src/lib/auth/password";

async function main() {
  const demoUserId = "user_2demo_admin_clerk_test";
  const passwordHash = await hashPassword("Dem0P@ssw0rd!2026_");

  await db.insert(users).values({
    id: demoUserId,
    email: "demo+clerk_test@example.com",
    name: "Demo Admin",
    passwordHash,
    isVerified: true,
    avatar: faker.image.avatar(),
  }).onConflictDoUpdate({
    target: users.id,
    set: { passwordHash }
  });

  console.log(`✅ Seeded default user: ${demoUserId}`);
  process.exit(0);
}

main().catch(console.error);
