← Previous: —
→ Next: [Problem Validation](./01_Problem_Validation.md)
→ Implementation: [Kiro Specs](../.kiro/specs/financial-decision-confidence/)

---

# Project Overview

## What This Is

**Safe to Spend** is an intelligent banking capability that helps members make confident financial decisions by connecting cash flow intelligence to actionable banking services.

It is not a standalone application. It is embedded within a digital banking platform — designed to be deployed by community banks and credit unions as a premium capability that differentiates their digital experience.

## The Strategic Evolution

The financial services industry is progressing through three generations of digital banking intelligence:

```
Generation 1: Reporting
"Here's what happened to your money."
→ Transaction history, spending categories, monthly summaries

Generation 2: Predicting  
"Here's what we think will happen to your money."
→ Cash flow forecasting, balance projections, obligation detection

Generation 3: Recommending ← Safe to Spend
"Here's what you should do about it."
→ Next Best Actions that connect intelligence to banking capabilities
```

Most fintech products operate at Generation 1 or early Generation 2. Safe to Spend demonstrates Generation 3 — where the intelligence layer doesn't just inform the member, it recommends the specific banking action most likely to improve their financial outcome.

## The Customer Outcome: Financial Decision Confidence

The underlying customer outcome we're solving for is **financial decision confidence** — the ability to make everyday spending decisions without anxiety or uncertainty about whether those decisions will cause downstream financial harm.

Safe to Spend achieves this through three capabilities:

1. **Position Intelligence** — Understand your real financial position after upcoming obligations
2. **Consequence Simulation** — See what happens before you spend ("What if I spend $X?")
3. **Next Best Actions** — Receive intelligent recommendations that connect insight to action

## The Platform Differentiator: Next Best Actions

The critical differentiator is the **Next Best Actions** framework. Rather than stopping at "here's your projected balance," Safe to Spend recommends the specific banking action that improves the member's position:

| Member State | Recommended Action | Banking Capability |
|---|---|---|
| Watch (tight cushion) | "Access Your Paycheck Early" | Earned Wage Access |
| Tight (projected shortfall) | "Transfer from Savings" | Instant Transfer |
| At risk (overdraft likely) | "Enable Protection" | Overdraft Protection |
| Comfortable (excess funds) | "Move to Savings" | High-Yield Savings |

This transforms Safe to Spend from an analytics feature into an **orchestration layer** — connecting financial intelligence directly to the banking capabilities that create the best outcome for the member.

## Why This Matters for Nymbus

For a platform like Nymbus serving community financial institutions:

- **Differentiation** — Community FIs can't compete with megabanks on feature breadth. They can compete on intelligence and personalized guidance.
- **Revenue enablement** — Next Best Actions create natural pathways to premium products (Early Pay, overdraft protection, high-yield savings) without feeling promotional.
- **Retention** — Members who experience intelligent guidance stay longer than members who just see a balance.
- **Platform value** — This capability is configurable, white-labelable, and deployable across the entire Nymbus FI network.

## Repository Guide

| Area | Purpose |
|------|---------|
| `docs/` | Product strategy narrative — the "why" |
| `.kiro/specs/` | Implementation specifications — the "what" |
| `ai-collaboration/` | Development process — the "how" |
| `src/` | Working application — the "proof" |

See [Reviewer Guide](./07_Reviewer_Guide.md) for a recommended 10-minute reading path.
