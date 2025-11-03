import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
  schema: "./db/schema.ts",
  dialect: "postgresql",
  tablesFilter: ["plant_*"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
