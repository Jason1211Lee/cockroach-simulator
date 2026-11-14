import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=fs.readFileSync(new URL('./3d.html',import.meta.url),'utf8');
const events={},elements=new Map();let renders=0,scheduled;
function element(id){if(!elements.has(id))elements.set(id,{value:id==='#role'?'roach':id==='#type'?'fast':'shy',textContent:'',style:{},handlers:{},addEventListener(k,f){(this.handlers[k]??=[]).push(f)},setPointerCapture(){},getBoundingClientRect(){return {left:0,top:0,width:120,height:120}},fire(k,e){for(const f of this.handlers[k]??[])f(e);this['on'+k]?.(e)}});return elements.get(id)}
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);ids.forEach(id=>element('#'+id));
const document={querySelector(s){assert.ok(elements.has(s),'missing DOM id '+s);return element(s)},querySelectorAll(){return []},addEventListener(k,f){(events[k]??=[]).push(f)},body:{append(){}}};
class Vector{constructor(x=0,y=0,z=0){this.set(x,y,z)}set(x,y,z){Object.assign(this,{x,y,z});return this}}
class Object3D{constructor(){this.position=new Vector();this.scale=new Vector(1,1,1);this.rotation={x:0,y:0,z:0};this.children=[]}add(x){this.children.push(x)}remove(x){this.children=this.children.filter(v=>v!==x)}setFromPoints(){return this}lookAt(){}updateProjectionMatrix(){}}
class Renderer{constructor(){this.domElement=element('canvas')}setPixelRatio(){}setSize(){}render(){renders++}}
const T=new Proxy({Vector3:Vector,WebGLRenderer:Renderer,MathUtils:{damp:(a,b,k,dt)=>b+(a-b)*Math.exp(-k*dt)}},{get:(o,k)=>o[k]??Object3D});
let code=html.split('<script type="module">')[1].split('</script>')[0];const globals={T};
for(const m of code.matchAll(/import \{([^}]+)\} from '([^']+)';/g)){const exports=await import(new URL(m[2],import.meta.url));for(const name of m[1].split(',').map(v=>v.trim())){assert.ok(exports[name]!==undefined,name+' export missing');globals[name]=exports[name]}}
code=code.replace(/^import .*;$/gm,'');
const c=vm.createContext({...globals,document,innerWidth:844,innerHeight:390,devicePixelRatio:2,performance:{now:()=>0},requestAnimationFrame:f=>scheduled=f,addEventListener(k,f){(events[k]??=[]).push(f)},console});
vm.runInContext(code,c);const read=s=>vm.runInContext(s,c);let now=0;
function frames(n){for(let i=0;i<n;i++){now+=16;scheduled(now)}}
function event(k,e={}){for(const fn of events[k]??[])fn(e)}
assert.equal(read('hp'),100);assert.equal(read('foods.length'),3);assert.ok(scheduled);

element('#scare').onclick();assert.equal(read('progress.xp'),0,'distant scare gives no XP');
read('human.position.set(roach.position.x+.5,0,roach.position.z)');
element('#scare').onclick();assert.equal(read('progress.xp'),20);
element('#scare').onclick();assert.equal(read('progress.xp'),20,'scare reward only once');
read('roach.position.set(foods[0].position.x,0,foods[0].position.z)');frames(1);
assert.equal(read('progress.xp'),30);assert.equal(read('growthStats(progress.xp).level'),2);
assert.equal(read('growthStats(progress.xp).strength'),2);
assert.match(element('#status').textContent,/Lv 2 · XP 30 · 力量 2/);
frames(3);assert.equal(read('progress.xp'),30,'collected food cannot reward twice');
function walkSample(){
 read('roach.position.set(-4,0,3);roach.rotation.y=0');
 event('keydown',{key:'w',code:'KeyW'});frames(10);event('keyup',{key:'w'});
 return 3-read('roach.position.z');
}
const grownDistance=walkSample();
read('roach.position.set(largeFood.position.x,0,largeFood.position.z)');
element('#carry').onclick();assert.equal(read('carrying'),true);
const carryDistance=walkSample();
assert.ok(Math.abs(carryDistance/grownDistance-.8)<1e-9,'carrying reduces actual movement by 20%');
element('#act').onclick();assert.equal(read('flight'),0);assert.match(element('#feedback').textContent,/搬運時/);
element('#carry').onclick();assert.equal(read('carrying'),false);
element('#reset').onclick();assert.equal(read('progress.xp'),0);assert.equal(read('progress.claimed.size'),0);
const baseDistance=walkSample();assert.ok(Math.abs(grownDistance/baseDistance-1.1)<1e-9,'level 2 moves 10% farther');
element('#mood').value='chase';element('#mood').onchange();
read('human.position.set(roach.position.x+.5,0,roach.position.z)');element('#scare').onclick();assert.equal(read('progress.xp'),0);
element('#mood').value='shy';element('#mood').onchange();

