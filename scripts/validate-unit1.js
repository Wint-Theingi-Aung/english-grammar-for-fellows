#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Validation script for Unit 1 exercises.
 * Run: node scripts/validate-unit1.js
 */

const fs = require("fs");
const path = require("path");

const EXERCISES_PATH = path.join(__dirname, "..", "data", "unit-1-exercises.json");

function validate() {
  let errors = 0;
  let warnings = 0;

  // Read file
  if (!fs.existsSync(EXERCISES_PATH)) {
    console.error("ERROR: File not found:", EXERCISES_PATH);
    process.exit(1);
  }

  let data;
  try {
    const raw = fs.readFileSync(EXERCISES_PATH, "utf-8");
    data = JSON.parse(raw);
  } catch (e) {
    console.error("ERROR: Failed to parse JSON:", e.message);
    process.exit(1);
  }

  if (!data.exercises || !Array.isArray(data.exercises)) {
    console.error("ERROR: Missing or invalid 'exercises' array");
    process.exit(1);
  }

  let totalQuestions = 0;

  for (const exercise of data.exercises) {
    if (!exercise.id) {
      console.error("ERROR: Exercise missing 'id'");
      errors++;
      continue;
    }

    if (!exercise.questions || !Array.isArray(exercise.questions)) {
      console.error("ERROR: Exercise '" + exercise.id + "' missing 'questions' array");
      errors++;
      continue;
    }

    for (const q of exercise.questions) {
      totalQuestions++;

      // Check id
      if (!q.id && q.id !== 0) {
        console.error("ERROR: Question in '" + exercise.id + "' missing 'id'");
        errors++;
        continue;
      }

      const qId = exercise.id + "#" + q.id;

      // Check options is an array
      if (!Array.isArray(q.options)) {
        console.error("ERROR: " + qId + " - options is not an array");
        errors++;
        continue;
      }

      // Check exactly 3 options
      if (q.options.length !== 3) {
        console.error("ERROR: " + qId + " - has " + q.options.length + " options (expected 3)");
        errors++;
      }

      // Check every option is a non-empty string
      for (let i = 0; i < q.options.length; i++) {
        if (typeof q.options[i] !== "string") {
          console.error("ERROR: " + qId + " - option " + i + " is not a string");
          errors++;
        } else if (q.options[i].trim() === "") {
          console.error("ERROR: " + qId + " - option " + i + " is empty");
          errors++;
        }

        // Check for malformed joined fragments (e.g., "r.inr.inedw.ll rain")
        if (typeof q.options[i] === "string") {
          if (q.options[i].match(/([a-z])\.\1\./i)) {
            console.error("ERROR: " + qId + " - option " + i + " has malformed joined text: \"" + q.options[i] + "\"");
            errors++;
          }
          // Check for escaped characters
          if (q.options[i].includes("\\n") || q.options[i].includes("\\t")) {
            console.error("ERROR: " + qId + " - option " + i + " contains escaped characters");
            errors++;
          }
        }
      }

      // Check correctAnswer is included in options
      if (!q.options.includes(q.answer)) {
        console.error("ERROR: " + qId + " - answer \"" + q.answer + "\" not found in options [" + q.options.join(", ") + "]");
        errors++;
      }

      // Check no duplicate options
      const unique = new Set(q.options);
      if (unique.size !== q.options.length) {
        console.error("ERROR: " + qId + " - has duplicate options [" + q.options.join(", ") + "]");
        errors++;
      }

      // Check explanation exists
      if (!q.explanation || q.explanation.trim() === "") {
        console.warn("WARNING: " + qId + " - has no explanation");
        warnings++;
      }
    }
  }

  console.log("\n=== Unit 1 Exercise Validation ===\n");
  console.log("Total exercises: " + data.exercises.length);
  console.log("Total questions: " + totalQuestions);
  console.log("Errors: " + errors);
  console.log("Warnings: " + warnings);

  if (errors > 0) {
    console.error("\nValidation FAILED with " + errors + " error(s).\n");
    process.exit(1);
  } else {
    console.log("\nAll validations PASSED.\n");
    process.exit(0);
  }
}

validate();
