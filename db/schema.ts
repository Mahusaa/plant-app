import { text, integer, timestamp, real, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createTable } from "./table-creator";

// Enums
export const plantStatusEnum = pgEnum("plant_status", ["healthy", "warning", "critical", "unknown"]);
export const wateringFrequencyEnum = pgEnum("watering_frequency", ["daily", "every_2_days", "every_3_days", "weekly", "bi_weekly", "monthly"]);
export const lightConditionEnum = pgEnum("light_condition", ["full_sun", "partial_sun", "partial_shade", "full_shade"]);

// Better Auth tables - using the standard Better Auth schema
export const user = createTable("user", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = createTable("session", {
  id: text("id").primaryKey().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = createTable("account", {
  id: text("id").primaryKey().notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = createTable("verification", {
  id: text("id").primaryKey().notNull(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Plants table
export const plants = createTable("plants", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  scientificName: text("scientific_name"),
  commonName: text("common_name"),
  species: text("species"),
  imageUrl: text("image_url"),
  thumbnailUrl: text("thumbnail_url"),
  description: text("description"),
  location: text("location"),
  roomLocation: text("room_location"),
  acquiredDate: timestamp("acquired_date"),
  status: plantStatusEnum("status").default("unknown").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  notes: text("notes"),
  // Firebase IoT device reference
  firebaseDeviceId: text("firebase_device_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Plant care requirements
export const plantCareRequirements = createTable("plant_care_requirements", {
  id: text("id").primaryKey().notNull(),
  plantId: text("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }).unique(),
  wateringFrequency: wateringFrequencyEnum("watering_frequency").notNull(),
  wateringAmount: text("watering_amount"),
  lightCondition: lightConditionEnum("light_condition").notNull(),
  minLux: integer("min_lux"),
  maxLux: integer("max_lux"),
  minTemperature: real("min_temperature"),
  maxTemperature: real("max_temperature"),
  minHumidity: real("min_humidity"),
  maxHumidity: real("max_humidity"),
  soilType: text("soil_type"),
  fertilizingFrequency: text("fertilizing_frequency"),
  fertilizingNotes: text("fertilizing_notes"),
  pruningNotes: text("pruning_notes"),
  specialCare: text("special_care"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Plant health records
export const plantHealthRecords = createTable("plant_health_records", {
  id: text("id").primaryKey().notNull(),
  plantId: text("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  status: plantStatusEnum("status").notNull(),
  healthScore: real("health_score"),
  imageUrl: text("image_url"),
  observations: text("observations"),
  issues: jsonb("issues").$type<string[]>(),
  recommendations: jsonb("recommendations").$type<string[]>(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  createdBy: text("created_by").references(() => user.id),
  aiAnalysis: text("ai_analysis"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Watering logs
export const wateringLogs = createTable("watering_logs", {
  id: text("id").primaryKey().notNull(),
  plantId: text("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  wateredAt: timestamp("watered_at").notNull(),
  amount: text("amount"),
  notes: text("notes"),
  userId: text("user_id").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI chat sessions
export const aiChatSessions = createTable("ai_chat_sessions", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  plantId: text("plant_id").references(() => plants.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  summary: text("summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// AI chat messages
export const aiChatMessages = createTable("ai_chat_messages", {
  id: text("id").primaryKey().notNull(),
  sessionId: text("session_id").notNull().references(() => aiChatSessions.id, { onDelete: "cascade" }),
  role: text("role").notNull().$type<"user" | "assistant" | "system">(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Plant identifications
export const plantIdentifications = createTable("plant_identifications", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  identifiedSpecies: text("identified_species"),
  commonName: text("common_name"),
  scientificName: text("scientific_name"),
  confidence: real("confidence"),
  aiResponse: jsonb("ai_response"),
  plantId: text("plant_id").references(() => plants.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reminders
export const reminders = createTable("reminders", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  plantId: text("plant_id").references(() => plants.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  reminderType: text("reminder_type").notNull().$type<"watering" | "fertilizing" | "pruning" | "checkup" | "custom">(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  isRecurring: boolean("is_recurring").default(false).notNull(),
  recurringInterval: text("recurring_interval"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Export types
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export type Plant = typeof plants.$inferSelect;
export type NewPlant = typeof plants.$inferInsert;

export type PlantCareRequirement = typeof plantCareRequirements.$inferSelect;
export type NewPlantCareRequirement = typeof plantCareRequirements.$inferInsert;

export type PlantHealthRecord = typeof plantHealthRecords.$inferSelect;
export type NewPlantHealthRecord = typeof plantHealthRecords.$inferInsert;

export type WateringLog = typeof wateringLogs.$inferSelect;
export type NewWateringLog = typeof wateringLogs.$inferInsert;

export type AiChatSession = typeof aiChatSessions.$inferSelect;
export type NewAiChatSession = typeof aiChatSessions.$inferInsert;

export type AiChatMessage = typeof aiChatMessages.$inferSelect;
export type NewAiChatMessage = typeof aiChatMessages.$inferInsert;

export type PlantIdentification = typeof plantIdentifications.$inferSelect;
export type NewPlantIdentification = typeof plantIdentifications.$inferInsert;

export type Reminder = typeof reminders.$inferSelect;
export type NewReminder = typeof reminders.$inferInsert;
