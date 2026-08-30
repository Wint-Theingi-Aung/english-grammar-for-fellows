"use client";

import Link from "next/link";
import { getLessonsData } from "@/lib/data";

export default function LessonPage() {
  const data = getLessonsData();
  const [verbLesson, conjugationLesson, formsLesson, answerLesson] = data.lessons;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/unit-1" className="text-sm text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
        ← Back to Unit Overview
      </Link>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
        Grammar Lesson
      </h1>

      {/* Verb Forms Overview */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">{verbLesson.title}</h2>
        <p className="text-slate-700 mb-4">{verbLesson.content}</p>
        {verbLesson.details && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-700 border-b">Tense</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-700 border-b">Form</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-700 border-b">Example</th>
                </tr>
              </thead>
              <tbody>
                {verbLesson.details.map((d, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="px-4 py-3 font-medium text-slate-800">{d.tense}</td>
                    <td className="px-4 py-3 text-slate-600">{d.form}</td>
                    <td className="px-4 py-3">
                      <span className="text-slate-800">{d.example}</span>
                      <br />
                      <span className="text-slate-500 text-xs">{d.burmese}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Subject-Verb Conjugation */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">{conjugationLesson.title}</h2>
        <p className="text-slate-700 mb-4">{conjugationLesson.content}</p>
        {conjugationLesson.conjugation && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-700 border-b">Subject</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-700 border-b">Present</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-700 border-b">Past</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-700 border-b">Future</th>
                </tr>
              </thead>
              <tbody>
                {conjugationLesson.conjugation.map((c, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="px-4 py-3 font-medium text-slate-800">{c.subject}</td>
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
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">{formsLesson.title}</h2>
        <p className="text-slate-700 mb-4">{formsLesson.content}</p>
        {formsLesson.forms && (
          <div className="space-y-3">
            {Object.entries(formsLesson.forms).map(([key, value]) => (
              <div key={key} className="bg-slate-50 rounded-lg px-4 py-3">
                <span className="font-semibold text-slate-800 capitalize">
                  {key.replace(/_/g, " ")}:
                </span>{" "}
                <span className="text-slate-600">{value}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Affirmative / Negative / Interrogative Examples */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Sentence Form Examples</h2>
        <p className="text-slate-600 mb-4">
          Here are examples for each tense showing all four sentence forms:
        </p>

        <div className="space-y-4">
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
              <h3 className="font-semibold text-slate-800 mb-2">{block.tense}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-3 py-2 font-semibold text-slate-600 border-b text-xs">Form</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-600 border-b text-xs">English</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-600 border-b text-xs">Myanmar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.sentences.map((s, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-3 py-2 text-slate-500 text-xs">{s.form}</td>
                        <td className="px-3 py-2 text-slate-800">{s.en}</td>
                        <td className="px-3 py-2 text-slate-500 text-xs">{s.my}</td>
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
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">{answerLesson.title}</h2>
        <p className="text-slate-700 mb-4">{answerLesson.content}</p>
        <div className="space-y-2 text-sm">
          {answerLesson.answer_types && Object.entries(answerLesson.answer_types).map(([key, value]) => (
            <div key={key} className="bg-slate-50 rounded-lg px-4 py-2">
              <span className="font-semibold text-slate-800 capitalize">
                {key.replace(/_/g, " ")}:
              </span>{" "}
              <span className="text-slate-600">{value}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center">
        <Link
          href="/unit-1/practice"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Start Practice →
        </Link>
      </div>
    </div>
  );
}
