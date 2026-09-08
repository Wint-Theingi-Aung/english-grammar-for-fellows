"use client";

import Link from "next/link";
import { useMemo } from "react";
import ProgressBar from "@/components/ProgressBar";
import { getLessonsData, getTotalQuestionCount, isUnitAvailable } from "@/lib/data";
import { useAllProgress, useTodayStats } from "@/lib/hooks";

const UNIT_TITLES: Record<number, string> = {
  1: "Simple Present, Past & Future",
  2: "Verb to Be (am, is, are, was, were)",
  3: "Verb to Have (has, have, had)",
  4: "Question Tags",
  5: "Wh Questions",
  6: "Will / Would",
  7: "Should / Ought to",
  8: "Can / Could",
  9: "May / Might",
  10: "Must",
  11: "Have to",
};

const UNIT_DESCRIPTIONS: Record<number, string> = {
  1: "Master the three fundamental English tenses with interactive lessons and exercises.",
  2: "Learn the verb 'to be' in all its forms across present and past tenses.",
  3: "Learn the verb 'have' as a main verb and auxiliary in perfect tenses.",
  4: "Master the rules for forming question tags in all tenses.",
  5: "Learn to ask and answer wh-questions with who, what, when, where, why, which, and how.",
  6: "Master the use of will and would for future, conditional, and polite expressions.",
  7: "Learn to use should and ought to for advice, expectations, and obligations.",
  8: "Explore can and could for ability, permission, and polite requests.",
  9: "Learn to use may and might for possibility, permission, and wishes.",
  10: "Master the use of must for strong obligations and mustn't for prohibition.",
  11: "Learn to use have to for responsibilities and don't have to for what's not required.",
};

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className={`bg-surface rounded-xl border border-border p-4 sm:p-5 shadow-sm ${color}`}>
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" aria-hidden="true">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-2xl font-bold text-ink animate-count">{value}</p>
          <p className="text-xs font-medium text-ink-muted uppercase tracking-wider">{label}</p>
        </div>
      </div>
    </div>
  );
}

function LearningPathNode({ unit, status, title, progress, questionCount, answeredCount }: {
  unit: number;
  status: "completed" | "current" | "available" | "locked";
  title: string;
  progress: number;
  questionCount: number;
  answeredCount: number;
}) {
  const slug = `unit-${unit}`;
  const nodeColor = status === "completed"
    ? "bg-success-500 text-white"
    : status === "current"
      ? "bg-primary-500 text-white ring-4 ring-primary-100"
      : status === "available"
        ? "bg-surface border-2 border-border text-ink-muted"
        : "bg-surface-alt border-2 border-border text-ink-muted/40";

  const isClickable = status !== "locked";

  return (
    <div className="flex items-start gap-4 path-connector">
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-200 ${nodeColor}`}>
        {status === "completed" ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          unit
        )}
      </div>
      <div className="flex-1 min-w-0 pb-8">
        {isClickable ? (
          <Link href={`/${slug}`} className="block group">
            <h3 className={`font-bold text-sm sm:text-base ${status === "current" ? "text-primary-700" : "text-ink"} group-hover:text-primary-600 transition-colors duration-200`}>
              {title}
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">{questionCount} questions</p>
            {progress > 0 && (
              <div className="mt-2 max-w-xs">
                <ProgressBar current={answeredCount} total={questionCount} />
              </div>
            )}
          </Link>
        ) : (
          <div>
            <h3 className="font-bold text-sm sm:text-base text-ink-muted/50">{title}</h3>
            <p className="text-xs text-ink-muted/40 mt-0.5">Coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ContinueCard({ unit, slug, title, answered, total, completed }: {
  unit: number; slug: string; title: string; answered: number; total: number; completed: boolean;
}) {
  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-primary-600/20 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/20">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
        <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          {completed ? "Review" : "Continue Learning"}
        </span>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold mb-2">
        Unit {unit}: {title}
      </h2>
      <p className="text-sm text-white/70 mb-4">
        {completed
          ? `You scored ${answered} points. Review your answers or retry.`
          : `${answered} of ${total} questions answered`}
      </p>
      {!completed && (
        <div className="mb-5">
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-white progress-fill transition-all duration-300"
              style={{ width: `${total > 0 ? Math.round((answered / total) * 100) : 0}%` }}
            />
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/${slug}/practice`}
          className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 transition-all duration-200 shadow-sm text-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600"
        >
          {completed ? "Retry Practice" : "Continue Practice"}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        <Link
          href={`/${slug}`}
          className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/25 transition-all duration-200 text-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600"
        >
          View Unit
        </Link>
      </div>
    </div>
  );
}

