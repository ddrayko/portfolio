"use client"

import { Copy, Check } from "lucide-react"
import { useState, useRef } from "react"

export function CopyEmail({ email }: { email: string }) {
    const [copied, setCopied] = useState(false)
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

    const handleCopy = async () => {
        clearTimeout(timeoutRef.current)
        await navigator.clipboard.writeText(email)
        setCopied(true)
        timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 ml-4 text-sm font-bold text-muted-foreground hover:text-foreground transition-all px-4 py-2 rounded-xl glass border-white/10 hover:border-primary/50"
            aria-label="Copy email to clipboard"
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                    <span aria-live="polite">Copied!</span>
                </>
            ) : (
                <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    Copy
                </>
            )}
        </button>
    )
}
