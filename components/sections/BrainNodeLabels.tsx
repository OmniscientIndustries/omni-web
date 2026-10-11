"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { brainNodes, type BrainStore } from "@/components/three/brain-config";
import { StatusBadge } from "@/components/industries/StatusBadge";
import { Arrow } from "@/components/ui/GoldButton";
import { expansionStatus } from "@/content/industries";

/**
 * Accessible HTML overlay for the six industry nodes. The 3D scene writes each
 * anchor's transform directly; React only re-renders when the active node changes.
 * Mouse: hover reveals purpose. Touch: first tap reveals, second tap navigates.
 */
export function BrainNodeLabels({ store }: { store: BrainStore }) {
  const [active, setActive] = useState(-1);
  const [touchMode, setTouchMode] = useState(false);
  const pointer = useRef<string>("mouse");
  const activeAtPointerDown = useRef(false);

  const activate = (index: number) => {
    store.active = index;
    setActive(index);
    setTouchMode(pointer.current === "touch" || pointer.current === "pen");
  };

  return (
    <nav aria-label="Operating environments in the Company Brain" className="pointer-events-none absolute inset-0 z-[5]">
      <ul>
        {brainNodes.map((node, i) => {
          const labelLeft = Math.cos(node.angle) > 0.3;
          const isActive = active === i;
          const descId = `brain-node-${node.slug}`;
          return (
            <li
              key={node.slug}
              ref={(el) => {
                store.anchors[i] = el;
              }}
              className="absolute top-0 left-0 will-change-transform"
              style={{ opacity: 0, visibility: "hidden" }}
            >
              <Link
                href={node.href}
                aria-describedby={descId}
                onPointerDown={(e) => {
                  pointer.current = e.pointerType;
                  activeAtPointerDown.current = isActive;
                }}
                onPointerEnter={(e) => {
                  pointer.current = e.pointerType;
                  if (e.pointerType === "mouse") activate(i);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === "mouse") activate(-1);
                }}
                onFocus={() => activate(i)}
                onBlur={() => activate(-1)}
                onClick={(e) => {
                  // e.detail === 0 → keyboard activation, which always navigates.
                  // Focus fires between pointerdown and click, so judge by the state at pointerdown.
                  if (e.detail > 0 && pointer.current !== "mouse" && !activeAtPointerDown.current) {
                    e.preventDefault();
                    activate(i);
                  }
                }}
                className={`pointer-events-auto absolute top-0 left-0 flex -translate-x-1/2 -translate-y-[22px] flex-col items-center whitespace-nowrap lg:min-h-11 lg:-translate-y-1/2 lg:gap-1 ${labelLeft ? "lg:right-0 lg:left-auto lg:translate-x-[22px] lg:flex-row-reverse" : "lg:-translate-x-[22px] lg:flex-row"}`}
              >
                <span aria-hidden className="flex size-11 items-center justify-center">
                  <span className={`size-2 rounded-full border border-gold-bright/80 transition-transform duration-[var(--duration-fast)] ${isActive ? "scale-150 bg-gold-bright" : "bg-transparent"}`} />
                </span>
                <span
                  className={`-mt-3 pb-1 font-mono text-[0.625rem] tracking-[0.1em] uppercase transition-colors duration-[var(--duration-fast)] lg:mt-0 lg:pb-0 lg:text-[0.6875rem] lg:tracking-[0.16em] ${isActive ? "text-gold-bright" : node.tier === "launch" ? "text-bone/90" : "text-stone"}`}
                >
                  {node.name}
                </span>
              </Link>
              <span id={descId} className="sr-only">
                {node.summary}
                {node.tier === "expansion" ? ` ${expansionStatus.short}` : ""}
              </span>

              {isActive ? (
                <div
                  aria-hidden
                  className={`animate-rise absolute top-9 w-[min(17rem,70vw)] sm:top-6 sm:w-[min(17rem,70vw)] rounded-xl border border-line-strong bg-ink-900/92 p-4 shadow-[0_20px_60px_-20px_rgb(0_0_0/0.9)] backdrop-blur-md [--delay:0ms] ${labelLeft ? "right-0" : "left-0"}`}
                  style={{ animationDuration: "320ms" }}
                >
                  {node.tier === "expansion" ? <StatusBadge className="mb-3" /> : null}
                  <p className="text-[0.8125rem] leading-relaxed text-bone/90">{node.summary}</p>
                  <p className="mt-3 flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.16em] text-gold uppercase">
                    {touchMode ? "Tap again to explore" : "Explore"}
                    <Arrow className="size-3" />
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
