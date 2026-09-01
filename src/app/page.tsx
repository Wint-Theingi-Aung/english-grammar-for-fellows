"use client";

import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import {
  useAnsweredCount,
  useIsCompleted,
  useScore,
  useCompletedAnswersJson,
} from "@/lib/hooks";
import { getTotalQuestionCount } from "@/lib/data";
import type { UserAnswer } from "@/lib/types";

const FORM_TAGS = [
  { name: "Affirmative", color: "form-badge-affirmative" },
  { name: "Negative", color: "form-badge-negative" },
  { name: "Interrogative", color: "form-badge-interrogative" },
  { name: "Neg. Interrogative", color: "form-badge-neg-interrogative" },
];

function AccuracyStat({ answersJson }: { answersJson: string }) {
  const answers: UserAnswer[] = JSON.parse(answersJson);
  if (answers.length === 0) return <span className="text-2xl font-bold text-ink">0%</span>;
  const correct = answers.filter((a) => a.isCorrect).length;
  const pct = Math.round((correct / answers.length) * 100);
  return <span className="text-2xl font-bold text-ink">{pct}%</span>;
}

export default function HomePage() {
  const total = getTotalQuestionCount();
  const answered = useAnsweredCount();
  const completed = useIsCompleted();
  const score = useScore();
  const answersJson = useCompletedAnswersJson();

  const correctCount = (() => {
    try {
      const answers: UserAnswer[] = JSON.parse(answersJson);
      return answers.filter((a) => a.isCorrect).length;
    } catch {
      return 0;
    }
  })();

  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

  const learningPath = [
    {
      step: 1,
      title: "Lesson",
      desc: "Read grammar rules",
      href: "/unit-1/lesson",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      step: 2,
      title: "Practice",
      desc: "Test your knowledge",
      href: "/unit-1/practice",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
    {
      step: 3,
      title: "Review",
      desc: "Check your results",
      href: "/unit-1/result",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="hero-gradient hero-pattern min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
        {/* Hero Section */}
        <section className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 mb-6 shadow-lg shadow-primary-500/20 animate-fade-in">
            <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-10 sm:h-10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="3" y="1.5" width="13" height="21" rx="1.5" fill="white" opacity="0.92" />
              <rect x="3" y="1.5" width="2" height="21" rx="0.6" fill="white" opacity="0.5" />
              <line x1="6.5" y1="6" x2="13" y2="6" stroke="rgba(42,157,143,0.3)" strokeWidth="0.6" strokeLinecap="round" />
              <line x1="6.5" y1="9" x2="13" y2="9" stroke="rgba(42,157,143,0.3)" strokeWidth="0.6" strokeLinecap="round" />
              <line x1="6.5" y1="12" x2="10" y2="12" stroke="rgba(42,157,143,0.3)" strokeWidth="0.6" strokeLinecap="round" />
              <text x="9.5" y="16.5" fontFamily="Georgia, serif" fontSize="9" fontWeight="bold" fill="#218579" textAnchor="middle">G</text>
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-4 tracking-tight animate-fade-in">
            English Grammar for Fellows
          </h1>
          <p className="text-base sm:text-lg text-ink-muted max-w-xl mx-auto leading-relaxed animate-fade-in">
            Master the Simple Present, Simple Past, and Simple Future tenses
            with interactive lessons and exercises.
          </p>
        </section>

        {/* Unit 1 Progress Card */}
        <section className="bg-surface rounded-2xl border border-border shadow-sm p-6 sm:p-8 mb-6 card-hover animate-fade-in" aria-label="Unit 1 progress">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-2.5">
                Unit 1
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-ink leading-snug">
                Simple Present, Simple Past &amp; Simple Future
              </h2>
            </div>
            {completed && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success-600 bg-success-50 px-3 py-1 rounded-full border border-success-500/20 flex-shrink-0 ml-3">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Done
              </span>
            )}
          </div>

          <p className="text-ink-muted mb-5 leading-relaxed">
            Master the three fundamental English tenses. Practice forming
            affirmative, negative, interrogative and negative-interrogative
            sentences for all subject pronouns.
          </p>

          <div className="mb-5">
            <ProgressBar
              current={answered}
              total={total}
              label={`${answered} / ${total} questions completed`}
            />
          </div>

          {score && (
            <p className="text-sm text-ink-muted mb-5">
              Last score:{" "}
              <span className="font-bold text-ink">{score.score}</span>
              <span className="text-ink-muted"> / {score.total} points</span>
            </p>
          )}

          {/* Form Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {FORM_TAGS.map((tag) => (
              <span key={tag.name} className={`form-badge ${tag.color}`}>
                {tag.name}
              </span>
            ))}
          </div>

          <Link
            href="/unit-1"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-7 py-3.5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 text-sm sm:text-base"
          >
            {answered > 0 && !completed
              ? "Continue Unit 1"
              : completed
                ? "Review Unit 1"
                : "Start Unit 1"}
            <span aria-hidden="true" className="text-lg">&rarr;</span>
          </Link>
        </section>

        {/* Stat Cards */}
        <section className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 animate-fade-in" aria-label="Progress statistics">
          <div className="bg-surface rounded-xl border border-border p-4 sm:p-5 text-center stat-glow-teal">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 text-primary-600 mb-2.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="block text-2xl font-bold text-ink">4</span>
            <span className="text-xs text-ink-muted font-medium">Lessons</span>
          </div>

          <div className="bg-surface rounded-xl border border-border p-4 sm:p-5 text-center stat-glow-coral">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-accent-50 text-accent-500 mb-2.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="block text-2xl font-bold text-ink">{total}</span>
            <span className="text-xs text-ink-muted font-medium">Questions</span>
          </div>

          <div className="bg-surface rounded-xl border border-border p-4 sm:p-5 text-center stat-glow-navy">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-surface-alt text-ink-light mb-2.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <AccuracyStat answersJson={answersJson} />
            <span className="text-xs text-ink-muted font-medium">Accuracy</span>
          </div>
        </section>

        {/* Learning Path */}
        <section className="bg-surface rounded-2xl border border-border shadow-sm p-6 sm:p-8 mb-6 animate-fade-in" aria-label="Learning path">
          <h2 className="text-lg font-bold text-ink mb-5 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Learning Path
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {learningPath.map((item) => (
              <Link
                key={item.step}
                href={item.href}
                className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-200">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">
                      Step {item.step}
                    </span>
                  </div>
                  <span className="block text-sm font-semibold text-ink group-hover:text-primary-700 transition-colors duration-200">
                    {item.title}
                  </span>
                  <span className="block text-xs text-ink-muted">{item.desc}</span>
                </div>
                <svg className="w-4 h-4 text-ink-muted group-hover:text-primary-500 ml-auto flex-shrink-0 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-surface rounded-2xl border border-border shadow-sm p-6 sm:p-8 animate-fade-in" aria-label="Recent activity">
          <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activity
          </h2>

          {answered === 0 ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-alt mb-3">
                <svg className="w-6 h-6 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-sm text-ink-muted mb-3">No activity yet. Start your grammar journey!</p>
              <Link
                href="/unit-1/lesson"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                Begin Lesson 1
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-alt/50">
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${completed ? "bg-success-500" : "bg-primary-500"}`}>
                  {completed ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{answered}</span>
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {completed ? "Unit 1 Completed" : `Answered ${answered} of ${total} questions`}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {completed && score
                      ? `Score: ${score.score}/${score.total} points`
                      : `${pct}% complete`}
                  </p>
                </div>
                <Link
                  href={completed ? "/unit-1/result" : "/unit-1/practice"}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex-shrink-0 transition-colors duration-200"
                >
                  {completed ? "View Results" : "Continue"}
                </Link>
              </div>

              {correctCount > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-alt/50">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-success-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink">
                      {correctCount} correct {correctCount === 1 ? "answer" : "answers"}
                    </p>
                    <p className="text-xs text-ink-muted">
                      out of {answered} attempted
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
