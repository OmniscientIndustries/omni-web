"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { brainNodes, RISK_PAIR, type BrainStore } from "../brain-config";
import { damp, easeOutCubic, introStage, phases } from "../brain-math";

const GOLD = new THREE.Color("#d3af37");
const AMBER = new THREE.Color("#e0892b");

/** Abstract marker per operating world — deliberately not literal icons. */
function markerGeometry(slug: string) {
  switch (slug) {
    case "rail":
      return new THREE.BoxGeometry(0.34, 0.05, 0.1);
    case "public-security":
      return new THREE.IcosahedronGeometry(0.12, 1);
    case "construction":
      return new THREE.BoxGeometry(0.16, 0.16, 0.16);
    case "airports":
      return new THREE.TetrahedronGeometry(0.15);
    case "farming":
      return new THREE.CylinderGeometry(0.15, 0.15, 0.04, 24);
    default:
      return new THREE.ConeGeometry(0.14, 0.2, 5);
  }
}

export function IndustryNodes({ store, halo }: { store: BrainStore; halo: THREE.Texture }) {
  const groups = useRef<(THREE.Group | null)[]>([]);
  const markers = useRef<(THREE.Mesh | null)[]>([]);
  const scales = useRef(brainNodes.map(() => 1));

  const assets = useMemo(() => {
    const geometries = brainNodes.map((n) => markerGeometry(n.slug));
    const material = new THREE.MeshStandardMaterial({
      color: "#e2c25a",
      metalness: 1,
      roughness: 0.28,
      emissive: "#4a3606",
      emissiveIntensity: 0.8,
    });
    const ringGeometry = new THREE.TorusGeometry(0.3, 0.004, 6, 64);
    const ringMaterials = brainNodes.map(
      () => new THREE.MeshBasicMaterial({ color: GOLD.clone(), transparent: true, opacity: 0, toneMapped: false, depthWrite: false }),
    );
    const haloMaterials = brainNodes.map(
      () =>
        new THREE.SpriteMaterial({
          map: halo,
          color: GOLD.clone(),
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
    );
    return { geometries, material, ringGeometry, ringMaterials, haloMaterials };
  }, [halo]);

  useEffect(() => {
    return () => {
      assets.geometries.forEach((g) => g.dispose());
      assets.material.dispose();
      assets.ringGeometry.dispose();
      assets.ringMaterials.forEach((m) => m.dispose());
      assets.haloMaterials.forEach((m) => m.dispose());
    };
  }, [assets]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const ph = phases(store.p);
    brainNodes.forEach((node, i) => {
      const group = groups.current[i];
      if (!group) return;
      const pos = store.nodeLocal[i];
      group.position.set(pos.x, pos.y, pos.z);

      const visible = easeOutCubic(introStage.nodes(i, store.intro));
      const isActive = store.active === i;
      const isRisk = i === RISK_PAIR[0];
      const isRoute = i === RISK_PAIR[1];
      const emphasis = isActive ? 1 : isRoute ? ph.highlight * 0.6 : 0;
      scales.current[i] = damp(scales.current[i], 1 + emphasis * 0.45, 8, dt);
      group.scale.setScalar(Math.max(0.0001, visible * scales.current[i]));

      const marker = markers.current[i];
      if (marker) {
        marker.rotation.y = store.time * 0.25 + i;
        marker.rotation.x = 0.35;
      }

      const riskMix = isRisk ? ph.risk : 0;
      const haloMat = assets.haloMaterials[i];
      haloMat.color.copy(GOLD).lerp(AMBER, riskMix);
      const riskPulse = riskMix * (0.6 + 0.4 * Math.sin(store.time * 3.2));
      haloMat.opacity = visible * (0.28 + 0.35 * emphasis + 0.55 * riskPulse);

      const ringMat = assets.ringMaterials[i];
      ringMat.color.copy(GOLD).lerp(AMBER, riskMix);
      ringMat.opacity = visible * (0.35 + 0.4 * ph.understand + 0.25 * emphasis);
    });
  });

  return (
    <group>
      {brainNodes.map((node, i) => (
        <group
          key={node.slug}
          ref={(el) => {
            groups.current[i] = el;
          }}
          scale={0.0001}
        >
          <sprite material={assets.haloMaterials[i]} scale={[1.5, 1.5, 1]} />
          <mesh
            ref={(el) => {
              markers.current[i] = el;
            }}
            geometry={assets.geometries[i]}
            material={assets.material}
          />
          <mesh geometry={assets.ringGeometry} material={assets.ringMaterials[i]} rotation={[Math.PI / 2 - 0.5, 0, 0]} />
        </group>
      ))}
    </group>
  );
}
