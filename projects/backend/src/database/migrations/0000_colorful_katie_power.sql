CREATE TABLE "admin" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"admin_type" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "auth_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email" varchar(100) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"reset_token" varchar(255),
	"reset_token_expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_users_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "auth_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "be_friend" (
	"user_id" integer NOT NULL,
	"friend_id" integer NOT NULL,
	CONSTRAINT "be_friend_pkey" PRIMARY KEY("user_id","friend_id")
);
--> statement-breakpoint
CREATE TABLE "chat" (
	"sender" integer NOT NULL,
	"receiver" integer NOT NULL,
	"chat_id" integer NOT NULL,
	CONSTRAINT "chat_pkey" PRIMARY KEY("sender","receiver","chat_id")
);
--> statement-breakpoint
CREATE TABLE "chat_doc" (
	"chat_id" serial PRIMARY KEY NOT NULL,
	"sdate" date,
	"stime" time,
	"data" jsonb
);
--> statement-breakpoint
CREATE TABLE "event" (
	"event_id" serial PRIMARY KEY NOT NULL,
	"cost" numeric(10, 2) DEFAULT 0,
	"name" varchar(100) NOT NULL,
	"date" date NOT NULL,
	"time" time NOT NULL,
	"place" varchar(100),
	"capacity" integer NOT NULL,
	"detail" text NOT NULL,
	"rating" double precision DEFAULT 0,
	"categories" text[],
	"image_path" text,
	"status" varchar DEFAULT 'active' NOT NULL,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "joined" (
	"user_id" integer NOT NULL,
	"event_id" integer NOT NULL,
	CONSTRAINT "joined_pkey" PRIMARY KEY("user_id","event_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"from_service" text,
	"message" text NOT NULL,
	"read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "oauth_identities" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"provider" varchar(50) NOT NULL,
	"subject" varchar(100) NOT NULL,
	"email" varchar(100),
	"email_verified" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participant" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"credit" integer DEFAULT 0,
	"status" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "privacy_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"effective_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_by" uuid NOT NULL,
	CONSTRAINT "privacy_policies_version_unique" UNIQUE("version")
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"revoked" boolean DEFAULT false,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"created_by_ip" varchar(50),
	"user_agent" varchar(255),
	CONSTRAINT "refresh_tokens_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "report" (
	"report_id" serial PRIMARY KEY NOT NULL,
	"report_type" varchar(50),
	"report_detail" text,
	"report_topic" varchar(100),
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"firstName" varchar(50) NOT NULL,
	"lastName" varchar(50) NOT NULL,
	"telephone_number" varchar(20),
	"bio" text,
	"birthdate" date NOT NULL,
	"sex" varchar(10),
	"profile_picture" varchar(255),
	"signup_time" time DEFAULT CURRENT_TIME,
	"signup_date" date DEFAULT CURRENT_DATE,
	"cookie_policy_version_accepted" integer,
	"cookie_policy_accepted_at" timestamp,
	CONSTRAINT "users_age_check" CHECK ("users"."birthdate" <= CURRENT_DATE - INTERVAL '20 years')
);
--> statement-breakpoint
ALTER TABLE "admin" ADD CONSTRAINT "admin_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_users" ADD CONSTRAINT "auth_users_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "be_friend" ADD CONSTRAINT "be_friend_friendId_fkey" FOREIGN KEY ("friend_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "be_friend" ADD CONSTRAINT "be_friend_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_chatId_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."chat_doc"("chat_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_sender_fkey" FOREIGN KEY ("sender") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "joined" ADD CONSTRAINT "joined_eventId_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("event_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "joined" ADD CONSTRAINT "joined_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth_identities" ADD CONSTRAINT "oauth_identities_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_userId_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_events_start_time" ON "event" USING btree ("date" date_ops);--> statement-breakpoint
CREATE INDEX "privacy_policies_version_idx" ON "privacy_policies" USING btree ("version");--> statement-breakpoint
CREATE INDEX "privacy_policies_active_idx" ON "privacy_policies" USING btree ("is_active");