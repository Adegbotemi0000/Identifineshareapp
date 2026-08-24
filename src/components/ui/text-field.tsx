import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ label, error, id, className, ...props }: TextFieldProps) {
  const inputId = id ?? props.name;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-xs font-medium text-ink-soft mb-1.5"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "w-full rounded-xl border border-gold-line bg-paper px-4 py-3 text-sm text-ink",
          "placeholder:text-ink-soft/50 outline-none transition-colors",
          "focus:border-gold focus:ring-2 focus:ring-gold/20",
          error && "border-red-400 focus:border-red-400 focus:ring-red-100",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}