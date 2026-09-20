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

function ScoreRing({ percentage, size = 140 }: { percentage: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const strokeColor = percentage >= 80 ? "#2a9d8f" : percentage >= 50 ? "#e76f51" : "#d4513f";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e8e4df"
          strokeWidth="7"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring-animate"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl sm:text-4xl font-serif font-bold text-[#1a1f36]">{percentage}%</span>
        <span className="text-xs text-[#6b7194] font-sans font-medium mt-0.5">accuracy</span>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-center">
        <div className="bg-white rounded-2xl border border-[#e8e4df] p-8 sm:p-10 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#f5f3f0] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#6b7194]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-xl font-serif font-bold text-[#1a1f36] mb-2">No Results Yet</h1>
          <p className="text-[#6b7194] mb-6 text-sm font-sans">Complete the practice to see your results.</p>
          <Link
            href={`/${unitSlug}/practice`}
            className="inline-flex items-center gap-2 bg-[#e76f51] text-white font-sans font-semibold px-6 py-3 rounded-xl hover:bg-[#d4613f] transition-all duration-200 shadow-md shadow-[#e76f51]/20 focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2 text-sm"
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
      ? { label: "Excellent!", color: "text-[#1a6b62]", bg: "bg-[#e6f5f3]", border: "border-[#2a9d8f]/30" }
      : pct >= 70
        ? { label: "Good job!", color: "text-[#e76f51]", bg: "bg-[#fdf0ec]", border: "border-[#e76f51]/30" }
        : pct >= 50
          ? { label: "Keep practicing", color: "text-[#b8860b]", bg: "bg-[#fef9e7]", border: "border-[#b8860b]/30" }
          : { label: "Try again", color: "text-[#a94a3a]", bg: "bg-[#fdf0ec]", border: "border-[#e76f51]/30" };

  const nextUnit = unit < 40 ? unit + 1 : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#e76f51] hover:text-[#d4613f] mb-6 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2 rounded-lg px-1 -ml-1 font-sans"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Dashboard
      </Link>

      {/* Score Card */}
      <div className="bg-white rounded-2xl border border-[#e8e4df] p-6 sm:p-8 text-center mb-8 shadow-sm">
        <div className={`inline-block px-5 py-1.5 rounded-full text-sm font-bold font-sans ${grade.bg} ${grade.color} border ${grade.border} mb-8`}>
          {grade.label}
        </div>

        <div className="mb-8">
          <ScoreRing percentage={pct} />
        </div>

        <div className="mb-3">
          <span className="text-4xl sm:text-5xl font-serif font-bold text-[#1a1f36]">{score}</span>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-[#e8e4df] mx-2">/</span>
          <span className="text-2xl sm:text-3xl font-serif font-bold text-[#6b7194]">{total}</span>
          <span className="text-sm text-[#6b7194] font-sans ml-2">points</span>
        </div>

        <div className="flex justify-center gap-6 sm:gap-10 mt-8 pt-8 border-t border-[#e8e4df]">
          <div className="text-center">
            <span className="block text-2xl font-serif font-bold text-[#2a9d8f]">{correctCount}</span>
            <span className="text-xs text-[#6b7194] font-sans font-medium">Correct</span>
          </div>
          <div className="w-px bg-[#e8e4df]" aria-hidden="true" />
          <div className="text-center">
            <span className="block text-2xl font-serif font-bold text-[#e76f51]">{incorrectCount}</span>
            <span className="text-xs text-[#6b7194] font-sans font-medium">Incorrect</span>
          </div>
          <div className="w-px bg-[#e8e4df]" aria-hidden="true" />
          <div className="text-center">
            <span className="block text-2xl font-serif font-bold text-[#1a1f36]">{details.length}</span>
            <span className="text-xs text-[#6b7194] font-sans font-medium">Total</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        {mistakeCount > 0 && (
          <Link
            href="/review-mistakes"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#fdf0ec] text-[#e76f51] font-sans font-semibold border-2 border-[#e76f51]/20 px-5 py-3 rounded-xl hover:bg-[#e76f51]/10 hover:border-[#e76f51]/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Review {mistakeCount} Mistake{mistakeCount !== 1 ? "s" : ""}
          </Link>
        )}
        <Link
          href={`/${unitSlug}/practice`}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#e76f51] text-white font-sans font-semibold px-5 py-3 rounded-xl hover:bg-[#d4613f] transition-all duration-200 shadow-md shadow-[#e76f51]/20 focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2 text-sm"
        >
          Retry Practice
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </Link>
        {nextUnit && (
          <Link
            href={`/unit-${nextUnit}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-[#2a9d8f] font-sans font-semibold border-2 border-[#2a9d8f]/20 px-5 py-3 rounded-xl hover:bg-[#e6f5f3] hover:border-[#2a9d8f]/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#2a9d8f] focus-visible:ring-offset-2 text-sm"
          >
            Next: {getLessonsData(nextUnit).title}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        )}
      </div>

      {/* Answer Review */}
      <h2 className="text-lg font-serif font-bold text-[#1a1f36] mb-5 flex items-center gap-2.5">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#e6f5f3] text-[#2a9d8f]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </span>
        Answer Review
      </h2>

      <div className="space-y-3 mb-10" role="list" aria-label="Answer review list">
        {details.map((d, i) => (
          <div
            key={d.answer.questionId}
            className={`rounded-xl border-2 p-5 transition-colors duration-200 ${
              d.answer.isCorrect
                ? "bg-[#e6f5f3] border-[#2a9d8f]/30"
                : "bg-[#fdf0ec] border-[#e76f51]/30"
            }`}
            role="listitem"
          >
            <div className="flex items-start gap-3.5">
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center text-white font-sans ${
                  d.answer.isCorrect ? "bg-[#2a9d8f]" : "bg-[#e76f51]"
                }`}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1a1f36] mb-2 leading-relaxed font-sans">{d.question}</p>
                {!d.answer.isCorrect && (
                  <div className="space-y-1 mb-2">
                    <p className="text-xs font-sans text-[#a94a3a]">
                      <span className="font-semibold">Your answer:</span>{" "}
                      <span>{d.answer.answer || "(empty)"}</span>
                    </p>
                    <p className="text-xs font-sans text-[#1a6b62]">
                      <span className="font-semibold">Correct answer:</span>{" "}
                      <span className="font-medium">{d.correctAnswer}</span>
                    </p>
                  </div>
                )}
                {d.answer.isCorrect && (
                  <p className="text-xs font-sans text-[#1a6b62] mb-2">
                    <span className="font-semibold">Your answer:</span>{" "}
                    <span>{d.answer.answer}</span>
                  </p>
                )}
                <p className="text-xs font-sans text-[#6b7194] leading-relaxed myanmar-text">{d.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#e76f51] hover:text-[#d4613f] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2 rounded-lg px-4 py-2.5 font-sans"
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
