interface StepIndicatorProps {
  steps: string[];
  currentIndex: number;
}

export function StepIndicator({ steps, currentIndex }: StepIndicatorProps) {
  return (
    <div>
      <div className="flex gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= currentIndex ? "bg-gold" : "bg-gold-line"
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-ink-soft font-mono">
        Step {currentIndex + 1} of {steps.length} — {steps[currentIndex]}
      </p>
    </div>
  );
}