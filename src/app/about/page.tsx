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

const steps = [
  {
    title: "Understand",
    number: "01",
    description:
      "Clear explanations break down grammar rules into bite-sized concepts. Every topic starts with the 'why' before the 'how'.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2a9d8f">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  {
    title: "Practise",
    number: "02",
    description:
      "Abundant exercises let you apply what you just learned. Active practice builds muscle memory and confidence with every unit.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2a9d8f">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.183" />
      </svg>
    ),
  },
  {
    title: "Remember",
    number: "03",
    description:
      "Each unit wraps up with a review section and answer keys so you can check your progress and retain what you've learned.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#2a9d8f">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<TabId>("thanks");

  return (
    <div className="min-h-screen" style={{ background: "#faf8f5" }}>
      {/* Hero Section */}
      <section className="hero-gradient hero-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-16 sm:pt-8 sm:pb-20 lg:pt-10 lg:pb-24">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded-lg px-1 -ml-1"
            style={{ color: "#2a9d8f" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6"
              style={{ background: "rgba(42,157,143,0.1)", color: "#2a9d8f" }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              About the Book
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-serif"
              style={{ color: "#1a1f36" }}
            >
              About the Book
            </h1>
            <p
              className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: "#3d4263" }}
            >
              English Grammar for Fellows is designed around a simple philosophy:
              understand the rule, practise it with purpose, and remember it for
              life.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 relative z-10 pb-16 sm:pb-20 lg:pb-24">
        {/* Visual Storytelling: Understand -> Practise -> Remember */}
        <section className="mb-16">
          <div className="stagger-children">
            <div className="text-center mb-10">
              <h2
                className="text-xl sm:text-2xl font-bold font-serif mb-2"
                style={{ color: "#1a1f36" }}
              >
                How You&apos;ll Learn
              </h2>
              <p className="text-sm" style={{ color: "#6b7194" }}>
                A three-step approach built into every unit
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((step) => (
                <div
                  key={step.title}
                  className="card-hover rounded-2xl p-6 sm:p-8 text-center border"
                  style={{ background: "#ffffff", borderColor: "#e8e4df" }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                    style={{ background: "rgba(42,157,143,0.1)" }}
                  >
                    {step.icon}
                  </div>
                  <div
                    className="text-xs font-bold tracking-widest uppercase mb-2"
                    style={{ color: "#e76f51" }}
                  >
                    Step {step.number}
                  </div>
                  <h3
                    className="text-lg font-bold font-serif mb-3"
                    style={{ color: "#1a1f36" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#6b7194" }}
                  >
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Book Method Section */}
        <section className="mb-16 animate-fade-in">
          <div
            className="rounded-2xl border p-8 sm:p-10"
            style={{ background: "#ffffff", borderColor: "#e8e4df" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-4"
                  style={{ background: "rgba(231,111,81,0.1)", color: "#e76f51" }}
                >
                  Teaching Approach
                </div>
                <h2
                  className="text-xl sm:text-2xl font-bold font-serif mb-4"
                  style={{ color: "#1a1f36" }}
                >
                  Built for Fellows, by a Fellow
                </h2>
                <div className="space-y-3 text-sm leading-relaxed" style={{ color: "#3d4263" }}>
                  <p>
                    This book covers essential grammar topics including the
                    difference between simple and continuous tenses, verb
                    patterns with objects, prepositions of time and place, and
                    adverbs of frequency.
                  </p>
                  <p>
                    Every unit contains hands-on exercises with answer keys so
                    you can immediately check your understanding and build
                    confidence.
                  </p>
                  <p>
                    Beyond grammar, the book includes vocabulary sections
                    covering physical activities, sports, transport, feelings,
                    personality, social problems, and everyday situations.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Grammar Units", value: "14+" },
                  { label: "Vocab Topics", value: "10+" },
                  { label: "Exercises", value: "100+" },
                  { label: "Answer Keys", value: "100%" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-4 text-center border"
                    style={{ background: "#faf8f5", borderColor: "#e8e4df" }}
                  >
                    <div
                      className="text-2xl font-bold font-serif"
                      style={{ color: "#2a9d8f" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#6b7194" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="animate-fade-in">
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ background: "#ffffff", borderColor: "#e8e4df" }}
          >
            {/* Tab Bar */}
            <div
              className="flex border-b"
              style={{ borderColor: "#e8e4df" }}
              role="tablist"
              aria-label="Book information sections"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex-1 px-5 py-4 text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
                  style={{
                    color: activeTab === tab.id ? "#1a1f36" : "#6b7194",
                    background: activeTab === tab.id ? "#faf8f5" : "transparent",
                  }}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ background: "#e76f51" }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="p-6 sm:p-8">
              {/* Thanks */}
              <div
                role="tabpanel"
                id="tabpanel-thanks"
                aria-labelledby="tab-thanks"
                hidden={activeTab !== "thanks"}
              >
                <div className="animate-fade-in">
                  <h2
                    className="text-xl sm:text-2xl font-bold font-serif mb-6"
                    style={{ color: "#1a1f36" }}
                  >
                    Thanks
                  </h2>
                  <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "#3d4263" }}>
                    <p>
                      Firstly, I would like to thank all of my English teachers
                      who taught me throughout my life. I always appreciate them
                      and pay respect to them.
                    </p>
                    <p>
                      Secondly, I would like to thank Assistant Lecturer Daw Swe
                      Mar Aung and Khit Yadana and Thu Rein Htun, my friends.
                      They support me a lot. I could not complete this book
                      unless they give me their hands.
                    </p>
                    <p>
                      Last but not least, I would like to thank Saya Ko Ko Ye. It
                      is because of Saya who asked for contributing to community.
                      I pay homage to you and really thank to you.
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
                <div className="animate-fade-in">
                  <h2
                    className="text-xl sm:text-2xl font-bold font-serif mb-6"
                    style={{ color: "#1a1f36" }}
                  >
                    To the Fellows
                  </h2>
                  <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "#3d4263" }}>
                    <p>
                      English Grammar for Fellows is written for my fellows
                      (fellows who have already studied English Basic) who need
                      some help for grammar. Nevertheless I am not a perfect one
                      yet, I would like to share my knowledge which I know.
                    </p>
                    <p>In this book, it includes many points such as</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>difference between I do and I am doing</li>
                      <li>difference between want to and want (obj) to</li>
                      <li>
                        difference between would like to and would like (obj) to
                      </li>
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
                      Every unit contains a lot of exercises and intends to
                      practise. There is the key for each exercise and you will
                      check the answers.
                    </p>
                    <p>
                      In conclusion, although there are still needs in this book,
                      I try my best as much as I can. If it is useful for you, I
                      will walk on air.
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
                <div className="animate-fade-in">
                  <h2
                    className="text-xl sm:text-2xl font-bold font-serif mb-6"
                    style={{ color: "#1a1f36" }}
                  >
                    References
                  </h2>
                  <ol className="space-y-3 text-sm sm:text-base">
                    {references.map((ref, index) => (
                      <li key={index} className="flex gap-3">
                        <span
                          className="flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center mt-0.5"
                          style={{ background: "rgba(42,157,143,0.1)", color: "#2a9d8f" }}
                        >
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          {ref.url ? (
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-all transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded"
                              style={{ color: "#2a9d8f" }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "#218579")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "#2a9d8f")}
                            >
                              {ref.url}
                            </a>
                          ) : (
                            <p style={{ color: "#1a1f36" }}>{ref.label}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center animate-fade-in">
          <div
            className="rounded-2xl border p-8 sm:p-12"
            style={{ background: "#ffffff", borderColor: "#e8e4df" }}
          >
            <h2
              className="text-xl sm:text-2xl font-bold font-serif mb-3"
              style={{ color: "#1a1f36" }}
            >
              Ready to Start Learning?
            </h2>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "#6b7194" }}>
              Jump into your first unit and begin your journey through English
              grammar, one step at a time.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
              style={{
                background: "#e76f51",
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#d45a3c";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 8px 24px -4px rgba(231,111,81,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#e76f51";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Start Learning
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
