"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Project } from "@/lib/types"
import { createProject, updateProject } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Settings2, Sparkles, Save, Play, Pause } from "lucide-react"

interface ProjectFormProps {
  project?: Project
  onSuccess?: () => void
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // States for form fields
  const [inDev, setInDev] = useState(project?.in_development || false)
  const [developmentStatus, setDevelopmentStatus] = useState<'active' | 'paused'>(project?.development_status || 'active')
  const [isCompleted, setIsCompleted] = useState(project?.is_completed || false)
  const [isArchived, setIsArchived] = useState(project?.is_archived || false)
  const [progress, setProgress] = useState(project?.development_progress || 0)
  const formRef = useRef<HTMLFormElement>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const projectData: Partial<Project> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image_url: (formData.get("image_url") as string) || null,
      project_url: (formData.get("project_url") as string) || null,
      github_url: (formData.get("github_url") as string) || null,
      tags: (formData.get("tags") as string)?.split(",").map(t => t.trim()).filter(Boolean) || [],
      in_development: inDev,
      development_status: developmentStatus,
      is_completed: isCompleted,
      is_archived: isArchived,
      development_progress: progress,
    }

    try {
      const result = project 
        ? await updateProject(project.id, projectData) 
        : await createProject(projectData)

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
    <div className="flex flex-col h-full">
      <form ref={formRef} onSubmit={handleSubmit} className="flex-1 overflow-y-auto overflow-x-hidden pr-2 space-y-8">
          {/* Basic Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary/80">
              <Settings2 className="h-4 w-4" />
              <h3 className="font-bold text-xs uppercase tracking-[0.2em]">Core Settings</h3>
            </div>

            <div className="space-y-4 bg-muted/40 p-6 rounded-3xl border border-border/60">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[10px] uppercase tracking-widest text-foreground/70 ml-1">Title</Label>
                <Input id="title" name="title" defaultValue={project?.title} required className="h-10 rounded-xl border-white/10 bg-white/5 font-bold" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-[10px] uppercase tracking-widest text-foreground/70 ml-1">Description</Label>
                <Textarea id="description" name="description" defaultValue={project?.description} required rows={2} className="rounded-xl border-white/10 bg-white/5 min-h-[80px] text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url" className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Image URL</Label>
                  <Input id="image_url" name="image_url" type="url" defaultValue={project?.image_url || ""} className="h-10 rounded-xl border-white/10 bg-white/5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Tags</Label>
                  <Input id="tags" name="tags" defaultValue={project?.tags?.join(", ")} className="h-10 rounded-xl border-white/10 bg-white/5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project_url" className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Demo link</Label>
                  <Input id="project_url" name="project_url" type="url" defaultValue={project?.project_url || ""} className="h-10 rounded-xl border-white/10 bg-white/5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github_url" className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">GitHub Repo</Label>
                  <Input id="github_url" name="github_url" type="url" defaultValue={project?.github_url || ""} className="h-10 rounded-xl border-white/10 bg-white/5" />
                </div>
              </div>
            </div>
          </section>

          {/* Lifecycle Info */}
          <section className="space-y-4 pb-4">
            <div className="flex items-center gap-2 text-primary/80">
              <Sparkles className="h-4 w-4" />
              <h3 className="font-bold text-xs uppercase tracking-[0.2em]">Visibility Status</h3>
            </div>

            <div className="bg-muted/40 p-6 rounded-3xl border border-border/60 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">In Development Mode</Label>
                  <p className="text-[9px] text-muted-foreground uppercase">Show development progress</p>
                </div>
                <Switch checked={inDev} onCheckedChange={setInDev} className="scale-75" />
              </div>

              {inDev && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Completion Percentage</span>
                      <span className="text-primary">{progress}%</span>
                    </div>
                    <Slider value={[progress]} max={100} onValueChange={(val) => setProgress(val[0])} />
                  </div>

                  <div className="px-4 py-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Development Status</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDevelopmentStatus('active')}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs transition-all ${developmentStatus === 'active'
                          ? 'bg-green-500/20 border-2 border-green-500/50 text-green-400 shadow-lg shadow-green-500/20'
                          : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10'
                          }`}
                      >
                        <Play className="h-4 w-4" />
                        In Progress
                      </button>
                      <button
                        type="button"
                        onClick={() => setDevelopmentStatus('paused')}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs transition-all ${developmentStatus === 'paused'
                          ? 'bg-orange-500/20 border-2 border-orange-500/50 text-orange-400 shadow-lg shadow-orange-500/20'
                          : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10'
                          }`}
                      >
                        <Pause className="h-4 w-4" />
                        Paused
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <Label className="text-sm font-bold">Finished</Label>
                  <Switch checked={isCompleted} onCheckedChange={setIsCompleted} className="scale-75" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <Label className="text-sm font-bold">Archived</Label>
                  <Switch checked={isArchived} onCheckedChange={setIsArchived} className="scale-75" />
                </div>
              </div>
            </div>
          </section>

      </form>

      {/* Footer Save Area */}
      <div className="mt-auto pt-6 border-t border-white/5 bg-transparent">
        {error && <p className="text-xs text-destructive font-bold mb-4 text-center">{error}</p>}
        <Button
          onClick={() => {
            if (formRef.current) formRef.current.requestSubmit();
          }}
          disabled={isLoading}
          className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl transition-all"
        >
          {isLoading ? "Saving..." : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {project ? "Update Project" : "Create Project"}
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
