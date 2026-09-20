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
      <p className="text-lg sm:text-xl font-serif font-semibold text-[#1a1f36] mb-6 leading-relaxed">
        {question}
      </p>
      <div className="space-y-3" role="radiogroup" aria-label="Answer options">
        {options.map((opt, index) => {
          const isSelected = selectedAnswer === opt;
          const isCorrect = opt === correctAnswer;

          let stateClasses =
            "bg-white border-[#e8e4df] text-[#3d4263]";

          if (isSubmitted) {
            if (isCorrect) {
              stateClasses =
                "bg-[#e6f5f3] border-[#2a9d8f] text-[#1a6b62]";
            } else if (isSelected && !isCorrect) {
              stateClasses =
                "bg-[#fdf0ec] border-[#e76f51] text-[#a94a3a]";
            } else {
              stateClasses =
                "bg-[#f5f3f0] border-[#e8e4df] text-[#6b7194] opacity-50";
            }
          } else if (isSelected) {
            stateClasses =
              "bg-[#e6f5f3] border-[#2a9d8f] text-[#1a6b62] ring-2 ring-[#2a9d8f]/20";
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
                w-full text-left px-5 py-4 rounded-xl border-2
                transition-all duration-200
                ${stateClasses}
                ${!isSubmitted
                  ? "hover:border-[#2a9d8f]/40 hover:bg-[#e6f5f3]/40 hover:-translate-y-0.5 hover:shadow-md cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2a9d8f] focus-visible:ring-offset-2"
                  : "cursor-default"
                }
              `}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Option ${LABELS[index]}: ${opt}`}
            >
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold mr-3.5 flex-shrink-0 align-middle transition-colors duration-200 ${
                isSubmitted && isCorrect
                  ? "bg-[#2a9d8f] text-white"
                  : isSubmitted && isSelected && !isCorrect
                    ? "bg-[#e76f51] text-white"
                    : isSelected && !isSubmitted
                      ? "bg-[#2a9d8f] text-white"
                      : "bg-[#f0ede8] text-[#6b7194]"
              }`}>
                {LABELS[index]}
              </span>
              <span className="align-middle text-sm sm:text-base font-sans">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
