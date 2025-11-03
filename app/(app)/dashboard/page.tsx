"use client";

import Link from "next/link";
import { Bell, Settings } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";


function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user;
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


function ActionCard({
  title,
  emoji,
  href,
  color = "blue"
}: {
  title: string;
  emoji: string;
  href: string;
  color?: "blue" | "purple"
}) {
  const colorClasses = {
    blue: {
      gradient: "from-blue-50 to-cyan-50",
      border: "border-blue-200",
      hover: "hover:border-blue-300 hover:shadow-sm",
      text: "text-blue-900"
    },
    purple: {
      gradient: "from-purple-50 to-pink-50",
      border: "border-purple-200",
      hover: "hover:border-purple-300 hover:shadow-sm",
      text: "text-purple-900"
    }
  };

  const style = colorClasses[color];

  return (
    <Link href={href} className="block">
      <div className={`group rounded-xl border py-3 px-3 bg-gradient-to-br ${style.gradient} ${style.border} ${style.hover} transition-all duration-200 active:scale-95 relative overflow-hidden`}>
        <div className="relative flex items-center gap-2.5">
          {/* Emoji Icon */}
          <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
            {emoji}
          </div>

          {/* Title */}
          <h3 className={`font-semibold text-sm ${style.text} flex-1`}>
            {title}
          </h3>

          {/* Arrow */}
          <svg className={`w-4 h-4 ${style.text} opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function PlantItem() {
  return (
    <Link href="/plants/1" className="group rounded-2xl border border-slate-200 p-4 flex gap-4 items-center bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:border-green-200">
      <div className="relative">
        <img
          src="/bougenvile.png"
          alt="plant"
          className="h-18 w-18 rounded-xl object-cover border border-slate-100"
        />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-slate-800">Daisy</div>
          <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            45% Health
          </div>
        </div>
        <div className="mb-3">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-300" style={{ width: "45%" }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs text-slate-500">Next hydration in 2 days</div>
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-6 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <Header />

      {/* Quick Actions - Compact */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-slate-700">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ActionCard
            title="Identify Plant"
            emoji="🔍"
            href="/identify"
            color="blue"
          />
          <ActionCard
            title="Health Check"
            emoji="💚"
            href="/health"
            color="purple"
          />
        </div>
      </section>

      {/* Your Plants */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">Your Plants</h2>
            <span className="text-xl">🌱</span>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">3 plants</Badge>
        </div>
        <div className="space-y-3">
          <PlantItem />
          <PlantItem />
          <PlantItem />
        </div>
      </section>
    </main>
  );
}
