# changelog.md
# Fam Frame — Changelog
# One entry per atomic action. All objects touched in one operation share a revisionId.
# The revisionId is the join key back to any object. Flat append log. Newest at bottom.
# Never delete entries.

---

## Schema

- rev-[8char]
  date: YYYY-MM-DDTHH:MMZ
  user: [username]
  origin: direct|codex|prompt
  codex-session: codex-[hash]
  claude-session: [claude-session-hash]
  prompt: prompt-[claude-session-hash]-[prompt-hash]
  objects:
    - [object-id]: [action — created|updated|completed|retired|migrated]
  action: created|updated|completed|retired|migrated
  summary: [one line — what changed and why]

---

## Notes

- one rev-[8char] per atomic action — one motion, one rev
- all objects touched in the same operation share the same revisionId
- origin: direct — user typed it, omit codex-session and prompt
- origin: codex — codex generated it, omit prompt
- origin: prompt — shaped prompt drove it, include all three session fields
- objects field lists every ID touched in this revision
- objects carry only revisionId — all detail lives here

---

## Entries

[Append new entries below. Newest at bottom.]

- rev-8cf356a6
  date: 2026-05-05T16:33Z
  user: john
  origin: codex
  codex-session: codex-7fe52444
  objects:
    - decision-3cdfc810: created
    - decision-12713b03: created
    - decision-b0982db9: created
    - decision-dcf75b3f: created
    - rule-29881d80: created
    - rule-fc4bf2d4: created
    - risk-f73f540f: created
  action: created
  summary: Initialized Fam Frame context with core dashboard, config, typography, overflow, and admin-token decisions.

- rev-15aa568c
  date: 2026-05-05T17:02Z
  user: john
  origin: codex
  codex-session: codex-f2af64c9
  objects:
    - admin/index.html: updated
    - dashboard/index.html: referenced
    - .famframe-context/session-handoff.md: updated
  action: updated
  summary: Updated admin saves to auto-sync to GitHub with clearer error toasts and aligned admin typography with dashboard.

---

*changelog.md — Fam Frame — v0.1*
*this is the source of truth for who changed what, when, and why.*
*objects carry only user and revisionId — all detail lives here.*
