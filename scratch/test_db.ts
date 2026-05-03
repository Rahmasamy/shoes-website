import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

async function test() {
  const username = "admin_script_test";
  await db.delete(users).where(eq(users.username, username));
  
  console.log("Inserting user...");
  const [user] = await db.insert(users).values({
    username: username,
    email: "admin_script@example.com",
    password: "password",
    fullName: "Script Admin",
    role: "admin"
  }).returning();
  
  console.log("Inserted user:", user);
  process.exit(0);
}

test().catch(console.error);
