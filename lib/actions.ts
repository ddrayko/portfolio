"use server"

import { db } from "@/db"
import { projects, admins, settings, siteUpdates, moments, versions } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import type { Project, SiteUpdate, Moment, Version } from "./types"
import bcrypt from "bcryptjs"

/**
 * Serialize a primitive value to a SQLite-compatible type.
 * better-sqlite3 only accepts: number, string, bigint, Buffer, null
 * Arrays/objects are passed through for jsonText custom type's toDriver to handle.
 */
function toSql(value: unknown): unknown {
  if (value == null) return null
  if (typeof value === "boolean") return value ? 1 : 0
  if (typeof value === "string" || typeof value === "number") return value
  if (value instanceof Date) return value.toISOString()
  return value
}

/**
 * Safely parse a field that may be a JSON string or already-parsed value.
 * Handles existing double-encoded data from the previous toSql behavior.
 */
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
    const { id: _, created_at: __, updated_at: ___, ...insertData } = data as any
    
    // Generate slug from title if not provided
    if (!insertData.slug && insertData.title) {
      insertData.slug = insertData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const values: Record<string, any> = {}
    for (const [k, v] of Object.entries(insertData)) {
      values[k] = toSql(v)
    }
    values.created_at = new Date()

    const [newProject] = await db.insert(projects).values(values).returning()
    
    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true, project: newProject }
  } catch (error: any) {
    console.error("Error creating project:", error)
    return { success: false, error: error.message }
  }
}

