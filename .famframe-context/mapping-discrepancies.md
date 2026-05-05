# mapping-discrepancies.md
# Fam Frame — Mapping Discrepancies
# Two sections: auto-resolved and pending-review.
# Auto-resolved entries are logged and closed. Pending-review entries require human decision.
# Flat append log within each section. Newest at bottom.

---

## Auto-Resolved

[Naming conflicts or mismatches that were automatically aligned and logged.]
[No human action required. Record kept for audit trail.]

### Schema

- mapping-[8char]
  original: [the value as it was found]
  resolved: [the value as it was aligned to]
  rationale: [why this alignment was made — which convention or rule governs it]
  rule: rule-[8char]
  source: codex-[hash] | prompt-[hash]
  date: YYYY-MM-DDTHH:MMZ

### Entries

[Append new auto-resolved entries below. Newest at bottom.]

---

## Pending Review

[Naming conflicts or mismatches that require human judgment before resolution.]
[Each entry should generate a corresponding task in tasks.md.]

### Schema

- mapping-[8char]
  item: [the value or conflict requiring review]
  context: [where was this found? what is the ambiguity?]
  options:
    - [option a]
    - [option b]
  recommendation: [if codex has a suggested resolution, state it here — otherwise: none]
  task: task-[8char]
  source: codex-[hash] | prompt-[hash]
  created: YYYY-MM-DDTHH:MMZ
  updated: YYYY-MM-DDTHH:MMZ
  status: pending|resolved|deferred

  resolution:
    [once reviewed, document the decision here]
    resolved-to: [the final value]
    rationale: [why]
    resolved-by: [codex-[hash] | prompt-[hash] | john]
    date: YYYY-MM-DDTHH:MMZ

  notes:
    - [additional context]
    - source: codex-[hash] | prompt-[hash]
    - date: YYYY-MM-DDTHH:MMZ

### Entries

[Append new pending-review entries below. Newest at bottom.]

---

*mapping-discrepancies.md — Fam Frame — v0.1*
*auto-resolved entries are closed — no action needed.*
*pending-review entries each require a corresponding task-[8char] in tasks.md.*
*never delete entries — resolution is logged inline.*
