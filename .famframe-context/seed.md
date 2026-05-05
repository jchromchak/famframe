# seed.md
# Fam Frame — Deep Living Memory
# Full project context. Updated infrequently. Read at every session start.

---

## 1. Project Identity

project: Fam Frame
last-updated: 2026-05-05
source: codex-7fe52444

name: Fam Frame
description: A frame-TV family dashboard and companion admin screen for household schedule, commute, weather, calendar, and routine information.
tagline: Calm household context for the screen already in the room.

---

## 2. Problem Statement

problem:
  Family schedule and morning/evening logistics are easy to lose track of in the flow of the day. Fam Frame makes the next important household context visible without requiring someone to open a phone or app.

context:
  The primary renderer is a frame TV browser in landscape orientation, with iPad/browser rendering as a secondary testing surface. Browser chrome may be visible, so the dashboard must fit inside the actual visible viewport.

why-now:
  The household is iterating toward a usable daily display and needs both a polished dashboard and a simple way to update config without editing code.

---

## 3. Current State

current-state:
  The dashboard is static HTML/CSS/JS backed by dashboard-config.js. An early static admin screen can edit the current config model and push updates through GitHub.

known-gaps:
  Real authentication, flexible schema evolution, richer calendar detail views, and final TV browser kiosk/chrome handling are not fully solved.

---

## 4. Desired State

desired-state:
  Fam Frame feels like an elegant framed display, always fits the available viewport, and lets the household update routines, schedule, commute, and calendar settings without touching dashboard code.

success-indicators:
  - The frame TV can run at 100% zoom without clipping.
  - Household members prefer the visual style enough to leave it on.
  - Config changes made through admin are reflected on the dashboard after deploy/refresh.

---

## 5. Constraints

constraints:
  - Static GitHub Pages-friendly architecture for now.
  - dashboard-config.js remains the active source of truth.
  - Times are local wall-clock times interpreted in time.timeZone.
  - The dashboard should avoid card-heavy app styling.

assumptions:
  - The primary TV viewport is landscape and close to 16:9.
  - A fixed 1920x1080 artboard scaled to visible viewport is preferable to full responsive reflow.

---

## 6. Key Decisions

[Reference IDs only — full entries live in decisions.md]

- decision-3cdfc810: Dashboard configuration remains JavaScript-backed for now.
- decision-12713b03: Dashboard uses a fixed artboard scaled to visible viewport.
- decision-b0982db9: Visual direction is framed editorial display.
- decision-dcf75b3f: Dashboard typography should use sans serif display type.

---

## 7. Key Rules

[Reference IDs only — full entries live in rules.md]

- rule-29881d80: Configured times are local wall-clock times.
- rule-fc4bf2d4: Overflowing calendar content must summarize.

---

## 8. Key Processes

[Reference IDs only — full entries live in processes.md]

- process-[8char]: [one-line summary]
- process-[8char]: [one-line summary]

---

## 9. Open Questions

open-questions:
  - Should non-16:9 browser viewports keep letterboxing, crop slightly, or use an adaptive artboard width?
  - What authentication model should replace browser-local GitHub PAT storage when admin access grows?
  - source: codex-7fe52444

---

## 10. History

[Flat append log — newest at bottom. One line per significant change.]

- 2026-05-05 (codex-7fe52444): Initialized Dovetell context from template and seeded core Fam Frame decisions.

---

*seed.md — Fam Frame — v0.1*
*This is the source of truth for project context.*
*Update when the project fundamentally changes, not every session.*
