# tasks.md
# Fam Frame — Task Queue
# Active work only. Flat append log. Newest at bottom.
# Completed tasks move to completed-tasks.md — do not leave them here.

---

## Schema

- [ ] Task title
  id: task-[8char]
  priority: now|next|later
  status: open|in-progress|blocked
  source: codex-[hash] | prompt-[hash]
  created: YYYY-MM-DDTHH:MMZ
  updated: YYYY-MM-DDTHH:MMZ
  due: YYYY-MM-DDTHH:MMZ

  owner: [who is responsible]
  persona: persona-[8char]
  decision: decision-[8char]
  rule: rule-[8char]
  process: process-[8char]
  opp: opp-[8char]
  risk: risk-[8char]

  notes:
    [Free text. What needs to happen and why.]

  blocked-by:
    - task-[8char]
    - [external dependency description]

---

## Tasks

[Append new tasks below. Newest at bottom.]
[When a task is completed, move the full entry to completed-tasks.md.]

- [ ] Re-envision admin navigation around iPhone-first setup flows
  id: task-1ec8cfcb
  priority: now
  status: in-progress
  revisionId: rev-d7e359c1

  owner: john
  decision: decision-b0982db9

  notes:
    Replace the current clunky Scenes / Modules / Actions organization with shorter drill-in screens. Primary use case is iPhone; iPad and desktop are secondary. First pass now uses Family, Daily Routines, Segments, Lists, Integrations, and Sync & Advanced.

  blocked-by:
    - none

- [ ] Redesign schedule model so routines can have different destinations by day/time
  id: task-fb53f89c
  priority: now
  status: in-progress
  revisionId: rev-68013094

  owner: john
  rule: rule-29881d80

  notes:
    Family should have a home location, but each routine may have a different end location. Morning routines may route to school, while Monday and Wednesday PM routines may route somewhere else. First admin pass exposes Segments as itinerary blocks and keeps route addresses local; a safe stopCount now carries the number of intermediate stops to the TV. Full day-specific JSON routine modeling remains next.

  blocked-by:
    - task-1ec8cfcb

- [ ] Add robust location autocomplete and place capture in admin
  id: task-6e4af661
  priority: now
  status: in-progress
  revisionId: rev-d7e359c1

  owner: john
  risk: risk-f3bc945f

  notes:
    Add Google Places autocomplete for home/origin and routine destination fields. Store stable display address and, where useful, lat/lng/place metadata. Keep manual entry fallback.

  blocked-by:
    - Google Maps browser key must have Places API enabled and be referrer-restricted.

- [ ] Improve GitHub PAT recovery and diagnostics in admin
  id: task-9f48ead6
  priority: now
  status: open
  revisionId: rev-8df34268

  owner: john
  risk: risk-f73f540f

  notes:
    Make token failure states understandable on phone. Include a GitHub access check, clearer permission messages, and a recovery flow for re-entering PAT, repo, branch, and config path.

  blocked-by:
    - none

- [ ] Verify evening timeline hierarchy on the Frame TV
  id: task-ec87f32e
  priority: now
  status: in-progress
  revisionId: rev-13777fec

  owner: john

  notes:
    Evening was too title-heavy and the timeline was visually cramped. Test the wider timeline lane on the actual TV/browser-chrome viewport and tune title, time, row scale, and side-panel balance from the photo feedback.

  blocked-by:
    - none

- [ ] Move route refresh actions onto the active segment card
  id: task-f54dedff
  priority: now
  status: in-progress
  revisionId: rev-13777fec

  owner: john

  notes:
    Admin should increasingly work from the object being edited. First pass adds an Update maps status button to the current school segment; future pass should repeat this pattern for every routine segment card.

  blocked-by:
    - task-fb53f89c

---

*tasks.md — Fam Frame — v0.1*
*Active tasks only. This file should stay lean.*
*Completed tasks live in completed-tasks.md.*
