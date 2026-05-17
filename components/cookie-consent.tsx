"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Cookie, X } from "lucide-react"

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if user has already consented
        const hasConsented = localStorage.getItem("cookieConsent")
        if (!hasConsented) {
            // Slight delay to not overwhelm on initial load
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted")
        setIsVisible(false)
        // If we need to trigger AdSense initialization or other cookie-dependent logic, do it here
        if (typeof window !== "undefined" && (window as any).adsbygoogle) {
            (window as any).adsbygoogle.requestNonPersonalizedAds = 0;
        }
    }

    const handleDecline = () => {
        localStorage.setItem("cookieConsent", "declined")
        setIsVisible(false)
        // Set AdSense to non-personalized if declined
        if (typeof window !== "undefined" && (window as any).adsbygoogle) {
            (window as any).adsbygoogle.requestNonPersonalizedAds = 1;
        }
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-auto md:max-w-sm z-[100] animate-in slide-in-from-bottom-5 duration-500 fade-in">
            <div className="glass p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                {/* Background effects */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 opacity-50" />
                
                <button 
                    onClick={handleDecline}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close cookie banner"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
                        <Cookie className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">We value your privacy</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We use cookies to enhance your browsing experience and serve personalized ads. By clicking "Accept All", you consent to our use of cookies.
                            Read our <Link href="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link> to learn more.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleDecline}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 font-medium text-sm hover:bg-white/5 transition-colors"
                    >
                        Decline
                    </button>
                    <button 
                        onClick={handleAccept}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)]"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    )
}
