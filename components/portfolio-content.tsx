"use client"

import type { Project } from "@/lib/types"
import { ProjectCard } from "@/components/project-card"

interface PortfolioContentProps {
  projects: Project[]
  featuredProject?: Project | null
}

export function PortfolioContent({ projects, featuredProject }: PortfolioContentProps) {
  return (
    <div className="space-y-16">
      {featuredProject && (
        <section>
          <div className="text-primary font-bold tracking-widest text-xs uppercase mb-6 text-center md:text-left">Featured Project</div>
          <div className="max-w-2xl mx-auto md:mx-0">
            <ProjectCard project={featuredProject} />
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div
            key={project.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="h-full animate-fade-in-up"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  )
}
