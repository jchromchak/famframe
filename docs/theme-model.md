# Theme Model

Fam Frame themes should make the TV feel like a calm household object, not a skinnable app. The model stays intentionally small: named themes, a compact token set, optional custom background input, and derived readable colors.

## Goals

- Keep Morning, Evening, departure, art, sleep, and future routine scenes visually coherent.
- Allow the current default theme and Ambient Evening without one-off per-screen palettes.
- Let future users choose a background color while Fam Frame derives safe supporting colors.
- Preserve readability at TV distance through contrast checks and restrained accents.
- Keep the dashboard runtime display-safe: no secrets, no raw notes, no admin-only color experiments.

## JSON Shape

`config/display.json` owns the theme selection:

```json
{
  "theme": {
    "id": "default-editorial",
    "customBackground": null,
    "derived": false
  }
}
```

Supported fields:

- `id`: a stable theme id. Initial values are `default-editorial` and `ambient-evening`.
- `customBackground`: optional user-selected hex color. When present, the system derives the remaining tokens instead of exposing raw disconnected color controls.
- `derived`: true when the effective token set was generated from a custom background.
- `accent`: optional explicit accent. New UI should prefer derived theme tokens over reading this directly.

The TV may receive an expanded safe theme object later, but JSON source should stay compact.

Individual routines may override the global dashboard theme through their `display` object:

```json
{
  "display": {
    "scene": "evening",
    "priority": 40,
    "themeId": "ambient-evening"
  }
}
```

Use this for event-level feel, such as Evening using Ambient Evening while Morning inherits the dashboard default. Segments and lists should not own theme because they describe route and task details, not TV presentation.

## Token Contract

Every resolved theme should provide these display tokens:

```json
{
  "background": "#0b0b09",
  "surface": "rgba(255,255,255,0.035)",
  "surfaceStrong": "rgba(255,255,255,0.07)",
  "text": "#efe7d7",
  "textSecondary": "rgba(239,231,215,0.68)",
  "textMuted": "rgba(239,231,215,0.42)",
  "divider": "rgba(239,231,215,0.10)",
  "accent": "#d99a3d",
  "accentSoft": "rgba(217,154,61,0.12)",
  "ok": "#7aaa8a",
  "warn": "#d4845a",
  "critical": "#c94f3a"
}
```

Token names should describe behavior, not color names. Scene-specific CSS can decide where to use `accent`, `surface`, or `textMuted`, but should not introduce new hard-coded palette constants unless the token set is missing a real need.

## Built-In Themes

### Default Editorial

The current/default theme remains the baseline:

- near-black background
- warm off-white text
- low-opacity dividers
- amber current-state accent
- muted secondary text

It should feel quiet, sharp enough for morning urgency, and restrained enough for all-day display.

### Ambient Evening

Reference phrase: foggy evening periwinkle with warm lamp-light accents.

Base tokens:

```json
{
  "background": "#958AAD",
  "surface": "#86799D",
  "surfaceStrong": "#B3A8C4",
  "text": "#F4F1F8",
  "textSecondary": "rgba(244,241,248,0.68)",
  "textMuted": "rgba(244,241,248,0.52)",
  "divider": "rgba(255,255,255,0.10)",
  "accent": "#EFD27A"
}
```

Ambient Evening is for dinner-to-bedtime transitions, wind-down routines, family reset moments, and low-energy household coordination. Avoid plum, wine, saturated violet, neon accents, harsh white borders, pure black text, productivity-app energy, and overly playful colors.

## Derived Colors

Custom backgrounds should derive a full token set with these rules:

1. Estimate whether the background is light or dark from relative luminance.
2. Choose primary text with a minimum contrast target of 4.5:1 for normal dashboard text.
3. Prefer warm off-white text for dark/mid backgrounds and deep warm charcoal for light backgrounds.
4. Derive secondary and muted text by blending primary text toward the background, then re-check readability for small labels.
5. Derive dividers and surfaces from low-opacity text/background blends instead of unrelated hues.
6. Choose an accent that contrasts against the background and does not overpower current-state hierarchy.
7. Clamp saturation for ambient themes; avoid neon, candy, and corporate-blue outcomes.

If the derived token set cannot hit contrast targets, the admin should warn and fall back to the closest built-in theme rather than saving an unreadable TV state.

## Admin UX

The first admin version should expose theme selection as a simple choice:

- Default
- Ambient Evening
- Custom background

Custom background should be a single color input with a preview. The admin should not expose raw token editing unless a future expert/debug mode needs it.

## Runtime Boundary

Theme implementation should stay as a narrow runtime layer that maps resolved theme tokens to CSS custom properties. The adapter passes safe theme metadata through to the dashboard.

The theme system should not be coupled to routine layering, route refresh, PAT storage, Maps keys, or private context capture.
