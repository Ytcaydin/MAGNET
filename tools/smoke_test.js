#!/usr/bin/env node
// MAGNET runtime smoke test — runs the game script in a stubbed browser
// environment with Node's vm module (no npm dependencies).
// Fails on any ReferenceError/TypeError during startup, frame loop,
// button handlers, level loading, win flow, or save/restore.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'web', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: no inline <script> found'); process.exit(1); }
const script = m[1];
const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(x => x[1]);
// Ids of elements carrying a given class, so the fake DOM can resolve class selectors
// (e.g. document.querySelectorAll('.overlay')) used by closeAll().
function idsWithClass(cls) {
  const out = [];
  const re = /<[a-zA-Z0-9]+\b([^>]*)>/g;
  let mm;
  while ((mm = re.exec(html))) {
    const tag = mm[1];
    const classMatch = tag.match(/\bclass=["']([^"']*)["']/);
    if (!classMatch || !classMatch[1].split(/\s+/).includes(cls)) continue;
    const idMatch = tag.match(/\bid=["']([^"']+)["']/);
    if (idMatch) out.push(idMatch[1]);
  }
  return out;
}
const overlayIds = idsWithClass('overlay');

function fake(name) {
  const store = Object.create(null);
  const target = function () {};
  return new Proxy(target, {
    get(_t, k) {
      if (k === Symbol.toPrimitive) return (hint) => (hint === 'string' ? '' : 0);
      if (k === 'then') return undefined;
      if (k in store) return store[k];
      if (k === 'classList') return (store[k] = { add() {}, remove() {}, toggle() {}, contains: () => false });
      if (k === 'style' || k === 'dataset') return (store[k] = {});
      if (k === 'children' || k === 'childNodes') return [];
      if (k === 'getBoundingClientRect') return () => ({ x: 0, y: 0, left: 0, top: 0, width: 390, height: 708, right: 390, bottom: 708 });
      if (k === 'getContext') return () => fake(name + '.ctx');
      if (k === 'measureText') return () => ({ width: 10 });
      if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop() {} });
      if (k === 'querySelectorAll') return () => [];
      if (typeof k === 'string' && /^(width|height|clientWidth|clientHeight|offsetWidth|offsetHeight)$/.test(k)) return 390;
      return fake(name + '.' + String(k));
    },
    set(_t, k, v) { store[k] = v; return true; },
    apply() { return fake(name + '()'); },
  });
}

const elements = new Map();
const el = (id) => { if (!elements.has(id)) elements.set(id, fake('#' + id)); return elements.get(id); };
ids.forEach(el);

const storage = new Map();
const localStorage = {
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
  clear: () => storage.clear(),
};

let rafQueue = [];
const timers = [];
const listeners = {};
function makeContext() {
  const doc = {
    getElementById: (id) => (ids.includes(id) ? el(id) : null),
    querySelector: (sel) => (sel.startsWith('#') && ids.includes(sel.slice(1)) ? el(sel.slice(1)) : fake(sel)),
    querySelectorAll: (sel) => (sel.startsWith('#') ? [el(sel.slice(1))] : sel === '.overlay' ? overlayIds.map(el) : []),
    createElement: (t) => fake('<' + t + '>'),
    addEventListener: (n, f) => { (listeners['doc:' + n] = listeners['doc:' + n] || []).push(f); },
    body: fake('body'), documentElement: fake('html'), visibilityState: 'visible', hidden: false,
  };
  const ctx = {
    console, Math, Date, JSON, Number, String, Boolean, Object, Array, Symbol, Map, Set, WeakMap, Promise,
    Error, TypeError, RangeError, CanvasRenderingContext2D: function CanvasRenderingContext2D() {}, HTMLCanvasElement: function HTMLCanvasElement() {}, parseInt, parseFloat, isNaN, isFinite, Intl, Blob: function () {},
    URL: { createObjectURL: () => 'blob:x', revokeObjectURL() {} },
    URLSearchParams, document: doc, localStorage, sessionStorage: localStorage,
    navigator: { onLine: true, vibrate: () => true, userAgent: 'smoke', serviceWorker: undefined, language: currentLang, languages: [currentLang] },
    location: { search: '', href: 'file:///android_asset/index.html', protocol: 'file:', reload() {} },
    performance: { now: () => Date.now() },
    requestAnimationFrame: (f) => { rafQueue.push(f); return rafQueue.length; },
    cancelAnimationFrame() {},
    setTimeout: (f) => { timers.push(f); return timers.length; }, clearTimeout() {},
    setInterval: () => 0, clearInterval() {},
    addEventListener: (n, f) => { (listeners['win:' + n] = listeners['win:' + n] || []).push(f); },
    removeEventListener() {}, matchMedia: () => ({ matches: false, addEventListener() {} }),
    confirm: () => false, alert() {}, innerWidth: 390, innerHeight: 844, devicePixelRatio: 2,
    AudioContext: undefined, webkitAudioContext: undefined, visualViewport: undefined,
  };
  ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
  return vm.createContext(ctx);
}

