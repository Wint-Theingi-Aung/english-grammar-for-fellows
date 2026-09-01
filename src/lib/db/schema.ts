import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

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

export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ExerciseAttempt = typeof exerciseAttempts.$inferSelect;
export type NewExerciseAttempt = typeof exerciseAttempts.$inferInsert;
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type NewLessonProgress = typeof lessonProgress.$inferInsert;
