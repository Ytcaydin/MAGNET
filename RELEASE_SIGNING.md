# MAGNET — Release imzası ve AAB (Google Play)

Google Play yeni uygulamalarda **AAB** (Android App Bundle) ister ve **Play App Signing** kullanır:
sen AAB'yi kendi **yükleme anahtarınla** (upload key) imzalarsın, Google son imzayı kendi anahtarıyla yapar.
Yükleme anahtarı kaybolursa Play Console üzerinden sıfırlatılabilir, ama yine de yedekle.

Repodaki `android/app/debug.keystore` yalnızca debug APK'lar içindir. Play'e **asla** onunla imzalanmış dosya gönderilmez
(CI bunu kontrol eder).

## 1. Yükleme anahtarını oluştur (bir kez, telefonda Termux ile)

```sh
pkg install openjdk-17 git
git clone https://github.com/Ytcaydin/MAGNET
cd MAGNET
sh tools/create_upload_key.sh
```

Betik şifre sorar, `~/magnet-keys/magnet-upload.jks` ve `magnet-upload.b64` dosyalarını üretir ve CircleCI'a girilecek değerleri yazar.

## 2. CircleCI'a gizli değişkenleri ekle

CircleCI → MAGNET projesi → **Project Settings** → **Environment Variables** → **Add Environment Variable**:

| Ad | Değer |
|---|---|
| `MAGNET_UPLOAD_KEYSTORE_B64` | `magnet-upload.b64` dosyasının içeriği (tek satır) |
| `MAGNET_UPLOAD_STORE_PASSWORD` | anahtar şifresi |
| `MAGNET_UPLOAD_KEY_PASSWORD` | anahtar şifresi |
| `MAGNET_UPLOAD_KEY_ALIAS` | `magnet-upload` |

Bu değerler repoya girmez; CircleCI loglarında maskelenir.

## 3. Build

Bir sonraki push'ta CircleCI:
1. Debug APK'yı üretir (`MAGNET-debug.apk`, telefonda test için).
2. Değişkenler tanımlıysa imzalı **`release/app-release.aab`** üretir, imzanın debug anahtarı olmadığını doğrular.
   Değişkenler yoksa bu adım atlanır ve build yine yeşil biter.

Artifacts bölümünden `app-release.aab`'yi indirip Play Console → **Test ve yayın** → önce **Dahili test** kanalına yükle.

## Yerel (Termux) release build — isteğe bağlı

`android/keystore.properties` oluştur (git-ignored):

```properties
MAGNET_UPLOAD_STORE_FILE=/data/data/com.termux/files/home/magnet-keys/magnet-upload.jks
MAGNET_UPLOAD_STORE_PASSWORD=...
MAGNET_UPLOAD_KEY_PASSWORD=...
MAGNET_UPLOAD_KEY_ALIAS=magnet-upload
```

```sh
cd android && ./gradlew :app:bundleRelease
```

## Her yeni sürümde

`android/app/build.gradle` içinde `versionCode` bir artırılmalı (Play aynı versionCode'u iki kez kabul etmez).
`tools/verify_release.py` sürüm eşleşmesini kontrol eder.
