import type { ReactNode } from "react";

export const W = 800;
export const H = 600;

/** Isometric plane transform: plan (x, y) → screen. */
export const ISO = (tx: number, ty: number) => `matrix(0.866 0.5 -0.866 0.5 ${tx} ${ty})`;

export function iso(x: number, y: number, h = 0, tx = 0, ty = 0): [number, number] {
  return [0.866 * x - 0.866 * y + tx, 0.5 * x + 0.5 * y + ty - h];
}

export const pts = (list: [number, number][]) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

export function VisualFrame({
  uid,
  children,
  label,
  glow = "60% 40%",
}: {
  uid: string;
  children: ReactNode;
  label: string;
  glow?: string;
}) {
  const [gx, gy] = glow.split(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
      role="img"
      aria-label={label}
    >
      <defs>
        <radialGradient id={`${uid}-bg`} cx={gx} cy={gy} r="0.85">
          <stop offset="0" stopColor="#1a1710" />
          <stop offset="0.55" stopColor="#0b0a08" />
          <stop offset="1" stopColor="#050505" />
        </radialGradient>
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0" stopColor="#d7c4a4" stopOpacity="0.9" />
          <stop offset="0.35" stopColor="#b79768" stopOpacity="0.3" />
          <stop offset="1" stopColor="#b79768" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050505" stopOpacity="0" />
          <stop offset="1" stopColor="#050505" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${uid}-bg)`} />
      {children}
    </svg>
  );
}
