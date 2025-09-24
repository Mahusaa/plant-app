"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Grid2X2, History, List, User } from "lucide-react";
import clsx from "clsx";

const items = [
  { href: "/dashboard", icon: Grid2X2 },
  { href: "/plants", icon: List },
  { href: "/analytics", icon: Bot },
  { href: "/history", icon: History },
  { href: "/profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="rounded-full bg-card/40 backdrop-blur shadow-sm border px-3 py-2 flex items-center gap-3">
        {items.map(({ href, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-muted"
              )}
              aria-label={href}
            >
              <Icon size={18} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}


