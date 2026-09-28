#!/usr/bin/env node
// MAGNET solvability test — plays every level of both tracks through the game's real
// physics (headless, Node vm) with a simple path-following "magnet bot":
//   1. plan an A* path on a grid from the active core to its goal (switch first if a gate
//      blocks, else the nearest open target), treating walls/closed gate/unbroken walls as
//      blocked and moving-block sweeps as expensive;
//   2. hold the magnet a few cells ahead of the core along that path;
//   3. re-plan every few frames; if stuck, wiggle.
// The bot knows nothing about portals, belts or lasers (it just gets reset/pushed and
// re-plans), so a level it can finish is comfortably finishable by a person. Move count is
// ignored — this checks that a level can be completed at all, not the 3-star par.
//
// Usage: node tools/solve_test.js            (all 200 levels)
//        node tools/solve_test.js --quick    (every 3rd level + all mechanic levels)
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(process.env.MAGNET_HTML || path.join(__dirname, '..', 'web', 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((x) => x[1]);

function fake(name) {
  const store = Object.create(null);
  return new Proxy(function () {}, {
    get(_t, k) {
      if (k === Symbol.toPrimitive) return (h) => (h === 'string' ? '' : 0);
      if (k === 'then') return undefined;
      if (k in store) return store[k];
      if (k === 'classList') return (store[k] = { add() {}, remove() {}, toggle() {}, contains: () => false });
      if (k === 'style' || k === 'dataset') return (store[k] = {});
      if (k === 'getBoundingClientRect') return () => ({ x: 0, y: 0, left: 0, top: 0, width: 390, height: 708, right: 390, bottom: 708 });
      if (k === 'getContext') return () => fake(name + '.ctx');
      if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop() {} });
      if (k === 'querySelectorAll') return () => [];
      if (typeof k === 'string' && /^(width|height)$/.test(k)) return 390;
      return fake(name + '.' + String(k));
    },
    set(_t, k, v) { store[k] = v; return true; },
    apply() { return fake(name + '()'); },
  });
}
const els = new Map();
const el = (id) => { if (!els.has(id)) els.set(id, fake('#' + id)); return els.get(id); };
const storage = new Map();
const localStorage = { getItem: (k) => (storage.has(k) ? storage.get(k) : null), setItem: (k, v) => storage.set(k, String(v)), removeItem: (k) => storage.delete(k), clear: () => storage.clear() };
storage.set('magnet_started_v3', '1');
const ctx = {
  console, Math, Date, JSON, Number, String, Boolean, Object, Array, Symbol, Map, Set, Promise, Error, TypeError, Float32Array, Int32Array, Uint8Array,
  CanvasRenderingContext2D: function () {}, parseInt, parseFloat, isNaN, isFinite, Intl, Blob: function () {},
  URL: { createObjectURL: () => '', revokeObjectURL() {} }, URLSearchParams,
  document: {
    getElementById: (id) => (ids.includes(id) ? el(id) : null), querySelector: (s) => fake(s),
    querySelectorAll: () => [], createElement: (t) => fake('<' + t + '>'), addEventListener() {},
    body: fake('body'), documentElement: fake('html'), visibilityState: 'visible', hidden: false,
  },
  localStorage, sessionStorage: localStorage,
  navigator: { onLine: true, vibrate: () => true, language: 'en', languages: ['en'] },
  location: { search: '', href: 'file:///x', reload() {} }, performance: { now: () => Date.now() },
  requestAnimationFrame: () => 0, cancelAnimationFrame() {}, setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
  addEventListener() {}, removeEventListener() {}, matchMedia: () => ({ matches: false }), confirm: () => false, alert() {},
  innerWidth: 390, innerHeight: 844, devicePixelRatio: 1,
};
ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(script, ctx);
// Silence persistence/analytics during thousands of simulated frames (they write localStorage every event).
vm.runInContext('track=function(){};save=function(){};', ctx);
// Lets the same bot run against pre-6.0 builds (for regression comparison) that lack these mechanics.
vm.runInContext("if(typeof brk==='undefined'){globalThis.brk=[];globalThis.lasers=[];globalThis.segDist=function(){return 1e9}}", ctx);

