"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { duration, ease } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article" | "figure";
  y?: number;
};

/**
 * Section entrance: small rise + fade, once. A <noscript> rule in the root
 * layout forces [data-reveal] content visible when JavaScript is unavailable.
 */
export function Reveal({ children, className, delay = 0, as = "div", y = 18 }: Props) {
  const Component = motion[as];
  return (
    <Component
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: duration.entrance, ease: ease.brand, delay }}
    >
      {children}
    </Component>
  );
}
