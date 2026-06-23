import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Outfit } from "next/font/google"
import { Footer } from "@/components/footer"

import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" })

export const viewport: Viewport = {
  themeColor: "#05080C",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://drayko.xyz"),
  title: {
    default: "Drayko - Creative Developer & Designer",
    template: "%s | Drayko",
  },
  description:
    "Portfolio of Drayko, a Creative Developer & Designer specializing in high-performance web applications, UI/UX design, and digital experiences.",
  keywords: [
    "creative developer",
    "web developer",
    "UI/UX designer",
    "full-stack developer",
    "portfolio",
    "frontend developer",
    "Next.js developer",
    "React developer",
    "TypeScript",
    "web design",
    "digital experiences",
    "Drayko",
    "web development portfolio",
    "creative coding",
    "high-performance web",
    "freelance developer",
  ],
  authors: [{ name: "Drayko" }],
  creator: "Drayko",
  icons: {
    icon: "/assets/logo/fav.png",
    apple: "/assets/logo/fav.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://drayko.xyz",
    siteName: "Drayko Portfolio",
    title: "Drayko - Creative Developer & Designer",
    description:
      "Portfolio of Drayko, a Creative Developer & Designer specializing in high-performance web applications and digital experiences.",
    images: [
      {
        url: "/assets/logo/fav.png",
        width: 1200,
        height: 630,
        alt: "Drayko Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drayko - Creative Developer & Designer",
    description:
      "Portfolio of Drayko, a Creative Developer & Designer specializing in high-performance web applications and digital experiences.",
    images: ["/assets/logo/fav.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

import { Suspense } from "react"
import { Toaster } from "sonner"

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
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}