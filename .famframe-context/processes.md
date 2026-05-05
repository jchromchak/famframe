# processes.md
# Fam Frame — Business Processes
# How work actually gets done. Step-level definition with inputs, outputs, and rules.
# Flat append log. Newest at bottom.
# Read when session scope touches workflow, logic flow, or handoff points.

---

## Schema

- process-[8char]
  title:
  status: active|draft|retired
  source: codex-[hash] | prompt-[hash]
  created: YYYY-MM-DDTHH:MMZ
  updated: YYYY-MM-DDTHH:MMZ

  rationale:
    [why does this process exist? what problem does it prevent or what workflow does it define?]

  trigger:
    [what starts this process? an event, a condition, a user action?]

  persona: persona-[8char]
    [which persona(s) own or participate in this process?]

  inputs:
    - [what is required before this process can begin?]

  steps:
    1. [step description]
       rule: rule-[8char]
       decision: decision-[8char]
       updated: YYYY-MM-DDTHH:MMZ (codex-[hash] | prompt-[hash])
       notes: [anything important about this step]
    2. [step description]
       rule: rule-[8char]
       decision: decision-[8char]
       updated: YYYY-MM-DDTHH:MMZ (codex-[hash] | prompt-[hash])
       notes:

  outputs:
    - [what is produced when this process completes?]

  handoff:
    [what happens at the end? who receives the output and what do they do with it?]

  exceptions:
    - [known deviations from the standard flow and how they are handled]
    - [if none, state: none]

  decision: decision-[8char]
    [decision that created or governs this process]

  rule: rule-[8char]
    [rules that constrain steps within this process]

  risk: risk-[8char]
    [risks associated with this process]

  retired-by: process-[8char]
    [if this process was retired and replaced, reference the replacement]

  version-history:
    - YYYY-MM-DDTHH:MMZ (codex-[hash] | prompt-[hash]): [what changed and why]

  notes:
    - [additional context, edge cases, or dependencies]
    - source: codex-[hash] | prompt-[hash]
    - date: YYYY-MM-DDTHH:MMZ

---

## Processes

[Append new processes below. Newest at bottom.]

---

*processes.md — Fam Frame — v0.1*
*step-level definitions with full cross-references.*
*retired processes stay in the log — never delete.*
