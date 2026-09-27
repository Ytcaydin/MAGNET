# Android Build Status — V5.5.0

Portrait WebView game, Android API 35 (minSdk 23), no internet permission, no third-party SDKs.

## Verified
- CircleCI builds the debug APK on every push (`MAGNET-debug.apk` artifact), after static + runtime QA
  (`tools/verify_release.py`, `tools/smoke_test.js`) and APK content checks.
- V5.4.2 debug APK installed and played on a physical Android device (game, menu, settings working).

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
