# Mobile Admin Image Prompts

These prompts are for exploring the next React admin shape in image generation or FigJam. They focus on mobile-first flows and should borrow the richer black, warm, classy visual language from the original HTML/JS dashboard rather than the lighter beige prototype.

Use a consistent frame across prompts:

```text
Design a high-fidelity mobile app screen for Fam Frame, a premium family operations dashboard. Portrait iPhone viewport, 390x844. Rich black and charcoal background, warm ivory text, subtle amber/gold accents, refined editorial spacing, softly luminous glassy panels, understated household-dashboard luxury. No marketing copy, no onboarding illustration, no generic productivity-app blue. This is an actual working admin tool for parents managing a living-room family dashboard. Use realistic touch targets, dense but calm information hierarchy, and polished mobile navigation. Add a tiny provenance label in the lower-right corner in low-contrast warm gray text using this exact format: image-[hash]-[slug]-YYYY-MM-DD.
```

## Provenance IDs

Use the ids below in the lower-right provenance label. The hash is the first 8 lowercase hex characters of `sha1("famframe-mobile-admin:" + slug)`.

| Screen | Slug | Hash | Provenance label |
| --- | --- | --- | --- |
| Login And Family Switcher | `login-family-switcher` | `8b4f176c` | `image-8b4f176c-login-family-switcher-2026-05-10` |
| Create Family | `create-family` | `d529aef5` | `image-d529aef5-create-family-2026-05-10` |
| Today Command Center | `today-command-center` | `32de7e85` | `image-32de7e85-today-command-center-2026-05-10` |
| Quick Capture | `quick-capture` | `a1eac579` | `image-a1eac579-quick-capture-2026-05-10` |
| Routine Detail | `routine-detail` | `e314d861` | `image-e314d861-routine-detail-2026-05-10` |
| Routine Library | `routine-library` | `cea1fdbe` | `image-cea1fdbe-routine-library-2026-05-10` |
| Display Targets | `display-targets` | `2c7622a5` | `image-2c7622a5-display-targets-2026-05-10` |
| Publish And Sync | `publish-and-sync` | `b73c15df` | `image-b73c15df-publish-and-sync-2026-05-10` |
| Super Admin Testing View | `super-admin-testing-view` | `400afc23` | `image-400afc23-super-admin-testing-view-2026-05-10` |
| System Model | `system-model` | `47b57612` | `image-47b57612-system-model-2026-05-10` |
| Mobile Flow Board | `mobile-flow-board` | `e5056fac` | `image-e5056fac-mobile-flow-board-2026-05-10` |
| Design System Sheet | `design-system-sheet` | `87602039` | `image-87602039-design-system-sheet-2026-05-10` |

## 1. Login And Family Switcher

```text
Design the Fam Frame mobile admin login and family switcher screen. Show a compact account selector at the top, then a list of families the account can access. Each family row should show family name, role, member count, display count, and default display. Include a prominent but tasteful "Create family" action. Use the rich black Fam Frame style: charcoal canvas, warm ivory labels, amber accents, subtle depth, premium and calm. This should feel like a real mobile operations app, not a landing page. Lower-right provenance label: image-8b4f176c-login-family-switcher-2026-05-10.
```

## 2. Create Family

```text
Design the Fam Frame create-family mobile screen. Fields: family name, owner display name, timezone, default display name, default display room. Include a generated handle preview and an owner role preview. The primary action should be ready for thumb use near the bottom. Brand style: rich black, warm ivory, restrained gold, classy household-dashboard feel. Avoid cute illustrations. Make the form compact, legible, and emotionally reassuring. Lower-right provenance label: image-d529aef5-create-family-2026-05-10.
```

## 3. Today Command Center

```text
Design the Fam Frame mobile admin "Today" command center. Show the selected family and active display target at the top. Include cards for current routine, next routine, temporary appends, and dashboard publish status. Include a bottom tab bar with Today, Capture, Routines, Displays, System. The visual mood is rich black and warm gold, like a sophisticated living-room dashboard control surface. Prioritize scanability and thumb-friendly actions. Lower-right provenance label: image-32de7e85-today-command-center-2026-05-10.
```

## 4. Quick Capture

