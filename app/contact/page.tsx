import Link from "next/link"
import { ChevronLeft, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMaintenanceMode, getAvailability } from "@/lib/actions"
import { CopyEmail } from "@/components/copy-email"
import { redirect } from "next/navigation"
import { isLocalRequest } from "@/lib/server-utils"

export const dynamic = 'force-dynamic'

export const revalidate = 0

export default async function ContactPage() {
    // Platform Status check (Skipped if local)
    const isLocal = await isLocalRequest()
    if (!isLocal) {
        // Maintenance check
        const { isMaintenance } = await getMaintenanceMode()
        if (isMaintenance) {
            redirect("/maintenance")
        }
    }

    const { isAvailable } = await getAvailability()

    return (
        <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden font-sans selection:bg-primary/30 selection:text-primary">
            <div className="noise-overlay opacity-[0.03]" />

            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "-2s" }} />
            </div>

            <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 backdrop-blur-md bg-white/60">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary transition-all group">
                        <div className="p-2 rounded-xl glass bg-white/50 border-black/5 group-hover:border-primary/50 transition-all">
                            <ChevronLeft className="h-4 w-4" />
                        </div>
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="font-bold tracking-tight text-slate-900">Direct Contact</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-24 container max-w-4xl mx-auto px-6 flex items-center justify-center min-h-[85vh]">
                <div className="w-full glass bg-white/80 p-8 md:p-12 rounded-[3.5rem] border-black/5 shadow-2xl animate-scale-in text-center space-y-12">
                    
                    <div className="space-y-6">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary shadow-glow shadow-primary/5 mx-auto transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                            <Mail className="h-10 w-10" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight font-display text-slate-900">
                                Let's talk about your <span className="text-gradient">Project</span>
                            </h1>
                            <p className="text-slate-600 font-medium leading-relaxed max-w-lg mx-auto">
                                Have an ambitious idea or a technical question? I'm available to discuss it and support you in its realization.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8 py-10">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Contact Email</span>
                            <div className="flex items-center gap-4 flex-wrap justify-center">
                                <a 
                                    href="mailto:hello@drayko.xyz" 
                                    className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 hover:text-primary transition-all hover:scale-105 inline-block selection:bg-primary/20"
                                >
                                    hello@drayko.xyz
                                </a>
                                <CopyEmail email="hello@drayko.xyz" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-10 border-t border-black/5">
                        <div className="glass bg-white/50 p-6 rounded-3xl border-black/5 flex items-center justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAvailable ? "bg-green-400" : "bg-red-400"}`}></span>
                                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isAvailable ? "bg-green-500" : "bg-red-500"}`}></span>
                                </span>
                                <span className={`font-bold text-sm ${isAvailable ? "text-slate-900" : "text-slate-400"}`}>
                                    {isAvailable ? "Open for projects" : "Unavailable"}
                                </span>
                            </div>
                        </div>
                        <div className="glass bg-white/50 p-6 rounded-3xl border-black/5 flex items-center justify-center gap-4">
                             <Clock className="h-4 w-4 text-primary" />
                             <span className="font-bold text-sm text-slate-900">Response within 24h</span>
                        </div>
                    </div>

                    <div className="pt-8">
                        <Button asChild variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-black/5 rounded-2xl h-14 px-8 font-bold">
                            <Link href="/">
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back to portfolio
                            </Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}
