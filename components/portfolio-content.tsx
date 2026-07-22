"use client"

import type { Project } from "@/lib/types"
import { ProjectCard } from "@/components/project-card"
import { ProjectCardSmall } from "@/components/project-card-small"

interface PortfolioContentProps {
  featuredProject: Project | null
  otherProjects: Project[]
}

export function PortfolioContent({ featuredProject, otherProjects }: PortfolioContentProps) {
  return (
    <div className="space-y-16">
      {featuredProject && (
        <section>
          <div className="animate-fade-in-up">
            <ProjectCard project={featuredProject} />
          </div>
        </section>
      )}

      {otherProjects.length > 0 && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <div
                key={project.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in-up"
              >
                <ProjectCardSmall project={project} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
