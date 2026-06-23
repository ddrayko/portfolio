"use client"

import Link from "next/link"
import { Command, Github, Gitlab, MessageSquare, Code2 } from "lucide-react"
import { ScrollButton } from "@/components/scroll-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"

export function Footer() {
    const currentYear = new Date().getFullYear()
    const pathname = usePathname()
    const isHomePage = pathname === "/"
    const isMaintenancePage = pathname === "/maintenance"

    if (isMaintenancePage) return null

    return (
        <footer className="py-20 border-t border-white/5 bg-background relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                                <Command className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Drayko</span>
                        </div>
                        <p className="text-muted-foreground font-medium max-w-xs">
                            Crafting high-quality digital products with focus on modern aesthetics and performance.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 col-span-2">
                        <div className="space-y-4">
                            <h5 className="font-bold text-sm uppercase tracking-widest text-primary">Explore</h5>
                            <ul className="space-y-3 text-muted-foreground font-medium" aria-label="Explore navigation">
                                <li className="transition-transform hover:translate-x-1">
                                    {isHomePage ? (
                                        <ScrollButton targetId="projects" variant="link" className="p-0 h-auto text-base text-muted-foreground hover:text-foreground hover:no-underline underline-offset-0" aria-label="Scroll to projects section">Projects</ScrollButton>
                                    ) : (
                                        <Link href="/#projects" className="hover:text-foreground" aria-label="View projects">Projects</Link>
                                    )}
                                </li>
                                <li className="transition-transform hover:translate-x-1">
                                    {isHomePage ? (
                                        <ScrollButton targetId="tech-stack" variant="link" className="p-0 h-auto text-base text-muted-foreground hover:text-foreground hover:no-underline underline-offset-0" aria-label="Scroll to tech stack section">Tech Stack</ScrollButton>
                                    ) : (
                                        <Link href="/#tech-stack" className="hover:text-foreground" aria-label="View tech stack">Tech Stack</Link>
                                    )}
                                </li>
                                <li className="transition-transform hover:translate-x-1"><Link href="/tags-info" className="hover:text-foreground" aria-label="Learn about project tags">Tags Info</Link></li>
                                <li className="transition-transform hover:translate-x-1"><Link href="/about" className="hover:text-foreground" aria-label="About Drayko">About Me</Link></li>
                                <li className="transition-transform hover:translate-x-1"><Link href="/journey" className="hover:text-foreground" aria-label="View professional journey">Journey</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h5 className="font-bold text-sm uppercase tracking-widest text-primary">Social</h5>
                            <ul className="space-y-3 text-muted-foreground font-medium" aria-label="Social links">
                                <li>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="text-muted-foreground/40 transition-all inline-flex items-center gap-2 grayscale cursor-default">
                                                <Github className="h-4 w-4" aria-hidden="true" />
                                                <span className="line-through">GitHub</span>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="max-w-xs text-center">
                                            <p>Account migrated to <strong>Codeberg</strong> — new direction, away from Microsoft's AI policies.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </li>
                                <li className="transition-transform hover:translate-x-1"><Link href="https://codeberg.org/ddrayko" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-all flex items-center gap-2" aria-label="Codeberg profile"><Code2 className="h-4 w-4" aria-hidden="true" /> Codeberg</Link></li>
                                <li className="transition-transform hover:translate-x-1"><Link href="https://gitlab.com/drayko_dev" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-all flex items-center gap-2" aria-label="GitLab profile"><Gitlab className="h-4 w-4" aria-hidden="true" /> GitLab</Link></li>
                                <li className="transition-transform hover:translate-x-1"><Link href="/contact" className="hover:text-foreground transition-all flex items-center gap-2" aria-label="Contact page"><MessageSquare className="h-4 w-4" aria-hidden="true" /> Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-muted-foreground font-medium gap-4">
                    <p>&copy; 2025 - {currentYear} Drayko. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                        <Link href="/copyright" className="hover:text-foreground transition-colors">Copyright</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
