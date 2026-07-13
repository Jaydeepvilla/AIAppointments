import "dotenv/config";
import { db } from "../src/server/db";
import { faker } from "@faker-js/faker";
import {
  users,
  organizations,
  memberships,
  businessProfiles,
  serviceCategories,
  services,
  businessSettings,
} from "../src/server/db/schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🌱 Starting database seed...");
  try {
    // 1. Setup Clerk User (Syncing Auth with DB)
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) throw new Error("Missing CLERK_SECRET_KEY in environment variables.");
    
    const { createClerkClient } = await import("@clerk/backend");
    const clerkClient = createClerkClient({ secretKey });
    
    // Using official Clerk test format completely bypasses device verification blocks
    const email = "demo+clerk_test@example.com";
    const password = "Dem0P@ssw0rd!2026_";

    const { data: existingUsers } = await clerkClient.users.getUserList({ emailAddress: [email] });
    if (existingUsers.length > 0) {
      await clerkClient.users.deleteUser(existingUsers[0].id);
    }

    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      password: password,
      firstName: "Demo",
      lastName: "Admin",
    });

    const userId = clerkUser.id;

    // 1b. Create Demo User in Database
    await db.insert(users).values({
      id: userId,
      email: email,
      name: "Demo Admin",
      avatar: faker.image.avatar(),
    }).onConflictDoNothing();

    console.log("✅ Created Demo User in Clerk & Database");

    // 2. Create Organization
    // We are generating a static UUID so it doesn't duplicate if we run the seed multiple times.
    const orgId = "11111111-1111-1111-1111-111111111111";
    await db.insert(organizations).values({
      id: orgId,
      name: "The Gentleman's Cut",
      slug: "the-gentlemans-cut",
      industry: "Beauty & Grooming",
      timezone: "America/New_York",
      email: "booking@gentlemanscut.com",
      phone: "+18005559999",
      address: "456 Main St, New York, NY 10002",
    }).onConflictDoNothing(); // If this ID already exists, do nothing (idempotency)

    // 3. Link user to organization
    // The membership table maps User -> Organization with a specific role
    await db.insert(memberships).values({
      organizationId: orgId,
      userId: userId,
      role: "owner", // Full admin access
    }).onConflictDoNothing();

    // 4. Create Business Profile & Settings
    // The profile handles customer-facing text and branding
    await db.insert(businessProfiles).values({
      organizationId: orgId,
      description: "A premier barbershop offering classic cuts, modern styling, and traditional straight razor shaves.",
    }).onConflictDoNothing();

    // The settings handle operational data like when you are open
    await db.insert(businessSettings).values({
      organizationId: orgId,
      businessHours: {
        monday: { open: "closed", close: "closed" }, // Barbershops are often closed on Mondays!
        tuesday: { open: "09:00", close: "19:00" },
        wednesday: { open: "09:00", close: "19:00" },
        thursday: { open: "09:00", close: "20:00" }, // Open late Thursday
        friday: { open: "09:00", close: "19:00" },
        saturday: { open: "08:00", close: "16:00" }, // Early Saturday
        sunday: { open: "10:00", close: "15:00" },
      },
      holidays: [],
      languages: ["en"],
    }).onConflictDoNothing();

    // 5. Create Services
    // First we create categories to group the services
    const hairCatId = "22222222-2222-2222-2222-222222222222";
    const beardCatId = "33333333-3333-3333-3333-333333333333";
    
    await db.insert(serviceCategories).values([
      { id: hairCatId, organizationId: orgId, name: "Haircuts & Styling" },
      { id: beardCatId, organizationId: orgId, name: "Beard & Shave" }
    ]).onConflictDoNothing();

    // Then we create the actual bookable services
    await db.insert(services).values([
      {
        organizationId: orgId,
        categoryId: hairCatId,
        name: "The Classic Cut",
        duration: 45, // 45 minutes
        price: "45.00",
      },
      {
        organizationId: orgId,
        categoryId: hairCatId,
        name: "Skin Fade",
        duration: 60,
        price: "55.00",
      },
      {
        organizationId: orgId,
        categoryId: beardCatId,
        name: "Beard Trim & Line Up",
        duration: 30,
        price: "25.00",
      },
      {
        organizationId: orgId,
        categoryId: beardCatId,
        name: "Hot Towel Straight Razor Shave",
        duration: 45,
        price: "40.00",
      }
    ]).onConflictDoNothing();
    
    console.log("✅ Seeded The Gentleman's Cut Barbershop!");
    
    console.log("🌱 Database seed complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
