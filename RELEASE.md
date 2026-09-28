# MAGNET V6.0.0 — MAGNET 2.0 · Neon Lab

## Kullanıcı isteği
"Bu oyunu çok daha gelişmiş bir oyuna çevirebilir miyiz?" → önizleme tuvalinde 3 tema + yeni ekran/mekanik fikirleri gösterildi → "Tema seçimini sana bırakıyorum. Yapabileceğin en iyi oyunu yap." Tema olarak **Neon Lab** seçildi (mevcut fizik ve renk diliyle en uyumlu, en okunaklı olan).

## Görsel yenileme (Neon Lab)
- Yeni renderer: arka plan (dünyaya göre renklenen ışımalar, ızgara, vinyet) önbelleğe alınıyor; engeller/hedefler/portallar "geniş yarı saydam + ince parlak çizgi" ile parlıyor — Android WebView'de pahalı `shadowBlur` yerine. Ölçüm: en ağır sahne (Zor + Karanlık + lazer) ~1.2 ms/kare.
- Mıknatıs ile aktif çekirdek arasında akan manyetik alan çizgileri (çekerken camgöbeği, iterken macenta); mıknatıs aurası çekerken içe, iterken dışa dalgalanıyor.
- Parçacıklar renkli ve 'lighter' karışımlı, sert çarpmalarda hafif ekran sarsıntısı, lazer temasında kırmızı flaş.
- Tüm HUD/overlay CSS'i neon temaya taşındı; HUD'a 3 yıldız hamle hedefi (`2/4`) ve Zor/Karanlık etiketi eklendi; sonuç ekranına süre eklendi.
- Bölüm seçimi: 4'lü satırlardan oluşan yılan şeklinde harita, tamamlanan yol parlıyor, sıradaki bölüm nabız gibi atıyor, 20. bölüm boss düğümü.

## Yeni mekanikler (her ikisi de Kolay ve Zor yolda)
- **Kutup değiştirme** (41. bölümden itibaren + günlük bölüm): alt buton ⇄ mıknatısı çek/it arasında çevirir (hamle sayılmaz).
- **Kırılabilir duvarlar** (29–40): 330 px/s üzeri normal hızla çarpınca kırılır.
- **Taşıma bantları** (65–80): üzerindeki çekirdeğe sabit ivme; mıknatıstan zayıf, yani karşı konulabilir.
- **Portallar** (71–83): turuncu↔mavi, hız yönünü koruyarak ışınlar, 0.5 sn bekleme ile ping-pong olmaz.
- **Lazerler** (85–100, 93+ ikinci dikey lazer): 1.1 sn açık / 1.7 sn kapalı (Zor: 1.45 / 1.25), kapanmadan önce yanıp söner; açıkken temas çekirdeği başlangıca döndürür.
- **Karanlık Bölge** (Zor yolda her 4. bölüm, 25 bölüm): yalnızca mıknatıs ve çekirdek çevresi görünür; hedef nabız gibi sinyal verir.
- Her öğe sabit aday konumlardan ve başlangıç/hedef/mıknatıs/kapı/anahtar/diğer geometriye güvenli mesafe koşuluyla yerleştiriliyor; Zor yolun ekstra engelleri de bu öğelerden uzak duruyor. Günlük bölümlerde aynalama tüm yeni öğelere uygulanıyor.

## Bulunan ve düzeltilen gizli hata: görünmez "bumper"lar
- Eski sürümlerde Kutuplar/Hareket/Usta dünyalarında 1–2 adet **görünmez** yuvarlak sektirici vardı ve duvarlara yalnızca 30 px mesafeyle yerleşiyordu — 24 px'lik çekirdeğin sıkışıp kalabileceği 18–21 px'lik boşluklar oluşuyordu. Yeni çözülebilirlik botu bunu Kolay 58/60 ve Zor 68'de yakaladı (eski sürümde de aynı üç bölüm takılıyordu). Artık bumper'lar görünür (mor halka) ve duvarlardan en az bir çekirdek genişliği boşluk bırakıyor; başlangıç, hedef, mıknatıs, anahtar, portal ve lazerlerden de uzak duruyor.

## Doğrulama
- **Yeni `tools/solve_test.js`**: gerçek fizik motoru üzerinde, A* yolu izleyen basit bir "mıknatıs botu" her iki yolun 100'er bölümünü ve 60 günlük bölüm düzenini oynuyor → **260/260 tamamlandı**. Bot portal/lazer/bant bilmiyor, yani onun bitirebildiği bölümü bir insan rahatça bitirir. `verify_release.py`'ye eklendi (~3 sn).
- `tools/smoke_test.js`: iki yol için geometri QA'sı (yeni öğelerin sınır kontrolleri dahil), yeni mekanik birim testleri (portal ışınlama, açık/kapalı lazer, bant ivmesi, hızlı/yavaş çarpmada duvar kırılması, kutup kilidi), mevcut tüm testler PASS.
- Gerçek tarayıcı: 12 ekran görüntüsü (tema, her mekanik, Karanlık Bölge, harita, sonuç), kutup butonunun kilitli/açık davranışı, portal+bant bölümü (72) ve lazer bölümü (90) gerçek fare sürüklemeleriyle kazanıldı; konsol hatası yok. Java stub derlemesi temiz.

