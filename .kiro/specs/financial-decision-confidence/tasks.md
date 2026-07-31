# Implementation Plan: Financial Decision Confidence

## Overview

This plan implements the Financial Decision Confidence feature as a Next.js 14+ application with pure TypeScript domain services, mock data, and comprehensive property-based testing. Each task builds incrementally on previous work, with domain logic implemented and tested before UI layers. Property-based tests validate universal correctness properties alongside the services they cover.

## Tasks

- [x] 1. Project scaffolding and configuration
  - [x] 1.1 Initialize Next.js 14+ project with App Router, TypeScript, and Tailwind CSS
    - Run `npx create-next-app@latest` with App Router and TypeScript flags
    - Install shadcn/ui and configure with a neutral banking-appropriate theme (neutral palette, no red)
    - Install dependencies: vitest, @testing-library/react, @testing-library/jest-dom, fast-check, date-fns, recharts, jsdom
    - Configure Vitest in vitest.config.ts with jsdom environment, path aliases, and coverage
    - Create directory structure: `src/app`, `src/components/{ui,position,obligations,income,simulate,alerts}`, `src/domain`, `src/data/mock-data`, `src/lib`, `src/__tests__/{domain,components}`
    - Create `docs/` directory and `ai-collaboration/` directory with placeholder files (session-log.md, decision-log.md, AI_COLLABORATION.md, evidence-tracker.md)
    - Verify: `npm run dev` starts, `npm test` runs (vitest --run), `npm run build` succeeds
    - _Requirements: All (foundational)_

- [x] 2. Domain types and mock data foundation
  - [x] 2.1 Define all TypeScript domain interfaces and types
    - Create `src/domain/types.ts` with interfaces: Account, Transaction, Obligation, IncomeEvent, FinancialPosition, DailyPosition, SimulationResult, HeadsUpAlert
    - Define type aliases: TransactionCategory (14 categories), PositionStatus ('comfortable' | 'watch' | 'tight')
    - All monetary fields typed as `number` representing integer cents
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 3.1, 4.1, 5.1_

  - [x] 2.2 Implement DataProvider interface and MockDataProvider
    - Create `src/data/provider.ts` with DataProvider interface (getAccount, getTransactions, getScheduledPayments)
    - Create `src/data/mock-provider.ts` implementing MockDataProvider
    - Create `src/data/mock-data/account.ts` with Sarah's checking account (~$2,400 / 240000 cents)
    - Create `src/data/mock-data/transactions.ts` with deterministic transaction generator seeded from reference date (90+ days history, biweekly payroll $2,847, gig income, 9 obligations, discretionary spending)
    - Create `src/data/mock-data/profiles.ts` with member profile configuration
    - _Requirements: 6.1, 6.5_

  - [x]* 2.3 Write unit tests for mock data provider
    - Test: provider returns account with valid balance in cents
    - Test: provider returns 90+ days of transaction history
    - Test: transactions include recurring patterns (9 obligations, payroll, gig)
    - Test: all amounts are integers (no floating point)
    - _Requirements: 6.1, 6.5_

