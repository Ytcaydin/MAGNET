# MAGNET v6.0.0

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
- V5.6.1 Zorluk ayarı (hafif) — Engeller/Kutuplar/Hareket/Usta dünyalarında 3 yıldız için gereken hamle sayısı biraz sıkılaştırıldı; Hareket ve Usta dünyalarındaki kayan engeller ~%8-10 daha hızlı; Kutuplar/Hareket/Usta dünyalarındaki ek mıknatıs/duvar/kapı zorlukları artık birkaç bölüm daha erken devreye giriyor (aynı, daha önce test edilmiş düzenler). Öğren dünyası (ilk 20 bölüm) değişmedi. 100 bölümün tümü geometri geçerliliği için yeniden doğrulandı.
- V5.6.2 Temizlik — kullanıcıya hiç görünmeyen ama kodda "GÜNLÜK ÖDÜL · REKLAMLA KAZAN" diye duran, reklam SDK'sı olmadığı için hiçbir zaman çalışmayan eski menü butonu ve tüm ilgili kod/metin kaldırıldı. Günün Bölümü + seri sistemi zaten reklamsız, çalışan tek "günlük ödül" olarak kalıyor. Seviye-aralığı interstitial reklam kancası (kullanıcıya hiçbir şey göstermeyen, arka planda no-op sayaç) dokunulmadan kaldı.
- V5.7.0 Buz zemin + Zor Mod — Hareket dünyasının son 5 bölümüne ve Usta dünyasının neredeyse tamamına (23 bölüm), çekirdeğin sürtünmesiz kaydığı buz zeminler eklendi (çarpışma yok, sadece momentum kontrolünü zorlaştırıyor — bölümleri asla çözülemez hale getirmiyor). Ayarlar'a isteğe bağlı "Zor Mod" eklendi: açıkken 3 yıldız için hamle payı ~%25 azalır, hareketli engeller %30 hızlanır, ipucu kullanılamaz. Zor Mod her an açılıp kapatılabilir, ilerlemeyi silmez.
- V5.7.1 İlk Açılış Zorluk Seçimi — Karşılama ekranına "Nasıl oynamak istersin?" sorusu ve Kolay/Zor seçici eklendi. Seçim doğrudan mevcut Zor Mod ayarına yazılıyor (yeni bir zorluk sistemi değil, zaten test edilmiş Zor Mod mekaniğinin ilk açılışta sorulması). Varsayılan Kolay; seçim Ayarlar'dan istenildiği zaman değiştirilebilir.
- V5.7.2 Zor Mod'da Ekstra Engeller — Zor Mod artık sadece hız/yıldız barajını değil, bölüm görünümünü de değiştiriyor: her bölüme (Öğren dünyası hariç) deterministik olarak 1-3 ek engel bloğu ekleniyor, dünyaya göre sayı sınırlı (Engeller ≤3, Kutuplar/Hareket ≤2, Usta ≤1). Ek engeller; başlangıç/hedef, mevcut engeller, buz zeminler, mıknatıslar, kapı/anahtar ve hareketli engellerin salınım alanından güvenli mesafede, çakışmasız yerleştiriliyor — hiçbir bölüm çözülemez hale gelmiyor. Kolay Mod'da bölümler hiç değişmiyor.
- V5.7.3 Kolay ve Zor artık iki ayrı 100 bölüm — Zor artık bir "mod" değil, kendi ilerlemesi ve kaldığı yeri hatırlayan bağımsız bir bölüm seti: Bölüm 1'den itibaren daha az hamle payı ve (Öğren dünyası dahil) fazladan engellerle başlıyor, sonrasında Kolay'dan daha hızlı zorlaşarak devam ediyor (hareketli engel hızı da bölüm verisine gömülü olarak daha yüksek). Kolay ise eskisi gibi düşük tempoda başlayıp aynı hızda zorlaşıyor. Ayarlar'daki "Zor Mod" anahtarı artık bu iki bölüm setini değiştiriyor; her ikisinin yıldızı/kaldığı bölüm ayrı ayrı kaydediliyor, birinden diğerine geçmek diğerinin ilerlemesini silmiyor.
- V5.7.4 Zor Mod daha da zorlaştı, artık görünüyor — Hamle payı daha da sıkılaştı (%40 azalma + sabit -1), hareketli engel hızı %50 arttı (önceden %30), ve Zor Mod'un eklediği ekstra engeller artık Bölüm 1'den itibaren 2 tane ile başlayıp dünyaya göre 2-4'e kadar çıkıyor (önceden 1-3, Öğren dünyasında 1). En önemlisi: bu ekstra engeller artık kırmızı/kiremit renkte, ayrı bir vurguyla çiziliyor — oyuncu ilk bölümden itibaren "bunlar Zor Mod'un eklediği engeller" olduğunu bir bakışta anlıyor, sadece hamle sayısına bakıp tahmin etmiyor.
- V5.7.5 Zor Mod'da daha fazla engel — Bölüm 1'den itibaren ekstra engel sayısı 2'den 3'e çıkarıldı, dünyaya göre üst sınır da bir artırıldı (`[3,5,4,4,3]`, önceden `[2,4,3,3,2]`). Yerleştirme algoritmasının deneme sayısı 80'den 200'e çıkarıldı ki daha kalabalık Usta dünyası bölümlerinde de istenen engel sayısına güvenilir şekilde ulaşılsın.
- V5.7.6 Zor Mod maksimuma çıkarıldı — Bölüm 1 artık 5 ekstra engelle başlıyor (dünyaya göre üst sınır `[5,8,7,7,6]`), hamle payı gerektiğinde 1'e kadar düşebiliyor (önceki taban 2'ydi), hareketli engel hızı %80 arttı (önceden %50). Yerleştirme denemesi 500'e çıkarıldı. Her bölümün hâlâ tamamlanabilir olduğu hem geometrik olarak hem de gerçek bir çözüm denemesiyle (Bölüm 1, otomatik bir sürükleme dizisiyle) doğrulandı — zorluk fiziksel olarak imkansız bir bölüme dönüşmedi.
- V5.7.7 Zor Mod'un engelleri artık gerçekten yolu kesiyor — Önceki sürümlerde ekstra engeller bölümde rastgele bir yere serpiliyordu; bu da kenarlardan tamamen boş bir "her şeyin etrafından dolan" koridoru bırakıyor ve tek bir düz sürüklemeyle hiçbir engele değmeden hedefe ulaşmak mümkün oluyordu. Artık ekstra engeller başlangıç-hedef doğrusu boyunca (dik yönde biraz saçılarak) yerleştiriliyor, yani doğrudan kestirme yolun üzerine düşüyorlar — dolanmak gerçekten gerekiyor. `tools/smoke_test.js`'e bu spesifik açığı bir daha açılmayacak şekilde kalıcı bir regresyon testi eklendi.
- V6.0.0 MAGNET 2.0 · Neon Lab — Tamamen yenilenmiş neon görünüm (parlayan engeller, mıknatıs ile çekirdek arasında canlı manyetik alan çizgileri, kutba göre değişen aura, parçacıklar, çarpma sarsıntısı, dünyaya göre renklenen arka plan). Yeni mekanikler: kutup değiştirme (41+, ⇄ butonu), kırılabilir duvarlar (29–40), taşıma bantları (65–80), portallar (71–83), açılıp kapanan lazerler (85–100). Zor yolda her 4. bölüm Karanlık Bölge. Bölüm seçimi yılan şeklinde harita (boss düğümleriyle), HUD'da 3 yıldız hamle hedefi ve Zor/Karanlık etiketi, sonuç ekranında süre. Eskiden görünmez olan ve çekirdeği sıkıştırabilen 'bumper'lar artık görünür ve duvarlardan güvenli mesafede. Yeni `tools/solve_test.js`: bir bot 100+100 bölümü ve örnek günlük bölümleri gerçek fizikle oynayıp hepsinin bitirilebildiğini doğruluyor (release kapısına eklendi).

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
