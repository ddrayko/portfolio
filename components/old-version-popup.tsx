"use client"

import { useEffect, useState } from "react"
import { AlertCircle, ArrowRight, X } from "lucide-react"
import type { Version } from "@/lib/types"

interface OldVersionPopupProps {
  versions: Version[]
}

export function OldVersionPopup({ versions }: OldVersionPopupProps) {
  const [show, setShow] = useState(false)
  const [newerVersion, setNewerVersion] = useState<Version | null>(null)

  useEffect(() => {
    // Petit délai pour l'animation
    const timer = setTimeout(() => {
      const hostname = window.location.hostname
      
      // Ignorer le domaine principal ou local
      if (hostname === 'drayko.xyz' || hostname === 'www.drayko.xyz' || hostname === 'localhost' || hostname === '127.0.0.1') {
        return
      }

      // Trouver la version correspondant à l'environnement actuel
      const currentEnvVersion = versions.find(v => {
        try {
          const vUrl = new URL(v.link)
          return vUrl.hostname === hostname
        } catch {
          return false
        }
      })

      if (currentEnvVersion) {
        const currentCreatedAt = new Date(currentEnvVersion.created_at).getTime()
        
        // Chercher une version créée APRÈS la version actuelle
        // Les versions sont supposées être triées (on peut aussi forcer le tri ici)
        const sortedVersions = [...versions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        
        const latestVersion = sortedVersions.find(v => new Date(v.created_at).getTime() > currentCreatedAt)

        if (latestVersion) {
          setNewerVersion(latestVersion)
          setShow(true)
        }
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [versions])

  if (!show || !newerVersion) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-500 max-w-sm w-[calc(100%-3rem)]">
      <div className="relative glass p-5 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
        
        <button 
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"
        >
          <X className="h-3 w-3" />
        </button>

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">Ancienne version</h4>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Mise à jour disponible</p>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground leading-relaxed">
            Vous consultez actuellement une ancienne version du portfolio. La version <strong className="text-foreground">{newerVersion.name}</strong> est disponible.
          </p>

          <a 
            href={newerVersion.link}
            className="mt-2 inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98]"
          >
            Voir la nouvelle version
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
