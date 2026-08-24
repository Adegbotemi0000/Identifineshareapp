import Link from "next/link";
import { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  editHref?: string;
  children: ReactNode;
}

export function SummaryCard({ title, editHref, children }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-gold-line bg-paper p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-ink">{title}</h3>
        {editHref && (
          <Link href={editHref} className="text-xs text-gold font-medium">
            Edit
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}