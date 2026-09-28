"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import MultipleChoice from "@/components/MultipleChoice";
import { getAllQuestions, getExercisesData } from "@/lib/data";
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

const UNIT = 50;
const UNIT_SLUG = "unit-50";

export default function Unit50PracticePage() {
  const router = useRouter();
  const allQuestions = useMemo(() => getAllQuestions(UNIT), []);
  const total = allQuestions.length;

  const savedJson = useSavedAnswersJson(UNIT);
  const completedAt = useProgressCompletedAt(UNIT);
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
  }, [current?.id, shuffleSeed]); // eslint-disable-line react-hooks/exhaustive-deps

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
    recordAnswer(UNIT, userAnswer);
    setSubmitted((prev) => ({ ...prev, [current.id]: true }));

    const anonId = getAnonymousId();
    if (anonId) {
      const exercises = getExercisesData(UNIT).exercises;
      const exerciseId = exercises.find((ex) =>
        ex.questions.some((q) => q.id === current.id)
      )?.id ?? `unit${UNIT}-ex1`;
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
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitAssessment = () => {
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
    const totalPoints = allQuestions.reduce((sum, q) => sum + q.points, 0);
    completeUnit(UNIT, score, totalPoints);

    const anonId = getAnonymousId();
    if (anonId) {
      const completedCount = userAnswers.filter((a) => a.isCorrect).length;
      saveLessonProgress({
        anonymousId: anonId,
        unit: UNIT,
        completedExercises: completedCount,
        totalScore: score,
        bestScore: score,
      }).catch(() => {});
    }

    router.push(`/${UNIT_SLUG}/result`);
  };

  // Auto-save progress
  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = setTimeout(() => {
      try {
        const answersToSave: UserAnswer[] = allQuestions
          .filter((q) => answers[q.id] !== undefined)
          .map((q) => ({
            questionId: q.id,
            answer: answers[q.id] ?? "",
            isCorrect: false,
          }));
        const existing = localStorage.getItem("grammar-fellows-progress");
        const all = existing ? JSON.parse(existing) : {};
        all[String(UNIT)] = {
          ...all[String(UNIT)],
          unit: UNIT,
          startedAt: all[String(UNIT)]?.startedAt ?? new Date().toISOString(),
          answers: answersToSave,
        };
        localStorage.setItem("grammar-fellows-progress", JSON.stringify(all));
      } catch {
        // silently ignore
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [answers, allQuestions]);

  if (!current) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-center">
        <p className="text-[#6b7194] font-sans">No questions available.</p>
        <Link
          href={`/${UNIT_SLUG}`}
          className="text-[#e76f51] mt-4 inline-block font-medium hover:text-[#d4613f] transition-colors duration-200 font-sans"
        >
          &larr; Back to Unit
        </Link>
      </div>
    );
  }

  const canSubmit = currentAnswer !== null && currentAnswer.trim() !== "" && !isSubmitted;
  const answeredCount = Object.keys(submitted).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
      <Link
        href={`/${UNIT_SLUG}`}
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
          {/* Progress bar */}
          <div className="mb-6">
            <ProgressBar current={answeredCount} total={total} label={`${answeredCount} / ${total} questions answered`} />
          </div>

          {/* Question info */}
          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center gap-2 bg-[#e8e4df] text-[#1a1f36] font-serif font-bold text-sm px-3.5 py-1.5 rounded-lg">
              Q {currentIndex + 1} of {total}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#fdf0ec] text-[#e76f51] font-sans font-semibold text-xs px-3 py-1.5 rounded-lg">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Assessment
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
                  Confirm Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex === total - 1}
                  className="px-6 py-2.5 rounded-xl bg-[#e76f51] text-white font-sans font-semibold hover:bg-[#d4613f] transition-all duration-200 shadow-md shadow-[#e76f51]/20 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#e76f51] focus-visible:ring-offset-2 text-sm"
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
                      Submit Assessment
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Submit assessment button - visible when all answered */}
          {answeredCount === total && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleSubmitAssessment}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#2a9d8f] to-[#3ab7a8] text-white font-sans font-bold hover:from-[#238b7e] hover:to-[#32a698] transition-all duration-200 shadow-md shadow-[#2a9d8f]/20 focus-visible:ring-2 focus-visible:ring-[#2a9d8f] focus-visible:ring-offset-2 text-sm"
              >
                Submit Assessment — See Results
              </button>
            </div>
          )}
        </div>

        {/* Sidebar - question navigator */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-8">
            <div className="bg-white rounded-2xl border border-[#e8e4df] p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#e6f5f3]">
                  <svg className="w-4.5 h-4.5 text-[#2a9d8f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </span>
                <h3 className="font-serif font-bold text-[#1a1f36] text-sm">Question Navigator</h3>
              </div>

              {/* Compact grid of question buttons */}
              <div className="grid grid-cols-10 gap-1 mb-4">
                {allQuestions.map((q, i) => {
                  const isCurrent = i === currentIndex;
                  const isAnswered = !!submitted[q.id];
                  let btnClass = "w-full aspect-square rounded text-[10px] font-sans font-bold transition-all duration-150 ";
                  if (isCurrent) {
                    btnClass += "bg-[#e76f51] text-white ring-2 ring-[#e76f51]/30";
                  } else if (isAnswered) {
                    btnClass += "bg-[#2a9d8f] text-white";
                  } else {
                    btnClass += "bg-[#f0ede8] text-[#6b7194] hover:bg-[#e8e4df]";
                  }
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(i)}
                      className={btnClass}
                      aria-label={`Question ${i + 1}${isCurrent ? ' (current)' : isAnswered ? ' (answered)' : ''}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 text-xs font-sans">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#f0ede8] border border-[#d4d0c9]" aria-hidden="true" />
                  <span className="text-[#6b7194]">Unanswered</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#2a9d8f]" aria-hidden="true" />
                  <span className="text-[#6b7194]">Answered</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#e76f51]" aria-hidden="true" />
                  <span className="text-[#6b7194]">Current</span>
                </span>
              </div>
            </div>

            {/* Progress summary */}
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
                  <span className="font-semibold text-[#1a1f36]">{answeredCount}/{total}</span>
                </div>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-[#6b7194]">Remaining</span>
                  <span className="font-semibold text-[#e76f51]">{total - answeredCount}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
