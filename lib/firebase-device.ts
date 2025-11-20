import { database } from "@/lib/firebase";
import { ref, get, set, update } from "firebase/database";
import type { DeviceData, ThresholdPlan, SensorReading } from "@/types/iot";

/**
 * Validates if a device exists in Firebase
 */
export async function validateDeviceExists(deviceId: string): Promise<boolean> {
  try {
    const deviceRef = ref(database, `devices/${deviceId}`);
    const snapshot = await get(deviceRef);
    return snapshot.exists();
  } catch (error) {
    console.error("Error validating device:", error);
    return false;
  }
}

/**
 * Gets device data from Firebase
 */
export async function getDeviceData(deviceId: string): Promise<DeviceData | null> {
  try {
    const deviceRef = ref(database, `devices/${deviceId}`);
    const snapshot = await get(deviceRef);

    if (snapshot.exists()) {
      return { ...snapshot.val(), id: deviceId } as DeviceData;
    }
    return null;
  } catch (error) {
    console.error("Error getting device data:", error);
    return null;
  }
}

/**
 * Writes AI-generated thresholds to Firebase device
 */
export async function writeDeviceThresholds(
  deviceId: string,
  thresholds: ThresholdPlan
): Promise<boolean> {
  try {
    const thresholdRef = ref(database, `devices/${deviceId}/threshold_plan`);
    await set(thresholdRef, thresholds);
    return true;
  } catch (error) {
    console.error("Error writing device thresholds:", error);
    return false;
  }
}

/**
 * Gets device thresholds from Firebase
 */
export async function getDeviceThresholds(deviceId: string): Promise<ThresholdPlan | null> {
  try {
    const thresholdRef = ref(database, `devices/${deviceId}/threshold_plan`);
    const snapshot = await get(thresholdRef);

    if (snapshot.exists()) {
      return snapshot.val() as ThresholdPlan;
    }
    return null;
  } catch (error) {
    console.error("Error getting device thresholds:", error);
    return null;
  }
}

/**
 * Gets the latest sensor reading from device
 */
export async function getLatestSensorReading(deviceId: string) {
  try {
    const readingsRef = ref(database, `devices/${deviceId}/iot_data`);
    const snapshot = await get(readingsRef);

    if (snapshot.exists()) {
      const readings = snapshot.val() as Record<string, SensorReading>;
      // Sort by timestamp value, not the key
      const sortedReadings = Object.entries(readings).sort(
        ([, a], [, b]) => b.timestamp - a.timestamp
      );
      if (sortedReadings.length > 0) {
        return sortedReadings[0][1]; // Return the reading with latest timestamp
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting latest sensor reading:", error);
    return null;
  }
}

/**
 * Creates or updates device metadata
 */
export async function updateDeviceMetadata(
  deviceId: string,
  metadata: { plantName?: string; userId?: string }
): Promise<boolean> {
  try {
    const metadataRef = ref(database, `devices/${deviceId}/metadata`);
    await update(metadataRef, metadata);
    return true;
  } catch (error) {
    console.error("Error updating device metadata:", error);
    return false;
  }
}
