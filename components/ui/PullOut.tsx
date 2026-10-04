"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ease } from "@/lib/motion";

/** Camera "pull outward": content settles from a close crop to the full view, once. */
export function PullOut({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ scale: 1.22, opacity: 0.4 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      transition={{ duration: 1.8, ease: ease.inOut }}
    >
      {children}
    </motion.div>
  );
}