const errors = [];
function guard(label, fn) { try { fn(); } catch (e) { errors.push(`${label}: ${e && e.name}: ${e && e.message}`); } }
function frames(n) { for (let i = 0; i < n; i++) { const q = rafQueue; rafQueue = []; q.forEach((f) => guard('frame', () => f(Date.now() + i * 16))); } }
function flushTimers() { for (let i = 0; i < 3; i++) { const q = timers.splice(0); q.forEach((f) => guard('timer', () => typeof f === 'function' && f())); } }

let currentLang = 'tr-TR';
function run(label, lang) {
  currentLang = lang || 'tr-TR';
  rafQueue = []; timers.length = 0;
  const context = makeContext();
  guard(label + ' startup', () => vm.runInContext(script, context, { filename: 'index.html<script>' }));
  frames(5);
  return context;
}

// 1) Cold start
let c = run('cold');
// 1b) All 100 hand-authored levels must pass the game's own geometry QA (qaLevelData()),
// not just "doesn't throw" — a level with an out-of-bounds obstacle/magnet/gate/mover
// would otherwise pass every other check here and only be caught by eyeballing a screenshot.
guard('level geometry QA', () => {
  const okEasy = vm.runInContext('qaLevelData(easyLevels)', c);
  const okHard = vm.runInContext('qaLevelData(hardLevels)', c);
  if (!okEasy) errors.push('qaLevelData(easyLevels) reported invalid level geometry (see console output above)');
  if (!okHard) errors.push('qaLevelData(hardLevels) reported invalid level geometry (see console output above)');
});
// 1c) Easy and Hard must actually be two different tracks, not the same 100 levels with a flag:
// Hard should have a tighter (or equal, for the untouched tutorial world) move limit and, from world 1
// onward, at least as many obstacle blocks as Easy on every level, with some levels strictly harder.
guard('easy vs hard tracks differ', () => {
  const r = vm.runInContext(`(()=>{
    let tighterM=0, moreObstacles=0, anyLooserM=false, anyFewerObstacles=false;
    for(let i=0;i<100;i++){
      const e=easyLevels[i], h=hardLevels[i];
      if(h.m<e.m) tighterM++;
      if(h.m>e.m) anyLooserM=true;
      if(h.o.length>e.o.length) moreObstacles++;
      if(h.o.length<e.o.length) anyFewerObstacles=true;
    }
    return [tighterM,moreObstacles,anyLooserM,anyFewerObstacles].join(',');
  })()`, c);
  const [tighterM, moreObstacles, anyLooserM, anyFewerObstacles] = r.split(',');
  if (anyLooserM !== 'false') errors.push('hard track has a looser move limit than easy on some level: ' + r);
  if (anyFewerObstacles !== 'false') errors.push('hard track has fewer obstacles than easy on some level: ' + r);
  if (Number(tighterM) < 70) errors.push('hard track move limit not meaningfully tighter than easy: ' + r);
  if (Number(moreObstacles) < 70) errors.push('hard track does not add visible extra obstacles on most levels: ' + r);
});
// 1d) Hard track must also load/play cleanly across all 100 levels, own progress from the easy track's.
guard('hard track levels + independent progress', () => {
  const r = vm.runInContext(`(()=>{
    setTrack(true);for(let i=1;i<=100;i++){load(i)} load(3);win();
    const hardHas3=!!progress[3];
    setTrack(false);
    const easyHas3=!!progress[3];
    return [hardHas3,easyHas3].join(',');
  })()`, c);
  if (r !== 'true,false') errors.push('easy/hard tracks are not keeping independent progress: ' + r);
});
// 1e) Regression guard for a reported exploit: Hard track's extra obstacles used to be scattered off to
// one side, leaving the whole border open as a "go around everything" corridor — a single straight pull
// from start toward the target won instantly without ever being blocked. Simulate that exact single-drag
// shortcut (aim the magnet straight at the target and hold) on several early Hard levels and require that
// none of them win outright — the obstacles must actually sit in the direct path now.
guard('hard track obstacles block the straight-line shortcut', () => {
  const r = vm.runInContext(`(()=>{
    setTrack(true);
    const results=[];
    for(const lvl of [1,3,5,10,21,30]){
      load(lvl);
      const t=targets[0];
      magnet.tx=t.x; magnet.ty=t.y;
      for(let i=0;i<400;i++) update(0.016);
      results.push(lvl+':'+won);
    }
    setTrack(false);
    return results.join(',');
  })()`, c);
  if (/:true/.test(r)) errors.push('hard track: a single straight drag toward the target wins without detouring around any obstacle (' + r + ')');
});
// 1f) V6.0 mechanics behave as designed (portal, laser, belt, breakable wall, polarity flip).
guard('v6 mechanics physics', () => {
  const r = vm.runInContext(`(()=>{
    const o={};setTrack(false);
    load(72);{const pp=portals[0],b=balls[0];b.x=pp.a.x;b.y=pp.a.y;b.vx=80;b.vy=0;b.cd=0;mechanicsStep(b,1/60);o.portal=!!pp&&Math.hypot(b.x-pp.b.x,b.y-pp.b.y)<70&&b.cd>0}
    load(90);{const z=lasers[0],b=balls[0];time=0;b.x=(z.ax+z.bx)/2;b.y=(z.ay+z.by)/2;b.cd=0;mechanicsStep(b,1/60);o.laser=b.x===b.sx&&b.y===b.sy}
    load(90);{const z=lasers[0],b=balls[0];time=z.on+.1;b.x=(z.ax+z.bx)/2;b.y=(z.ay+z.by)/2;mechanicsStep(b,1/60);o.laserOff=b.x!==b.sx}
    load(66);{const bt=belts[0],b=balls[0];b.x=bt.x+bt.w/2;b.y=bt.y+bt.h/2;b.vx=b.vy=0;b.cd=1;mechanicsStep(b,.1);o.belt=Math.hypot(b.vx,b.vy)>40}
    const hit=(v)=>{load(33);const w=brk[0],b=balls[0];b.cd=1;if(w.w<w.h){b.x=w.x-b.r+3;b.y=w.y+w.h/2;b.vx=v;b.vy=0}else{b.y=w.y-b.r+3;b.x=w.x+w.w/2;b.vy=v;b.vx=0}mechanicsStep(b,1/60);return w.alive};
    o.breakFast=hit(700)===false;o.breakSlow=hit(80)===true;
    load(45);magnet.pol=1;togglePolarity();o.pol=magnet.pol===-1;togglePolarity();o.pol2=magnet.pol===1;
    load(5);togglePolarity();o.polLocked=magnet.pol===1;
    return Object.entries(o).filter(([k,v])=>!v).map(([k])=>k).join(',');
  })()`, c);
  if (r) errors.push('v6 mechanics misbehave: ' + r);
});
// 2) Click every button with a handler (skip destructive reset/export)
// hardBtn is skipped here because it now persistently switches the active track (own progress/level
// bookmark), which would make every later test's assumption of "we're on the easy track" order-dependent;
// track switching itself is covered explicitly above.
const skip = /reset|export|hardBtn/i;
for (const id of ids) {
  if (skip.test(id)) continue;
  const h = el(id).onclick;
  if (typeof h === 'function') { guard('click #' + id, () => h({ preventDefault() {}, stopPropagation() {} })); frames(2); flushTimers(); }
}
// 3) Level loading + win flow
guard('levels', () => vm.runInContext('for(let i=1;i<=100;i++){load(i)} load(3); win();', c));
frames(3); flushTimers();
const savedLevel = JSON.parse(localStorage.getItem('magnet_save') || '{}').easyLevel;
// 4) Pause/resume hooks called by MainActivity
guard('pause/resume', () => vm.runInContext('window.MAGNET_APP_PAUSE&&MAGNET_APP_PAUSE();window.MAGNET_APP_RESUME&&MAGNET_APP_RESUME();', c));
// 5) Warm start: progress must survive a relaunch
c = run('warm');
let restoredLevel;
guard('restore', () => { restoredLevel = vm.runInContext('level', c); });
if (savedLevel && restoredLevel !== savedLevel) errors.push(`save/restore: saved level ${savedLevel}, restored ${restoredLevel} (progress lost on launch)`);

