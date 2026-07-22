import { db } from "@/db"
import { projets as projetsTable } from "@/db/schema"
import { desc, eq, or, isNull } from "drizzle-orm"
import type { Project } from "@/lib/types"
import { PortfolioContent } from "@/components/portfolio-content"
import { TechStack } from "@/components/tech-stack"
import { Button } from "@/components/ui/button"
import { ScrollButton } from "@/components/scroll-button"
import Link from "next/link"
import { ArrowRight, Sparkles, Code2, Command, ChevronDown } from "lucide-react"
import { getMaintenanceMode } from "@/lib/actions"
import { redirect } from "next/navigation"
import { isLocalRequest } from "@/lib/server-utils"

export const dynamic = "force-dynamic"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Drayko - Creative Developer & Designer",
  description:
    "Discover the portfolio of Drayko, a Creative Developer & Designer building high-performance web applications with Next.js, React, and TypeScript.",
  keywords: [
    "Drayko portfolio",
    "creative developer",
    "web developer portfolio",
    "Next.js projects",
    "React projects",
    "full-stack developer",
    "UI/UX designer",
    "web development showcase",
  ],
  openGraph: {
    title: "Drayko - Creative Developer & Designer",
    description:
      "Discover the portfolio of Drayko, a Creative Developer & Designer building high-performance web applications.",
  },
}

export default async function HomePage() {
  const isLocal = await isLocalRequest()
  if (!isLocal) {
    const { isMaintenance } = await getMaintenanceMode()
    if (isMaintenance) {
      redirect("/maintenance")
    }
  }

  let featuredProject: Project | null = null
  let otherProjects: Project[] = []
  let fetchError = false

  try {
    const [rawFeatured] = await db.select().from(projetsTable)
      .where(eq(projetsTable.featured, true))
      .limit(1)

    const rawOther = await db.select().from(projetsTable)
      .where(
        or(
          eq(projetsTable.featured, false),
          isNull(projetsTable.featured)
        )
      )
      .orderBy(desc(projetsTable.created_at))

    featuredProject = rawFeatured ? ({
      ...rawFeatured,
      id: rawFeatured.id.toString(),
      created_at: rawFeatured.created_at?.toISOString() || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }) as unknown as Project : null

    otherProjects = rawOther.map((p: any) => ({
      ...p,
      id: p.id.toString(),
      created_at: p.created_at?.toISOString() || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })) as unknown as Project[]
  } catch (e) {
    console.error("Database connection error:", e)
    fetchError = true
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-primary overflow-x-hidden font-sans">
      <div className="noise-overlay" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px] animate-float" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-background/60 reveal-down" role="banner">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer transition-transform hover:scale-105" aria-label="Drayko home">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-all duration-500">
              <Command className="h-6 w-6" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gradient">
              Drayko
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground" aria-label="Main navigation">
            <ScrollButton targetId="projects" variant="ghost" className="p-0 h-auto text-muted-foreground hover:bg-transparent hover:text-foreground transition-all hover:translate-y-[-2px]" aria-label="Scroll to projects">Projects</ScrollButton>
            <ScrollButton targetId="tech-stack" variant="ghost" className="p-0 h-auto text-muted-foreground hover:bg-transparent hover:text-foreground transition-all hover:translate-y-[-2px]" aria-label="Scroll to tech stack">Tech</ScrollButton>
            <Link href="/about" className="hover:text-foreground transition-all hover:translate-y-[-2px]" aria-label="About Drayko">About</Link>
          </nav>

          <div className="flex items-center gap-4">
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-20">
        <section className="relative min-h-[calc(100dvh-5rem)] flex items-start justify-center pt-48 overflow-hidden">
          <div className="container px-6 mx-auto text-center space-y-10">

            <div className="space-y-6">
              <h2 className="text-7xl md:text-8xl lg:text-[10rem] font-black tracking-[calc(-0.05em)] leading-[0.85] animate-fade-in-up font-display">
                <span className="text-foreground/90 block">DRAYKO</span>
                <span className="bg-gradient-to-r from-blue-400 via-sky-300 via-cyan-400 to-blue-600 bg-clip-text text-transparent italic inline-block pr-12 text-glow drop-shadow-[0_0_30px_rgba(56,189,248,0.3)]">
                  PORTFOLIO.
                </span>
              </h2>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up font-medium" style={{ animationDelay: "0.1s" }}>
                I build high-performance web applications that bridge the gap between
                <span className="text-foreground"> design </span> and
                <span className="text-foreground"> engineering</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <ScrollButton targetId="projects" size="lg" className="rounded-full px-8 bg-primary hover:bg-primary text-white hover:text-white shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/50 group w-full sm:w-auto transition-all text-sm font-bold uppercase tracking-widest">
                Discover Projects
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </ScrollButton>
              <ScrollButton targetId="tech-stack" variant="ghost" size="lg" className="rounded-full px-8 border border-white/10 glass hover:bg-white/10 hover:text-foreground w-full sm:w-auto transition-all text-sm font-bold uppercase tracking-widest">
                Explore Tech
              </ScrollButton>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
            <ChevronDown className="h-8 w-8 text-primary text-glow" />
          </div>
        </section>

        <section id="projects" className="py-32 bg-muted/30 backdrop-blur-sm border-y border-white/5 scroll-mt-24">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="text-primary font-bold tracking-widest text-sm uppercase reveal-up">Selected Works</div>
                <h3 className="text-5xl md:text-6xl font-bold tracking-tight reveal-up stagger-1">FEATURED PROJECTS</h3>
                <p className="text-lg text-muted-foreground font-medium reveal-up stagger-2">
                  A collection of digital experiences focusing on performance,
                  scalability, and user-centric design.
                </p>
              </div>

              {fetchError && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive glass">
                  <p className="font-semibold flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    Database Error
                  </p>
                  <p className="text-sm opacity-80">Check your database connection settings.</p>
                </div>
              )}
            </div>

            <PortfolioContent featuredProject={featuredProject} otherProjects={otherProjects} />
          </div>
        </section>

        <TechStack />
      </main>
    </div >
  )
}
