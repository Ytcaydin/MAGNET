# MAGNET V5.5.0 — Store QA

## Otomatik kontroller (`tools/verify_release.py` + `tools/smoke_test.js`, CircleCI'da her build)
- Web ve Android oyun dosyası birebir aynı
- JS sözdizimi, DOM id referansları, tekrar eden id yok
- Runtime smoke test: açılış, tüm butonlar, 100 bölüm yükleme, kazanma akışı, kayıt/geri yükleme
- Sürüm eşleşmesi: `versionName` = `RELEASE_VERSION` = `MagnetApp.VERSION`
- Launcher ikonu ve manifest bağlantısı mevcut
- APK içindeki `assets/index.html` web sürümüyle aynı; dex içinde `MainActivity` ve `MagnetApp` var
- Release AAB debug anahtarıyla imzalanmamış

## Manuel doğrulanan (V5.4.2, fiziksel Android cihaz)
- Uygulama açılıyor, oyun oynanıyor, menü ve ayarlar çalışıyor

## Politika durumu
- İnternet izni yok, ağ isteği yok, üçüncü taraf SDK yok
- Reklam yok; kullanılmayan "günlük ödül · reklamla kazan" menü butonu ve ilgili kod V5.6.2'de tamamen kaldırıldı (Günün Bölümü zaten reklamsız günlük ödül sağlıyor); seviye-aralığı interstitial kancası (`requestAdBreak`) kullanıcıya hiçbir şey göstermeden arka planda no-op kalmaya devam ediyor
- Satın alma / premium yok
- Gizlilik politikası TR + EN, iletişim e-postası eklendi

## Yayın engelleri (kalan)
1. GitHub Pages ile gizlilik politikasını herkese açık URL'de yayınlamak
2. Yükleme anahtarını oluşturup CircleCI'a eklemek → imzalı AAB
3. Play Console hesabı, uygulama oluşturma, formlar
4. Kapalı test: 12 test kullanıcısı, 14 gün kesintisiz
