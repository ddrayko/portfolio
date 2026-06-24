import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/maintenance"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || "https://drayko.xyz"}/sitemap.xml`,
  }
}
