import "./env";
import dns from "dns";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

// Enable IPv6 resolution first so Node.js can resolve Railway internal mesh domains (*.railway.internal)
try {
  dns.setDefaultResultOrder("ipv6first");
} catch (e) {
  // Fallback for older Node versions
}

const { Pool } = pg;

let dbUrl = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL || "";

if (!dbUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const isExternalDb =
  dbUrl.includes("supabase.co") ||
  dbUrl.includes("neon.tech") ||
  dbUrl.includes("render.com") ||
  dbUrl.includes("sslmode=require") ||
  process.env.PGSSLMODE === "require";

export const pool = new Pool({ 
  connectionString: dbUrl,
  ssl: isExternalDb ? { rejectUnauthorized: false } : false
});

// Prevent unhandled pool errors from crashing the process (important on serverless platforms)
pool.on("error", (err) => {
  console.error("Unexpected database pool error:", err);
});

export const db = drizzle(pool, { schema });