// 6) Android back button contract: always handled, closes overlays, then asks to quit
guard('back button', () => {
  const r = vm.runInContext(`closeAll();open('settingsOverlay');const a=MAGNET_BACK()&&isOpen('menuOverlay');const b=MAGNET_BACK()&&!isOpen('menuOverlay');const c2=MAGNET_BACK()&&isOpen('exitOverlay');const d=MAGNET_BACK()&&!isOpen('exitOverlay');[a,b,c2,d].join(',')`, c);
  if (r !== 'true,true,true,true') errors.push('back button: unexpected overlay flow ' + r);
});

// 7) Daily level: 400 days generate valid geometry, deterministic, completing it never corrupts the saved level
guard('daily level', () => {
  const r = vm.runInContext(`(()=>{let bad=0;for(let i=0;i<400;i++){const d=new Date(2026,0,1);d.setDate(d.getDate()+i);const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');const L=makeDailyLevel(k);const inb=v=>v>0&&v<1;const ok=inb(L.start[0])&&inb(L.start[1])&&inb(L.target[0])&&inb(L.target[1])&&L.o.every(o=>o[0]>=0&&o[1]>=0&&o[0]+o[2]<=1.0001&&o[1]+o[3]<=1.0001)&&L.moving.every(m=>m.p[0]-m.amp>=-1e-6&&m.p[0]+m.amp+m.w<=1.0001&&m.p[1]-m.amp>=-1e-6&&m.p[1]+m.amp+m.h<=1.0001)&&(L.balls||[]).every(p=>inb(p[0])&&inb(p[1]))&&(L.targets||[]).every(p=>inb(p[0])&&inb(p[1]));if(!ok)bad++}
    const det=JSON.stringify(makeDailyLevel('2026-09-27'))===JSON.stringify(makeDailyLevel('2026-09-27'));
    for(let i=1;i<=12;i++)progress[i]={stars:3,best:3};load(12);startDaily();const wasDaily=level===DAILY_LEVEL;win();const saved=JSON.parse(localStorage.getItem('magnet_save')).easyLevel;const ds=dailyState();$('nextBtn').onclick();
    return [bad,det,wasDaily,saved,ds.streak,level].join(',')})()`, c);
  if (r !== '0,true,true,12,1,12') errors.push('daily level: ' + r + ' (expected 0,true,true,12,1,12)');
});

