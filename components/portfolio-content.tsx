"use client"

import type { Project } from "@/lib/types"
import { ProjectCard } from "@/components/project-card"

interface PortfolioContentProps {
  projects: Project[]
}

export function PortfolioContent({ projects }: PortfolioContentProps) {
  return (
    <div className="space-y-16">
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
