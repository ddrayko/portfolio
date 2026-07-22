"use server"

import { db } from "@/db"
import { projets, admin, settings } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { Project, ChangelogEntry } from "./types"
import { dbType } from "@/db/config"
import bcrypt from "bcryptjs"

function toSql(value: unknown): unknown {
  if (value == null) return null
  if (typeof value === "boolean") {
    if (dbType === "sqlite") return value ? 1 : 0
    return value
  }
  if (typeof value === "string" || typeof value === "number") return value
  if (value instanceof Date) return value.toISOString()
  return value
}

function parseJSONField<T>(value: unknown): T {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return parsed as T
    } catch {
      return value as T
    }
  }
  return value as T
}

export async function createProject(data: Partial<Project>) {
  try {
    const { id: _, created_at: __, updated_at: ___, ...insertData } = data
    
    if (!insertData.slug && insertData.title) {
      insertData.slug = insertData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const values: Record<string, any> = {}
    for (const [k, v] of Object.entries(insertData)) {
      values[k] = toSql(v)
    }
    values.created_at = new Date()

    const [newProject] = await db.insert(projets).values(values).returning()
    
    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true, project: newProject }
  } catch (error: unknown) {
    console.error("Error creating project:", error)
    return { success: false, error: (error as Error).message }
  }
}

function validateId(id: string): number | null {
  const parsed = parseInt(id)
  return isNaN(parsed) ? null : parsed
}

export async function updateProject(id: string, data: Partial<Project>) {
  try {
    const numericId = validateId(id)
    if (numericId === null) return { success: false, error: "Invalid ID" }

    const { id: _, created_at: __, updated_at: ___, ...updateData } = data
    const values: Record<string, any> = {}
    for (const [k, v] of Object.entries(updateData)) {
      values[k] = toSql(v)
    }
    values.updated_at = new Date()
    await db.update(projets)
      .set(values)
      .where(eq(projets.id, numericId))
    
    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: unknown) {
    console.error("Error updating project:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteProject(id: string) {
  try {
    const numericId = validateId(id)
    if (numericId === null) return { success: false, error: "Invalid ID" }
    await db.delete(projets).where(eq(projets.id, numericId))
    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: unknown) {
    console.error("Error deleting project:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function createAdmin(email: string, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await db.insert(admin).values({
      email,
      password: hashedPassword,
    })
    return { success: true }
  } catch (error: unknown) {
    console.error("Error creating admin:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteAdmin(id: string) {
  try {
    const numericId = validateId(id)
    if (numericId === null) return { success: false, error: "Invalid ID" }
    await db.delete(admin).where(eq(admin.id, numericId))
    return { success: true }
  } catch (error: unknown) {
    console.error("Error deleting admin:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getAdmins() {
  try {
    const data = await db.select().from(admin).orderBy(desc(admin.created_at))
    return { success: true, data: data.map((a: any) => ({ ...a, id: a.id.toString(), created_at: a.created_at?.toISOString() })) }
  } catch (error: unknown) {
    console.error("Error fetching admins:", error)
    return { success: false, error: (error as Error).message, data: [] }
  }
}

export async function getMaintenanceMode() {
  try {
    const [row] = await db.select().from(settings).where(eq(settings.key, "general")).limit(1)
    if (row) {
      const data = parseJSONField<Record<string, unknown>>(row.value) || {}
      return {
        success: true,
        isMaintenance: data.maintenance_mode || false,
        message: data.maintenance_message || "",
        progress: data.maintenance_progress || 0
      }
    }
    return { success: true, isMaintenance: false, message: "", progress: 0 }
  } catch (error: unknown) {
    console.error("Error fetching maintenance mode:", error)
    return { success: false, error: (error as Error).message, isMaintenance: false, message: "", progress: 0 }
  }
}

export async function updateMaintenanceMode(isMaintenance: boolean, message?: string, progress?: number) {
  try {
    const data: Record<string, unknown> = { maintenance_mode: isMaintenance }
    if (message !== undefined) data.maintenance_message = message
    if (progress !== undefined) data.maintenance_progress = progress

    await db.insert(settings)
      .values({ key: "general", value: data })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: data, updated_at: new Date() }
      })

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: unknown) {
    console.error("Error updating maintenance mode:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const [project] = await db.select().from(projets).where(eq(projets.slug, slug)).limit(1)
    if (project) {
        return {
            ...project,
            id: project.id.toString(),
            tags: parseJSONField<string[]>(project.tags),
            changelog: parseJSONField<ChangelogEntry[]>(project.changelog),
            created_at: project.created_at?.toISOString()
        } as unknown as Project
    }
    return null
  } catch (error) {
    console.error("Error fetching project by slug:", error)
    return null
  }
}

export async function getAvailability() {
  try {
    const [row] = await db.select().from(settings).where(eq(settings.key, "availability")).limit(1)
    if (row) {
      const value = parseJSONField<{ isAvailable: boolean }>(row.value)
      return { success: true, isAvailable: value?.isAvailable }
    }
    return { success: true, isAvailable: true }
  } catch (error: unknown) {
    console.error("Error fetching availability:", error)
    return { success: false, isAvailable: true }
  }
}

export async function updateAvailability(isAvailable: boolean) {
  try {
    const value = { isAvailable }
    await db.insert(settings)
      .values({ key: "availability", value })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value, updated_at: new Date() }
      })

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: unknown) {
    console.error("Error updating availability:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getProjects() {
  try {
    const data = await db.select().from(projets).orderBy(desc(projets.created_at))
    return { 
      success: true, 
      data: data.map((p: any) => ({ 
        ...p, 
        id: p.id.toString(), 
        tags: parseJSONField<string[]>(p.tags),
        changelog: parseJSONField<ChangelogEntry[]>(p.changelog),
        created_at: p.created_at?.toISOString() || new Date().toISOString(),
        updated_at: new Date().toISOString()
      })) as unknown as Project[]
    }
  } catch (error: unknown) {
    console.error("Error fetching projects:", error)
    return { success: false, error: (error as Error).message, data: [] }
  }
}

