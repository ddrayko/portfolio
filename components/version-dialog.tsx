"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VersionForm } from "@/components/version-form"
import type { Version } from "@/lib/types"

interface VersionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  version?: Version
  onSuccess?: () => void
}

export function VersionDialog({ open, onOpenChange, version, onSuccess }: VersionDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl flex flex-col p-0 overflow-hidden bg-background border border-border/80 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] rounded-[2rem]">
        <div className="px-8 pt-8 pb-4 bg-muted/30 border-b border-border/80">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tight text-foreground">{version ? "Edit Version" : "Add Version"}</DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground">
              {version ? "Edit the version details below." : "Fill in the details to add a new version."}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-8">
          <VersionForm version={version} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
