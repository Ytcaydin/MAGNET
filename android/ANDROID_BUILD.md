# MAGNET Android Build — V5.4.4

## Termux

```sh
cd android
./gradlew :app:assembleDebug
```

The project bootstraps the pinned Gradle distribution from `gradle/wrapper/gradle-wrapper.properties` (Gradle 8.10.2) and caches it under `~/.gradle`.

APK output:

`android/app/build/outputs/apk/debug/app-debug.apk`

## CircleCI

CircleCI uses the Android machine image and runs the same `./gradlew` command. The pipeline performs static QA, builds the debug APK, verifies the APK is non-empty, calculates its SHA-256, and stores the APK as a CircleCI artifact.

No GitHub Actions workflow is required for V5.4.4.

> Note: this repository uses a small self-bootstrapping `gradlew` launcher rather than a checked-in `gradle-wrapper.jar`, because the current packaging environment cannot generate the binary wrapper JAR. It still pins and caches the exact Gradle distribution through `gradle-wrapper.properties`.
