/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Offline SQL export for seeding Unit 50 (Placement Test).
 * Run: npx tsx scripts/export-seed-sql-unit50.ts
 * Output: scripts/unit-50-seed.sql
 */

(() => {
  const fs = require("fs");
  const path = require("path");

  const UNIT = 50;
  const DATA_DIR = path.join(__dirname, "..", "data");
  const OUTPUT_PATH = path.join(__dirname, "unit-50-seed.sql");

  function loadJson(filePath: string) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

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

  function unitUuid(unitNum: number): string {
    return `${String(unitNum).padStart(8, "0")}-0000-4000-8000-000000000001`;
  }

  function lessonUuid(unitNum: number, lessonIdx: number): string {
    const hex = String(unitNum * 1000 + lessonIdx).padStart(8, "0");
    return `${hex}-0000-4000-8000-000000000002`;
  }

  function exerciseUuid(unitNum: number, exerciseIdx: number): string {
    const hex = String(unitNum * 1000 + exerciseIdx).padStart(8, "0");
    return `${hex}-0000-4000-8000-000000000003`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function validateQuestion(q: any, exerciseId: string): string[] {
    const errors: string[] = [];
    const tag = `Q${q.id} in "${exerciseId}"`;
    if (!q.id && q.id !== 0) errors.push(`  - ${tag}: missing "id"`);
    if (!q.question || typeof q.question !== "string" || !q.question.trim())
      errors.push(`  - ${tag}: missing "question"`);
    if (!Array.isArray(q.options)) {
      errors.push(`  - ${tag}: missing "options" array`);
    } else if (q.options.length !== 4) {
      errors.push(`  - ${tag}: has ${q.options.length} options (expected exactly 4)`);
    }
    if (!q.answer || typeof q.answer !== "string" || !q.answer.trim()) {
      errors.push(`  - ${tag}: missing "answer"`);
    } else if (Array.isArray(q.options) && q.options.length === 4) {
      if (!q.options.some((opt: string) => opt === q.answer))
        errors.push(`  - ${tag}: answer "${q.answer}" does not match any option`);
    }
    if (typeof q.points !== "number" || q.points <= 0)
      errors.push(`  - ${tag}: invalid "points"`);
    return errors;
  }

  function main() {
    console.log(`Validating JSON data files for Unit ${UNIT}...\n`);

    const lessonsPath = path.join(DATA_DIR, `unit-${UNIT}-lessons.json`);
    const exercisesPath = path.join(DATA_DIR, `unit-${UNIT}-exercises.json`);
    const allErrors: string[] = [];

    for (const p of [lessonsPath, exercisesPath]) {
      if (!fs.existsSync(p)) {
        allErrors.push(`Missing file: ${p}`);
        console.error(allErrors.join("\n"));
        process.exit(1);
      }
    }

    let lessonsData: { unit: number; title: string; lessons: Array<{ id: string; title: string; content: string; [key: string]: unknown }> };
    let exercisesData: { unit: number; exercises: Array<{ id: string; type: string; instructions: string; questions: Array<{ id: number; question: string; options: string[]; answer: string; explanation: string; points: number }> }> };

    try {
      lessonsData = loadJson(lessonsPath);
    } catch (e: unknown) {
      allErrors.push(`Failed to parse ${lessonsPath}: ${e instanceof Error ? e.message : String(e)}`);
      console.error(allErrors.join("\n"));
      process.exit(1);
    }
    try {
      exercisesData = loadJson(exercisesPath);
    } catch (e: unknown) {
      allErrors.push(`Failed to parse ${exercisesPath}: ${e instanceof Error ? e.message : String(e)}`);
      console.error(allErrors.join("\n"));
      process.exit(1);
    }

    if (lessonsData.unit !== UNIT) allErrors.push(`Unit ${UNIT} lessons: "unit" mismatch`);
    if (!lessonsData.title || typeof lessonsData.title !== "string") allErrors.push(`Unit ${UNIT} lessons: missing "title"`);
    if (!Array.isArray(lessonsData.lessons) || !lessonsData.lessons.length) {
      allErrors.push(`Unit ${UNIT} lessons: "lessons" must be non-empty`);
    } else {
      for (const l of lessonsData.lessons) {
        if (!l.id) allErrors.push(`  - Lesson missing "id"`);
        if (!l.title) allErrors.push(`  - Lesson "${l.id}" missing "title"`);
        if (!l.content) allErrors.push(`  - Lesson "${l.id}" missing "content"`);
      }
    }

    if (exercisesData.unit !== UNIT) allErrors.push(`Unit ${UNIT} exercises: "unit" mismatch`);
    if (!Array.isArray(exercisesData.exercises) || !exercisesData.exercises.length) {
      allErrors.push(`Unit ${UNIT} exercises: "exercises" must be non-empty`);
    } else {
      let totalQ = 0;
      for (const ex of exercisesData.exercises) {
        if (!ex.id) { allErrors.push(`  - Exercise missing "id"`); continue; }
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
        console.log(`  Unit ${UNIT}: ${lessonsData.title}`);
        console.log(`    ${lessonsData.lessons.length} lessons, ${exercisesData.exercises.length} exercises, ${totalQ} questions`);
      }
    }

    if (allErrors.length) {
      console.error("\n  ERRORS:");
      allErrors.forEach((e) => console.error(e));
      console.error("\nExport aborted due to validation errors.");
      process.exit(1);
    }

    console.log("  All validations passed.\n");
    console.log("Generating SQL...");

    const lines: string[] = [];
    const qCount = exercisesData.exercises.reduce(
      (sum: number, ex: { questions: unknown[] }) => sum + ex.questions.length, 0,
    );

    lines.push("-- ==========================================================================");
    lines.push(`-- English Grammar for Fellows — Unit ${UNIT} Seed Data (Placement Test)`);
    lines.push("-- Generated offline by scripts/export-seed-sql-unit50.ts");
    lines.push("-- Safe to run multiple times (idempotent via ON CONFLICT DO UPDATE).");
    lines.push("-- ==========================================================================");
    lines.push("");

    const uid = unitUuid(UNIT);
    lines.push(`INSERT INTO units (id, unit_number, title, lesson_count, exercise_count, question_count)`);
    lines.push(`VALUES (${esc(uid)}, ${UNIT}, ${esc(lessonsData.title)}, ${lessonsData.lessons.length}, ${exercisesData.exercises.length}, ${qCount})`);
    lines.push(`ON CONFLICT (unit_number) DO UPDATE SET`);
    lines.push(`  id = EXCLUDED.id,`);
    lines.push(`  title = EXCLUDED.title,`);
    lines.push(`  lesson_count = EXCLUDED.lesson_count,`);
    lines.push(`  exercise_count = EXCLUDED.exercise_count,`);
    lines.push(`  question_count = EXCLUDED.question_count;`);
    lines.push("");

    for (let li = 0; li < lessonsData.lessons.length; li++) {
      const l = lessonsData.lessons[li];
      const lid = lessonUuid(UNIT, li);
      const dataJson = JSON.stringify(
        Object.fromEntries(
          Object.entries(l).filter(([k]) => !["id", "title", "content"].includes(k)),
        ),
      );
      lines.push(
        `INSERT INTO lessons (id, unit_id, slug, title, content, data, sort_order) ` +
        `VALUES (${esc(lid)}, (SELECT id FROM units WHERE unit_number = ${UNIT}), ${esc(l.id)}, ${esc(l.title)}, ${esc(l.content)}, ${esc(dataJson)}::jsonb, ${li + 1}) ` +
        `ON CONFLICT (unit_id, slug) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, data = EXCLUDED.data, sort_order = EXCLUDED.sort_order;`,
      );
    }
    lines.push("");

    for (let ei = 0; ei < exercisesData.exercises.length; ei++) {
      const ex = exercisesData.exercises[ei];
      const eid = exerciseUuid(UNIT, ei);
      const questionsJson = JSON.stringify(ex.questions);
      lines.push(
        `INSERT INTO exercises (id, unit_id, slug, type, instructions, questions) ` +
        `VALUES (${esc(eid)}, (SELECT id FROM units WHERE unit_number = ${UNIT}), ${esc(ex.id)}, ${esc(ex.type)}, ${esc(ex.instructions)}, ${esc(questionsJson)}::jsonb) ` +
        `ON CONFLICT (unit_id, slug) DO UPDATE SET type = EXCLUDED.type, instructions = EXCLUDED.instructions, questions = EXCLUDED.questions;`,
      );
    }
    lines.push("");

    lines.push("-- ==========================================================================");
    lines.push("-- END OF SEED DATA");
    lines.push("-- ==========================================================================");

    const sql = lines.join("\n");
    fs.writeFileSync(OUTPUT_PATH, sql, "utf-8");

    const fileInfo = fs.statSync(OUTPUT_PATH);
    console.log(`  Written to: ${path.relative(process.cwd(), OUTPUT_PATH)}`);
    console.log(`  File size: ${fileInfo.size.toLocaleString()} bytes`);
    console.log(`\nDone. Apply with: psql $DATABASE_URL -f scripts/unit-50-seed.sql`);
  }

  main();
})();
