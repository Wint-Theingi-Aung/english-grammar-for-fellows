"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import MultipleChoice from "@/components/MultipleChoice";
import Feedback from "@/components/Feedback";
import { getAllQuestions, getTotalPoints, getExercisesData } from "@/lib/data";
import { recordAnswer, completeUnit } from "@/lib/progress";
import { useSavedAnswersJson, useProgressCompletedAt } from "@/lib/hooks";
import { saveExerciseAttempt, saveLessonProgress } from "@/app/actions/progress";
import type { ExerciseQuestion, UserAnswer } from "@/lib/types";

const ANON_ID_KEY = "grammar-fellows-anon-id";

function getAnonymousId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(ANON_ID_KEY);
    if (!id) {
      id = crypto.randomUUID().replace(/-/g, "").slice(0, 24);
      localStorage.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/[.,!?;:'"]/g, "").replace(/\s+/g, " ");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parseSavedAnswers(json: string): { byId: Record<number, string>; submittedIds: Set<number> } {
  const saved: UserAnswer[] = JSON.parse(json);
  const byId: Record<number, string> = {};
  const submittedIds = new Set<number>();
  for (const a of saved) {
    byId[a.questionId] = a.answer;
    submittedIds.add(a.questionId);
  }
  return { byId, submittedIds };
}

interface PracticePageProps {
  unit: number;
  unitSlug: string;
}

const GRAMMAR_TIPS = [
  "Use 'a' before consonant sounds and 'an' before vowel sounds.",
  "Subject-verb agreement: A singular subject needs a singular verb.",
  "Use the active voice for clearer, more direct writing.",
  "When listing three or more items, use commas to separate them.",
  "Use 'its' for possession and 'it's' as a contraction of 'it is'.",
  "Avoid double negatives: they make sentences confusing.",
  "Use 'who' for subjects and 'whom' for objects.",
];

export default function PracticePage({ unit, unitSlug }: PracticePageProps) {
  const router = useRouter();
  const allQuestions = useMemo(() => getAllQuestions(unit), [unit]);
  const totalPoints = useMemo(() => getTotalPoints(unit), [unit]);
  const total = allQuestions.length;

  const savedJson = useSavedAnswersJson(unit);
  const completedAt = useProgressCompletedAt(unit);
  const isRetry = completedAt !== "";

  const saved = useMemo(() => parseSavedAnswers(savedJson), [savedJson]);

  const [currentIndex, setCurrentIndex] = useState(() => {
    if (isRetry) return 0;
    const firstUnanswered = allQuestions.findIndex((q) => !saved.submittedIds.has(q.id));
    return firstUnanswered >= 0 ? firstUnanswered : 0;
  });

  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    return isRetry ? {} : saved.byId;
  });
  const [submitted, setSubmitted] = useState<Record<number, boolean>>(() => {
    if (isRetry) return {};
    const obj: Record<number, boolean> = {};
    saved.submittedIds.forEach((id) => { obj[id] = true; });
    return obj;
  });

  const [shuffleSeed] = useState(() => Math.random());

  const current: ExerciseQuestion | undefined = allQuestions[currentIndex];
  const currentAnswer = current ? answers[current.id] ?? null : null;
  const isSubmitted = current ? !!submitted[current.id] : false;

  const shuffledOptions = useMemo(() => {
    if (!current?.options) return [];
    return shuffle(current.options);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, shuffleSeed]);

  const isCorrect = useCallback(
    (q: ExerciseQuestion, a: string): boolean => {
      return normalize(a) === normalize(q.answer);
    },
    []
  );

  const handleSelect = (answer: string) => {
    if (!current || isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [current.id]: answer }));
  };

  const handleSubmit = () => {
    if (!current || !currentAnswer || isSubmitted) return;
    const correct = isCorrect(current, currentAnswer);
    const userAnswer: UserAnswer = {
      questionId: current.id,
      answer: currentAnswer,
      isCorrect: correct,
    };
    recordAnswer(unit, userAnswer);
    setSubmitted((prev) => ({ ...prev, [current.id]: true }));

    const anonId = getAnonymousId();
    if (anonId) {
      const exercises = getExercisesData(unit).exercises;
      const exerciseId = exercises.find((ex) =>
        ex.questions.some((q) => q.id === current.id)
      )?.id ?? `unit${unit}-ex1`;
      saveExerciseAttempt({
        anonymousId: anonId,
        exerciseId,
        questionId: current.id,
        selectedAnswer: currentAnswer,
        correctAnswer: current.answer,
        isCorrect: correct,
        score: correct ? current.points : 0,
        totalPoints: current.points,
      }).catch(() => {});
    }
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const userAnswers: UserAnswer[] = allQuestions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] ?? "",
        isCorrect: isCorrect(q, answers[q.id] ?? ""),
      }));
      const score = userAnswers
        .filter((a) => a.isCorrect)
        .reduce((sum, a) => {
          const q = allQuestions.find((qq) => qq.id === a.questionId);
          return sum + (q?.points ?? 0);
        }, 0);
      completeUnit(unit, score, totalPoints);

      const anonId = getAnonymousId();
      if (anonId) {
        const completedCount = userAnswers.filter((a) => a.isCorrect).length;
        saveLessonProgress({
          anonymousId: anonId,
          unit,
          completedExercises: completedCount,
          totalScore: score,
          bestScore: score,
        }).catch(() => {});
      }

      router.push(`/${unitSlug}/result`);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!current) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-center">
        <p className="text-[#6b7194] font-sans">No questions available.</p>
        <Link
          href={`/${unitSlug}`}
          className="text-[#e76f51] mt-4 inline-block font-medium hover:text-[#d4613f] transition-colors duration-200 font-sans"
        >
          &larr; Back to Unit
        </Link>
      </div>
    );
  }

  const canSubmit = currentAnswer !== null && currentAnswer.trim() !== "" && !isSubmitted;
  const tipIndex = currentIndex % GRAMMAR_TIPS.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
      <Link
        href={`/${unitSlug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#e76f51] hover:text-[#d4613f] mb-6 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2 rounded-lg px-1 -ml-1 font-sans"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Unit Overview
      </Link>

      <div className="flex gap-8">
        {/* Main content area */}
        <div className="flex-1 min-w-0">
          {/* Progress and question info */}
          <div className="mb-8">
            <ProgressBar current={currentIndex + 1} total={total} />
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center gap-2 bg-[#e8e4df] text-[#1a1f36] font-serif font-bold text-sm px-3.5 py-1.5 rounded-lg">
              Q {currentIndex + 1} of {total}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#fdf0ec] text-[#e76f51] font-sans font-semibold text-xs px-3 py-1.5 rounded-lg">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {current.points} pt{current.points !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Question card */}
          <div className="bg-white rounded-2xl border border-[#e8e4df] p-6 sm:p-8 mb-8 shadow-sm">
            <MultipleChoice
              question={current.question}
              options={shuffledOptions}
              selectedAnswer={currentAnswer}
              isSubmitted={isSubmitted}
              correctAnswer={current.answer}
              onSelect={handleSelect}
            />

            {isSubmitted && current && (
              <Feedback
                isCorrect={isCorrect(current, currentAnswer ?? "")}
                selectedAnswer={currentAnswer}
                correctAnswer={current.answer}
                explanation={current.explanation}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border-2 border-[#e8e4df] text-[#6b7194] font-sans font-medium hover:bg-[#f5f3f0] hover:border-[#d4d0c9] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent focus-visible:ring-2 focus-visible:ring-[#2a9d8f] focus-visible:ring-offset-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex gap-3">
              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="px-6 py-2.5 rounded-xl bg-[#e76f51] text-white font-sans font-semibold hover:bg-[#d4613f] transition-all duration-200 shadow-md shadow-[#e76f51]/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2 text-sm"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-[#e76f51] text-white font-sans font-semibold hover:bg-[#d4613f] transition-all duration-200 shadow-md shadow-[#e76f51]/20 focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2 text-sm"
                >
                  {currentIndex < total - 1 ? (
                    <span className="inline-flex items-center gap-1.5">
                      Next Question
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      See Results
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - desktop only */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-8">
            <div className="bg-white rounded-2xl border border-[#e8e4df] p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#e6f5f3]">
                  <svg className="w-4.5 h-4.5 text-[#2a9d8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                <h3 className="font-serif font-bold text-[#1a1f36] text-sm">Grammar Tip</h3>
              </div>
              <p className="text-sm text-[#3d4263] font-sans leading-relaxed">
                {GRAMMAR_TIPS[tipIndex]}
              </p>
            </div>

            <div className="mt-4 bg-white rounded-2xl border border-[#e8e4df] p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#fdf0ec]">
                  <svg className="w-4.5 h-4.5 text-[#e76f51]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <h3 className="font-serif font-bold text-[#1a1f36] text-sm">Progress</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-[#6b7194]">Answered</span>
                  <span className="font-semibold text-[#1a1f36]">{Object.keys(submitted).length}/{total}</span>
                </div>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-[#6b7194]">Points</span>
                  <span className="font-semibold text-[#2a9d8f]">
                    {allQuestions.filter((q) => submitted[q.id]).reduce((sum, q) => sum + q.points, 0)}/{totalPoints}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
