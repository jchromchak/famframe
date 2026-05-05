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
