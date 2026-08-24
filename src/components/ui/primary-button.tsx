import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function PrimaryButton({
  children,
  loading,
  disabled,
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        "w-full rounded-full bg-ink text-paper px-6 py-3.5 text-sm font-medium",
        "transition-colors hover:bg-ink/90 active:bg-ink/80",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}