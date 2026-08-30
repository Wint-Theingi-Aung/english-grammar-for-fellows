"use client";

import { useState } from "react";

interface FillInBlankProps {
  question: string;
  selectedAnswer: string | null;
  isSubmitted: boolean;
  correctAnswer: string;
  onSelect: (answer: string) => void;
}

export default function FillInBlank({
  question,
  selectedAnswer,
  isSubmitted,
  correctAnswer,
  onSelect,
}: FillInBlankProps) {
  const [inputValue, setInputValue] = useState(selectedAnswer ?? "");

  const handleChange = (value: string) => {
    setInputValue(value);
    onSelect(value);
  };

  let borderClass = "border-slate-300 focus:border-indigo-500";
  if (isSubmitted) {
    const isCorrect =
      inputValue.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    borderClass = isCorrect
      ? "border-emerald-400 bg-emerald-50"
      : "border-red-400 bg-red-50";
  }

  return (
    <div>
      <p className="text-base font-medium text-slate-800 mb-4 leading-relaxed">{question}</p>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isSubmitted}
        placeholder="Type your answer..."
        className={`w-full px-4 py-3 rounded-lg border-2 text-base outline-none transition-colors ${borderClass} ${isSubmitted ? "cursor-default" : ""}`}
        aria-label="Fill in the blank answer"
      />
    </div>
  );
}
