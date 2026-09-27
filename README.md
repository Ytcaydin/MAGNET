# MAGNET v5.6.0

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
- V5.4.1 Açılış hatası düzeltmesi — oyun açılışta çöküyordu (`RELEASE_VERSION` tanımlanmadan kullanılıyordu), menü/ipucu butonları çalışmıyordu (`renderMenu`/`toast` eksikti), ilerleme her açılışta siliniyordu. CI'a Node tabanlı runtime smoke test eklendi.
- V5.4.2 Android çökme teşhisi — uygulama çökerse hata raporu bir sonraki açılışta ekranda gösterilir (KOPYALA / TEKRAR DENE); WebView güvenli başlatılır; riskli pencere ayarları kaldırıldı. Cihazda açılış doğrulandı.
- V5.4.3 Arayüz düzeltmeleri — Ayarlar başlığı gerçek sürümü gösterir; üst bardaki yıldızlar mevcut bölümde kazanılanları gösterir.
- V5.4.4 Uygulama ikonu ve sabit debug imzası — N/S mıknatıs + çekirdek adaptive ikon (Android 8+ ve eski sürümler), 512×512 mağaza ikonu (`store/icon-512.png`); CircleCI APK'ları artık birbirinin üzerine kurulabilir.
- V5.5.0 Play Store hazırlığı — imzalı release AAB hattı (CircleCI, gizli değişkenlerle), gizlilik politikası TR/EN, mağaza metinleri, 1024×500 öne çıkan görsel, 6 ekran görüntüsü, Data Safety ve içerik derecelendirme yanıtları. Yol haritası: `PLAY_STORE_LAUNCH.md`.
- V5.6.0 Geri tuşu + İngilizce + Günün Bölümü + geri bildirim + değerlendirme — Android geri tuşu artık pencereleri sırayla kapatıp en son çıkış onayı soruyor; oyun arayüzü Türkçe/İngilizce arasında otomatik algılama ve manuel seçimle çalışıyor; her gün mevcut bölümlerden biri yeniden karılıp "Günün Bölümü" olarak sunuluyor, seri sayacıyla; Ayarlar'dan e-posta ile geri bildirim gönderilebiliyor; Play Store'un uygulama içi değerlendirme akışı belirli bölümlerden sonra tetikleniyor. CI'daki runtime smoke test bu dört özelliği de otomatik doğruluyor.

## Kontrol standardı
Her sürümden önce preflight; ardından en az iki bağımsız QA turu. Hata çıkarsa sürüm sunulmaz.

## Oynanış
Basılı tut → mıknatısı hareket ettir → çekirdeği hedefe ulaştır.

## Play Store
Adım adım yayın planı `PLAY_STORE_LAUNCH.md`, imzalama `RELEASE_SIGNING.md`, mağaza dosyaları `store/` klasöründe.

## Android build
Termux:

```sh
cd android
./gradlew :app:assembleDebug
```

CircleCI aynı launcher üzerinden APK üretir ve artifact olarak saklar. Ayrıntılar `android/ANDROID_BUILD.md` içindedir.
