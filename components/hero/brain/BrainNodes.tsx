"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { StatusBadge } from "@/components/industries/StatusBadge";
import { Arrow } from "@/components/ui/GoldButton";
import { expansionStatus } from "@/content/industries";
import { ACTIVE_ROUTES, heroNodes } from "./brain-config";

/**
 * Industry nodes on the orbit field. Real links: hover or focus reveals purpose;
 * on touch the first tap reveals and the second navigates.
 */
export function BrainNodes() {
  const nav = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [touchMode, setTouchMode] = useState(false);
  const pointer = useRef("mouse");
  const activeAtPointerDown = useRef(false);

  const activate = (slug: string | null) => {
    setActive(slug);
    setTouchMode(pointer.current === "touch" || pointer.current === "pen");
  };

  // The phone ring holds still while a node is being read.
  useEffect(() => {
    const stage = nav.current?.closest<HTMLElement>(".brain-stage");
    if (!stage) return;
    if (active) stage.dataset.hold = "true";
    else delete stage.dataset.hold;
  }, [active]);

  const current = heroNodes.find((n) => n.slug === active);

  return (
    <nav ref={nav} aria-label="Operating environments in the Company Brain" className="brain-nodes">
      <ul>
        {heroNodes.map((node, i) => {
          const isActive = active === node.slug;
          const descId = `brain-node-${node.slug}`;
          return (
            <li
              key={node.slug}
              className="company-brain-industry-node"
              data-slug={node.slug}
              data-ring-angle={node.ringAngle}
              data-tier={node.tier}
              data-label={node.labelAbove ? "above" : "below"}
              data-active-route={ACTIVE_ROUTES.includes(node.slug) || undefined}
              data-hud-zone={node.slug === "public-security" || undefined}
              data-active={isActive || undefined}
              style={
                {
                  "--x": node.desktop.x,
                  "--y": node.desktop.y,
                  "--tx": node.tablet.x,
                  "--ty": node.tablet.y,
                  "--d": node.depth,
                  "--m-x": node.ring.x,
                  "--m-y": node.ring.y,
                  "--m-o": node.ring.visible ? 1 : 0,
                  "--delay": `${1100 + i * 110}ms`,
                  "--float-delay": `${-i * 1.7}s`,
                } as CSSProperties
              }
            >
              <div className="animate-rise">
                <div className="brain-node-float">
                  <Link
                    href={node.href}
                    aria-describedby={descId}
                    onPointerDown={(e) => {
                      pointer.current = e.pointerType;
                      activeAtPointerDown.current = isActive;
                    }}
                    onPointerEnter={(e) => {
                      pointer.current = e.pointerType;
                      if (e.pointerType === "mouse") activate(node.slug);
                    }}
                    onPointerLeave={(e) => {
                      if (e.pointerType === "mouse") activate(null);
                    }}
                    onFocus={() => activate(node.slug)}
                    onBlur={() => activate(null)}
                    onClick={(e) => {
                      // e.detail === 0 → keyboard activation, which always navigates.
                      // Focus fires between pointerdown and click, so judge by the state at pointerdown.
                      if (e.detail > 0 && pointer.current !== "mouse" && !activeAtPointerDown.current) {
                        e.preventDefault();
                        activate(node.slug);
                      }
                    }}
                    className="brain-node-link"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG artwork, sized by CSS */}
                    <img src={node.icon} alt="" width={160} height={160} draggable={false} />
                    <span className="company-brain-industry-label">{node.name}</span>
                  </Link>
                  <span id={descId} className="sr-only">
                    {node.summary}
                    {node.tier === "expansion" ? ` ${expansionStatus.short}` : ""}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {current ? (
        <div
          aria-hidden
          className="brain-popup"
          data-side={current.desktop.x < 50 ? "start" : "end"}
          style={
            {
              "--x": current.desktop.x,
              "--y": current.desktop.y,
              "--tx": current.tablet.x,
              "--ty": current.tablet.y,
            } as CSSProperties
          }
        >
          <div
            className="animate-rise rounded-xl border border-line-strong bg-ink-900/95 p-4 shadow-[0_20px_60px_-20px_rgb(0_0_0/0.9)] backdrop-blur-md [--delay:0ms]"
            style={{ animationDuration: "320ms" }}
          >
            {current.tier === "expansion" ? <StatusBadge className="mb-3" /> : null}
            <p className="text-[0.8125rem] leading-relaxed text-bone/90">{current.summary}</p>
            <p className="mt-3 flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.16em] text-gold uppercase">
              {touchMode ? "Tap again to explore" : "Explore"}
              <Arrow className="size-3" />
            </p>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
