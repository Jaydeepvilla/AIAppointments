import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function dropTypes() {
  try {
    const types = await sql`SELECT t.typname FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname != 'crdb_internal_region' GROUP BY t.typname`;
    for (const {typname} of types) {
      await sql.unsafe(`DROP TYPE IF EXISTS "${typname}"`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
dropTypes();
