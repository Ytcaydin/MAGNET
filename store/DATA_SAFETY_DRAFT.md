# Google Play Data Safety — V5.5.0

Play Console → Uygulama içeriği → Veri güvenliği. Bu sürüm için önerilen yanıtlar (kaynak kodu ve manifest ile doğrulandı):

| Soru | Yanıt | Dayanak |
|---|---|---|
| Uygulamanız zorunlu kullanıcı verisi türlerinden herhangi birini topluyor veya paylaşıyor mu? | **Hayır** | İnternet izni yok (`AndroidManifest.xml`), ağ isteği yok, üçüncü taraf SDK yok |
| Veriler aktarım sırasında şifreleniyor mu? | Soru "Hayır" yanıtında sorulmaz | Veri aktarımı yok |
| Kullanıcılar verilerinin silinmesini isteyebilir mi? | Soru sorulmaz; yine de: Ayarlar → İlerlemeyi sıfırla / uygulamayı kaldırma | Yerel depolama |
| Hesap oluşturma | Yok | — |

Notlar:
- Oyun ilerlemesi ve anonim oyun sayaçları yalnızca cihazdaki WebView yerel depolamasında tutulur ve cihazdan çıkmaz. Google'ın tanımına göre cihazdan dışarı aktarılmayan veri "toplanan veri" sayılmaz.
- **AdMob veya başka bir SDK eklenirse bu form baştan doldurulmalıdır** (reklam kimliği, cihaz kimlikleri, uygulama etkileşimleri vb.). Gizlilik politikası da güncellenmelidir.
