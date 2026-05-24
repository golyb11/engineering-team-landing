# Auto

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

**Debug requests, questions, and investigations:** answer or investigate first. Do not create a plan upfront — the user needs an answer, not a plan. A plan may become relevant later once the investigation reveals what needs to change.

**For all other tasks**, before writing any code, assess the scope of the actual change (not the prompt length — a one-sentence prompt can describe a large feature). Scale your approach:

- **Trivial** (typo, config tweak, single obvious change): implement directly, no plan needed.
- **Small** (a few files, clear what to do): write 2–3 sentences in `plan.md` describing what and why, then implement. No substeps.
- **Medium** (multiple components, design decisions, edge cases): write a plan in `plan.md` with requirements, affected files, key decisions, verification. Break into 3–5 steps.
- **Large** (new feature, cross-cutting, unclear scope): gather requirements and write a technical spec first (`requirements.md`, `spec.md` in `{@artifacts_path}/`). Then write `plan.md` with concrete steps referencing the spec.

**Skip planning and implement directly when** the task is trivial, or the user explicitly asks to "just do it" / gives a clear direct instruction.

To reflect the actual purpose of the first step, you can rename it to something more relevant (e.g., Planning, Investigation). Do NOT remove meta information like comments for any step.

Rule of thumb for step size: each step = a coherent unit of work (component, endpoint, test suite). Not too granular (single function), not too broad (entire feature). Unit tests are part of each step, not separate.

Update `{@artifacts_path}/plan.md` if it makes sense to have a plan and task has more than 1 big step.

## Implementation Plan

Stack chosen: **Vite + Vanilla TypeScript** (smallest bundle, blazing-fast cold start for Render free tier, Lighthouse 100/100 friendly) + **GSAP/ScrollTrigger** for animations + **Lenis** for smooth scroll + **express** lightweight static server.

### [x] Step: Project scaffolding (package.json, vite config, express server, index.html, SEO meta)
### [x] Step: Global styles, CSS variables, typography (Space Grotesk + Inter via Google Fonts), reset, utilities
### [x] Step: Core utilities — Lenis smooth scroll, custom cursor, GSAP setup, preloader, scroll reveal
### [x] Step: Hero section (typography composition, team illustration parallax, scroll indicator)
### [x] Step: Expertise section (pinned layout, body theme invert via ScrollTrigger, hover reveal)
### [x] Step: Stack marquee (text-stroke, hover slowdown + fill)
### [x] Step: Footer (huge headline, magnetic Telegram button, copyright)
### [x] Step: Responsive optimizations + build verification + Render deploy instructions

## Build verification

`npm install` + `npm run build` complete successfully.
Bundle sizes (gzip):
- HTML 4.61 kB
- CSS 3.93 kB
- JS app 20.43 kB, GSAP chunk 27.81 kB, Lenis chunk 5.25 kB
- Total JS ~53 kB gzip — well within Lighthouse 100/100 budgets.

## Deploy to Render.com (free tier)

**Option A — Static Site (recommended):**
1. Push the project to a GitHub repository.
2. On Render → New + → Static Site → connect the repo.
3. Build command: `npm ci && npm run build`
4. Publish directory: `dist`
5. (Optional) Add the `render.yaml` blueprint and use *Blueprints* instead — Render picks it up automatically.

**Option B — Node web service** (only if you later need API routes via `server.js`):
1. Render → New + → Web Service → connect the repo.
2. Runtime: Node.
3. Build command: `npm ci && npm run build`
4. Start command: `npm start`
5. Free plan; cold-starts on inactivity (~30 s).

**Local dev:** `npm install` then `npm run dev` → http://localhost:5173

**Telegram link:** edit `index.html` and replace `https://t.me/YOUR_CHANNEL_LINK_HERE`.
