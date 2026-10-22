import { ISO, VisualFrame } from "./frame";

const TERRACES = 7;

function terrace(i: number) {
  const k = 1 - i / TERRACES;
  const rx = 60 + k * 230;
  const ry = 44 + k * 160;
  const wob = 8 + k * 14;
  const points = Array.from({ length: 48 }, (_, s) => {
    const a = (s / 48) * Math.PI * 2;
    const r = 1 + (Math.sin(a * 3 + i) * wob) / 300;
    return `${(150 + Math.cos(a) * rx * r).toFixed(1)},${(150 + Math.sin(a) * ry * r).toFixed(1)}`;
  });
  return points.join(" ");
}

export function MiningSite({ uid = "mining" }: { uid?: string }) {
  return (
    <VisualFrame uid={uid} label="Open-pit mine with terraced benches, a haul route, vehicles, a worker safety zone and equipment-health markers." glow="50% 50%">
      <g transform={ISO(380, 40)}>
        {Array.from({ length: TERRACES }, (_, i) => (
          <polygon
            key={i}
            points={terrace(i)}
            fill={i % 2 ? "#0f0e0b" : "#131109"}
            stroke="#b79768"
            strokeOpacity={0.12 + (i / TERRACES) * 0.35}
          />
        ))}

        {/* Haul route */}
        <path
          d="M420 -40 C 380 30, 340 40, 300 60 C 230 90, 120 40, 60 100 C 20 140, 80 210, 150 200 C 210 190, 220 150, 180 140"
          fill="none"
          stroke="#d7c4a4"
          strokeOpacity="0.75"
          strokeWidth="1.6"
          strokeDasharray="6 6"
        />
        {[
          [300, 60],
          [60, 100],
          [150, 200],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x - 10} y={y - 6} width="20" height="12" rx="2" fill="#2a2416" stroke="#d7c4a4" strokeOpacity="0.9" />
        ))}

        <g className="reveal-on-hover">
          {/* Worker safety zone and vehicle interaction */}
          <circle cx="250" cy="250" r="44" fill="#b79768" fillOpacity="0.07" stroke="#d7c4a4" strokeOpacity="0.6" strokeDasharray="4 4" />
          <circle cx="250" cy="250" r="4" fill="#d7c4a4" />
          <circle cx="60" cy="100" r="34" fill="none" stroke="#d7c4a4" strokeOpacity="0.5" />
          {/* Equipment health markers */}
          {[
            [330, 170],
            [-10, 200],
          ].map(([x, y]) => (
            <g key={`${x}`}>
              <circle cx={x} cy={y} r="14" fill="none" stroke="#b79768" strokeOpacity="0.7" />
              <path d={`M${x - 8} ${y} h4 l3 -6 l3 10 l3 -4 h3`} fill="none" stroke="#d7c4a4" strokeWidth="1.2" />
            </g>
          ))}
        </g>
      </g>
      <rect width="800" height="600" fill={`url(#${uid}-fade)`} />
    </VisualFrame>
  );
}
