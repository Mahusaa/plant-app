"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlantDetailClient } from "./plant-detail-client";
import { DetailHeader } from "./detail-header";
import type { PlantData, SensorData } from "./page";
import { useLatestSensorReading, useDeviceThresholds } from "@/lib/firebase-iot";
import { Badge } from "@/components/ui/badge";

interface PlantDetailWrapperProps {
  id: string;
  mockPlantData: PlantData;
  firebaseDeviceId: string | null;
  roomLocation: string | null;
}

export function PlantDetailWrapper({
  id,
  mockPlantData,
  firebaseDeviceId,
  roomLocation,
}: PlantDetailWrapperProps) {
  const router = useRouter();

  // Debug: Log props
  console.log("🌱 PlantDetailWrapper - Plant ID:", id);
  console.log("📡 PlantDetailWrapper - Firebase Device ID:", firebaseDeviceId);
  console.log("📍 PlantDetailWrapper - Room:", roomLocation);

  // Get real-time sensor data from Firebase
  const { reading: latestReading, loading: sensorLoading, error: sensorError } = useLatestSensorReading(firebaseDeviceId);
  const { thresholds, loading: thresholdsLoading } = useDeviceThresholds(firebaseDeviceId);

  console.log("📊 Sensor loading:", sensorLoading);
  console.log("📊 Latest reading:", latestReading);
  console.log("❌ Sensor error:", sensorError);

  // Merge real-time sensor data with plant data
  const plantData: PlantData = {
    ...mockPlantData,
    currentSensorData: latestReading ? {
      waterLevel: latestReading.level_air,
      lightIntensity: latestReading.intensitas_cahaya,
      soilMoisture: latestReading.kelembapan_tanah,
      timestamp: new Date(latestReading.timestamp),
    } : mockPlantData.currentSensorData,
  };

  // Create a simple plant object for DetailHeader (from localStorage format)
  const plantForHeader = {
    id,
    name: mockPlantData.name,
    species: mockPlantData.latinName,
    location: roomLocation || "",
    imageUrl: mockPlantData.image,
    notes: "",
    dateAdded: new Date().toISOString(),
  };

  const hasDevice = !!firebaseDeviceId;
  const statusColor = latestReading?.status.overall === "optimal"
    ? "bg-green-500"
    : latestReading?.status.overall === "warning"
    ? "bg-yellow-500"
    : latestReading?.status.overall === "critical"
    ? "bg-red-500"
    : "bg-slate-400";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      <div className="mx-auto max-w-md">
        <DetailHeader plant={plantForHeader} />

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
              <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 ${statusColor} rounded-full border-2 border-white flex items-center justify-center shadow-sm`}>
                <span className="text-[10px]">✓</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900 truncate">{plantData.name}</h2>
              <p className="text-xs text-slate-600 italic truncate">{plantData.latinName}</p>
              {roomLocation && (
                <p className="text-xs text-slate-500 mt-1">📍 {roomLocation}</p>
              )}
            </div>
          </div>

          {/* Device Connection Status */}
          <div className="flex gap-2 flex-wrap">
            {hasDevice ? (
              <>
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 text-xs">
                  <span className="mr-1">📡</span>
                  Device Connected
                </Badge>
                {latestReading && (
                  <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 text-xs">
                    <span className="mr-1">📊</span>
                    Live Data
                  </Badge>
                )}
              </>
            ) : (
              <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-600 text-xs">
                <span className="mr-1">⚠️</span>
                No Device Connected
              </Badge>
            )}
          </div>

          {/* Device Error Message */}
          {sensorError && hasDevice && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-red-700 mb-1">Sensor Error</p>
              <p className="text-xs text-red-600">{sensorError}</p>
            </div>
          )}
        </section>

        <PlantDetailClient
          plantData={plantData}
          hasDevice={hasDevice}
          deviceId={firebaseDeviceId}
          isLoadingSensor={sensorLoading}
        />
      </div>
    </main>
  );
}
