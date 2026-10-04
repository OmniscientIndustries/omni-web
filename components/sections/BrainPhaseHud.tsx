import type { Ref } from "react";

export type Phase = "perceive" | "understand" | "act";
export type Status = "perceive" | "understand" | "detect" | "recommend" | "resolved";

export function phaseFor(p: number): Phase {
  return p < 0.3 ? "perceive" : p < 0.58 ? "understand" : "act";
}

export function statusFor(p: number): Status {
  if (p < 0.3) return "perceive";
  if (p < 0.58) return "understand";
  if (p < 0.72) return "detect";
  if (p < 0.88) return "recommend";
  return "resolved";
}

const PHASES: { id: Phase; label: string }[] = [
  { id: "perceive", label: "Perceive" },
  { id: "understand", label: "Understand" },
  { id: "act", label: "Act" },
];

const STATUSES: { id: Status; tone: "gold" | "risk"; text: string }[] = [
  { id: "perceive", tone: "gold", text: "Ingesting signals from six operating environments" },
  { id: "understand", tone: "gold", text: "Relationships resolved · Context established" },
  { id: "detect", tone: "risk", text: "Risk · Possession overlaps an active work zone" },
  { id: "recommend", tone: "gold", text: "Recommended · Re-sequence access, notify control" },
  { id: "resolved", tone: "gold", text: "Resolved · Decision confirmed by a person" },
];

/** Phase readout for the hero. State is written as data attributes by ScrollTrigger. */
export function BrainPhaseHud({ ref }: { ref: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      data-phase="perceive"
      data-status="perceive"
      aria-hidden
      className="group/hud animate-fade pointer-events-none absolute right-0 bottom-10 left-0 z-20 hidden [--delay:1600ms] lg:block"
    >
      <div className="container-site flex justify-end">
        <div className="w-[24rem] rounded-xl xl:w-[25rem] border border-line bg-ink-950/90 p-5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[0.625rem] tracking-[0.2em] text-gold uppercase">Company Brain</p>
            <p className="font-mono text-[0.625rem] tracking-[0.16em] text-stone-dim uppercase">Illustrative scenario</p>
          </div>
          <ol className="mt-4 grid grid-cols-3 gap-3">
            {PHASES.map((phase, i) => (
              <li
                key={phase.id}
                className={`font-mono text-[0.6875rem] tracking-[0.14em] uppercase text-stone-dim transition-colors duration-[var(--duration-standard)] ${
                  phase.id === "perceive"
                    ? "group-data-[phase=perceive]/hud:text-bone"
                    : phase.id === "understand"
                      ? "group-data-[phase=understand]/hud:text-bone"
                      : "group-data-[phase=act]/hud:text-bone"
                }`}
              >
                <span className="text-gold-muted">0{i + 1}</span> {phase.label}
              </li>
            ))}
          </ol>
          <div className="relative mt-3 h-px bg-line">
            <div data-bar className="absolute inset-0 origin-left bg-gold" style={{ transform: "scaleX(0)" }} />
          </div>
          <div className="relative mt-4 h-5">
            {STATUSES.map((status) => (
              <p
                key={status.id}
                className={`absolute inset-0 flex items-center gap-2.5 text-[0.8125rem] opacity-0 transition-opacity duration-[var(--duration-standard)] ${
                  {
                    perceive: "group-data-[status=perceive]/hud:opacity-100",
                    understand: "group-data-[status=understand]/hud:opacity-100",
                    detect: "group-data-[status=detect]/hud:opacity-100",
                    recommend: "group-data-[status=recommend]/hud:opacity-100",
                    resolved: "group-data-[status=resolved]/hud:opacity-100",
                  }[status.id]
                } ${status.tone === "risk" ? "text-risk" : "text-stone"}`}
              >
                <span
                  className={`size-1.5 shrink-0 ${status.tone === "risk" ? "rotate-45 bg-risk" : "rounded-full bg-gold"}`}
                />
                {status.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
