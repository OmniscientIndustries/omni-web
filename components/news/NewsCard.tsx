import Link from "next/link";
import { Arrow } from "@/components/ui/GoldButton";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { formatDate, type NewsArticle } from "@/content/news";

type Props = {
  article: NewsArticle;
  featured?: boolean;
  headingLevel?: "h3" | "h2";
};

export function NewsMeta({ article }: { article: NewsArticle }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
      <span className="text-gold">{article.category}</span>
      <span aria-hidden className="text-stone-dim">/</span>
      <time dateTime={article.date} className="text-stone">
        {formatDate(article.date)}
      </time>
      {article.status === "draft" ? (
        <>
          <span aria-hidden className="text-stone-dim">/</span>
          <span className="text-stone-dim">Draft perspective</span>
        </>
      ) : null}
    </p>
  );
}

export function NewsCard({ article, featured = false, headingLevel: Heading = "h3" }: Props) {
  return (
    <article className="group relative flex h-full flex-col">
      <div className="overflow-hidden rounded-[18px] border border-line transition-colors duration-[var(--duration-standard)] group-hover:border-line-strong">
        <MediaFrame
          image={article.image}
          procedural={article.procedural}
          uid={`news-${article.slug}`}
          decorative
          sizes={featured ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 34vw, 100vw"}
          className={featured ? "aspect-[16/10]" : "aspect-[16/9]"}
          imageClassName="transition-transform duration-[1200ms] ease-[var(--ease-brand)] group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className={featured ? "mt-7" : "mt-5"}>
        <NewsMeta article={article} />
        <Heading
          className={`text-heading mt-4 text-bone transition-colors duration-[var(--duration-fast)] group-hover:text-gold-bright ${featured ? "max-w-[24ch] text-[clamp(1.6rem,2.6vw,2.25rem)]" : "text-[1.3125rem] leading-snug"}`}
        >
          <Link href={`/news/${article.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {article.title}
          </Link>
        </Heading>
        <p className={`mt-3 leading-relaxed text-stone ${featured ? "max-w-[58ch] text-[1.0625rem]" : "line-clamp-3 text-[0.9375rem]"}`}>
          {article.summary}
        </p>
        <p aria-hidden className="mt-5 flex items-center gap-2 text-[0.875rem] font-medium text-bone">
          Read more
          <Arrow />
        </p>
      </div>
      <span aria-hidden className="pointer-events-none absolute -inset-2 rounded-[22px] ring-2 ring-gold-bright opacity-0 group-has-[:focus-visible]:opacity-100" />
    </article>
  );
}
