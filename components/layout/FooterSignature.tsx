"use client";

import { motion, useReducedMotion } from "motion/react";
import { OmniscientMark } from "@/components/brand/OmniscientMark";
import { ease } from "@/lib/motion";

/** A gold line travels from both edges and resolves into the Omniscient symbol. */
export function FooterSignature() {
  const reduce = useReducedMotion();
  const line = {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: "0px 0px -10% 0px" },
    transition: reduce ? { duration: 0 } : { duration: 1.6, ease: ease.inOut },
  };

  return (
    <div aria-hidden className="relative flex items-center justify-center py-2">
      <svg viewBox="0 0 1000 2" preserveAspectRatio="none" className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 overflow-visible">
        <defs>
          <linearGradient id="footer-line-l" gradientUnits="userSpaceOnUse" x1="0" y1="1" x2="468" y2="1">
            <stop offset="0" stopColor="#D3AF37" stopOpacity="0" />
            <stop offset="1" stopColor="#D3AF37" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="footer-line-r" gradientUnits="userSpaceOnUse" x1="1000" y1="1" x2="532" y2="1">
            <stop offset="0" stopColor="#D3AF37" stopOpacity="0" />
            <stop offset="1" stopColor="#D3AF37" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <motion.path d="M0 1 H468" stroke="url(#footer-line-l)" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" {...line} />
        <motion.path d="M1000 1 H532" stroke="url(#footer-line-r)" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" {...line} />
      </svg>
      <motion.div
        className="relative bg-ink-950 px-5"
        initial={{ opacity: 0, scale: 0.86 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={reduce ? { duration: 0 } : { duration: 0.9, ease: ease.brand, delay: 1.1 }}
      >
        <OmniscientMark className="size-14" />
      </motion.div>
    </div>
  );
}
