import Link from "next/link";
import { NewsCard } from "@/components/news/NewsCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { publishedNews } from "@/content/news";

export function NewsSection() {
  const [featured, ...rest] = publishedNews;
  if (!featured) return null;
  const secondary = rest.slice(0, 2);

  return (
    <section id="news" aria-labelledby="news-title" className="relative scroll-mt-16 border-t border-line bg-ink-900 py-24 sm:py-32 lg:py-40">
      <div className="container-site">
        <SectionHeading
          id="news-title"
          eyebrow="News & Insights"
          title="News and insights from Omniscient Industries."
          intro="Company, product and engineering updates. The full set of published articles is on the news page."
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <NewsCard article={featured} featured />
          </Reveal>
          <ul className="grid content-start gap-12 lg:col-span-5 lg:gap-10">
            {secondary.map((article, i) => (
              <Reveal as="li" key={article.slug} delay={0.08 * (i + 1)}>
                <NewsCard article={article} />
              </Reveal>
            ))}
          </ul>
        </div>

        <p className="mt-12">
          <Link
            href="/news"
            className="inline-flex min-h-11 items-center font-mono text-[0.6875rem] tracking-[0.18em] text-gold uppercase transition-colors hover:text-gold-bright"
          >
            All news and insights
          </Link>
        </p>
      </div>
    </section>
  );
}
