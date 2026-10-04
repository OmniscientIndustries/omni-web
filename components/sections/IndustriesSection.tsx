import { IndustryCard } from "@/components/industries/IndustryCard";
import { IndustryFeatureCard } from "@/components/industries/IndustryFeatureCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { expansionIndustries, getIndustry } from "@/content/industries";

export function IndustriesSection() {
  const rail = getIndustry("rail");
  const security = getIndustry("public-security");

  return (
    <section aria-labelledby="industries-title" className="relative py-24 sm:py-32 lg:py-40">
      <div className="container-site">
        <SectionHeading
          id="industries-title"
          eyebrow="Industries"
          title="One intelligence foundation. Multiple operating environments."
          intro="Omniscient begins with Rail and Public Security, applying the same operational-intelligence foundation to increasingly complex physical systems."
        />

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-12 lg:gap-6">
          <Reveal as="li" className="flex lg:col-span-7">
            <IndustryFeatureCard
              industry={rail}
              index={1}
              subtitle="Live operational intelligence for safer, more resilient railways."
              sizes="(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw"
              className="w-full"
            />
          </Reveal>
          <Reveal as="li" className="flex lg:col-span-5" delay={0.08}>
            <IndustryFeatureCard
              industry={security}
              index={2}
              subtitle={security.summary}
              sizes="(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw"
              className="w-full"
            />
          </Reveal>

          {expansionIndustries.map((industry, i) => (
            <Reveal as="li" key={industry.slug} className="flex lg:col-span-3" delay={0.04 * i}>
              <div className="w-full">
                <IndustryCard industry={industry} index={i + 3} />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
