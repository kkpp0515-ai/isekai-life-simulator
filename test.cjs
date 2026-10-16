const assert=require('node:assert/strict');
const G=require('./engine.js');
let seed=123456;const rng=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
assert.equal(G.events.length,36);G.stages.forEach((_,i)=>assert.equal(G.events.filter(e=>e.stage===i).length,6));
let dead=0,old=0,jobs=new Set(),races=new Set(),families=new Set(),talents=new Set();
for(let n=0;n<10000;n++){let s=G.birth(rng);races.add(s.race);families.add(s.family);talents.add(s.talent);let count=0;while(!s.ended){assert(count++<7);let index=Math.floor(rng()*3);G.choose(s,index,rng);assert(s.pending);assert(Object.values(s.stats).every(v=>Number.isFinite(v)&&v>=0&&v<=100));for(let k of ['wealth','happy','health','fame'])assert(s[k]>=0&&s[k]<=100);const copy=JSON.stringify(s);G.choose(s,0,rng);assert.equal(JSON.stringify(s),copy,'duplicate choice blocked');s.pending=false;}assert(s.step<=6);assert(s.age>0);assert(G.ending(s).text.length>50);jobs.add(s.job);s.cause==='天寿を迎えて'?old++:dead++;}
assert.equal(races.size,4);assert.equal(families.size,4);assert.equal(talents.size,4);assert(jobs.size>=6);assert(dead>0&&old>0);
// Safe lives reach old age regardless of initial power.
for(let n=0;n<100;n++){let s=G.birth(rng);while(!s.ended){G.choose(s,2,rng);s.pending=false;}assert.equal(s.cause,'天寿を迎えて');}
console.log(JSON.stringify({simulated:10100,events:G.events.length,prematureDeaths:dead,naturalLifespans:old,jobs:[...jobs],passed:true},null,2));