- [x] 3. Obligation Detector service
  - [x] 3.1 Implement obligation detection core logic
    - Create `src/domain/obligation-detector.ts`
    - Implement `normalizeDescription`: lowercase, trim, strip transaction IDs/dates, collapse whitespace
    - Implement `detectObligations`: normalize → group by merchant → filter groups with 3+ occurrences → classify frequency → predict next date/amount → assign confidence
    - Implement `classifyFrequency`: weekly (5–9d intervals), biweekly (12–16d), monthly (27–34d), quarterly (85–95d), annual (355–375d)
    - Implement `predictNextDate`: last date + median interval (within tolerance)
    - Implement `predictAmount`: median if variance ≤ 5%, min/max range if variance > 5%
    - Implement `assignConfidence`: confirmed (variance ≤ 5% AND 5+ occurrences), estimated (variance > 5% OR 3–4 occurrences), new (first detection)
    - Handle edge cases: variable amounts, skipped months, cancelled subscriptions (declining frequency)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.10_

  - [x]* 3.2 Write property-based tests for obligation detection
    - **Property 5: Recurrence Detection Threshold** — For any set of transactions grouped by normalized merchant, classify as recurring obligation iff 3+ occurrences
    - **Validates: Requirements 2.2, 6.6**
    - **Property 6: Next Date Prediction from Frequency** — For any recurring obligation with detected frequency, predicted next date equals last date + median interval within tolerance
    - **Validates: Requirements 2.3, 3.3**
    - **Property 7: Median Amount for Stable Patterns** — For any obligation with variance ≤ 5%, predicted amount equals median of historical amounts
    - **Validates: Requirements 2.4, 3.4**
    - **Property 8: Range Prediction for Variable Patterns** — For any obligation with variance > 5%, predicted range has min = minimum historical, max = maximum historical
    - **Validates: Requirements 2.5, 3.5**
    - **Property 9: Confidence Assignment by Variance** — For any detected obligation, confidence is confirmed (≤5% variance AND ≥5 occurrences), estimated (>5% OR 3–4 occurrences), or new
    - **Validates: Requirements 1.5, 2.6**
    - **Property 18: Description Normalization Idempotence** — For any description string, normalize(normalize(x)) === normalize(x)
    - **Validates: Requirements 2.1**
    - **Property 19: Prediction Refinement Monotonic Accuracy** — For any recurring pattern with N occurrences, adding occurrence N+1 produces predicted amount = median of all N+1 amounts
    - **Validates: Requirements 6.3, 6.4**

  - [x]* 3.3 Write unit tests for obligation detection
    - Test: detect all 9 of Sarah's obligations with correct frequencies and amounts
    - Test: correct confidence levels assigned
    - Test: no false positives on one-time purchases
    - Test: dismissed obligations excluded when isActive = false
    - _Requirements: 2.2, 2.6, 2.8_

- [x] 4. Income Predictor service
  - [x] 4.1 Implement income prediction core logic
    - Create `src/domain/income-predictor.ts`
    - Implement `filterIncomeTransactions`: positive amounts, exclude `income_transfer` category
    - Implement `detectIncome`: filter → group by source (normalized description) → filter 3+ occurrences → classify frequency → predict next date/amount
    - Implement `predictNextIncomeDate`: last date + median interval (within tolerance)
    - Implement `predictIncomeAmount`: median if stable, range if variable (gig income)
    - Handle irregular sources: wider tolerance bands, range predictions
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [x]* 4.2 Write property-based tests for income prediction
    - **Property 11: Income Filtering Excludes Transfers** — For any set of transactions, only positive non-transfer transactions are considered for income detection
    - **Validates: Requirements 3.1**
    - **Property 12: Income Occurrence Threshold** — For any inbound transactions grouped by source, classify as recurring income iff 3+ occurrences
    - **Validates: Requirements 3.2**
    - Properties 6, 7, 8 also apply to income predictions (shared frequency/amount logic)

  - [x]* 4.3 Write unit tests for income prediction
    - Test: detect biweekly payroll from Sarah's transactions
    - Test: predict correct next payday within 2 days
    - Test: detect gig income as irregular with amount range
    - Test: exclude internal transfers
    - _Requirements: 3.1, 3.2, 3.3, 3.8_

