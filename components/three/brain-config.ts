import { industries, type IndustrySlug } from "@/content/industries";

/** Tilt (radians) of the shared orbital plane towards the viewer. */
export const RING_TILT = 0.5;
export const NODE_RADIUS = 3.3;
export const INTRO_SECONDS = 2.4;

const ANGLES: Record<IndustrySlug, number> = {
  rail: 122,
  "public-security": 58,
  construction: 2,
  airports: 298,
  farming: 238,
  mining: 178,
};

export const brainNodes = industries.map((industry) => ({
  slug: industry.slug,
  name: industry.name,
  href: industry.href,
  summary: industry.summary,
  tier: industry.tier,
  angle: (ANGLES[industry.slug] * Math.PI) / 180,
}));

/** Indices for the illustrative Act-phase conflict. */
export const RISK_PAIR = [
  brainNodes.findIndex((n) => n.slug === "rail"),
  brainNodes.findIndex((n) => n.slug === "construction"),
] as const;

/** Relationships that form during the Understand phase. */
export const RELATIONS: [number, number][] = [
  ...brainNodes.map((_, i) => [i, (i + 1) % brainNodes.length] as [number, number]),
  [RISK_PAIR[0], RISK_PAIR[1]],
  [1, 4],
];

export type Quality = "high" | "low";

/** Mutable, frame-shared state. Never stored in React state. */
export type BrainStore = {
  /** Scroll progress target, written by ScrollTrigger (0..1). */
  progress: number;
  /** Smoothed progress used by the scene. */
  p: number;
  intro: number;
  time: number;
  pointer: { x: number; y: number };
  active: number;
  nodeLocal: { x: number; y: number; z: number }[];
  anchors: (HTMLElement | null)[];
};

export function createBrainStore(): BrainStore {
  return {
    progress: 0,
    p: 0,
    intro: 0,
    time: 0,
    pointer: { x: 0, y: 0 },
    active: -1,
    nodeLocal: brainNodes.map(() => ({ x: 0, y: 0, z: 0 })),
    anchors: brainNodes.map(() => null),
  };
}
