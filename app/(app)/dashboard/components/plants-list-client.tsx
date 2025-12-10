"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toIndonesiaTime } from "@/lib/time-utils";

interface Plant {
  id: string;
  name: string;
  roomLocation: string | null;
  createdAt: Date;
  firebaseDeviceId: string;
}

interface PlantsListClientProps {
  plants: Plant[];
}

function PlantItem({ plant }: { plant: Plant }) {
  return (
    <Link
      href={`/plants/${plant.id}`}
      className="group rounded-2xl border border-slate-200 p-4 flex gap-4 items-center bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:border-green-200"
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
          <svg
            className="w-3 h-3 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <div className="text-xs text-slate-500">
            Added {toIndonesiaTime(plant.createdAt).date}
          </div>
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-5 h-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}

export default function PlantsListClient({ plants }: PlantsListClientProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-800">Your Plants</h2>
          <span className="text-xl">🌱</span>
        </div>
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-700 border-green-200"
        >
          {plants.length} {plants.length === 1 ? "plant" : "plants"}
        </Badge>
      </div>
      {plants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center">
            <span className="text-3xl">🌱</span>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-base font-semibold text-slate-700">
              No plants yet
            </h3>
            <p className="text-sm text-slate-500">
              Scan your first plant to get started!
            </p>
          </div>
          <Link href="/identify">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg">
              <span className="mr-2">📷</span>
              Identify Your First Plant
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {plants.map((plant) => (
            <PlantItem key={plant.id} plant={plant} />
          ))}
        </div>
      )}
    </section>
  );
}
