# Android Build Status — V5.4.3

The Android project is configured for a portrait WebView game on Android API 35, with immersive system-bar handling, hardware-accelerated WebView rendering, local storage, pause/resume hooks, and the V5.4.3 game asset synchronized with the web build.

This packaging workspace does not contain the Android SDK or a system Gradle installation. V5.4.3 therefore does not claim a locally built APK.

## V5.4.3 build path

- Termux/Linux: `cd android && ./gradlew :app:assembleDebug`
- CircleCI: `.circleci/config.yml` uses the Android machine image and runs the same `./gradlew` launcher.
- Pinned Gradle distribution: 8.10.2 (`gradle/wrapper/gradle-wrapper.properties`).
- APK output: `android/app/build/outputs/apk/debug/app-debug.apk`

The launcher is a self-bootstrapping Gradle launcher rather than a checked-in `gradle-wrapper.jar`, because the packaging environment cannot generate or fetch binary wrapper artifacts. It still pins the exact Gradle distribution and caches it locally.

After building, install the APK on a physical Android device and complete `DEVICE_QA.md` before calling device QA complete.
