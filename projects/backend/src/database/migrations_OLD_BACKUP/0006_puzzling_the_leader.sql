ALTER TABLE refresh_tokens
  ALTER COLUMN id SET DEFAULT nextval('refresh_tokens_id_seq');--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_unique" UNIQUE("user_id");