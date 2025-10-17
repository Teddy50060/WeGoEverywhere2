ALTER TABLE "auth_users" DROP CONSTRAINT "auth_users_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT "event_userId_fkey";
--> statement-breakpoint
ALTER TABLE "oauth_identities" DROP CONSTRAINT "oauth_identities_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "report" DROP CONSTRAINT "report_userId_fkey";
--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_users" ADD CONSTRAINT "auth_users_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth_identities" ADD CONSTRAINT "oauth_identities_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;