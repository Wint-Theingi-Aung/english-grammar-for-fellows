"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCompletedAnswersJson } from "@/lib/hooks";
import { getAllQuestions, getLessonsData } from "@/lib/data";
import type { UserAnswer } from "@/lib/types";

interface ResultDetail {
  answer: UserAnswer;
  question: string;
  correctAnswer: string;
  explanation: string;
  points: number;
}

function computeDetails(unit: number, answersJson: string): ResultDetail[] {
  const answers: UserAnswer[] = JSON.parse(answersJson);
  const allQ = getAllQuestions(unit);
  return answers.map((a) => {
    const q = allQ.find((qq) => qq.id === a.questionId);
    return {
      answer: a,
      question: q?.question ?? "",
      correctAnswer: q?.answer ?? "",
      explanation: q?.explanation ?? "",
      points: q?.points ?? 0,
    };
  });
}

function ScoreRing({ percentage, size = 120 }: { percentage: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const strokeColor = percentage >= 80 ? "var(--success-500)" : percentage >= 50 ? "var(--primary-500)" : "var(--error-500)";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring-animate"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl sm:text-3xl font-bold text-ink">{percentage}%</span>
        <span className="text-xs text-ink-muted font-medium">accuracy</span>
      </div>
    </div>
  );
}

interface ResultPageProps {
  unit: number;
  unitSlug: string;
}

export default function ResultPage({ unit, unitSlug }: ResultPageProps) {
  const answersJson = useCompletedAnswersJson(unit);
  const details = useMemo(() => computeDetails(unit, answersJson), [unit, answersJson]);

  const mistakeCount = details.filter((d) => !d.answer.isCorrect).length;

  if (details.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-center">
        <div className="bg-surface rounded-2xl border border-border p-8 sm:p-10 shadow-sm animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-surface-alt flex items-center justify-center">
            <svg className="w-8 h-8 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-ink mb-2">No Results Yet</h1>
          <p className="text-ink-muted mb-6 text-sm">Complete the practice to see your results.</p>
          <Link
            href={`/${unitSlug}/practice`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-6 py-3 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 text-sm"
          >
            Start Practice
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  const score = details.reduce((sum, d) => sum + (d.answer.isCorrect ? d.points : 0), 0);
  const total = details.reduce((sum, d) => sum + d.points, 0);
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const correctCount = details.filter((d) => d.answer.isCorrect).length;
  const incorrectCount = details.filter((d) => !d.answer.isCorrect).length;

  const grade =
    pct >= 90
      ? { label: "Excellent!", emoji: "star", color: "text-success-600", bg: "bg-success-50", border: "border-success-500/20" }
      : pct >= 70
        ? { label: "Good job!", emoji: "thumbs", color: "text-primary-600", bg: "bg-primary-50", border: "border-primary-500/20" }
        : pct >= 50
          ? { label: "Keep practicing", emoji: "fire", color: "text-warning-600", bg: "bg-warning-50", border: "border-warning-500/20" }
          : { label: "Try again", emoji: "refresh", color: "text-error-600", bg: "bg-error-50", border: "border-error-500/20" };

  const nextUnit = unit < 16 ? unit + 1 : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mb-5 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded-lg px-1 -ml-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Dashboard
      </Link>

      {/* Score Card */}
      <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 text-center mb-6 shadow-sm animate-fade-in">
        <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${grade.bg} ${grade.color} border ${grade.border} mb-6`}>
          {grade.label}
        </div>

        <div className="mb-6">
          <ScoreRing percentage={pct} />
        </div>

        <div className="mb-2">
          <span className="text-3xl sm:text-4xl font-bold text-ink">{score}</span>
          <span className="text-xl sm:text-2xl font-bold text-ink-muted/40 mx-1">/</span>
          <span className="text-xl sm:text-2xl font-bold text-ink-muted">{total}</span>
          <span className="text-sm text-ink-muted ml-2">points</span>
        </div>

        <div className="flex justify-center gap-6 sm:gap-10 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <span className="block text-2xl font-bold text-success-600">{correctCount}</span>
            <span className="text-xs text-ink-muted font-medium">Correct</span>
          </div>
          <div className="w-px bg-border" aria-hidden="true" />
          <div className="text-center">
            <span className="block text-2xl font-bold text-error-500">{incorrectCount}</span>
            <span className="text-xs text-ink-muted font-medium">Incorrect</span>
          </div>
          <div className="w-px bg-border" aria-hidden="true" />
          <div className="text-center">
            <span className="block text-2xl font-bold text-ink">{details.length}</span>
            <span className="text-xs text-ink-muted font-medium">Total</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {mistakeCount > 0 && (
          <Link
            href="/review-mistakes"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-accent-50 text-accent-600 font-semibold border-2 border-accent-100 px-5 py-3 rounded-xl hover:bg-accent-100 hover:border-accent-400/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Review {mistakeCount} Mistake{mistakeCount !== 1 ? "s" : ""}
          </Link>
        )}
        <Link
          href={`/${unitSlug}/practice`}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-5 py-3 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 text-sm"
        >
          Retry Practice
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </Link>
        {nextUnit && (
          <Link
            href={`/unit-${nextUnit}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-surface text-primary-700 font-semibold border-2 border-primary-200 px-5 py-3 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 text-sm"
          >
            Next: {getLessonsData(nextUnit).title}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        )}
      </div>

      {/* Answer Review */}
      <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2 font-serif">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary-50 text-primary-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </span>
        Answer Review
      </h2>

      <div className="space-y-3 mb-8" role="list" aria-label="Answer review list">
        {details.map((d, i) => (
          <div
            key={d.answer.questionId}
            className={`rounded-xl border-2 p-4 transition-colors duration-200 ${
              d.answer.isCorrect
                ? "bg-success-50 border-success-500/30"
                : "bg-error-50 border-error-500/30"
            }`}
            role="listitem"
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                  d.answer.isCorrect ? "bg-success-500" : "bg-error-500"
                }`}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink mb-1.5 leading-relaxed">{d.question}</p>
                {!d.answer.isCorrect && (
                  <div className="space-y-1 mb-2">
                    <p className="text-xs text-error-600">
                      <span className="font-semibold">Your answer:</span>{" "}
                      <span className="text-error-700">{d.answer.answer || "(empty)"}</span>
                    </p>
                    <p className="text-xs text-success-600">
                      <span className="font-semibold">Correct answer:</span>{" "}
                      <span className="text-success-700 font-medium">{d.correctAnswer}</span>
                    </p>
                  </div>
                )}
                {d.answer.isCorrect && (
                  <p className="text-xs text-success-600 mb-2">
                    <span className="font-semibold">Your answer:</span>{" "}
                    <span className="text-success-700">{d.answer.answer}</span>
                  </p>
                )}
                <p className="text-xs text-ink-muted leading-relaxed myanmar-text">{d.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
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
