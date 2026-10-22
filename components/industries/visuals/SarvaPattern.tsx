import { hash } from "@/lib/hash";
import { ISO, VisualFrame } from "./frame";

const TX = 400;
const TY = 64;

const blocks = Array.from({ length: 13 * 11 }, (_, i) => {
  const cx = i % 13;
  const cy = Math.floor(i / 13);
  const w = 30 + hash(i * 1.3) * 12;
  const h = 30 + hash(i * 2.7) * 12;
  return { x: -80 + cx * 46, y: -40 + cy * 46, w, h, tone: hash(i * 5.1) };
}).filter((b) => !(b.x > 140 && b.x < 240 && b.y > 120 && b.y < 220));

// Anonymous report pulses: placed on streets and broad areas, never on a specific building.
const pulses = [
  { x: 190, y: 170, d: 0 },
  { x: 236, y: 120, d: 260 },
  { x: 144, y: 214, d: 420 },
  { x: 262, y: 236, d: 600 },
  { x: 98, y: 120, d: 780 },
  { x: 330, y: 166, d: 900 },
];

function hex(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k + Math.PI / 6;
    return `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");
}

const R = 46;
const HX = R * Math.sqrt(3);
const cells = [
  { q: 0, r: 0, v: 0.36 },
  { q: 1, r: 0, v: 0.22 },
  { q: -1, r: 0, v: 0.14 },
  { q: 0, r: 1, v: 0.24 },
  { q: 1, r: -1, v: 0.16 },
  { q: -1, r: 1, v: 0.1 },
  { q: 0, r: -1, v: 0.12 },
].map((c) => ({ ...c, x: 190 + HX * (c.q + c.r / 2), y: 170 + R * 1.5 * c.r }));

export function SarvaPattern({ uid = "sarva", revealed = false }: { uid?: string; revealed?: boolean }) {
  const reveal = revealed ? undefined : "reveal-on-hover";
  return (
    <VisualFrame uid={uid} label="Abstract city plan where anonymous report pulses gather into broad, community-level pattern areas." glow="55% 45%">
      <g transform={ISO(TX, TY)}>
        <path d="M-120 330 C 0 290, 60 380, 180 340 S 420 300, 560 360" fill="none" stroke="#1d1a12" strokeWidth="26" />
        {blocks.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="3"
            fill={b.tone > 0.7 ? "#1c1912" : "#14120e"}
            stroke="#b79768"
            strokeOpacity={0.12 + b.tone * 0.12}
          />
        ))}
        <rect x="146" y="126" width="88" height="88" rx="6" fill="#10120c" stroke="#b79768" strokeOpacity="0.14" />
        {/* Arterial streets */}
        <g stroke="#b79768" strokeOpacity="0.16" strokeWidth="1.4">
          <line x1="-100" y1="96" x2="560" y2="96" />
          <line x1="-100" y1="234" x2="560" y2="234" />
          <line x1="128" y1="-60" x2="128" y2="460" />
          <line x1="266" y1="-60" x2="266" y2="460" />
        </g>

        {/* Aggregated community-level pattern (broad hexagonal areas, no addresses). */}
        <g className={reveal} style={{ ["--delay" as string]: "900ms" }}>
          {cells.map((c) => (
            <polygon
              key={`${c.q}-${c.r}`}
              points={hex(c.x, c.y, R - 2)}
              fill="#b79768"
              fillOpacity={c.v}
              stroke="#d7c4a4"
              strokeOpacity={0.35}
              strokeWidth="1"
            />
          ))}
        </g>

        {/* Additional anonymous pulses appear. */}
        {pulses.slice(1).map((p) => (
          <g key={`${p.x}-${p.y}`} className={reveal} style={{ ["--delay" as string]: `${p.d}ms` }}>
            <circle cx={p.x} cy={p.y} r="16" fill={`url(#${uid}-glow)`} />
            <circle cx={p.x} cy={p.y} r="2.6" fill="#d7c4a4" />
            <circle className="pulse-ring" style={{ ["--delay" as string]: `${p.d}ms` }} cx={p.x} cy={p.y} r="12" fill="none" stroke="#d7c4a4" strokeWidth="1.2" />
          </g>
        ))}

        {/* One soft report pulse at rest. */}
        <circle cx={pulses[0].x} cy={pulses[0].y} r="26" fill={`url(#${uid}-glow)`} opacity="0.9" />
        <circle cx={pulses[0].x} cy={pulses[0].y} r="3.2" fill="#fff1c4" />
        <circle className="pulse-ring" cx={pulses[0].x} cy={pulses[0].y} r="14" fill="none" stroke="#d7c4a4" strokeWidth="1.2" />
      </g>
      <rect width="800" height="600" fill={`url(#${uid}-fade)`} />
    </VisualFrame>
  );
}
