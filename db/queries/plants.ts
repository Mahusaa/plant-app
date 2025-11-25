import { eq, and, desc, asc, ilike, gte, lte, sql, or } from "drizzle-orm";
import { db } from "@/db";
import { plants, plantHealthRecords } from "@/db/schema";
import {
  getDeviceThresholdPlan,
  getDeviceMetadata,
  getLatestSensorReading as getFirebaseLatestReading,
} from "@/lib/firebase-device";
import type { IdentifyResult } from "@/lib/ai-schema";

export type PlantFilter = {
  userId?: string;
  status?: "healthy" | "warning" | "critical" | "unknown";
  isActive?: boolean;
  search?: string;
  roomLocation?: string;
  hasFirebaseDevice?: boolean;
};

export type PlantSort = {
  field?: "name" | "createdAt" | "updatedAt" | "acquiredDate" | "status";
  direction?: "asc" | "desc";
};

export async function getPlants(filter: PlantFilter = {}, sort: PlantSort = {}) {
  const conditions = [];

  if (filter.userId) {
    conditions.push(eq(plants.userId, filter.userId));
  }

  // Note: status is now computed from Firebase live data, not stored in PostgreSQL
  // Use getPlantWithFirebaseData to get status

  if (filter.search) {
    conditions.push(ilike(plants.name, `%${filter.search}%`));
  }

  if (filter.roomLocation) {
    conditions.push(eq(plants.roomLocation, filter.roomLocation));
  }

  // All plants now require Firebase device
  if (filter.hasFirebaseDevice !== undefined && !filter.hasFirebaseDevice) {
    // No plants without devices in Firebase-first architecture
    return [];
  }

  const sortField = sort.field === "name" || sort.field === "createdAt" || sort.field === "updatedAt"
    ? sort.field
    : "createdAt";
  const sortDirection = sort.direction || "desc";
  const orderBy = sortDirection === "asc" ? asc(plants[sortField]) : desc(plants[sortField]);

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db.query.plants.findMany({
    where: whereClause,
    orderBy: orderBy,
  });
}

export async function getPlantById(plantId: string, userId?: string) {
  const conditions = [eq(plants.id, plantId)];

  if (userId) {
    conditions.push(eq(plants.userId, userId));
  }

  return db.query.plants.findFirst({
    where: and(...conditions),
    with: {
      // Add relations when needed
    },
  });
}

/**
 * Get plant with complete data from Firebase (Firebase-first architecture)
 * Combines PostgreSQL plant record with Firebase device data
 */
export async function getPlantWithFirebaseData(plantId: string, userId?: string) {
  // 1. Get plant from PostgreSQL (basic info only)
  const conditions = [eq(plants.id, plantId)];
  if (userId) {
    conditions.push(eq(plants.userId, userId));
  }

  const plant = await db.query.plants.findFirst({
    where: and(...conditions),
  });

  if (!plant) return null;

  try {
    // 2. Fetch live data from Firebase progressively (sequential loading)
    const thresholdPlan = await getDeviceThresholdPlan(plant.firebaseDeviceId);
    const metadata = await getDeviceMetadata(plant.firebaseDeviceId);
    const latestReading = await getFirebaseLatestReading(plant.firebaseDeviceId);

    return {
      // PostgreSQL data
      id: plant.id,
      userId: plant.userId,
      name: plant.name,
      firebaseDeviceId: plant.firebaseDeviceId,
      roomLocation: plant.roomLocation,
      createdAt: plant.createdAt,
      updatedAt: plant.updatedAt,

      // Firebase data
      identifyData: thresholdPlan,
      imageUrl: metadata?.imageUrl || null,
      currentSensorData: latestReading ? {
        waterLevel: latestReading.level_air,
        lightIntensity: latestReading.intensitas_cahaya,
        soilMoisture: latestReading.kelembapan_tanah,
        timestamp: new Date(latestReading.timestamp),
      } : null,
      status: 'unknown',
    };
  } catch (error) {
    console.error(`Error fetching Firebase data for plant ${plantId}:`, error);
    // Return plant with null Firebase data if Firebase fetch fails
    return {
      ...plant,
      identifyData: null,
      imageUrl: null,
      currentSensorData: null,
      status: 'unknown',
    };
  }
}

/**
 * Get plant by Firebase device ID
 * Useful for checking if a device is already assigned
 */
export async function getPlantByDeviceId(deviceId: string, userId?: string) {
  const conditions = [eq(plants.firebaseDeviceId, deviceId)];
  if (userId) {
    conditions.push(eq(plants.userId, userId));
  }

  return db.query.plants.findFirst({
    where: and(...conditions),
  });
}

export async function createPlant(data: typeof plants.$inferInsert) {
  const [plant] = await db.insert(plants).values(data).returning();
  return plant;
}

export async function updatePlant(plantId: string, userId: string, data: Partial<typeof plants.$inferInsert>) {
  const [updated] = await db
    .update(plants)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(plants.id, plantId), eq(plants.userId, userId)))
    .returning();

  return updated;
}

export async function deletePlant(plantId: string, userId: string) {
  const [deleted] = await db
    .delete(plants)
    .where(and(eq(plants.id, plantId), eq(plants.userId, userId)))
    .returning();

  return deleted;
}

export async function getPlantStats(userId: string) {
  const allPlants = await db.query.plants.findMany({
    where: eq(plants.userId, userId),
  });

  const total = allPlants.length;

  // Note: Status is now computed from Firebase live data
  // To get accurate status counts, use getPlantWithFirebaseData for each plant
  // All plants have devices in Firebase-first architecture
  const withDevices = total;

  return {
    total,
    withDevices,
    // Status breakdown requires Firebase queries - compute on demand if needed
  };
}