# MAGNET V5.7.7

## Zor Mod'un engelleri artık gerçek kestirmeyi kesiyor (yol etrafından dolanma açığı kapatıldı)
- Kullanıcı geri bildirimi (ekran görüntüsüyle, Bölüm 3): "Engellerin arasından değil etrafından dolanarak tek hamlede kaçabiliyorum." Ekran görüntüsünde 5 ekstra engelin hepsi ekranın sol/orta bölgesinde kümelenmiş, sağ taraf ve kenarlar tamamen boş kalmıştı — tek bir uzun, kavisli sürüklemeyle bütün kümenin sağından dolanıp hedefe (Bölüm 3'ün sağ tarafında) hiçbir engele değmeden ulaşmak mümkündü.
- Kök neden: `hardExtraObstacles()` aday konumları, bölümün tamamı içinde (kenardan `.14` içeride) tamamen rastgele seçiyordu — hiçbir şey engelleri başlangıç-hedef doğrusunun üzerine denk getirmeye zorlamıyordu, sadece istatistiksel olarak bazen oraya düşüyorlardı.
- Düzeltme: Aday merkez noktası artık başlangıç→hedef doğrusu üzerinde rastgele bir `t∈[.10,.90]` oranında seçiliyor, sonra doğruya dik yönde `±.30`'a kadar rastgele kaydırılıyor (`spread`). Böylece engeller istatistiksel olarak dağınık kalmaya devam ediyor ama merkez kütlesi her zaman doğrudan kestirme yolun üzerinde/yakınında oluyor — kenar boşluğu kalsa da artık "tüm kümenin dışından tek hamlede dolanma" pratikte işe yaramıyor. Kenar sınırı da `.14` → `.04`'e çekildi ki spread aralığı fazla daralmasın.
- Mevcut güvenlik marjları (başlangıç/hedef/mıknatıs/kapı/anahtar/diğer engellerden asgari mesafe) aynen korundu — sadece adayların NEREDEN seçildiği değişti, hangi mesafelerin güvenli sayıldığı değil.
- **Kalıcı regresyon testi eklendi:** `tools/smoke_test.js`'e, mıknatısı doğrudan hedefe kilitleyip fiziği ~400 adım ileri saran ve Bölüm 1/3/5/10/21/30'un hiçbirinin bu "tek düz çekiş" ile anında kazanılmadığını doğrulayan bir test eklendi — bu spesifik açık bir daha sessizce geri gelemez.
- Doğrulama: bağımsız Node scripti ile 100 bölümün tamamında hâlâ istenen engel sayısına ulaşıldığı doğrulandı (0 hata); gerçek tarayıcıda Bölüm 1/3/5/21/30'da "başlangıçtan hedefe tek düz sürükleme" denendi — hiçbiri artık anında kazandırmıyor (`won:false`); aynı bölümler çok adımlı, engelleri gözeten bir sürükleme dizisiyle hâlâ tamamlanabiliyor (Bölüm 1, 8 hamlede) — yani bölümler hem gerçekten zorlaştı hem de çözülebilir kaldı. `tools/verify_release.py` → `tools/smoke_test.js` PASS, Java stub derlemesi temiz.

# MAGNET V5.7.6

## Zor Mod'u makul olan en üst seviyeye çıkarma
- Kullanıcı geri bildirimi: "Engel sayısını arttir. Zorluğu olabilecek en üst seviyeye çıkar. İlk bölümden o zorluğu hiç hissetmedim. Çok basit kalmış."
- `hardExtraCount()`: taban sayı 3 → 5, dünya başına üst sınır `[3,5,4,4,3]` → `[5,8,7,7,6]`. Bölüm 1 artık **5** ekstra (kırmızı) engelle başlıyor — Öğren dünyasında hiç engel olmayan bir bölümden 5 engelli bir bölüme.
- Hamle payı tabanı `Math.max(2,...)` → `Math.max(1,...)`: artık bazı erken bölümlerde 3 yıldız için tek hamle gerekiyor (yine de daha fazla hamleyle bitirmek mümkün — sadece yıldız kaybı oluyor, bölüm asla tıkanmıyor).
- `HARD_MOVE_SPEED_MULT`: 1.5 → 1.8 (hareketli engeller artık %80 daha hızlı).
- Yerleştirme denemesi 200 → 500'e çıkarıldı; daha yüksek engel sayılarında (Bölüm 91 gibi yoğun Usta dünyası bölümlerinde) hedefe güvenli mesafelerle ulaşmak için gerekliydi.
- **Çözülebilirlik doğrulaması bu sefer sadece geometrik değil, fiziksel:** Bölüm 1'i gerçek fizik motoruyla, otomatik bir sürükle-bırak dizisiyle (engelleri gözeterek hedefe doğru küçük adımlarla ilerleyen bir script) 7 hamlede tamamladım — 5 engele rağmen bölüm hâlâ oynanabilir, sadece belirgin şekilde daha zor.
- Doğrulama: bağımsız Node scripti ile 100 bölümün tamamında istenen ekstra engel sayısına ulaşıldığı, sınır dışı engel olmadığı ve Zor'un hep Kolay'dan sıkı kaldığı doğrulandı (0 hata). `tools/verify_release.py` → `tools/smoke_test.js` PASS, Java stub derlemesi temiz, Bölüm 1 ve 30'da gerçek tarayıcı ekran görüntüsü ve Bölüm 1'de gerçek bir çözüm denemesiyle teyit edildi.

# MAGNET V5.7.5

## Zor Mod'da daha fazla engel, Bölüm 1'den itibaren
- Kullanıcı geri bildirimi: "Zor için engel sayisini İlk bölümden itibaren biraz daha arttıralım."
- `hardExtraCount()`: taban sayı 2 → 3, dünya başına üst sınır `[2,4,3,3,2]` → `[3,5,4,4,3]`. Bölüm 1 artık 2 yerine 3 ekstra (kırmızı) engelle başlıyor; orta/üst bölümlerde 4-5'e kadar çıkıyor.
- Yerleştirme denemesi `80` → `200`'e çıkarıldı: daha yoğun geometrili bölümlerde (özellikle Usta dünyası — kapı/anahtar/buz/hareketli engel/mıknatıs bir arada) istenen sayıya güvenli mesafelerle ulaşmak daha fazla deneme gerektirebiliyordu; bağımsız test bir bölümde (91) eski deneme sayısıyla hedefin 1 eksik kaldığını gösterdi, artırılan deneme sayısıyla 100 bölümün tamamı tam sayıya ulaştı.
- Doğrulama: bağımsız Node scripti ile 100 bölümün tamamında istenen ekstra engel sayısına ulaşıldığı, hiçbir engelin sınır dışına taşmadığı ve Zor'un hamle payının hep Kolay'dan sıkı kaldığı doğrulandı (0 hata). `tools/verify_release.py` → `tools/smoke_test.js` PASS, Java stub derlemesi temiz, Bölüm 1 ve 30'da gerçek tarayıcı ekran görüntüsüyle daha kalabalık ama hâlâ geçilebilir düzen teyit edildi.

# MAGNET V5.7.4

## Zor Mod daha da zorlaştı ve artık görsel olarak da belli
- Kullanıcı geri bildirimi: "Zoru daha da zorlastiralim. İlk bölümden itibaren kullanıcı o zorluğu anlasın."
- Sayısal sıkılaştırma: `HARD_STAR_MULT` 0.75 → 0.6, ve formüle sabit `-1` eklendi (`Math.max(2,Math.round(m*0.6)-1)`) — üst dünyalarda hamle payı belirgin şekilde daha düşük (örn. Bölüm 99: Kolay 16 → Zor 9, önceden 12'ydi). `HARD_MOVE_SPEED_MULT` 1.3 → 1.5 (hareketli engeller artık %50 daha hızlı).
- Ekstra engel sayısı artık Bölüm 1'den itibaren **2** ile başlıyor (önceden Öğren dünyasında 1, diğerlerinde de 1'den başlıyordu), dünyaya göre üst sınır `[2,4,3,3,2]`'ye çıkarıldı (önceden `[1,3,2,2,1]`). Bölüm 1'de artık 2 ekstra engel var; Bölüm 30 gibi orta seviyelerde 3'e çıkıyor.
- **Görsel ayrım (yeni):** Zor Mod'un eklediği ekstra engeller artık normal engellerden farklı, kırmızı/kiremit tonda (`#3a2430` dolgu, `#ff5f6d` kontur) çiziliyor. `applyHardTrack()` artık ürettiği ekstra engel sayısını `L.hardExtraCount` olarak bölüm verisine kaydediyor; `load()` bunu `hardExtraN`'e aktarıyor, `draw()` da `obstacles` dizisinin son `hardExtraN` elemanını (bunlar her zaman sona ekleniyor) ayrı renkte çiziyor. Böylece oyuncu bir bölümü ilk gördüğü anda, hamle sayısına bakmadan, hangi engellerin Zor Mod'a özel olduğunu görüyor.
- Doğrulama: bağımsız Node scripti ile 100 bölümün tamamında ekstra engel sayısının beklenen değere ulaştığı, hiçbir engelin sınır dışına taşmadığı, ve Zor'un hamle payının Kolay'dan hiçbir bölümde gevşek olmadığı doğrulandı (0 hata). `tools/verify_release.py` → `tools/smoke_test.js` PASS (V5.7.3'te eklenen "easy vs hard tracks differ" testi bu daha sert farkı da onaylıyor). Gerçek tarayıcıda Bölüm 1 ve Bölüm 30'da Kolay/Zor karşılaştırmalı ekran görüntüsü alınarak kırmızı ekstra engellerin doğru göründüğü teyit edildi.

# MAGNET V5.7.3

## Kolay ve Zor artık iki ayrı 100-bölümlük set
- Kullanıcı geri bildirimi: "Evet ekran zor / kolay seçeneği ile açılıyor. Lakin aynı bölümlerle başlıyor. Benim istediğim kolay ve zor ekranı aynı bölümleri kullanmasin... Biri zor olarak başlayıp çok zora doğru gitsin. Diğeri kolay olarak başlayıp zora dogru gitsin." V5.7.1/V5.7.2'de Zor Mod hâlâ tek bir 100-bölümlük seti paylaşıyordu (sadece görünmez katsayılar veya üstüne eklenen aynı-tohum ekstra engellerle); bu geri bildirimle gerçekten iki farklı, bağımsız ilerleyen bölüm seti kuruldu.
- `makeLevel(n, hard)`: artık ikinci bir parametre alıyor. `hard=false` çağrıldığında üretilen 100 bölüm birebir eskisiyle aynı (Kolay = önceki tüm sürümlerdeki temel eğri, geriye dönük uyumlu). `hard=true` olduğunda `applyHardTrack(L,w)` çalışıyor: hamle payı `Math.round(m*0.75)` ile sıkılaştırılıyor, hareketli engel hızı `×1.3` ile artırılıyor, ve `hardExtraObstacles()` ile (artık Öğren dünyası dahil, dünya başına üst sınır `[1,3,2,2,1]`) bölüme kalıcı olarak ekstra engel(ler) ekleniyor — bu üçü de artık **bölüm verisinin kendisinde**, her level yüklemesinde yeniden hesaplanan bir katsayı değil.
- İki ayrı sabit dizi: `easyLevels`/`hardLevels` (her biri 100 bölüm, `qaLevelData()` ikisini de ayrı ayrı doğruluyor). Aktif olan `levels` değişkenine göre değişiyor.
- **Bağımsız ilerleme:** `easyProgress`/`hardProgress` ve `easyLevel`/`hardLevel` artık ayrı ayrı `localStorage`'a kaydediliyor. `setTrack(hard)` fonksiyonu track değişiminde aktif ilerlemeyi doğru yuvaya yazıp diğerini geri yüklüyor — bir sette 47. bölümde olmak diğerini etkilemiyor, birinden diğerine geçmek ilerlemeyi silmiyor. Eski (tek-set) kayıtlar geriye dönük uyumlu şekilde, kaydedildikleri anki `Zor Mod` durumuna göre ilgili sete taşınıyor.
- Karşılama ekranındaki Kolay/Zor seçimi ve Ayarlar → Zor Mod anahtarı artık gerçekten iki farklı bölüm setini birbirine geçiriyor (`setTrack()`); ikisi de anlık olarak `load()` ile ekranı güncelliyor.
- Ölçüm: Bölüm 1'de Kolay `m=3, engel=0` iken Zor `m=2, engel=1`; Bölüm 99'da Kolay `m=16, engel=5, hareket hızı ~2.3` iken Zor `m=12, engel=6, hareket hızı ~3.0`. 100 bölümün hepsinde Zor'un hamle payı Kolay'dan hiç gevşek değil, engel sayısı hiç az değil (bağımsız Node testiyle doğrulandı).
- Doğrulama: `tools/smoke_test.js`'e üç yeni kontrol eklendi — her iki set için `qaLevelData()`, iki setin gerçekten farklı olduğunu doğrulayan karşılaştırma (70+ bölümde daha sıkı hamle payı ve daha fazla engel), ve track değiştirmenin ilerlemeleri karıştırmadığını doğrulayan test. `tools/verify_release.py` → `tools/smoke_test.js` PASS, Java stub derlemesi temiz, gerçek tarayıcıda Kolay/Zor Bölüm 1 karşılaştırmalı ekran görüntüsü ve track değiştirme sonrası ilerlemenin doğru korunduğu doğrulandı.

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
