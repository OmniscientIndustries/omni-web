import { SarvaPattern } from "@/components/industries/visuals/SarvaPattern";
import { PullOut } from "@/components/ui/PullOut";

const trend = [12, 14, 13, 17, 16, 21, 19, 24, 22, 27, 25, 29];
const types = [
  { label: "Verbal", w: 82 },
  { label: "Online", w: 58 },
  { label: "Physical", w: 26 },
];

function Sparkline() {
  const max = Math.max(...trend);
  const d = trend.map((v, i) => `${i === 0 ? "M" : "L"}${(i / (trend.length - 1)) * 200} ${48 - (v / max) * 40}`).join(" ");
  return (
    <svg viewBox="0 0 200 52" className="h-12 w-full" aria-hidden>
      <path d={`${d} L200 52 L0 52Z`} fill="#b79768" fillOpacity="0.08" />
      <path d={d} fill="none" stroke="#d7c4a4" strokeWidth="1.5" />
    </svg>
  );
}

export function PatternMock() {
  return (
    <div
      role="img"
      aria-label="Illustrative anonymised city: reports aggregated into broad hexagonal areas, with a trend over time, a distribution of incident types and repeat broad areas. No exact addresses are shown."
      className="relative overflow-hidden rounded-[20px] border border-line bg-ink-950"
    >
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/11]">
        <PullOut className="absolute inset-0">
          <SarvaPattern uid="stage-pattern" revealed />
        </PullOut>
        <p className="absolute top-4 left-4 rounded-md border border-line bg-ink-950/80 px-2.5 py-1.5 font-mono text-[0.5625rem] tracking-[0.16em] text-gold uppercase backdrop-blur-sm">
          Broad-area aggregation · No addresses
        </p>
        <p className="absolute top-4 right-4 font-mono text-[0.5625rem] tracking-[0.16em] text-stone-dim uppercase">Illustrative</p>
      </div>

      <div className="grid gap-px border-t border-line bg-line sm:grid-cols-3">
        <div className="bg-ink-900 p-4">
          <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-stone-dim uppercase">Trend over time</p>
          <Sparkline />
        </div>
        <div className="bg-ink-900 p-4">
          <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-stone-dim uppercase">Incident types</p>
          <ul className="mt-2.5 space-y-2">
            {types.map((t) => (
              <li key={t.label} className="grid grid-cols-[4.5rem_1fr] items-center gap-2 text-[0.6875rem] text-stone">
                {t.label}
                <span className="h-1.5 rounded bg-gold/70" style={{ width: `${t.w}%` }} />
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-ink-900 p-4">
          <p className="font-mono text-[0.5625rem] tracking-[0.16em] text-stone-dim uppercase">Repeat broad areas</p>
          <ul className="mt-2.5 space-y-1.5 text-[0.75rem] text-bone/85">
            <li className="flex items-center gap-2"><span className="size-2 rotate-45 bg-gold" /> Area A · rising</li>
            <li className="flex items-center gap-2"><span className="size-2 rotate-45 bg-gold/60" /> Area B · stable</li>
            <li className="flex items-center gap-2"><span className="size-2 rotate-45 bg-gold/30" /> Area C · easing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
