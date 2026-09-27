# MAGNET V5.6.0

## Geri tuşu, İngilizce, Günün Bölümü, geri bildirim, değerlendirme
- Android geri tuşu artık JS'e devrediliyor (`window.MAGNET_BACK()`): açık pencereleri sırayla kapatır, sonra "Çıkılsın mı?" onayı sorar; onaydan sonra uygulamadan çıkar. Native `onBackPressed()` yalnızca JS yanıt vermezse devreye girer.
- Tam İngilizce arayüz: telefon diline göre otomatik seçim (TR/EN), Ayarlar'dan manuel değiştirme (`langBtn`), tüm metinler `I18N` sözlüğü üzerinden.
- Günün Bölümü: her gün mevcut 100 bölümden biri seçilip aynalanarak yeni bir düzen gibi sunulur (tarihten türetilen sabit tohum, deterministik); ardışık gün serisi ayrı olarak tutulur.
- Geri bildirim: Ayarlar'dan tek dokunuşla e-posta ile geri bildirim gönderme (native `ACTION_SENDTO` intent, web'de `mailto:` yedeği).
- Uygulama içi değerlendirme: belirli bölümler ilk kez tamamlandığında Google Play'in resmi In-App Review akışı tetiklenir (`com.google.android.play:review:2.0.2`); değerlendirme diyaloğunun gösterilip gösterilmeyeceğine tamamen Play Store karar verir.
- QA: `tools/smoke_test.js` dört yeni otomatik kontrolle genişletildi (geri tuşu akışı, 400 günlük Günün Bölümü geçerliliği/determinizmi, i18n anahtar tamlığı, İngilizce otomatik algılama).
- Belgeler: gizlilik politikası (TR/EN) ve Data Safety taslağı yeni e-posta/geri bildirim akışını yansıtacak şekilde güncellendi.

# MAGNET V5.5.0

## Play Store hazırlığı
- Release imzası: `android/app/build.gradle` yükleme anahtarını CircleCI ortam değişkenlerinden veya `android/keystore.properties`'ten okur (repoda anahtar yok).
- CircleCI: değişkenler tanımlıysa `bundleRelease` → `release/app-release.aab`; debug anahtarıyla imzalanmışsa build başarısız olur. Değişkenler yoksa adım atlanır.
- `tools/create_upload_key.sh`: Termux'ta yükleme anahtarı + CircleCI değerleri.
- Gizlilik politikası TR/EN yeniden yazıldı (veri toplanmıyor, internet izni yok, iletişim e-postası, koyu mod).
- Mağaza: TR metin (80 karakter sınırına uygun), EN metin (çeviri sonrası), Data Safety ve IARC yanıtları, `icon-512.png`, `feature-graphic-1024x500.png`, 6 adet 1080×1920 ekran görüntüsü.
- Oyun: reklam SDK'sı yokken Günlük Ödül butonu gizlenir (`MAGNET_ADS.rewardedAvailable()`); menü başlığı hizalaması düzeltildi.
- Belgeler: `PLAY_STORE_LAUNCH.md`, `RELEASE_SIGNING.md`.

# MAGNET V5.4.4

## Uygulama ikonu
- Adaptive launcher ikonu (vektör): koyu zemin, manyetik alan halkaları, N/S mıknatıs, gümüş çekirdek. `mipmap-anydpi-v26` (Android 8+) ve `mipmap` (Android 6–7) yedeği.
- Mağaza ikonu: `store/icon-512.png` (kaynak: `store/icon.svg`).

## Sabit debug imzası
- `android/app/debug.keystore` repoya eklendi ve debug build'de kullanılıyor. CircleCI her build'de yeni rastgele debug anahtarı üretmediği için yeni APK eskisinin üzerine kurulur, ilerleme korunur.
- Bu anahtar yalnızca debug içindir; Play Store için ayrı, gizli bir release anahtarı gerekir.

## Temizlik
- Eskimiş `web/README-v3.md` (Energy sistemi anlatan v3 prototip notu) ve bozuk `android/gradlew.bat` kaldırıldı.

# MAGNET V5.4.3

## Arayüz
- Ayarlar başlığındaki sabit "MAGNET 5.2.0" yerine `RELEASE_VERSION` gösteriliyor.
- Üst bardaki yıldızlar her zaman ☆☆☆ yerine mevcut bölümde kazanılan en iyi yıldızları gösteriyor.
- V5.4.2 cihazda açılış doğrulandı (fiziksel Android cihaz, oyun, menü ve ayarlar çalışıyor).

# MAGNET V5.4.2

## Android çökme teşhisi ve sağlamlaştırma
- Cihazda "MAGNET sürekli olarak duruyor" (native çökme) raporu üzerine:
- `MagnetApp` (Application) global çökme yakalayıcı kurar; stack trace `files/last_crash.txt`'ye yazılır.
- `MainActivity` bir sonraki açılışta raporu yerel bir hata ekranında gösterir (KOPYALA, TEKRAR DENE) — adb gerekmez.
- WebView oluşturma try/catch içinde; WebView yoksa/devre dışıysa çökme yerine açıklayıcı hata ekranı.
- Renderer çökmesinde tek yeniden deneme, sonra hata ekranı (sonsuz recreate döngüsü yok).
- Kaldırılan riskli çağrılar: `requestWindowFeature`, zorunlu `LAYER_TYPE_HARDWARE`, `setDecorFitsSystemWindows`, `setDatabaseEnabled`, `setContentView` öncesi insets çağrıları.
- Tema: kanonik `@android:style/Theme.Material.NoActionBar` parent, geçersiz `fontFamily=sans` kaldırıldı.
- CI: APK dex içinde `MainActivity` ve `MagnetApp` sınıfları doğrulanır; `aapt2 dump badging` çıktısı loglanır.

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
