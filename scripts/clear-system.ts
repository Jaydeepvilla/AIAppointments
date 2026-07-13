import "dotenv/config";
import { db } from "../src/server/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🧹 Starting system cleanup...");

  // 1. Clear Clerk Users (Only if DELETE_REMOTE_CLERK is set to true)
  try {
    const deleteClerk = process.env.DELETE_REMOTE_CLERK === "true";
    if (!deleteClerk) {
      console.log("👤 Skipping remote Clerk user deletion (safe default). Set DELETE_REMOTE_CLERK=true to enable.");
    } else {
      const secretKey = process.env.CLERK_SECRET_KEY;
      if (!secretKey) {
        console.log("⚠️ Missing CLERK_SECRET_KEY. Skipping Clerk user deletion.");
      } else {
        console.log("👤 Fetching and deleting Clerk users...");
        const { createClerkClient } = await import("@clerk/backend");
        const clerkClient = createClerkClient({ secretKey });

        let hasMore = true;
        let limit = 100;
        
        while (hasMore) {
          const usersList = await clerkClient.users.getUserList({ limit });
          if (usersList.data.length === 0) {
            hasMore = false;
            break;
          }

          console.log(`Deleting batch of ${usersList.data.length} users...`);
          for (const user of usersList.data) {
            try {
              await clerkClient.users.deleteUser(user.id);
              console.log(`Deleted Clerk user: ${user.id} (${user.emailAddresses[0]?.emailAddress})`);
            } catch (e) {
              console.error(`Failed to delete Clerk user ${user.id}:`, e);
            }
          }

          if (usersList.data.length < limit) {
            hasMore = false;
          }
        }
        console.log("✅ Clerk users deleted successfully.");
      }
    }
  } catch (err) {
    console.error("❌ Error deleting Clerk users:", err);
  }

  // 2. Clear Database Tables
  try {
    console.log("💾 Clearing database tables...");
    
    // Get all user tables except users table
    const tablesResult = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT LIKE '%drizzle%'
        AND table_name NOT LIKE '_drizzle%'
        AND table_name != 'users'
    `);

    // postgres-js returns rows directly as the result array
    const rows = Array.isArray(tablesResult) ? tablesResult : (tablesResult as any).rows || [];
    const tableNames = rows.map((row: any) => `"${row.table_name}"`);

    const tablesToClear: string[] = [];
    console.log(`🔍 Checking row counts for ${tableNames.length} tables...`);
    
    // Run simple SELECT check to see if we can skip empty tables
    for (const table of tableNames) {
      try {
        const countRes = await db.execute(sql.raw(`SELECT 1 FROM ${table} LIMIT 1;`));
        const hasRows = Array.isArray(countRes) ? countRes.length > 0 : (countRes as any).rows?.length > 0;
        if (hasRows) {
          tablesToClear.push(table);
        }
      } catch (err: any) {
        // Table might not exist or be accessible, skip
      }
    }

    if (tablesToClear.length > 0) {
      // Parent tables should be cleared LAST to avoid foreign key violations during DELETE
      const parentTables = ['"organizations"', '"users"', '"plans"', '"subscription_plans"'];
      const children = tablesToClear.filter(t => !parentTables.includes(t));
      const parents = tablesToClear.filter(t => parentTables.includes(t));
      const sortedTables = [...children, ...parents];

      console.log(`Clearing ${sortedTables.length} non-empty tables: ${sortedTables.join(", ")}`);
      for (const table of sortedTables) {
        try {
          // Try DELETE first - it is row-level and extremely fast without range lease transitions
          await db.execute(sql.raw(`DELETE FROM ${table};`));
          console.log(`  ✓ Cleared (DELETE): ${table}`);
        } catch (e: any) {
          try {
            // Fallback to TRUNCATE CASCADE if DELETE fails (e.g. due to cyclic foreign keys)
            await db.execute(sql.raw(`TRUNCATE TABLE ${table} CASCADE;`));
            console.log(`  ✓ Cleared (TRUNCATE CASCADE): ${table}`);
          } catch (truncErr: any) {
            console.error(`  ❌ Failed to clear ${table}:`, truncErr.message);
          }
        }
      }
      console.log("✅ Database tables cleared successfully (preserved 'users').");
    } else {
      console.log("ℹ️ All tables are already empty. No clearing needed.");
    }
  } catch (err) {
    console.error("❌ Error clearing database:", err);
  }

  console.log("✨ Cleanup complete!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
