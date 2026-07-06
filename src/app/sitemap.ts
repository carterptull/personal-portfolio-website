import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, priority: 1 },
    { url: `${SITE_URL}/about`, lastModified, priority: 0.9 },
    { url: `${SITE_URL}/projects`, lastModified, priority: 0.9 },
    ...projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      lastModified,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/contact`, lastModified, priority: 0.7 },
  ];
}
