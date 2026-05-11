# famframe
your family's living room dashboard

## Project memory

This public repository contains the Fam Frame app code and safe sample/config data only.

Private project context memory, planning notes, risks, decisions, and strategy live in the private companion repository:

- `github.com/jchromchak/famframe-private`

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
- the TV dashboard reads safe JSON/content files only
- commute data in the repo should be derived values such as duration, status, labels, and timestamps

Future phase:
- Consider Cloudflare Worker or another edge proxy for Maps and write operations.

## JSON config foundation

The first JSON model files live in:

- `config/family.json`
- `config/identity.json`
- `config/routines.json`
- `config/routes.json`
- `config/display.json`
- `config/scenes.json`
- `config/modules.json`
- `content/messages.md`
- `content/quotes.md`

The TV dashboard and admin now use these files as the source of truth.

The legacy admin in `admin/` remains the current editor. A React admin shell is being prototyped in `admin-react/` beside it so the new information architecture can evolve without breaking the working admin.

`admin-next/` is a generated static snapshot of the React admin for lightweight phone testing after a push. Treat `admin-react/` as the source and refresh the snapshot with:

```sh
cd admin-react
npm run publish:preview
```

Before pushing React admin changes, run:

```sh
cd admin-react
npm run verify
```


`config/family.json` includes a stable family primary key:

```json
{
  "familyId": "fam-fe794623"
}
```

See `docs/json-config-model.md` for the model boundary and migration plan.

`config/identity.json` contains public-safe account, family, membership, member, and device target records for the React admin prototype. It is not authentication.

## Routine model direction

The admin app is moving toward a routine model built from:
- family members and a shared home base
- daily routines with weekday or specific-day overrides
- itinerary segments with a destination, optional stops, and per-stop buffer minutes
- list templates that can be adopted by segments and assigned to family members

Route addresses and private Places details should stay local to the admin app. The repo may store safe display data such as `routeLabel`, `stopCount`, derived commute duration, traffic status, freshness timestamps, and weather coordinates.