- [x] 5. Checkpoint — Core pattern detection
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Position Engine and Consequence Simulator
  - [x] 6.1 Implement Position Engine
    - Create `src/domain/position-engine.ts`
    - Implement `calculatePosition`: combine account balance, obligations (filtered by time window and isActive), expected income → compute totalCommitted, availableCapacity, status
    - Implement `generateDailyProjection`: iterate day-by-day from current balance, subtract obligations on their expectedDate, add income on expectedDate
    - Implement `determineStatus`: comfortable (capacity > 20% of committed), watch (0 < capacity ≤ 20%), tight (any negative day in projection)
    - Implement `generateAlerts`: scan 7-day lookahead, generate HeadsUpAlert if capacity drops below zero, ensure 48h lead time, identify causing obligations
    - Exclude dismissed obligations (isActive === false) from all calculations
    - Exclude low-confidence income (below estimated threshold) from capacity
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 5.1, 5.2, 5.3, 5.4, 10.2_

  - [x] 6.2 Implement Consequence Simulator
    - Create `src/domain/consequence-simulator.ts`
    - Implement `simulate`: subtract hypothetical amount from position → recalculate daily projection → determine new status
    - Implement `identifyAtRiskObligations`: find obligations on/after first negative-balance day
    - Implement `determineSimulationStatus`: safe (no negative days), tight (min balance 0–10% of committed), at-risk (any negative day)
    - Handle zero/empty input: return current position unchanged
    - _Requirements: 4.1, 4.2, 4.3, 4.6, 4.7_

  - [x]* 6.3 Write property-based tests for Position Engine
    - **Property 1: Position Arithmetic Invariant** — For any balance and obligations, availableCapacity === currentBalance - totalCommitted
    - **Validates: Requirements 1.2, 1.3**
    - **Property 2: Obligation Chronological Ordering** — For any set of obligations, output is sorted non-decreasing by expectedDate
    - **Validates: Requirements 1.4, 2.10**
    - **Property 3: Time Window Monotonicity** — For windows W2 > W1, totalCommitted(W2) >= totalCommitted(W1)
    - **Validates: Requirements 1.7**
    - **Property 4: Position Status Threshold Correctness** — Status matches the defined thresholds (comfortable > 20%, watch 0–20%, tight = negative day)
    - **Validates: Requirements 1.8**
    - **Property 10: Dismissed Obligation Exclusion** — Dismissed obligations (isActive === false) not included in totalCommitted or obligations array
    - **Validates: Requirements 2.8**
    - **Property 15: Alert Generation Threshold** — Alert generated iff daily projection shows capacity < 0 within 7-day lookahead
    - **Validates: Requirements 5.1, 5.4**
    - **Property 16: Alert Lead Time** — Alert generatedAt is at least 48 hours before shortfallDate
    - **Validates: Requirements 5.2**
    - **Property 17: Alert Causation Completeness** — causingObligations contains exactly obligations on/after the day cumulative outflow exceeds funds
    - **Validates: Requirements 5.3**
    - **Property 21: Low-Confidence Income Exclusion** — Low-confidence income excluded from expectedIncome and availableCapacity
    - **Validates: Requirements 10.2**

  - [x]* 6.4 Write property-based tests for Consequence Simulator
    - **Property 13: Consequence Simulation Arithmetic** — For any position and hypothetical amount, revisedCapacity === availableCapacity - hypotheticalAmount
    - **Validates: Requirements 4.1**
    - **Property 14: Consequence Simulation Status Correctness** — Status matches thresholds: safe (no negative day), tight (min 0–10% of committed), at-risk (negative day with correct atRiskObligations)
    - **Validates: Requirements 4.3, 4.7**

  - [x]* 6.5 Write unit tests for Position Engine and Consequence Simulator
    - Test: correct capacity calculation with Sarah's data
    - Test: daily projections match expected pattern
    - Test: status thresholds at boundaries
    - Test: simulation with various amounts ($50, $500, $2000)
    - Test: at-risk identification with overlapping same-day obligations
    - Test: alert generation with known shortfall scenario
    - Test: zero obligations results in comfortable status
    - _Requirements: 1.2, 1.3, 1.8, 4.1, 4.3, 5.1_

