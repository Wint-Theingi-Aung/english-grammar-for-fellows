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
        <p className="text-slate-600 mb-4">No results found. Complete the practice first.</p>
        <Link
          href="/unit-1/practice"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Start Practice →
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
      ? { label: "Excellent!", color: "text-emerald-600", bg: "bg-emerald-50" }
      : pct >= 70
        ? { label: "Good job!", color: "text-blue-600", bg: "bg-blue-50" }
        : pct >= 50
          ? { label: "Keep practicing!", color: "text-amber-600", bg: "bg-amber-50" }
          : { label: "Try again!", color: "text-red-600", bg: "bg-red-50" };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
        ← Back to Home
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center mb-8">
        <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${grade.bg} ${grade.color} mb-4`}>
          {grade.label}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">{score} / {total}</h1>
        <p className="text-lg text-slate-500 mb-4">{pct}% correct</p>

        <div className="flex justify-center gap-6 text-sm">
          <div className="text-center">
            <span className="block text-2xl font-bold text-emerald-600">{correctCount}</span>
            <span className="text-slate-500">Correct</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-red-500">{incorrectCount}</span>
            <span className="text-slate-500">Incorrect</span>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-4">Answer Review</h2>
      <div className="space-y-3 mb-8">
        {details.map((d, i) => (
          <div
            key={d.answer.questionId}
            className={`rounded-xl border-2 p-4 ${
              d.answer.isCorrect
                ? "bg-emerald-50 border-emerald-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                  d.answer.isCorrect ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 mb-1">{d.question}</p>
                {!d.answer.isCorrect && (
                  <>
                    <p className="text-xs text-red-700">
                      Your answer: <span className="font-medium">{d.answer.answer || "(empty)"}</span>
                    </p>
                    <p className="text-xs text-emerald-700">
                      Correct answer: <span className="font-medium">{d.correctAnswer}</span>
                    </p>
                  </>
                )}
                {d.answer.isCorrect && (
                  <p className="text-xs text-emerald-700">
                    Your answer: <span className="font-medium">{d.answer.answer}</span>
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-1">{d.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/unit-1"
          className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold border-2 border-indigo-200 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
        >
          ← Unit Overview
        </Link>
        <Link
          href="/unit-1/practice"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Retry Practice →
        </Link>
      </div>
    </div>
  );
}
