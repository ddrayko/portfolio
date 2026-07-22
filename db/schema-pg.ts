import { pgTable, serial, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core"
import type { ChangelogEntry } from "@/lib/types"

export const projets = pgTable("projets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image_url: text("image_url"),
  tags: text("tags").array().$type<string[]>(),
  project_url: text("project_url"),
  github_url: text("github_url"),
  in_development: boolean("in_development").default(false),
  development_status: text("development_status").$type<"active" | "paused">().default("active"),
  is_completed: boolean("is_completed").default(false),
  is_archived: boolean("is_archived").default(false),
  development_progress: integer("development_progress").default(0),
  featured: boolean("featured").default(false),
  text_color: text("text_color"),
  changelog: jsonb("changelog").$type<ChangelogEntry[]>().default([]),
  created_at: timestamp("created_at").defaultNow(),
})

export const admin = pgTable("admin", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow(),
})

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
})
