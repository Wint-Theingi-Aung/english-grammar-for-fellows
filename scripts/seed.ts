/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Seed script for the database.
 * Creates tables and seeds unit data idempotently (safe to run multiple times).
 * Run: npm run db:seed
 *
 * Requires DATABASE_URL in .env or .env.local
 *
 * Uses the Neon serverless HTTP driver — the same driver used by the app's
 * runtime database connection (src/lib/db/index.ts).
 *
 * What this script does:
 * 1. Creates all database tables (idempotent — safe to run again)
 * 2. Reads and validates JSON data files for Units 1–5
 * 3. Validates exactly 3 options and exactly 1 correct answer per question
 * 4. Inserts unit metadata into the `units` table (upsert, never duplicates)
 * 5. Never deletes existing user progress or exercise attempts
 */

const { neon } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/neon-http");
const { sql } = require("drizzle-orm");
const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Environment loading
// ---------------------------------------------------------------------------

/**
 * Load .env / .env.local files into process.env.
 * Next.js does this automatically, but standalone tsx/node scripts do not.
 */
function loadEnvFile() {
  for (const name of [".env.local", ".env"]) {
    const envPath = path.join(__dirname, "..", name);
    if (!fs.existsSync(envPath)) continue;
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
    break;
  }
}
loadEnvFile();

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const UNITS = [1, 2, 3, 4, 5];
const DATA_DIR = path.join(__dirname, "..", "data");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadJson(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a Drizzle sql tagged template query with retry + exponential backoff.
 */
async function execWithRetry(db: any, queryFn: () => Promise<any>, maxRetries = 3): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await queryFn();
    } catch (err: any) {
      const isLast = attempt === maxRetries;
      const msg = err.message || "";
      const isRetryable =
        /timeout|fetch|ECONNRESET|ETIMEDOUT|EPIPE|connection|terminated/i.test(msg);
      if (isLast || !isRetryable) throw err;
      const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
      console.log(`    Retry ${attempt}/${maxRetries} in ${delay}ms`);
      await sleep(delay);
    }
  }
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateQuestion(q: any, exerciseId: string, _unitNum: number): string[] {
  const errors: string[] = [];
  const tag = `Q${q.id} in "${exerciseId}"`;

  if (!q.id && q.id !== 0) errors.push(`  - ${tag.replace("Qundefined", "Question")}: missing "id"`);
  if (!q.question || typeof q.question !== "string" || !q.question.trim())
    errors.push(`  - ${tag}: missing "question"`);
  if (!Array.isArray(q.options)) {
    errors.push(`  - ${tag}: missing "options" array`);
  } else if (q.options.length !== 3) {
    errors.push(`  - ${tag}: has ${q.options.length} options (expected exactly 3)`);
  } else {
    for (let i = 0; i < q.options.length; i++) {
      if (typeof q.options[i] !== "string" || !q.options[i].trim())
        errors.push(`  - ${tag}: empty/invalid option at index ${i}`);
    }
    const unique = new Set(q.options.map((o: string) => o.trim().toLowerCase()));
    if (unique.size !== q.options.length)
      errors.push(`  - ${tag}: duplicate options [${q.options.join(", ")}]`);
  }
  if (!q.answer || typeof q.answer !== "string" || !q.answer.trim()) {
    errors.push(`  - ${tag}: missing "answer"`);
  } else if (Array.isArray(q.options) && q.options.length === 3) {
    const matches = q.options.some((opt: string) => opt === q.answer);
    if (!matches)
      errors.push(`  - ${tag}: answer "${q.answer}" does not match any option`);
  }
  if (!q.explanation || typeof q.explanation !== "string" || !q.explanation.trim())
    errors.push(`  - ${tag}: missing "explanation"`);
  if (typeof q.points !== "number" || q.points <= 0)
    errors.push(`  - ${tag}: invalid "points"`);

  return errors;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateUnit(unitNum: number): { valid: boolean; errors: string[]; data: any } {
  const lessonsPath = path.join(DATA_DIR, `unit-${unitNum}-lessons.json`);
  const exercisesPath = path.join(DATA_DIR, `unit-${unitNum}-exercises.json`);
  const allErrors: string[] = [];

  for (const p of [lessonsPath, exercisesPath]) {
    if (!fs.existsSync(p)) {
      allErrors.push(`Missing file: ${p}`);
      return { valid: false, errors: allErrors, data: null };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let lessonsData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let exercisesData: any;
  try {
    lessonsData = loadJson(lessonsPath);
  } catch (e: unknown) {
    allErrors.push(`Failed to parse ${lessonsPath}: ${e instanceof Error ? e.message : String(e)}`);
    return { valid: false, errors: allErrors, data: null };
  }
  try {
    exercisesData = loadJson(exercisesPath);
  } catch (e: unknown) {
    allErrors.push(`Failed to parse ${exercisesPath}: ${e instanceof Error ? e.message : String(e)}`);
    return { valid: false, errors: allErrors, data: null };
  }

  if (lessonsData.unit !== unitNum) allErrors.push(`Unit ${unitNum} lessons: "unit" mismatch`);
  if (!lessonsData.title || typeof lessonsData.title !== "string") allErrors.push(`Unit ${unitNum} lessons: missing "title"`);
  if (!Array.isArray(lessonsData.lessons) || !lessonsData.lessons.length) {
    allErrors.push(`Unit ${unitNum} lessons: "lessons" must be non-empty`);
  } else {
    for (const l of lessonsData.lessons) {
      if (!l.id) allErrors.push(`  - Lesson missing "id" in unit ${unitNum}`);
      if (!l.title) allErrors.push(`  - Lesson "${l.id}" missing "title"`);
      if (!l.content) allErrors.push(`  - Lesson "${l.id}" missing "content"`);
    }
  }

  if (exercisesData.unit !== unitNum) allErrors.push(`Unit ${unitNum} exercises: "unit" mismatch`);
  if (!Array.isArray(exercisesData.exercises) || !exercisesData.exercises.length) {
    allErrors.push(`Unit ${unitNum} exercises: "exercises" must be non-empty`);
  } else {
    let totalQ = 0;
    for (const ex of exercisesData.exercises) {
      if (!ex.id) { allErrors.push(`  - Exercise missing "id" in unit ${unitNum}`); continue; }
      if (!Array.isArray(ex.questions) || !ex.questions.length) {
        allErrors.push(`  - Exercise "${ex.id}" has no questions`);
        continue;
      }
      for (const q of ex.questions) {
        totalQ++;
        allErrors.push(...validateQuestion(q, ex.id, unitNum));
      }
    }
    if (!allErrors.length) {
      console.log(`  Unit ${unitNum}: ${lessonsData.title}`);
      console.log(`    ${lessonsData.lessons.length} lessons, ${exercisesData.exercises.length} exercises, ${totalQ} questions`);
    }
  }

  return { valid: !allErrors.length, errors: allErrors, data: { lessons: lessonsData, exercises: exercisesData } };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // --- Validate DATABASE_URL ---
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("\n  ERROR: DATABASE_URL is not set.");
    console.error("  Create a .env file with your Neon connection string:");
    console.error('  DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require\n');
    process.exit(1);
  }

  // --- Connect using Neon HTTP driver (same as app runtime) ---
  const neonSql = neon(url);
  const db = drizzle(neonSql);

  try {
    console.log("Connecting to database...");
    await execWithRetry(db, () => db.execute(sql`SELECT 1`));
    console.log("  Connected.\n");

    // ---- Step 1: Create tables (idempotent) --------------------------------
    console.log("Step 1: Creating tables...");

    await execWithRetry(db, () => db.execute(sql`
      CREATE TABLE IF NOT EXISTS units (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        unit_number INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        lesson_count INTEGER NOT NULL DEFAULT 0,
        exercise_count INTEGER NOT NULL DEFAULT 0,
        question_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `));
    await execWithRetry(db, () => db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS units_unit_number_idx ON units (unit_number)`));

    await execWithRetry(db, () => db.execute(sql`
      CREATE TABLE IF NOT EXISTS lessons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
        slug VARCHAR(128) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        data JSONB,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `));
    await execWithRetry(db, () => db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS lessons_slug_idx ON lessons (unit_id, slug)`));
    await execWithRetry(db, () => db.execute(sql`CREATE INDEX IF NOT EXISTS lessons_unit_id_idx ON lessons (unit_id)`));

    await execWithRetry(db, () => db.execute(sql`
      CREATE TABLE IF NOT EXISTS exercises (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
        slug VARCHAR(128) NOT NULL,
        type VARCHAR(64) NOT NULL,
        instructions TEXT NOT NULL,
        questions JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `));
    await execWithRetry(db, () => db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS exercises_slug_idx ON exercises (unit_id, slug)`));
    await execWithRetry(db, () => db.execute(sql`CREATE INDEX IF NOT EXISTS exercises_unit_id_idx ON exercises (unit_id)`));

    await execWithRetry(db, () => db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        anonymous_id VARCHAR(64) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `));
    await execWithRetry(db, () => db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS users_anonymous_id_idx ON users (anonymous_id)`));

    await execWithRetry(db, () => db.execute(sql`
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
    `));
    await execWithRetry(db, () => db.execute(sql`CREATE INDEX IF NOT EXISTS exercise_attempts_user_id_idx ON exercise_attempts (user_id)`));
    await execWithRetry(db, () => db.execute(sql`CREATE INDEX IF NOT EXISTS exercise_attempts_exercise_id_idx ON exercise_attempts (exercise_id)`));
    await execWithRetry(db, () => db.execute(sql`CREATE INDEX IF NOT EXISTS exercise_attempts_created_at_idx ON exercise_attempts (created_at)`));

    await execWithRetry(db, () => db.execute(sql`
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
    `));
    await execWithRetry(db, () => db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS lesson_progress_user_unit_idx ON lesson_progress (user_id, unit)`));

    console.log("  Tables created/verified.\n");

    // ---- Step 2: Validate JSON data files -----------------------------------
    console.log("Step 2: Validating JSON data files...\n");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unitResults: Record<number, any> = {};
    let hasErrors = false;

    for (const unitNum of UNITS) {
      const result = validateUnit(unitNum);
      unitResults[unitNum] = result;
      if (!result.valid) {
        hasErrors = true;
        console.error(`\n  ERRORS for Unit ${unitNum}:`);
        for (const err of result.errors) console.error(err);
      }
    }

    if (hasErrors) {
      console.error("\nSeed aborted due to validation errors.");
      process.exit(1);
    }
    console.log("  All validations passed.\n");

    // ---- Step 3: Seed unit metadata (upsert) --------------------------------
    console.log("Step 3: Seeding unit metadata...\n");

    for (const unitNum of UNITS) {
      const { lessons, exercises } = unitResults[unitNum].data;
      const qCount = exercises.exercises.reduce(
        (sum: number, ex: { questions: unknown[] }) => sum + ex.questions.length,
        0,
      );

      // Check if unit already exists
      const existing = await execWithRetry(db, () =>
        db.execute(sql`SELECT id FROM units WHERE unit_number = ${unitNum}`)
      );
      const rows = existing.rows ?? existing;

      if (rows.length) {
        // Update existing record
        await execWithRetry(db, () =>
          db.execute(sql`UPDATE units SET title = ${lessons.title}, lesson_count = ${lessons.lessons.length}, exercise_count = ${exercises.exercises.length}, question_count = ${qCount} WHERE unit_number = ${unitNum}`)
        );
        console.log(`  Unit ${unitNum}: updated`);
      } else {
        // Insert new record
        await execWithRetry(db, () =>
          db.execute(sql`INSERT INTO units (unit_number, title, lesson_count, exercise_count, question_count) VALUES (${unitNum}, ${lessons.title}, ${lessons.lessons.length}, ${exercises.exercises.length}, ${qCount})`)
        );
        console.log(`  Unit ${unitNum}: inserted`);
      }
    }

    console.log("\nSeed complete.");
    console.log("  Tables: created/verified (idempotent)");
    console.log("  Units 1–5: validated and seeded");
    console.log("  User data: preserved (never deleted)");
  } finally {
    // No persistent connection to close — Neon HTTP is stateless.
  }
}

main().catch((err) => {
  console.error("\nSeed failed:", err.message || err);
  process.exit(1);
});
