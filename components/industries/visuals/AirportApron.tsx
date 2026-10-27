import { VisualFrame } from "./frame";

const AIRCRAFT =
  "M0 -120 C 7 -120 10 -108 10 -92 L 10 -30 L 96 8 L 96 22 L 10 4 L 10 70 L 34 88 L 34 98 L 0 90 L -34 98 L -34 88 L -10 70 L -10 4 L -96 22 L -96 8 L -10 -30 L -10 -92 C -10 -108 -7 -120 0 -120 Z";

export function AirportApron({ uid = "airports" }: { uid?: string }) {
  return (
    <VisualFrame uid={uid} label="Airport apron at night: an aircraft on stand with ground-vehicle routes and a turnaround timeline." glow="50% 35%">
      <g transform="rotate(-24 400 300)">
        {/* Taxiway and stand markings */}
        <path d="M-100 120 H 900" stroke="#d3af37" strokeOpacity="0.32" strokeWidth="1.2" strokeDasharray="14 10" />
        <path d="M-100 128 H 900" stroke="#1a1810" strokeWidth="44" strokeOpacity="0.6" />
        {[160, 400, 640].map((x) => (
          <g key={x}>
            <path d={`M${x} 140 C ${x} 200, ${x} 220, ${x} 330`} fill="none" stroke="#d3af37" strokeOpacity="0.4" strokeWidth="1.2" />
            <rect x={x - 110} y="210" width="220" height="250" fill="none" stroke="#d3af37" strokeOpacity="0.08" />
            <circle cx={x} cy="140" r="3" fill="#d3af37" fillOpacity="0.6" />
          </g>
        ))}

        {/* Aircraft on stand */}
        <g transform="translate(400 330) scale(1.05)">
          <path d={AIRCRAFT} fill="#14120d" stroke="#e2c25a" strokeOpacity="0.75" strokeWidth="1.2" />
          <path d="M0 -110 V 82" stroke="#d3af37" strokeOpacity="0.2" />
        </g>
        <g transform="translate(640 340) scale(0.9)" opacity="0.5">
          <path d={AIRCRAFT} fill="#100e0b" stroke="#d3af37" strokeOpacity="0.4" />
        </g>

        {/* Ground vehicle routes */}
        <g className="reveal-on-hover">
          <path d="M120 520 C 220 500, 300 420, 360 380" fill="none" stroke="#f0cf68" strokeOpacity="0.8" strokeDasharray="3 6" strokeWidth="1.4" />
          <path d="M700 520 C 600 500, 520 430, 450 370" fill="none" stroke="#f0cf68" strokeOpacity="0.8" strokeDasharray="3 6" strokeWidth="1.4" />
          <path d="M260 560 C 300 480, 330 420, 380 300" fill="none" stroke="#d3af37" strokeOpacity="0.55" strokeDasharray="3 6" />
          <circle cx="360" cy="380" r="22" fill="none" stroke="#f0cf68" strokeOpacity="0.5" />
          <circle cx="450" cy="370" r="22" fill="none" stroke="#f0cf68" strokeOpacity="0.5" />
        </g>
        {[
          [120, 520],
          [700, 520],
          [260, 560],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x - 9} y={y - 5} width="18" height="10" rx="2" fill="#2a2416" stroke="#e2c25a" strokeOpacity="0.8" />
        ))}
      </g>

      {/* Apron lights */}
      {[
        [90, 60],
        [300, 30],
        [560, 50],
        [740, 120],
      ].map(([x, y]) => (
        <circle key={`${x}`} cx={x} cy={y} r="40" fill={`url(#${uid}-glow)`} opacity="0.35" />
      ))}

      {/* Turnaround timeline */}
      <g className="reveal-on-hover" transform="translate(470 92)" style={{ ["--delay" as string]: "300ms" }}>
        <rect width="270" height="64" rx="8" fill="#050505" fillOpacity="0.7" stroke="#d3af37" strokeOpacity="0.3" />
        {[
          [14, 70, 0.9],
          [60, 120, 0.6],
          [110, 200, 0.45],
          [150, 250, 0.75],
        ].map(([x, x2, o], i) => (
          <rect key={i} x={x} y={14 + i * 10} width={x2 - x} height="5" rx="2.5" fill="#d3af37" fillOpacity={o} />
        ))}
        <line x1="128" y1="8" x2="128" y2="58" stroke="#f0cf68" strokeWidth="1" />
      </g>

      <rect width="800" height="600" fill={`url(#${uid}-fade)`} />
    </VisualFrame>
  );
}
