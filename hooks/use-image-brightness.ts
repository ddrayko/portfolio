'use client'

import { useState, useCallback } from 'react'

function getThemeDefault(): boolean {
  if (typeof document === 'undefined') return true
  const isDarkClass = document.documentElement.classList.contains('dark')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return isDarkClass || prefersDark
}

function analyzeBrightness(img: HTMLImageElement): boolean {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return getThemeDefault()

    const sw = Math.floor(img.naturalWidth * 0.58)
    const sh = img.naturalHeight
    if (sw < 2 || sh < 2) return getThemeDefault()

    canvas.width = sw
    canvas.height = sh
    ctx.drawImage(img, 0, 0, sw, sh, 0, 0, sw, sh)

    const { data } = ctx.getImageData(0, 0, sw, sh)
    let total = 0
    for (let i = 0; i < data.length; i += 4) {
      total += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    }
    return total / (data.length / 4) > 128
  } catch {
    return getThemeDefault()
  }
}

export function useImageBrightness() {
  const [isDarkBg, setIsDarkBg] = useState(getThemeDefault)

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    if (img.src.startsWith('data:image/gif;base64')) return
    setIsDarkBg(!analyzeBrightness(img))
  }, [])

  return { isDarkBg, onImageLoad }
}