element('#act').onclick();assert.match(element('#feedback').textContent,/不能飛行/);frames(3);assert.match(element('#feedback').textContent,/不能飛行/);
event('keydown',{key:'ArrowUp',code:'ArrowUp',preventDefault(){}});frames(20);event('keyup',{key:'ArrowUp'});assert.ok(read('roach.position.z')<3);assert.ok(renders>=20);
element('#type').value='fly';element('#type').onchange();element('#act').onclick();assert.equal(read('flight'),5);assert.match(element('#feedback').textContent,/起飛/);frames(20);assert.ok(read('roach.position.y')>.4);
const old=read('altitude');element('#rise').onclick();assert.ok(read('altitude')>old);element('#lower').onclick();assert.equal(read('altitude'),old);
element('#act').onclick();assert.equal(read('flight'),0);assert.match(element('#feedback').textContent,/降落/);element('#act').onclick();assert.match(element('#feedback').textContent,/冷卻/);frames(100);assert.ok(read('roach.position.y')<.01);
element('canvas').fire('pointerdown',{button:0,pointerId:8,clientX:0,clientY:0});element('canvas').fire('pointermove',{pointerId:8,clientX:80,clientY:20});assert.notEqual(read('yaw'),0);
element('#pad').fire('pointerdown',{pointerId:9,clientX:105,clientY:60});assert.ok(read('axis.x')>0);event('visibilitychange');assert.equal(read('axis.x'),0);assert.equal(read('lookPointer'),null);
element('#type').value='fly';element('#type').onchange();element('#act').onclick();
element('#pause').onclick();assert.equal(read('paused'),true);
const frozen=read('JSON.stringify([roach.position.x,roach.position.y,roach.position.z,human.position.x,human.position.z,hp,cool,flight,score])');
const pausedControls=read('JSON.stringify([altitude,yaw,pitch,axis,Array.from(keys),pointer,lookPointer])');
for(const id of ['#act','#rise','#lower','#left','#right']){
 element(id).onclick();
 assert.equal(read('JSON.stringify([altitude,yaw,pitch,axis,Array.from(keys),pointer,lookPointer])'),pausedControls,id+' must not change paused controls');
}
event('keydown',{key:'w',code:'KeyW'});
element('#pad').fire('pointerdown',{pointerId:21,clientX:105,clientY:60});
element('#pad').fire('pointermove',{pointerId:21,clientX:60,clientY:15});
element('canvas').fire('pointerdown',{button:0,pointerId:22,clientX:0,clientY:0});
element('canvas').fire('pointermove',{pointerId:22,clientX:80,clientY:20});
frames(40);
assert.equal(read('JSON.stringify([altitude,yaw,pitch,axis,Array.from(keys),pointer,lookPointer])'),pausedControls,'paused controls must not accumulate direction, altitude or camera changes');
assert.equal(read('JSON.stringify([roach.position.x,roach.position.y,roach.position.z,human.position.x,human.position.z,hp,cool,flight,score])'),frozen);
const resumePosition=read('JSON.stringify([roach.position.x,roach.position.z])');
element('#pause').onclick();frames(2);assert.ok(read('flight')<5);
assert.equal(read('JSON.stringify([roach.position.x,roach.position.z])'),resumePosition,'resume must not move from input pressed while paused');
event('keydown',{key:'w',code:'KeyW'});frames(4);event('keyup',{key:'w'});
assert.notEqual(read('JSON.stringify([roach.position.x,roach.position.z])'),resumePosition,'fresh input must work after resume');
document.hidden=true;event('visibilitychange');assert.equal(read('paused'),true);document.hidden=false;event('visibilitychange');assert.equal(read('paused'),true);
element('#reset').onclick();assert.equal(read('paused'),false);
element('#role').value='human';element('#role').onchange();element('#act').onclick();assert.match(element('#feedback').textContent,/距離/);read('roach.position.set(human.position.x,0,human.position.z)');element('#act').onclick();assert.equal(read('score'),1);assert.match(element('#feedback').textContent,/命中/);element('#act').onclick();assert.match(element('#feedback').textContent,/冷卻/);
element('#reset').onclick();assert.equal(read('score'),0);assert.equal(read('hp'),100);assert.equal(read('foods.length'),3);assert.equal(read('cool'),0);

