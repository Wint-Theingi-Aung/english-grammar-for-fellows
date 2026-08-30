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
        <div className="flex justify-between text-sm text-slate-600 mb-1">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
