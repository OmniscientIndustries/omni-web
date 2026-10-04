"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Makes every Motion animation honour the OS "reduce motion" preference. */
export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
