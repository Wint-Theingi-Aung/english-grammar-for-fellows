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
      <p className="text-base font-medium text-slate-800 mb-4 leading-relaxed">{question}</p>
      <div className="space-y-2">
        {options.map((opt, index) => {
          const isSelected = selectedAnswer === opt;
          const isCorrect = opt === correctAnswer;
          let bgClass = "bg-white border-slate-300";
          let textClass = "text-slate-700";

          if (isSubmitted) {
            if (isCorrect) {
              bgClass = "bg-emerald-50 border-emerald-400";
              textClass = "text-emerald-800";
            } else if (isSelected && !isCorrect) {
              bgClass = "bg-red-50 border-red-400";
              textClass = "text-red-800";
            } else {
              bgClass = "bg-slate-50 border-slate-200";
              textClass = "text-slate-400";
            }
          } else if (isSelected) {
            bgClass = "bg-indigo-50 border-indigo-400 ring-2 ring-indigo-400";
            textClass = "text-indigo-800";
          }

          return (
            <button
              key={`${opt}`}
              type="button"
              disabled={isSubmitted}
              onClick={() => onSelect(opt)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${bgClass} ${textClass} ${!isSubmitted ? "hover:border-indigo-300 cursor-pointer" : "cursor-default"}`}
            >
              <span className="font-semibold mr-2">{LABELS[index]}.</span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
