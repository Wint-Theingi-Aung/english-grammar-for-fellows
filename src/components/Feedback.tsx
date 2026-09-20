interface FeedbackProps {
  isCorrect: boolean;
  selectedAnswer: string | null;
  correctAnswer: string;
  explanation: string;
}

export default function Feedback({
  isCorrect,
  selectedAnswer,
  correctAnswer,
  explanation,
}: FeedbackProps) {
  return (
    <div
      className={`mt-6 p-5 rounded-xl border-2 transition-colors duration-200 ${
        isCorrect
          ? "bg-[#e6f5f3] border-[#2a9d8f]/30"
          : "bg-[#fdf0ec] border-[#e76f51]/30"
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
            isCorrect
              ? "bg-[#2a9d8f] text-white"
              : "bg-[#e76f51] text-white"
          }`}
          aria-hidden="true"
        >
          {isCorrect ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </span>
        <span
          className={`font-serif font-bold text-base ${
            isCorrect ? "text-[#1a6b62]" : "text-[#a94a3a]"
          }`}
        >
          {isCorrect ? "Correct!" : "Incorrect"}
        </span>
      </div>

      {!isCorrect && selectedAnswer && (
        <p className="text-sm mb-1.5 font-sans text-[#a94a3a]">
          <span className="font-semibold">Your answer:</span>{" "}
          <span>{selectedAnswer}</span>
        </p>
      )}
      {!isCorrect && (
        <p className="text-sm mb-2 font-sans text-[#1a6b62]">
          <span className="font-semibold">Correct answer:</span>{" "}
          <span className="font-medium">{correctAnswer}</span>
        </p>
      )}

      <div className="mt-3 pt-3 border-t border-[#1a1f36]/10">
        <p className="text-sm leading-relaxed font-sans text-[#3d4263] myanmar-text">
          {explanation}
        </p>
      </div>
    </div>
  );
}
