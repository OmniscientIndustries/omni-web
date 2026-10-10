import * as THREE from "three";

/**
 * Crisp industry icons, authored as SVG path data in a 128×128 box and rasterised
 * once to a high-DPI CanvasTexture. Drawn as white masks so the 3D material can
 * tint them gold (or amber on the risk node) and fade them with the intro clock.
 * Each silhouette is distinct, with a consistent stroke weight.
 */

type Stroke = { d: string; w?: number };
type IconSpec = {
  /** Filled silhouette paths (e.g. the aircraft body). */
  fills?: string[];
  /** Stroked line paths. */
  strokes?: Stroke[];
};

const VIEWBOX = 128;
const DEFAULT_WIDTH = 6.5;

const ICONS: Record<string, IconSpec> = {
  // Wheat stalk — a central stem with four pairs of grains and a tip.
  farming: {
    strokes: [
      {
        d: "M64 116 L64 56 M64 56 L55 46 M64 56 L73 46 M64 70 L52 61 M64 70 L76 61 M64 84 L52 75 M64 84 L76 75 M64 98 L52 89 M64 98 L76 89",
      },
    ],
  },
  // Aircraft, planform — a clean swept silhouette pointing up.
  airports: {
    fills: [
      "M64 26 C68 26 70 33 70 42 L70 58 L98 76 L98 84 L70 73 L70 94 L80 102 L80 108 L64 101 L48 108 L48 102 L58 94 L58 73 L30 84 L30 76 L58 58 L58 42 C58 33 60 26 64 26 Z",
    ],
  },
  // Cut gem — mineral extraction, with crown and pavilion facets.
  mining: {
    strokes: [
      { d: "M42 54 L86 54 L100 70 L64 110 L28 70 Z" },
      {
        d: "M28 70 L100 70 M42 54 L54 70 M64 54 L54 70 M64 54 L74 70 M86 54 L74 70 M54 70 L64 110 M74 70 L64 110",
        w: 4.5,
      },
    ],
  },
  // Tower crane — mast, jib, cables and a hanging hook.
  construction: {
    strokes: [
      {
        d: "M40 112 L60 112 M50 112 L50 46 M30 46 L100 46 M50 30 L30 46 M50 30 L100 46 M88 46 L88 62 M81 62 L95 62 L88 70 L81 62",
      },
    ],
  },
  // Railway track in perspective — two converging rails and sleepers.
  rail: {
    strokes: [
      {
        d: "M47 112 L57 44 M81 112 L71 44 M43 104 L85 104 M46 89 L82 89 M49 74 L79 74 M52 59 L76 59",
      },
    ],
  },
  // Shield with a check — security insignia.
  "public-security": {
    strokes: [
      { d: "M64 26 L97 39 L97 68 C97 91 82 104 64 111 C46 104 31 91 31 68 L31 39 Z" },
      { d: "M49 68 L60 80 L81 54", w: 7.5 },
    ],
  },
};

ICONS.default = ICONS.mining;

export function createIndustryIcon(slug: string, size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const scale = size / VIEWBOX;
  ctx.scale(scale, scale);
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const spec = ICONS[slug] ?? ICONS.default;
  for (const d of spec.fills ?? []) ctx.fill(new Path2D(d));
  for (const s of spec.strokes ?? []) {
    ctx.lineWidth = s.w ?? DEFAULT_WIDTH;
    ctx.stroke(new Path2D(s.d));
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
