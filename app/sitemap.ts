import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://drayko.xyz"
  const lastModified = new Date()

  const routes = [
    "",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/journey",
    "/tags-info",
    "/copyright",
    "/update"
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }))
}
