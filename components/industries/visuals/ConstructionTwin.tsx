import { ISO, VisualFrame, iso, pts } from "./frame";

const TX = 420;
const TY = 120;
const FLOOR = 34;
const FOOT: [number, number][] = [
  [40, 20],
  [260, 20],
  [260, 170],
  [40, 170],
];

function floorOutline(level: number) {
  return pts(FOOT.map(([x, y]) => iso(x, y, level * FLOOR, TX, TY)));
}

const columns: [number, number][] = [
  [40, 20], [150, 20], [260, 20], [260, 95], [260, 170], [150, 170], [40, 170], [40, 95],
];

export function ConstructionTwin({ uid = "construction" }: { uid?: string }) {
  const built = 3;
  const planned = 6;
  const [mx, my] = iso(300, 0, 0, TX, TY);
  const [, mTop] = iso(300, 0, 300, TX, TY);
  const [jx, jy] = iso(60, -40, 300, TX, TY);
  const [cx2, cy2] = iso(380, 30, 300, TX, TY);

  return (
    <VisualFrame uid={uid} label="Construction digital twin: a building frame with completed and planned floors, a crane, and safety zones around workers and plant." glow="55% 40%">
      <g transform={ISO(TX, TY)}>
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`gx${i}`} x1={-160 + i * 40} y1="-120" x2={-160 + i * 40} y2="380" stroke="#b79768" strokeOpacity="0.06" />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`gy${i}`} x1="-160" y1={-120 + i * 40} x2="340" y2={-120 + i * 40} stroke="#b79768" strokeOpacity="0.06" />
        ))}
        <rect x="20" y="0" width="260" height="190" fill="#100f0c" stroke="#b79768" strokeOpacity="0.18" strokeDasharray="4 6" />
        {/* Plant and worker safety zones */}
        <g className="reveal-on-hover">
          <circle cx="-40" cy="250" r="58" fill="#b79768" fillOpacity="0.06" stroke="#b79768" strokeOpacity="0.5" strokeDasharray="5 5" />
          <circle cx="-40" cy="250" r="30" fill="none" stroke="#d7c4a4" strokeOpacity="0.6" />
          <circle cx="150" cy="260" r="26" fill="#b79768" fillOpacity="0.08" stroke="#d7c4a4" strokeOpacity="0.55" />
          <circle cx="210" cy="250" r="22" fill="#b79768" fillOpacity="0.08" stroke="#d7c4a4" strokeOpacity="0.55" />
          <path d="M-40 250 L 150 260" stroke="#b79768" strokeOpacity="0.4" strokeDasharray="2 6" />
        </g>
        <rect x="-62" y="236" width="44" height="28" rx="3" fill="#1d1a12" stroke="#b79768" strokeOpacity="0.7" />
        <circle cx="150" cy="260" r="4" fill="#d7c4a4" />
        <circle cx="210" cy="250" r="4" fill="#d7c4a4" />
      </g>

      {/* Columns */}
      {columns.map(([x, y]) => {
        const [x0, y0] = iso(x, y, 0, TX, TY);
        const [, y1] = iso(x, y, built * FLOOR, TX, TY);
        const [, y2] = iso(x, y, planned * FLOOR, TX, TY);
        return (
          <g key={`${x}-${y}`}>
            <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="#b79768" strokeOpacity="0.75" strokeWidth="1.4" />
            <line x1={x0} y1={y1} x2={x0} y2={y2} stroke="#b79768" strokeOpacity="0.3" strokeDasharray="3 5" />
          </g>
        );
      })}

      {/* Completed floors (solid) vs planned floors (dashed): progress comparison */}
      {Array.from({ length: planned + 1 }, (_, level) => (
        <polygon
          key={level}
          points={floorOutline(level)}
          fill={level <= built ? "#b79768" : "none"}
          fillOpacity={level <= built ? 0.035 : 0}
          stroke={level <= built ? "#d7c4a4" : "#b79768"}
          strokeOpacity={level <= built ? 0.7 : 0.28}
          strokeDasharray={level <= built ? undefined : "4 6"}
        />
      ))}
      <polygon className="reveal-on-hover" points={floorOutline(built)} fill="#d7c4a4" fillOpacity="0.12" stroke="#d7c4a4" strokeWidth="1.6" />

      {/* Crane */}
      <line x1={mx} y1={my} x2={mx} y2={mTop} stroke="#6e5430" strokeWidth="2" />
      <line x1={jx} y1={jy} x2={cx2} y2={cy2} stroke="#6e5430" strokeWidth="1.6" />
      <line x1={mx} y1={mTop - 26} x2={jx} y2={jy} stroke="#6e5430" strokeOpacity="0.6" />
      <line x1={mx} y1={mTop - 26} x2={cx2} y2={cy2} stroke="#6e5430" strokeOpacity="0.6" />
      <circle cx={jx + 40} cy={jy + 23} r="3" fill="#d7c4a4" />

      <rect width="800" height="600" fill={`url(#${uid}-fade)`} />
    </VisualFrame>
  );
}