// Exercise all archetypes through collection, delivery, victory and restart.
element('#role').value='roach';element('#mood').value='shy';
for(const type of ['fast','agile','fly']){
 element('#type').value=type;element('#type').onchange();
 read('roach.position.set(largeFood.position.x,0,largeFood.position.z)');
 element('#carry').onclick();assert.equal(read('carrying'),false);assert.match(element('#feedback').textContent,/力量 2/);
 read('human.position.set(roach.position.x+.5,0,roach.position.z)');
 element('#scare').onclick();
 for(let i=0;i<3;i++){read('roach.position.set(foods[0].position.x,0,foods[0].position.z)');frames(1);}
 assert.equal(read('score'),3);assert.equal(read('end'),false,'food alone must not end before large delivery');
 assert.equal(read('progress.xp'),50);
 read('roach.position.set(largeFood.position.x,0,largeFood.position.z)');
 if(type==='fly'){
  element('#act').onclick();element('#carry').onclick();assert.equal(read('carrying'),false,'cannot pick up during takeoff');
  element('#act').onclick();frames(100);
 }
 element('#carry').onclick();assert.equal(read('carrying'),true);
 element('#pause').onclick();element('#carry').onclick();assert.equal(read('carrying'),true,'pause blocks drop');
 element('#pause').onclick();
 read('roach.position.set(2,0,3)');element('#carry').onclick();assert.equal(read('carrying'),false);
 assert.equal(read('largeDelivered'),false);assert.equal(read('progress.xp'),50,'drop gives no reward');
 element('#carry').onclick();assert.equal(read('carrying'),true,'can pick up dropped food');
 read('roach.position.set(-4,0,3)');element('#carry').onclick();
 assert.equal(read('largeDelivered'),true);assert.equal(read('carrying'),false);
 assert.equal(read('progress.xp'),80);assert.equal(read('growthStats(progress.xp).level'),3);
 assert.equal(read('end'),true);
 element('#carry').onclick();frames(3);assert.equal(read('progress.xp'),80,'delivery reward once');
 element('#reset').onclick();assert.equal(read('carrying'),false);assert.equal(read('largeDelivered'),false);assert.equal(read('progress.xp'),0);
}
element('#mood').value='chase';element('#mood').onchange();
for(let i=0;i<3;i++){read('roach.position.set(foods[0].position.x,0,foods[0].position.z)');frames(1);}
assert.equal(read('progress.xp'),30,'non-shy route can upgrade without scare');
read('roach.position.set(largeFood.position.x,0,largeFood.position.z)');element('#carry').onclick();assert.equal(read('carrying'),true);
read('roach.position.set(-4,0,3)');element('#carry').onclick();
assert.equal(read('progress.xp'),60);assert.equal(read('end'),true,'no scare required to win');
element('#role').value='human';element('#role').onchange();read('roach.position.set(largeFood.position.x,0,largeFood.position.z)');element('#carry').onclick();assert.equal(read('carrying'),false,'human cannot use roach delivery');

