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
  const cls = FORM_BADGES[form] || "bg-slate-100 text-slate-600";
  return <span className={`form-badge ${cls}`}>{form}</span>;
}

export default function LessonPage() {
  const data = getLessonsData();
  const [verbLesson, conjugationLesson, formsLesson, answerLesson] = data.lessons;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
      <Link
        href="/unit-1"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mb-5 transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Unit Overview
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 tracking-tight">
        Grammar Lesson
      </h1>

      {/* Verb Forms Overview */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 text-sm font-bold flex items-center justify-center border border-primary-100">1</span>
          {verbLesson.title}
        </h2>
        <p className="text-slate-600 mb-4 leading-relaxed">{verbLesson.content}</p>
        {verbLesson.details && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[480px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wider border-b border-border">Tense</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wider border-b border-border">Form</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wider border-b border-border">Example</th>
                </tr>
              </thead>
              <tbody>
                {verbLesson.details.map((d, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0 hover:bg-surface-alt transition-colors duration-150">
                    <td className="px-4 py-3 font-semibold text-foreground">{d.tense}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-xs">{d.form}</td>
                    <td className="px-4 py-3">
                      <span className="text-foreground block">{d.example}</span>
                      <span className="myanmar-text text-slate-500 text-xs block mt-0.5">{d.burmese}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Subject-Verb Conjugation */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-accent-50 text-accent-600 text-sm font-bold flex items-center justify-center border border-accent-100">2</span>
          {conjugationLesson.title}
        </h2>
        <p className="text-slate-600 mb-4 leading-relaxed">{conjugationLesson.content}</p>
        {conjugationLesson.conjugation && (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse min-w-[400px]">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-500 text-xs uppercase tracking-wider border-b border-border">Subject</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-success-600 text-xs uppercase tracking-wider border-b border-border">Present</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-error-600 text-xs uppercase tracking-wider border-b border-border">Past</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-info-600 text-xs uppercase tracking-wider border-b border-border">Future</th>
                </tr>
              </thead>
              <tbody>
                {conjugationLesson.conjugation.map((c, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0 hover:bg-surface-alt transition-colors duration-150">
                    <td className="px-4 py-3 font-semibold text-foreground">{c.subject}</td>
                    <td className="px-4 py-3 text-slate-600">{c.present}</td>
                    <td className="px-4 py-3 text-slate-600">{c.past}</td>
                    <td className="px-4 py-3 text-slate-600">{c.future}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Sentence Forms */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-info-50 text-info-600 text-sm font-bold flex items-center justify-center border border-info-500/20">3</span>
          {formsLesson.title}
        </h2>
        <p className="text-slate-600 mb-4 leading-relaxed">{formsLesson.content}</p>
        {formsLesson.forms && (
          <div className="space-y-2.5">
            {Object.entries(formsLesson.forms).map(([key, value]) => {
              const label = key.replace(/_/g, " ");
              return (
                <div key={key} className="flex items-start gap-3 bg-surface-alt rounded-xl px-4 py-3">
                  <FormBadge form={label} />
                  <span className="text-slate-700 leading-relaxed text-sm pt-0.5">{value}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Sentence Form Examples */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 text-sm font-bold flex items-center justify-center border border-primary-100">4</span>
          Sentence Form Examples
        </h2>
        <p className="text-slate-600 mb-5 leading-relaxed">
          Here are examples for each tense showing all four sentence forms:
        </p>

        <div className="space-y-6">
          {[
            {
              tense: "Simple Present",
              sentences: [
                { form: "Affirmative", en: "I write a letter.", my: "ကျွန်မ စာရေးတယ်။" },
                { form: "Negative", en: "I don't write a letter.", my: "ကျွန်မ စာ မရေးဘူး။" },
                { form: "Interrogative", en: "Do I write a letter?", my: "ကျွန်မ စာ ရေးလား။" },
                { form: "Neg. Interrogative", en: "Don't I write a letter?", my: "ကျွန်မ စာ မရေးဘူးလား။" },
              ],
            },
            {
              tense: "Simple Past",
              sentences: [
                { form: "Affirmative", en: "I wrote a letter last night.", my: "မနေ့ညက ကျွန်မ စာတစ်စောင် ရေးခဲ့တယ်။" },
                { form: "Negative", en: "I didn't write a letter last night.", my: "မနေ့ညက ကျွန်မ စာ မရေးခဲ့ဘူး။" },
                { form: "Interrogative", en: "Did I write a letter last night?", my: "မနေ့ညက ကျွန်မ စာ ရေးခဲ့လား။" },
                { form: "Neg. Interrogative", en: "Didn't I write a letter last night?", my: "မနေ့ညက ကျွန်မ စာ မရေးခဲ့ဘူးလား။" },
              ],
            },
            {
              tense: "Simple Future",
              sentences: [
                { form: "Affirmative", en: "I will write a letter next week.", my: "နောက်အပတ် ကျွန်မ စာတစ်စောင် ရေးမယ်။" },
                { form: "Negative", en: "I won't write a letter next week.", my: "နောက်အပတ်ကျရင် ကျွန်မ စာ ရေးဖို့မ မဟုတ်ဘူး။" },
                { form: "Interrogative", en: "Will I write a letter next week?", my: "နောက်အပတ်ကျရင် ကျွန်မ စာ ရေးဖို့မ လား။" },
                { form: "Neg. Interrogative", en: "Won't I write a letter next week?", my: "နောက်အပတ်ကျရင် ကျွန်မ စာ ရေးဖို့မ မဟုတ်ဘူး မလား။" },
              ],
            },
          ].map((block) => (
            <div key={block.tense}>
              <h3 className="font-bold text-foreground mb-3">{block.tense}</h3>
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm border-collapse min-w-[480px]">
                  <thead>
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold text-slate-500 text-xs uppercase tracking-wider border-b border-border w-28">Form</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-500 text-xs uppercase tracking-wider border-b border-border">English</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-500 text-xs uppercase tracking-wider border-b border-border">Myanmar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.sentences.map((s, i) => (
                      <tr key={i} className="border-b border-border last:border-b-0 hover:bg-surface-alt transition-colors duration-150">
                        <td className="px-3 py-2.5">
                          <FormBadge form={s.form} />
                        </td>
                        <td className="px-3 py-2.5 text-foreground">{s.en}</td>
                        <td className="px-3 py-2.5 myanmar-text text-slate-600 text-xs">{s.my}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Answer Forms */}
      <section className="bg-surface rounded-2xl border border-border p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-success-50 text-success-600 text-sm font-bold flex items-center justify-center border border-success-500/20">5</span>
          {answerLesson.title}
        </h2>
        <p className="text-slate-600 mb-4 leading-relaxed">{answerLesson.content}</p>
        <div className="space-y-2.5">
          {answerLesson.answer_types && Object.entries(answerLesson.answer_types).map(([key, value]) => (
            <div key={key} className="bg-surface-alt rounded-xl px-4 py-3">
              <span className="font-bold text-foreground text-sm capitalize">
                {key.replace(/_/g, " ")}:
              </span>{" "}
              <span className="text-slate-600 text-sm">{value}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center">
        <Link
          href="/unit-1/practice"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold px-8 py-3.5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md shadow-primary-600/20"
        >
          Start Practice
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
