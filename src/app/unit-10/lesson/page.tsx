"use client";

import Link from "next/link";
import { getLessonsData } from "@/lib/data";

const UNIT = 10;

export default function Unit10LessonPage() {
  const data = getLessonsData(UNIT);
  const [obligationLesson, prohibitionLesson, questionLesson, notesLesson] = data.lessons;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
      <Link
        href="/unit-10"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mb-5 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded-lg px-1 -ml-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Unit Overview
      </Link>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mb-8 tracking-tight">
        Grammar Lesson
      </h1>

      {/* Must for Strong Obligation */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm" aria-labelledby="obligation-heading">
        <h2 id="obligation-heading" className="text-xl font-bold text-ink mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 text-sm font-bold flex items-center justify-center border border-primary-100" aria-hidden="true">1</span>
          {obligationLesson.title}
        </h2>
        <p className="text-ink-light mb-4 leading-relaxed">{obligationLesson.content}</p>
        {obligationLesson.details && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Concept</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Example</th>
                </tr>
              </thead>
              <tbody>
                {obligationLesson.details.map((d, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0 hover:bg-surface-alt/50 transition-colors duration-150">
                    <td className="px-4 py-3 font-semibold text-ink">{d.concept ?? ""}</td>
                    <td className="px-4 py-3">
                      <span className="text-ink block">{d.example ?? ""}</span>
                      <span className="myanmar-text text-ink-muted text-xs block mt-0.5">{d.burmese ?? ""}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Mustn't for Prohibition */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm" aria-labelledby="prohibition-heading">
        <h2 id="prohibition-heading" className="text-xl font-bold text-ink mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-accent-50 text-accent-500 text-sm font-bold flex items-center justify-center border border-accent-100" aria-hidden="true">2</span>
          {prohibitionLesson.title}
        </h2>
        <p className="text-ink-light mb-4 leading-relaxed">{prohibitionLesson.content}</p>
        {prohibitionLesson.details && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Concept</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Example</th>
                </tr>
              </thead>
              <tbody>
                {prohibitionLesson.details.map((d, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0 hover:bg-surface-alt/50 transition-colors duration-150">
                    <td className="px-4 py-3 font-semibold text-ink">{d.concept ?? ""}</td>
                    <td className="px-4 py-3">
                      <span className="text-ink block">{d.example ?? ""}</span>
                      <span className="myanmar-text text-ink-muted text-xs block mt-0.5">{d.burmese ?? ""}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Must in Questions */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm" aria-labelledby="question-heading">
        <h2 id="question-heading" className="text-xl font-bold text-ink mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-info-50 text-info-600 text-sm font-bold flex items-center justify-center border border-info-500/20" aria-hidden="true">3</span>
          {questionLesson.title}
        </h2>
        <p className="text-ink-light mb-4 leading-relaxed">{questionLesson.content}</p>
        {questionLesson.details && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Concept</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Example</th>
                </tr>
              </thead>
              <tbody>
                {questionLesson.details.map((d, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0 hover:bg-surface-alt/50 transition-colors duration-150">
                    <td className="px-4 py-3 font-semibold text-ink">{d.concept ?? ""}</td>
                    <td className="px-4 py-3">
                      <span className="text-ink block">{d.example ?? ""}</span>
                      <span className="myanmar-text text-ink-muted text-xs block mt-0.5">{d.burmese ?? ""}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Important Notes */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-8 shadow-sm" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="text-xl font-bold text-ink mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-success-50 text-success-600 text-sm font-bold flex items-center justify-center border border-success-500/20" aria-hidden="true">4</span>
          {notesLesson.title}
        </h2>
        <p className="text-ink-light mb-4 leading-relaxed">{notesLesson.content}</p>
        {notesLesson.details && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Concept</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Example</th>
                </tr>
              </thead>
              <tbody>
                {notesLesson.details.map((d, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0 hover:bg-surface-alt/50 transition-colors duration-150">
                    <td className="px-4 py-3 font-semibold text-ink">{d.concept ?? ""}</td>
                    <td className="px-4 py-3">
                      <span className="text-ink block">{d.example ?? ""}</span>
                      <span className="myanmar-text text-ink-muted text-xs block mt-0.5">{d.burmese ?? ""}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="flex justify-center">
        <Link
          href="/unit-10/practice"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 text-sm sm:text-base"
        >
          Start Practice
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