// 8) i18n: every data-i18n key and every t('key') literal exists in both languages; English auto-detected
const htmlKeys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((x) => x[1]);
const jsKeys = [...script.matchAll(/\bt\('([a-z0-9_]+)'\s*[,)]/g)].map((x) => x[1])
  .concat([...script.matchAll(/\bt\(\w+\?'([a-z0-9_]+)':'([a-z0-9_]+)'\)/g)].flatMap((x) => [x[1], x[2]]))
  .concat([...((script.match(/TUTORIAL_KEYS=\{([^}]*)\}/) || [])[1] || '').matchAll(/'([a-z0-9_]+)'/g)].map((x) => x[1]))
  .concat(['w0', 'w1', 'w2', 'w3', 'w4']);
guard('i18n keys', () => {
  const missing = vm.runInContext(`(k)=>k.filter(x=>!I18N[x]||!I18N[x][0]||!I18N[x][1])`, c)([...new Set([...htmlKeys, ...jsKeys])]);
  if (missing.length) errors.push('i18n: missing keys ' + missing.join(', '));
});
storage.clear();
const en = run('english', 'en-US');
guard('english', () => {
  const r = vm.runInContext(`LANG+'|'+t('start')+'|'+t('w2')`, en);
  if (r !== 'en|START|POLES') errors.push('english auto-detect: ' + r);
});

if (errors.length) { console.error('FAIL runtime smoke test'); errors.forEach((e) => console.error(' - ' + e)); process.exit(1); }
console.log(`PASS runtime smoke test (ids ${ids.length}, saved level ${savedLevel}, restored ${restoredLevel})`);
