const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const s=fs.readFileSync(__dirname+'/3d.html','utf8');
const hit=s.match(/if\(sign>0&&d<\.6&&damageCooldown<=0[^\n]*?if\(hp<=0\)end=true\}/)[0];
function run({mood='spray',flight=5,damageCooldown=0,cool=8,hp=100,sign=1,d=.4}={}){const c=vm.createContext({mood,flight,damageCooldown,cool,hp,sign,d,end:false,$:()=>({value:mood})});vm.runInContext(hit,c);return c}
let c=run();assert.equal(c.hp,80,'spray contact must hurt during flight cooldown');assert.equal(c.cool,8,'damage must not overwrite flight cooldown');assert.equal(c.damageCooldown,1);
c=run({damageCooldown:.5});assert.equal(c.hp,100,'repeat hit blocked');
c=run({mood:'chase'});assert.equal(c.hp,100,'flying avoids ground hit');
c=run({mood:'chase',flight:0});assert.equal(c.hp,80,'grounded chase hit');
c=run({sign:-1});assert.equal(c.hp,100,'shy NPC cannot damage');
c=run({d:1});assert.equal(c.hp,100,'out of range cannot damage');
c=run({hp:10,flight:0});assert.equal(c.hp,0);assert.equal(c.end,true);
assert.ok(s.includes('damageCooldown=Math.max(0,damageCooldown-dt)'));
assert.ok(s.includes('hp=100;cool=0;damageCooldown=0;flight=0'));
console.log('PASS: damage independent of flight cooldown; repeated-hit protection; flying/grounded chase; shy/range; defeat clamp; timer/reset wiring. Uses actual hit clause in VM, not WebGL/device test.');
