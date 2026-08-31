"use client";

import Link from "next/link";
import { useCompletedAnswersJson } from "@/lib/hooks";
import { getAllQuestions } from "@/lib/data";
import type { UserAnswer } from "@/lib/types";

interface ResultDetail {
  answer: UserAnswer;
  question: string;
  correctAnswer: string;
  explanation: string;
  points: number;
}

function computeDetails(answersJson: string): ResultDetail[] {
  const answers: UserAnswer[] = JSON.parse(answersJson);
  const allQ = getAllQuestions();
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

export default function ResultPage() {
  const answersJson = useCompletedAnswersJson();
  const details = computeDetails(answersJson);

  if (details.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-slate-500 mb-4">No results found. Complete the practice first.</p>
        <Link
          href="/unit-1/practice"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-6 py-3 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20"
        >
          Start Practice
          <span aria-hidden="true">→</span>
        </Link>
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
      ? { label: "Excellent!", color: "text-success-600", bg: "bg-success-50", border: "border-success-500/20" }
      : pct >= 70
        ? { label: "Good job!", color: "text-info-600", bg: "bg-info-50", border: "border-info-500/20" }
        : pct >= 50
          ? { label: "Keep practicing!", color: "text-warning-600", bg: "bg-warning-50", border: "border-warning-500/20" }
          : { label: "Try again!", color: "text-error-600", bg: "bg-error-50", border: "border-error-500/20" };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mb-5 transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      {/* Score Card */}
      <div className="bg-surface rounded-2xl border border-border p-8 text-center mb-8 shadow-sm">
        <div className={`inline-block px-5 py-2 rounded-full text-sm font-bold ${grade.bg} ${grade.color} border ${grade.border} mb-5`}>
          {grade.label}
        </div>

        <div className="mb-2">
          <span className="text-4xl font-bold text-foreground">{score}</span>
          <span className="text-2xl font-bold text-slate-300 mx-1">/</span>
          <span className="text-2xl font-bold text-slate-400">{total}</span>
        </div>
        <p className="text-lg text-slate-500 mb-6">{pct}% correct</p>

        <div className="flex justify-center gap-8">
          <div className="text-center">
            <span className="block text-3xl font-bold text-success-600">{correctCount}</span>
            <span className="text-sm text-slate-500 font-medium">Correct</span>
          </div>
          <div className="w-px bg-border" />
          <div className="text-center">
            <span className="block text-3xl font-bold text-error-500">{incorrectCount}</span>
            <span className="text-sm text-slate-500 font-medium">Incorrect</span>
          </div>
        </div>
      </div>

      {/* Answer Review */}
      <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Answer Review
      </h2>

      <div className="space-y-3 mb-8">
        {details.map((d, i) => (
          <div
            key={d.answer.questionId}
            className={`rounded-xl border-2 p-4 transition-colors duration-200 ${
              d.answer.isCorrect
                ? "bg-success-50 border-success-500/30"
                : "bg-error-50 border-error-500/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                  d.answer.isCorrect ? "bg-success-500" : "bg-error-500"
                }`}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground mb-1.5 leading-relaxed">{d.question}</p>
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
                <p className="text-xs text-slate-500 leading-relaxed myanmar-text">{d.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/unit-1"
          className="inline-flex items-center justify-center gap-2 bg-surface text-primary-700 font-semibold border-2 border-primary-200 px-6 py-3.5 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Unit Overview
        </Link>
        <Link
          href="/unit-1/practice"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-6 py-3.5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20"
        >
          Retry Practice
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
