# Omniscient Industries — website

Next.js 16 (App Router, Turbopack) · React 19 · strict TypeScript · Tailwind CSS v4 · Motion · GSAP ScrollTrigger (Company Brain hero only).

## Commands

```bash
npm run dev         # http://localhost:3000
npm run typecheck
npm run lint
npm run build && npm run start
npm run test:e2e    # Playwright; starts `next start` on :3100 (build first)
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e   # against a running server
```

Playwright uses the locally installed Chrome (`channel: "chrome"`); set `PW_CHANNEL` to change it.

Visual QA helpers (screenshots go to `qa-output/`, which is git-ignored):

```bash
node scripts/qa-shots.mjs http://localhost:3000 /,/contact 1440,390     # HERO=1 REDUCED=1 NO_WEBGL=1 SECTIONS=1 FULL=0
node scripts/qa-view.mjs  http://localhost:3000 "#main" 1440 qa-output/view.png
```

## Environment

Copy `.env.example` to `.env.local`. Never commit real values.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production URL. Enables canonical links, the sitemap URL and absolute social URLs. |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Contact-form delivery via Resend (`lib/contact/delivery.ts`). |

Without delivery configured, the contact form never claims success: in development it logs the enquiry on the server and says “not delivered”; in production it says the form is not yet connected. Rate limiting (`lib/contact/rate-limit.ts`) is in-memory per instance — swap in a shared store (e.g. Upstash Redis) behind the same interface for serverless hosting.

## Content

All copy lives in typed modules under `content/`:

- `site.ts` — name, tagline, navigation, founders
- `industries.ts`, `rail.ts`, `sarva.ts`, `company.ts`, `contact.ts`
- `news.ts` — articles. `status: "draft"` entries are labelled “Draft perspective”, noindexed and excluded from Article structured data and the sitemap. Change to `"published"` once approved.

## Brand assets and imagery

- **Logo:** `components/brand/OmniscientMark.tsx` is a temporary placeholder. Place the approved mark at `public/brand/omniscient-mark.svg` and swap the component’s SVG for it (also replace `app/icon.svg`).
- **Industry imagery:** `public/media/`. Rail uses the supplied images. Other industries use procedural SVG visuals until approved imagery is set via `image` in `content/industries.ts` / `content/news.ts`.
- **Legal:** footer privacy/terms/cookie entries and the SARVA independence statement are placeholders for approved legal copy.

## Company Brain

`components/sections/CompanyBrainHero.tsx` owns the hero; `components/hero/brain/` holds the orbital visualisation: a compact canvas globe at the core, six tilted orbits, and the six industries connected back into it. No WebGL.

- `brain-config.ts` — globe position, node placements (desktop + tablet, depth, route curvature), orbit radii/tilts/periods, the phone ring, and the globe's 24 s rotation.
- `draw-globe.ts` — draws the globe (latitude/longitude lines, infrastructure points, quiet network links, rim light) for a given rotation angle.
- `CompanyBrainOrbit.tsx` — the stage and its single rAF loop (globe at 30 fps; phone ring). Each orbit is rendered twice, clipped to its far and near halves, so it passes behind and in front of the globe.
- `BrainNodes.tsx` — industry links. Icons are `public/assets/<slug>-node.svg` (placeholders — replace with the final artwork using the same file names); labels are HTML. Hover/focus reveals purpose, touch uses tap-to-reveal then tap-to-navigate.
- ScrollTrigger (desktop: pinned, `+=160%`; tablet/mobile: unpinned) writes `data-phase` / `data-status`; CSS in `globals.css` ("Company Brain orbit") drives Perceive → Understand → Act, brightening the Rail and Construction routes.
- Animations pause offscreen or when the tab is hidden; reduced motion draws a still globe and removes orbit drift, beads, pulses, float, parallax and twinkle.
- `public/assets/omniscient-company-brain-earth.png` is kept for future sections but is not used in the hero.
