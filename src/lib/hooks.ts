"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

function getAnswered(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("grammar-fellows-progress");
    if (!raw) return 0;
    const all = JSON.parse(raw);
    return all["1"]?.answers?.length ?? 0;
  } catch {
    return 0;
  }
}

function getCompleted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("grammar-fellows-progress");
    if (!raw) return false;
    const all = JSON.parse(raw);
    return !!all["1"]?.completedAt;
  } catch {
    return false;
  }
}

function getScoreValue(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("grammar-fellows-progress");
    if (!raw) return 0;
    const all = JSON.parse(raw);
    return all["1"]?.score ?? 0;
  } catch {
    return 0;
  }
}

function getTotalPointsValue(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("grammar-fellows-progress");
    if (!raw) return 0;
    const all = JSON.parse(raw);
    return all["1"]?.totalPoints ?? 0;
  } catch {
    return 0;
  }
}

function getCompletedAnswersJson(): string {
  if (typeof window === "undefined") return "[]";
  try {
    const raw = localStorage.getItem("grammar-fellows-progress");
    if (!raw) return "[]";
    const all = JSON.parse(raw);
    return JSON.stringify(all["1"]?.answers ?? []);
  } catch {
    return "[]";
  }
}

export function useAnsweredCount(): number {
  return useSyncExternalStore(noop, getAnswered, () => 0);
}

export function useIsCompleted(): boolean {
  return useSyncExternalStore(noop, getCompleted, () => false);
}

export function useScore(): { score: number; total: number } | null {
  const score = useSyncExternalStore(noop, getScoreValue, () => 0);
  const total = useSyncExternalStore(noop, getTotalPointsValue, () => 0);
  if (score === 0 && total === 0) return null;
  return { score, total };
}

export function useCompletedAnswersJson(): string {
  return useSyncExternalStore(noop, getCompletedAnswersJson, () => "[]");
}

function getSavedAnswersJson(): string {
  if (typeof window === "undefined") return "[]";
  try {
    const raw = localStorage.getItem("grammar-fellows-progress");
    if (!raw) return "[]";
    const all = JSON.parse(raw);
    return JSON.stringify(all["1"]?.answers ?? []);
  } catch {
    return "[]";
  }
}

function getProgressCompletedAt(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem("grammar-fellows-progress");
    if (!raw) return "";
    const all = JSON.parse(raw);
    return all["1"]?.completedAt ?? "";
  } catch {
    return "";
  }
}

export function useSavedAnswersJson(): string {
  return useSyncExternalStore(noop, getSavedAnswersJson, () => "[]");
}

export function useProgressCompletedAt(): string {
  return useSyncExternalStore(noop, getProgressCompletedAt, () => "");
}
