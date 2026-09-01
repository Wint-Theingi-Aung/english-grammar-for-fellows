"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="Grammar Fellows - Home"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 shadow-sm shadow-primary-500/20 group-hover:shadow-md group-hover:shadow-primary-500/30 transition-shadow duration-200">
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 sm:w-5 sm:h-5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="3" y="1.5" width="13" height="21" rx="1.5" fill="white" opacity="0.92" />
              <rect x="3" y="1.5" width="2" height="21" rx="0.6" fill="white" opacity="0.5" />
              <text x="9.5" y="15.5" fontFamily="Georgia, serif" fontSize="8.5" fontWeight="bold" fill="#218579" textAnchor="middle">G</text>
            </svg>
          </span>
          <span className="font-bold text-base sm:text-lg text-ink tracking-tight">
            Grammar Fellows
          </span>
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-1 overflow-x-auto">
          <Link
            href="/unit-1"
            className="text-sm font-medium text-ink-muted hover:text-primary-600 px-2.5 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 whitespace-nowrap"
          >
            Unit 1
          </Link>
          <Link
            href="/unit-2"
            className="text-sm font-medium text-ink-muted hover:text-primary-600 px-2.5 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 whitespace-nowrap"
          >
            Unit 2
          </Link>
          <Link
            href="/unit-3"
            className="text-sm font-medium text-ink-muted hover:text-primary-600 px-2.5 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 whitespace-nowrap"
          >
            Unit 3
          </Link>
          <Link
            href="/unit-4"
            className="text-sm font-medium text-ink-muted hover:text-primary-600 px-2.5 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 whitespace-nowrap"
          >
            Unit 4
          </Link>
          <Link
            href="/unit-5"
            className="text-sm font-medium text-ink-muted hover:text-primary-600 px-2.5 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 whitespace-nowrap"
          >
            Unit 5
          </Link>
        </nav>
      </div>
    </header>
  );
}
