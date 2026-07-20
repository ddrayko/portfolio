"use client"

import type { Project } from "@/lib/types"
import { ProjectCard } from "@/components/project-card"

interface PortfolioContentProps {
  projects: Project[]
}

export function PortfolioContent({ projects }: PortfolioContentProps) {
  return (
    <div className="space-y-16">
      <div className="flex flex-col gap-6">
        {projects.map((project, index) => (
          <div
            key={project.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="w-full animate-fade-in-up"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  )
}
