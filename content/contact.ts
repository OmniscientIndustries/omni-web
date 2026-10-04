export const contactCategories = [
  {
    id: "industry-pilots",
    label: "Industry pilots",
    description: "Explore an operational pilot in rail, public security or an expansion environment.",
  },
  {
    id: "research-collaboration",
    label: "Research collaboration",
    description: "AI systems, geospatial intelligence, digital twins and safety-critical engineering.",
  },
  {
    id: "technology-partnerships",
    label: "Technology partnerships",
    description: "Integration, sensing, autonomy and data platform partnerships.",
  },
  {
    id: "investment",
    label: "Investment",
    description: "Conversations with investors aligned with long-term infrastructure technology.",
  },
  {
    id: "general",
    label: "General enquiries",
    description: "Anything else you would like to discuss with the team.",
  },
] as const;

export type ContactCategoryId = (typeof contactCategories)[number]["id"];

export function isContactCategory(value: unknown): value is ContactCategoryId {
  return contactCategories.some((c) => c.id === value);
}
