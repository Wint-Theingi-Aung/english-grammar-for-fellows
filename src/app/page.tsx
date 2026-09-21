"use client";

import Link from "next/link";
import { useMemo } from "react";
import BookCover from "@/components/BookCover";
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
  12: "Need / Need to",
  13: "Seem / Seem to",
  14: "Want / Want to / Want (Obj) to",
  15: "Would like / Would like to / Would like (Obj) to",
  16: "Going to",
  17: "There is / There are",
  18: "There was / There were",
  19: "Although / In spite of",
  20: "Too … to",
  21: "So … that",
  22: "Too … to ↔ So … that",
  23: "Such … that",
  24: "So … that ↔ Such … that",
  25: "Double Comparatives (…တစ်လေ …တစ်လေ)",
  26: "Either … or",
  27: "Neither … nor",
  28: "Both … and",
  29: "Not only … but also",
  30: "As soon as",
  31: "No sooner … than",
  32: "If … not ↔ Unless",
  33: "Nouns: Countable and Uncountable",
  34: "A / an, the, no article",
  35: "Relative Pronouns",
  36: "Adverbs of Frequency",
  37: "Prepositions of Time",
  38: "Prepositions of Place",
  39: "Some, Any, A/An",
  40: "Much, Many, A Lot (of)",
  41: "Present Perfect with ever, never, just, already and yet",
  42: "Three Degrees of Adjectives",
  43: "Active and Passive Voice",
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
  12: "Learn when to use 'need' and 'need to' to express necessity.",
  13: "Use 'seem' and 'seem to' to describe appearances and how things look.",
  14: "Express desires with 'want', 'want to', and 'want (obj) to'.",
  15: "Make polite requests and wishes with 'would like' and its variations.",
  16: "Use 'going to' for future plans and predictions based on evidence.",
  17: "Learn to use 'there is' and 'there are' to talk about things that exist.",
  18: "Learn to use 'there was' and 'there were' to talk about things in the past.",
  19: "Use 'although' and 'in spite of' to show contrast between ideas.",
  20: "Use 'too ... to' to express undesirable excess and negative meaning.",
  21: "Use 'so + adjective/adverb + that + result' to show cause and effect.",
  22: "Transform sentences between 'too … to' and 'so … that' structures.",
  23: "Use 'such + a/an + adjective + noun + that + result' to give reasons.",
  24: "Transform sentences between 'so … that' and 'such … that' structures.",
  25: "Use 'the + comparative, the + comparative' to express cause and effect.",
  26: "Use 'either … or' to connect two alternatives.",
  27: "Use 'neither … nor' to connect negative alternatives.",
  28: "Use 'both … and' to connect two items together.",
  29: "Use 'not only … but also' to connect and emphasize two phrases.",
  30: "Use 'as soon as' to join two sentences showing immediate sequence.",
  31: "Combine two sentences using 'No sooner … than' with correct tense patterns.",
  32: "Convert between 'If … not' and 'Unless' and learn when not to use will/would.",
  33: "Learn the difference between countable and uncountable nouns.",
  34: "Master when to use a/an, the, or no article before nouns.",
  35: "Use who, which, that, whose, where, and when to join sentences and give more information.",
  36: "Learn to use always, usually, often, sometimes, hardly ever, and never to describe frequency.",
  37: "Master when to use in, on, and at with times, days, months, and years.",
  38: "Learn to use on, under, above, near, behind, in front of, next to, and in to describe positions.",
  39: "Learn when to use some, any, a, and an with countable and uncountable nouns.",
  40: "Learn when to use much, many, a lot of, and a lot to talk about quantities.",
  41: "Learn to use ever, never, just, already, and yet with the present perfect tense.",
  42: "Learn the Positive, Comparative, and Superlative degrees of adjectives.",
  43: "Learn to convert Active Voice to Passive Voice across eight different tenses.",
};

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e8e4df] p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-4">
        <span className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-[#faf8f5]" aria-hidden="true">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-2xl font-bold text-[#1a1f36] font-sans tabular-nums">{value}</p>
          <p className="text-xs font-medium text-[#8b8fa3] uppercase tracking-wider">{label}</p>
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
    ? "bg-[#2a9d8f] text-white"
    : status === "current"
      ? "bg-[#e76f51] text-white ring-4 ring-[#e76f51]/15"
      : status === "available"
        ? "bg-white border-2 border-[#e8e4df] text-[#8b8fa3]"
        : "bg-[#faf8f5] border-2 border-[#e8e4df] text-[#8b8fa3]/40";

  const isClickable = status !== "locked";

  return (
    <div className="flex items-start gap-4 path-connector">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${nodeColor}`}>
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
            <h3 className={`font-semibold text-sm sm:text-base ${status === "current" ? "text-[#e76f51]" : "text-[#1a1f36]"} group-hover:text-[#e76f51] transition-colors duration-200`}>
              {title}
            </h3>
            <p className="text-xs text-[#8b8fa3] mt-0.5">{questionCount} questions</p>
            {progress > 0 && (
              <div className="mt-2 max-w-xs">
                <ProgressBar current={answeredCount} total={questionCount} />
              </div>
            )}
          </Link>
        ) : (
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-[#8b8fa3]/50">{title}</h3>
            <p className="text-xs text-[#8b8fa3]/40 mt-0.5">Coming soon</p>
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
    <div className="bg-white rounded-2xl border border-[#e8e4df] p-6 sm:p-8 shadow-sm animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#e76f51]/10">
          <svg className="w-3.5 h-3.5 text-[#e76f51]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
        <span className="text-sm font-semibold text-[#e76f51] uppercase tracking-wider">
          {completed ? "Review" : "Continue Learning"}
        </span>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-[#1a1f36] mb-2 font-serif">
        Unit {unit}: {title}
      </h2>
      <p className="text-sm text-[#8b8fa3] mb-4">
        {completed
          ? `You scored ${answered} points. Review your answers or retry.`
          : `${answered} of ${total} questions answered`}
      </p>
      {!completed && (
        <div className="mb-5">
          <div className="w-full h-2 bg-[#f0eeeb] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#2a9d8f] progress-fill transition-all duration-300"
              style={{ width: `${total > 0 ? Math.round((answered / total) * 100) : 0}%` }}
            />
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/${slug}/practice`}
          className="inline-flex items-center justify-center gap-2 bg-[#e76f51] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#d4603f] transition-all duration-200 shadow-sm text-sm focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2"
        >
          {completed ? "Retry Practice" : "Continue Practice"}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        <Link
          href={`/${slug}`}
          className="inline-flex items-center justify-center gap-2 bg-[#faf8f5] text-[#1a1f36] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#f0eeeb] transition-all duration-200 text-sm focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2"
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
    <div className="bg-white rounded-2xl border border-[#e8e4df] shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold flex-shrink-0 ${
              completed
                ? "bg-[#f0faf9] text-[#2a9d8f]"
                : answered > 0
                  ? "bg-[#fff4f1] text-[#e76f51]"
                  : "bg-[#faf8f5] text-[#8b8fa3]"
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
              <h3 className="font-bold text-[#1a1f36] text-sm sm:text-base leading-tight">{title}</h3>
              <p className="text-xs text-[#8b8fa3] mt-0.5">{total} questions</p>
            </div>
          </div>
          {completed && score && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2a9d8f] bg-[#f0faf9] px-2.5 py-1 rounded-full border border-[#2a9d8f]/20 flex-shrink-0">
              {accuracy}%
            </span>
          )}
        </div>

        <p className="text-xs text-[#8b8fa3] mb-4 leading-relaxed line-clamp-2">{description}</p>

        {answered > 0 && (
          <div className="mb-4">
            <ProgressBar current={answered} total={total} />
          </div>
        )}

        <div className="flex gap-2">
          <Link
            href={`/${slug}/practice`}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 text-sm focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2 ${
              completed
                ? "bg-white text-[#2a9d8f] border-2 border-[#2a9d8f]/20 hover:bg-[#f0faf9] hover:border-[#2a9d8f]/40"
                : "bg-[#e76f51] text-white hover:bg-[#d4603f]"
            }`}
          >
            {completed ? "Review" : answered > 0 ? "Continue" : "Start"}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href={`/${slug}`}
            className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl border-2 border-[#e8e4df] text-[#8b8fa3] hover:bg-[#faf8f5] hover:border-[#e76f51]/30 transition-all duration-200 text-sm focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2"
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
    for (let u = 1; u <= 43; u++) {
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
    for (let u = 1; u <= 43; u++) {
      if (!isUnitAvailable(u)) continue;
      const p = allProgress[String(u)];
      if (!p || (!p.completed && p.answered > 0)) {
        return { unit: u, ...p };
      }
    }
    for (let u = 1; u <= 43; u++) {
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
    return Array.from({ length: 43 }, (_, i) => {
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
    <div className="min-h-screen" style={{ backgroundColor: "#faf8f5" }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #faf8f5 0%, #f5f0eb 50%, #faf8f5 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#e76f51] blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#2a9d8f] blur-3xl -translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1a1f36] leading-tight tracking-tight mb-5">
                English that feels clear.
              </h1>
              <p className="text-base sm:text-lg text-[#8b8fa3] max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Master English grammar through understanding, practice, and memory. 43 structured units with interactive exercises and Myanmar translations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 bg-[#e76f51] text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-[#d4603f] transition-all duration-200 shadow-sm text-sm focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2"
                >
                  Start Learning
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <button
                  onClick={() => document.getElementById("all-units")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#1a1f36] font-semibold px-7 py-3.5 rounded-xl hover:bg-[#f0eeeb] border border-[#e8e4df] transition-all duration-200 text-sm focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2"
                >
                  View All Units
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-shrink-0 animate-scale-in hidden sm:block">
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-br from-[#e76f51]/10 via-transparent to-[#2a9d8f]/10 rounded-3xl blur-2xl" />
                <div className="relative" style={{ perspective: "1200px" }}>
                  <div style={{ transform: "rotateY(-4deg) rotateX(2deg)" }}>
                    <BookCover className="w-56 sm:w-64 lg:w-72" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Continue Learning Card */}
        {continueData && (
          <section className="mt-10 mb-8" aria-label="Continue learning">
            <ContinueCard {...continueData} />
          </section>
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10 mt-8" aria-label="Learning statistics">
          <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
            <StatCard
              icon={<svg className="w-5 h-5 text-[#e76f51]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Day Streak"
              value={streak}
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "50ms" }}>
            <StatCard
              icon={<svg className="w-5 h-5 text-[#2a9d8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
              label="Questions"
              value={stats.totalAnswered}
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <StatCard
              icon={<svg className="w-5 h-5 text-[#2a9d8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Accuracy"
              value={`${stats.accuracy}%`}
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
            <StatCard
              icon={<svg className="w-5 h-5 text-[#1a1f36]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
              label="Completed"
              value={`${stats.totalCompleted}/43`}
            />
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-10" aria-label="Quick links">
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/"
              className="group bg-white rounded-2xl border border-[#e8e4df] p-6 hover:shadow-md transition-all duration-300 animate-fade-in"
              style={{ animationDelay: "0ms" }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#fff4f1] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-5 h-5 text-[#e76f51]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-[#1a1f36] mb-1 font-serif">Grammar Guides</h3>
              <p className="text-sm text-[#8b8fa3]">43 structured units covering all essential grammar topics</p>
            </Link>
            <Link
              href="/"
              className="group bg-white rounded-2xl border border-[#e8e4df] p-6 hover:shadow-md transition-all duration-300 animate-fade-in"
              style={{ animationDelay: "50ms" }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#f0faf9] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-5 h-5 text-[#2a9d8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#1a1f36] mb-1 font-serif">Practice Exercises</h3>
              <p className="text-sm text-[#8b8fa3]">Interactive questions with instant feedback and explanations</p>
            </Link>
            <Link
              href="/about"
              className="group bg-white rounded-2xl border border-[#e8e4df] p-6 hover:shadow-md transition-all duration-300 animate-fade-in"
              style={{ animationDelay: "100ms" }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#faf8f5] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-5 h-5 text-[#1a1f36]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#1a1f36] mb-1 font-serif">Audio & Resources</h3>
              <p className="text-sm text-[#8b8fa3]">Additional learning materials and pronunciation guides</p>
            </Link>
          </div>
        </section>

        {/* Learning Path */}
        <section className="mb-10" aria-labelledby="path-heading">
          <h2 id="path-heading" className="text-lg font-bold text-[#1a1f36] mb-5 flex items-center gap-2 font-serif">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#fff4f1]">
              <svg className="w-4 h-4 text-[#e76f51]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </span>
            Learning Path
          </h2>
          <div className="bg-white rounded-2xl border border-[#e8e4df] p-5 sm:p-6 shadow-sm">
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
        <section id="all-units" aria-labelledby="units-heading">
          <h2 id="units-heading" className="text-lg font-bold text-[#1a1f36] mb-5 flex items-center gap-2 font-serif">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#f0faf9]">
              <svg className="w-4 h-4 text-[#2a9d8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
            All Units
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 43 }, (_, i) => i + 1).map((u) => {
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
