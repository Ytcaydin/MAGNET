# MAGNET V5.7.2

## Zor Mod'da ekstra engeller (bölüm görünümü artık farklı)
- Kullanıcı geri bildirimi: "Benim istediğim zor modu seçtiğinde daha fazla engel olması. Kolay mod gibi aynı ekran olmasın" — V5.7.1'de Zor Mod yalnızca yıldız barajı/hız/ipucu gibi görünmez parametreleri değiştiriyordu, ekran Kolay Mod ile birebir aynıydı. Bu geri bildirimle Zor Mod artık gerçekten daha fazla, görünür engel ekliyor.
- `hardExtraObstacles(q)`: her bölüm için `mulberry32`/`hashStr` ile tohumlanmış deterministik bir üretici, bölüme 1-3 arası ek dikdörtgen engel yerleştiriyor. Dünya bazlı üst sınır: Öğren (dünya 0) hiç engel almıyor (öğretim bozulmasın diye), Engeller ≤3, Kutuplar/Hareket ≤2, Usta ≤1 (zaten kapı/anahtar/buz/hareketli engel gibi mekanikleri çok olduğu için daha az).
- Güvenlik: her aday engel; başlangıç/hedef/top(lar)/hedef(ler)den ≥0.11, sabit mıknatıslardan ≥0.09, kapı/anahtardan ≥0.06-0.09, mevcut engel/buz zeminlerden ve hareketli engellerin tüm salınım alanından ≥0.03 marj ile deneniyor; çakışan aday atlanıp yeniden deneniyor (bölüm başına en fazla 80 deneme). Bu, üretilen hiçbir ek engelin bölümü çözülemez hale getirmemesini sağlıyor.
- Ek engeller `levels[]` dizisine değil, `load(n)` içinde `settings.hardMode` açıkken çalışma anında `obstacles` dizisine ekleniyor — Kolay Mod ve mevcut `qaLevelData()`/`smoke_test.js` bölüm-geometrisi testleri hiç etkilenmiyor.
- Doğrulama: 100 bölümün tamamı için üretici Node'da bağımsız çalıştırıldı — 80 bölümde toplam 120 ek engel, sıfır yerleştirme hatası, sıfır sınır-dışı sonuç. Gerçek tarayıcıda Bölüm 30 (Engeller) ve Bölüm 77 (Hareket, buz+hareketli engelli) için Kolay/Zor karşılaştırmalı ekran görüntüsü alındı: Zor Mod'da görünür şekilde daha fazla engel var, hiçbiri geçidi kapatmıyor. `tools/verify_release.py` → `tools/smoke_test.js` PASS, Java stub derlemesi temiz.

# MAGNET V5.7.1

## İlk açılışta zorluk seçimi
- Kullanıcı isteği: "Oyuncuya oyunu ilk actiginda zor/kolay secenekleri sunup bölümleri ona göre mi ayarlasak" — ilk açılışta oyuncuya Kolay/Zor seçtirip bölümleri ona göre ayarlama.
- Yeni bir zorluk sistemi kurmak yerine, zaten V5.7.0'da test edilmiş **Zor Mod** mekaniği (yıldız barajı ~%25 sıkı, hareketli engeller %30 hızlı, ipucu kapalı) doğrudan kullanıldı — daha önce hiç test edilmemiş bölüm geometrisi riskine girilmedi.
- Karşılama ekranına (`#welcomeOverlay`, yalnızca gerçek ilk açılışta gösterilir) "Nasıl oynamak istersin?" sorusu ve iki butonluk bir seçici eklendi: 🙂 KOLAY (standart) / 🔥 ZOR (az hamle · hızlı engel · ipucu yok).
- Seçim anında `settings.hardMode`'a yazılıyor ve buton aktif durumu güncelleniyor; "BAŞLA"ya basıldığında `save()` ile kalıcı hale geliyor. Varsayılan seçili buton Kolay (`settings.hardMode` varsayılanı `false` ile birebir uyumlu).
- Seçim kalıcı bir kilit değil — Ayarlar → Zor Mod her zaman olduğu gibi istenildiği an açılıp kapatılabiliyor.
- Doğrulama: web/Android varlık paritesi, `tools/verify_release.py` → `tools/smoke_test.js` (PASS), Java stub derlemesi temiz; gerçek tarayıcıda karşılama ekranı ekran görüntüsüyle doğrulandı, ZOR seçilip BAŞLA'ya basıldığında `localStorage`'a kaydedilen `settings.hardMode`'ın `true` olduğu doğrulandı.

# MAGNET V5.7.0

## Buz zemin (yeni engel türü) + Zor Mod
- Kullanıcı geri bildirimi: oynanış hâlâ basit geldi, zorlaştıralım; ayrıca yeni bir özellik istendi.
- **Buz zemin (`L.ice`):** çarpışma yapmayan, dikdörtgen bir "kaygan bölge". Üzerindeyken çekirdeğin sürtünmesi `.022`'den `.55`'e çıkıyor (saniyede kalan hız oranı) — yani çekirdek çok daha uzun kayıyor, hedefte durdurmak zorlaşıyor. Çarpışma içermediği için hiçbir bölümü çözülemez hale getiremez; sadece momentum kontrolünü zorlaştırır.
  - Hareket dünyasının son 5 bölümü (p≥15) ve Usta dünyasının p≥2 olan tüm bölümleri (toplam 23 bölüm) buz zemin içeriyor.
  - `qaLevelData()` ve `tools/smoke_test.js`'e buz zemin sınır kontrolü eklendi; `makeDailyLevel()` aynalama mantığına da dahil edildi.
  - Ölçüm: aynı başlangıç hızıyla 1 saniye sonra buzda ~29.7, normal zeminde ~5.2 hız kalıyor (~5.7×) — fark net hissediliyor.
