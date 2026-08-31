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
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
      {/* Hero */}
      <section className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 mb-5 shadow-lg shadow-primary-500/20">
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="1" width="14" height="22" rx="2" fill="white" opacity="0.9" />
            <rect x="2" y="1" width="2.5" height="22" rx="0.8" fill="white" opacity="0.6" />
            <text x="9.5" y="15" fontFamily="Georgia, serif" fontSize="9" fontWeight="bold" fill="#6366f1" textAnchor="middle">G</text>
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
          English Grammar for Fellows
        </h1>
        <p className="text-base sm:text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
          Learn the Simple Present, Simple Past, and Simple Future tenses with
          interactive lessons and exercises.
        </p>
      </section>

      {/* Unit Card */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 sm:p-8 card-hover">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-2.5">
              Unit 1
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
              Simple Present, Simple Past &amp; Simple Future
            </h2>
          </div>
          {completed && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success-600 bg-success-50 px-3 py-1 rounded-full border border-success-500/20 flex-shrink-0 ml-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Done
            </span>
          )}
        </div>

        <p className="text-slate-500 mb-5 leading-relaxed">
          Master the three fundamental English tenses. Practice forming
          affirmative, negative, interrogative and negative-interrogative
          sentences for all subject pronouns.
        </p>

        <div className="mb-5">
          <ProgressBar current={answered} total={total} label={`${answered} / ${total} questions completed`} />
        </div>

        {score && (
          <p className="text-sm text-slate-500 mb-5">
            Last score:{" "}
            <span className="font-bold text-foreground">{score.score}</span>
            <span className="text-slate-400"> / {score.total} points</span>
          </p>
        )}

        <Link
          href="/unit-1"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-7 py-3.5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
        >
          {answered > 0 && !completed
            ? "Continue Unit 1"
            : completed
              ? "Review Unit 1"
              : "Start Unit 1"}
          <span aria-hidden="true" className="text-lg">→</span>
        </Link>
      </div>
    </div>
  );
}
