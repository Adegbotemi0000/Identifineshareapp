import type { ComponentType, CSSProperties } from "react";
import { getContrastTextColor } from "@/lib/color";

interface ActionButtonProps {
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  label: string;
  href: string;
  external?: boolean;
  accentColor: string;
}

export function ActionButton({
  icon: Icon,
  label,
  href,
  external,
  accentColor,
}: ActionButtonProps) {
  const foreground = getContrastTextColor(accentColor);

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex flex-col items-center gap-2 rounded-xl border border-gold-line py-3 px-2 text-center hover:opacity-90 transition-opacity"
    >
      <span
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: accentColor }}
      >
        <Icon className="w-4 h-4" style={{ color: foreground }} />
      </span>
      <span className="text-[11px] text-ink leading-tight">{label}</span>
    </a>
  );
}