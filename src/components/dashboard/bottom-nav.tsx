"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Share2, Settings, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/share", label: "Share", icon: Share2 },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 bg-paper/90 backdrop-blur border-t border-gold-line px-4 py-3 flex items-center justify-around">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 text-[11px] transition-colors",
              active ? "text-ink" : "text-ink-soft"
            )}
          >
            <Icon
              className="w-5 h-5"
              strokeWidth={active ? 2.25 : 1.75}
              color={active ? "var(--color-gold)" : undefined}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}