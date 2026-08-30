"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import MultipleChoice from "@/components/MultipleChoice";
import Feedback from "@/components/Feedback";
import { getAllQuestions, getTotalPoints } from "@/lib/data";
import { recordAnswer, completeUnit } from "@/lib/progress";
import { useSavedAnswersJson, useProgressCompletedAt } from "@/lib/hooks";
import type { ExerciseQuestion, UserAnswer } from "@/lib/types";

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/[.,!?;:'"]/g, "").replace(/\s+/g, " ");
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

  const current: ExerciseQuestion | undefined = allQuestions[currentIndex];
  const currentAnswer = current ? answers[current.id] ?? null : null;
  const isSubmitted = current ? !!submitted[current.id] : false;

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
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-slate-600">No questions available.</p>
        <Link href="/unit-1" className="text-indigo-600 mt-4 inline-block">
          ← Back to Unit
        </Link>
      </div>
    );
  }

  const canSubmit = currentAnswer !== null && currentAnswer.trim() !== "" && !isSubmitted;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/unit-1" className="text-sm text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
        ← Back to Unit Overview
      </Link>

      <div className="mb-6">
        <ProgressBar current={currentIndex + 1} total={total} label={`Question ${currentIndex + 1} of ${total}`} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-6">
        <MultipleChoice
          question={current.question}
          options={current.options ?? []}
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

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <div className="flex gap-2">
          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Check Answer
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              {currentIndex < total - 1 ? "Next Question →" : "See Results →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
