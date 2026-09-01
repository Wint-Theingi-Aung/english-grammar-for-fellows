"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

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
  if (score === 0 && total === 0) return null;
  return { score, total };
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
