"use client";

import { useSyncExternalStore } from "react";
import type { Quality } from "@/components/three/brain-config";

type Support = "pending" | "supported" | "unsupported";

let webglCache: boolean | undefined;

/** Append ?brain=static to any URL to force the non-WebGL fallback (QA aid). */
function detectWebGL(): boolean {
  if (webglCache !== undefined) return webglCache;
  try {
    if (new URLSearchParams(window.location.search).get("brain") === "static") {
      return (webglCache = false);
    }
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    webglCache = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglCache = false;
  }
  return webglCache;
}

function detectQuality(): Quality {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const small = window.matchMedia("(max-width: 767px)").matches;
  const weakCpu = (nav.hardwareConcurrency ?? 8) <= 4;
  const lowMemory = (nav.deviceMemory ?? 8) <= 4;
  const saveData = nav.connection?.saveData === true;
  return small || weakCpu || lowMemory || saveData ? "low" : "high";
}

const noopSubscribe = () => () => {};

export function useWebGLSupport(): Support {
  return useSyncExternalStore(
    noopSubscribe,
    () => (detectWebGL() ? "supported" : "unsupported"),
    () => "pending",
  );
}

export function useRenderQuality(): Quality {
  return useSyncExternalStore(noopSubscribe, detectQuality, () => "high");
}
