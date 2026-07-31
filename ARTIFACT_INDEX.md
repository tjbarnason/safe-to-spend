# Artifact Index — Nymbus Financial Decision Confidence

## Purpose

This index maps every approved planning artifact to its file location and purpose. It serves as the navigation layer for any implementation agent to locate authoritative source material without relying on chat history.

---

## Materialized Artifacts

| # | Artifact | File Location | Purpose | Status |
|---|----------|---------------|---------|--------|
| 1 | **Product Specification (Master)** | `Nymbus-Product-Specification.txt` | Comprehensive strategic document containing problem validation, product thesis, product vision, product strategy, and solution validation | Approved (Sections 1–5 complete; file truncates mid-Section 5.3) |
| 2 | **Product Requirements** | `.kiro/specs/financial-decision-confidence/requirements.md` | 10 formal requirements with user stories and acceptance criteria covering all system behaviors | Approved — Implementation-ready |
| 3 | **Technical Design** | `.kiro/specs/financial-decision-confidence/design.md` | Architecture, domain service interfaces, data models, API contracts, UI components, correctness properties, error handling, testing strategy | Approved — Implementation-ready |
| 4 | **Implementation Plan (Tasks)** | `.kiro/specs/financial-decision-confidence/tasks.md` | 13 task groups with subtasks, dependency graph, traceability to requirements, and execution notes | Approved — Implementation-ready |
| 5 | **PM Partner Profile** | `Kiro-Principal-Product-Manager.txt` | AI collaboration role definition and working principles used during planning | Reference only |
| 6 | **Assessment Brief** | `Take Home Assessment Product.md` | Original exercise constraints and evaluation criteria | Reference only |
| 7 | **Artifact Index** | `ARTIFACT_INDEX.md` | This file — navigation map for all artifacts | Current |
| 8 | **Implementation Handoff** | `IMPLEMENTATION_HANDOFF.md` | Execution guide with status, assumptions, constraints, and first steps | Current |

---

## Strategic Artifacts (within Nymbus-Product-Specification.txt)

| Section | Content | Completeness |
|---------|---------|--------------|
| 1. Problem Validation | Market context, validated customer job, validated problem, root causes, current alternatives, strategic gap, addressable opportunity | Complete |
| 2. Product Thesis | Core insight, conventional wisdom challenge, thesis statement, why now, strategic beliefs, differentiation thesis, winning conditions, risks | Complete |
| 3. Product Vision | Vision statement, future state (consumers/FIs/ecosystem), vision principles, experience principles, definition of success | Complete |
| 4. Product Strategy | Target customer, beachhead market, distribution model, FI value proposition, business model, positioning, competitive strategy, strategic pillars, build vs. partner, risks | Complete |
| 5. Solution Validation | Solution overview, core user journey, key user scenarios | Truncated mid-section (file ends at Section 5.3, row 3) |
| 6. Product Requirements | — | Not in this file; covered by `.kiro/specs/.../requirements.md` |
| 7. UX Design | — | Not materialized to file; design principles embedded in design.md |
| 8. Technical Design | — | Not in this file; covered by `.kiro/specs/.../design.md` |
| 9. Implementation Plan | — | Not in this file; covered by `.kiro/specs/.../tasks.md` |
| 10. AI Collaboration Infrastructure | — | Not materialized; planned for `docs/ai-collaboration/` during implementation |
| 11. Implementation Handoff | — | Covered by `IMPLEMENTATION_HANDOFF.md` |

---

## Missing / Chat-Only Artifacts

The following sections were referenced in the Product Specification's Table of Contents but are NOT present in any file on disk. If they were developed in the planning session, they exist only in that session's chat history:

- **Section 5.3–5.x (remainder)**: Key user scenarios table (partially truncated), likely additional solution validation content
- **Sections 6–11**: These appear to have been developed as the Kiro spec files rather than as continuations of the master spec document

**Impact on implementation:** Minimal. The Kiro spec files (requirements.md, design.md, tasks.md) contain everything needed for execution. The truncated Section 5.3 contains user scenarios that are adequately covered by the requirements document's user stories.

---

## How to Use This Index

1. **For strategic context** (why we're building this): Read `Nymbus-Product-Specification.txt`
2. **For what to build**: Read `.kiro/specs/financial-decision-confidence/requirements.md`
3. **For how to build it**: Read `.kiro/specs/financial-decision-confidence/design.md`
4. **For execution sequence**: Read `.kiro/specs/financial-decision-confidence/tasks.md`
5. **For execution guide**: Read `IMPLEMENTATION_HANDOFF.md`