- [x] 7. Checkpoint — Domain services complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. API layer and utility functions
  - [x] 8.1 Implement API route handlers
    - Create `src/app/api/position/route.ts` — GET with `window` query param (7|14|30, default 14)
    - Create `src/app/api/obligations/route.ts` — GET (all active obligations), PATCH (confirm/dismiss/adjust by id)
    - Create `src/app/api/income/route.ts` — GET (all detected income events)
    - Create `src/app/api/simulate/route.ts` — POST with `{ amount: number }` body (integer cents)
    - Create `src/app/api/alerts/route.ts` — GET (active alerts), PATCH dismiss by id
    - Wire all routes to domain services via MockDataProvider singleton
    - Error handling: 400 for invalid params, 404 for not found, 500 for calculation errors
    - _Requirements: 1.7, 2.7, 2.8, 2.9, 4.1, 4.4, 5.5_

  - [x] 8.2 Implement formatting and utility functions
    - Create `src/lib/format.ts`: `formatCurrency(cents: number)` → locale string, `parseCents(display: string)` → integer cents, `formatDate(date: Date)` → human-readable, `formatRelativeDate(date: Date)` → "in 3 days"
    - Create `src/lib/constants.ts`: DEFAULT_WINDOW = 14, STATUS_THRESHOLDS, DEBOUNCE_MS = 300
    - _Requirements: 8.6, 2.10_

  - [x]* 8.3 Write property-based test for currency formatting
    - **Property 20: Currency Formatting Round-Trip Consistency** — For any integer cents value, parseCents(formatCurrency(cents)) === cents
    - **Validates: Requirements 8.6**

  - [x]* 8.4 Write integration tests for API routes
    - Test: GET /api/position returns valid FinancialPosition shape
    - Test: GET /api/position?window=7 uses 7-day window
    - Test: GET /api/position?window=99 returns 400
    - Test: POST /api/simulate with valid amount returns SimulationResult
    - Test: POST /api/simulate with missing body returns 400
    - Test: GET /api/obligations returns array of obligations
    - Test: GET /api/alerts returns alerts array
    - _Requirements: 1.7, 4.1, 4.4_

- [x] 9. Dashboard and Position Card UI
  - [x] 9.1 Build Position Card and dashboard page
    - Create `src/components/position/PositionSummaryBar.tsx` — displays balance, committed, available capacity with emphasis on available
    - Create `src/components/position/PositionCard.tsx` — summary bar + next obligation + next income + status badge + "What if I spend?" CTA button
    - Create `src/app/page.tsx` as Server Component that fetches position data and renders PositionCard
    - Implement loading skeleton matching card layout dimensions
    - Style with Tailwind + shadcn/ui Card, Badge, Button components
    - Color coding: green for comfortable, amber for watch, never red
    - Mobile-first responsive layout (stack on small screens, side-by-side on larger)
    - Accessibility: aria-labels on amounts, screen-reader text for status, focus indicators on interactive elements
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 9.1, 9.3, 9.4_

  - [x]* 9.2 Write component tests for Position Card
    - Test: renders correct balance, committed, and available values
    - Test: status badge shows correct label and color
    - Test: next obligation displays name, amount, date
    - Test: loading skeleton renders during data fetch
    - _Requirements: 7.1, 7.2, 7.3, 7.6_

- [x] 10. Position Detail, Timeline, and Consequence Explorer
  - [x] 10.1 Build Position Detail page with timeline
    - Create `src/app/position/page.tsx` as Server Component (full position detail)
    - Create `src/components/position/PositionTimeline.tsx` — Recharts AreaChart showing daily projected balance with obligation/income markers
    - Create `src/components/obligations/ObligationList.tsx` and `ObligationItem.tsx` — chronological list with confidence badges, confirm/dismiss actions
    - Create `src/components/income/IncomeList.tsx` — expected income events with confidence badges
    - Add time window selector (7/14/30 days) using shadcn Tabs component
    - Timeline accessibility: pattern-based markers (not color-only), responsive (simplified line chart on mobile)
    - _Requirements: 1.4, 1.5, 1.6, 1.7, 2.7, 2.8, 2.9, 2.10, 9.4_

  - [x] 10.2 Build Consequence Explorer page
    - Create `src/app/simulate/page.tsx` with ConsequenceExplorer as Client Component
    - Create `src/components/simulate/ConsequenceExplorer.tsx` — numeric input with currency formatting, 300ms debounce, calls POST /api/simulate
    - Create `src/components/simulate/ConsequenceResult.tsx` — before/after comparison of available capacity, status indicator, at-risk obligations list, positive confirmation when safe
    - Handle edge cases: empty input shows current position, large amounts clearly show at-risk status
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x]* 10.3 Write component tests for detail pages and explorer
    - Test: obligation list renders items in chronological order with correct badges
    - Test: time window selector changes displayed data
    - Test: consequence explorer input accepts and formats values
    - Test: consequence result displays safe/tight/at-risk states correctly
    - Test: empty input shows current position
    - _Requirements: 1.4, 1.7, 4.6, 8.1, 8.5_

