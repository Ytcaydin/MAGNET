# MAGNET V5.4.1

## Hotfix — oyun açılmıyordu
- **Açılış çökmesi:** `startSoftLaunchSession()` açılışta `const RELEASE_VERSION` tanımından önce çağrılıyordu → `ReferenceError`, script duruyordu ve oyun başlamıyordu. Sabit, script başına taşındı; değeri versionName ile eşitlendi (5.4.1).
- **Menü butonu:** `renderMenu()` tanımlı değildi → menü açılmıyordu. Eklendi.
- **Bildirimler:** `toast()` tanımlı değildi → ipucu, günlük ödül, koleksiyon butonları hata veriyordu. Eklendi.
- **İlerleme kaybı:** Oturum başlangıcı `restore()`'dan önce `save()` çağırıyordu → her açılışta kayıt sıfırlanıyordu. Oturum artık kayıt geri yüklendikten sonra başlıyor.
- **Android:** JS konsolu logcat'e yönlendirildi (`adb logcat -s MAGNET`), WebView renderer çökmesinde uygulama kendini yeniden oluşturuyor, API 27 stil özelliği `values-v27`'ye taşındı, `android/.gradle` önbelleği repodan çıkarıldı.
- **CI:** `tools/smoke_test.js` oyunu sahte tarayıcı ortamında başlatır, tüm butonlara basar, 100 bölümü yükler, kazanma ve kayıt/geri yükleme akışını test eder. APK içindeki `assets/index.html` web sürümüyle karşılaştırılır.


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
