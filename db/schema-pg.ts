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

export const siteUpdate = pgTable("update", {
  id: serial("id").primaryKey(),
  next_update_date: timestamp("next_update_date"),
  no_update_planned: boolean("no_update_planned").default(true),
  planned_features: jsonb("planned_features").$type<string[]>().default([]),
  changelog: jsonb("changelog").$type<ChangelogEntry[]>().default([]),
  latest_update_text: text("latest_update_text"),
  show_last_update_prefix: boolean("show_last_update_prefix").default(true),
  show_badge: boolean("show_badge").default(true),
  hero_link_type: text("hero_link_type").default("update"),
  hero_custom_url: text("hero_custom_url"),
  updated_at: timestamp("updated_at").defaultNow(),
})
