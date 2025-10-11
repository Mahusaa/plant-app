"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Grid2X2, History, List, User } from "lucide-react";

const items = [
  { href: "/dashboard", icon: Grid2X2, emoji: "🏠" },
  { href: "/plants", icon: List, emoji: "🌱" },
  { href: "/analytics", icon: Bot, emoji: "📊" },
  { href: "/history", icon: History, emoji: "📜" },
  { href: "/profile", icon: User, emoji: "👤" },
];

const getColorClasses = (active: boolean) => {
  const baseClasses = "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105";

  if (active) {
    return `${baseClasses} bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl`;
  } else {
    return `${baseClasses} bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 hover:from-slate-200 hover:to-slate-300 border border-slate-300`;
  }
};

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="rounded-2xl bg-gradient-to-r from-white/90 to-slate-50/90 backdrop-blur-lg shadow-xl border border-slate-200 px-4 py-3 flex items-center gap-2">
        {items.map(({ href, emoji }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={getColorClasses(active)}
              aria-label={href}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">{emoji}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}


