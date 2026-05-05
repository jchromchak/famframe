# risks.md
# Fam Frame — Risk Register
# Likelihood, impact, mitigation. Flat append log. Newest at bottom.
# Read when session scope touches delivery, scope, or stability.

---

## Schema

- risk-[8char]
  title:
  status: open|mitigated|closed
  source: codex-[hash] | prompt-[hash]
  created: YYYY-MM-DDTHH:MMZ
  updated: YYYY-MM-DDTHH:MMZ

  description:
    [what is the risk? what could go wrong and under what conditions?]

  likelihood: low|medium|high
  impact: low|medium|high
  severity: low|medium|high
    [derived from likelihood + impact — set explicitly, do not auto-calculate]

  persona: persona-[8char]
    [which persona(s) are affected if this risk materializes?]

  decision: decision-[8char]
    [decision that created, accepted, or mitigated this risk]

  process: process-[8char]
    [process affected if this risk materializes]

  rule: rule-[8char]
    [rule that governs or constrains this risk]

  mitigation:
    [what is being done to reduce likelihood or impact?]

  contingency:
    [if the risk materializes despite mitigation, what is the response plan?]

  trigger:
    [what signal or event would indicate this risk is materializing?]

  closed-reason:
    [if status is closed or mitigated, why and how?]
    date: YYYY-MM-DDTHH:MMZ
    source: codex-[hash] | prompt-[hash]

  notes:
    - [additional context or dependencies]
    - source: codex-[hash] | prompt-[hash]
    - date: YYYY-MM-DDTHH:MMZ

---

## Risks

[Append new risks below. Newest at bottom.]

- risk-f73f540f
  title: Static admin stores GitHub token in browser localStorage
  status: open
  revisionId: rev-8cf356a6

  description:
    The early admin screen uses a GitHub personal access token stored in browser localStorage to pull and push dashboard-config.js.

  likelihood: medium
  impact: medium
  severity: medium

  decision: decision-3cdfc810

  mitigation:
    Treat this as private early testing only. Use a narrowly scoped token with contents access to the Fam Frame repo and avoid shared/public devices.

  contingency:
    Move to GitHub OAuth, a GitHub App, or a small backend if the admin becomes multi-user or public.

  trigger:
    Admin access expands beyond trusted household devices or requires real login/account management.

- risk-f3bc945f
  title: Browser-visible Google Maps key can be abused if unrestricted
  status: open
  revisionId: rev-229be9fd

  description:
    The dashboard uses a browser-visible Google Maps JavaScript API key for commute traffic. If the key is not restricted, someone could reuse it outside Fam Frame.

  likelihood: medium
  impact: medium
  severity: medium

  decision: decision-3cdfc810

  mitigation:
    Restrict the key in Google Cloud to the Fam Frame GitHub Pages HTTP referrer and only the APIs needed for Maps JavaScript / commute routing.

  contingency:
    Rotate the key and move traffic calls behind a backend if usage expands beyond trusted static dashboard rendering.

  trigger:
    Unexpected Google Maps billing activity, public repo distribution beyond household use, or admin access expansion.

---

*risks.md — Fam Frame — v0.1*
*open risks are reviewed at session start when scope is relevant.*
*closed and mitigated risks stay in the log — never delete.*
