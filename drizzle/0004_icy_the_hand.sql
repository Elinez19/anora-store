CREATE TABLE "newsletter_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"resend_contact_id" text,
	"status" text DEFAULT 'subscribed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "support_replies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"sender_role" text DEFAULT 'admin' NOT NULL,
	"sender_email" text NOT NULL,
	"message" text NOT NULL,
	"resend_email_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_number" text NOT NULL,
	"source" text DEFAULT 'contact_form' NOT NULL,
	"from_email" text NOT NULL,
	"from_name" text,
	"to_email" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"html" text,
	"category" text DEFAULT 'general' NOT NULL,
	"order_number" text,
	"resend_email_id" text,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "support_tickets_ticket_number_unique" UNIQUE("ticket_number")
);
--> statement-breakpoint
ALTER TABLE "support_replies" ADD CONSTRAINT "support_replies_ticket_id_support_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "support_replies_ticket_id_idx" ON "support_replies" USING btree ("ticket_id");--> statement-breakpoint
CREATE INDEX "support_tickets_status_idx" ON "support_tickets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "support_tickets_created_at_idx" ON "support_tickets" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "support_tickets_from_email_idx" ON "support_tickets" USING btree ("from_email");