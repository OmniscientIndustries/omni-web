import type { MediaAsset, ProceduralVisual } from "./industries";

export type NewsCategory =
  | "Research"
  | "Rail Intelligence"
  | "Public Security"
  | "Digital Twins"
  | "Edge AI"
  | "Company";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export type NewsArticle = {
  slug: string;
  title: string;
  category: NewsCategory;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /**
   * "draft" entries are editorial perspectives awaiting approval. They are
   * labelled on the page, excluded from Article structured data and noindexed.
   */
  status: "draft" | "published";
  summary: string;
  readingMinutes: number;
  image?: MediaAsset;
  procedural?: ProceduralVisual | "brain";
  body: ArticleBlock[];
};

export const news: NewsArticle[] = [
  {
    slug: "data-rich-decision-poor",
    title: "Why physical operations are data-rich and decision-poor",
    category: "Research",
    date: "2026-09-29",
    status: "draft",
    summary:
      "Complex organisations rarely lack data. They lack a shared, trustworthy picture of how people, assets, places and work relate at the moment a decision is needed.",
    readingMinutes: 5,
    procedural: "brain",
    body: [
      {
        type: "p",
        text: "Railways, construction sites, airports, farms and mines generate a remarkable volume of information. Rosters, permits, asset registers, inspection reports, sensor feeds, telematics, drawings and incident logs all describe some part of what is happening. Yet when a supervisor needs to know whether it is safe to proceed, the answer is often assembled by phone call, memory and spreadsheet.",
      },
      {
        type: "h2",
        text: "Fragmentation is the default state",
      },
      {
        type: "p",
        text: "Each system was usually introduced to solve a specific problem, owned by a specific team. Modern applications sit beside legacy databases, documents and paper processes. The result is not a lack of data but a lack of relationships between data: who is where, what they are qualified to do, which assets are affected, and what has changed since the plan was made.",
      },
      {
        type: "list",
        items: [
          "Information is accurate locally but inconsistent across systems.",
          "Context arrives late, after a decision has already been taken.",
          "Risk emerges from interactions between systems that no single system can see.",
        ],
      },
      {
        type: "h2",
        text: "From records to a living model",
      },
      {
        type: "p",
        text: "Our working thesis is that operational intelligence starts with a model of relationships rather than another dashboard. If people, assets, locations, work and conditions are connected in a single evidence-backed representation, then questions that were previously expensive to answer become routine — and genuinely new risks become visible earlier.",
      },
      {
        type: "p",
        text: "That model must respect permissions, keep track of where each piece of evidence came from and leave accountable decisions with the people responsible for them. Intelligence that cannot be traced or questioned is not useful in a safety-critical environment.",
      },
    ],
  },
  {
    slug: "worker-protection-live-context",
    title: "Designing worker protection around live operational context",
    category: "Rail Intelligence",
    date: "2026-09-22",
    status: "draft",
    summary:
      "Track worker safety depends on information held across planning, competence, access and control systems. We explore what changes when that context is connected in real time.",
    readingMinutes: 6,
    image: {
      src: "/media/rail-operational-intelligence.webp",
      alt: "Track workers in high-visibility clothing beside a passing train at dusk, with gold callouts marking railway assets.",
      width: 1024,
      height: 573,
      focal: "70% 55%",
    },
    body: [
      {
        type: "p",
        text: "Safe work on or near the railway depends on many things being true at once: the right people with the right competencies, in the right place, under the right protection arrangements, for the right period. Each of those conditions is typically managed in a different system.",
      },
      {
        type: "h2",
        text: "Where the gaps appear",
      },
      {
        type: "list",
        items: [
          "Competence and fatigue information is rarely visible at the point of work.",
          "Planned possessions and isolations can drift from what is happening on site.",
          "Changes to work zones are communicated verbally and recorded later.",
        ],
      },
      {
        type: "p",
        text: "None of these gaps is new, and the industry has strong processes to manage them. The opportunity is to give those processes better, more timely context — not to replace them.",
      },
      {
        type: "h2",
        text: "Principles we are designing to",
      },
      {
        type: "p",
        text: "Any system supporting worker protection must be conservative by design. It should surface conflicts and missing information clearly, show the evidence behind every alert, and leave authority with the people accountable for safety. It must also degrade gracefully when connectivity or data quality is poor, because that is precisely when the railway is most demanding.",
      },
    ],
  },
  {
    slug: "consent-privacy-human-review",
    title: "Consent, privacy and human review in community hate reporting",
    category: "Public Security",
    date: "2026-09-15",
    status: "draft",
    summary:
      "SARVA is being designed so that people control what they share, AI assists rather than decides, and patterns are understood at community level rather than about individuals.",
    readingMinutes: 5,
    procedural: "sarva",
    body: [
      {
        type: "p",
        text: "Hate incidents are widely under-reported. People may be unsure whether what happened to them counts, worry about being identified, or find reporting processes difficult in their own language. A reporting platform has to earn trust before it can be useful.",
      },
      {
        type: "h2",
        text: "Consent before anything else",
      },
      {
        type: "p",
        text: "SARVA lets people write or speak their report, attach evidence, review everything before submission and choose explicitly what they consent to share. A private reference allows them to follow their report without creating a public trail.",
      },
      {
        type: "h2",
        text: "AI assists. People decide.",
      },
      {
        type: "p",
        text: "AI-assisted triage can help structure a report and suggest whether it may describe a possible hate crime, a hate incident, or needs more information. Every suggestion is visible as a suggestion, with its confidence and evidence, and is followed by human review. Software does not determine guilt or make legal decisions.",
      },
      {
        type: "h2",
        text: "Patterns, not people",
      },
      {
        type: "p",
        text: "The value of many reports together is understanding where and when harm is concentrated, so that communities and authorised teams can respond. SARVA presents those patterns at broad-area level and avoids exposing exact addresses or tracking individuals.",
      },
    ],
  },
  {
    slug: "from-drone-flight-to-digital-twin",
    title: "From drone flight to digital twin: inspecting infrastructure in context",
    category: "Digital Twins",
    date: "2026-09-08",
    status: "draft",
    summary:
      "Autonomous capture can turn bridges, cuttings and structures into measurable digital twins. The harder problem is connecting what they reveal to maintenance decisions.",
    readingMinutes: 4,
    image: {
      src: "/media/rail-drone-digital-twin.webp",
      alt: "A drone scans a stone railway viaduct, converting the arches into a gold wireframe digital twin with a highlighted crack.",
      width: 1024,
      height: 573,
      focal: "60% 50%",
    },
    body: [
      {
        type: "p",
        text: "Drone-based capture makes it possible to survey structures more frequently and with less exposure for people working at height or near the line. Photogrammetry and laser scanning can reconstruct those structures as detailed three-dimensional models.",
      },
      {
        type: "h2",
        text: "A model is not yet a decision",
      },
      {
        type: "p",
        text: "A digital twin becomes operationally useful when change can be compared over time, defects can be linked to asset records, and findings can be prioritised alongside everything else competing for maintenance resource and track access.",
      },
      {
        type: "list",
        items: [
          "Capture: repeatable, planned flights with consistent coverage.",
          "Reconstruct: geometry and imagery aligned to known asset locations.",
          "Compare: change detection against previous inspections.",
          "Prioritise: findings placed in the context of risk, access and planned work.",
        ],
      },
    ],
  },
  {
    slug: "edge-ai-limited-connectivity",
    title: "Edge AI for environments where connectivity cannot be assumed",
    category: "Edge AI",
    date: "2026-09-01",
    status: "draft",
    summary:
      "Cuttings, tunnels, remote fields and mine sites rarely offer reliable connectivity. Efficient models at the edge keep operational intelligence available where the work happens.",
    readingMinutes: 4,
    procedural: "mining",
    body: [
      {
        type: "p",
        text: "Much of the physical world is poorly connected. Systems that depend on constant cloud access fail exactly where operational risk is highest. Running efficient models close to sensors and people reduces latency and keeps essential capability available offline.",
      },
      {
        type: "h2",
        text: "Efficiency as a design constraint",
      },
      {
        type: "p",
        text: "Edge deployment forces discipline: smaller models, careful quantisation, predictable memory use and attention to power. Research into efficient AI and open hardware architectures such as RISC-V is directly relevant to making this practical at scale.",
      },
      {
        type: "p",
        text: "The aim is not to move everything to the edge, but to decide deliberately which perception and alerting functions must keep working when the network does not.",
      },
    ],
  },
];

export const sortedNews = [...news].sort((a, b) => b.date.localeCompare(a.date));

export function getArticle(slug: string) {
  return news.find((a) => a.slug === slug);
}

export function getRelated(slug: string, count = 2) {
  const current = getArticle(slug);
  const others = sortedNews.filter((a) => a.slug !== slug);
  const sameCategory = others.filter((a) => a.category === current?.category);
  return [...sameCategory, ...others.filter((a) => !sameCategory.includes(a))].slice(0, count);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
