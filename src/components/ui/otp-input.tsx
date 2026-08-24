import { useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";

interface OtpInputProps {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export function OtpInput({ length = 6, value, onChange, error }: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  function updateDigit(index: number, digit: string) {
    const next = [...value];
    next[index] = digit;
    onChange(next);
  }

  function handleChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);
    updateDigit(index, digit);
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    const next = Array.from({ length }, (_, i) => pasted[i] ?? "");
    onChange(next);
    const lastFilled = Math.min(pasted.length, length) - 1;
    inputsRef.current[lastFilled >= 0 ? lastFilled : 0]?.focus();
  }

  return (
    <div>
      <div className="flex justify-between gap-2" onPaste={handlePaste}>
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] ?? ""}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            aria-label={`Digit ${i + 1} of verification code`}
            className="w-11 h-13 aspect-square rounded-xl border border-gold-line bg-paper text-center text-lg font-mono text-ink outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-red-600 text-center">{error}</p>}
    </div>
  );
}