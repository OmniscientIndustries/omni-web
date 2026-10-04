import { hash } from "@/lib/hash";

const GOLD = "211,175,55";
const GOLD_BRIGHT = "240,207,104";

/** Camera sits slightly above the equator; the axis leans a little, like a real globe. */
const TILT = 0.36;
const ROLL = -0.2;
const cosT = Math.cos(TILT);
const sinT = Math.sin(TILT);
const cosR = Math.cos(ROLL);
const sinR = Math.sin(ROLL);
const RAD = Math.PI / 180;

type P = { x: number; y: number; z: number };

function project(lat: number, lon: number, spin: number, r = 1): P {
  const l = lon + spin;
  const x = Math.cos(lat) * Math.sin(l) * r;
  const y0 = Math.sin(lat) * r;
  const z0 = Math.cos(lat) * Math.cos(l) * r;
  const y = y0 * cosT - z0 * sinT;
  const z = y0 * sinT + z0 * cosT;
  return { x: x * cosR - y * sinR, y: x * sinR + y * cosR, z };
}

/** Restrained infrastructure points, loosely clustered on land-like bands. */
const POINTS = Array.from({ length: 54 }, (_, i) => ({
  lat: (hash(i * 3.17) * 120 - 55) * RAD,
  lon: hash(i * 7.31) * Math.PI * 2,
  hub: i % 9 === 0,
}));

/** A few quiet network links between hubs (great-circle arcs, slightly lifted). */
const LINKS = [
  [0, 9],
  [9, 18],
  [18, 36],
  [27, 45],
  [36, 0],
  [45, 9],
].map(([a, b]) => [POINTS[a], POINTS[b]] as const);

function slerp(a: (typeof POINTS)[number], b: (typeof POINTS)[number], t: number) {
  const va = [Math.cos(a.lat) * Math.cos(a.lon), Math.cos(a.lat) * Math.sin(a.lon), Math.sin(a.lat)];
  const vb = [Math.cos(b.lat) * Math.cos(b.lon), Math.cos(b.lat) * Math.sin(b.lon), Math.sin(b.lat)];
  const dot = Math.min(1, Math.max(-1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]));
  const om = Math.acos(dot) || 1e-6;
  const s = Math.sin(om);
  const k1 = Math.sin((1 - t) * om) / s;
  const k2 = Math.sin(t * om) / s;
  const v = [va[0] * k1 + vb[0] * k2, va[1] * k1 + vb[1] * k2, va[2] * k1 + vb[2] * k2];
  return { lat: Math.asin(v[2]), lon: Math.atan2(v[1], v[0]) };
}

/**
 * Draws the compact Company Brain globe. `spin` is the rotation about its own
 * vertical axis in radians. Everything is stroked thinly; no bloom, no spikes.
 */
