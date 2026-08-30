interface FeedbackProps {
  isCorrect: boolean;
  selectedAnswer: string | null;
  correctAnswer: string;
  explanation: string;
}

export default function Feedback({ isCorrect, selectedAnswer, correctAnswer, explanation }: FeedbackProps) {
  return (
    <div
      className={`mt-4 p-4 rounded-lg border-2 ${
        isCorrect
          ? "bg-emerald-50 border-emerald-300 text-emerald-800"
          : "bg-red-50 border-red-300 text-red-800"
      }`}
      role="alert"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{isCorrect ? "\u2713" : "\u2717"}</span>
        <span className="font-semibold">{isCorrect ? "Correct!" : "Incorrect"}</span>
      </div>
      {!isCorrect && selectedAnswer && (
        <p className="text-sm mb-1">
          <span className="font-medium">Your answer:</span> {selectedAnswer}
        </p>
      )}
      {!isCorrect && (
        <p className="text-sm mb-1">
          <span className="font-medium">Correct answer:</span> {correctAnswer}
        </p>
      )}
      <p className="text-sm opacity-90">{explanation}</p>
    </div>
  );
}
