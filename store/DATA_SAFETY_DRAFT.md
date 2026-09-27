# Google Play Data Safety — V5.6.0

Play Console → Uygulama içeriği → Veri güvenliği. Kaynak kodu ve manifest ile doğrulanan durum:

- İnternet izni yok, uygulama ağ isteği yapmıyor, reklam/analitik SDK'sı yok.
- Oyun ilerlemesi, ayarlar, günlük seri ve anonim sayaçlar yalnızca cihazda (WebView yerel depolaması) tutuluyor.
- **Yeni (5.6):** Ayarlar → Geri bildirim → GÖNDER, kullanıcının kendi e-posta uygulamasını hazır bir taslakla açar.
  Taslakta anonim oyun istatistikleri + uygulama/Android sürümü var; kullanıcı görür, düzenler, isterse gönderir.
- **Yeni (5.6):** Play In-App Review kütüphanesi (`com.google.android.play:review`). Pencereyi Play Store uygulaması
  gösterir; oyun puanı/yorumu görmez.

## Önerilen beyan (temkinli, önerilen)

Geri bildirim e-postası geliştiriciye ulaştığı için, kullanıcı başlatsa bile temkinli yaklaşım bunu isteğe bağlı toplama
olarak beyan etmektir:

| Soru | Yanıt |
|---|---|
| Uygulama zorunlu veri türlerinden herhangi birini topluyor/paylaşıyor mu? | **Evet** |
| Veriler aktarım sırasında şifreleniyor mu? | **Evet** (e-posta uygulaması/sağlayıcısı TLS kullanır). Emin değilsen kendi e-posta sağlayıcına göre yanıtla |
| Kullanıcı silme isteyebilir mi? | **Evet**, ytcaydin@gmail.com adresine yazarak |
| **Kişisel bilgiler → E-posta adresi** | Toplanıyor · Paylaşılmıyor · **İsteğe bağlı** · Amaç: **Geliştirici iletişimi** |
| **Uygulama bilgileri ve performansı → Diğer uygulama performans verileri** | Toplanıyor · Paylaşılmıyor · **İsteğe bağlı** · Amaç: **Analiz** (bölüm zorluğu) |
| **Uygulama etkinliği → Uygulama etkileşimleri** | Toplanıyor · Paylaşılmıyor · **İsteğe bağlı** · Amaç: **Analiz** |
| Diğer tüm kategoriler | Toplanmıyor |

"İsteğe bağlı" = kullanıcı bu veriyi sağlamayı seçebilir; oyun onsuz tamamen çalışır.

## Alternatif (daha sade)
Google, kullanıcının kendi başlattığı ve kendi uygulamasıyla yaptığı aktarımları bazı durumlarda "toplama" saymaz.
Geri bildirim düğmesini kaldırırsan veya bu yorumu benimsersen "Veri toplanmıyor" beyanı kullanılabilir. Emin olmadığın
durumda temkinli beyan daha güvenlidir: fazla beyan politika ihlali değildir, eksik beyan olabilir.

## In-App Review
Değerlendirme penceresini Play Store uygulaması gösterir; MAGNET puana, yoruma veya kullanıcı kimliğine erişmez.
Play Console'un SDK kontrolü bu kütüphane için ek beyan isterse bu belge güncellenmelidir.

## Reklam eklenirse
AdMob veya başka bir SDK eklenirse bu form baştan doldurulmalıdır (reklam kimliği, cihaz kimlikleri, etkileşimler)
ve gizlilik politikası güncellenmelidir.
