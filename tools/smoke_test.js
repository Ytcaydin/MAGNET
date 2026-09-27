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
    querySelectorAll: (sel) => (sel.startsWith('#') ? [el(sel.slice(1))] : []),
    createElement: (t) => fake('<' + t + '>'),
    addEventListener: (n, f) => { (listeners['doc:' + n] = listeners['doc:' + n] || []).push(f); },
    body: fake('body'), documentElement: fake('html'), visibilityState: 'visible', hidden: false,
  };
  const ctx = {
    console, Math, Date, JSON, Number, String, Boolean, Object, Array, Symbol, Map, Set, WeakMap, Promise,
    Error, TypeError, RangeError, CanvasRenderingContext2D: function CanvasRenderingContext2D() {}, HTMLCanvasElement: function HTMLCanvasElement() {}, parseInt, parseFloat, isNaN, isFinite, Intl, Blob: function () {},
    URL: { createObjectURL: () => 'blob:x', revokeObjectURL() {} },
    URLSearchParams, document: doc, localStorage, sessionStorage: localStorage,
    navigator: { onLine: true, vibrate: () => true, userAgent: 'smoke', serviceWorker: undefined },
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

function run(label) {
  rafQueue = []; timers.length = 0;
  const context = makeContext();
  guard(label + ' startup', () => vm.runInContext(script, context, { filename: 'index.html<script>' }));
  frames(5);
  return context;
}

// 1) Cold start
let c = run('cold');
// 2) Click every button with a handler (skip destructive reset/export)
const skip = /reset|export/i;
for (const id of ids) {
  if (skip.test(id)) continue;
  const h = el(id).onclick;
  if (typeof h === 'function') { guard('click #' + id, () => h({ preventDefault() {}, stopPropagation() {} })); frames(2); flushTimers(); }
}
// 3) Level loading + win flow
guard('levels', () => vm.runInContext('for(let i=1;i<=100;i++){load(i)} load(3); win();', c));
frames(3); flushTimers();
const savedLevel = JSON.parse(localStorage.getItem('magnet_save') || '{}').level;
// 4) Pause/resume hooks called by MainActivity
guard('pause/resume', () => vm.runInContext('window.MAGNET_APP_PAUSE&&MAGNET_APP_PAUSE();window.MAGNET_APP_RESUME&&MAGNET_APP_RESUME();', c));
// 5) Warm start: progress must survive a relaunch
c = run('warm');
let restoredLevel;
guard('restore', () => { restoredLevel = vm.runInContext('level', c); });
if (savedLevel && restoredLevel !== savedLevel) errors.push(`save/restore: saved level ${savedLevel}, restored ${restoredLevel} (progress lost on launch)`);

if (errors.length) { console.error('FAIL runtime smoke test'); errors.forEach((e) => console.error(' - ' + e)); process.exit(1); }
console.log(`PASS runtime smoke test (ids ${ids.length}, saved level ${savedLevel}, restored ${restoredLevel})`);
