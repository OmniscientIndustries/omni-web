import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCard, NewsMeta } from "@/components/news/NewsCard";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { getArticle, getRelated, news, type ArticleBlock } from "@/content/news";
import { site } from "@/content/site";
import { jsonLd, pageMetadata, siteUrl } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return news.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.summary,
    path: `/news/${article.slug}`,
    image: article.image,
    type: "article",
    noindex: article.status === "draft",
    publishedTime: article.status === "published" ? article.date : undefined,
  });
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="text-heading mt-14 text-[1.625rem] text-bone sm:text-[1.875rem]">{block.text}</h2>;
    case "list":
      return (
        <ul className="mt-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-4 text-[1.0625rem] leading-relaxed text-stone">
              <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-gold" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="text-heading my-12 border-l border-gold pl-6 text-[1.5rem] leading-snug text-bone sm:text-[1.75rem]">
          {block.text}
        </blockquote>
      );
    default:
      return <p className="mt-6 text-[1.0625rem] leading-[1.75] text-stone sm:text-[1.125rem]">{block.text}</p>;
  }
}

export default async function ArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const related = getRelated(article.slug, 2);

  return (
    <article aria-labelledby="article-title">
      {article.status === "published" ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.summary,
            datePublished: article.date,
            url: `${siteUrl}/news/${article.slug}`,
            ...(article.image ? { image: `${siteUrl}${article.image.src}` } : {}),
            publisher: { "@type": "Organization", name: site.name },
          })}
        />
      ) : null}

      <header className="pt-32 sm:pt-40">
        <div className="container-site">
          <Link
            href="/#news"
            className="group inline-flex min-h-11 items-center gap-2 font-mono text-[0.6875rem] tracking-[0.18em] text-stone uppercase transition-colors hover:text-gold-bright"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="size-4 transition-transform group-hover:-translate-x-0.5">
              <path d="M14 8H3M7 4 3 8l4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All news &amp; insights
          </Link>
          <div className="mt-10 max-w-[52rem]">
            <NewsMeta article={article} />
            <h1 id="article-title" className="text-display mt-6 text-[clamp(2.25rem,5vw,4.25rem)] text-bone">
              {article.title}
            </h1>
            <p className="mt-6 max-w-[40rem] text-[1.125rem] leading-relaxed text-stone sm:text-[1.25rem]">{article.summary}</p>
            <p className="mt-6 font-mono text-[0.6875rem] tracking-[0.16em] text-stone-dim uppercase">
              {article.readingMinutes} min read · {site.name}
            </p>
          </div>
        </div>
        <div className="container-site mt-12 sm:mt-16">
          <MediaFrame
            image={article.image}
            procedural={article.procedural}
            uid={`article-${article.slug}`}
            preload
            sizes="93vw"
            className="aspect-[16/9] rounded-[20px] border border-line sm:aspect-[21/9]"
          />
          {article.image ? (
            <p className="mt-3 font-mono text-[0.625rem] tracking-[0.16em] text-stone-dim uppercase">Illustrative visualisation</p>
          ) : null}
        </div>
      </header>

      <div className="container-site py-16 sm:py-24">
        <div className="mx-auto max-w-[42rem]">
          {article.status === "draft" ? (
            <aside className="mb-10 rounded-xl border border-line-strong bg-gold/[0.04] p-5 text-[0.9375rem] leading-relaxed text-stone">
              <span className="system-label mb-1 block text-gold">Draft perspective</span>
              This is an editorial perspective prepared for review. It describes our thinking and approach, not a product
              announcement or a deployment.
            </aside>
          ) : null}
          {article.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </div>

      {related.length ? (
        <section aria-labelledby="related-title" className="border-t border-line py-20 sm:py-28">
          <div className="container-site">
            <h2 id="related-title" className="eyebrow">Related</h2>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              {related.map((r) => (
                <NewsCard key={r.slug} article={r} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
