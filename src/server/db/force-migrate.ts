import fs from "fs";
import path from "path";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });

async function main() {
  try {
    const migrationPath = path.join(__dirname, "migrations", "0006_pretty_silver_sable.sql");
    const migrationContent = fs.readFileSync(migrationPath, "utf-8");
    
    // Split by statement-breakpoint and remove empty statements
    const statements = migrationContent
      .split("--> statement-breakpoint")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      try {
        await sql.unsafe(statement);
      } catch (e: any) {
        if (e.message.includes("already exists")) {
        } else {
          console.error("Error executing statement:", e.message);
        }
      }
    }
  } catch (e) {
    console.error("Failed to run script:", e);
  } finally {
    await sql.end();
  }
}

main();
