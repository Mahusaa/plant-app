"use client";

import {
  get,
  limitToLast,
  onValue,
  orderByKey,
  query,
  ref,
} from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "@/lib/firebase";
import type {
  DataPoint,
  DeviceData,
  ProcessedSensorData,
  SensorReading,
  ThresholdPlan,
  TimeRange,
} from "@/types/iot";

/**
 * Clamp sensor values to 0-100% range
 */
function clampToPercentage(value: number): number {
  if (value < 0 || value > 100) {
    console.warn(`Sensor value out of range: ${value}. Clamping to 0-100.`);
  }
  return Math.max(0, Math.min(100, value));
}

/**
 * Hook to subscribe to real-time device data
 */
export function useDeviceData(deviceId: string | null | undefined) {
  const [data, setData] = useState<DeviceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!deviceId) {
      console.log("⚠️ useDeviceData - No device ID provided");
      setLoading(false);
      return;
    }

    console.log("🔥 useDeviceData - Connecting to Firebase path:", deviceId);
    const deviceRef = ref(database, `devices/${deviceId}`);

    const unsubscribe = onValue(
      deviceRef,
      (snapshot) => {
        console.log("🔥 useDeviceData - Snapshot received for:", deviceId);
        console.log("📊 useDeviceData - Snapshot exists:", snapshot.exists());

        if (snapshot.exists()) {
          const rawData = snapshot.val();
          console.log(
            "✅ useDeviceData - Raw Firebase data:",
            JSON.stringify(rawData, null, 2),
          );

          // Map old field names to new format
          const deviceData: DeviceData = {
            id: deviceId,
            threshold_plan: rawData.threshold_plan,
            readings: rawData.iot_data || rawData.readings || {},
            metadata: rawData.metadata,
          };

          console.log(
            "📊 useDeviceData - Has readings:",
            !!deviceData.readings,
          );
          console.log(
            "📊 useDeviceData - Readings count:",
            deviceData.readings ? Object.keys(deviceData.readings).length : 0,
          );
          setData(deviceData);
          setError(null);
        } else {
          console.log("❌ useDeviceData - Device not found at path:", deviceId);
          setData(null);
          setError("Device not found");
        }
        setLoading(false);
      },
      (err) => {
        console.error(
          "❌ useDeviceData - Error subscribing to device data:",
          err,
        );
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [deviceId]);

  return { data, loading, error };
}

/**
 * Hook to get device thresholds
 */
