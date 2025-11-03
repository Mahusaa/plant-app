"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPlant, type Plant } from "@/lib/plants";
import { PlantDetailClient } from "./plant-detail-client";
import { DetailHeader } from "./detail-header";
import type { PlantData } from "./page";

interface PlantDetailWrapperProps {
  id: string;
  mockPlantData: PlantData;
}

export function PlantDetailWrapper({ id, mockPlantData }: PlantDetailWrapperProps) {
  const router = useRouter();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const plantFromStorage = getPlant(id);
    if (!plantFromStorage) {
      router.push("/plants");
      return;
    }
    setPlant(plantFromStorage);
    setIsLoading(false);
  }, [id, router]);

  if (isLoading || !plant) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-50 border border-green-300 flex items-center justify-center mx-auto">
            <span className="text-3xl animate-pulse">🌱</span>
          </div>
          <p className="text-sm text-slate-600">Loading plant...</p>
        </div>
      </main>
    );
  }

  // Merge real plant data with mock sensor data
  const plantData: PlantData = {
    ...mockPlantData,
    name: plant.name,
    latinName: plant.species,
    image: plant.imageUrl || "/bougenvile.png",
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      <div className="mx-auto max-w-md">
        <DetailHeader plant={plant} />

        {/* Plant Profile */}
        <section className="px-6 py-4 space-y-3">
          <div className="flex gap-3 items-center">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
                <img
                  src={plantData.image}
                  alt={plantData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                <span className="text-[10px]">✓</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900 truncate">{plantData.name}</h2>
              <p className="text-xs text-slate-600 italic truncate">{plantData.latinName}</p>
              {plant.location && (
                <p className="text-xs text-slate-500 mt-1">📍 {plant.location}</p>
              )}
            </div>
          </div>

          {plant.notes && (
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-slate-700 mb-1">Notes</p>
              <p className="text-sm text-slate-600">{plant.notes}</p>
            </div>
          )}
        </section>

        <PlantDetailClient plantData={plantData} />
      </div>
    </main>
  );
}
