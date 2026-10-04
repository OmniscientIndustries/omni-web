"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { CompanyBrainOrbit } from "@/components/hero/brain/CompanyBrainOrbit";
import { HeroParticles } from "@/components/hero/HeroParticles";
import { GoldButton } from "@/components/ui/GoldButton";
import { BrainPhaseHud, phaseFor, statusFor } from "./BrainPhaseHud";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function CompanyBrainHero() {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDivElement>(null);

  // Ambient motion only runs while the hero is visible and the tab is active.
  useEffect(() => {
    const el = section.current;
    const stageEl = stage.current;
    if (!el || !stageEl) return;
    let inView = true;
    const sync = () => {
      stageEl.dataset.running = String(inView && document.visibilityState === "visible");
      el.dataset.running = stageEl.dataset.running;
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // Cursor parallax on fine pointers only: a few pixels of depth, never more.
  useEffect(() => {
    const stageEl = stage.current;
    if (!stageEl) return;
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      stageEl.style.setProperty("--mx", x.toFixed(3));
      stageEl.style.setProperty("--my", y.toFixed(3));
    };
    const onMove = (e: PointerEvent) => {
      x = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
      y = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1));
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Scroll choreography: Perceive → Understand → Act, written as data attributes.
  useGSAP(
    () => {
      const hudEl = hud.current;
      const stageEl = stage.current;
      const bar = hudEl?.querySelector<HTMLElement>("[data-bar]");
      const write = (p: number) => {
        const phase = phaseFor(p);
        const status = statusFor(p);
        for (const el of [hudEl, stageEl]) {
          if (!el) continue;
          if (el.dataset.phase !== phase) el.dataset.phase = phase;
          if (el.dataset.status !== status) el.dataset.status = status;
        }
        if (bar) bar.style.transform = `scaleX(${p.toFixed(3)})`;
      };

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          compact: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduce } = context.conditions as Record<string, boolean>;
          if (reduce) {
            write(0.5);
            return;
          }
          ScrollTrigger.create(
            desktop
              ? {
                  trigger: section.current,
                  start: "top top",
                  end: "+=160%",
                  pin: pin.current,
                  scrub: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                  onUpdate: (self) => write(self.progress),
                  onRefresh: (self) => write(self.progress),
                }
              : {
                  // Stacked layouts: the story plays as the visualisation passes through the viewport.
                  trigger: stageEl,
                  start: "top 90%",
                  end: "bottom 10%",
                  scrub: true,
                  invalidateOnRefresh: true,
                  onUpdate: (self) => write(self.progress),
                  onRefresh: (self) => write(self.progress),
                },
          );
        },
      );
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-labelledby="hero-title" className="relative" data-running="true">
      <div ref={pin} className="relative isolate overflow-x-clip bg-ink-950 lg:h-svh lg:min-h-[720px]">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70%_38%_at_50%_72%,rgb(211_175_55/0.07),transparent_70%)] lg:bg-[radial-gradient(42%_58%_at_70%_50%,rgb(211_175_55/0.075),transparent_72%)]"
        />
        <HeroParticles />

        <div className="container-site relative z-10 grid grid-cols-[minmax(0,1fr)] pt-[calc(var(--header-h)+2.75rem)] pb-4 sm:pb-6 lg:h-full lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] lg:gap-6 lg:pt-[var(--header-h)] lg:pb-0">
          <div className="flex flex-col justify-center lg:pb-10">
            <p className="eyebrow animate-rise mb-6 flex items-center gap-3 [--delay:300ms]">
              <span aria-hidden className="h-px w-8 bg-gold/70" />
              Omniscient Industries
            </p>
            <h1
              id="hero-title"
              className="text-display animate-rise text-[clamp(2.3rem,6.2vw,5.4rem)] text-bone [--delay:420ms] min-[1800px]:text-[4.6vw]"
            >
              Intelligence for the physical world.
            </h1>
            <p className="animate-rise mt-6 max-w-[37rem] text-[1rem] leading-relaxed text-stone [--delay:560ms] sm:text-[1.0625rem] lg:mt-8 min-[1800px]:max-w-[39rem] min-[1800px]:text-[1.1875rem]">
              Omniscient connects fragmented systems, operational data and real-world environments
              into a living Company Brain—helping complex organisations understand what is
              happening, identify risk earlier and act with confidence.
            </p>
            <div className="animate-rise mt-8 flex flex-wrap items-center gap-3 [--delay:700ms] lg:mt-10">
              <GoldButton href="/industries">Explore Industries</GoldButton>
              <GoldButton href="/mission" variant="secondary">
                Our Mission
              </GoldButton>
            </div>
            <p className="animate-fade mt-8 font-mono text-[0.6875rem] tracking-[0.22em] text-stone uppercase [--delay:1000ms] lg:mt-12">
              Perceive. <span className="text-gold-muted">/</span> Understand.{" "}
              <span className="text-gold-muted">/</span> Act.
            </p>
          </div>
        </div>

        <CompanyBrainOrbit ref={stage} />

        <BrainPhaseHud ref={hud} />

        <p className="sr-only">
          Illustration of the Omniscient Company Brain: a small rotating globe at the centre of an
          orbital system, connected to six operating environments — Rail, Public Security, Construction, Airports, Farming and
          Mining. As the page scrolls, fragmented signals are perceived, organised into understood
          relationships, and an illustrative operational conflict is detected and resolved into a
          recommended action for human approval.
        </p>
      </div>
    </section>
  );
}
