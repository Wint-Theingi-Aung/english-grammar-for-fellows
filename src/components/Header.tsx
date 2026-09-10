"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="Grammar Fellows - Home"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
            <Image src="/logo-mark.svg" alt="" className="w-full h-full" width={36} height={36} unoptimized />
          </span>
          <span className="font-bold text-base sm:text-lg text-ink tracking-tight">
            Grammar Fellows
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          <Link href="/" className="text-sm font-medium text-ink-muted hover:text-primary-600 px-2.5 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1">
            Dashboard
          </Link>
          <Link href="/review-mistakes" className="text-sm font-medium text-ink-muted hover:text-primary-600 px-2.5 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1">
            Review Mistakes
          </Link>
          <Link href="/about" className="text-sm font-medium text-ink-muted hover:text-primary-600 px-2.5 py-2 rounded-lg hover:bg-primary-50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1">
            About
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-3 space-y-1 animate-fade-in-opacity">
          <Link href="/" className="block text-sm font-medium text-ink-muted hover:text-primary-600 px-3 py-2.5 rounded-lg hover:bg-primary-50 transition-all duration-200" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link href="/review-mistakes" className="block text-sm font-medium text-ink-muted hover:text-primary-600 px-3 py-2.5 rounded-lg hover:bg-primary-50 transition-all duration-200" onClick={() => setMenuOpen(false)}>
            Review Mistakes
          </Link>
          <Link href="/about" className="block text-sm font-medium text-ink-muted hover:text-primary-600 px-3 py-2.5 rounded-lg hover:bg-primary-50 transition-all duration-200" onClick={() => setMenuOpen(false)}>
            About
          </Link>
        </div>
      )}
    </header>
  );
}
