← Previous: [Project Overview](./00_Project_Overview.md)
→ Next: [Product Thesis](./02_Product_Thesis.md)
→ Implementation: [Spec](../.kiro/specs/financial-decision-confidence/requirements.md)

---

# Problem Validation

## The Validated Problem

**Consumers cannot assess the near-term consequences of spending decisions.** They know their balance. They may know their bills. But they cannot quickly determine whether a specific purchase today will cause a shortfall before their next income arrives.

This is not a budgeting problem. It is a **decision uncertainty** problem — and it affects people at the exact moment they need clarity most.

## Evidence Base

### Federal Reserve SHED 2025 — Key Findings

| Finding | Implication |
|---------|-------------|
| **29% of adults have variable monthly income** | Traditional fixed-budget tools fail for nearly a third of consumers |
| **11% experienced hardship from income timing, not amount** | The problem is temporal — when money arrives relative to when it's needed |
| **63% of adults report income flat or declining over 3 years** | Financial margin is thin; small timing mismatches create real hardship |
| **24% of BNPL users made a late payment** | Consumers take on layered obligations without understanding cumulative impact |
| **37% could not cover $400 emergency without borrowing** | Buffer capacity is minimal; every spending decision carries real consequence |

### J.D. Power 2025 — Digital Banking Satisfaction

- Customer satisfaction with digital banking tools has plateaued
- Consumers report that existing tools help them *track* spending but not *decide* about spending
- The gap between "information available" and "information actionable at point of decision" remains wide

### J.D. Power 2024 — Mobile Banking

- Mobile banking engagement is high but utility perception is declining
- Members want tools that are proactive, not reactive
- Alert fatigue from backward-looking notifications reduces engagement

### CFPB — Overdraft and Open Banking

- Overdraft fees disproportionately affect variable-income consumers
- Section 1033 (open banking rule) creates infrastructure for real-time financial data access
- The regulatory environment now enables the data flows this product requires

### Bureau of Labor Statistics

- Gig economy participation continues to grow
- Multiple income sources are increasingly common
- Traditional employment patterns are less predictive of financial stability

### Bankrate 2024

- Majority of Americans live paycheck to paycheck regardless of income level
- The psychological burden of financial uncertainty exceeds the mathematical risk
- Consumers want *confidence* more than *control*

## Three Strategic Gaps

### Gap 1: Wrong Temporal Orientation

Existing tools look backward. They categorize past spending, summarize last month, show historical trends. But the consumer's anxiety is forward-looking: *"What happens if I spend this now?"*

No major product provides a forward-looking projection that accounts for upcoming obligations relative to expected income.

### Gap 2: Wrong Interaction Timing

Banking apps engage members when they open the app — typically at home, after the fact. But the moment of decision happens in a store, at checkout, in a conversation about splitting a bill. The information needs to be **ambient** (available at a glance) and **active** (responsive to a specific question) at the moment of decision.

### Gap 3: Wrong Success Metric

Financial management tools measure success by budget adherence, spending reduction, or savings accumulation. But for variable-income consumers, the real metric is **avoiding negative consequences** — not overspending into an overdraft, not missing a bill, not triggering a late fee cascade.

The success metric should be: *"Did the member make a decision they felt good about?"* — measured by consequence avoidance, not behavioral compliance.

## Problem Severity

This is not a convenience problem. For the 29% with variable income:
- Each financial decision carries genuine uncertainty about downstream consequences
- The cognitive load of mentally simulating "can I afford this" compounds throughout the day
- Avoidance behavior (not spending when they safely could) reduces quality of life unnecessarily
- Impulsive behavior (spending without checking) creates preventable shortfalls

The problem is **solvable with existing data**. Transaction history contains the patterns needed to predict obligations and income. The missing piece is a system that synthesizes this into forward-looking, decision-relevant confidence.

## Validation Confidence

| Claim | Evidence Strength | Confidence |
|-------|-------------------|------------|
| Variable income is widespread | Federal Reserve (n=11,000+) | High |
| Timing matters more than amount for many | SHED direct measurement | High |
| Existing tools don't address decision moments | J.D. Power satisfaction gaps | Medium-High |
| Consumers want proactive over reactive | J.D. Power engagement data | Medium-High |
| Infrastructure now supports real-time data | CFPB 1033, open banking APIs | High |
| Community FIs need differentiation | Market structure analysis | High |
