# product-profile.md
# Fam Frame — Product Profile
# Living white paper. Updated as the product evolves.
# Read when session scope touches product definition, problem framing, or roadmap.

---

## 1. Product Identity

product: Fam Frame
last-updated: 2026-05-05T16:33Z
source: codex-7fe52444

name: Fam Frame
tagline: Calm household context for the screen already in the room.
status: active

---

## 2. Problem Statement

problem:
  Household schedule, commute, weather, and routine context is scattered across apps and memory, especially during morning and evening transitions.

who-feels-it:
  Parents and household members coordinating school-day logistics.

when-it-hurts:
  Morning departures, evening routines, school-day changes, and calendar-heavy days.

cost-of-inaction:
  The family keeps relying on phone checks, memory, and ad hoc reminders.

---

## 3. Users

primary-users:
  - persona-[8char]: [one-line description]

secondary-users:
  - persona-[8char]: [one-line description]

non-users:
  [Who is explicitly not the target? Helps bound scope.]

---

## 4. Current State

what-exists-today:
  A static dashboard, dashboard-config.js, and an early admin screen backed by GitHub.

what-is-broken:
  TV browser chrome and viewport differences can affect composition. Admin editing is still early and token-based.

what-is-missing:
  Mature authentication, a flexible future schema, and a final decision on handling non-16:9 viewports without letterboxing.

---

## 5. Desired State

desired-state:
  The dashboard looks like a refined framed display, always fits, and can be updated by the household without code edits.

success-indicators:
  - The TV render is legible, unclipped, and visually pleasant at normal browser zoom.
  - Admin changes can update the dashboard config through GitHub.
  - The household prefers the typography and visual tone.

out-of-scope:
  A general-purpose calendar app, task manager, or full home automation platform.

---

## 6. Constraints

technical:
  - Static HTML/CSS/JS.
  - GitHub Pages-friendly deployment.
  - dashboard-config.js remains the source of truth for now.

organizational:
  - Household feedback is a first-class input.

regulatory:
  - None identified.

resource:
  - Keep implementation lightweight and easy to iterate.

---

## 7. Key Decisions

[Reference IDs only — full entries live in decisions.md]

- decision-3cdfc810: Dashboard configuration remains JavaScript-backed for now.
- decision-12713b03: Dashboard uses a fixed artboard scaled to visible viewport.
- decision-b0982db9: Visual direction is framed editorial display.
- decision-dcf75b3f: Dashboard typography should use sans serif display type.

---

## 8. Key Rules

[Reference IDs only — full entries live in rules.md]

- rule-29881d80: Configured times are local wall-clock times.
- rule-fc4bf2d4: Overflowing calendar content must summarize.

---

## 9. Open Questions

- Should the dashboard crop slightly or adapt width to eliminate bars on non-16:9 browser viewports?
  source: codex-7fe52444
  date: 2026-05-05T16:33Z

---

## 10. Version History

[Flat append log — newest at bottom]

- 2026-05-05T16:33Z (codex-7fe52444): Initialized profile with current Fam Frame product definition.

- YYYY-MM-DDTHH:MMZ (codex-[hash]): [what changed and why]

---

*product-profile.md — Fam Frame — v0.1*
*This is the living white paper for the product.*
*Update when the problem framing, user definition, or scope meaningfully changes.*
