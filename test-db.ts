import "dotenv/config";
import { db } from "./src/server/db/index.js";
import { users } from "./src/server/db/schema.js";
import { eq } from "drizzle-orm";

async function test() {
  try {
    const result = await db.select().from(users).where(eq(users.id, "user_3FUAZes0TqlN39w0Vf5Jz55gdoC"));
    console.log("Drizzle query successful! User:", result);
  } catch (err) {
    console.error("Drizzle query failed:", err);
  }
  process.exit(0);
}

test();
