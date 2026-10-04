import type { Metadata } from "next";
import { site } from "@/content/site";

export const siteUrl = site.url ?? "http://localhost:3000";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: { src: string; alt: string; width: number; height: number };
  type?: "website" | "article";
  noindex?: boolean;
  publishedTime?: string;
};

/** Per-route metadata. Canonicals are only emitted when the real domain is configured. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noindex,
  publishedTime,
}: PageMeta): Metadata {
  const images = image ? [{ url: image.src, alt: image.alt, width: image.width, height: image.height }] : undefined;
  return {
    title,
    description,
    alternates: site.url ? { canonical: path } : undefined,
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      type,
      locale: "en_GB",
      ...(images ? { images } : {}),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}

export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
