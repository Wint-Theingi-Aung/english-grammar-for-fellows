"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/review-mistakes", label: "Review Mistakes" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setMenuOpen(false);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="bg-surface/85 backdrop-blur-lg border-b border-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="Grammar Fellows - Home"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
            <Image src="/logo-mark.svg" alt="" className="w-full h-full" width={36} height={36} unoptimized />
          </span>
          <span className="font-serif font-bold text-base sm:text-lg text-ink tracking-tight">
            Grammar Fellows
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                  isActive
                    ? "text-primary-700 bg-primary-50 font-semibold"
                    : "text-ink-muted hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
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

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-ink/20 backdrop-blur-sm z-30" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed left-0 right-0 top-14 bg-surface border-b border-border shadow-lg z-40 transition-all duration-200 ${
          menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        role="menu"
      >
        <div className="px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className={`block text-sm font-medium px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-primary-700 bg-primary-50 font-semibold"
                    : "text-ink-muted hover:text-primary-600 hover:bg-primary-50"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
