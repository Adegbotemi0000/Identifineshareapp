import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextAreaField({
  label,
  error,
  id,
  className,
  ...props
}: TextAreaFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <div className="w-full">
      <label
        htmlFor={fieldId}
        className="block text-xs font-medium text-ink-soft mb-1.5"
      >
        {label}
      </label>
      <textarea
        id={fieldId}
        rows={4}
        className={cn(
          "w-full rounded-xl border border-gold-line bg-paper px-4 py-3 text-sm text-ink resize-none",
          "placeholder:text-ink-soft/50 outline-none transition-colors",
          "focus:border-gold focus:ring-2 focus:ring-gold/20",
          error && "border-red-400 focus:border-red-400 focus:ring-red-100",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${fieldId}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}