import { Reveal } from "@/components/ui/Reveal";

type Phase = { id: string; label: string; description: string };

/** Perceive → Understand → Act, as three connected columns. */
export function PhaseTriad({ phases, headingLevel = "h3" }: { phases: readonly Phase[]; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <ol className="relative grid gap-px overflow-hidden rounded-[20px] border border-line bg-line md:grid-cols-3">
      {phases.map((phase, i) => (
        <Reveal as="li" key={phase.id} delay={i * 0.08} className="relative bg-ink-900 p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-gold">0{i + 1}</span>
            <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-gold/50 to-transparent" />
            {i < phases.length - 1 ? (
              <svg viewBox="0 0 16 16" aria-hidden className="hidden size-3.5 text-gold-muted md:block">
                <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            ) : null}
          </div>
          <Heading className="text-heading mt-8 text-[1.75rem] text-bone">{phase.label}</Heading>
          <p className="mt-4 leading-relaxed text-stone">{phase.description}</p>
        </Reveal>
      ))}
    </ol>
  );
}
