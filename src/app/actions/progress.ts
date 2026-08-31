"use server";

import { hasDatabase, getDatabase, schema } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function validateAnonymousId(id: string): string | null {
  if (!id || typeof id !== "string") return null;
  const trimmed = id.trim();
  if (trimmed.length < 1 || trimmed.length > 64) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) return null;
  return trimmed;
}

function validateString(value: unknown, maxLen: number): string | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > maxLen) return null;
  return trimmed;
}

function validateNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value;
}

export async function saveExerciseAttempt(data: {
  anonymousId: string;
  exerciseId: string;
  questionId: number;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  score: number;
  totalPoints: number;
}) {
  const anonId = validateAnonymousId(data.anonymousId);
  const exerciseId = validateString(data.exerciseId, 64);
  const selectedAnswer = validateString(data.selectedAnswer, 500);
  const correctAnswer = validateString(data.correctAnswer, 500);
  const questionId = validateNumber(data.questionId);
  const score = validateNumber(data.score);
  const totalPoints = validateNumber(data.totalPoints);

  if (!anonId || !exerciseId || !selectedAnswer || !correctAnswer || questionId === null || score === null || totalPoints === null) {
    return { success: false, error: "Invalid input data" };
  }

  if (!hasDatabase()) {
    return { success: true, fallback: true };
  }

  try {
    const db = getDatabase();

    let user = await db.query.users.findFirst({
      where: eq(schema.users.anonymousId, anonId),
    });

    if (!user) {
      const [inserted] = await db
        .insert(schema.users)
        .values({ anonymousId: anonId })
        .returning();
      user = inserted;
    }

    await db.insert(schema.exerciseAttempts).values({
      userId: user.id,
      exerciseId,
      questionId,
      selectedAnswer,
      correctAnswer,
      isCorrect: data.isCorrect,
      score,
      totalPoints,
    });

    return { success: true };
  } catch (err) {
    console.error("Failed to save exercise attempt:", err);
    return { success: false, error: "Database error" };
  }
}

export async function saveLessonProgress(data: {
  anonymousId: string;
  unit: number;
  completedExercises: number;
  totalScore: number;
  bestScore: number;
}) {
  const anonId = validateAnonymousId(data.anonymousId);
  const unit = validateNumber(data.unit);
  const completedExercises = validateNumber(data.completedExercises);
  const totalScore = validateNumber(data.totalScore);
  const bestScore = validateNumber(data.bestScore);

  if (!anonId || unit === null || completedExercises === null || totalScore === null || bestScore === null) {
    return { success: false, error: "Invalid input data" };
  }

  if (!hasDatabase()) {
    return { success: true, fallback: true };
  }

  try {
    const db = getDatabase();

    let user = await db.query.users.findFirst({
      where: eq(schema.users.anonymousId, anonId),
    });

    if (!user) {
      const [inserted] = await db
        .insert(schema.users)
        .values({ anonymousId: anonId })
        .returning();
      user = inserted;
    }

    const existing = await db.query.lessonProgress.findFirst({
      where: and(
        eq(schema.lessonProgress.userId, user.id),
        eq(schema.lessonProgress.unit, unit)
      ),
    });

    if (existing) {
      await db
        .update(schema.lessonProgress)
        .set({
          completedExercises,
          totalScore,
          bestScore,
          lastAttemptedAt: new Date(),
        })
        .where(eq(schema.lessonProgress.id, existing.id));
    } else {
      await db.insert(schema.lessonProgress).values({
        userId: user.id,
        unit,
        completedExercises,
        totalScore,
        bestScore,
      });
    }

    revalidatePath("/");
    revalidatePath("/unit-1");

    return { success: true };
  } catch (err) {
    console.error("Failed to save lesson progress:", err);
    return { success: false, error: "Database error" };
  }
}

export async function getLeaderboard(unit: number) {
  if (!hasDatabase()) return [];

  try {
    const db = getDatabase();

    const results = await db.query.lessonProgress.findMany({
      where: eq(schema.lessonProgress.unit, unit),
      orderBy: [desc(schema.lessonProgress.bestScore)],
      limit: 10,
    });

    return results.map((r) => ({
      anonymousId: "anonymous",
      bestScore: r.bestScore,
      completedExercises: r.completedExercises,
      lastAttemptedAt: r.lastAttemptedAt.toISOString(),
    }));
  } catch (err) {
    console.error("Failed to fetch leaderboard:", err);
    return [];
  }
}
