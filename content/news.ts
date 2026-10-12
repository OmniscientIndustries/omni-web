import type { MediaAsset } from "./industries";

export type NewsCategory =
  | "Company News"
  | "Deployments and Pilots"
  | "Product and Engineering"
  | "Field Trial"
  | "Partnerships"
  | "Founder Insight"
  | "Community Technology";

export type ArticleBlock = { type: "p"; text: string };

export type NewsImage = MediaAsset & { caption: string };

export type NewsArticle = {
  /** Stable editorial id from the content pack (01–07). */
  id: string;
  number: number;
  slug: string;
  category: NewsCategory;
  title: string;
  standfirst: string;
  body: ArticleBlock[];
  image: NewsImage;
  /** The only publication date supplied by the source. Shown as-is. */
  publicationLabel: "October 2026";
  /**
   * Internal ordering key only. The source specifies October 2026 and no day.
   * 2026-10-01 is not a publication date and must not be rendered.
   */
  sortDate: "2026-10-01";
  status: "draft" | "published";
  /**
   * Article 02 names pilot organisations. It stays out of every public surface
   * until this is set to true in a reviewed commit. Do not move the copy into
   * an environment variable.
   */
  partnerNamingApproved?: boolean;
  /**
   * Internal only — never render. Records that article 04's operational
   * details need a factual check. No approver is named in the source, so this
   * flag does not invent one.
   */
  factualReviewRequired?: boolean;
};

const OCTOBER = {
  publicationLabel: "October 2026",
  sortDate: "2026-10-01",
} as const;

