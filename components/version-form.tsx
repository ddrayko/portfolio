"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Version } from "@/lib/types"
import { createVersion, updateVersion } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"

interface VersionFormProps {
  version?: Version
  onSuccess?: () => void
}

export function VersionForm({ version, onSuccess }: VersionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const versionData: Partial<Version> = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      link: formData.get("link") as string,
    }

    try {
      const result = version 
        ? await updateVersion(version.id, versionData) 
        : await createVersion(versionData)

      if (!result.success) {
        setError(result.error || "An error occurred")
        setIsLoading(false)
        return
      }

      router.refresh()
      onSuccess?.()
    } catch (err) {
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 bg-muted/40 p-6 rounded-3xl border border-border/60">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-foreground/70 ml-1">Version Name</Label>
          <Input id="name" name="name" defaultValue={version?.name} required placeholder="v1.0" className="h-10 rounded-xl border-white/10 bg-white/5 font-bold" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-[10px] uppercase tracking-widest text-foreground/70 ml-1">Description</Label>
          <Textarea id="description" name="description" defaultValue={version?.description || ""} rows={3} placeholder="New interface..." className="rounded-xl border-white/10 bg-white/5 min-h-[100px] text-sm" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="link" className="text-[10px] uppercase tracking-widest text-foreground/70 ml-1">Version Link</Label>
          <Input id="link" name="link" defaultValue={version?.link} required placeholder="https://v1.drayko.dev" className="h-10 rounded-xl border-white/10 bg-white/5 font-bold" />
        </div>
      </div>

      <div className="pt-4">
        {error && <p className="text-xs text-destructive font-bold mb-3 text-center">{error}</p>}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl transition-all"
        >
          {isLoading ? "Saving..." : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {version ? "Update Version" : "Create Version"}
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}
