import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=fs.readFileSync(new URL('./3d.html',import.meta.url),'utf8');
const script=html.split('<script id="boot-watch">')[1].split('</script>')[0];
function setup(){
 const nodes={'#boot-panel':{hidden:false},'#boot-message':{textContent:'loading'},'#retry-3d':{}},events={};let timeout,reloads=0,cleared=0;
 const c=vm.createContext({document:{querySelector:s=>nodes[s]},location:{reload(){reloads++}},setTimeout(fn,ms){assert.equal(ms,12000);timeout=fn;return 1},clearTimeout(){cleared++},addEventListener(k,fn){events[k]=fn}});
 vm.runInContext(script,c);return {nodes,events,c,timeout,counts:()=>({reloads,cleared})};
}
let x=setup();x.c.gameBoot.ready();assert.equal(x.nodes['#boot-panel'].hidden,true);assert.ok(x.counts().cleared>0);
x.events.error();assert.equal(x.nodes['#boot-panel'].hidden,false);assert.match(x.nodes['#boot-message'].textContent,/失敗/);
x=setup();x.timeout();assert.equal(x.nodes['#boot-panel'].hidden,false);assert.match(x.nodes['#boot-message'].textContent,/尚未完成載入/);
x.c.gameBoot.ready();assert.equal(x.nodes['#boot-panel'].hidden,true,'late successful render dismisses timeout notice');
x=setup();x.events.unhandledrejection();assert.match(x.nodes['#boot-message'].textContent,/模組/);
x.nodes['#retry-3d'].onclick();assert.equal(x.counts().reloads,1);
assert.match(html,/<a href="index.html"[^>]*>開啟 2D 備用版/);
assert.match(html,/#boot-panel\[hidden\]\{display:none\}/);
console.log('PASS: boot ready, runtime error, timeout, late readiness, rejected module promise, reload and 2D fallback markup. VM DOM substitutes; no browser rendering.');
