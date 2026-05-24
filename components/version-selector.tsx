"use client"

import { useState } from "react"
import { ChevronDown, GitMerge } from "lucide-react"
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
  const [open, setOpen] = useState(false)

  if (!versions || versions.length === 0) return null

  // On peut considérer que la première version (la plus récente) est l'actuelle, ou juste afficher "Versions"
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 hover:bg-white/10 transition-all text-sm font-medium text-muted-foreground hover:text-foreground">
          <GitMerge className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Versions</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass border-white/10 rounded-2xl p-2 bg-background/90 backdrop-blur-xl">
        {versions.map((version) => (
          <DropdownMenuItem key={version.id} asChild className="rounded-xl cursor-pointer focus:bg-primary/20 focus:text-primary transition-colors p-3 mb-1 last:mb-0">
            <a href={version.link} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-1 w-full">
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm">{version.name}</span>
                <span className="text-[10px] text-muted-foreground">{new Date(version.created_at).toLocaleDateString()}</span>
              </div>
              {version.description && (
                <p className="text-xs text-muted-foreground line-clamp-1">{version.description}</p>
              )}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
