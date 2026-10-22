import { hash } from "@/lib/hash";
import { ISO, VisualFrame } from "./frame";

const fields = [
  { x: -120, y: -60, w: 200, h: 160, a: 0 },
  { x: 90, y: -60, w: 150, h: 160, a: 1 },
  { x: 250, y: -60, w: 190, h: 120, a: 0 },
  { x: -120, y: 110, w: 130, h: 200, a: 1 },
  { x: 20, y: 110, w: 220, h: 200, a: 0 },
  { x: 250, y: 70, w: 190, h: 240, a: 1 },
];

export function FarmingLayers({ uid = "farming" }: { uid?: string }) {
  return (
    <VisualFrame uid={uid} label="Aerial farmland with crop rows, a pivot irrigation circle, machinery paths and highlighted crop-health cells." glow="50% 45%">
      <defs>
        {fields.map((f, i) => (
          <clipPath key={i} id={`${uid}-f${i}`}>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} />
          </clipPath>
        ))}
      </defs>
      <g transform={ISO(400, 60)}>
        {fields.map((f, i) => (
          <g key={i}>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill={hash(i * 3.3) > 0.5 ? "#12110b" : "#0f0e0a"} stroke="#b79768" strokeOpacity="0.14" />
            <g clipPath={`url(#${uid}-f${i})`} stroke="#b79768" strokeOpacity={0.07 + hash(i) * 0.05}>
              {Array.from({ length: 40 }, (_, k) =>
                f.a ? (
                  <line key={k} x1={f.x + k * 9} y1={f.y} x2={f.x + k * 9} y2={f.y + f.h} />
                ) : (
                  <line key={k} x1={f.x} y1={f.y + k * 9} x2={f.x + f.w} y2={f.y + k * 9} />
                ),
              )}
            </g>
          </g>
        ))}

        {/* Centre pivot irrigation */}
        <circle cx="130" cy="210" r="90" fill="#b79768" fillOpacity="0.03" stroke="#b79768" strokeOpacity="0.45" />
        <circle cx="130" cy="210" r="60" fill="none" stroke="#b79768" strokeOpacity="0.2" strokeDasharray="3 5" />
        <line x1="130" y1="210" x2="200" y2="153" stroke="#d7c4a4" strokeOpacity="0.8" strokeWidth="1.4" />
        <circle cx="130" cy="210" r="3" fill="#d7c4a4" />

        {/* Crop-health cells */}
        <g className="reveal-on-hover">
          {Array.from({ length: 24 }, (_, k) => {
            const cx = 270 + (k % 6) * 26;
            const cy = 110 + Math.floor(k / 6) * 26;
            const v = hash(k * 7.7);
            return <rect key={k} x={cx} y={cy} width="22" height="22" fill="#b79768" fillOpacity={0.05 + v * 0.35} stroke="#d7c4a4" strokeOpacity={v > 0.75 ? 0.6 : 0.12} />;
          })}
        </g>

        {/* Machinery path */}
        <path d="M-110 -40 H 70 V -20 H -110 V 0 H 70 V 20 H -110" fill="none" stroke="#d7c4a4" strokeOpacity="0.55" strokeDasharray="4 6" className="reveal-on-hover" style={{ ["--delay" as string]: "200ms" }} />
        <rect x="-118" y="14" width="16" height="12" rx="2" fill="#2a2416" stroke="#d7c4a4" />
      </g>
      <rect width="800" height="600" fill={`url(#${uid}-fade)`} />
    </VisualFrame>
  );
}
