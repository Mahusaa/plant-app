import { eq, and, desc, asc, ilike, gte, lte, sql, or } from "drizzle-orm";
import { db } from "@/db";
import { plants, plantCareRequirements, plantHealthRecords } from "@/db/schema";

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

  if (filter.status) {
    conditions.push(eq(plants.status, filter.status));
  }

  if (filter.isActive !== undefined) {
    conditions.push(eq(plants.isActive, filter.isActive));
  }

  if (filter.search) {
    conditions.push(
      or(
        ilike(plants.name, `%${filter.search}%`),
        ilike(plants.scientificName, `%${filter.search}%`),
        ilike(plants.commonName, `%${filter.search}%`),
        ilike(plants.species, `%${filter.search}%`)
      )
    );
  }

  if (filter.roomLocation) {
    conditions.push(eq(plants.roomLocation, filter.roomLocation));
  }

  if (filter.hasFirebaseDevice !== undefined) {
    if (filter.hasFirebaseDevice) {
      conditions.push(sql`${plants.firebaseDeviceId} IS NOT NULL`);
    } else {
      conditions.push(sql`${plants.firebaseDeviceId} IS NULL`);
    }
  }

  const sortField = sort.field || "createdAt";
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

export async function getPlantWithDetails(plantId: string, userId?: string) {
  const conditions = [eq(plants.id, plantId)];

  if (userId) {
    conditions.push(eq(plants.userId, userId));
  }

  const plant = await db.query.plants.findFirst({
    where: and(...conditions),
  });

  if (!plant) return null;

  const [careRequirements, latestHealthRecord] = await Promise.all([
    db.query.plantCareRequirements.findFirst({
      where: eq(plantCareRequirements.plantId, plantId),
    }),
    db.query.plantHealthRecords.findFirst({
      where: eq(plantHealthRecords.plantId, plantId),
      orderBy: desc(plantHealthRecords.recordedAt),
    }),
  ]);

  return {
    ...plant,
    careRequirements,
    latestHealthRecord,
  };
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
  const active = allPlants.filter(p => p.isActive).length;
  const byStatus = {
    healthy: allPlants.filter(p => p.status === "healthy").length,
    warning: allPlants.filter(p => p.status === "warning").length,
    critical: allPlants.filter(p => p.status === "critical").length,
    unknown: allPlants.filter(p => p.status === "unknown").length,
  };
  const withDevices = allPlants.filter(p => p.firebaseDeviceId).length;

  return {
    total,
    active,
    byStatus,
    withDevices,
  };
}
