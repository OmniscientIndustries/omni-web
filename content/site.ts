export const site = {
  name: "Omniscient Industries",
  shortName: "Omniscient",
  tagline: "Intelligence for the physical world.",
  description:
    "Omniscient Industries builds operational intelligence systems for rail, public security and complex physical environments using AI, geospatial technology and digital twins.",
  /** Set NEXT_PUBLIC_SITE_URL once the production domain is confirmed. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, ""),
  founders: ["Arnav Anchan", "Rishay"],
} as const;

export type NavItem = {
  label: string;
  href: string;
  emphasis?: boolean;
};

export const primaryNavigation: NavItem[] = [
  { label: "Industries", href: "/industries" },
  { label: "Mission", href: "/mission" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact", emphasis: true },
];

export const operatingModel = [
  {
    id: "perceive",
    label: "Perceive",
    description:
      "Connect operational systems, people, assets, sensors and environments.",
  },
  {
    id: "understand",
    label: "Understand",
    description:
      "Create a living, evidence-backed operational model of relationships, risk and context.",
  },
  {
    id: "act",
    label: "Act",
    description:
      "Support human decisions and carefully controlled actions with permissions, provenance and accountability.",
  },
] as const;
