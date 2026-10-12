import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCard, NewsMeta } from "@/components/news/NewsCard";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { getPublicArticle, getRelated, publishedNews, readingMinutes, type ArticleBlock } from "@/content/news";
import { site } from "@/content/site";
import { jsonLd, pageMetadata, siteUrl } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedNews.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getPublicArticle(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.standfirst,
    path: `/news/${article.slug}`,
    image: article.image,
    type: "article",
    publishedTime: "2026-10",
  });
}

function Block({ block }: { block: ArticleBlock }) {
  return <p className="mt-6 text-[1.0625rem] leading-[1.75] text-stone sm:text-[1.125rem]">{block.text}</p>;
}

export default async function ArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const article = getPublicArticle(slug);
  if (!article) notFound();
  const related = getRelated(article.slug, 2);
  const minutes = readingMinutes(article);

  return (
    <article aria-labelledby="article-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: article.title,
          description: article.standfirst,
          datePublished: "2026-10",
          url: `${siteUrl}/news/${article.slug}`,
          image: `${siteUrl}${article.image.src}`,
          publisher: { "@type": "Organization", name: site.name },
        })}
      />

      <header className="pt-32 sm:pt-40">
        <div className="container-site">
          <Link
            href="/news"
            className="group inline-flex min-h-11 items-center gap-2 font-mono text-[0.6875rem] tracking-[0.18em] text-stone uppercase transition-colors hover:text-gold-bright"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="size-4 transition-transform group-hover:-translate-x-0.5">
              <path d="M14 8H3M7 4 3 8l4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            News and insights
          </Link>
          <div className="mt-10 max-w-[52rem]">
            <NewsMeta article={article} />
            <h1 id="article-title" className="text-display mt-6 text-[clamp(1.85rem,5vw,4.25rem)] text-bone">
              {article.title}
            </h1>
            <p className="mt-6 max-w-[40rem] text-[1.125rem] leading-relaxed text-stone sm:text-[1.25rem]">{article.standfirst}</p>
            <p className="mt-6 font-mono text-[0.6875rem] tracking-[0.16em] text-stone-dim uppercase">
              {minutes} min read · {site.name}
            </p>
          </div>
        </div>
        <div className="container-site mt-12 sm:mt-16">
          <figure>
            <MediaFrame
              image={article.image}
              uid={`article-${article.slug}`}
              preload
              sizes="93vw"
              className="aspect-[1672/941] rounded-[20px] border border-line"
            />
            <figcaption className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-stone">{article.image.caption}</figcaption>
          </figure>
        </div>
      </header>

      <div className="container-site py-16 sm:py-24">
        <div className="mx-auto max-w-[42rem]">
          {article.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </div>

      {related.length ? (
        <section aria-labelledby="related-title" className="border-t border-line py-20 sm:py-28">
          <div className="container-site">
            <h2 id="related-title" className="eyebrow">
              Related
            </h2>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              {related.map((item) => (
                <NewsCard key={item.slug} article={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
