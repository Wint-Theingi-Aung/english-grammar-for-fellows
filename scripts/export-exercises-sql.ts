/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Offline SQL export for seeding exercises only (Units 1–5).
 * Generates a standalone SQL file that can be applied to any PostgreSQL database
 * without connecting during generation.
 *
 * Run: npx tsx scripts/export-exercises-sql.ts
 * Output: scripts/exercises-unit-1-to-5.sql
 */

// Wrap in IIFE to avoid top-level variable conflicts with sibling scripts.
(() => {
  const fs = require("fs");
  const path = require("path");

  const UNITS = [1, 2, 3, 4, 5];
  const DATA_DIR = path.join(__dirname, "..", "data");
  const OUTPUT_PATH = path.join(__dirname, "exercises-unit-1-to-5.sql");

  function loadJson(filePath: string) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  /**
   * Escape a string for a PostgreSQL SQL literal ('...').
   * Handles backslash, single quotes, newlines, carriage returns, tabs, null bytes.
   */
  function esc(val: unknown): string {
    if (val === null || val === undefined) return "NULL";
    const s = String(val);
    return (
      "'" +
      s
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "''")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/\0/g, "") +
      "'"
    );
  }

  /** Deterministic UUID for an exercise: 000000UN-0000-4000-8000-00000000ENNN */
  function exerciseUuid(unitNum: number, exerciseIdx: number): string {
    const hex = String(unitNum * 1000 + exerciseIdx).padStart(8, "0");
    return `${hex}-0000-4000-8000-000000000003`;
  }

  // -----------------------------------------------------------------------
  // Validation
  // -----------------------------------------------------------------------

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function validateQuestion(q: any, exerciseId: string): string[] {
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
      if (!q.options.some((opt: string) => opt === q.answer))
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
    const exercisesPath = path.join(DATA_DIR, `unit-${unitNum}-exercises.json`);
    const allErrors: string[] = [];

    if (!fs.existsSync(exercisesPath)) {
      allErrors.push(`Missing file: ${exercisesPath}`);
      return { valid: false, errors: allErrors, data: null };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let exercisesData: any;
    try {
      exercisesData = loadJson(exercisesPath);
    } catch (e: unknown) {
      allErrors.push(`Failed to parse ${exercisesPath}: ${e instanceof Error ? e.message : String(e)}`);
      return { valid: false, errors: allErrors, data: null };
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
          allErrors.push(...validateQuestion(q, ex.id));
        }
      }
      if (!allErrors.length) {
        console.log(`  Unit ${unitNum}: ${exercisesData.exercises.length} exercises, ${totalQ} questions`);
      }
    }

    return { valid: !allErrors.length, errors: allErrors, data: exercisesData };
  }

  // -----------------------------------------------------------------------
  // SQL generation
  // -----------------------------------------------------------------------

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function generateSql(unitResults: Record<number, any>): { sql: string; stats: { exerciseInserts: number; questionCounts: number[] } } {
    const lines: string[] = [];
    let exerciseInserts = 0;
    const questionCounts: number[] = [];

    lines.push("-- ==========================================================================");
    lines.push("-- English Grammar for Fellows — Exercises Only (Units 1–5)");
    lines.push("-- Generated offline by scripts/export-exercises-sql.ts");
    lines.push("-- Safe to run multiple times (idempotent via ON CONFLICT DO UPDATE).");
    lines.push("-- Assumes `units` table already contains rows for units 1–5.");
    lines.push("-- Does NOT delete users, exercise_attempts, or lesson_progress.");
    lines.push("-- No transaction wrapper — run individual statements for easier debugging.");
    lines.push("-- ==========================================================================");
    lines.push("");

    for (const unitNum of UNITS) {
      const exercisesData = unitResults[unitNum].data;

      lines.push(`-- --------------------------------------------------------------------------`);
      lines.push(`-- Unit ${unitNum} Exercises`);
      lines.push(`-- --------------------------------------------------------------------------`);
      lines.push("");

      let unitQCount = 0;

      exerciseInserts += exercisesData.exercises.length;
      for (let ei = 0; ei < exercisesData.exercises.length; ei++) {
        const ex = exercisesData.exercises[ei];
        const eid = exerciseUuid(unitNum, ei);
        unitQCount += ex.questions.length;
        const questionsJson = JSON.stringify(ex.questions);
        lines.push(
          `INSERT INTO exercises (id, unit_id, slug, type, instructions, questions) ` +
          `VALUES (${esc(eid)}, (SELECT id FROM units WHERE unit_number = ${unitNum}), ${esc(ex.id)}, ${esc(ex.type)}, ${esc(ex.instructions)}, ${esc(questionsJson)}::jsonb) ` +
          `ON CONFLICT (unit_id, slug) DO UPDATE SET type = EXCLUDED.type, instructions = EXCLUDED.instructions, questions = EXCLUDED.questions;`,
        );
      }

      questionCounts.push(unitQCount);
      lines.push("");
    }

    lines.push("-- ==========================================================================");
    lines.push("-- END OF EXERCISES");
    lines.push("-- ==========================================================================");
    lines.push("");

    return { sql: lines.join("\n"), stats: { exerciseInserts, questionCounts } };
  }

  // -----------------------------------------------------------------------
  // Main
  // -----------------------------------------------------------------------

  function main() {
    console.log("Validating exercise JSON files for Units 1–5...\n");

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
      console.error("\nExport aborted due to validation errors.");
      process.exit(1);
    }

    console.log("  All validations passed.\n");

    console.log("Generating SQL...");
    const { sql, stats } = generateSql(unitResults);
    fs.writeFileSync(OUTPUT_PATH, sql, "utf-8");

    const fileInfo = fs.statSync(OUTPUT_PATH);
    console.log(`  Written to: ${path.relative(process.cwd(), OUTPUT_PATH)}`);
    console.log(`  File size: ${fileInfo.size.toLocaleString()} bytes`);

    console.log("\n=== Validation Summary ===\n");
    console.log(`  Exercise INSERT statements per unit:`);
    let totalQ = 0;
    for (let i = 0; i < UNITS.length; i++) {
      console.log(`    Unit ${UNITS[i]}: 3 exercises (${stats.questionCounts[i]} questions)`);
      totalQ += stats.questionCounts[i];
    }
    console.log(`\n  Total exercise INSERT statements: ${stats.exerciseInserts}`);
    console.log(`  Total questions validated: ${totalQ}`);
    console.log(`    (each question: exactly 3 options, exactly 1 correct answer)\n`);

    console.log("Done. Apply with: psql $DATABASE_URL -f scripts/exercises-unit-1-to-5.sql");
  }

  main();
})();
