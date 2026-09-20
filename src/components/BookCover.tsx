"use client";

export default function BookCover({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} role="img" aria-label="English Grammar for Fellows book cover">
      <svg
        viewBox="0 0 320 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_20px_40px_rgba(26,31,54,0.18),0_8px_16px_rgba(26,31,54,0.1)]"
        style={{ maxWidth: 320 }}
      >
        {/* Book body */}
        <rect x="4" y="4" width="312" height="412" rx="8" fill="#1a1f36" />
        
        {/* Book spine accent */}
        <rect x="4" y="4" width="14" height="412" rx="8" fill="#2a9d8f" />
        <rect x="14" y="4" width="6" height="412" fill="#2a9d8f" opacity="0.6" />
        
        {/* Cover background */}
        <rect x="22" y="4" width="294" height="412" rx="0" fill="#faf8f5" />
        <rect x="22" y="4" width="294" height="412" rx="0 8 8 0" fill="#faf8f5" />
        
        {/* Decorative top bar */}
        <rect x="22" y="4" width="294" height="8" fill="#2a9d8f" />
        
        {/* Decorative pattern - subtle geometric shapes */}
        <circle cx="280" cy="60" r="40" fill="#2a9d8f" opacity="0.06" />
        <circle cx="50" cy="380" r="35" fill="#e76f51" opacity="0.06" />
        
        {/* EG monogram */}
        <rect x="48" y="40" width="56" height="56" rx="12" fill="#1a1f36" />
        <text x="76" y="72" textAnchor="middle" fill="#faf8f5" fontFamily="Georgia, serif" fontSize="22" fontWeight="bold">EG</text>
        
        {/* Main title area */}
        <text x="48" y="130" fill="#1a1f36" fontFamily="Georgia, serif" fontSize="13" fontWeight="400" letterSpacing="0.08em" opacity="0.6" style={{ textTransform: "uppercase" as const }}>ENGLISH GRAMMAR</text>
        
        <text x="48" y="160" fill="#1a1f36" fontFamily="Georgia, serif" fontSize="30" fontWeight="bold" letterSpacing="-0.02em">English Grammar</text>
        <text x="48" y="196" fill="#1a1f36" fontFamily="Georgia, serif" fontSize="30" fontWeight="bold" letterSpacing="-0.02em">for Fellows</text>
        
        {/* Decorative line */}
        <rect x="48" y="214" width="60" height="3" rx="1.5" fill="#e76f51" />
        
        {/* Subtitle */}
        <text x="48" y="248" fill="#6b7194" fontFamily="system-ui, sans-serif" fontSize="12" letterSpacing="0.02em">40 Units of Structured Learning</text>
        <text x="48" y="268" fill="#6b7194" fontFamily="system-ui, sans-serif" fontSize="12" letterSpacing="0.02em">Interactive Exercises with Explanations</text>
        
        {/* Feature tags */}
        <rect x="48" y="292" width="80" height="24" rx="12" fill="#f0faf9" stroke="#2a9d8f" strokeWidth="1" />
        <text x="88" y="308" textAnchor="middle" fill="#218579" fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="600">Tenses</text>
        
        <rect x="136" y="292" width="80" height="24" rx="12" fill="#f0faf9" stroke="#2a9d8f" strokeWidth="1" />
        <text x="176" y="308" textAnchor="middle" fill="#218579" fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="600">Modals</text>
        
        <rect x="224" y="292" width="80" height="24" rx="12" fill="#f0faf9" stroke="#2a9d8f" strokeWidth="1" />
        <text x="264" y="308" textAnchor="middle" fill="#218579" fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="600">Articles</text>
        
        {/* Myanmar subtitle */}
        <text x="48" y="345" fill="#3d4263" fontFamily="system-ui, sans-serif" fontSize="11" opacity="0.7">Myanmar Translations Included</text>
        
        {/* Bottom bar */}
        <rect x="22" y="388" width="294" height="28" fill="#1a1f36" />
        <text x="169" y="406" textAnchor="middle" fill="#faf8f5" fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="500" letterSpacing="0.1em">INTERACTIVE EDITION</text>
      </svg>
    </div>
  );
}
