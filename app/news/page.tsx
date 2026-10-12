import type { Metadata } from "next";
import { NewsCard } from "@/components/news/NewsCard";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { publishedNews } from "@/content/news";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "News and insights",
  description: "News and insights from Omniscient Industries on rail, operational intelligence and community technology.",
  path: "/news",
  image: publishedNews[0]?.image,
});

export default function NewsPage() {
  const [featured, ...rest] = publishedNews;

  return (
    <>
      <PageHero
        eyebrow="News & Insights"
        title="News and insights."
        intro="Published updates from Omniscient Industries."
      />

      {featured ? (
        <section aria-label="Published articles" className="pb-24 sm:pb-32">
          <div className="container-site">
            <Reveal>
              <NewsCard article={featured} featured headingLevel="h2" preload />
            </Reveal>
            <ul className="mt-14 grid gap-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-10">
              {rest.map((article, i) => (
                <Reveal as="li" key={article.slug} delay={0.05 * (i + 1)} className="flex">
                  <NewsCard article={article} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
