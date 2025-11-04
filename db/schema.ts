import { text, integer, timestamp, real, boolean } from "drizzle-orm/pg-core";
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
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  title: text("title"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const aiChatMessages = createTable("ai_chat_messages", {
  id: text("id").primaryKey().notNull(),
  sessionId: text("session_id").notNull().references(() => aiChatSessions.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AiChatSession = typeof aiChatSessions.$inferSelect;
export type NewAiChatSession = typeof aiChatSessions.$inferInsert;

export type AiChatMessage = typeof aiChatMessages.$inferSelect;
export type NewAiChatMessage = typeof aiChatMessages.$inferInsert;

// Plant management tables
export const plants = createTable("plants", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  scientificName: text("scientific_name"),
  commonName: text("common_name"),
  species: text("species"),
  status: text("status").notNull().default("unknown"), // 'healthy' | 'warning' | 'critical' | 'unknown'
  isActive: boolean("is_active").notNull().default(true),
  roomLocation: text("room_location"),
  firebaseDeviceId: text("firebase_device_id"),
  imageUrl: text("image_url"),
  acquiredDate: timestamp("acquired_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const plantCareRequirements = createTable("plant_care_requirements", {
  id: text("id").primaryKey().notNull(),
  plantId: text("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  lightMin: integer("light_min"), // lux
  lightMax: integer("light_max"), // lux
  lightIdeal: integer("light_ideal"), // lux
  lightDescription: text("light_description"),
  soilMoistureMin: integer("soil_moisture_min"), // %
  soilMoistureMax: integer("soil_moisture_max"), // %
  soilMoistureIdeal: integer("soil_moisture_ideal"), // %
  soilMoistureDescription: text("soil_moisture_description"),
  waterLevelMin: integer("water_level_min"), // %
  waterLevelMax: integer("water_level_max"), // %
  waterLevelDescription: text("water_level_description"),
  wateringAmountMl: integer("watering_amount_ml"),
  wateringFrequencyDays: integer("watering_frequency_days"),
  wateringNotes: text("watering_notes"), // JSON array as text
  temperatureMin: integer("temperature_min"), // Celsius
  temperatureMax: integer("temperature_max"), // Celsius
  temperatureIdeal: integer("temperature_ideal"), // Celsius
  humidityMin: integer("humidity_min"), // %
  humidityMax: integer("humidity_max"), // %
  humidityIdeal: integer("humidity_ideal"), // %
  careNotes: text("care_notes"), // JSON array as text
  healthIssues: text("health_issues"), // JSON array as text
  growthRate: text("growth_rate"), // 'slow' | 'moderate' | 'fast'
  maxHeight: text("max_height"),
  isToxic: boolean("is_toxic"),
  toxicityNotes: text("toxicity_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const plantHealthRecords = createTable("plant_health_records", {
  id: text("id").primaryKey().notNull(),
  plantId: text("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
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

export type PlantCareRequirements = typeof plantCareRequirements.$inferSelect;
export type NewPlantCareRequirements = typeof plantCareRequirements.$inferInsert;

export type PlantHealthRecord = typeof plantHealthRecords.$inferSelect;
export type NewPlantHealthRecord = typeof plantHealthRecords.$inferInsert;

