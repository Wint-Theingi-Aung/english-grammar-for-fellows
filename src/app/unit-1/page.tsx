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

const UNIT = 1;

export default function UnitOverviewPage() {
  const lessonsData = getLessonsData(UNIT);
  const exercisesData = getExercisesData(UNIT);
  const total = getTotalQuestionCount(UNIT);
  const answered = useAnsweredCount(UNIT);

  const objectives = [
    "Understand and use Simple Present Tense, Simple Past Tense, and Simple Future Tense",
    "Form affirmative, negative, interrogative, and negative-interrogative sentences",
    "Use correct verb forms for all subject pronouns (I, we, you, he, she, it, they)",
    "Reply to Yes/No questions with short and long answers",
  ];

  return (
    <div className="min-h-screen" style={{ background: "#faf8f5" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">

        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-500 hover:text-accent-600 mb-6 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-1 rounded-lg px-1 -ml-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="mb-8 animate-fade-in">
          <span className="inline-block text-sm font-semibold tracking-wide uppercase text-accent-500 mb-2 font-sans">
            Unit {UNIT}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight" style={{ color: "#1a1f36" }}>
            {lessonsData.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-4">
            {FORM_LABELS.map((fl) => (
              <span key={fl.name} className={`form-badge ${fl.color}`}>
                {fl.name}
              </span>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-10 animate-fade-in">
          <ProgressBar
            current={answered}
            total={total}
            label={`${answered} / ${total} questions completed`}
          />
        </div>

        {/* Learning Objectives */}
        <section
          className="rounded-2xl border p-6 sm:p-8 mb-8 shadow-sm"
          style={{ background: "#ffffff", borderColor: "#e8e2d9" }}
          aria-labelledby="objectives-heading"
        >
          <h2
            id="objectives-heading"
            className="text-lg sm:text-xl font-bold mb-5 flex items-center gap-3 font-sans"
            style={{ color: "#1a1f36" }}
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: "#f0faf9", color: "#2a9d8f" }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Learning Objectives
          </h2>
          <ol className="space-y-4" role="list">
            {objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3.5">
                <span
                  className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border"
                  style={{ background: "#f0faf9", color: "#2a9d8f", borderColor: "#d5f0ed" }}
                >
                  {i + 1}
                </span>
                <span className="leading-relaxed text-sm sm:text-base" style={{ color: "#3d4263" }}>{obj}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Lessons */}
        <section className="mb-8" aria-labelledby="lessons-heading">
          <h2
            id="lessons-heading"
            className="text-lg sm:text-xl font-bold mb-5 flex items-center gap-3 font-sans"
            style={{ color: "#1a1f36" }}
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: "#fff5f3", color: "#e76f51" }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            Lessons
          </h2>
          <div className="space-y-3 stagger-children">
            {lessonsData.lessons.map((lesson, i) => (
              <Link
                key={lesson.id}
                href="/unit-1/lesson"
                className="block bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-sm card-hover"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="flex-shrink-0 w-10 h-10 rounded-xl text-white text-sm font-bold flex items-center justify-center shadow-sm"
                    style={{ background: "linear-gradient(135deg, #e76f51, #d45a3c)" }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base sm:text-lg" style={{ color: "#1a1f36" }}>{lesson.title}</h3>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: "#6b7194" }}>{lesson.content}</p>
                  </div>
                  <svg className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: "#e8e2d9" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Practice Info */}
        <section
          className="rounded-2xl border p-6 sm:p-8 mb-10 shadow-sm"
          style={{ background: "#ffffff", borderColor: "#e8e2d9" }}
          aria-labelledby="practice-heading"
        >
          <h2
            id="practice-heading"
            className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-3 font-sans"
            style={{ color: "#1a1f36" }}
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: "#fff9eb", color: "#d4a72c" }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </span>
            Practice
          </h2>
          <p className="mb-5 text-sm sm:text-base" style={{ color: "#3d4263" }}>
            {total} questions across {exercisesData.exercises.length} exercise sets
          </p>
          <ul className="space-y-2.5 mb-0" role="list">
            {exercisesData.exercises.map((ex) => (
              <li key={ex.id} className="flex items-center gap-3 text-sm" style={{ color: "#6b7194" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#2a9d8f" }} aria-hidden="true" />
                {ex.instructions}
                <span className="text-xs font-medium px-1.5 py-0.5 rounded-md" style={{ background: "#f0faf9", color: "#2a9d8f" }}>
                  {ex.questions.length} Qs
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/unit-1/lesson"
            className="inline-flex items-center justify-center gap-2 font-semibold px-6 py-3.5 rounded-2xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 text-sm sm:text-base"
            style={{
              background: "#ffffff",
              color: "#e76f51",
              border: "2px solid #e76f51",
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Read Lessons
          </Link>
          <Link
            href="/unit-1/practice"
            className="inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3.5 rounded-2xl transition-all duration-200 shadow-md focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 text-sm sm:text-base"
            style={{
              background: "linear-gradient(135deg, #e76f51, #d45a3c)",
              boxShadow: "0 4px 14px -3px rgba(231, 111, 81, 0.45)",
            }}
          >
            Start Practice
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
