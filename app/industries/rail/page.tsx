import type { Metadata } from "next";
import Image from "next/image";
import { AnnotatedImage } from "@/components/industries/AnnotatedImage";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { PhaseTriad } from "@/components/sections/PhaseTriad";
import { GoldButton } from "@/components/ui/GoldButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getIndustry } from "@/content/industries";
import { droneSteps, railCallouts, railHero, railModel, railPrinciples } from "@/content/rail";
import { pageMetadata } from "@/lib/seo";

const droneImage = {
  src: "/media/rail-drone-digital-twin.webp",
  alt: "A drone scans a stone railway viaduct at sunset, converting its arches into a gold wireframe digital twin with a highlighted crack.",
  width: 1024,
  height: 573,
};

export const metadata: Metadata = pageMetadata({
  title: "Rail",
  description:
    "A living operational picture of the railway: workers, vehicles, sites, competencies, work zones, possessions, isolations, inspection and predictive maintenance in one evidence-backed model.",
  path: "/industries/rail",
  image: droneImage,
});

const railPhases = [
  {
    id: "perceive",
    label: "Perceive",
    description: "Connect rostering, competence, access planning, plant telematics, inspection and asset systems into one geospatial model of the railway.",
  },
  {
    id: "understand",
    label: "Understand",
    description: "Relate people, work, zones, possessions and assets so conflicts, missing authorisations and emerging condition risks become visible early.",
  },
  {
    id: "act",
    label: "Act",
    description: "Present evidence-backed recommendations to the people accountable for them — planners, controllers and site leads — and record what was decided.",
  },
];

export default function RailPage() {
  const rail = getIndustry("rail");

  return (
    <>
      <PageHero
        eyebrow={railHero.eyebrow}
        title={railHero.title}
        intro={railHero.intro}
        back={{ href: "/industries", label: "All industries" }}
      >
        <div className="flex flex-wrap gap-3">
          <GoldButton href="/contact?interest=industry-pilots">Discuss a rail pilot</GoldButton>
          <GoldButton href="#digital-twin" variant="secondary" arrow={false}>
            Drone digital twins
          </GoldButton>
        </div>
      </PageHero>

      <section aria-label="Railway operational picture" className="pb-24 sm:pb-32">
        <div className="container-site">
          <Reveal>
            <AnnotatedImage
              image={rail.image!}
              callouts={railCallouts}
              preload
              caption="People, plant, signals, structures and track assets held in one live operational picture."
            />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="model-title" className="border-t border-line py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading
            id="model-title"
            eyebrow="The operational model"
            title="Everything that decides whether work is safe, connected."
            intro="Each of these is usually managed in a separate system. Omniscient relates them so the questions that matter — who, where, under what protection, on which asset — can be answered at once."
          />
          <div className="mt-16 space-y-4 lg:mt-20">
            {railModel.map((group, gi) => (
              <Reveal key={group.group} delay={gi * 0.05} className="grid gap-8 rounded-[20px] border border-line bg-ink-900 p-7 sm:p-10 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-gold">0{gi + 1}</p>
                  <h3 className="text-heading mt-4 text-[1.75rem] text-bone">{group.group}</h3>
                  <p className="mt-3 max-w-[36ch] leading-relaxed text-stone">{group.summary}</p>
                </div>
                <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:col-span-8">
                  {group.items.map((item) => (
                    <li key={item.name} className="bg-ink-950 p-5 sm:p-6">
                      <h4 className="flex items-center gap-2.5 text-[1.0625rem] font-medium text-bone">
                        <span aria-hidden className="size-1.5 rotate-45 bg-gold" />
                        {item.name}
                      </h4>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="rail-loop-title" className="py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading
            id="rail-loop-title"
            eyebrow="Perceive · Understand · Act"
            title="From fragmented records to accountable decisions."
          />
          <div className="mt-14">
            <PhaseTriad phases={railPhases} />
          </div>
        </div>
      </section>

      <section id="digital-twin" aria-labelledby="twin-title" className="relative scroll-mt-20 overflow-hidden border-y border-line bg-ink-900">
        <div className="relative">
          <Image
            src={droneImage.src}
            alt={droneImage.alt}
            width={droneImage.width}
            height={droneImage.height}
            sizes="100vw"
            className="h-[62vh] min-h-[420px] w-full object-cover object-[62%_50%] lg:h-[78vh]"
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_10_10/0.1)_0%,rgb(10_10_10/0)_45%,#0a0a0a_100%)]" />
          <div aria-hidden className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(10_10_10/0.85)_0%,rgb(10_10_10/0.2)_45%,transparent_60%)] lg:block" />
          <div className="relative lg:absolute lg:inset-x-0 lg:bottom-0">
            <div className="container-site pt-10 lg:pt-0 lg:pb-16">
              <Reveal className="max-w-xl">
                <p className="eyebrow mb-5">Autonomous inspection</p>
                <h2 id="twin-title" className="text-heading text-[clamp(2rem,4vw,3.4rem)] text-bone">
                  From drone flight to digital twin.
                </h2>
              </Reveal>
            </div>
          </div>
        </div>
        <div className="container-site pb-24 sm:pb-28">
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {droneSteps.map((s, i) => (
              <Reveal as="li" key={s.step} delay={i * 0.07} className="border-t border-line-strong pt-6">
                <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-gold">0{i + 1}</p>
                <h3 className="mt-4 text-[1.25rem] font-medium text-bone">{s.step}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading
            id="principles-title"
            eyebrow="Safety principles"
            title="Designed to strengthen safety-critical judgement, not replace it."
          />
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {railPrinciples.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.06} className="rounded-[18px] border border-line bg-ink-900 p-7">
                <h3 className="text-[1.1875rem] font-medium text-bone">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-stone">{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Building a safer, more resilient railway?"
        text="We welcome conversations with infrastructure managers, contractors and rail technology teams about scoped operational pilots."
        href="/contact?interest=industry-pilots"
        label="Discuss a rail pilot"
      />
    </>
  );
}
