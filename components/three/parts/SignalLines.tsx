"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { brainNodes, RELATIONS, RISK_PAIR, type BrainStore } from "../brain-config";
import { hash, introStage, phases } from "../brain-math";

const SEGMENTS = 48;

const vertexShader = /* glsl */ `
  attribute float aT;
  varying float vT;
  void main() {
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uGold;
  uniform vec3 uAmber;
  uniform float uTime;
  uniform float uSeed;
  uniform float uFragment;
  uniform float uOpacity;
  uniform float uRisk;
  uniform float uHighlight;
  uniform float uFlow;
  varying float vT;

  void main() {
    // Fragmented: broken, uneven dashes. Understood: continuous line.
    float cell = floor(vT * 18.0 + uSeed * 7.0);
    float jitter = fract(sin(cell * 91.7 + uSeed * 13.1) * 4375.85);
    float d = fract(vT * 18.0 + uSeed * 7.0);
    float dash = step(uFragment * (0.45 + 0.4 * jitter), d);

    // Signals travel towards the core (vT = 1 at the core).
    float head = fract(uTime * uFlow + uSeed);
    float pulse = smoothstep(0.09, 0.0, abs(vT - head)) * step(vT, head + 0.001) ;
    float trail = smoothstep(0.22, 0.0, head - vT) * step(vT, head);

    float base = mix(0.22, 0.42, 1.0 - uFragment) + uHighlight * 0.45;
    float fadeEnds = smoothstep(0.0, 0.06, vT) * smoothstep(1.0, 0.94, vT);
    float alpha = (base * dash + pulse * 0.9 + trail * 0.25 * (1.0 - uFragment * 0.5)) * uOpacity * fadeEnds;

    vec3 color = mix(uGold, uAmber, uRisk) * (1.0 + pulse * 0.6 + uHighlight * 0.5);
    gl_FragColor = vec4(color, alpha);
  }
`;

type LineSpec = { kind: "core"; node: number } | { kind: "relation"; a: number; b: number };

export function SignalLines({ store }: { store: BrainStore }) {
  const specs = useMemo<LineSpec[]>(
    () => [
      ...brainNodes.map((_, node) => ({ kind: "core" as const, node })),
      ...RELATIONS.map(([a, b]) => ({ kind: "relation" as const, a, b })),
    ],
    [],
  );

  const lines = useMemo(() => {
    const gold = new THREE.Color("#b79768");
    const amber = new THREE.Color("#e0892b");
    return specs.map((spec, i) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array((SEGMENTS + 1) * 3);
      const ts = new Float32Array(SEGMENTS + 1);
      for (let s = 0; s <= SEGMENTS; s++) ts[s] = s / SEGMENTS;
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
      geometry.setAttribute("aT", new THREE.BufferAttribute(ts, 1));
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uGold: { value: gold },
          uAmber: { value: amber },
          uTime: { value: 0 },
          uSeed: { value: hash(i * 4.3) },
          uFragment: { value: 1 },
          uOpacity: { value: 0 },
          uRisk: { value: 0 },
          uHighlight: { value: 0 },
          uFlow: { value: spec.kind === "core" ? 0.22 + hash(i) * 0.12 : 0.12 },
        },
      });
      const object = new THREE.Line(geometry, material);
      object.frustumCulled = false;
      return { spec, object, positions, material, geometry, bend: (hash(i * 2.9) - 0.5) * 2 };
    });
  }, [specs]);

  useEffect(() => {
    return () => {
      lines.forEach((l) => {
        l.geometry.dispose();
        l.material.dispose();
      });
    };
  }, [lines]);

  useFrame(() => {
    const t = store.time;
    const ph = phases(store.p);
    const appear = introStage.lines(store.intro);

    for (const line of lines) {
      const { spec, positions, material } = line;
      const u = material.uniforms;
      let ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number;

      if (spec.kind === "core") {
        const p = store.nodeLocal[spec.node];
        ax = p.x; ay = p.y; az = p.z;
        // End on the core surface.
        const len = Math.hypot(ax, ay, az) || 1;
        bx = (ax / len) * 0.5; by = (ay / len) * 0.5; bz = (az / len) * 0.5;
        // Noisy, wandering paths while perceiving; clean gentle arcs once understood.
        const wander = ph.perceive * 1.3;
        cx = (ax + bx) * 0.5 + Math.sin(t * 0.7 + line.bend * 4) * wander * line.bend;
        cy = (ay + by) * 0.5 + 0.55 * ph.understand + Math.cos(t * 0.5 + line.bend * 3) * wander;
        cz = (az + bz) * 0.5 + Math.sin(t * 0.4 + line.bend) * wander * 0.6;

        const onRoute = spec.node === RISK_PAIR[0] || spec.node === RISK_PAIR[1];
        u.uFragment.value = ph.perceive;
        u.uOpacity.value = appear * (0.85 + ph.understand * 0.15);
        u.uRisk.value = spec.node === RISK_PAIR[0] ? ph.risk * 0.7 : 0;
        u.uHighlight.value = onRoute ? ph.highlight : 0;
        u.uFlow.value = onRoute ? 0.22 + ph.highlight * 0.35 : u.uFlow.value;
      } else {
        const pa = store.nodeLocal[spec.a];
        const pb = store.nodeLocal[spec.b];
        ax = pa.x; ay = pa.y; az = pa.z;
        bx = pb.x; by = pb.y; bz = pb.z;
        cx = (ax + bx) * 0.5 * 1.16;
        cy = (ay + by) * 0.5 * 1.16 + 0.15;
        cz = (az + bz) * 0.5 * 1.16;

        const isConflict =
          (spec.a === RISK_PAIR[0] && spec.b === RISK_PAIR[1]) ||
          (spec.a === RISK_PAIR[1] && spec.b === RISK_PAIR[0]);
        u.uFragment.value = 0.15 * (1 - ph.understand);
        u.uOpacity.value = appear * ph.understand * (isConflict ? 0.55 + ph.risk * 0.6 : 0.5) * (1 - ph.highlight * 0.35);
        u.uRisk.value = isConflict ? ph.risk : 0;
        u.uHighlight.value = 0;
      }

      u.uTime.value = t;
      for (let s = 0; s <= SEGMENTS; s++) {
        const k = s / SEGMENTS;
        const a = (1 - k) * (1 - k);
        const b = 2 * (1 - k) * k;
        const c = k * k;
        positions[s * 3] = a * ax + b * cx + c * bx;
        positions[s * 3 + 1] = a * ay + b * cy + c * by;
        positions[s * 3 + 2] = a * az + b * cz + c * bz;
      }
      (line.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <group>
      {lines.map((line, i) => (
        <primitive key={i} object={line.object} />
      ))}
    </group>
  );
}
