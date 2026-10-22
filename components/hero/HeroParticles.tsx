import { hash } from "@/lib/hash";

/** Rounded so server and client float math produce identical markup. */
const round = (n: number, d = 3) => Math.round(n * 10 ** d) / 10 ** d;

const particles = Array.from({ length: 64 }, (_, i) => ({
  x: round(hash(i * 1.37) * 100),
  y: round(hash(i * 2.91) * 100),
  r: round(0.6 + hash(i * 4.13) * 1.1),
  o: round(0.18 + hash(i * 5.71) * 0.42),
  t: i % 3,
  delay: round(-hash(i * 7.7) * 9, 2),
}));

/** Layer 1: sparse, slow ambient particles behind the whole hero. */
export function HeroParticles() {
  return (
    <svg aria-hidden className="hero-particles pointer-events-none absolute inset-0 size-full" preserveAspectRatio="none">
      {particles.map((p, i) => (
        <circle
          key={i}
          cx={`${p.x}%`}
          cy={`${p.y}%`}
          r={p.r}
          fill="#b79768"
          opacity={p.o}
          data-t={p.t}
          style={{ animationDelay: `${p.delay}s`, ["--o" as string]: p.o }}
        />
      ))}
    </svg>
  );
}
