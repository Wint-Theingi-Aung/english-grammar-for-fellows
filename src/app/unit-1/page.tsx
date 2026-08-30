"use client";

import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { getLessonsData, getExercisesData, getTotalQuestionCount } from "@/lib/data";
import { useAnsweredCount } from "@/lib/hooks";

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
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
        ← Back to Home
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
        Unit 1: {lessonsData.title}
      </h1>

      <div className="mb-6">
        <ProgressBar current={answered} total={total} label={`${answered} / ${total} questions completed`} />
      </div>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-3">Learning Objectives</h2>
        <ul className="space-y-2">
          {objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-700">
              <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Lessons</h2>
        <div className="space-y-3">
          {lessonsData.lessons.map((lesson, i) => (
            <div
              key={lesson.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900">{lesson.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{lesson.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Practice</h2>
        <p className="text-slate-600 mb-4">
          {total} questions across {exercisesData.exercises.length} exercise sets:
        </p>
        <ul className="text-sm text-slate-600 space-y-1 mb-5">
          {exercisesData.exercises.map((ex) => (
            <li key={ex.id}>
              • {ex.instructions} ({ex.questions.length} questions)
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/unit-1/lesson"
          className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold border-2 border-indigo-200 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
        >
          Read Lessons
        </Link>
        <Link
          href="/unit-1/practice"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Start Practice →
        </Link>
      </div>
    </div>
  );
}
