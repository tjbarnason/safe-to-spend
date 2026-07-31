# Methodology: Discovery to Implementation

## The Approach

This project follows a problem-first discovery methodology where each phase produces validated artifacts that constrain the next phase. The sequence is intentional: you cannot design a solution without a validated problem, you cannot write requirements without a validated solution, and you cannot implement without clear requirements.

```
Evidence → Problem → Thesis → Vision → Strategy → Solution → Requirements → Design → Implementation
```

## Why Problem-First Matters

Most product development starts with a solution ("let's build a safe-to-spend feature") and works backward to justify it. This approach has three failure modes:

1. **Solution-problem mismatch** — The solution addresses a problem the team assumes exists but hasn't validated
2. **Shallow differentiation** — Without understanding why existing solutions fail, the new solution replicates their mistakes
3. **Scope drift** — Without a clear problem to bound the work, features accumulate without coherence

Problem-first development inverts this: start with evidence of a real problem, validate that the problem is poorly addressed, develop a thesis about why, then design a solution that specifically addresses the validated gap.

## Evidence Standards

Throughout the process, claims are categorized by evidence strength:

### Facts
Directly measured by authoritative sources with large samples and transparent methodology. Example: "29% of adults have variable monthly income" (Federal Reserve SHED, n=11,000+).

### Observations
Measured indirectly or by less rigorous methods but still externally grounded. Example: "Digital banking satisfaction has plateaued" (J.D. Power industry survey).

### Inferences
Derived by combining multiple facts and observations. Clearly labeled as inference, not presented as fact. Example: "Decision uncertainty is the core unaddressed problem" (our synthesis of multiple sources).

This discipline prevents a common failure: treating an inference as if it were a fact, then building a strategy on unstable ground.

## Phase Transitions

Each transition has a gate — a question that must be answered before proceeding:

| From → To | Gate Question |
|-----------|---------------|
| Evidence → Problem | "Is the problem validated by multiple independent sources?" |
| Problem → Thesis | "Is our explanation differentiated from conventional wisdom?" |
| Thesis → Vision | "Does the vision address the thesis specifically?" |
| Vision → Strategy | "Is the strategy achievable given our constraints?" |
| Strategy → Solution | "Does the solution address the strategy's value proposition?" |
| Solution → Requirements | "Are requirements complete enough to implement without ambiguity?" |
| Requirements → Design | "Does the design satisfy all requirements?" |
| Design → Implementation | "Can implementation proceed without design decisions still open?" |

## How the Workflow Evolved

### Initial State
Started with a broad mandate: "build a financial confidence feature for digital banking." This is dangerously underspecified — it could mean anything from a balance widget to a full PFM suite.

### Discovery Phase
Research synthesis revealed the specific opportunity: decision uncertainty for variable-income adults. This narrowed the space dramatically and provided testable claims.

### Thesis Development
Developing the thesis ("not management, but uncertainty") created a clear enemy and a clear contrast with existing products. Every subsequent decision could be tested against: "Does this reduce decision uncertainty?"

### Design Constraints
The thesis naturally constrained design decisions:
- "Calm over alarm" → no red, no alarming language
- "Outcome over engagement" → optimize for confidence, not sessions
- "Precision over recall" → fewer predictions, higher accuracy
- "Forward over backward" → projections, not history

### Implementation Discipline
Requirements written in WHEN/SHALL format enforce testability. Every acceptance criterion can be verified with a specific test. This isn't bureaucracy — it's quality assurance built into the specification process.

## Lessons Learned About AI-Assisted Product Development

### What Works Well
1. **Structural enforcement** — AI naturally asks "what evidence supports this?" and "what alternatives did you consider?" This creates artifacts that are review-ready.
2. **Speed through phases** — What might take days of solo thinking compresses into hours of collaborative iteration.
3. **Consistency checking** — AI catches contradictions between documents that a human might miss across a multi-file spec.
4. **Documentation generation** — The narrative cost of thorough documentation drops to near-zero, removing the usual trade-off between quality docs and shipping speed.

### What Requires Human Judgment
1. **Problem selection** — Which of multiple valid problems is most important and most tractable
2. **Epistemic calibration** — What confidence level does this evidence actually support
3. **Strategic taste** — Which positioning is most defensible and most compelling
4. **Scope boundary** — What to include, what to defer, what to never do
5. **Quality threshold** — How good is good enough for this context

### What to Watch For
1. **Plausibility over truth** — AI can generate convincing-sounding arguments for anything. Evidence discipline prevents this.
2. **Completeness bias** — AI tends toward comprehensive solutions. Human judgment draws boundaries.
3. **Consensus toward the prompt** — AI will align with the framing you provide. Deliberately challenge your own framing.
4. **Surface coherence** — Generated text can be internally consistent but miss real-world constraints. Ground in specifics.

## Reproducibility

Any product team can follow this methodology:
1. Start with evidence (public research, customer data, market analysis)
2. Frame the problem you see in the evidence
3. Develop a thesis that explains why the problem persists
4. Define a vision that addresses the thesis
5. Choose a strategy that makes the vision achievable
6. Validate a solution against the strategy
7. Write requirements from the solution
8. Design architecture from the requirements
9. Implement from the design

Each step produces a document. Each document links to its predecessors. The chain is traceable from code back to evidence.
