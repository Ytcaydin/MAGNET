# Android Build Status — V5.6.0

Portrait WebView game, Android API 35 (minSdk 23), no internet permission. One first-party
dependency: Google Play's In-App Review library (`com.google.android.play:review:2.0.2`),
used only for the native review-prompt flow (no ads/analytics SDK).

## Verified
- CircleCI builds the debug APK on every push (`MAGNET-debug.apk` artifact), after static + runtime QA
  (`tools/verify_release.py`, `tools/smoke_test.js`) and APK content checks.
- V5.4.2 debug APK installed and played on a physical Android device (game, menu, settings working).
- V5.6.0 web/index.html verified end-to-end in headless Chromium (back button, TR/EN switching,
  Günün Bölümü + seri, feedback e-postası, review tetikleme) and in the automated `tools/smoke_test.js`
  suite (back-button contract, 400-day daily-level determinism/geometry, i18n key completeness,
  English auto-detect). `MainActivity.java`/`MagnetApp.java` compiled cleanly against a local Android
  API stub set (no real SDK available in this environment) — a real device/CI build is still the
  authoritative check.

## Build paths
- CircleCI: `.circleci/config.yml`, Android machine image, `./gradlew :app:assembleDebug`.
- Termux/Linux: `cd android && ./gradlew :app:assembleDebug`.
- Pinned Gradle 8.10.2 via self-bootstrapping `android/gradlew` (no binary wrapper JAR in the repo).
- Debug APK is signed with the committed debug-only key (`android/app/debug.keystore`) so new builds install over old ones.

## Release AAB
- Built by CircleCI only when the upload-key environment variables are configured (see `RELEASE_SIGNING.md`).
- Not yet built: the upload key has not been created/configured.

## Pending
- Device QA of the latest build per `DEVICE_QA.md`.
- Signed AAB and Play Console steps per `PLAY_STORE_LAUNCH.md`.
