import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, Tags, Rocket, CheckCircle2, Archive, Timer, Code2, AlertCircle } from "lucide-react"
import { getMaintenanceMode } from "@/lib/actions"
import { redirect } from "next/navigation"
import { isLocalRequest } from "@/lib/server-utils"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Tags Info",
  description:
    "Understand the meaning behind project status tags on Drayko's portfolio. Learn about Active, Paused, Completed, and Archived project statuses.",
  keywords: [
    "project tags",
    "status tags",
    "project status",
    "active project",
    "archived project",
    "development status",
    "portfolio tags",
    "Drayko tags",
  ],
  openGraph: {
    title: "Tags Info | Drayko",
    description:
      "Understand the meaning behind project status tags on Drayko's portfolio.",
  },
}

export default async function TagsInfoPage() {
    // Platform Status check (Skipped if local)
    const isLocal = await isLocalRequest()
    if (!isLocal) {
        // Maintenance check
        const { isMaintenance } = await getMaintenanceMode()
        if (isMaintenance) {
            redirect("/maintenance")
        }

    }

    const tagCategories = [
        {
            id: "no-tag",
            name: "No tags",
            icon: Rocket,
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/30",
            iconColor: "text-purple-500",
            description: "The absence of a tag means that the project is in a stable version and active.",
            details: [
                "The project is fully functional and in a stable version",
                "Regular updates are always provided",
                "New features may be added",
                "The project is actively maintained and improved"
            ]
        },
        {
            id: "in-development-active",
            name: "In Development (Active)",
            icon: Timer,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/30",
            iconColor: "text-green-500",
            description: "The project is currently in active development with regular progress.",
            details: [
                "The project is under active construction",
                "Regular updates are provided",
                "The progress bar is continuously moving",
                "The project will arrive soon in a stable version"
            ]
        },
        {
            id: "in-development-paused",
            name: "In Development (Paused)",
            icon: Timer,
            color: "from-orange-500 to-amber-500",
            bgColor: "bg-orange-500/10",
            borderColor: "border-orange-500/30",
            iconColor: "text-orange-500",
            description: "The development of the project is temporarily on pause.",
            details: [
                "The project is under construction but temporarily suspended",
                "No updates are currently being provided",
                "The progress bar is frozen",
                "Development will resume later"
            ]
        },
        {
            id: "completed",
            name: "Completed",
            icon: CheckCircle2,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/30",
            iconColor: "text-green-500",
            description: "This tag means that the project is completely finished and functional.",
            details: [
                "The project is fully functional and stable",
                "All planned features have been implemented",
                "The project will no longer receive major or minor updates",
                "Bug fixes and security updates only if necessary"
            ]
        },
        {
            id: "archived",
            name: "Archived",
            icon: Archive,
            color: "from-gray-500 to-slate-500",
            bgColor: "bg-gray-500/10",
            borderColor: "border-gray-500/30",
            iconColor: "text-gray-500",
            description: "This tag indicates that the project has been archived and is no longer maintained.",
            details: [
                "The project will no longer receive any updates",
                "The project is not finished and is incomplete",
                "Some features may not be operational",
                "The source code remains available for reference or fork (if possible)"
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/30 selection:text-primary">
            <div className="noise-overlay" />

            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "-4s" }} />
            </div>

            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-background/60 reveal-down" role="banner">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all group">
                        <div className="p-2 rounded-xl glass border-white/10 group-hover:border-primary/50 transition-all">
                            <ChevronLeft className="h-4 w-4" />
                        </div>
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2">
                        <Tags className="h-5 w-5 text-primary" />
                        <span className="font-bold tracking-tight">Tags Info</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-24 container mx-auto px-6">

                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center space-y-8 mb-24 reveal-up">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/90 to-foreground/50 text-glow">
                        UNDERSTANDING TAGS
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        Each project is marked with a <span className="text-primary">status tag</span> to inform you of its current state. Here is what each tag means.
                    </p>
                </div>

                {/* Tags Grid */}
                <div className="max-w-6xl mx-auto space-y-8">
                    {tagCategories.map((tag, index) => {
                        const IconComponent = tag.icon
                        return (
                            <div
                                key={tag.id}
                                className="glass p-8 md:p-10 rounded-[2rem] border-white/10 shadow-2xl relative overflow-hidden mesh-bg reveal-up hover:scale-[1.02] transition-all duration-500"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Gradient Overlay */}
                                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${tag.color} opacity-10 rounded-full blur-3xl`} />

                                <div className="relative z-10">
                                    {/* Header */}
                                    <div className="flex items-start gap-6 mb-6">
                                        <div className={`w-16 h-16 rounded-2xl ${tag.bgColor} border ${tag.borderColor} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                            <IconComponent className={`h-8 w-8 ${tag.iconColor}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-3xl font-bold tracking-tight mb-3">{tag.name}</h2>
                                            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                                {tag.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-3 pl-[88px]">
                                        {tag.details.map((detail, idx) => (
                                            <div key={idx} className="flex items-start gap-3 group">
                                                <div className={`w-1.5 h-1.5 rounded-full ${tag.bgColor} border ${tag.borderColor} mt-2 flex-shrink-0 group-hover:scale-150 transition-transform`} />
                                                <p className="text-muted-foreground font-medium leading-relaxed">
                                                    {detail}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Info Box */}
                <div className="max-w-4xl mx-auto mt-16 reveal-up">
                    <div className="glass p-8 rounded-[2rem] border-white/10 bg-primary/5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <h3 className="text-xl font-bold">Good to know</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed">
                                    Tags are updated regularly to reflect the current state of each project.
                                    If you have questions about a specific project, feel free to reach out on <a href="https://github.com/ddrayko" target="_blank" rel="noopener noreferrer" referrerPolicy="strict-origin-when-cross-origin" className="text-primary hover:underline font-bold">GitHub</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="max-w-4xl mx-auto mt-16 text-center reveal-up">
                    <div className="glass p-12 rounded-[2.5rem] border-white/10 space-y-6 mesh-bg relative overflow-hidden">
                        <Rocket className="h-12 w-12 text-primary mx-auto animate-pulse" />
                        <h3 className="text-3xl font-bold tracking-tight">Ready to explore my projects?</h3>
                        <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto">
                            Discover all my projects and their current status.
                        </p>
                        <div className="pt-4">
                            <Link
                                href="/#projects"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-sm tracking-wide hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/20"
                            >
                                <Code2 className="h-5 w-5" />
                                See projects
                            </Link>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}
