"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ScrollButtonProps {
  targetId: string
  children: React.ReactNode
  variant?: React.ComponentProps<typeof Button>["variant"]
  size?: React.ComponentProps<typeof Button>["size"]
  className?: string
}

export function ScrollButton({
  targetId,
  children,
  variant = "outline",
  size = "lg",
  className
}: ScrollButtonProps) {
  const handleScroll = () => {
    if (typeof window === "undefined") return
    const element = document.getElementById(targetId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <Button 
      size={size} 
      variant={variant} 
      className={cn("cursor-pointer select-text", className)} 
      onClick={handleScroll}
    >
      {children}
    </Button>
  )
}

