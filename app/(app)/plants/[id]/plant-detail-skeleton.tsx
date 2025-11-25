import { Skeleton } from "@/components/ui/skeleton";

export function PlantDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-6 pb-8 px-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="flex flex-col items-center gap-4">
          {/* Plant Image */}
          <Skeleton className="w-32 h-32 rounded-2xl" />

          {/* Plant Name */}
          <div className="space-y-2 text-center w-full">
            <Skeleton className="h-7 w-40 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>

          {/* Status Badge */}
          <Skeleton className="h-8 w-28 rounded-full" />

          {/* Last Updated */}
          <Skeleton className="h-4 w-48 rounded-full" />
        </div>
      </div>

      {/* IoT Sensors Section */}
      <section className="px-6 space-y-3 mt-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Sensor Cards Grid */}
        <div className="grid grid-cols-3 gap-2">
          <SensorCardSkeleton />
          <SensorCardSkeleton />
          <SensorCardSkeleton />
        </div>
      </section>

      {/* Chart Section */}
      <section className="px-6 space-y-4 mt-8">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </section>

      {/* AI Analysis Button */}
      <section className="px-6 mt-6">
        <Skeleton className="h-12 w-full rounded-xl" />
      </section>
    </div>
  );
}

function SensorCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 p-3 bg-white shadow-sm">
      <div className="space-y-2">
        <Skeleton className="h-5 w-5 mx-auto" />
        <Skeleton className="h-6 w-12 mx-auto" />
        <Skeleton className="h-3 w-16 mx-auto" />
      </div>
    </div>
  );
}