export async function updateProject(id: string, data: Partial<Project>) {
  try {
    const { id: _, created_at: __, updated_at: ___, ...updateData } = data as any
    const values: Record<string, any> = {}
    for (const [k, v] of Object.entries(updateData)) {
      values[k] = toSql(v)
    }
    await db.update(projects)
      .set(values)
      .where(eq(projects.id, parseInt(id)))
    
    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating project:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteProject(id: string) {
  try {
    await db.delete(projects).where(eq(projects.id, parseInt(id)))
    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting project:", error)
    return { success: false, error: error.message }
  }
}

export async function createAdmin(email: string, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await db.insert(admins).values({
      email,
      password: hashedPassword,
    })
    return { success: true }
  } catch (error: any) {
    console.error("Error creating admin:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteAdmin(id: string) {
  try {
    await db.delete(admins).where(eq(admins.id, parseInt(id)))
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting admin:", error)
    return { success: false, error: error.message }
  }
}

export async function getAdmins() {
  try {
    const data = await db.select().from(admins).orderBy(desc(admins.created_at))
    return { success: true, data: data.map((admin: any) => ({ ...admin, id: admin.id.toString(), created_at: admin.created_at?.toISOString() })) }
  } catch (error: any) {
    console.error("Error fetching admins:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function getMaintenanceMode() {
  try {
    const [row] = await db.select().from(settings).where(eq(settings.key, "general")).limit(1)
    if (row) {
      const data = parseJSONField<any>(row.value) || {}
      return {
        success: true,
        isMaintenance: data.maintenance_mode || false,
        message: data.maintenance_message || "",
        progress: data.maintenance_progress || 0
      }
    }
    return { success: true, isMaintenance: false, message: "", progress: 0 }
  } catch (error: any) {
    console.error("Error fetching maintenance mode:", error)
    return { success: false, error: error.message, isMaintenance: false, message: "", progress: 0 }
  }
}

export async function updateMaintenanceMode(isMaintenance: boolean, message?: string, progress?: number) {
  try {
    const data: any = { maintenance_mode: isMaintenance }
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
  } catch (error: any) {
    console.error("Error updating maintenance mode:", error)
    return { success: false, error: error.message }
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const [project] = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1)
    if (project) {
        return {
            ...project,
            id: project.id.toString(),
            tags: parseJSONField<string[]>(project.tags),
            changelog: parseJSONField<any[]>(project.changelog),
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
      const value = parseJSONField<any>(row.value)
      return { success: true, isAvailable: value?.isAvailable }
    }
    return { success: true, isAvailable: true }
  } catch (error: any) {
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
    revalidatePath("/contact")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating availability:", error)
    return { success: false, error: error.message }
  }
}

export async function getSiteUpdateData() {
  try {
    const [row] = await db.select().from(siteUpdates).limit(1)
    if (row) {
      return {
        success: true,
        data: {
          ...row,
          id: row.id.toString(),
          next_update_date: row.next_update_date?.toISOString() || null,
          updated_at: row.updated_at?.toISOString() || new Date().toISOString(),
          changelog: parseJSONField<any[]>(row.changelog) || [],
          planned_features: parseJSONField<string[]>(row.planned_features) || [],
          no_update_planned: (row.no_update_planned ?? 1) ? true : false,
          show_last_update_prefix: (row.show_last_update_prefix ?? 1) ? true : false,
          hero_link_type: row.hero_link_type || "update",
          hero_custom_url: row.hero_custom_url || "",
        } as SiteUpdate
      }
    }
    return {
      success: true,
      data: {
        next_update_date: null,
        no_update_planned: true,
        planned_features: [],
        changelog: [],
        updated_at: new Date().toISOString()
      } as SiteUpdate
    }
  } catch (error: any) {
    console.error("Error fetching site update data:", error)
    return { success: false, error: error.message }
  }
}

export async function updateSiteUpdateData(data: Partial<SiteUpdate>) {
  try {
    const [row] = await db.select().from(siteUpdates).limit(1)
    
    const payload: Record<string, any> = {}
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || key === "id") continue
      if (key === "next_update_date" || key === "updated_at") {
        payload[key] = value ? new Date(value) : null
      } else if (key === "no_update_planned" || key === "show_last_update_prefix") {
        payload[key] = value ? 1 : 0
      } else {
        payload[key] = value
      }
    }
    payload.updated_at = new Date()

    if (row) {
      await db.update(siteUpdates).set(payload).where(eq(siteUpdates.id, row.id))
    } else {
      await db.insert(siteUpdates).values(payload)
    }

    revalidatePath("/")
    revalidatePath("/update")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating site update data:", error)
    return { success: false, error: error.message }
  }
}

export async function getProjects() {
  try {
    const data = await db.select().from(projects).orderBy(desc(projects.created_at))
    return { 
      success: true, 
      data: data.map((p: any) => ({ 
        ...p, 
        id: p.id.toString(), 
        tags: parseJSONField<string[]>(p.tags),
        changelog: parseJSONField<any[]>(p.changelog),
        created_at: p.created_at?.toISOString() || new Date().toISOString(),
        updated_at: new Date().toISOString()
      })) as unknown as Project[]
    }
  } catch (error: any) {
    console.error("Error fetching projects:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function getMoments() {
  try {
    const data = await db.select().from(moments).orderBy(desc(moments.date))
    return {
      success: true,
      data: data.map((m: any) => ({
        ...m,
        id: m.id.toString(),
        created_at: m.created_at?.toISOString() || new Date().toISOString()
      })) as Moment[]
    }
  } catch (error: any) {
    console.error("Error fetching moments:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function createMoment(data: Partial<Moment>) {
  try {
    const { id: _, created_at: __, ...insertData } = data as any
    const values: Record<string, any> = {}
    for (const [k, v] of Object.entries(insertData)) {
      values[k] = toSql(v)
    }
    values.created_at = new Date()
    const [newMoment] = await db.insert(moments).values(values).returning()

    revalidatePath("/journey")
    revalidatePath("/admin/dashboard")
    return { success: true, moment: newMoment }
  } catch (error: any) {
    console.error("Error creating moment:", error)
    return { success: false, error: error.message }
  }
}

export async function updateMoment(id: string, data: Partial<Moment>) {
  try {
    const { id: _, created_at: __, ...updateData } = data as any
    const values: Record<string, any> = {}
    for (const [k, v] of Object.entries(updateData)) {
      values[k] = toSql(v)
    }
    await db.update(moments)
      .set(values)
      .where(eq(moments.id, parseInt(id)))

    revalidatePath("/journey")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating moment:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteMoment(id: string) {
  try {
    await db.delete(moments).where(eq(moments.id, parseInt(id)))
    revalidatePath("/journey")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting moment:", error)
    return { success: false, error: error.message }
  }
}

export async function getVersions() {
  try {
    const data = await db.select().from(versions).orderBy(desc(versions.created_at))
    return {
      success: true,
      data: data.map((v: any) => ({
        ...v,
        id: v.id.toString(),
        created_at: v.created_at?.toISOString() || new Date().toISOString()
      })) as Version[]
    }
  } catch (error: any) {
    console.error("Error fetching versions:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function createVersion(data: Partial<Version>) {
  try {
    const { id: _, created_at: __, ...insertData } = data as any
    const values: Record<string, any> = {}
    for (const [k, v] of Object.entries(insertData)) {
      values[k] = toSql(v)
    }
    values.created_at = new Date()
    const [newVersion] = await db.insert(versions).values(values).returning()

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true, version: newVersion }
  } catch (error: any) {
    console.error("Error creating version:", error)
    return { success: false, error: error.message }
  }
}

export async function updateVersion(id: string, data: Partial<Version>) {
  try {
    const { id: _, created_at: __, ...updateData } = data as any
    const values: Record<string, any> = {}
    for (const [k, v] of Object.entries(updateData)) {
      values[k] = toSql(v)
    }
    await db.update(versions)
      .set(values)
      .where(eq(versions.id, parseInt(id)))

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating version:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteVersion(id: string) {
  try {
    await db.delete(versions).where(eq(versions.id, parseInt(id)))
    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting version:", error)
    return { success: false, error: error.message }
  }
}

export async function setCurrentVersion(id: string) {
  try {
    await db.update(versions).set({ is_current: toSql(false) })
    await db.update(versions).set({ is_current: toSql(true) }).where(eq(versions.id, parseInt(id)))

    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error setting current version:", error)
    return { success: false, error: error.message }
  }
}
