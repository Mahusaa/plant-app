"use server";

import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { IdentifyResult } from "@/lib/ai-schema";
import { createPlant } from "@/db/queries/plants";
import { db } from "@/db";
import { plantCareRequirements } from "@/db/schema";
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
 * Flow:
 * 1. Validate device exists in Firebase
 * 2. Write AI thresholds to Firebase device
 * 3. Create plant in PostgreSQL
 * 4. Create care requirements in PostgreSQL
 * 5. Update device metadata
 */
export async function savePlantWithDevice(
  input: SavePlantInput
): Promise<SavePlantResult> {
  try {
    const { userId, plantName, roomLocation, deviceId, imageUrl, identifyResult } = input;

    // Step 1: Validate device exists
    const deviceExists = await validateDeviceExists(deviceId);
    if (!deviceExists) {
      return {
        success: false,
        error: "Device not found in Firebase. Please check the device ID.",
      };
    }

    // Step 2: Prepare thresholds from AI result and write to Firebase
    const thresholds: ThresholdPlan = {
      lux: identifyResult.lightRequirements.ideal || identifyResult.lightRequirements.max,
      soil_moisture: identifyResult.soilMoistureRequirements.ideal || identifyResult.soilMoistureRequirements.max,
      water_level: identifyResult.waterLevelRequirements.min,
      temperature: identifyResult.temperatureRange?.ideal,
      humidity: identifyResult.humidityRange?.ideal,
    };

    const thresholdsWritten = await writeDeviceThresholds(deviceId, thresholds);
    if (!thresholdsWritten) {
      return {
        success: false,
        error: "Failed to write thresholds to Firebase device.",
      };
    }

    // Step 3: Create plant in PostgreSQL
    const plantId = nanoid();
    const plant = await createPlant({
      id: plantId,
      userId,
      name: plantName,
      scientificName: identifyResult.speciesName,
      commonName: identifyResult.commonName,
      species: identifyResult.speciesName,
      status: "unknown",
      isActive: true,
      roomLocation,
      firebaseDeviceId: deviceId,
      imageUrl,
      acquiredDate: new Date(),
    });

    if (!plant) {
      return {
        success: false,
        error: "Failed to create plant in database.",
      };
    }

    // Step 4: Create care requirements in PostgreSQL
    const careRequirementsId = nanoid();
    await db.insert(plantCareRequirements).values({
      id: careRequirementsId,
      plantId: plant.id,
      lightMin: identifyResult.lightRequirements.min,
      lightMax: identifyResult.lightRequirements.max,
      lightIdeal: identifyResult.lightRequirements.ideal,
      lightDescription: identifyResult.lightRequirements.description,
      soilMoistureMin: identifyResult.soilMoistureRequirements.min,
      soilMoistureMax: identifyResult.soilMoistureRequirements.max,
      soilMoistureIdeal: identifyResult.soilMoistureRequirements.ideal,
      soilMoistureDescription: identifyResult.soilMoistureRequirements.description,
      waterLevelMin: identifyResult.waterLevelRequirements.min,
      waterLevelMax: identifyResult.waterLevelRequirements.max,
      waterLevelDescription: identifyResult.waterLevelRequirements.description,
      wateringAmountMl: identifyResult.wateringSchedule.amountMl,
      wateringFrequencyDays: identifyResult.wateringSchedule.frequencyDays,
      wateringNotes: JSON.stringify(identifyResult.wateringSchedule.notes || []),
      temperatureMin: identifyResult.temperatureRange?.min,
      temperatureMax: identifyResult.temperatureRange?.max,
      temperatureIdeal: identifyResult.temperatureRange?.ideal,
      humidityMin: identifyResult.humidityRange?.min,
      humidityMax: identifyResult.humidityRange?.max,
      humidityIdeal: identifyResult.humidityRange?.ideal,
      careNotes: JSON.stringify(identifyResult.careNotes),
      healthIssues: JSON.stringify(identifyResult.healthIssues || []),
      growthRate: identifyResult.growthRate,
      maxHeight: identifyResult.maxHeight,
      isToxic: identifyResult.toxicity?.toxic,
      toxicityNotes: identifyResult.toxicity?.notes,
    });

    // Step 5: Update device metadata in Firebase
    await updateDeviceMetadata(deviceId, {
      plantName: plantName,
      userId: userId,
    });

    // Revalidate relevant pages
    revalidatePath("/plants");
    revalidatePath("/dashboard");

    return {
      success: true,
      plantId: plant.id,
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
