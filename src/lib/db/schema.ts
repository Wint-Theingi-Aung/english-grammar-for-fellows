import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  real,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Legacy — playing_with_neon (preserved as-is, do not modify)
// ---------------------------------------------------------------------------

export const playingWithNeon = pgTable(
  "playing_with_neon",
  {
    id: integer("id").primaryKey().default(sql`nextval('playing_with_neon_id_seq')`),
    name: text("name").notNull(),
    value: real("value"),
  },
);

// ---------------------------------------------------------------------------
// Units — one row per grammar unit (1–5)
// ---------------------------------------------------------------------------

export const units = pgTable(
  "units",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    unitNumber: integer("unit_number").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    lessonCount: integer("lesson_count").notNull().default(0),
    exerciseCount: integer("exercise_count").notNull().default(0),
    questionCount: integer("question_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("units_unit_number_idx").on(t.unitNumber),
  ]
);

// ---------------------------------------------------------------------------
// Lessons — one row per lesson within a unit
// ---------------------------------------------------------------------------

export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    unitId: uuid("unit_id")
      .notNull()
      .references(() => units.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 128 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    /** Flexible content: conjugation tables, details, forms, answer_types, etc. */
    data: jsonb("data"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("lessons_slug_idx").on(t.unitId, t.slug),
    index("lessons_unit_id_idx").on(t.unitId),
  ]
);

// ---------------------------------------------------------------------------
// Exercises — one row per exercise set within a unit
// ---------------------------------------------------------------------------

export const exercises = pgTable(
  "exercises",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    unitId: uuid("unit_id")
      .notNull()
      .references(() => units.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 128 }).notNull(),
    type: varchar("type", { length: 64 }).notNull(),
    instructions: text("instructions").notNull(),
    /** Full question array: [{ id, question, options, answer, explanation, points }] */
    questions: jsonb("questions").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("exercises_slug_idx").on(t.unitId, t.slug),
    index("exercises_unit_id_idx").on(t.unitId),
  ]
);

// ---------------------------------------------------------------------------
// Users — anonymous learner identities
// ---------------------------------------------------------------------------

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    anonymousId: varchar("anonymous_id", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("users_anonymous_id_idx").on(t.anonymousId),
  ]
);

// ---------------------------------------------------------------------------
// Exercise Attempts — per-question response records
// ---------------------------------------------------------------------------

export const exerciseAttempts = pgTable(
  "exercise_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    exerciseId: varchar("exercise_id", { length: 64 }).notNull(),
    questionId: integer("question_id").notNull(),
    selectedAnswer: text("selected_answer").notNull(),
    correctAnswer: text("correct_answer").notNull(),
    isCorrect: boolean("is_correct").notNull(),
    score: integer("score").notNull().default(0),
    totalPoints: integer("total_points").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("exercise_attempts_user_id_idx").on(t.userId),
    index("exercise_attempts_exercise_id_idx").on(t.exerciseId),
    index("exercise_attempts_created_at_idx").on(t.createdAt),
  ]
);

// ---------------------------------------------------------------------------
// Lesson Progress — per-unit score summaries
// ---------------------------------------------------------------------------

export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    unit: integer("unit").notNull(),
    completedExercises: integer("completed_exercises").notNull().default(0),
    totalScore: integer("total_score").notNull().default(0),
    bestScore: integer("best_score").notNull().default(0),
    lastAttemptedAt: timestamp("last_attempted_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("lesson_progress_user_unit_idx").on(t.userId, t.unit),
  ]
);

// ---------------------------------------------------------------------------
// Exported types
// ---------------------------------------------------------------------------

export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ExerciseAttempt = typeof exerciseAttempts.$inferSelect;
export type NewExerciseAttempt = typeof exerciseAttempts.$inferInsert;
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type NewLessonProgress = typeof lessonProgress.$inferInsert;
