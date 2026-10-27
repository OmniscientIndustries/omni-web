"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { createBrainStore } from "@/components/three/brain-config";
import { CanvasErrorBoundary } from "@/components/three/CanvasErrorBoundary";
import { CompanyBrainFallback } from "@/components/three/CompanyBrainFallback";
import { GoldButton } from "@/components/ui/GoldButton";
import { useRenderQuality, useWebGLSupport } from "@/lib/device";
import { BrainNodeLabels } from "./BrainNodeLabels";
import { BrainPhaseHud, phaseFor, statusFor } from "./BrainPhaseHud";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CompanyBrainCanvas = dynamic(() => import("@/components/three/CompanyBrainCanvas"), {
  ssr: false,
});

export function CompanyBrainHero() {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const hud = useRef<HTMLDivElement>(null);
  const [store] = useState(createBrainStore);
  const [running, setRunning] = useState(true);
  const [failed, setFailed] = useState(false);
  const support = useWebGLSupport();
  const quality = useRenderQuality();
  const reduced = useReducedMotion() ?? false;

  const showCanvas = support === "supported" && !failed;
  const showFallback = support === "unsupported" || failed;

  const onReady = useCallback(() => {
    stage.current?.setAttribute("data-ready", "true");
  }, []);

  // Render only while the hero is visible and the tab is active.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let inView = true;
    const sync = () => setRunning(inView && document.visibilityState === "visible");
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

  // Gentle cursor parallax on fine pointers only.
  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      store.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      store.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, store]);

  // Scroll choreography: Perceive → Understand → Act.
  useGSAP(
    () => {
      const hudEl = hud.current;
      const bar = hudEl?.querySelector<HTMLElement>("[data-bar]");
      const write = (p: number) => {
        store.progress = p;
        if (!hudEl) return;
        const phase = phaseFor(p);
        const status = statusFor(p);
        if (hudEl.dataset.phase !== phase) hudEl.dataset.phase = phase;
        if (hudEl.dataset.status !== status) hudEl.dataset.status = status;
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
          ScrollTrigger.create({
            trigger: section.current,
            start: "top top",
            end: desktop ? "+=160%" : "bottom top",
            pin: desktop ? pin.current : false,
            pinSpacing: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Unpinned layouts open on the aligned ring and resolve as the hero scrolls away.
            onUpdate: (self) => write(desktop ? self.progress : 0.42 + 0.58 * self.progress),
            onRefresh: (self) => write(desktop ? self.progress : 0.42 + 0.58 * self.progress),
          });
        },
      );
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-labelledby="hero-title" className="relative">
      <div ref={pin} className="relative isolate w-full bg-ink-950 landscape:max-lg:grid landscape:max-lg:grid-cols-[minmax(0,46%)_minmax(0,1fr)] landscape:max-lg:items-center landscape:max-lg:pt-[var(--header-h)] lg:block lg:h-svh lg:min-h-[720px] lg:overflow-hidden lg:pt-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(50%_60%_at_68%_48%,rgb(211_175_55/0.07),transparent_70%)] lg:block"
        />

        <div
          ref={stage}
          data-ready="false"
          className="group/stage relative h-[clamp(188px,38svh,320px)] w-full max-lg:mt-[var(--header-h)] landscape:max-lg:mt-0 landscape:max-lg:h-[min(78svh,360px)] md:portrait:h-[clamp(300px,40svh,440px)] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(70%_65%_at_50%_48%,rgb(211_175_55/0.08),transparent_72%)] lg:hidden"
          />
          {showCanvas ? (
            <>
              <BrainLoader />
              <div aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-[1200ms] ease-[var(--ease-brand)] group-data-[ready=true]/stage:opacity-100">
                <CanvasErrorBoundary onError={() => setFailed(true)}>
                  <CompanyBrainCanvas store={store} quality={quality} reduced={reduced} running={running} onReady={onReady} />
                </CanvasErrorBoundary>
              </div>
            </>
          ) : support === "pending" ? (
            <BrainLoader />
          ) : null}
          <noscript>
            <CompanyBrainFallback interactive={false} />
          </noscript>
          {showFallback ? (
            <div className="absolute inset-0 z-[4]">
              <CompanyBrainFallback />
            </div>
          ) : null}
          {showCanvas ? <BrainNodeLabels store={store} /> : null}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-ink-950 to-transparent lg:hidden" />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#050505_0%,rgb(5_5_5/0.88)_30%,rgb(5_5_5/0.2)_52%,transparent_62%)] lg:block"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-t from-ink-950 to-transparent lg:block" />

        <div className="pointer-events-none relative z-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] landscape:max-lg:py-6 lg:absolute lg:inset-0 lg:flex lg:h-full lg:flex-col lg:justify-center lg:pt-20 lg:pb-0">
          <div className="container-site">
            <div className="pointer-events-auto max-w-[35rem] min-[1800px]:max-w-[31vw]">
              <p className="eyebrow animate-rise mb-4 flex items-center gap-3 [--delay:900ms] lg:mb-6">
                <span aria-hidden className="h-px w-8 bg-gold/70" />
                Omniscient Industries
              </p>
              <h1
                id="hero-title"
                className="text-display animate-rise text-[clamp(1.85rem,8vw,2.35rem)] text-bone [--delay:1050ms] sm:text-[clamp(2.15rem,5vw,2.75rem)] landscape:max-lg:text-[clamp(1.55rem,3vw,2rem)] lg:text-[clamp(2.6rem,6.2vw,5.4rem)] min-[1800px]:text-[4.6vw]"
              >
                A living picture of the operation.
              </h1>
              <p className="animate-rise mt-4 max-w-[34rem] text-[0.9375rem] leading-relaxed text-stone [--delay:1250ms] sm:mt-6 sm:text-[1.0625rem] lg:mt-8 lg:max-w-[30rem] xl:max-w-[34rem] min-[1800px]:max-w-[28vw] min-[1800px]:text-[1.1875rem]">
                Omniscient connects fragmented systems, operational data and real-world environments
                into a living Company Brain—helping complex organisations understand what is
                happening, identify risk earlier and act with confidence.
              </p>
              <div className="animate-rise mt-6 flex flex-col gap-3 [--delay:1450ms] sm:flex-row sm:flex-wrap sm:items-center lg:mt-10">
                <GoldButton href="/industries" className="w-full sm:w-auto">
                  Explore Industries
                </GoldButton>
                <GoldButton href="/mission" variant="secondary" className="w-full sm:w-auto">
                  Our Mission
                </GoldButton>
              </div>
              <p className="animate-fade mt-6 font-mono text-[0.6875rem] tracking-[0.22em] text-stone uppercase [--delay:1800ms] lg:mt-12">
                Perceive. <span className="text-gold-muted">/</span> Understand.{" "}
                <span className="text-gold-muted">/</span> Act.
              </p>
            </div>
          </div>
        </div>

        <BrainPhaseHud ref={hud} />

        <p className="sr-only">
          Illustration of the Omniscient Company Brain: a central intelligence core connected to six
          operating environments — Rail, Public Security, Construction, Airports, Farming and Mining.
          As the page scrolls, fragmented signals are perceived, organised into understood
          relationships, and an illustrative operational conflict is detected and resolved into a
          recommended action for human approval.
        </p>
      </div>
    </section>
  );
}

function BrainLoader() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700 group-data-[ready=true]/stage:opacity-0 lg:inset-y-0 lg:left-[38%] lg:justify-start"
    >
      <div className="relative flex flex-col items-center gap-5">
          <span className="relative block size-2 rounded-full bg-gold-bright shadow-[0_0_24px_6px_rgb(211_175_55/0.45)]">
          <span className="absolute inset-0 animate-ping rounded-full bg-gold/60 motion-reduce:hidden" />
        </span>
        <span className="font-mono text-[0.625rem] tracking-[0.22em] text-stone-dim uppercase">Initialising</span>
      </div>
    </div>
  );
}
