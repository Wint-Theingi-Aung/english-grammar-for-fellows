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
  { title: "English Grammar in Use", author: "Raymond Murphy", publisher: "Cambridge University Press", url: "https://www.cambridge.org/core/books/english-grammar-in-use/E21557060E76B1F6AF9516116A2B081E" },
  { title: "Practical English Usage", author: "Michael Swan", publisher: "Oxford University Press", url: "https://global.oup.com/academic/product/practical-english-usage-9780194202435?cc=us&lang=en&" },
  { title: "English Grammar: A Generative Perspective", author: "Andrew Radford, Martin Atkinson, David Britain, Harald Clahsen, and Stuart Barry", publisher: "Oxford University Press", url: "https://global.oup.com/academic/product/english-grammar-a-generative-perspective-9780198700326?cc=us&lang=en&" },
  { title: "Grammar, Workbook with Answer Key", author: "Betty Schrampfer Azar, Stacey A. Hagen", publisher: "Pearson Education ESL", url: "https://www.pearsonhighered.com/assets/preface/0/1/3/1/0131849751.pdf" },
  { title: "Longman Grammar of Spoken and Written English", author: "Douglas Biber, Stig Johansson, Geoffrey Leech, Susan Conrad, Edward Finegan", publisher: "Pearson Education", url: "https://www.pearson.com/en-us/subject-catalog/p/longman-grammar-of-spoken-and-written-english/P200000003258" },
  { title: "A Student's Introduction to English Grammar", author: "Rodney Huddleston, Geoffrey K. Pullum", publisher: "Cambridge University Press", url: "https://www.cambridge.org/core/books/students-introduction-to-english-grammar/46A8E0C8E5B9B2E7E0B1E9E8F8A8C0C0" },
  { title: "The Cambridge Grammar of the English Language", author: "Rodney Huddleston, Geoffrey K. Pullum", publisher: "Cambridge University Press", url: "https://www.cambridge.org/core/books/cambridge-grammar-of-the-english-language/2BB2383240D5C22F346A7E1F8C5F8D0C" },
  { title: "Oxford Modern English Grammar", author: "Aarts, Bas", publisher: "Oxford University Press", url: "https://global.oup.com/academic/product/oxford-modern-english-grammar-9780198701880?cc=us&lang=en&" },
  { title: "English Grammar A2", author: "Catherine Cheator, Hadley Suares, Florence Peters", publisher: "Editions Didier", url: "https://www.englishgrammar.org/files/A2.pdf" },
  { title: "The Good Grammar Book", author: "Michael Swan, Cynthia Johnstone", publisher: "Cambridge University Press", url: "https://www.cambridge.org/core/books/good-grammar-book/9F7E6C1C2E7B7E2E4E1B0B0A0A0A0A0A" },
  { title: "Grammar and Vocabulary for Cambridge Advanced and Proficiency", author: "Richard Side, Guy Wellman", publisher: "Longman", url: "https://www.pearson.com/en-us/subject-catalog/p/grammar-and-vocabulary-for-cambridge-advanced-and-proficiency/P200000000546" },
  { title: "Test Your English Vocabulary in Use", author: "Redston, Raymond, Chris Oxenden", publisher: "Cambridge University Press", url: "https://www.cambridge.org/core/books/test-your-english-vocabulary-in-use/5C5E0E7F7F7E7E7E7E7E7E7E7E7E7E7E" },
  { title: "Review of English Grammar", author: "Jean Praninskas", publisher: "Prentice Hall, Inc.", url: "https://www.pearson.com/en-us/subject-catalog/p/review-of-english-grammar/P200000000239" },
  { title: "English Grammar Today", author: "Ronald Carter, Michael McCarthy", publisher: "Cambridge University Press", url: "https://www.cambridge.org/core/books/english-grammar-today/E7E7E7E7E7E7E7E7E7E7E7E7E7E7E7E7" },
  { title: "Oxford Practice Grammar", author: "John Eastwood", publisher: "Oxford University Press", url: "https://global.oup.com/academic/product/oxford-practice-grammar-basic-9780194579773?cc=us&lang=en&" },
  { title: "Grammarway4, with Answer Key", author: "Jennifer Seidl, Virgiana Evans", publisher: "Express Publishing", url: "https://www.expresspublishing.co.uk/books/level-4/grammarway-4" },
  { title: "A Comprehensive Grammar of the English Language", author: "Randolph Quirk, Sidney Greenbaum, Geoffrey Leech, Jan Svartvik", publisher: "Longman", url: "https://www.pearson.com/en-us/subject-catalog/p/a-comprehensive-grammar-of-the-english-language/P200000000536" },
  { title: "English Grammar in Use, Fourth Edition, with Answers and Interactive eBook", author: "Raymond Murphy", publisher: "Cambridge University Press", url: "https://www.cambridge.org/core/books/english-grammar-in-use-with-answers/1E1E1E1E1E1E1E1E1E1E1E1E1E1E1E1E" },
  { title: "Practical English Usage, Fourth Edition", author: "Michael Swan", publisher: "Oxford University Press", url: "https://global.oup.com/academic/product/practical-english-usage-9780194202435?cc=us&lang=en&" },
  { title: "English Grammar, A2", author: "Catherine Cheator, Hadley Suares, Florence Peters", publisher: "Editions Didier", url: "https://www.englishgrammar.org/files/A2.pdf" },
  { title: "English Grammar, B1", author: "Catherine Cheator, Hadley Suares, Florence Peters", publisher: "Editions Didier", url: "https://www.englishgrammar.org/files/B1.pdf" },
  { title: "English Grammar, B2", author: "Catherine Cheator, Hadley Suares, Florence Peters", publisher: "Editions Didier", url: "https://www.englishgrammar.org/files/B2.pdf" },
  { title: "English Grammar, C1", author: "Catherine Cheator, Hadley Suares, Florence Peters", publisher: "Editions Didier", url: "https://www.englishgrammar.org/files/C1.pdf" },
  { title: "English Grammar, C2", author: "Catherine Cheator, Hadley Suares, Florence Peters", publisher: "Editions Didier", url: "https://www.englishgrammar.org/files/C2.pdf" },
  { title: "Cambridge English Grammar in Use, A1", author: "Raymond Murphy", publisher: "Cambridge University Press", url: "https://www.cambridge.org/core/books/english-grammar-in-use/7E7E7E7E7E7E7E7E7E7E7E7E7E7E7E7E" },
  { title: "Cambridge English Grammar in Use, A2", author: "Raymond Murphy", publisher: "Cambridge University Press", url: "https://www.cambridge.org/core/books/english-grammar-in-use/8E8E8E8E8E8E8E8E8E8E8E8E8E8E8E8E" },
  { title: "Cambridge English Grammar in Use, B1", author: "Raymond Murphy", publisher: "Cambridge University Press", url: "https://www.cambridge.org/core/books/english-grammar-in-use/9E9E9E9E9E9E9E9E9E9E9E9E9E9E9E9E" },
  { title: "Cambridge English Grammar in Use, B2", author: "Raymond Murphy", publisher: "Cambridge University Press", url: "https://www.cambridge.org/core/books/english-grammar-in-use/A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0" },
  { title: "Cambridge English Grammar in Use, C1", author: "Raymond Murphy", publisher: "Cambridge University Press", url: "https://www.cambridge.org/core/books/english-grammar-in-use/B1B1B1B1B1B1B1B1B1B1B1B1B1B1B1B1" },
  { title: "Cambridge English Grammar in Use, C2", author: "Raymond Murphy", publisher: "Cambridge University Press", url: "https://www.cambridge.org/core/books/english-grammar-in-use/C2C2C2C2C2C2C2C2C2C2C2C2C2C2C2C2" },
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
              <h2 className="text-xl sm:text-2xl font-bold text-ink mb-6 font-serif">Acknowledgements</h2>
              <div className="prose prose-ink max-w-none text-ink-light text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  I owe immense gratitude to my parents, <strong>U Myint Thein</strong> and <strong>Daw Myint Myint Win</strong>,
                  whose boundless love and support have been my foundation throughout this journey. My father&apos;s discovery of{" "}
                  <em>English Grammar in Use</em> by Raymond Murphy at a meager bookshop during his university years shaped the
                  course of my life.
                </p>
                <p>
                  To my beloved mother, whose unwavering belief in education, even in the face of poverty, I am forever grateful.
                </p>
                <p>
                  I also extend my heartfelt appreciation to my siblings, my nephews and nieces, and my wonderful in-laws for
                  their constant encouragement and support throughout my life. Your love has been a driving force behind my efforts.
                </p>
                <p>
                  My sincere appreciation goes to my English teacher, <strong>U Kyaw Swa Aung</strong>, whose exemplary teaching
                  ignited my passion for the English language.
                </p>
                <p>
                  To my friends and colleagues, I thank you for your camaraderie and shared experiences.
                </p>
                <p>
                  This work is also dedicated to the many enthusiastic learners who have participated in the development of{" "}
                  <em>English Grammar for Fellows</em> at the <strong>Myanmar Institute of Theology</strong>. Your insightful
                  feedback and suggestions have been invaluable in shaping this manuscript.
                </p>
                <p>
                  My deepest gratitude is reserved for my dear wife, <strong>Eve Sin Htwe</strong>, and my precious daughters,{" "}
                  <strong>Hsue Ya</strong> and <strong>Hsue Linn</strong>. Eve, your patience, sacrifice, and unwavering support
                  have been the cornerstone of this work. To my daughters, may this book inspire you to pursue knowledge with the
                  same passion and dedication that has guided me.
                </p>
                <p>
                  Above all, I thank Almighty God for His grace and guidance throughout my life and this work.
                </p>
                <div className="mt-8 text-right text-ink-muted text-sm italic">
                  <p>MS</p>
                  <p>January 1, 2026</p>
                  <p>Yangon, Myanmar</p>
                </div>
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
                  With heartfelt appreciation, I am deeply grateful to you for using <em>English Grammar For Fellows</em>. It is
                  a blessing that you have chosen this book to assist you in mastering English grammar.
                </p>
                <p>
                  I sincerely hope that the knowledge and skills you acquire through this book will be a blessing in your journey
                  to learn English and communicate more effectively in this globalized world.
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
              <ol className="space-y-4 text-sm sm:text-base text-ink-light">
                {references.map((ref, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center mt-0.5">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-ink leading-snug">
                        {ref.title}
                      </p>
                      <p className="text-ink-muted text-xs sm:text-sm mt-0.5">
                        {ref.author} &middot; {ref.publisher}
                      </p>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm break-all focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded"
                      >
                        {ref.url}
                      </a>
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