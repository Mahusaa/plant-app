"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Grid2X2, History, List, User } from "lucide-react";

const items = [
  { href: "/dashboard", icon: Grid2X2, emoji: "🏠", color: "blue" },
  { href: "/plants", icon: List, emoji: "🌱", color: "green" },
  { href: "/analytics", icon: Bot, emoji: "📊", color: "purple" },
  { href: "/history", icon: History, emoji: "📜", color: "yellow" },
  { href: "/profile", icon: User, emoji: "👤", color: "pink" },
];

const getColorClasses = (color: string, active: boolean) => {
  const baseClasses = "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105";

  if (active) {
    switch (color) {
      case "blue":
        return `${baseClasses} bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-200`;
      case "green":
        return `${baseClasses} bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200`;
      case "purple":
        return `${baseClasses} bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200`;
      case "yellow":
        return `${baseClasses} bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-200`;
      case "pink":
        return `${baseClasses} bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200`;
      default:
        return `${baseClasses} bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-200`;
    }
  } else {
    return `${baseClasses} bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 hover:from-slate-200 hover:to-slate-300 border border-slate-300`;
  }
};

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="rounded-2xl bg-gradient-to-r from-white/90 to-slate-50/90 backdrop-blur-lg shadow-xl border border-slate-200 px-4 py-3 flex items-center gap-2">
        {items.map(({ href, emoji, color }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={getColorClasses(color, active)}
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