function UnitCard({ unit, title, description, answered, total, completed, score }: {
  unit: number; title: string; description: string; answered: number; total: number; completed: boolean; score: { score: number; total: number } | null;
}) {
  const slug = `unit-${unit}`;
  const accuracy = score && score.total > 0 ? Math.round((score.score / score.total) * 100) : 0;

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden card-hover animate-fade-in">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold flex-shrink-0 ${
              completed
                ? "bg-success-50 text-success-600"
                : answered > 0
                  ? "bg-primary-50 text-primary-600"
                  : "bg-surface-alt text-ink-muted"
            }`}>
              {completed ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                unit
              )}
            </span>
            <div>
              <h3 className="font-bold text-ink text-sm sm:text-base leading-tight">{title}</h3>
              <p className="text-xs text-ink-muted mt-0.5">{total} questions</p>
            </div>
          </div>
          {completed && score && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-success-600 bg-success-50 px-2.5 py-1 rounded-full border border-success-500/20 flex-shrink-0">
              {accuracy}%
            </span>
          )}
        </div>

        <p className="text-xs text-ink-muted mb-4 leading-relaxed line-clamp-2">{description}</p>

        {answered > 0 && (
          <div className="mb-4">
            <ProgressBar current={answered} total={total} />
          </div>
        )}

        <div className="flex gap-2">
          <Link
            href={`/${slug}/practice`}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 text-sm focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
              completed
                ? "bg-surface text-primary-700 border-2 border-primary-200 hover:bg-primary-50 hover:border-primary-300"
                : answered > 0
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-600/20 hover:from-primary-700 hover:to-primary-800"
                  : "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-600/20 hover:from-primary-700 hover:to-primary-800"
            }`}
          >
            {completed ? "Review" : answered > 0 ? "Continue" : "Start"}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href={`/${slug}`}
            className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl border-2 border-border text-ink-muted hover:bg-surface-alt hover:border-primary-200 transition-all duration-200 text-sm focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            aria-label={`View Unit ${unit} details`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const allProgress = useAllProgress();
  const { streak } = useTodayStats();

  const stats = useMemo(() => {
    let totalAnswered = 0;
    let totalCompleted = 0;
    let totalCorrect = 0;
    let totalPoints = 0;
    for (let u = 1; u <= 11; u++) {
      const p = allProgress[String(u)];
      if (p) {
        totalAnswered += p.answered;
        if (p.completed) totalCompleted++;
        totalCorrect += p.score;
        totalPoints += p.total;
      }
    }
    const accuracy = totalPoints > 0 ? Math.round((totalCorrect / totalPoints) * 100) : 0;
    return { totalAnswered, totalCompleted, accuracy };
  }, [allProgress]);

  const continueUnit = (() => {
    for (let u = 1; u <= 11; u++) {
      if (!isUnitAvailable(u)) continue;
      const p = allProgress[String(u)];
      if (!p || (!p.completed && p.answered > 0)) {
        return { unit: u, ...p };
      }
    }
    for (let u = 1; u <= 11; u++) {
      if (!isUnitAvailable(u)) continue;
      const p = allProgress[String(u)];
      if (!p || !p.completed) {
        return { unit: u, ...p };
      }
    }
    return null;
  })();

  const continueData = (() => {
    if (!continueUnit) return null;
    const lessonsData = getLessonsData(continueUnit.unit);
    const total = getTotalQuestionCount(continueUnit.unit);
    return {
      unit: continueUnit.unit,
      slug: `unit-${continueUnit.unit}`,
      title: lessonsData.title,
      answered: continueUnit.answered ?? 0,
      total,
      completed: continueUnit.completed ?? false,
    };
  })();

  const pathNodes = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => {
      const u = i + 1;
      const p = allProgress[String(u)];
      const total = getTotalQuestionCount(u);
      const answered = p?.answered ?? 0;
      const completed = p?.completed ?? false;
      let status: "completed" | "current" | "available" | "locked" = "available";
      if (completed) status = "completed";
      else if (answered > 0) status = "current";
      else if (u > 1) {
        const prev = allProgress[String(u - 1)];
        if (!prev?.completed && u > 1) {
          const hasAnyPrev = Array.from({ length: u - 1 }, (_, j) => allProgress[String(j + 1)]?.completed ?? false).some(Boolean);
          if (!hasAnyPrev && u > 1) status = "locked";
        }
      }
      return { unit: u, status, title: UNIT_TITLES[u], total, answered, completed };
    });
  }, [allProgress]);

  return (
    <div className="hero-gradient hero-pattern min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
        {/* Welcome */}
        <section className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-1 font-serif">
            English Grammar for Fellows
          </h1>
          <p className="text-ink-muted text-sm sm:text-base">
            Master English grammar with interactive lessons and exercises.
          </p>
        </section>

        {/* Continue Learning Card */}
        {continueData && (
          <section className="mb-8" aria-label="Continue learning">
            <ContinueCard {...continueData} />
          </section>
        )}

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8" aria-label="Learning statistics">
          <StatCard
            icon={<svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="Day Streak"
            value={streak}
            color="stat-glow-teal"
          />
          <StatCard
            icon={<svg className="w-5 h-5 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            label="Questions"
            value={stats.totalAnswered}
            color="stat-glow-coral"
          />
          <StatCard
            icon={<svg className="w-5 h-5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="Accuracy"
            value={`${stats.accuracy}%`}
            color="stat-glow-teal"
          />
          <StatCard
            icon={<svg className="w-5 h-5 text-info-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
            label="Completed"
            value={`${stats.totalCompleted}/11`}
            color="stat-glow-navy"
          />
        </section>

        {/* Learning Path */}
        <section className="mb-8" aria-labelledby="path-heading">
          <h2 id="path-heading" className="text-lg font-bold text-ink mb-5 flex items-center gap-2 font-serif">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary-50 text-primary-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </span>
            Learning Path
          </h2>
          <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-sm">
            {pathNodes.map((node) => (
              <LearningPathNode
                key={node.unit}
                unit={node.unit}
                status={node.status}
                title={node.title}
                progress={node.total > 0 ? Math.round((node.answered / node.total) * 100) : 0}
                questionCount={node.total}
                answeredCount={node.answered}
              />
            ))}
          </div>
        </section>

        {/* All Units Grid */}
        <section aria-labelledby="units-heading">
          <h2 id="units-heading" className="text-lg font-bold text-ink mb-5 flex items-center gap-2 font-serif">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-accent-50 text-accent-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            All Units
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 11 }, (_, i) => i + 1).map((u) => {
              const p = allProgress[String(u)];
              const total = getTotalQuestionCount(u);
              return (
                <UnitCard
                  key={u}
                  unit={u}
                  title={UNIT_TITLES[u]}
                  description={UNIT_DESCRIPTIONS[u]}
                  answered={p?.answered ?? 0}
                  total={total}
                  completed={p?.completed ?? false}
                  score={p?.completed && p.total > 0 ? { score: p.score, total: p.total } : null}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
