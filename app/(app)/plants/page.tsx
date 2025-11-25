import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import PlantsContent from "./plants-content";
import { PlantsPageSkeleton } from "./plants-skeleton";

export default async function PlantsPage() {
  // Get authenticated user with Better Auth
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <main className="p-4 sm:p-6 space-y-6 max-w-3xl mx-auto bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <header className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-300 flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">My Plants</h1>
              <p className="text-sm text-slate-500">Manage your plant collection 🌿</p>
            </div>
          </div>
          <Link href="/identify">
            <Button
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg"
              data-testid="add-plant-button"
            >
              <span className="mr-2">+</span>
              Add Plant
            </Button>
          </Link>
        </div>
        <p className="text-sm text-slate-600 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
          <span className="text-lg">📋</span>
          Track and monitor all your plants in one place
        </p>
      </header>

      {/* Progressive Loading for Plants List */}
      <Suspense fallback={<PlantsPageSkeleton />}>
        <PlantsContent userId={session.user.id} />
      </Suspense>
    </main>
  );
}
