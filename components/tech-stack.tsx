"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

interface TechItem {
  name: string
  logo: string
}

const techStack: TechItem[] = [
  { name: "JavaScript", logo: "/assets/tech/javascript.svg" },
  { name: "TypeScript", logo: "/assets/tech/typescript.svg" },
  { name: "Node.js", logo: "/assets/tech/nodejs.svg" },
  { name: "Python", logo: "/assets/tech/python.svg" },
  { name: "MySQL", logo: "/assets/tech/mysql.svg" },
  { name: "HTML", logo: "/assets/tech/html5.svg" },
  { name: "Tailwind CSS", logo: "/assets/tech/tailwindcss.svg" },
  { name: "OpenAI", logo: "/assets/tech/openai.svg" },
  { name: "Next.js", logo: "/assets/tech/nextjs.svg" },
  { name: "React", logo: "/assets/tech/react.svg" },
  { name: "OVHcloud", logo: "/assets/tech/ovh.svg" },
  { name: "Figma", logo: "/assets/tech/figma.svg" },
  { name: "PM2", logo: "/assets/tech/pm2.svg" },
  { name: "NPM", logo: "/assets/tech/npm.svg" },
  { name: "Pterodactyl", logo: "/assets/tech/pterodactyl.svg" },
  { name: "Vercel", logo: "/assets/tech/vercel.svg" },
  { name: "Cloudflare", logo: "/assets/tech/cloudflare.svg" },
  { name: "AWS", logo: "/assets/tech/aws.svg" },
  { name: "Proxmox", logo: "/assets/tech/proxmox.svg" },
  { name: "Bash", logo: "/assets/tech/bash.svg" },
  { name: "Linux", logo: "/assets/tech/linux.svg" },
  { name: "Ubuntu", logo: "/assets/tech/ubuntu.svg" },
  { name: "Debian", logo: "/assets/tech/debian.svg" },
  { name: "Fedora", logo: "/assets/tech/fedora.svg" },
  { name: "UniFi OS Server", logo: "/assets/tech/ubiquiti.svg" },
  { name: "pnpm", logo: "/assets/tech/pnpm.svg" },
  { name: "Vite", logo: "/assets/tech/vite.svg" },
  { name: "Express", logo: "/assets/tech/express.svg" },
  { name: "Supabase", logo: "/assets/tech/supabase.svg" },
  { name: "Neon", logo: "/assets/tech/neon.png" },
  { name: "Firebase", logo: "/assets/tech/firebase.svg" },
  { name: "Prisma", logo: "/assets/tech/prisma.svg" },
  { name: "Better Auth", logo: "/assets/tech/shield-check.svg" },
  { name: "Auth0", logo: "/assets/tech/auth0.svg" },
  { name: "Docker", logo: "/assets/tech/docker.svg" },
  { name: "Tailscale", logo: "/assets/tech/tailscale.svg" },
  { name: "Git", logo: "/assets/tech/git.svg" },
  { name: "Gitea", logo: "/assets/tech/gitea.png" },
  { name: "Windows", logo: "/assets/tech/windows11.svg" },
  { name: "Windows Server", logo: "/assets/tech/windows8.svg" },
  { name: "OpenCore", logo: "/assets/tech/opencore.png" },
  { name: "MacOS", logo: "/assets/tech/apple.svg" },
  { name: "Drizzle ORM", logo: "/assets/tech/drizzle.png" },
  { name: "Nginx", logo: "/assets/tech/nginx.svg" },
  { name: "PostgreSQL", logo: "/assets/tech/postgresql.svg" },
  { name: "OpenCode", logo: "/assets/tech/opencode.svg" },
  { name: "Claude", logo: "/assets/tech/claude.svg" },
  { name: "Codex", logo: "/assets/tech/codex.svg" },
]

const third = Math.ceil(techStack.length / 3)
const row1 = techStack.slice(0, third)
const row2 = techStack.slice(third, third * 2)
const row3 = techStack.slice(third * 2)

