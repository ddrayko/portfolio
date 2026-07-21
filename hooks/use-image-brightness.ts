'use client'

import { useState, useEffect } from 'react'

function getThemeDefault(): boolean {
  if (typeof document === 'undefined') return true
  const isDarkClass = document.documentElement.classList.contains('dark')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return isDarkClass || prefersDark
}

const cache = new Map<string, boolean>()
const pending = new Map<string, Promise<boolean>>()

function fetchBrightness(imageUrl: string): Promise<boolean> {
  const cached = cache.get(imageUrl)
  if (cached !== undefined) return Promise.resolve(cached)

  const inFlight = pending.get(imageUrl)
  if (inFlight) return inFlight

  const promise = fetch(`/api/brightness?url=${encodeURIComponent(imageUrl)}`)
    .then((res) => res.json())
    .then((data) => {
      const isDark = data.brightness === 'dark'
      cache.set(imageUrl, isDark)
      return isDark
    })
    .catch(() => {
      const fallback = getThemeDefault()
      cache.set(imageUrl, fallback)
      return fallback
    })
    .finally(() => {
      pending.delete(imageUrl)
    })

  pending.set(imageUrl, promise)
  return promise
}

export function useImageBrightness(imageUrl?: string | null) {
  const [isDarkBg, setIsDarkBg] = useState(getThemeDefault)

  useEffect(() => {
    if (!imageUrl) {
      setIsDarkBg(getThemeDefault())
      return
    }

    let cancelled = false

    fetchBrightness(imageUrl).then((result) => {
      if (!cancelled) setIsDarkBg(result)
    })

    return () => {
      cancelled = true
    }
  }, [imageUrl])

  return isDarkBg
}
