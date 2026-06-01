"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Save, ChevronDown, Globe, Route } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { getSiteUpdateData, updateSiteUpdateData } from "@/lib/actions"
import { toast } from "sonner"

interface BadgeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

const linkOptions = [
    { value: "update", label: "Update page (/update)", icon: Route },
    { value: "custom", label: "Custom URL", icon: Globe },
] as const

export function BadgeDialog({ open, onOpenChange, onSuccess }: BadgeDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [text, setText] = useState("")
    const [showPrefix, setShowPrefix] = useState(true)
    const [linkType, setLinkType] = useState("update")
    const [customUrl, setCustomUrl] = useState("")
    const [selectOpen, setSelectOpen] = useState(false)
    const selectRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (open) {
            fetchData()
        }
    }, [open])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
                setSelectOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const fetchData = async () => {
        const result = await getSiteUpdateData()
        if (result.success && result.data) {
            setText(result.data.latest_update_text || "")
            setShowPrefix(result.data.show_last_update_prefix ?? true)
            setLinkType(result.data.hero_link_type || "update")
            setCustomUrl(result.data.hero_custom_url || "")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await updateSiteUpdateData({
                latest_update_text: text,
                show_last_update_prefix: showPrefix,
                hero_link_type: linkType,
                hero_custom_url: linkType === "custom" ? customUrl : "",
            })

            if (result.success) {
                toast.success("Hero badge updated successfully")
                onSuccess?.()
                onOpenChange(false)
            } else {
                toast.error(result.error || "Failed to update badge")
            }
        } catch (error) {
            console.error("Error saving badge:", error)
            toast.error("Failed to update badge")
        } finally {
            setIsLoading(false)
        }
    }

    const selectedOption = linkOptions.find(o => o.value === linkType) || linkOptions[0]
    const SelectedIcon = selectedOption.icon

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl w-[95vw] p-0 overflow-hidden bg-background border-border/80 rounded-[2.5rem] shadow-2xl flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                    <div className="p-10 space-y-8">
                        <DialogHeader className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                                    <Sparkles className="h-8 w-8" />
                                </div>
                                <div className="space-y-1 text-left">
                                    <DialogTitle className="text-3xl font-black tracking-tight font-display text-gradient uppercase">Hero Communication</DialogTitle>
                                    <DialogDescription className="text-foreground/70 font-medium">
                                        Update the headline that appears in the landing page badge.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div className="p-8 rounded-[2rem] bg-muted/40 border border-border/80 space-y-4">
                                <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-primary/70 ml-1">Badge Headline Content</Label>
                                <Input
                                    placeholder="e.g. New interface v3 is out! 🚀"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="rounded-2xl border-border/80 bg-background h-16 text-xl font-bold px-6 focus:ring-primary shadow-inner"
                                />
                                <div className="flex items-start gap-3 px-2 pt-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                                        Visible on the homepage hero section. Keep it short and impactful for better engagement.
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 rounded-[2rem] bg-muted/40 border border-border/80 flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-primary/70 ml-1">Prefix Visibility</Label>
                                    <p className="text-sm font-bold text-foreground">Show "Last update :" prefix</p>
                                    <p className="text-xs text-muted-foreground italic">Toggle the visibility of the "Last update :" text before your message.</p>
                                </div>
                                <Switch
                                    checked={showPrefix}
                                    onCheckedChange={setShowPrefix}
                                />
                            </div>

                            <div className="p-8 rounded-[2rem] bg-muted/40 border border-border/80 space-y-4">
                                <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-primary/70 ml-1">Badge Link Destination</Label>
                                <p className="text-xs text-muted-foreground italic -mt-2 mb-2">
                                    Choose where the badge links to when clicked.
                                </p>

                                <div ref={selectRef} className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setSelectOpen(!selectOpen)}
                                        className="w-full flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-background h-14 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                                <SelectedIcon className="h-4 w-4" />
                                            </div>
                                            <span>{selectedOption.label}</span>
                                        </div>
                                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${selectOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {selectOpen && (
                                        <div className="absolute z-50 top-full mt-2 left-0 right-0 rounded-2xl border border-border/80 bg-background shadow-2xl shadow-black/20 overflow-hidden">
                                            {linkOptions.map((option) => {
                                                const OptionIcon = option.icon
                                                return (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => {
                                                            setLinkType(option.value)
                                                            setSelectOpen(false)
                                                        }}
                                                        className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-left transition-all hover:bg-muted/50 ${linkType === option.value ? "bg-primary/5 text-primary" : "text-foreground"}`}
                                                    >
                                                        <div className={`p-2 rounded-xl ${linkType === option.value ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"}`}>
                                                            <OptionIcon className="h-4 w-4" />
                                                        </div>
                                                        <span>{option.label}</span>
                                                        {linkType === option.value && (
                                                            <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>

                                {linkType === "custom" && (
                                    <div className="pt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                        <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-primary/70 ml-1">Custom URL</Label>
                                        <Input
                                            placeholder="e.g. https://example.com/page"
                                            value={customUrl}
                                            onChange={(e) => setCustomUrl(e.target.value)}
                                            className="rounded-2xl border-border/80 bg-background h-12 text-sm px-5 focus:ring-primary shadow-inner"
                                        />
                                        <p className="text-xs text-muted-foreground italic px-2">
                                            Enter a full URL or relative path (e.g. /contact).
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-8 border-t border-border/80 bg-background/80 backdrop-blur-xl">
                        <div className="flex gap-4 w-full sm:w-auto ml-auto">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl h-12 px-6 font-bold text-muted-foreground hover:bg-white/5">
                                Discard
                            </Button>
                            <Button type="submit" disabled={isLoading} className="rounded-xl h-12 px-10 bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-black uppercase tracking-widest text-[10px]">
                                <Save className="mr-2 h-4 w-4" />
                                {isLoading ? "Updating..." : "Push Release"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
