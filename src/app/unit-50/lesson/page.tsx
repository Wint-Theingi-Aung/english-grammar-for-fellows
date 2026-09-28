"use client";

import Link from "next/link";
import { getLessonsData } from "@/lib/data";

const UNIT = 50;

export default function Unit50LessonPage() {
  const data = getLessonsData(UNIT);
  const [lesson1] = data.lessons;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
      <Link href="/unit-50" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mb-5 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded-lg px-1 -ml-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to Unit Overview
      </Link>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mb-8 tracking-tight">Placement Test Instructions</h1>

      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm" aria-labelledby="intro-heading">
        <h2 id="intro-heading" className="text-xl font-bold text-ink mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 text-sm font-bold flex items-center justify-center border border-primary-100" aria-hidden="true">1</span>
          About the Placement Test
        </h2>
        <p className="text-ink-light mb-4 leading-relaxed">{lesson1.content}</p>
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-primary-700 font-semibold flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            This is an assessment — answers are not revealed during the test.
          </p>
          <p className="text-sm text-primary-600 mt-1">
            Your score will be calculated at the end and you will receive a placement level.
          </p>
        </div>
      </section>

      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 text-sm font-bold flex items-center justify-center border border-primary-100" aria-hidden="true">2</span>
          How to Take the Test
        </h2>
        <ol className="space-y-4" role="list">
          <li className="flex items-start gap-3 text-ink-light">
            <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center border border-primary-100">1</span>
            <span className="leading-relaxed text-sm sm:text-base">Click <strong>&ldquo;Start Assessment&rdquo;</strong> to begin the test. You will be presented with 577 multiple-choice questions.</span>
          </li>
          <li className="flex items-start gap-3 text-ink-light">
            <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center border border-primary-100">2</span>
            <span className="leading-relaxed text-sm sm:text-base">Select the best answer for each question by clicking on one of the four options (A, B, C, or D).</span>
          </li>
          <li className="flex items-start gap-3 text-ink-light">
            <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center border border-primary-100">3</span>
            <span className="leading-relaxed text-sm sm:text-base">Use the <strong>question navigator</strong> (grid of numbered buttons) on the right side to jump to any question. Questions you&apos;ve answered appear in <span className="text-primary-600 font-semibold">blue</span>, and the current question appears in <span className="text-orange-500 font-semibold">orange</span>.</span>
          </li>
          <li className="flex items-start gap-3 text-ink-light">
            <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center border border-primary-100">4</span>
            <span className="leading-relaxed text-sm sm:text-base">Your progress is <strong>automatically saved</strong>. You can close the browser and return later to continue where you left off.</span>
          </li>
          <li className="flex items-start gap-3 text-ink-light">
            <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center border border-primary-100">5</span>
            <span className="leading-relaxed text-sm sm:text-base">After answering all 577 questions, click <strong>&ldquo;Submit Assessment&rdquo;</strong> to see your results.</span>
          </li>
          <li className="flex items-start gap-3 text-ink-light">
            <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center border border-primary-100">6</span>
            <span className="leading-relaxed text-sm sm:text-base">You will receive a <strong>percentage score</strong> and a <strong>placement level</strong> based on your results.</span>
          </li>
        </ol>
      </section>

      <section className="bg-surface rounded-2xl border border-border p-6 mb-8 shadow-sm" aria-labelledby="levels-heading">
        <h2 id="levels-heading" className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 text-sm font-bold flex items-center justify-center border border-primary-100" aria-hidden="true">3</span>
          Placement Levels
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
            <span className="w-8 h-8 rounded-lg bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">A</span>
            <div>
              <span className="font-semibold text-green-800 text-sm">Advanced</span>
              <span className="text-green-600 text-xs ml-2">90-100%</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">U</span>
            <div>
              <span className="font-semibold text-blue-800 text-sm">Upper Intermediate</span>
              <span className="text-blue-600 text-xs ml-2">70-89%</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
            <span className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-700 text-xs font-bold flex items-center justify-center">I</span>
            <div>
              <span className="font-semibold text-yellow-800 text-sm">Intermediate</span>
              <span className="text-yellow-600 text-xs ml-2">50-69%</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-200">
            <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center">E</span>
            <div>
              <span className="font-semibold text-orange-800 text-sm">Elementary</span>
              <span className="text-orange-600 text-xs ml-2">30-49%</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-200">
            <span className="w-8 h-8 rounded-lg bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center">B</span>
            <div>
              <span className="font-semibold text-red-800 text-sm">Beginner</span>
              <span className="text-red-600 text-xs ml-2">0-29%</span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-center">
        <Link href="/unit-50/practice" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 text-sm sm:text-base">
          Start Assessment<span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
