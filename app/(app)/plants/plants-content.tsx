import Link from "next/link";
import { getPlants } from "@/db/queries/plants";
import { Button } from "@/components/ui/button";

interface PlantsContentProps {
  userId: string;
}

export default async function PlantsContent({ userId }: PlantsContentProps) {
  // Fetch user's plants from PostgreSQL
  const plants = await getPlants({ userId });

  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center">
          <span className="text-4xl">🌱</span>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-slate-700">No plants yet</h2>
          <p className="text-sm text-slate-500">Scan your first plant to get started!</p>
        </div>
        <Link href="/identify">
          <Button
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg"
          >
            <span className="mr-2">📷</span>
            Identify Your First Plant
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4" data-testid="plants-list">
      {plants.map((plant) => (
        <Link
          key={plant.id}
          href={`/plants/${plant.id}`}
          className="group rounded-2xl border border-slate-200 p-4 flex gap-4 items-center bg-gradient-to-r from-white to-green-50/30 shadow-sm hover:shadow-md transition-all duration-200 hover:border-green-200 hover:-translate-y-1"
          data-testid={`plant-item-${plant.id}`}
        >
          <div className="relative">
            <div className="h-18 w-18 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 border border-slate-100 flex items-center justify-center">
              <span className="text-3xl">🌿</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-slate-800">{plant.name}</div>
              {plant.roomLocation && (
                <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  {plant.roomLocation}
                </div>
              )}
            </div>
            <div className="text-sm text-slate-600 mb-2">
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                📡 Device Connected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="text-xs text-slate-500">
                Added {plant.createdAt.toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}
