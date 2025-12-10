import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import DashboardHeader from "./components/dashboard-header";
import PlantsList from "./components/plants-list";
import QuickActions from "./components/quick-actions";
import { HeaderSkeleton, PlantsSkeleton } from "./components/skeletons";

export default async function DashboardPage() {
  // Get authenticated user with Better Auth
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <main className="p-6 space-y-6 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      {/* Header - Progressive Load */}
      <Suspense fallback={<HeaderSkeleton />}>
        <DashboardHeader userId={session.user.id} />
      </Suspense>

      {/* Quick Actions - No Loading (Static) */}
      <QuickActions />

      {/* Plants List - Progressive Load */}
      <Suspense fallback={<PlantsSkeleton />}>
        <PlantsList userId={session.user.id} />
      </Suspense>
    </main>
  );
}
