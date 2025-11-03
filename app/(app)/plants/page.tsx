"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPlants, type Plant } from "@/lib/plants";
import { Button } from "@/components/ui/button";

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    setPlants(getPlants());
  }, []);

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
          <Link href="/plants/add">
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

      {plants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center">
            <span className="text-4xl">🌱</span>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold text-slate-700">No plants yet</h2>
            <p className="text-sm text-slate-500">Add your first plant to get started!</p>
          </div>
          <Link href="/plants/add">
            <Button
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg"
            >
              <span className="mr-2">+</span>
              Add Your First Plant
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4" data-testid="plants-list">
          {plants.map((plant) => (
            <Link
              key={plant.id}
              href={`/plants/${plant.id}`}
              className="group rounded-2xl border border-slate-200 p-4 flex gap-4 items-center bg-gradient-to-r from-white to-green-50/30 shadow-sm hover:shadow-md transition-all duration-200 hover:border-green-200 hover:-translate-y-1"
              data-testid={`plant-item-${plant.id}`}
            >
              <div className="relative">
                <img
                  src={plant.imageUrl || "/nanas.png"}
                  alt={plant.name}
                  className="h-18 w-18 rounded-xl object-cover border border-slate-100"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-slate-800">{plant.name}</div>
                  <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {plant.location}
                  </div>
                </div>
                <div className="text-sm text-slate-600 italic mb-2">{plant.species}</div>
                <div className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="text-xs text-slate-500">
                    Added {new Date(plant.dateAdded).toLocaleDateString()}
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
      )}
    </main>
  );
}


