---
description: Capture AI collaboration context after meaningful work
trigger: after_task
---

After completing any meaningful unit of work, append an entry to ai-collaboration/session-log.md:

### [ISO 8601 Timestamp] — [Phase] — [Objective]
**Instruction:** [1-2 sentence summary]
**Output:** [1-2 sentence summary]
**Decisions:** [Key decisions with rationale]
**Files Modified:** [List of files]
**Next:** [What comes next]

Rules: Always append, never overwrite. Keep entries concise. Record decisions and rationale.
