import { useState, useEffect } from 'react'

type Brightness = 'light' | 'dark' | 'loading'

export function useImageBrightness(imageUrl: string | null): Brightness {
  const [brightness, setBrightness] = useState<Brightness>('loading')

  useEffect(() => {
    if (!imageUrl) {
      setBrightness('dark')
      return
    }

    let cancelled = false
    const img = new Image()

    img.onload = () => {
      if (cancelled) return
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) { setBrightness('dark'); return }

        const sw = Math.floor(img.naturalWidth * 0.58)
        const sh = img.naturalHeight
        if (sw === 0 || sh === 0) { setBrightness('dark'); return }

        canvas.width = sw
        canvas.height = sh
        ctx.drawImage(img, 0, 0, sw, sh, 0, 0, sw, sh)

        const { data } = ctx.getImageData(0, 0, sw, sh)
        let total = 0
        for (let i = 0; i < data.length; i += 4) {
          total += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        }
        setBrightness(total / (data.length / 4) > 128 ? 'light' : 'dark')
      } catch {
        setBrightness('dark')
      }
    }

    img.onerror = () => {
      if (!cancelled) setBrightness('dark')
    }

    try {
      const url = new URL(imageUrl, window.location.origin)
      if (url.origin !== window.location.origin) {
        img.src = `/api/img-proxy?url=${encodeURIComponent(imageUrl)}`
      } else {
        img.src = imageUrl
      }
    } catch {
      img.src = `/api/img-proxy?url=${encodeURIComponent(imageUrl)}`
    }

    return () => { cancelled = true }
  }, [imageUrl])

  return brightness
}
