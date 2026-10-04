import type { Metadata } from "next";
import Link from "next/link";
import { IndustryFeatureCard } from "@/components/industries/IndustryFeatureCard";
import { StatusBadge } from "@/components/industries/StatusBadge";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Arrow } from "@/components/ui/GoldButton";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { expansionDetail, expansionIndustries, expansionStatus, getIndustry } from "@/content/industries";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Industries",
  description:
    "Omniscient applies one operational-intelligence foundation to rail and public security first, then to construction, airports, farming and mining.",
  path: "/industries",
  image: {
    src: "/media/rail-operational-intelligence.webp",
    alt: "Railway operational intelligence at dusk",
    width: 1024,
    height: 573,
  },
});

export default function IndustriesPage() {
  const rail = getIndustry("rail");
  const security = getIndustry("public-security");

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Operational intelligence where physical risk is real."
        intro="The same foundation — perceive, understand, act — adapts to environments where people, assets and conditions interact. We begin where the need is clearest: Rail and Public Security."
      />

      <section aria-labelledby="launch-title" className="pb-24 sm:pb-32">
        <div className="container-site">
          <h2 id="launch-title" className="eyebrow mb-8 flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-gold/60" />
            Launch industries
          </h2>
          <ul className="grid gap-6 lg:grid-cols-2">
            <Reveal as="li" className="flex">
              <IndustryFeatureCard
                industry={rail}
                index={1}
                subtitle="Live operational intelligence for safer, more resilient railways."
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="w-full"
              />
            </Reveal>
            <Reveal as="li" className="flex" delay={0.08}>
              <IndustryFeatureCard
                industry={security}
                index={2}
                subtitle={security.summary}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="w-full"
              />
            </Reveal>
          </ul>
        </div>
      </section>

      <section aria-labelledby="expansion-title" className="border-t border-line bg-ink-900 py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading
            id="expansion-title"
            eyebrow="Expansion environments"
            title="The same foundation, extended with care."
            intro="We are not yet operating in these environments — we are actively developing our approach for each. They share the same need as rail and public security: a live understanding of people, assets, places and risk."
          />

          <div className="mt-16 space-y-6 lg:mt-20">
            {expansionIndustries.map((industry, i) => {
              const detail = expansionDetail[industry.slug as keyof typeof expansionDetail];
              const flip = i % 2 === 1;
              return (
                <Reveal
                  as="article"
                  key={industry.slug}
                  className="overflow-hidden rounded-[20px] border border-line bg-ink-950"
                >
                  <div id={industry.slug} className="grid scroll-mt-28 lg:grid-cols-12">
                    <MediaFrame
                      procedural={industry.procedural}
                      image={industry.image}
                      uid={`overview-${industry.slug}`}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className={`aspect-[4/3] lg:col-span-6 lg:aspect-auto lg:min-h-[26rem] ${flip ? "lg:order-2" : ""}`}
                    />
                    <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-6 lg:p-14">
                      <div className="flex flex-wrap items-center gap-4">
                        <p className="font-mono text-[0.625rem] tracking-[0.18em] text-gold-muted uppercase">
                          0{i + 3} · Expansion environment
                        </p>
                        <StatusBadge />
                      </div>
                      <h3 className="text-heading mt-4 text-[clamp(1.9rem,3vw,2.6rem)] text-bone">{industry.name}</h3>
                      <p className="mt-4 max-w-[48ch] text-[1.0625rem] leading-relaxed text-bone/85">{industry.summary}</p>
                      <p className="mt-4 max-w-[52ch] leading-relaxed text-stone">{detail.note}</p>
                      <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                        {detail.focus.map((f) => (
                          <li key={f} className="flex items-start gap-3 text-[0.9375rem] text-stone">
                            <span aria-hidden className="mt-2 size-1.5 shrink-0 rotate-45 bg-gold/80" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8 rounded-xl border border-line-strong bg-gold/[0.04] p-5">
                        <p className="text-[0.9375rem] leading-relaxed text-stone">{expansionStatus.detail(industry.name)}</p>
                        <Link
                          href="/contact?interest=industry-pilots"
                          className="group mt-4 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium text-bone transition-colors hover:text-gold-bright"
                        >
                          Register early interest
                          <span className="sr-only"> in {industry.name}</span>
                          <Arrow />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand
        title="Exploring operational intelligence in your environment?"
        text="We are interested in carefully scoped pilots with organisations that operate complex physical systems."
        href="/contact?interest=industry-pilots"
        label="Discuss a pilot"
      />
    </>
  );
}
