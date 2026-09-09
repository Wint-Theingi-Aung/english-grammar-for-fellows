"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";

const noop = () => () => {};

const EMPTY_PROGRESS = Object.freeze({});
const EMPTY_TODAY_STATS = Object.freeze({ todayCount: 0, streak: 0 });

function makeUnitSelector<T>(unit: number, extractor: (data: Record<string, unknown>) => T, fallback: T): () => T {
  return () => {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = localStorage.getItem("grammar-fellows-progress");
      if (!raw) return fallback;
      const all = JSON.parse(raw);
      const unitData = all[String(unit)];
      if (!unitData) return fallback;
      return extractor(unitData as Record<string, unknown>);
    } catch {
      return fallback;
    }
  };
}

export function useAnsweredCount(unit: number = 1): number {
  const selector = makeUnitSelector<number>(unit, (d) => {
    const answers = d.answers as unknown[] | undefined;
    return answers?.length ?? 0;
  }, 0);
  return useSyncExternalStore(noop, selector, () => 0);
}

export function useIsCompleted(unit: number = 1): boolean {
  const selector = makeUnitSelector<boolean>(unit, (d) => !!d.completedAt, false);
  return useSyncExternalStore(noop, selector, () => false);
}

export function useScore(unit: number = 1): { score: number; total: number } | null {
  const scoreSelector = makeUnitSelector<number>(unit, (d) => (d.score as number) ?? 0, 0);
  const totalSelector = makeUnitSelector<number>(unit, (d) => (d.totalPoints as number) ?? 0, 0);
  const score = useSyncExternalStore(noop, scoreSelector, () => 0);
  const total = useSyncExternalStore(noop, totalSelector, () => 0);
  return useMemo(() => {
    if (score === 0 && total === 0) return null;
    return { score, total };
  }, [score, total]);
}

export function useCompletedAnswersJson(unit: number = 1): string {
  const selector = makeUnitSelector<string>(unit, (d) => JSON.stringify(d.answers ?? []), "[]");
  return useSyncExternalStore(noop, selector, () => "[]");
}

export function useSavedAnswersJson(unit: number = 1): string {
  const selector = makeUnitSelector<string>(unit, (d) => JSON.stringify(d.answers ?? []), "[]");
  return useSyncExternalStore(noop, selector, () => "[]");
}

export function useProgressCompletedAt(unit: number = 1): string {
  const selector = makeUnitSelector<string>(unit, (d) => (d.completedAt as string) ?? "", "");
  return useSyncExternalStore(noop, selector, () => "");
}

export function useAllProgress(): Record<string, { answered: number; completed: boolean; score: number; total: number; completedAt: string }> {
  type ProgressValue = { answered: number; completed: boolean; score: number; total: number; completedAt: string };
  const cacheRef = useRef<{ raw: string; result: Record<string, ProgressValue> }>({ raw: "", result: {} });
  const selector = (): Record<string, ProgressValue> => {
    if (typeof window === "undefined") return cacheRef.current.result;
    try {
      const raw = localStorage.getItem("grammar-fellows-progress");
      if (!raw) {
        if (cacheRef.current.raw !== "") {
          cacheRef.current = { raw: "", result: {} };
        }
        return cacheRef.current.result;
      }
      if (raw === cacheRef.current.raw) return cacheRef.current.result;
      const all = JSON.parse(raw);
      const result: Record<string, ProgressValue> = {};
      for (const [key, val] of Object.entries(all)) {
        const d = val as Record<string, unknown>;
        const answers = d.answers as unknown[] | undefined;
        result[key] = {
          answered: answers?.length ?? 0,
          completed: !!d.completedAt,
          score: (d.score as number) ?? 0,
          total: (d.totalPoints as number) ?? 0,
          completedAt: (d.completedAt as string) ?? "",
        };
      }
      cacheRef.current = { raw, result };
      return result;
    } catch {
      return cacheRef.current.result;
    }
  };
  return useSyncExternalStore(noop, selector, () => EMPTY_PROGRESS);
}

export function useTodayStats(): { todayCount: number; streak: number } {
  type TodayStats = { todayCount: number; streak: number };
  const cacheRef = useRef<{ raw: string; result: TodayStats }>({ raw: "", result: { todayCount: 0, streak: 0 } });
  const selector = (): TodayStats => {
    if (typeof window === "undefined") return cacheRef.current.result;
    try {
      const raw = localStorage.getItem("grammar-fellows-progress");
      if (!raw) {
        if (cacheRef.current.raw !== "") {
          cacheRef.current = { raw: "", result: { todayCount: 0, streak: 0 } };
        }
        return cacheRef.current.result;
      }
      if (raw === cacheRef.current.raw) return cacheRef.current.result;
      const all = JSON.parse(raw);
      let todayCount = 0;
      const completedDates: string[] = [];
      for (const val of Object.values(all)) {
        const d = val as Record<string, unknown>;
        const answers = (d.answers ?? []) as Array<Record<string, unknown>>;
        for (const a of answers) {
          if (a.questionId && a.isCorrect !== undefined) {
            todayCount++;
          }
        }
        if (d.completedAt) {
          completedDates.push(new Date(d.completedAt as string).toDateString());
        }
      }
      const uniqueDates = [...new Set(completedDates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      let streak = 0;
      const now = new Date();
      for (let i = 0; i < uniqueDates.length; i++) {
        const expected = new Date(now);
        expected.setDate(expected.getDate() - i);
        if (uniqueDates[i] === expected.toDateString()) {
          streak++;
        } else {
          break;
        }
      }
      const result: TodayStats = { todayCount: Math.min(todayCount, 999), streak };
      cacheRef.current = { raw, result };
      return result;
    } catch {
      return cacheRef.current.result;
    }
  };
  return useSyncExternalStore(noop, selector, () => EMPTY_TODAY_STATS);
}

export function useMistakesJson(): string {
  const selector = (): string => {
    if (typeof window === "undefined") return "[]";
    try {
      const raw = localStorage.getItem("grammar-fellows-progress");
      if (!raw) return "[]";
      const all = JSON.parse(raw);
      const mistakes: Array<{ unit: number; questionId: number; answer: string; isCorrect: boolean }> = [];
      for (const [unitStr, val] of Object.entries(all)) {
        const d = val as Record<string, unknown>;
        const answers = (d.answers ?? []) as Array<Record<string, unknown>>;
        for (const a of answers) {
          if (a.isCorrect === false) {
            mistakes.push({
              unit: parseInt(unitStr),
              questionId: a.questionId as number,
              answer: (a.answer as string) ?? "",
              isCorrect: false,
            });
          }
        }
      }
      return JSON.stringify(mistakes);
    } catch {
      return "[]";
    }
  };
  return useSyncExternalStore(noop, selector, () => "[]");
}
