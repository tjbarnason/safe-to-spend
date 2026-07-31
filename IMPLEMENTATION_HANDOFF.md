# Implementation Handoff — Nymbus Financial Decision Confidence

## Project Status

**Phase:** Planning Complete — Ready for Implementation  
**Date:** July 2025  
**Confidence:** High — all execution artifacts are approved and materialized to disk

---

## Completed Planning Work

The following work was completed across planning sessions and is fully materialized in project files:

| Phase | Deliverable | Status |
|-------|-------------|--------|
| Problem Validation | Market research, customer job definition, root cause analysis, alternative assessment, strategic gap identification | Done |
| Product Thesis | Core insight, differentiation thesis, strategic beliefs, falsifiable assumptions | Done |
| Product Vision | Vision statement, future state, experience principles, success definition | Done |
| Product Strategy | Target customer, beachhead market, B2B2C distribution, FI value prop, business model, competitive strategy | Done |
| Solution Validation | "Safe to Spend" evolution concept, three confidence moments, key user scenarios | Done (partially truncated in file) |
| Product Requirements | 10 requirements with user stories and acceptance criteria | Done |
| Technical Design | Architecture, domain services, data models, API contracts, UI components, 21 correctness properties, error handling, testing strategy | Done |
| Implementation Plan | 13 task groups, subtask breakdown, dependency graph, traceability matrix | Done |

---

## What to Build

**Financial Decision Confidence** — a Next.js application that gives credit union members a clear, real-time view of their near-term financial capacity through three confidence moments:

1. **Ambient Confidence** — Dashboard Position Card showing available capacity after upcoming obligations
2. **Active Confidence** — Consequence Explorer answering "What if I spend $X?"
3. **Protective Confidence** — Proactive Heads-Up alerts when a shortfall is projected

---

## Frozen Specifications

The following decisions are final. Do not reinterpret or redesign:

### Technology Stack
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + shadcn/ui (neutral banking palette, no red)
- **Charts:** Recharts (lightweight SVG, accessible)
- **Dates:** date-fns (lightweight, tree-shakeable, immutable)
- **Testing:** Vitest + fast-check (property-based, minimum 100 iterations)
- **Data:** In-memory MockDataProvider (no database for MVP)

### Architecture Decisions
- Pure domain services with no framework dependency
- Server Components for data-heavy views; Client Components only where interactivity requires it
- Provider abstraction for data access (MockDataProvider now, Plaid/MX later)
- Integer cents for all currency (format to dollars only at display boundary)
- Deterministic mock data seeded from configurable reference date

### Design Constraints
- Mobile-first responsive (375px, 768px, 1024px breakpoints)
- WCAG 2.1 Level AA compliance
- No red in financial displays (green for comfortable, amber for watch, blue/neutral for alerts)
- Plain language, no financial jargon
- 44px minimum touch targets
- Calm emotional tone throughout

### Mock Data Profile ("Sarah")
- Checking account ~$2,400
- Primary income: Biweekly payroll $2,847 net (every other Friday)
- Secondary income: Irregular gig $150–$300
- 9 obligations: Rent $1,250 (1st), Car $389 (15th), Insurance $127 (22nd), Electric $95–$165 (~12th), Phone $85 (18th), Streaming $22.99 (5th), Gym $49.99 (1st), Internet $69.99 (8th), Student loan $275 (20th)
- 90+ days transaction history

---

## Assumptions

1. **MVP scope:** Single checking account, single member profile, mock data only
2. **No authentication:** The demo app does not require login
3. **No persistence:** All data lives in-memory via MockDataProvider; no database
4. **No real API integrations for MVP:** Plaid/MX integration is designed-for but not implemented
5. **Deployment target:** Vercel (or local-only with clear setup instructions)
6. **The assessment evaluates product thinking as heavily as code** — the planning artifacts carry significant weight

---

## Implementation Constraints

