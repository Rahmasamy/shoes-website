import "./env";
import { db } from "./db";
import { products, reviews, users } from "@shared/schema";
import { and, eq, sql } from "drizzle-orm";
import { hashPassword } from "./auth";

export const seedProducts = [
  {
    name: "shoes",
    description: "shoes",
    price: "445.00",
    category: "men",
    type: "shoe",
    sizes: ["44", "43", "45"],
    colors: ["brown", "black"],
    images: ["/uploads/1778422725511-842046646.jpeg"],
    isNew: true,
    isPopular: false
  },
  {
    name: "Comfortable Woman shoe",
    description: "Chic & Comfortable Woman shoe with Black color",
    price: "475.00",
    category: "women",
    type: "shoe",
    sizes: ["37", "38", "39", "40", "41"],
    colors: ["black"],
    images: ["/uploads/1778425770391-837241739.jpeg"],
    isNew: true,
    isPopular: false
  },
  {
    name: "Shoe women's ",
    description: "Shoe women's with Black color",
    price: "575.00",
    category: "women",
    type: "Shoe",
    sizes: ["37", "38", "39", "40", "41"],
    colors: ["black", "white"],
    images: ["/uploads/1778426152737-904026242.jpeg"],
    isNew: true,
    isPopular: false
  },
  {
    name: "Slipper High-quality ",
    description: "High Quality Slipper with Blue color.",
    price: "475.00",
    category: "men",
    type: "Slipper",
    sizes: ["42", "43", "44", "45"],
    colors: ["Blue"],
    images: ["/uploads/1778426821114-959638512.jpeg"],
    isNew: true,
    isPopular: false
  },
  {
    name: "Slipper  Women's High-quality ",
    description: "Chic Slipper  Women's High-quality ",
    price: "625.00",
    category: "women",
    type: "casual",
    sizes: ["36", "37", "38", "39", "40"],
    colors: ["brown", "black"],
    images: ["/uploads/1778425996783-947901237.jpeg"],
    isNew: true,
    isPopular: false
  },
  {
    name: "Slipper High-quality ",
    description: "High Quality Slipper with Black color.",
    price: "450.00",
    category: "women",
    type: "Slipper",
    sizes: ["37", "38", "39", "40", "41"],
    colors: ["black"],
    images: ["/uploads/1778426344085-198928732.jpeg"],
    isNew: true,
    isPopular: false
  },
  {
    name: "Medical Women shoes",
    description: "High Quality Medical Women shoes with All Colors.",
    price: "475.00",
    category: "women",
    type: "Shoes",
    sizes: ["37", "38", "39", "40", "41"],
    colors: ["black"],
    images: ["/uploads/1778426551795-549870890.jpeg", "/uploads/1778427364888-272120266.jpeg"],
    isNew: true,
    isPopular: false
  },
  {
    name: "Slipper High-quality Women's ",
    description: "Slipper High-quality Women's with black color",
    price: "600.00",
    category: "women",
    type: "Slipper",
    sizes: ["37", "38", "39", "40", "41"],
    colors: ["Black"],
    images: ["/uploads/1778425539562-754335839.jpeg"],
    isNew: true,
    isPopular: false
  }
];

export const seedReviews = [
  {
    name: "John Doe",
    rating: 5,
    content: "Great shoes! Very comfortable.",
    avatarUrl: "https://github.com/shadcn.png"
  },
  {
    name: "Jane Smith",
    rating: 4,
    content: "Love the style, but sizing is a bit small.",
    avatarUrl: "https://github.com/shadcn.png"
  }
];


export async function createTables() {
  console.log("Ensuring database tables exist...");
  const queries = [
    `CREATE TABLE IF NOT EXISTS "users" (
      "id" SERIAL PRIMARY KEY,
      "username" TEXT NOT NULL UNIQUE,
      "email" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "full_name" TEXT,
      "avatar_url" TEXT,
      "role" TEXT NOT NULL DEFAULT 'user',
      "created_at" TIMESTAMP DEFAULT NOW()
    );`,
    `CREATE TABLE IF NOT EXISTS "products" (
      "id" SERIAL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "price" NUMERIC NOT NULL,
      "category" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "sizes" JSONB NOT NULL,
      "colors" JSONB NOT NULL,
      "images" JSONB NOT NULL,
      "is_new" BOOLEAN DEFAULT FALSE,
      "is_popular" BOOLEAN DEFAULT FALSE,
      "created_at" TIMESTAMP DEFAULT NOW()
    );`,
    `CREATE TABLE IF NOT EXISTS "cart_items" (
      "id" SERIAL PRIMARY KEY,
      "user_id" INTEGER NOT NULL,
      "product_id" INTEGER NOT NULL,
      "quantity" INTEGER NOT NULL DEFAULT 1,
      "size" TEXT NOT NULL,
      "color" TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS "favorites" (
      "id" SERIAL PRIMARY KEY,
      "user_id" INTEGER NOT NULL,
      "product_id" INTEGER NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS "reviews" (
      "id" SERIAL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "rating" INTEGER NOT NULL,
      "content" TEXT NOT NULL,
      "avatar_url" TEXT,
      "created_at" TIMESTAMP DEFAULT NOW()
    );`,
    `CREATE TABLE IF NOT EXISTS "contacts" (
      "id" SERIAL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "created_at" TIMESTAMP DEFAULT NOW()
    );`,
    `CREATE TABLE IF NOT EXISTS "orders" (
      "id" SERIAL PRIMARY KEY,
      "user_id" INTEGER NOT NULL,
      "full_name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "address" TEXT NOT NULL,
      "city" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "total_amount" NUMERIC NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'pending',
      "created_at" TIMESTAMP DEFAULT NOW()
    );`,
    `CREATE TABLE IF NOT EXISTS "order_items" (
      "id" SERIAL PRIMARY KEY,
      "order_id" INTEGER NOT NULL,
      "product_id" INTEGER NOT NULL,
      "quantity" INTEGER NOT NULL,
      "price" NUMERIC NOT NULL,
      "size" TEXT NOT NULL,
      "color" TEXT NOT NULL
    );`
  ];

  for (const q of queries) {
    await db.execute(sql.raw(q));
  }
}

