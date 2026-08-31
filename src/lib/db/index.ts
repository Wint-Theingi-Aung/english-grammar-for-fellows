import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) return null;

  const sql = neon(url);
  _db = drizzle(sql, { schema });
  return _db;
}

export function hasDatabase(): boolean {
  return getDb() !== null;
}

export function getDatabase() {
  const db = getDb();
  if (!db) {
    throw new Error(
      "DATABASE_URL is not set. Configure it in .env.local or Vercel environment variables."
    );
  }
  return db;
}

export { schema };
