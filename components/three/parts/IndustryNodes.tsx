"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { brainNodes, RISK_PAIR, type BrainStore } from "../brain-config";
import { damp, easeOutCubic, introStage, phases } from "../brain-math";
import { createIndustryIcon } from "../industry-icons";

const GOLD = new THREE.Color("#d3af37");
const AMBER = new THREE.Color("#e0892b");

export function IndustryNodes({ store, halo }: { store: BrainStore; halo: THREE.Texture }) {
  const { camera } = useThree();
  const groups = useRef<(THREE.Group | null)[]>([]);
  const markers = useRef<(THREE.Mesh | null)[]>([]);
  const scales = useRef(brainNodes.map(() => 1));
  const billboard = useRef(new THREE.Quaternion());
  const parentQuat = useRef(new THREE.Quaternion());

  const assets = useMemo(() => {
    // Crisp SVG-authored icon per operating world, rasterised to a texture and
    // tinted by the material so it reads gold on the dark stage.
    const iconTextures = brainNodes.map((n) => createIndustryIcon(n.slug));
    const iconGeometry = new THREE.PlaneGeometry(1, 1);
    const iconMaterials = brainNodes.map(
      (_, i) =>
        new THREE.MeshBasicMaterial({
          map: iconTextures[i],
          color: GOLD.clone(),
          transparent: true,
          opacity: 0,
          depthWrite: false,
          toneMapped: false,
        }),
    );
    const ringGeometry = new THREE.TorusGeometry(0.34, 0.004, 8, 80);
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
    return { iconTextures, iconGeometry, iconMaterials, ringGeometry, ringMaterials, haloMaterials };
  }, [halo]);

  useEffect(() => {
    return () => {
      assets.iconTextures.forEach((t) => t.dispose());
      assets.iconGeometry.dispose();
      assets.iconMaterials.forEach((m) => m.dispose());
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

      const riskMix = isRisk ? ph.risk : 0;

      // Keep the icon facing the camera so its silhouette always reads cleanly.
      const marker = markers.current[i];
      if (marker) {
        group.getWorldQuaternion(parentQuat.current);
        billboard.current.copy(parentQuat.current).invert().multiply(camera.quaternion);
        marker.quaternion.copy(billboard.current);
        const iconMat = assets.iconMaterials[i];
        iconMat.color.copy(GOLD).lerp(AMBER, riskMix);
        iconMat.opacity = visible * (0.72 + 0.28 * ph.understand + 0.3 * emphasis);
      }

      const haloMat = assets.haloMaterials[i];
      haloMat.color.copy(GOLD).lerp(AMBER, riskMix);
      const riskPulse = riskMix * (0.6 + 0.4 * Math.sin(store.time * 3.2));
      haloMat.opacity = visible * (0.26 + 0.34 * emphasis + 0.55 * riskPulse);

      const ringMat = assets.ringMaterials[i];
      ringMat.color.copy(GOLD).lerp(AMBER, riskMix);
      ringMat.opacity = visible * (0.32 + 0.4 * ph.understand + 0.28 * emphasis);
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
          <sprite material={assets.haloMaterials[i]} scale={[1.7, 1.7, 1]} />
          <mesh
            ref={(el) => {
              markers.current[i] = el;
            }}
            geometry={assets.iconGeometry}
            material={assets.iconMaterials[i]}
            scale={[0.56, 0.56, 0.56]}
          />
          <mesh geometry={assets.ringGeometry} material={assets.ringMaterials[i]} rotation={[Math.PI / 2 - 0.5, 0, 0]} />
        </group>
      ))}
    </group>
  );
}
