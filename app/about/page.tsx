import type { Metadata } from "next";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { ConvergingPaths } from "@/components/sections/ConvergingPaths";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about } from "@/content/company";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Omniscient Industries is founder-led and research-driven, working at the intersection of AI systems, geospatial intelligence, digital twins, autonomous systems and safety-critical engineering.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow={about.eyebrow} title={about.title} intro={about.intro} />

      <section aria-labelledby="disciplines-title" className="border-t border-line py-24 sm:py-32">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-gold/60" />
              Where we work
            </p>
            <h2 id="disciplines-title" className="text-heading text-[clamp(1.9rem,3.4vw,2.8rem)] text-bone">
              At the intersection of
            </h2>
          </Reveal>
          <ol className="lg:col-span-8">
            {about.disciplines.map((d, i) => (
              <Reveal
                as="li"
                key={d}
                delay={i * 0.04}
                className="group flex items-baseline gap-6 border-b border-line py-5 first:border-t sm:py-6"
              >
                <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-gold-muted">0{i + 1}</span>
                <span className="text-[clamp(1.4rem,2.6vw,2.1rem)] font-medium tracking-[-0.02em] text-bone">{d}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="founders-title" className="border-t border-line bg-ink-900 py-24 sm:py-32">
        <div className="container-site">
          <SectionHeading
            id="founders-title"
            eyebrow="Founders"
            title="Two paths, converging into one company."
            intro="Omniscient brings a technical path and an operational path together, so that what we build is both rigorous and usable in the field."
          />
          <div className="my-20 px-2 sm:px-0">
            <ConvergingPaths />
          </div>
          <ul className="grid gap-6 lg:grid-cols-2">
            {about.founders.map((f, i) => (
              <Reveal as="li" key={f.name} delay={i * 0.08} className="rounded-[20px] border border-line bg-ink-950 p-7 sm:p-10">
                <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-gold uppercase">{f.path}</p>
                <h3 className="text-heading mt-5 text-[clamp(1.8rem,3vw,2.4rem)] text-bone">{f.name}</h3>
                <p className="mt-4 max-w-[48ch] leading-relaxed text-stone">{f.summary}</p>
                <ul className="mt-8 grid gap-x-6 gap-y-3 border-t border-line pt-6 sm:grid-cols-2">
                  {f.focus.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-bone/85">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rotate-45 bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="ambition-title" className="py-24 sm:py-32">
        <div className="container-site">
          <Reveal className="grid gap-8 rounded-[22px] border border-line bg-[radial-gradient(70%_120%_at_100%_0%,rgb(183_151_104/0.1),transparent_60%)] p-8 sm:p-12 lg:grid-cols-12 lg:p-16">
            <div className="lg:col-span-5">
              <p className="eyebrow mb-5">United Kingdom · India · Global</p>
              <h2 id="ambition-title" className="text-heading text-[clamp(1.9rem,3.6vw,3rem)] text-bone">
                {about.ambitionTitle}
              </h2>
            </div>
            <p className="text-[1.125rem] leading-relaxed text-stone lg:col-span-7 lg:self-end">{about.ambition}</p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Interested in what we are building?"
        text="We are always glad to speak with engineers, researchers, operators and investors who care about the physical world."
      />
    </>
  );
}
