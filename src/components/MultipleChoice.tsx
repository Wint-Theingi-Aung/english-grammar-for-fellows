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
      <p className="text-base sm:text-lg font-medium text-foreground mb-5 leading-relaxed">
        {question}
      </p>
      <div className="space-y-2.5">
        {options.map((opt, index) => {
          const isSelected = selectedAnswer === opt;
          const isCorrect = opt === correctAnswer;

          let stateClasses = "bg-surface border-border text-slate-700";
          if (isSubmitted) {
            if (isCorrect) {
              stateClasses = "bg-success-50 border-success-500 text-success-700";
            } else if (isSelected && !isCorrect) {
              stateClasses = "bg-error-50 border-error-500 text-error-700";
            } else {
              stateClasses = "bg-surface-alt border-border text-slate-400";
            }
          } else if (isSelected) {
            stateClasses = "bg-primary-50 border-primary-400 ring-2 ring-primary-200 text-primary-700";
          }

          return (
            <button
              key={opt}
              type="button"
              disabled={isSubmitted}
              onClick={() => onSelect(opt)}
              className={`
                w-full text-left px-4 py-3.5 rounded-xl border-2
                transition-all duration-200
                ${stateClasses}
                ${!isSubmitted
                  ? "hover:border-primary-300 hover:bg-primary-50/50 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1"
                  : "cursor-default"
                }
              `}
              aria-pressed={isSelected}
              aria-label={`Option ${LABELS[index]}: ${opt}`}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-surface-alt text-xs font-bold text-slate-500 mr-3 flex-shrink-0 align-middle
                group-hover:bg-primary-100 group-hover:text-primary-600
                aria-pressed:bg-primary-600 aria-pressed:text-white
              ">
                {LABELS[index]}
              </span>
              <span className="align-middle">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
