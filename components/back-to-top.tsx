"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export function BackToTop() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400)
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`fixed bottom-8 right-8 z-50 p-4 rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 border border-white/10 backdrop-blur-xl transition-all duration-500 ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90 pointer-events-none"}`}
            aria-label="Back to top"
        >
            <ArrowUp className="h-5 w-5" />
        </button>
    )
}
