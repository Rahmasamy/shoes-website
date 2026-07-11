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

const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
const isExternalDb = process.env.DATABASE_URL.includes("supabase.co") || process.env.DATABASE_URL.includes("neon.tech");

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: (isProduction || isExternalDb) ? { rejectUnauthorized: false } : false
});

// Prevent unhandled pool errors from crashing the process (important on serverless platforms)
pool.on("error", (err) => {
  console.error("Unexpected database pool error:", err);
});

export const db = drizzle(pool, { schema });
