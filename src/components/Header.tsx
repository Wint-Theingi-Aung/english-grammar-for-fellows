"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg text-indigo-700 hover:text-indigo-800">
          Grammar Fellows
        </Link>
        <nav className="text-sm text-slate-500">
          <Link href="/unit-1" className="hover:text-indigo-600">
            Unit 1
          </Link>
        </nav>
      </div>
    </header>
  );
}
