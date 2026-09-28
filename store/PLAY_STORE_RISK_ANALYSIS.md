# MAGNET V6.2.0 — Play Store Risk Analizi

Bu belge mevcut kod tabanını (V6.2.0), Android manifest/build ayarlarını ve `store/` klasöründeki
önceki beyan taslaklarını (V5.5–5.6 döneminden kalma) karşılaştırarak, yayına engel olabilecek veya
inceleme/reddedilme riski taşıyan noktaları önem sırasına göre listeler. "Risk" = yayını geciktirebilecek,
reddettirebilecek veya sonradan askıya aldırabilecek bir şey.

## Özet tablo

| # | Risk | Etki | Olasılık | Durum |
|---|---|---|---|---|
| 1 | İmzalı AAB yok (upload key oluşturulmamış) | Yayın imkansız | Kesin (henüz yapılmadı) | 🔴 Engelleyici |
| 2 | Gizlilik politikası URL'si canlı değil / doğrulanmadı | Form reddi | Yüksek | 🔴 Engelleyici |
| 3 | Content rating / Data safety / Hedef kitle formları hâlâ V5.6 taslağı, V6.0+ ile hiç güncellenmemiş | Yanlış beyan → politika ihlali | Orta-Yüksek | 🟠 Önemli |
| 4 | Kapalı test zorunluluğu (12 kullanıcı × 14 gün) hiç başlatılmamış | Yayın gecikmesi (2+ hafta) | Kesin | 🟠 Önemli |
| 5 | Dead ad-SDK kancası (`window.MAGNET_ADS`, `requestAdBreak`) kod içinde duruyor | "Reklam yok" beyanıyla çelişki riski, kafa karıştırıcı kod | Düşük ama gerçek | 🟡 Orta |
| 6 | Karanlık Bölge + yanıp sönen lazer efektleri (V6.0+) için epilepsi/fotosensitivite beyanı yok | İçerik derecelendirme formunda "korku/rahatsız edici içerik" sorusuna yanlış yanıt riski | Düşük-Orta | 🟡 Orta |
| 7 | Ekran görüntüleri ve store açıklaması hâlâ V5.5 dönemi (Neon Lab görünümü, harita, yeni mekanikler yok) | Yanıltıcı metadata → Play politikası "yanıltıcı içerik" riski, düşük dönüşüm | Orta | 🟡 Orta |
| 8 | In-app review kütüphanesi + geri bildirim e-postası veri güvenliği formunda güncel değil | Data Safety formu eksik/yanlış | Düşük | 🟢 Küçük |
| 9 | `targetSdk 35`, `minSdk 23` — API 35 zorunluluğu ve 23 desteği | Uyumluluk riski düşük ama minSdk 23 çok eski cihaz | Düşük | 🟢 Küçük |
| 10 | Kapanan/kilit ekranlar, tek yönlü offline oyun — hesap/PII riski yok | — | — | ✅ Güvenli |

---

## 🔴 Engelleyici riskler (yayından önce mutlaka kapatılmalı)

