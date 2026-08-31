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
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-slate-600 font-medium">{label}</span>
          <span className="text-primary-600 font-semibold tabular-nums">{pct}%</span>
        </div>
      )}
      <div
        className="w-full h-2.5 bg-primary-100 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 progress-fill transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