- **Zor Mod (Ayarlar → Zor Mod, isteğe bağlı, her an açılıp kapatılabilir):**
  - 3 yıldız için hamle payı ~%25 azalır (`Math.max(2,Math.round(m*0.75))`).
  - Tüm hareketli engellerin hızı %30 artar.
  - İpucu tamamen kapanır ("Zor modda ipucu yok" uyarısı).
  - Günün Bölümü dahil tüm bölümlerde geçerli; ilerlemeyi/kaydı etkilemez, sadece zorluğu değiştirir.
- Doğrulama: web/Android parite, `tools/verify_release.py`, `tools/smoke_test.js` (PASS), Java stub derlemesi temiz; gerçek tarayıcıda buz sürtünmesi ve Zor Mod'un yıldız barajı/hareketli engel hızı/ipucu üzerindeki etkisi ölçülerek doğrulandı; 100 bölümün tamamı (buz dahil) geometri kontrolünden geçti.

# MAGNET V5.6.2

## Kullanılmayan "günlük ödül · reklamla kazan" özelliğinin temizlenmesi
- Kullanıcı geri bildirimi: "Biz kullanıcıya günlük ödül olarak vaadediyoruz" — menüde `id="dailyBtn"` olarak duran, i18n metni "☀ GÜNLÜK ÖDÜL · REKLAMLA KAZAN" olan bir buton vardı. `window.MAGNET_ADS.rewardedAvailable()` her zaman `false` döndürdüğü için (reklam SDK'sı yok) `renderMenu()` bu butonu her zaman `display:none` yapıyordu — yani gerçek kullanıcılar bu vaadi hiç görmüyordu, ama kod kalıcı olarak orada duruyordu ve okuyan biri için kafa karıştırıcıydı.
- Kaldırılanlar: `#dailyBtn` HTML elemanı, `onclick` işleyicisi (rewarded-ad akışı, `magnet_daily_reward_v1` localStorage anahtarı), `menu_daily_reward`/`reward_used`/`reward_unavail`/`reward_incomplete`/`reward_ok` i18n anahtarları, `DAILY_REWARDED_AMOUNT` sabiti, `window.MAGNET_ADS.rewardedAvailable`/`showRewarded` mock'ları.
- Dokunulmayanlar: seviye-aralığı interstitial reklam kancası (`requestAdBreak`, `AD_INTERVAL_LEVELS`, `adState`) — bu tamamen arka planda, kullanıcıya hiçbir şey göstermeyen bir no-op sayaç, gelecekte bir reklam SDK'sı eklenirse kullanılabilir; yanlış bir vaat içermiyor.
- Artık uygulamanın kullanıcıya verdiği tek "günlük ödül" vaadi, gerçekten çalışan Günün Bölümü + seri sistemi (+1 bonus yıldız, reklamsız).
- Doğrulama: web/Android varlık paritesi, `tools/verify_release.py`, `tools/smoke_test.js` (PASS), menü gerçek tarayıcıda ekran görüntüsüyle doğrulandı (buton artık yok, 2×2 menü ızgarası düzgün).

# MAGNET V5.6.1

## Zorluk ayarı (hafif)
- Kullanıcı geri bildirimi: oynanış iyi ama bölümler biraz daha zor olabilir.
- Yıldız barajı: Engeller dünyasında hamle payı `4+p/6` (önceden `4+p/5`), Kutuplar `6+p/5` (önceden `6+p/4`), Hareket `8+p/4` (önceden `8+p/3`), Usta `10+p/3` (önceden `10+p/2`). Öğren dünyası (bölüm 1-20) dokunulmadı.
- Hız: Hareket dünyasındaki kayan engeller ~%8 daha hızlı; Usta dünyasındaki kayan engeller temel hız ve artış katsayısı yükseltilerek biraz daha hızlı.
- Erken zorluk: Kutuplar'da ekstra mıknatıs/duvar eşikleri (10→8, 15→12), Hareket'te ekstra mıknatıs/duvar eşikleri (10→8, 14→11, 17→14), Usta'da kapı/ekstra mıknatıs/duvar eşikleri (4→3, 8→6, 12→9) birkaç bölüm öne çekildi — hepsi zaten bu dosyada kullanılan, test edilmiş düzenler; yeni/test edilmemiş geometri eklenmedi.
- Doğrulama: 100 bölümün tamamı için sınır/geçerlilik kontrolü (start/target/engel/hareketli engel aralıkları) yeniden çalıştırıldı, hiçbiri sınır dışına çıkmadı; `tools/verify_release.py` ve `tools/smoke_test.js` PASS.
- `tools/verify_release.py` içindeki sabit `versionCode 42` kontrolü, her sürüm artışında elle güncellenmesi gereken kırılgan bir kontroldü; artık versionCode'un varlığını genel olarak doğruluyor.

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
