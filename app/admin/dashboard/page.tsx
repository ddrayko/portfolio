import { redirect } from "next/navigation"
import { checkAdminSession } from "@/lib/admin-auth"
import AdminDashboardClient from "./admin-dashboard-client"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const hasSession = await checkAdminSession()

  if (!hasSession) {
    redirect("/admin")
  }

  return <AdminDashboardClient />
}
