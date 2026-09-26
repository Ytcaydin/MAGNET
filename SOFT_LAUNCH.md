# MAGNET V4.9 Soft Launch

## Amaç
Küçük oyuncu grubunda oynanış ve retention sinyallerini ölçmek.

## Veri
- Analytics cihaz üzerinde localStorage ile tutulur.
- Sunucuya otomatik gönderim yoktur.
- Playtest export kullanıcı tarafından başlatılır.

## Temel olaylar
- session_start / session_end
- level_start / level_complete
- retry
- hint_used
- ad_shown

## Reklam
Sadece 5'in katı olan tamamlanan bölümlerde eligibility vardır. Bölüm içi, retry veya hint reklamı yoktur.

## Başarı ölçütleri
- İlk 10 bölüm tamamlama
- D1/D3/D7 retention (Play Console/harici analitik eklenirse)
- Bölüm bazlı retry ve completion
- Ortalama oturum süresi

## Not
V4.9 gerçek APK/AAB build'i değildir; Android SDK/Gradle ortamı mevcut değilse bu durum açıkça belirtilmelidir.
