"use client";

import { useEffect, useRef, type CSSProperties, type Ref } from "react";
import { BrainNodes } from "./BrainNodes";
import { ACTIVE_ROUTES, GLOBE, GLOBE_PERIOD, heroNodes, neighbourPaths, ORBITS, RING, routePath } from "./brain-config";
import { drawGlobe } from "./draw-globe";

const LAYOUTS = ["desktop", "tablet"] as const;

function Orbits({ half }: { half: "back" | "front" }) {
  return (
    <div aria-hidden className={`brain-layer brain-orbits brain-orbits-${half}`}>
      {ORBITS.map((o, i) => (
        <div
          key={i}
          className="brain-orbit"
          data-orbit={i}
          style={
            {
              "--rx": o.rx,
              "--ry": o.ry,
              "--tilt": `${o.tilt}deg`,
              "--sway": `${o.sway}deg`,
              "--period": `${o.period}s`,
              "--dir": o.reverse ? "reverse" : "normal",
              "--o": o.opacity,
              "--start": `${-o.period * ((i * 0.37) % 1)}s`,
            } as CSSProperties
          }
        >
          <span className="brain-orbit-bead" />
        </div>
      ))}
    </div>
  );
}

function Routes() {
  return (
    <svg aria-hidden className="brain-layer brain-routes" viewBox="0 0 100 100" preserveAspectRatio="none">
      {LAYOUTS.map((layout) => (
        <g key={layout} className={`brain-routes-${layout}`}>
          {neighbourPaths(layout).map((p) => (
            <path key={p.key} d={p.d} className="brain-route-secondary" vectorEffect="non-scaling-stroke" />
          ))}
          {heroNodes.map((node) => (
            <path
              key={node.slug}
              d={routePath(node, layout)}
              pathLength={100}
              className="brain-route"
              data-active-route={ACTIVE_ROUTES.includes(node.slug) || undefined}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {heroNodes.map((node, i) => (
            <path
              key={`${node.slug}-pulse`}
              d={routePath(node, layout)}
              pathLength={100}
              className="brain-pulse"
              data-active-route={ACTIVE_ROUTES.includes(node.slug) || undefined}
              vectorEffect="non-scaling-stroke"
              style={{ animationDelay: `${-i * 1.45}s` }}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * One rAF loop drives the canvas globe and, on phones, the node ring.
 * No React state is touched per frame; it stops whenever the hero is
 * off-screen, the tab is hidden or reduced motion is requested.
 */
function useBrainLoop(stageRef: React.RefObject<HTMLDivElement | null>, canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!stage || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ringMq = window.matchMedia("(max-width: 767.98px)");
    const nodes = [...stage.querySelectorAll<HTMLElement>("[data-ring-angle]")];
    const spokes = new Map([...stage.querySelectorAll<HTMLElement>("[data-spoke]")].map((el) => [el.dataset.spoke, el]));

    let size = 0;
    let width = 0;
    let height = 0;
    let spinMs = 0;
    let ringMs = 0;
    let last = 0;
    let raf = 0;
    let ringApplied = false;

    const draw = () => {
      if (size > 0) drawGlobe(ctx, size, (spinMs / GLOBE_PERIOD) * Math.PI * 2);
    };

    const placeRing = () => {
      if (!ringMq.matches) {
        if (ringApplied) {
          for (const el of [...nodes, ...spokes.values()]) {
            for (const prop of ["transform", "opacity", "z-index", "pointer-events"]) el.style.removeProperty(prop);
          }
          ringApplied = false;
        }
        return;
      }
      ringApplied = true;
      const cycle = RING.hold + RING.move;
      const step = Math.floor(ringMs / cycle) + ease(Math.max(0, (ringMs % cycle) - RING.hold) / RING.move);
      for (const el of nodes) {
        const theta = ((Number(el.dataset.ringAngle) + step * 60) * Math.PI) / 180;
        const depth = Math.sin(theta);
        // Without motion the far nodes never come round, so they sit clear above the globe instead.
        const still = reduce.matches;
        const lift = still && depth < 0 ? 1.25 : 1;
        const x = width * (0.5 + (RING.rx / 100) * Math.cos(theta));
        const y = height * (0.5 + (RING.ry / 100) * depth * lift);
        const shown = still ? 1 : smooth(-0.55, -0.05, depth);
        el.dataset.ringLabel = still && depth < -0.2 ? "above" : "below";
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${(0.86 + 0.14 * ((depth + 1) / 2)).toFixed(3)})`;
        el.style.opacity = shown.toFixed(3);
        el.style.zIndex = depth > -0.2 || still ? "4" : "1";
        el.style.pointerEvents = shown < 0.3 ? "none" : "";
        const spoke = spokes.get(el.dataset.slug);
        if (spoke) {
          const dx = x - width / 2;
          const dy = y - height / 2;
          spoke.style.transform = `translate3d(${width / 2}px, ${height / 2}px, 0) rotate(${Math.atan2(dy, dx)}rad) scaleX(${Math.hypot(dx, dy).toFixed(1)})`;
          spoke.style.opacity = (shown * 0.9).toFixed(3);
        }
      }
    };

    const running = () => stage.dataset.running !== "false" && !reduce.matches;

    let lastDraw = 0;
    let lastStep = -1;
    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      spinMs += dt;
      if (!stage.dataset.hold) ringMs += dt;
      // The globe turns ~15°/s, so 30 fps is visually identical and halves the paint cost.
      if (now - lastDraw >= 32) {
        lastDraw = now;
        draw();
      }
      const cycle = RING.hold + RING.move;
      const step = ringMs % cycle < RING.hold ? Math.floor(ringMs / cycle) : -2;
      if (step !== lastStep || step === -2) placeRing();
      lastStep = step;
      if (running()) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const start = () => {
      if (!raf && running()) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      size = rect.width;
      width = stage.clientWidth;
      height = stage.clientHeight;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
      placeRing();
    };

    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(stage);
    sizeObserver.observe(canvas);
    const attrObserver = new MutationObserver(start);
    attrObserver.observe(stage, { attributes: true, attributeFilter: ["data-running"] });
    const onMode = () => {
      draw();
      placeRing();
      start();
    };
    reduce.addEventListener("change", onMode);
    ringMq.addEventListener("change", onMode);
    resize();
    start();

    return () => {
      cancelAnimationFrame(raf);
      sizeObserver.disconnect();
      attrObserver.disconnect();
      reduce.removeEventListener("change", onMode);
      ringMq.removeEventListener("change", onMode);
    };
  }, [stageRef, canvasRef]);
}

/**
 * The Company Brain: a compact rotating globe at the core of a large orbital
 * system, with the six operating environments connected back into it.
 */
export function CompanyBrainOrbit({ ref }: { ref: Ref<HTMLDivElement> }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useBrainLoop(stageRef, canvasRef);

  const setRefs = (el: HTMLDivElement | null) => {
    stageRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  return (
    <div
      ref={setRefs}
      className="brain-stage"
      data-phase="perceive"
      data-status="perceive"
      data-running="true"
      style={
        {
          "--gx-d": GLOBE.desktop.x,
          "--gy-d": GLOBE.desktop.y,
          "--gx-t": GLOBE.tablet.x,
          "--gy-t": GLOBE.tablet.y,
        } as CSSProperties
      }
    >
      <Routes />
      <div aria-hidden className="brain-layer brain-spokes">
        {heroNodes.map((node) => (
          <span key={node.slug} data-spoke={node.slug} className="brain-spoke" />
        ))}
      </div>
      <Orbits half="back" />
      <div aria-hidden className="brain-globe">
        <canvas ref={canvasRef} className="brain-globe-canvas" />
      </div>
      <Orbits half="front" />
      <BrainNodes />
    </div>
  );
}
