# Dynamic Routine Windows

Routine display windows should come from routine timing whenever practical.

The goal is to avoid brittle fixed scene windows like "morning is 06:00-13:00" when the real display need is closer to "show this departure routine before leave time through arrival/deadline."

## Policy

Each routine can still declare an explicit `window`:

```json
{
  "window": {
    "start": "06:00",
    "end": "08:00"
  }
}
```

Explicit windows are treated as overrides and are preserved.

To let Fam Frame derive the display window, omit `window` or mark it as automatic:

```json
{
  "window": {
    "mode": "auto"
  }
}
```

## Departure Routines

For departure routines, derive:

- start: `leaveAt - 30 minutes`
- end: `deadline + 30 minutes`

If `deadline` is missing, use `arriveBy`. If both are missing, end relative to `leaveAt`.

Optional per-routine display offsets:

```json
{
  "display": {
    "startBeforeMinutes": 45,
    "endAfterMinutes": 20
  }
}
```

## Timeline Routines

For timeline routines, derive:

- start: first timeline item start minus 30 minutes
- end: last timeline item end plus 30 minutes

Item end is `start + durationMinutes`.

## Layering

Dynamic windows are resolved after routine layers are composed. Baseline, pattern, override, and addon layers should first produce a resolved routine; then the resolved routine's display window can be derived.

This keeps overrides contextual. For example, an early-dismissal override can patch `deadline`, and the derived window follows naturally without mutating the baseline routine.

## Dashboard Boundary

The dashboard receives a concrete `window.start` and `window.end` in the compatibility output. It does not need to understand auto-window policy.
