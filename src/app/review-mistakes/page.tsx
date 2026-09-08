"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMistakesJson } from "@/lib/hooks";
import { getAllQuestions, getLessonsData } from "@/lib/data";

interface Mistake {
  unit: number;
  questionId: number;
  answer: string;
  isCorrect: boolean;
}

interface EnrichedMistake extends Mistake {
  question: string;
  correctAnswer: string;
  explanation: string;
  unitTitle: string;
}

export default function ReviewMistakesPage() {
  const mistakesJson = useMistakesJson();
  const [filterUnit, setFilterUnit] = useState<number | null>(null);

  const enriched = useMemo(() => {
    const mistakes: Mistake[] = JSON.parse(mistakesJson);
    const seen = new Set<string>();
    const result: EnrichedMistake[] = [];
    for (const m of mistakes) {
      const key = `${m.unit}-${m.questionId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const allQ = getAllQuestions(m.unit);
      const q = allQ.find((qq) => qq.id === m.questionId);
      let unitTitle = "";
      try {
        unitTitle = getLessonsData(m.unit).title;
      } catch {
        unitTitle = `Unit ${m.unit}`;
      }
      result.push({
        ...m,
        question: q?.question ?? "",
        correctAnswer: q?.answer ?? "",
        explanation: q?.explanation ?? "",
        unitTitle,
      });
    }
    return result;
  }, [mistakesJson]);

  const filtered = useMemo(() => {
    if (filterUnit === null) return enriched;
    return enriched.filter((m) => m.unit === filterUnit);
  }, [enriched, filterUnit]);

  const unitsWithMistakes = useMemo(() => {
    const units = new Set(enriched.map((m) => m.unit));
    return Array.from(units).sort((a, b) => a - b);
  }, [enriched]);

  if (enriched.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mb-5 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded-lg px-1 -ml-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>

        <div className="bg-surface rounded-2xl border border-border p-8 sm:p-10 text-center shadow-sm animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-success-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-ink mb-2">No Mistakes Yet</h1>
          <p className="text-ink-muted mb-6 text-sm">Complete some practice exercises to start tracking your progress.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-6 py-3 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 text-sm"
          >
            Go to Dashboard
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mb-5 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded-lg px-1 -ml-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Dashboard
      </Link>

      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-1 font-serif">
          Review Mistakes
        </h1>
        <p className="text-ink-muted text-sm">
          {enriched.length} incorrect answer{enriched.length !== 1 ? "s" : ""} to review and learn from.
        </p>
      </div>

      {/* Unit Filter */}
      {unitsWithMistakes.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter by unit">
          <button
            type="button"
            onClick={() => setFilterUnit(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
              filterUnit === null
                ? "bg-primary-600 text-white"
                : "bg-surface border border-border text-ink-muted hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
            }`}
          >
            All Units
          </button>
          {unitsWithMistakes.map((u) => {
            let title = "";
            try { title = getLessonsData(u).title; } catch { title = `Unit ${u}`; }
            return (
              <button
                key={u}
                type="button"
                onClick={() => setFilterUnit(u)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                  filterUnit === u
                    ? "bg-primary-600 text-white"
                    : "bg-surface border border-border text-ink-muted hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
                }`}
              >
                Unit {u}: {title}
              </button>
            );
          })}
        </div>
      )}

      {/* Mistakes List */}
      <div className="space-y-3" role="list" aria-label="Mistakes list">
        {filtered.map((m, i) => (
          <div
            key={`${m.unit}-${m.questionId}`}
            className="bg-surface rounded-xl border-2 border-error-500/20 p-4 sm:p-5 animate-fade-in"
            role="listitem"
            style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-50 text-accent-500 text-xs font-bold flex items-center justify-center border border-accent-100">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-accent-500 bg-accent-50 px-2 py-0.5 rounded-full">
                    Unit {m.unit}
                  </span>
                  <span className="text-xs text-ink-muted">Q{m.questionId}</span>
                </div>
                <p className="text-sm font-medium text-ink mb-2 leading-relaxed">{m.question}</p>
                <div className="space-y-1 mb-2">
                  <p className="text-xs text-error-600">
                    <span className="font-semibold">Your answer:</span>{" "}
                    <span className="text-error-700">{m.answer || "(empty)"}</span>
                  </p>
                  <p className="text-xs text-success-600">
                    <span className="font-semibold">Correct answer:</span>{" "}
                    <span className="text-success-700 font-medium">{m.correctAnswer}</span>
                  </p>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed myanmar-text">{m.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && filterUnit !== null && (
        <div className="text-center py-10">
          <p className="text-ink-muted text-sm">No mistakes in this unit.</p>
          <button
            type="button"
            onClick={() => setFilterUnit(null)}
            className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            Show all units
          </button>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded-lg px-3 py-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
