# Sleep State Behavior

Fam Frame sleep state should reduce image-retention risk without turning the TV into an animated screen saver. The display should still feel like a quiet household object.

## Goals

- Reduce long-running static pixels during art/idle periods.
- Keep movement below the threshold of distraction in a room.
- Preserve the current dashboard's calm, editorial feel.
- Avoid motion that could be perceived as broken layout, flicker, or attention seeking.
- Give real-device testing a clear escalation path if retention appears.

## States

### Active Routine

Morning, pickup, evening, and weekend scenes may contain static hierarchy because they are time-bounded and useful. The runtime should still avoid bright large blocks and high-contrast permanent lines.

Allowed mitigation:

- existing subtle noise overlay
- low-opacity progress and divider lines
- future 1-2px whole-stage drift at long intervals

Avoid:

- noticeable content panning
- moving individual routine text while the family is reading it
- animated decorative accents

### Idle Art

The current `art` scene is the primary sleep surface. It should be dimmer and more mobile than active routine scenes.

Allowed mitigation:

- dimmed typography
- very slow background texture drift
- whole-stage drift of 1-2px every 5-10 minutes
- slight clock/date position variation within a safe central region
- optional quote/message rotation if text is shown later

Avoid:

- full-screen bright art blocks
- fast gradients
- bouncing, marquee, pulse-heavy, or game-like motion
- high-contrast static icons
- visible movement cadence that makes the room feel busy

### Deep Sleep

If the family wants the TV to be nearly invisible at night, deep sleep can become a darker variant of idle art.

Allowed mitigation:

- background near-black or theme-derived deep tone
- clock hidden or very dim
- date hidden
- lower texture opacity
- same slow whole-stage drift

Deep sleep is a future mode. Do not add it before the admin/runtime has a clear setting for night behavior.

## Motion Contract

Initial implementation should use three layers:

1. `sleep-dim`: lower opacity of nonessential text and chrome in `art` mode.
2. `texture-drift`: animate the existing noise/texture background slowly over several minutes.
3. `stage-drift`: shift the full stage by no more than 2px every 5-10 minutes.

The first implementation should affect only `art` mode unless real-device testing shows that active scenes are retained after long use.

## Timing Defaults

- Enter `art` mode when no routine scene is active, as the dashboard already does.
- Apply sleep mitigation immediately when `art` mode is active.
- Use stage drift every 5 minutes by default.
- Use texture drift over a 6-10 minute loop.
- Avoid synchronized loops that snap back visibly.

## Theme Interaction

Sleep behavior should reuse the active theme tokens:

- Default Editorial should dim toward the current near-black background.
- Ambient Evening should keep its periwinkle character but reduce contrast during idle.
- Future custom backgrounds should derive a sleep-safe low-brightness variant rather than using raw custom color at full intensity overnight.

## Burn-In Escalation

If real-device testing shows retention, escalate in this order:

1. Increase art-mode dimming.
2. Increase whole-stage drift range to 3px.
3. Add slow position variation for the clock/date group.
4. Rotate between two or three quiet art layouts.
5. Add a deep-sleep mode that hides almost all text overnight.

Do not start with layout rotation or hidden text. They make the product feel less stable and should be a response to observed panel behavior.

## Verification

Before implementation is considered done:

- Capture desktop and Frame-TV-sized screenshots of `art` mode.
- Verify no text overlaps or jumps during drift.
- Verify motion is not noticeable over a short watch but changes pixels over several minutes.
- Test Default and Ambient Evening.
- Verify active routine scenes remain readable and visually stable.
