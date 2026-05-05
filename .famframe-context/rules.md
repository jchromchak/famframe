# rules.md
# Fam Frame — Business Rules
# Product behavior, logic constraints, and scope guardrails.
# Flat append log. Newest at bottom.
# Always check this file before changing business logic in any session.

---

## Schema

- rule-[8char]
  title:
  status: active|retired
  source: codex-[hash] | prompt-[hash]
  created: YYYY-MM-DDTHH:MMZ
  updated: YYYY-MM-DDTHH:MMZ

  description:
    [What is the rule? State it explicitly and unambiguously.]

  rationale:
    [Why does this rule exist? What problem does it prevent?]

  scope:
    [Where does this rule apply? Which files, fields, processes, or personas?]

  persona: persona-[8char]
    [Which persona(s) does this rule affect?]

  decision: decision-[8char]
    [The decision that created or governs this rule.]

  process: process-[8char]
    [The process this rule governs or constrains.]

  exceptions:
    - [Any known legitimate exceptions to this rule]
    - [If none, state: none]

  violation-behavior:
    [What should happen if this rule is violated or about to be violated?
    Flag only | Block and ask | Auto-correct with log]

  retired-by: rule-[8char]
    [If this rule was retired and replaced, reference the replacement.]

  notes:
    - [Additional context or edge cases]
    - source: codex-[hash] | prompt-[hash]
    - date: YYYY-MM-DDTHH:MMZ

---

## Rules

[Append new rules below. Newest at bottom.]

- rule-29881d80
  title: Configured times are local wall-clock times
  status: active
  revisionId: rev-8cf356a6

  description:
    Schedule, commute, checklist, and mode-window times in dashboard-config.js are local wall-clock times interpreted in time.timeZone.

  rationale:
    This avoids ambiguity between UTC, browser local time, and the family/home timezone.

  scope:
    dashboard-config.js, dashboard/index.html time calculations, admin/index.html schedule editors.

  exceptions:
    - External API timestamps may arrive as UTC or provider-local timestamps and must be converted before display.

  violation-behavior:
    Block and ask.

- rule-fc4bf2d4
  title: Overflowing calendar content must summarize
  status: active
  revisionId: rev-8cf356a6

  description:
    Calendar panels should show the first relevant item and summarize additional items as "and N more" rather than expanding until the layout clips.

  rationale:
    The dashboard is a fixed frame-TV display, so preserving the composition matters more than showing every calendar item at once.

  scope:
    dashboard/index.html calendar rendering.

  exceptions:
    - A future detail mode may show a longer agenda if it has a dedicated layout.

  violation-behavior:
    Auto-correct with log.

- rule-94edd7b0
  title: TV dashboard must never receive secrets
  status: active
  revisionId: rev-bbf3fc6e

  description:
    The TV dashboard is read-only and may only consume safe display config and derived data. GitHub PATs, Maps API keys, Calendar API keys, and other token-like values must stay out of TV-readable files.

  rationale:
    The dashboard runs in a browser on a shared display and should not be privileged. Secrets belong only in the mobile admin app for the personal MVP.

  scope:
    dashboard/index.html, dashboard-config.js, future /config JSON files, and any TV-readable content files.

  exceptions:
    - none

  violation-behavior:
    Block and ask.

---

*rules.md — Fam Frame — v0.1*
*Codex checks this file before changing any business logic.*
*Retired rules stay in the log — never delete.*
