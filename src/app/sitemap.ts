import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

const routes = [
  "/",
  "/about",
  "/docs",
  "/getting-started",
  "/installation",
  "/policies",
  "/security",
  "/usage",
];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) {
    // Return empty sitemap when no production domain is configured
    return [];
  }
  const base = siteUrl.replace(/\/+$/, "");
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1.0 : 0.8,
  }));
}
