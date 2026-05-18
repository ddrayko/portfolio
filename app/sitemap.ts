import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://drayko.xyz"
  const lastModified = new Date()

  const routes = [
    "",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/parcours",
    "/tags-info",
    "/copyright"
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }))
}
