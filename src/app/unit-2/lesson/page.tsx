"use client";

import Link from "next/link";
import { getLessonsData } from "@/lib/data";

const FORM_BADGES: Record<string, string> = {
  Affirmative: "form-badge-affirmative",
  Negative: "form-badge-negative",
  Interrogative: "form-badge-interrogative",
  "Neg. Interrogative": "form-badge-neg-interrogative",
  "Negative Interrogative": "form-badge-neg-interrogative",
};

function FormBadge({ form }: { form: string }) {
  const cls = FORM_BADGES[form] || "bg-surface-alt text-ink-muted";
  return <span className={`form-badge ${cls}`}>{form}</span>;
}

const UNIT = 2;

export default function Unit2LessonPage() {
  const data = getLessonsData(UNIT);
  const [presentLesson, pastLesson, formsLesson, answerLesson, agreementLesson] = data.lessons;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
      <Link
        href="/unit-2"
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

      {/* am, is, are in Simple Present */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm" aria-labelledby="present-heading">
        <h2 id="present-heading" className="text-xl font-bold text-ink mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 text-sm font-bold flex items-center justify-center border border-primary-100" aria-hidden="true">1</span>
          {presentLesson.title}
        </h2>
        <p className="text-ink-light mb-4 leading-relaxed">{presentLesson.content}</p>
        {presentLesson.conjugation && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[400px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Subject</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-success-600 text-xs uppercase tracking-wider border-b border-border">Present</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-error-600 text-xs uppercase tracking-wider border-b border-border">Past</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-info-600 text-xs uppercase tracking-wider border-b border-border">Future</th>
                </tr>
              </thead>
              <tbody>
                {presentLesson.conjugation.map((c, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0 hover:bg-surface-alt/50 transition-colors duration-150">
                    <td className="px-4 py-3 font-semibold text-ink">{c.subject}</td>
                    <td className="px-4 py-3 text-ink-light">{c.present}</td>
                    <td className="px-4 py-3 text-ink-light">{c.past}</td>
                    <td className="px-4 py-3 text-ink-light">{c.future}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* was, were in Simple Past */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm" aria-labelledby="past-heading">
        <h2 id="past-heading" className="text-xl font-bold text-ink mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-accent-50 text-accent-500 text-sm font-bold flex items-center justify-center border border-accent-100" aria-hidden="true">2</span>
          {pastLesson.title}
        </h2>
        <p className="text-ink-light mb-4 leading-relaxed">{pastLesson.content}</p>
        {pastLesson.details && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Tense</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Form</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Example</th>
                </tr>
              </thead>
              <tbody>
                {pastLesson.details.map((d, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0 hover:bg-surface-alt/50 transition-colors duration-150">
                    <td className="px-4 py-3 font-semibold text-ink">{d.tense}</td>
                    <td className="px-4 py-3 text-ink-light font-mono text-xs">{d.form}</td>
                    <td className="px-4 py-3">
                      <span className="text-ink block">{d.example}</span>
                      <span className="myanmar-text text-ink-muted text-xs block mt-0.5">{d.burmese}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Sentence Forms */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm" aria-labelledby="forms-heading">
        <h2 id="forms-heading" className="text-xl font-bold text-ink mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-info-50 text-info-600 text-sm font-bold flex items-center justify-center border border-info-500/20" aria-hidden="true">3</span>
          {formsLesson.title}
        </h2>
        <p className="text-ink-light mb-4 leading-relaxed">{formsLesson.content}</p>
        {formsLesson.forms && (
          <div className="space-y-2.5">
            {Object.entries(formsLesson.forms).map(([key, value]) => {
              const label = key.replace(/_/g, " ");
              return (
                <div key={key} className="flex items-start gap-3 bg-surface-alt/50 rounded-xl px-4 py-3">
                  <FormBadge form={label} />
                  <span className="text-ink-light leading-relaxed text-sm pt-0.5">{value}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Short Answers */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm" aria-labelledby="answers-heading">
        <h2 id="answers-heading" className="text-xl font-bold text-ink mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 text-sm font-bold flex items-center justify-center border border-primary-100" aria-hidden="true">4</span>
          {answerLesson.title}
        </h2>
        <p className="text-ink-light mb-4 leading-relaxed">{answerLesson.content}</p>
        {answerLesson.answer_types && (
          <div className="space-y-2.5">
            {Object.entries(answerLesson.answer_types).map(([key, value]) => (
              <div key={key} className="bg-surface-alt/50 rounded-xl px-4 py-3">
                <span className="font-bold text-ink text-sm capitalize">
                  {key.replace(/_/g, " ")}:
                </span>{" "}
                <span className="text-ink-light text-sm">{value}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Subject-Verb Agreement */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-8 shadow-sm" aria-labelledby="agreement-heading">
        <h2 id="agreement-heading" className="text-xl font-bold text-ink mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-success-50 text-success-600 text-sm font-bold flex items-center justify-center border border-success-500/20" aria-hidden="true">5</span>
          {agreementLesson.title}
        </h2>
        <p className="text-ink-light mb-4 leading-relaxed">{agreementLesson.content}</p>
        {agreementLesson.conjugation && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[400px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-ink-muted text-xs uppercase tracking-wider border-b border-border">Subject</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-success-600 text-xs uppercase tracking-wider border-b border-border">Present</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-error-600 text-xs uppercase tracking-wider border-b border-border">Past</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-info-600 text-xs uppercase tracking-wider border-b border-border">Future</th>
                </tr>
              </thead>
              <tbody>
                {agreementLesson.conjugation.map((c, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0 hover:bg-surface-alt/50 transition-colors duration-150">
                    <td className="px-4 py-3 font-semibold text-ink">{c.subject}</td>
                    <td className="px-4 py-3 text-ink-light">{c.present}</td>
                    <td className="px-4 py-3 text-ink-light">{c.past}</td>
                    <td className="px-4 py-3 text-ink-light">{c.future}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="flex justify-center">
        <Link
          href="/unit-2/practice"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 text-sm sm:text-base"
        >
          Start Practice
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
