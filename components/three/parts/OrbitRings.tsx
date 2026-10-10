"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { NODE_RADIUS, RING_TILT, type BrainStore } from "../brain-config";
import { easeOutCubic, introStage, phases } from "../brain-math";

const RINGS = [
  { radius: 0.98, tube: 0.007, opacity: 0.9, tilt: [0.9, 0.3, 0.2], speed: 0.22 },
  { radius: 1.42, tube: 0.005, opacity: 0.7, tilt: [-0.6, 0.8, -0.3], speed: -0.15 },
  { radius: 2.05, tube: 0.004, opacity: 0.5, tilt: [0.3, -1.1, 0.6], speed: 0.1 },
  { radius: NODE_RADIUS, tube: 0.003, opacity: 0.32, tilt: [-0.25, 0.4, -0.15], speed: -0.05 },
];
const ALIGNED_X = RING_TILT - Math.PI / 2;
const TICKS = 48;

export function OrbitRings({ store }: { store: BrainStore }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const ticks = useRef<THREE.InstancedMesh>(null);

  const assets = useMemo(() => {
    const geometries = RINGS.map((r) => new THREE.TorusGeometry(r.radius, r.tube, 8, 220));
    const materials = RINGS.map(
      () =>
        new THREE.MeshBasicMaterial({
          color: "#d3af37",
          transparent: true,
          opacity: 0,
          depthWrite: false,
          toneMapped: false,
        }),
    );
    const tickGeometry = new THREE.BoxGeometry(0.008, 0.07, 0.008);
    const tickMaterial = new THREE.MeshBasicMaterial({ color: "#8d7530", transparent: true, opacity: 0, toneMapped: false });
    return { geometries, materials, tickGeometry, tickMaterial };
  }, []);

  useEffect(() => {
    return () => {
      assets.geometries.forEach((g) => g.dispose());
      assets.materials.forEach((m) => m.dispose());
      assets.tickGeometry.dispose();
      assets.tickMaterial.dispose();
    };
  }, [assets]);

  // Ticks sit on ring 2 like a precision dial; set once.
  useEffect(() => {
    const mesh = ticks.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const radius = RINGS[1].radius;
    for (let i = 0; i < TICKS; i++) {
      const a = (i / TICKS) * Math.PI * 2;
      q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), a);
      const s = i % 4 === 0 ? 1.6 : 1;
      m.compose(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0), q, new THREE.Vector3(1, s, 1));
      // rotate so the tick points radially
      m.multiply(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  const tmp = useMemo(
    () => ({ e: new THREE.Euler(), qa: new THREE.Quaternion(), qb: new THREE.Quaternion() }),
    [],
  );

  useFrame(() => {
    const t = store.time;
    const ph = phases(store.p);
    const appear = easeOutCubic(introStage.rings(store.intro));
    RINGS.forEach((ring, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      tmp.e.set(ring.tilt[0] + t * ring.speed * 0.4, ring.tilt[1] + t * ring.speed, ring.tilt[2]);
      tmp.qa.setFromEuler(tmp.e);
      tmp.e.set(ALIGNED_X, 0, t * ring.speed * 0.25);
      tmp.qb.setFromEuler(tmp.e);
      mesh.quaternion.slerpQuaternions(tmp.qa, tmp.qb, ph.understand);
      mesh.scale.setScalar(0.7 + 0.3 * appear);
      assets.materials[i].opacity = ring.opacity * appear * (0.75 + 0.25 * ph.understand);
    });
    if (ticks.current && refs.current[1]) {
      ticks.current.quaternion.copy(refs.current[1].quaternion);
      ticks.current.scale.copy(refs.current[1].scale);
      assets.tickMaterial.opacity = 0.8 * appear * ph.understand;
    }
  });

  return (
    <group>
      {RINGS.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          geometry={assets.geometries[i]}
          material={assets.materials[i]}
        />
      ))}
      <instancedMesh ref={ticks} args={[assets.tickGeometry, assets.tickMaterial, TICKS]} frustumCulled={false} />
    </group>
  );
}
