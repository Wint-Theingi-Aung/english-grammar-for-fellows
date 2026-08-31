"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-30">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-primary-700 hover:text-primary-600 transition-colors duration-200"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="1" width="14" height="22" rx="2" fill="url(#hdrBook)" />
            <rect x="2" y="1" width="2.5" height="22" rx="0.8" fill="#4338ca" />
            <rect x="4.5" y="2" width="11.5" height="20" rx="1" fill="#f8f7ff" />
            <line x1="7" y1="6" x2="14" y2="6" stroke="#c4c7e5" strokeWidth="0.7" strokeLinecap="round" />
            <line x1="7" y1="9" x2="14" y2="9" stroke="#c4c7e5" strokeWidth="0.7" strokeLinecap="round" />
            <line x1="7" y1="12" x2="11" y2="12" stroke="#c4c7e5" strokeWidth="0.7" strokeLinecap="round" />
            <text x="9.5" y="16.5" fontFamily="Georgia, serif" fontSize="8" fontWeight="bold" fill="#6366f1" textAnchor="middle">G</text>
            <defs>
              <linearGradient id="hdrBook" x1="2" y1="1" x2="16" y2="23">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <span>Grammar Fellows</span>
        </Link>
        <nav>
          <Link
            href="/unit-1"
            className="text-sm font-medium text-slate-500 hover:text-primary-600 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-all duration-200"
          >
            Unit 1
          </Link>
        </nav>
      </div>
    </header>
  );
}
