"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, GitMerge, Sparkles } from "lucide-react"
import type { Version } from "@/lib/types"
import { deleteVersion } from "@/lib/actions"
import { VersionDialog } from "@/components/version-dialog"

interface AdminVersionCardProps {
  version: Version
  onDeleted: (id: string) => void
  onUpdated: () => void
}

export function AdminVersionCard({ version, onDeleted, onUpdated }: AdminVersionCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteVersion(version.id)
    if (result.success) {
      onDeleted(version.id)
    }
    setIsDeleting(false)
    setDeleteOpen(false)
  }

  return (
    <div className="group glass p-6 rounded-3xl border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0 group-hover:scale-110 transition-transform duration-500">
            <GitMerge className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Version</span>
              {version.is_current && (
                <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Current
                </span>
              )}
            </div>
            <h4 className="font-bold text-foreground/90 group-hover:text-primary transition-colors">{version.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {version.description || "No description."}
            </p>
            <a href={version.link} target="_blank" rel="noopener noreferrer" referrerPolicy="strict-origin-when-cross-origin" className="text-xs text-primary underline truncate block max-w-[200px]">
              {version.link}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit version ${version.name}`}
            onClick={() => setEditOpen(true)}
            className="h-8 w-8 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/5"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete version ${version.name}`}
            onClick={() => setDeleteOpen(true)}
            className="h-8 w-8 rounded-lg bg-white/5 hover:text-destructive hover:bg-destructive/10 border border-white/5"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <VersionDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        version={version}
        onSuccess={onUpdated}
      />

      {deleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass p-8 rounded-[2rem] border-white/10 max-w-sm w-full space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">Delete version?</h3>
              <p className="text-sm text-muted-foreground">This action is irreversible.</p>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="ghost" aria-label="Cancel delete" onClick={() => setDeleteOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting} className="flex-1 rounded-xl shadow-lg shadow-destructive/20">
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
