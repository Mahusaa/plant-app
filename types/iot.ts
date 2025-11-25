/**
 * Firebase IoT Device Data Types
 * Based on the schema: devices/{deviceId}/{threshold_plan, iot_data}
 */

import type { IdentifyResult } from "@/lib/ai-schema";

/**
 * Threshold configuration for a device
 * Extends IdentifyResult with numeric thresholds for IoT device control
 * Set by AI after plant identification
 */
export interface ThresholdPlan extends IdentifyResult {
  // Numeric thresholds for IoT device (backward compatible)
  lux: number; // Light intensity threshold in lux
  soil_moisture: number; // Soil moisture threshold in percentage
  water_level?: number; // Optional water level threshold
  temperature?: number; // Optional temperature threshold in Celsius
  humidity?: number; // Optional humidity threshold in percentage
}

/**
 * Single sensor reading at a specific timestamp
 */
export interface SensorReading {
  intensitas_cahaya: number; // Light intensity (0-100)
  kelembapan_tanah: number; // Soil moisture level (0-5 or similar scale)
  kualitas_cahaya: string; // Light quality ("Terang", "Gelap", etc.)
  level_air: number; // Water level (0-100)
  status_pompa: string; // Pump status ("NYALA", "MATI")
  timestamp: number; // Unix timestamp in milliseconds
}

/**
 * Device metadata stored in Firebase
 */
export interface DeviceMetadata {
  plantName: string;
  userId: string;
  roomLocation: string;
  imageUrl: string;
  addedAt: string; // ISO timestamp
  lastSync: string; // ISO timestamp
}

/**
 * Complete device data structure
 */
export interface DeviceData {
  id: string;
  threshold_plan?: ThresholdPlan;
  readings: Record<string, SensorReading>; // Key: Firebase generated ID, Value: sensor reading
  metadata?: DeviceMetadata;
}

/**
 * Processed sensor data with computed status
 */
export interface ProcessedSensorData extends SensorReading {
  status: {
    level_air: "optimal" | "warning" | "critical";
    intensitas_cahaya: "optimal" | "warning" | "critical";
    kelembapan_tanah: "optimal" | "warning" | "critical";
    overall: "optimal" | "warning" | "critical";
  };
}

/**
 * Historical data point for charts
 */
export interface DataPoint {
  timestamp: number; // Unix timestamp in milliseconds
  time: string; // Formatted time for display (e.g., "20:00")
  level_air: number;
  intensitas_cahaya: number;
  kelembapan_tanah: number;
  kualitas_cahaya: string;
  status_pompa: string;
}

/**
 * Time range options for historical data
 */
export type TimeRange = "30min" | "1hour" | "6hours" | "24hours" | "7days" | "30days";

/**
 * Watering event detection result
 */
export interface WateringEvent {
  timestamp: string;
  moistureIncrease: number; // Percentage increase
  beforeMoisture: number;
  afterMoisture: number;
}
