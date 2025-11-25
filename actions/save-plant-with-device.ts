"use server";

import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import type { IdentifyResult } from "@/lib/ai-schema";
import { db } from "@/db";
import { plants, plantIdentifications } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  validateDeviceExists,
  writeDeviceThresholds,
  updateDeviceMetadata,
} from "@/lib/firebase-device";
import type { ThresholdPlan } from "@/types/iot";

export interface SavePlantInput {
  userId: string;
  plantName: string;
  roomLocation?: string;
  deviceId: string;
  imageUrl?: string;
  identifyResult: IdentifyResult;
}

export interface SavePlantResult {
  success: boolean;
  plantId?: string;
  error?: string;
}

/**
 * Server action to save a plant with device binding after AI identification
 * Firebase-first architecture:
 * 1. Validate device exists in Firebase
 * 2. Check device not already assigned to another plant
 * 3. Write COMPLETE AI result to Firebase threshold_plan
 * 4. Write device metadata to Firebase
 * 5. Create plant in PostgreSQL (minimal data only)
 * 6. Save identification record (history)
 */
export async function savePlantWithDevice(
  input: SavePlantInput
): Promise<SavePlantResult> {
  try {
    const { userId, plantName, roomLocation, deviceId, imageUrl, identifyResult } = input;

    // Step 1: Validate device exists in Firebase
    const deviceExists = await validateDeviceExists(deviceId);
    if (!deviceExists) {
      return {
        success: false,
        error: "Device not found in Firebase. Please check the device ID.",
      };
    }

    // Step 2: Check if user already has a plant with this device
    const existingPlant = await db.query.plants.findFirst({
      where: and(
        eq(plants.firebaseDeviceId, deviceId),
        eq(plants.userId, userId)
      ),
    });

    if (existingPlant) {
      return {
        success: false,
        error: "This device is already assigned to another plant. Each device can only be used once.",
      };
    }

    // Step 3: Write COMPLETE AI result to Firebase threshold_plan
    const enhancedThresholdPlan: ThresholdPlan = {
      ...identifyResult,
      // Extract numeric thresholds for IoT device control
      lux: identifyResult.lightRequirements.ideal || identifyResult.lightRequirements.max,
      soil_moisture: identifyResult.soilMoistureRequirements.ideal || identifyResult.soilMoistureRequirements.max,
      water_level: identifyResult.waterLevelRequirements.min,
      temperature: identifyResult.temperatureRange?.ideal,
      humidity: identifyResult.humidityRange?.ideal,
    };

    const thresholdsWritten = await writeDeviceThresholds(deviceId, enhancedThresholdPlan);
    if (!thresholdsWritten) {
      return {
        success: false,
        error: "Failed to write care data to Firebase device.",
      };
    }

    // Step 4: Write metadata to Firebase
    await updateDeviceMetadata(deviceId, {
      plantName,
      userId,
      roomLocation: roomLocation || "",
      imageUrl: imageUrl || "",
      addedAt: new Date().toISOString(),
    });

    // Step 5: Create plant in PostgreSQL (minimal data only)
    const plantId = nanoid();
    await db.insert(plants).values({
      id: plantId,
      userId,
      name: plantName,
      firebaseDeviceId: deviceId,
      roomLocation: roomLocation || null,
    });

    // Step 6: Save identification record (history)
    await db.insert(plantIdentifications).values({
      id: nanoid(),
      userId,
      plantId,
      imageUrl: imageUrl || "",
      speciesName: identifyResult.speciesName,
      commonName: identifyResult.commonName,
      confidence: identifyResult.confidence || 0.95,
      identifiedAt: new Date(),
    });

    // Revalidate relevant pages
    revalidatePath("/plants");
    revalidatePath("/dashboard");

    return {
      success: true,
      plantId,
    };
  } catch (error) {
    console.error("Error saving plant with device:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Validate device ID before showing the add plant form
 */
export async function validateDevice(deviceId: string): Promise<{
  exists: boolean;
  error?: string;
}> {
  try {
    const exists = await validateDeviceExists(deviceId);
    return {
      exists,
      error: exists ? undefined : "Device not found in Firebase",
    };
  } catch (error) {
    console.error("Error validating device:", error);
    return {
      exists: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
