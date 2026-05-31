import type React from "react"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import { Footer } from "@/components/footer"

import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" })

export const metadata: Metadata = {
  metadataBase: new URL("https://drayko.xyz"),
  title: "Drayko - Creative Developer",
  description: "Portfolio of Drayko, a Creative Developer & Designer specializing in high-performance digital experiences.",
  icons: {
    icon: "/fav.png",
    apple: "/fav.png",
  },
}

import { Suspense } from "react"

import { OldVersionPopup } from "@/components/old-version-popup"
import { BackToTop } from "@/components/back-to-top"
import { ConsoleEasterEgg } from "@/components/console-easter-egg"
import { getVersions } from "@/lib/actions"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const versionsResult = await getVersions()
  const versions = versionsResult.success ? versionsResult.data : []

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} light`}>
      <body className="font-sans antialiased selection:bg-primary/30 selection:text-primary transition-colors duration-300" suppressHydrationWarning>
        <div className="relative flex min-h-screen flex-col">
          <Suspense fallback={null}>
            <main className="flex-1">{children}</main>
          </Suspense>
          <Footer />
        </div>
        <BackToTop />
        <ConsoleEasterEgg />
        <OldVersionPopup versions={versions as any} />
      </body>
    </html>
  )
}