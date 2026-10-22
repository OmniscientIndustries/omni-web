import { hash } from "@/lib/hash";
import { VisualFrame } from "./frame";

const C = { x: 400, y: 290 };

/** One node per operating environment. */
const NODE_ANGLES = [122, 58, 2, 298, 238, 178];

/** Orbits cross steeply (an orbital system, not a horizontal almond). */
const orbits = [
  { rx: 250, ry: 92, rot: -38, opacity: 0.42, dash: undefined },
  { rx: 250, ry: 92, rot: 38, opacity: 0.42, dash: undefined },
  { rx: 150, ry: 150, rot: 0, opacity: 0.22, dash: "2 6" },
] as const;

const sources = Array.from({ length: 18 }, (_, i) => {
  const a = hash(i * 3.3) * Math.PI * 2;
  const r = 250 + hash(i * 7.1) * 150;
  return { x: C.x + Math.cos(a) * r * 1.15, y: C.y + Math.sin(a) * r * 0.75, d: i };
});

const rays = Array.from({ length: 48 }, (_, i) => {
  const a = (i / 48) * Math.PI * 2;
  const len = 16 + (i % 2 ? 10 : 26) * (0.6 + 0.4 * hash(i));
  const p = (r: number, ang: number) => `${(C.x + Math.cos(ang) * r).toFixed(1)},${(C.y + Math.sin(ang) * r).toFixed(1)}`;
  return `M${p(26, a - 0.05)}L${p(26 + len, a)}L${p(26, a + 0.05)}Z`;
}).join("");

function onOrbit(o: (typeof orbits)[number], angle: number) {
  const x = Math.cos(angle) * o.rx;
  const y = Math.sin(angle) * o.ry;
  const r = (o.rot * Math.PI) / 180;
  return { x: C.x + x * Math.cos(r) - y * Math.sin(r), y: C.y + x * Math.sin(r) + y * Math.cos(r) };
}

/** Fragmented sources resolving into a central core — used for editorial and mission visuals. */
export function BrainVisual({ uid = "brain" }: { uid?: string }) {
  return (
    <VisualFrame uid={uid} label="Fragmented operational sources connected by gold lines to a central intelligence core." glow="50% 48%">
      {sources.map((s) => (
        <g key={s.d}>
          <path
            d={`M${s.x.toFixed(1)} ${s.y.toFixed(1)} Q ${((s.x + C.x) / 2).toFixed(1)} ${((s.y + C.y) / 2 - 40).toFixed(1)} ${C.x} ${C.y}`}
            fill="none"
            stroke="#b79768"
            strokeOpacity="0.2"
            strokeDasharray={s.d % 3 === 0 ? "2 6" : undefined}
          />
          <rect x={s.x - 3} y={s.y - 3} width="6" height="6" fill="#b79768" fillOpacity="0.5" transform={`rotate(45 ${s.x} ${s.y})`} />
        </g>
      ))}
      {orbits.map((o, i) => (
        <ellipse
          key={i}
          cx={C.x}
          cy={C.y}
          rx={o.rx}
          ry={o.ry}
          transform={`rotate(${o.rot} ${C.x} ${C.y})`}
          fill="none"
          stroke="#b79768"
          strokeOpacity={o.opacity}
          strokeDasharray={o.dash}
        />
      ))}
      <circle cx={C.x} cy={C.y} r="120" fill={`url(#${uid}-glow)`} opacity="0.5" />
      <path d={rays} fill="#d7c4a4" fillOpacity="0.9" />
      <circle cx={C.x} cy={C.y} r="22" fill="#d7c4a4" />
      <circle cx={C.x} cy={C.y} r="12" fill="#fff4cf" fillOpacity="0.85" />
      {NODE_ANGLES.map((deg, i) => {
        const p = onOrbit(orbits[i % 2], (deg * Math.PI) / 180);
        return <circle key={deg} cx={p.x} cy={p.y} r="4.5" fill="#d7c4a4" />;
      })}
      <rect width="800" height="600" fill={`url(#${uid}-fade)`} />
    </VisualFrame>
  );
}