function TechCard({ tech }: { tech: TechItem }) {
  return (
    <div className="group/card relative h-40 w-48 shrink-0 flex flex-col items-center justify-center gap-4 rounded-3xl glass border-white/5 hover:border-primary/30 transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-2 hover:scale-[1.03]">
      <div className="absolute inset-0 bg-primary/0 group-hover/card:bg-primary/5 transition-colors duration-500" />
      <div className="relative w-12 h-12 flex items-center justify-center p-1 group-hover/card:scale-125 transition-all duration-500">
        <Image
          src={tech.logo}
          alt={tech.name}
          width={48}
          height={48}
          className={`w-full h-full object-contain transition-all duration-500 group-hover/card:scale-110 ${["Vercel", "AWS", "UniFi OS Server", "pnpm", "Express", "Better Auth", "Auth0", "Tailscale", "MacOS"].includes(tech.name) ? "brightness-0 dark:invert" : ""}`}
        />
      </div>
      <span className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground group-hover/card:text-foreground transition-colors">
        {tech.name}
      </span>
    </div>
  )
}

export function TechStack() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const setHeight = () => {
      if (sectionRef.current) {
        const h = window.innerHeight
        sectionRef.current.style.height = `${h}px`
        sectionRef.current.style.minHeight = `${h}px`
        sectionRef.current.style.maxHeight = `${h}px`
      }
    }
    setHeight()
    window.addEventListener("resize", setHeight)
    return () => window.removeEventListener("resize", setHeight)
  }, [])

  return (
    <section ref={sectionRef} id="tech-stack" className="w-full relative overflow-hidden flex flex-col justify-center">
      <div className="container mx-auto px-6 pt-16 lg:pt-24">
        <div className="flex flex-col items-center text-center mb-24 space-y-4">
          <div className="text-primary font-bold tracking-widest text-sm uppercase reveal-up">Expertise</div>
          <h3 className="text-5xl md:text-6xl font-bold tracking-tight font-display reveal-up stagger-1">TECHNICAL ECOSYSTEM</h3>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto reveal-up stagger-2">
            Leveraging cutting-edge technologies to build robust, scalable,
            and future-proof digital solutions.
          </p>
        </div>
      </div>

      {/* Mask on the outer div WITHOUT overflow, takes full width */}
      <div
        className="w-full"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        {/* overflow-hidden on the inner div with increased padding for shadows */}
        <div className="overflow-hidden py-12">
          <div className="flex flex-col gap-6">

            {/* Row 1 — left */}
            <div className="flex w-max gap-6 hover:[&>div]:!animate-play-state-paused">
              <div className="flex shrink-0 gap-6" style={{ animation: "marquee-left 120s linear infinite" }}>
                {row1.map((tech, i) => (
                  <TechCard key={`row1-a-${i}`} tech={tech} />
                ))}
              </div>
              <div className="flex shrink-0 gap-6" aria-hidden="true" style={{ animation: "marquee-left 120s linear infinite" }}>
                {row1.map((tech, i) => (
                  <TechCard key={`row1-b-${i}`} tech={tech} />
                ))}
              </div>
            </div>

            {/* Row 2 — right */}
            <div className="flex w-max gap-6 hover:[&>div]:!animate-play-state-paused">
              <div className="flex shrink-0 gap-6" style={{ animation: "marquee-right 120s linear infinite" }}>
                {row2.map((tech, i) => (
                  <TechCard key={`row2-a-${i}`} tech={tech} />
                ))}
              </div>
              <div className="flex shrink-0 gap-6" aria-hidden="true" style={{ animation: "marquee-right 120s linear infinite" }}>
                {row2.map((tech, i) => (
                  <TechCard key={`row2-b-${i}`} tech={tech} />
                ))}
              </div>
            </div>

            {/* Row 3 — left */}
            <div className="flex w-max gap-6 hover:[&>div]:!animate-play-state-paused">
              <div className="flex shrink-0 gap-6" style={{ animation: "marquee-left 120s linear infinite" }}>
                {row3.map((tech, i) => (
                  <TechCard key={`row3-a-${i}`} tech={tech} />
                ))}
              </div>
              <div className="flex shrink-0 gap-6" aria-hidden="true" style={{ animation: "marquee-left 120s linear infinite" }}>
                {row3.map((tech, i) => (
                  <TechCard key={`row3-b-${i}`} tech={tech} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
