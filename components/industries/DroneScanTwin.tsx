"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ease } from "@/lib/motion";

type Img = { src: string; alt: string; width: number; height: number };

/** Survey findings that populate as the sweep passes the structure. Illustrative. */
const callouts = [
  { x: 46, y: 28, label: "Deck geometry captured", order: 0, side: "right" as const },
  { x: 71, y: 38, label: "Arch profile · 3D mesh", order: 1, side: "right" as const },
  { x: 86, y: 62, label: "Crack detected · flagged", order: 2, alert: true, side: "left" as const },
  { x: 32, y: 55, label: "Point cloud aligning", order: 3, side: "left" as const },
];

/** Decorative capture points that twinkle across the structure. */
const scanDots = [
  { x: 40, y: 34 },
  { x: 54, y: 30 },
  { x: 62, y: 44 },
  { x: 74, y: 50 },
  { x: 83, y: 58 },
  { x: 48, y: 48 },
  { x: 36, y: 46 },
  { x: 67, y: 33 },
  { x: 79, y: 42 },
];

const SWEEP_SECONDS = 5.5;

export function DroneScanTwin({ image, children }: { image: Img; children?: ReactNode }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const active = inView || reduce;

  return (
    <div ref={ref} className="relative">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="100vw"
        className="h-[62vh] min-h-[420px] w-full object-cover object-[62%_50%] lg:h-[78vh]"
      />

      {/* Animated survey layer */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Faint digitising grid that breathes as the structure is reconstructed */}
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgb(211_175_55/0.5)_1px,transparent_1px),linear-gradient(0deg,rgb(211_175_55/0.5)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:radial-gradient(60%_70%_at_62%_46%,#000_0%,transparent_75%)]"
          initial={{ opacity: 0 }}
          animate={active ? { opacity: reduce ? 0.12 : [0.06, 0.16, 0.06] } : { opacity: 0 }}
          transition={reduce ? { duration: 0.6 } : { duration: SWEEP_SECONDS, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Lidar sweep: a glowing beam fanning across the viaduct */}
        <motion.div
          className="absolute inset-y-[-10%] w-[3px] -skew-x-[14deg] bg-[linear-gradient(180deg,transparent,rgb(240_208_121/0.95)_35%,rgb(255_236_168)_50%,rgb(240_208_121/0.95)_65%,transparent)] shadow-[0_0_28px_8px_rgb(240_208_121/0.45)]"
          initial={{ left: "14%", opacity: 0 }}
          animate={active && !reduce ? { left: ["14%", "92%"], opacity: [0, 0.9, 0.9, 0] } : { opacity: 0 }}
          transition={reduce ? { duration: 0.3 } : { duration: SWEEP_SECONDS, times: [0, 0.12, 0.85, 1], repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Soft leading wash so the beam feels like it energises the surface */}
        <motion.div
          className="absolute inset-y-0 w-[22%] bg-[linear-gradient(90deg,transparent,rgb(240_208_121/0.1)_60%,rgb(255_236_168/0.16))]"
          initial={{ left: "-6%", opacity: 0 }}
          animate={active && !reduce ? { left: ["-6%", "78%"], opacity: [0, 0.8, 0.8, 0] } : { opacity: 0 }}
          transition={reduce ? { duration: 0.3 } : { duration: SWEEP_SECONDS, times: [0, 0.12, 0.85, 1], repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Twinkling capture points */}
        {scanDots.map((d, i) => (
          <motion.span
            key={i}
            className="absolute size-[5px] rounded-full bg-gold shadow-[0_0_8px_2px_rgb(240_208_121/0.6)]"
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={
              active
                ? reduce
                  ? { opacity: 0.7, scale: 1 }
                  : { opacity: [0.15, 0.9, 0.15], scale: [0.6, 1.15, 0.6] }
                : { opacity: 0 }
            }
            transition={
              reduce
                ? { duration: 0.4 }
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: (i % 5) * 0.4 }
            }
          />
        ))}

        {/* Survey callouts with anchor + connector */}
        {callouts.map((c) => {
          const right = c.side === "right";
          return (
            <motion.div
              key={c.label}
              className="absolute"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
              initial={{ opacity: 0, y: 6 }}
              animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.5, ease: ease.brand, delay: reduce ? 0 : 1 + c.order * 0.7 }}
            >
              {/* anchor dot + pulse */}
              <span className="relative block size-2 -translate-x-1/2 -translate-y-1/2">
                <span className={`absolute inset-0 rounded-full ${c.alert ? "bg-[#e0892b]" : "bg-gold"}`} />
                <motion.span
                  className={`absolute inset-0 rounded-full ${c.alert ? "bg-[#e0892b]" : "bg-gold"}`}
                  initial={{ scale: 1, opacity: 0 }}
                  animate={reduce ? { opacity: 0 } : { scale: [1, 2.6], opacity: [0.6, 0] }}
                  transition={reduce ? { duration: 0.2 } : { duration: 1.8, repeat: Infinity, ease: "easeOut", delay: c.order * 0.3 }}
                />
              </span>
              {/* connector + label */}
              <div
                className={`absolute top-1/2 hidden items-center gap-2 sm:flex ${right ? "right-0 translate-x-full flex-row pl-2" : "left-0 -translate-x-full flex-row-reverse pr-2"}`}
              >
                <span className={`h-px w-6 ${c.alert ? "bg-[#e0892b]/70" : "bg-gold/60"}`} />
                <span
                  className={`whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.12em] backdrop-blur-sm ${
                    c.alert
                      ? "border-[#e0892b]/50 bg-[#e0892b]/10 text-[#f0b06a]"
                      : "border-gold/40 bg-ink-950/70 text-gold"
                  }`}
                >
                  {c.label.toUpperCase()}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Telemetry panel */}
        <motion.div
          className="absolute right-4 top-20 w-[208px] rounded-lg border border-gold/25 bg-ink-950/75 p-3 backdrop-blur-md sm:right-6 sm:top-24"
          initial={{ opacity: 0, y: -8 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.6, ease: ease.brand, delay: reduce ? 0 : 0.3 }}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[0.625rem] tracking-[0.18em] text-gold">
              <motion.span
                className="size-1.5 rounded-full bg-gold"
                animate={reduce ? {} : { opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
              />
              LIVE SURVEY
            </span>
            <span className="font-mono text-[0.5625rem] tracking-[0.14em] text-stone">ILLUSTRATIVE</span>
          </div>

          <div className="mt-3 space-y-2.5">
            <Metric label="Coverage" active={active} reduce={reduce} to={100} suffix="%" />
            <div className="h-1 overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full rounded-full bg-gold"
                initial={{ width: "6%" }}
                animate={active ? { width: reduce ? "100%" : ["6%", "100%"] } : { width: "6%" }}
                transition={reduce ? { duration: 0.6 } : { duration: SWEEP_SECONDS, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <Metric label="Points" active={active} reduce={reduce} to={1_240_000} format={(v) => `${(v / 1_000_000).toFixed(2)}M`} />
            <Metric label="Findings" active={active} reduce={reduce} to={4} />
          </div>
        </motion.div>
      </div>

      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_10_10/0.1)_0%,rgb(10_10_10/0)_45%,#0a0a0a_100%)]" />
      <div aria-hidden className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(10_10_10/0.85)_0%,rgb(10_10_10/0.2)_45%,transparent_60%)] lg:block" />
      {children}
    </div>
  );
}

function Metric({
  label,
  to,
  active,
  reduce,
  suffix = "",
  format,
}: {
  label: string;
  to: number;
  active: boolean;
  reduce: boolean;
  suffix?: string;
  format?: (v: number) => string;
}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (reduce) {
      const id = requestAnimationFrame(() => setV(to));
      return () => cancelAnimationFrame(id);
    }
    let raf = 0;
    const start = performance.now();
    const dur = 2200;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduce, to]);

  const display = format ? format(v) : `${Math.round(v).toLocaleString()}${suffix}`;
  return (
    <div className="flex items-baseline justify-between">
      <span className="font-mono text-[0.625rem] tracking-[0.14em] text-stone">{label.toUpperCase()}</span>
      <span className="font-mono text-[0.75rem] tabular-nums text-bone">{display}</span>
    </div>
  );
}
