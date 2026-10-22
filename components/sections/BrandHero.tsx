import Image from "next/image";
import { GoldButton } from "@/components/ui/GoldButton";

export function BrandHero() {
  return (
    <section aria-labelledby="hero-title" className="bg-ink-950">
      <div className="relative h-[clamp(300px,52svh,560px)]">
        <Image
          src="/brand/hero-board.jpg"
          alt="Omniscient Industries Limited"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_46%]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink-950"
        />
      </div>
      <div className="container-site pb-[max(3.5rem,env(safe-area-inset-bottom))] pt-2 sm:pt-4">
        <div className="max-w-[40rem]">
          <h1
            id="hero-title"
            className="text-display text-[clamp(1.85rem,8vw,2.6rem)] text-bone sm:text-[clamp(2.15rem,5vw,3rem)] lg:text-[clamp(2.6rem,4.6vw,4.4rem)]"
          >
            Intelligence for the physical world.
          </h1>
          <p className="mt-4 max-w-[38rem] text-[0.9375rem] leading-relaxed text-stone sm:mt-5 sm:text-[1.0625rem]">
            Omniscient Industries Limited builds software and intelligent systems for complex
            industrial and operational environments, including rail, infrastructure and public
            safety.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <GoldButton href="/industries" className="w-full sm:w-auto">
              Explore industries
            </GoldButton>
            <GoldButton href="/products/safezone-rail" className="w-full sm:w-auto">
              SafeZone Rail
            </GoldButton>
            <GoldButton href="/contact" variant="secondary" className="w-full sm:w-auto">
              Contact
            </GoldButton>
          </div>
        </div>
      </div>
    </section>
  );
}
