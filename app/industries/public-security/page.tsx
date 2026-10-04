import type { Metadata } from "next";
import { SarvaPattern } from "@/components/industries/visuals/SarvaPattern";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { AudienceSwitch } from "@/components/sarva/AudienceSwitch";
import { PatternMock } from "@/components/sarva/PatternMock";
import { SpeakMock } from "@/components/sarva/SpeakMock";
import { StageNav } from "@/components/sarva/StageNav";
import { UnderstandMock } from "@/components/sarva/UnderstandMock";
import { WorkspaceMock } from "@/components/sarva/WorkspaceMock";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sarvaHero, sarvaPrinciples, sarvaStages } from "@/content/sarva";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Public Security · SARVA",
  description:
    "SARVA is a multilingual community hate-reporting and intelligence platform: safe, consent-led reporting for people and accountable, human-reviewed insight for authorised police teams.",
  path: "/industries/public-security",
});

const stageVisuals = {
  speak: <SpeakMock />,
  understand: <UnderstandMock />,
  pattern: <PatternMock />,
  act: <WorkspaceMock />,
} as const;

export default function PublicSecurityPage() {
  return (
    <>
      <PageHero
        eyebrow={sarvaHero.eyebrow}
        title={sarvaHero.title}
        back={{ href: "/industries", label: "All industries" }}
        intro={
          <>
            <span className="mb-4 block font-mono text-[0.8125rem] tracking-[0.28em] text-gold uppercase">
              {sarvaHero.product} — {sarvaHero.secondary}
            </span>
            {sarvaHero.intro}
          </>
        }
        aside={
          <figure className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-line">
              <SarvaPattern uid="hero-sarva" />
            </div>
            <figcaption className="mt-4 flex items-center justify-between text-[0.875rem] text-stone-dim">
              <span>One voice becomes a pattern.</span>
              <span className="font-mono text-[0.625rem] tracking-[0.16em] uppercase">Hover to aggregate</span>
            </figcaption>
          </figure>
        }
      />

      <section aria-labelledby="story-title" className="border-t border-line py-24 sm:py-32">
        <div className="container-site">
          <h2 id="story-title" className="sr-only">
            How SARVA works, in four stages
          </h2>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow mb-6 flex items-center gap-3">
                  <span aria-hidden className="h-px w-8 bg-gold/60" />
                  How SARVA works
                </p>
                <StageNav stages={sarvaStages} />
                <p className="mt-8 hidden max-w-[34ch] text-[0.875rem] leading-relaxed text-stone-dim lg:block">
                  Interfaces shown are illustrative and use sample content only.
                </p>
              </div>
            </aside>

            <div className="space-y-24 sm:space-y-32 lg:col-span-8">
              {sarvaStages.map((stage) => (
                <article key={stage.id} id={`stage-${stage.id}`} aria-labelledby={`stage-${stage.id}-title`} className="scroll-mt-28">
                  <Reveal>
                    <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-gold uppercase">
                      {stage.index} · {stage.label}
                    </p>
                    <h3 id={`stage-${stage.id}-title`} className="text-heading mt-5 max-w-[22ch] text-[clamp(1.8rem,3.2vw,2.75rem)] text-bone">
                      {stage.title}
                    </h3>
                    <p className="measure mt-5 text-[1.0625rem] leading-relaxed text-stone">{stage.text}</p>
                  </Reveal>
                  <Reveal className="mt-10" delay={0.1}>
                    {stageVisuals[stage.id]}
                  </Reveal>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="audience-title" className="border-t border-line bg-ink-900 py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading
            id="audience-title"
            eyebrow="Two experiences, one platform"
            title="Designed for the people who report — and the teams who respond."
            intro="Each side of SARVA is shaped by its responsibilities: safety and control for people reporting; evidence, oversight and accountability for authorised teams."
          />
          <div className="mt-12">
            <AudienceSwitch />
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading id="principles-title" eyebrow="Principles" title="Protective, not surveillant." />
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sarvaPrinciples.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.06} className="rounded-[18px] border border-line bg-ink-900 p-7">
                <span aria-hidden className="block size-2 rotate-45 bg-gold" />
                <h3 className="mt-6 text-[1.1875rem] font-medium text-bone">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-stone">{p.text}</p>
              </Reveal>
            ))}
          </ul>

          {/* Independence statement: replace the body with approved legal copy when available. */}
          <aside aria-labelledby="independence-title" className="mt-16 rounded-[18px] border border-dashed border-line-strong p-7 sm:p-9">
            <h3 id="independence-title" className="system-label text-gold">
              Independence statement
            </h3>
            <p className="mt-4 max-w-[75ch] leading-relaxed text-stone">
              SARVA is developed independently by Omniscient Industries. References to police teams describe the
              intended authorised users of the platform and do not indicate endorsement by, partnership with, or
              affiliation to any police service.
            </p>
          </aside>
        </div>
      </section>

      <CtaBand
        title="Working on community safety or hate-crime reporting?"
        text="We would value conversations with community organisations, researchers and public-sector teams about how SARVA should develop."
        href="/contact?interest=industry-pilots"
        label="Get in touch"
      />
    </>
  );
}
