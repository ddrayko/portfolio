"use client"

import { useState, useEffect } from "react"
import { ChevronDown, GitMerge, Sparkles, Code2 } from "lucide-react"
import type { Version } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface VersionSelectorProps {
  versions: Version[]
}

export function VersionSelector({ versions }: VersionSelectorProps) {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [currentBrowsedVersionId, setCurrentBrowsedVersionId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    if (!versions || versions.length === 0) return

    const hostname = window.location.hostname
    
    const matchingVersion = versions.find(v => {
      try {
        const vUrl = new URL(v.link)
        return vUrl.hostname === hostname
      } catch {
        return false
      }
    })

    if (matchingVersion) {
      setCurrentBrowsedVersionId(matchingVersion.id)
    } else {
      // Fallback on the DB is_current if no match (e.g. main domain)
      const dbCurrent = versions.find(v => v.is_current)
      if (dbCurrent) setCurrentBrowsedVersionId(dbCurrent.id)
    }
  }, [versions])

  if (!versions || versions.length === 0) return null

  // Guard SSR hydration mismatch
  if (!mounted) return <div className="w-24 h-10" />

  const displayedVersionId = currentBrowsedVersionId || versions.find(v => v.is_current)?.id || versions[0]?.id
  const currentVersion = versions.find(v => v.id === displayedVersionId)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 hover:bg-white/10 transition-all text-sm font-medium text-muted-foreground hover:text-foreground">
          <GitMerge className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">{currentVersion ? currentVersion.name : "Versions"}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass border-white/10 rounded-2xl p-2 bg-background/90 backdrop-blur-xl">
        {versions.map((version) => {
          const isBrowsed = version.id === displayedVersionId
          return (
            <DropdownMenuItem key={version.id} asChild className="rounded-xl cursor-pointer focus:bg-primary/20 focus:text-primary transition-colors p-3 mb-1 last:mb-0">
              <a href={version.link} target="_blank" rel="noopener noreferrer" referrerPolicy="strict-origin-when-cross-origin" className="flex items-start gap-3 w-full text-left">
                <div className="mt-0.5 shrink-0">
                  {isBrowsed ? (
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  ) : (
                    <Code2 className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-1 w-full overflow-hidden">
                  <span className={`font-bold text-sm ${isBrowsed ? 'text-primary' : ''}`}>{version.name}</span>
                  {version.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 text-left">{version.description}</p>
                  )}
                </div>
              </a>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
