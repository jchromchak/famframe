# decisions.md
# Fam Frame — Decision Log
# Commitments made. Flat append log. Newest at bottom.
# Never delete. Superseded decisions stay with a reference to the replacement.

---

## Schema

- decision-[8char]
  title:
  status: active|resolved|superseded
  source: codex-[hash] | prompt-[hash]
  created: YYYY-MM-DDTHH:MMZ
  updated: YYYY-MM-DDTHH:MMZ

  context:
    [What situation or question prompted this decision?]

  decision:
    [What was decided? Be explicit and unambiguous.]

  rationale:
    [Why was this the right call? What alternatives were considered?]

  constraints:
    [What constraints shaped this decision?]

  outcomes:
    [What is expected to happen as a result?]

  persona: persona-[8char]
    [Which persona(s) does this decision affect?]

  rule: rule-[8char]
    [Rules created or modified as a result of this decision.]

  task: task-[8char]
    [Tasks created as a result of this decision.]

  process: process-[8char]
    [Processes affected by this decision.]

  opp: opp-[8char]
    [Opportunity this decision elevates or closes.]

  risk: risk-[8char]
    [Risks created, mitigated, or closed by this decision.]

  supersedes: decision-[8char]
    [If this replaces a prior decision, reference it here.]

  superseded-by: decision-[8char]
    [If this decision was later replaced, reference the replacement.]

  notes:
    - [Additional context or follow-up observations]
    - source: codex-[hash] | prompt-[hash]
    - date: YYYY-MM-DDTHH:MMZ

---

## Decisions

[Append new decisions below. Newest at bottom.]

- decision-3cdfc810
  title: Dashboard configuration remains JavaScript-backed for now
  status: resolved
  revisionId: rev-8cf356a6

  context:
    Fam Frame currently loads dashboard-config.js directly in the browser before rendering dashboard/index.html.

  decision:
    Keep dashboard-config.js as the source of truth for the current model. The admin screen may edit and push that file, while a future schema can make the model more flexible.

  rationale:
    A JavaScript config file works cleanly for static GitHub Pages and keeps dashboard loading simple. Markdown or JSON can be revisited later, but would require a different loading/parsing path.

  constraints:
    Do not store credentials or secrets in dashboard-config.js.

  outcomes:
    Dashboard behavior should read schedule, commute, weather, calendar, and routine data from dashboard-config.js rather than hardcoding values in dashboard/index.html.

- decision-12713b03
  title: Dashboard uses a fixed artboard scaled to visible viewport
  status: resolved
  revisionId: rev-8cf356a6

  context:
    The frame TV browser chrome can reduce the available visible area and cause clipping when the dashboard assumes a full 16:9 viewport.

  decision:
    Use a fixed 1920x1080 dashboard artboard and scale it to fit inside the actual visible browser viewport.

  rationale:
    This preserves the frame-TV composition and avoids a sprawling responsive design system. It prioritizes always showing the full dashboard over filling every pixel of non-16:9 browser viewports.

  constraints:
    This may create horizontal or vertical letterboxing when the visible viewport is not 16:9.

  outcomes:
    The dashboard should not clip content at 100% browser zoom, including when browser navigation chrome is visible.

- decision-b0982db9
  title: Visual direction is framed editorial display
  status: resolved
  revisionId: rev-8cf356a6

  context:
    The dashboard should feel like an elegant frame-TV display rather than a card-heavy web dashboard.

  decision:
    Favor large restrained typography, fine divider lines, dark textured background, quiet panels, and minimal card-like surfaces.

  rationale:
    This better matches the living-room frame use case and the reference renderings.

  constraints:
    Avoid introducing decorative card stacks, landing-page composition, or dense app-dashboard styling.

  outcomes:
    UI modules should look integrated into a framed composition, with repeated content rendered as rows or panels rather than cards.

- decision-dcf75b3f
  title: Dashboard typography should use sans serif display type
  status: resolved
  revisionId: rev-8cf356a6

  context:
    Household feedback rejected the previous serif display font.

  decision:
    Use sans serif typography for dashboard display elements.

  rationale:
    Sans serif type is preferred by the household and can still feel elegant when paired with light weights, spacing, and restrained layout.

  constraints:
    Keep labels readable at TV distance.

  outcomes:
    The dashboard should avoid Cormorant Garamond or similar serif display fonts.

---

*decisions.md — Fam Frame — v0.1*
*Never delete entries. Superseded decisions stay in the log.*
*Full audit trail is the point.*
