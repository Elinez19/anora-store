import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function applyMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log("Applying column migrations to Neon database...");
  await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" text DEFAULT 'customer' NOT NULL;`;
  console.log("✓ user.role column ensured.");

  await sql`ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "fulfillment_status" text DEFAULT 'paid' NOT NULL;`;
  console.log("✓ orders.fulfillment_status column ensured.");

  console.log("All migrations applied successfully!");
}

applyMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