export const news: NewsArticle[] = [
  {
    id: "01",
    number: 1,
    slug: "introducing-omniscient-industries",
    category: "Company News",
    title: "Introducing Omniscient Industries",
    standfirst:
      "A British engineering technology company building operational intelligence systems for rail and other complex physical industries.",
    ...OCTOBER,
    status: "published",
    image: {
      src: "/images/news/introducing-omniscient-industries.webp",
      width: 1672,
      height: 941,
      alt: "Engineering team reviewing rail network information on a large display.",
      caption:
        "A clean editorial image representing the engineering team and Omniscient's rail-focused product development.",
    },
    body: [
      {
        type: "p",
        text: "Omniscient Industries has been established to build operational intelligence systems for complex physical operations. Our view is straightforward: industry does not always need more data. It needs existing information to be connected, understood and made useful at the point where people are making decisions.",
      },
      {
        type: "p",
        text: "Our initial focus is rail. Railway work depends on people, geography, planned work, asset information and operational controls aligning correctly in changing conditions. When those elements sit in separate systems, the operating picture can become fragmented. Omniscient is developing a practical layer that brings that context together without replacing established controls or professional judgement.",
      },
      {
        type: "p",
        text: "SafeZone Rail, developed within our rail programme, is the first expression of that approach. It combines mobile positioning, railway geography and configured work limits to give operatives and managers clearer spatial awareness. Beyond rail, our wider product direction includes fleet operations, agriculture, autonomous systems and infrastructure inspection. The common purpose is to turn complex operational information into timely decisions, alerts and action.",
      },
    ],
  },
  {
    id: "02",
    number: 2,
    slug: "three-rail-pilot-engagements-underway",
    category: "Deployments and Pilots",
    title: "From Development to Deployment Three Rail Pilot Engagements Underway",
    standfirst:
      "Work with SWGR, VolkerRail and NEOS Networks is helping Omniscient test SafeZone Rail against real operational needs.",
    ...OCTOBER,
    status: "draft",
    partnerNamingApproved: false,
    image: {
      src: "/images/news/three-rail-pilot-engagements-underway.webp",
      width: 1672,
      height: 941,
      alt: "Two railway operatives reviewing information beside electrified tracks.",
      caption: "A generic rail deployment image focused on collaboration between engineering and operational users.",
    },
    body: [
      {
        type: "p",
        text: "Omniscient Industries is moving SafeZone Rail from focused product development into a programme of rail industry evaluation involving SWGR, VolkerRail and NEOS Networks. The three engagements give the team an opportunity to test the product with different users, operating environments and deployment requirements.",
      },
      {
        type: "p",
        text: "The purpose is not to treat every organisation as the same. Each engagement has a different scope, but together they help answer the questions that matter before wider deployment: whether the product is clear for frontline users, how quickly it can be introduced, how reliably it presents railway geography and work limits, and what information managers need to see during and after a shift.",
      },
      {
        type: "p",
        text: "The work also creates a disciplined feedback loop between engineering and operations. Field experience is being used to refine alerts, mapping, event records, poor-connectivity behaviour and the process for converting planned work information into digital zones. For Omniscient, this stage is about evidence: proving useful functions in context, recording limitations honestly and improving the product with the people expected to use it.",
      },
    ],
  },
  {
    id: "03",
    number: 3,
    slug: "safezone-rail-spatial-awareness-railway-worksites",
    category: "Product and Engineering",
    title: "SafeZone Rail Building Spatial Awareness for Railway Worksites",
    standfirst:
      "SafeZone Rail gives authorised users a clearer view of operative position, railway geography and configured safe work limits.",
    ...OCTOBER,
    status: "published",
    image: {
      src: "/images/news/safezone-rail-spatial-awareness-railway-worksites.webp",
      width: 1672,
      height: 941,
      alt: "Railway lines with a highlighted digital work zone following one track.",
      caption: "A simple representation of a configured digital work zone aligned to railway geography.",
    },
    body: [
      {
        type: "p",
        text: "SafeZone Rail is being developed as an additional situational-awareness layer for railway work. It uses an operative's mobile device to display current position against railway-referenced mapping and a configured digital work area. As the user approaches a zone boundary, the interface provides an amber warning; a controlled exit can trigger an on-device notification and audible alarm.",
      },
      {
        type: "p",
        text: "The current test baseline uses smartphone GNSS, with field development focused on approximately three-metre positioning and track-centreline context. The product is designed to show useful operational information clearly: the worker marker, the relevant track, ELR and mileage references, distance to a configured limit, shift status and a record of key events.",
      },
      {
        type: "p",
        text: "SafeZone Rail is not a replacement for possession limits, physical protection, Safe Work Packs, PICOP or COSS instruction, or any other established railway protection arrangement. Its purpose is to help users understand where they are in relation to the work area and to provide an additional source of timely spatial information. Future development will strengthen planned-work integration, management visibility, auditability and positioning confidence.",
      },
    ],
  },
  {
    id: "04",
    number: 4,
    slug: "safezone-rail-first-on-track-functional-trial",
    category: "Field Trial",
    title: "SafeZone Rail Completes Its First On Track Functional Trial",
    standfirst:
      "An overnight trial in Springburn moved SafeZone Rail beyond desk testing and demonstrated its core warning behaviour in a live railway environment.",
    ...OCTOBER,
    status: "published",
    factualReviewRequired: true,
    image: {
      src: "/images/news/safezone-rail-first-on-track-functional-trial.webp",
      width: 1672,
      height: 941,
      alt: "Two railway operatives using SafeZone Rail during an overnight track trial.",
      caption: "A restrained editorial image representing SafeZone Rail's first controlled overnight field trial.",
    },
    body: [
      {
        type: "p",
        text: "SafeZone Rail completed its first on-track functional trial during an overnight possession in the Springburn area on 22 to 23 August 2026. Two possession-support operatives used the mobile application at separate flank-protection locations at Sighthill East Junction and Sighthill West Junction.",
      },
      {
        type: "p",
        text: "The trial tested four core functions: displaying the operative's position, presenting railway context, monitoring a configured digital test zone and providing warning behaviour at the boundary. SafeZone Rail showed the worker marker against the local railway geography, displayed the simulated zones and generated an amber approach warning. During a controlled exit, the application delivered the intended notification and audible alarm.",
      },
      {
        type: "p",
        text: "This was an initial functional proof, not a survey-grade accuracy assessment or product acceptance test. Existing possession limits, physical protection, Safe Work Packs and operational instructions remained unchanged throughout. The next phase is to run a longer instrumented trial with timestamped event logging and reference-position checks so that accuracy, boundary repeatability and alert timing can be measured more rigorously.",
      },
    ],
  },
  {
    id: "05",
    number: 5,
    slug: "backing-the-next-generation-autonomous-systems-engineers",
    category: "Partnerships",
    title: "Backing the Next Generation of Autonomous Systems Engineers",
    standfirst:
      "Omniscient Industries is sponsoring Glasgow University Drones Society for the IMechE UAS Challenge 2027.",
    ...OCTOBER,
    status: "published",
    image: {
      src: "/images/news/backing-the-next-generation-autonomous-systems-engineers.webp",
      width: 1673,
      height: 940,
      alt: "Student engineers assembling an autonomous aircraft in a workshop.",
      caption:
        "A generic student engineering image representing the development of a firefighting drone for the UAS Challenge.",
    },
    body: [
      {
        type: "p",
        text: "Omniscient Industries is providing £1,410 in sponsorship to support Glasgow University Drones Society's entry into the Institution of Mechanical Engineers UAS Challenge 2027. The funding covers the current team registration fee of £1,175 plus VAT and will help the student team progress from design and manufacture into testing and competition delivery.",
      },
      {
        type: "p",
        text: "For its competition entry, the team is developing a firefighting drone. The project brings together aerodynamics, structures, electronics, software, autonomy, safety and mission design in one demanding systems-engineering programme. That practical integration is closely aligned with the engineering culture Omniscient wants to support: ambitious technical work tested against real constraints and improved through evidence.",
      },
      {
        type: "p",
        text: "The sponsorship also reflects the company's longer-term interest in autonomous inspection, surveying and infrastructure intelligence. Through monthly progress updates, Omniscient will follow the team's engineering journey while the students retain ownership of their aircraft, technical work and intellectual property. The aim is simple: support capable young engineers as they turn an idea into a functioning autonomous system.",
      },
    ],
  },
  {
    id: "06",
    number: 6,
    slug: "the-case-for-operational-intelligence",
    category: "Founder Insight",
    title: "The Case for Operational Intelligence",
    standfirst:
      "Digital transformation has given industry more information than ever. It has not always produced a clearer view of what is happening operationally.",
    ...OCTOBER,
    status: "published",
    image: {
      src: "/images/news/the-case-for-operational-intelligence.webp",
      width: 1672,
      height: 941,
      alt: "Operator reviewing connected railway and operational information on a control display.",
      caption: "A clean representation of fragmented operational information brought together into one shared view.",
    },
    body: [
      {
        type: "p",
        text: "Complex organisations already generate large volumes of information. People hold operational knowledge. Assets create condition data. Work plans define intended activity. Mapping describes place. Sensors report status. Risk controls set the boundaries. The problem is that these sources often remain separate, leaving frontline staff and managers to assemble the operating picture themselves.",
      },
      {
        type: "p",
        text: "Operational intelligence is the layer that connects those elements around a live task. It asks practical questions: Where are people and assets? What work is authorised? What has changed? Which limit is approaching? Who needs to know? What action is now required? The answer should be timely, understandable and proportionate to the decision being made.",
      },
      {
        type: "p",
        text: "For Omniscient Industries, this is the principle behind SafeZone Rail and the wider Omniscient product direction. Technology should support established controls and professional judgement by making relevant context easier to see. The goal is not a dashboard that collects everything. It is a dependable operational view that helps the right person make a better decision at the right moment.",
      },
    ],
  },
  {
    id: "07",
    number: 7,
    slug: "building-sarva-accessible-route-reporting-hate",
    category: "Community Technology",
    title: "Building SARVA A More Accessible Route to Reporting Hate",
    standfirst:
      "SARVA is being developed as an AI-powered multilingual reporting system that helps people record hate incidents clearly and seek support.",
    ...OCTOBER,
    status: "published",
    image: {
      src: "/images/news/building-sarva-accessible-route-reporting-hate.webp",
      width: 1672,
      height: 941,
      alt: "Person using a multilingual guided-reporting application during a support conversation.",
      caption: "A simple, privacy-conscious image representing guided multilingual reporting and trusted community support.",
    },
    body: [
      {
        type: "p",
        text: "Alongside its industrial work, the team behind Omniscient has been applying the same principle of turning fragmented information into something useful and actionable to SARVA. The system is being developed to reduce the practical barriers that prevent people from reporting hate incidents, including language, uncertainty about what information is relevant and a lack of confidence in existing routes.",
      },
      {
        type: "p",
        text: "SARVA guides a user through the reporting process in their preferred language, using text or voice to help capture the incident in a clearer and more structured form. The aim is to make reporting less intimidating for the individual while giving trusted third-party reporting centres better information to support the person and, where appropriate, help them engage with the relevant authorities.",
      },
      {
        type: "p",
        text: "The initial focus is Scotland, with the Scottish Hindu Foundation seeking to strengthen its third-party reporting capability and support communities that remain underrepresented in official reporting data. Privacy, safeguarding and data protection are central to the development process. SARVA is not an emergency service and does not replace the police; it is intended to offer a more accessible route into support, reporting and earlier intervention, with the potential for wider use beyond Scotland over time.",
      },
    ],
  },
];

/** Public only when published and, where set, partner naming has been approved in-repo. */
export function isPublicArticle(article: NewsArticle) {
  return article.status === "published" && article.partnerNamingApproved !== false;
}

export const publishedNews = news.filter(isPublicArticle).sort((a, b) => a.number - b.number);

export function getArticle(slug: string) {
  return news.find((article) => article.slug === slug);
}

export function getPublicArticle(slug: string) {
  const article = getArticle(slug);
  return article && isPublicArticle(article) ? article : undefined;
}

export function getRelated(slug: string, count = 2) {
  const current = getPublicArticle(slug);
  const others = publishedNews.filter((article) => article.slug !== slug);
  const sameCategory = others.filter((article) => article.category === current?.category);
  return [...sameCategory, ...others.filter((article) => !sameCategory.includes(article))].slice(0, count);
}

/** About 200 words a minute, from the supplied paragraphs only. */
export function readingMinutes(article: NewsArticle) {
  const words = article.body.reduce((count, block) => count + block.text.split(/\s+/).filter(Boolean).length, 0);
  return Math.max(1, Math.round(words / 200));
}
