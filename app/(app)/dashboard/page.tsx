import Link from "next/link";
import { ScanSearch, ScanHeart, Bell, Settings } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";


function Header() {
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-green-100 shadow-sm">
            <AvatarImage src="/palm.png" alt="profile" />
          </Avatar>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <div className="text-sm text-slate-500 font-medium">Good morning</div>
          <div className="text-lg font-semibold text-slate-800">Alex</div>
          <div className="text-xs text-slate-400 mt-0.5">Let's check on your plants today</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
        </Button>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
    </header>
  );
}


function ActionCard({ title, href, color = "blue" }: { title: string; href: string; color?: "blue" | "purple" }) {
  const colorClasses = {
    blue: "from-blue-100 to-cyan-50 border-blue-300 hover:from-blue-200 hover:to-cyan-200",
    purple: "from-purple-100 to-pink-50 border-purple-300 hover:from-purple-200 hover:to-pink-200"
  };

  const iconClasses = {
    blue: "text-blue-500",
    purple: "text-purple-500"
  };

  const textClasses = {
    blue: "text-blue-900",
    purple: "text-purple-900"
  };

  return (
    <Link href={href}>
      <Card className={`group rounded-2xl border p-5 bg-gradient-to-br ${colorClasses[color]} shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-12 h-12 bg-white bg-opacity-20 rounded-full transform translate-x-6 -translate-y-6"></div>
        <div className="relative">
          <div className={`w-10 h-10 rounded-xl ${color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'} flex items-center justify-center`}>
            {title === "Identify Plant" ? (
              <ScanSearch className={`w-8 h-8 ${iconClasses[color]}`}>
              </ScanSearch>
            ) : (
              <ScanHeart className={`w-8 h-8 ${iconClasses[color]}`} >
              </ScanHeart>
            )}
          </div>
          <div className={`font-semibold text-base ${textClasses[color]}`}>{title}</div>
        </div>
      </Card>
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
    <main className="p-6 space-y-8 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <Header />
      <div className="grid grid-cols-2 gap-4">
        <ActionCard title="Identify Plant" href="/identify" color="blue" />
        <ActionCard title="Health Check" href="/health" color="purple" />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Your Plants</h2>
          <Badge variant="secondary">3 plants</Badge>
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