export async function seed() {
  const logs: string[] = [];
  const errors: string[] = [];

  try {
    await createTables();
    logs.push("Tables created or verified.");
  } catch (err: any) {
    console.error("Error creating tables:", err);
    errors.push(`createTables error: ${err.message || String(err)}`);
  }

  // Force recreate if product table exists but product count is 0
  try {
    const countRes = await db.select({ count: sql<number>`count(*)` }).from(products);
    const totalCount = Number(countRes[0]?.count || 0);
    if (totalCount === 0) {
      console.log("Products table is empty. Recreating tables with matched JSONB types...");
      logs.push("Dropping empty tables and recreating schema...");
      await db.execute(sql.raw(`
        DROP TABLE IF EXISTS "products" CASCADE;
        DROP TABLE IF EXISTS "users" CASCADE;
        DROP TABLE IF EXISTS "reviews" CASCADE;
        DROP TABLE IF EXISTS "cart_items" CASCADE;
        DROP TABLE IF EXISTS "favorites" CASCADE;
        DROP TABLE IF EXISTS "contacts" CASCADE;
        DROP TABLE IF EXISTS "orders" CASCADE;
        DROP TABLE IF EXISTS "order_items" CASCADE;
      `));
      await createTables();
    }
  } catch (e: any) {
    console.error("Notice during table count check:", e);
    errors.push(`Table check notice: ${e.message || String(e)}`);
    await createTables();
  }

  console.log("Seeding products...");
  for (const p of seedProducts) {
    try {
      const existing = await db
        .select()
        .from(products)
        .where(and(eq(products.name, p.name), eq(products.description, p.description)));
      if (existing.length === 0) {
        await db.insert(products).values(p);
        console.log(`Seeded product: ${p.name}`);
        logs.push(`Seeded product: ${p.name}`);
      } else {
        await db.update(products).set({ price: p.price }).where(eq(products.id, existing[0].id));
        console.log(`Updated product price: ${p.name} to ${p.price}`);
        logs.push(`Updated product: ${p.name}`);
      }
    } catch (prodErr: any) {
      console.error(`Failed inserting product ${p.name}:`, prodErr);
      errors.push(`Failed product ${p.name}: ${prodErr.message || String(prodErr)}`);
    }
  }

  console.log("Seeding reviews...");
  for (const r of seedReviews) {
    try {
      const existing = await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.name, r.name), eq(reviews.content, r.content)));
      if (existing.length === 0) {
        await db.insert(reviews).values(r);
        console.log(`Seeded review from: ${r.name}`);
        logs.push(`Seeded review from: ${r.name}`);
      }
    } catch (revErr: any) {
      console.error(`Failed inserting review ${r.name}:`, revErr);
      errors.push(`Failed review ${r.name}: ${revErr.message || String(revErr)}`);
    }
  }

  console.log("Seeding default admin...");
  try {
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@karawan.com";
    const adminFullName = process.env.ADMIN_FULL_NAME || "System Admin";
    const hashedPassword = await hashPassword(adminPassword);

    const adminUsers = await db.select().from(users).where(eq(users.role, "admin"));
    if (adminUsers.length === 0) {
      await db.insert(users).values({
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        fullName: adminFullName,
        role: "admin",
      });
      console.log(`Seeded default admin user: ${adminUsername}`);
      logs.push(`Seeded admin: ${adminUsername}`);
    } else {
      await db.update(users)
        .set({
          username: adminUsername,
          email: adminEmail,
          password: hashedPassword,
          fullName: adminFullName,
        })
        .where(eq(users.id, adminUsers[0].id));
      console.log(`Updated existing admin user credentials to: ${adminUsername}`);
      logs.push(`Updated admin: ${adminUsername}`);
    }
  } catch (adminErr: any) {
    console.error("Failed seeding admin:", adminErr);
    errors.push(`Failed admin: ${adminErr.message || String(adminErr)}`);
  }

  // Enable Row Level Security (RLS) on all public tables to resolve Supabase security warning
  console.log("Enabling Row Level Security (RLS) on all public tables...");
  const tables = [
    "users",
    "products",
    "cart_items",
    "favorites",
    "reviews",
    "contacts",
    "orders",
    "order_items",
  ];
  for (const table of tables) {
    try {
      await db.execute(sql.raw(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`));
      console.log(`Enabled RLS on table: ${table}`);
    } catch (e) {
      console.log(`RLS notice for ${table}:`, (e as any)?.message || e);
    }
  }

  let finalCount = 0;
  try {
    const finalRes = await db.select({ count: sql<number>`count(*)` }).from(products);
    finalCount = Number(finalRes[0]?.count || 0);
  } catch (e) {
    console.error("Error checking final count:", e);
  }

  return {
    success: errors.length === 0,
    totalProductsInDatabase: finalCount,
    logs,
    errors
  };
}

// If run directly via tsx
const isMain = process.argv[1] && (
  process.argv[1].endsWith("seed.ts") || 
  process.argv[1].endsWith("seed")
);
if (isMain) {
  seed()
    .then(() => {
      console.log("Seeding completed successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding failed:", err);
      process.exit(1);
    });
}
