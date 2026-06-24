"use server"

import { cookies } from "next/headers"
import crypto from "crypto"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { admins } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

const ADMIN_SESSION_COOKIE = "admin_session"

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  try {
    const [admin] = await db.select()
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1)

    if (!admin) {
      return false
    }

    const isValid = await bcrypt.compare(password, admin.password)

    if (!isValid) {
      return false
    }

    return true
  } catch (error: unknown) {
    console.error("[Auth] Verification error:", (error as Error).message)
    return false
  }
}

export async function createAdminSession() {
  const cookieStore = await cookies()
  const sessionToken = crypto.randomUUID()

  cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  })

  return true
}

export async function loginAdmin(email: string, password: string) {
  const isValid = await verifyAdminCredentials(email, password)

  if (!isValid) {
    return { success: false, error: "Invalid email or password" }
  }

  await createAdminSession()

  redirect("/admin/dashboard")
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)
  return !!session
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
  redirect("/admin")
}

export async function deleteAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}
