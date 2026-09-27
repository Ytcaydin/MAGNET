#!/usr/bin/env python3
from pathlib import Path
import re, subprocess, tempfile, zipfile, hashlib, sys
ROOT=Path(__file__).resolve().parents[1]
web=ROOT/'web/index.html'; android=ROOT/'android/app/src/main/assets/index.html'
s=web.read_text(); a=android.read_text()
assert s==a, 'web/android index.html mismatch'
ids=re.findall(r'\bid=["\']([^"\']+)["\']',s); assert len(ids)==len(set(ids)), 'duplicate ids'
refs=set(re.findall(r"\$\(['\"]([^'\"]+)['\"]\)",s)); missing=refs-set(ids); assert not missing, f'missing DOM ids: {sorted(missing)}'
script=re.search(r'<script>([\s\S]*?)</script>',s).group(1)
with tempfile.NamedTemporaryFile('w',suffix='.js',delete=False) as f:
    f.write(script); path=f.name
subprocess.run(['node','--check',path],check=True)
assert 'const levelQA=qaLevelData();' in s and 'refreshPlaytestUI();' in s
m=re.search(r'versionName\s*=?\s*[\'\"]([^\'\"]+)',(ROOT/'android/app/build.gradle').read_text()); assert m
assert 'PLAYTEST_MODE' in s and 'exportPlaytestData' in s and 'levelTuningSummary' in s and 'levelStat' in s
assert 'versionCode 42' in (ROOT/'android/app/build.gradle').read_text()
rv=re.search(r"const RELEASE_VERSION='([^']+)'",s); assert rv and rv.group(1)==m.group(1), f'RELEASE_VERSION {rv and rv.group(1)} != versionName {m.group(1)}'
# RELEASE_VERSION must be declared before any use (startup crashed in 5.4.0 because of this)
assert s.index("const RELEASE_VERSION=") < s.index('RELEASE_VERSION', s.index('<script>')+1) + 1, 'RELEASE_VERSION used before declaration'
assert re.search(r'\nrestore\(\);(?:applyI18n\(\);)?startSoftLaunchSession\(\);', s), 'session start must run right after restore() or it overwrites the save'
subprocess.run(['node',str(ROOT/'tools/smoke_test.js')],check=True)
res=ROOT/'android/app/src/main/res'
assert (res/'mipmap/ic_launcher.xml').exists() and (res/'mipmap-anydpi-v26/ic_launcher.xml').exists(), 'launcher icon missing'
assert 'android:icon="@mipmap/ic_launcher"' in (ROOT/'android/app/src/main/AndroidManifest.xml').read_text(), 'manifest icon not set'
assert (ROOT/'android/app/debug.keystore').exists(), 'fixed debug keystore missing'
mv=re.search(r'VERSION = "([^"]+)"',(ROOT/'android/app/src/main/java/com/magnet/game/MagnetApp.java').read_text()); assert mv and mv.group(1)==m.group(1), 'MagnetApp version mismatch'
print('PASS structural')
print('ids',len(ids),'refs',len(refs),'version',m.group(1),'sha256',hashlib.sha256(s.encode()).hexdigest())
