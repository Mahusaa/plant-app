import type { Metadata } from "next";
import BottomNav from "@/components/ui/bottom-nav";

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
      {children}
      <BottomNav />
    </div>
  );
}
