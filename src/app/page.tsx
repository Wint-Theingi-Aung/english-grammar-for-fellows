"use client";

import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import {
  useAnsweredCount,
  useIsCompleted,
  useScore,
} from "@/lib/hooks";
import { getTotalQuestionCount, isUnitAvailable } from "@/lib/data";

interface UnitCardProps {
  unit: number;
  slug: string;
  title: string;
  description: string;
  status: "available" | "coming-soon";
}

function UnitCard({ unit, slug, title, description, status }: UnitCardProps) {
  const available = isUnitAvailable(unit);
  const total = available ? getTotalQuestionCount(unit) : 0;
  const answered = useAnsweredCount(unit);
  const completed = useIsCompleted(unit);
  const score = useScore(unit);

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 sm:p-8 card-hover animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-2.5">
            Unit {unit}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-ink leading-snug">
            {title}
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
        {status === "coming-soon" && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted bg-surface-alt px-3 py-1 rounded-full border border-border flex-shrink-0 ml-3">
            Coming Soon
          </span>
        )}
      </div>

      <p className="text-ink-muted mb-5 leading-relaxed">
        {description}
      </p>

      {status === "available" && (
        <>
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

          <Link
            href={`/${slug}`}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-7 py-3.5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 text-sm sm:text-base"
          >
            {answered > 0 && !completed
              ? `Continue Unit ${unit}`
              : completed
                ? `Review Unit ${unit}`
                : `Start Unit ${unit}`}
            <span aria-hidden="true" className="text-lg">&rarr;</span>
          </Link>
        </>
      )}

      {status === "coming-soon" && (
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Content coming soon</span>
        </div>
      )}
    </div>
  );
}

const UNITS: UnitCardProps[] = [
  {
    unit: 1,
    slug: "unit-1",
    title: "Simple Present, Simple Past & Simple Future",
    description: "Master the three fundamental English tenses with interactive lessons and exercises.",
    status: "available",
  },
  {
    unit: 2,
    slug: "unit-2",
    title: "Verb to Be (am, is, are, was, were)",
    description: "Learn the verb 'to be' in all its forms across present and past tenses.",
    status: "available",
  },
  {
    unit: 3,
    slug: "unit-3",
    title: "Verb to Have (has, have, had)",
    description: "Learn the verb 'have' as a main verb and auxiliary in perfect tenses.",
    status: "available",
  },
  {
    unit: 4,
    slug: "unit-4",
    title: "Question Tags",
    description: "Master the rules for forming question tags in all tenses.",
    status: "available",
  },
  {
    unit: 5,
    slug: "unit-5",
    title: "Wh Questions",
    description: "Learn to ask and answer wh-questions with who, what, when, where, why, which, and how.",
    status: "available",
  },
  {
    unit: 6,
    slug: "unit-6",
    title: "Modal Verbs (can, could, may, might)",
    description: "Explore modal verbs for ability, permission, and possibility.",
    status: "coming-soon",
  },
];

export default function HomePage() {
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
            Master English grammar with interactive lessons and exercises.
            Choose a unit below to begin your learning journey.
          </p>
        </section>

        {/* Unit Cards */}
        <section className="space-y-6 mb-12" aria-label="Available units">
          {UNITS.map((unit) => (
            <UnitCard key={unit.unit} {...unit} />
          ))}
        </section>
      </div>
    </div>
  );
}
