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
      className={`mt-5 p-5 rounded-xl border-2 animate-scale-in ${
        isCorrect
          ? "bg-success-50 border-success-500/30"
          : "bg-error-50 border-error-500/30"
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
            isCorrect
              ? "bg-success-500 text-white"
              : "bg-error-500 text-white"
          }`}
          aria-hidden="true"
        >
          {isCorrect ? "\u2713" : "\u2717"}
        </span>
        <span
          className={`font-bold text-base ${
            isCorrect ? "text-success-700" : "text-error-700"
          }`}
        >
          {isCorrect ? "Correct!" : "Incorrect"}
        </span>
      </div>

      {!isCorrect && selectedAnswer && (
        <p className="text-sm mb-1.5 text-error-600">
          <span className="font-semibold">Your answer:</span>{" "}
          <span className="text-error-700">{selectedAnswer}</span>
        </p>
      )}
      {!isCorrect && (
        <p className="text-sm mb-2 text-success-600">
          <span className="font-semibold">Correct answer:</span>{" "}
          <span className="text-success-700 font-medium">{correctAnswer}</span>
        </p>
      )}

      <div className="mt-3 pt-3 border-t border-ink/10">
        <p
          className={`text-sm leading-relaxed myanmar-text ${
            isCorrect ? "text-success-700" : "text-error-700"
          }`}
        >
          {explanation}
        </p>
      </div>
    </div>
  );
}
