"use client";

import { motion, useReducedMotion } from "motion/react";
import { OmniscientMark } from "@/components/brand/OmniscientMark";
import { ease } from "@/lib/motion";

/** Two paths — technical and operational — converge into Omniscient. */
export function ConvergingPaths() {
  const reduce = useReducedMotion();
  const draw = (delay: number) => ({
    initial: { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport: { once: true, margin: "0px 0px -15% 0px" },
    transition: reduce ? { duration: 0 } : { duration: 1.6, ease: ease.inOut, delay },
  });

  return (
    <div aria-hidden className="relative">
      <svg viewBox="0 0 1000 300" className="h-auto w-full overflow-visible">
        <defs>
          <linearGradient id="path-gold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="800" y2="0">
            <stop offset="0" stopColor="#6e5430" stopOpacity="0.2" />
            <stop offset="1" stopColor="#d7c4a4" />
          </linearGradient>
        </defs>
        <motion.path d="M0 40 C 320 40, 520 60, 780 150" fill="none" stroke="url(#path-gold)" strokeWidth="1.5" {...draw(0)} />
        <motion.path d="M0 260 C 320 260, 520 240, 780 150" fill="none" stroke="url(#path-gold)" strokeWidth="1.5" {...draw(0.15)} />
        <motion.path d="M780 150 H 1000" fill="none" stroke="#b79768" strokeWidth="1.5" strokeDasharray="4 6" {...draw(1.5)} />
        {[120, 300, 480].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={40 + i * 6 + (i === 2 ? 14 : 0)} r="4" fill="#b79768" />
            <circle cx={x} cy={260 - i * 6 - (i === 2 ? 14 : 0)} r="4" fill="#b79768" />
          </g>
        ))}
      </svg>
      <div className="absolute top-1/2 left-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-950 p-2">
        <OmniscientMark className="size-12 sm:size-16" />
      </div>
      <p className="absolute top-0 left-0 -translate-y-full pb-2 font-mono text-[0.625rem] tracking-[0.2em] text-gold uppercase sm:text-[0.6875rem]">
        Technical path
      </p>
      <p className="absolute bottom-0 left-0 translate-y-full pt-2 font-mono text-[0.625rem] tracking-[0.2em] text-gold uppercase sm:text-[0.6875rem]">
        Operational path
      </p>
    </div>
  );
}
