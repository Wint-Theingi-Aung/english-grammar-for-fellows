"use client";

import { useState } from "react";
import Link from "next/link";
import { getLessonsData } from "@/lib/data";

const UNIT = 49;

export default function Unit49LessonPage() {
  const data = getLessonsData(UNIT);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
      <Link href="/unit-49" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mb-5 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded-lg px-1 -ml-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to Unit Overview
      </Link>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mb-2 tracking-tight">Vocabulary — Topic-Based Lessons</h1>
      <p className="text-ink-muted mb-8 text-sm sm:text-base">31 vocabulary topics. Click a lesson to expand its word list.</p>

      <div className="space-y-2 mb-8">
        {data.lessons.map((lesson, i) => {
          const isOpen = openIndex === i;
          const details = (lesson as { details?: Array<{ word: string; meaning: string; burmese?: string }> }).details ?? [];
          return (
            <div key={lesson.id} className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-alt/50 transition-colors duration-150"
                aria-expanded={isOpen}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white text-xs font-bold flex items-center justify-center shadow-sm">{i + 1}</span>
                <span className="flex-1 font-bold text-ink text-sm sm:text-base">{lesson.title}</span>
                <span className="text-ink-muted text-xs">{details.length} words</span>
                <svg className={`w-5 h-5 text-ink-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 border-t border-border">
                  <p className="text-ink-muted text-sm mt-3 mb-3 leading-relaxed">{lesson.content}</p>
                  {details.length > 0 && (
                    <div className="overflow-x-auto -mx-4 px-4">
                      <table className="w-full text-sm border-collapse min-w-[320px]">
                        <thead>
                          <tr>
                            <th className="text-left px-3 py-2 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">#</th>
                            <th className="text-left px-3 py-2 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Word</th>
                            <th className="text-left px-3 py-2 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Meaning</th>
                          </tr>
                        </thead>
                        <tbody>
                          {details.map((d, j) => (
                            <tr key={j} className="border-b border-border last:border-b-0 hover:bg-surface-alt/50 transition-colors duration-150">
                              <td className="px-3 py-2 text-ink-muted text-xs">{j + 1}</td>
                              <td className="px-3 py-2 font-semibold text-ink">{d.word}</td>
                              <td className="px-3 py-2 text-ink-light">{d.meaning}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Link href="/unit-49/practice" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 text-sm sm:text-base">
          Start Practice<span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
