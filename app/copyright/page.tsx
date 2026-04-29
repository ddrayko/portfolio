import Link from "next/link"
import { ChevronLeft, Copyright } from "lucide-react"

export default function CopyrightPage() {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans selection:bg-primary/30 selection:text-primary">
            <div className="noise-overlay" />

            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "-2s" }} />
            </div>

            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md bg-background/60">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all group">
                        <div className="p-2 rounded-xl glass border-white/10 group-hover:border-primary/50 transition-all">
                            <ChevronLeft className="h-4 w-4" />
                        </div>
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2">
                        <Copyright className="h-5 w-5 text-primary" />
                        <span className="font-bold tracking-tight">Copyright Information</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-32 pb-24 container max-w-4xl mx-auto px-6">
                <div className="glass p-10 md:p-16 rounded-[2.5rem] border-white/5 space-y-12 shadow-2xl">
                    <section className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight font-display text-gradient uppercase">Copyright</h1>
                        <p className="text-muted-foreground font-medium">© 2025 - 2026 Drayko. All rights reserved.</p>
                    </section>

                    <div className="prose prose-invert max-w-none space-y-8 font-medium text-muted-foreground leading-relaxed">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">1. Purpose</h2>
                            <p>
                                This document defines the terms and conditions for the use of the source code, assets, and all elements constituting this project (hereinafter referred to as the "Project").
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">2. Intellectual Property</h2>
                            <p>
                                The Project is the exclusive property of Drayko. No ownership rights are transferred to the user under this document.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">3. Personal Use License</h2>
                            <p>
                                A non-exclusive, non-transferable, and revocable license is granted for strictly personal use. This license allows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Using the Project for a personal portfolio</li>
                                <li>Hosting the Project for personal purposes</li>
                                <li>Modifying the source code for individual use</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">4. Mandatory Conditions</h2>
                            <p>
                                For any personal use of the Project, the following conditions must be strictly respected:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    The following copyright notice must be preserved, visible, and unchanged in the footer of all pages:
                                    <span className="block mt-2 font-bold text-foreground">© 2025 - 2026 Drayko. All rights reserved.</span>
                                </li>
                                <li>
                                    This requirement applies regardless of any modification of the developer name (manual or automated) or any partial modification of the Project.
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">5. Exception — Substantial Modifications</h2>
                            <p>
                                As an exception, the user is allowed to remove the copyright from the footer only if the Project has undergone substantial modifications, defined as modifying at least one thousand (1000) lines of code.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">6. Open Source Requirement for Modifications</h2>
                            <p>
                                If the Project is modified, regardless of the extent of the changes, the user must:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Publish the modified source code in a publicly accessible repository (e.g., on a Git-based platform)</li>
                                <li>Keep this repository publicly accessible for as long as the modified Project is used or distributed</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">7. Prohibited Uses</h2>
                            <p>
                                The following are strictly prohibited:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    Any commercial use of the Project, directly or indirectly, including but not limited to selling the Project, integrating it into a paid product or service, or any form of profit-driven use.
                                </li>
                                <li>Removing the copyright without complying with the conditions set in Section 5.</li>
                                <li>Redistributing the Project in a way that suggests it is entirely your own work without substantial modifications.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">8. Disclaimer of Warranty</h2>
                            <p>
                                The Project is provided "as is", without warranty of any kind, express or implied.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">9. Limitation of Liability</h2>
                            <p>
                                In no event shall the author be held liable for any direct or indirect damages resulting from the use of the Project.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">10. Acceptance</h2>
                            <p>
                                Any use of the Project implies full acceptance of these terms and conditions.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}
