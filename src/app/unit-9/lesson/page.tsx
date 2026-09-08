"use client";

import Link from "next/link";
import { getLessonsData } from "@/lib/data";

const UNIT = 9;

export default function Unit9LessonPage() {
  const data = getLessonsData(UNIT);
  const [possibilityLesson, permissionLesson, wishesLesson, reportedLesson, lessPossibilityLesson] = data.lessons;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
      <Link
        href="/unit-9"
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

      {/* May for Possibility */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm" aria-labelledby="possibility-heading">
        <h2 id="possibility-heading" className="text-xl font-bold text-ink mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 text-sm font-bold flex items-center justify-center border border-primary-100" aria-hidden="true">1</span>
          {possibilityLesson.title}
        </h2>
        <p className="text-ink-light mb-4 leading-relaxed">{possibilityLesson.content}</p>
        {possibilityLesson.details && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Concept</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Example</th>
                </tr>
              </thead>
              <tbody>
                {possibilityLesson.details.map((d, i) => (
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

      {/* May for Permission */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm" aria-labelledby="permission-heading">
        <h2 id="permission-heading" className="text-xl font-bold text-ink mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-accent-50 text-accent-500 text-sm font-bold flex items-center justify-center border border-accent-100" aria-hidden="true">2</span>
          {permissionLesson.title}
        </h2>
        <p className="text-ink-light mb-4 leading-relaxed">{permissionLesson.content}</p>
        {permissionLesson.details && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Concept</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Example</th>
                </tr>
              </thead>
              <tbody>
                {permissionLesson.details.map((d, i) => (
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

      {/* May for Wishes */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm" aria-labelledby="wishes-heading">
        <h2 id="wishes-heading" className="text-xl font-bold text-ink mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-info-50 text-info-600 text-sm font-bold flex items-center justify-center border border-info-500/20" aria-hidden="true">3</span>
          {wishesLesson.title}
        </h2>
        <p className="text-ink-light mb-4 leading-relaxed">{wishesLesson.content}</p>
        {wishesLesson.details && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Concept</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Example</th>
                </tr>
              </thead>
              <tbody>
                {wishesLesson.details.map((d, i) => (
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

      {/* Might in Reported Speech */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm" aria-labelledby="reported-heading">
        <h2 id="reported-heading" className="text-xl font-bold text-ink mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 text-sm font-bold flex items-center justify-center border border-primary-100" aria-hidden="true">4</span>
          {reportedLesson.title}
        </h2>
        <p className="text-ink-light mb-4 leading-relaxed">{reportedLesson.content}</p>
        {reportedLesson.details && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Concept</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Example</th>
                </tr>
              </thead>
              <tbody>
                {reportedLesson.details.map((d, i) => (
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

      {/* Might for Less Possibility */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-8 shadow-sm" aria-labelledby="less-heading">
        <h2 id="less-heading" className="text-xl font-bold text-ink mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-success-50 text-success-600 text-sm font-bold flex items-center justify-center border border-success-500/20" aria-hidden="true">5</span>
          {lessPossibilityLesson.title}
        </h2>
        <p className="text-ink-light mb-4 leading-relaxed">{lessPossibilityLesson.content}</p>
        {lessPossibilityLesson.details && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Concept</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Example</th>
                </tr>
              </thead>
              <tbody>
                {lessPossibilityLesson.details.map((d, i) => (
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
          href="/unit-9/practice"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 text-sm sm:text-base"
        >
          Start Practice
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
