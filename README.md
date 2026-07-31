# Safe to Spend

> **Most banking apps answer, "How much money do I have?"**
>
> **Safe to Spend answers a more important question:**
>
> **"Can I safely spend this money without putting my upcoming financial obligations at risk?"**

Safe to Spend is a forward-looking digital banking experience that helps consumers understand the consequences of financial decisions before they make them.

Rather than relying on a static account balance or historical spending reports, Safe to Spend combines projected income, recurring obligations, and cash flow forecasting to help members make informed spending decisions with confidence.

---

## Why This Project?

This repository was created as a Product Management take-home assessment.

Rather than beginning with features or technology, I intentionally followed a structured product discovery process:

```
Market Research
        ↓
Problem Validation
        ↓
Product Thesis
        ↓
Product Strategy
        ↓
Solution Validation
        ↓
Technical Design
        ↓
Working MVP
```

Every feature, interaction, and technical decision can be traced back to validated customer problems and explicit product strategy.

The objective was not simply to build an application—but to demonstrate how disciplined product thinking translates into software.

---

## The Problem

Consumer fintech has spent the last decade helping people **manage** money.

Budgets. Categories. Spending reports. Historical insights.

But the highest-anxiety financial moment rarely happens while reviewing last month's spending.

It happens **at the moment of decision.**

Standing in a store. Buying concert tickets. Paying for car repairs. Wondering:

> **"Can I afford this without causing problems next week?"**

Traditional banking products answer:
- How much money do I have?

Safe to Spend answers:
- What happens if I spend this today?

### Evidence

This isn't a hypothetical problem. It's validated by federal research:

- **29%** of US adults have variable monthly income (Federal Reserve SHED 2025)
- **11%** experience bill hardship specifically from income *timing* — not amount
- **63%** emergency savings metric has been flat for 3 consecutive years despite widespread financial tool availability
- **24%** of BNPL users paid late in 2024 — up sharply from 18% the prior year

Existing tools optimize for tracking spending history. The underserved job is assessing consequences at the moment of decision.

---

## The Solution

Safe to Spend provides three moments of financial confidence:

### Ambient Confidence

Immediately understand your real financial position — not simply your checking account balance. See what's committed, what's coming, and what's truly available.

### Active Confidence

Ask: **"What if I spend $250?"**

See projected cash flow, upcoming obligations, and potential risks before making a decision. No math needed — just enter an amount and see what happens.

### Protective Confidence

Receive proactive alerts before projected shortfalls occur, giving members time to adjust rather than react.

### Intelligent Recommendations

Based on projected cash flow, Safe to Spend recommends the specific banking action most likely to improve the member's position — such as accessing a paycheck early, transferring from savings, or enabling overdraft protection. This transforms insight into action.

The strategic progression:

```
Reporting → "Here's what happened to your money"
Predicting → "Here's what will happen to your money"  
Recommending → "Here's what you should do about it" ← Safe to Spend
```

---

## Product Highlights

- Forward-looking financial position instead of static balances
- Automatic recurring obligation detection from transaction history
- Income pattern prediction (regular and irregular)
- Purchase consequence simulation ("What if I spend $X?")
- Proactive shortfall alerts with 48+ hour lead time
- Calm, confidence-first UX (no red, no alarm, no guilt)
- Zero manual setup — works from existing transaction data
- Architecture designed for future Plaid / MX / Core Banking integration
- Intelligent Next Best Action recommendations connected to banking capabilities
- Early Pay access — advance up to $500 from upcoming direct deposits

---

## Running the Project

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/tjbarnason/safe-to-spend.git
cd safe-to-spend
npm install
npm run dev
# → http://localhost:3000
```

No API keys. No database. No environment variables. Clone → install → run.

**Run tests:**

```bash
npm test
```

**Build for production:**

```bash
npm run build
```

---

## API Integration

The assessment asks about external API integration. Safe to Spend is architecturally designed for real-time financial data via Plaid, MX, or Finicity — but the MVP uses a deterministic mock data provider for two reasons:

1. **Reviewer experience** — No API keys, no credentials, no external dependencies. Clone → install → run.
2. **Architecture demonstration** — The `DataProvider` interface (3 methods) is the only abstraction between mock and real data. Swapping providers requires zero changes to business logic, UI, or API routes.

The mock provider generates 120 days of realistic transaction history including biweekly payroll, gig income, 9 recurring obligations, and discretionary spending — sufficient to demonstrate pattern detection, position calculation, and consequence simulation.

### Provider Interface

```typescript
interface DataProvider {
  getAccount(accountId: string): Promise<Account>;
  getTransactions(accountId: string, fromDate: Date, toDate: Date): Promise<Transaction[]>;
  getScheduledPayments(accountId: string): Promise<Obligation[]>;
}
```

Implementing this interface for Plaid, MX, or a core banking system would connect the application to real financial data with no other code changes required.

---

## Technical Overview

The application is built around domain-driven principles. Business logic is framework-independent and fully testable.

### Domain Services

| Service | Purpose |
|---------|---------|
| **Position Engine** | Combines balance, obligations, and income into a forward-looking financial position |
| **Obligation Detector** | Identifies recurring payment patterns from transaction history |
| **Income Predictor** | Detects income timing and amounts (regular and irregular) |
| **Consequence Simulator** | Models the impact of hypothetical spending on near-term position |

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Visualization | Recharts |
| Testing | Vitest |
| Date handling | date-fns |

### Architecture

```
Client (Next.js Server + Client Components)
    ↓
