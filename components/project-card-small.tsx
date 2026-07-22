import type { Project } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ImageOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProjectCardSmallProps {
  project: Project
}

export function ProjectCardSmall({ project }: ProjectCardSmallProps) {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white border border-black/5 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 h-full flex flex-col">
      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted/20">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={`${project.title} - Project screenshot`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            decoding="async"
            className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
            <div className="p-3 rounded-2xl border border-dashed border-white/10 bg-white/5">
              <ImageOff className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
              No preview
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <h4 className="text-lg font-bold tracking-tight text-black group-hover:text-primary transition-colors">
          {project.title}
        </h4>

        {project.description && (
          <p className="text-sm text-black/70 leading-relaxed line-clamp-3">
            {project.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.tags.slice(0, 4).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-full px-2.5 py-0 text-[9px] font-semibold uppercase tracking-wider border-black/10 text-black/70 bg-black/5"
            >
              {tag}
            </Badge>
          ))}
          {project.tags.length > 4 && (
            <span className="text-[9px] text-black/50 self-center">+{project.tags.length - 4}</span>
          )}
        </div>

        <div className="flex gap-2">
          {project.project_url && (
            <Button asChild size="sm" className="rounded-full h-8 px-4 text-xs font-bold tracking-tight bg-white text-black hover:bg-primary hover:text-white transition-all shadow-lg">
              <Link href={project.project_url} target="_blank" rel="noopener noreferrer" aria-label={`Live demo of ${project.title}`}>
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Live
              </Link>
            </Button>
          )}
          {project.github_url && (
            <Button asChild variant="ghost" size="sm" className="rounded-full h-8 px-4 text-xs font-bold tracking-tight border border-black/10 bg-black/5 hover:bg-black/10 text-black">
              <Link href={project.github_url} target="_blank" rel="noopener noreferrer" aria-label={`Source code of ${project.title}`}>
                <Github className="mr-1.5 h-3.5 w-3.5" />
                Code
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
