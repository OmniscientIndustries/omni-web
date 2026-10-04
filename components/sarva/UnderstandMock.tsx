import { evidenceLayers, triageCategories } from "@/content/sarva";
import { MockPanel } from "./MockPanel";

export function UnderstandMock() {
  return (
    <MockPanel
      title="Structured evidence · Triage"
      label="Illustrative triage view: a report is organised into evidence layers; AI assistance suggests a category with medium confidence; a human reviewer then confirms or changes the suggestion before any decision is recorded."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-stone-dim uppercase">Evidence layers</p>
          <ul className="mt-3 space-y-1.5">
            {evidenceLayers.map((layer, i) => (
              <li
                key={layer}
                className="flex items-center gap-3 rounded-lg border border-line bg-ink-950/70 px-3 py-2 text-[0.75rem] text-bone/85"
                style={{ marginLeft: `${Math.min(i, 4) * 4}px` }}
              >
                <span className="h-3 w-[2px] rounded bg-gold" style={{ opacity: 1 - i * 0.08 }} />
                {layer}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-line bg-ink-950/70 p-4">
            <p className="flex items-center justify-between font-mono text-[0.5625rem] tracking-[0.16em] uppercase">
              <span className="text-gold">Step 1 · AI assistance</span>
              <span className="text-stone-dim">Suggestion</span>
            </p>
            <ul className="mt-3 space-y-1.5">
              {triageCategories.map((c) => (
                <li
                  key={c.label}
                  className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-[0.75rem] ${c.suggested ? "border border-gold/50 bg-gold/10 text-gold-bright" : "text-stone"}`}
                >
                  {c.label}
                  {c.suggested ? <span className="font-mono text-[0.5625rem] tracking-[0.14em] uppercase">Suggested</span> : null}
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <div className="flex justify-between text-[0.6875rem] text-stone">
                <span>Confidence</span>
                <span className="text-bone">Medium</span>
              </div>
              <div className="mt-1.5 grid grid-cols-3 gap-1">
                <span className="h-1 rounded bg-gold" />
                <span className="h-1 rounded bg-gold" />
                <span className="h-1 rounded bg-line-strong" />
              </div>
            </div>
          </div>

          <div aria-hidden className="mx-auto h-5 w-px bg-gradient-to-b from-gold/60 to-gold" />

          <div className="rounded-xl border border-gold/50 bg-gold/[0.07] p-4">
            <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-gold-bright uppercase">Step 2 · Human review</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-bone">
              A trained reviewer confirms, changes or requests more information. The decision and reasoning are recorded.
            </p>
            <p className="mt-3 flex items-center gap-2 text-[0.75rem] text-stone">
              <span className="size-1.5 rounded-full border border-gold" /> Awaiting reviewer
            </p>
          </div>
        </div>
      </div>
    </MockPanel>
  );
}
