# MAGNET — Agent / QA Rules

## Mandatory release gate
Every project update MUST pass at least two independent checks before it is presented as a new release.

### Check 1 — Structural / syntax
- JavaScript syntax must pass `node --check` on the extracted script.
- All `$()` DOM references must point to an existing HTML `id`.
- No duplicate HTML IDs.
- Web and Android `index.html` copies must be byte-identical.
- Android `versionCode` / `versionName` must match the release notes.

### Check 2 — Semantic / runtime-data
- 100 level definitions must generate successfully.
- Start/target coordinates and obstacle rectangles must remain inside normalized bounds.
- Required core functions and controls must exist.
- Critical button IDs must match their event handlers.
- ZIP contents must be readable and complete.

## Release policy
- If either check fails, do not present the release as ready.
- Fix the issue, then rerun both checks.
- After a fix, both checks must pass again.
- Never claim an APK build unless an actual APK was built and verified.
- Keep web and Android game assets synchronized.

## Product rules
- MAGNET remains one-finger first.
- Avoid adding complexity that does not improve the core physics puzzle.
- No forced ads in the core loop.
- Prefer short, readable levels and progressive teaching.


## V2.3 release-specific checks
- Startup order must define `levelQA` before any runtime reference to it.
- Physics polish must not introduce a second control mode or an Energy mechanic.
- Release/impact effects are visual/audio feedback only and must not alter level solvability.


## V2.4 release-specific checks
- Worlds 2–5 must use controlled level-design families, not a single monotonic difficulty formula.
- Level milestones 21/41/61/81 must introduce the dominant world mechanic.
- Multi-core levels remain confined to the late Master world.
- Level geometry must stay within normalized bounds and retain one-finger controls.


## V2.5 release-specific checks
- First 10 levels must retain progressive tutorial messaging without adding a second control mode.
- Tutorial timers must stop being actionable after first user movement, level completion, or restart.
- Gesture feedback is UI-only and must not affect physics, move counting, or solvability.
- Result-screen next-level label must match the actual next level.


## V2.6-V4.2 release-train rules
- Before every update, run a preflight scan for missing features, stale references, syntax errors, and configuration drift.
- Physics updates must preserve one-finger control and level solvability.
- Feedback effects must remain non-blocking and non-essential to solving.
- New mechanics must be bounded and validated against all 100 levels.
- Analytics must remain local unless a future explicit backend is added.
- Monetization code must remain a hook/placeholder until a real SDK is intentionally integrated.
- Visibility changes pause simulation and reset frame timing to avoid physics jumps.
- Store claims must distinguish prepared metadata from a published listing.
- Release candidate is not a built APK unless an actual APK file is produced and verified.

## V4.5 release-specific checks
- Playtest mode must be opt-in and visibly labeled.
- Exported diagnostics must contain only local gameplay telemetry; no personal data.
- `level_complete` must increment only on actual completion; retries must not count as new level starts.
- No network/backend analytics may be introduced implicitly.

## V4.6 release-specific checks
- Rewarded ads must never be simulated as completed when no SDK is connected.
- Premium state must not be granted by a UI placeholder.
- Local star rewards must remain deterministic and offline.
- Monetization hooks must expose availability explicitly.


## V4.7 release-specific checks
- Premium purchase/subscription UI and state must not exist.
- Ads are eligible only after completed levels divisible by 5.
- No ad on retries, restarts, hints, or inside an active level.
- If no real ad SDK is connected, never simulate an ad impression or reward.
- Ad integration must remain isolated behind `window.MAGNET_ADS`.


## V5.0 monetization rule
- Premium/billing/satın alma akışı yasaktır.
- Günlük ödül yalnızca rewarded ad tamamlandığında verilir; reklam tamamlanmazsa ödül verilmez.
- Günlük ödül günde 1 kez, +3 bonus yıldızdır.
- Interstitial reklam yalnızca her 5 tamamlanan bölümde bir uygundur.

## V5.1 playtest tuning rule
- Level tuning telemetry remains local-only and contains no personal data.
- Track per-level starts, retries, completions, best moves, and last stars for playtest diagnosis.
- Export must expose level hotspots without claiming real-player data when none exists.
- Daily rewarded +3 and 5-level interstitial policies remain unchanged.