```text
Design the Fam Frame mobile Quick Capture screen. The parent has typed: "Late start tomorrow. Need library books. Pack soccer gear." Show the raw note editor, a parsed append preview, suggested affected routines, and actions to apply, edit, or discard each suggestion. The screen should feel calm and intelligent, not chatty. Use the black-rich Fam Frame brand, ivory text, amber highlights, and subtle card boundaries. Lower-right provenance label: image-a1eac579-quick-capture-2026-05-10.
```

## 5. Routine Detail

```text
Design a Fam Frame mobile Routine Detail screen for "School Morning". Show enabled state, days active, routine window, leave-by time, assigned family members, tasks, route/list links, and display theme. Include edit controls that feel native to mobile: segmented controls, switches, compact rows, and clear save state. Style should be premium black, charcoal, ivory, and warm amber, with no playful clipart. Lower-right provenance label: image-e314d861-routine-detail-2026-05-10.
```

## 6. Routine Library

```text
Design the Fam Frame mobile Routine Library screen. Show searchable routine cards grouped by active, seasonal, and paused. Each card should show days, window, task count, display theme, and whether it contributes to the TV dashboard. Include a plus action for creating a new routine. Keep it dense but quiet, with the rich black dashboard brand and refined amber accents. Lower-right provenance label: image-cea1fdbe-routine-library-2026-05-10.
```

## 7. Display Targets

```text
Design the Fam Frame mobile Displays screen. Show display targets for a family: Living Room TV, Family Room TV, Kitchen iPad. Each target should show surface type, room, current mode, last published state, and a preview route such as /dashboard/?family=...&device=.... Include controls to switch active target and preview what the TV sees. Use a premium black control-room aesthetic with warm ivory and gold. Lower-right provenance label: image-2c7622a5-display-targets-2026-05-10.
```

## 8. Publish And Sync

```text
Design the Fam Frame mobile Publish and Sync screen. Show a clear safe-data boundary: local secrets stay on device, public JSON/content files are published to GitHub, TV reads only safe derived data. Include status rows for config, routines, content, and dashboard preview. Include a single primary "Publish safe update" action and a compact recent sync history. Rich black, classy, calm, no scary warning styling unless there is an error. Lower-right provenance label: image-b73c15df-publish-and-sync-2026-05-10.
```

## 9. Super Admin Testing View

```text
Design the Fam Frame mobile Super Admin testing screen. Show account role, family picker, display picker, generated dashboard URL, and quick buttons to open the TV route for different family/device combinations. This is a private testing utility inside the admin, so it should be compact and precise. Use the rich black Fam Frame style with amber status indicators and refined technical details. Lower-right provenance label: image-400afc23-super-admin-testing-view-2026-05-10.
```

## 10. System Model

```text
Design the Fam Frame mobile System screen. Show source-of-truth status for identity.json, routines.json, display.json, routes.json, modules.json, messages.md, and quotes.md. Include schema version, loaded counts, and any config load issue. Make it feel like an elegant diagnostics panel for a family dashboard, not a developer console. Use black, charcoal, ivory, restrained gold, and clear status chips. Lower-right provenance label: image-47b57612-system-model-2026-05-10.
```

## 11. Mobile Flow Board

```text
Create a single image showing a mobile app flow board for Fam Frame admin. Include six iPhone screens side by side: Login/Family Switcher, Today Command Center, Quick Capture, Routine Detail, Display Targets, Publish and Sync. Use consistent rich black Fam Frame branding, warm ivory text, amber accents, and classy household-dashboard visual language. The screens should look production-grade and suitable for recreating in FigJam. Lower-right provenance label: image-e5056fac-mobile-flow-board-2026-05-10.
```

## 12. Design System Sheet

```text
Create a mobile UI design system sheet for Fam Frame admin. Show color palette, typography hierarchy, buttons, switches, segmented controls, cards, status chips, form fields, bottom tab bar, routine cards, display target rows, and sync status rows. Brand direction: rich black and charcoal, warm ivory, amber/gold accent, premium living-room dashboard, understated and practical. No generic SaaS blue, no beige-dominant palette. Lower-right provenance label: image-87602039-design-system-sheet-2026-05-10.
```
