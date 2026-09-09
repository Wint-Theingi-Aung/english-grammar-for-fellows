"use client";

import { useState } from "react";
import Link from "next/link";

const TABS = [
  { id: "thanks", label: "Thanks" },
  { id: "fellows", label: "To the Fellows" },
  { id: "references", label: "References" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const references = [
  { label: "Retrieved from Diploma in English Course" },
  { url: "https://www.perfect-english-grammar.com" },
  { url: "https://www.usingenglish.com" },
  { url: "https://learningenglish.voanews.com" },
  { url: "https://www.talkenglish.com" },
  { url: "https://www.crownacademyenglish.com" },
  { url: "https://www.oxfordlearnersdictionaries.com" },
  { url: "https://www.oxfordonlineenglish.com" },
  { url: "https://www.kidslearningstation4u.com" },
  { url: "https://www.learnesl.net" },
  { url: "https://www.englishclub.com" },
  { url: "https://www.wallstreetenglish.com" },
  { url: "https://www.englishclub.com" },
  { url: "https://www.ego4u.com" },
  { url: "https://www.englisch-hilfen.de" },
  { url: "https://www.learngrammar.net" },
  { url: "https://www.englishgrammar.org" },
  { url: "https://www.grammarbank.com" },
  { url: "https://www.englishpractice.com" },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<TabId>("thanks");

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
        {/* Header */}
        <section className="mb-8 animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mb-5 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded-lg px-1 -ml-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-1 font-serif">
            Book Information
          </h1>
          <p className="text-ink-muted text-sm sm:text-base">
            About the author, acknowledgments, and references for English Grammar for Fellows.
          </p>
        </section>

        {/* Tabs */}
        <div className="mb-8" role="tablist" aria-label="Book information sections">
          <div className="flex flex-wrap gap-2 border-b border-border pb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                  activeTab === tab.id
                    ? "bg-primary-50 text-primary-700 border-b-2 border-primary-500 -mb-px"
                    : "text-ink-muted hover:text-ink hover:bg-surface-alt"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Panels */}
        <div className="animate-fade-in">
          {/* Thanks */}
          <div
            role="tabpanel"
            id="tabpanel-thanks"
            aria-labelledby="tab-thanks"
            hidden={activeTab !== "thanks"}
          >
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-ink mb-6 font-serif">Thanks</h2>
              <div className="prose prose-ink max-w-none text-ink-light text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Firstly, I would like to thank all of my English teachers who taught me
                  throughout my life. I always appreciate them and pay respect to them.
                </p>
                <p>
                  Secondly, I would like to thank Assistant Lecturer Daw Swe Mar Aung and Khit
                  Yadana and Thu Rein Htun, my friends. They support me a lot. I could not
                  complete this book unless they give me their hands.
                </p>
                <p>
                  Last but not least, I would like to thank Saya Ko Ko Ye. It is because of Saya who
                  asked for contributing to community. I pay homage to you and really thank to
                  you.
                </p>
              </div>
            </div>
          </div>

          {/* To the Fellows */}
          <div
            role="tabpanel"
            id="tabpanel-fellows"
            aria-labelledby="tab-fellows"
            hidden={activeTab !== "fellows"}
          >
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-ink mb-6 font-serif">To the Fellows</h2>
              <div className="prose prose-ink max-w-none text-ink-light text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  English Grammar for Fellows is written for my fellows (fellows who have already
                  studied English Basic) who need some help for grammar. Nevertheless I am not a
                  perfect one yet, I would like to share my knowledge which I know.
                </p>
                <p>
                  In this book, it includes many points such as
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>difference between I do and I am doing</li>
                  <li>difference between want to and want (obj) to</li>
                  <li>difference between would like to and would like (obj) to</li>
                  <li>difference between used to do and used to doing</li>
                  <li>usage of prepositions of time and place</li>
                  <li>adverbs of frequency and so on</li>
                </ul>
                <p>
                  What&apos;s more, it consists of many vocabularies such as
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>physical activities</li>
                  <li>sports</li>
                  <li>transport</li>
                  <li>feelings</li>
                  <li>personality</li>
                  <li>social problems</li>
                  <li>shops, etc.</li>
                </ul>
                <p>
                  Every unit contains a lot of exercises and intends to practise. There is the key for each
                  exercise and you will check the answers.
                </p>
                <p>
                  In conclusion, although there are still needs in this book, I try my best as much as I
                  can. If it is useful for you, I will walk on air.
                </p>
              </div>
            </div>
          </div>

          {/* References */}
          <div
            role="tabpanel"
            id="tabpanel-references"
            aria-labelledby="tab-references"
            hidden={activeTab !== "references"}
          >
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-ink mb-6 font-serif">References</h2>
              <ol className="space-y-3 text-sm sm:text-base text-ink-light">
                {references.map((ref, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center mt-0.5">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      {ref.url ? (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 break-all focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded"
                        >
                          {ref.url}
                        </a>
                      ) : (
                        <p className="text-ink">{ref.label}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
