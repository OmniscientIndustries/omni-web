import { NewsCard } from "@/components/news/NewsCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sortedNews } from "@/content/news";

export function NewsSection() {
  const [featured, ...rest] = sortedNews;
  const secondary = rest.slice(0, 2);

  return (
    <section id="news" aria-labelledby="news-title" className="relative scroll-mt-16 border-t border-line bg-ink-900 py-24 sm:py-32 lg:py-40">
      <div className="container-site">
        <SectionHeading
          id="news-title"
          eyebrow="News & Insights"
          title="Research, systems and progress from Omniscient."
          intro="Perspectives from our work on operational intelligence. Entries marked as draft perspectives are editorial pieces awaiting final review."
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <NewsCard article={featured} featured />
          </Reveal>
          <ul className="grid gap-12 lg:col-span-5 lg:gap-10">
            {secondary.map((article, i) => (
              <Reveal as="li" key={article.slug} delay={0.08 * (i + 1)}>
                <NewsCard article={article} />
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
