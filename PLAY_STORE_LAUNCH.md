# MAGNET — Google Play yayın yol haritası

Durum (V5.5.0): oyun, APK/AAB hattı, mağaza metinleri, görseller ve gizlilik politikası hazır.
Aşağıdaki adımlar senin hesaplarınla yapılması gerekenler. Sırayla ilerle.

## 1. Google Play Console hesabı
- https://play.google.com/console → geliştirici hesabı oluştur (tek seferlik kayıt ücreti; kimlik doğrulaması istenir).
- **Kişisel hesap** açıyorsan: 13 Kasım 2023 sonrası açılan kişisel hesaplar, üretime (herkese açık) çıkmadan önce
  **en az 12 test kullanıcısıyla, 14 gün kesintisiz kapalı test** yapmak zorunda. Plan buna göre yapılmalı (adım 6).

## 2. Gizlilik politikasını yayınla (GitHub Pages, 1 dakika)
GitHub → MAGNET reposu → **Settings** → **Pages** → Build and deployment:
- Source: **Deploy from a branch**
- Branch: **main**, klasör: **/ (root)** → **Save**

Birkaç dakika sonra:
- Gizlilik (TR): https://ytcaydin.github.io/MAGNET/web/privacy.html
- Gizlilik (EN): https://ytcaydin.github.io/MAGNET/web/privacy-en.html
- Oyunun web sürümü (bonus): https://ytcaydin.github.io/MAGNET/web/

## 3. İmzalı AAB
`RELEASE_SIGNING.md` adımlarını uygula: Termux'ta `sh tools/create_upload_key.sh`, çıkan değerleri CircleCI ortam
değişkenlerine ekle. Sonraki build'de Artifacts → `release/app-release.aab`.

## 4. Play Console'da uygulamayı oluştur
**Uygulama oluştur** → Ad: `MAGNET: Manyetik Bulmaca` · Varsayılan dil: **Türkçe (tr-TR)** · Oyun · Ücretsiz.

## 5. Uygulama içeriği ve mağaza sayfası
| Bölüm | Kaynak |
|---|---|
| Gizlilik politikası | Adım 2'deki TR URL |
| Uygulama erişimi | Tüm işlevler kısıtlamasız |
| Reklamlar | Hayır |
| İçerik derecelendirme | `store/CONTENT_RATING_DRAFT.md` |
| Hedef kitle | `store/CONTENT_RATING_DRAFT.md` (13+ önerilir) |
| Veri güvenliği | `store/DATA_SAFETY_DRAFT.md` → veri toplanmıyor |
| Ana mağaza girişi | `store/STORE_LISTING_TR.md` |
| Uygulama simgesi | `store/icon-512.png` |
| Öne çıkan görsel | `store/feature-graphic-1024x500.png` |
| Telefon ekran görüntüleri | `store/screenshots/*.png` (6 adet) |
| Kategori / iletişim | Oyun → Bulmaca · ytcaydin@gmail.com |

## 6. Test kanalları
1. **Dahili test** (hemen, 100 kişiye kadar, inceleme hızlı): AAB'yi yükle, kendi hesabınla Play'den kur ve dene.
2. **Kapalı test** (kişisel hesaplar için zorunlu): en az **12 kişi** e-posta listesiyle eklenir, davet linkinden katılır ve
   **14 gün boyunca test grubunda kalır**. Erken ayrılanlar sayılmaz; 12'nin biraz üstünde kişi eklemek güvenli olur.
3. 14 gün dolunca Play Console → Kontrol paneli → **Üretime erişim için başvur**.

## 7. Üretim
Onay gelince aynı (veya daha yeni) AAB'yi **Üretim** kanalına yükle; önce yalnızca **Türkiye**'yi seç
(oyun şimdilik yalnızca Türkçe). İngilizce çeviri eklendiğinde diğer ülkeler + `store/STORE_LISTING_EN.md`.

## Her güncelleme
`android/app/build.gradle` içinde `versionCode` artır → push → CircleCI yeni AAB → Play'e yükle.
