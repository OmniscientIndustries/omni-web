export type IndustrySlug =
  | "rail"
  | "public-security"
  | "construction"
  | "airports"
  | "farming"
  | "mining";

export type ProceduralVisual =
  | "sarva"
  | "construction"
  | "airports"
  | "farming"
  | "mining";

export type MediaAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS object-position, tuned per asset so critical detail survives cropping. */
  focal?: string;
};

export type Industry = {
  slug: IndustrySlug;
  name: string;
  tier: "launch" | "expansion";
  href: string;
  /** One sentence used on cards and in the Company Brain node overlays. */
  summary: string;
  product?: string;
  concepts?: string[];
  visualBrief: string;
  /**
   * Approved imagery. When absent, a procedural visual is rendered instead.
   * Expected future assets live in /public/media (see README).
   */
  image?: MediaAsset;
  procedural?: ProceduralVisual;
};

export const industries: Industry[] = [
  {
    slug: "rail",
    name: "Rail",
    tier: "launch",
    href: "/industries/rail",
    summary: "Live operational intelligence for safer, more resilient railways.",
    concepts: [
      "Worker protection",
      "Operational control",
      "Autonomous inspection",
      "Drone-generated digital twins",
      "Predictive safety and maintenance",
    ],
    visualBrief:
      "Railway environment with intelligence callouts over signals, track, structures and work sites.",
    image: {
      src: "/media/rail-operational-intelligence.webp",
      alt: "A passenger train passes track workers at dusk while gold callouts mark a signal, a bridge arch, a rock cutting and track components.",
      width: 1024,
      height: 573,
      focal: "38% 50%",
    },
  },
  {
    slug: "public-security",
    name: "Public Security",
    tier: "launch",
    href: "/industries/public-security",
    product: "SARVA",
    summary:
      "Helping people report hate safely while giving authorised teams clearer, accountable insight into incidents and emerging patterns.",
    concepts: [
      "Multilingual reporting",
      "Consent and privacy",
      "AI-assisted triage",
      "Human review",
      "Community-level patterns",
    ],
    visualBrief:
      "One voice becomes a pattern: anonymous report pulses aggregate into broad community-level areas.",
    // Replace with /media/sarva-community-patterns.webp once approved.
    procedural: "sarva",
  },
  {
    slug: "construction",
    name: "Construction",
    tier: "expansion",
    href: "/industries#construction",
    summary:
      "Connect people, plant, progress and risk across the live construction environment.",
    visualBrief:
      "A dark construction digital twin with worker and vehicle safety zones and progress comparison.",
    // Replace with /media/construction-intelligence.webp once approved.
    procedural: "construction",
  },
  {
    slug: "airports",
    name: "Airports",
    tier: "expansion",
    href: "/industries#airports",
    summary:
      "Unify airside operations, ground assets, staff and operational risk.",
    visualBrief:
      "An airport apron at night with restrained operational routes and aircraft-turnaround intelligence.",
    // Replace with /media/airport-operations.webp once approved.
    procedural: "airports",
  },
  {
    slug: "farming",
    name: "Farming",
    tier: "expansion",
    href: "/industries#farming",
    summary:
      "Transform fields, machinery, weather and crop observations into precise operational decisions.",
    visualBrief:
      "An aerial agricultural landscape with irrigation, crop-health and machinery layers.",
    // Replace with /media/farming-intelligence.webp once approved.
    procedural: "farming",
  },
  {
    slug: "mining",
    name: "Mining",
    tier: "expansion",
    href: "/industries#mining",
    summary:
      "Create a live understanding of workers, vehicles, equipment and environmental risk.",
    visualBrief:
      "A large mine environment with haul routes, worker safety and equipment-health layers.",
    // Replace with /media/mining-intelligence.webp once approved.
    procedural: "mining",
  },
];

export const launchIndustries = industries.filter((i) => i.tier === "launch");
export const expansionIndustries = industries.filter(
  (i) => i.tier === "expansion",
);

export function getIndustry(slug: IndustrySlug): Industry {
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) throw new Error(`Unknown industry: ${slug}`);
  return industry;
}

/** Status shown on every expansion industry. Keep honest: not yet deployed, actively in development. */
export const expansionStatus = {
  label: "In development",
  short: "Not yet live — actively in development.",
  detail: (name: string) =>
    `Omniscient is not yet operating in ${name.toLowerCase()}. We are actively developing our approach and are looking for early partners to help shape it.`,
};

/** Longer overview copy for expansion industries on /industries. */
export const expansionDetail: Record<
  Exclude<IndustrySlug, "rail" | "public-security">,
  { focus: string[]; note: string }
> = {
  construction: {
    focus: [
      "Worker and plant proximity",
      "Progress against plan",
      "Permits and site access",
      "Temporary works and exclusion zones",
    ],
    note: "Construction sites change daily. A live operational model keeps people, plant and programme in the same picture.",
  },
  airports: {
    focus: [
      "Aircraft turnaround coordination",
      "Ground vehicle movement",
      "Staff and stand allocation",
      "Airside safety events",
    ],
    note: "Airside operations depend on many organisations acting in tight sequence. Shared context reduces the friction between them.",
  },
  farming: {
    focus: [
      "Field and crop observations",
      "Machinery scheduling",
      "Irrigation and weather context",
      "Drone and satellite survey layers",
    ],
    note: "Farms already generate observations from machinery, sensors and surveys. The opportunity is turning them into timely, field-level decisions.",
  },
  mining: {
    focus: [
      "Haul route and vehicle interaction",
      "Worker location and safety zones",
      "Equipment health",
      "Ground and environmental conditions",
    ],
    note: "Mines combine heavy equipment, changing terrain and remote work. Understanding how those risks interact is an operational necessity.",
  },
};
