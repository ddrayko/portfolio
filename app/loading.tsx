export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background" role="status" aria-live="polite">
            <div className="text-center space-y-8 reveal-up">
                <div className="relative inline-flex">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-primary/10"></div>
                </div>
                <div className="space-y-2">
                    <p className="text-muted-foreground text-lg font-medium">Loading experience</p>
                    <div className="flex justify-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                </div>
            </div>
        </div>
    )
}