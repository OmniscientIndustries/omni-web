import type { MetadataRoute } from "next";
import { publishedNews } from "@/content/news";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/news",
    "/industries",
    "/industries/rail",
    "/industries/public-security",
    "/products/safezone-rail",
    "/support/safezone-rail",
    "/privacy/safezone-rail",
    "/mission",
    "/about",
    "/contact",
  ];
  return [
    ...routes.map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...publishedNews.map((article) => ({ url: `${siteUrl}/news/${article.slug}`, priority: 0.5 })),
  ];
}
