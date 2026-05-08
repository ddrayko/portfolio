import { Construction, Command } from "lucide-react"
import { getMaintenanceMode } from "@/lib/actions"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function MaintenancePage() {
    const { isMaintenance, message, progress } = await getMaintenanceMode()

    if (!isMaintenance) {
        redirect("/")
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/30 selection:text-primary">
            <div className="noise-overlay" />

            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "-4s" }} />
            </div>

            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-background/60 reveal-down">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-default transition-transform hover:scale-105">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-all duration-500">
                            <Command className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                            Drayko
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Construction className="h-5 w-5 text-primary" />
                        <span className="font-bold tracking-tight text-foreground uppercase">Maintenance</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-24 container mx-auto px-6 max-w-4xl">
                {/* Hero Section */}
                <div className="text-center space-y-8 mb-16 reveal-up">
                    <div className="text-primary font-bold tracking-widest text-xs uppercase stagger-1">System Status</div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/90 to-foreground/50 text-glow leading-tight stagger-2">
                        UPDATE IN PROGRESS
                    </h1>
                </div>

                {/* Content Section */}
                <div className="max-w-2xl mx-auto space-y-12 reveal-up stagger-3">
                    <div className="glass p-10 md:p-12 rounded-[2.5rem] border-white/5 shadow-2xl text-center space-y-8">
                        <div className="space-y-4">
                            <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
                                {message || "Our digital realm is currently undergoing technical upgrades to provide you with a better experience."}
                            </p>
                            <span className="block text-primary/80 font-bold tracking-widest uppercase text-xs">System Update in Progress</span>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">
                                <span>Update Progress</span>
                                <span>{progress || 0}%</span>
                            </div>
                            <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden relative">
                                <div
                                    className="h-full bg-primary absolute top-0 left-0 transition-all duration-1000 ease-out"
                                    style={{ width: `${progress || 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
