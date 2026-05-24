CREATE TABLE IF NOT EXISTS "versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"link" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
