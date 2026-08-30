import type { UnitProgress, UserAnswer } from "./types";

const STORAGE_KEY = "grammar-fellows-progress";

export function getProgress(unit: number): UnitProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const all: Record<number, UnitProgress> = JSON.parse(raw);
    return all[unit] ?? null;
  } catch {
    return null;
  }
}

export function saveProgress(progress: UnitProgress): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: Record<number, UnitProgress> = raw ? JSON.parse(raw) : {};
    all[progress.unit] = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // silently ignore
  }
}

export function startUnit(unit: number): UnitProgress {
  const existing = getProgress(unit);
  if (existing && !existing.completedAt) return existing;
  const progress: UnitProgress = {
    unit,
    startedAt: new Date().toISOString(),
    answers: [],
  };
  saveProgress(progress);
  return progress;
}

export function recordAnswer(unit: number, answer: UserAnswer): UnitProgress {
  const progress = getProgress(unit) ?? startUnit(unit);
  const idx = progress.answers.findIndex((a) => a.questionId === answer.questionId);
  if (idx >= 0) {
    progress.answers[idx] = answer;
  } else {
    progress.answers.push(answer);
  }
  saveProgress(progress);
  return progress;
}

export function completeUnit(
  unit: number,
  score: number,
  totalPoints: number
): UnitProgress {
  const progress = getProgress(unit) ?? startUnit(unit);
  progress.completedAt = new Date().toISOString();
  progress.score = score;
  progress.totalPoints = totalPoints;
  saveProgress(progress);
  return progress;
}

export function getAnsweredCount(unit: number): number {
  return getProgress(unit)?.answers.length ?? 0;
}

export function isUnitCompleted(unit: number): boolean {
  return !!getProgress(unit)?.completedAt;
}