API Layer (Route Handlers)
    ↓
Domain Services (Pure TypeScript — no framework dependency)
    ↓
Data Provider (MockDataProvider → future: Plaid/MX/Core Banking)
```

---

## AI Collaboration

This project was built using Kiro's spec-driven workflow with AI serving as a Principal Product Management partner throughout — challenging assumptions, conducting research, and iterating on strategy before any code was written.

The collaboration demonstrates genuine back-and-forth that shaped the product — not just prompting, but collaborative reasoning about customer problems, strategic positioning, and implementation tradeoffs.

**Key collaboration artifacts:**

| Artifact | Path | Purpose |
|----------|------|---------|
| Collaboration Overview | `ai-collaboration/AI_COLLABORATION.md` | How AI was used and where human judgment guided direction |
| Session Log | `ai-collaboration/session-log.md` | Chronological development journal |
| Evidence Tracker | `ai-collaboration/evidence-tracker.md` | Research sources and how they informed decisions |
| Methodology | `ai-collaboration/methodology.md` | Discovery-to-implementation workflow |

---

## Repository Guide

| Document | Path | Purpose |
|----------|------|---------|
| Project Overview | `docs/00_Project_Overview.md` | Executive summary of the entire project |
| Problem Validation | `docs/01_Problem_Validation.md` | Validated customer problem with evidence |
| Product Thesis | `docs/02_Product_Thesis.md` | Strategic beliefs about what the market gets wrong |
| Product Vision | `docs/03_Product_Vision.md` | Aspirational future state |
| Product Strategy | `docs/04_Product_Strategy.md` | B2B2C positioning and competitive strategy |
| Solution Validation | `docs/05_Solution_Validation.md` | Why this solution, alternatives considered |
| Decision Log | `docs/06_Decision_Log.md` | Every major decision with rationale |
| Reviewer Guide | `docs/07_Reviewer_Guide.md` | How to navigate this repository in 10 minutes |
| Kiro Specs | `.kiro/specs/financial-decision-confidence/` | Requirements, design, and implementation tasks |

---

## Product Decisions

| Decision | Why |
|----------|-----|
| B2B2C distribution model | Financial institutions already own trust, data, and member relationships |
| Forward-looking cash flow | Consumers need decision confidence, not historical reporting |
| Outcome over engagement | Success is preventing financial harm — not increasing app usage |
| Automatic obligation detection | No manual setup means the hardest-to-serve population is actually reached |
| Calm visual language | Financial position isn't an error state — reduce anxiety, never amplify it |
| Mock data for MVP | Eliminates reviewer friction; architecture proves the integration pattern |
| Domain-driven architecture | Business logic is testable, portable, and independent of any framework |
| "Safe to Spend" as evolution | Builds on proven demand (Simple Bank pioneered it); extends with timing, consequence, and uncertainty |
| Next Best Actions framework | Intelligence without action is incomplete — connect insight to banking capabilities members can use immediately |
| Embedded banking dashboard | Safe to Spend is a capability within banking, not a standalone tool — this demonstrates platform thinking |
| Early Pay demonstration | Shows how cash flow intelligence connects to real banking products (earned wage access) |

---

## Future Enhancements

Given additional time, I would prioritize:

- **Live Plaid integration** — Connect to sandbox for real transaction enrichment
- **Multi-account aggregation** — Position across checking, savings, and credit
- **Time window interactivity** — 7/14/30 day tabs that actually refetch data
- **Push notifications** — True proactive alerts via web push
- **Obligation management** — Confirm, dismiss, or adjust detected bills
- **Historical accuracy tracking** — How accurate were predictions over time?
- **Property-based testing** — fast-check tests for all 21 correctness properties in the design doc
- **Expanded accessibility audit** — Full WCAG 2.1 AA validation with assistive technology
- **Mobile-native experience** — React Native or PWA for on-the-go decisions

---

## About This Submission

This project intentionally emphasizes **product discovery before implementation**.

The goal was to demonstrate:

- Customer-centered product thinking
- Evidence-based strategy
- Clear product communication
- Effective AI-assisted development
- Delivery of a functional, polished MVP

Rather than presenting only a finished application, this repository documents the complete journey from problem discovery through implementation.

---

## Repository Structure

```
├── docs/                         # Product strategy narrative (the "why")
│   ├── 00_Project_Overview.md
│   ├── 01_Problem_Validation.md
│   ├── 02_Product_Thesis.md
│   ├── 03_Product_Vision.md
│   ├── 04_Product_Strategy.md
│   ├── 05_Solution_Validation.md
│   ├── 06_Decision_Log.md
│   └── 07_Reviewer_Guide.md
│
├── ai-collaboration/             # AI development process (the "how")
│   ├── AI_COLLABORATION.md
│   ├── session-log.md
│   ├── evidence-tracker.md
│   └── methodology.md
│
├── .kiro/specs/                  # Kiro spec-driven workflow
│   └── financial-decision-confidence/
│       ├── requirements.md       # 10 requirements, 61 acceptance criteria
│       ├── design.md             # Architecture, data models, 21 correctness properties
│       └── tasks.md              # Implementation task breakdown
│
├── src/
│   ├── domain/                   # Pure business logic (framework-independent)
│   ├── data/                     # Provider abstraction + mock data
│   ├── app/                      # Next.js pages and API routes
│   ├── components/               # UI components organized by feature
│   └── lib/                      # Utilities and constants
│
├── README.md                     # You are here
└── package.json
```

---

## License

MIT