### 1. İmzalı AAB yok
`android/app/build.gradle` içindeki `releaseSigningAvailable` kontrolü hâlâ `keystore.properties` veya
CI ortam değişkenlerinin yokluğunda `false` dönüyor (repoda `keystore.properties` yok, gitignore'da).
`RELEASE_SIGNING.md` adım 1 ("`tools/create_upload_key.sh`") hiç çalıştırılmamış görünüyor.
**Olmadan Play Console'a hiçbir şey yüklenemez.** Bu, teknik olarak tek gerçek "hard blocker".

### 2. Gizlilik politikası URL'si
`store/STORE_LISTING_TR.md` ve `STORE_LISTING_EN.md`, `https://ytcaydin.github.io/MAGNET/web/privacy(-en).html`
adresini referans veriyor. Bu oturumdan yapılan kontrolde adrese ulaşılamadı (GitHub Pages ya hiç açılmamış ya da
farklı bir yol/case kullanıyor — repo `Ytcaydin/magnet` küçük harfle, Pages URL'i büyük harfle `MAGNET` yazıyor,
bu path-case uyuşmazlığı GitHub Pages'te 404'e yol açabilir). Play Console gizlilik politikası formu **canlı,
erişilebilir bir HTTPS sayfası** ister; ölü link doğrudan form reddi veya sonradan askıya alma sebebi olur.
**Aksiyon:** GitHub Pages'i etkinleştir, gerçek URL'yi (repo adının büyük/küçük harfine göre) tarayıcıda test et,
sonra store listing dosyalarındaki URL'leri buna göre düzelt.

---

## 🟠 Önemli riskler

### 3. Content rating / Data safety / Hedef kitle beyanları güncel değil
`CONTENT_RATING_DRAFT.md` ve `DATA_SAFETY_DRAFT.md` V5.6.0 tarihli. O zamandan beri:
- Oyuna **lazer, kırılabilir duvar, portal, bant, kutup değişimi, Karanlık Bölge** gibi yeni mekanikler eklendi.
- Görsel dil tamamen değişti (Neon Lab), ama bu içerik derecelendirmesini etkilemez.
- Reklam/veri toplama davranışı değişmedi (hâlâ internet izni yok, hâlâ isteğe bağlı e-posta geri bildirimi var) —
  bu yüzden **Data Safety beyanının içeriği muhtemelen hâlâ doğru**, ama form V5.6'dan beri Play Console'da hiç
  doldurulmamışsa (checklist'te "[ ]" işaretli), bu adım hâlâ yapılmamış demektir, taslağın güncelliği değil eksikliği risk.
- **Aksiyon:** Taslakları V6.2.0 mekaniklerine göre bir kez daha gözden geçir (aşağıdaki madde 6), sonra Play
  Console formlarını doldur — bu adım checklist'te hâlâ işaretsiz.

### 4. Kapalı test (closed testing) zorunluluğu
Yeni kişisel geliştirici hesapları için Google, üretim yayınından önce **12 test kullanıcısı ile kesintisiz 14 gün**
kapalı test ister. `STORE_QA.md` bunu hâlâ "yayın engeli" olarak listeliyor ve hiçbir ilerleme belirtisi yok.
Bu bir politika ihlali riski değil ama **zaman riski**: son anda fark edilirse yayın 2+ hafta gecikir.
**Aksiyon:** Diğer her şey hazırlanırken kapalı testi paralel olarak başlat (12 kullanıcı bulmak + Play Console'da
test grubu kurmak bugünden yapılabilir, imzalı AAB'nin hazır olması yeterli).

---

## 🟡 Orta risk

### 5. Kullanılmayan reklam kancası kod içinde duruyor
`web/index.html`: `AD_INTERVAL_LEVELS`, `adEligible()`, `requestAdBreak()`, `window.MAGNET_ADS` hâlâ mevcut
(`showInterstitial` her zaman `{shown:false}` döner, gerçek SDK bağlı değil). `STORE_QA.md` bunu bilinçli bir
no-op olarak not düşmüş, doğru. Policy açısından gerçek bir ihlal değil çünkü kullanıcıya hiçbir şey gösterilmiyor
ve "reklam yok" beyanı doğru kalıyor. Ama:
- İleride biri bu kancaya gerçek bir SDK bağlarsa, Data Safety formunun **o an güncellenmesi unutulabilir**
  (form otomatik güncellenmez).
- İnceleyen biri (Google'ın otomatik statik analizi) kodda "ad" ile ilgili string'ler görürse ek soru sorabilir —
  düşük ihtimal ama sıfır değil.
**Aksiyon:** Kısa vadede değişiklik gerekmez; uzun vadede gerçekten kullanılmayacaksa kancayı tamamen silmek
kod temizliği + risk azaltma açısından iyi olur. Gerçek reklam eklenirse `DATA_SAFETY_DRAFT.md`'nin ilgili bölümü
zorunlu güncelleme listesine eklenmeli (zaten belgede not var).

### 6. Karanlık Bölge + yanıp sönen lazerler — fotosensitivite/rahatsız edici içerik
V6.0.0'da eklenen Dark Zone (yalnızca manyetin ışığının göründüğü bölümler) ve cycling laser efektleri (`laserOn`/
`laserWarn` ile açılıp kapanan neon lazerler) IARC anketinde "korkutucu içerik" veya "rahatsız edici görsel efektler"
sorularını tetikleyebilecek türde. Şu anki taslak (`CONTENT_RATING_DRAFT.md`) bu soruları hâlâ "Hayır" olarak
işaretliyor — V5.6 döneminde bu mekanikler yoktu, yanıt o zaman doğruydu. Lazerlerin yanıp sönme hızı (`on:1.45,
off:1.25` saniye civarı Hard modda) fotosensitif epilepsi eşiklerinin (genelde <3 saniyede 3'ten fazla flaş, yüksek
kontrastlı) çok altında ve tüm ekranı kaplamıyor, bu yüzden gerçek bir nöbet tetikleme riski düşük — ama IARC
anketi "ürkütücü sahneler/karanlık ortamlar" gibi soruları literal olarak sorabilir.
**Aksiyon:** İçerik derecelendirme anketini V6.2.0 ekran görüntüleriyle birlikte yeniden doldur, ilgili sorulara
(varsa) dürüst yanıt ver; muhtemelen yine en düşük yaş derecesini etkilemez ama taslağı güncellemeden Play
Console'a "kopyala-yapıştır" yapmak riskli.

### 7. Store metadata (açıklama + ekran görüntüleri) eski sürümü yansıtıyor
`store/screenshots/` klasöründeki 6 görsel (`01-tek-parmak.png` ... `06-bolumler.png`) isimlerinden anlaşıldığı
kadarıyla eski (V5.x) görsel dile ait — Neon Lab teması, harita ekranı, yeni mekanikler (lazer/portal/bant) ve
Kolay/Zor seçim ekranı hiçbirini göstermiyor olabilir. `STORE_LISTING_EN.md` metni ise (V6 metinleri zaten
eklenmiş) güncel — polarite, portal, lazer, bant, Karanlık Bölge, Kolay/Zor ikili sistemi doğru anlatılıyor.
Yani **metin güncel, görseller muhtemelen değil.** Play politikası ekran görüntülerinin gerçek uygulamayı
yansıtmasını ister; eski görseller "yanıltıcı metadata" sayılabilir ve ayrıca kullanıcı beklentisiyle gerçek
ürün arasında uyumsuzluk yaratıp düşük puan/şikayet riskini artırır.
**Aksiyon:** Yayından önce V6.2.0 görünümüyle 6-8 yeni ekran görüntüsü al (Neon Lab, harita, Kolay/Zor seçimi,
en az bir mekanik gösteren bölüm, Karanlık Bölge).

---

## 🟢 Küçük / bilgilendirme amaçlı

### 8. Data Safety formunun in-app review + geri bildirim maddeleri
`DATA_SAFETY_DRAFT.md` bu iki noktayı zaten doğru şekilde "isteğe bağlı" ve "üçüncü tarafla paylaşılmıyor" olarak
işaretlemiş; içerik hâlâ doğru, sadece Play Console'da fiilen doldurulmamış olması (madde 3) asıl eksik.

### 9. `minSdk 23`
Android 6.0 (API 23) çok eski bir alt sınır (2026 itibarıyla piyasa payı marjinal). Play politikası açısından bir
sorun değil, ama gereksiz eski API desteği test yükünü artırır ve WebView/JS motoru eski cihazlarda V6'nın
canvas-ağırlıklı Neon Lab render'ını (glow efektleri, sürekli arka plan canvas'ı) yavaş çalıştırabilir — bu bir
Play politikası riski değil, kullanıcı deneyimi/performans riski. Zorunlu değil ama `minSdk 24-26` aralığına
çekmek düşünülebilir.

### 10. Veri/izin yüzeyi genel olarak temiz
Manifest'te `<uses-permission>` hiç yok (internet dahil) — "tamamen offline" iddiasıyla tam tutarlı, hesap yok,
üçüncü taraf SDK yok (yalnızca Play Core review kütüphanesi, kullanıcı verisine erişmiyor). Bu açıdan MAGNET,
tipik bir Play reddi sebebi olan "izin-fazlalığı" veya "gizli veri toplama" risklerinden büyük ölçüde muaf.

---

## Önerilen sıralama (yayına giden yol)

1. **Upload key oluştur** (`tools/create_upload_key.sh`, Termux) + CircleCI değişkenlerini gir → imzalı AAB al.
2. **GitHub Pages'i aç**, gizlilik URL'lerini tarayıcıda doğrula, gerekiyorsa store listing dosyalarındaki
   büyük/küçük harf uyuşmazlığını düzelt.
3. **Yeni ekran görüntüleri** al (V6.2.0 görünümü).
4. **Play Console formlarını doldur**: İçerik derecelendirme anketi, Hedef kitle, Data Safety — taslakları V6
   mekaniklerine göre bir kez gözden geçirdikten sonra.
5. **Kapalı testi başlat** (12 kullanıcı × 14 gün) — imzalı AAB hazır olur olmaz, paralel olarak, çünkü bu en
   uzun süren adım.
6. (İsteğe bağlı, düşük öncelik) Kullanılmayan reklam kancasını temizle veya gerçek bir SDK ile doldur.

Bu sıralamada 1-2 numaralar gerçek "hard blocker"; 3-4 numaralar zaman/politika riski; 5 en uzun bekleme süresi
olduğu için erken başlatılmalı.
