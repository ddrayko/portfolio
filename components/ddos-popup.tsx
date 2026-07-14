"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function DdosPopup() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === "/admin" || pathname.startsWith("/admin/")) return

    const OVERLAY_ID = "ddos-incident-overlay"

    const buildOverlay = (): HTMLElement => {
      const overlay = document.createElement("div")
      overlay.id = OVERLAY_ID
      overlay.setAttribute("data-anti-remove", "true")
      overlay.style.cssText = [
        "position:fixed",
        "inset:0",
        "z-index:2147483647",
        "display:flex",
        "align-items:center",
        "justify-content:center",
        "padding:1.5rem",
        "background:rgba(5,8,12,0.45)",
        "backdrop-filter:blur(18px)",
        "-webkit-backdrop-filter:blur(14px)",
        "font-family:var(--font-sans, ui-sans-serif, system-ui, sans-serif)",
        "overflow:auto",
      ].join(";")

      overlay.innerHTML = `
        <div style="
          position:relative;
          width:100%;
          max-width:34rem;
          background:#ffffff;
          border:1px solid rgba(0,0,0,0.06);
          border-radius:1.75rem;
          padding:2rem;
          box-shadow:0 30px 80px rgba(0,0,0,0.5);
          color:#1f2937;
          text-align:center;
        ">
          <div style="
            display:inline-flex;
            align-items:center;
            justify-content:center;
            width:3.5rem;
            height:3.5rem;
            margin-bottom:1.25rem;
            border-radius:1rem;
            background:rgba(239,68,68,0.12);
            color:#dc2626;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/>
              <path d="M12 17h.01"/>
            </svg>
          </div>

          <p style="
            font-size:0.7rem;
            font-weight:700;
            letter-spacing:0.15em;
            text-transform:uppercase;
            color:#dc2626;
            margin-bottom:0.5rem;
          ">Service interruption</p>

          <h2 style="
            font-size:1.5rem;
            font-weight:800;
            line-height:1.2;
            margin:0 0 1rem;
            color:#111827;
          ">Server disk destroyed by a DDoS attack</h2>

          <div style="
            text-align:left;
            font-size:0.9rem;
            line-height:1.6;
            color:#4b5563;
            display:flex;
            flex-direction:column;
            gap:0.75rem;
          ">
            <p>After a sustained <strong style="color:#111827">DDoS attack</strong>, my web server's disk was permanently destroyed. I've since received a replacement, but I'm currently reinstalling and reconfiguring everything from scratch.</p>
            <p>Rebuilding the entire database is a long and careful process — it takes time. I'm also actively <strong style="color:#111827">investigating the security incident</strong> to harden the infrastructure so this never happens again.</p>
            <p>Thanks for your patience. Normal service will return as soon as possible.</p>
          </div>

          <div style="
            margin-top:1.5rem;
            padding-top:1.25rem;
            border-top:1px solid rgba(0,0,0,0.08);
            font-size:0.7rem;
            letter-spacing:0.1em;
            text-transform:uppercase;
            color:#9ca3af;
          ">— Drayko</div>
        </div>
      `
      return overlay
    }

    const OVERLAY_STYLES: Partial<CSSStyleDeclaration> = {
      display: "flex",
      visibility: "visible",
      opacity: "1",
      pointerEvents: "auto",
      position: "fixed",
      zIndex: "2147483647",
    }

    const ensureOverlay = () => {
      let overlay = document.getElementById(OVERLAY_ID) as HTMLElement | null

      if (!overlay) {
        overlay = buildOverlay()
        document.body.appendChild(overlay)
      } else if (overlay.parentNode !== document.body) {
        // Re-attached elsewhere (e.g. dragged out of body): put it back.
        document.body.appendChild(overlay)
      }

      // Counter any inline-style tampering (display:none, visibility, etc.).
      for (const [prop, value] of Object.entries(OVERLAY_STYLES)) {
        overlay.style[prop as any] = value as string
      }
    }

    ensureOverlay()

    // 1. React to DOM mutations (covers deletion via inspector).
    const observer = new MutationObserver(() => ensureOverlay())
    observer.observe(document.body, { childList: true, subtree: true })

    // 2. React specifically to our node being removed.
    const onNodeRemoved = (e: Event) => {
      const target = e.target as HTMLElement | null
      if (target && target.id === OVERLAY_ID) {
        requestAnimationFrame(ensureOverlay)
      }
    }
    document.addEventListener("DOMNodeRemoved", onNodeRemoved, true)

    // 3. Continuous re-insertion loop (~every frame) — strongest guarantee.
    let rafId = 0
    const loop = () => {
      ensureOverlay()
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    // 4. Interval backup in case rAF is throttled (e.g. background tab).
    const interval = window.setInterval(ensureOverlay, 250)

    // Prevent any shortcut from closing it.
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }
    window.addEventListener("keydown", onKeyDown, true)

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      document.removeEventListener("DOMNodeRemoved", onNodeRemoved, true)
      window.clearInterval(interval)
      window.removeEventListener("keydown", onKeyDown, true)
      const existing = document.getElementById(OVERLAY_ID)
      if (existing) existing.remove()
    }
  }, [pathname])

  return null
}
