import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, Copyright } from "lucide-react"

export const metadata: Metadata = {
  title: "Copyright",
  description:
    "Copyright information and license details for Drayko's portfolio website and its open-source project code.",
  keywords: [
    "copyright",
    "Drayko copyright",
    "open source license",
    "portfolio license",
    "free software",
    "MIT license",
  ],
  openGraph: {
    title: "Copyright | Drayko",
    description:
      "Copyright information and license details for Drayko's portfolio website.",
  },
}

export default function CopyrightPage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/30 selection:text-primary">
            <div className="noise-overlay" />

            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "-2s" }} />
            </div>

            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-background/60 reveal-down" role="banner">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all group">
                        <div className="p-2 rounded-xl glass border-white/10 group-hover:border-primary/50 transition-all">
                            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        </div>
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2">
                        <Copyright className="h-5 w-5 text-primary" aria-hidden="true" />
                        <span className="font-bold tracking-tight">Copyright Information</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-24 container max-w-4xl mx-auto px-6 reveal-up">
                <div className="glass p-10 md:p-16 rounded-[2.5rem] border-white/5 space-y-12 shadow-2xl">
                    <section className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight font-display text-gradient uppercase">Copyright</h1>
                        <p className="text-muted-foreground font-medium">© 2025 - 2026 Drayko. All rights reserved.</p>
                    </section>

                    <div className="prose prose-invert max-w-none space-y-8 font-medium text-muted-foreground leading-relaxed">
                        <section className="space-y-4">
                            <p>
                                This project is <strong>free software</strong>. You are permitted to use it for any purpose, including commercial and personal use. You may modify, distribute, reproduce, sublicense, or otherwise use this project in any way you see fit, without restriction.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <p>
                                The software is provided "as is", without warranty of any kind, express or implied. In no event shall the author be held liable for any claim, damages, or other liability arising from the use of the software.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}
