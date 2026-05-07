# Routine Layering Model

Fam Frame routines should model stable family rhythm plus temporary exceptions without turning the admin into a schedule database.

The model has four layers:

1. `baseline`
   Usually true recurring routines. Examples: school morning, evening wind-down.

2. `pattern`
   Reusable variants that can be activated by weekday, season, or context. Examples: pickup day, sports practice day, late-start day.

3. `override`
   Temporary week/day changes that adjust a routine without mutating its source. Examples: no school Friday, late meeting, early dismissal.

4. `addon`
   Small inserts into a routine. Examples: library books, bring cleats, stop for milk.

## Principles

- Baseline routines remain easy to understand on their own.
- Patterns reuse the same shape as baseline routines, but are narrower in scope.
- Overrides are contextual and temporary. They should not rewrite the baseline object.
- Add-ons are lightweight and high-frequency. They should be easy to approve, snooze, or remove.
- Shared display output should receive only the resolved, safe routine result.

## Resolution Order

For any given date/time, resolve routines in this order:

1. Start with enabled baseline routines whose `appliesTo` matches.
2. Add enabled patterns whose `appliesTo` matches and whose priority is relevant.
3. Apply matching overrides by replacing or patching specific fields.
4. Apply add-ons by inserting display-safe list items, route stops, timeline items, or notes.
5. Generate the dashboard compatibility shape from the resolved result.

When two routines compete for the same display scene, choose the higher `display.priority`. If priorities tie, choose the routine whose active window started most recently.

## Suggested JSON Shape

The current `config/routines.json` already has `layer`, `appliesTo`, and `display.priority`. Future passes should add:

```json
{
  "inheritsFrom": "routine-school-morning",
  "activeBetween": {
    "startDate": "2026-05-11",
    "endDate": "2026-05-15"
  },
  "patch": {
    "timing": {
      "leaveAt": "07:05"
    }
  },
  "insertions": {
    "listItems": [],
    "routeStops": [],
    "timelineItems": []
  }
}
```

Use `patch` for overrides. Use `insertions` for add-ons. Avoid duplicating a whole routine when only one field changes.

## Admin UX

The default admin surface should show resolved routines, not raw inheritance mechanics.

Recommended disclosure:

- Routine cards show the active resolved result.
- A small source line can show `Baseline`, `Pattern`, `Override`, or `Add-on`.
- Add-ons should be quick-capture first.
- Advanced layer details should sit behind a details panel or future drill-in screen.

## Dashboard Boundary

The TV should not understand inheritance. It receives a resolved, display-safe routine set:

- safe labels
- times and windows
- display scene and priority
- derived route status
- list/timeline items approved for display

Raw notes, private route addresses, credentials, and adult-only context stay local to the admin device or private context layer.