export function useDeviceThresholds(deviceId: string | null | undefined) {
  const [thresholds, setThresholds] = useState<ThresholdPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deviceId) {
      setLoading(false);
      return;
    }

    const thresholdRef = ref(database, `devices/${deviceId}/threshold_plan`);

    const unsubscribe = onValue(thresholdRef, (snapshot) => {
      if (snapshot.exists()) {
        setThresholds(snapshot.val() as ThresholdPlan);
      } else {
        setThresholds(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [deviceId]);

  return { thresholds, loading };
}

/**
 * Hook to get latest sensor reading with status
 */
export function useLatestSensorReading(deviceId: string | null | undefined) {
  const { data, loading, error } = useDeviceData(deviceId);
  const { thresholds } = useDeviceThresholds(deviceId);

  const [latestReading, setLatestReading] =
    useState<ProcessedSensorData | null>(null);

  useEffect(() => {
    console.log("🔄 useLatestSensorReading - Device ID:", deviceId);
    console.log("📊 Device data:", data ? "loaded" : "null");
    console.log("📊 Thresholds:", thresholds);

    if (!data?.readings) {
      setLatestReading(null);
      return;
    }

    // Sort readings by timestamp value
    const sortedReadings = Object.entries(data.readings).sort(
      ([keyA, a], [keyB, b]) => {
        const timestampA = a.timestamp || new Date(keyA).getTime();
        const timestampB = b.timestamp || new Date(keyB).getTime();
        return timestampB - timestampA;
      },
    );
    console.log("📊 Total readings:", sortedReadings.length);

    if (sortedReadings.length === 0) {
      setLatestReading(null);
      return;
    }

    const [readingId, rawReading] = sortedReadings[0];
    console.log("✅ Latest reading ID:", readingId);
    console.log("📊 Latest raw reading values:", rawReading);

    // Map old field names to new format - cast to any to handle legacy field names
    const rawData = rawReading as any;
    const reading: SensorReading = {
      timestamp: rawReading.timestamp || new Date(readingId).getTime(),
      level_air: clampToPercentage(
        rawReading.level_air || rawData.water_level || 0,
      ),
      intensitas_cahaya: rawReading.intensitas_cahaya || rawData.lux || 0,
      kelembapan_tanah: clampToPercentage(
        rawReading.kelembapan_tanah || rawData.soil_moisture || 0,
      ),
      kualitas_cahaya: rawReading.kualitas_cahaya || "Unknown",
      status_pompa: rawReading.status_pompa || "MATI",
    };
    console.log("📊 Mapped reading values:", reading);

    // Calculate status based on thresholds
    const status = {
      level_air: getStatus(reading.level_air, 20, 80, "level_air"),
      intensitas_cahaya: thresholds
        ? getStatus(
            reading.intensitas_cahaya,
            thresholds.lux * 0.8,
            thresholds.lux * 1.2,
            "intensitas_cahaya",
          )
        : ("optimal" as "optimal" | "warning" | "critical"),
      kelembapan_tanah: thresholds
        ? getStatus(
            reading.kelembapan_tanah,
            thresholds.soil_moisture * 0.8,
            thresholds.soil_moisture * 1.2,
            "kelembapan_tanah",
          )
        : ("optimal" as "optimal" | "warning" | "critical"),
      overall: "optimal" as "optimal" | "warning" | "critical",
    };

    // Calculate overall status
    const statuses = [
      status.level_air,
      status.intensitas_cahaya,
      status.kelembapan_tanah,
    ];
    if (statuses.includes("critical")) {
      status.overall = "critical";
    } else if (statuses.includes("warning")) {
      status.overall = "warning";
    } else {
      status.overall = "optimal";
    }

    setLatestReading({
      ...reading,
      status,
    });
  }, [data, thresholds, deviceId]);

  return { reading: latestReading, loading, error };
}

/**
 * Hook to get historical sensor data for charts
 */
export function useHistoricalData(
  deviceId: string | null | undefined,
  timeRange: TimeRange = "30min",
) {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deviceId) {
      console.log("⚠️ No device ID provided to useHistoricalData");
      setLoading(false);
      return;
    }

    const limit = getDataPointLimit(timeRange);
    const firebasePath = `devices/${deviceId}/iot_data`;
    const readingsRef = ref(database, firebasePath);
    const dataQuery = query(readingsRef, orderByKey(), limitToLast(limit));

    console.log("🔥 Subscribing to Firebase path:", firebasePath);
    console.log(
      "📊 Fetching last",
      limit,
      "data points for time range:",
      timeRange,
    );

    const unsubscribe = onValue(
      dataQuery,
      (snapshot) => {
        console.log("🔥 Firebase snapshot received for device:", deviceId);
        console.log("📊 Snapshot exists:", snapshot.exists());

        if (snapshot.exists()) {
          const readings = snapshot.val() as Record<string, any>;
          const dataPoints: DataPoint[] = Object.entries(readings)
            .map(([id, reading]) => {
              // Parse timestamp from key if it's ISO string
              const timestamp = reading.timestamp || new Date(id).getTime();

              return {
                timestamp,
                time: formatTime(timestamp),
                level_air: clampToPercentage(
                  reading.level_air || reading.water_level || 0,
                ),
                intensitas_cahaya:
                  reading.intensitas_cahaya || reading.lux || 0,
                kelembapan_tanah: clampToPercentage(
                  reading.kelembapan_tanah || reading.soil_moisture || 0,
                ),
                kualitas_cahaya: reading.kualitas_cahaya || "Unknown",
                status_pompa: reading.status_pompa || "MATI",
              };
            })
            .sort((a, b) => a.timestamp - b.timestamp);

          console.log(
            "✅ Firebase historical data loaded:",
            dataPoints.length,
            "points",
          );
          console.log("📊 First data point:", dataPoints[0]);
          console.log("📊 Last data point:", dataPoints[dataPoints.length - 1]);
          setData(dataPoints);
        } else {
          console.log("❌ No data found in Firebase at path:", firebasePath);
          setData([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("❌ Firebase error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [deviceId, timeRange]);

  return { data, loading };
}

/**
 * Utility function to get status based on thresholds
 */
function getStatus(
  value: number,
  min: number,
  max: number,
  _type: string,
): "optimal" | "warning" | "critical" {
  const warningThreshold = 0.1; // 10% threshold for warning

  if (value >= min && value <= max) {
    return "optimal";
  }

  const deviation = Math.abs(value - (value < min ? min : max)) / max;

  if (deviation > warningThreshold * 2) {
    return "critical";
  }

  if (deviation > warningThreshold) {
    return "warning";
  }

  return "optimal";
}

/**
 * Get data point limit based on time range
 */
function getDataPointLimit(_timeRange: TimeRange): number {
  // Your Firebase data has 48 points (24 hours in 30-min intervals)
  // Fetch all of them to show full variation
  return 48;
}

/**
 * Format timestamp to display time in Indonesian timezone (WIB - UTC+7)
 * Adds 7 hours to server time
 */
function formatTime(timestamp: number): string {
  try {
    // Add 7 hours (7 * 60 * 60 * 1000 milliseconds) for WIB timezone
    const wibTimestamp = timestamp + 7 * 60 * 60 * 1000;
    const date = new Date(wibTimestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return timestamp.toString();
  }
}

/**
 * Fetch historical data for a specific time range (one-time fetch)
 */
export async function fetchHistoricalData(
  deviceId: string,
  timeRange: TimeRange = "30min",
): Promise<DataPoint[]> {
  try {
    const limit = getDataPointLimit(timeRange);
    const readingsRef = ref(database, `devices/${deviceId}/iot_data`);
    const dataQuery = query(readingsRef, orderByKey(), limitToLast(limit));

    const snapshot = await get(dataQuery);

    if (snapshot.exists()) {
      const readings = snapshot.val() as Record<string, SensorReading>;
      return Object.entries(readings)
        .map(([_id, reading]) => ({
          timestamp: reading.timestamp,
          time: formatTime(reading.timestamp),
          level_air: reading.level_air,
          intensitas_cahaya: reading.intensitas_cahaya,
          kelembapan_tanah: reading.kelembapan_tanah,
          kualitas_cahaya: reading.kualitas_cahaya,
          status_pompa: reading.status_pompa,
        }))
        .sort((a, b) => a.timestamp - b.timestamp);
    }

    return [];
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return [];
  }
}