export function drawGlobe(ctx: CanvasRenderingContext2D, size: number, spin: number) {
  const c = size / 2;
  const R = size * 0.46;
  const line = Math.max(1, size / 260);
  ctx.clearRect(0, 0, size, size);

  // Near-black sphere with a faint warm key light from the upper left.
  const body = ctx.createRadialGradient(c - R * 0.38, c - R * 0.42, R * 0.05, c, c, R);
  body.addColorStop(0, "#1d1910");
  body.addColorStop(0.55, "#0c0b08");
  body.addColorStop(1, "#050505");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(c, c, R, 0, Math.PI * 2);
  ctx.fill();

  const front = new Path2D();
  const back = new Path2D();
  const equator = new Path2D();
  const segment = (a: P, b: P, target?: Path2D) => {
    const path = target ?? ((a.z + b.z) / 2 > 0 ? front : back);
    path.moveTo(c + a.x * R, c - a.y * R);
    path.lineTo(c + b.x * R, c - b.y * R);
  };

  // Latitudes.
  for (let lat = -60; lat <= 60; lat += 20) {
    let prev = project(lat * RAD, 0, spin);
    for (let i = 1; i <= 72; i++) {
      const p = project(lat * RAD, (i / 72) * Math.PI * 2, spin);
      if (lat === 0 && (prev.z + p.z) / 2 > 0) segment(prev, p, equator);
      else segment(prev, p);
      prev = p;
    }
  }
  // Longitudes.
  for (let lon = 0; lon < 360; lon += 30) {
    let prev = project(-90 * RAD, lon * RAD, spin);
    for (let i = 1; i <= 36; i++) {
      const p = project((-90 + i * 5) * RAD, lon * RAD, spin);
      segment(prev, p);
      prev = p;
    }
  }

  ctx.lineWidth = line * 0.8;
  ctx.strokeStyle = `rgba(${GOLD},0.07)`;
  ctx.stroke(back);
  ctx.strokeStyle = `rgba(${GOLD},0.3)`;
  ctx.stroke(front);
  ctx.lineWidth = line;
  ctx.strokeStyle = `rgba(${GOLD},0.5)`;
  ctx.stroke(equator);

  // Network links, front-facing segments only.
  const links = new Path2D();
  for (const [a, b] of LINKS) {
    let prev: P | null = null;
    for (let i = 0; i <= 28; i++) {
      const g = slerp(a, b, i / 28);
      const p = project(g.lat, g.lon, spin, 1 + Math.sin((i / 28) * Math.PI) * 0.05);
      if (prev && prev.z > 0.05 && p.z > 0.05) {
        links.moveTo(c + prev.x * R, c - prev.y * R);
        links.lineTo(c + p.x * R, c - p.y * R);
      }
      prev = p;
    }
  }
  ctx.lineWidth = line;
  ctx.strokeStyle = `rgba(${GOLD_BRIGHT},0.24)`;
  ctx.stroke(links);

  // Infrastructure points, fading towards the limb.
  for (const pt of POINTS) {
    const p = project(pt.lat, pt.lon, spin);
    if (p.z <= 0.04) continue;
    const x = c + p.x * R;
    const y = c - p.y * R;
    const alpha = 0.25 + p.z * 0.7;
    if (pt.hub) {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, R * 0.09);
      glow.addColorStop(0, `rgba(${GOLD_BRIGHT},${0.34 * alpha})`);
      glow.addColorStop(1, `rgba(${GOLD_BRIGHT},0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, R * 0.09, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = `rgba(${GOLD_BRIGHT},${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, (pt.hub ? 1.9 : 1.1) * line, 0, Math.PI * 2);
    ctx.fill();
  }

  // Terminator: the lower right falls into shadow for volume.
  const shade = ctx.createRadialGradient(c - R * 0.45, c - R * 0.5, R * 0.6, c - R * 0.2, c - R * 0.2, R * 1.45);
  shade.addColorStop(0, "rgba(5,5,5,0)");
  shade.addColorStop(1, "rgba(5,5,5,0.78)");
  ctx.fillStyle = shade;
  ctx.beginPath();
  ctx.arc(c, c, R, 0, Math.PI * 2);
  ctx.fill();

  // Rim light: a thin gold edge, brightest where the key light grazes it.
  ctx.lineWidth = line * 1.1;
  ctx.strokeStyle = `rgba(${GOLD},0.28)`;
  ctx.beginPath();
  ctx.arc(c, c, R, 0, Math.PI * 2);
  ctx.stroke();
  const rim = ctx.createLinearGradient(c - R, c - R, c + R * 0.6, c + R * 0.6);
  rim.addColorStop(0, `rgba(${GOLD_BRIGHT},0.75)`);
  rim.addColorStop(0.55, `rgba(${GOLD_BRIGHT},0)`);
  ctx.lineWidth = line * 2;
  ctx.strokeStyle = rim;
  ctx.beginPath();
  ctx.arc(c, c, R - line, Math.PI * 0.85, Math.PI * 1.75);
  ctx.stroke();
}
