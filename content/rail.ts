export const railHero = {
  eyebrow: "Industries / Rail",
  title: "A living operational picture of the railway.",
  intro:
    "Rail work depends on people, plant, access, assets and conditions lining up safely at the same moment. Omniscient connects the systems that describe each of them into one live, evidence-backed picture for planners, controllers and teams on the ground.",
};

/** Callouts over the supplied rail-operational-intelligence image (percent coordinates). */
export const railCallouts = [
  { x: 30.6, y: 46, label: "Signal state", side: "left" as const },
  { x: 65.2, y: 66, label: "Work group · competencies verified", side: "right" as const },
  { x: 70.2, y: 27, label: "Structure · inspection due", side: "right" as const },
  { x: 39.6, y: 83, label: "Track asset condition", side: "left" as const },
  { x: 85.5, y: 72, label: "Road–rail vehicle in work zone", side: "left" as const },
];

export type RailEntity = { name: string; text: string };

export const railModel: { group: string; summary: string; items: RailEntity[] }[] = [
  {
    group: "People",
    summary: "Who is on the railway, what they are qualified to do and whether they are fit to do it.",
    items: [
      { name: "Workers", text: "Live presence of individuals and work groups, linked to their planned tasks." },
      { name: "Competencies", text: "Qualifications and authorisations checked against the work being undertaken." },
      { name: "Fatigue", text: "Shift patterns and hours considered before people are committed to work." },
    ],
  },
  {
    group: "Work and access",
    summary: "Where work is happening, under which protection arrangements and with which equipment.",
    items: [
      { name: "Sites", text: "Access points, compounds and locations described in a shared geospatial model." },
      { name: "Work zones", text: "Planned and live boundaries of work, kept consistent with what is happening on site." },
      { name: "Possessions", text: "Possession limits and timings connected to the work and people inside them." },
      { name: "Isolations", text: "Electrical isolation status associated with the zones and tasks that depend on it." },
      { name: "Vehicles", text: "On-track and road–rail plant located relative to people and work zones." },
    ],
  },
  {
    group: "Assets and condition",
    summary: "What state the infrastructure is in and how that should shape upcoming work.",
    items: [
      { name: "Infrastructure", text: "Track, structures, earthworks and signalling assets as connected records." },
      { name: "Inspection", text: "Findings from people, sensors and drones linked to the assets they describe." },
      { name: "Predictive maintenance", text: "Emerging condition trends surfaced early enough to plan work and access." },
    ],
  },
];

export const railPrinciples = [
  {
    title: "Supports established safety processes",
    text: "Omniscient is designed to give existing safety management processes better context. It does not replace the rules, roles or authorities that govern work on the railway.",
  },
  {
    title: "Evidence behind every alert",
    text: "Conflicts and gaps are presented with the records that produced them, so people can verify a concern quickly rather than trusting a black box.",
  },
  {
    title: "Conservative when data is missing",
    text: "Absent or stale information is shown as uncertainty, never silently treated as safe.",
  },
];

export const droneSteps = [
  { step: "Capture", text: "Planned, repeatable drone flights collect consistent imagery of bridges, viaducts, cuttings and structures — reducing time spent at height or near the line." },
  { step: "Reconstruct", text: "Imagery becomes a measurable three-dimensional digital twin aligned to known asset locations." },
  { step: "Compare", text: "Change detection highlights cracking, movement or deterioration against previous inspections." },
  { step: "Prioritise", text: "Findings are placed in context with risk, planned work and track access so maintenance can be scheduled sensibly." },
];
