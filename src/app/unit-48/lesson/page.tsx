"use client";

import { useState } from "react";
import Link from "next/link";
import { getLessonsData } from "@/lib/data";

const UNIT = 48;

interface TranslationExample {
  number: number;
  topic: string;
  myanmarSegments: string[];
  englishSegments: string[];
  fullMyanmar: string;
  fullEnglish: string;
}

function getExamples(): TranslationExample[] {
  const data = getLessonsData(UNIT);
  return (data as unknown as { translationExamples: TranslationExample[] }).translationExamples ?? [];
}

export default function Unit48LessonPage() {
  const examples = getExamples();
  const total = examples.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [understood, setUnderstood] = useState<Record<number, boolean>>({});

  const current = examples[currentIndex];

  function handleNext() {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setShowTranslation(false);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setShowTranslation(false);
    }
  }

  function handleToggleUnderstood() {
    setUnderstood((prev) => ({ ...prev, [current.number]: !prev[current.number] }));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setShowTranslation((s) => !s);
    }
  }

  if (!current) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-center">
        <p className="text-ink-muted">No translation examples available.</p>
        <Link href="/unit-48" className="text-primary-600 mt-4 inline-block font-medium hover:text-primary-700 transition-colors">
          &larr; Back to Unit Overview
        </Link>
      </div>
    );
  }

  const understoodCount = Object.values(understood).filter(Boolean).length;

  return (
    <div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12"
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Translation Workshop"
    >
      {/* Back Link */}
      <Link href="/unit-48" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mb-5 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded-lg px-1 -ml-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to Unit Overview
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">Translation Workshop</h1>
          <p className="text-ink-muted text-sm mt-1">Myanmar to English &mdash; 14 source examples</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {understoodCount}/{total} understood
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={total} aria-label={`Example ${currentIndex + 1} of ${total}`}>
        <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
        <p className="text-xs text-ink-muted mt-2 text-center font-medium">
          Example {currentIndex + 1} of {total} &mdash; {current.topic}
        </p>
      </div>

      {/* Example Navigator Pills */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-8" role="tablist" aria-label="Example navigation">
        {examples.map((ex) => (
          <button
            key={ex.number}
            type="button"
            role="tab"
            aria-selected={ex.number === current.number}
            aria-label={`Example ${ex.number}: ${ex.topic}${understood[ex.number] ? " (understood)" : ""}`}
            onClick={() => {
              setCurrentIndex(ex.number - 1);
              setShowTranslation(false);
            }}
            className={`w-9 h-9 rounded-lg text-xs font-bold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
              ex.number === current.number
                ? "bg-primary-600 text-white shadow-md shadow-primary-600/20"
                : understood[ex.number]
                  ? "bg-success-50 text-success-700 border border-success-500/30"
                  : "bg-surface border border-border text-ink-muted hover:border-primary-300 hover:text-primary-600"
            }`}
          >
            {ex.number}
          </button>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden mb-8">
        {/* Card Header */}
        <div className="px-6 sm:px-8 py-4 border-b border-border bg-surface-alt/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-sm font-bold flex items-center justify-center shadow-sm">
                {current.number}
              </span>
              <div>
                <h2 className="font-bold text-ink text-lg">{current.topic}</h2>
                <p className="text-xs text-ink-muted">Example {current.number} of {total}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleUnderstood}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                understood[current.number]
                  ? "bg-success-50 text-success-700 border border-success-500/30"
                  : "bg-surface border border-border text-ink-muted hover:border-primary-300 hover:text-primary-600"
              }`}
              aria-pressed={understood[current.number] ?? false}
              aria-label={understood[current.number] ? "Mark as not understood" : "Mark as understood"}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {understood[current.number] ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
              {understood[current.number] ? "Understood" : "Mark as understood"}
            </button>
          </div>
        </div>

        {/* Myanmar Source */}
        <div className="px-6 sm:px-8 py-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Myanmar Source</span>
            <span className="text-xs text-ink-muted">(phrase divisions shown with /)</span>
          </div>
          <div
            className="myanmar-text text-ink text-base sm:text-lg leading-relaxed p-4 sm:p-5 rounded-xl bg-surface-alt/50 border border-border/50"
            lang="my"
          >
            {current.fullMyanmar.split(" // ").map((paragraph, pi) => (
              <span key={pi}>
                {pi > 0 && <><br /><br /></>}
                {paragraph.split(" / ").map((phrase, fi) => (
                  <span key={fi}>
                    {fi > 0 && <span className="text-primary-400 mx-0.5" aria-hidden="true">/</span>}
                    {phrase}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Show/Hide Translation */}
        <div className="px-6 sm:px-8 pb-4">
          <button
            type="button"
            onClick={() => setShowTranslation((s) => !s)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200"
            aria-expanded={showTranslation}
            aria-controls="translation-content"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {showTranslation ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              )}
            </svg>
            {showTranslation ? "Hide Translation" : "Show Translation"}
          </button>
        </div>

        {/* English Translation */}
        {showTranslation && (
          <div id="translation-content" className="px-6 sm:px-8 pb-6 animate-fade-in">
            {/* Full English Translation */}
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">English Translation</span>
              </div>
              <div className="text-ink text-sm sm:text-base leading-relaxed p-4 sm:p-5 rounded-xl bg-primary-50/50 border border-primary-100">
                {current.fullEnglish.split(" // ").map((paragraph, pi) => (
                  <span key={pi}>
                    {pi > 0 && <><br /><br /></>}
                    {paragraph.split(" / ").map((phrase, fi) => (
                      <span key={fi}>
                        {fi > 0 && <span className="text-primary-400 mx-0.5" aria-hidden="true">/</span>}
                        {phrase}
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border-2 border-border text-ink-muted font-medium hover:bg-surface-alt hover:border-border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 text-sm"
          aria-label="Previous example"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleToggleUnderstood}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
              understood[current.number]
                ? "bg-success-50 text-success-700 border border-success-500/30"
                : "bg-surface border border-border text-ink-muted hover:border-primary-300"
            }`}
            aria-pressed={understood[current.number] ?? false}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {understood[current.number] ? "Understood" : "Got it"}
          </button>
        </div>

        {currentIndex < total - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all duration-200 shadow-md shadow-primary-600/20 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 text-sm"
            aria-label="Next example"
          >
            Next
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <Link
            href="/unit-48/practice"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-all duration-200 shadow-md shadow-primary-600/20 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 text-sm"
          >
            Start Practice
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
