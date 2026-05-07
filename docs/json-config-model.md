# JSON Config Model

This is the foundation-stage model for the upcoming move away from editing `dashboard-config.js` directly.

For now, `dashboard-config.js` remains the TV dashboard compatibility source. The JSON files are the cleaner source model for the admin refactor and future generated safe dashboard output.

## Files

- `/config/family.json`: family identity, `familyId`, members, home display facts, and time zone.
- `/config/routines.json`: routines, routine layers, timing, display scene hints, and reusable lists.
- `/config/routes.json`: safe route labels, stop labels, per-stop buffers, fallback drive estimates, and safe derived route data.
- `/config/display.json`: TV runtime, scene, time, and theme display settings.
- `/config/modules.json`: feature/module settings for weather, calendar, quotes, and commute.
- `/content/messages.md`: human-authored message pools.
- `/content/quotes.md`: local quote fallbacks.

## Family ID

`family.json` includes a stable primary key:

```json
{
  "familyId": "fam-fe794623"
}
```

The format is `fam-[random 8char lowercase hex]`.

## Security Boundary

Repo-readable JSON must not contain:

- GitHub PATs
- Maps API keys
- Calendar API keys
- raw addresses for private stops
- raw family notes or adult-only context

The admin app may keep credentials and local-only route places in browser-local storage for the personal MVP. The TV receives safe display config and derived values only.

## Migration Plan

1. Define and review the JSON model.
2. Add clean JSON seed files.
3. Add a compatibility adapter that maps JSON to the current dashboard config shape.
4. Move admin reads/writes to JSON first.
5. Keep generating or preserving `dashboard-config.js` for the TV.
6. Migrate the dashboard to safe JSON only after compatibility output is proven.

## Compatibility Adapter

The pure adapter lives in `/config/dashboard-adapter.js`.

It accepts already-loaded JSON/content values and returns the current dashboard-compatible object shape. It deliberately ignores secrets, raw route addresses, and any admin-local place details.

Run the local comparison helper with:

```sh
node scripts/compare-dashboard-adapter.js
```

This script compares a summary of adapter output against the checked-in `dashboard-config.js`. The seed JSON is cleaner and smaller than the live compatibility file, so the expected comparison is structural parity, not identical content.

## Admin Bridge

The admin now keeps a local JSON-shaped source snapshot in browser localStorage under `fam_frame_json_model`. The existing admin UI still renders through the dashboard-compatible object, but saves synchronize that object into the JSON model and GitHub dashboard output is generated from the JSON model through the adapter.

GitHub sync now understands the JSON file set:

- `config/family.json`
- `config/routines.json`
- `config/routes.json`
- `config/display.json`
- `config/modules.json`
- `content/messages.md`
- `content/quotes.md`

Pull tries those JSON/content files first and falls back to `dashboard-config.js` if JSON files are unavailable. Save writes the JSON/content files plus generated `dashboard-config.js` for the TV in one Git commit using the Git tree/commit/ref API.

This is still a compatibility phase. The TV dashboard continues to read `dashboard-config.js`.

## Route Refresh Workflow

Route refresh is now explicit. Normal config saves do not call Maps automatically. The admin's top-level **Refresh all route maps** action:

1. Finds enabled departure routines with complete local origin, destination, and stop place data.
2. Refreshes each eligible route's safe derived commute output.
3. Skips incomplete routes with a user-visible message.
4. Saves the refreshed JSON/content files and generated `dashboard-config.js` as one Git commit.

Per-route refresh controls can remain as diagnostics, but the preferred workflow is the top-level route refresh before a dashboard check.

## Routine Layers

See `/docs/routine-layering-model.md` for the routine inheritance model. The short version: the JSON source can evolve through `baseline`, `pattern`, `override`, and `addon` layers, but the TV continues to receive only resolved, display-safe routine output.

## Dynamic Routine Windows

See `/docs/dynamic-routine-windows.md` for the display-window policy. Explicit routine windows are preserved. Missing windows, or windows marked with `"mode": "auto"`, can be derived from routine timing before dashboard compatibility output is generated.

## Theme Model

See `/docs/theme-model.md` for the lightweight theme contract. The short version: `display.theme.id` selects a built-in theme such as `default-editorial` or `ambient-evening`; optional custom backgrounds should derive readable text, divider, surface, and accent tokens rather than exposing disconnected color settings.

## Sleep State

See `/docs/sleep-state-behavior.md` for the burn-in-safe idle/art policy. The short version: sleep mitigation should start in `art` mode with dimming, very slow texture drift, and tiny whole-stage drift, while active routine scenes remain visually stable.
