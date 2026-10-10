"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { BrainStore, Quality } from "../brain-config";
import { hash, introStage, phases } from "../brain-math";

const vertexShader = /* glsl */ `
  attribute float aSeed;
  attribute vec3 aOrbit; // radius, angular speed, vertical amplitude
  attribute float aInflow;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uInflow;
  varying float vAlpha;

  void main() {
    float angle = aSeed * 6.2831 + uTime * aOrbit.y;
    float radius = aOrbit.x;
    // A subset of signals is drawn inwards to the core while perceiving.
    float travel = fract(uTime * 0.07 + aSeed * 3.7);
    radius = mix(radius, mix(radius, 0.8, travel), aInflow * uInflow);
    vec3 p = vec3(cos(angle) * radius, sin(angle * 0.7 + aSeed * 11.0) * aOrbit.z, sin(angle) * radius);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.55 + fract(aSeed * 13.0) * 0.9) / -mv.z;
    vAlpha = (0.35 + 0.65 * fract(aSeed * 7.0)) * (1.0 - aInflow * uInflow * travel * 0.8);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
  }
`;

export function AmbientSignals({ store, quality }: { store: BrainStore; quality: Quality }) {
  const count = quality === "high" ? 220 : 110;
  const dpr = useThree((s) => s.viewport.dpr);

  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const seeds = new Float32Array(count);
    const orbits = new Float32Array(count * 3);
    const inflow = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      seeds[i] = hash(i * 1.37);
      orbits[i * 3] = 1.6 + hash(i * 2.11) * 4.6;
      orbits[i * 3 + 1] = (0.03 + hash(i * 3.7) * 0.09) * (hash(i * 5.3) > 0.5 ? 1 : -1);
      orbits[i * 3 + 2] = 0.2 + hash(i * 4.9) * 1.6;
      inflow[i] = hash(i * 8.1) > 0.72 ? 1 : 0;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute("aOrbit", new THREE.BufferAttribute(orbits, 3));
    geometry.setAttribute("aInflow", new THREE.BufferAttribute(inflow, 1));
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 52 },
        uPixelRatio: { value: 1 },
        uInflow: { value: 1 },
        uOpacity: { value: 0 },
        uColor: { value: new THREE.Color("#e6c463") },
      },
    });
    return { geometry, material };
  }, [count]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(() => {
    const ph = phases(store.p);
    const u = material.uniforms;
    u.uTime.value = store.time;
    u.uPixelRatio.value = dpr;
    u.uInflow.value = ph.perceive;
    // Visual noise reduces as the world becomes coherent.
    u.uOpacity.value = introStage.lines(store.intro) * (0.3 + 0.6 * ph.perceive);
  });

  return <points geometry={geometry} material={material} frustumCulled={false} rotation={[0.5, 0, 0]} />;
}
