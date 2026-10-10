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
  const count = quality === "high" ? 240 : 140;
  const blades = useRef<THREE.InstancedMesh>(null);
  const sphere = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Sprite>(null);
  const spark = useRef<THREE.Mesh>(null);
  const settled = useRef(false);

  const assets = useMemo(() => {
    const bladeGeometry = new THREE.ConeGeometry(1, 1, 4, 1);
    bladeGeometry.translate(0, 0.5, 0);
    const bladeMaterial = new THREE.MeshStandardMaterial({
      color: "#d9b443",
      metalness: 1,
      roughness: 0.32,
      emissive: "#3a2a06",
      emissiveIntensity: 0.6,
    });
    const sphereGeometry = new THREE.SphereGeometry(CORE_RADIUS, 64, 48);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: "#0b0a08",
      metalness: 0.9,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
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

    // Fibonacci sphere directions; longer blades concentrate on the orbital plane
    // so the corona reads as a sun, never as a flat iris.
    const golden = Math.PI * (3 - Math.sqrt(5));
    const blades = Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const dir = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r);
      const planar = 1 - Math.abs(dir.dot(RING_NORMAL));
      const length = 0.05 + (0.3 + 0.7 * hash(i * 3.1)) * 0.95 * Math.pow(planar, 4);
      const width = 0.008 + 0.008 * hash(i * 1.7);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, dir);
      const delay = hash(i * 9.7) * 0.55;
      return { dir, length, width, quaternion, delay };
    });

    return { bladeGeometry, bladeMaterial, sphereGeometry, sphereMaterial, sparkGeometry, sparkMaterial, glowMaterial, blades };
  }, [count, halo]);

  useEffect(() => {
    return () => {
      assets.bladeGeometry.dispose();
      assets.bladeMaterial.dispose();
      assets.sphereGeometry.dispose();
      assets.sphereMaterial.dispose();
      assets.sparkGeometry.dispose();
      assets.sparkMaterial.dispose();
      assets.glowMaterial.dispose();
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

    if (sphere.current) sphere.current.scale.setScalar(Math.max(0.0001, easeOutCubic(core)));
    if (spark.current) {
      const point = introStage.point(intro);
      spark.current.scale.setScalar(Math.max(0.0001, point * (1 - core * 0.9)));
    }
    if (glow.current) {
      const point = introStage.point(intro);
      const s = 0.35 + 3.4 * easeOutCubic(core) + ph.highlight * 0.6;
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
      <mesh ref={sphere} geometry={assets.sphereGeometry} material={assets.sphereMaterial} scale={0.0001} />
      <instancedMesh
        ref={blades}
        args={[assets.bladeGeometry, assets.bladeMaterial, assets.blades.length]}
        frustumCulled={false}
      />
    </group>
  );
}
