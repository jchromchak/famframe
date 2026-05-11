# Weekly Focus Backlog

Current reset: May 11, 2026

This week is about stabilizing the core parent/operator workflow after the tribute detour. The product language should move toward **Scenes** as the top-level display concept, with routines and tributes as scene types.

## Ranked Work

### WF-01. Scene System Foundation

Status: mostly closed

Outcome: the admin and dashboard share a clear mental model where a Scene is the thing rendered on the family display.

Scope:

- Define initial scene types: `routine` and `tribute`.
- Show scenes as first-class objects in React admin.
- Preserve existing routine rendering and dashboard behavior.
- Keep tribute activation separate from routine timing.
- Make the current Arthur birthday tribute visible as a scene rather than a hidden override.
- Move tribute scheduling into `config/scenes.json`.

Acceptance:

- [x] React admin has a Scenes area.
- [x] Routine-backed scenes expose routine label, type, window, and activation state.
- [x] Tribute scenes expose title, activation dates/window, and image path.
- [x] Existing Routines area still works.
- [x] Dashboard behavior does not regress.

Non-goals:

- Calendar ingestion.
- AI-generated scene CRUD.
- General theme engine.
- Mixed routine + tribute hybrid scenes.

### WF-02. Routine Management Stabilization

Status: in progress

Outcome: a parent can create, edit, disable, and understand household routines without touching raw JSON.

Scope:

- Audit current React routine read model against `config/routines.json`.
- Add a focused routine detail surface with Summary, Timing, Tasks/Timeline, Route, and Theme sections.
- Support create/edit/delete in local state first, then plan persistence.
- Make recurring weekday and one-off date behavior visible.

Acceptance:

- [x] Routine list is deterministic after refresh.
- [x] Routine detail shows the fields that actually drive the dashboard.
- [x] Enabled/disabled state is clear.
- [ ] One-off and recurring schedule concepts are understandable.
- [ ] Create/edit/delete persistence path is clear.

Non-goals:

- Dynamic traffic routing.
- Calendar sync.
- Push notifications.
- Advanced permissions.

### WF-03. Scene Scheduling Contract

Status: in progress

Outcome: special scenes can be scheduled without one-off dashboard code.

Scope:

- Draft a small JSON contract for scheduled tribute scenes.
- Represent date windows and optional time windows.
- Define priority order: URL force, scheduled scene, local force, routine scene, fallback art.
- Move Arthur birthday from hardcoded dashboard rule into the contract.

Acceptance:

- [ ] Scene scheduling can express Mother's Day and Arthur birthday.
- [x] Dashboard scene resolution reads data, not one-off constants.
- [x] Admin can show scheduled scene status.

Current slice:

- `config/scenes.json` defines Arthur birthday as a scheduled tribute scene.
- The dashboard reads scheduled tribute scenes from config before routine windows.
- React admin reads the same scene config for the Scenes tab.

### WF-04. Dynamic Departure And Multi-Stop Routing Spike

Status: later spike

Outcome: decide how Google Maps multi-stop routing should augment routine timing without replacing offline-safe baselines.

Scope:

- Define stop data shape.
- Define cache/live refresh behavior.
- Decide visual signals for traffic confidence and updated time.

Non-goals:

- Turn-by-turn navigation.
- Live rerouting engine.

### WF-05. Persistence Layer Reassessment

Status: later spike

Outcome: decide whether git-backed JSON/markdown is still the right admin persistence layer.

Scope:

- Compare current git workflow against a lightweight database option.
- Evaluate local-first and Supabase/Postgres paths.
- Identify the smallest persistence move that reduces parent/operator friction.

Non-goals:

- Migrating this week.
- Designing full multi-user auth.
