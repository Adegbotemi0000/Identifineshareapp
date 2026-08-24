interface CompletionBarProps {
  percentage: number;
}

export function CompletionBar({ percentage }: CompletionBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-ink-soft">
          Profile completion
        </span>
        <span className="text-xs font-mono text-gold">{clamped}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-gold-line overflow-hidden">
        <div
          className="h-full rounded-full bg-gold transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}