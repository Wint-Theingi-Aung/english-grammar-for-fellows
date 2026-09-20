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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "#1a1f36" }}>
            Review Mistakes
          </h1>
          <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "#3d4263" }}>
            Every mistake is a learning opportunity. Keep going!
          </p>
        </div>

        {/* Empty State */}
        <div
          className="rounded-2xl p-10 sm:p-14 text-center shadow-sm animate-fade-in"
          style={{ backgroundColor: "#ffffff", border: "1px solid #e8e4df" }}
        >
          <div className="mx-auto mb-6" style={{ width: 120, height: 120 }}>
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="56" fill="#f0f9f8" stroke="#2a9d8f" strokeWidth="2" strokeDasharray="6 4" />
              <path d="M42 64l10 10 26-28" stroke="#2a9d8f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M60 28v-4M60 96v-4M28 60h-4M96 60h-4" stroke="#e8e4df" strokeWidth="2" strokeLinecap="round" />
              <circle cx="60" cy="60" r="6" fill="#2a9d8f" opacity="0.2" />
            </svg>
          </div>
          <h2 className="font-serif text-xl font-bold mb-2" style={{ color: "#1a1f36" }}>
            No mistakes yet — wonderful!
          </h2>
          <p className="text-sm max-w-md mx-auto mb-8 leading-relaxed" style={{ color: "#6b7194" }}>
            You haven&apos;t made any mistakes yet. Complete some practice exercises to begin tracking your progress and learning from every attempt.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-2xl transition-all duration-200 shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 text-sm"
            style={{
              backgroundColor: "#e76f51",
              color: "#ffffff",
              boxShadow: "0 4px 14px rgba(231,111,81,0.25)",
            }}
          >
            Start Learning
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "#1a1f36" }}>
          Review Mistakes
        </h1>
        <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "#3d4263" }}>
          Let&apos;s review and grow. Every mistake brings you one step closer to mastery.
        </p>
        <p className="text-sm mt-2" style={{ color: "#6b7194" }}>
          {enriched.length} item{enriched.length !== 1 ? "s" : ""} to review
        </p>
      </div>

      {/* Unit Filter Pills */}
      {unitsWithMistakes.length > 1 && (
        <div
          className="flex flex-wrap justify-center gap-2.5 mb-8 animate-fade-in"
          role="group"
          aria-label="Filter by unit"
        >
          <button
            type="button"
            onClick={() => setFilterUnit(null)}
            className="px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              backgroundColor: filterUnit === null ? "#e76f51" : "#ffffff",
              color: filterUnit === null ? "#ffffff" : "#3d4263",
              border: filterUnit === null ? "2px solid #e76f51" : "2px solid #e8e4df",
            }}
          >
            All Units
          </button>
          {unitsWithMistakes.map((u) => {
            let title = "";
            try { title = getLessonsData(u).title; } catch { title = `Unit ${u}`; }
            const isActive = filterUnit === u;
            return (
              <button
                key={u}
                type="button"
                onClick={() => setFilterUnit(u)}
                className="px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-1"
                style={{
                  backgroundColor: isActive ? "#e76f51" : "#ffffff",
                  color: isActive ? "#ffffff" : "#3d4263",
                  border: isActive ? "2px solid #e76f51" : "2px solid #e8e4df",
                }}
              >
                Unit {u}: {title}
              </button>
            );
          })}
        </div>
      )}

      {/* Mistakes List */}
      <div className="space-y-4" role="list" aria-label="Mistakes list">
        {filtered.map((m, i) => (
          <div
            key={`${m.unit}-${m.questionId}`}
            className="rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-md animate-fade-in"
            role="listitem"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e8e4df",
              animationDelay: `${Math.min(i * 60, 400)}ms`,
              animationFillMode: "both",
            }}
          >
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="flex-shrink-0 w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center"
                style={{ backgroundColor: "#f0f9f8", color: "#2a9d8f", border: "1px solid #d4efed" }}
              >
                {i + 1}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "#f0f9f8", color: "#2a9d8f" }}
                >
                  Unit {m.unit}
                </span>
                <span className="text-xs" style={{ color: "#6b7194" }}>
                  Q{m.questionId}
                </span>
                <span className="text-xs" style={{ color: "#6b7194" }}>
                  &middot; {m.unitTitle}
                </span>
              </div>
            </div>

            {/* Question */}
            <p className="text-sm font-medium leading-relaxed mb-4" style={{ color: "#1a1f36" }}>
              {m.question}
            </p>

            {/* Answers */}
            <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "#faf8f5" }}>
              <div className="flex items-start gap-2 mb-2.5">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: "#fde8e4" }}
                >
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M9 3L3 9M3 3l6 6" stroke="#e76f51" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: "#e76f51" }}>
                    Your answer
                  </p>
                  <p className="text-sm" style={{ color: "#3d4263" }}>
                    {m.answer || "(empty)"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: "#d4efed" }}
                >
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="#2a9d8f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: "#2a9d8f" }}>
                    Correct answer
                  </p>
                  <p className="text-sm font-medium" style={{ color: "#1a1f36" }}>
                    {m.correctAnswer}
                  </p>
                </div>
              </div>
            </div>

            {/* Explanation */}
            {m.explanation && (
              <div className="flex items-start gap-2 mt-3">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#e8e4df" strokeWidth="1.5" />
                  <path d="M8 5v0M8 7.5v3.5" stroke="#6b7194" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-xs leading-relaxed myanmar-text" style={{ color: "#6b7194" }}>
                  {m.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty Filter State */}
      {filtered.length === 0 && filterUnit !== null && (
        <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: "#ffffff", border: "1px solid #e8e4df" }}>
          <p className="text-sm mb-3" style={{ color: "#6b7194" }}>
            No mistakes in this unit — great job!
          </p>
          <button
            type="button"
            onClick={() => setFilterUnit(null)}
            className="text-sm font-semibold transition-colors duration-200"
            style={{ color: "#e76f51" }}
          >
            Show all units
          </button>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="flex justify-center mt-10 mb-4 animate-fade-in">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 font-semibold px-7 py-3.5 rounded-2xl transition-all duration-200 shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 text-sm"
          style={{
            backgroundColor: "#e76f51",
            color: "#ffffff",
            boxShadow: "0 4px 14px rgba(231,111,81,0.25)",
          }}
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
