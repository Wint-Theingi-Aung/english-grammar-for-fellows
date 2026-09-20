"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center text-sm mb-2.5">
          <span className="font-sans text-[#3d4263] font-medium">{label}</span>
          <span className="font-sans text-[#2a9d8f] font-semibold tabular-nums">{pct}%</span>
        </div>
      )}
      <div
        className="w-full h-2.5 bg-[#e8e4df] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#2a9d8f] to-[#3ab7a8] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
