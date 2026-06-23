"use client"

import { useCallback } from "react"
import { cn } from "@/lib/utils"

interface TagFilterProps {
  tags: string[]
  selectedTag: string | null
  onTagSelect: (tag: string | null) => void
}

export function TagFilter({ tags, selectedTag, onTagSelect }: TagFilterProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, tag: string | null) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onTagSelect(tag)
      }
    },
    [onTagSelect],
  )

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center py-8" role="group" aria-label="Filter projects by tag">
      <button
        onClick={() => onTagSelect(null)}
        onKeyDown={(e) => handleKeyDown(e, null)}
        className={cn(
          "px-6 py-2 rounded-full text-sm font-bold tracking-tight transition-all duration-300 border focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          selectedTag === null
            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105"
            : "glass border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
        )}
        aria-pressed={selectedTag === null}
      >
        All Works
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          onKeyDown={(e) => handleKeyDown(e, tag)}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-bold tracking-tight transition-all duration-300 border uppercase text-[11px] tracking-widest focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            selectedTag === tag
              ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25 scale-105"
              : "glass border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
          )}
          aria-pressed={selectedTag === tag}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}

