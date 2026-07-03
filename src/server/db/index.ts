import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV === "production") {
  throw new Error("DATABASE_URL environment variable is missing");
}

// Disable prepared statements for CockroachDB compatibility
const pgOptions = {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: { rejectUnauthorized: false },
  prepare: false, // Disable prepared statements
};

declare global {
  // eslint-disable-next-line no-var
  var globalClient: any;
}

let client;

if (process.env.NODE_ENV === "production") {
  client = postgres(connectionString!, pgOptions);
} else {
  if (!global.globalClient) {
    global.globalClient = postgres(
      connectionString || "postgres://postgres:postgres@localhost:5432/nexx_receptionist",
      pgOptions
    );
  }
  client = global.globalClient;
}

export const db = drizzle(client, { schema });
export type DbClient = typeof db;
