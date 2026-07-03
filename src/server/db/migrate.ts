import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function runMigration() {
  console.log("Starting migration...");
  
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  // Create a connection for migrations
  const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(migrationClient);

  try {
    // Run the migrations
    await migrate(db, { migrationsFolder: "./src/server/db/migrations" });
    console.log("[OK] Migration completed successfully!");
  } catch (error) {
    console.error("[ERROR] Migration failed:", error);
  } finally {
    // Close the connection
    await migrationClient.end();
    process.exit(0);
  }
}

runMigration();
