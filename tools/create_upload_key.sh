#!/usr/bin/env sh
# Creates the Google Play UPLOAD key for MAGNET and prints the values to paste
# into CircleCI (Project Settings -> Environment Variables).
# Run on your own device (Termux):  pkg install openjdk-17  then  sh tools/create_upload_key.sh
# The .jks and .b64 files are git-ignored. Keep a backup of the .jks and passwords somewhere safe.
set -eu
OUT_DIR="${1:-$HOME/magnet-keys}"
ALIAS="magnet-upload"
mkdir -p "$OUT_DIR"
JKS="$OUT_DIR/magnet-upload.jks"
if [ -e "$JKS" ]; then echo "ERROR: $JKS already exists; not overwriting." >&2; exit 1; fi

printf 'Anahtar şifresi (en az 8 karakter, bir yere not et): '
stty -echo 2>/dev/null || true; read -r PASS; stty echo 2>/dev/null || true; echo
[ "${#PASS}" -ge 8 ] || { echo "ERROR: şifre en az 8 karakter olmalı" >&2; exit 1; }

keytool -genkeypair -v -keystore "$JKS" -storetype PKCS12 -alias "$ALIAS" \
  -keyalg RSA -keysize 4096 -validity 10000 \
  -storepass "$PASS" -keypass "$PASS" \
  -dname "CN=MAGNET, O=MAGNET, C=TR"

base64 "$JKS" | tr -d '\n' > "$OUT_DIR/magnet-upload.b64"

cat <<EOF

Oluşturuldu: $JKS
CircleCI -> MAGNET projesi -> Project Settings -> Environment Variables bölümüne ekle:

  MAGNET_UPLOAD_KEYSTORE_B64   = $OUT_DIR/magnet-upload.b64 dosyasının içeriği (tek satır)
  MAGNET_UPLOAD_STORE_PASSWORD = (girdiğin şifre)
  MAGNET_UPLOAD_KEY_PASSWORD   = (girdiğin şifre)
  MAGNET_UPLOAD_KEY_ALIAS      = $ALIAS

Base64'ü panoya kopyalamak için (Termux:API kuruluysa):
  termux-clipboard-set < "$OUT_DIR/magnet-upload.b64"

ÖNEMLİ: $JKS dosyasını ve şifreyi güvenli bir yere yedekle (ör. Google Drive'da şifreli klasör).
EOF
