← Previous: [Decision Log](./06_Decision_Log.md)
→ Implementation: [Spec](../.kiro/specs/financial-decision-confidence/requirements.md)

---

# Reviewer Guide

This guide helps you navigate the repository efficiently in 10-15 minutes, understanding both the product thinking and the technical implementation.

## Repository Structure

```
nymbus/
├── docs/                          → Product thinking (WHY)
│   ├── 00_Project_Overview.md     → Executive summary, start here
│   ├── 01_Problem_Validation.md   → Evidence base, market research
│   ├── 02_Product_Thesis.md       → Core beliefs, strategic positioning
│   ├── 03_Product_Vision.md       → Future state, design principles
│   ├── 04_Product_Strategy.md     → Distribution, differentiation
│   ├── 05_Solution_Validation.md  → How solution addresses the problem
│   ├── 06_Decision_Log.md         → Key decisions with rationale
│   └── 07_Reviewer_Guide.md       → This file
│
├── .kiro/specs/                    → Feature specification (WHAT)
│   └── financial-decision-confidence/
│       ├── requirements.md        → Acceptance criteria (10 requirements)
│       ├── design.md              → Technical architecture and interfaces
│       └── tasks.md               → Implementation plan with dependencies
│
├── ai-collaboration/              → AI partnership methodology (HOW)
│   ├── AI_COLLABORATION.md        → How AI was used as PM partner
│   ├── session-log.md             → Chronological work entries
│   ├── evidence-tracker.md        → Research sources with confidence
│   └── methodology.md            → Discovery-to-implementation approach
│
├── src/                           → Implementation (BUILD)
│   ├── domain/                    → Pure business logic (no framework deps)
│   ├── data/                      → Provider abstraction + mock data
│   ├── app/                       → Next.js pages and API routes
│   ├── components/                → UI components by feature area
│   ├── lib/                       → Utilities (formatting, constants)
│   └── __tests__/                 → Test suites (unit + property-based)
│
└── package.json                   → Dependencies and scripts
```

## Suggested 10-Minute Reading Path

### Minutes 1-2: Context (Start Here)
1. **[docs/00_Project_Overview.md](./00_Project_Overview.md)** — What this is, who it's for, why it matters. Read the full page.

### Minutes 3-4: Problem & Thesis
2. **[docs/01_Problem_Validation.md](./01_Problem_Validation.md)** — Focus on the "Three Strategic Gaps" section. This is the insight.
3. **[docs/02_Product_Thesis.md](./02_Product_Thesis.md)** — Read the "Conventional Wisdom vs. Our Belief" table. This is the contrarian positioning.

### Minutes 5-6: Solution & Strategy
4. **[docs/05_Solution_Validation.md](./05_Solution_Validation.md)** — Focus on "Three Confidence Moments" and "From Insight to Action: Next Best Actions." This is how the thesis becomes a platform capability.
5. **[docs/00_Project_Overview.md](./00_Project_Overview.md)** — Re-read the "Strategic Evolution" section (Reporting → Predicting → Recommending). This frames the differentiation.

### Minutes 7-8: Technical Architecture
5. **[.kiro/specs/financial-decision-confidence/design.md](../.kiro/specs/financial-decision-confidence/design.md)** — Architecture diagram and key decisions table. This shows the system design.

### Minutes 9-10: Implementation & Evidence
6. **[src/domain/](../src/domain/)** — Scan the domain services. Pure TypeScript, no framework dependencies, property-testable.
7. **[ai-collaboration/evidence-tracker.md](../ai-collaboration/evidence-tracker.md)** — 17 research sources with confidence ratings. This shows the evidence standard.

## What to Look For

### Product Thinking
- **Problem-first approach:** Did we start with validated evidence, or did we start with a solution and work backward?
- **Thesis clarity:** Is the core belief clear, differentiated, and defensible?
- **Strategic coherence:** Does every decision trace back to the thesis?
- **Scope discipline:** Did we resist scope creep while still delivering a complete experience?

### Technical Implementation
- **Domain isolation:** Business logic is pure TypeScript with zero framework dependencies
- **Testability:** Property-based tests validate universal invariants; unit tests validate specific scenarios
- **Provider abstraction:** MockDataProvider implements the same interface that real integrations would use
- **Accessibility:** WCAG 2.1 AA compliance, no color-only meaning, visible focus indicators
- **Integer cents:** All financial calculations use integers to avoid floating-point errors

### AI Collaboration
- **Methodology rigor:** Evidence → thesis → vision → strategy → solution → requirements → design → implementation
- **Human judgment points:** Problem framing, epistemic discipline, strategic positioning, scope decisions
- **AI acceleration points:** Research synthesis, structural reasoning, challenge/counter-argument, technical specification

## Key Files for Deep Dives

| Area | Key File | Why |
|------|----------|-----|
| Domain logic | `src/domain/position-engine.ts` | Core calculation: balance - obligations = capacity |
| Pattern detection | `src/domain/obligation-detector.ts` | How recurring bills are found automatically |
| Testing approach | `src/__tests__/domain/` | Property-based tests demonstrating correctness |
| Data contract | `src/domain/types.ts` | All interfaces, the "language" of the system |
| Mock data | `src/data/mock-data/transactions.ts` | Deterministic test data representing real patterns |
| API layer | `src/app/api/` | Route handlers connecting UI to domain |
| Dashboard UX | `src/components/position/SafeToSpendCard.tsx` | The primary Safe to Spend intelligence card |
| Recommendations | `src/components/actions/RecommendedAction.tsx` | Next Best Action engine with status-aware logic |
| Early Pay | `src/app/early-pay/page.tsx` | Demonstrates banking capability connection |

## Running the Application

```bash
npm install          # Install dependencies
npm run dev          # Start development server (localhost:3000)
npm test             # Run all tests (vitest)
npm run build        # Production build verification
```
