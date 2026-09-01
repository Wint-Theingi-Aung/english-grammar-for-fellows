"use client";

import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { getLessonsData, getExercisesData, getTotalQuestionCount } from "@/lib/data";
import { useAnsweredCount } from "@/lib/hooks";

const FORM_LABELS = [
  { name: "Affirmative", color: "form-badge-affirmative" },
  { name: "Negative", color: "form-badge-negative" },
  { name: "Interrogative", color: "form-badge-interrogative" },
  { name: "Neg. Interrogative", color: "form-badge-neg-interrogative" },
];

export default function UnitOverviewPage() {
  const lessonsData = getLessonsData();
  const exercisesData = getExercisesData();
  const total = getTotalQuestionCount();
  const answered = useAnsweredCount();

  const objectives = [
    "Understand and use Simple Present Tense, Simple Past Tense, and Simple Future Tense",
    "Form affirmative, negative, interrogative, and negative-interrogative sentences",
    "Use correct verb forms for all subject pronouns (I, we, you, he, she, it, they)",
    "Reply to Yes/No questions with short and long answers",
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mb-5 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded-lg px-1 -ml-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mb-2 tracking-tight">
          Unit 1: {lessonsData.title}
        </h1>

        {/* Form labels */}
        <div className="flex flex-wrap gap-2 mt-4">
          {FORM_LABELS.map((fl) => (
            <span key={fl.name} className={`form-badge ${fl.color}`}>
              {fl.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <ProgressBar current={answered} total={total} label={`${answered} / ${total} questions completed`} />
      </div>

      {/* Learning Objectives */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm" aria-labelledby="objectives-heading">
        <h2 id="objectives-heading" className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary-50 text-primary-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Learning Objectives
        </h2>
        <ol className="space-y-3" role="list">
          {objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-3 text-ink-light">
              <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center border border-primary-100">
                {i + 1}
              </span>
              <span className="leading-relaxed text-sm sm:text-base">{obj}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Lessons */}
      <section className="mb-6" aria-labelledby="lessons-heading">
        <h2 id="lessons-heading" className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-accent-50 text-accent-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          Lessons
        </h2>
        <div className="space-y-3">
          {lessonsData.lessons.map((lesson, i) => (
            <div
              key={lesson.id}
              className="bg-surface rounded-xl border border-border p-5 shadow-sm card-hover"
            >
              <div className="flex items-start gap-3.5">
                <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-sm font-bold flex items-center justify-center shadow-sm">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-ink">{lesson.title}</h3>
                  <p className="text-sm text-ink-muted mt-1 leading-relaxed">{lesson.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Practice Info */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-8 shadow-sm" aria-labelledby="practice-heading">
        <h2 id="practice-heading" className="text-lg font-bold text-ink mb-2 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary-50 text-primary-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </span>
          Practice
        </h2>
        <p className="text-ink-muted mb-4">
          {total} questions across {exercisesData.exercises.length} exercise sets:
        </p>
        <ul className="text-sm text-ink-muted space-y-2 mb-0" role="list">
          {exercisesData.exercises.map((ex) => (
            <li key={ex.id} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" aria-hidden="true" />
              {ex.instructions} ({ex.questions.length} questions)
            </li>
          ))}
        </ul>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/unit-1/lesson"
          className="inline-flex items-center justify-center gap-2 bg-surface text-primary-700 font-semibold border-2 border-primary-200 px-6 py-3.5 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 text-sm sm:text-base"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Read Lessons
        </Link>
        <Link
          href="/unit-1/practice"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-6 py-3.5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 text-sm sm:text-base"
        >
          Start Practice
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
