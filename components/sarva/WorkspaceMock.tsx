import { MockPanel } from "./MockPanel";

const weeks = [5, 7, 6, 9, 8, 11, 10, 13, 12, 14, 13, 16];

const queue = [
  { ref: "SRV-••••-3F", status: "Needs more information", state: "Awaiting reporter" },
  { ref: "SRV-••••-9A", status: "Possible hate crime", state: "Human review" },
  { ref: "SRV-••••-2C", status: "Hate incident", state: "Validated" },
];

const workflow = ["New", "In review", "Follow-up", "Closed"];

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-stone-dim uppercase">{children}</p>;
}

export function WorkspaceMock() {
  const max = Math.max(...weeks);
  return (
    <MockPanel
      title="Authorised intelligence workspace"
      label="Illustrative police workspace showing report trends, the split between possible hate crimes and hate incidents, validation and workflow status, reports needing more information, human-review status, aggregated geographic patterns, evidence provenance and classification confidence. Sample data only."
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line pb-4 text-[0.6875rem] text-stone">
        <span>Role: <span className="text-bone">Authorised analyst</span></span>
        <span aria-hidden className="text-stone-dim">·</span>
        <span>Audit trail: <span className="text-gold-bright">On</span></span>
        <span aria-hidden className="text-stone-dim">·</span>
        <span>Sample data</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-6">
        <div className="rounded-xl border border-line bg-ink-950/70 p-4 sm:col-span-4">
          <Label>Report trends · 12 weeks</Label>
          <div className="mt-3 flex h-20 items-end gap-1.5">
            {weeks.map((v, i) => (
              <span key={i} className="flex-1 rounded-t-sm bg-gold/60" style={{ height: `${(v / max) * 100}%`, opacity: 0.45 + (i / weeks.length) * 0.55 }} />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-line bg-ink-950/70 p-4 sm:col-span-2">
          <Label>Classification</Label>
          <div className="mt-3 flex h-2 overflow-hidden rounded">
            <span className="w-[38%] bg-gold" />
            <span className="w-[62%] bg-[repeating-linear-gradient(135deg,#6e5430_0_3px,#3a3014_3px_6px)]" />
          </div>
          <ul className="mt-3 space-y-1.5 text-[0.6875rem] text-stone">
            <li className="flex items-center gap-2"><span className="size-2 bg-gold" /> Possible hate crime</li>
            <li className="flex items-center gap-2"><span className="size-2 bg-[repeating-linear-gradient(135deg,#6e5430_0_2px,#3a3014_2px_4px)]" /> Hate incident</li>
          </ul>
        </div>

        <div className="rounded-xl border border-line bg-ink-950/70 p-4 sm:col-span-4">
          <Label>Review queue</Label>
          <ul className="mt-2 divide-y divide-line">
            {queue.map((q) => (
              <li key={q.ref} className="grid grid-cols-[6.5rem_1fr] gap-2 py-2 text-[0.6875rem] sm:grid-cols-[6.5rem_1fr_auto]">
                <span className="font-mono text-gold-bright">{q.ref}</span>
                <span className="text-bone/85">{q.status}</span>
                <span className="col-start-2 text-stone sm:col-start-auto">{q.state}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-ink-950/70 p-4 sm:col-span-2">
          <Label>Workflow</Label>
          <ol className="mt-3 space-y-2">
            {workflow.map((w, i) => (
              <li key={w} className="flex items-center gap-2 text-[0.6875rem] text-stone">
                <span className={`size-2 rounded-full border border-gold ${i < 2 ? "bg-gold" : ""}`} />
                {w}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-line bg-ink-950/70 p-4 sm:col-span-3">
          <Label>Human review</Label>
          <p className="mt-2 text-[0.75rem] leading-relaxed text-bone/85">
            AI suggestion: <span className="text-gold-bright">Possible hate crime</span>
          </p>
          <p className="text-[0.75rem] text-stone">Confidence: Medium · Reviewer: confirmed with note</p>
          <div className="mt-3 grid grid-cols-3 gap-1">
            <span className="h-1 rounded bg-gold" />
            <span className="h-1 rounded bg-gold" />
            <span className="h-1 rounded bg-line-strong" />
          </div>
        </div>
        <div className="rounded-xl border border-line bg-ink-950/70 p-4 sm:col-span-3">
          <Label>Evidence provenance</Label>
          <ul className="mt-2 space-y-1 text-[0.6875rem] text-stone">
            <li>◦ Submitted by reporter, with consent</li>
            <li>◦ Photo · integrity checked on upload</li>
            <li>◦ Every access and change logged</li>
          </ul>
        </div>

        <div className="rounded-xl border border-line bg-ink-950/70 p-4 sm:col-span-6">
          <div className="flex items-center justify-between">
            <Label>Aggregated geographic pattern</Label>
            <span className="font-mono text-[0.5625rem] tracking-[0.14em] text-stone-dim uppercase">Broad areas only</span>
          </div>
          <div className="mt-3 flex gap-1.5">
            {[0.12, 0.3, 0.55, 0.85, 0.5, 0.25, 0.4, 0.18, 0.62, 0.34, 0.15, 0.08].map((v, i) => (
              <span key={i} className="h-7 flex-1 [clip-path:polygon(25%_0,75%_0,100%_50%,75%_100%,25%_100%,0_50%)]" style={{ background: `rgb(183 151 104 / ${v})` }} />
            ))}
          </div>
        </div>
      </div>
    </MockPanel>
  );
}
