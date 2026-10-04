import type { Metadata } from "next";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { FragmentsVisual } from "@/components/sections/FragmentsVisual";
import { PhaseTriad } from "@/components/sections/PhaseTriad";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { mission } from "@/content/company";
import { operatingModel } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mission",
  description:
    "We are building the intelligence layer for the physical world — connecting fragmented systems into an evidence-backed operational model that supports accountable human decisions.",
  path: "/mission",
});

export default function MissionPage() {
  return (
    <>
      <PageHero eyebrow={mission.eyebrow} title={mission.title} intro={mission.intro} />

      <section aria-labelledby="problem-title" className="border-t border-line py-24 sm:py-32">
        <div className="container-site grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-gold/60" />
              The problem
            </p>
            <h2 id="problem-title" className="text-heading text-[clamp(2rem,4.2vw,3.5rem)] text-bone">
              {mission.problemTitle}
            </h2>
            <p className="measure mt-6 text-[1.0625rem] leading-relaxed text-stone">{mission.problem}</p>
            <p className="mt-6 text-[0.9375rem] text-stone-dim">Operational information typically lives across:</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {mission.fragments.map((f) => (
                <li key={f} className="rounded-md border border-line px-2.5 py-1.5 text-[0.8125rem] text-stone">
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="lg:col-span-6" delay={0.1}>
            <div aria-hidden>
              <FragmentsVisual fragments={mission.fragments} />
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="model-title" className="border-t border-line bg-ink-900 py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading
            id="model-title"
            eyebrow="Operating model"
            title="Perceive. Understand. Act."
            intro="A single loop, applied with discipline to every environment we work in."
          />
          <div className="mt-14">
            <PhaseTriad phases={operatingModel} />
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading id="principles-title" eyebrow="Principles" title="Intelligence that people can trust and question." />
          <ul className="mt-14 grid gap-6 sm:grid-cols-2">
            {mission.principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.05} className="rounded-[18px] border border-line bg-ink-900 p-7 sm:p-9">
                <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-gold">0{i + 1}</p>
                <h3 className="mt-5 text-[1.3125rem] font-medium text-bone">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-stone">{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Share the problem you are trying to solve."
        text="The most useful conversations start with a real operational question."
      />
    </>
  );
}
