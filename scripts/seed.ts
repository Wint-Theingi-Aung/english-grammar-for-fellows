/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Seed script for the database.
 * Creates tables and seeds unit data idempotently (safe to run multiple times).
 * Run: npm run db:seed
 *
 * Requires DATABASE_URL in .env
 *
 * What this script does:
 * 1. Creates all database tables (idempotent)
 * 2. Reads and validates JSON data files for Units 1–5
 * 3. Validates exactly 3 options and exactly 1 correct answer per question
 * 4. Inserts unit metadata into the `units` table (upsert, never duplicates)
 * 5. Never deletes existing user progress or exercise attempts
 */

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Load .env file (Next.js does this automatically, but tsx does not)
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;
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
}
loadEnv();

const UNITS = [1, 2, 3, 4, 5];
const DATA_DIR = path.join(__dirname, "..", "data");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadJson(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateQuestion(q: any, exerciseId: string, unitNum: number): string[] {
  const errors: string[] = [];

  if (!q.id && q.id !== 0) {
    errors.push(`  - Question in "${exerciseId}" is missing "id"`);
  }
  if (!q.question || typeof q.question !== "string" || q.question.trim() === "") {
    errors.push(`  - Question ${q.id} in "${exerciseId}" is missing "question"`);
  }
  if (!Array.isArray(q.options)) {
    errors.push(`  - Question ${q.id} in "${exerciseId}" is missing "options" array`);
  } else if (q.options.length !== 3) {
    errors.push(`  - Question ${q.id} in "${exerciseId}" has ${q.options.length} options (expected exactly 3)`);
  } else {
    // Check each option is a non-empty string
    for (let i = 0; i < q.options.length; i++) {
      if (typeof q.options[i] !== "string" || q.options[i].trim() === "") {
        errors.push(`  - Question ${q.id} in "${exerciseId}" has empty or invalid option at index ${i}`);
      }
    }
    // Check for duplicate options
    const unique = new Set(q.options.map((o: string) => o.trim().toLowerCase()));
    if (unique.size !== q.options.length) {
      errors.push(`  - Question ${q.id} in "${exerciseId}" has duplicate options`);
    }
  }
  if (!q.answer || typeof q.answer !== "string" || q.answer.trim() === "") {
    errors.push(`  - Question ${q.id} in "${exerciseId}" is missing "answer"`);
  } else if (Array.isArray(q.options) && q.options.length === 3) {
    // Verify the correct answer matches one of the options exactly
    const answerMatches = q.options.some((opt: string) => opt === q.answer);
    if (!answerMatches) {
      errors.push(
        `  - Question ${q.id} in "${exerciseId}": answer "${q.answer}" does not match any option [${q.options.join(", ")}]`
      );
    }
  }
  if (!q.explanation || typeof q.explanation !== "string" || q.explanation.trim() === "") {
    errors.push(`  - Question ${q.id} in "${exerciseId}" is missing "explanation"`);
  }
  if (typeof q.points !== "number" || q.points <= 0) {
    errors.push(`  - Question ${q.id} in "${exerciseId}" has invalid "points" (must be a positive number)`);
  }

  return errors;
}

function validateUnit(unitNum: number) {
  const lessonsPath = path.join(DATA_DIR, `unit-${unitNum}-lessons.json`);
  const exercisesPath = path.join(DATA_DIR, `unit-${unitNum}-exercises.json`);
  const allErrors: string[] = [];

  // Check files exist
  if (!fs.existsSync(lessonsPath)) {
    allErrors.push(`Missing file: ${lessonsPath}`);
    return { valid: false, errors: allErrors, data: null };
  }
  if (!fs.existsSync(exercisesPath)) {
    allErrors.push(`Missing file: ${exercisesPath}`);
    return { valid: false, errors: allErrors, data: null };
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

  // Validate lessons structure
  if (!lessonsData.unit || lessonsData.unit !== unitNum) {
    allErrors.push(`Lessons file unit-${unitNum}: "unit" field mismatch (expected ${unitNum}, got ${lessonsData.unit})`);
  }
  if (!lessonsData.title || typeof lessonsData.title !== "string") {
    allErrors.push(`Lessons file unit-${unitNum}: missing or invalid "title"`);
  }
  if (!Array.isArray(lessonsData.lessons) || lessonsData.lessons.length === 0) {
    allErrors.push(`Lessons file unit-${unitNum}: "lessons" must be a non-empty array`);
  } else {
    for (const lesson of lessonsData.lessons) {
      if (!lesson.id || typeof lesson.id !== "string") {
        allErrors.push(`  - Lesson is missing "id" in unit ${unitNum}`);
      }
      if (!lesson.title || typeof lesson.title !== "string") {
        allErrors.push(`  - Lesson "${lesson.id}" is missing "title" in unit ${unitNum}`);
      }
      if (!lesson.content || typeof lesson.content !== "string") {
        allErrors.push(`  - Lesson "${lesson.id}" is missing "content" in unit ${unitNum}`);
      }
    }
  }

  // Validate exercises structure
  if (!exercisesData.unit || exercisesData.unit !== unitNum) {
    allErrors.push(`Exercises file unit-${unitNum}: "unit" field mismatch (expected ${unitNum}, got ${exercisesData.unit})`);
  }
  if (!Array.isArray(exercisesData.exercises) || exercisesData.exercises.length === 0) {
    allErrors.push(`Exercises file unit-${unitNum}: "exercises" must be a non-empty array`);
  } else {
    let totalQuestions = 0;
    for (const exercise of exercisesData.exercises) {
      if (!exercise.id || typeof exercise.id !== "string") {
        allErrors.push(`  - Exercise is missing "id" in unit ${unitNum}`);
        continue;
      }
      if (!Array.isArray(exercise.questions) || exercise.questions.length === 0) {
        allErrors.push(`  - Exercise "${exercise.id}" has no questions in unit ${unitNum}`);
        continue;
      }
      for (const q of exercise.questions) {
        totalQuestions++;
        const qErrors = validateQuestion(q, exercise.id, unitNum);
        allErrors.push(...qErrors);
      }
    }
    if (allErrors.length === 0) {
      console.log(`  Unit ${unitNum}: ${lessonsData.title}`);
      console.log(`    Lessons: ${lessonsData.lessons.length}, Exercises: ${exercisesData.exercises.length}, Questions: ${totalQuestions}`);
    }
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    data: { lessons: lessonsData, exercises: exercisesData },
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function queryWithRetry(pool: any, text: string, params?: unknown[], retries = 3): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await pool.query(text, params);
    } catch (err: unknown) {
      const isLast = attempt === retries;
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
      const msg = err instanceof Error ? err.message : String(err);
      if (isLast) throw err;
      console.log(`    Retry ${attempt}/${retries} after ${delay}ms (${msg})`);
      await sleep(delay);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("ERROR: DATABASE_URL is not set. Add it to .env");
    process.exit(1);
  }

  // Use pg Pool (standard Node.js PostgreSQL driver — same protocol that works for drizzle-kit push)
  const pool = new Pool({ connectionString: url, max: 1, ssl: { rejectUnauthorized: false } });

  try {
    // Quick connectivity check
    await pool.query("SELECT 1");
    console.log("  Database connected.\n");

    // ---- Step 1: Create tables (idempotent) --------------------------------
    console.log("Step 1: Creating tables...");

    await queryWithRetry(pool, `
      CREATE TABLE IF NOT EXISTS units (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        unit_number INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        lesson_count INTEGER NOT NULL DEFAULT 0,
        exercise_count INTEGER NOT NULL DEFAULT 0,
        question_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await queryWithRetry(pool, `CREATE UNIQUE INDEX IF NOT EXISTS units_unit_number_idx ON units (unit_number)`);

    await queryWithRetry(pool, `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        anonymous_id VARCHAR(64) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await queryWithRetry(pool, `CREATE UNIQUE INDEX IF NOT EXISTS users_anonymous_id_idx ON users (anonymous_id)`);

    await queryWithRetry(pool, `
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
    `);
    await queryWithRetry(pool, `CREATE INDEX IF NOT EXISTS exercise_attempts_user_id_idx ON exercise_attempts (user_id)`);
    await queryWithRetry(pool, `CREATE INDEX IF NOT EXISTS exercise_attempts_exercise_id_idx ON exercise_attempts (exercise_id)`);
    await queryWithRetry(pool, `CREATE INDEX IF NOT EXISTS exercise_attempts_created_at_idx ON exercise_attempts (created_at)`);

    await queryWithRetry(pool, `
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
    `);
    await queryWithRetry(pool, `CREATE UNIQUE INDEX IF NOT EXISTS lesson_progress_user_unit_idx ON lesson_progress (user_id, unit)`);

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
        for (const err of result.errors) {
          console.error(err);
        }
      }
    }

    if (hasErrors) {
      console.error("\nSeed aborted due to validation errors.");
      process.exit(1);
    }

    console.log("  All validations passed.\n");

    // ---- Step 3: Seed unit metadata into database (upsert) ------------------
    console.log("Step 3: Seeding unit metadata into database...\n");

    for (const unitNum of UNITS) {
      const { lessons, exercises } = unitResults[unitNum].data;
      const questionCount = exercises.exercises.reduce((sum: number, ex: { questions: unknown[] }) => sum + ex.questions.length, 0);

      // Check if unit already exists
      const existingResult = await queryWithRetry(pool, `SELECT id FROM units WHERE unit_number = $1`, [unitNum]);
      const existing = existingResult.rows;

      if (existing.length > 0) {
        // Update existing record
        await queryWithRetry(
          pool,
          `UPDATE units SET title = $1, lesson_count = $2, exercise_count = $3, question_count = $4 WHERE unit_number = $5`,
          [lessons.title, lessons.lessons.length, exercises.exercises.length, questionCount, unitNum]
        );
        console.log(`  Unit ${unitNum}: updated (already existed)`);
      } else {
        // Insert new record
        await queryWithRetry(
          pool,
          `INSERT INTO units (unit_number, title, lesson_count, exercise_count, question_count) VALUES ($1, $2, $3, $4, $5)`,
          [unitNum, lessons.title, lessons.lessons.length, exercises.exercises.length, questionCount]
        );
        console.log(`  Unit ${unitNum}: inserted (new)`);
      }
    }

    // ---- Summary ------------------------------------------------------------
    console.log("\nSeed complete.");
    console.log("  - Tables: created/verified (idempotent)");
    console.log(`  - Units: ${UNITS.length} validated and seeded`);
    console.log("  - User progress and exercise attempts: preserved (never deleted)");
  } finally {
    // Always close the pool cleanly
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
