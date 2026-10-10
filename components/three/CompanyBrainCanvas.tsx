"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { brainNodes, INTRO_SECONDS, type BrainStore, type Quality } from "./brain-config";
import { damp, easeOutCubic, introStage, nodePosition, phases } from "./brain-math";
import { createHaloTexture } from "./halo-texture";
import { AmbientSignals } from "./parts/AmbientSignals";
import { Core } from "./parts/Core";
import { IndustryNodes } from "./parts/IndustryNodes";
import { OrbitRings } from "./parts/OrbitRings";
import { SignalLines } from "./parts/SignalLines";

export type CompanyBrainCanvasProps = {
  store: BrainStore;
  quality: Quality;
  reduced: boolean;
  running: boolean;
  onReady: () => void;
};

const TO_RAD = Math.PI / 180;

function Director({ store, reduced, onReady, rig }: Pick<CompanyBrainCanvasProps, "store" | "reduced" | "onReady"> & { rig: React.RefObject<THREE.Group | null> }) {
  const invalidate = useThree((s) => s.invalidate);
  const announced = useRef(false);
  const last = useMemo(() => brainNodes.map(() => ({ x: -1, y: -1, o: -1 })), []);
  const v = useMemo(() => new THREE.Vector3(), []);

  // Reduced motion renders a handful of frames (environment + settled state), then stops.
  useEffect(() => {
    if (!reduced) return;
    let frames = 0;
    let raf = 0;
    const tick = () => {
      invalidate();
      if (++frames < 8) raf = requestAnimationFrame(tick);
    };
    tick();
    const onResize = () => invalidate();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced, invalidate]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (reduced) {
      store.intro = 1;
      store.p = store.progress;
    } else {
      store.time += dt;
      store.intro = Math.min(1, store.intro + dt / INTRO_SECONDS);
      store.p = damp(store.p, store.progress, 3.2, dt);
    }

    const ph = phases(store.p);
    for (let i = 0; i < brainNodes.length; i++) {
      nodePosition(i, ph.understand, store.time, store.nodeLocal[i]);
    }

    // Camera: begins distant, settles, then moves slightly closer as understanding forms.
    const camera = state.camera as THREE.PerspectiveCamera;
    const introPull = 1 - easeOutCubic(store.intro);
    const distance = 12.8 - 0.9 * ph.understand - 0.4 * ph.act + introPull * 2.6;
    camera.position.set(0, 0.55 + 0.25 * ph.understand, distance);
    camera.lookAt(0, 0, 0);

    // Composition: core to the right on wide screens, upper area on portrait screens.
    const group = rig.current;
    if (!group) return;
    const { width, height } = state.size;
    const aspect = width / height;
    const vh = 2 * distance * Math.tan((camera.fov * TO_RAD) / 2);
    const vw = vh * aspect;
    // Narrower screens tip the ring towards the camera so labels spread vertically.
    let baseTilt = 0;
    if (aspect >= 1.6) {
      group.position.set(vw * 0.225, -vh * 0.02, 0);
      group.scale.setScalar(0.76);
    } else if (aspect >= 1.2) {
      group.position.set(vw * 0.285, -vh * 0.01, 0);
      group.scale.setScalar(0.54);
      baseTilt = 0.18;
    } else if (aspect >= 0.85) {
      group.position.set(vw * 0.1, vh * 0.12, 0);
      group.scale.setScalar(0.72);
      baseTilt = 0.2;
    } else {
      group.position.set(0, vh * (aspect < 0.6 ? 0.27 : 0.19), 0);
      group.scale.setScalar(Math.min(0.78, (vw * 0.27) / 3.3));
      baseTilt = 0.42;
    }

    // Cursor parallax: a few degrees at most.
    const px = reduced ? 0 : store.pointer.x;
    const py = reduced ? 0 : store.pointer.y;
    group.rotation.y = damp(group.rotation.y, px * 0.05, 2.4, dt);
    group.rotation.x = damp(group.rotation.x, baseTilt + py * 0.035, 2.4, dt);
    group.updateMatrixWorld();

    // Project node anchors onto the accessible HTML overlay without React state.
    for (let i = 0; i < brainNodes.length; i++) {
      const el = store.anchors[i];
      if (!el) continue;
      const p = store.nodeLocal[i];
      v.set(p.x, p.y, p.z).applyMatrix4(group.matrixWorld).project(camera);
      const x = (v.x * 0.5 + 0.5) * width;
      const y = (-v.y * 0.5 + 0.5) * height;
      const o = Math.round(introStage.nodes(i, store.intro) * 100) / 100;
      const prev = last[i];
      if (Math.abs(prev.x - x) > 0.25 || Math.abs(prev.y - y) > 0.25) {
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        prev.x = x;
        prev.y = y;
      }
      if (prev.o !== o) {
        el.style.opacity = String(o);
        el.style.visibility = o > 0.05 ? "visible" : "hidden";
        prev.o = o;
      }
    }

    if (!announced.current) {
      announced.current = true;
      onReady();
    }
  });

  return null;
}

function Scene(props: CompanyBrainCanvasProps) {
  const { store, quality } = props;
  const rig = useRef<THREE.Group>(null);
  const halo = useMemo(() => createHaloTexture(), []);
  useEffect(() => () => halo.dispose(), [halo]);

  return (
    <>
      <Director store={store} reduced={props.reduced} onReady={props.onReady} rig={rig} />
      <ambientLight intensity={0.12} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} color="#ffe2a0" />
      <directionalLight position={[-6, -2, -4]} intensity={0.5} color="#8d7530" />
      <pointLight position={[0, 0, 0]} intensity={5} distance={5} decay={2} color="#d3af37" />
      <Environment resolution={quality === "high" ? 128 : 64} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#f3d27a" position={[3, 4, 5]} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={1.4} color="#fff4dc" position={[-5, 1, 3]} scale={3} />
        <Lightformer form="rect" intensity={0.5} color="#8d7530" position={[0, -5, 2]} rotation-x={Math.PI / 2} scale={[10, 2, 1]} />
      </Environment>
      <group ref={rig}>
        <AmbientSignals store={store} quality={quality} />
        <OrbitRings store={store} />
        <SignalLines store={store} />
        <Core store={store} quality={quality} halo={halo} />
        <IndustryNodes store={store} halo={halo} />
      </group>
    </>
  );
}

export default function CompanyBrainCanvas(props: CompanyBrainCanvasProps) {
  const { quality, reduced, running } = props;
  return (
    <Canvas
      dpr={[1, quality === "high" ? 1.5 : 1.25]}
      frameloop={reduced ? "demand" : running ? "always" : "never"}
      camera={{ position: [0, 0.55, 15], fov: 30, near: 0.1, far: 80 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", stencil: false }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
