import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { plantHealthRecords } from "@/db/schema";

export type HealthRecordFilter = {
  plantId?: string;
  status?: "healthy" | "warning" | "critical" | "unknown";
  dateFrom?: Date;
  dateTo?: Date;
  minHealthScore?: number;
  maxHealthScore?: number;
};

export async function getHealthRecords(filter: HealthRecordFilter = {}) {
  const conditions = [];

  if (filter.plantId) {
    conditions.push(eq(plantHealthRecords.plantId, filter.plantId));
  }

  if (filter.status) {
    conditions.push(eq(plantHealthRecords.status, filter.status));
  }

  if (filter.dateFrom) {
    conditions.push(gte(plantHealthRecords.recordedAt, filter.dateFrom));
  }

  if (filter.dateTo) {
    conditions.push(lte(plantHealthRecords.recordedAt, filter.dateTo));
  }

  if (filter.minHealthScore !== undefined) {
    conditions.push(gte(plantHealthRecords.healthScore, filter.minHealthScore));
  }

  if (filter.maxHealthScore !== undefined) {
    conditions.push(lte(plantHealthRecords.healthScore, filter.maxHealthScore));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db.query.plantHealthRecords.findMany({
    where: whereClause,
    orderBy: desc(plantHealthRecords.recordedAt),
  });
}

export async function createHealthRecord(
  data: typeof plantHealthRecords.$inferInsert,
) {
  const [record] = await db.insert(plantHealthRecords).values(data).returning();
  return record;
}

export async function getLatestHealthRecord(plantId: string) {
  return db.query.plantHealthRecords.findFirst({
    where: eq(plantHealthRecords.plantId, plantId),
    orderBy: desc(plantHealthRecords.recordedAt),
  });
}

export async function getHealthTrend(plantId: string, days: number = 30) {
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);

  return getHealthRecords({
    plantId,
    dateFrom,
  });
}
