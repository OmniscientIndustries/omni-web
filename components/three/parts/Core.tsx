"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RING_TILT, type BrainStore, type Quality } from "../brain-config";
import { easeOutCubic, hash, introStage, phases } from "../brain-math";

const CORE_RADIUS = 0.44;
const UP = new THREE.Vector3(0, 1, 0);
const RING_NORMAL = new THREE.Vector3(0, Math.cos(RING_TILT), Math.sin(RING_TILT));

type Props = { store: BrainStore; quality: Quality; halo: THREE.Texture };

export function Core({ store, quality, halo }: Props) {
  const count = quality === "high" ? 320 : 180;
  const blades = useRef<THREE.InstancedMesh>(null);
  const sphere = useRef<THREE.Mesh>(null);
  const rim = useRef<THREE.Mesh>(null);
  const tips = useRef<THREE.Points>(null);
  const glow = useRef<THREE.Sprite>(null);
  const spark = useRef<THREE.Mesh>(null);
  const settled = useRef(false);

  const assets = useMemo(() => {
    // Fine tapered filaments rather than broad blades — the core reads as a
    // dense neural web, not a spiky sun.
    const bladeGeometry = new THREE.ConeGeometry(1, 1, 5, 1);
    bladeGeometry.translate(0, 0.5, 0);
    const bladeMaterial = new THREE.MeshStandardMaterial({
      color: "#d9b443",
      metalness: 1,
      roughness: 0.3,
      emissive: "#4a3406",
      emissiveIntensity: 0.75,
    });
    const sphereGeometry = new THREE.SphereGeometry(CORE_RADIUS, 64, 48);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: "#0b0a08",
      metalness: 0.85,
      roughness: 0.45,
      clearcoat: 0.6,
      clearcoatRoughness: 0.35,
    });
    // Additive back-side shell gives the dark core a soft gold rim.
    const rimGeometry = new THREE.SphereGeometry(CORE_RADIUS * 1.12, 48, 32);
    const rimMaterial = new THREE.MeshBasicMaterial({
      color: "#e8c766",
      transparent: true,
      opacity: 0,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const sparkGeometry = new THREE.SphereGeometry(0.05, 16, 12);
    const sparkMaterial = new THREE.MeshBasicMaterial({ color: "#ffe9a8", toneMapped: false });
    const glowMaterial = new THREE.SpriteMaterial({
      map: halo,
      color: "#d3af37",
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Fibonacci sphere directions. Short, fairly uniform filaments with a mild
    // emphasis toward the orbital plane keep the core spherical and intricate.
    const golden = Math.PI * (3 - Math.sqrt(5));
    const blades = Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const dir = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r);
      const planar = 1 - Math.abs(dir.dot(RING_NORMAL));
      const length = 0.07 + 0.14 * hash(i * 3.1) + 0.16 * Math.pow(planar, 2);
      const width = 0.0035 + 0.004 * hash(i * 1.7);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, dir);
      const delay = hash(i * 9.7) * 0.55;
      return { dir, length, width, quaternion, delay };
    });

    // Glowing node at each filament tip — the "synapses" of the web.
    const tipGeometry = new THREE.BufferGeometry();
    const tipPositions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const b = blades[i];
      const radius = CORE_RADIUS * 0.96 + b.length;
      tipPositions[i * 3] = b.dir.x * radius;
      tipPositions[i * 3 + 1] = b.dir.y * radius;
      tipPositions[i * 3 + 2] = b.dir.z * radius;
    }
    tipGeometry.setAttribute("position", new THREE.BufferAttribute(tipPositions, 3));
    const tipMaterial = new THREE.PointsMaterial({
      map: halo,
      color: "#f0d079",
      size: 0.085,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });

    return {
      bladeGeometry,
      bladeMaterial,
      sphereGeometry,
      sphereMaterial,
      rimGeometry,
      rimMaterial,
      sparkGeometry,
      sparkMaterial,
      glowMaterial,
      tipGeometry,
      tipMaterial,
      blades,
    };
  }, [count, halo]);

  useEffect(() => {
    return () => {
      assets.bladeGeometry.dispose();
      assets.bladeMaterial.dispose();
      assets.sphereGeometry.dispose();
      assets.sphereMaterial.dispose();
      assets.rimGeometry.dispose();
      assets.rimMaterial.dispose();
      assets.sparkGeometry.dispose();
      assets.sparkMaterial.dispose();
      assets.glowMaterial.dispose();
      assets.tipGeometry.dispose();
      assets.tipMaterial.dispose();
    };
  }, [assets]);

  const temp = useMemo(
    () => ({ m: new THREE.Matrix4(), p: new THREE.Vector3(), s: new THREE.Vector3() }),
    [],
  );

  useFrame(() => {
    const intro = store.intro;
    const core = introStage.core(intro);
    const ph = phases(store.p);

    const coreEase = easeOutCubic(core);
    if (sphere.current) sphere.current.scale.setScalar(Math.max(0.0001, coreEase));
    if (rim.current) {
      rim.current.scale.setScalar(Math.max(0.0001, coreEase));
      assets.rimMaterial.opacity = coreEase * (0.14 + 0.08 * ph.understand + 0.12 * ph.highlight);
    }
    if (tips.current) {
      tips.current.scale.setScalar(Math.max(0.0001, coreEase));
      const pulse = 0.5 + 0.5 * Math.sin(store.time * 1.6);
      assets.tipMaterial.opacity = coreEase * (0.4 + 0.18 * pulse + 0.25 * ph.understand + 0.2 * ph.highlight);
    }
    if (spark.current) {
      const point = introStage.point(intro);
      spark.current.scale.setScalar(Math.max(0.0001, point * (1 - core * 0.9)));
    }
    if (glow.current) {
      const point = introStage.point(intro);
      const s = 0.35 + 3.4 * coreEase + ph.highlight * 0.6;
      glow.current.scale.set(s, s, 1);
      assets.glowMaterial.opacity = 0.18 + 0.32 * point + ph.understand * 0.08 + ph.highlight * 0.15;
    }

    const mesh = blades.current;
    if (!mesh || settled.current) return;
    for (let i = 0; i < assets.blades.length; i++) {
      const b = assets.blades[i];
      const k = easeOutCubic((core - b.delay) / 0.45);
      const radius = CORE_RADIUS * 0.96 + (1 - k) * 1.4;
      temp.p.copy(b.dir).multiplyScalar(radius);
      temp.s.set(b.width, Math.max(0.0001, b.length * k), b.width);
      temp.m.compose(temp.p, b.quaternion, temp.s);
      mesh.setMatrixAt(i, temp.m);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (core >= 1) settled.current = true;
  });

  return (
    <group>
      <sprite ref={glow} material={assets.glowMaterial} renderOrder={-1} />
      <mesh ref={spark} geometry={assets.sparkGeometry} material={assets.sparkMaterial} />
      <mesh ref={rim} geometry={assets.rimGeometry} material={assets.rimMaterial} scale={0.0001} />
      <mesh ref={sphere} geometry={assets.sphereGeometry} material={assets.sphereMaterial} scale={0.0001} />
      <instancedMesh
        ref={blades}
        args={[assets.bladeGeometry, assets.bladeMaterial, assets.blades.length]}
        frustumCulled={false}
      />
      <points ref={tips} geometry={assets.tipGeometry} material={assets.tipMaterial} scale={0.0001} frustumCulled={false} />
    </group>
  );
}
