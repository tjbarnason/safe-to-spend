← Previous: [Product Strategy](./04_Product_Strategy.md)
→ Next: [Decision Log](./06_Decision_Log.md)
→ Implementation: [Spec](../.kiro/specs/financial-decision-confidence/requirements.md)

---

# Solution Validation

## Evolution from "Safe to Spend"

"Safe to Spend" was pioneered by Simple Bank and adopted in various forms by neobanks (Varo, Monzo, Dave). The core idea: show the member how much they can spend after accounting for pending transactions and upcoming bills.

Financial Decision Confidence evolves this concept in three critical ways:

| Safe to Spend | Financial Decision Confidence |
|---------------|-------------------------------|
| Single number ("you can spend $X") | Projected trajectory with confidence levels |
| Static calculation | Dynamic simulation ("what if?") |
| Reactive (shows current state) | Proactive (alerts about future state) |
| Manual bill entry or pending-only | Automatic pattern detection from history |
| Binary (safe/not safe) | Graduated (comfortable/watch/tight) |
| Point-in-time | Forward-looking through time window |

## Three Confidence Moments

The solution is structured around three distinct moments in a member's experience:

### Moment 1: Ambient Confidence
**When:** Member opens their banking app (daily check-in)
**What:** Position Card on the dashboard showing:
- Current balance
- Committed obligations in the next 14 days
- Available capacity (the real "can I spend" number)
- Next obligation and next income with confidence indicators
- Position status (comfortable / watch / tight)

**Why it works:** Requires zero interaction. A 2-second glance communicates the essential message. The member knows their position without analysis.

### Moment 2: Active Confidence
**When:** Member is considering a specific purchase
**What:** Consequence Explorer that:
- Accepts a hypothetical spending amount
- Shows before/after available capacity
- Projects day-by-day position through next income
- Identifies specific at-risk obligations if the spend would cause a shortfall
- Provides positive confirmation when the spend is safely within range

**Why it works:** Answers the exact question the member has at the moment they have it. No mental arithmetic needed. The consequence chain makes abstract "can I afford this" concrete.

### Moment 3: Protective Confidence
**When:** System detects an upcoming shortfall (member hasn't asked)
**What:** Heads-Up Banner that:
- Appears on the dashboard before the shortfall occurs
- Provides at least 48 hours lead time
- Identifies the specific obligations creating the shortfall
- Uses calm, informational language (never alarming)
- Offers a path to detail and a dismiss action

**Why it works:** Transforms overdraft from a surprise into a preventable event. The member has time to transfer funds, delay a purchase, or adjust a payment date.

## From Insight to Action: Next Best Actions

The critical evolution beyond traditional "Safe to Spend" implementations is the connection between financial intelligence and banking action.

Traditional Safe to Spend: "You have $257 available."
→ Member must figure out what to do next.

Safe to Spend with Next Best Actions: "You have $257 available. Access up to $500 from your upcoming paycheck to give yourself more room before rent."
→ Member receives a specific, contextual recommendation connected to a banking capability they can execute immediately.

This transforms the experience from **passive reporting** to **active guidance** — and creates a natural pathway for financial institutions to surface relevant services at the exact moment they provide maximum value.

### Recommendation Logic

| Position Status | Primary Action | Secondary Action |
|---|---|---|
| Comfortable | Move excess to savings | Enable round-ups |
| Watch | Access Early Pay | Transfer from savings |
| Tight | Instant transfer | Access Early Pay |
| At Risk | Enable overdraft protection | Instant transfer |

Each recommendation includes:
- Why it was selected (contextual explanation)
- The projected impact (how it changes the member's position)
- A single-tap action (minimal friction to execute)

## Key Scenarios

### Scenario A: "Can I buy these shoes?"
Sarah has $2,400 in her account. She's considering a $180 purchase. Without the system, she'd check her balance and think "yes." With the system, the Consequence Explorer shows that after her car payment ($345) and streaming subscriptions ($47) hit in the next 5 days, spending $180 now puts her at-risk for her phone bill ($89) before her next paycheck in 8 days.

### Scenario B: "Everything seems fine"
Marcus checks his dashboard. The Position Card shows $3,100 balance, $890 committed, $2,210 available. Status: comfortable. He feels confident about his planned weekend plans without needing to explore further.

### Scenario C: "Early warning"
Jayla hasn't checked her account in 3 days. A Heads-Up Banner appears: "Based on your upcoming bills, your account may be short $127 on Thursday. Your car insurance ($234) and gym membership ($49) overlap before your next deposit." She has 3 days to transfer from savings.

## MVP Scope

### Included in MVP
- Single checking account position calculation
- Obligation detection from 90+ days of transaction history
- Income prediction for regular and irregular sources
- Consequence simulation with at-risk identification
- Heads-up alerts with 7-day lookahead
- Dashboard Position Card with status indicators
- Position detail page with timeline visualization
- Consequence Explorer with debounced input
- Mock data provider (deterministic, seeded)
- Property-based testing of domain logic
- Responsive, accessible UI (WCAG 2.1 AA)

### Excluded from MVP (Future Phases)
- Multi-account position aggregation
- Real bank data integration (Plaid/MX)
- Push notifications (only in-app for MVP)
- Bill pay / payment scheduling
- Savings goal integration
- Spending categorization and budgeting
- Historical trend analysis
- Shared account / household view
- Custom obligation entry (manual add)

## Alternatives Considered

### Alternative 1: Rules-based approach (manual bill entry)
**Rejected because:** Requires member effort to set up. Adoption drops precipitously with setup friction. Pattern detection achieves 85%+ accuracy without any member input.

### Alternative 2: ML-based prediction model
**Rejected for MVP because:** Requires training data, model infrastructure, and ongoing tuning. Pattern detection with statistical methods (median, variance thresholds) achieves sufficient accuracy for the MVP with dramatically simpler implementation. ML is a Phase 2 enhancement.

### Alternative 3: Full PFM suite (budgeting + safe to spend + goals)
**Rejected because:** Violates our thesis that decision confidence is distinct from financial management. Adding budgeting dilutes the focus and competes with established players (Mint, YNAB, Copilot). We win by solving one problem exceptionally well.

### Alternative 4: Alert-only product (no dashboard)
**Rejected because:** Ambient confidence is the highest-engagement moment. Members check their dashboard daily. If we only alert on problems, we miss the opportunity to build confidence on good days too.