1. **Follow the task order in `tasks.md`** — tasks are sequenced by dependency graph
2. **Domain services first, UI second** — implement and test all domain logic before building pages
3. **Property-based tests validate correctness properties** — each property maps to specific requirements
4. **All monetary values in integer cents** — never use floating point for money
5. **Tasks marked with `*` are optional** — skip for faster MVP if needed
6. **Checkpoints (tasks 5, 7, 12)** — pause and verify all tests pass before proceeding

---

## First Execution Steps

Start implementation by executing tasks in this order:

### Step 1: Project Scaffolding (Task 1.1)
```bash
npx create-next-app@latest nymbus-app --typescript --tailwind --app --src-dir
cd nymbus-app
# Install dependencies
npm install date-fns recharts
npm install -D vitest @testing-library/react @testing-library/jest-dom fast-check jsdom @vitejs/plugin-react
# Install shadcn/ui
npx shadcn@latest init
```

### Step 2: Create Directory Structure
```
src/
  app/
    api/position/route.ts
    api/obligations/route.ts
    api/income/route.ts
    api/simulate/route.ts
    api/alerts/route.ts
    position/page.tsx
    simulate/page.tsx
    page.tsx
  components/
    ui/          (shadcn components)
    position/
    obligations/
    income/
    simulate/
    alerts/
  domain/
    types.ts
    position-engine.ts
    obligation-detector.ts
    income-predictor.ts
    consequence-simulator.ts
  data/
    provider.ts
    mock-provider.ts
    mock-data/
      account.ts
      transactions.ts
      profiles.ts
  lib/
    format.ts
    constants.ts
  __tests__/
    domain/
    components/
docs/
ai-collaboration/
```

### Step 3: Domain Types (Task 2.1)
Define all interfaces in `src/domain/types.ts` exactly as specified in design.md.

### Step 4: Mock Data (Task 2.2)
Implement MockDataProvider with Sarah's profile data.

### Step 5: Continue sequentially through tasks.md
Follow the dependency graph. Run tests at each checkpoint.

---

## Expected Final Directory Structure

```
nymbus-app/
  .kiro/specs/financial-decision-confidence/
    requirements.md
    design.md
    tasks.md
  docs/
    ai-collaboration/
      session-log.md
      decision-log.md
      AI_COLLABORATION.md
      evidence-tracker.md
  src/
    app/           (pages and API routes)
    components/    (UI components by feature)
    domain/        (pure business logic)
    data/          (provider interface + mock)
    lib/           (utilities and constants)
    __tests__/     (property-based and unit tests)
  ARTIFACT_INDEX.md
  IMPLEMENTATION_HANDOFF.md
  Nymbus-Product-Specification.txt
  README.md
  package.json
  vitest.config.ts
  tailwind.config.ts
  tsconfig.json
```

---

## Authoritative Sources for Execution

| Question | Source File |
|----------|------------|
| What are the requirements? | `.kiro/specs/financial-decision-confidence/requirements.md` |
| What's the architecture? | `.kiro/specs/financial-decision-confidence/design.md` |
| What are the interfaces and data models? | `.kiro/specs/financial-decision-confidence/design.md` |
| What are the correctness properties? | `.kiro/specs/financial-decision-confidence/design.md` (Section: Correctness Properties) |
| What's the task execution order? | `.kiro/specs/financial-decision-confidence/tasks.md` |
| Why are we building this? | `Nymbus-Product-Specification.txt` |
| What are the assessment criteria? | `Take Home Assessment Product.md` |

---

## Key Reminders for the Implementation Agent

1. **Read the design.md correctness properties section carefully** — these are formal specifications that tests must validate
2. **The mock data must be deterministic** — seeded from a reference date, reproducible across runs
3. **Never use red in the UI** — this is a deliberate design decision for calm financial UX
4. **Confidence levels matter** — distinguish "confirmed" from "estimated" visually and semantically throughout
5. **The assessment values product thinking equally to code** — the README, collaboration artifacts, and spec quality matter
6. **Create the `docs/ai-collaboration/` directory during scaffolding** — capture implementation decisions as they happen
7. **Integer cents everywhere in domain logic** — `$24.00` is stored and computed as `2400`; format only at display boundary