const BOT = String.raw`
(function(track, n, maxSec, seed){
  let rs=(seed|0)||1;const rnd=()=>{rs=(rs*1103515245+12345)&0x7fffffff;return rs/0x7fffffff};
  setTrack(track);
  if(typeof n==='string'){dailyReturnLevel=1;levels[DAILY_LEVEL-1]=makeDailyLevel(n);load(DAILY_LEVEL)}else load(n);
  const CELL=12, cols=Math.ceil(W/CELL), rows=Math.ceil(H/CELL), R=13;
  const inRect=(x,y,o,m)=>x>o.x-m&&x<o.x+o.w+m&&y>o.y-m&&y<o.y+o.h+m;
  function grid(ignoreBrk,RR){const R2=RR||R;
    const blk=new Uint8Array(cols*rows), cost=new Float32Array(cols*rows);
    const walls=obstacles.concat(ignoreBrk?[]:brk.filter(o=>o.alive), gate&&!switchOn?[gate]:[]);
    const sweeps=moving.map(o=>o.axis==='x'?{x:o.baseX-o.amp*W,y:o.baseY,w:o.w+2*o.amp*W,h:o.h}:{x:o.baseX,y:o.baseY-o.amp*H,w:o.w,h:o.h+2*o.amp*H});
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x=c*CELL+CELL/2,y=r*CELL+CELL/2,i=r*cols+c;
      if(x<R2-1||y<R2-1||x>W-R2+1||y>H-R2+1||walls.some(o=>inRect(x,y,o,R2))||(!RR&&bumpers.some(bp=>Math.hypot(x-bp.x,y-bp.y)<bp.r+R))){blk[i]=1;continue}
      let k=1;if(walls.some(o=>inRect(x,y,o,R+14)))k+=2;if(sweeps.some(o=>inRect(x,y,o,R)))k+=6;
      if(lasers.some(z=>segDist(x,y,z.ax,z.ay,z.bx,z.by)<R))k+=4;fixed.forEach(f=>{const d=Math.hypot(x-f.x,y-f.y);if(d<90)k+=(f.pol==='pull'?10:4)*(1-d/90)});cost[i]=k}
    return {blk,cost};
  }
  function astar(g,sx,sy,tx,ty){
    const cl=v=>Math.max(0,v);let s=Math.min(rows-1,cl(Math.floor(sy/CELL)))*cols+Math.min(cols-1,cl(Math.floor(sx/CELL)));
    const goal=Math.min(rows-1,cl(Math.floor(ty/CELL)))*cols+Math.min(cols-1,cl(Math.floor(tx/CELL)));
    const N=cols*rows,gs=new Float32Array(N).fill(1e9),from=new Int32Array(N).fill(-1),done=new Uint8Array(N);
    const h=i=>Math.hypot(i%cols-goal%cols,Math.floor(i/cols)-Math.floor(goal/cols));
    const heap=[];const push=(i,f)=>{heap.push([f,i]);let k=heap.length-1;while(k>0){const p=(k-1)>>1;if(heap[p][0]<=heap[k][0])break;[heap[p],heap[k]]=[heap[k],heap[p]];k=p}};
    const pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let k=0;for(;;){const l=2*k+1,r=l+1;let m=k;if(l<heap.length&&heap[l][0]<heap[m][0])m=l;if(r<heap.length&&heap[r][0]<heap[m][0])m=r;if(m===k)break;[heap[m],heap[k]]=[heap[k],heap[m]];k=m}}return top};
    gs[s]=0;push(s,h(s));
    while(heap.length){const [,i]=pop();if(done[i])continue;done[i]=1;if(i===goal)break;const cx=i%cols,cy=Math.floor(i/cols);
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=cols||ny>=rows)continue;const j=ny*cols+nx;if(g.blk[j]&&j!==goal&&Math.max(Math.abs(nx-s%cols),Math.abs(ny-Math.floor(s/cols)))>2)continue; /* a body pressed flush against a wall may step back out */const ng=gs[i]+Math.hypot(dx,dy)*(g.cost[j]||1);if(ng<gs[j]){gs[j]=ng;from[j]=i;push(j,ng+h(j))}}}
    let end=goal;if(from[goal]<0&&goal!==s){if(!g.closest)return null;let bh=1e9;for(let i=0;i<N;i++)if(done[i]&&h(i)<bh){bh=h(i);end=i}if(end===s)return null}const out=[];for(let i=end;i!==-1&&i!==s;i=from[i])out.push([ (i%cols)*CELL+CELL/2, Math.floor(i/cols)*CELL+CELL/2 ]);return out.reverse();
  }
  const dt=1/60,maxSteps=maxSec*60;let pathPts=null,lastBest=1e9,stall=0,wig=0,g=null,gm=null,gKey='',magPath=null,want=null;
  for(let step=0;step<maxSteps;step++){
    if(won)return {ok:true,sec:+(step/60).toFixed(1),moves:0};
    const b=balls.find(x=>!x.done);if(!b)return {ok:true,sec:+(step/60).toFixed(1)};
    const sw=levels[level-1].switch;let goal;
    if(gate&&!switchOn&&sw)goal=[px(sw[0]),py(sw[1])];
    else{let best=null,bd=1e9;targets.forEach(t=>{if(t.filled)return;const d=Math.hypot(t.x-b.x,t.y-b.y);if(d<bd){bd=d;best=t}});goal=[best.x,best.y]}
    if(step%8===0){
      const key=(gate&&!switchOn)+':'+brk.filter(o=>o.alive).length;
      if(key!==gKey){g=grid(false);gm=grid(false,typeof MAG_R==='number'?MAG_R+2:0);gm.closest=true;gKey=key}
      pathPts=astar(g,b.x,b.y,goal[0],goal[1])||astar(grid(true),b.x,b.y,goal[0],goal[1]);
      const d=Math.hypot(goal[0]-b.x,goal[1]-b.y);if(d<lastBest-4){lastBest=d;stall=0}else stall+=8;
      if(stall>360){wig=45;stall=0;lastBest=1e9}
    }
    // where we want the magnet: ahead of the core on its path (or on the goal when close)
    if(pathPts&&pathPts.length<=7)want=goal;else if(pathPts&&pathPts.length)want=pathPts[Math.min(pathPts.length-1,stall>150?2:4)];else want=goal;
    // the magnet is solid (V6.2+): route IT around walls to that point, like a player would drag it
    if(step%8===0&&gm)magPath=astar(gm,magnet.x,magnet.y,want[0],want[1]);
    if(wig>0){wig--;magnet.tx=clamp(magnet.x+(rnd()-.5)*200,28,W-28);magnet.ty=clamp(magnet.y+(rnd()-.5)*200,28,H-28)}
    else if(gm&&magPath&&magPath.length>3){const k=Math.min(magPath.length-1,5);magnet.tx=clamp(magPath[k][0],28,W-28);magnet.ty=clamp(magPath[k][1],28,H-28)}
    else{magnet.tx=clamp(want[0],28,W-28);magnet.ty=clamp(want[1],28,H-28)}
    update(dt);
  }
  return {ok:won,sec:maxSec};
})`;
const run = vm.runInContext(BOT, ctx);
const quick = process.argv.includes('--quick');
const mechLevels = new Set([...Array(12)].map((_, i) => 29 + i).concat([...Array(36)].map((_, i) => 65 + i)));
const fails = [];
let solved = 0, total = 0;
const t0 = Date.now();
for (const track of [false, true]) {
  for (let n = 1; n <= 100; n++) {
    if (quick && n % 3 !== 0 && !mechLevels.has(n)) continue;
    total++;
    // Two attempts with different random wiggles before calling a level unsolvable.
    let r = run(track, n, 75, 1);
    if (!r.ok) r = run(track, n, 120, 2);
    if (!r.ok) r = run(track, n, 120, 3);
    if (r.ok) solved++; else fails.push(`${track ? 'HARD' : 'EASY'}-${n}`);
    if (process.argv.includes('--verbose')) console.log(`${track ? 'HARD' : 'EASY'}-${n}`, r.ok ? `solved in ${r.sec}s sim` : 'UNSOLVED');
  }
}
// Daily levels: 30 days per track (mirrored/re-seeded layouts built from levels 21-95).
for (const track of [false, true]) {
  for (let i = 0; i < (quick ? 10 : 30); i++) {
    const d = new Date(2026, 8, 1 + i * 7), key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    total++;
    let r = run(track, key, 75, 1);
    if (!r.ok) r = run(track, key, 120, 2);
    if (!r.ok) r = run(track, key, 120, 3);
    if (r.ok) solved++; else fails.push(`${track ? 'HARD' : 'EASY'}-daily-${key}`);
  }
}
console.log(`solve_test: ${solved}/${total} levels completed by the bot in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
if (fails.length) { console.log('UNSOLVED: ' + fails.join(' ')); process.exit(1); }
console.log('PASS solvability');
