"use client";

import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useAnsweredCount, useIsCompleted, useScore } from "@/lib/hooks";
import { getTotalQuestionCount } from "@/lib/data";

export default function HomePage() {
  const total = getTotalQuestionCount();
  const answered = useAnsweredCount();
  const completed = useIsCompleted();
  const score = useScore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          English Grammar for Fellows
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          Learn the Simple Present, Simple Past, and Simple Future tenses with
          interactive lessons and exercises.
        </p>
      </section>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mb-2">
              Unit 1
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Simple Present, Simple Past &amp; Simple Future Tense
            </h2>
          </div>
          {completed && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              ✓ Completed
            </span>
          )}
        </div>

        <p className="text-slate-600 mb-5">
          Master the three fundamental English tenses. Practice forming
          affirmative, negative, interrogative and negative-interrogative
          sentences for all subject pronouns.
        </p>

        <div className="mb-5">
          <ProgressBar current={answered} total={total} label={`${answered} / ${total} questions completed`} />
        </div>

        {score && (
          <p className="text-sm text-slate-500 mb-5">
            Last score: <span className="font-semibold text-slate-700">{score.score}</span> / {score.total} points
          </p>
        )}

        <Link
          href="/unit-1"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {answered > 0 && !completed ? "Continue Unit 1" : completed ? "Review Unit 1" : "Start Unit 1"}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
