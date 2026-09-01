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

export default function PracticePage() {
  const router = useRouter();
  const allQuestions = useMemo(() => getAllQuestions(), []);
  const totalPoints = useMemo(() => getTotalPoints(), []);
  const total = allQuestions.length;

  const savedJson = useSavedAnswersJson();
  const completedAt = useProgressCompletedAt();
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
    recordAnswer(1, userAnswer);
    setSubmitted((prev) => ({ ...prev, [current.id]: true }));

    const anonId = getAnonymousId();
    if (anonId) {
      const exercises = getExercisesData().exercises;
      const exerciseId = exercises.find((ex) =>
        ex.questions.some((q) => q.id === current.id)
      )?.id ?? "unit1-ex1";
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
      completeUnit(1, score, totalPoints);

      const anonId = getAnonymousId();
      if (anonId) {
        const completedCount = userAnswers.filter((a) => a.isCorrect).length;
        saveLessonProgress({
          anonymousId: anonId,
          unit: 1,
          completedExercises: completedCount,
          totalScore: score,
          bestScore: score,
        }).catch(() => {});
      }

      router.push("/unit-1/result");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!current) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-center">
        <p className="text-ink-muted">No questions available.</p>
        <Link
          href="/unit-1"
          className="text-primary-600 mt-4 inline-block font-medium hover:text-primary-700 transition-colors duration-200"
        >
          &larr; Back to Unit
        </Link>
      </div>
    );
  }

  const canSubmit = currentAnswer !== null && currentAnswer.trim() !== "" && !isSubmitted;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
      <Link
        href="/unit-1"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mb-5 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded-lg px-1 -ml-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Unit Overview
      </Link>

      {/* Question counter */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-primary-600">
          Question {currentIndex + 1} of {total}
        </span>
        <span className="text-xs font-medium text-ink-muted bg-surface-alt px-2.5 py-1 rounded-full">
          {current.points} pt{current.points !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mb-6">
        <ProgressBar current={currentIndex + 1} total={total} />
      </div>

      {/* Question card */}
      <div className="bg-surface rounded-2xl border border-border p-5 sm:p-8 mb-6 shadow-sm animate-fade-in">
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
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border-2 border-border text-ink-muted font-medium hover:bg-surface-alt hover:border-primary-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <div className="flex gap-2">
          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 text-sm"
            >
              Check Answer
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 text-sm"
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
  );
}
