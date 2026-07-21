import { useState, useEffect } from 'react'

function getThemeDefault(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'dark'
  const isDarkClass = document.documentElement.classList.contains('dark')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return isDarkClass || prefersDark ? 'dark' : 'light'
}

export function useImageBrightness(imageUrl: string | null): 'light' | 'dark' {
  const [brightness, setBrightness] = useState<'light' | 'dark'>(getThemeDefault)

  useEffect(() => {
    if (!imageUrl) return

    let cancelled = false
    const proxyUrl = `/api/img-proxy?url=${encodeURIComponent(imageUrl)}`
    const img = new Image()

    img.onload = () => {
      if (cancelled) return
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const sw = Math.floor(img.naturalWidth * 0.58)
        const sh = img.naturalHeight
        if (sw < 2 || sh < 2) return

        canvas.width = sw
        canvas.height = sh
        ctx.drawImage(img, 0, 0, sw, sh, 0, 0, sw, sh)

        const { data } = ctx.getImageData(0, 0, sw, sh)
        let total = 0
        const len = data.length
        for (let i = 0; i < len; i += 4) {
          total += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        }
        const avg = total / (len / 4)
        if (!cancelled) setBrightness(avg > 128 ? 'light' : 'dark')
      } catch {
        // fallback: keep theme default
      }
    }

    img.onerror = () => {}

    img.src = proxyUrl

    return () => { cancelled = true }
  }, [imageUrl])

  return brightness
}
