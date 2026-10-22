import Link from "next/link";
import { brainNodes, RING_TILT } from "./brain-config";
import { hash } from "./brain-math";

const C = 500;
const R = 330;
const SQUASH = Math.sin(RING_TILT);

const nodes = brainNodes.map((node) => ({
  ...node,
  x: C + Math.cos(node.angle) * R,
  y: C + Math.sin(node.angle) * R * SQUASH,
}));

const rays = Array.from({ length: 84 }, (_, i) => {
  const a = (i / 84) * Math.PI * 2;
  const planar = Math.pow(Math.abs(Math.cos(a)), 1.4);
  const len = 10 + (0.35 + 0.65 * hash(i * 3.1)) * 70 * (0.25 + 0.75 * planar);
  const r0 = 64;
  const w = 0.03;
  const p = (r: number, ang: number) => `${(C + Math.cos(ang) * r).toFixed(1)},${(C + Math.sin(ang) * r * (0.62 + 0.38 * (1 - planar))).toFixed(1)}`;
  return `M${p(r0, a - w)}L${p(r0 + len, a)}L${p(r0, a + w)}Z`;
}).join("");

function curve(x: number, y: number) {
  const dx = x - C;
  const dy = y - C;
  const len = Math.hypot(dx, dy);
  const ex = C + (dx / len) * 70;
  const ey = C + (dy / len) * 70;
  return `M${x.toFixed(1)},${y.toFixed(1)} Q${((x + ex) / 2).toFixed(1)},${((y + ey) / 2 - 60).toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
}

/** Static Company Brain composition for no-WebGL, no-JS and error states. */
export function CompanyBrainFallback({ interactive = true }: { interactive?: boolean }) {
  return (
    <div className="absolute inset-x-0 top-[7%] h-[38%] [container-type:size] sm:top-[9%] sm:h-[52%] lg:inset-y-0 lg:top-0 lg:right-[-3%] lg:left-[38%] lg:h-full">
      <div className="relative mx-auto size-[min(100cqw,100cqh)]">
        <svg viewBox="0 0 1000 1000" aria-hidden className="absolute inset-0 size-full overflow-visible">
          <defs>
            <radialGradient id="fb-core" cx="0.4" cy="0.36" r="0.7">
              <stop offset="0" stopColor="#2b2620" />
              <stop offset="0.55" stopColor="#0c0b09" />
              <stop offset="1" stopColor="#050505" />
            </radialGradient>
            <radialGradient id="fb-glow">
              <stop offset="0" stopColor="#b79768" stopOpacity="0.38" />
              <stop offset="0.45" stopColor="#b79768" stopOpacity="0.08" />
              <stop offset="1" stopColor="#b79768" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="fb-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f6e3a1" />
              <stop offset="0.5" stopColor="#b79768" />
              <stop offset="1" stopColor="#6e5430" />
            </linearGradient>
          </defs>

          <circle cx={C} cy={C} r="340" fill="url(#fb-glow)" />

          <g fill="none" stroke="#b79768">
            <ellipse cx={C} cy={C} rx={R} ry={R * SQUASH} strokeOpacity="0.28" strokeWidth="1" />
            <ellipse cx={C} cy={C} rx="205" ry={205 * SQUASH} strokeOpacity="0.4" strokeWidth="1" />
            <ellipse cx={C} cy={C} rx="142" ry={142 * SQUASH} strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="2 7" />
            <ellipse cx={C} cy={C} rx="98" ry={98 * SQUASH} strokeOpacity="0.8" strokeWidth="1.4" transform={`rotate(-14 ${C} ${C})`} />
          </g>

          <g fill="none" stroke="#b79768" strokeWidth="1.1">
            {nodes.map((n) => (
              <path key={n.slug} d={curve(n.x, n.y)} strokeOpacity="0.5" />
            ))}
          </g>

          <path d={rays} fill="url(#fb-gold)" opacity="0.95" />
          <circle cx={C} cy={C} r="64" fill="url(#fb-core)" stroke="url(#fb-gold)" strokeWidth="1.5" />
          <ellipse cx={C - 18} cy={C - 24} rx="22" ry="12" fill="#fff4d6" opacity="0.07" />

          {nodes.map((n) => (
            <g key={n.slug}>
              <circle cx={n.x} cy={n.y} r="22" fill="#b79768" opacity="0.12" />
              <circle cx={n.x} cy={n.y} r="5.5" fill="url(#fb-gold)" />
              <ellipse cx={n.x} cy={n.y} rx="16" ry={16 * SQUASH * 1.6} fill="none" stroke="#b79768" strokeOpacity="0.6" />
            </g>
          ))}
        </svg>

        {interactive ? (
          <nav aria-label="Operating environments in the Company Brain" className="absolute inset-0">
            <ul>
              {nodes.map((n) => {
                const left = Math.cos(n.angle) > 0.3;
                return (
                  <li key={n.slug} className="absolute" style={{ left: `${n.x / 10}%`, top: `${n.y / 10}%` }}>
                    <Link
                      href={n.href}
                      className={`absolute top-1 left-0 flex min-h-8 -translate-x-1/2 items-center whitespace-nowrap font-mono text-[0.5625rem] tracking-[0.14em] text-bone/85 uppercase transition-colors hover:text-gold-bright sm:text-[0.625rem] lg:top-0 lg:min-h-11 lg:translate-x-0 lg:-translate-y-1/2 lg:text-[0.6875rem] lg:tracking-[0.16em] ${left ? "lg:right-4 lg:left-auto" : "lg:left-4"}`}
                    >
                      {n.name}
                      <span className="sr-only"> — {n.summary}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </div>
    </div>
  );
}
