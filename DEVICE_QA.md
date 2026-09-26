# Device QA — V4.5

## Required manual tests
- Cold start and warm start
- First 10 tutorial levels
- One-finger drag at screen edges
- Fast drag + release
- Android back button from each overlay
- Background/foreground transition during play
- Background/foreground during result screen
- Save/restore after force-close
- Audio toggle and vibration toggle
- 16:9, 20:9 and tall displays
- Long session (30+ minutes)
- Low-memory reopen
- Level 1 through 100 navigation

A device test is not considered passed until an actual APK/AAB has been installed and exercised on a physical Android device.

## V4.5 Playtest checks
- Enable playtest with `?playtest=1`.
- Confirm PLAYTEST badge appears.
- Settings > Playtest verisi > DIŞA AKTAR produces JSON.
- Confirm retry does not increment level-start count.
- Confirm level completion increments exactly once.
