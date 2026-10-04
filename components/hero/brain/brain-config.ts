import { industries, type IndustrySlug } from "@/content/industries";

/**
 * Stage coordinates are percentages of the visualisation box.
 * Desktop: the box spans the right 56% of the hero, below the header, and the
 * globe sits at roughly 70% across / 51% down the viewport.
 * Tablet: the box sits below the hero text with the globe centred.
 * Mobile: nodes ride a slow ring instead (see `RING`).
 */
export const GLOBE = {
  desktop: { x: 46.5, y: 45 },
  tablet: { x: 50, y: 50 },
};

type Placement = {
  desktop: { x: number; y: number };
  tablet: { x: number; y: number };
  /** Perceived depth: >1 closer (larger, brighter), <1 further away. */
  depth: number;
  /** Curvature of the route back to the globe (signed, in stage %). */
  bend: number;
};

const PLACEMENT: Record<IndustrySlug, Placement> = {
  farming: { desktop: { x: 15, y: 15 }, tablet: { x: 17, y: 16 }, depth: 0.9, bend: -9 },
  airports: { desktop: { x: 79, y: 11 }, tablet: { x: 82, y: 14 }, depth: 0.86, bend: 8 },
  construction: { desktop: { x: 86, y: 39 }, tablet: { x: 88, y: 47 }, depth: 1.02, bend: -6 },
  "public-security": { desktop: { x: 78, y: 61 }, tablet: { x: 80, y: 82 }, depth: 1.08, bend: 7 },
  rail: { desktop: { x: 17, y: 78 }, tablet: { x: 20, y: 82 }, depth: 1.1, bend: -7 },
  mining: { desktop: { x: 7, y: 46 }, tablet: { x: 9, y: 50 }, depth: 0.94, bend: 6 },
};

/** Ring order on mobile, travelling clockwise. */
const RING_ORDER: IndustrySlug[] = ["rail", "mining", "farming", "airports", "construction", "public-security"];

/** Mobile ring: radii as % of stage width / height, and its step timing. */
export const RING = { rx: 30, ry: 31, hold: 5400, move: 1600 };

const round = (n: number) => Math.round(n * 100) / 100;

export const heroNodes = industries.map((industry) => {
  const p = PLACEMENT[industry.slug];
  const ringAngle = 60 + RING_ORDER.indexOf(industry.slug) * 60;
  const depth = Math.sin((ringAngle * Math.PI) / 180);
  return {
    slug: industry.slug,
    name: industry.name,
    href: industry.href,
    summary: industry.summary,
    tier: industry.tier,
    icon: `/assets/${industry.slug}-node.svg`,
    ...p,
    /** Labels sit on the side facing away from the globe so routes never cross them. */
    labelAbove: p.desktop.y < GLOBE.desktop.y,
    /** Mobile ring slot in degrees (90° is the front); 0–180° are the four visible slots. */
    ringAngle,
    /** First-frame ring position (% of stage) before the loop takes over. */
    ring: {
      x: round(50 + RING.rx * Math.cos((ringAngle * Math.PI) / 180)),
      y: round(50 + RING.ry * depth),
      visible: depth > -0.1,
    },
  };
});

export type HeroNode = (typeof heroNodes)[number];

/** The two routes highlighted as the illustrative active conflict. */
export const ACTIVE_ROUTES: IndustrySlug[] = ["rail", "construction"];

/**
 * Orbits around the globe. Radii are in `cqmin` of the stage; `tilt` is the
 * resting inclination, `sway` the slow drift either side of it. `period` is the
 * time for a body to travel once around; directions alternate for depth.
 */
export const ORBITS = [
  { rx: 21, ry: 7.5, tilt: -16, sway: 5, period: 28, reverse: false, opacity: 0.48 },
  { rx: 28, ry: 10.5, tilt: 22, sway: 6, period: 40, reverse: true, opacity: 0.36 },
  { rx: 34, ry: 9, tilt: -34, sway: 5, period: 50, reverse: false, opacity: 0.28 },
  { rx: 39, ry: 15, tilt: 7, sway: 4, period: 58, reverse: true, opacity: 0.3 },
  { rx: 45, ry: 13, tilt: 30, sway: 4, period: 74, reverse: false, opacity: 0.18 },
  { rx: 49, ry: 19, tilt: -11, sway: 3, period: 90, reverse: true, opacity: 0.12 },
] as const;

/** One full revolution of the globe about its axis, in ms. */
export const GLOBE_PERIOD = 24_000;

function quad(from: { x: number; y: number }, to: { x: number; y: number }, bend: number) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * bend;
  const cy = my + (dx / len) * bend;
  const r = (n: number) => Math.round(n * 100) / 100;
  return `M${r(from.x)} ${r(from.y)}Q${r(cx)} ${r(cy)} ${r(to.x)} ${r(to.y)}`;
}

/** Long route from an industry back into the globe (ends hidden behind it). */
export function routePath(node: HeroNode, layout: "desktop" | "tablet") {
  return quad(node[layout], GLOBE[layout], node.bend);
}

/** Quiet secondary routes between neighbouring industries, bowed towards the core. */
export function neighbourPaths(layout: "desktop" | "tablet") {
  const ring = RING_ORDER.map((slug) => heroNodes.find((n) => n.slug === slug)!);
  return ring.map((node, i) => {
    const next = ring[(i + 1) % ring.length];
    return { key: `${node.slug}-${next.slug}`, d: quad(node[layout], next[layout], 7) };
  });
}
