"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCompletedAnswersJson } from "@/lib/hooks";
import { getAllQuestions } from "@/lib/data";
import type { UserAnswer } from "@/lib/types";

const UNIT = 50;
const UNIT_SLUG = "unit-50";
const TOTAL_QUESTIONS = 577;

function ScoreRing({ percentage, size = 160 }: { percentage: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const strokeColor = percentage >= 90 ? "#16a34a" : percentage >= 70 ? "#2a9d8f" : percentage >= 50 ? "#e76f51" : percentage >= 30 ? "#d97706" : "#dc2626";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e8e4df"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring-animate"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl sm:text-5xl font-serif font-bold text-[#1a1f36]">{percentage}%</span>
        <span className="text-xs text-[#6b7194] font-sans font-medium mt-0.5">accuracy</span>
      </div>
    </div>
  );
}

function getPlacementLevel(percentage: number) {
  if (percentage >= 90) return { level: "Advanced", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", icon: "A" };
  if (percentage >= 70) return { level: "Upper Intermediate", color: "text-[#2a9d8f]", bg: "bg-[#e6f5f3]", border: "border-[#2a9d8f]/30", icon: "U" };
  if (percentage >= 50) return { level: "Intermediate", color: "text-[#b8860b]", bg: "bg-[#fef9e7]", border: "border-[#b8860b]/30", icon: "I" };
  if (percentage >= 30) return { level: "Elementary", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", icon: "E" };
  return { level: "Beginner", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: "B" };
}

export default function Unit50ResultPage() {
  const answersJson = useCompletedAnswersJson(UNIT);
  const allQuestions = useMemo(() => getAllQuestions(UNIT), []);

  const details = useMemo(() => {
    const answers: UserAnswer[] = JSON.parse(answersJson);
    return answers.map((a) => {
      const q = allQuestions.find((qq) => qq.id === a.questionId);
      return {
        answer: a,
        question: q?.question ?? "",
        correctAnswer: q?.answer ?? "",
        explanation: q?.explanation ?? "",
        points: q?.points ?? 0,
      };
    });
  }, [answersJson, allQuestions]);

  const answeredCount = details.length;

  if (answeredCount === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-center">
        <div className="bg-white rounded-2xl border border-[#e8e4df] p-8 sm:p-10 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#f5f3f0] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#6b7194]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-xl font-serif font-bold text-[#1a1f36] mb-2">No Results Yet</h1>
          <p className="text-[#6b7194] mb-6 text-sm font-sans">Complete the placement test to see your results.</p>
          <Link
            href={`/${UNIT_SLUG}/practice`}
            className="inline-flex items-center gap-2 bg-[#e76f51] text-white font-sans font-semibold px-6 py-3 rounded-xl hover:bg-[#d4613f] transition-all duration-200 shadow-md shadow-[#e76f51]/20 focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2 text-sm"
          >
            Start Assessment
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

  const placement = getPlacementLevel(pct);

  const grade =
    pct >= 90
      ? { label: "Excellent!", color: "text-[#1a6b62]", bg: "bg-[#e6f5f3]", border: "border-[#2a9d8f]/30" }
      : pct >= 70
        ? { label: "Good job!", color: "text-[#e76f51]", bg: "bg-[#fdf0ec]", border: "border-[#e76f51]/30" }
        : pct >= 50
          ? { label: "Keep practicing", color: "text-[#b8860b]", bg: "bg-[#fef9e7]", border: "border-[#b8860b]/30" }
          : pct >= 30
            ? { label: "Room to grow", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" }
            : { label: "Keep learning", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };

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
        <div className={`inline-block px-5 py-1.5 rounded-full text-sm font-bold font-sans ${grade.bg} ${grade.color} border ${grade.border} mb-6`}>
          {grade.label}
        </div>

        {/* Placement Level */}
        <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl ${placement.bg} border ${placement.border} mb-8`}>
          <span className={`w-10 h-10 rounded-lg ${placement.bg} text-white text-sm font-bold flex items-center justify-center`} style={{ backgroundColor: pct >= 90 ? "#16a34a" : pct >= 70 ? "#2a9d8f" : pct >= 50 ? "#e76f51" : pct >= 30 ? "#d97706" : "#dc2626" }}>
            {placement.icon}
          </span>
          <div className="text-left">
            <span className="text-xs text-[#6b7194] font-sans">Your Placement Level</span>
            <span className={`block text-lg font-serif font-bold ${placement.color}`}>{placement.level}</span>
          </div>
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
            <span className="block text-2xl font-serif font-bold text-[#1a1f36]">{TOTAL_QUESTIONS}</span>
            <span className="text-xs text-[#6b7194] font-sans font-medium">Total</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <Link
          href={`/${UNIT_SLUG}/practice`}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[#e76f51] text-white font-sans font-semibold px-5 py-3 rounded-xl hover:bg-[#d4613f] transition-all duration-200 shadow-md shadow-[#e76f51]/20 focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2 text-sm"
        >
          Retake Assessment
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </Link>
        <Link
          href={`/${UNIT_SLUG}`}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-[#2a9d8f] font-sans font-semibold border-2 border-[#2a9d8f]/20 px-5 py-3 rounded-xl hover:bg-[#e6f5f3] hover:border-[#2a9d8f]/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#2a9d8f] focus-visible:ring-offset-2 text-sm"
        >
          Back to Unit Overview
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      {/* Placement Level Reference */}
      <div className="bg-white rounded-2xl border border-[#e8e4df] p-6 mb-10 shadow-sm">
        <h2 className="text-lg font-serif font-bold text-[#1a1f36] mb-4 flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#e6f5f3] text-[#2a9d8f]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </span>
          Placement Levels
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className={`flex items-center gap-3 p-3 rounded-xl ${pct >= 90 ? "bg-green-100 border-2 border-green-400" : "bg-green-50 border border-green-200"}`}>
            <span className="w-8 h-8 rounded-lg bg-green-600 text-white text-xs font-bold flex items-center justify-center">A</span>
            <div>
              <span className="font-semibold text-green-800 text-sm">Advanced</span>
              <span className="text-green-600 text-xs block">90-100%</span>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-xl ${pct >= 70 && pct < 90 ? "bg-[#e6f5f3] border-2 border-[#2a9d8f]" : "bg-[#e6f5f3] border border-[#2a9d8f]/30"}`}>
            <span className="w-8 h-8 rounded-lg bg-[#2a9d8f] text-white text-xs font-bold flex items-center justify-center">U</span>
            <div>
              <span className="font-semibold text-[#1a6b62] text-sm">Upper Int.</span>
              <span className="text-[#2a9d8f] text-xs block">70-89%</span>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-xl ${pct >= 50 && pct < 70 ? "bg-[#fef9e7] border-2 border-[#b8860b]" : "bg-[#fef9e7] border border-[#b8860b]/30"}`}>
            <span className="w-8 h-8 rounded-lg bg-[#b8860b] text-white text-xs font-bold flex items-center justify-center">I</span>
            <div>
              <span className="font-semibold text-[#8b6914] text-sm">Intermediate</span>
              <span className="text-[#b8860b] text-xs block">50-69%</span>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-xl ${pct >= 30 && pct < 50 ? "bg-orange-100 border-2 border-orange-400" : "bg-orange-50 border border-orange-200"}`}>
            <span className="w-8 h-8 rounded-lg bg-orange-500 text-white text-xs font-bold flex items-center justify-center">E</span>
            <div>
              <span className="font-semibold text-orange-700 text-sm">Elementary</span>
              <span className="text-orange-600 text-xs block">30-49%</span>
            </div>
          </div>
          <div className={`flex items-center gap-3 p-3 rounded-xl ${pct < 30 ? "bg-red-100 border-2 border-red-400" : "bg-red-50 border border-red-200"}`}>
            <span className="w-8 h-8 rounded-lg bg-red-500 text-white text-xs font-bold flex items-center justify-center">B</span>
            <div>
              <span className="font-semibold text-red-700 text-sm">Beginner</span>
              <span className="text-red-600 text-xs block">0-29%</span>
            </div>
          </div>
        </div>
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
