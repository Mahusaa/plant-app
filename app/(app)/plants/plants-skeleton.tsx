import { Skeleton } from "@/components/ui/skeleton";

export function PlantsPageSkeleton() {
  return (
    <div className="grid gap-4">
      <PlantItemSkeleton />
      <PlantItemSkeleton />
      <PlantItemSkeleton />
      <PlantItemSkeleton />
    </div>
  );
}

function PlantItemSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 p-4 flex gap-4 items-center bg-gradient-to-r from-white to-green-50/30 shadow-sm">
      <Skeleton className="h-18 w-18 rounded-xl" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-32 rounded-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-5 w-5" />
    </div>
  );
}
