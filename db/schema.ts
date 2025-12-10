import { boolean, integer, real, text, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "./table-creator";

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
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = createTable("account", {
  id: text("id").primaryKey().notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
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

// Export types
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

// AI Chat tables
export const aiChatSessions = createTable("ai_chat_sessions", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const aiChatMessages = createTable("ai_chat_messages", {
  id: text("id").primaryKey().notNull(),
  sessionId: text("session_id")
    .notNull()
    .references(() => aiChatSessions.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AiChatSession = typeof aiChatSessions.$inferSelect;
export type NewAiChatSession = typeof aiChatSessions.$inferInsert;

export type AiChatMessage = typeof aiChatMessages.$inferSelect;
export type NewAiChatMessage = typeof aiChatMessages.$inferInsert;

// Plant management tables (Firebase-first architecture)
// Plant metadata stored in Firebase; PostgreSQL stores only user plant list
export const plants = createTable("plants", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // User-assigned plant name
  firebaseDeviceId: text("firebase_device_id").notNull().unique(), // Firebase IoT device ID (required)
  roomLocation: text("room_location"), // Room location (e.g., "Living Room")
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Plant identification history (all plant scans/identifications)
export const plantIdentifications = createTable("plant_identifications", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  plantId: text("plant_id").references(() => plants.id, {
    onDelete: "set null",
  }), // Nullable - not all identifications become plants
  imageUrl: text("image_url").notNull(), // Captured plant image
  speciesName: text("species_name").notNull(), // AI result: scientific name
  commonName: text("common_name").notNull(), // AI result: common name
  confidence: real("confidence").notNull(), // AI confidence score (0-1)
  identifiedAt: timestamp("identified_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Watering event logs
export const wateringLogs = createTable("watering_logs", {
  id: text("id").primaryKey().notNull(),
  plantId: text("plant_id")
    .notNull()
    .references(() => plants.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amountMl: integer("amount_ml").notNull(), // Water amount in milliliters
  method: text("method").notNull(), // 'manual' | 'automatic' | 'pump'
  notes: text("notes"), // Optional user notes
  wateredAt: timestamp("watered_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const plantHealthRecords = createTable("plant_health_records", {
  id: text("id").primaryKey().notNull(),
  plantId: text("plant_id")
    .notNull()
    .references(() => plants.id, { onDelete: "cascade" }),
  status: text("status").notNull(), // 'healthy' | 'warning' | 'critical' | 'unknown'
  healthScore: real("health_score"), // 0-100
  lightIntensity: real("light_intensity"), // lux
  soilMoisture: real("soil_moisture"), // %
  waterLevel: real("water_level"), // %
  temperature: real("temperature"), // Celsius
  humidity: real("humidity"), // %
  notes: text("notes"),
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Plant = typeof plants.$inferSelect;
export type NewPlant = typeof plants.$inferInsert;

export type PlantIdentification = typeof plantIdentifications.$inferSelect;
export type NewPlantIdentification = typeof plantIdentifications.$inferInsert;

export type WateringLog = typeof wateringLogs.$inferSelect;
export type NewWateringLog = typeof wateringLogs.$inferInsert;

export type PlantHealthRecord = typeof plantHealthRecords.$inferSelect;
export type NewPlantHealthRecord = typeof plantHealthRecords.$inferInsert;
