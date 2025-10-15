CREATE TABLE "event_images" (
	"event_id" integer NOT NULL,
	"image_id" char(64) NOT NULL,
	CONSTRAINT "event_images_event_id_image_id_pk" PRIMARY KEY("event_id","image_id")
);
--> statement-breakpoint
CREATE TABLE "images" (
	"image_id" char(64) PRIMARY KEY NOT NULL,
	"mime" text NOT NULL,
	"bytes" "bytea" NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"size_bytes" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
