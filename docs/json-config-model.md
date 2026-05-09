# JSON Config Model

This is the safe config model for Fam Frame.

The TV dashboard reads these JSON/content files directly through `/config/dashboard-adapter.js`. `dashboard-config.js` is no longer the runtime source.

## Files

- `/config/family.json`: family identity, `familyId`, members, home display facts, and time zone.
- `/config/identity.json`: public-safe sample accounts, families, members, memberships, and device targets for the React admin identity/family flow.
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

Member and private place identifiers should also use stable opaque ids such as `mem-[random 8char lowercase hex]` and `place-[random 8char lowercase hex]`. Durable workflow/template objects can keep readable ids such as `routine-school-morning`, `routine-evening`, `breakfast`, or `dinner`; event-like generated routines/routes/lists should use readable categories with opaque suffixes, such as `routine-pickup-8f3a2c91`.

## Identity and Family Access

`identity.json` is a public-safe sample model for the React admin flow. It is not authentication.

It contains:

- `accounts`: login-shaped identities using sample `.test` email addresses.
- `families`: family records with readable handles plus opaque suffixes.
- `familyMembers`: people in a family; members may or may not have an email.
- `memberships`: links between accounts and family members, with roles of `member`, `maintainer`, `co-owner`, or `owner`.
- `deviceTargets`: display targets such as Living Room TV or Kitchen iPad.

`isSuperAdmin` lives on the account object, not on family membership. Family roles stay family-native.

## Security Boundary

Repo-readable JSON must not contain:

- GitHub PATs
- Maps API keys
- Calendar API keys
- raw addresses for private stops
- raw family notes or adult-only context

The admin app may keep credentials and local-only route places in browser-local storage for the personal MVP. The TV receives safe display config and derived values only.

## Dashboard Adapter

The pure adapter lives in `/config/dashboard-adapter.js`.

It accepts already-loaded JSON/content values and returns the dashboard's normalized runtime shape. It deliberately ignores secrets, raw route addresses, and any admin-local place details.

Run the local comparison helper with:

```sh
node scripts/compare-dashboard-adapter.js
```

This script prints the dashboard runtime summary produced from the JSON/content files.

## Admin Bridge

The admin keeps a local JSON-shaped source snapshot in browser localStorage under `fam_frame_json_model`. The existing admin UI still renders through the normalized dashboard object, but saves synchronize that object into the JSON model.

GitHub sync now understands the JSON file set:

- `config/family.json`
- `config/identity.json`
- `config/routines.json`
- `config/routes.json`
- `config/display.json`
- `config/modules.json`
- `content/messages.md`
- `content/quotes.md`

Pull and Save use only these JSON/content files. The TV dashboard reads the same safe files.

## Route Refresh Workflow

Route refresh is now explicit. Normal config saves do not call Maps automatically. The admin's top-level **Refresh all route maps** action:

1. Finds enabled departure routines with complete local origin, destination, and stop place data.
2. Refreshes each eligible route's safe derived commute output.
3. Skips incomplete routes with a user-visible message.
4. Saves the refreshed JSON/content files as one Git commit.

Per-route refresh controls can remain as diagnostics, but the preferred workflow is the top-level route refresh before a dashboard check.

## Routine Layers

See `/docs/routine-layering-model.md` for the routine inheritance model. The short version: the JSON source can evolve through `baseline`, `pattern`, `override`, and `addon` layers, but the TV should continue to receive only resolved, display-safe routine output.

Routines can be limited to a single day or set of exact days by adding `appliesTo.dates` with `YYYY-MM-DD` values. The dashboard checks `dates` before day-of-week, which allows one-time Saturday items without making them recur every Saturday.

## Dynamic Routine Windows

See `/docs/dynamic-routine-windows.md` for the display-window policy. Explicit routine windows are preserved. Missing windows, or windows marked with `"mode": "auto"`, can be derived from routine timing before dashboard output is generated.

## Theme Model

See `/docs/theme-model.md` for the lightweight theme contract. The short version: `display.theme.id` selects a built-in theme such as `default-editorial` or `ambient-evening`; optional custom backgrounds should derive readable text, divider, surface, and accent tokens rather than exposing disconnected color settings.

## Sleep State

See `/docs/sleep-state-behavior.md` for the burn-in-safe idle/art policy. The short version: sleep mitigation should start in `art` mode with dimming, very slow texture drift, and tiny whole-stage drift, while active routine scenes remain visually stable.
