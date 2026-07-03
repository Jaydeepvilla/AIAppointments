import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL);

async function dropAll() {
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `;
    
    console.log(`Found ${tables.length} tables. Dropping...`);
    
    for (const { table_name } of tables) {
      console.log(`Dropping ${table_name}`);
      await sql.unsafe(`DROP TABLE IF EXISTS "public"."${table_name}" CASCADE`);
    }
    
    console.log('All tables dropped');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

dropAll();
