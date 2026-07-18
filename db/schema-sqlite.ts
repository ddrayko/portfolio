import { sqliteTable, text, integer, uniqueIndex, customType } from "drizzle-orm/sqlite-core"

const jsonText = customType<{ data: any; driverData: string }>({
  dataType: () => 'text',
  toDriver: (value: any) => JSON.stringify(value),
  fromDriver: (value: string) => JSON.parse(value),
})

const timestampText = customType<{ data: Date | null; driverData: string | null }>({
  dataType: () => 'text',
  toDriver: (value: Date | null) => value?.toISOString() ?? null,
  fromDriver: (value: string | null) => value ? new Date(value) : null,
})

export const projets = sqliteTable("projets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  image_url: text("image_url"),
  tags: jsonText("tags").$type<string[]>(),
  project_url: text("project_url"),
  github_url: text("github_url"),
  in_development: integer("in_development").default(0),
  development_status: text("development_status").default("active"),
  is_completed: integer("is_completed").default(0),
  is_archived: integer("is_archived").default(0),
  development_progress: integer("development_progress").default(0),
  changelog: jsonText("changelog").$type<any[]>(),
  is_featured: integer("is_featured").default(0),
  created_at: timestampText("created_at"),
}, (table) => ({
  slugIdx: uniqueIndex("slug_idx").on(table.slug),
}))

export const admin = sqliteTable("admin", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  password: text("password").notNull(),
  created_at: timestampText("created_at"),
}, (table) => ({
  emailIdx: uniqueIndex("email_idx").on(table.email),
}))

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: jsonText("value").$type<any>(),
  updated_at: timestampText("updated_at"),
})
