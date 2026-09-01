"use client";

const LABELS = ["A", "B", "C"];

interface MultipleChoiceProps {
  question: string;
  options: string[];
  selectedAnswer: string | null;
  isSubmitted: boolean;
  correctAnswer: string;
  onSelect: (answer: string) => void;
}

export default function MultipleChoice({
  question,
  options,
  selectedAnswer,
  isSubmitted,
  correctAnswer,
  onSelect,
}: MultipleChoiceProps) {
  return (
    <div>
      <p className="text-base sm:text-lg font-semibold text-ink mb-5 leading-relaxed">
        {question}
      </p>
      <div className="space-y-2.5" role="radiogroup" aria-label="Answer options">
        {options.map((opt, index) => {
          const isSelected = selectedAnswer === opt;
          const isCorrect = opt === correctAnswer;

          let stateClasses =
            "bg-surface border-border text-ink-light answer-btn";

          if (isSubmitted) {
            if (isCorrect) {
              stateClasses =
                "bg-success-50 border-success-500/50 text-success-700";
            } else if (isSelected && !isCorrect) {
              stateClasses = "bg-error-50 border-error-500/50 text-error-700";
            } else {
              stateClasses =
                "bg-surface-alt border-border text-ink-muted opacity-60";
            }
          } else if (isSelected) {
            stateClasses =
              "bg-primary-50 border-primary-400 text-primary-700 ring-2 ring-primary-200/60";
          }

          return (
            <button
              key={opt}
              type="button"
              disabled={isSubmitted}
              onClick={() => onSelect(opt)}
              data-selected={isSelected && !isSubmitted ? "true" : undefined}
              data-correct={isSubmitted && isCorrect ? "true" : undefined}
              data-incorrect={isSubmitted && isSelected && !isCorrect ? "true" : undefined}
              className={`
                w-full text-left px-4 py-3.5 sm:py-4 rounded-xl border-2
                transition-all duration-200
                ${stateClasses}
                ${!isSubmitted
                  ? "hover:border-primary-300 hover:bg-primary-50/40 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
                  : "cursor-default"
                }
              `}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Option ${LABELS[index]}: ${opt}`}
            >
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold mr-3 flex-shrink-0 align-middle transition-colors duration-200 ${
                isSubmitted && isCorrect
                  ? "bg-success-500 text-white"
                  : isSubmitted && isSelected && !isCorrect
                    ? "bg-error-500 text-white"
                    : isSelected && !isSubmitted
                      ? "bg-primary-600 text-white"
                      : "bg-surface-alt text-ink-muted"
              }`}>
                {LABELS[index]}
              </span>
              <span className="align-middle text-sm sm:text-base">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