element('#role').value='roach';element('#type').value='fast';element('#mood').value='chase';
function chaseSetup(){element('#reset').onclick();read('human.position.set(roach.position.x+.5,0,roach.position.z)');frames(1);}
chaseSetup();assert.equal(read('chaseAttack.phase'),'windup');assert.equal(read('hp'),100);assert.equal(read('attackMarker.visible'),true);
assert.match(element('#threat').textContent,/拖鞋預警/);
const attackPosition=read('JSON.stringify(human.position)');frames(20);assert.equal(read('hp'),100);
assert.equal(read('JSON.stringify(human.position)'),attackPosition,'NPC stands still during windup');
element('#pause').onclick();const frozenAttack=read('JSON.stringify(chaseAttack)');frames(50);
assert.equal(read('JSON.stringify(chaseAttack)'),frozenAttack);assert.equal(read('hp'),100);
element('#pause').onclick();frames(18);assert.equal(read('hp'),80,'one strike after warning');frames(50);assert.equal(read('hp'),80,'recovery cannot hit again');
chaseSetup();const fixedTarget=read('JSON.stringify(chaseAttack.target)');
read('roach.position.z-=1');frames(40);assert.equal(read('hp'),100,'leaving fixed target evades');
assert.equal(read('JSON.stringify(chaseAttack.target)'),fixedTarget);
element('#type').value='fly';chaseSetup();element('#act').onclick();frames(40);
assert.ok(read('roach.position.y')>.5);assert.equal(read('hp'),100,'enough flight height avoids ground strike');
element('#type').value='fast';chaseSetup();frames(800);assert.equal(read('hp'),0);assert.equal(read('end'),true);
element('#reset').onclick();assert.equal(read('chaseAttack.phase'),'idle');assert.equal(read('attackMarker.visible'),false);assert.equal(read('hp'),100);

element('#mood').value='spray';element('#type').value='fast';
function spraySetup(){element('#reset').onclick();read('human.position.set(roach.position.x+.5,0,roach.position.z)');frames(1);}
spraySetup();assert.equal(read('sprayAttack.phase'),'windup');assert.equal(read('sprayWarning.visible'),true);
assert.match(element('#threat').textContent,/噴藥預警/);frames(49);assert.equal(read('hp'),100);
frames(1);assert.equal(read('sprayAttack.phase'),'cloud');assert.equal(read('hp'),90);assert.equal(read('sprayCloud.visible'),true);
frames(62);assert.equal(read('hp'),90,'no repeated per-frame damage');frames(1);assert.equal(read('hp'),80);
element('#pause').onclick();const frozenSpray=read('JSON.stringify(sprayAttack)');frames(100);assert.equal(read('JSON.stringify(sprayAttack)'),frozenSpray);assert.equal(read('hp'),80);
element('#pause').onclick();frames(125);assert.equal(read('sprayAttack.phase'),'recovery');assert.equal(read('sprayCloud.visible'),false);assert.equal(read('hp'),70);
frames(100);assert.equal(read('hp'),70,'expired cloud cannot damage');
spraySetup();const sprayTarget=read('JSON.stringify(sprayAttack.target)');read('roach.position.z-=2');frames(100);
assert.equal(read('hp'),100);assert.equal(read('JSON.stringify(sprayAttack.target)'),sprayTarget,'cloud stays at warned position');
element('#type').value='fly';spraySetup();element('#act').onclick();frames(51);assert.ok(read('roach.position.y')>.5);assert.equal(read('hp'),90,'low flight is vulnerable');
for(let i=0;i<6;i++)element('#rise').onclick();frames(50);assert.ok(read('roach.position.y')>1.5);
frames(100);assert.equal(read('hp'),90,'above cloud height avoids later ticks');
element('#role').value='human';element('#role').onchange();frames(2);assert.equal(read('sprayCloud.visible'),false);assert.equal(read('sprayWarning.visible'),false);assert.equal(read('sprayAttack.phase'),'idle');
element('#role').value='roach';element('#type').value='fast';spraySetup();frames(2000);assert.equal(read('hp'),0);assert.equal(read('end'),true);
element('#reset').onclick();assert.equal(read('hp'),100);assert.equal(read('sprayAttack.phase'),'idle');assert.equal(read('sprayCloud.visible'),false);
console.log('PASS: spray warning, damage interval, cloud expiry, pause, evade, low/high flight, role reset and loss.');
console.log('PASS: chase warning marker, stopped windup, pause freeze, single damage, evade, flight height, loss and reset.');
console.log('PASS: large food strength gate, carrying slowdown, ground-only pickup, drop/re-pickup, pause, all archetype collection/delivery victory, level 3, reset and role gating.');
console.log('PASS: entire page startup/module exports, rendered loop, arrow movement, role/type handlers, takeoff/altitude/landing, camera drag, joystick/background reset, pause freeze/resume/background gating, human action and full restart. DOM/Three substitutes; no real WebGL rendering or mobile device test.');
