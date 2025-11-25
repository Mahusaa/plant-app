"use client";

import { Bell, Settings } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { User } from "@/db/schema";

interface DashboardHeaderClientProps {
  user: Omit<User, 'image'> & { image?: string | null };
}

export default function DashboardHeaderClient({ user }: DashboardHeaderClientProps) {
  const router = useRouter();

  const userName = user?.name || "User";
  const firstName = userName.split(" ")[0];

  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || user?.email?.[0]?.toUpperCase() || "U";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-green-100 shadow-sm">
            <AvatarImage src={user?.image || "/palm.png"} alt="profile" />
            <AvatarFallback className="bg-green-100 text-green-700 font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <div className="text-sm text-slate-500 font-medium">{getGreeting()}</div>
          <div className="text-lg font-semibold text-slate-800">{firstName}</div>
          <div className="text-xs text-slate-400 mt-0.5">Let's check on your plants today</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-gray-100"
          onClick={() => router.push("/profile")}
        >
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
    </header>
  );
}
