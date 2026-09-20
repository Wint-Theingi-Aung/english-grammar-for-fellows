import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/60 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
          <div className="sm:col-span-1">
            <p className="font-serif font-bold text-ink text-base tracking-tight mb-2">
              Grammar Fellows
            </p>
            <p className="text-xs text-ink-muted leading-relaxed max-w-xs">
              English Grammar for Fellows — a structured approach to mastering English grammar through understanding, practice, and memory.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Learn</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-ink-muted hover:text-primary-600 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/review-mistakes" className="text-sm text-ink-muted hover:text-primary-600 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded">
                  Review Mistakes
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-ink-muted hover:text-primary-600 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded">
                  About the Book
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Method</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-ink-muted flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" aria-hidden="true" />
                  Understand
                </span>
              </li>
              <li>
                <span className="text-sm text-ink-muted flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400 flex-shrink-0" aria-hidden="true" />
                  Practise
                </span>
              </li>
              <li>
                <span className="text-sm text-ink-muted flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-500 flex-shrink-0" aria-hidden="true" />
                  Remember
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-muted">
            &copy; {new Date().getFullYear()} Grammar Fellows. All rights reserved.
          </p>
          <p className="text-xs text-ink-muted">
            40 Units &middot; Interactive Exercises &middot; Myanmar Translations
          </p>
        </div>
      </div>
    </footer>
  );
}
