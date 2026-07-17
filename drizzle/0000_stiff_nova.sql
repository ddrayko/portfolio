CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"image_url" text,
	"tags" text[],
	"project_url" text,
	"github_url" text,
	"in_development" boolean DEFAULT false,
	"development_status" text DEFAULT 'active',
	"is_completed" boolean DEFAULT false,
	"is_archived" boolean DEFAULT false,
	"development_progress" integer DEFAULT 0,
	"changelog" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "site_updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"next_update_date" timestamp,
	"no_update_planned" boolean DEFAULT true,
	"planned_features" jsonb DEFAULT '[]'::jsonb,
	"changelog" jsonb DEFAULT '[]'::jsonb,
	"latest_update_text" text,
	"show_last_update_prefix" boolean DEFAULT true,
	"show_badge" boolean DEFAULT true,
	"hero_link_type" text DEFAULT 'update',
	"hero_custom_url" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"link" text NOT NULL,
	"is_current" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
