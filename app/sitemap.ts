import type { MetadataRoute } from "next";
import { news } from "@/content/news";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/industries", "/industries/rail", "/industries/public-security", "/mission", "/about", "/contact"];
  return [
    ...routes.map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...news
      .filter((a) => a.status === "published")
      .map((a) => ({ url: `${siteUrl}/news/${a.slug}`, lastModified: a.date, priority: 0.5 })),
  ];
}
