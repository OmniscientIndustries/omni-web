export type Partner = {
  name: string;
  /**
   * Official SVG wordmark, once authorised. Place files in /public/brand/partners/
   * and set `logo` here; until then a typographic wordmark is rendered.
   */
  logo?: { src: string; width: number; height: number };
};

/** Neutral label — do not change to "Trusted by" without explicit approval. */
export const partnersLabel = "Experience and collaboration across";

export const partners: Partner[] = [
  { name: "VolkerRail" },
  { name: "NEOS" },
  { name: "SWGR" },
  { name: "University of Glasgow Drone Society" },
];
