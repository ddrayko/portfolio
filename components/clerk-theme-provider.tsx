"use client"

import { ClerkProvider } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export function ClerkThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#2563eb',
          colorBackground: '#ffffff',
          colorInputBackground: '#f8fafc',
          colorInputText: '#0f172a',
          colorText: '#0f172a',
        }
      }}
    >
      {children}
    </ClerkProvider>
  )
}