- [x] 11. Proactive Heads-Up and polish
  - [x] 11.1 Build Heads-Up Banner and integrate alerts
    - Create `src/components/alerts/HeadsUpBanner.tsx` — informational styling (blue/neutral, never red), calm language, situation summary, causing obligations, gap amount/date
    - Modify `src/app/page.tsx` to check /api/alerts and display banner above PositionCard when active
    - Banner actions: "View details" navigates to /position, "Dismiss" calls PATCH /api/alerts/:id/dismiss
    - Banner hidden when no active alerts
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 7.7, 9.2, 9.3_

  - [x] 11.2 Implement loading states, empty states, error handling, and accessibility
    - Implement loading skeletons across all pages (position, detail, explorer)
    - Empty state: "We're learning your patterns" message for insufficient data
    - Error state: API failure falls back to balance-only display with stale-data indicator
    - Accessibility audit: aria-labels on all interactive elements, visible focus indicators (WCAG AA contrast), no color-only meaning, 44px minimum touch targets, screen-reader text for financial values
    - Currency formatting consistency (locale-aware, from integer cents)
    - Date formatting consistency (human-readable relative dates)
    - Responsive verification targets: 375px, 768px, 1024px breakpoints
    - _Requirements: 7.6, 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x]* 11.3 Write component tests for alerts and error states
    - Test: banner renders when alert active with correct messaging
    - Test: banner hidden when no alerts
    - Test: dismiss calls correct API endpoint
    - Test: empty state message renders for new members
    - Test: error state shows balance-only fallback
    - _Requirements: 5.1, 5.5, 7.7, 10.1, 10.4_

- [x] 12. Checkpoint — Full application working
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. README, documentation, and deployment readiness
  - [x] 13.1 Write README and finalize documentation
    - Write comprehensive README.md: what/why/who, run locally instructions, architecture overview, product decisions summary, testing approach, future improvements
    - Finalize ai-collaboration/session-log.md with implementation entries
    - Finalize ai-collaboration/decision-log.md with key technical decisions
    - Update ai-collaboration/AI_COLLABORATION.md with collaboration narrative
    - Verify: `git clone` → `npm install` → `npm run dev` → working app
    - Verify: `npm test` (vitest --run) → all tests pass
    - Verify: `npm run build` → succeeds without errors
    - _Requirements: All (documentation and delivery)_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at logical boundaries
- Property tests validate universal correctness properties defined in the design document
- Unit tests validate specific examples and edge cases with Sarah's mock data
- All monetary values are integer cents throughout the domain layer; formatting happens only at the display boundary
- The MockDataProvider is deterministic (seeded from a reference date) enabling reproducible tests
- fast-check is used for all property-based tests with minimum 100 iterations per property

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3"] },
    { "id": 3, "tasks": ["3.1", "4.1"] },
    { "id": 4, "tasks": ["3.2", "3.3", "4.2", "4.3"] },
    { "id": 5, "tasks": ["6.1"] },
    { "id": 6, "tasks": ["6.2", "6.3"] },
    { "id": 7, "tasks": ["6.4", "6.5"] },
    { "id": 8, "tasks": ["8.1", "8.2"] },
    { "id": 9, "tasks": ["8.3", "8.4"] },
    { "id": 10, "tasks": ["9.1"] },
    { "id": 11, "tasks": ["9.2", "10.1", "10.2"] },
    { "id": 12, "tasks": ["10.3", "11.1"] },
    { "id": 13, "tasks": ["11.2"] },
    { "id": 14, "tasks": ["11.3"] },
    { "id": 15, "tasks": ["13.1"] }
  ]
}
```
