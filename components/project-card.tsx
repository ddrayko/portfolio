import type { Project } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ArrowUpRight, Wrench, Construction, CheckCircle2, Archive, PackageCheck, ImageOff, Trophy, Play, Pause } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isFinished = project.is_completed;
  const isArchived = project.is_archived;
  const isInDev = project.in_development;
  const isPaused = project.development_status === 'paused';

  const statusBadges = (
    <>
      {isInDev && (
        <>
          <div
            className={`absolute inset-x-0 top-0 h-[18%] construction-pattern ${isPaused ? 'paused' : ''}`}
            style={{
              maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)'
            }}
          />
          <div className="absolute top-3 inset-x-0 flex items-center justify-center">
            <div className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl border-2 rotate-[-1deg] flex items-center gap-1.5 ${isPaused
                ? 'bg-orange-400 text-black border-black'
                : 'bg-yellow-400 text-black border-black animate-pulse'
              }`}>
                {isPaused ? (
                  <>
                    <Pause className="h-3 w-3" />
                    Development paused
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3" />
                    Development in progress
                  </>
                )}
              </div>
          </div>
        </>
      )}

      {isFinished && (
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-emerald-500 text-white p-1.5 rounded-lg shadow-lg border border-emerald-400/50 animate-bounce">
              <Trophy className="h-4 w-4" />
            </div>
        </div>
      )}

      {isArchived && !isFinished && (
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-indigo-500/20 text-indigo-300 p-1.5 rounded-lg shadow-lg border border-indigo-400/30 backdrop-blur-md">
              <Archive className="h-4 w-4" />
            </div>
        </div>
      )}
    </>
  );

  return (
    <div className={`group relative rounded-3xl overflow-hidden glass perspective-card reveal-up transition-all duration-500
      ${isInDev ? "border-dashed border-white/20" : "border-white/5"}
      ${isFinished ? "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : ""}
      ${isArchived ? "border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.05)]" : ""}
    `}>
      {/* Glow Effect Overlay */}
      <div className={`absolute inset-0 transition-colors duration-500 pointer-events-none
        ${isFinished ? "group-hover:bg-emerald-500/5" : isArchived ? "group-hover:bg-indigo-500/5" : "group-hover:bg-primary/5"}
      `} />

      {project.image_url ? (
        <>
          {/* Image - fills full card on desktop, stacked on mobile */}
          <div className="relative w-full aspect-video md:absolute md:inset-0 md:aspect-auto overflow-hidden">
            <Image
              src={project.image_url}
              alt={`${project.title} - Project screenshot`}
              fill
              sizes="(max-width: 768px) 100vw, 100vw"
              loading="lazy"
              decoding="async"
              className={`object-cover object-left group-hover:scale-110 transition-transform duration-1000 ease-out
                ${isInDev ? "grayscale brightness-50" : ""}
                ${isFinished ? "brightness-110 contrast-110" : isArchived ? "brightness-100" : ""}
              `}
            />

            {/* Desktop blur gradient - starts at 35%, fully blurred by 55%, covers the rest of the card */}
            <div
              className="hidden md:block absolute inset-0 backdrop-blur-2xl"
              style={{
                maskImage: 'linear-gradient(to right, transparent 35%, black 55%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 35%, black 55%, black 100%)'
              }}
            />

            {/* Mobile gradient */}
            <div className="md:hidden absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

            {statusBadges}
          </div>
        </>
      ) : (
        <div className="relative w-full aspect-video md:absolute md:inset-y-0 md:left-0 md:w-[42%] md:aspect-auto bg-muted/20 overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-white/[0.02] group-hover:bg-white/[0.04] transition-colors duration-500">
            <div className={`p-4 rounded-2xl border border-dashed transition-all duration-500
              ${isFinished ? "border-emerald-500/20 bg-emerald-500/5" : isArchived ? "border-indigo-500/20 bg-indigo-500/5" : "border-white/10 bg-white/5 group-hover:border-primary/20"}
            `}>
              <ImageOff className={`h-8 w-8 transition-transform duration-500 group-hover:scale-110
                ${isFinished ? "text-emerald-500/40" : isArchived ? "text-indigo-500/40" : "text-muted-foreground/40 group-hover:text-primary/40"}
              `} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500
              ${isFinished ? "text-emerald-500/30" : isArchived ? "text-indigo-500/30" : "text-muted-foreground/30 group-hover:text-primary/40"}
            `}>
              No preview available
            </span>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="relative z-10 p-6 lg:p-8 md:ml-[42%] md:min-h-[300px] flex flex-col justify-center space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <h4 className={`text-xl lg:text-2xl font-bold tracking-tight truncate transition-all duration-500
                ${isFinished ? "text-emerald-400" : isArchived ? "text-indigo-400" : "text-gradient group-hover:text-primary"}
              `}>
                {project.title}
              </h4>
              {isInDev && (
                <div className={`p-1.5 rounded-lg border shrink-0 ${isPaused
                    ? 'bg-orange-400/10 border-orange-400/20'
                    : 'bg-yellow-400/10 border-yellow-400/20'
                  }`}>
                    {isPaused ? (
                      <Pause className="h-3.5 w-3.5 text-orange-400" />
                    ) : (
                      <Wrench className="h-3.5 w-3.5 text-yellow-400 animate-spin-slow" />
                    )}
                  </div>
              )}
              {isFinished && (
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)] shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
              )}
              {isArchived && (
                <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)] shrink-0">
                    <PackageCheck className="h-4 w-4" />
                  </div>
              )}
            </div>
            <div className={`p-2 rounded-full border transition-all duration-300 shadow-glow shrink-0
              ${isFinished ? "bg-emerald-500/10 border-emerald-500/20 opacity-100 shadow-emerald-500/20" : isArchived ? "bg-indigo-500/10 border-indigo-500/20 opacity-100 shadow-indigo-500/20" : "bg-white/5 border-white/10 opacity-0 group-hover:opacity-100 shadow-primary/20"}
            `}>
              <ArrowUpRight className={`h-4 w-4 ${isFinished ? "text-emerald-500" : isArchived ? "text-indigo-500" : "text-primary"}`} />
            </div>
          </div>
          <p className={`text-sm text-muted-foreground leading-relaxed font-medium line-clamp-2 transition-colors
            ${isInDev ? "italic opacity-70" : ""}
            ${isFinished ? "text-emerald-50/70" : isArchived ? "text-indigo-50/70" : ""}
          `}>
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={`rounded-full px-3 py-0.5 border-white/10 transition-all font-semibold text-[10px] uppercase tracking-wider
                  ${isFinished ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400/80" : isArchived ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-400/80" : "bg-white/5 group-hover:border-primary/50"}
                `}
              >
                {tag}
              </Badge>
            ))}
            {isInDev && (
              <Badge variant="secondary" className={`rounded-full px-3 py-0.5 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 ${isPaused
                  ? 'bg-orange-500/20 border-orange-500/30 text-orange-400'
                  : 'bg-primary/20 border-primary/30 text-primary animate-pulse'
                }`}>
                  {isPaused ? (
                    <>
                      <Pause className="h-3 w-3" />
                      On pause
                    </>
                  ) : (
                    <>
                      WIP
                    </>
                  )}
                </Badge>
            )}
            {isFinished && (
              <Badge variant="secondary" className="rounded-full px-3 py-0.5 bg-emerald-500/20 border-emerald-500/30 text-emerald-400 font-bold text-[10px] uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  Finished
                </Badge>
            )}
            {isArchived && (
              <Badge variant="secondary" className="rounded-full px-3 py-0.5 bg-indigo-500/20 border-indigo-500/30 text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
                  Archived
                </Badge>
            )}
          </div>

          {isInDev && (
            <div className="w-full max-w-[200px] h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${isPaused
                  ? 'bg-orange-400/40'
                  : 'bg-yellow-400/40 animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent'
                  }`}
                style={{ width: `${project.development_progress || 0}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          {isInDev ? (
            <Button disabled className="rounded-full bg-white/5 text-muted-foreground border border-white/10 cursor-not-allowed text-xs h-8 px-4" aria-label="Coming soon">
              <Construction className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Coming Soon
            </Button>
          ) : (
            project.project_url && (
              <Button asChild size="sm" className={`rounded-full font-bold tracking-tight transition-all duration-500 hover:scale-110 active:scale-95 shadow-lg text-xs h-8 px-4
                ${isFinished ? "bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-emerald-500/20" : isArchived ? "bg-indigo-500 text-white hover:bg-indigo-400 hover:shadow-indigo-500/20" : "bg-white text-black hover:bg-primary hover:text-white hover:shadow-primary/20"}
              `}>
                  <Link href={project.project_url} target="_blank" rel="noopener noreferrer" aria-label={`Live demo of ${project.title}`}>
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Live Demo
                  </Link>
                </Button>
            )
          )}

          {project.github_url && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={`rounded-full border border-white/10 glass hover:bg-white/10 hover:text-foreground font-bold tracking-tight transition-all duration-500 hover:scale-110 active:scale-95 text-xs h-8 px-4`}
            >
              <Link href={project.github_url} target="_blank" rel="noopener noreferrer" aria-label={`Source code of ${project.title}`}>
                <Github className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Code
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
