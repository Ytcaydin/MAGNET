# MAGNET v5.4.0

Tek parmakla manyetik fizik bulmacası.

## Release train
- V2.6 Physics 2.0 — momentum transferi, release feedback, manyetik his.
- V2.7 Gameplay Feedback — impact/target/win feedback.
- V2.8 World Presentation — dünya bazlı görsel sunum altyapısı.
- V2.9 Puzzle Mechanics 2.0 — güvenli bumper/bounce mekaniği.
- V3.0 Progression 2.0 — yıldız, skin, günlük ödül ve yerel ilerleme.
- V3.1 Visual Polish — alan, çekirdek ve feedback polish.
- V3.2 Audio & Haptics — olay bazlı ses/titreşim.
- V3.3 Hint System 2.0 — engel farkındalığı olan ipucu.
- V3.4 Mobile UX — safe-area, visibility pause ve offline davranış.
- V3.5 Monetization hooks — reklam SDK'sı olmadan güvenli entegrasyon noktaları.
- V3.6 Analytics — yalnızca yerel, gizlilik dostu olay sayaçları.
- V3.7 Playtest Build — diagnostics ve QA kapısı.
- V3.8 Bug Fix / Optimization — performans ve hata sertleştirme.
- V3.9 Store Preparation — mağaza metadatası ve gizlilik metni.
- V4.0 Release Candidate — release gate.
- V4.1 Global Launch prep — İngilizce store copy ve sürüm bilgileri.
- V4.2 Live Update foundation — sonraki içerik güncellemeleri için sürüm altyapısı.
- V5.0 Rewarded daily reward — günde bir kez tamamlanan rewarded ad sonrası +3 bonus yıldız.
- V5.1 Playtest tuning — yerel bölüm telemetry ve hotspot analizi.
- V5.2 Android device preparation — portrait WebView, immersive UI ve cihaz uyumluluğu.
- V5.3 CI build preparation — Android build pipeline hazırlığı.
- V5.4 Termux + CircleCI build path — Gradle 8.10.2 pinleme, CircleCI artifact build ve ortak `./gradlew` komutu.

## Kontrol standardı
Her sürümden önce preflight; ardından en az iki bağımsız QA turu. Hata çıkarsa sürüm sunulmaz.

## Oynanış
Basılı tut → mıknatısı hareket ettir → çekirdeği hedefe ulaştır.

## Android build
Termux:

```sh
cd android
./gradlew :app:assembleDebug
```

CircleCI aynı launcher üzerinden APK üretir ve artifact olarak saklar. Ayrıntılar `android/ANDROID_BUILD.md` içindedir.
