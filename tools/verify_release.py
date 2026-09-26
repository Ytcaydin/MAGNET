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
assert 'versionCode 36' in (ROOT/'android/app/build.gradle').read_text()
print('PASS structural')
print('ids',len(ids),'refs',len(refs),'version',m.group(1),'sha256',hashlib.sha256(s.encode()).hexdigest())
