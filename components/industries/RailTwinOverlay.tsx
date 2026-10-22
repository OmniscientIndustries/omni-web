/** Positions are percentages of the rail-operational-intelligence image (native aspect). */
const INSPECTION_POINTS = [
  { x: 31.4, y: 46, d: 80 },
  { x: 56.6, y: 54, d: 240 },
  { x: 70.2, y: 27, d: 400 },
  { x: 39.6, y: 83, d: 560 },
  { x: 90.5, y: 52, d: 720 },
];

/** Hover layer: physical railway → subtle digital-twin overlay with one inspection scan. */
export function RailTwinOverlay() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="reveal-on-hover absolute inset-0 bg-[linear-gradient(rgb(183_151_104/0.08)_1px,transparent_1px),linear-gradient(90deg,rgb(183_151_104/0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
      {INSPECTION_POINTS.map((p) => (
        <span
          key={`${p.x}-${p.y}`}
          className="reveal-on-hover absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%`, ["--delay" as string]: `${p.d}ms` }}
        >
          <span className="block size-5 rounded-full border border-gold-bright/80 shadow-[0_0_14px_rgb(215_196_164/0.5)]" />
          <span className="absolute inset-0 m-auto block size-1.5 rounded-full bg-gold-bright" />
        </span>
      ))}
      <div className="card-scan absolute inset-y-0 left-0 w-[10%] bg-[linear-gradient(90deg,transparent,rgb(215_196_164/0.22),transparent)]">
        <div className="absolute inset-y-0 left-1/2 w-px bg-gold-bright/70" />
      </div>
    </div>
  );
}
