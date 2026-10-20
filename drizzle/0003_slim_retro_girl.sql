ALTER TABLE "orders" ADD COLUMN "fulfillment_status" text DEFAULT 'paid' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'customer' NOT NULL;