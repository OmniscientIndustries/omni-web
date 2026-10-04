export const sarvaHero = {
  eyebrow: "Industries / Public Security",
  product: "SARVA",
  title: "Every voice matters. Every pattern should be understood.",
  secondary: "Every voice. Every community.",
  intro:
    "SARVA is a multilingual community hate-reporting and intelligence platform serving both the public and authorised police teams — helping people report safely, and helping authorised teams understand incidents and emerging patterns accountably.",
};

export const sarvaStages = [
  {
    id: "speak",
    index: "01",
    label: "Speak",
    title: "Every voice should be heard.",
    text: "People can report in writing or by voice, in their own language. They review everything before it is submitted, attach evidence if they choose, give explicit consent for how their report is used and follow progress with a private reference.",
  },
  {
    id: "understand",
    index: "02",
    label: "Understand",
    title: "A protected report becomes structured evidence.",
    text: "AI assistance organises a report into evidence layers and suggests a triage category with its confidence. A trained person then reviews, confirms or changes that suggestion. Software assists — it does not determine guilt or make legal decisions.",
  },
  {
    id: "pattern",
    index: "03",
    label: "Reveal the pattern",
    title: "One report tells a story. Together, reports reveal a pattern.",
    text: "Many reports, aggregated to broad areas and over time, show where and when harm is concentrated and how it is changing. Exact addresses are never exposed and individuals are not tracked.",
  },
  {
    id: "act",
    index: "04",
    label: "Support action",
    title: "From reporting to understanding. From understanding to accountable action.",
    text: "Authorised teams work from a shared intelligence workspace — reviewing, prioritising and responding, with evidence provenance, classification confidence, human-review status and a complete audit trail.",
  },
] as const;

export const evidenceLayers = [
  "What happened",
  "Time",
  "Location (broad area)",
  "Verbal, physical or online",
  "Witness information",
  "Aggravating factors",
  "Whether police were informed",
  "Evidence quality",
];

export const triageCategories = [
  { label: "Possible hate crime", suggested: true },
  { label: "Hate incident", suggested: false },
  { label: "Needs more information", suggested: false },
  { label: "Insufficient or irrelevant", suggested: false },
  { label: "Possible spam", suggested: false },
];

export const audiences = {
  people: {
    label: "For People",
    heading: "Report safely, in your own words.",
    items: [
      { title: "Report safely", text: "A calm, private reporting flow designed around trust." },
      { title: "Write or speak", text: "Describe what happened in text or by voice." },
      { title: "Multilingual assistance", text: "Report in the language you are most comfortable using." },
      { title: "Review before submission", text: "See exactly what will be sent and change anything first." },
      { title: "Control consent", text: "Choose explicitly how your report may be used and shared." },
      { title: "Track through a private reference", text: "Follow progress without creating a public trail." },
    ],
  },
  police: {
    label: "For Police",
    heading: "Understand incidents with accountability.",
    items: [
      { title: "Review and triage reports", text: "Prioritise reports with AI-assisted structure and suggestions." },
      { title: "Hate crime and hate incident", text: "Distinguish potential hate crimes from hate incidents, with reviewers deciding." },
      { title: "Evidence and confidence", text: "Examine evidence quality, provenance and classification confidence." },
      { title: "Aggregated patterns", text: "Understand trends at broad-area and community level." },
      { title: "Manage workflows", text: "Move reports through review, follow-up and resolution." },
      { title: "Human oversight and audit", text: "Every decision is attributable, reviewable and recorded." },
    ],
  },
} as const;

export const sarvaPrinciples = [
  { title: "Consent first", text: "Nothing is shared beyond what a person explicitly agrees to." },
  { title: "AI assists, people decide", text: "Suggestions are visible as suggestions and are always reviewed by a person." },
  { title: "Privacy by design", text: "Patterns are aggregated to broad areas. No exact addresses. No tracking of individuals." },
  { title: "Accountable by default", text: "Evidence provenance, review status and an audit trail accompany every report." },
];
