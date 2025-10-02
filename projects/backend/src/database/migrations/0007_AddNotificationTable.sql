CREATE TABLE "notification_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"from_service" text,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "notification_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"notification_id" integer NOT NULL,
	"read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "notification_users" ADD CONSTRAINT "notification_users_notification_id_notification_templates_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notification_templates"("id") ON DELETE no action ON UPDATE no action;