// Runs the gameplay assertions without a browser. Does not validate rendering or real touch.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map();
function element(id){if(!elements.has(id))elements.set(id,{style:{},textContent:'',dataset:{action:id.includes('fly')?'fly':''},handlers:{},addEventListener(k,f){this.handlers[k]=f},getBoundingClientRect(){return {left:0,top:0,width:112,height:112}},setPointerCapture(){},getContext(){return new Proxy({},{get:()=>()=>{},set:()=>true})}});return elements.get(id)}
const document={querySelector:element,querySelectorAll:()=>[],addEventListener(){}};
const context=vm.createContext({document,requestAnimationFrame(){},addEventListener(){},console,Math,Set});
const source=fs.readFileSync(__dirname+'/index.html','utf8').split('<script>')[1].split('</script>')[0];
vm.runInContext(source,context);
const page={evaluate:async fn=>{const value=vm.runInContext('('+fn.toString()+')()',context);return value===undefined?undefined:JSON.parse(JSON.stringify(value))}};
let tests=fs.readFileSync(__dirname+'/test.cjs','utf8');tests=tests.slice(tests.indexOf("await page.evaluate(()=>{reset();state.npcs=[];keys.add"),tests.indexOf('await page.setViewportSize'));
(async()=>{await eval('(async()=>{'+tests+'})()');
await page.evaluate(()=>{reset();state.npcs=[];state.p.x=400;state.p.y=350;state.hazards=[{x:400,y:350,left:.01,tick:0}];update(.04)});assert.equal(await page.evaluate(()=>state.p.hp),100,'expired poison must not deal damage');
await page.evaluate(()=>{reset();state.npcs=[];keys.add('d');keys.add('s');update(.1)});assert.ok(Math.abs(await page.evaluate(()=>Math.hypot(state.p.x-90,state.p.y-450))-15)<1e-8,'diagonal movement is normalized');
await page.evaluate(()=>{reset();state.npcs=[];state.p.x=850;state.p.y=110;action('interact');action('fly')});assert.equal(await page.evaluate(()=>state.p.carry),null);assert.equal(await page.evaluate(()=>state.p.fly),0);
await page.evaluate(()=>{reset();state.npcs=[];pause();keys.add('d');update(.1);action('interact')});assert.equal(await page.evaluate(()=>state.p.x),90);assert.equal(await page.evaluate(()=>state.time),0);
await page.evaluate(()=>{reset();state.npcs=[];state.p.x=400;state.p.y=350;hurt(100);action('fly');keys.add('d');update(.1)});assert.equal(await page.evaluate(()=>state.end),'lose');assert.equal(await page.evaluate(()=>state.p.x),400);
assert.equal(await page.evaluate(()=>visible({x:200,y:200},{x:450,y:200})),false,'cabinets block vision');
await page.evaluate(()=>{reset();state.npcs=[];state.p.level=3;action('fly');update(2.01);action('fly')});assert.equal(await page.evaluate(()=>state.p.fly),0,'flight cannot retrigger during cooldown');
await page.evaluate(()=>{reset();state.npcs=[];state.p.level=3;state.p.x=400;state.p.y=350;action('fly');state.hazards=[{x:400,y:350,left:3,tick:0}];update(.04)});assert.equal(await page.evaluate(()=>state.p.hp),88,'flight does not prevent poison damage');
await page.evaluate(()=>{reset();state.npcs=[];state.p.level=3;state.p.x=400;state.p.y=350;action('fly');state.npcs=[{x:420,y:350,type:'chase',spawn:{x:420,y:350},t:0,mode:'react',lost:0,cool:0,attack:{x:400,y:350,left:.01}}];update(.04)});assert.equal(await page.evaluate(()=>state.p.hp),100,'flight avoids ground attack');
await page.evaluate(()=>{reset();state.npcs=[];axis={x:1,y:0};clearInput()});assert.equal(await page.evaluate(()=>axis.x),0);
const stick=element('#stick');stick.handlers.pointerdown({pointerId:1,clientX:100,clientY:56});assert.ok(await page.evaluate(()=>axis.x>0));stick.handlers.pointerdown({pointerId:2,clientX:10,clientY:56});assert.ok(await page.evaluate(()=>axis.x>0),'second finger cannot hijack joystick');stick.handlers.pointercancel({pointerId:2});assert.ok(await page.evaluate(()=>axis.x>0),'unrelated finger cannot cancel joystick');stick.handlers.pointercancel({pointerId:1});assert.equal(await page.evaluate(()=>axis.x),0);
await page.evaluate(()=>{state.p.hp=0;state.delivered=3;state.hazards=[{}];state.end='lose';reset()});assert.deepEqual(await page.evaluate(()=>[state.p.hp,state.delivered,state.hazards.length,state.end]),[100,0,0,null]);
console.log('PASS: core gameplay plus expired poison, diagonal speed, ability locks, pause, defeat freeze, occlusion, flight cooldown/immunity, joystick ownership/cancel, complete restart. Browser rendering and device touch NOT tested.');})().catch(e=>{console.error(e);process.exit(1)});
