# MAGNET V5.4.0

## Android build pipeline
- GitHub Actions yolu kaldırıldı.
- CircleCI `.circleci/config.yml` ile Android machine image kullanıyor.
- Android API 35 / Build Tools 35.0.0 hedefleniyor.
- Gradle dağıtımı `android/gradle/wrapper/gradle-wrapper.properties` üzerinden 8.10.2 olarak sabitleniyor.
- `android/gradlew` Termux/Linux üzerinde aynı Gradle dağıtımını bootstrap edip çalıştırıyor.
- CircleCI debug APK'yı artifact olarak saklıyor.
- APK'nın SHA-256'sı build sonunda hesaplanıyor.

## V5.1 playtest tuning
- Per-level local playtest telemetry: starts, retries, completions, best moves, last stars.
- Local tuning summary identifies unfinished levels with repeated retries as playtest hotspots.
- JSON diagnostics export includes tuning data.
- Analytics remains local-only; no backend is introduced.

## Monetization invariants
- Daily rewarded +3 stars once per local day, only after an actually completed rewarded ad.
- Interstitial eligibility remains every 5 completed levels.
- No premium/billing/purchase flow.
- No fake ad completion or reward when an ad SDK is unavailable.

## Build status
This package is build-ready but no APK is claimed as built in this packaging environment because Android SDK/Gradle are unavailable here. The intended next step is a CircleCI or Termux build followed by physical-device QA.
