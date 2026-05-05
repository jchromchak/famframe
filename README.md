# famframe
your family's living room dashboard

## Security model

Fam Frame uses a display-only TV dashboard and a privileged mobile config manager.

The TV dashboard must never receive secrets. It only reads safe display config and derived data.

The mobile app may hold credentials locally for a personal MVP:
- GitHub fine-grained PAT
- optional Maps API key
- optional Calendar API key

The mobile app performs privileged work, writes safe derived data to the repo, and the TV renders that data.

Do not commit:
- GitHub PATs
- Maps API keys
- Calendar API keys
- Any token-like values

Current MVP credential storage:
- credentials live in the browser's localStorage on the admin device only
- `dashboard-config.js` is safe display data only
- commute data in the repo should be derived values such as duration, status, labels, and timestamps

Future phase:
- Move from `dashboard-config.js` to JSON config files.
- Consider Cloudflare Worker or another edge proxy for Maps and write operations.

## Routine model direction

The admin app is moving toward a routine model built from:
- family members and a shared home base
- daily routines with weekday or specific-day overrides
- itinerary segments with a destination, optional stops, and per-stop buffer minutes
- list templates that can be adopted by segments and assigned to family members

Until the JSON migration is complete, `dashboard-config.js` remains the compatibility layer. Route addresses and private Places details should stay local to the admin app. The repo may store safe display data such as `routeLabel`, `stopCount`, derived commute duration, traffic status, and freshness timestamps.
