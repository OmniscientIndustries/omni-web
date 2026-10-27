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
    "/support/safezone-rail",
    "/privacy/safezone-rail",
    "/mission",
    "/about",
    "/contact",
    "/legal/privacy-policy.pdf",
    "/legal/website-terms-of-use.pdf",
    "/legal/human-rights-and-ethical-use-policy.pdf",
    "/legal/vulnerability-disclosure-and-security-contact-policy.pdf",
    "/legal/environmental-and-sustainability-policy-statement.pdf",
    "/legal/equal-opportunity-and-accessibility-statement.pdf",
    "/legal/modern-slavery-and-human-trafficking-policy.docx",
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
