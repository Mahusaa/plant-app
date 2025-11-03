import type { Metadata } from "next";
import BottomNav from "@/components/ui/bottom-nav";
import { UserHeader } from "@/components/auth/user-header";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh pb-20">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-lg font-semibold text-green-600">PlantCare</h1>
          <UserHeader />
        </div>
      </header>
      {children}
      <BottomNav />
    </div>
  );
}


