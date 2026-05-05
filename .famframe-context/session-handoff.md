# session-handoff.md
# Fam Frame — Session Handoff Memory
# Snapshot of current state. Replaced every session close. Not an append log.
# Read at every session start after launcher.md and before seed.md.

---

## Current Handoff

session: codex-783510e6
date: 2026-05-05T21:43Z
scope: Security-first MVP refactor: TV no longer receives secrets, admin owns credentials locally, and commute data is derived before writing to repo config.

### Files Touched
- dashboard/index.html: Added ConfigService boundary, secret-like config warnings, removed TV-side Maps/Calendar credential calls, and renders derived commute freshness/fallback state.
- admin/index.html: Added CredentialStore, local-only PAT/Maps/Calendar credential handling, zero-width token cleanup, safe config serialization, local route origin/destination storage, and derived commute generation.
- dashboard-config.js: Removed shared API-key fields and added safe derived commute route shape.
- README.md: Added security model.
- .famframe-context/rules.md: Added TV-no-secrets rule.
- .famframe-context/changelog.md: Logged this security refactor.
- .famframe-context/session-handoff.md: Replaced handoff with current state.

### Decisions Made
- task-1ec8cfcb: Re-envision admin navigation around iPhone-first setup flows.
- task-fb53f89c: Redesign schedule model so routines can have different destinations by day/time.
- task-6e4af661: Add robust location autocomplete and place capture in admin.
- task-9f48ead6: Improve GitHub PAT recovery and diagnostics in admin.

### Tasks Added
- none

### Tasks Completed
- risk-f3bc945f: Browser-visible Google Maps key can be abused if unrestricted.

### Rules Added
- rule-94edd7b0: TV dashboard must never receive secrets.

### Risks Added
- none

### Boundary Conditions Triggered
- none

### Pending
- Decide how to handle non-16:9 visible browser viewports: keep letterboxing, crop slightly, or introduce adaptive artboard width.
- Use the new Actions → Check GitHub access button to diagnose PAT failure and capture exact output if saving still fails.
- Add the actual Google Maps browser key through admin, plus commute origin and destination, then save to GitHub.
- Restrict the Google Maps key in Google Cloud to the Fam Frame GitHub Pages domain and required Maps APIs.
- Verify the commute panel shows fresh derived commute data and falls back when stale.
- Continue task-1ec8cfcb and task-fb53f89c to redesign the admin flow around home plus routine-specific destinations.

### Next Session Start Here
Start by reading launcher.md, then .famframe-context/session-handoff.md and .famframe-context/seed.md. The security boundary is now: admin keeps credentials locally, repo stores safe display/derived data, TV is read-only and ignores secret-like config. Next product step is task-1ec8cfcb plus task-fb53f89c: redesign admin flow and model routines with their own destinations.

---

*session-handoff.md — Fam Frame — v0.1*
*This file is replaced, not appended, at every session close.*
*The audit trail lives in the individual context files.*
