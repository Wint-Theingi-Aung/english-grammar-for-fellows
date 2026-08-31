/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Seed script for the database.
 * Run: npx tsx scripts/seed.ts
 *
 * Requires DATABASE_URL in .env.local
 */

const { neon } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/neon-http");

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("ERROR: DATABASE_URL is not set. Add it to .env.local");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql);

  console.log("Running migrations...");

  // Create tables using raw SQL (Drizzle push equivalent)
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      anonymous_id VARCHAR(64) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS users_anonymous_id_idx ON users (anonymous_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS exercise_attempts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      exercise_id VARCHAR(64) NOT NULL,
      question_id INTEGER NOT NULL,
      selected_answer TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      total_points INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS exercise_attempts_user_id_idx ON exercise_attempts (user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS exercise_attempts_exercise_id_idx ON exercise_attempts (exercise_id)`;
  await sql`CREATE INDEX IF NOT EXISTS exercise_attempts_created_at_idx ON exercise_attempts (created_at)`;

  await sql`
    CREATE TABLE IF NOT EXISTS lesson_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      unit INTEGER NOT NULL,
      completed_exercises INTEGER NOT NULL DEFAULT 0,
      total_score INTEGER NOT NULL DEFAULT 0,
      best_score INTEGER NOT NULL DEFAULT 0,
      last_attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS lesson_progress_user_unit_idx ON lesson_progress (user_id, unit)`;

  console.log("Tables created successfully.");
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
