# Private Tribute Image Workflow

Tribute images are private family media. They should live in the private companion repo, not in public `config/` or `content/`.

Current local asset folder:

```text
/Users/johnchromchak/projects/famframe-private/assets/tributes/
```

The fallback admin can save a selected tribute image path, tone, title, and message into browser `localStorage`:

- `fam_frame_tribute_image`
- `fam_frame_tribute_tone`
- `fam_frame_tribute_title`
- `fam_frame_tribute_message`
- `fam_frame_tribute_mark`
- `fam_frame_tribute_uploaded_image`
- `fam_frame_tribute_force_override`

The TV dashboard reads those local values when `?scene=tribute` is active. This keeps personal photo paths and family images out of the public JSON sync flow.

There are two supported quick-update paths:

- Private repo path: use this on the Mac where `famframe` and `famframe-private` are sibling folders. These paths will not load from a hosted public dashboard or from a phone browser.
- Upload from this device: use this for phone/browser preview. The admin resizes the selected photo and stores it only in that browser's local storage, then the dashboard reads it locally.

Special-day screens use the same tribute scene. The admin currently includes presets for Mother's Day 2026 and Arthur's birthday on May 11, 2026. The override checkbox controls whether this browser sets `fam_frame_force_scene=tribute`; Preview still opens the tribute scene even when the persistent override is off.

Time fences live in two layers:

- Fallback display windows: admin > Home > Minimal display fallback > Wake display, Morning standby, Evening display, Evening standby.
- Routine windows: the JSON-backed routine definitions in `config/routines.json`, surfaced through the routine editor. The dashboard resolves active routines first, then falls back to the broad display windows.

Tone choices:

- `dark`: warm ivory text over a darkened image.
- `light`: charcoal text over a light image with a pale scrim.
- `auto`: samples the text area of the selected image and chooses light or dark text.

Future opportunities:

- Add a true private-repo upload action from the React admin.
- Generate thumbnails or a private manifest from the private repo instead of hardcoding local choices.
- Add per-device tribute selection for multiple displays.
- Add scheduled tribute windows, such as holidays or birthdays, without turning private images into public config.
- Move larger browser uploads from `localStorage` to IndexedDB if full-resolution family photos become a common workflow.
