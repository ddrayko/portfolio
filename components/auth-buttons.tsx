"use client"

import dynamic from "next/dynamic"

const AuthButtonsContent = dynamic(() => import("./clerk-integrated-components").then(m => m.AuthButtonsContent), { ssr: false })
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"



export function AuthButtons() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    return null
  }

  return <AuthButtonsContent />
}