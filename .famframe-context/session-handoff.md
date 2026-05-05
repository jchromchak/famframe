# session-handoff.md
# Fam Frame — Session Handoff Memory
# Snapshot of current state. Replaced every session close. Not an append log.
# Read at every session start after launcher.md and before seed.md.

---

## Current Handoff

session: codex-7fe52444
date: 2026-05-05T16:33Z
scope: Installed Dovetell context scaffolding, seeded current Fam Frame decisions, and changed dashboard display typography to sans serif.

### Files Touched
- launcher.md: Added project-specific Dovetell launcher for Fam Frame.
- _prompt-shaper.md: Added project-specific prompt shaper.
- .famframe-context/: Loaded project context scaffolding and seeded decisions, rules, risk, seed, profile, changelog, and this handoff.
- dashboard/index.html: Replaced serif display typography with Inter-based sans serif display styling.

### Decisions Made
- decision-3cdfc810: Dashboard configuration remains JavaScript-backed for now.
- decision-12713b03: Dashboard uses a fixed artboard scaled to visible viewport.
- decision-b0982db9: Visual direction is framed editorial display.
- decision-dcf75b3f: Dashboard typography should use sans serif display type.

### Tasks Added
- none

### Tasks Completed
- none

### Rules Added
- rule-29881d80: Configured times are local wall-clock times.
- rule-fc4bf2d4: Overflowing calendar content must summarize.

### Risks Added
- risk-f73f540f: Static admin stores GitHub token in browser localStorage.

### Boundary Conditions Triggered
- none

### Pending
- Decide how to handle non-16:9 visible browser viewports: keep letterboxing, crop slightly, or introduce adaptive artboard width.
- Validate the sans serif dashboard render on the frame TV and iPad after deployment.

### Next Session Start Here
Start by reading launcher.md, then .famframe-context/session-handoff.md and .famframe-context/seed.md. The immediate unresolved product/design choice is whether to preserve no-clipping letterbox scaling or eliminate black bars with crop/adaptive layout. Dashboard typography has just moved from serif to sans serif and needs real-device feedback.

---

*session-handoff.md — Fam Frame — v0.1*
*This file is replaced, not appended, at every session close.*
*The audit trail lives in the individual context files.*
