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
import { headers } from "next/headers"

import { BackToTop } from "@/components/back-to-top"
import { ConsoleEasterEgg } from "@/components/console-easter-egg"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerList = await headers()
  const pathname = headerList.get("x-pathname") || headerList.get("next-url") || ""
  const isAdmin = pathname.startsWith("/admin")

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} light`}>
      <head>
        <link rel="dns-prefetch" href="https://img.drayko.xyz" />
        <link rel="preconnect" href="https://img.drayko.xyz" />
      </head>
      <body className="font-sans antialiased selection:bg-primary/30 selection:text-primary transition-colors duration-300 scroll-smooth" suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-4 focus:bg-primary focus:text-primary-foreground focus:rounded-2xl focus:font-bold focus:shadow-2xl focus:outline-none">
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Drayko",
              "url": "https://drayko.xyz",
              "jobTitle": "Creative Developer & Designer",
              "sameAs": [
                "https://github.com/ddrayko",
                "https://gitlab.com/drayko_dev"
              ]
            })
          }}
        />
        <div className="relative flex min-h-screen flex-col">
          <Suspense fallback={null}>
            <main id="main-content" className="flex-1">{children}</main>
          </Suspense>
          {!isAdmin && <Footer />}
        </div>
        <BackToTop />
        <ConsoleEasterEgg />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
