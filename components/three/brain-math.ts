import { brainNodes, NODE_RADIUS, RING_TILT } from "./brain-config";

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

/** Deterministic pseudo-random in [0,1) per seed. */
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export type Phases = {
  perceive: number;
  understand: number;
  act: number;
  risk: number;
  highlight: number;
  resolved: number;
};

/** Maps smoothed scroll progress onto Perceive → Understand → Act. */
export function phases(p: number): Phases {
  const understand = smoothstep(0.16, 0.44, p);
  const act = smoothstep(0.56, 0.66, p);
  const risk = smoothstep(0.58, 0.68, p) * (1 - smoothstep(0.84, 0.93, p));
  const highlight = smoothstep(0.7, 0.8, p) * (1 - smoothstep(0.9, 0.99, p));
  const resolved = smoothstep(0.86, 0.96, p);
  return { perceive: 1 - understand, understand, act, risk, highlight, resolved };
}

/** Intro sub-sequence windows (0..1 of the intro clock). */
export const introStage = {
  point: (t: number) => smoothstep(0.0, 0.16, t),
  core: (t: number) => smoothstep(0.08, 0.55, t),
  rings: (t: number) => smoothstep(0.3, 0.65, t),
  nodes: (i: number, t: number) => smoothstep(0.48 + i * 0.035, 0.68 + i * 0.035, t),
  lines: (t: number) => smoothstep(0.66, 0.98, t),
};

const cosT = Math.cos(RING_TILT);
const sinT = Math.sin(RING_TILT);

/**
 * Node position: scattered and drifting while perceiving, settled on the
 * tilted orbital plane once understood.
 */
export function nodePosition(
  i: number,
  understand: number,
  time: number,
  out: { x: number; y: number; z: number },
) {
  const a = brainNodes[i].angle;
  // Organised: circle in XZ, then rotated about X by RING_TILT.
  const ox = Math.cos(a) * NODE_RADIUS;
  const oz0 = Math.sin(a) * NODE_RADIUS;
  const oy = -oz0 * sinT;
  const oz = oz0 * cosT;

  // Scattered: off-plane, further out, drifting gently.
  const r = NODE_RADIUS * (0.92 + hash(i + 1) * 0.2);
  const ja = a + (hash(i + 7) - 0.5) * 0.45;
  const drift = Math.sin(time * 0.6 + i * 1.7) * 0.12;
  const sx = Math.cos(ja) * r;
  const sz0 = Math.sin(ja) * r;
  const sy = -sz0 * sinT * 0.6 + (hash(i + 13) - 0.5) * 1.6 + drift;
  const sz = sz0 * cosT;

  const k = understand;
  out.x = sx + (ox - sx) * k;
  out.y = sy + (oy - sy) * k + Math.sin(time * 0.8 + i) * 0.03 * k;
  out.z = sz + (oz - sz) * k;
  return out;
}
