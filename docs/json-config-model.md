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
