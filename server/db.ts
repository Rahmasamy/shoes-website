import "./env";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const dbUrl = process.env.DATABASE_URL || "";
const isExternalDb =
  dbUrl.includes("supabase.co") ||
  dbUrl.includes("neon.tech") ||
  dbUrl.includes("render.com") ||
  dbUrl.includes("sslmode=require") ||
  process.env.PGSSLMODE === "require";

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: isExternalDb ? { rejectUnauthorized: false } : false
});

// Prevent unhandled pool errors from crashing the process (important on serverless platforms)
pool.on("error", (err) => {
  console.error("Unexpected database pool error:", err);
});

export const db = drizzle(pool, { schema });
